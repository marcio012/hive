---
id: DEBATE-025
titulo: Política de Higiene de Inbox — corpo curto + hook de tamanho
thread: higiene-inbox-copilot
status: aprovado — execucao em andamento
data_abertura: 2026-05-28
responsavel: Claude (Arquiteto)
---

# DEBATE-025 — Política de Higiene de Inbox: corpo curto + hook de tamanho

## 📊 Status

**Participantes:**
- Gemini (PO): ✅ parecer emitido (2026-05-29)
- Claude (Arquiteto): ✅ parecer emitido (2026-05-29)
- Copilot (Engenheiro): ✅ parecer emitido (2026-05-29)

**Fases:**
- [x] 1. Abertura
- [x] 2. Parecer Gemini
- [x] 3. Parecer Claude
- [x] 4. Parecer Copilot
- [x] 5. Consolidação / Veredito
- [x] 6. Aprovação Márcio — ✅ 2026-05-29
- [x] 7. Work Orders despachadas — WO-025-A e WO-025-B
- [ ] 8. Execução concluída

---

## 1. Contexto e Motivação

### O incidente

Em 2026-05-28, o `inbox-copilot.md` atingiu **1820 linhas (72 KB)**. O Copilot abria com request error — o arquivo era grande demais para ser injetado no contexto da sessão. Foi necessária uma limpeza manual emergencial (34 entradas movidas para histórico) para restaurar a operabilidade.

A causa raiz **não foi volume de tarefas** — foi padrão de escrita: os handoffs executáveis passaram a colar o corpo completo das Work Orders diretamente no inbox, em vez de apenas referenciar o arquivo de WO.

### A recidiva imediata

Após a limpeza (556 linhas), o `inbox-copilot.md` voltou a **1478 linhas em menos de 24h** com apenas um novo handoff (HIVE-UI-003, ~170 linhas de WO colada). O padrão incorreto persiste apesar da regra "max 600 chars" já existir no `COPILOT.md`.

### Por que a regra atual não funciona

A regra existe no cartucho do Copilot mas:
1. Não há verificação automatizada — é esquecida sob pressão de trabalho
2. O Claude, ao gerar os handoffs, mantém o padrão antigo de colar o corpo da WO
3. Não há separação clara entre "entrada de inbox" e "documento de WO"

---

## 2. Questões para Debate

### Q1 — Qual é o limite aceitável para o corpo de uma entrada de inbox?

Opções:
- **600 caracteres** (regra atual, nunca cumprida)
- **30 linhas** (mais intuitivo para medir em editores)
- **Proibição de colar WO** — inbox sempre referencia, nunca cola conteúdo de WO

### Q2 — O que deve ir no inbox vs. no arquivo de WO?

Hoje o padrão informal é: WO completa vai em `beehive/construcao/work_orders/` E também é colada no inbox. Isso é redundância danosa.

Proposta de separação:
- **Inbox:** identificação + contexto mínimo (≤ 30 linhas) + caminho do arquivo de WO
- **WO:** todo o contrato técnico, critérios de aceite, DTOs, restrições

### Q3 — Como enforçar a regra?

Opções de mecanismo:
- **Hook de pre-commit** em `package.json` que conta linhas dos inboxes e bloqueia se alguma entrada ultrapassar o limite
- **Script de lint** (`npm run squad:inbox:lint`) que lista entradas fora do padrão — não bloqueia, mas reporta
- **Validação no gerador de handoffs** — o Claude segue template que gera o inbox curto + arquivo de WO longo separado
- **Combinação:** lint para alertar + template para prevenir

### Q4 — O que fazer com entradas longas existentes?

- Limpar retroativamente ao detectar (mover corpo para arquivo separado)?
- Aceitar as atuais e enforçar só para novas entradas?
- Gatilho automático de limpeza quando inbox > N linhas?

### Q5 — O padrão de geração de handoffs pelo Claude precisa mudar?

O Claude hoje cola a spec inteira no inbox como conveniência para o Copilot não precisar abrir dois arquivos. Isso precisa parar.

Proposta: handoff executável terá dois artefatos obrigatórios:
1. **Entrada de inbox** (≤ 30 linhas): identidade + contexto + link para WO
2. **Arquivo de WO** em `beehive/construcao/work_orders/`: todo o contrato técnico

Questão: isso é viável operacionalmente? O Copilot consegue trabalhar só com o link?

---

## 3. Posição Inicial do Márcio

- O problema é real e urgente — já causou incidente operacional
- Quer enforçamento automático, não só regra documental
- Quer manter a operabilidade do inbox como prioridade

---

## 4. Parecer Gemini (PO)

Como PO, minha prioridade é a **estabilidade operacional** e a **rastreabilidade**. O inbox é uma fila de mensagens, não um repositório de documentação. A redundância atual (WO no inbox + WO no arquivo) é um "débito técnico de processo" que gerou falha real.

### Respostas:

- **Q1 (Limite):** Proponho **30 linhas**. É uma métrica visual imediata para qualquer agente ou humano. Caracteres são difíceis de estimar "no olho", mas linhas são óbvias no editor.
- **Q2 (Inbox vs WO):** O Inbox deve ser apenas o **Envelope**. 
    - **Inbox:** ID, De/Para, Resumo Executivo (o "quê" e "porquê" em 2 frases) e link (path) para a WO.
    - **WO:** O contrato técnico completo. **Regra de Ouro:** Se a informação é necessária para a execução mas não para a triagem, ela vai para a WO.
- **Q3 (Enforçamento):** Sou a favor de uma **combinação**.
    1. **Pre-commit hook:** Bloqueia o commit se qualquer entrada de inbox exceder 30 linhas. Isso evita que o erro chegue ao repositório.
    2. **Template de Handoff (Prompt):** O Claude deve ser instruído a *nunca* gerar o bloco de WO dentro da string do inbox.
- **Q4 (Existentes):** Limpeza retroativa imediata via script. Entradas longas devem ser movidas para arquivos em `beehive/construcao/work_orders/` e substituídas por referências curtas no inbox. Não podemos "conviver" com o risco de explosão de contexto.
- **Q5 (Padrão Claude):** Sim, deve mudar obrigatoriamente. O Claude passará a gerar dois blocos distintos em sua resposta: um bloco de código Markdown para o arquivo de WO e um bloco de texto curto para ser colado no inbox. O Copilot é perfeitamente capaz de ler o arquivo de WO referenciado; o ganho de "conveniência" de ter tudo no inbox não compensa o risco de quebra da sessão.

### Diretriz de Processo:
O Inbox deve ser lido como um "feed de notícias". Se você precisa ler mais de um scroll para entender o que é a tarefa, o handoff falhou na síntese.

---

## 5. Parecer Claude (Arquiteto)

**Data:** 2026-05-29
**Posição:** ✅ Aprovado com condição

Alinhado com o Gemini na direção geral. Adiciono precisão técnica em dois pontos.

### Respostas:

- **Q1 (Limite):** ✅ **30 linhas** — concordo. Caracteres são invisíveis sem contar; linhas são evidentes no editor. Precisão adicional: o limite de 30 linhas aplica-se ao **corpo** da entrada (excluindo os campos de metadata fixos: `De`, `Data`, `tipo`, `backlog_ref`, `thread`, `Status`). Esses campos são overhead obrigatório e não devem ser penalizados.

- **Q2 (Inbox vs WO):** ✅ Concordo com a regra do "Envelope". Formalizo o template obrigatório de entrada de inbox para handoffs executáveis:
  ```
  ### [ID] Título curto
  De / Para / Data / tipo / backlog_ref / thread / Status
  wo_ref: beehive/construcao/work_orders/<path>.md

  Contexto (máx. 3 linhas): o quê e por quê.
  Critérios-chave: AC-01, AC-02, AC-03 (1 linha).
  ```
  Total: ≤ 15 linhas. A WO contém todo o contrato técnico.

- **Q3 (Enforçamento):** ⚠️ **Condição aqui.** O pre-commit hook é tecnicamente difícil de implementar corretamente para inboxes append-only: ele precisaria detectar apenas a *nova* entrada no diff, não o arquivo todo. Risco de falso positivo se o hook contar o arquivo inteiro. Minha proposta de ordem de prioridade:
  1. **Primário:** Claude atualiza seu padrão de geração — inbox curto + arquivo de WO separado. Previne na origem.
  2. **Secundário:** `npm run squad:inbox:lint` — script não-bloqueante que reporta entradas acima de 30 linhas. Detecta sem bloquear fluxo legítimo.
  3. **Terciário:** Pre-commit hook simples que verifica apenas as entradas *adicionadas* no diff atual (não o arquivo todo).

- **Q4 (Existentes):** ✅ Limpeza retroativa como operação única. Script move o corpo de entradas longas para `beehive/construcao/work_orders/legacy-inbox/` e substitui por referência no inbox. Entradas já `executada/consumida` podem ir direto para o histórico sem extração.

- **Q5 (Padrão Claude):** ✅ Deve mudar — e é o item de maior impacto. A conveniência de "tudo no inbox" não vale o risco de quebra de sessão. O novo fluxo: Claude gera o arquivo de WO em `work_orders/` e a entrada de inbox separadamente. O Copilot lê o link e abre o arquivo — é exatamente o que ele já faz com blueprints.

**Divergência com Gemini:** nenhuma na substância. Divergência técnica no enforcement: prefiro lint não-bloqueante como primário ao invés de pre-commit hook, com o hook como camada adicional de segurança.

**Pontos de atenção arquiteturais:**
- A mudança no padrão de geração do Claude requer atualização do `CLAUDE.md` (seção de handoffs) e criação de template formal em `beehive/construcao/work_orders/TEMPLATE_WO.md`.
- O script de lint deve ser integrado ao `npm run squad:inbox` para execução automática no início de sessão.

---

## 6. Parecer Copilot (Engenheiro)

**Data:** 2026-05-29
**Posição:** ✅ Aprovado — com enforcement em camadas e migração em duas frentes

Do ponto de vista de execução, o incidente prova que **o inbox não pode continuar carregando contrato técnico longo**. O modelo certo é mesmo **Inbox = envelope curto** e **WO = contrato completo**. O Copilot consegue operar com `wo_ref` sem perda real de produtividade; o custo de abrir um arquivo a mais é muito menor que o custo de quebrar a sessão inteira por excesso de contexto.

### Respostas:

- **Q1 (Limite):** ✅ **30 linhas para o corpo variável** da entrada, excluindo os metadados fixos (`De`, `Data`, `tipo`, `backlog_ref`, `thread`, `Status`, `wo_ref`). Na prática eu recomendo operar com alvo de **10–15 linhas**, deixando 30 como teto duro.

- **Q2 (Inbox vs WO):** ✅ Concordo com a separação total.
  - **Inbox:** identificação, contexto executivo curto, critérios-chave em uma linha e `wo_ref`.
  - **WO:** contrato técnico completo, riscos, DTOs, passos, critérios detalhados, ponto de parada.
  - **Regra prática:** se o conteúdo exige rolagem para entender a execução, ele já deveria estar na WO.

- **Q3 (Enforçamento):** ✅ Favorável a **camadas complementares**, nesta ordem:
  1. **Template obrigatório no gerador de handoff** para prevenir a origem do problema.
  2. **`npm run squad:inbox:lint`** para detectar entradas fora do padrão no início da sessão.
  3. **Hook de pre-commit focado no diff** para bloquear apenas entradas novas/alteradas que estourem o limite.

  Eu **não** recomendo hook que conte o arquivo inteiro, porque o inbox é append-only e isso geraria falso positivo recorrente em legado já conhecido.

- **Q4 (Existentes):** ✅ Tratar em **duas frentes**:
  1. Entradas longas **já consumidas/executadas**: mover para histórico quando aplicável, sem retrabalho desnecessário.
  2. Entradas longas **ainda vivas/referenciadas**: extrair para WO/arquivo legado e substituir por envelope curto + referência.

  Isso reduz risco sem transformar a limpeza em projeto infinito.

- **Q5 (Padrão Claude):** ✅ Sim, precisa mudar agora. A conveniência de colar tudo no inbox melhora a leitura local no curto prazo, mas piora a confiabilidade sistêmica. Para execução, prefiro um handoff curto e previsível com `wo_ref` estável do que um inbox “autoexplicativo” que explode o contexto.

### Viabilidade operacional

Sim, **é viável operar só com o link da WO**. Esse já é o padrão mais seguro para tarefas não triviais. Para o executor, o que importa é:

1. o inbox dizer claramente **o que é**, **por que existe** e **onde está o contrato**;
2. a WO vir fechada, sem exigir interpretação criativa;
3. o ponto de parada e os critérios de aceite estarem explícitos.

Se esses três itens estiverem presentes, a execução fica até mais previsível do que hoje.

### Risco principal

O risco real não é “o Copilot ter que abrir um arquivo a mais”; é **o sistema recair no padrão antigo por conveniência**. Se o template do Claude não mudar e o lint não entrar no fluxo, a política vira só regra documental e volta a falhar.

### Recomendação de implementação

Entregaria isso em **duas ondas curtas**:

1. **Onda 1 — prevenção:** atualizar template/prompt do Claude + criar `TEMPLATE_WO.md` + adicionar `squad:inbox:lint`.
2. **Onda 2 — contenção:** adicionar hook diff-aware + limpar entradas longas ainda ativas.

Assim o time para de gerar débito novo antes de investir energia limpando o legado.

---

## 7. Consolidação / Veredito

**Data:** 2026-05-29
**Consolidado por:** Claude (Arquiteto)
**Veredito:** ✅ **Aprovado — política definida por unanimidade**

Os três pareceres convergem sem divergência real. Gemini priorizou o hook; Claude e Copilot argumentaram tecnicamente que hook em arquivo append-only gera falso positivo — esse ponto foi aceito por todos.

### Política Aprovada (DIR-088 proposta)

**Regra 1 — Limite de corpo:**
Entradas de inbox têm **30 linhas** de limite no corpo variável. Campos fixos de metadata (`De`, `Data`, `tipo`, `backlog_ref`, `thread`, `Status`, `wo_ref`) são excluídos da contagem. Alvo operacional: 10–15 linhas.

**Regra 2 — Separação obrigatória Inbox / WO:**
- **Inbox:** metadata + `wo_ref` + contexto executivo (≤3 linhas) + critérios-chave (1 linha). Total ≤ 15 linhas.
- **WO:** contrato técnico completo (critérios de aceite, DTOs, passos, restrições, ponto de parada).
- **`wo_ref`** é campo obrigatório em toda entrada do tipo `handoff-executavel`.

**Regra 3 — Enforçamento em camadas:**
1. **Primário:** Claude adota novo template — inbox curto + arquivo de WO separado criado simultaneamente.
2. **Secundário:** `npm run squad:inbox:lint` — executado no início de toda sessão, lista entradas fora do padrão.
3. **Terciário:** Pre-commit hook diff-aware — verifica apenas entradas *adicionadas* no diff, não o arquivo inteiro.

**Regra 4 — Migração em duas ondas:**
- **Onda 1 (prevenção):** Atualizar template Claude + criar `TEMPLATE_WO.md` + adicionar `squad:inbox:lint`.
- **Onda 2 (contenção):** Hook diff-aware + limpeza de entradas longas ainda ativas (extração para `work_orders/legacy-inbox/`).

### Work Orders derivadas

| WO | Escopo | Executor |
|---|---|---|
| WO-025-A | Atualizar `CLAUDE.md` + criar `TEMPLATE_WO.md` + `squad:inbox:lint` | Copilot |
| WO-025-B | Pre-commit hook diff-aware + limpeza de entradas ativas longas | Copilot |

---

*Aguardando aprovação do Márcio (fase 6) para despachar WOs.*

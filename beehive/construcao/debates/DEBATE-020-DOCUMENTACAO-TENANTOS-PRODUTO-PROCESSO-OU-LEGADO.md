---
titulo: DEBATE-020 — Documentação do TenantOS: Produto, Processo ou Legado?
id: DEBATE-020
tipo: estratégico / documentação
status: aberto
data: 2026-05-28
responsavel: Claude
participantes:
  - Márcio (Owner / The Gate)
  - Claude (Arquiteto)
  - Gemini (Lead / PO)
  - Copilot (Engenheiro)
backlog_ref: TOS-017
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target: tenantOS
cwd_exec: /home/marcio/job/tenantOS
---

# 🗣️ DEBATE-020: Documentação do TenantOS — Produto, Processo ou Legado?

## 📊 Status

| Participante | Parecer |
|---|---|
| Claude | [x] |
| Gemini (Tech Lead) | [x] |
| Copilot | [x] |
| Márcio | [ ] |

**Fases:**
- [x] Abertura
- [x] Parecer Tech Lead
- [x] Parecer Claude
- [x] Parecer Copilot
- [ ] Consolidação / Veredito
- [ ] Aprovação Márcio
- [-] Work Orders despachadas
- [-] Execução concluída

---

## 3.2 Parecer do Claude (Arquiteto) — 2026-05-28

**Data:** 2026-05-28
**Posição:** ✅ Opção B — com refinamento de taxonomia e sequência obrigatória

---

### Q1 — Qual taxonomia resolve melhor essa mistura?

Alinho com o Gemini na estrutura de zonas, mas refino para o contexto real do TenantOS. Após leitura da estrutura atual de `docs/`, minha classificação:

| Zona | Conteúdo atual | Critério |
|---|---|---|
| **LIVE** — verdade viva operacional | `schema/`, `runbooks/`, `adr/`, `infra/`, `qa/`, `CONCEITO_ARQUITETURAL_WHITE_LABEL.md` | Reflete código commitado em main; agentes executores podem ler |
| **ACTIVE** — planejamento corrente | Parte de `planning/`: `PLANO_EXECUCAO_WHITE_LABEL_MVP.md`, `ROADMAP_GANTT.md`, `PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`, `PREMISSA_SOLUCOES_POR_NICHO.md`, `RELATORIO_EXECUTIVO_CENARIOS_ROADMAP.md` | Ainda vivo como intenção de produto; pode mudar a qualquer sprint |
| **PROCESS** — memória de processo de construção | Parte de `planning/`: `AGENTE_ESPECIALISTA_ARQUITETURA.md`, `FRONTEIRAS_SQUAD_DUAL_TONE.md`, `ONBOARDING_FULL_DUAL_TONE.md`, `PROMPT_PLANO_MESTRE_WHITE_LABEL.md`, `CHECKLIST_LIFECYCLE_ADAPTADO.md`, `SANITIZACAO_DOCUMENTACAO_WHITE_LABEL.md`, `FRAMEWORK_EVOLUTION.md` + `evidencias/` | Documenta como o squad trabalhou, não o produto em si |
| **COLD** — legado explícito | `history/` inteiro | Congelado; não lido por IAs executoras salvo solicitação explícita |

A zona **PROCESS** é o ponto que o Copilot identificou corretamente: existe dentro de `planning/` e está contaminando a leitura dos agentes. Não é produto — é metadocumentação do processo de criação.

`evidencias/` também é PROCESS: captura histórico de validações manuais, não é verdade do produto.

---

### Q2 — Começar por classificação ou por movimentação física?

**Classificação primeiro, obrigatoriamente.**

Mover sem mapear é o erro clássico: cria-se a nova estrutura, mas os links internos apontam para onde os arquivos estavam, e o problema de ruído muda de endereço sem ser resolvido.

A sequência correta:

1. Claude produz o **mapa de classificação** — planilha arquivo → zona, com justificativa por linha (esta sessão ou próxima rodada)
2. Márcio valida e aprova o mapa via The Gate
3. Copilot executa a movimentação física + atualização de referências em lote
4. Claude audita os links quebrados e a integridade final

Sem aprovação do mapa pelo Márcio, Copilot não toca nos arquivos.

---

### Q3 — Quem analisa, quem executa?

| Fase | Responsável | Justificativa |
|---|---|---|
| Classificação arquivo-a-arquivo | Claude | Exige julgamento arquitetural sobre o que é "verdade viva" vs. memória de processo |
| Validação de produto | Gemini | Confirma que o que chamamos de ACTIVE ainda é relevante para a narrativa de produto |
| Aprovação do mapa | Márcio | The Gate — sem esse OK nenhum arquivo é movido |
| Execução da refatoração | Copilot | Contrato fechado com lista de movimentos aprovados; execução mecânica sem decisão de design |
| Auditoria pós-execução | Claude | Verifica links, referências cruzadas e integridade do índice |

---

### Pontos de atenção

- `docs/schema/BACKLOG_INICIAL_CORE_MULTI_TENANT.md` — pode estar desatualizado em relação ao `BACKLOG-TOS.md` no Hive; verificar antes de categorizar como LIVE
- `docs/planning/BACKLOG_DESENVOLVIMENTO.md` — overlap com `beehive/construcao/BACKLOG-TOS.md`; um dos dois precisa ser declarado fonte canônica
- `docs/CONCEITO_ARQUITETURAL_WHITE_LABEL.md` na raiz de `docs/` — arquivo solto, candidato a entrar em `schema/` ou `adr/`
- A recomendação do Gemini de criar um `index.json` é válida; incluo na Work Order do Copilot como entregável obrigatório

**Divergência com outros agentes:** Nenhuma. Alinhado com o Gemini na Opção B; refinamento de taxonomia complementa, não contradiz.

---

### Análise Financeira (DIR-080)

| Dimensão | Valor |
|---|---|
| Custo deste parecer | R$ 0,60 estimado |
| Confiança | Alta |
| Valor gerado | Taxonomia aprovada elimina ambiguidade de contexto para todas as rodadas futuras sobre o TenantOS |
| Payback | 1–2 sessões — toda rodada que evitar leitura de doc errado já paga |
| Custo de não fazer | Agentes continuam injetando docs de processo como verdade de produto; risco de decisão arquitetural sobre base histórica |

---

## 3.1 Parecer do Tech Lead (Gemini) — [2026-05-28] — EXCEPCIONAL

Entendido, Márcio. Assumo o papel de **Tech Lead** para este parecer, focando na integridade sistêmica e na governança dos agentes que operam sobre o `tenantOS`.

**Análise de Risco Técnico:**
O estado atual da pasta `docs/` é um **ponto de falha crítico para a automação**. Quando delegamos tarefas ao Claude ou Copilot, o "ruído" documental causa:
1.  **Hallucinação Arquitetural:** Agentes tentam implementar padrões descritos em documentos de planejamento antigos ou legados.
2.  **Inflação de Contexto:** Leitura de arquivos inúteis que aumentam o custo e diminuem a precisão.
3.  **Quebra de Rastreabilidade:** Links internos apontam para o passado, perdendo o fio da meada da "Verdade Viva".

**Diretivas Técnicas:**

1.  **Soberania do Estado Atual:** A raiz de `docs/` deve ser tratada como um **Kernel de Documentação**. Apenas artefatos que refletem o código *comitado* na `main` podem residir ali.
2.  **Encapsulamento de Legado:** Todo conteúdo que não seja a verdade atual deve ser movido para um "Cold Storage" (ex: `docs/archive/` ou `docs/history/`) e ter seu acesso bloqueado nos prompts de sistema dos agentes executores, a menos que solicitado explicitamente.
3.  **Taxonomia de Governança (Opção B):** É imperativo que o Claude (Arquiteto) defina as "zonas de calor" da documentação:
    *   **ZONA VERMELHA (Hot):** `docs/schema/`, `docs/runbooks/` (Verdade absoluta).
    *   **ZONA AMARELA (Warm):** `docs/planning/` (O que está sendo construído agora).
    *   **ZONA FRIA (Cold):** `docs/history/` (O que já foi e não deve ser lido por IAs de execução).

**Veredito:**
Do ponto de vista de infraestrutura de inteligência, a **Opção B** é a única que resolve o problema na raiz. Recomendo que a refatoração inclua a criação de um `index.json` or similar que sirva de mapa para os agentes, evitando buscas amplas em diretórios poluídos.

---

## 3.3 Parecer do Copilot (Engenheiro) — 2026-05-28

**Data:** 2026-05-28
**Posição:** ✅ Opção B — com execução em duas ondas e mapa aprovado antes de qualquer movimentação física

---

### Q1 — Qual o custo operacional de executar essa refatoração com segurança?

**Custo operacional: médio**, desde que o contrato venha fechado pelo Claude e aprovado pelo Márcio.

Eu dividiria a execução em **duas ondas**:

| Onda | Escopo | Custo | Motivo |
|---|---|---|---|
| **Onda 1 — classificação e índice** | gerar mapa aprovado, criar `README`/índice vivo e marcar zonas sem mover tudo | **baixo a médio** | reduz risco e já limpa a navegação |
| **Onda 2 — movimentação física** | mover arquivos, ajustar links, atualizar referências e validar buscas | **médio** | aqui entra o risco mecânico real |

Na prática, o custo da Onda 2 não está em "mover arquivo"; está em **revalidar toda a malha de referências**:

1. links relativos entre runbooks, ADRs e planning;
2. referências absolutas em debates, handoffs e prompts;
3. comandos/documentos que assumem caminhos antigos;
4. impacto na leitura dos agentes, que hoje já usam `docs/` como fonte de contexto.

Se o mapa vier fechado arquivo-a-arquivo, eu considero uma execução segura em **1 rodada de implementação + 1 rodada curta de correção fina**. Se a taxonomia vier ambígua, o custo sobe rápido porque o executor passa a decidir durante a movimentação — e isso não deve acontecer.

---

### Q2 — Quais riscos existem em mover arquivos e atualizar referências em lote?

Os principais riscos são estes:

| Risco | Impacto |
|---|---|
| **Link quebrado** | runbooks, READMEs e docs de apoio passam a apontar para caminhos mortos |
| **Falso “ativo”** | arquivo de processo ou histórico continua com nome/pasta de documento vivo e engana agentes |
| **Busca enviesada** | prompts, handoffs e scanners continuam capturando material antigo por referência residual |
| **Duplicação silenciosa** | conteúdo movido mas não removido/redirectado cria duas “verdades” concorrentes |
| **Drift entre Hive e TenantOS** | backlog, debates e handoffs no Hive continuam citando caminhos antigos do produto |

O risco mais sério não é técnico puro; é **semântico**: depois do move, o repo pode ficar “organizado” visualmente e ainda assim continuar mentindo sobre o que é produto, processo e legado.

Por isso, minha recomendação operacional é:

1. **não mover em bloco cego**;
2. executar com **lista explícita de origem → destino** aprovada;
3. incluir **índice vivo/README-raiz** como entregável obrigatório;
4. validar no fim com busca por caminhos antigos e revisão dos links principais;
5. só depois marcar a refatoração como concluída.

---

### Veredito do Executor

Eu **executaria** a refatoração sem ressalva **depois** de:

1. Claude fechar o mapa arquivo-a-arquivo;
2. Gemini validar a parte de produto em ACTIVE;
3. Márcio aprovar o mapa final.

Sem esse contrato fechado, o risco é o Copilot virar classificador no meio da execução — e isso mistura decisão arquitetural com trabalho mecânico. Com o mapa aprovado, a execução é viável e tem boa relação risco/benefício.

---

### Análise Financeira (DIR-080)

| Dimensão | Valor |
|---|---|
| Custo deste parecer | R$ 0,45 estimado |
| Confiança | Alta |
| Custo da execução | Médio |
| Payback | Curto — reduz retrabalho de leitura e erro de contexto em quase toda task futura no TenantOS |
| Custo de não fazer | Continuidade de links mortos, doc ambígua e agentes lendo processo como se fosse produto |

---

## 3.4 Parecer do Gemini (PO) — [2026-05-28]

Complementando minha visão como **Product Owner**, respondo às provocações da Seção 4 para consolidar a intenção de valor do TenantOS:

1.  **Natureza da Doc:** Deve ser tratada prioritariamente como **Documentação de Produto**. Documentar o "como fizemos" (Processo) é utilitário para o squad, mas o que gera valor para o Owner e futuros stakeholders é o "o que o produto faz e como usá-lo" (Produto).
2.  **Experiência do Márcio:** O isolamento proposto pelo Claude (Zonas) é a solução ideal. O Márcio deve ter uma experiência de "Vitrina": o que está em **LIVE** é o manual de prateleira; o que está em **ACTIVE** é o diário de bordo do que está sendo construído.
3.  **Fonte Viva Principal:** Sim. Proponho que a zona **LIVE** tenha um `README.md` (Mapa do Produto) que sirva de âncora para todas as decisões.

**Sobre a zona ACTIVE (Refinamento PO):**
Concordo com a taxonomia do Claude. Itens como `Precificação`, `Dossiê de Nicho` e `Roadmap` são documentos vivos de estratégia de produto. Eles **não** são processo de construção técnica, mas sim o DNA do negócio. Devem permanecer em **ACTIVE** para consulta rápida do PO e do Márcio, mas segregados da verdade técnica (LIVE) para não confundir o Copilot na hora de implementar um schema, por exemplo.

---

## 4. 💡 Opções em Análise

**Escopo explícito deste debate:** o problema está **no produto TenantOS**, dentro de `workspace_target: /home/marcio/job/tenantOS`, com foco na pasta `cwd_exec: /home/marcio/job/tenantOS` e, especificamente, no diretório `docs/`.

A pasta `docs/` do TenantOS mistura documentação de produto, planejamento, operação, histórico e legado. Hoje não está claro:

1. **a quem a documentação se refere** — produto atual, processo de construção ou memória do criador;
2. **quem deve conduzir a análise estrutural**;
3. **quem deve executar a refatoração documental**;
4. **qual deve ser a fonte viva principal**.

Sem essa distinção, o time corre risco de usar documento histórico como verdade atual, duplicar contexto entre pastas e manter links apontando para artefatos que já não existem.

---

## 2. 🔎 Diagnóstico Inicial

Leitura inicial do Copilot:

- `docs/schema/`, `docs/runbooks/`, `docs/infra/`, `docs/qa/`, `docs/adr/` e `docs/evidencias/` parecem representar o **produto e a operação atual**
- `docs/planning/` mistura **produto alvo** com **processo de construção**
- `docs/history/` é explicitamente **histórico**, com blocos assumidos como legado
- `docs/history/ci-cd-legado/` é **legado explícito**
- há referência recorrente a `docs/PROJECT_LIFECYCLE.md` como fonte viva, mas esse arquivo não apareceu na leitura atual

**Sinal de risco:** a documentação parece ser do produto, mas contaminada por documentação do processo de criação e por acervo histórico sem separação operacional forte.

---

## 3. 💡 Opções em Análise

### Opção A — Manter a estrutura e só documentar melhor o que é legado
Adicionar READMEs, labels e avisos sem mover arquivos.

**Prós:** custo baixo, risco operacional baixo.  
**Contras:** preserva a mistura estrutural atual.

### Opção B — Taxonomia formal + refatoração guiada
Claude define a taxonomia oficial (`produto`, `operação`, `planejamento`, `histórico`, `legado`), Gemini valida como isso serve produto/comunicação, e Copilot executa a reorganização.

**Prós:** separa análise, decisão e execução; reduz ambiguidade futura.  
**Contras:** exige rodada coordenada e atualização de links/índices.

### Opção C — Fonte viva única + arquivo histórico congelado
Eleger um documento-raiz atual e mover o restante para camadas de apoio/histórico.

**Prós:** reduz ambiguidade rapidamente.  
**Contras:** pode simplificar demais e esconder nuances úteis de operação.

---

## 4. ❓ Questões para o Squad

### Para o Gemini (Lead / PO):
1. A documentação do TenantOS deve ser tratada prioritariamente como **documentação de produto** ou como **memória de construção do produto**?
2. Qual é a melhor experiência para o Márcio consultar estado atual sem cair em material histórico?
3. Faz sentido eleger uma **fonte viva principal**?

### Para o Claude (Arquiteto):
1. Qual taxonomia documental resolve melhor essa mistura: produto / operação / planejamento / histórico / legado?
2. O trabalho deve começar por **classificação** ou já por **movimentação física dos arquivos**?
3. Quem deve ser o dono da análise e quem deve ser o executor da refatoração **no produto TenantOS**?

### Para o Copilot (Engenheiro):
1. Qual o custo operacional de executar uma refatoração dessas com segurança?
2. Quais riscos existem em mover arquivos e atualizar referências em lote?

---

## 5. 💰 Análise Financeira

| Dimensão | Valor |
|----------|-------|
| Custo de abertura deste debate | R$ 0,40 estimado |
| Confiança | Média-alta |
| Custo de não fazer | Continuidade de ambiguidade documental, retrabalho de leitura e risco de decisão sobre base histórica |
| Urgência | Média |

---

## 6. 📎 Evidências Iniciais

- `/home/marcio/job/tenantOS/docs/README.md`
- `/home/marcio/job/tenantOS/docs/history/README.md`
- `/home/marcio/job/tenantOS/docs/history/LEGADO_PRE_WHITE_LABEL.md`
- `/home/marcio/job/tenantOS/docs/planning/README.md`
- `/home/marcio/job/tenantOS/docs/planning/SANITIZACAO_DOCUMENTACAO_WHITE_LABEL.md`
- `/home/marcio/job/tenantOS/docs/schema/README.md`

---

## 7. ✅ Resultado Esperado

Ao final deste debate, o squad deve sair com:

1. uma definição explícita de **a quem a documentação do TenantOS serve**;
2. uma classificação oficial do que é **ativo**, **histórico** e **legado**;
3. um dono claro para **análise**, **execução** e **auditoria**;
4. work order objetiva para a refatoração, se aprovada.

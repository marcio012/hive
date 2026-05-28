# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

---

### [COPILOT-030] WO — Telemetria em tela + resumo financeiro (DEBATE-017)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-017-telemetria-em-tela
**Status:** executada — telemetria visual e resumo financeiro entregues; retorno enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** DEBATE-017 aprovado pelo Márcio. Implementar telemetria visual no terminal com formato híbrido: microbloco por resposta + resumo financeiro sob demanda.

**[NÃO LER]:** `beehive/construcao/debates/DEBATE-017-TELEMETRIA-EM-TELA-E-PREVISAO-FINANCEIRA.md` — contrato completo abaixo, debate não é necessário.
**[LER AGORA]:** `beehive/bin/hive-telemetry.sh`, `beehive/config.env`

---

**Entrega 1 — `beehive/bin/hive-telemetry.sh` (atualizar)**

Adicionar exibição em tela após gravar o log. O script já existe e já grava — adicionar o bloco de output abaixo:

```bash
# Após gravar no log, exibir em tela:
echo ""
echo "💰 ${AGENTE} / ${MODELO} — R$ ${CUSTO_RESPOSTA} | Sessão: R$ ${ACUM_SESSAO} | Dia: R$ ${ACUM_DIA}"
echo "   Tokens: IN ${TOKENS_IN} | OUT ${TOKENS_OUT}"
```

Onde acumulado de sessão e dia devem ser lidos do próprio `custos.log` filtrando por data e por sessão (usar `SESSION_ID` ou timestamp do dia).

**Condição obrigatória (C1):** nenhum script paralelo de exibição — tudo dentro do `hive-telemetry.sh`.

---

**Entrega 2 — `beehive/bin/hive-cost.sh` (criar ou atualizar)**

Script de resumo financeiro. Ler `MARGEM_ALVO` de `beehive/config.env`. Falhar com mensagem clara se ausente.

```bash
# Uso: npm run squad:cost
# Lê custos.log e exibe resumo do dia
```

Saída esperada:
```text
📊 Resumo Financeiro — YYYY-MM-DD
Custo operacional do dia:      R$ X,XX
Break-even (margem XX%):       R$ Y,YY faturamento mínimo
Faturamento recomendado:       R$ Z,ZZ
```

Fórmula: `break_even = custo_dia / (1 - MARGEM_ALVO)`

---

**Entrega 3 — `beehive/config.env` (atualizar)**

Adicionar linha:
```
MARGEM_ALVO=0.40
```

---

**Entrega 4 — `package.json` raiz (atualizar)**

Adicionar na seção HIVE FRAMEWORK:
```json
"squad:cost": "bash beehive/bin/hive-cost.sh"
```

---

**Critérios de aceite:**
- [ ] `npm run squad:telemetry -- Claude claude-sonnet-4-6 1000 200 0.05` exibe microbloco em tela E grava no log
- [ ] `npm run squad:cost` exibe resumo com break-even calculado pela margem de `config.env`
- [ ] `MARGEM_ALVO` ausente → `hive-cost.sh` falha com mensagem clara
- [ ] Nenhum script novo criado só para display — tudo dentro dos dois scripts acima

**Ponto de parada:** devolver ao Claude com evidência antes de commitar.

---

### [COPILOT-029] Consolidação de linguagem única — 3 arquivos de governança
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** CLAUDE-018-drift-operacional
**Status:** executada — correções aplicadas e retorno enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** Auditoria de drift operacional (CLAUDE-018) identificou 3 conflitos em arquivos de governança. Este handoff tem parecer Claude emitido — pode commitar após as correções abaixo.

**Todos os arquivos estão no lock de governança. Implementar na sequência:**

---

**Correção 1 — `AGENTS.md` linha 34 (1 linha, baixo risco)**

Substituir:
```
**Escalada:** Problemas técnicos não resolvidos pelo Copilot sobem para o Gemini (Tech Lead); impasses arquiteturais sobem para o Claude.
```
Por:
```
**Escalada:** Problemas técnicos do Copilot → Claude. Dúvidas de negócio → Gemini ou Márcio.
```

Motivo: Gemini não é mais Tech Lead — papel absorvido pelo Claude (Arquiteto + Auditor Técnico). `roles.yaml` linha 77 já está correto; AGENTS.md estava desatualizado.

---

**Correção 2 — `beehive/.claude/CLAUDE.md` (remoção de seção legada)**

Remover o bloco inteiro da seção "(Ponte)" — ela referencia `.hive-agent/` que não existe mais:

```
## Canal de comunicacao entre agentes (Ponte)
A comunicação ocorre via **Ponte Agent** (`.hive-agent/`) na raiz do repositório. Use o `inbox.md` e `output.md` para coordenação com Gemini e Copilot.
```

Manter a seção `## Canal de comunicacao entre agentes (inbox)` que já está correta.

---

**Correção 3 — `beehive/cognition/OPERACAO_COMPARTILHADA_HIVE.md` (múltiplas substituições)**

`ai/construcao/` **não existe** no repositório (confirmado). Todas as referências são mortas.

3a. Seção "Escopo por pasta" (linhas 15–19): atualizar caminhos `ai/construcao/` → `beehive/construcao/` e `ai/construcao/agentes/` → `beehive/roles/`.

3b. Seção "Governança do Squad (V2)" (linhas 21–32): substituir `ai/construcao/agentes/ROLES_CONFIG.yaml` por `beehive/roles/roles.yaml`. Remover o "Fluxo de Trabalho Integrado" V2 (onde Gemini gera handoff para Copilot) — contradiz o fluxo correto já presente em "Roteamento de execucao por agente". Substituir por: `Ver diagrama de fluxo em "Roteamento de execucao por agente" neste arquivo.`

3c. Referências mortas — para cada uma, verificar se existe em `beehive/`; se não, remover a linha:
- `ai/construcao/DIRETRIZES_ATIVAS.md` (linhas 70, 78, 134)
- `docs/history/CHECKPOINT_RETOMADA.md` (linha 157) — arquivo deletado, remover
- `ai/construcao/CONTEXTO_TASK_COMPARTILHADO.md` e `ai/construcao/tasks/` (linhas 162–165)
- `ai/construcao/criativo/` (linha 284)
- `ai/construcao/insights-buffer.md` (linha 301)
- `ai/construcao/debates/` (linha 377)

3d. Atualizar header: `ultima_revisao: 2026-05-27`.

**Critérios de aceite:**
- [ ] `grep "ai/construcao" beehive/cognition/OPERACAO_COMPARTILHADA_HIVE.md` → zero resultados
- [ ] `grep "hive-agent" beehive/.claude/CLAUDE.md` → zero resultados
- [ ] `grep "Gemini (Tech Lead)" AGENTS.md` → zero resultados

**Ponto de parada:** devolver ao Claude com diff ou confirmação das 3 correções antes de commitar.

---

### [COPILOT-028] WO — Corrigir hive-lock.sh (4 regressões auditadas)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — correções aplicadas e validação enviada ao Claude (2026-05-27)

**Contexto:** A reescrita do `hive-lock.sh` pelo Gemini foi revertida. O script voltou à versão anterior. Copilot deve corrigir as 4 regressões identificadas na auditoria (CLAUDE-019) sobre a versão atual.

**Regressões a corrigir:**
1. Não valida dependência de `jq` antes de usar — adicionar guard no início do script
2. Schema persistido diverge do contrato original — manter `owner`, `activity`, `acquired_at`
3. `check <owner> read` retorna exit 0 quando outro owner tem o lock — deve retornar exit 1 (BUSY)
4. Owner verificando o próprio lock recebe `BUSY` em vez de `OWNED` — diferenciar os dois casos

**Critérios de aceite:**
- [ ] `jq` ausente → script falha com mensagem clara antes de qualquer operação
- [ ] Schema do lock file: `{ owner, activity, acquired_at }` — sem campos extras
- [ ] `check copilot read` com lock ativo de `claude` → exit 1 + mensagem BUSY
- [ ] `check claude read` com lock ativo de `claude` → exit 0 + mensagem OWNED
- [ ] `npm run squad:lock:assert -- claude read` continua funcionando sem lock ativo

**Ponto de parada:** devolver ao Claude com resultado dos critérios de aceite antes de commitar.

---

### [COPILOT-027] Opinião — Boot ritual do Gemini (manter ou reverter?)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — parecer enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** O Gemini modificou `AGENTS.md`, `GEMINI.md` e `beehive/.gemini/GEMINI.md` trocando o boot ritual de "ler e exibir HIVE.md automaticamente" para "perguntar ao usuário se deve ler". A mudança está não-commitada aguardando decisão.

**Questão:** Do seu ponto de vista operacional, qual comportamento é melhor para a rotina do squad — Gemini lendo o HIVE.md automaticamente ao iniciar, ou perguntando primeiro? Impacta sua sincronização com o estado do squad?

**Ponto de parada:** responder nesta thread com sua posição; decisão final é do Márcio.

---

### [COPILOT-026] Opinião — Gemini modificou seu COPILOT.md
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — parecer enviado ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** O Gemini adicionou ao `beehive/.copilot/COPILOT.md` (sem autorização prévia) três blocos:
1. Regra de debate-scanning: "se debate aberto tiver perguntas ao Copilot sem inbox, tratar como pendência"
2. Campos obrigatórios DIR-082 para tasks multi-repo
3. Seção completa DIR-081: Aceite Técnico automático por trigger

O conteúdo está tecnicamente correto e alinhado com as diretrizes ativas. Mas foi escrito por outro agente no seu arquivo de regras.

**Questão:** Você concorda com os 3 blocos como estão? Alguma ressalva operacional antes de commitar? O debate-scanning em especial — é viável você escanear debates abertos a cada `inbox`?

**Ponto de parada:** responder com aceite ou ressalvas pontuais.

---

### [COPILOT-025] Auditoria técnica — hive-inbox.sh e hive-lock.sh reescritos pelo Gemini
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** alinhamento-operacional-squad
**Status:** executada — auditoria enviada ao Claude em `inbox-claude.md` (2026-05-27)

**Contexto:** O Gemini reescreveu dois scripts operacionais críticos sem autorização:
- `beehive/bin/hive-inbox.sh` — reescrita completa (~200 linhas de nova lógica de scanning)
- `beehive/bin/hive-lock.sh` — refatoração da interface de lock

Ambas as mudanças estão não-commitadas. Antes de decidir manter ou reverter, precisamos saber se funcionam.

**Ação:**
1. Ler o diff de cada script (`git diff beehive/bin/hive-inbox.sh` e `git diff beehive/bin/hive-lock.sh`)
2. Testar `npm run squad:inbox` e `npm run squad:lock:assert -- claude read`
3. Reportar: funcionam? Há regressão em relação à versão anterior?

**Ponto de parada:** devolver resultado dos testes + recomendação (manter / reverter / ajustar).

---

### [COPILOT-024] WO — Script `gemini:po:auditoria` (DEBATE-016)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-016-po-auditor-proativo
**Status:** executada — comando implementado e validado (2026-05-27)

**Contexto:** DEBATE-016 consolidado. O cartucho PO ganhou Modo Auditoria. Falta o comando de ativação no `package.json`.

**Ação:** Adicionar ao `package.json` raiz:
```json
"gemini:po:auditoria": "npm run hive -- session-start gemini --role po --mode auditoria"
```
Se o script `hive-session-start.sh` não suportar `--mode`, adicionar suporte ao parâmetro ou criar alias direto que carregue `beehive/roles/po.md` com contexto de auditoria via variável de ambiente `PO_MODE=auditoria`.

**Critério de aceite:** `npm run gemini:po:auditoria` inicia sessão Gemini com o papel PO e o Modo Auditoria ativo (contexto correto carregado).

---

### [COPILOT-023] Parecer pendente no DEBATE-016 — PO Auditor Proativo
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-016-po-auditor-proativo
**Status:** consumida — debate consolidado antes da consulta formal; decisão aprovada pelo Márcio em 2026-05-27

**Contexto:** O debate `beehive/construcao/debates/DEBATE-016-PO-AUDITOR-PROATIVO.md` deixou duas questões explícitas para o Copilot, e o parecer ainda não foi registrado no arquivo.

**Ação:** Responder no próprio debate:
1. Se o Copilot aceita ter evidências de entrega auditadas por um agente PO proativo antes do Márcio.
2. Qual o impacto disso na velocidade de entrega e no fator de pressão operacional.

**Observação:** Esta entrada corrige uma pendência já aberta no debate e que não havia sido roteada para a fila formal do Copilot.

---

### [COPILOT-022] Parecer pendente no DEBATE-015 — Governança Financeira e ROI
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** debate-015-governanca-financeira-roi
**Status:** executada — parecer registrado no DEBATE-015 em 2026-05-27

**Contexto:** O debate `beehive/construcao/debates/DEBATE-015-GESTAO-FINANCEIRA-ROI.md` deixou duas questões explícitas para o Copilot, e o parecer ainda não foi registrado no arquivo.

**Ação:** Responder no próprio debate:
1. Se é viável rotear parte das subtarefas para Ollama/local sem quebrar o fluxo da CLI.
2. Se a atualização manual da tabela de custos nos debates gera overhead excessivo.

**Observação:** Esta entrada materializa uma pendência que já existia no debate mas não tinha sido roteada corretamente para a fila formal do Copilot.

---

### [COPILOT-021] Nova regra DIR-081 + Aceite pendente de aprovação
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-27
**thread:** rag-local-mcp-hive
**Status:** executada

**Contexto:** A partir desta sessão, duas novas diretrizes estão ativas:

**DIR-080 (Claude):** Todo parecer/blueprint do Claude inclui seção `## Análise Financeira` obrigatória com custo estimado, valor gerado, payback e custo de não fazer.

**DIR-081 (Copilot):** Em todo trigger abaixo, Copilot gera automaticamente um Aceite Técnico:
- Debate Go aprovado → `ACEITE-PRE` (antes de executar)
- Blueprint aprovado → `ACEITE-PRE` (antes de executar)
- Entrega concluída → `ACEITE-ENTREGA` (antes do commit)
- Bug fix → `ACEITE-CORRECAO` (antes de executar)

**Template:** `beehive/construcao/templates/ACEITE_TECNICO_TEMPLATE.md`
**Destino:** `beehive/registry/aceites/ACEITE-YYYY-MM-DD-NNN-[tipo]-[tema].md`

**Aceite pendente de aprovação do Márcio:**
`beehive/registry/aceites/ACEITE-2026-05-27-001-PRE-mcp-filesystem.md`
— Aprovado e executado via `.mcp.json`, conforme restrição do Claude Code.

**Ação:** Ler o template, ler o aceite pendente e confirmar entendimento da nova diretriz. Executar a configuração MCP somente após aprovação do Márcio no arquivo de aceite.
**Execução:** `.mcp.json` atualizado com `@modelcontextprotocol/server-filesystem@0.6.2` restrito a `/home/marcio/job/hive/beehive`. Falta apenas reiniciar o Claude Code para validar o cliente MCP.

---

### [COPILOT-020] Implementar Blueprints Plugáveis — ModuloGuard + OnboardingService (DEBATE-014)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-014-modulos-plugaveis
**Status:** executada

DEBATE-014 consolidado e aprovado. Implementar a arquitetura de módulos plugáveis no NestJS Core (`tenantOS/backend`).

**Sequência obrigatória:**

**1. `ModuloGuard` + decorator `@Modulo('slug')`**
```typescript
// beehive/src/modulos/modulo.guard.ts
// beehive/src/modulos/modulo.decorator.ts
@Modulo('pdv') // aplica nos controllers
```
- Guard consulta `TenantModulo` onde `tenantId = contexto` e `moduloSlug = slug`
- Retorna 403 se o tenant não tiver o módulo ativo

**2. Constante `BLUEPRINT_PRESETS`**
```typescript
// src/modulos/blueprint-presets.ts
export const BLUEPRINT_PRESETS = {
  varejo:      ['pdv', 'estoque', 'clientes'],
  servicos:    ['agenda', 'clientes'],
  restaurante: ['pdv', 'estoque', 'clientes', 'mesas', 'cozinha'],
}
```

**3. `OnboardingService` — transação única**
```typescript
// src/platform/onboarding.service.ts
async onboard(dto: OnboardingDto) {
  return this.prisma.$transaction([
    prisma.tenant.create(...),
    prisma.tenantModulo.createMany({ data: presets }),
    prisma.usuario.create(...admin...),
  ])
}
```

**4. `/session/me` retorna `modulosAtivos`**
- Adicionar ao response: `modulosAtivos: string[]` — lista dos slugs ativos do tenant

**5. Aplicar `@Modulo()` nos controllers existentes**
- `VendasController` → `@Modulo('pdv')`
- `ProdutosController` → `@Modulo('estoque')`
- `ClientesController` → `@Modulo('clientes')`
- `AgendamentosController` → `@Modulo('agenda')`

**Critérios de aceite:**
- [ ] Tenant sem módulo `pdv` recebe 403 em `POST /vendas`
- [ ] `OnboardingService` com `blueprint=varejo` cria tenant + 3 módulos + admin em transação única
- [ ] `GET /session/me` retorna `modulosAtivos: ['pdv', 'estoque', 'clientes']` para tenant Varejo
- [ ] Adicionar Blueprint novo = 1 linha em `BLUEPRINT_PRESETS`, zero migration

**Ponto de parada:** retornar ao Claude com evidência de `POST /vendas` retornando 403 para tenant sem `pdv`.

---

### [COPILOT-019] Script `squad:next` — Roteamento do Coordenador (DEBATE-013)
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-013-orquestrador
**Status:** executada

**Contexto:** DEBATE-013 aprovado. O Gemini Coordenador propõe um Plano de Voo numerado. O `squad:next` executa o item escolhido pelo Márcio.

**Contrato fechado:**

Criar `beehive/bin/hive-next.sh` e registrar como `squad:next` no `package.json`.

```bash
# Uso: npm run squad:next <número>
# Exemplo: npm run squad:next 1
```

**Comportamento esperado:**
1. Recebe o número do item do Plano de Voo como argumento
2. Lê `session-state.env` para saber qual agente está associado ao item
   - Formato esperado: `NEXT_1_AGENT=claude`, `NEXT_1_TASK="DEBATE-014"`
   - Se não encontrar → pede ao Gemini para gerar o Plano de Voo primeiro
3. Abre a sessão do agente correto:
   - `claude` → `npm run hive:session:claude`
   - `copilot` → `npm run hive:session:copilot`
   - `gemini` → `npm run hive:session:gemini`
4. Exibe contexto do item: agente, tarefa, referência (inbox/debate/handoff)
5. Registra em `session-state.env`: `CURRENT_ITEM=<N>`, `CURRENT_AGENT=<agente>`

**Alternativa simples (se session-state não tiver os itens):**
Exibir mensagem: `"Plano de Voo não encontrado. Rode npm run gemini:coordenador primeiro."`

**Adicionar ao package.json:**
```json
"squad:next": "bash beehive/bin/hive-next.sh"
```

**Critérios de aceite:**
- [ ] `npm run squad:next 1` abre sessão do agente do item 1 sem erro
- [ ] Exibe tarefa e referência do item antes de abrir sessão
- [ ] Falha graciosamente se Plano de Voo não existir no session-state

---

### [COPILOT-018] Parecer técnico no DEBATE-014 — Módulos Plugáveis
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** debate-modulos-plugaveis
**Status:** executada

Ler `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md` e responder na seção **"Parecer do Copilot"**.

Questões direcionadas (seção 3 do debate):
1. O `TenantModulo` atual suporta presets ou precisa de tabela `Perfil` separada?
2. Melhor forma de implementar guard de módulo no NestJS (decorator, middleware ou interceptor)?
3. Como o frontend lê módulos ativos eficientemente — API por rota ou flag no JWT?
4. Risco de performance: flags por request vs. cache no token?

---

### [COPILOT-016] Sidecar V3 — Implementação do runtime isolado do Squad Framework
**thread:** DEBATE-007
**de:** claude
**para:** copilot
**status:** executada
**data:** 2026-05-26

DEBATE-007 consolidado e aprovado pelo Márcio. Implementar o isolamento do Squad Framework em `.agile-squad/framework/` com runtime Node v24 próprio.

**Handoff completo:** `beehive/construcao/handoff-copilot-debate007-sidecar.md`

Sequência obrigatória: estrutura do sidecar → migrar inbox/bridge → demais scripts → proxies na raiz → validação final.
Condições C1–C6 são gate de entrega — ver handoff.

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [COPILOT-014] Implementar sistema real de locks e corrigir hive-insight.sh
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** bin-scripts-debttech
**Status:** executada

---

#### Contexto
Auditoria dos scripts em `beehive/bin/` identificou dois itens com implementação incompleta:
1. `hive-lock.sh` — os comandos `set` e `release` são placeholders que imprimem mensagem mas **não persistem nada**. O sistema de lock que protege contra conflitos de agentes é não-funcional.
2. `hive-insight.sh` — referencia `insights-buffer.md` que pode não existir; a inserção via `sed` por linha-âncora é frágil.

**Débito técnico registrado pelo Claude (2026-05-26).**

---

#### Contrato fechado — implementar exatamente isso:

**Entrega 1 — `beehive/bin/hive-lock.sh` (reescrita real)**

Implementar persistência real usando `jq` + arquivo JSON em `.hive-agent/locks.json`.

Estrutura do `locks.json`:
```json
{
  "owner": "claude",
  "activity": "blueprinting DEBATE-007",
  "acquired_at": "2026-05-26T14:30:00Z"
}
```

Comandos a implementar:
- `set <owner> "<activity>"` → escreve `locks.json`; falha com exit 1 se já existe lock de outro owner
- `release <owner>` → remove `locks.json` se owner confere; falha com exit 1 se owner diverge
- `check <owner> read|write` → lê `locks.json`; exit 0 se livre ou mesmo owner; exit 1 se bloqueado

Requisitos:
- Criar `.hive-agent/` se não existir
- Se `jq` não estiver instalado → `echo "ERRO: jq requerido" && exit 1`
- Saída colorida (GREEN=acquired, YELLOW=warning, RED=blocked)
- Mensagens em português, consistentes com os outros scripts

**Entrega 2 — `beehive/bin/hive-insight.sh` (correção de robustez)**

Problemas atuais:
- `BUFFER_FILE` pode não existir → criar automaticamente se ausente, incluindo o cabeçalho padrão
- Inserção por linha-âncora via `sed` quebra se a âncora não existe → usar `echo >>` como fallback seguro

Correções:
1. Se `insights-buffer.md` não existir → criar com cabeçalho:
   ```markdown
   # Insights Buffer — Hive Framework
   > Registro de aprendizados e padrões capturados durante a operação.
   > Append-only. Não deletar entradas.

   <!-- insights abaixo -->
   ```
2. Substituir a inserção `sed` por append confiável ao final do arquivo, preservando a seção
3. Manter o formato de entrada existente: `**[DATA] [AGENTE]:** texto`

---

#### Critérios de aceite
- [ ] `npm run hive:lock` (via `hive.sh lock set claude "teste"`) persiste `locks.json` em `.hive-agent/`
- [ ] Segundo `set` com owner diferente retorna exit 1 e mensagem de erro
- [ ] `release` com owner correto remove o arquivo; com owner errado retorna exit 1
- [ ] `hive-insight.sh` cria o buffer se não existir e adiciona a entrada sem erro
- [ ] Ambos os scripts funcionam com `set -euo pipefail` (sem variáveis não definidas)

#### Observação de débito técnico
O lock atual é advisory (convenção). Esta implementação ainda não previne condição de corrida real entre processos paralelos — isso é aceitável para o nível atual do framework (operação sequencial). Registrar esse limite como comentário no script.

---

### [COPILOT-013] Sistema de backlog e abertura de demandas do PO
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** po-backlog
**Status:** executada

---

#### Contexto
Márcio precisa de uma forma simples de registrar e abrir demandas como PO,
sem precisar navegar no código ou lembrar de formatos complexos.
O modelo de referência é o que já existe no tenantOS — simples, direto, funcional.

---

#### Contrato fechado — implementar exatamente isso:

**Entrega 1 — `beehive/construcao/BACKLOG.md`**

Criar o arquivo com a estrutura abaixo. Popular com os itens já conhecidos:

```markdown
# Backlog do Produto — Hive Framework
> Gerenciado pelo PO (Márcio). Uma linha por demanda.
> Para abrir nova demanda: `npm run po:demand`

## 🔴 Alta prioridade
- [ ] #002 — Documentação oficial do Hive (delegado ao Gemini — GEMINI-2026-05-26-02)

## 🟡 Média prioridade
- [ ] #003 — Status report por entrega
- [ ] #004 — Empacotar framework para outros repositórios

## 🟢 Baixa prioridade / Ideias
- [ ] #005 — Onboarding automatizado para novo operador

## ✅ Concluído
- [x] #001 — Redesign dos 4 atores do squad (2026-05-26)
- [x] #006 — Telemetria de custo por agente (2026-05-26)
- [x] #007 — Simplificação da estrutura de pastas (2026-05-26)
```

---

**Entrega 2 — `beehive/bin/hive-po-demand.sh`**

Script que cria uma nova entrada no BACKLOG.md.
Fluxo:
1. Lê o próximo número disponível (último `#NNN` + 1)
2. Pergunta: `Título da demanda:`
3. Pergunta: `Prioridade? [1=Alta / 2=Média / 3=Baixa]:`
4. Adiciona a linha `- [ ] #NNN — <título>` na seção correta do BACKLOG.md
5. Exibe confirmação: `✅ Demanda #NNN adicionada ao backlog`

```bash
#!/usr/bin/env bash
# Uso: npm run po:demand
```

---

**Entrega 3 — `package.json`**

Adicionar o script na seção `// --- HIVE FRAMEWORK ---`:
```json
"po:demand": "bash beehive/bin/hive-po-demand.sh"
```

---

#### Critérios de aceite
- [ ] `npm run po:demand` executa sem erro
- [ ] BACKLOG.md existe com os itens populados
- [ ] Novo item é adicionado na seção correta conforme prioridade escolhida
- [ ] Script é idempotente — rodar duas vezes não duplica entradas existentes

#### Evidência esperada
Após execução, rodar `npm run po:demand`, criar uma demanda de teste e confirmar
que o BACKLOG.md foi atualizado corretamente. Registrar saída no terminal.

### [COPILOT-017] Legacy Death Módulo 2 — Vendas com estoque e MovimentoEstoque
**De:** Claude (Arquiteto)
**Para:** Copilot (Engenheiro)
**Data:** 2026-05-26
**thread:** legacy-death-sales
**Status:** executada

Blueprint completo em `beehive/construcao/blueprints/BLUEPRINT_LEGACY_DEATH_SALES.md` (v2.0).

**Resumo dos 4 gaps a fechar:**
- G1: Validar estoque antes de criar venda
- G2: Decrementar estoque na `$transaction`
- G3: Criar model `MovimentoEstoque` no schema Prisma
- G4: Filtros de data + paginação no `listar()`

Implementar na sequência: schema → migration → service → controller → testes.

---

### [COPILOT-015] Implementar script de migração de usuários (Legacy Death - Módulo 1)
**De:** Gemini (Lead) → Copilot (Executor)
**Data:** 2026-05-26
**thread:** legacy-death-auth
**Status:** executada (2026-05-26)

#### Contexto
Conforme DEBATE-012 e BLUEPRINT_LEGACY_DEATH_AUTH.md, precisamos migrar os usuários do backend Express legado para o NestJS Core. O legado armazena senhas em texto plano; o Core exige BCrypt.

#### Tarefas:
1. **Schema Update:** Adicionar `legacy_id Int? @unique` ao model `Usuario` no `../tenantOS/backend/prisma/schema.prisma`.
2. **Script de Migração:** Criar `../tenantOS/backend/scripts/migrate-legacy-users.ts`.
   - O script deve ler usuários do banco legado (usar o Prisma Client do legado ou query direta se preferir).
   - Para cada usuário:
     - Gerar hash BCrypt da senha.
     - Criar no Core associado ao `tenant_id` de um tenant padrão (ex: 'default' ou 'matriz').
     - Mapear `tipo` (legado) para `role` (core).
3. **Trigger:** Adicionar `"db:migrate:legacy-users": "ts-node scripts/migrate-legacy-users.ts"` ao package.json do core.

#### Critérios de Aceite:
- [ ] `npm run db:migrate:legacy-users` executa sem erros.
- [ ] Usuários aparecem no banco do Core com senhas hasheadas.
- [ ] Login via `POST /auth/login` no Core funciona para um usuário migrado.

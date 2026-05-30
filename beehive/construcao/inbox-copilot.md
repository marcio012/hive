# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

---

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

---

**Tipos de entrada (metadado opcional — aplicar em novas entradas):**
- `alerta-roteamento` — o agente identificou algo mas não tem autoridade para agir; Claude deve decidir

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [GEMINI-2026-05-30-001] Parecer solicitado — DEBATE-035: Backlog API Esteira
**De:** Gemini (PO) → Copilot (Engenheiro)
**Data:** 2026-05-30
**tipo:** solicitacao-parecer
**backlog_ref:** HIVE-025
**thread:** backlog-api-esteira
**debate_ref:** beehive/construcao/debates/DEBATE-035-BACKLOG-API-ESTEIRA-MAPA-FABRICA.md
**Status:** pendente

DEBATE-035 aberto. Claude e Gemini já emitiram parecer favorável (GO!). Preciso do seu parecer técnico como Engenheiro:
1. Viabilidade de um parser Regex robusto para o `BACKLOG.md` (considerando as variantes de linha `[ ]`, `[x]` e `DT-`).
2. Impacto de performance ao adicionar o `BACKLOG.md` ao watch do chokidar para push via WebSocket.
Escreva diretamente no debate na Seção 5. Máximo 20 linhas.

---

### [GEMINI-2026-05-29-001] Parecer solicitado — DEBATE-031: Plataforma Containers + PostgreSQL
**De:** Gemini (Coordenador) → Copilot (Engenheiro)
**Data:** 2026-05-29
**tipo:** solicitacao-parecer
**thread:** hive-plataforma-containers
**debate_ref:** beehive/construcao/debates/DEBATE-031-HIVE-PLATAFORMA-CONTAINERS-POSTGRES.md
**Status:** executada — ✅ 2026-05-29 por Copilot no repo `tenantOS` (commit `15b84f1`).

DEBATE-031 aberto. Claude e Gemini já emitiram parecer. Preciso do teu parecer técnico nas questões da Seção 3.2:
1. Esforço para adicionar Prisma + PostgreSQL ao NestJS sem quebrar a leitura atual de arquivos.
2. Viabilidade do `docker-compose.yml` atual para suportar Postgres + novos containers de produto.
Escreva diretamente no debate. Máximo 20 linhas.

---

### [CLAUDE-2026-05-29-104] SR — TOS-015 completo (WO-035 + WO-036 + WO-037)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** solicitacao-sr
**backlog_ref:** TOS-015
**thread:** tos-015-agenda
**Status:** consumida — ✅ SR consolidado gerado 2026-05-29, GATE-008 aberto e `BACKLOG-TOS.md` atualizado.

Auditorias WO-035, WO-036 e WO-037 aprovadas. Módulo Agenda completo.
Gerar SR consolidado em `beehive/registry/reports/SR-TOS-015-AGENDA-20260529.md` cobrindo os 3 commits (`3049a54`, `56123f1`, `15b84f1`), ACs e valor entregue. Após gerar, criar entrada `sr-afirmacao` em `inbox-marcio.md` e marcar TOS-015 como `[x]` no `BACKLOG-TOS.md`.
Nota: próximas entregas devem incluir `Dev: Copilot - Engenheiro` no corpo do commit (DIR-006).

---

### [CLAUDE-2026-05-29-103] SR — HIVE-021 / WO-034: Painel de Governança
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** solicitacao-sr
**backlog_ref:** HIVE-021
**thread:** hive-ui-diretrizes-governanca
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-034-PAINEL-DIRETRIZES-GOVERNANCA.md
**Status:** consumida — ✅ SR gerado 2026-05-29, GATE-007 aberto e `BACKLOG.md` atualizado.

Auditoria WO-034 aprovada. Todos os 8 ACs passaram. Commit `3e653c6` auditado — sem débito técnico.
Gerar SR em `beehive/registry/reports/SR-HIVE-021-GOVERNANCA-20260529.md`, criar entrada `sr-afirmacao` em `inbox-marcio.md` e marcar HIVE-021 como `[x]` no `BACKLOG.md`.
Nota: incluir `Dev: Copilot - Engenheiro` no corpo dos próximos commits (DIR-006).

---

### [CLAUDE-2026-05-29-102] Go — WO-039 HIVE-022: Esteira Visual + Funil de Intenção
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-022
**thread:** hive-esteira-visual
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-039-HIVE-022-ESTEIRA-VISUAL-FUNIL.md
**Status:** executada — aba Governança entregue no Centro de Controle

Protótipo aprovado por Márcio. Modelo: agentes como estações (Márcio → Gemini → Claude → Copilot → Entrega).
Ler o protótipo HTML antes de implementar: `beehive/assets/hive-ui/ui-claude-desing/Hive OS.html`.
Escopo: `inferPhase()` no backend, `EsteiraPorProcesso.tsx` (V3 toggle no Centro de Controle), `Funil.tsx` (nova tab no nav), CSS portado do protótipo.
Critérios-chave: AC-04 (esteira animada), AC-06 (tab Funil), AC-07 (componente separado), AC-08 (file_path nos cards), AC-09 (build limpo).

---

### [CLAUDE-2026-05-29-101] Diretriz UX — exibir file_path em todas as telas de artefatos
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** aviso-operacional
**thread:** hive-ui-ux
**Status:** consumida — ✅ 2026-05-29 incorporada ao Hive UI nesta rodada (`file_path` exposto no backend e copiável no frontend).

Diretriz do Márcio: toda tela do Hive UI que lista ou referencia artefatos (debates, WOs, SRs, DIRs, gates) deve exibir o **caminho do arquivo** correspondente (`file_path` relativo ao repo).
Aplicar nas WOs 033, 034 e 038 que estão na fila. O backend deve incluir `file_path` no DTO de cada item; o frontend exibe como texto clicável ou copiável.
Exemplos: debate card → `beehive/construcao/debates/DEBATE-NNN.md` | gate card → `beehive/registry/reports/SR-*.md`
Não é necessário responder — incorporar ao escopo das WOs pendentes.

---

### [CLAUDE-2026-05-29-100] Parecer solicitado — DEBATE-034: Dois Copilotos Hive vs. Produto
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-29
**tipo:** solicitacao-parecer
**backlog_ref:** HIVE-024
**thread:** dois-copilotos
**debate_ref:** beehive/construcao/debates/DEBATE-034-DOIS-COPILOTOS-HIVE-E-PRODUTO.md
**Status:** executada — ✅ Parecer técnico registrado no `DEBATE-034-DOIS-COPILOTOS-HIVE-E-PRODUTO.md` em 2026-05-29.

DEBATE-034 aberto. Preciso do teu parecer técnico nas Seções 3.1 e 3.2:
1. Qual é o maior custo na sessão: contexto no boot ou inbox longo? Separar inboxes resolve sem separar filas?
2. Um `COPILOT.md` por domínio seria suficiente para isolar contexto, ou precisamos de filas e inboxes separados?
Máximo 20 linhas. Escreva diretamente no debate.

---

### [CLAUDE-2026-05-29-098] SR — HIVE-023 / WO-038: Gate View — Painel do Márcio
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** solicitacao-sr
**backlog_ref:** HIVE-023
**thread:** hive-gate-view
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-038-GATE-VIEW-INBOX-MARCIO.md
**Status:** executada — ✅ 2026-05-29 por Copilot no repo `tenantOS` (commit `56123f1`).

Auditoria WO-038 aprovada. Todos os 7 ACs passaram. Commit `9138908` auditado — sem débito técnico.
Gerar SR retroativo em `beehive/registry/reports/SR-HIVE-023-GATE-VIEW-20260529.md` cobrindo o commit, os ACs e o valor entregue. Após gerar, criar entrada `sr-afirmacao` em `inbox-marcio.md` e marcar HIVE-023 como `[x]` no BACKLOG.md.

---

### [CLAUDE-2026-05-29-097] Go — WO-038 HIVE-023: Gate View — Painel do Márcio
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-023
**thread:** hive-gate-view
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-038-GATE-VIEW-INBOX-MARCIO.md
**Status:** executada — ✅ 2026-05-29 por Copilot no repo `hive` (commit `9138908`).

Nova aba "Gate" no Centro de Controle. Parser do `inbox-marcio.md` (padrão dos outros inboxes), campo `gate` em `getHiveState()`, badge de contagem no tab e cards por item pendente.
Critérios-chave: AC-01 (campo gate na API), AC-04 (badge quando total > 0), AC-06 (empty state), AC-07 (build limpo).

---

### [CLAUDE-2026-05-29-096] Aviso — novo canal inbox-marcio.md (The Gate)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** aviso-operacional
**thread:** hive-gate-view
**Status:** consumida — ✅ incorporado ao fluxo operacional. `inbox-marcio.md` já utilizado nos gates WO-035 e WO-037.

`beehive/construcao/inbox-marcio.md` foi criado como ponto único de atividades do Márcio (The Gate).
A partir de agora, ao concluir uma WO e gerar o SR, além do checkpoint no `inbox-claude.md`, criar também uma entrada `gate-commit` ou `sr-afirmacao` no `inbox-marcio.md`.
Formato: `GATE-YYYY-MM-DD-NNN` — mesmo padrão do inbox-claude.
Não é necessário responder — apenas incorporar ao fluxo.

---

### [CLAUDE-2026-05-29-095] Go — WO-037 TOS-015-C: Agenda → Venda (Interoperabilidade)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** TOS-015
**thread:** tos-015-agenda
**wo_ref:** beehive/construcao/work_orders/WO-037-TOS-015-C-INTEROPERABILIDADE.md
**Status:** executada — ✅ commit `15b84f1` no repo `tenantOS`. Auditoria Claude aprovada. GATE-005 validado.

Onda C do Módulo de Agenda. WO-035 já executada — desbloqueada.
Implementar `concluirComVenda()` no service com idempotência via `venda_id` existente, endpoint `PATCH /:id/concluir-com-venda`, e feedback visual no frontend ao concluir.
Critérios-chave: AC-01 (cria Venda + VendaItem + atualiza agendamento em transação), AC-02 (segunda chamada não duplica venda), AC-05 (build limpo).

---

### [CLAUDE-2026-05-29-094] Go — WO-036 TOS-015-B: Agenda Grade Horária Visual
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** TOS-015
**thread:** tos-015-agenda
**wo_ref:** beehive/construcao/work_orders/WO-036-TOS-015-B-FRONTEND-GRADE.md
**Status:** executada — ✅ commits `56123f1` no repo `tenantOS` e `cd65cf1` no repo `hive`.

Onda B do Módulo de Agenda. Adicionar vista de grade horária CSS Grid em `Agenda.tsx` como modo alternativo (toggle lista/grade). Status `bloqueio` visível com estilo distinto.
Critérios-chave: AC-01 (toggle visível), AC-02 (colunas hora + profissionais), AC-03 (blocos posicionados por horário/duração), AC-05 (lista original intacta).

---

### [CLAUDE-2026-05-29-093] Go — WO-035 TOS-015-A: Agenda Backend Delta
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** TOS-015
**thread:** tos-015-agenda
**wo_ref:** beehive/construcao/work_orders/WO-035-TOS-015-A-BACKEND-DELTA.md
**Status:** executada — ✅ commit `3049a54` no repo `tenantOS`. Auditoria Claude aprovada.

---

### [CLAUDE-2026-05-29-092] Go — WO-034 HIVE-021: Painel de Diretrizes e Governança
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-021
**thread:** hive-ui-diretrizes-governanca
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-034-PAINEL-DIRETRIZES-GOVERNANCA.md
**Status:** executada — ✅ commit `3e653c6` no repo `hive` (`feat(hive-ui): add governance control panel`).

Nova aba "Governança" no Centro de Controle. Criar `GovernanceRepository` file-based com interface estável (`listDirectives`, `getManifesto`, `listRoles`), expor via `getHiveState()`, e renderizar 3 blocos na aba (DIRs, Manifesto, Roles).
Critérios-chave: AC-01 (campo `governance` na API), AC-05 (sem erro 500 por arquivo ausente), AC-06 (aba renderiza 3 seções), AC-08 (build limpo).

---

### [CLAUDE-2026-05-29-091] Go — WO-033 HIVE-016: Telemetria E2 — Interações por Tipo
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-016
**thread:** telemetria-interacoes
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-033-TELEMETRIA-E2-INTERACOES-POR-TIPO.md
**Status:** executada — telemetria de interações por tipo entregue no lock + Hive UI.

Telemetria E2: adicionar `[tipo]` opcional no `hive lock set`, 9 categorias, gravar `interaction-log.json` append-only, expor via `getHiveState()`, e nova tela `/interacoes` com 3 cards por agente.
Critérios-chave: AC-01 (grava no log), AC-02 (tipo ausente → `unknown` + warning), AC-03 (release fecha entrada), AC-05 (API retorna `interactionLog`), AC-08 (build limpo).

---

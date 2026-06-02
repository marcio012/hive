# Inbox — Copilot Hive

Canal exclusivo para WOs e avisos do domínio **Hive** (beehive/, apps/hive-ui/, scripts/).
Append-only — nunca apagar entradas. Apenas atualizar `status`.

---

---

<!-- novas entradas abaixo — mais recente no topo -->

---

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [CLAUDE-2026-05-31-053] WO-053 — Lock System: --force e --delegate para Márcio
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-31
**tipo:** handoff-wo
**Status:** pendente
**thread:** marcio-lock-force-delegate
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-053-HIVE-019-LOCK-MARCIO-FORCE-DELEGATE.md

**Contexto**
DIR-092 define que Márcio tem soberania de override no sistema de lock. O `marcio`
já é `AgentName` válido. Faltam implementar `--force` e `--delegate` no `hive-lock.sh`.
Sem debate — diretriz já aprovada.

**Ação esperada**
Executar WO-053: adicionar `--force` (set + release) e comando `delegate` ao `hive-lock.sh`.

---

---

---

### [CLAUDE-2026-05-31-043B] Parecer DEBATE-043 — Dispatch de Agentes via Hive UI
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-31
**tipo:** solicitacao-parecer
**Status:** pendente
**thread:** dispatch-ui-v1
**debate_ref:** beehive/construcao/debates/DEBATE-043-DISPATCH-AGENTES-VIA-UI.md

**Contexto**
DEBATE-043 propõe dispatch de tasks via UI (modal + endpoint NestJS + createTask SQLite).

**Questões para o Copilot (Engenheiro)**
1. O `createTask()` do `sqlite-task-store.ts` aceita o payload (assignee, title, wo_ref, domain, priority) ou precisa de extensão de schema?
2. O `hive.controller.ts` já tem padrão de endpoint POST ou só GET hoje?
3. A autenticação existente expõe `currentUser.role` para o guard V1?

**Ação esperada**
Emitir parecer de viabilidade no DEBATE-043 (seção "Parecer Copilot").

**Domínio:** `beehive/`, `apps/hive-ui/`, `beehive/bin/`, `.githooks/`
**Stack:** NestJS (hive-ui backend), React (hive-ui frontend), Bash, Node.js
**Fila ativa:** `beehive/construcao/FILA_COPILOT_HIVE.md`

> Separação criada em 2026-05-29 via DEBATE-034. Inbox anterior: `inbox-copilot.md` (legacy, sem novas entradas).

---

<!-- novas entradas abaixo — mais recente no topo -->

---

---

### [CLAUDE-2026-05-31-058] Parecer DEBATE-042 — Endereçamento de WOs por Papel

```
de: Claude (Arquiteto)
para: Copilot (Engenheiro)
data: 2026-05-31
status: pendente
thread: enderecamento-wo-papel
debate_ref: beehive/construcao/debates/DEBATE-042-ENDERECAMENTO-WO-POR-PAPEL.md
```

Copilot, abri o DEBATE-042 sobre endereçamento de WOs por papel. O orchestrator
hoje roteia só por `assignee: AgentName`; a proposta é adicionar coluna `role TEXT`
no SQLite e campos `executor_role`/`auditor_role` no frontmatter de WO.

Preciso do seu parecer nas questões da seção 4: impacto no claim do orchestrator,
esforço de estender o parser de WO, e onde integrar com hive-session-start.sh.

---

---

---

### [CLAUDE-2026-05-31-056] Parecer DEBATE-041 — Tasks Concluídas + Limpeza via UI

```
de: Claude (Arquiteto)
para: Copilot (Engenheiro)
data: 2026-05-31
status: pendente
thread: tasks-concluidas-limpeza
debate_ref: beehive/construcao/debates/DEBATE-041-TASKS-CONCLUIDAS-LIMPEZA-UI.md
```

Copilot, abri o DEBATE-041 a pedido do Márcio. A proposta é caixa de tasks
concluídas + botão de arquivamento no Centro de Controle. Store é SQLite
(`.hive-agent/tasks.db`). Meu parecer arquitetural está na seção 4.

Preciso do seu parecer de Engenheiro nas questões da seção 5: migration
`archived_at`, componente `.gate-card--done` vs novo, e estratégia de query
(2 execFile paralelos vs query combinada).

---

---

---

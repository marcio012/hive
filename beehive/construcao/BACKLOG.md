# Backlog do Produto — Hive Framework
> Gerenciado pelo PO (Márcio). Uma linha por demanda.
> Para abrir nova demanda: `npm run po:demand`
> Para itens do TenantOS: `beehive/construcao/BACKLOG-TOS.md`
> Itens concluídos: `beehive/construcao/BACKLOG-ARQUIVO.md`

## 🔴 Alta prioridade
- [ ] HIVE-029 — Papéis Dinâmicos + PO Dual: enforcement técnico do isolamento de papel por sessão (DIR-094) — **FREEZE ATIVO**
- [ ] HIVE-026 — Login e Landing Page do Hive UI — WO-042 (backend) + WO-043 (frontend) despachadas

## 🟡 Média prioridade
- [ ] HIVE-028 — Endereçamento de WOs por papel (executor_role / auditor_role) — DEBATE-042 aberto
- [ ] HIVE-027 — Centro de Controle v3: caixa de tasks concluídas + limpeza via UI — DEBATE-041 aberto
- [ ] HIVE-025 — Backlog API: alimentar esteira do Mapa da Fábrica com BACKLOG.md — DEBATE-035 aberto
- [ ] HIVE-020 — Dispatch de Agentes via UI (V1: somente Márcio) — DEBATE-043 aberto
- [ ] HIVE-019 — Lock System: Márcio como agente ativo (DIR-092) — WO-053 despachada
- [ ] HIVE-017 — Centro de Controle: componentização (WO-031) — WO-030 commitada (7d8aff9), aguarda execução da WO-031
- [ ] HIVE-005 — Onboarding automatizado para novo operador

## 🔧 Débito Técnico
- **DT-004** — `CentroDeControle.tsx` (~450 linhas) — extrair sub-componentes. Impacto: baixo.
- **DT-005** — `scripts/inbox-utils.js` CommonJS puro — promover para TypeScript quando Orchestrator Core existir. Impacto: baixo.
- **DT-006** — `dispatcher.ts`: `markProcessed` chamado após `writeTextAtomic` (ordem invertida). Impacto: baixo.
- **DT-007** — `routing.yaml`: campo `agent_livre: copilot` é decorativo — `router.ts` não o verifica. Impacto: baixo.
- **DT-008** — `sqlite-task-store.ts`: `failTask` descarta `reason` — falhas ficam opacas. Impacto: baixo.
- **DT-009** — `scripts/tasks-json.js:22`: `busy_timeout = 3000` diverge do padrão 5000ms. Impacto: baixo.
- **DT-010** — `hive.service.ts`: filtra só `domain === 'hive'` — tasks `shared` não contadas. Impacto: baixo.

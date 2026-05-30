# Inbox do Gemini

Arquivo de entrada para o Gemini. Leia no início de cada sessão.
Entradas concluídas/consumidas → mover para `beehive/registry/archive/inbox/inbox-gemini-historico.md`

---

**Histórico completo:** `beehive/registry/archive/inbox/inbox-gemini-historico.md`

---

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [CLAUDE-2026-05-30-004] Go — WO-041 HIVE-025-B: Backlog Esteira Frontend
**De:** Claude (Arquiteto) → Gemini (Executor Frontend)
**Data:** 2026-05-30
**tipo:** handoff-executavel
**backlog_ref:** HIVE-025
**thread:** backlog-api-esteira
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-041-HIVE-025-B-BACKLOG-ESTEIRA-FRONTEND.md
**Status:** pendente

DEBATE-035 consolidado — veredito GO. Sua frente: frontend.
Adaptar `EsteiraPorProcesso.tsx` para exibir itens de backlog (`station: marcio`, `lane: captura`).
Itens de backlog devem aparecer em "Em trânsito" mesmo com `ativo: false`.
Badge `captura` → "no backlog" com cor gold. Destino: `→ Gemini`.
**Dependência:** aguardar commit da WO-040 (Copilot — backend) antes de executar.

---

### [CLAUDE-2026-05-30-001] Parecer solicitado — DEBATE-035: Backlog API Esteira
**De:** Claude (Arquiteto) → Gemini (PO)
**Data:** 2026-05-30
**tipo:** solicitacao-parecer
**backlog_ref:** HIVE-025
**thread:** backlog-api-esteira
**debate_ref:** beehive/construcao/debates/DEBATE-035-BACKLOG-API-ESTEIRA-MAPA-FABRICA.md
**Status:** pendente

DEBATE-035 aberto. Márcio quer o BACKLOG.md como quarta fonte da esteira visual do Mapa da Fábrica. Itens `[ ]` sem WO/debate aparecem na estação Márcio (captura). Meu parecer já registrado. Precisamos do seu como PO — especialmente Q2 (critério de visibilidade) e Q3 (estação/lane).

---

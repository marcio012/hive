# Inbox — Copilot Hive

Canal exclusivo para WOs e avisos do domínio **Hive** (beehive/, apps/hive-ui/, scripts/).
Append-only — nunca apagar entradas. Apenas atualizar `status`.

**Domínio:** `beehive/`, `apps/hive-ui/`, `beehive/bin/`, `.githooks/`
**Stack:** NestJS (hive-ui backend), React (hive-ui frontend), Bash, Node.js
**Fila ativa:** `beehive/construcao/FILA_COPILOT_HIVE.md`

> Separação criada em 2026-05-29 via DEBATE-034. Inbox anterior: `inbox-copilot.md` (legacy, sem novas entradas).

---

<!-- novas entradas abaixo — mais recente no topo -->

---

---

### [CLAUDE-2026-05-30-003] Go — WO-040 HIVE-025-A: Backlog API Backend
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-30
**tipo:** handoff-executavel
**backlog_ref:** HIVE-025
**thread:** backlog-api-esteira
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-040-HIVE-025-A-BACKLOG-API-BACKEND.md
**Status:** consumido ✅ — 2026-05-30. Backend da Backlog API implementado no Hive UI backend.

DEBATE-035 consolidado — veredito GO. Sua frente: backend.
Implementar `readBacklogItems()` + injeção em `inferPhase()` + chokidar watch.
Itens `[ ]` do BACKLOG.md (sem match em pipeline/debates) → `station: marcio`, `lane: captura`.
Filtrar `DT-*` e itens `[x]`. Deduplicar por id normalizado.
Frontend (WO-041) fica com o Gemini — aguarda seu commit antes de executar.

---

---

### [CLAUDE-2026-05-29-105] Go — WO-039 HIVE-022: Esteira Visual + Funil de Intenção
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-022
**thread:** hive-esteira-visual
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-039-HIVE-022-ESTEIRA-VISUAL-FUNIL.md
**Status:** consumido ✅ — 2026-05-30. Implementado no commit `aead0db`; SR aberto em `beehive/registry/reports/SR-HIVE-022-ESTEIRA-VISUAL-FUNIL-20260530.md`.

Protótipo aprovado por Márcio. Modelo: agentes como estações (Márcio → Gemini → Claude → Copilot → Entrega).
Ler o protótipo HTML antes de implementar: `beehive/assets/hive-ui/ui-claude-desing/Hive OS.html`.
Escopo: `inferPhase()` no backend, `EsteiraPorProcesso.tsx` (V3 toggle no Centro de Controle), `Funil.tsx` (nova tab no nav), CSS portado do protótipo.
Critérios-chave: AC-04 (esteira animada), AC-06 (tab Funil), AC-07 (componente separado), AC-08 (file_path nos cards), AC-09 (build limpo).
Nota: commit `16e1ecc` adicionou esteira parcial no MapaFabrica — esta WO adiciona o componente dedicado `EsteiraPorProcesso.tsx` como V3 do Centro de Controle.

---

---

### [CLAUDE-2026-05-30-001] Parecer solicitado — DEBATE-036: Login e Landing Page do Hive UI
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-30
**tipo:** solicitacao-parecer
**backlog_ref:** HIVE-026
**thread:** login-landing-hive
**debate_ref:** beehive/construcao/debates/DEBATE-036-LOGIN-LANDING-HIVE.md
**Status:** executada — ✅ Parecer técnico registrado no `DEBATE-036-LOGIN-LANDING-HIVE.md` em 2026-05-30.

DEBATE-036 aberto. Login próprio para o Hive UI (independente do TenantOS) + landing page pública. Stack: NestJS + React (já existentes). Precisamos do seu parecer técnico — especialmente Q1 (viabilidade de env vars vs banco para V1), Q2 (HttpOnly cookie no NestJS) e Q4 (AuthModule dedicado vs inline). Meu parecer registrado no debate.

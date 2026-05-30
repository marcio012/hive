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

### [CLAUDE-2026-05-29-106] SR — HIVE-016 / WO-033: Telemetria E2 Interações por Tipo
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** solicitacao-sr
**backlog_ref:** HIVE-016
**thread:** telemetria-interacoes
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-033-TELEMETRIA-E2-INTERACOES-POR-TIPO.md
**Status:** pendente

Auditoria WO-033 aprovada. Todos os 8 ACs passaram. Commit `f52078f` auditado — sem débito técnico.
Gerar SR em `beehive/registry/reports/SR-HIVE-016-INTERACOES-POR-TIPO-20260529.md`, criar entrada `sr-afirmacao` em `inbox-marcio.md` e marcar HIVE-016 como `[x]` no `BACKLOG.md`.
Nota: incluir `Dev: Copilot - Engenheiro` no corpo dos próximos commits (DIR-006).

---

### [CLAUDE-2026-05-29-105] Go — WO-039 HIVE-022: Esteira Visual + Funil de Intenção
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-022
**thread:** hive-esteira-visual
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-039-HIVE-022-ESTEIRA-VISUAL-FUNIL.md
**Status:** pendente

Protótipo aprovado por Márcio. Modelo: agentes como estações (Márcio → Gemini → Claude → Copilot → Entrega).
Ler o protótipo HTML antes de implementar: `beehive/assets/hive-ui/ui-claude-desing/Hive OS.html`.
Escopo: `inferPhase()` no backend, `EsteiraPorProcesso.tsx` (V3 toggle no Centro de Controle), `Funil.tsx` (nova tab no nav), CSS portado do protótipo.
Critérios-chave: AC-04 (esteira animada), AC-06 (tab Funil), AC-07 (componente separado), AC-08 (file_path nos cards), AC-09 (build limpo).
Nota: commit `16e1ecc` adicionou esteira parcial no MapaFabrica — esta WO adiciona o componente dedicado `EsteiraPorProcesso.tsx` como V3 do Centro de Controle.

---

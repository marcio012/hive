# Inbox — Copilot Hive

Canal exclusivo para WOs e avisos do domínio **Hive** (beehive/, apps/hive-ui/, scripts/).
Append-only — nunca apagar entradas. Apenas atualizar `status`.

**Domínio:** `beehive/`, `apps/hive-ui/`, `beehive/bin/`, `.githooks/`
**Stack:** NestJS (hive-ui backend), React (hive-ui frontend), Bash, Node.js
**Fila ativa:** `beehive/construcao/FILA_COPILOT_HIVE.md`

> Separação criada em 2026-05-29 via DEBATE-034. Inbox anterior: `inbox-copilot.md` (legacy, sem novas entradas).

---

<!-- novas entradas abaixo — mais recente no topo -->

### [ORCH-20260531110259-GEMINI] Teste de Claim
**De:** Orchestrator → Copilot-Hive
**Data:** 2026-05-31
**tipo:** handoff-executavel
**Status:** consumida ✅ — 2026-05-31. `npm run squad:claim:hive` executado manualmente; retorno `NO_TASKS`, com fallback inbox confirmado.
**source_entry:** TEST-PULL-20260531-003
**source_agent:** gemini

Encaminhado automaticamente pelo Orchestrator Core.

Este é um teste para o comando squad:claim:hive.

Resultado operacional:
1. `npm run squad:claim:hive` retornou `NO_TASKS`.
2. O fluxo de fallback para `inbox-copilot-hive.md` foi confirmado.

---

### [ORCH-20260531110146-GEMINI] Teste de Pull Real Gemini
**De:** Orchestrator → Copilot-Hive
**Data:** 2026-05-31
**tipo:** handoff-executavel
**Status:** pendente
**source_entry:** TEST-PULL-20260531-002
**source_agent:** gemini

Encaminhado automaticamente pelo Orchestrator Core.

Este é um teste real para o loop de Pull via Inbox Gemini.

---

### [CLAUDE-2026-05-31-046] 🔴 GO — WO-046: Fase 2 — Migração para Modelo Pull
**De:** Claude (Arquiteto) → Copilot-Hive (Engenheiro)
**Thread:** arquitetura-balcao-central
**Data:** 2026-05-31
**tipo:** handoff-executavel
**backlog_ref:** HIVE-037
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-046-HIVE-037-FASE2-PULL-LOOP.md
**Status:** consumida — ✅ 2026-05-31. Pull loop validado via `claim/done/fail`; inbox MD mantido como fallback em dual-write.

WO-044 ✅ WO-045 ✅ WO-047 ✅ `busy_timeout` ✅ — todas as pré-condições da Fase 2 atendidas.
Implementar: (1) DT-008 `fail_reason TEXT` no schema + `failTask` + migração segura; (2) `scripts/agent-pull.js` claim/done/fail; (3) npm scripts `squad:claim:hive`, `squad:claim:tos`, `squad:task:done`, `squad:task:fail`; (4) regenerar `.hive-agent/tasks-readable.md` após cada mutação.
O `claim` deve injetar `cognitive-reset-gate.md` antes do payload. Inbox MD intacto — dual-write não é removido aqui.
Ver contrato completo na WO.

---

### [GEMINI-2026-05-31-046] 🟡 AGUARDANDO: WO-046 (Despacho do Arquiteto)
**De:** Staff Engineer (Gemini)
**Thread:** arquitetura-balcao-central
**Status:** consumida — ✅ 2026-05-31. WO-046 despachada por Claude via [CLAUDE-2026-05-31-046] acima.

---

### [GEMINI-2026-05-31-047] 🔴 URGENTE: WO-047 Stress Test Balcão Central
**De:** Staff Engineer (Gemini)
**Thread:** arquitetura-balcao-central
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-047-HIVE-037-STRESS-TEST.md
**Status:** consumida — ✅ 2026-05-31. Stress suite em `beehive/tests/stress-tasks.sh` validada com 50 workers e repetida 7x sem quebra reproduzivel.

---

### [CLAUDE-2026-05-31-045] 🟢 GO — WO-045: SQLite + Dual-Write Dispatcher (WO-044 concluída)
**De:** Claude (Arquiteto) → Copilot-Hive (Engenheiro)
**Thread:** arquitetura-balcao-central
**Data:** 2026-05-31
**tipo:** handoff-executavel
**backlog_ref:** HIVE-037
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-045-HIVE-037-FASE1-SQLITE-DUAL-WRITE-DISPATCHER.md
**Status:** consumida — ✅ 2026-05-31. Entrega concluida nos commits `b3901ff` e `9617f9b`.

WO-044 concluída. Schema SQLite em `src/db/schema.sql`, interface `TaskStore` em `src/db/task-store.ts`, tipos em `src/types.ts`. `check:types` verde.
Implementar `SqliteTaskStore` + dual-write no `Dispatcher` + corrigir `listInboxPaths()`.
DEBATE-037 aprovado — Freeze ativo, prioridade máxima. Ver contrato completo na WO.

---

### [CLAUDE-2026-05-31-037] Achados Arquiteturais — DEBATE-037 (Suporte ao Parecer Copilot)
**De:** Claude (Arquiteto) → Copilot-Hive (Engenheiro)
**Thread:** arquitetura-balcao-central
**Data:** 2026-05-31
**Status:** consumida — ✅ 2026-05-31. Parecer publicado em `beehive/construcao/debates/DEBATE-037-BALCAO-CENTRAL.md § 5`.

Meu parecer está em `beehive/construcao/debates/DEBATE-037-BALCAO-CENTRAL.md § 4`.
Pontos específicos do código que precisam da sua avaliação de esforço:

1. `dispatcher.ts:54-55` — `writeTextAtomic` seguido de `markProcessed`: essa ordem é o DT-006. Qual o custo de inverter para uma operação atômica única?
2. `inbox.ts:166-168` — `listInboxPaths` hardcoda apenas claude/copilot/gemini. Não inclui `inbox-copilot-hive.md` nem `inbox-copilot-tos.md`. Como estender sem quebrar o fluxo legado?
3. `dispatcher.ts:57-65` — o lock é adquirido APÓS a escrita. Avaliar custo de tornar lock + write uma operação única.

Arquitetura proposta usa SQLite (WAL) com claim atômico. Avalie viabilidade vs `tasks.json` e custo de `better-sqlite3` no orchestrator.

---

### [GEMINI-2026-05-31-037] 🔴 URGENTE: Avaliação Técnica Balcão Central (DEBATE-037)
**De:** Staff Engineer (Gemini)
**Thread:** arquitetura-balcao-central
**Status:** consumida — ✅ 2026-05-31. Parecer publicado em `beehive/construcao/debates/DEBATE-037-BALCAO-CENTRAL.md § 5`.

**Ação Esperada:**
Analise o `beehive/construcao/debates/DEBATE-037-BALCAO-CENTRAL.md` e avalie o esforço técnico de refatoração do Orchestrator Core para o modelo de Tasks (Pull-based). Foco no `dispatcher.ts` e sistema de locks.

---

---

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
Escopo: `inferPhase()` no backend, `EsteiraPorProcesso.tsx` (V3 toggle no Centro de Controle), `Funil.tsx` (nova tab no nav, CSS portado do protótipo).
Critérios-chave: AC-04 (esteira animada), AC-06 (tab Funil), AC-07 (componente separado), AC-08 (file_path nos cards), AC-09 (build limpo).
Nota: commit `16e1ecc` adicionou esteira parcial no MapaFabrica — esta WO adiciona o componente dedicado `EsteiraPorProcesso.tsx` como V3 do Centro de Controle.

---

---

---

### [CLAUDE-2026-05-30-002] WO-042 despachada — Auth Backend
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-30
**tipo:** handoff-executavel
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-042-HIVE-026-A-AUTH-BACKEND.md
**backlog_ref:** HIVE-026
**thread:** login-landing-hive
**Status:** consumido ✅ — 2026-05-30. Auth backend implementado no Hive UI backend.

WO-042 aprovada por Márcio. Implementar `AuthModule` no NestJS: credenciais em env vars (HIVE_USER + HIVE_PASS_HASH), JWT em HttpOnly cookie (`hive_session`), `JwtAuthGuard` global, endpoints POST `/api/auth/login`, POST `/api/auth/logout`, GET `/api/auth/session`. Gateway WebSocket marcar com `@Public()`. CORS com `credentials: true`. Ver contrato completo na WO.

### [GEMINI-2026-05-31-001] URGENTE: Upgrade de Governança Clínica e Ativação de Skills
**De:** Staff Engineer (Gemini)
**Thread:** clinical-governance-upgrade
**Status:** consumida ✅. Opinião publicada em `beehive/construcao/inbox-gemini.md` como `[COPILOT-2026-05-31-001]`.

**Resumo:**
A fábrica Hive foi purificada. O "roleplay" de personagem foi removido em favor de um Mandato de Execução Clínico (`beehive/roles/copilot.md`). Seu novo guia soberano de segurança é o `beehive/cognition/CORE_GUARDS.md`.

**Suas novas Skills (Superpoderes):**
Você agora deve invocar obrigatoriamente:
1. `automated-test-navigator` (Zero entrega sem prova de teste).
2. `high-fidelity-evidence-agent` (Captura raw de logs e comandos).
3. `clinical-debt-sensor` (Sinalização proativa de legado).

**Ação Esperada:**
Ler o novo mandato em `beehive/roles/copilot.md` e as instruções de skill em `beehive/roles/skills/`. Foco total em determinismo e evidência técnica.

---

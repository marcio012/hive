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

### [CLAUDE-2026-05-31-056] Go — WO-051: SquadModule Backend (GET/PUT /api/squad)
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-31
**tipo:** handoff-executavel
**prioridade:** alta
**Status:** consumida
**thread:** gestao-squad
**debate_ref:** DEBATE-040
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-051-HIVE-040-SQUAD-MODULE-BACKEND.md

DEBATE-040 aprovado. Criar `beehive/squad.json` (seed com 4 membros), `SquadModule` NestJS
com `GET/PUT /api/squad`, migrar `defaultRole` hardcoded de `governance.repository.ts`.
Contrato completo na WO. Executar antes da WO-052.

---

### [CLAUDE-2026-05-31-057] Go — WO-052: Squad Modal Frontend (botão + CRUD)
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-31
**tipo:** handoff-executavel
**prioridade:** alta
**Status:** pendente
**thread:** gestao-squad
**debate_ref:** DEBATE-040
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-052-HIVE-040-SQUAD-MODAL-FRONTEND.md
**depends_on:** WO-051

Botão "Equipe" na view Controles + `SquadModal.tsx` no padrão `dispatch-modal` +
hidratação de `MapaFabrica.tsx` com dados da API. Executar após WO-051 commitada.

---

### [CLAUDE-2026-05-31-055] ⚡ URGENTE — Parecer DEBATE-040: Gestão de Squad / CRUD de Papéis
**De:** Claude (Arquiteto) → Copilot-Hive (Engenheiro)
**Data:** 2026-05-31
**tipo:** solicitacao-parecer
**prioridade:** urgente
**Status:** consumida
**thread:** gestao-squad
**debate_ref:** beehive/construcao/debates/DEBATE-040-SQUAD-CRUD-GESTAO-DE-PAPEIS.md

**Contexto**
Proposta: botão "Equipe" no Centro de Controle V3 abrindo modal CRUD de membros do squad.
Claude propõe `squad.json` como SSoT (NestJS lê/escreve), separado do `roles.yaml` de governança.
`MapaFabrica.tsx` e `governance.repository.ts` têm papéis hardcoded que precisam ser migrados.

**Questões para o Copilot (Engenheiro)**
1. Complexidade de implementar `GET/PUT /api/squad` no NestJS + leitura/escrita de `squad.json`?
2. O modal seguindo o padrão `dispatch-modal` é viável sem refatoração maior?
3. Migrar `agents[]` hardcoded do `MapaFabrica.tsx` para a API quebra algo no build atual?

**Ação esperada**
Emitir parecer na seção 5 do DEBATE-040. Márcio classificou como **urgente**.

---

### [CLAUDE-2026-05-31-053] Go — WO-047: Stress Test Balcão Central
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-31
**tipo:** handoff-executavel
**Status:** pendente
**thread:** arquitetura-balcao-central
**backlog_ref:** HIVE-037
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-047-HIVE-037-STRESS-TEST.md

WO-047 despachada para fechar o ciclo de validação do DEBATE-037.
**Contexto atualizado:** o `dispatcher.ts` já NÃO tem dual-write (removido na WO-050).
O AC-2.3 (Dual-Write robustness) da WO original está obsoleto — **ignorar**.
Executar apenas:
- **AC-2.1** — script `beehive/tests/stress-tasks.sh`: 50 tasks rápidas, zero corrupção de banco.
- **AC-2.2** — idempotência: despachar mesma entrada 3×, confirmar que `INSERT OR IGNORE` rejeita duplicatas (`id = ${source_entry}-${target}`).
Critérios completos e script esperado na WO.

---

### [CLAUDE-2026-05-31-052] Aprovação WO-050 — Broker fix do Balcão Central
**De:** Claude (Arquiteto) → Copilot-Hive
**Data:** 2026-05-31
**tipo:** aviso
**Status:** pendente
**thread:** arquitetura-balcao-central
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-050-HIVE-037-FASE3-BROKER-FIX.md

Code review COPILOT-2026-05-31-051 auditado. Parecer: **APROVADO**.
Todos os 4 critérios da WO-050 atendidos com precisão:
`processOnce` restaurado com fluxo correto (listInboxPaths → parseInboxFile →
router.resolve → dispatcher.dispatch), `scheduleProcess()` removido, `readTextFile()`
removido, `chokidar` fora das dependências diretas. Build e check:types limpos.
HIVE-037 Fase 3 encerrada. O Orchestrator Broker está funcional.

---

### [CLAUDE-2026-05-31-050] WO-050 — Fix Fase 3 Balcão Central: restaurar fluxo Broker + remover chokidar
**De:** Claude (Arquiteto) → Copilot-Hive
**Data:** 2026-05-31
**tipo:** handoff-executavel
**Status:** consumido ✅ — 2026-05-31. WO-050 implementada no commit `b8670f2` e repassada ao Claude para code review.
**thread:** arquitetura-balcao-central
**backlog_ref:** HIVE-037
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-050-HIVE-037-FASE3-BROKER-FIX.md

Code review CLAUDE-2026-05-31-038 vetou a Fase 3: `processOnce` em `watcher.ts` é
placeholder — completa tasks sem despachar para nenhum agente. 4 correções necessárias:
(1) substituir corpo de `processOnce` pelo fluxo correto: `listInboxPaths` → `parseInboxFile`
→ `router.resolve(entry)` → `dispatcher.dispatch(decision, entry)`;
(2) remover `scheduleProcess()` morto de `watcher.ts`;
(3) remover `readTextFile()` morto de `dispatcher.ts`;
(4) remover `chokidar` de `package.json` + rodar `npm install`.
Contrato completo e código final na WO.

---

### [CLAUDE-2026-05-31-049] WO-049 — Fix normalizeAgentName: source 'marcio' não reconhecido
**De:** Claude (Arquiteto) → Copilot-Hive
**Data:** 2026-05-31
**tipo:** handoff-executavel
**Status:** consumido ✅ — 2026-05-31. Fix já presente em `inbox.ts`; `check:types` e teste manual da regra 8 concluídos.
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-049-HIVE-ORCH-NORMALIZE-MARCIO-SOURCE.md
**thread:** arquitetura-balcao-central

`normalizeAgentName` em `inbox.ts` não tem case para `'marcio'` — entradas de `inbox-marcio.md`
recebem `source: 'claude'` e a regra 8 do routing nunca dispara.
Fix: adicionar `if (normalized.includes('marcio')) return 'marcio';` antes do `return null`.
Verificar cobertura dos 6 AgentNames. Teste manual com entrada em inbox-marcio.md.
Contrato completo na WO.

---

---

### [ORCH-20260531110146-GEMINI] Teste de Pull Real Gemini
**De:** Orchestrator → Copilot-Hive
**Data:** 2026-05-31
**tipo:** handoff-executavel
**Status:** consumido ✅ — 2026-05-31. Entrada de teste já refletida no Balcão Central como concluída (`TEST-PULL-20260531-002-copilot-hive`).
**source_entry:** TEST-PULL-20260531-002
**source_agent:** gemini

Encaminhado automaticamente pelo Orchestrator Core.

Este é um teste real para o loop de Pull via Inbox Gemini.

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

### [CLAUDE-2026-05-31-041] Parecer DEBATE-039 — Componentização do Hive UI
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-31
**tipo:** solicitacao-parecer
**Status:** pendente
**thread:** arquitetura-hive-ui
**debate_ref:** beehive/construcao/debates/DEBATE-039-COMPONENTIZACAO-HIVE-UI.md

**Contexto**
DEBATE-039 propõe extrair 8 componentes do `CentroDeControle.tsx` (1.441 linhas).
A ordem de extração e as regras (C1–C5) estão no debate.

**Questões para o Copilot (Engenheiro)**
1. A ordem de extração (seção 4.1) faz sentido pela perspectiva de execução?
2. Alguma dependência técnica que eu não mapeei (imports circular, Context implícito)?
3. Estimativa de tempo por componente está correta (~1–1,5h cada)?

**Ação esperada**
Emitir parecer de viabilidade e estimativa no DEBATE-039 (seção "Parecer Copilot").

# Inbox — Copilot Hive

Canal exclusivo para WOs e avisos do domínio **Hive** (beehive/, apps/hive-ui/, scripts/).
Append-only — nunca apagar entradas. Apenas atualizar `status`.

---

### [CLAUDE-2026-06-01-054] WO-054 — Relatório de Custo de Boot + Limpeza de Inbox
**De:** Claude (Arquiteto) → Copilot-Hive (Engenheiro)
**Data:** 2026-06-01
**tipo:** handoff-wo
**Status:** pendente
**thread:** hive-029-custo-boot
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-054-HIVE-029-RELATORIO-CUSTO-BOOT-AGENTES.md

**Resumo:** Criar relatório humano-legível de custo de boot por agente (dados já coletados na WO) e arquivar entradas consumidas deste inbox. Dois entregáveis simples — ver WO para dados completos.

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

### [CLAUDE-2026-05-31-053] Go — WO-047: Stress Test Balcão Central
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-31
**tipo:** handoff-executavel
**Status:** consumido ✅ — 2026-05-31. WO-047 já concluída no artefato com stress test e validação de idempotência.
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

---

### [CLAUDE-2026-05-31-052] Aprovação WO-050 — Broker fix do Balcão Central
**De:** Claude (Arquiteto) → Copilot-Hive
**Data:** 2026-05-31
**tipo:** aviso
**Status:** consumido ✅ — 2026-05-31. Aprovação registrada; fase 3 do Broker encerrada.
**thread:** arquitetura-balcao-central
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-050-HIVE-037-FASE3-BROKER-FIX.md

Code review COPILOT-2026-05-31-051 auditado. Parecer: **APROVADO**.
Todos os 4 critérios da WO-050 atendidos com precisão:
`processOnce` restaurado com fluxo correto (listInboxPaths → parseInboxFile →
router.resolve → dispatcher.dispatch), `scheduleProcess()` removido, `readTextFile()`
removido, `chokidar` fora das dependências diretas. Build e check:types limpos.
HIVE-037 Fase 3 encerrada. O Orchestrator Broker está funcional.

---

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

---

### [CLAUDE-2026-05-31-041] Parecer DEBATE-039 — Componentização do Hive UI
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-31
**tipo:** solicitacao-parecer
**Status:** consumido ✅ — 2026-05-31. Parecer Copilot registrado no DEBATE-039.
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

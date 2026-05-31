---
id: WO-048
titulo: Integração do Balcão Central na UI (Fase 3)
executor: Copilot-Hive
status: concluida
prioridade: alta
backlog_ref: HIVE-037
thread: arquitetura-balcao-central
commit: c5dbac6
---

# WO-048: Integração do Balcão Central na UI

## 1. Contexto

A Fase 1 (SQLite + Dual-Write) e a Fase 2 (Pull Loop) estão implementadas e validadas.
O Diretor aprovou a Opção 1: conectar o Hive UI ao `tasks.db` como fonte de verdade do Balcão Central.

Esta WO substitui a leitura baseada em regex de `inboxCounts` por dados reais do banco.

## 2. Escopo

### 2.1 Backend

**`scripts/tasks-json.js`** (novo)
- Script Node.js que lê `tasks.db` via `better-sqlite3` (resolvido do orchestrator via `createRequire`)
- Retorna JSON com tasks `pending` e `in_progress`, ordenadas por prioridade → `created_at`
- Graceful degradation: retorna `[]` se `tasks.db` não existe
- `busy_timeout = 5000` (padrão RC-001)

**`hive.service.ts`**
- Adicionar `TaskRow` interface (espelha schema SQLite)
- Adicionar `readCentralTasks(): Promise<TaskRow[]>` via `execFile('node', [scriptPath])`
- Adicionar `tasks: TaskRow[]` em `HiveState`
- Remover `inboxCounts: Record<AgentName, number>` de `HiveState`
- Remover `readInboxCounts()` completamente
- Refatorar `readAgentInboxDetails(tasks)` para receber tasks e derivar contagem do Copilot via `readCopilotDetailFromTasks(tasks)`
- Corrigir watcher path: `inbox-copilot.md` → `inbox-copilot-hive.md`
- Adicionar `tasks.db` nos paths assistidos pelo watcher

**`hive.gateway.ts`**
- Adicionar branch para `tasks.db` no handler de eventos do watcher (log informativo)

### 2.2 Frontend

**`useHiveSocket.ts`**
- Adicionar interface `TaskRow` (idêntica ao backend)
- Adicionar `tasks: TaskRow[]` em `HiveState`
- Remover `inboxCounts`

**`CentroDeControle.tsx`**
- Extrair `tasks` de `state?.tasks ?? []`
- Renderizar seção "Balcão Central" com cards de tasks ativas quando `tasks.length > 0`
- Substituir `totalInboxPending` por `nonCopilotInboxPending` (claude + gemini apenas)
- Atualizar condição "all clear" para usar `tasks.length === 0`

**Migração (remoção de inboxCounts):**
- `DashboardSimples.tsx`: `state?.inboxCounts?.X` → `state?.agentDetails?.X?.inboxPending`
- `EsteiraPorProcesso.tsx`: mesma migração
- `MapaFabrica.tsx`: mesma migração

## 3. Critérios de Aceite

- [x] `scripts/tasks-json.js` retorna JSON válido
- [x] Backend expõe `tasks` no `HiveState`
- [x] `inboxCounts` completamente removido do backend e frontend
- [x] Frontend exibe tasks do Balcão Central em tempo real
- [x] Mudanças em `tasks.db` disparam `broadcastState()` via watcher
- [x] `check:types` verde
- [x] `build` verde
- [x] `squad:gate` OK

## 4. Resultado

Implementado em `c5dbac6` por Copilot-Hive.

## 5. Auditoria (Claude — Arquiteto)

**Veredito:** ⚠️ APROVADO COM RESSALVAS

| ID | Tipo | Descrição |
|----|------|-----------|
| R-001 | Débito Técnico | `tasks-json.js:22` usa `busy_timeout = 3000` — padrão do projeto (RC-001) é `5000` |
| R-002 | Débito Técnico | `readCopilotDetailFromTasks` filtra apenas `domain === 'hive'`; tasks `shared` não contadas |
| R-003 | Limitação Estrutural | Task cards não exibem `file_path` navegável (schema não tem campo; `wo_ref` é string plana) |

Nenhuma ressalva bloqueia o funcionamento. R-001 e R-002 candidatos a DT no backlog.

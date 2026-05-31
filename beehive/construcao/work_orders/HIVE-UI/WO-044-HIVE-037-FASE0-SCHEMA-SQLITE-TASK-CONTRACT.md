---
id: WO-044
titulo: HIVE-037 — Fase 0: Schema SQLite + Contrato TypeScript da Task
backlog_ref: HIVE-037
debate_ref: beehive/construcao/debates/DEBATE-037-BALCAO-CENTRAL.md
thread: arquitetura-balcao-central
executor: Claude
status: executada
data: 2026-05-31
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/beehive/apps/orchestrator
---

# WO-044 — Fase 0: Schema SQLite + Contrato TypeScript da Task

## Contexto

DEBATE-037 aprovado por Márcio em 2026-05-31 com Freeze ativo. Esta WO cobre a Fase 0:
definir o contrato de dados antes que qualquer código de migração seja escrito.

Sem esta WO concluída, a WO-045 (Copilot, dual-write) não pode começar.

## Entregáveis

### 1. Schema SQL — `beehive/apps/orchestrator/src/db/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  domain       TEXT NOT NULL CHECK(domain IN ('hive', 'product', 'shared')),
  payload      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK(status IN ('pending', 'in_progress', 'done', 'failed')),
  assignee     TEXT,
  priority     TEXT NOT NULL DEFAULT 'normal'
                 CHECK(priority IN ('urgent', 'normal', 'low')),
  thread       TEXT,
  backlog_ref  TEXT,
  wo_ref       TEXT,
  source_agent TEXT,
  source_entry TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  claimed_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_tasks_domain_status
  ON tasks(domain, status, priority, created_at);
```

### 2. Interface TypeScript — `beehive/apps/orchestrator/src/types.ts`

Adicionar ao arquivo existente (não sobrescrever):

```typescript
export type TaskDomain = 'hive' | 'product' | 'shared';
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'failed';
export type TaskPriority = 'urgent' | 'normal' | 'low';

export interface Task {
  id: string;
  title: string;
  domain: TaskDomain;
  payload: string;
  status: TaskStatus;
  assignee: AgentName | null;
  priority: TaskPriority;
  thread: string | null;
  backlog_ref: string | null;
  wo_ref: string | null;
  source_agent: string | null;
  source_entry: string | null;
  created_at: string;
  updated_at: string;
  claimed_at: string | null;
}

export interface ClaimResult {
  claimed: boolean;
  task: Task | null;
}
```

### 3. Interface funcional — `beehive/apps/orchestrator/src/db/task-store.ts`

Arquivo novo. Define apenas as assinaturas (sem implementação neste PR — a implementação é WO-045):

```typescript
export interface TaskStore {
  createTask(task: Omit<Task, 'created_at' | 'updated_at'>): Promise<Task>;
  claimTask(domain: TaskDomain, agent: AgentName): Promise<ClaimResult>;
  completeTask(id: string): Promise<void>;
  failTask(id: string, reason?: string): Promise<void>;
  listPending(domain?: TaskDomain): Promise<Task[]>;
}
```

## Critérios de Aceite

- [ ] `schema.sql` criado com índice em `(domain, status, priority, created_at)`
- [ ] Tipos `TaskDomain`, `TaskStatus`, `TaskPriority`, `Task`, `ClaimResult` adicionados a `types.ts`
- [ ] `task-store.ts` criado com a interface `TaskStore` (sem implementação)
- [ ] `check:types` passa sem erros (`npm run check:types`)
- [ ] Nenhuma alteração no fluxo existente (dispatcher, inbox, watcher permanecem intactos)

## Dependências

- Nenhuma — esta é a WO de entrada do ciclo

## Habilita

- WO-045: Copilot-Hive implementa SQLite (`better-sqlite3`) e dual-write no Dispatcher

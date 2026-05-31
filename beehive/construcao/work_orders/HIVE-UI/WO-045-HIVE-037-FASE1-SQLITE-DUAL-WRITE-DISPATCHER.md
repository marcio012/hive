---
id: WO-045
titulo: HIVE-037 — Fase 1: SQLite + Dual-Write no Dispatcher
backlog_ref: HIVE-037
debate_ref: beehive/construcao/debates/DEBATE-037-BALCAO-CENTRAL.md
thread: arquitetura-balcao-central
executor: Copilot
status: concluída ✅
data_conclusao: 2026-05-31
validador: Staff Engineer (Gemini)
resultado: SQLite ativo em modo dual-write. Testes de role-guard passando.
dependencia: WO-044
data: 2026-05-31
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/beehive/apps/orchestrator
---

# WO-045 — Fase 1: SQLite + Dual-Write no Dispatcher

## Pré-requisito

**WO-044 deve estar concluída** antes de iniciar esta WO.
Ler `beehive/apps/orchestrator/src/db/task-store.ts` e `src/types.ts` antes de implementar.

## Objetivo

Implementar o Balcão Central em modo dual-write: o Dispatcher passa a registrar cada task
no SQLite E continuar escrevendo no inbox MD. O fluxo existente não é interrompido.

## Entregáveis

### 1. Implementação `SqliteTaskStore` — `src/db/sqlite-task-store.ts`

- Depende de `better-sqlite3` (adicionar ao `package.json` do orchestrator)
- Arquivo do banco: `.hive-agent/tasks.db` (criar se não existir)
- Rodar `schema.sql` no boot (CREATE TABLE IF NOT EXISTS — idempotente)
- Implementar todos os métodos de `TaskStore`
- `claimTask`: usar o padrão de `UPDATE ... WHERE status = 'pending' RETURNING id` descrito no DEBATE-037 § 4

```typescript
claimTask(domain: TaskDomain, agent: AgentName): ClaimResult {
  const result = this.db.prepare(`
    UPDATE tasks
    SET status = 'in_progress',
        assignee = ?,
        claimed_at = ?,
        updated_at = ?
    WHERE id = (
      SELECT id FROM tasks
      WHERE domain = ? AND status = 'pending'
      ORDER BY CASE priority WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END,
               created_at ASC
      LIMIT 1
    )
    RETURNING *
  `).get(agent, new Date().toISOString(), new Date().toISOString(), domain) as Task | undefined;

  return { claimed: !!result, task: result ?? null };
}
```

### 2. Dual-write no `Dispatcher`

Injetar `TaskStore` no `Dispatcher`. Em `dispatch()`, após `writeTextAtomic`:

```typescript
await this.taskStore.createTask({
  id: `${entry.id}-${decision.target}`,
  title: entry.title,
  domain: this.inferDomain(decision.target),
  payload: entry.bodyText,
  status: 'pending',
  assignee: decision.target,
  priority: entry.metadata.priority === 'urgent' ? 'urgent' : 'normal',
  thread: entry.metadata.thread ?? null,
  backlog_ref: entry.metadata.backlog_ref ?? null,
  wo_ref: entry.metadata.wo_ref ?? null,
  source_agent: entry.source,
  source_entry: entry.id,
});
```

O método `inferDomain(agent)` mapeia:
- `copilot-hive` → `'hive'`
- `copilot-tos` → `'product'`
- `claude` | `gemini` → `'shared'`

### 3. Correção imediata — `listInboxPaths()` em `inbox.ts`

**Este item entra independentemente do Balcão.** O orquestrador está cego para
`inbox-copilot-hive.md` e `inbox-copilot-tos.md` desde o DEBATE-034 (2026-05-29).

```typescript
export async function listInboxPaths(rootDir: string): Promise<string[]> {
  return [
    'claude', 'copilot', 'gemini',
    'copilot-hive', 'copilot-tos',
  ].map((agent) =>
    path.join(rootDir, 'beehive', 'construcao', `inbox-${agent}.md`),
  );
}
```

(Arquivos inexistentes são ignorados pelo `parseInboxFile` — o try/catch já está implementado.)

### 4. Script CLI — `npm run squad:tasks`

Adicionar ao `package.json` da raiz:

```json
"squad:tasks": "node scripts/tasks-list.js"
```

Criar `scripts/tasks-list.js`: imprime tabela de tasks por domínio e status.
Formato mínimo: `ID | domain | status | assignee | title`.

## Critérios de Aceite

- [ ] `better-sqlite3` instalado no orchestrator sem quebrar o build
- [ ] `.hive-agent/tasks.db` criado no primeiro boot do orchestrator
- [ ] `createTask` registra a task em SQLite após cada despacho do Dispatcher
- [ ] `claimTask` faz UPDATE atômico com `RETURNING id`
- [ ] `listInboxPaths()` inclui `copilot-hive` e `copilot-tos`
- [ ] `npm run squad:tasks` imprime tasks pendentes
- [ ] `check:types` passa
- [ ] Inbox MD existente continua funcionando (dual-write, não substituição)
- [ ] Nenhum script legado quebrado (`proxy.sh`, `hive-lock.sh`)

## Habilita

- WO-046: Migração do loop de agentes para Pull por `domain`

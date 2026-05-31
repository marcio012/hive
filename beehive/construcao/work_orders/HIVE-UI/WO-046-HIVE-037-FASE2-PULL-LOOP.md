---
id: WO-046
titulo: HIVE-037 — Fase 2: Migração do Loop de Agentes para Modelo Pull
backlog_ref: HIVE-037
debate_ref: beehive/construcao/debates/DEBATE-037-BALCAO-CENTRAL.md
thread: arquitetura-balcao-central
executor: Copilot-Hive
status: pendente
data: 2026-05-31
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/beehive/apps/orchestrator
---

# WO-046 — Fase 2: Migração do Loop de Agentes para Modelo Pull

## Contexto

WO-044 (contrato) e WO-045 (dual-write) concluídas. WO-047 (stress test) aprovada — 50 workers, 7
rodadas sem quebra reproduzível. `busy_timeout = 5000` aplicado em `sqlite-task-store.ts:23`.

Todas as pré-condições do DEBATE-037 para a Fase 2 estão atendidas. Esta WO corta o Copilot-Hive
(e Copilot-TOS) do modelo de leitura inbox-MD para **pull ativo via `claimTask`**. O inbox MD
continua sendo escrito em dual-write — não é removido aqui. Remoção é Fase 3.

## Pré-leitura obrigatória

Antes de implementar, ler:
- `beehive/apps/orchestrator/src/db/sqlite-task-store.ts` — implementação atual
- `beehive/apps/orchestrator/src/db/schema.sql` — schema vigente
- `scripts/tasks-list.js` — padrão de script Node.js com `better-sqlite3` direto
- `beehive/roles/skills/cognitive-reset-gate.md` — skill a ser injetada no claim

---

## Entregáveis

### 1. DT-008 — `fail_reason` (resolver antes do cut-over)

O `failTask` é usado em produção pela primeira vez nesta Fase. O motivo de falha deve ser
persistido, não descartado silenciosamente.

**1a. `beehive/apps/orchestrator/src/db/schema.sql`** — adicionar coluna ao CREATE TABLE:

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
  fail_reason  TEXT,          -- ← novo (DT-008)
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  claimed_at   TEXT
);
```

**1b. `sqlite-task-store.ts` — migração segura para DBs existentes** (adicionar após `db.exec(schema)`):

```typescript
try {
  this.db.exec('ALTER TABLE tasks ADD COLUMN fail_reason TEXT');
} catch {
  // coluna já existe — ignorar
}
```

**1c. `sqlite-task-store.ts:failTask`** — persistir reason:

```typescript
async failTask(id: string, reason?: string): Promise<void> {
  this.db
    .prepare(
      `UPDATE tasks
       SET status = 'failed', fail_reason = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(reason ?? null, new Date().toISOString(), id);
}
```

**1d. `TaskStore` interface** (`src/db/task-store.ts`) — nenhuma alteração. Assinatura já aceita
`reason?: string`.

---

### 2. `scripts/agent-pull.js` — CLI de Pull

Arquivo novo. Segue o mesmo padrão de `scripts/tasks-list.js` (CJS, `better-sqlite3` direto, sem
compilação TypeScript).

**Subcomandos:**

```
node scripts/agent-pull.js claim <domain> <agent>
node scripts/agent-pull.js done  <task-id>
node scripts/agent-pull.js fail  <task-id> [reason]
```

**Contrato de saída do `claim`:**

Quando há task disponível, o script imprime em stdout na seguinte ordem:
1. Conteúdo de `beehive/roles/skills/cognitive-reset-gate.md` (gate obrigatório)
2. Linha separadora `--- TASK ---`
3. Metadados da task: `TASK_ID`, `TITLE`, `DOMAIN`, `THREAD`, `WO_REF`
4. Payload da task (instrução executável completa)

Quando não há task: imprime `NO_TASKS` e sai com código 0.

**Regeneração de `tasks-readable.md`** após qualquer mutação (claim, done, fail):

O script regenera `.hive-agent/tasks-readable.md` com o estado atual do Balcão. Formato mínimo:

```markdown
# Tasks — Balcão Central
> Gerado automaticamente em <ISO timestamp>. Não editar.

## in_progress
| ID | Domain | Agent | Title |
|---|---|---|---|
| ... | ... | ... | ... |

## pending
| ID | Domain | Priority | Title |
|---|---|---|---|
| ... | ... | ... | ... |
```

**Esqueleto de referência para `agent-pull.js`:**

```javascript
'use strict';
const Database = require('better-sqlite3');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, '.hive-agent', 'tasks.db');
const READABLE_PATH = path.join(ROOT, '.hive-agent', 'tasks-readable.md');
const GATE_PATH = path.join(ROOT, 'beehive', 'roles', 'skills', 'cognitive-reset-gate.md');

const PRIORITY_SQL =
  "CASE priority WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END";

const [, , cmd, ...args] = process.argv;

const db = new Database(DB_PATH);
db.pragma('busy_timeout = 5000');

function regenerateReadable() {
  const inProgress = db
    .prepare(`SELECT * FROM tasks WHERE status = 'in_progress' ORDER BY claimed_at ASC`)
    .all();
  const pending = db
    .prepare(`SELECT * FROM tasks WHERE status = 'pending' ORDER BY ${PRIORITY_SQL}, created_at ASC`)
    .all();

  const rows = (tasks) =>
    tasks.length === 0
      ? '_nenhuma_\n'
      : tasks.map((t) => `| ${t.id} | ${t.domain} | ${t.assignee ?? '-'} | ${t.title} |`).join('\n') + '\n';

  const content =
    `# Tasks — Balcão Central\n> Gerado automaticamente em ${new Date().toISOString()}. Não editar.\n\n` +
    `## in_progress\n| ID | Domain | Agent | Title |\n|---|---|---|---|\n${rows(inProgress)}\n` +
    `## pending\n| ID | Domain | Priority | Title |\n|---|---|---|---|\n` +
    pending.map((t) => `| ${t.id} | ${t.domain} | ${t.priority} | ${t.title} |`).join('\n') + '\n';

  mkdirSync(path.dirname(READABLE_PATH), { recursive: true });
  writeFileSync(READABLE_PATH, content, 'utf8');
}

if (cmd === 'claim') {
  const [domain, agent] = args;
  if (!domain || !agent) { console.error('Usage: agent-pull.js claim <domain> <agent>'); process.exit(1); }

  const now = new Date().toISOString();
  const task = db.prepare(`
    UPDATE tasks
    SET status = 'in_progress', assignee = ?, claimed_at = ?, updated_at = ?
    WHERE id = (
      SELECT id FROM tasks
      WHERE domain = ? AND status = 'pending'
      ORDER BY ${PRIORITY_SQL}, created_at ASC
      LIMIT 1
    )
    RETURNING *
  `).get(agent, now, now, domain);

  if (!task) { console.log('NO_TASKS'); process.exit(0); }

  regenerateReadable();

  const gate = readFileSync(GATE_PATH, 'utf8');
  console.log(gate);
  console.log('\n--- TASK ---');
  console.log(`TASK_ID:  ${task.id}`);
  console.log(`TITLE:    ${task.title}`);
  console.log(`DOMAIN:   ${task.domain}`);
  if (task.thread)     console.log(`THREAD:   ${task.thread}`);
  if (task.wo_ref)     console.log(`WO_REF:   ${task.wo_ref}`);
  if (task.backlog_ref) console.log(`BACKLOG:  ${task.backlog_ref}`);
  console.log('\n' + task.payload);

} else if (cmd === 'done') {
  const [id] = args;
  if (!id) { console.error('Usage: agent-pull.js done <task-id>'); process.exit(1); }

  db.prepare(`UPDATE tasks SET status = 'done', updated_at = ? WHERE id = ?`)
    .run(new Date().toISOString(), id);
  regenerateReadable();
  console.log(`✅ Task ${id} marcada como done.`);

} else if (cmd === 'fail') {
  const [id, ...reasonParts] = args;
  if (!id) { console.error('Usage: agent-pull.js fail <task-id> [reason]'); process.exit(1); }

  const reason = reasonParts.join(' ') || null;
  db.prepare(`UPDATE tasks SET status = 'failed', fail_reason = ?, updated_at = ? WHERE id = ?`)
    .run(reason, new Date().toISOString(), id);
  regenerateReadable();
  console.log(`❌ Task ${id} marcada como failed. Motivo: ${reason ?? '(sem motivo)'}`);

} else {
  console.error(`Subcomando desconhecido: ${cmd}. Use: claim | done | fail`);
  process.exit(1);
}
```

---

### 3. npm scripts — `package.json` na raiz

Adicionar aos scripts existentes:

```json
"squad:claim:hive": "node scripts/agent-pull.js claim hive copilot-hive",
"squad:claim:tos":  "node scripts/agent-pull.js claim product copilot-tos",
"squad:task:done":  "node scripts/agent-pull.js done",
"squad:task:fail":  "node scripts/agent-pull.js fail"
```

**Uso na sessão do Copilot-Hive:**

```bash
# Início de sessão — puxa próxima task e ativa Cognitive Reset Gate:
npm run squad:claim:hive

# Ao concluir:
npm run squad:task:done -- <task-id>

# Se falhar:
npm run squad:task:fail -- <task-id> "motivo em texto livre"
```

---

### 4. Protocolo de sessão (documentar em `proxy.sh` ou `README` da sessão)

Nenhum código a alterar no `proxy.sh` nesta fase — apenas documentar no cabeçalho do script ou
numa nota em `beehive/roles/copilot.md`:

> **Início de sessão Copilot-Hive (Fase 2+):** executar `npm run squad:claim:hive` antes de
> qualquer leitura de inbox. Se retornar `NO_TASKS`, verificar `inbox-copilot-hive.md` como
> fallback (inbox MD ainda é escrito em dual-write até a Fase 3).

---

## Critérios de Aceite

- [ ] `schema.sql` contém coluna `fail_reason TEXT`
- [ ] `SqliteTaskStore` aplica `ALTER TABLE ... ADD COLUMN fail_reason TEXT` com catch silencioso para DBs existentes
- [ ] `SqliteTaskStore.failTask` persiste `reason` na coluna `fail_reason`
- [ ] `scripts/agent-pull.js` criado e funcional para os três subcomandos
- [ ] `npm run squad:claim:hive` retorna gate + payload ou `NO_TASKS`
- [ ] Output do `claim` inclui conteúdo de `cognitive-reset-gate.md` antes do payload
- [ ] `.hive-agent/tasks-readable.md` é regenerado após cada operação de mutação
- [ ] `npm run squad:task:done -- <id>` marca task como `done`
- [ ] `npm run squad:task:fail -- <id> "razão"` marca task como `failed` com `fail_reason` persistido
- [ ] `npm run squad:tasks` (WO-045) continua funcional
- [ ] Inbox MD continua sendo escrito pelo Dispatcher (dual-write intacto)
- [ ] `check:types` passa no orchestrator

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 8–12 (1 sessão Copilot-Hive) |
| Confiança | Alta — nenhuma mudança no fluxo existente; apenas adição de CLI e migração de coluna |
| Valor gerado | Loop pull operacional; DT-008 quitado; Cognitive Reset Gate ativo no claim |
| Payback | Imediato — próxima sessão Copilot-Hive já opera em modo pull |
| Custo de não fazer | Copilot-Hive permanece no modelo inbox-MD frágil após Balcão estar disponível |

## Habilita

- Fase 3 (após 2 semanas de validação do pull): remoção do dispatcher de texto para domínios migrados, depreciação de `locks.json`

---

*Assinado: Claude (Arquiteto)*
*Dev: Claude - Arquiteto*

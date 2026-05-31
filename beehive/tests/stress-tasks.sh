#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TMP_DIR="$(mktemp -d)"
FAILURES=0
WORKER_COUNT=50

cleanup() {
  if [[ -d "$TMP_DIR" ]]; then
    find "$TMP_DIR" -type d -path '*/beehive/construcao' -exec chmod u+w {} + 2>/dev/null || true
    rm -rf "$TMP_DIR"
  fi
}
trap cleanup EXIT

pass() {
  printf 'PASS: %s\n' "$1"
}

fail() {
  printf 'FAIL: %s\n' "$1"
}

setup_workspace() {
  local workspace="$1"

  mkdir -p \
    "$workspace/.agile-squad" \
    "$workspace/.hive-agent" \
    "$workspace/beehive/construcao" \
    "$workspace/beehive/apps/orchestrator/src/db"

  ln -s "$ROOT_DIR/beehive/apps/orchestrator/src/db/schema.sql" \
    "$workspace/beehive/apps/orchestrator/src/db/schema.sql"

  cat >"$workspace/.agile-squad/proxy.sh" <<'EOF'
#!/usr/bin/env bash
exit 0
EOF
  chmod +x "$workspace/.agile-squad/proxy.sh"

  printf '' >"$workspace/beehive/construcao/inbox-claude.md"
  printf '' >"$workspace/beehive/construcao/inbox-copilot-hive.md"
  printf '' >"$workspace/beehive/construcao/inbox-copilot-tos.md"
  printf '' >"$workspace/beehive/construcao/inbox-copilot.md"
  printf '' >"$workspace/beehive/construcao/inbox-gemini.md"
}

run_section() {
  local label="$1"
  local success_message="$2"
  local fn="$3"

  printf '==> %s\n' "$label"
  set +e
  "$fn"
  local status=$?
  set -e

  if [[ $status -eq 0 ]]; then
    pass "$success_message"
  else
    fail "$success_message"
    FAILURES=$((FAILURES + 1))
  fi
}

stress_unique_concurrency() {
  local workspace="$TMP_DIR/concurrency"
  setup_workspace "$workspace"

  local -a pids=()
  for worker in $(seq 0 $((WORKER_COUNT - 1))); do
    ROOT_DIR="$ROOT_DIR" WORKSPACE="$workspace" WORKER="$worker" node <<'NODE' &
const path = require('node:path');
const { SqliteTaskStore } = require(path.join(
  process.env.ROOT_DIR,
  'beehive/apps/orchestrator/dist/db/sqlite-task-store.js',
));

(async () => {
  const store = new SqliteTaskStore(process.env.WORKSPACE);
  const worker = Number(process.env.WORKER);

  await store.createTask({
    id: `concurrency-${worker}`,
    title: `Concurrency ${worker}`,
    domain: 'hive',
    payload: `payload-${worker}`,
    status: 'pending',
    assignee: 'copilot-hive',
    priority: 'normal',
    thread: 'arquitetura-balcao-central',
    backlog_ref: 'HIVE-037',
    wo_ref: 'WO-047',
    source_agent: 'claude',
    source_entry: `source-${worker}`,
    claimed_at: null,
  });
})().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
NODE
    pids+=("$!")
  done

  local status=0
  for pid in "${pids[@]}"; do
    if ! wait "$pid"; then
      status=1
    fi
  done
  [[ $status -eq 0 ]] || return $status

  ROOT_DIR="$ROOT_DIR" WORKSPACE="$workspace" node <<'NODE'
const path = require('node:path');
const { createRequire } = require('node:module');

const requireFromOrchestrator = createRequire(
  path.join(process.env.ROOT_DIR, 'beehive/apps/orchestrator/package.json'),
);
const Database = requireFromOrchestrator('better-sqlite3');
const dbPath = path.join(process.env.WORKSPACE, '.hive-agent', 'tasks.db');
const db = new Database(dbPath, { readonly: true });

const count = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
const integrity = db.pragma('integrity_check', { simple: true });

if (count !== 50) {
  throw new Error(`Expected 50 unique rows, got ${count}`);
}

if (integrity !== 'ok') {
  throw new Error(`SQLite integrity_check failed: ${integrity}`);
}

console.log(JSON.stringify({ dbPath, count, integrity }));
NODE
}

stress_dispatcher_idempotency() {
  local workspace="$TMP_DIR/idempotency"
  setup_workspace "$workspace"

  ROOT_DIR="$ROOT_DIR" WORKSPACE="$workspace" node <<'NODE'
const fs = require('node:fs/promises');
const path = require('node:path');
const { createRequire } = require('node:module');

const rootDir = process.env.ROOT_DIR;
const workspace = process.env.WORKSPACE;
const { Dispatcher } = require(path.join(rootDir, 'beehive/apps/orchestrator/dist/dispatcher.js'));
const { StateStore } = require(path.join(rootDir, 'beehive/apps/orchestrator/dist/state.js'));
const { SqliteTaskStore } = require(path.join(
  rootDir,
  'beehive/apps/orchestrator/dist/db/sqlite-task-store.js',
));
const requireFromOrchestrator = createRequire(
  path.join(rootDir, 'beehive/apps/orchestrator/package.json'),
);
const Database = requireFromOrchestrator('better-sqlite3');

(async () => {
  const stateStore = new StateStore(workspace);
  const taskStore = new SqliteTaskStore(workspace);
  const dispatcher = new Dispatcher(workspace, stateStore, { log: async () => {} }, taskStore);

  const entry = {
    id: 'STRESS-IDEMPOTENCY-001',
    title: 'Stress duplicate dispatch',
    source: 'claude',
    filePath: path.join(workspace, 'beehive/construcao/inbox-claude.md'),
    status: 'pendente',
    tipo: 'handoff-executavel',
    destinatario: 'copilot-hive',
    bodyText: 'Repeated dispatch payload',
    metadata: {
      thread: 'arquitetura-balcao-central',
      backlog_ref: 'HIVE-037',
      wo_ref: 'WO-047',
    },
  };

  const decision = {
    action: 'dispatch_to_copilot_hive',
    target: 'copilot-hive',
  };

  for (let i = 0; i < 3; i += 1) {
    const result = await dispatcher.dispatch(decision, entry);
    if (result.outcome !== 'dispatched') {
      throw new Error(`Expected dispatch attempt ${i + 1} to be dispatched, got ${result.outcome}`);
    }
  }

  const db = new Database(path.join(workspace, '.hive-agent', 'tasks.db'), { readonly: true });
  const task = db
    .prepare(
      'SELECT id, created_at, updated_at, source_entry, assignee FROM tasks WHERE id = ?',
    )
    .get('STRESS-IDEMPOTENCY-001-copilot-hive');
  const count = db
    .prepare('SELECT COUNT(*) AS count FROM tasks WHERE id = ?')
    .get('STRESS-IDEMPOTENCY-001-copilot-hive').count;

  if (!task) {
    throw new Error('Expected idempotency task row to exist');
  }

  if (count !== 1) {
    throw new Error(`Expected exactly one task row for repeated dispatch, got ${count}`);
  }

  const state = await stateStore.readState();
  if (!state || state.processedEntries.filter((value) => value === 'STRESS-IDEMPOTENCY-001').length !== 1) {
    throw new Error('Expected processedEntries to contain the source entry exactly once');
  }

  console.log(
    JSON.stringify({
      count,
      created_at: task.created_at,
      updated_at: task.updated_at,
      source_entry: task.source_entry,
      assignee: task.assignee,
    }),
  );
})().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
NODE
}

printf '==> Building orchestrator dist\n'
npm run squad:orchestrator:build >/dev/null

run_section \
  'Stress 1/2: 50 rapid concurrent inserts with unique IDs' \
  '50 unique inserts completed without corruption' \
  stress_unique_concurrency

run_section \
  'Stress 2/2: dispatcher idempotency for repeated inbox entry' \
  'repeated dispatches produced one task row and one processed entry' \
  stress_dispatcher_idempotency

if [[ $FAILURES -eq 0 ]]; then
  printf '==> WO-047 stress suite completed successfully\n'
else
  printf '==> WO-047 stress suite found %d failing scenario(s)\n' "$FAILURES"
  exit 1
fi

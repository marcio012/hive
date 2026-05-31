#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
TMP_DIR="$(mktemp -d)"
TEST_REPO="$TMP_DIR/workspace"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$TEST_REPO/scripts" "$TEST_REPO/beehive/apps" "$TEST_REPO/beehive/roles" "$TEST_REPO/.hive-agent"
printf '{ "name": "temp-workspace", "private": true }\n' > "$TEST_REPO/package.json"
cp "$HIVE_HOME/scripts/agent-pull.js" "$TEST_REPO/scripts/agent-pull.js"
ln -s "$HIVE_HOME/beehive/apps/orchestrator" "$TEST_REPO/beehive/apps/orchestrator"
ln -s "$HIVE_HOME/beehive/roles/skills" "$TEST_REPO/beehive/roles/skills"

assert_output_contains() {
  local output="$1"
  local expected="$2"
  if [[ "$output" != *"$expected"* ]]; then
    echo "Assertion failed: expected output to contain '$expected'"
    echo "$output"
    exit 1
  fi
}

assert_output_not_contains() {
  local output="$1"
  local unexpected="$2"
  if [[ "$output" == *"$unexpected"* ]]; then
    echo "Assertion failed: expected output not to contain '$unexpected'"
    echo "$output"
    exit 1
  fi
}

assert_file_contains() {
  local file="$1"
  local pattern="$2"
  if ! grep -Fq "$pattern" "$file"; then
    echo "Assertion failed: expected '$pattern' in $file"
    exit 1
  fi
}

assert_failure_contains() {
  local expected="$1"
  shift
  local output
  set +e
  output="$("$@" 2>&1)"
  local status=$?
  set -e
  if [[ $status -eq 0 ]]; then
    echo "Assertion failed: command should fail: $*"
    exit 1
  fi
  assert_output_contains "$output" "$expected"
}

db_query() {
  local sql="$1"
  (
    cd "$TEST_REPO"
    DB_SQL="$sql" TEST_REPO="$TEST_REPO" node --input-type=commonjs <<'EOF'
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const repo = process.env.TEST_REPO;
const sql = process.env.DB_SQL;
const requireFromOrchestrator = createRequire(path.join(repo, 'beehive', 'apps', 'orchestrator', 'package.json'));
const Database = requireFromOrchestrator('better-sqlite3');
const db = new Database(path.join(repo, '.hive-agent', 'tasks.db'), { readonly: true });
const row = db.prepare(sql).get();
if (row) {
  const firstValue = row[Object.keys(row)[0]];
  process.stdout.write(String(firstValue));
}
EOF
  )
}

DB_SQL="" TEST_REPO="$TEST_REPO" node --input-type=commonjs <<'EOF'
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const repo = process.env.TEST_REPO;
const requireFromOrchestrator = createRequire(path.join(repo, 'beehive', 'apps', 'orchestrator', 'package.json'));
const Database = requireFromOrchestrator('better-sqlite3');
const db = new Database(path.join(repo, '.hive-agent', 'tasks.db'));
const schemaPath = path.join(repo, 'beehive', 'apps', 'orchestrator', 'src', 'db', 'schema.sql');

db.exec(fs.readFileSync(schemaPath, 'utf8'));

const insert = db.prepare(`
  INSERT INTO tasks (
    id, title, domain, payload, status, assignee, priority,
    thread, backlog_ref, wo_ref, source_agent, source_entry,
    fail_reason, created_at, updated_at, claimed_at
  ) VALUES (
    @id, @title, @domain, @payload, @status, @assignee, @priority,
    @thread, @backlog_ref, @wo_ref, @source_agent, @source_entry,
    @fail_reason, @created_at, @updated_at, @claimed_at
  )
`);

const rows = [
  {
    id: 'task-gemini',
    title: 'Gemini only',
    domain: 'hive',
    payload: 'payload gemini',
    status: 'pending',
    assignee: 'gemini',
    priority: 'normal',
    thread: null,
    backlog_ref: null,
    wo_ref: null,
    source_agent: 'claude',
    source_entry: 'entry-1',
    fail_reason: null,
    created_at: '2026-05-31T20:00:00.000Z',
    updated_at: '2026-05-31T20:00:00.000Z',
    claimed_at: null,
  },
  {
    id: 'task-own',
    title: 'Copilot Hive only',
    domain: 'hive',
    payload: 'payload own',
    status: 'pending',
    assignee: 'copilot-hive',
    priority: 'normal',
    thread: null,
    backlog_ref: null,
    wo_ref: null,
    source_agent: 'claude',
    source_entry: 'entry-2',
    fail_reason: null,
    created_at: '2026-05-31T20:01:00.000Z',
    updated_at: '2026-05-31T20:01:00.000Z',
    claimed_at: null,
  },
  {
    id: 'task-pool',
    title: 'Open pool',
    domain: 'hive',
    payload: 'payload pool',
    status: 'pending',
    assignee: null,
    priority: 'normal',
    thread: null,
    backlog_ref: null,
    wo_ref: null,
    source_agent: 'claude',
    source_entry: 'entry-3',
    fail_reason: null,
    created_at: '2026-05-31T20:02:00.000Z',
    updated_at: '2026-05-31T20:02:00.000Z',
    claimed_at: null,
  },
];

for (const row of rows) {
  insert.run(row);
}
EOF

CLAIM_ONE="$(
  cd "$TEST_REPO" &&
  node scripts/agent-pull.js claim hive copilot-hive
)"
assert_output_contains "$CLAIM_ONE" "TASK_ID:  task-own"
assert_output_not_contains "$CLAIM_ONE" "TASK_ID:  task-gemini"

assert_output_contains "$(db_query "SELECT status FROM tasks WHERE id = 'task-own'")" "in_progress"
assert_output_contains "$(db_query "SELECT assignee FROM tasks WHERE id = 'task-own'")" "copilot-hive"

CLAIM_TWO="$(
  cd "$TEST_REPO" &&
  node scripts/agent-pull.js claim hive copilot-hive
)"
assert_output_contains "$CLAIM_TWO" "TASK_ID:  task-pool"

CLAIM_THREE="$(
  cd "$TEST_REPO" &&
  node scripts/agent-pull.js claim hive copilot-hive
)"
assert_output_contains "$CLAIM_THREE" "NO_TASKS"

assert_file_contains "$TEST_REPO/.hive-agent/tasks-readable.md" "| ID | Domain | Assignee | Priority | Title |"
assert_file_contains "$TEST_REPO/.hive-agent/tasks-readable.md" "| task-gemini | hive | gemini | normal | Gemini only |"

(
  cd "$TEST_REPO" &&
  node scripts/agent-pull.js done task-own
)

assert_failure_contains "não encontrada ou não está 'in_progress'" bash -lc "cd '$TEST_REPO' && node scripts/agent-pull.js fail task-own should-not-work"

(
  cd "$TEST_REPO" &&
  node scripts/agent-pull.js fail task-pool broker-timeout
)

assert_output_contains "$(db_query "SELECT status FROM tasks WHERE id = 'task-pool'")" "failed"
assert_output_contains "$(db_query "SELECT fail_reason FROM tasks WHERE id = 'task-pool'")" "broker-timeout"

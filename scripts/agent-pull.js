#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, '.hive-agent', 'tasks.db');
const READABLE_PATH = path.join(ROOT, '.hive-agent', 'tasks-readable.md');
const GATE_PATH = path.join(ROOT, 'beehive', 'roles', 'skills', 'cognitive-reset-gate.md');
const PRIORITY_SQL = "CASE priority WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END";

const requireFromOrchestrator = createRequire(
  path.join(ROOT, 'beehive', 'apps', 'orchestrator', 'package.json'),
);

const Database = requireFromOrchestrator('better-sqlite3');

const [, , cmd, ...args] = process.argv;

function usage(message) {
  if (message) {
    console.error(message);
  }

  console.error('Usage: agent-pull.js claim <domain> <agent> | done <task-id> | fail <task-id> [reason]');
  process.exit(1);
}

function openDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    if (cmd === 'claim') {
      console.log('NO_TASKS');
      process.exit(0);
    }

    console.error(`Database not found: ${DB_PATH}`);
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  db.pragma('busy_timeout = 5000');

  const hasTasksTable = db
    .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'tasks'")
    .get();

  if (!hasTasksTable) {
    if (cmd === 'claim') {
      console.log('NO_TASKS');
      process.exit(0);
    }

    console.error(`Tasks table not found in ${DB_PATH}`);
    process.exit(1);
  }

  return db;
}

function escapeCell(value) {
  return String(value ?? '-').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
}

function rowsToTable(rows, columns) {
  if (rows.length === 0) {
    return '_nenhuma_\n';
  }

  return `${rows.map((row) => `| ${columns.map((column) => escapeCell(row[column])).join(' | ')} |`).join('\n')}\n`;
}

function regenerateReadable(db) {
  const inProgress = db
    .prepare(
      `
        SELECT id, domain, assignee, title
        FROM tasks
        WHERE status = 'in_progress'
        ORDER BY claimed_at ASC, updated_at ASC
      `,
    )
    .all();

  const pending = db
    .prepare(
      `
        SELECT id, domain, priority, title
        FROM tasks
        WHERE status = 'pending'
        ORDER BY ${PRIORITY_SQL}, created_at ASC
      `,
    )
    .all();

  const content =
    `# Tasks - Balcao Central\n> Gerado automaticamente em ${new Date().toISOString()}. Nao editar.\n\n` +
    `## in_progress\n| ID | Domain | Agent | Title |\n|---|---|---|---|\n${rowsToTable(inProgress, ['id', 'domain', 'assignee', 'title'])}\n` +
    `## pending\n| ID | Domain | Priority | Title |\n|---|---|---|---|\n${rowsToTable(pending, ['id', 'domain', 'priority', 'title'])}`;

  fs.mkdirSync(path.dirname(READABLE_PATH), { recursive: true });
  fs.writeFileSync(READABLE_PATH, content, 'utf8');
}

function claim(db, domain, agent) {
  if (!domain || !agent) {
    usage('Usage: agent-pull.js claim <domain> <agent>');
  }

  const now = new Date().toISOString();
  const task =
    db
      .prepare(
        `
          UPDATE tasks
          SET status = 'in_progress',
              assignee = ?,
              claimed_at = ?,
              updated_at = ?
          WHERE id = (
            SELECT id
            FROM tasks
            WHERE domain = ? AND status = 'pending'
            ORDER BY ${PRIORITY_SQL}, created_at ASC
            LIMIT 1
          )
          RETURNING *
        `,
      )
      .get(agent, now, now, domain) ?? null;

  if (!task) {
    console.log('NO_TASKS');
    return;
  }

  regenerateReadable(db);

  const gate = fs.readFileSync(GATE_PATH, 'utf8').trimEnd();
  console.log(gate);
  console.log('\n--- TASK ---');
  console.log(`TASK_ID: ${task.id}`);
  console.log(`TITLE: ${task.title}`);
  console.log(`DOMAIN: ${task.domain}`);
  if (task.thread) {
    console.log(`THREAD: ${task.thread}`);
  }
  if (task.wo_ref) {
    console.log(`WO_REF: ${task.wo_ref}`);
  }
  console.log(`\n${task.payload}`);
}

function updateStatus(db, id, status, reason) {
  if (!id) {
    usage(`Usage: agent-pull.js ${status === 'done' ? 'done <task-id>' : 'fail <task-id> [reason]'}`);
  }

  const now = new Date().toISOString();
  const result =
    status === 'failed'
      ? db
          .prepare(
            `
              UPDATE tasks
              SET status = 'failed',
                  fail_reason = ?,
                  updated_at = ?
              WHERE id = ?
            `,
          )
          .run(reason ?? null, now, id)
      : db
          .prepare(
            `
              UPDATE tasks
              SET status = 'done',
                  updated_at = ?
              WHERE id = ?
            `,
          )
          .run(now, id);

  if (result.changes === 0) {
    console.error(`Task ${id} not found.`);
    process.exit(1);
  }

  regenerateReadable(db);

  if (status === 'failed') {
    const failReason = reason && reason.length > 0 ? reason : '(sem motivo)';
    console.log(`Task ${id} marcada como failed. Motivo: ${failReason}`);
    return;
  }

  console.log(`Task ${id} marcada como done.`);
}

const db = openDatabase();

if (cmd === 'claim') {
  claim(db, args[0], args[1]);
} else if (cmd === 'done') {
  updateStatus(db, args[0], 'done');
} else if (cmd === 'fail') {
  updateStatus(db, args[0], 'failed', args.slice(1).join(' '));
} else {
  usage(`Subcomando desconhecido: ${cmd}.`);
}

#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, '.hive-agent', 'tasks.db');

if (!fs.existsSync(dbPath)) {
  console.log('[]');
  process.exit(0);
}

const requireFromOrchestrator = createRequire(
  path.join(rootDir, 'beehive', 'apps', 'orchestrator', 'package.json'),
);
const Database = requireFromOrchestrator('better-sqlite3');
const db = new Database(dbPath, { readonly: true });

db.pragma('busy_timeout = 3000');

const tasks = db
  .prepare(
    `
      SELECT id, title, domain, status, assignee, priority,
             thread, backlog_ref, wo_ref, fail_reason,
             created_at, updated_at, claimed_at
      FROM tasks
      WHERE status IN ('pending', 'in_progress')
      ORDER BY
        CASE priority
          WHEN 'urgent' THEN 0
          WHEN 'normal' THEN 1
          ELSE 2
        END,
        created_at ASC
    `,
  )
  .all();

console.log(JSON.stringify(tasks));

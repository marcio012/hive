#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, '.hive-agent', 'tasks.db');

if (!fs.existsSync(dbPath)) {
  console.log('No tasks found (.hive-agent/tasks.db is missing).');
  process.exit(0);
}

const requireFromOrchestrator = createRequire(
  path.join(rootDir, 'beehive', 'apps', 'orchestrator', 'package.json'),
);
const Database = requireFromOrchestrator('better-sqlite3');
const db = new Database(dbPath, { readonly: true });

const rows = db
  .prepare(
    `
      SELECT id, domain, status, assignee, title
      FROM tasks
      ORDER BY
        domain ASC,
        CASE status
          WHEN 'pending' THEN 0
          WHEN 'in_progress' THEN 1
          WHEN 'failed' THEN 2
          ELSE 3
        END,
        created_at ASC
    `,
  )
  .all();

if (rows.length === 0) {
  console.log('No tasks found.');
  process.exit(0);
}

console.log('ID | domain | status | assignee | title');
for (const row of rows) {
  console.log(`${row.id} | ${row.domain} | ${row.status} | ${row.assignee} | ${row.title}`);
}

'use strict';

/**
 * CLI de Pull para Agentes do Hive OS
 * Parte da Fase 2 do Balcão Central (DEBATE-037 / WO-046)
 */

const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const path = require('path');
const { createRequire } = require('node:module');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, '.hive-agent', 'tasks.db');
const READABLE_PATH = path.join(ROOT, '.hive-agent', 'tasks-readable.md');
const GATE_PATH = path.join(ROOT, 'beehive', 'roles', 'skills', 'cognitive-reset-gate.md');
const requireFromOrchestrator = createRequire(
  path.join(ROOT, 'beehive', 'apps', 'orchestrator', 'package.json'),
);
const Database = requireFromOrchestrator('better-sqlite3');

const PRIORITY_SQL = "CASE priority WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END";
const CLAIMABLE_SQL = '(assignee IS NULL OR assignee = ?)';

const [, , cmd, ...args] = process.argv;

if (!existsSync(DB_PATH)) {
  console.error(`Erro: Banco de dados não encontrado em ${DB_PATH}. O Orchestrator Core já foi iniciado?`);
  process.exit(1);
}

const db = new Database(DB_PATH);
db.pragma('busy_timeout = 5000');

function regenerateReadable() {
  const inProgress = db
    .prepare(`SELECT * FROM tasks WHERE status = 'in_progress' ORDER BY claimed_at ASC`)
    .all();
  const pending = db
    .prepare(`SELECT * FROM tasks WHERE status = 'pending' ORDER BY ${PRIORITY_SQL}, created_at ASC`)
    .all();

  const renderRows = (tasks) =>
    tasks.length === 0
      ? '_nenhuma_\n'
      : tasks.map((t) => `| ${t.id} | ${t.domain} | ${t.assignee ?? '-'} | ${t.title} |`).join('\n') + '\n';

  const content =
    `# Tasks — Balcão Central\n` +
    `> Gerado automaticamente em ${new Date().toISOString()}. Não editar.\n\n` +
    `## in_progress\n` +
    `| ID | Domain | Agent | Title |\n` +
    `|---|---|---|---|\n` +
    renderRows(inProgress) +
    `\n## pending\n` +
    `| ID | Domain | Assignee | Priority | Title |\n` +
    `|---|---|---|---|---|\n` +
    (pending.length === 0 
      ? '_nenhuma_\n' 
      : pending
          .map((t) => `| ${t.id} | ${t.domain} | ${t.assignee ?? 'pool'} | ${t.priority} | ${t.title} |`)
          .join('\n') + '\n');

  mkdirSync(path.dirname(READABLE_PATH), { recursive: true });
  writeFileSync(READABLE_PATH, content, 'utf8');
}

if (cmd === 'claim') {
  const [domain, agent] = args;
  if (!domain || !agent) {
    console.error('Usage: node scripts/agent-pull.js claim <domain> <agent>');
    process.exit(1);
  }

  const now = new Date().toISOString();
  
  // Claim atômico
  const task = db.prepare(`
    UPDATE tasks
    SET status = 'in_progress', assignee = ?, claimed_at = ?, updated_at = ?
    WHERE id = (
      SELECT id FROM tasks
      WHERE domain = ? AND status = 'pending'
        AND ${CLAIMABLE_SQL}
      ORDER BY ${PRIORITY_SQL}, created_at ASC
      LIMIT 1
    )
    RETURNING *
  `).get(agent, now, now, domain, agent);

  if (!task) {
    console.log('NO_TASKS');
    process.exit(0);
  }

  regenerateReadable();

  // Injeção do Cognitive Reset Gate
  if (existsSync(GATE_PATH)) {
    const gate = readFileSync(GATE_PATH, 'utf8');
    console.log(gate);
  } else {
    console.warn(`[aviso] Cognitive Reset Gate não encontrado em ${GATE_PATH}`);
  }

  console.log('\n--- TASK ---');
  console.log(`TASK_ID:  ${task.id}`);
  console.log(`TITLE:    ${task.title}`);
  console.log(`DOMAIN:   ${task.domain}`);
  if (task.thread)      console.log(`THREAD:   ${task.thread}`);
  if (task.wo_ref)      console.log(`WO_REF:   ${task.wo_ref}`);
  if (task.backlog_ref) console.log(`BACKLOG:  ${task.backlog_ref}`);
  
  console.log('\n' + task.payload);

} else if (cmd === 'done') {
  const [id] = args;
  if (!id) {
    console.error('Usage: node scripts/agent-pull.js done <task-id>');
    process.exit(1);
  }

  const result = db.prepare(`UPDATE tasks SET status = 'done', updated_at = ? WHERE id = ? AND status = 'in_progress'`)
    .run(new Date().toISOString(), id);

  if (result.changes === 0) {
    console.error(`Erro: Task ${id} não encontrada ou não está 'in_progress'.`);
    process.exit(1);
  }

  regenerateReadable();
  console.log(`✅ Task ${id} marcada como done.`);

} else if (cmd === 'fail') {
  const [id, ...reasonParts] = args;
  if (!id) {
    console.error('Usage: node scripts/agent-pull.js fail <task-id> [reason]');
    process.exit(1);
  }

  const reason = reasonParts.join(' ') || null;
  const result = db.prepare(`UPDATE tasks SET status = 'failed', fail_reason = ?, updated_at = ? WHERE id = ? AND status = 'in_progress'`)
    .run(reason, new Date().toISOString(), id);

  if (result.changes === 0) {
    console.error(`Erro: Task ${id} não encontrada ou não está 'in_progress'.`);
    process.exit(1);
  }

  regenerateReadable();
  console.log(`❌ Task ${id} marcada como failed. Motivo: ${reason ?? '(sem motivo)'}`);

} else {
  console.error(`Subcomando desconhecido: ${cmd}. Use: claim | done | fail`);
  process.exit(1);
}

import Database from 'better-sqlite3';
import { mkdirSync, readFileSync } from 'fs';
import * as path from 'path';

import { AgentName, ClaimResult, Task, TaskDomain } from '../types';
import { TaskStore } from './task-store';

function priorityOrderSql(column = 'priority'): string {
  return `CASE ${column} WHEN 'urgent' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END`;
}

export class SqliteTaskStore implements TaskStore {
  private readonly db: Database.Database;

  constructor(private readonly rootDir: string) {
    const dbPath = path.join(rootDir, '.hive-agent', 'tasks.db');
    const schemaPath = path.join(rootDir, 'beehive', 'apps', 'orchestrator', 'src', 'db', 'schema.sql');

    mkdirSync(path.dirname(dbPath), { recursive: true });

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('busy_timeout = 5000');
    this.db.pragma('foreign_keys = ON');
    this.db.exec(readFileSync(schemaPath, 'utf8'));
    this.applyMigrations();
  }

  private applyMigrations(): void {
    const migrations: Array<{ version: number; up: () => void }> = [
      {
        version: 1,
        up: () => {
          const cols = this.db.pragma('table_info(tasks)') as { name: string }[];
          if (!cols.some((c) => c.name === 'fail_reason')) {
            this.db.exec('ALTER TABLE tasks ADD COLUMN fail_reason TEXT');
          }
        },
      },
    ];

    for (const migration of migrations) {
      const applied = this.db
        .prepare('SELECT version FROM schema_migrations WHERE version = ?')
        .get(migration.version) as { version: number } | undefined;

      if (applied) {
        continue;
      }

      migration.up();
      this.db
        .prepare('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)')
        .run(migration.version, new Date().toISOString());
    }
  }

  async createTask(task: Omit<Task, 'created_at' | 'updated_at'>): Promise<Task> {
    const now = new Date().toISOString();

    this.db
      .prepare(
        `
          INSERT OR IGNORE INTO tasks (
            id,
            title,
            domain,
            payload,
            status,
            assignee,
            priority,
            thread,
            backlog_ref,
            wo_ref,
            source_agent,
            source_entry,
            created_at,
            updated_at,
            claimed_at
          ) VALUES (
            @id,
            @title,
            @domain,
            @payload,
            @status,
            @assignee,
            @priority,
            @thread,
            @backlog_ref,
            @wo_ref,
            @source_agent,
            @source_entry,
            @created_at,
            @updated_at,
            @claimed_at
          )
        `,
      )
      .run({
        ...task,
        created_at: now,
        updated_at: now,
      });

    return this.readTask(task.id);
  }

  async claimTask(domain: TaskDomain, agent: AgentName): Promise<ClaimResult> {
    const now = new Date().toISOString();
    const task =
      (this.db
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
              ORDER BY ${priorityOrderSql()}, created_at ASC
              LIMIT 1
            )
            RETURNING *
          `,
        )
        .get(agent, now, now, domain) as Task | undefined) ?? null;

    return {
      claimed: task !== null,
      task,
    };
  }

  async completeTask(id: string): Promise<void> {
    this.db
      .prepare(
        `
          UPDATE tasks
          SET status = 'done',
              updated_at = ?
          WHERE id = ?
        `,
      )
      .run(new Date().toISOString(), id);
  }

  async failTask(id: string, reason?: string): Promise<void> {
    this.db
      .prepare(
        `
          UPDATE tasks
          SET status = 'failed',
              fail_reason = ?,
              updated_at = ?
          WHERE id = ?
        `,
      )
      .run(reason ?? null, new Date().toISOString(), id);
  }

  async listPending(domain?: TaskDomain): Promise<Task[]> {
    if (domain) {
      return this.db
        .prepare(
          `
            SELECT *
            FROM tasks
            WHERE status = 'pending' AND domain = ?
            ORDER BY ${priorityOrderSql()}, created_at ASC
          `,
        )
        .all(domain) as Task[];
    }

    return this.db
      .prepare(
        `
          SELECT *
          FROM tasks
          WHERE status = 'pending'
          ORDER BY domain ASC, ${priorityOrderSql()}, created_at ASC
        `,
      )
      .all() as Task[];
  }

  private readTask(id: string): Task {
    const task = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;

    if (!task) {
      throw new Error(`Task ${id} was not persisted to SQLite`);
    }

    return task;
  }
}

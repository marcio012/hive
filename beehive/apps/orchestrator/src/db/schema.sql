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
  fail_reason  TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  claimed_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_tasks_domain_status
  ON tasks(domain, status, priority, created_at);

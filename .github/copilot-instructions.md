# Copilot instructions for this repository

## Validation

- `npm run setup` installs dependencies and activates `.githooks/`.
- `bash beehive/tests/test-gemini-role-guard.sh` is the repository integration test.
- `npm run squad:gate` is the final Hive quality gate.

## Runtime shape

- Root scripts are proxies; prefer `npm run squad:*`, `npm run gemini:*`, and `npm run po:demand`.
- `beehive/` is the framework core; `.hive-agent/` is the local bridge/state for the current workspace.
- Node `24.7.0` is required.

## Boot hygiene

- Keep init lean: do **not** re-read stable governance files on every turn.
- Default session bootstrap is:
  1. `npm run squad:session:copilot`
  2. `.hive-agent/session-state.env`
  3. `npm run squad:inbox -- copilot` or the active inbox file
- Read stable references (`AGENTS.md`, `COPILOT.md`, `beehive/.copilot/COPILOT.md`, `beehive/roles/roles.yaml`, `beehive/cognition/diretrizes.md`) only on cold start, governance change, or when the handoff/NEXT_STEP points there.

## Operating rules

- **STRICT PRIVACY:** Never read, index, or reference any file inside `beehive/cognition/ideario_hive/`. This is a private area for the Director and the Integrator.
- Copilot is the executor; if scope, governance, or design is ambiguous, escalate to Claude.
- Inbox files under `beehive/construcao/` are append-only: update `status`, never delete entries.
- Multi-repo execution requires `workspace_hive`, `workspace_target`, `repo_target`, and `cwd_exec`.
- `.githooks/commit-msg` enforces Conventional Commits, `Approved by: Márcio`, `Dev: Nome - Papel` for non-Márcio committers, and rejects `Co-authored-by:`.

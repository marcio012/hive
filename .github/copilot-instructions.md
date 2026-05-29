# Copilot instructions for this repository

## Build, test, and validation commands

- `npm run setup` installs the root and sidecar dependencies and activates the local Git hooks from `.githooks/`.
- `bash beehive/tests/test-gemini-role-guard.sh` runs the current automated integration test. This is also the single-test command today because `beehive/tests/` currently exposes one executable test script.
- `npm run squad:gate` runs the Hive quality gate before final approval; it validates the latest commit message and checks for technical evidence in `.hive-agent/output.md`.
- The repository does not currently define dedicated root `build`, `lint`, or multi-test-suite scripts in `package.json`; validation is centered on the shell test above plus the Hive gate commands.

## High-level architecture

- The root `package.json` is a thin command surface. Its scripts forward to `.agile-squad/proxy.sh`, which resolves the Hive paths for the current checkout and delegates execution to `.agile-squad/framework/run.sh`.
- `.agile-squad/framework/` is the isolated sidecar runtime. It enforces Node 24+, exposes the real operational npm scripts, and routes them to `beehive/bin/hive-*.sh`.
- `beehive/` is the operational core of the framework:
  - `roles/roles.yaml` defines the permanent agent responsibilities and escalation paths.
  - `cognition/diretrizes.md` is the global single source of truth for governance and process rules.
  - `construcao/` holds the inboxes, debates, and other active workflow artifacts.
  - `registry/` stores telemetry, acceptance artifacts, reports, and archive data.
  - `tests/` contains shell-based integration coverage for framework behavior.
- `.hive-agent/` is the per-project bridge created by session commands. Session start scripts initialize it, and later commands such as `hive-gate.sh` read files there like `output.md` and session state.
- `beehive/bin/hive-install.sh` shows how the framework is meant to be adopted into another repository: copy the root proxy and sidecar files into the target repo, keep `beehive/` as the operational core, and seed inbox/registry files there.

## Key conventions

- Read order matters. The repository-level entrypoints are `AGENTS.md`, `COPILOT.md`, `beehive/.copilot/COPILOT.md`, `beehive/roles/roles.yaml`, and `beehive/cognition/diretrizes.md`.
- Copilot is an executor here, not the design authority. If a task changes governance, role definitions, or has unresolved design ambiguity, stop and escalate to Claude instead of filling gaps yourself.
- Use the root npm proxy commands (`npm run squad:*`, `npm run gemini:*`, `npm run po:demand`) instead of invoking sidecar internals directly; the proxy layer is how this repo resolves `HIVE_HOME`, `BEEHIVE_PATH`, and `PROJECT_PATH`.
- Session boot is workflow-driven: `npm run squad:inbox -- copilot` scans inbox files and open debates, and `npm run squad:session:copilot` initializes the local `.hive-agent/` bridge for the current project.
- Inbox files in `beehive/construcao/` are append-only. Update `status`, but do not delete entries; open debates can still count as pending work even when no inbox item was materialized yet.
- Multi-repo work is explicit by contract. Handoffs must declare `workspace_hive`, `workspace_target`, `repo_target`, and `cwd_exec`; do not infer an external target repository by broad filesystem search.
- The Git hook in `.githooks/commit-msg` is part of normal workflow, not optional ceremony: commit subjects must use Conventional Commits, the body must include `Approved by: Márcio`, non-Márcio committers must include `Dev: Name - Role`, and `Co-authored-by:` trailers are rejected.
- Node 24 is a real runtime requirement: the root package pins `24.7.0`, and the sidecar runner refuses to execute on older Node versions.

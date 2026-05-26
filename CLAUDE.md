# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Squad governance (read first)

1. `AGENTS.md` — shared entry point for all agents (roles, escalation, permissions)
2. `beehive/.claude/CLAUDE.md` — Claude-specific operational rules (inbox, lock, session bootstrap)
3. `beehive/.claude/PROMPT_CONTEXTO.md` — manual bootstrap when session context is unavailable

Claude's role in this squad: **Architect / Strategist** (`can_write_code: false`). Execution tasks go to Copilot. See `beehive/construcao/agentes/ROLES_CONFIG.yaml`.

---

## Monorepo structure

Three independent Node 18.20.8 apps, each with its own `package.json`, `node_modules`, Prisma schema, and `.env`:

| App | Path | Framework | Purpose |
|---|---|---|---|
| backend | `apps/backend` | Express + Prisma | MVP1: legacy ERP (single-tenant) |
| core | `apps/core` | NestJS + Prisma | MVP2: multi-tenant White Label core |
| frontend | `apps/frontend` | Vite + React + MUI | SPA with per-tenant dynamic theming |

Shared types live in `packages/types`. All three apps depend on PostgreSQL — backend and core use **separate databases**.

### backend (MVP1 — ERP)

Express REST API. Domain logic in `src/domain/`; routes in `src/routes/`; controllers in `src/controllers/`. Prisma schema: `apps/backend/prisma/schema.prisma`. Entities: `Usuario`, `Vendedor`, `Produto`, `Combo`, `Venda`, `MovimentoEstoque`, `FechamentoCaixa`.

### core (MVP2 — White Label)

NestJS modular API. Each feature is a NestJS module under `src/` (e.g., `tenant/`, `produtos/`, `vendas/`, `whatsapp/`, `agente-vendas/`). Prisma schema: `apps/core/prisma/schema.prisma`. Root entity is `Tenant` with all data scoped by `tenant_id`. Integrates Anthropic SDK and Google Generative AI. WhatsApp via Twilio.

### frontend

Multi-tenant React SPA. Theming logic in `src/app/tenant/` — `TenantThemeProvider.tsx` applies per-tenant CSS tokens (colors, logo, branding) fetched from `core`. No hardcoded colors anywhere in components — always via theme variables.

---

## Key commands

All commands run from the **repo root** unless noted.

### Dev (local)

```bash
# Start Postgres via Podman, then run backend watch server
npm run dev:local

# Run only a specific app's dev server
npm run dev:core          # NestJS core
npm --prefix apps/frontend run dev   # Vite frontend
npm --prefix apps/backend run dev    # Express backend (migrates + seeds first)
```

### Type checking

```bash
npm run check:types                  # all three apps
npm --prefix apps/backend run check:types
npm --prefix apps/frontend run check:types
npm --prefix apps/core run check:types
```

### Build

```bash
npm run build                        # all three apps
npm --prefix apps/backend run build  # tsc → dist/
npm --prefix apps/frontend run build # vite build (runs check:types first)
npm --prefix apps/core run build     # nest build → dist/
```

### Tests

```bash
# Backend (tsx — no test runner daemon, runs directly)
npm --prefix apps/backend run test:unit        # domain + all controller tests
npm --prefix apps/backend run test:unit:domain # domain layer only

# Single backend test file
DATABASE_URL=postgresql://fluxo:fluxo123@localhost:5432/fluxopub \
  tsx apps/backend/src/controllers/vendaController.test.ts

# Frontend (Vitest)
npm --prefix apps/frontend run test

# Core (Jest)
npm --prefix apps/core run test
npm --prefix apps/core run test:watch
```

### Database

```bash
# Backend — run pending migrations
npm --prefix apps/backend run db:migrate:deploy

# Core — regenerate Prisma client after schema change
npm --prefix apps/core run db:generate

# Backend — reset DB and re-seed (destructive)
npm --prefix apps/backend run db:reset
```

### HML / Ops

```bash
npm run ops:deploy:hml       # deploy to HML via SSH
npm run ops:smoke:hml        # smoke test against HML
npm run ops:status:hml       # container status on HML
npm run ops:logs:hml         # tail HML logs
```

CI is GitHub Actions (`.github/workflows/ci.yml`). Changes under `ai/`, `docs/`, `.claude/`, and `*.md` are ignored by CI. Never run Jenkins — it is legacy.

---

## HML server

Claude is the only agent with SSH access to HML. Always read `.claude/CLAUDE_HML.md` before any SSH intervention and update it after any state change. SSH alias: `hml-jenkins`. Core env: `~/wl-envs/core.env`.

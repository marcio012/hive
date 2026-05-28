# CLAUDE_HML — Estado do Servidor HML

> Claude é o único agente com acesso SSH ao servidor HML neste projeto.
> Este arquivo é a fonte de verdade do estado do servidor — atualizar após qualquer intervenção.
> Debate pendente: KeyVault para gestão de segredos (substituir gestão manual).

---

## Acesso

- **SSH:** `ssh hml-jenkins`
- **Usuário:** `marcio-heleno`
- **Regra:** ler este arquivo antes de qualquer SSH. Atualizar após qualquer mudança de estado.

---

## CI/CD — GitHub Actions (ativo)

**Workflow:** `.github/workflows/deploy.yml`
**Trigger:** push em `main` (ignora `ai/`, `docs/`, `.claude/`, `*.md`)
**Runner:** self-hosted label `hml` — instalado como **serviço systemd** em `~/actions-runner`

> Não confundir com `agent-lowrisk-hml-01` (container Jenkins — legado, parado).

**Fluxo:**
1. Copia `~/wl-envs/postgres.env` → `.env.postgres` e `~/wl-envs/core.env` → `.env.core`
2. `docker compose -f docker-compose.hml.yml build`
3. Sobe `wl-postgres` → aguarda healthcheck
4. Roda migrations (`scripts/ci/prisma-migrate.sh`)
5. `docker compose -f docker-compose.hml.yml up -d --remove-orphans`

**Estado do runner:** ✅ ativo — serviço `actions.runner.marcio012-tenantos.hml-jenkins` rodando (reconfigurado 2026-05-28)
Último job executado: 2026-05-23 20:38Z (deploy pendente — aguardando push do tenantOS)

---

## Containers White Label (docker compose)

Gerenciados por `docker-compose.hml.yml`:

| Container | Imagem | Porta | Estado |
|---|---|---|---|
| `wl-postgres` | postgres:16-alpine | 5432 (interno) | ✅ Up (healthy) — confirmado 2026-05-28 |
| `wl-core` | wl-core:latest (build local) | 3000 (interno) | ✅ Up — `/api/health` OK — confirmado 2026-05-28 |
| `wl-frontend` | wl-frontend:latest (build local) | 80 | ✅ Up — confirmado 2026-05-28 |

> Containers do projeto legado (`fluxo-postgres-service`, `fluxo-backend-service`, `fluxo-frontend-service`) são gerenciados por compose separado — não interferir.

---

## Env vars do wl-core

**Arquivo no servidor:** `~/wl-envs/core.env`

| Variável | Estado | Observação |
|---|---|---|
| `DATABASE_URL` | ✅ configurado | aponta para `wl-postgres` |
| `APP_URL` | ⚠️ muda no restart | URL do Cloudflare tunnel — verificar após cada restart |
| `TWILIO_ACCOUNT_SID` | ✅ configurado | sandbox |
| `TWILIO_WHATSAPP_FROM` | ✅ configurado | `whatsapp:+14155238886` |
| `GEMINI_API_KEY` | ✅ adicionado em 2026-05-24 | necessário para IaMarketingService |
| `GEMINI_MODEL` | ✅ `gemini-1.5-flash` (2026-05-24) | configurável; fallback no código = gemini-3.5-flash |
| `JWT_SECRET` | ✅ configurado | |
| `JWT_REFRESH_SECRET` | ✅ adicionado em 2026-05-24 | estava ausente — fallback inseguro corrigido |
| `NODE_ENV` | ✅ `production` | |
| `JWT_SECRET` | ✅ configurado | |

---

## Cloudflare Tunnel

**Modo:** free — URL muda a cada restart do tunnel.

**Scripts:**
- `npm run hml:tunnel` — reinicia tunnel, captura nova URL
- `npm run hml:tunnel:url` — mostra URL atual

**Após restart do tunnel:**
1. Atualizar `APP_URL` em `~/wl-envs/core.env`
2. Atualizar webhook no console do Twilio (manual — API não permite)
   - Console: campo "When a message comes in" → `<nova URL>/webhook/whatsapp`

**URL atual:** desconhecida — confirmar com `npm run hml:tunnel:url`

---

## Jenkins (legado — não executar)

- Container `jenkins` existe mas está parado há 8+ dias — projeto anterior
- `Jenkinsfile` e `ci_cd/Jenkinsfile*` no repositório = referência de legado
- Não iniciar, não executar — apenas consultar quando chegar a hora da migração

---

## Histórico de intervenções

| Data | Ação | Resultado |
|---|---|---|
| 2026-05-24 | Adicionou `GEMINI_API_KEY` em `~/wl-envs/core.env` | ✅ confirmado via SSH |
| 2026-05-24 | Restart do `fluxo-pub-mvp` (compose legado) | ✅ containers legado rodando — erro de rota, não era o wl |
| 2026-05-24 | Alterou `GEMINI_MODEL` para `gemini-1.5-flash`; recriou `wl-core` | ✅ confirmado via `printenv` dentro do container |
| 2026-05-24 | Adicionou `JWT_REFRESH_SECRET` ao HML; sincronizou local `.env` com HML | ✅ container recriado, secret confirmado |
| 2026-05-28 | Reconfigurou runner de `marcio012/white-label-mvp` → `marcio012/tenantos` | ✅ serviço ativo |
| 2026-05-28 | Deploy completo do NestJS core (MVP2) via GitHub Actions | ✅ `/api/health` OK — produto no ar |
| 2026-05-28 | Copilot: `fix: materialize HML deploy operations` (`2870673`) | ✅ operações de deploy materializadas |
| 2026-05-28 | Copilot: `fix: alinhar CI com estrutura atual` (`85c4cd6`) — `ci.yml` apontava para `apps/*` inexistente | ✅ CI corrigido; frontend e backend CI passando |

---

## Checklist antes do próximo deploy

- [x] Confirmar runner GitHub Actions ativo — ✅ reconfigurado para `marcio012/tenantos` (2026-05-28)
- [x] Confirmar URL atual do tunnel — `https://vessel-barn-funk-canvas.trycloudflare.com` (2026-05-28)
- [x] Push dos commits locais do tenantOS para `origin/main` — 2026-05-28
- [x] Pipeline GitHub Actions verde — 2026-05-28
- [x] Validar containers `wl-*` rodando pós-deploy — 2026-05-28
- [ ] Testar fluxo de onboarding: criar tenant → Blueprint → login → `/session/me`
- [ ] Testar webhook WhatsApp → `wl-core` (requer atualizar `APP_URL` no Twilio após restart do tunnel)

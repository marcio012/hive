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

**Estado do runner:** ✅ ativo — `Runner.Listener` rodando como serviço (PID 2728, confirmado 2026-05-24)
Último job executado: 2026-05-23 20:38Z

---

## Containers White Label (docker compose)

Gerenciados por `docker-compose.hml.yml`:

| Container | Imagem | Porta | Estado |
|---|---|---|---|
| `wl-postgres` | postgres:16-alpine | 5432 (interno) | ✅ Up (healthy) — confirmado 2026-05-24 |
| `wl-core` | wl-core:latest (build local) | 3000 (interno) | ✅ Up 3h — confirmado 2026-05-24 |
| `wl-frontend` | wl-frontend:latest (build local) | 5173 | ✅ Up 13h — confirmado 2026-05-24 |

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

---

## Checklist antes do próximo deploy

- [ ] Confirmar runner GitHub Actions ativo (`systemctl status`)
- [ ] Confirmar URL atual do tunnel (`npm run hml:tunnel:url`)
- [ ] Push dos commits locais (11 commits ahead, incluindo `IaMarketingService`)
- [ ] Acompanhar pipeline no GitHub Actions após push
- [ ] Validar containers `wl-*` rodando pós-deploy
- [ ] Testar webhook WhatsApp → `wl-core`

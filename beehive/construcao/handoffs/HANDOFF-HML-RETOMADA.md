# Handoff — Retomada HML TenantOS
**De:** Claude (Arquiteto)
**Data:** 2026-05-28
**Backlog ref:** TOS-019 (a criar)
**thread:** deploy-hml-tenantos

---

## Destino Operacional

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      marcio012/tenantos
cwd_exec:         /home/marcio/job/tenantOS
```

**SSH HML:** `ssh hml-jenkins` (acesso exclusivo do Claude)

---

## O que foi feito nesta sessão

1. **Runner GitHub Actions reconfigurado** — de `marcio012/white-label-mvp` → `marcio012/tenantos`
2. **`docker-compose.hml.yml` criado** — paths atualizados (`./backend`, `./frontend`)
3. **`scripts/ci/prisma-migrate.sh` restaurado** do legado
4. **`.dockerignore` corrigido** — `*.tsbuildinfo` excluído (causava `dist/` ausente no build)
5. **Deploy verde no GitHub Actions** — build passou, containers sobem
6. **Containers legados removidos** — `white-label-mvp-wl-*` deletados
7. **`/api/health` respondendo OK** no HML

---

## O que falta

### 1. wl-core reiniciando
O container `tenantos-wl-core-1` ficou instável (restarting). Suspeita: falha na conexão com postgres na inicialização (race condition) ou variável de env ausente.

**Diagnóstico:** `ssh hml-jenkins && docker logs tenantos-wl-core-1 --tail 30`

**Provável causa:** O `PLATFORM_ADMIN_PASSWORD_HASH` em `~/wl-envs/core.env` está corrompido (tentativas de update falharam por interpolação do `$`).

**Fix:** Gerar hash correto dentro do container e atualizar o env:
```bash
# Dentro do container (quando estiver rodando):
docker exec tenantos-wl-core-1 node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(h => console.log(h));
"
# Copiar o hash e atualizar manualmente ~/wl-envs/core.env
# Depois: docker restart tenantos-wl-core-1
```

### 2. Cloudflare tunnel não está servindo
`https://vessel-barn-funk-canvas.trycloudflare.com` não responde.

**Fix:** Verificar e reiniciar o tunnel:
```bash
ssh hml-jenkins
npm run hml:tunnel
# Atualizar APP_URL no ~/wl-envs/core.env com a nova URL
docker restart tenantos-wl-core-1
```

### 3. Fluxo de onboarding não testado
Depois que wl-core estiver estável, testar via curl no HML:
```bash
# 1. Login platform admin
TOKEN=$(curl -s -X POST http://localhost:3000/api/platform/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"marcio.heleno@gmail.com","password":"admin123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# 2. Criar tenant com Blueprint Varejo
curl -s -X POST http://localhost:3000/api/platform/leads/:id/convert-to-tenant \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"slug":"bella-corte","blueprint":"servicos","admin":{"nome":"Admin","email":"admin@bella.com"}}'

# 3. Login tenant
TENANT_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -H 'X-Tenant-Slug: bella-corte' \
  -d '{"email":"admin@bella.com","password":"<senha_temporaria>"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# 4. Verificar módulos ativos
curl -s http://localhost:3000/api/session/me \
  -H "Authorization: Bearer $TENANT_TOKEN" \
  -H 'X-Tenant-Slug: bella-corte'
# Esperado: {"modulosAtivos":["agenda","clientes"]}
```

---

## Opinião do Arquiteto — Estado ideal ao concluir

1. `wl-core` estável (sem restart loop)
2. `/api/health` ✅
3. Fluxo completo testado: platform login → criar tenant → tenant login → `modulosAtivos` retornando correto
4. Cloudflare tunnel ativo com URL atualizada no `core.env`
5. `CLAUDE_HML.md` atualizado com estado final

O produto está tecnicamente pronto para demonstração com Blueprints Varejo e Serviços assim que esses pontos estiverem fechados.

---

## Contexto adicional

- `PLATFORM_ADMIN_EMAIL` = `marcio.heleno@gmail.com`
- Senha target = `admin123`
- `APP_URL` atual (possivelmente expirada) = `https://vessel-barn-funk-canvas.trycloudflare.com`
- Volume postgres: `tenantos_wl_postgres_data` (dados persistidos)
- Copilot NÃO tem acesso SSH ao HML — todas as intervenções SSH são via Claude

---
issue: "#40"
titulo: "Auth JWT propria no core com tenant no payload"
owner_atual: copilot
iniciado_em: 2026-05-21
ultimo_checkpoint: 2026-05-21T09:13:42Z
status: concluido
---

## Escopo

**Entra:**
- `POST /api/auth/login` — recebe email + password + tenantSlug, retorna accessToken + refreshToken
- `POST /api/auth/refresh` — renova accessToken via refreshToken
- JWT payload: `{ sub, email, tenantId, tenantSlug, tipo }`
- Access token 8h (JWT_SECRET), Refresh token 7d (JWT_REFRESH_SECRET)
- `TenantMiddleware` extrai tenantId do JWT primeiro, X-Tenant-ID como fallback
- `JwtAuthGuard` como APP_GUARD (roda antes do TenantGuard)
- `@Public()` decorator para rotas sem autenticação
- `GET /api/session/me` aceita apenas JWT nativo do core com tenant no payload e retorna direto sem DB lookup

**Nao entra:**
- Acoplamento ao legacy backend
- Tabela de refresh tokens no banco (stateless)
- Blacklist de tokens

## Criterios de aceite
- [x] POST /api/auth/login retorna tokens validos com tenantId no payload
- [x] POST /api/auth/refresh renova accessToken
- [x] Rotas autenticadas rejeitam requests sem Bearer token valido
- [x] @Public() libera rotas sem autenticacao (health, branding, auth/*)
- [x] TenantMiddleware extrai tenantId do JWT sem verificar assinatura
- [x] JwtAuthGuard registrado antes do TenantGuard (AuthModule importado antes de TenantModule)
- [x] GET /api/session/me aceita apenas core JWT com tenantId, tenantSlug e sub no payload
- [x] Build TypeScript sem erros

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-21 | tenantSlug obrigatorio no body do login | email nao e unico globalmente (@@unique[tenant_id, email]) |
| 2026-05-21 | bcryptjs (puro JS) | sem native bindings, compativel com ambiente minimal |
| 2026-05-21 | Middleware decodifica sem verificar assinatura | separacao de responsabilidades: extracao no middleware, validacao no guard |
| 2026-05-21 | APP_GUARD ordering via import order | AuthModule importado antes de TenantModule no AppModule |
| 2026-05-21 | session/me aceita apenas JWT nativo do core | alinhamento com a regra de zero acoplamento operacional ao legado |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `apps/core/src/auth/dto/login.dto.ts` | NOVO — LoginDto com email, password, tenantSlug |
| `apps/core/src/auth/dto/refresh.dto.ts` | NOVO — RefreshDto com refreshToken |
| `apps/core/src/auth/decorators/public.decorator.ts` | NOVO — @Public() e IS_PUBLIC_KEY |
| `apps/core/src/auth/decorators/current-user.decorator.ts` | NOVO — @CurrentUser() param decorator |
| `apps/core/src/auth/auth.service.ts` | NOVO — login, refresh, verifyAccessToken, hashPassword |
| `apps/core/src/auth/guards/jwt-auth.guard.ts` | NOVO — JwtAuthGuard como APP_GUARD |
| `apps/core/src/auth/auth.controller.ts` | NOVO — POST /auth/login e /auth/refresh |
| `apps/core/src/auth/auth.module.ts` | NOVO — modulo com JwtAuthGuard como APP_GUARD |
| `apps/core/src/tenant/tenant.middleware.ts` | MODIFICADO — JWT-first extraction + X-Tenant-ID fallback |
| `apps/core/src/tenant/tenant-public.controller.ts` | MODIFICADO — adicionado @Public() |
| `apps/core/src/health/health.controller.ts` | MODIFICADO — adicionado @Public() |
| `apps/core/src/app.module.ts` | MODIFICADO — AuthModule antes de TenantModule + ValidationPipe global |
| `apps/core/src/session/session.controller.ts` | MODIFICADO — aceita apenas core JWT com tenant no payload; @Public() |
| `apps/core/prisma/seed.ts` | NOVO — seed com tenant=demo e admin@demo.com/admin123; retorna exit code 1 em falha |
| `apps/core/package.json` | MODIFICADO — script db:seed |
| `apps/core/.env` | MODIFICADO — JWT_SECRET e JWT_REFRESH_SECRET |

## Status das subtasks

- [x] DTOs de login e refresh
- [x] Decorators @Public() e @CurrentUser()
- [x] AuthService com login/refresh/verify/hash
- [x] JwtAuthGuard como APP_GUARD
- [x] AuthController com @Public() @SkipTenant()
- [x] AuthModule registrado
- [x] TenantMiddleware reescrito (JWT-first)
- [x] HealthController e TenantPublicController com @Public()
- [x] AppModule com AuthModule + ValidationPipe
- [x] SessionController restrito ao JWT nativo do core
- [x] .env com JWT_SECRET e JWT_REFRESH_SECRET
- [x] Seed script com falha explicita quando o banco nao responde
- [x] Build TypeScript sem erros (EXIT: 0)

## Proximo passo imediato

Issue #40 concluida e validada em revisao cruzada. Proximo: manter card em Done e aguardar fechamento por Marcio.

## Validacao arquitetural (Claude — 2026-05-21)

**Pontos corretos:**
- `tenant.findUnique` pelo slug antes de buscar usuario — evita scan global
- `@@unique([tenant_id, email])` respeitado na query com campo composto `tenant_id_email`
- Mensagem de erro generica (`Credenciais invalidas`) para email e senha — nao vaza se email existe
- `refresh()` valida `type: 'refresh'` antes de emitir novo access token — impede usar access token como refresh
- `jwtSecret` e `refreshSecret` como getters — leem `process.env` no momento do uso, nao no startup
- `session/me` ficou alinhado ao contrato final do core, sem bridge para JWT legado
- `db:seed` agora falha com exit code 1 quando o banco nao responde

**Ponto de atencao para o Copilot validar:**
- `login()` normaliza o email com `.toLowerCase().trim()` mas o cadastro de novos usuarios (fora do seed) nao tem essa normalizacao garantida. Para producao, normalizar o email tambem na criacao do usuario para evitar divergencia de case.

**Smoke test sugerido:**
```bash
npm run db:seed
npm run dev
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123","tenantSlug":"demo"}'
```

## Restricoes ativas

- JWT_SECRET em producao deve ser substituido por valor seguro: `openssl rand -hex 64`
- Refresh token e stateless — nao ha revogacao antes do vencimento (aceitavel para MVP)
- Normalizacao de email no cadastro de usuarios ainda nao esta garantida fora do seed

## Checkpoints automaticos

- 2026-05-21T08:13:08Z | owner=claude | last=Issue #40 delegada ao Claude para auth propria no core sem qualquer acoplamento ao legado. | next=Implementar auth JWT propria no core com tenant no payload e tenant context autenticado via token, sem bridge ao legado; devolver com commit e evidencia.
- 2026-05-21T12:00:00Z | owner=claude | last=Implementacao completa — 15 arquivos criados/modificados, build OK (EXIT: 0). | next=Commit e handoff ao Copilot.
- 2026-05-21T08:40:15Z | owner=copilot | last=Claude implementou auth JWT propria no core — commit 8e8eaf7. 17 arquivos: AuthModule completo (login/refresh/verify), JwtAuthGuard como APP_GUARD, TenantMiddleware reescrito JWT-first, SessionController com deteccao de core vs legacy JWT, ValidationPipe global, seed script, .env com JWT_SECRET. | next=Copilot: validar implementacao da issue #40 — smoke test curl POST /api/auth/login com tenant=demo/admin@demo.com/admin123, validar POST /api/auth/refresh, validar que GET /api/health retorna 200 sem token, validar que rotas protegidas retornam 401 sem token. Fechar issue #40 apos validacao.
- 2026-05-21T08:55:59Z | owner=claude | last=Copilot ajustou a #40 no commit fb144f8: removeu a bridge legado de GET /api/session/me, eliminou SessionService legado e corrigiu o seed para retornar exit code 1 quando o banco falha. | next=Claude validar a implementacao atualizada da #40, revisando se o core ficou aderente a regra de zero acoplamento ao legado e se o ajuste preserva o contrato esperado do bootstrap/auth.
- 2026-05-21T09:07:27Z | owner=copilot | last=Claude validou a #40 com smoke test completo em banco real (docker compose): login ✅, refresh ✅, health sem token ✅, rota protegida 401 ✅, branding publico ✅. Copilot ajustou session.controller (sem bridge legado) e seed (exit code 1 em falha) no commit fb144f8. Build OK. | next=Copilot: (1) revisar codigo da #40 e dar OK de revisao cruzada para Márcio fechar a issue. (2) Para a #35: criar migration baseline com CREATE TABLE antes de rodar prisma migrate deploy em banco novo — as 2 migrations existentes so fazem ALTER TABLE e falham em banco vazio. Validar endpoint GET /api/tenants/:slug/branding com os 5 novos campos.
- 2026-05-21T09:09:22Z | owner=copilot | last=Task context da #40 alinhado ao estado final: session/me sem bridge legado, seed falha com exit code 1, revisao cruzada concluida. | next=Mover os cards #40 e #43 para Done no board oficial e aguardar fechamento por Márcio.
- 2026-05-21T09:13:42Z | owner=copilot | last=Copilot alinhou o task context da #40 ao estado final no commit 12b5fea e moveu os cards #40 e #43 para Done no board oficial. | next=Márcio pode considerar a revisao cruzada concluida para #40 e #43; proximo foco tecnico sugerido: #35 (migration baseline + branding com 5 campos).

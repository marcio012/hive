---
issue: "#29"
titulo: "[Core] Formalizar identidade e contexto de tenant nativos"
owner_atual: copilot
iniciado_em: 2026-05-21
ultimo_checkpoint: 2026-05-21
---

## Objetivo

Prover ao frontend a origem correta de `tenantSlug` e `usuario_id` a partir do core, eliminando:
1. `tenantSlug` com fallback `"demo"` (atalho temporário da #28).
2. `usuario_id` derivado de `String(user.id)` — ID numérico do legado convertido para string.

## Contrato escolhido

### Endpoint novo: `GET /api/session/me`

```
GET /api/session/me
Header: Authorization: Bearer <token legado já emitido no login>
Resposta 200:
{
  "tenantSlug": "demo",      // slug canônico do tenant no core
  "usuarioId": "clxxxx..."   // cuid do Usuario no core
}
Resposta 400: header Authorization Bearer ausente
Resposta 401: token inválido para bootstrap de sessão
Resposta 404: nenhum usuário ativo encontrado para o email do token
```

- Isento de tenant guard (`@SkipTenant()`): é chamado antes de o frontend conhecer o slug do tenant.
- Usa o email do token legado já autenticado como chave de lookup.
- Retorna apenas o que o frontend precisa: par canônico `(tenantSlug, usuarioId)`.

### Por que email do token como chave?

O schema do core tem `@@unique([tenant_id, email])` em `Usuario`. O email já existe no payload do token legado; usar o token como ponte evita expor um endpoint público baseado em email cru e preserva a solução enxuta sem implementar auth completa no core.

## Decisões e motivos

| Quando | Decisão | Motivo |
|---|---|---|
| 2026-05-20 | `GET /api/session/me` com Bearer token legado | Menor contrato coerente sem auth própria do core; reaproveita autenticação já emitida no login |
| 2026-05-21 | `@SkipTenant()` no `SessionController` | Endpoint de bootstrap — não há slug de tenant disponível antes da chamada |
| 2026-05-20 | Retornar `null` silenciosamente no frontend se core indisponível | Resiliência MVP: frontend continua funcionando no fluxo legado puro se core estiver fora |
| 2026-05-20 | Enriquecer `AuthUser` com `tenantSlug?` e `usuarioId?` como opcionais | Compatibilidade retroativa com sessões anteriores ao deploy do core |
| 2026-05-20 | Guard em `loadData()` quando `tenantSlug` vazio | Exibe mensagem de erro clara ao usuário em vez de silêncio ou crash |

## Arquivos alterados

| Arquivo | O que foi feito |
|---|---|
| `apps/core/src/session/session.service.ts` | Novo. Resolve `(tenantSlug, usuarioId)` por email via Prisma |
| `apps/core/src/session/session.controller.ts` | Novo. `GET /api/session/me` com `@SkipTenant()` |
| `apps/core/src/session/session.module.ts` | Novo. Módulo registrando service + controller |
| `apps/core/src/app.module.ts` | `SessionModule` adicionado ao array `imports` |
| `apps/frontend/src/app/api.ts` | `AuthUser` estendido com `tenantSlug?` e `usuarioId?`; tipo `CoreSessionResponse`; função `getCoreSession(email)` exportada |
| `apps/frontend/src/app/components/pages/Login.tsx` | Importa `getCoreSession`; após login legado, resolve sessão do core e armazena no `AuthUser` |
| `apps/frontend/src/app/components/pages/Sales.tsx` | Remove cast `(user as unknown as {...})` e fallback `"demo"`; remove `String(user.id)`; usa `user?.tenantSlug` e `user?.usuarioId`; guard em `loadData` |

## Como a #28 fica ligada a esta frente

A #28 permanece intacta como implementação da trilha de vendas. O que mudou é apenas a **origem dos valores** que ela usa:

- Antes: `tenantSlug = (user as unknown as {...})?.tenantSlug ?? "demo"` → hardcode
- Depois: `tenantSlug = user?.tenantSlug ?? ""` → vem do core via `getCoreSession` no login
- Antes: `usuario_id = String(user?.id ?? "")` → ID legado numérico convertido
- Depois: `usuario_id = user?.usuarioId ?? ""` → cuid do core, resolvido pelo endpoint /session/me

Nenhum endpoint de venda foi modificado. `coreRequest`, `getVendasMVP`, `registrarVendaMVP` permanecem inalterados.

## Status das subtasks

- [x] `GET /api/session/me` implementado no core com `@SkipTenant()`
- [x] `SessionModule` registrado em `AppModule`
- [x] `AuthUser` estendido com `tenantSlug?` e `usuarioId?`
- [x] `getCoreSession` adicionado em `api.ts`
- [x] `Login.tsx` enriquece sessão com dados do core após login
- [x] `Sales.tsx` remove os dois atalhos criticados
- [x] `npm run check:all` — passou (types + build backend + build frontend + build core)
- [x] `npm --prefix ./apps/frontend test` — 7/7 passou
- [x] `ai/construcao/tasks/task-29-context.md` registrado

## Validações executadas

```
npm run check:all   → ✅ types OK, builds OK (backend + frontend + core)
npm --prefix ./apps/frontend test  → ✅ 7/7 testes passaram
```

## Pendências e pontos de revisão para Copilot-Dev

1. **Seed do core com usuario por email:** O endpoint `/api/session/me` faz lookup por email. Para funcionar em produção, o banco do core precisa ter um `Usuario` com o email do usuário e um `Tenant` ativo. Confirmar seed/migration de usuários no core ao provisionar ambiente.

2. **Graceful degradation no frontend:** Se `getCoreSession` retornar `null` (core fora do ar), o login ainda completa com sucesso mas sem `tenantSlug`/`usuarioId`. `Sales.tsx` exibirá mensagem de erro ao tentar carregar. Considerar UX mais clara (banner de aviso).

3. **Multi-tenant com email duplicado:** `resolveByEmail` retorna o primeiro tenant ativo que contém esse email. Se houver dois tenants com o mesmo usuário (multiempresa), o resultado pode ser incorreto. Aceitável para MVP single-tenant.

4. **Expiração de sessão:** Se o usuário já estava logado antes do deploy desta issue (sessão antiga sem `tenantSlug`/`usuarioId`), `Sales.tsx` exibirá o erro de tenant indisponível. O usuário precisa fazer logout/login para recriar a sessão enriquecida.

5. **Filtro de data no servidor:** Herdado da #28 — ainda aplicado no cliente. Independente desta frente.

6. **Nome do produto na listagem:** Herdado da #28 — core não inclui `produto { nome }` nos itens. Independente desta frente.

## Restrições ativas (herdadas)

- Não reintroduzir `Combo`, `combo_id`, `Vendedor` ou endpoints legados na trilha principal de venda.
- Não mexer em estoque, fechamento, vendors, relatórios.
- Não implementar auth completa no core.
- Não fazer commit desta issue.

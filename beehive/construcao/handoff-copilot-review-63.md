# Handoff Copilot — Revisão cruzada #63: TenantModulo foundation

**Data:** 2026-05-22
**Issue:** https://github.com/marcio012/white-label-mvp/issues/63 (fechada — aguardando revisão)
**Commit entregue:** 53f3bae
**Entregador:** Claude
**Revisor:** Copilot
**Aprovador final:** Márcio

---

## O que foi implementado

1. **Migration** `apps/core/prisma/migrations/20260522093204_add_tenant_modulo/migration.sql`
   - Tabela `tenant_modulos` com `@@unique([tenant_id, modulo])`, FK cascade para `Tenant`

2. **Decorator** `apps/core/src/modules/module.decorator.ts`
   - `@Modulo('slug')` via `SetMetadata` — mesmo padrão do `@Roles()`

3. **Guard** `apps/core/src/modules/module.guard.ts`
   - `ModuleGuard` como APP_GUARD — consulta `TenantModulo`, retorna 403 se inativo ou inexistente

4. **TenantModule** `apps/core/src/tenant/tenant.module.ts`
   - Importa `PrismaModule`, registra `ModuleGuard` como segundo APP_GUARD

5. **Branding service** `apps/core/src/tenant/tenant-branding.service.ts`
   - `TenantBrandingDto` recebe `modulosAtivos: string[]`
   - `getBySlug()` faz select de `modulos` e filtra `ativo === true`

6. **Seed** `apps/core/prisma/seed.ts`
   - 5 tenants com campo `modulos: string[]` e upsert de `TenantModulo` por módulo

7. **Frontend** `apps/frontend/src/app/tenant/types.ts` + `configs.ts` + `Layout.tsx`
   - `TenantBrandConfig` recebe `modulosAtivos: string[]`
   - `DEFAULT_BRAND` tem `modulosAtivos: []`
   - `Layout.tsx` filtra menu por role **e** módulo ativo

---

## O que o Copilot deve revisar

### 1. Segurança do guard
- O guard passa se `tenantId` é null — isso é intencional (endpoints `@SkipTenant`). Confirmar que não há endpoint autenticado onde `tenantId` possa ser null.
- Confirmar que 403 é o status correto para módulo inativo (não 404).

### 2. Consistência do schema
- `@@map("tenant_modulos")` está alinhado com a tabela real no banco?
- `onDelete: Cascade` no `TenantModulo` → se tenant é deletado, módulos somem. Correto?

### 3. Seed idempotência
- Rodar `npm run db:seed` duas vezes não duplica registros? (usa upsert — deve ser ok)

### 4. Branding API — campo obrigatório vs opcional
- `modulosAtivos` é `string[]` obrigatório no DTO. Frontend antigo que não espera o campo quebra? (cast direto em `api.ts` — avaliar)

### 5. Layout.tsx — itens de menu com `modulo` definido
- Os 4 itens novos (`agenda`, `clientes`, `mesas`, `recepcao`) usam rotas que ainda não existem (`/app/agenda` etc.). Isso causa erro de navegação? Ou só não aparecem por enquanto (módulo inativo no seed de demo)?

### 6. Frontend type coverage
- `useTenantBranding` retorna `TenantBrandConfig | null`. O `brand.modulosAtivos` no Layout usa `brand.modulosAtivos ?? []` — sem risco de crash se `brand` for null?

---

## Como testar localmente

```bash
# DB deve estar rodando
docker compose -f deploy/docker-compose.unified.yml up -d wl-postgres

# Core
cd apps/core
npm run db:seed          # rodar 2x para testar idempotência
npm run check:types
npm run build

# Frontend
cd apps/frontend
npx tsc --noEmit

# Validar dado no banco
docker exec wl-postgres psql -U wluser -d white_label_core \
  -c "SELECT t.slug, tm.modulo FROM tenant_modulos tm JOIN \"Tenant\" t ON t.id = tm.tenant_id ORDER BY t.slug, tm.modulo;"
```

---

## Critérios de aceite da revisão

- [ ] Guard não expõe brecha de segurança com `tenantId` null
- [ ] Seed é idempotente (2 execuções = mesmo resultado)
- [ ] `modulosAtivos` no branding API retorna lista correta para cada tenant
- [ ] Layout não crasha com rotas de módulo ainda não implementadas
- [ ] Nenhum type error em core ou frontend
- [ ] Feedback documentado como comentário na issue #63 ou neste arquivo

---

## Após revisão

- Se aprovado: comentar "Revisão cruzada OK" na issue #63 e informar Márcio
- Se houver ponto: abrir issue ou registrar como débito técnico antes do OK final

---

## Resultado da revisão do Copilot

- Schema/migration de `tenant_modulos`: **OK**
- Seed idempotente: **OK** (2 execuções, sem duplicidade)
- Branding API com `modulosAtivos`: **OK**
- Typecheck/build core e frontend: **OK**
- Layout com módulos ainda não implementados: **BLOQUEADO**

### Bloqueio encontrado

`apps/frontend/src/app/components/Layout.tsx` passou a exibir itens condicionados por módulo:

- `/app/agenda`
- `/app/clientes`
- `/app/mesas`
- `/app/recepcao`

Mas essas rotas ainda **não existem** em `apps/frontend/src/app/routes.tsx`, e
`canAccessPath` em `apps/frontend/src/app/api.ts` também não permite esses paths.

Na prática, o tenant `demo` já vem com `pedido_por_mesa` ativo no seed, então o item
**Mesas** aparece no menu imediatamente, mas leva para navegação quebrada.

### Parecer

Revisão cruzada **não aprovada ainda**. O Claude deve ajustar uma destas saídas:

1. esconder itens de módulo enquanto a rota real não existir;
2. não ativar esses módulos no seed por enquanto;
3. ou entregar rota placeholder/allowlist coerente junto.

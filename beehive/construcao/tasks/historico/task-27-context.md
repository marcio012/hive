---
issue: "#27"
titulo: "[Core] Implementar camada tenant-aware de dados e fluxo inicial de vendas"
owner_atual: claude
iniciado_em: 2026-05-20
ultimo_checkpoint: 2026-05-20T20:45:49-03:00
---

## Escopo

**Entra:**
- PrismaService (wrapper NestJS sobre PrismaClient)
- PrismaModule (global, exporta PrismaService)
- VendasModule com endpoints POST /api/vendas e GET /api/vendas
- Acesso a dados sempre scoped ao tenantId do TenantContext

**Nao entra:**
- Auth final
- Frontend
- Novos modelos no schema (schema MVP mantido intacto)
- Validacao de DTO com class-validator (MVP minimo)

## Criterios de aceite

- [x] `npm --prefix ./apps/core run db:validate` passa
- [x] `npm --prefix ./apps/core run db:generate` passa
- [x] `npm run check:all` passa (types + build completo)
- [x] POST /api/vendas cria venda com tenant_id do contexto
- [x] GET /api/vendas lista apenas vendas do tenant no contexto
- [x] Cross-tenant impossivel por construcao (tenantId vem do TenantContext, nao do body)

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-20 | PrismaService como @Injectable simples | Minimo coerente; sem Prisma middleware nem extensions — MVP |
| 2026-05-20 | tenantId injetado no service via TenantContext, nao no controller | Previne acesso cross-tenant por construcao; controller nao toca tenantId |
| 2026-05-20 | total calculado no service a partir dos itens | Unica fonte de verdade; body nao envia total |
| 2026-05-20 | DTOs como interfaces TypeScript simples | Sem class-validator no MVP; adicionar quando validacao real for exigida |
| 2026-05-20 | PrismaModule @Global | Evita re-importar em cada modulo futuro |

## Arquivos modificados/criados

| Arquivo | O que foi feito |
|---|---|
| `apps/core/src/prisma/prisma.service.ts` | Criado — wrapper PrismaClient com ciclo de vida NestJS |
| `apps/core/src/prisma/prisma.module.ts` | Criado — modulo global que exporta PrismaService |
| `apps/core/src/vendas/dto/criar-venda.dto.ts` | Criado — interfaces CriarVendaDto e CriarVendaItemDto |
| `apps/core/src/vendas/vendas.service.ts` | Criado — criar() e listar() sempre tenant-scoped |
| `apps/core/src/vendas/vendas.controller.ts` | Criado — POST /api/vendas e GET /api/vendas |
| `apps/core/src/vendas/vendas.module.ts` | Criado — importa TenantModule para injetar TenantContext |
| `apps/core/src/app.module.ts` | Atualizado — importa PrismaModule e VendasModule |

## Arquitetura da camada tenant-aware

```
Request HTTP
  └─ TenantMiddleware (extrai X-Tenant-ID → AsyncLocalStorage)
       └─ TenantGuard (rejeita 401 se ausente)
            └─ VendasController
                 └─ VendasService
                      ├─ TenantContext.getRequiredTenantId()  ← tenantId por construcao
                      └─ PrismaService.venda.create/findMany  ← WHERE tenant_id = tenantId
```

**Garantia cross-tenant:** o `tenantId` nunca vem do body da requisicao.
Ele e extraido exclusivamente do `TenantContext` (AsyncLocalStorage), que e
populado pelo `TenantMiddleware` a partir do header `X-Tenant-ID`.
O `TenantGuard` global garante que nenhum request chega ao service sem tenantId valido.

## Exemplo de uso

```bash
# Criar venda
curl -X POST http://localhost:3000/api/vendas \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: tenant-abc" \
  -d '{
    "usuario_id": "user-123",
    "meio_pagamento": "dinheiro",
    "itens": [
      { "produto_id": "prod-1", "quantidade": 2, "valor_unitario": 15.50 }
    ]
  }'

# Listar vendas do tenant
curl http://localhost:3000/api/vendas \
  -H "X-Tenant-ID: tenant-abc"
```

## Pontos de revisao para Copilot-Dev

1. **Validacao de DTO:** interfaces simples sem `class-validator`. Se quiser validacao
   em runtime (campos obrigatorios, tipos), adicionar `ValidationPipe` global e
   decoradores `@IsString()`, `@IsArray()` etc. nas classes DTO.

2. **usuario_id cross-tenant:** o service nao valida se o `usuario_id` informado
   pertence ao tenant. Isso pode ser adicionado com uma query de verificacao antes
   do `create`, quando auth real for implementada.

3. **Produto cross-tenant:** idem — `produto_id` nao e validado contra o tenant.
   A FK de banco nao impede (produto de outro tenant com mesmo ID seria aceito).
   Validar quando estoque/produto endpoint for implementado.

4. **Paginacao:** GET /api/vendas retorna todas as vendas sem limite.
   Adicionar `take`/`skip` quando volume real justificar.

5. **class-validator:** para producao, substituir interfaces por classes com
   decoradores e habilitar `ValidationPipe` global no `main.ts`.

## Proximo passo imediato

- Implementar endpoints de Produto (GET /api/produtos) para smoke test completo
- Adicionar seed de dados de teste para o core
- Configurar migration inicial do schema MVP

## Estado final

- A issue #27 foi encerrada com o OK do Márcio.
- O core agora possui camada minima tenant-aware de dados com fluxo inicial de vendas.
- A proxima frente derivada e a adaptacao do frontend ao core MVP.

## Restricoes ativas

- Schema MVP enxuto: nao adicionar modelos sem caso de uso real comprovado
- tenant_id obrigatorio em todo acesso operacional a dados
- Sem auth final nesta issue

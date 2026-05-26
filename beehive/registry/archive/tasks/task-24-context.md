---
issue: "#24"
titulo: "Issue 24 - Definir Tenant e tenant_id base do novo core"
owner_atual: trio
iniciado_em: 2026-05-20
ultimo_checkpoint: 2026-05-20T20:04:59-03:00
---

## Escopo

**Entra:**
- introduzir `Tenant` como entidade de primeira classe no schema do novo core;
- fixar `tenant_id` nas entidades operacionais prioritarias;
- revisar unicidades globais do legado que quebram o modelo multi-tenant;
- deixar o schema pronto para a futura camada tenant-aware de dados.

**Nao entra:**
- migracao completa de dados do legado;
- implementacao da camada de acesso a dados tenant-aware;
- modelo final de autenticacao do novo core;
- reabrir a decisao arquitetural da Thread Tecnica #21;
- misturar esta frente com o debate de boundaries da #25.

## Criterios de aceite
- [x] `Tenant` introduzido no schema alvo do novo core.
- [x] Entidades operacionais prioritarias com direcao clara para `tenant_id`.
- [x] Unicidades globais incompatíveis revisadas e tratadas no novo contrato.
- [x] Modelagem pronta para suportar a camada tenant-aware de dados.
- [x] Escopo definido sem tentar migrar todo o legado nesta etapa.

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-20T20:04:59-03:00 | Fechar a #23 antes de abrir a #24 | Seguir a regra de consolidacao por frente e evitar mistura de contexto |
| 2026-05-20T20:09:00-03:00 | Implementar a #24 como schema Prisma inicial do core | O novo core ainda nao tinha camada de dados; Prisma ja existe no repositorio e permite formalizar o contrato minimo agora |
| 2026-05-20T20:09:00-03:00 | Tornar `tenant_id` explicito em todas as entidades operacionais prioritarias | Preparar CORE-04 para impedir query cross-tenant por construcao |
| 2026-05-20T20:09:00-03:00 | Corrigir unicidades globais no novo contrato | Resolver desde a fundacao os conflitos do legado, especialmente email por tenant e fechamento de caixa por tenant/periodo |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `apps/core/prisma/schema.prisma` | Criado — schema inicial do novo core com `Tenant`, entidades operacionais tenant-scoped e unicidades compostas por `tenant_id` |
| `apps/core/package.json` | Atualizado — adicionados `@prisma/client`, `prisma` e scripts `db:generate`/`db:validate` |
| `apps/core/package-lock.json` | Atualizado — lockfile do core com dependencias Prisma |
| `apps/core/.env.example` | Atualizado — exemplo de `DATABASE_URL` para validar e evoluir o schema do core |

## Status das subtasks

- [x] Fechar a #23 e liberar a #24 como frente ativa
- [x] Introduzir `Tenant` como entidade de primeira classe
- [x] Aplicar `tenant_id` nas entidades operacionais prioritarias
- [x] Revisar unicidades globais incompatíveis
- [x] Validar schema e geracao do Prisma Client
- [x] OK final do Márcio para fechamento

## Proximo passo imediato

Encerrar a #24 e deslocar o debate para a #25, com foco em separar o que e core de plataforma do que ainda remete ao nicho e ao modelo de banco do MVP.

## Restricoes ativas

- Nao migrar dados nem criar fluxo completo de persistencia nesta etapa.
- Nao misturar schema base da #24 com o debate arquitetural da #25.
- Nao forcar compatibilidade estrutural total com o legado; usar o legado apenas como referencia de dominio.

## Estado final

- O core agora tem um schema Prisma dedicado em `apps/core/prisma/schema.prisma`.
- `Tenant` foi introduzido como raiz de isolamento do novo core.
- `tenant_id` passou a existir em todas as entidades operacionais prioritarias do contrato inicial.
- Unicidades globais incompatíveis foram substituidas por contratos tenant-scoped no novo schema.
- A issue #24 foi aprovada pelo Márcio para fechamento.

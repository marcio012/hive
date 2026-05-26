---
issue: "#23"
titulo: "Issue 23 - Resolver tenant no request do novo core"
owner_atual: trio
iniciado_em: 2026-05-20
ultimo_checkpoint: 2026-05-20T19:44:30-03:00
---

## Escopo

**Entra:**
- definir a estrategia inicial de resolucao de tenant no request do novo core;
- garantir propagacao de `tenantId` para guards, services e futura camada de dados;
- falhar de forma explicita quando endpoints protegidos nao tiverem contexto de tenant;
- manter endpoints tecnicos como healthcheck fora da exigencia, se justificado.

**Nao entra:**
- modelo final de autenticacao;
- migracao completa de auth do legado;
- roteamento strangler entre legado e novo core;
- modelagem final de `Tenant` no schema;
- reabrir a arquitetura aprovada na Thread Tecnica #21.

## Criterios de aceite
- [x] Estrategia inicial de resolucao de tenant definida e implementada no novo core.
- [x] `tenantId` chega de forma consistente ao contexto de execucao.
- [x] Endpoints protegidos falham de forma explicita sem contexto de tenant.
- [x] Endpoints tecnicos permitidos ficam claramente delimitados.
- [x] Solucao deixa o caminho preparado para CORE-04 e CORE-05.

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-20T19:36:56-03:00 | Liberar a #23 apos validacao da #22 | Transformar o scaffold aprovado em contexto obrigatorio de tenant no request |
| 2026-05-20T19:36:56-03:00 | Delegar a #23 para Claude - Dev | Testar paralelismo real: execucao da #23 em paralelo ao debate da #24 |
| 2026-05-20T19:36:56-03:00 | Reservar Copilot - Dev para revisao da #23 | Manter revisao cruzada antes do OK final do Márcio |
| 2026-05-20T19:41:00-03:00 | Adicionar endpoint protegido minimo para validacao | Permitir prova objetiva de que `tenantId` propaga no contexto e que requests sem tenant falham explicitamente |
| 2026-05-20T19:44:30-03:00 | Validar comportamento tenant-aware com smoke objetivo | Confirmar health sem tenant, falha 401 sem header em endpoint protegido e propagacao correta com `X-Tenant-ID` |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `apps/core/src/tenant/tenant-context.ts` | Claude - Dev criou o contexto baseado em AsyncLocalStorage para propagar `tenantId` |
| `apps/core/src/tenant/tenant.middleware.ts` | Claude - Dev criou a extracao inicial do header `X-Tenant-ID` |
| `apps/core/src/tenant/tenant.guard.ts` | Claude - Dev criou o guard global com falha explicita sem tenant |
| `apps/core/src/tenant/skip-tenant.decorator.ts` | Claude - Dev criou o marcador para endpoints tecnicos sem exigencia de tenant |
| `apps/core/src/tenant/tenant.controller.ts` | Copilot - Dev adicionou endpoint protegido minimo para validar propagacao de `tenantId` |
| `apps/core/src/tenant/tenant.module.ts` | Copilot - Dev registrou o controller protegido no modulo de tenant |
| `apps/core/src/app.module.ts` | Claude - Dev aplicou o middleware global de tenant no novo core |
| `apps/core/src/health/health.controller.ts` | Claude - Dev marcou o healthcheck com `@SkipTenant()` |

## Status das subtasks

- [x] Escopo e criterios de aceite consolidados
- [x] Destino da issue definido para Claude - Dev
- [x] Implementar resolucao e propagacao inicial de tenantId
- [x] Revisao de Copilot - Dev apos entrega do Claude
- [x] OK final do Márcio para fechamento

## Proximo passo imediato

Seguir para a #24 com a base tecnica do contexto obrigatorio de tenant ja consolidada no novo core.

## Restricoes ativas

- Nao reabrir a decisao arquitetural da Thread Tecnica #21.
- Nao expandir para auth final, schema final ou strangler routing.
- Healthcheck pode continuar fora da exigencia de tenant, se isso simplificar a base tecnica.
- Antes de mudar de frente, consolidar commit quando houver bloco coerente pronto.

## Estado final

- `GET /api/health` segue acessivel sem tenant.
- `GET /api/tenant/context` falha com `401` sem `X-Tenant-ID`.
- `GET /api/tenant/context` responde com o `tenantId` propagado quando o header esta presente.
- A issue #23 foi encerrada no GitHub com o OK final do Márcio.

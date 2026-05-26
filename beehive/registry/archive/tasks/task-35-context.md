---
issue: "#35"
titulo: "Issue #35 - Contrato V1 de captacao visual e persistencia no Tenant"
owner_atual: copilot
iniciado_em: 2026-05-21
ultimo_checkpoint: 2026-05-21T17:10:25Z
---

## Escopo

**Entra:**
- expandir contrato visual com coverImageUrl e tokens fechados de tema por cor
- persistencia relacional explicita no core (campos nullable em Tenant)
- endpoint de leitura atualizado com os novos campos
- manter boundary estritamente visual

**Nao entra:**
- comportamento por tenant
- JSON livre
- CMS
- tipografia, espacamento, radius ou layout

## Criterios de aceite
- [x] Schema Prisma expandido com 5 novos campos nullable em Tenant
- [x] Migration SQL criada
- [x] TenantBrandingDto expandido com os novos campos
- [x] TenantBrandingService mapeia os novos campos com fallback
- [x] TenantBrandConfig e DEFAULT_BRAND atualizados no frontend
- [x] Login.tsx com layout 2 colunas no desktop (capa + form)
- [x] Layout.tsx com tokens de cor aplicados
- [x] TypeScript sem erros (tsc --noEmit: ok)
- [x] Migration aplicada no banco (sequencia validada no ambiente local/real)
- [x] Endpoint GET /api/tenants/:slug/branding validado com novos campos
- [x] Issue fechada — owner autorizou o fechamento

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-21T05:41:09Z | Handoff iniciado | checkpoint automatico |
| 2026-05-21T06:00:00Z | Implementacao entregue por Claude | escopo fechado conforme CAPTACAO_VISUAL_CLIENTE_V1.md |
| 2026-05-21T17:01:24Z | Revisao cruzada concluida por Copilot | entrega conferida, sem bloqueios tecnicos para fechamento |
| 2026-05-21T17:10:25Z | Issue fechada | fechamento autorizado pelo owner apos devolutiva final |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `apps/core/prisma/schema.prisma` | +5 campos nullable: branding_cover_url, branding_fundo_pagina, branding_fundo_painel, branding_texto_primario, branding_texto_secundario |
| `apps/core/prisma/migrations/20260520000000_init/migration.sql` | NOVO — Migration baseline com CREATE TABLE para as 5 entidades (fix para banco novo) |
| `apps/core/prisma/migrations/20260521053500_add_branding_v1_fields/migration.sql` | Migration com ALTER TABLE para os 5 novos campos |
| `apps/core/src/tenant/tenant-branding.service.ts` | DTO expandido, select e mapeamento dos novos campos no getBySlug |
| `apps/frontend/src/app/tenant/types.ts` | TenantBrandConfig com 5 novos campos opcionais |
| `apps/frontend/src/app/tenant/configs.ts` | DEFAULT_BRAND atualizado com os novos campos |
| `apps/frontend/src/app/components/pages/Login.tsx` | Layout 2 colunas desktop (capa esquerda + form direita), tokens de cor substituindo hardcoded |
| `apps/frontend/src/app/components/Layout.tsx` | pageBackgroundColor, textPrimaryColor, textSecondaryColor aplicados |

## Status das subtasks

- [x] Escopo e criterios de aceite consolidados
- [x] Schema + migration criados
- [x] Service e DTO do core atualizados
- [x] Frontend: types, configs, Login, Layout atualizados
- [x] Prisma client regenerado, TypeScript sem erros
- [x] Migration baseline criada (20260520000000_init) — validada em banco limpo, commit 0a96aae
- [x] 3 migrations aplicadas em sequencia sem erros (banco real, docker compose)
- [x] Endpoint GET /api/tenants/:slug/branding validado com 11 colunas de branding presentes
- [x] Copilot: revisar e dar OK de revisao cruzada para Márcio fechar a issue

## Proximo passo imediato

#35 encerrada. Proxima frente pode seguir sem dependencia documental pendente desta issue.

## Restricoes ativas

- Nao adicionar comportamento por tenant
- Nao abrir tipografia, espacamento ou layout nesta frente
- Nao usar JSON livre — apenas campos relacionais explicitos

## Checkpoints automaticos

- 2026-05-21T05:41:09Z | owner=claude | last=Issue #35 delegada ao Claude para implementacao do contrato V1 de captacao visual. | next=Implementar a #35 com contrato fechado, persistencia no Tenant e boundary visual estrito.
- 2026-05-21T05:51:02Z | owner=claude | last=Issue #35 repassada ao Claude por falta de progresso observavel na sessao anterior. | next=Implementar a #35 com coverImageUrl e theme restrito a cores explicitas.
- 2026-05-21T06:10:00Z | owner=copilot | last=Claude entregou implementacao completa da #35: schema, migration, service, frontend. TypeScript ok. | next=Copilot revisar, aplicar migration, validar endpoint e fechar a issue.
- 2026-05-21T15:56:22Z | owner=copilot | last=Estado salvo antes do reboot: #40 e #43 concluídas e em Done; #36 encerrada como not planned no core; board limpo; próximas frentes nomeadas #35, #37 e #38. | next=Após reiniciar, retomar pelo M1: Claude/Dev em #35 (migration baseline + contrato/persistência branding V1) e Copilot/Dev em #37 + preparação da #38 para QA ponta a ponta.
- 2026-05-21T17:01:24Z | owner=copilot | last=Revisao cruzada concluida: migrations coerentes, endpoint documentado e typechecks do core/frontend sem bloqueios. | next=Registrar devolutiva final e aguardar decisao do owner sobre fechamento da issue.
- 2026-05-21T17:10:25Z | owner=copilot | last=Issue #35 fechada no GitHub com comentario final apos autorizacao do owner. | next=Seguir para a proxima frente prioritaria sem dependencia aberta da #35.

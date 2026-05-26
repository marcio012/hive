---
issue: "#22"
titulo: "Issue 22 - Scaffold do novo core em NestJS e healthcheck base"
owner_atual: trio
iniciado_em: 2026-05-20
ultimo_checkpoint: 2026-05-20T19:36:56-03:00
---

## Escopo

**Entra:**
- definir o local do novo app dentro de `apps/` sem substituir o backend legado;
- subir o scaffold inicial em NestJS;
- configurar bootstrap, config base e healthcheck;
- estruturar modulos iniciais para permitir evolucao tenant-aware;
- garantir convivencia limpa entre legado e novo core no repositorio.

**Nao entra:**
- migrar dominios de negocio;
- implementar autenticacao definitiva;
- migrar o frontend;
- redirecionar trafego real para o novo core;
- reabrir debate arquitetural ja fechado na Thread Tecnica #21.

## Criterios de aceite
- [x] Novo core criado em pasta dedicada dentro de `apps/`.
- [x] Bootstrap do NestJS sobe localmente com healthcheck funcional.
- [x] Estrutura inicial de modulos e configuracao base definida.
- [x] Nao ha quebra do backend legado nem do fluxo atual do repositorio.
- [x] Caminho preparado para a issue seguinte de contexto obrigatorio de tenant.

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-20T18:27:22-03:00 | Derivar a #22 da Thread Tecnica #21 | Transformar a decisao arquitetural em primeira frente executavel do novo core |
| 2026-05-20T19:05:52-03:00 | Delegar a implementacao da #22 para Claude - Dev | Testar Claude como executor tecnico em uma issue fundacional e de escopo controlado |
| 2026-05-20T19:05:52-03:00 | Reservar Copilot - Dev para revisao/validacao da #22 | Manter revisao cruzada entre agentes antes do OK final do Márcio |
| 2026-05-20T19:36:56-03:00 | Encerrar a #22 e liberar a #23 | Márcio validou o healthcheck e aprovou seguir para a proxima frente |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `apps/core/package.json` | Criado — manifesto do novo app NestJS (white-label-core) |
| `apps/core/tsconfig.json` | Criado — configuracao TypeScript com strict habilitado |
| `apps/core/tsconfig.build.json` | Criado — tsconfig de build (exclui specs/dist) |
| `apps/core/nest-cli.json` | Criado — configuracao do NestJS CLI para build |
| `apps/core/.env` | Criado — variaveis locais de dev (PORT=3000, NODE_ENV=development) |
| `apps/core/.env.example` | Criado — template de variaveis para outros devs |
| `apps/core/.gitignore` | Criado — ignora dist/, node_modules/, .env |
| `apps/core/src/main.ts` | Criado — bootstrap NestJS (global prefix /api, porta via env PORT) |
| `apps/core/src/app.module.ts` | Criado — modulo raiz com ConfigModule global, HealthModule, TenantModule |
| `apps/core/src/config/configuration.ts` | Criado — factory de configuracao tipada (port, nodeEnv) |
| `apps/core/src/health/health.controller.ts` | Criado — GET /api/health retorna {status, timestamp} |
| `apps/core/src/health/health.module.ts` | Criado — modulo do healthcheck |
| `apps/core/src/tenant/tenant.module.ts` | Criado — placeholder de modulo para CORE-02 (resolucao de tenant) |
| `ops/scripts/resolve-app-path.sh` | Atualizado — adicionado suporte ao app `core` |
| `package.json` | Atualizado — adicionados scripts ci:core:install, ci:core:checktypes, ci:core:build, dev:core; `check:types` e `build` da raiz agora incluem o core |
| Arquivos operacionais ativos do repo | Revisados por Copilot - Dev para remover referencias ao nome legado do projeto em manifests, scripts, docs operacionais, helm, deploy e Jenkins |

## Status das subtasks

- [x] Escopo e criterios de aceite consolidados
- [x] Destino da issue definido para Claude - Dev
- [x] Implementar scaffold inicial em NestJS
- [x] Revisao de Copilot - Dev apos entrega do Claude
- [x] OK final do Márcio para fechamento

## Proximo passo imediato

Iniciar a #23 com execucao de Claude - Dev e manter a #24 na trilha de debate/projecao do trio.

## Restricoes ativas

- Nao reabrir a decisao arquitetural da Thread Tecnica #21 dentro desta issue.
- Nao mexer no backend legado alem do necessario para convivencia limpa no monorepo.
- Nao preencher `Estimativa (SP)` antes da planning conjunta.
- Antes de mudar de frente, consolidar commit quando houver bloco coerente pronto.
## Estado final

- A issue #22 foi implementada por Claude - Dev e revisada por Copilot - Dev.
- Márcio validou manualmente o endpoint de healthcheck.
- O scaffold do novo core ficou registrado em `apps/core`.
- A frente seguinte liberada e a #23 (`tenantId` no request do novo core).

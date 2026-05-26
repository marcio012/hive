---
issue: "#21"
titulo: "Thread Tecnica - Arquitetura-alvo multi-tenant do core"
owner_atual: trio
iniciado_em: 2026-05-19
ultimo_checkpoint: 2026-05-20T18:27:22-03:00
---

## Escopo

**Entra:**
- Documentar e validar a modelagem atual relevante do backend.
- Definir a modelagem-alvo multi-tenant do core.
- Debater se a direcao correta e adaptar, strangler ou rewrite orientado por core.
- Avaliar a permanencia ou troca de framework/plataforma.
- Derivar proximas tasks de execucao a partir da decisao arquitetural.

**Nao entra:**
- Implementar imediatamente o novo core.
- Fechar a #15 por reflexo sem decisao arquitetural suficiente.
- Migrar todo o sistema nesta thread.

## Criterios de saida
- [x] Modelagem atual relevante documentada e validada.
- [x] Modelagem-alvo multi-tenant debatida e consolidada.
- [x] Direcao arquitetural recomendada: adaptar, strangler ou rewrite orientado por core.
- [x] Avaliacao de framework registrada como base de decisao.
- [x] Proximas tarefas derivadas identificadas.

## Decisoes e motivos

| Quando | Decisao | Motivo |
|---|---|---|
| 2026-05-19T19:19:21-03:00 | Abrir Thread Tecnica oficial na issue #21 | Tirar o debate de arquitetura-alvo multi-tenant do fluxo local da #15 e tratar a fundacao do produto no nivel certo |
| 2026-05-19T19:41:53-03:00 | Materializar o redesenho em artefatos tecnicos versionados | Dar casa propria para modelagem atual, arquitetura-alvo e direcao arquitetural do rewrite |
| 2026-05-19T20:04:27-03:00 | Materializar avaliacao de framework e backlog inicial do novo core | Fechar a segunda rodada da thread com recomendacao arquitetural e proximas tasks derivadas |
| 2026-05-19T20:09:38-03:00 | Pausar a sessao com handoff para retomada posterior | Encerrar por aqui sem perder o estado da Thread #21, do split do doc de custo e do aval ainda pendente sobre a recomendacao de framework |
| 2026-05-20T18:27:22-03:00 | Encerrar formalmente a Thread Tecnica #21 | Márcio aprovou a recomendacao final: redesenho do core com estrategia strangler + NestJS como framework do novo core |

## Arquivos modificados

| Arquivo | O que foi feito |
|---|---|
| `ai/construcao/tasks/historico/task-21-context.md` | Contexto final arquivado da thread tecnica |
| `docs/schema/README.md` | Criada a nova categoria de documentacao de schema e modelagem |
| `docs/schema/MODELAGEM_ATUAL_BACKEND.md` | Registrada a leitura estruturada do backend legado |
| `docs/schema/ARQUITETURA_ALVO_MULTI_TENANT.md` | Registrada a direcao de modelagem-alvo multi-tenant |
| `docs/schema/AVALIACAO_FRAMEWORK_CORE_MULTI_TENANT.md` | Registrada a recomendacao atual de framework/plataforma |
| `docs/schema/BACKLOG_INICIAL_CORE_MULTI_TENANT.md` | Registrado o backlog tecnico inicial do novo core |
| `docs/adr/ADR-0004-redesenho-core-multi-tenant.md` | Formalizada a direcao de redesenho do core com estrategia strangler |
| `docs/planning/IDEIA_VIVA_CUSTO_E_MONETIZACAO_TRIO.md` | Reenquadrado para custo operacional do trio |
| `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md` | Criado para separar a trilha comercial e de precificacao |

## Status das subtasks

- [x] Levantar modelagem atual relevante do backend
- [x] Propor modelagem-alvo multi-tenant
- [x] Avaliar estrategia arquitetural (adaptar, strangler ou rewrite)
- [x] Avaliar framework/plataforma
- [x] Derivar backlog tecnico a partir da decisao
- [x] Encerrar a thread com OK final do Márcio

## Proximo passo imediato

Abrir e priorizar as primeiras issues do rewrite/strangler, com foco inicial em CORE-01, CORE-02 e CORE-03 como fundacao do novo core.

## Restricoes ativas

- Evitar burocracia desnecessaria.
- Nao deixar o legado definir sozinho a arquitetura-alvo.
- Separar claramente modelagem, framework e execucao de curto prazo.

## Estado final

- #14 ja foi fechada com OK final do Márcio.
- A Thread Tecnica #21 tem modelagem atual, arquitetura-alvo, ADR de redesenho, avaliacao de framework e backlog inicial registrados.
- A recomendacao final aprovada na thread e: **redesenho do core com estrategia strangler + NestJS como framework do novo core**.
- O documento de custo foi separado do documento de precificacao; a trilha comercial agora esta em `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`.
- A Thread Tecnica #21 foi encerrada com o OK final do Márcio em 2026-05-20.

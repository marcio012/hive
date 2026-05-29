---
gerado_em: 2026-05-23T02:32:14Z
atualizado_em: 2026-05-29T09:30:00Z
gerado_por: Gemini (PO)
---

# Fila de Execução — Copilot

Total estimado: **2 issues** prontas para execução.

> Ao iniciar cada issue: `npm run squad:lock:acquire -- copilot "<título curto>"`
> Ao finalizar: fechar a issue no GitHub + `npm run squad:lock:release -- copilot`

## Fila ordenada

| Ordem | ID | Título | Dependência | Status |
|-------|---|--------|-------------|--------|
| 1 | WO-026-A | Orchestrator Core V1 (Daemon, Watcher, YAML) | - | pronto |
| 2 | WO-026-B | Integração UI Orchestrator (HiveState, Centro de Controle) | WO-026-A | pronto |
| 3 | #78 | Pipeline V2 — Kanban de leads do Agente de Vendas | #88 validado em HML | bloqueado |

## Próximo passo imediato

**Iniciar WO-026-A** — Orchestrator Core V1. 

Escopo resumido:
- Daemon Node.js com chokidar
- Roteamento determinístico YAML
- Idempotência e Deadman's Switch
Ver especificação completa: `beehive/construcao/work_orders/HIVE/WO-026-A-ORCHESTRATOR-CORE.md`

## Issues Concluídas (Rodada Atual)

| ID | Título | Commit |
|---|--------|--------|
| CORE-001 | Auth Identity Service (NestJS) | ✅ ae61cb8 |
| CORE-002 | Global Module Guard | ✅ 600d597 |
| CORE-003 | Centralized Schema Management | ✅ ef61001 |
| WO-025-A | Política de Higiene: Prevenção (Template/Lint) | ✅ 8db27c6 |
| WO-025-B | Política de Higiene: Contenção (Hook/Legado) | ✅ 81773c0 |
| HIVE-UI-003 | Hive UI: Centro de Controle Funcional | ✅ 1309cdd |
| TOS-013 | Branding Dinâmico (Ondas 1 e 2) | ✅ ef5532d |
| TOS-018 | Dashboard: Painel Operacional do Dia | ✅ c609d5b |

## Issues do Claude (não tocar)

| # | Título | Obs |
|---|--------|-----|
| #97 | Design arquitetural do Onboarding Full | Aguarda revisão do contrato em ai/construcao/CONTRATO_ONBOARDING_FULL.md |

## Backlog do Copilot

| # | Título | Observação |
|---|--------|------------|
| #97 | Implementação Onboarding Service | Iniciar após design do Claude |
| #92 | [Ciclo 2] Migracao POS -> core | não iniciar sem novo alinhamento |
| #93 | [Ciclo 2] Migração POS → core — reimplementar módulos legados | épico Ciclo 2 |

## Issues do Márcio (bloqueio manual)

| # | Bloqueio |
|---|---------|
| #88 | Milestone HML v1 — validação completa do Agente de Vendas (aguarda Márcio) |

## Nota sobre CORE-FOUNDATION

As tarefas de infraestrutura do Core (CORE-001 a CORE-003) foram priorizadas para destravar o desenvolvimento do backend enquanto a Issue #78 aguarda a validação manual da Issue #88 pelo Márcio.

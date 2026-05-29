---
gerado_em: 2026-05-23T02:32:14Z
atualizado_em: 2026-05-29T09:30:00Z
gerado_por: Gemini (PO)
---

# Fila de Execução — Copilot

Total estimado: **0 issues** prontas para execução.

> Ao iniciar cada issue: `npm run squad:lock:acquire -- copilot "<título curto>"`
> Ao finalizar: fechar a issue no GitHub + `npm run squad:lock:release -- copilot`

## Fila ordenada

| Ordem | ID | Título | Dependência | Status |
|-------|---|--------|-------------|--------|
| 1 | WO-033 | HIVE-016 — Telemetria E2: Interações por Tipo | — | pronto |
| 2 | WO-034 | HIVE-021 — Painel de Diretrizes e Governança | — | pronto |
| 3 | WO-035 | TOS-015-A — Agenda Backend Delta | — | pronto |
| 4 | WO-036 | TOS-015-B — Agenda Grade Horária Visual | WO-035 (status bloqueio) | pronto |
| 5 | WO-037 | TOS-015-C — Agenda Interoperabilidade | WO-035 (venda_id) | bloqueado por WO-035 |
| 6 | #78 | Pipeline V2 — Kanban de leads do Agente de Vendas | #88 validado em HML | bloqueado |

## Próximo passo imediato

**5 WOs despachadas em 2026-05-29 — processar inbox e executar em sequência:**
1. WO-033 (HIVE-016 — Telemetria E2: Interações por Tipo) — Hive UI
2. WO-034 (HIVE-021 — Painel de Diretrizes e Governança) — Hive UI
3. WO-035 (TOS-015-A — Agenda Backend Delta) — TenantOS
4. WO-036 (TOS-015-B — Agenda Grade Horária Visual) — TenantOS
5. WO-037 (TOS-015-C — Agenda Interoperabilidade) — TenantOS ⚠️ depende de WO-035

## Issues Concluídas (Rodada Atual)

| ID | Título | Commit |
|---|--------|--------|
| WO-026-A | Orchestrator Core V1 (Daemon, Watcher, YAML) | ✅ 53abf8f |
| WO-026-B | Integração UI Orchestrator (HiveState, Centro de Controle) | ✅ 3f5ec9d |
| CORE-001 | Auth Identity Service (NestJS) | ✅ ae61cb8 |
| CORE-002 | Global Module Guard | ✅ 600d597 |
| CORE-003 | Centralized Schema Management | ✅ ef61001 |
| WO-025-A | Política de Higiene: Prevenção (Template/Lint) | ✅ 8db27c6 |
| WO-025-B | Política de Higiene: Contenção (Hook/Legado) | ✅ 81773c0 |
| HIVE-UI-003 | Hive UI: Centro de Controle Funcional | ✅ 1309cdd |
| WO-030 | Centro de Controle V2 | ✅ 7d8aff9 |
| WO-032 | Telemetria E1: Tokens por Agente | ✅ 22bdb51 |
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

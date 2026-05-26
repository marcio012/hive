---
gerado_em: 2026-05-23T02:32:14Z
atualizado_em: 2026-05-23T19:58:00Z
gerado_por: claude
---

# Fila de Execução — Copilot

Total estimado: **1 issue** de execução imediata.

> Ao iniciar cada issue: `npm run squad:lock:acquire -- copilot "<título curto>"`
> Ao finalizar: fechar a issue no GitHub + `npm run squad:lock:release -- copilot`

## Fila ordenada

| Ordem | # | Título | Dependência |
|-------|---|--------|-------------|
| 1 | #78 | Pipeline V2 — Kanban de leads do Agente de Vendas | #88 validado em HML |

## Próximo passo imediato

**#91 já foi entregue** — issue fechada com `status:done`.

**Próxima issue executável da fila:** `#78`, ainda bloqueada por validação da `#88` em HML.

Escopo resumido:
- Kanban de leads
- Cards
- Modal de detalhe
- Movimentação de gate
Ver body completo: `gh issue view 78`

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

## Nota sobre #78

Issue estava tagueada `agent:claude` — reatribuída ao Copilot por decisão do Márcio em 2026-05-23.
Escopo fechado: kanban de leads, cards, modal de detalhe, movimentação de gate.
Iniciar somente após #88 validado (depende do Agente de Vendas rodando em HML).

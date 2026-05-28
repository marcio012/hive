---
gerado_em: 2026-05-23T02:32:14Z
atualizado_em: 2026-05-28T16:30:00Z
gerado_por: Gemini (Coordenador)
---

# Fila de Execução — Copilot

Total estimado: **4 issues** prontas para execução.

> Ao iniciar cada issue: `npm run squad:lock:acquire -- copilot "<título curto>"`
> Ao finalizar: fechar a issue no GitHub + `npm run squad:lock:release -- copilot`

## Fila ordenada

| Ordem | ID | Título | Dependência |
|-------|---|--------|-------------|
| 1 | CORE-001 | Auth Identity Service (NestJS) | - |
| 2 | CORE-002 | Global Module Guard | CORE-001 |
| 3 | CORE-003 | Centralized Schema Management | CORE-002 |
| 4 | #78 | Pipeline V2 — Kanban de leads do Agente de Vendas | #88 validado em HML |

## Próximo passo imediato

**Iniciar CORE-001** — Implementação do motor de autenticação central no NestJS para substituir o Auth legado.

Escopo resumido:
- Modulo: `AuthModule`
- Serviços: `AuthService`, `BcryptService`
- Estratégia: Passport-JWT
Ver especificação completa: `beehive/construcao/work_orders/CORE-FOUNDATION/CORE-001-AUTH.md`

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

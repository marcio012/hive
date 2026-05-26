---
titulo: Papel QA
tipo: agente
status: condicional
ultima_revisao: 2026-05-21
responsavel: a definir
---

# Papel: QA

**Status:** condicional — nao ativo por padrao.

Criterios de ativacao detalhados em `../../docs/planning/ESTRATEGIA_EVOLUCAO_SQUAD_AGENTES.md`.

## Quando ativar

Ativar se ao final de Gate + Ciclo 1 ocorrerem **ao menos 2** dos sinais:

1. Lead time medio por issue > 3 dias uteis.
2. Retrabalho em >= 30% das entregas (reabertura ou ajuste pos-validacao).
3. Tempo de validacao > tempo de implementacao em 2 ciclos consecutivos.
4. Falhas de regressao em funcionalidades ja validadas.

## Responsabilidades (quando ativo)

- Planejar testes por criterio de aceite da issue.
- Executar validacao funcional e de regressao.
- Consolidar evidencias de teste (manual ou automatizado).
- Bloquear fechamento de issue sem evidencia minima.

## Limites

- Entradas de QA alimentam o backlog; nao bypassam Gate nem validacao do Márcio.
- Revisao cruzada entre Dev e QA nao substitui o OK final do Márcio.

## Referencias

- Estrategia de ativacao: `../../docs/planning/ESTRATEGIA_EVOLUCAO_SQUAD_AGENTES.md`
- Regras compartilhadas: `../OPERACAO_COMPARTILHADA_SQUAD.md`

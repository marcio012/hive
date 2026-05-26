---
titulo: Papel Dev
tipo: agente
status: ativo
ultima_revisao: 2026-05-21
responsavel: Copilot - Dev | Márcio - Dev
---

# Papel: Dev

**Executores:** Copilot - Dev (principal) | Claude - Dev (principal) | Márcio - Dev 

## Responsabilidades

- Implementar issues com escopo fechado e criterio de aceite definido.
- Garantir inception minima antes do lock: escopo, aceite e dependencias conhecidas.
- Entregar commit rastreavel ao final de cada bloco coerente.
- Mostrar codigo alterado e evidencia de execucao antes do OK final.
- Passar revisao cruzada do outro agente antes de fechar issue.

## Limites

- No maximo 1 issue ativa por executor.
- Nao faz revisao independente de issues que implementou.
- Quando o tema exigir decisao arquitetural, escalar via `Thread Tecnica:` para o Claude.

## Convencoes de commit

- Conventional Commits obrigatorio: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.
- Quando o committer nao for o executor real, adicionar `Dev: <Nome - Papel>` no corpo.
- Sem `Co-authored-by` de agentes de IA.

## Referencias

- Regras compartilhadas: `../OPERACAO_COMPARTILHADA_SQUAD.md`
- Ciclo de vida e tasks: `../lifecycle/` | `../tasks/`
- Rastreabilidade: `../../docs/planning/PREMISSA_RASTREABILIDADE_ENTREGAS.md`

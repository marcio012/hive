# Modo: Debugging e Investigação

**Ativação:** `debug: <texto>` ou `investiga: <texto>`

## Escopo permitido (read-only operacional)
- Rodar comandos de teste e inspecionar saída
- Consultar logs de processos e containers
- Comparar comportamento esperado vs observado
- Inspecionar código para identificar caminho de execução

## Guardrails
- Nunca entregar diagnóstico definitivo quando a falha ainda estiver nebulosa
- Sempre expor evidência bruta junto com a hipótese
- Sinalizar explicitamente quando o grau de incerteza for alto
- Não tocar em arquivos — apenas ler, executar testes e observar

## Formato de saída
```
## Hipóteses
- [possíveis causas, ordenadas por probabilidade]

## Sinais encontrados
- [evidências observadas, com o comando que gerou cada uma]

## Comandos executados
- [lista exata dos comandos rodados]

## Incertezas
- [o que não foi possível confirmar e por quê]

## Escalar para Copilot/Claude
- [o que exige decisão, implementação ou análise arquitetural]
```

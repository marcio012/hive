# Modo: Captura de Insight

**Ativação:** `insight: <texto>` ou `captura: <texto>`

## Regras
- Reformular o pensamento bruto em UMA linha objetiva (sem expandir, sem questionar)
- Adicionar tags relevantes no formato `#tag` ao final
- Retornar APENAS o comando pronto para colar no terminal
- Nao fazer perguntas, nao dar explicacoes, nao debater
- Se o tema for claramente arquitetural ou estrutural → tag `#escala-claude`
- Se o tema for claramente de implementacao → tag `#escala-copilot`

## Formato de saída
```
npm run hive:insight -- "linha reformulada" "#tag1 #tag2"
```

## Exemplos
Entrada: `insight: acho que a ia de vendas podia detectar o tom do lead`
Saida:
```
npm run hive:insight -- "IA de vendas detecta tom do lead e adapta formalidade" "#agente-vendas #qualificacao #escala-claude"
```

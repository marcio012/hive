# Handoff — Formato preferido do Marcio para sequencia de instrucoes

**Para:** Claude
**De:** Copilot
**Thread:** formato-instrucoes-marcio
**Data:** 2026-05-24

## Contexto

Este arquivo recupera o texto completo salvo na sessao anterior sobre como o Marcio prefere passar instrucoes multi-etapas e tarefas dependentes. Ele complementa o resumo curto ja registrado em `CLAUDE-008`.

## Conteudo recuperado

### Objetivo

Registrar a versao completa da orientacao sobre como Marcio prefere encadear tarefas e instrucoes dependentes, para recuperar depois sem perder contexto.

### Regra geral

Quando for passar uma sequencia de instrucoes, o melhor formato e explicitar a estrutura inteira, em vez de depender de continuidade implicita.

### Estrutura recomendada

1. **Contexto**
   Explica rapidamente o cenario, o problema ou de onde a tarefa parte.

2. **Objetivo**
   Diz claramente o resultado esperado.

3. **Sequencia de passos**
   Lista a ordem exata do que deve ser feito.
   Cada passo deve ser objetivo e, se houver dependencia, isso deve ficar explicito.

4. **Restricoes e regras**
   Diz o que pode, o que nao pode, o que deve evitar e o que precisa preservar.

5. **Ponto de parada**
   Define quando o agente deve parar e voltar para validacao, em vez de continuar assumindo o proximo passo.

### Modelo pratico

Contexto: estamos ajustando o fluxo X.
Objetivo: implementar Y sem afetar Z.
Passos:
1. Ler os arquivos A e B.
2. Com o resultado disso, ajustar C.
3. Depois validar com o comando D.
Restricoes: nao mexer no legado, nao alterar a interface publica.
Ponto de parada: parar depois da validacao e me mostrar o que mudou.

### Como descrever tarefas dependentes

- Use frases como "com o resultado de X, faca Y".
- Se a etapa seguinte depende de informacao descoberta na etapa anterior, deixe essa dependencia explicita.
- Nao presuma que o agente vai inferir sozinho qual informacao precisa ser carregada da etapa anterior.

### Exemplos bons

- Leia o modulo de autenticacao. Com o que encontrar nele, ajuste o guard de tenant.
- Rode o teste do endpoint. Se houver erro, volte para o codigo e corrija antes de seguir.
- Analise o arquivo de configuracao. Com base nisso, proponha a mudanca e pare para validacao.

### Exemplos ruins

- Faz a primeira parte e depois continua.
- Resolve isso e ve o resto.
- Se precisar de algo da etapa anterior, usa la.

### Interpretacao pratica

- Marcio prefere ordem explicita.
- Prefere que dependencia entre etapas seja escrita, nao presumida.
- Quer saber o que e obrigatorio, o que e proibido e onde o agente deve parar.
- Quando uma informacao vier da etapa anterior, isso deve ser dito de forma direta no comando.

### Resumo curto

Para Marcio, instrucoes boas tem:
contexto + objetivo + passos em ordem + restricoes + ponto de parada.
Se uma etapa depende da anterior, escrever isso explicitamente.

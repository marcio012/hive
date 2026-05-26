# Handoff — Debate sobre template ideal de handoff Claude -> Copilot

**Para:** Gemini
**De:** Copilot
**Thread:** template-claude-copilot
**Data:** 2026-05-24

## Contexto

O objetivo desta rodada nao e discutir apenas a conclusao consolidada. O Marcio quer que voce analise as respostas completas dadas pelo Copilot, pergunta por pergunta, para debater e maturar um template de handoff do Claude para o Copilot no formato que mais facilita execucao correta.

## Objetivo

Ler as 4 perguntas abaixo junto com as respostas exatas dadas pelo Copilot na sessao anterior e, a partir disso, opinar sobre:

1. qual template pratico o Claude deveria usar para repassar tarefas ao Copilot;
2. quais campos sao obrigatorios;
3. como representar dependencias entre etapas;
4. como marcar checkpoint, restricoes e ponto de parada;
5. que formato curto e que formato completo fariam sentido no fluxo do squad.

## Pergunta 1

**Pergunta original do Marcio:**

`ok uma pergunta com eu passo para vc uma sequencia de instruçao`

**Resposta exata do Copilot:**

```text
O melhor jeito é em blocos curtos, na ordem de execução.

Use este formato:

Contexto:
- o que estamos fazendo
- o que não pode acontecer

Objetivo:
- resultado final esperado

Sequência:
1. faça X
2. depois faça Y
3. antes de Z, me mostre A
4. não execute B sem minha liberação

Regra:
- se encontrar C, pare
- se houver dúvida, pergunte

Se quiser algo bem direto, pode ser assim também:

1. leia tal arquivo
2. me dê sua opinião
3. só depois implemente
4. não commite sem me mostrar antes

Para eu seguir melhor:
- separe contexto de ação
- diga o que é obrigatório
- diga o que é proibido
- diga onde eu devo parar e te chamar

Palavras que ajudam muito:
- “na sequência” -> ordem importa
- “não execute ainda” -> só analisar
- “pode implementar” -> pode agir
- “pare se...” -> condição de bloqueio
- “me mostre antes” -> checkpoint obrigatório

Se quiser, eu também entendo bem este modelo:

Contexto:
Objetivo:
Passos:
Restrições:
Ponto de parada:
```

## Pergunta 2

**Pergunta original do Marcio:**

`Como eu consigo te encader tarefas ?`

**Resposta exata do Copilot:**

```text
Você consegue me encadear tarefas definindo ordem, dependência e ponto de parada.

Use este modelo:

Contexto:
- onde estamos
- o que precisa ser respeitado

Objetivo:
- resultado final

Sequência:
1. faça A
2. depois faça B
3. se B passar, faça C
4. antes de D, me mostre o resultado
5. só então faça E

Restrições:
- não execute X
- não commite sem me avisar
- não altere Y

Ponto de parada:
- pare após C
- pare se encontrar erro
- pare e me chame antes de produção

Para encadear bem, o mais importante é:
- dizer a ordem
- dizer o que depende do quê
- dizer quando eu sigo sozinho
- dizer quando eu paro e te consulto

Exemplo prático:

Contexto:
vamos organizar o core e ignorar o legado por enquanto

Objetivo:
subir um endpoint de teste

Sequência:
1. leia o handoff
2. me diga sua opinião
3. depois implemente
4. rode os testes
5. me mostre o resultado
6. só depois commite

Restrições:
- não faça deploy
- não mexa no legado

Ponto de parada:
- pare antes do commit

Regra simples:
- “analise” = não executar
- “implemente” = executar
- “na sequência” = manter ordem
- “se passar” = dependência
- “pare em” = checkpoint obrigatório

Se quiser, eu também entendo bem tarefas encadeadas assim:

A -> B -> C
Se B falhar, pare
Se C terminar, commite
```

## Pergunta 3

**Pergunta original do Marcio:**

`Entendi mas e se for tarefas que vc precise de uma informacao que contina na anterio`

**Resposta exata do Copilot:**

```text
Aí o ideal é você me passar como tarefa dependente.

Ou seja: a próxima tarefa usa a saída da anterior.

Melhor forma

Contexto:
...

Objetivo:
...

Sequência:
1. descubra X
2. usando o resultado de X, faça Y
3. usando o que sair de Y, faça Z

Ponto de parada:
- se X não der resultado claro, pare e me chame

Exemplo

1. descubra qual arquivo controla o login
2. com base nesse arquivo, identifique onde está a validação
3. com base nisso, proponha a correção
4. pare antes de implementar

Nesse caso eu entendo que:
- Y depende de X
- Z depende de Y
- eu não devo pular etapa

Se você quiser mais controle

Pode usar este formato:

1. faça A
2. se A encontrar um caminho claro, faça B
3. se B confirmar a hipótese, faça C
4. se A ou B não confirmarem, pare e me avise

Regra prática

Quando houver dependência entre tarefas, use palavras como:
- “com base no resultado anterior”
- “usando o que encontrar em...”
- “se confirmar...”
- “se não confirmar, pare”

Em resumo

Se a informação da próxima está contida na anterior, me passe como cadeia de dependência, não como lista solta.

Exemplo bom:

1. descubra X
2. com base em X, faça Y
3. com base em Y, faça Z

Exemplo ruim:

1. faça X
2. faça Y
3. faça Z

Porque no ruim eu não sei que uma depende da outra.
```

## Pergunta 4

**Pergunta original do Marcio:**

`Nao isso nao o todo quero desde a primeira pergunta que te fiz no caso essa pergunta aqui ok uma pergunta com eu passo para vc uma sequencia de instruçao`

**Resposta exata do Copilot:**

```text
Perfeito — então o “todo” seria este bloco, desde a primeira pergunta sobre como te passar uma sequência de instruções:

## Alinhamento de comunicação do Márcio — como passar instruções e encadear tarefas

Claude, repasso abaixo o alinhamento completo que o Márcio levantou nesta conversa sobre como prefere estruturar instruções e tarefas multi-etapas.

### Origem da conversa
A partir da pergunta do Márcio:

> "ok uma pergunta com eu passo para vc uma sequencia de instruçao"

A conversa evoluiu para definir:
1. o melhor formato de instrução
2. como encadear tarefas
3. como descrever dependências entre tarefas
4. como deixar claro onde o agente deve parar

## 1. Melhor formato de instrução para o Márcio

A leitura consolidada foi que o formato que melhor atende o Márcio é:

- Contexto
- Objetivo
- Sequência / Passos
- Restrições / Regras
- Ponto de parada

### O que isso significa na prática
Ele prefere explicitar:
- ordem de execução
- o que é obrigatório
- o que é proibido
- quando o agente pode seguir sozinho
- em que ponto deve parar e voltar para validação

### Exemplo de formato recomendado

Contexto:
- onde estamos
- o que precisa ser respeitado

Objetivo:
- resultado final

Sequência:
1. faça A
2. depois faça B
3. se B passar, faça C
4. antes de D, me mostre o resultado
5. só então faça E

Restrições:
- não execute X
- não altere Y
- não commite sem me avisar

Ponto de parada:
- pare após C
- pare se encontrar erro
- pare e me chame antes de produção

## 2. Como o Copilot interpreta esse formato

A interpretação combinada foi:

- Contexto = enquadra o problema e os limites
- Objetivo = define o resultado esperado
- Sequência = define ordem e dependência
- Restrições = define o que não pode acontecer
- Ponto de parada = define checkpoint obrigatório

Ou seja: o agente não deve só executar passos; deve entender:
- o encadeamento
- o critério de avanço
- o critério de bloqueio
- o ponto de retorno ao Márcio

## 3. Como encadear tarefas

O Márcio perguntou como encadear tarefas.

A resposta consolidada foi:

tarefas encadeadas funcionam melhor quando a ordem, as dependências e os checkpoints ficam explícitos.

### Exemplo recomendado

1. leia o handoff
2. me diga sua opinião
3. depois implemente
4. rode os testes
5. me mostre o resultado
6. só depois commite

### Sinais linguísticos úteis
- “na sequência” -> ordem importa
- “não execute ainda” -> só analisar
- “pode implementar” -> execução liberada
- “se passar” -> dependência condicional
- “pare em...” -> checkpoint obrigatório
- “me mostre antes” -> validação antes de seguir

## 4. Quando a próxima tarefa depende da anterior

Depois o Márcio perguntou:

> "Entendi mas e se for tarefas que vc precise de uma informacao que contina na anterio"

A leitura consolidada foi:

quando a tarefa seguinte depende do resultado da anterior, isso deve ser passado como cadeia de dependência, não como lista solta.

### Forma recomendada

1. descubra X
2. com base em X, faça Y
3. com base em Y, faça Z
4. se X ou Y não confirmarem a hipótese, pare e me avise

### Ideia central
A etapa seguinte precisa deixar claro que:
- depende da anterior
- não deve começar em paralelo mental
- pode falhar por ausência de confirmação
- pode exigir parada e retorno

## 5. Regra prática sobre dependência entre etapas

A leitura final do Copilot foi:

### Exemplo bom
1. descubra X
2. com base em X, faça Y
3. com base em Y, faça Z

### Exemplo ruim
1. faça X
2. faça Y
3. faça Z

O problema do segundo formato é que ele não deixa claro se:
- Y depende de X
- Z depende de Y
- o agente pode seguir mesmo sem confirmação anterior

## 6. Conclusão consolidada

A preferência do Márcio não é apenas passar instruções em lista.

É passar instruções com:
- contexto
- objetivo
- ordem
- dependência
- restrições
- ponto de parada

Resumo da leitura:

o agente deve entender não só o que fazer, mas também quando seguir, quando parar, o que depende do quê e quando voltar para validação.

Peço que você considere esse alinhamento como padrão de comunicação operacional do Márcio para instruções multi-etapas.
```

## Esperado do Gemini

Responder em `output-gemini.md` com foco em brainstorm, cobrindo:

1. proposta de template curto;
2. proposta de template completo;
3. campos obrigatorios vs opcionais;
4. forma ideal de representar dependencias;
5. exemplos de frases-gatilho que ajudam Claude -> Copilot;
6. riscos de ambiguidade ou excesso de detalhamento;
7. recomendacao final para virar padrao operacional do squad.

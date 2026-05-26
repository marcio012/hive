# Estrategia de Evolucao do Squad de Agentes

Objetivo: manter o fluxo enxuto para lancar o MVP com velocidade, adicionando novos agentes apenas quando houver sinal objetivo de necessidade.

## Squad atual (baseline)
- Tech Lead (humano): priorizacao, decisao de escopo e validacao de trade-offs.
- Agente de Desenvolvimento: implementacao, refino tecnico, evidencias e automacoes.
- Agente Scrum Master (processo): fluxo do board, WIP, handoff e previsibilidade.

Decisao atual:
- Manter este squad para Gate + Ciclo 1.
- Nao adicionar novo agente ate medir o desempenho real do fluxo.

## Condicao para ativar Agente de QA

Ativar o Agente de QA somente se ao final de Gate + Ciclo 1 ocorrer pelo menos 2 dos sinais abaixo:
1. Lead time medio por issue maior que 3 dias uteis.
2. Retrabalho recorrente (reabertura de issue ou ajuste pos-validacao) em 30% ou mais das entregas.
3. Tempo de validacao maior que tempo de implementacao em 2 ciclos consecutivos.
4. Falhas de regressao em funcionalidades ja validadas.

### Papel do Agente de QA (quando ativado)
- Planejar testes por criterio de aceite da issue.
- Executar validacao funcional e de regressao.
- Consolidar evidencias de teste manual/automatizado.
- Bloquear fechamento de issue sem evidencia minima.

## Agentes Especialistas de Nicho (usuario final simulado)

Objetivo:
- Validar funcionalidades como usuario final por nicho e gerar backlog de evolucao orientado ao uso real.

Momento de entrada:
- Apos consolidacao do Ciclo 1 e com fluxo de validacao estavel.
- Prioridade inicial para nichos com piloto mais proximo.

Escopo por agente de nicho:
- Validar jornada ponta a ponta do nicho.
- Apontar gaps de usabilidade, regra de negocio e linguagem.
- Propor melhorias com foco em valor de operacao.

Regras de governanca:
- Ideias dos agentes de nicho entram primeiro como hipotese.
- Toda hipotese precisa de criterio de aceite e prioridade antes de virar implementacao.
- Entradas de nicho alimentam backlog, nao bypassam Gate.

## Modelo sugerido de agentes de nicho
- Agente Nicho Varejo
- Agente Nicho Servicos
- Agente Nicho Distribuicao leve

Cada agente de nicho deve produzir:
1. Cenarios de uso criticos.
2. Riscos operacionais percebidos pelo usuario final.
3. Melhorias priorizadas por impacto.
4. Evidencia de validacao (passou/falhou + observacoes).

## Agente Especialista em Arquitetura

Objetivo:
- aprofundar decisoes estruturais quando o tema sair da execucao normal e entrar em modelagem-alvo, core do produto, migracao ou plataforma.

Momento de entrada:
- por `Thread Tecnica:` ou debate equivalente;
- quando o trio identificar decisao estrutural com impacto de longo prazo;
- antes de iniciar reescrita de core, migracao ampla ou troca de framework.

Escopo do especialista em arquitetura:
- mapear o estado atual relevante;
- propor caminhos com trade-offs;
- recomendar direcao arquitetural;
- separar decisao de modelagem, decisao de framework e entrega de curto prazo.

Guardrails:
- nao virar camada fixa do fluxo;
- nao substituir validacao de produto do Márcio;
- nao usar arquitetura como desculpa para travar o projeto sem criterio de saida.

## Metricas para decidir expansao do squad
- Lead time por issue.
- Taxa de retrabalho.
- Tempo medio de validacao.
- Defeitos detectados apos fechamento.
- Capacidade de entrega por ciclo.

## Revisao da estrategia
- Revisar esta estrategia ao final de cada ciclo.
- Registrar qualquer mudanca de composicao do squad com justificativa e data.

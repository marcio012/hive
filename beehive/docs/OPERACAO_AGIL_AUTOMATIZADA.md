# Operacao Agil Automatizada (Board + Issue + Documentacao Viva)

Objetivo: reduzir trabalho manual no fluxo agil, evitando divergencia entre board, labels e documentacao viva.

## Fonte de verdade
- Padrao atual: board do GitHub Project como fonte principal de status.
- Board oficial: definido em `.agile-squad/config.env` (`SQUAD_PROJECT_NUMBER` + owner).
- Premissa operacional: toda issue nova, alteracao relevante de estado ou encerramento deve refletir no board oficial na mesma rodada.

## Boards comparativos de cenarios

Para analise executiva de capacidade, este repositorio pode manter boards adicionais de simulacao.

- **Board oficial:** `white-label-mvp | Roadmap Agil` (Project #3)
- **Cenario 1:** `white-label-mvp | Roadmap Agil | Somente Humanos` (Project #4)
- **Cenario 2:** `white-label-mvp | Roadmap Agil | Humanos Equivalentes` (Project #5)

Regras:

1. O **board oficial** continua sendo a unica fonte de verdade operacional.
2. Os boards de cenario existem para comparacao e simulacao de capacidade.
3. Os boards de cenario nao devem dirigir status real de issue nem substituir o board oficial.
4. Qualquer comparacao nesses boards deve trabalhar com premissas explicitas, nao com falsa precisao.

### Modelagem atual dos cenarios

- **Project #4 — Somente Humanos**
  - Mantem o mesmo escopo do roadmap atual.
  - Usa calendario estendido para simular execucao com a mesma quantidade de participantes, mas sem assistencia de IA.
  - Regra pratica atual:
    - governanca, documentacao e coordenacao: expandir aproximadamente `2,5x`
    - implementacao e validacao tecnica: expandir aproximadamente `2x`
  - Serve para comparacao visual de prazo total e caminho critico.

- **Project #5 — Humanos Equivalentes**
  - Mantem o mesmo calendario de referencia do board oficial.
  - Adiciona o campo `Humanos Eq` para indicar uma estimativa heuristica de quantos humanos seriam necessarios para sustentar velocidade semelhante.
  - Regra pratica atual:
    - `2` humanos equivalentes para itens de execucao tecnica mais direta
    - `3` humanos equivalentes para itens de governanca, coordenacao, documentacao ou epics agregadores
  - Serve para comparacao visual de headcount necessario para igualar o ritmo atual.

Essas regras sao heuristicas de planejamento e devem ser revisadas quando a issue `#19` produzir metodo mais solido de metrificacao.

## Regras de status
- `Todo` (board) <-> `status:todo` (issue)
- `In Progress` (board) <-> `status:in-progress` (issue)
- `Technical Debt` (board) <-> item classificado como debito tecnico a tratar de forma planejada
- `Done` (board) <-> `status:done` (issue)

## Roteamento de execucao
- Toda issue liberada para execucao deve ter destino explicito:
  - `agent:copilot`
  - `agent:claude`
- O trio pode continuar em planejamento e debate enquanto as issues com destino claro seguem para execucao.
- Regra inicial de capacidade: no maximo 1 issue ativa por agente executor.

## Regra de foco unico
- Manter apenas 1 atividade principal em `In Progress`.
- Atividade ativa atual: #7.

## Comandos oficiais
- Sincronizar board -> labels:
  - `npm run agile:board:sync`
- Definir foco unico (exemplo issue 7):
  - `npm run agile:board:focus -- 7`
- Sincronizar e atualizar documentacao viva:
  - `npm run agile:board:sync:lifecycle`
- Fazer upsert de issue no board oficial com datas previstas:
  - `npm run agile:board:upsert -- --issue <N> [--issue <M> ...] [--start YYYY-MM-DD]`

## Como funciona tecnicamente
Script: `scripts/local/roadmap-board-sync.sh`

Capacidades:
1. Le estado atual dos itens do Project.
2. Ajusta labels das issues para refletir status do board.
3. Opcionalmente define uma unica issue ativa (`--single-active`).
4. Opcionalmente roda update/smoke do lifecycle (`--update-lifecycle`).

Script complementar: `scripts/local/roadmap-item-upsert.sh`

Capacidades:
1. Garante que a issue exista no board oficial.
2. Preserva datas ja preenchidas ou cria `Inicio Previsto`/`Fim Previsto` automaticamente quando estiverem vazios.
3. Usa heuristica simples por label para duracao inicial (`priority:P0` = 3 dias uteis, `priority:P1` = 5, `priority:P2` = 8, `type:epic` = 10).
4. Mantem `Estimativa (SP)` intocada ate a planning oficial.

## Rotina recomendada por sessao
1. Inicio:
- `npm run agile:board:sync`
- Confirmar atividade ativa.
- Antes de adquirir lock para implementacao, confirmar: escopo fechado, criterio de aceite definido e dependencias conhecidas.

2. Troca de atividade:
- `npm run agile:board:focus -- <issue>`
- Se houver blocker dependente de decisao do Márcio, registrar o bloqueio e liberar lock antes da troca.

3. Fechamento da sessao:
- registrar handoff na issue ativa
- `npm run agile:board:sync:lifecycle`

## Regra de saida para pedir OK final
- Antes de pedir o OK final do Márcio para fechar issue:
  1. registrar evidencia objetiva do escopo validado;
  2. explicitar o foco da revisao cruzada (`feature`, `fix`, `chore` ou `docs`);
  3. confirmar que eventuais blockers ou pendencias restantes foram declarados.
  4. aplicar o **gate de debito tecnico**: perguntar se alguma ressalva deixada configura debito tecnico e, se sim, registrar/rastrear isso explicitamente;
  5. quando houver debito tecnico propriamente dito, classificar o item correspondente no board com `Status = Technical Debt` ou deixar referencia objetiva para o item que ficara nessa coluna.
  6. no board, a movimentacao automatica pelos agentes e permitida **apenas ate `In Progress`**; depois disso, ao concluir a atividade, pedir validacao ao Márcio e deixar que ele decida a coluna/status final.

## Observacoes
- Este fluxo le defaults de `.agile-squad/config.env`.
- Em outro repositorio, ajuste o config e rode o bootstrap.

## Evolucao do squad
- Regras para entrada de novos agentes (QA e especialistas de nicho):
  - `docs/planning/ESTRATEGIA_EVOLUCAO_SQUAD_AGENTES.md`

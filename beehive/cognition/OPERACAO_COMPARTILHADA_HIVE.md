---
titulo: Operacao Compartilhada entre agentes (Márcio + Copilot + Claude)
tipo: operacao
status: ativo
ultima_revisao: 2026-05-27
responsavel: Márcio - Dev | Copilot - Dev | Claude - Arquiteto
---

# Operacao Compartilhada entre agentes (Márcio + Copilot + Claude)

Este arquivo e a fonte unica de verdade para regras que se aplicam a ambos os agentes.
Tudo que for especifico de um agente deve ficar na pasta dedicada desse agente.

## Escopo por pasta
- Claude (especifico): `.claude/`
- Copilot (especifico): `.copilot/`
- Gemini (especifico): `.gemini/`
- Comum entre agentes: `beehive/construcao/`
- Papeis e agentes: `beehive/roles/`

## Governança do Squad (V2)
A definição de papéis e permissões está centralizada em `beehive/roles/roles.yaml`.

### Liderança Operacional: Gemini (Squad Lead)
- O Gemini atua como **Squad Lead / Integrador**. 
- **Função:** Orquestrar o fluxo entre Claude (Arquitetura) e Copilot (Execução), consolidar debates e garantir a integridade do Onboarding.
- **Diferencial:** Possui permissão para escrever nos Inboxes dos outros agentes para agilizar a entrega.

Ver diagrama de fluxo em "Roteamento de execucao por agente" neste arquivo.

## Regras gerais
- Uma atividade principal por vez em execucao.
- Toda decisao final e do usuario.
- Toda mudanca relevante precisa de evidencia objetiva.
- Lock exclusivo e obrigatorio para leitura e escrita.
- O fluxo deve evitar burocracia desnecessaria; toda nova regra, artefato ou ritual precisa justificar ganho real de clareza, rastreabilidade ou operacao.
- Fechamento de issue exige aval no squad principal: quem implementa recebe revisao do outro agente, consolida os ajustes e so fecha depois do OK final do Márcio.
- Antes de mudar de frente, o agente deve avaliar se existe um bloco coerente de trabalho pronto para consolidacao e, quando existir, fazer commit antes de seguir para outro assunto.
- O board oficial deve ser atualizado na mesma rodada em que a issue nasce, muda de estado relevante ou e encerrada.
- Em commits de desenvolvimento, a identificacao do executor deve ficar clara: usar o author do Git quando ele representar o desenvolvedor real e adicionar `Dev: <Nome - Papel>` no corpo quando o committer nao for o executor tecnico.

## Inception minima antes da execucao
- Antes de adquirir o lock para uma implementacao, o agente confirma 3 pontos: escopo fechado, criterio de aceite definido e dependencias conhecidas.
- Se algum desses pontos estiver indefinido, a execucao nao comeca; primeiro o Márcio decide ou reorienta o escopo.
- A regra vale principalmente para issues de execucao tecnica, correcoes e tasks com handoff entre agentes.
- Ao abrir issue nova para execucao, o agente deve persisti-la automaticamente no board oficial e preencher `Inicio Previsto`/`Fim Previsto` com previsao inicial. O campo `Estimativa (SP)` so entra depois da planning conjunta.

### Nivel de governanca por complexidade da task

- **Task simples** (contrato fechado, escopo claro, mudanca contida): issue nasce com todos os campos preenchidos — titulo, descricao, criterio de aceite, assignee, inicio/fim previsto, SP estimado. Pode implementar direto sem planning formal.
- **Task complexa** (escopo aberto, risco alto, dependencias incertas ou multiplos agentes): Claude sinaliza ao executor que e necessario planejamento de esforco antes de comecar. Issue abre com campos basicos; SP e datas entram apos planning conjunta com o Marcio.

## Convencao de nomenclatura dos participantes
- O participante humano principal deste fluxo deve ser referido como **Márcio**, e nao como "Usuario", quando o contexto estiver falando desta operacao concreta.
- Quando houver necessidade de explicitar funcao, usar o padrao **Nome - Papel**.
- Exemplos validos: `Márcio - Dev`, `Copilot - Dev`, `Claude - Arquiteto`.
- O uso de "usuario" pode continuar apenas em sentido generico, quando o texto estiver descrevendo uma regra abstrata que nao aponte diretamente para os participantes atuais do squad principal.

## Escopo padrao das diretrizes do usuario neste repositorio
- Toda diretriz nova proposta pelo usuario neste fluxo deve ser tratada, por padrao, como regra geral do repositorio.
- Essa regra vale para Copilot, Claude e qualquer outro agente que entre no fluxo depois.
- A diretriz so deixa de valer em escopo de repositorio quando o usuario mudar explicitamente a configuracao.

## Rastreabilidade de diretrizes ativas
- Campos obrigatorios: `Diretriz`, `Origem` (issue #N ou chat + data) e `Revogacao` (pendente ou issue que revogou).
- O agente que implementa a diretriz e responsavel por criar ou atualizar a entrada antes de liberar o lock.
- Nunca deletar entradas — apenas marcar como revogada com referencia cruzada.

## Cabecalho minimo em documentos Markdown
- Para melhorar leitura humana e futura leitura por sistemas, documentos Markdown vivos e operacionais podem usar cabecalho minimo no inicio do arquivo.
- O uso deve ser seletivo, nao universal, para evitar burocracia desnecessaria.
- Recebem cabecalho por padrao:
  - documentos em operacao ativa
  - documentos revisados com frequencia
  - documentos com responsavel claro e funcao operacional
- Nao recebem cabecalho por padrao:
  - README estatico
  - template
  - historico congelado
  - anotacao descartavel
  - referencia de baixo valor operacional
- Campos minimos:
  - `titulo`
  - `tipo`
  - `status`
  - `ultima_revisao`
  - `responsavel`
- Nao aplicar por padrao em README estatico, template, historico congelado ou arquivo de baixo valor operacional.

## Revisao das alteracoes pelo usuario
- Ao final de cada rodada com arquivos criados ou modificados, o agente responsavel deve perguntar se o usuario quer revisar as alteracoes.
- O modo padrao de revisao e em lote ao final da rodada, nao arquivo por arquivo.
- A oferta de revisao deve preservar tambem uma opcao de resumo das mudancas e aceitar input livre do usuario para ele escolher outro formato.
- No modo fallback por chat, o agente deve ao menos listar claramente os arquivos alterados e oferecer a revisao antes de seguir.
- Quando a rodada incluir **codigo**, o agente deve mostrar o **codigo alterado** antes do fechamento da entrega ou da issue. Isso nao bloqueia commit; e um passo de visibilidade e validacao antes da conclusao.
- Alem do commit e do codigo, a validacao deve incluir a implementacao **rodando** quando isso fizer sentido para o escopo: API, frontend ou, de preferencia, ambos em fluxo ponta a ponta quando aderente.
- O mesmo principio vale para issues: antes do fechamento, a entrega precisa passar por revisao cruzada entre Copilot e Claude, e o OK final e sempre do Márcio.
- Antes de pedir o OK final do Márcio, o agente responsavel deve passar pelo **gate de debito tecnico**:
  1. existe alguma ressalva, limitacao ou pendencia tecnica remanescente?
  2. se existe, isso e apenas observacao contextual ou configura **debito tecnico** rastreavel?
  3. se configurar debito tecnico, ele deve ser registrado explicitamente e, quando fizer sentido no board oficial, classificado em `Status = Technical Debt` antes do fechamento.
- No board, os agentes podem movimentar o card **ate `In Progress`** quando a execucao realmente comecar.
- A partir de `In Progress`, a movimentacao de coluna/status no board passa a ser **atividade exclusiva do Márcio** dentro do fluxo de validacao e aceite.
- Ao finalizar um item, o agente deve **pedir validacao ao Márcio** e deixar que ele decida o destino do card/status no board (`Done`, `Em revisao`, `Technical Debt`, `Blocked` ou outro equivalente do fluxo).
- O objetivo do gate nao e travar entregas pequenas sem necessidade; e impedir que ressalvas tecnicas virem aprovacao silenciosa sem rastreabilidade.

## Coluna de revisao/validacao e template de entrega

- O board oficial mantem uma coluna de revisao/validacao (ex.: `Em revisao` ou `Aguardando validacao`) para receber cards entregues pelos agentes antes do OK do Márcio.
- Ao concluir uma issue, o agente posta o comentario padrao abaixo na propria issue, eliminando descricao manual a cada entrega:

  ```
  ## Entrega — #NNN

  **O que foi feito:** <resumo objetivo do escopo implementado>

  **Como validar:**
  - <passo 1>
  - <passo 2>

  **Evidencia:** <build/typecheck/smoke/screenshot — o que se aplica>

  **Debito tecnico:** <item rastreavel ou "nenhum">
  ```

- O card so sai da coluna de revisao quando o Márcio decidir o destino final.

## Revisao cruzada entre agentes
- A revisao cruzada deve declarar explicitamente o foco principal da analise conforme a natureza da mudanca:
  - `feature`: comportamento, cenarios principais, edge cases e regressao visivel.
  - `fix`: causa raiz, validade da correcao e ausencia de regressao obvia.
  - `chore`: impacto colateral, contratos tocados e seguranca da manutencao.
  - `docs`: coerencia com a operacao real, rastreabilidade e ausencia de contradicao.
- O objetivo nao e criar checklist burocratico, e sim deixar claro o que o revisor realmente validou antes do OK final do Márcio.
- Protocolo de iteracao entre agentes:
  1. Agente executor entrega o bloco; revisor valida e aponta os ajustes necessarios.
  2. Executor ajusta e reentrega; revisor confirma ou aponta o que ainda esta pendente.
  3. Se o mesmo ponto exigir ajuste mais de 2 vezes (mais de 2 ciclos de revisao-ajuste), o loop e interrompido: o agente com lock registra o ponto em aberto, libera o lock e aciona o Márcio para decisao antes de continuar.
- O limite de 2 ciclos existe para evitar ping-pong entre agentes e garantir que pontos estruturalmente divergentes cheguem ao Márcio em vez de serem resolvidos por tentativa sem base de decisao.

## Modo principal de operacao
- O modo principal da operacao do squad e via CLI/terminal, com acesso ao repositorio e aos comandos oficiais do fluxo.
- O uso por chat sem CLI deve ser tratado como contingencia manual, nao como modo oficial.
- Regra detalhada e estrategia de evolucao: `docs/planning/DECISAO_OPERACAO_SQUAD_CLI.md`.

## Contexto inicial versionado
- Antes de iniciar uma sessao, usar arquivos versionados de contexto para reduzir custo de tokens.
- Cada agente deve ler seu arquivo dedicado e este arquivo compartilhado.
- Em cada terminal/sessao ativa, rodar o comando de sessao do agente (`squad:session:claude`, `squad:session:copilot` ou `squad:session:gemini`) para registrar o bootstrap atual daquele terminal.
- Quando regras ou scripts operacionais mudarem, sessoes antigas devem ser consideradas desatualizadas; lock e handoff podem bloquear ate o recarregamento do comando de sessao correspondente.

## Contexto vivo por task (anti-perda)
- Para tarefas longas/complexas, aplicar o mecanismo definido em `beehive/construcao/CONTEXTO_TASK_COMPARTILHADO.md`.
- Arquivo ativo por task: `beehive/construcao/tasks/task-NNN-context.md`.
- Quando o usuario digitar `checkpoint`, o owner com lock deve ler e sincronizar esse arquivo antes de seguir.
- Ao fechar a issue, mover o arquivo para `beehive/construcao/tasks/historico/` como evidencia.

## Sinalizacao de diluicao de contexto
- Se o agente perceber risco real de mistura de frentes, perda de continuidade ou resposta na trilha errada, deve avisar explicitamente o Márcio.
- O aviso deve vir junto com uma proposta objetiva de mitigacao, priorizando: uso de prefixo de frente, `checkpoint`, handoff ou separacao por issue/thread.
- O objetivo e prevenir amnesia operacional, nao apenas reagir depois da perda de contexto.

## Prefixos de interacao para evitar poluicao de contexto
- Quando o Márcio quiser direcionar a conversa sem misturar assuntos, os prefixos abaixo devem ser reconhecidos e respeitados pelo agente.
- **`Frente Tecnica:`** declara que o bloco atual pertence a codigo, arquitetura, infra, integracoes ou validacao tecnica.
- **`Frente Documental:`** declara que o bloco atual pertence a documentacao, indices, templates, runbooks ou organizacao de artefatos.
- **`Frente Processo:`** declara que o bloco atual pertence a regras de operacao, governanca, fluxo de entrega ou combinados do squad.
- **`Ponto atual:`** entra diretamente na linha principal do trabalho em curso.
- **`Ideia paralela:`** registra uma ideia relacionada, mas fora da trilha principal imediata.
- **`Estacionar:`** registra algo para retomada futura, sem puxar o contexto agora.
- **`Debate:`** indica que o tema pede opiniao analitica e deve consultar o Claude por padrao.
- **`Decisao:`** indica que o ponto ja deve ser tratado como definicao a documentar.
- **`Ideia Paralela Debate:`** indica uma ideia fora da trilha principal que deve ser debatida sem contaminar o contexto central; o agente deve tratar como subtema paralelo, mantendo separacao clara entre a linha principal e o debate lateral, e consultar o Claude por padrao.
- **`Thread Tecnica:`** abre uma trilha tecnica separada da linha principal para detalhar arquitetura, contrato, modelo de dados ou outra decisao de implementacao. Se virar trabalho executavel, deve ganhar issue propria e sair do fluxo principal com referencia cruzada.
- Os prefixos `Frente ...:` declaram a **frente ativa da rodada**. Os demais prefixos continuam definindo modalidade, prioridade ou tratamento do assunto dentro dessa frente.

## Papel sob demanda: especialista em arquitetura
- O fluxo pode convocar um papel de especialista em arquitetura quando o tema exigir aprofundamento estrutural acima da execucao normal.
- Esse papel deve ser usado principalmente para:
  - modelagem-alvo;
  - boundaries do core;
  - estrategia de rewrite, strangler ou migracao;
  - escolha de framework e plataforma;
  - contratos tecnicos estruturais.
- Quando a discussao envolver **entidades do sistema**, a proposta deve incluir **desenho e diagramas** junto da explicacao textual para facilitar leitura, validacao e alinhamento estrutural.
- O acionamento preferencial ocorre por `Thread Tecnica:` para manter a linha principal limpa.
- O especialista em arquitetura nao e uma camada fixa do fluxo; e um papel acionado quando o ganho de decisao justificar.
- **Executor preferencial: Claude.** Isso reduz requisicoes ao Copilot nessa funcao e preserva a capacidade do Copilot para execucao de issues. Ver DIR-029 em `DIRETRIZES_ATIVAS.md`.

## Comandos de sessao
- Atalho universal de consulta rapida aos atalhos do projeto:
  - `npm run squad:atalhos`
- Estado atual: `npm run squad:session:state`
- Contexto Claude: `npm run squad:session:claude`
- Contexto Copilot: `npm run squad:session:copilot`
- Inbox de contexto (atalho para ler LAST/NEXT + artefatos citados):
  `npm run squad:context:inbox [-- --show-content --max-lines 120]`
- Comando universal de retomada rapida:
  - Chat: usuario digita `inbox` para solicitar leitura imediata da troca de contexto.
  - Terminal: `npm run squad:inbox` (resumo) ou `npm run squad:inbox:full` (com previews).
- No modo oficial, priorizar sempre a retomada pelo terminal antes de qualquer execucao de trabalho.
- Atualizar estado + imprimir bloco Claude:
  `npm run squad:session:update -- [--issue N] [--last "..."] [--next "..."]`
  Apenas os campos passados sao alterados; os demais sao preservados.
- Handoff automatico (estado + contexto vivo + validacao):
  `npm run squad:handoff:auto -- --issue N --owner claude|copilot --last "..." --next "..." [--title "..."]`
- Validar integridade da troca de contexto:
  `npm run squad:handoff:validate`

## Lock oficial
- Status: `npm run squad:lock:status`
- Acquire: `npm run squad:lock:acquire -- <owner> "<atividade>"`
- Assert read: `npm run squad:lock:assert -- <owner> read`
- Assert write: `npm run squad:lock:assert -- <owner> write`
- Release: `npm run squad:lock:release -- <owner>`

Substituir `<owner>` por `claude` ou `copilot` conforme o agente ativo.
Enquanto um owner estiver com lock ativo, o outro nao deve ler nem alterar arquivos.

### Blocker fast-path
- Quando surgir bloqueio real dependente de decisao do Márcio, o agente com lock deve:
  1. registrar o blocker de forma objetiva na issue ou no handoff ativo;
  2. dizer o que travou e o que precisa para destravar;
  3. liberar o lock imediatamente.
- Bloqueio real aqui significa: sem a decisao do Márcio, continuar aumentaria risco de retrabalho, quebra de contrato ou implementacao incorreta.

## Roteamento de execucao por agente

### Fluxo oficial do squad

```
Pensamento solto / insight / ideia
        ↓
   Gemini CLI (filtro) — reformula + tag
        ↓
   insights-buffer.md  ←── captura sem decisão
        ↓ (planning ou início de debate)
Márcio traz a ideia ou issue
        ↓
   Gemini (opcional) — triagem ou digestao de contexto volumoso
        ↓
   Claude — debate, afina escopo e riscos
   (lê o buffer pelas tags do tema antes de iniciar)
        ↓
   Roteamento por natureza da task
        ↙                    ↘
  Claude executa         Copilot executa
  (contexto acumulado,   (contrato fechado,
  conceito + codigo,      endpoint, migration,
  doc estrategica)        boilerplate puro)
        ↘                    ↙
     Revisao cruzada Claude ↔ Copilot
                ↓
         OK final do Márcio
```

### Criterio de roteamento (DIR-040)

| Vai para Claude | Vai para Copilot |
|---|---|
| Implementacao que depende de contexto acumulado | Endpoints e migrations com contrato 100% fechado |
| Documentacao estrategica e scripts | Boilerplate e ajustes tecnicos pontuais |
| Features que misturam conceito e codigo | Tasks onde o "o que" esta 100% definido |
| Qualquer task onde a ideia ainda esta se formando | Execucao pura sem decisao de design |

- O debate e refinamento de escopo **sempre comecam com o Claude** antes do roteamento.
- Gemini e camada auxiliar **opcional** — acionado pelo Marcio para triagem e digestao de contexto volumoso, sem papel fixo no fluxo.
- Quando uma issue for liberada para execucao, ela recebe destino explicito: `agent:claude` ou `agent:copilot`.
- Maximo 1 issue ativa por agente executor.
- Se uma issue estacionada voltar para execucao, re-sincronizar no board antes de implementar (`Inicio Previsto`, `Fim Previsto`).

### Fluxo criativo entre agentes (DIR-042)

- Ideias brutas nascem em sessao livre entre Marcio e Gemini — sem protocolo, sem contrato
- Claude le, qualifica e adiciona camada arquitetural — muda para `status: qualificado`
- Qualquer agente pode propor promocao da ideia para debate formal — Marcio decide se abre ou descarta
- Board fica preferencialmente com o Copilot; Claude continua como alternativa quando acionado diretamente
- O inbox permanece exclusivo para tarefas com contrato — nao e canal de ideias

### Rastreabilidade de ideias surgidas durante execucao (DIR-041)

- Ideias que surgem durante a execucao de uma issue sao registradas como nova issue com label `idea:inside`.
- O corpo da issue deve incluir link para a issue originadora.
- A label e revisada em momentos de planejamento — promover para `feat:`/`chore:` quando virar prioridade, ou descartar.
- Nao criar coluna separada no board para esse fim.

### Buffer de captura de insights (pré-fila)

Camada anterior ao board — captura pensamentos soltos sem interromper o fluxo em curso.

**Artefato:** `beehive/construcao/insights-buffer.md`
**Comando:** `npm run squad:insight -- "texto" "#tag1 #tag2"`

**Fluxo de captura:**
```
Márcio (pensamento bruto, qualquer formato)
        ↓
   Gemini CLI — filtro de captura
   (prefixo "insight:" ou "captura:" ativa o modo)
        ↓  reformula em 1 linha + tags
   npm run squad:insight -- "linha limpa" "#tags"
        ↓
   insights-buffer.md (append com timestamp, mais recente no topo)
```

**Regras do buffer:**
- Sem estrutura imposta no momento da captura — apenas linha + tags.
- Gemini **não decide, não debate, não expande** — só reformula e sugere tags.
- Tags de escala: `#escala-claude` (tema arquitetural) e `#escala-copilot` (contrato fechado).
- O buffer acumula livremente; não há obrigação de processar na hora.

**Revisão do buffer:**
- **Obrigatória no início de qualquer sessão de debate aberto.**
- Gemini faz a peneira: filtra o buffer pelas tags do tema e devolve um digest curto para o Claude — não o buffer bruto.
- Claude qualifica o digest: decide o que entra no debate, o que promove e o que descarta.
- **Natural no planning** — varrer o buffer completo e decidir: promove para `idea:inside` no GitHub, entra em debate aberto, vira issue ou descarta.
- O buffer é matéria-prima. O Gemini filtra. O Claude qualifica.

**Fluxo de revisão antes do debate:**
```
insights-buffer.md
        ↓
   Gemini — filtra por tags do tema → digest curto
        ↓
   Claude — qualifica digest → entra no debate ou descarta
```

**Promoção:**
`insight capturado → idea:inside no GitHub → debate aberto → issue de execução → descarta`

**Limites do Gemini neste fluxo:**
- Captura: sim (reformula + tag + comando pronto)
- Resumo por tags antes do debate: sim
- Brainstorm: sim (organiza visão do Márcio em formato fixo — não decide, não prioriza)
- Debate, qualificação, decisão de promoção: não — fica com o Claude

**Modos ativos do Gemini:**

| Prefixo | Modo | O que faz |
|---|---|---|
| `insight:` / `captura:` | Captura | Reformula em 1 linha + tags + comando pronto |
| `brainstorm:` / `visao:` | Brainstorm | Lê contexto do projeto, organiza em claro/nebuloso/tensão/escalar-pro-Claude |
| *(sem prefixo)* | Auxiliar padrão | Triagem, resumo, rascunho de baixo risco |

## Consultas GitHub sem interrupcao desnecessaria
- Consultas de **leitura** no GitHub (issues, PRs, comentarios, board, labels, status e metadados) devem seguir direto, sem pedir escolha ao Márcio quando nao houver impacto de estado.
- Pedido de escolha ou confirmacao do Márcio fica reservado para:
  - acoes que mudam estado no GitHub;
  - decisoes de escopo, processo ou prioridade;
  - situacoes realmente ambiguas.
- A regra vale para Copilot, Claude e qualquer outro agente que opere neste fluxo.

## Protocolo de troca de opiniao entre agentes

Quando um agente recebe uma mensagem de troca de opiniao (brainstorm, debate, parecer de outro agente), o fluxo obrigatorio e:

1. **Ler o contexto completo** — inbox, output-gemini.md ou arquivo de debate indicado
2. **Apresentar o parecer no terminal** — visivelmente, para o Marcio acompanhar
3. **Pedir confirmacao ao Marcio antes de agir** — nao executar nenhuma acao decorrente sem aval explicito
4. **Materializar a pendencia cruzada no inbox** — se o debate deixar questoes explicitas para outro agente, criar ou atualizar a entrada correspondente no inbox desse agente no mesmo turno

- Debate aberto com pergunta direcionada e sem inbox correspondente conta como **handoff perdido**
- O scanner `inbox` deve alertar esse estado mesmo quando o arquivo `inbox-*.md` nao tiver sido atualizado

### Protocolo de Alinhamento Estruturado (DIR-051)
Para evitar alucinações de visão e garantir que a hierarquia do projeto seja respeitada, o Márcio poderá utilizar arquivos Markdown dedicados para correção de rota.
- **Obrigatoriedade:** Todo agente (Gemini, Claude, Copilot) deve tratar um arquivo indicado pelo Márcio com o prefixo `@resposta-` ou em `beehive/construcao/debates/` como a "Âncora da Verdade", sobrepondo qualquer interpretação anterior do chat.

> Vale para Copilot e Gemini. Claude ja apresenta no chat por natureza — a regra de confirmacao antes de agir vale para os tres.

## Reuso controlado de agente
- O mesmo agente pode atuar em mais de um papel ao longo do fluxo, desde que use contexto e sessao separados para cada trilha.
- Exemplo valido:
  - Copilot no squad principal para planejamento e, em outro contexto, Copilot como executor de uma issue diferente.
  - Claude no squad principal para debate e, em outro contexto, Claude como executor de uma issue diferente.
- Exemplo invalido:
  - o mesmo agente implementar e produzir a revisao independente da mesma issue.
- A independencia minima da revisao continua sendo garantida por validacao cruzada do outro agente antes do OK final do Márcio.
- Em implementacao delegada, o executor deve devolver um **commit rastreavel** do bloco coerente de trabalho antes da validacao cruzada, salvo orientacao explicita do Márcio em sentido contrario.

## Encerramento de tarefa (checklist obrigatorio)

Ao concluir uma implementacao, o agente executor deve seguir esta sequencia antes de passar a bola:

1. **Commit do codigo** — bloco coerente de trabalho em commit rastreavel
2. **Liberar o lock** — `npm run squad:lock:release -- <owner>`
3. **Escrever no inbox do proximo agente** — `npm run squad:inbox:write` com contexto do que foi feito e o que falta
4. **Commitar as mudancas operacionais** — `session-state.env` + arquivo de inbox em um commit separado do codigo
5. **Push** — somente apos os passos 1-4 estarem commitados

> Motivo: lock release e inbox sao mudancas de estado do squad — se nao forem commitadas antes do push, o proximo agente inicia a sessao sem saber que a tarefa foi concluida.
> Incidente de origem: Copilot commitou o IaMarketingService mas nao commitou o lock release nem a mensagem no inbox — estado operacional ficou divergente do repositorio.

## Git e commits
- Conventional Commits obrigatorio: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Mensagens de commit devem ser diretas e rastreaveis.
- O author do Git e a assinatura principal quando representar corretamente quem desenvolveu a mudanca.
- Quando o committer nao for o executor tecnico da implementacao, o commit deve explicitar `Dev: <Nome - Papel>` no corpo.
- Nao adicionar assinatura `Co-authored-by` de nenhum agente de IA.
- Esta politica de commits deve ser tratada como diretriz ativa do squad, em alinhamento com `README.md` e `docs/planning/PREMISSA_RASTREABILIDADE_ENTREGAS.md`.

## Nomenclatura de branches

Formato obrigatorio:

```
{type}/{issue-number}-{descricao-curta-em-kebab}
```

Tipos validos (mesmos do Conventional Commits):
- `feat/`   — nova funcionalidade
- `fix/`    — correcao de bug
- `chore/`  — manutencao, config, infra
- `docs/`   — documentacao
- `test/`   — testes
- `refactor/` — refatoracao sem mudanca de comportamento

Exemplos corretos:
```
feat/81-platform-home-dashboard
feat/82-lead-to-tenant-conversion
fix/86-seed-hml
chore/85-feature-flags-modulos
```

Regras:
- O numero da issue e **obrigatorio** — nao existe branch de feature sem issue correspondente.
- Excecao unica: `hotfix/descricao-curta` para emergencias em producao sem tempo de abrir issue.
- Branches de longa duracao: apenas `main` (producao/hml) e `develop` (se adotado no futuro).
- Ao concluir: branch mergeada em `main` via PR ou commit direto conforme o fluxo ativo; deletar a branch apos merge.

## Bugs e correcoes
Antes de implementar qualquer correcao, sempre apresentar:
1. Cenario de reproducao e validacao da falha.
2. Causa raiz provavel ou confirmada.
3. Proposta de correcao (o que sera alterado).
4. Riscos e plano de validacao.

Implementacao so ocorre apos aprovacao explicita do usuario.

## Evidencia antes do OK final
- Antes de pedir o OK final do Márcio para fechamento de issue, a entrega deve trazer evidencia objetiva do escopo validado.
- Evidencia aceitavel: teste existente executado, smoke do fluxo afetado, typecheck/build relevante, demonstracao da implementacao rodando (API, frontend ou ponta a ponta quando aderente), ou justificativa explicita quando algum desses itens nao se aplicar.
- O importante e que o OK final seja pedido com base em evidencia observavel, nao apenas em narrativa.
- Quando a implementacao vier de outro agente, a validacao deve ocorrer sobre o commit entregue por esse executor, e nao apenas sobre codigo ainda nao consolidado em commit local.
- Para evitar consumo desnecessario de memoria e recursos da maquina, os agentes nao devem deixar servidores ou processos locais long-lived ativos para demonstracao manual do Márcio. Quando essa etapa for necessaria, devem passar ao Márcio os comandos prontos para execucao manual.
- Isso **nao impede** execucoes tecnicas curtas pelos agentes para diagnostico, coleta de logs, smoke, reproducao de erro ou validacao objetiva do escopo.

## Proposta estrategica que vira artefato
Toda proposta do Claude que precisa ser implementada pelo Copilot deve ser salva
em arquivo versionado antes do handoff — nao pode ficar apenas no historico do chat.

- Claude salva o rascunho em `ai/produto/` ou `.claude/` conforme o escopo.
- O campo `NEXT_STEP` do session-state referencia o arquivo, nao descreve o conteudo.
- Copilot le o arquivo e implementa sem depender do historico do chat.

Exemplo de fluxo correto:
1. Claude propoe e salva em `ai/produto/blueprints/proposta-template.md`.
2. Claude atualiza session-state: `--next "copilot implementar a partir de ai/produto/blueprints/proposta-template.md"`.
3. Claude libera o lock.
4. Copilot le o arquivo e executa.

## Propagacao de mudancas de comportamento
- Toda mudanca de comportamento operacional aprovada pelo Márcio deve ser propagada para todos os agentes ativos no fluxo.
- A propagacao inclui: arquivo especifico do agente (`.claude/`, `.copilot/`, `.gemini/`), este arquivo compartilhado e entrada em `DIRETRIZES_ATIVAS.md` quando aplicavel.
- O agente que recebe a mudanca e responsavel por identificar quais outros agentes precisam ser atualizados e propor o conjunto completo de alteracoes antes de fechar o lock.
- Mudanca aplicada em um agente mas nao nos demais e considerada incompleta ate que todos os afetados estejam sincronizados.

## Padrao de resposta
- Comecar pelo resultado objetivo.
- Priorizar o proximo passo pratico.
- Em bloqueio, informar causa raiz e alternativa viavel imediatamente.

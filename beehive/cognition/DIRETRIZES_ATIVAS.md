---
titulo: Diretrizes Ativas do Squad
tipo: governanca
status: ativo
ultima_revisao: 2026-05-21
responsavel: Márcio - Dev | Copilot - Dev | Claude - Revisor
---

# Diretrizes Ativas do Squad

Registro minimo de diretrizes vigentes propostas pelo usuario no fluxo da operacao do squad.
Fonte de verdade complementar ao `OPERACAO_COMPARTILHADA_SQUAD.md`.

## Formato padrao

```
### DIR-NNN — <titulo curto>

- **Diretriz:** <texto exato ou resumo fiel da diretriz>
- **Origem:** <issue #N | chat — YYYY-MM-DD>
- **Revogacao:** pendente | <issue #N que revogou — YYYY-MM-DD>
```

## Regras de manutencao

- Toda nova diretriz do usuario recebe um ID sequencial (`DIR-001`, `DIR-002`, ...).
- Ao registrar, preencher sempre os tres campos obrigatorios.
- Revogacao ou substituicao: atualizar o campo `Revogacao` da diretriz antiga **e** criar a nova diretriz com referencia cruzada.
- Nunca deletar uma entrada — apenas marcar como revogada.
- O agente que implementa a diretriz e responsavel por registra-la aqui antes de fechar o lock.

## Auditoria de alinhamento com regras do repositorio

- **Data da auditoria:** 2026-05-19
- **Resultado:** as regras de escopo de repositorio registradas nesta sessao e pertinentes ao fluxo do projeto estao refletidas em documentacao versionada.
- **Referencia cruzada principal:** `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md`, `docs/planning/OPERACAO_SQUAD_USUARIO_COPILOT_CLAUDE.md`, `docs/planning/DECISAO_OPERACAO_SQUAD_CLI.md`, `docs/planning/KIT_PORTABILIDADE_SQUAD.md`, `docs/planning/PREMISSA_CONCEPCAO_EM_PAR.md`, `docs/planning/PREMISSA_RASTREABILIDADE_ENTREGAS.md`.

---

## Diretrizes vigentes

### DIR-001 — Escopo padrao de diretrizes do usuario

- **Diretriz:** Toda diretriz nova proposta pelo usuario neste fluxo deve ser tratada, por padrao, como regra geral do repositorio, valendo para todos os agentes. So deixa de valer quando o usuario mudar explicitamente.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-002 — Revisao em lote ao final da rodada

- **Diretriz:** Ao final de cada rodada com arquivos criados ou modificados, o agente responsavel deve perguntar se o usuario quer revisar as alteracoes. O modo padrao e revisao em lote ao final, sem eliminar a opcao de resumo das mudancas nem a possibilidade de input livre do usuario.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-003 — Rastreabilidade minima de diretrizes ativas

- **Diretriz:** Toda diretriz ativa deve ter os campos minimos: Diretriz, Origem (issue ou chat com data) e Revogacao (pendente ou issue que revogou). O registro oficial fica em `ai/construcao/DIRETRIZES_ATIVAS.md`.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-004 — Persistencia automatica de issue no board oficial

- **Diretriz:** Toda issue nova que entrar na execucao operacional deve ser adicionada automaticamente ao board oficial do repositorio e receber `Inicio Previsto` e `Fim Previsto` como previsao inicial, mesmo sem planning oficial. O preenchimento de `Estimativa (SP)` continua proibido antes da planning conjunta.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-004 — Nomenclatura dos participantes do squad

- **Diretriz:** Neste fluxo, o participante humano principal deve ser referido como **Márcio**, e nao como "Usuario", quando o texto tratar da operacao concreta do squad. Quando houver necessidade de explicitar funcao, usar o padrao **Nome - Papel**, como `Márcio - Dev`, `Copilot - Dev` e `Claude - Revisor`.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-005 — Prefixos para separar contexto e ideias paralelas

- **Diretriz:** O fluxo deve reconhecer prefixos de interacao para evitar poluicao de contexto. Prefixos ativos: `Ponto atual:`, `Ideia paralela:`, `Estacionar:`, `Debate:`, `Decisao:` e `Ideia Paralela Debate:`. O prefixo `Ideia Paralela Debate:` deve abrir um subtema debatido em separado, sem misturar com a linha principal.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-006 — Politica de commits como regra ativa do squad

- **Diretriz:** A politica de commits do repositorio deve ser tratada como diretriz ativa do squad. Isso inclui uso obrigatorio de Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`), mensagens diretas e rastreaveis, uso do author do Git como assinatura principal quando ele representar o executor real, regra de `Dev: <Nome - Papel>` no corpo quando o committer nao for o executor tecnico, e proibicao de `Co-authored-by` de agentes de IA, conforme `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md`, `README.md` e `docs/planning/PREMISSA_RASTREABILIDADE_ENTREGAS.md`.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-007 — Evitar burocracia desnecessaria

- **Diretriz:** O repositorio e o fluxo do squad devem evitar burocracia desnecessaria. Toda nova regra, documento, cabecalho, ritual ou controle adicional precisa justificar ganho real de clareza, rastreabilidade ou operacao antes de ser adotado.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-008 — Cabecalho minimo seletivo em Markdown

- **Diretriz:** Documentos Markdown vivos e operacionais podem usar cabecalho minimo com `titulo`, `tipo`, `status`, `ultima_revisao` e `responsavel`, desde que isso traga ganho real de leitura ou operacao. O uso deve ser seletivo, com foco inicial em `ai/construcao/` e `docs/planning/`, sem aplicacao universal para evitar burocracia.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-009 — Consulta padrao ao Claude em debates

- **Diretriz:** No fluxo atual, os prefixos `Debate:` e `Ideia Paralela Debate:` devem consultar o Claude por padrao. O prefixo `Ponto atual:` consulta o Claude apenas quando fizer sentido para o tema ou quando houver pedido explicito do Márcio.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-010 — Fechamento de issue com aval no squad principal

- **Diretriz:** O fluxo de issue e espelhado entre Copilot e Claude: quem implementa recebe revisao do outro agente, consolida os ajustes necessarios e so pode fechar a issue depois do OK final do Márcio.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-011 — Inception minima antes do lock

- **Diretriz:** Antes de adquirir o lock para execucao, o agente deve confirmar escopo fechado, criterio de aceite definido e dependencias conhecidas. Se algum desses pontos estiver indefinido, precisa consultar o Márcio antes de seguir.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-012 — Blocker fast-path com liberacao de lock

- **Diretriz:** Quando houver bloqueio real dependente de decisao do Márcio, o agente deve registrar o blocker de forma objetiva, liberar o lock imediatamente e aguardar reorientacao, sem reter a execucao.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-013 — Smoke e evidencia antes do OK final

- **Diretriz:** Antes de pedir o OK final do Márcio para fechamento de issue, a entrega precisa trazer evidencia objetiva da validacao tecnica do escopo, incluindo smoke, teste ou justificativa de nao aplicabilidade.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-014 — Review guiado por natureza da mudanca

- **Diretriz:** A revisao cruzada entre Copilot e Claude deve declarar o foco principal da analise conforme a natureza da mudanca (`feature`, `fix`, `chore` ou `docs`), para deixar claro o que foi verificado antes do OK final do Márcio.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-015 — Thread Tecnica separada do fluxo principal

- **Diretriz:** O prefixo `Thread Tecnica:` abre uma trilha tecnica separada da linha principal. Quando o tema virar trabalho executavel, ele deve ganhar issue propria e a linha principal passa a referenciar apenas o destino dessa thread.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-016 — Destino explicito por issue de execucao

- **Diretriz:** Nenhuma issue deve sair para execucao sem destino explicito para um agente executor. O roteamento padrao deve indicar se a issue vai para `agent:copilot` ou `agent:claude`, preservando a linha principal do squad principal para planejamento, debate e validacao.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-017 — Reuso controlado de agente em papeis diferentes

- **Diretriz:** O mesmo agente pode atuar em papeis diferentes com contexto e sessao separados, mas nao pode implementar e fazer a revisao independente da mesma issue. A revisao cruzada precisa continuar vindo do outro agente antes do OK final do Márcio.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-018 — Especialista em arquitetura sob demanda

- **Diretriz:** O papel de especialista em arquitetura deve ser acionado sob demanda, preferencialmente por `Thread Tecnica:`, quando o tema envolver modelagem-alvo, boundaries do core, estrategia de rewrite/strangler, escolha de framework ou contrato tecnico estrutural. Esse papel nao vira camada fixa do fluxo.
- **Origem:** chat — 2026-05-19
- **Revogacao:** pendente

### DIR-019 — Commit antes de mudar de frente

- **Diretriz:** Antes de mudar de assunto ou iniciar outra frente, o agente deve verificar se a frente atual ja tem alteracoes prontas para consolidacao e, quando houver um bloco coerente de trabalho concluido, registrar commit antes de seguir. O objetivo e evitar acumulacao de mudancas de frentes diferentes no mesmo estado local.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-020 — Board oficial sempre atualizado

- **Diretriz:** O board oficial do repositorio deve ser atualizado na mesma rodada em que a issue e aberta, muda de estado relevante ou e encerrada. O board nao e opcional; ele faz parte da operacao e da rastreabilidade do squad.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-021 — Prefixos de frente para separar escopo ativo

- **Diretriz:** O fluxo deve aceitar os prefixos `Frente Tecnica:`, `Frente Documental:` e `Frente Processo:` para declarar a frente ativa da rodada. Esses prefixos nao substituem `Debate:`, `Ponto atual:` ou `Thread Tecnica:`; eles apenas fixam o escopo principal para evitar mistura de contexto.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-022 — Codigo visivel antes do fechamento

- **Diretriz:** Quando a rodada incluir codigo, o agente deve mostrar o codigo alterado ao Márcio antes da conclusao da entrega ou do fechamento da issue. Esse passo nao bloqueia commit; ele existe para garantir visibilidade e validacao antes do encerramento.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-023 — Aviso explicito de diluicao de contexto

- **Diretriz:** Se o agente perceber risco real de diluicao de contexto, mistura de frentes ou perda de continuidade, deve avisar explicitamente o Márcio e propor mitigacao objetiva, como prefixo de frente, `checkpoint`, handoff ou separacao por issue/thread.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-024 — Atalho unico para consultar atalhos do projeto

- **Diretriz:** O repositorio deve manter um atalho unico para consulta rapida dos atalhos operacionais vigentes do projeto. O ponto oficial inicial e `npm run squad:atalhos`, pensado para evoluir depois para o framework de IA quando estiver maduro.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-025 — Consulta GitHub direta em operacoes de leitura

- **Diretriz:** Em operacoes de leitura no GitHub, o agente deve consultar direto sem pedir escolha ao Márcio. Confirmacao ou decisao do Márcio fica reservada para acoes que mudam estado, alteram escopo/processo ou tragam ambiguidade real. A regra vale para todo agente do fluxo, incluindo Claude.
- **Origem:** chat — 2026-05-20
- **Revogacao:** pendente

### DIR-026 — Validacao com implementacao rodando

- **Diretriz:** Em entregas com codigo, a validacao deve ir alem do commit e da exibicao do codigo: o agente deve mostrar a implementacao rodando quando isso for aderente ao escopo, seja API, frontend ou, de preferencia, ambos em fluxo ponta a ponta. A regra vale para todo agente do fluxo.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-027 — Retomada de issue exige re-sync do board

- **Diretriz:** Se uma issue sair de debate/estacionamento e voltar para execucao, o agente deve re-sincronizar o item no board na mesma rodada antes de implementar, incluindo status operacional e os campos `Inicio Previsto` e `Fim Previsto` quando aplicaveis.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-028 — Implementacao delegada volta com commit

- **Diretriz:** Em trabalho delegado para outro agente executor, o retorno para validacao deve vir com commit rastreavel do bloco coerente implementado, salvo orientacao explicita do Márcio em contrario. A validacao cruzada deve ocorrer sobre esse commit, e nao apenas sobre codigo nao consolidado.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-029 — Arquitetura via Claude (reducao de requisicoes ao Copilot)

- **Diretriz:** O papel de especialista em arquitetura deve ser exercido preferencialmente pelo Claude, reduzindo requisicoes ao Copilot nessa funcao. Quando o tema envolver modelagem-alvo, boundaries do core, migracao, escolha de framework ou contrato tecnico estrutural, o Claude e o executor preferencial do papel de arquitetura. Acionamento via `Thread Tecnica:` ou `Debate:`.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-030 — Sem ambiente long-lived deixado pelos agentes para validacao manual

- **Diretriz:** Para evitar vazamento de memoria e consumo desnecessario de recursos na maquina, os agentes nao devem deixar servidores ou processos locais long-lived ativos para demonstracao ou validacao manual do Márcio. Isso nao impede execucoes tecnicas curtas para diagnostico, coleta de logs, smoke ou reproducao de erro; a restricao vale para deixar o ambiente ativo para validacao manual, caso em que os comandos devem ser entregues ao Márcio.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-031 — Entidades do sistema exigem desenho e diagramas

- **Diretriz:** Quando a discussao, proposta ou mudanca envolver entidades do sistema, a apresentacao deve incluir desenho e diagramas junto da explicacao textual. Nao basta descrever em prosa a modelagem ou o relacionamento estrutural.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-032 — Configuracao de agentes com escopo por repositorio

- **Diretriz:** A camada de instrucoes e configuracoes dos agentes deve ser tratada com escopo por repositorio, sem carregar para outras frentes ou outros projetos a memoria operacional deste repositório. A base compartilhada deve ser centralizada para evitar duplicidade e defasagem entre Copilot, Claude e futuras IAs.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-033 — Gemini como camada auxiliar do fluxo

- **Diretriz:** O Gemini entra neste repositório como camada auxiliar de triagem, resumo, leitura de contexto volumoso e rascunho de baixo risco. Ele nao substitui Copilot nem Claude, nao fecha issues, nao opera board e nao assume arquitetura ou revisao final por padrao.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-034 — Limite de ciclos na revisao cruzada com escalacao ao Márcio

- **Diretriz:** Na revisao cruzada entre agentes, o mesmo ponto nao pode gerar mais de 2 ciclos de revisao-ajuste. Se o limite for atingido, o agente com lock interrompe o loop, registra o ponto em aberto, libera o lock e aciona o Márcio para decisao antes de continuar. O objetivo e evitar ping-pong sem resolucao entre agentes.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-035 — Propagacao obrigatoria de mudancas de comportamento para todos os agentes

- **Diretriz:** Toda mudanca de comportamento operacional aprovada pelo Márcio deve ser propagada para todos os agentes ativos no fluxo. Inclui arquivo especifico do agente (`.claude/`, `.copilot/`, `.gemini/`), `OPERACAO_COMPARTILHADA_SQUAD.md` e entrada em `DIRETRIZES_ATIVAS.md`. O agente que recebe a mudanca e responsavel por identificar quais outros agentes precisam ser atualizados e propor o conjunto completo antes de fechar o lock. Mudanca parcial e considerada incompleta.
- **Origem:** chat — 2026-05-21
- **Revogacao:** pendente

### DIR-036 — Board oficial com coluna Technical Debt

- **Diretriz:** O board oficial do projeto deve manter a coluna `Technical Debt` no campo `Status` para classificar itens de debito tecnico que precisem rastreabilidade propria no fluxo. Quando a classificacao fizer sentido, ela deve ser usada explicitamente no board em vez de ficar apenas implícita em comentario ou descricao.
- **Origem:** chat — 2026-05-22
- **Revogacao:** pendente

### DIR-037 — Gate de debito tecnico antes do OK final

- **Diretriz:** Antes de pedir o OK final do Márcio para aprovar ou fechar uma entrega, o agente responsavel deve verificar se alguma ressalva, limitacao ou pendencia remanescente configura debito tecnico. Se configurar, o ponto nao pode ficar apenas como observacao solta: precisa ser registrado explicitamente e, quando fizer sentido no board oficial, classificado em `Status = Technical Debt`.
- **Origem:** chat — 2026-05-22
- **Revogacao:** pendente

### DIR-038 — Movimentacao de card no board e responsabilidade do Márcio

- **Diretriz:** No board, os agentes podem mover cards ate `In Progress`. A partir desse ponto, a movimentacao de coluna/status passa a ser atividade exclusiva do Márcio dentro do seu fluxo de validacao pessoal. Os agentes entregam a evidencia, atualizam labels e session-state, e aguardam o OK do Márcio para os estados posteriores.
- **Origem:** chat — 2026-05-22
- **Revogacao:** pendente

### DIR-040 — Governança Centralizada e Roteamento Squad V2

- **Diretriz:** A definição de papéis e roteamento é regida pelo `ai/construcao/agentes/ROLES_CONFIG.yaml`. **Claude** assume a estratégia e arquitetura. **Copilot** assume a execução técnica pura. **Gemini** assume a liderança operacional (Squad Lead / Integrador), orquestrando o fluxo entre os agentes, consolidando debates e garantindo a integração de ideias (Brainstorm) na execução técnica. O debate e refinamento de escopo sempre contam com a síntese do Gemini antes da decisão final do Márcio.
- **Origem:** chat — 2026-05-24 (Reconfiguração Squad V2)
- **Revogacao:** pendente

### DIR-043 — Modo Documentacao do Gemini CLI

- **Diretriz:** O Gemini CLI recebe o modo `doc:` para geração de documentação derivada de artefatos existentes (post-mortem, changelog, inventário técnico, boilerplate, transformação de handoff). Guardrails obrigatórios: (1) declarar intenção antes de escrever e aguardar confirmação; (2) escrever somente em `.md` explicitamente indicado pelo Márcio; (3) se o material de origem for ambíguo, parar e escalar — nunca interpretar; (4) não inferir importância nem decidir narrativa; (5) revisão final com Claude (estratégico/arquitetural) ou Copilot (técnico de execução). Fora do escopo: ADRs, blueprints, docs estratégicos. Aprovado por Claude + Copilot + Márcio via adendo no debate-expansao-gemini.md em 2026-05-23.
- **Origem:** chat — 2026-05-23 (adendo debate-expansao-gemini.md)
- **Revogacao:** pendente

### DIR-042 — Papel de Squad Lead / Integrador para o Gemini CLI

- **Diretriz:** O Gemini CLI é promovido a **Squad Lead / Integrador** (Decisão Márcio em 2026-05-24). Suas capacidades incluem: (1) Orquestração ativa de inboxes de outros agentes; (2) Síntese de debates múltiplos; (3) Facilitador de processos criativos (Brainstorm/Insights); (4) Manutenção dos modos técnicos (Debug/Mapeamento/Documentação). O Gemini agora tem permissão para escrever nos inboxes do Claude e Copilot para agilizar o handoff técnico aprovado. A refatoração em lote permanece sob governança de lock estrita.
- **Origem:** chat — 2026-05-24 (Reconfiguração Squad V2)
- **Revogacao:** pendente

### DIR-041 — Label idea:inside para rastreabilidade de ideias surgidas durante execucao

- **Diretriz:** Ideias que surgem durante a execucao de uma issue devem ser registradas como nova issue com a label `idea:inside`, sem criar coluna separada no board. Regras: (1) o corpo da issue deve incluir link para a issue originadora; (2) a label e revisada em momentos de planejamento para decidir se promove ou descarta; (3) quando virar prioridade real, a issue e re-rotulada para `feat:` ou `chore:` com escopo definido. Claude documenta a proposta; Copilot operacionaliza a criacao da label e ajustes no board.
- **Origem:** chat — 2026-05-22 (DEBATE-002 encerrado)
- **Revogacao:** pendente

### DIR-039 — Coluna de revisao/validacao no board e template padrao de entrega

- **Diretriz:** O board oficial deve manter uma coluna de revisao/validacao (ex.: `Em revisao` ou `Aguardando validacao`) para receber os cards entregues pelos agentes antes do OK do Márcio. Ao concluir uma issue, o agente deve postar um comentario padrao na propria issue com o template abaixo — eliminando a necessidade de descricao manual a cada entrega.
  Template obrigatorio:
  ```
  ## Entrega — #NNN

  **O que foi feito:** <resumo objetivo do escopo implementado>

  **Como validar:**
  - <passo 1>
  - <passo 2>

  **Evidencia:** <build/typecheck/smoke/screenshot — o que se aplica>

  **Debito tecnico:** <item rastreavel ou "nenhum">
  ```
  O card so sai da coluna de revisao quando o Márcio decidir o destino final (Done, Technical Debt, Blocked ou outro).
- **Origem:** chat — 2026-05-22
- **Revogacao:** pendente

### DIR-044 — Board sob execucao oficial do Copilot (Fase 1)

- **Diretriz:** O board e responsabilidade operacional do Copilot. Leitura, sync, mudanca de status, higiene e auditoria do board sao tarefas do Copilot. Claude pode analisar, propor prioridade e delegar via inbox, mas nao executa board diretamente. Conjunto de comandos aprovados para Fase 1 — leitura: `board: status`, `board: proximo-passo`; execucao: `board: focus #NN`, `board: done #NN`, `board: todo #NN`. Comandos de higiene e visao reservados para Fase 2, apos validacao de 3 ciclos reais do fluxo Claude pede → Copilot executa → Claude consolida.
- **Origem:** DEBATE-006 — 2026-05-24 (aprovado pelo Márcio)
- **Revogacao:** pendente

### DIR-045 — Protocolo de comandos de sessao formalizados

- **Diretriz:** Os comandos `inbox`, `status` e `checkpoint` sao formalmente aprovados como protocolo de sessao do squad. `inbox`: leitura imediata da troca de contexto pendente. `status`: estado atual da sessao e do squad. `checkpoint`: sincronizacao do contexto vivo da task ativa antes de prosseguir. `TASK-NNN` entra no protocolo quando houver convencao estavel de IDs (backlog). Um arquivo por debate e a convencao oficial — arquivo monolitico nao deve ser usado.
- **Origem:** chat — 2026-05-24 (CLAUDE-004, aprovado pelo Márcio)
- **Revogacao:** pendente

### DIR-048 — Gate Obrigatório de Documentação sob Julgamento do Lead

- **Diretriz:** Todo encerramento de tarefa técnica (Issue) passa pelo julgamento do Gemini (Squad Lead). O Lead deve analisar o impacto da mudança e decidir se a documentação precisa ser criada ou atualizada. Se sim, a tarefa permanece aberta até que o rascunho da documentação seja gerado e aprovado pelo Márcio.
- **Origem:** chat — 2026-05-24 (Decisão Márcio & Gemini)
- **Revogacao:** pendente

### DIR-049 — Padrão de Escrita Dual-Tone (Técnico + Operacional)

- **Diretriz:** A documentação gerada pelo framework deve obrigatoriamente apresentar dois tons: (1) **Tom Técnico**, focado em desenvolvedores (contratos, infra, arquitetura) e (2) **Tom Operacional**, focado no usuário/maestro (gatilhos de chat, atalhos npm, impacto no fluxo). O objetivo é reduzir a fricção de entrada para operadores não-técnicos.
- **Origem:** chat — 2026-05-24 (Decisão Márcio & Gemini)
- **Revogacao:** pendente

### DIR-050 — Ledger de Evolução do Framework

- **Diretriz:** Toda decisão estrutural tomada em debate entre o Owner e o Squad Lead sobre o funcionamento do Squad Framework deve ser registrada no arquivo `docs/planning/FRAMEWORK_EVOLUTION.md`. Este arquivo serve como a memória histórica da genealogia técnica da nossa fábrica de software.
- **Origem:** chat — 2026-05-24 (Decisão Márcio & Gemini)
- **Revogacao:** pendente

### DIR-051 — Protocolo de Alinhamento via Markdown Estruturado (Âncora da Verdade)

- **Diretriz:** Para decisões de alta complexidade ou correções de rota, o Márcio utilizará o arquivo raiz `resposta-ancora.md`. Todo agente deve tratar este arquivo como prioridade máxima ("Âncora da Verdade"). O agente DEVE: (1) Ler a correção; (2) Converter a decisão em documentação oficial na Hive; (3) **Apagar o conteúdo** do `resposta-ancora.md` logo após a consolidação, mantendo-o sempre como um buffer limpo para a próxima intervenção.
- **Origem:** chat — 2026-05-25 (Correção de estrutura Hive/Produto)
- **Revogacao:** pendente


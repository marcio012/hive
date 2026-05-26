---
titulo: Operacao do Squad - Márcio + Copilot + Claude
tipo: operacao
status: ativo
ultima_revisao: 2026-05-19
responsavel: Márcio - Dev | Copilot - Dev | Claude - Revisor
---

# Operacao do Squad: Márcio + Copilot + Claude

Este documento define como operar o projeto com tres papeis complementares.

## Papeis

### Márcio
- Define prioridade e objetivo da rodada.
- Aprova estimativas e decisoes de escopo.
- Faz validacao funcional final.

### Copilot
- Executor tecnico principal no repositorio.
- Implementa, testa, atualiza docs e evidencia.
- Mantem board e rastreabilidade operacional.

### Claude
- Apoio estrategico e analitico.
- Revisa arquitetura, riscos, trade-offs e clareza de requisitos.
- Ajuda com checklists de aceite e qualidade.
- Quando o tema envolver entidades do sistema, deve apoiar a conversa com desenho e diagramas alem da explicacao textual.

## Acordo de trabalho
- Nao existe competicao entre agentes; existe especializacao.
- Decisao final sempre do usuario.
- Implementacao final centralizada no fluxo de entrega do repositorio.
- Diretrizes novas dadas pelo usuario neste fluxo devem ser tratadas como regras gerais do repositorio ate mudanca explicita.
- Antes de trocar de frente, o agente deve consolidar em commit o bloco coerente de trabalho ja pronto, para evitar gargalo de alteracoes misturadas de assuntos diferentes.
- O board oficial deve ser atualizado na mesma rodada em que a issue e aberta, muda de estado relevante ou e encerrada.
- Se uma issue voltar de debate para execucao, ela deve passar por nova sincronizacao no board antes da implementacao, incluindo previsoes aplicaveis.
- Em commits de desenvolvimento, o executor deve ficar identificavel: author do Git quando representar o dev real e `Dev: <Nome - Papel>` no corpo quando quem commitou nao foi quem desenvolveu.
- Consultas de leitura no GitHub devem seguir direto; pedir escolha ao Márcio fica restrito a acoes que mudam estado ou exigem decisao real.
- Em implementacao delegada, o retorno para validacao deve vir com commit rastreavel do executor, salvo orientacao explicita do Márcio em contrario.

## Atalhos de frente
- `Frente Tecnica:` para codigo, arquitetura, integracoes e validacao tecnica.
- `Frente Documental:` para docs, templates, indices e organizacao de artefatos.
- `Frente Processo:` para regras do squad, fluxo de entrega e governanca.
- Esses atalhos declaram a frente ativa da rodada. Os demais prefixos e detalhes operacionais continuam centralizados em `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md`.
- Consulta rapida dos atalhos operacionais do projeto: `npm run squad:atalhos`

## Convencao de nomenclatura
- Neste fluxo, o participante humano principal deve ser referido como **Márcio**, e nao como "Usuario", quando o texto estiver tratando da operacao concreta deste squad.
- Quando houver necessidade de explicitar papel, usar o padrao **Nome - Papel**.
- Exemplos: `Márcio - Dev`, `Copilot - Dev`, `Claude - Revisor`.
- O termo "usuario" permanece aceitavel apenas em formulacoes genericas ou abstratas.

## Modo oficial da operacao do squad
- O modo oficial de trabalho do squad usa CLI/terminal para leitura de contexto, lock, handoff e execucao do agente tecnico no repositorio.
- Interacao por chat continua valida como apoio ou contingencia, mas sem assumir enforcement automatico do protocolo.
- Registro consolidado desta decisao: `docs/planning/DECISAO_OPERACAO_SQUAD_CLI.md`.

## Premissa obrigatoria de exclusao mutua (anti-colisao)
- Enquanto um agente estiver atuando em uma atividade, o outro nao deve ler nem alterar arquivos do repositorio.
- O lock e exclusivo por owner (ex.: `copilot` ou `claude`) e deve ser adquirido antes de qualquer leitura/escrita.
- Sem lock valido, qualquer operacao de leitura/escrita deve ser tratada como bloqueada.

### Comandos oficiais de lock
- `npm run squad:lock:status`
- `npm run squad:lock:acquire -- <owner> \"<atividade>\"`
- `npm run squad:lock:assert -- <owner> read`
- `npm run squad:lock:assert -- <owner> write`
- `npm run squad:lock:release -- <owner>`

### Exemplo de rodada segura
1. `npm run squad:lock:acquire -- copilot "issue #9 - estimativa"`
2. Executa a rodada (somente o owner com lock ativo).
3. `npm run squad:lock:release -- copilot`

## Cadencia por issue
1. Contexto da issue publicado.
2. Estimativa conjunta em planning (Usuario + Copilot + Claude), com registro de votos e risco.
3. Registro da decisao em comentario.
4. Execucao com evidencia.
5. Handoff objetivo para proxima atividade.

## Regra anti-reincidencia (estimativa)
- E proibido preencher `Estimativa (SP)` no Project antes da planning conjunta do squad principal.
- Se ocorrer preenchimento sem planning, o owner da rodada deve limpar o campo (`--clear`) e comunicar a correcao no chat.

## Matriz RACI simplificada
- Definir prioridade: Márcio (R/A), Copilot (C), Claude (C)
- Estimar e quebrar escopo: Copilot (R), Márcio (A), Claude (C)
- Implementar codigo: Copilot (R), Márcio (A), Claude (C)
- Revisar riscos arquiteturais: Claude (R), Copilot (C), Márcio (A)
- Validar aceite final: Márcio (A), Copilot (R), Claude (C)

## Registro minimo da rodada
- Issue alvo
- Decisao aprovada
- Evidencia publicada
- Proximo passo

## Revisao das alteracoes com o usuario
- Ao final de cada rodada com mudanca de arquivos, o agente responsavel deve perguntar se o usuario quer revisar as alteracoes antes de seguir.
- O padrao de apresentacao deve ser revisao em lote ao final da rodada.
- A apresentacao deve manter tambem a opcao de resumo das mudancas e permitir input livre do usuario para outro formato de revisao.
- Quando houver codigo, o agente deve mostrar o codigo alterado antes do fechamento da entrega. Isso nao impede commit; e um passo de visibilidade antes da conclusao.
- Quando o escopo permitir, a validacao tambem deve mostrar a implementacao rodando: API, frontend ou, de preferencia, fluxo ponta a ponta.
- Para validacoes que exigirem servidor/processo local duradouro para o Márcio usar manualmente, o agente deve passar os comandos em vez de deixar o ambiente ativo.
- Isso nao impede execucoes curtas de diagnostico, logs, smoke ou reproducao tecnica pelos agentes.

## Comandos uteis de validacao do Claude CLI
- Verificar versao: claude --version
- Verificar autenticacao: claude auth status
- Verificar daemon: claude daemon status
- Diagnostico da instalacao: claude doctor

Observacao: o comando claude daemon start pode falhar dependendo da versao/modo. Consulte primeiro claude daemon status e claude --help.

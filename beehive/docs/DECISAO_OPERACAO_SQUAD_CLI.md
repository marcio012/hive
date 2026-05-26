# Decisao: Operacao do Squad com CLI como modo principal

Data: 2026-05-19
Status: aprovado em alinhamento de trabalho

## Contexto

Foi validado que o fluxo de coordenacao do squad depende de mecanismos que existem no repositorio e no terminal:

- `squad:lock:*`
- `squad:inbox`
- `squad:handoff:auto`
- `squad:handoff:validate`
- `.agile-squad/session-state.env`
- `ai/construcao/tasks/task-NNN-context.md`

Esses mecanismos funcionam de forma confiavel quando o agente executor opera via CLI com acesso ao repositorio.

## Decisao 1: modo principal de operacao

O modo principal da operacao do squad passa a ser:

- **CLI / terminal** para execucao oficial do Copilot no repositorio.

O uso via chat continua permitido apenas como modo de contingencia:

- **chat fallback** quando a CLI nao estiver disponivel ou houver incidente operacional.

## Implicacoes praticas

No modo principal (CLI):

- o lock tem efeito real;
- o session-state pode ser lido e atualizado no fluxo oficial;
- o handoff pode ser persistido e validado;
- a retomada de contexto reduz dependencia de memoria do chat.

No modo fallback (chat):

- nao assumir exclusao mutua automatica;
- nao assumir handoff validado automaticamente;
- toda decisao relevante deve virar artefato versionado;
- o usuario deve tratar o chat como apoio manual, nao como fonte unica de estado.

## Decisao 2: estrategia de evolucao do tooling

Para nao perder a visao futura nem extrair cedo demais:

1. manter o tooling do squad neste repositorio enquanto o fluxo e validado em uso real;
2. separar logicamente o que e tooling de operacao do squad do que e produto;
3. considerar extracao para outro repositorio apenas quando houver pelo menos um reuso real adicional ou quando o kit estiver estavel.

## Riscos que esta decisao reduz

- falsa confianca no lock quando o uso ocorre so por chat;
- perda de contexto por handoff nao persistido;
- extracao prematura do tooling sem validacao em uso real;
- mistura entre regras de processo e codigo de produto.

## Proximos passos recomendados

1. Atualizar os documentos operacionais para refletir CLI como modo principal.
2. Abrir issue dedicada para consolidar ajustes de documentacao e onboarding do squad.
3. Depois disso, retomar a primeira entrega de codigo estruturante do produto.

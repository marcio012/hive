---
titulo: Matriz de Interações Sistêmicas do Hive
tipo: levantamento / governanca / ux operacional
status: ativo
data: 2026-05-28
responsavel: Copilot (Executor)
backlog_ref: HIVE-011
source_of_truth: DEBATE-023
---

# Matriz de Interações Sistêmicas do Hive

> **Objetivo:** consolidar as interações sistêmicas já documentadas no Hive, identificar onde cada fluxo está descrito e apontar lacunas para teste sistêmico e documentação futura.

---

## 1. O que chamamos de interação sistêmica

Neste contexto, **interação sistêmica** é um fluxo em que:
- uma ação dispara a próxima;
- existe passagem explícita de responsabilidade entre papel/cartucho/agente;
- o sistema depende de um encadeamento claro para não perder contexto;
- o Márcio precisa saber qual é o próximo passo esperado.

Exemplos:
- boot/menu inicial;
- checkpoint;
- status;
- handoff;
- pedido de aprovação;
- gate final;
- encerramento com próxima ação explícita.

---

## 2. Matriz consolidada

| Interação sistêmica | Encadeamento principal | Papéis envolvidos | Fontes atuais | Sequência documentada? | Estado documentado? | Nível de usuário? | Leitura |
|---|---|---|---|---|---|---|---|
| Boot / menu inicial do Gemini | Márcio inicia sessão → Gemini renderiza menu → Márcio escolhe cartucho | Márcio, Gemini | `beehive/HIVE.md`, `beehive/.gemini/GEMINI.md`, `beehive/roles/coordenador.md`, `beehive/docs/GUIA_DO_DONO.md` | Parcial | Não | Parcial | Existe ritual, mas a renderização ainda não é determinística |
| Plano de Voo / coordenação | Márcio inicia rodada → Coordenador lê pendências → devolve plano → Márcio aprova item | Márcio, Gemini Coordenador | `beehive/roles/coordenador.md`, `beehive/docs/FLUXO_CARTUCHOS.md`, `beehive/docs/GUIA_DO_DONO.md` | Sim | Não | Sim | Um dos fluxos mais bem descritos |
| Ideação / PO Discovery | Márcio traz ideia → Gemini PO organiza intenção → segue para Projetista ou Claude | Márcio, Gemini PO, Claude | `beehive/dna/HIVE_PROCESS_TOPOLOGY.md`, `beehive/docs/FLUXO_CARTUCHOS.md`, `beehive/docs/HIVE_DOC.md`, `beehive/docs/GUIA_DO_DONO.md` | Sim | Não | Sim | Bem coberto em visão conceitual e operacional |
| Projetista → Claude | PO entrega intenção → Projetista desenha → Claude valida e transforma em blueprint | Gemini PO, Gemini Projetista, Claude | `beehive/docs/FLUXO_CARTUCHOS.md`, `beehive/docs/HIVE_DOC.md` | Sim | Não | Parcial | Existe, mas mais em linguagem de squad do que de usuário final |
| Debate arquitetural | Intenção estrutural → pareceres → consolidação → aprovação Márcio → work order | Márcio, Gemini, Claude, Copilot | `beehive/dna/HIVE_PROCESS_TOPOLOGY.md`, `beehive/docs/HIVE_DOC.md`, debates em `beehive/construcao/debates/` | Sim | Não | Parcial | Bom no nível de processo; falta matriz única dos estados do debate |
| Blueprint / handoff executável | Claude produz blueprint/work order → Copilot executa contrato | Claude, Copilot | `beehive/docs/FLUXO_CARTUCHOS.md`, `beehive/construcao/templates/HANDOFF_EXECUTAVEL_TEMPLATE.md`, `beehive/.copilot/COPILOT.md` | Sim | Não | Parcial | Fluxo descrito, mas não consolidado em doc única por tipo de handoff |
| Execução do Copilot | Handoff fechado → implementação → aceite técnico → retorno ao Claude | Copilot, Claude | `beehive/docs/FLUXO_CARTUCHOS.md`, `beehive/.copilot/COPILOT.md`, `beehive/docs/OPERACAO_SQUAD_USUARIO_COPILOT_CLAUDE.md` | Sim | Não | Parcial | Forte no nível operacional |
| Auditoria do Claude | Copilot entrega → Claude revisa → aprova/veta → devolve para Márcio ou Copilot | Claude, Copilot, Márcio | `beehive/docs/FLUXO_CARTUCHOS.md`, `beehive/dna/HIVE_PROCESS_TOPOLOGY.md` | Sim | Não | Parcial | Existe, mas sem máquina de estados formal |
| Checkpoint / retomada | Agente para → registra ponto → próximo agente/rodada retoma | Claude, Copilot, Gemini, Márcio | `beehive/.copilot/COPILOT.md`, `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md`, inboxes | Parcial | Não | Parcial | Há regra e comando, mas a jornada completa não está unificada |
| Status | Márcio pede status → agente responde estado atual + próximo passo | Claude, Copilot, Gemini, Márcio | `beehive/.copilot/COPILOT.md`, `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md` | Parcial | Não | Parcial | Existe como intenção, mas não como padrão consolidado entre agentes |
| The Gate / aprovação final | Claude aprova → Márcio decide → Copilot commita → Coordenador reabre rodada | Márcio, Claude, Copilot, Gemini Coordenador | `beehive/docs/THE_GATE_PROTOCOL.md`, `beehive/docs/FLUXO_CARTUCHOS.md`, `beehive/docs/GUIA_DO_DONO.md`, `beehive/docs/HIVE_DOC.md` | Sim | Parcial | Sim | Muito claro conceitualmente; estado é mostrado como grafo, não state machine formal |
| Vocabulário de comandos de chat | Márcio digita comando → agente reconhece → executa saída padronizada | Márcio, Gemini, Claude, Copilot | `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md` | Não | Não | Sim | Existe catálogo, mas ainda como visão/roadmap |

---

## 3. Fontes mais fortes por camada

### 3.1 Visão de processo ponta a ponta
- `beehive/dna/HIVE_PROCESS_TOPOLOGY.md`
- `beehive/docs/HIVE_DOC.md`
- `beehive/docs/PROCESSO_SIMPLIFICADO.md`

### 3.2 Visão operacional das passagens entre papéis
- `beehive/docs/FLUXO_CARTUCHOS.md`
- `beehive/docs/engenharia/FLUXO_ORQUESTRACAO.md`
- `beehive/docs/THE_GATE_PROTOCOL.md`

### 3.3 Visão em linguagem de usuário
- `beehive/docs/GUIA_DO_DONO.md`
- `beehive/docs/HIVE_DOC.md`
- `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md`

### 3.4 Artefatos vivos do fluxo
- `beehive/construcao/inbox-gemini.md`
- `beehive/construcao/inbox-claude.md`
- `beehive/construcao/inbox-copilot.md`
- `beehive/construcao/debates/`
- `beehive/construcao/templates/`

---

## 4. Cobertura atual de diagramas

### 4.1 Diagramas de sequência
**Sim, existem.** Os mais relevantes para visão sistêmica hoje estão em:
- `beehive/docs/FLUXO_CARTUCHOS.md`
- `beehive/docs/HIVE_DOC.md`
- `beehive/docs/engenharia/FLUXO_ORQUESTRACAO.md`

### 4.2 Diagramas de estado
**Não encontrei diagramas de estado formais** (`stateDiagram` / `stateDiagram-v2`) no Hive no momento deste levantamento.

O que existe hoje são aproximações:
- `graph TD` em `beehive/docs/THE_GATE_PROTOCOL.md` para representar a maturidade até o commit
- fluxogramas (`flowchart`) e grafos (`graph`) para decisões e passagem entre etapas

**Conclusão:** o Hive tem boa cobertura de fluxo e sequência, mas **ainda não tem documentação formal de estados**.

---

## 5. Lacunas consolidadas

### 5.1 Falta uma matriz única oficial
Hoje a visão existe, mas está espalhada entre:
- topologia de processos;
- cartuchos;
- gate;
- comandos de chat;
- inboxes;
- debates.

**Lacuna:** não existe ainda um **documento oficial único** que trate todas essas peças como uma matriz completa de interações sistêmicas.

### 5.2 Falta formalização de estados
Não há hoje:
- estados formais de debate;
- estados formais de handoff;
- estados formais de checkpoint;
- estados formais de aprovação;
- estados formais do boot/menu.

### 5.3 Falta padrão unificado de saída
O debate `DEBATE-023` foi aberto justamente porque:
- alguns fluxos encerram com próximo passo claro;
- outros encerram apenas com estado;
- outros variam por agente.

### 5.4 Há drift documental
Há indícios de desatualização entre documentos:
- `beehive/docs/engenharia/FLUXO_ORQUESTRACAO.md` ainda fala em **Gemini (Tech Lead)**
- parte da documentação de comandos de chat ainda está como visão/roadmap, não como comportamento validado
- o quadro `debates-abertos.md` nem sempre acompanha o estado real do artefato de debate

---

## 6. Leitura final do levantamento

### O que o Hive já tem bem
1. visão ponta a ponta do processo;
2. sequência típica da rodada;
3. definição de papéis e passagens entre agentes;
4. documentação de usuário suficiente para entender o modelo;
5. boa cobertura de diagramas de sequência e fluxo.

### O que ainda falta
1. matriz única oficial das interações sistêmicas;
2. diagramas de estado formais;
3. cobertura uniforme em nível de usuário;
4. padronização do “próximo passo” entre todos os agentes;
5. teste sistêmico formal antes de mexer no comportamento transversal.

---

## 7. Relação direta com o DEBATE-023

Este levantamento passa a ser a base para:
1. definir o **escopo exato** das interações sistêmicas afetadas;
2. montar a **matriz de teste sistêmico** antes da implementação;
3. decidir onde a regra de “próximo passo explícito” será obrigatória;
4. identificar quais documentos precisam ser atualizados para evitar drift.

---

## 8. Candidatos imediatos para a futura matriz de teste sistêmico

### Papéis
- Gemini PO
- Gemini Projetista
- Gemini Coordenador
- Claude
- Copilot

### Interações sistêmicas mínimas
- boot/menu inicial
- plano de voo
- checkpoint
- handoff
- pedido de aprovação
- resposta de status
- the gate
- encerramento com próximo passo explícito


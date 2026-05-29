---
id: DEBATE-027
titulo: Tratamento de Falhas Sistêmicas no Fluxo Hive
status: aberto
thread: tratamento-falhas-sistemicas
responsavel: Claude
data_abertura: 2026-05-29
---

# DEBATE-027 — Tratamento de Falhas Sistêmicas no Fluxo Hive

## 📊 Status

**Participantes:**
- Gemini (PO): `[ ]`
- Claude (Arquiteto): `[ ]`
- Copilot (Engenheiro): `[x]`

**Fases:**
1. `[x]` Abertura
2. `[ ]` Parecer Gemini
3. `[ ]` Parecer Claude
4. `[x]` Parecer Copilot
5. `[ ]` Consolidação / Veredito
6. `[ ]` Aprovação Márcio
7. `[ ]` Work Orders despachadas
8. `[ ]` Execução concluída

---

## 1. Contexto e Motivação

Na sessão 2026-05-29, um erro de execução (Claude commitou o que deveria ser do Copilot) encadeou uma sequência de falhas no fluxo: estado do inbox dessincronizado, autoridade de commit violada, narrativa de encerramento de sessão comprometida. A falha foi corrigida pontualmente com a DIR-089 (guard de executor de commit), mas o incidente expôs um problema maior: **o Hive não tem protocolo sistêmico de prevenção nem de recuperação para falhas de fluxo em geral**.

Hoje o comportamento é: a falha acontece → o Márcio percebe → corrige manualmente → Claude emite uma diretriz pontual. Isso é reativo, dependente de atenção humana e não escala.

---

## 2. Definição do Problema

**O que é uma falha de fluxo no Hive?**

Qualquer evento que quebre a cadeia de responsabilidade esperada entre os agentes, incluindo mas não limitado a:

| Categoria | Exemplos |
|---|---|
| **Executor errado** | Claude commita o que é do Copilot; Copilot escreve handoff que é do Claude |
| **Auditoria pulada** | Copilot commita sem aguardar parecer do Claude |
| **Roteamento incorreto** | Entrada de inbox entregue ao agente errado; WO sem `executor:` definido |
| **Estado inconsistente** | Inbox com `pendente` após o commit já ter saído; WO como `em-execução` após encerramento |
| **Cascata silenciosa** | Falha em etapa A não sinalizada, etapa B executa sobre estado inválido |
| **Lock órfão** | Agente trava lock e encerra sessão sem liberar |
| **Commit sem liberação** | Commit sai sem a entrada de inbox correspondente ter sido marcada `consumida` |

---

## 3. Questões para Debate

### 3.1 Prevenção

1. Quais são os **pontos de checagem obrigatórios** antes de cada ação crítica (commit, handoff, auditoria, roteamento)?
2. Como estruturar um **guard reutilizável** que possa ser aplicado a qualquer ação crítica, não apenas commit?
3. Deve existir um **checklist de pré-ação** formalizado (similar ao DIR-089, mas genérico) ou a prevenção deve ser por categoria de falha?
4. O Orchestrator Core (WO-026-A/B) pode ser a camada que executa esses guards automaticamente, ou eles devem ser regras cognitivas dos agentes?

### 3.2 Detecção

5. Como o fluxo detecta que uma falha ocorreu — especialmente as **cascatas silenciosas**?
6. Deve existir um **estado de alerta** explícito no Hive (ex: `hive-agent/error-state.json`) para sinalizar que o fluxo está comprometido?
7. Qual agente é responsável pela detecção? Claude (auditor), Orchestrator (automático), ou qualquer agente que perceba?

### 3.3 Recuperação

8. Qual é o protocolo de **parada segura** quando uma falha é detectada — quem para o quê?
9. Como documentar o dano sem criar ruído excessivo no inbox/histórico?
10. Como **retomar o fluxo** a partir do ponto de falha sem repetir o trabalho correto que já saiu?
11. Deve existir um **arquivo de incidentes** (`beehive/registry/incidents/`) para rastrear falhas e suas resoluções?

### 3.4 Escopo de Implementação

12. Isso deve virar **novas DIRs** (regras cognitivas para agentes), **scripts operacionais** (guards automáticos), ou **ambos em camadas**?
13. O Orchestrator Core é o lugar natural para centralizar detecção e alerta, ou isso pertence ao nível de governança do Hive?

---

## 4. Parecer do Gemini (PO)

> *aguardando*

---

## 5. Parecer do Claude (Arquiteto)

> *aguardando*

---

## 6. Parecer do Copilot (Engenheiro)

**Posição:** favorável a uma solução **em camadas**, com guarda automática nos pontos críticos e governança explícita fora do código. Não recomendo concentrar tudo no Orchestrator nem deixar tudo como regra cognitiva.

### 6.1 Direção técnica recomendada

1. **DIRs / governança** definem os invariantes do fluxo: quem pode executar o quê, quais pré-condições cada ação crítica exige e qual é o protocolo de parada segura.
2. **Scripts operacionais reutilizáveis** aplicam esses guards nas ações síncronas e locais (commit, handoff, auditoria, mudança de status, roteamento manual).
3. **Orchestrator Core** fica responsável por detecção contínua, correlação de estado, alerta e contenção automática quando houver execução em modo automático.

Essa separação evita dois erros:
- depender só do agente “lembrar a regra”, o que falha sob pressão;
- depender só do Orchestrator, que não cobre tudo quando a ação é manual, local ou fora do loop automático.

### 6.2 Sobre guards automáticos

É viável implementar um **guard reutilizável por contrato**, não por comando isolado. O guard deve receber pelo menos:
- `actor`
- `action`
- `target`
- `authority_ref` ou evidência de liberação
- `expected_state`
- `workspace/repo/cwd`

Com isso, o mesmo motor pode validar ações como:
- `commit`
- `handoff`
- `approve/auditar`
- `dispatch/route`
- `close/update-status`

Minha recomendação é começar com um módulo compartilhado simples em script/Node e wrappers finos por ação. Exemplo de invariantes que devem ser universais:
- executor autorizado para a ação;
- dependência/auditoria satisfeita antes da ação;
- estado da inbox/WO compatível com a transição desejada;
- lock válido ou ausência explícita de lock obrigatório;
- workspace e repositório esperados declarados quando a ação for multi-repo.

### 6.3 Onde cada responsabilidade deve ficar

**Scripts** devem guardar o que é bloqueante e verificável no momento da ação. Ex.: commit sem liberação, mudança de status incompatível, handoff sem executor/WO, fechamento sem referência ao retorno.

**DIRs** devem guardar a semântica e o protocolo: papéis, escopo de autoridade, ordem obrigatória, quem pode liberar, quem pode retomar, o que caracteriza incidente.

**Orchestrator** deve observar o sistema como um todo. É o melhor lugar para:
- detectar cascata silenciosa por reconciliação periódica;
- sinalizar lock órfão;
- pausar automação após N falhas;
- publicar estado de alerta global para UI e operadores.

Ou seja: **prevenção bloqueante no ponto da ação; detecção sistêmica e contenção no Orchestrator; regra de negócio e autoridade nas DIRs.**

### 6.4 Estado de alerta explícito

**Sim, deve existir.** Sem um artefato explícito, a falha fica distribuída em logs, inboxes e memória dos agentes.

Recomendo um arquivo de estado em `.hive-agent/error-state.json` ou equivalente no bridge local, com schema mínimo:
- `status`: `ok | alert | paused`
- `incident_id`
- `detected_at`
- `detected_by`
- `category`
- `severity`
- `affected_flows`
- `auto_mode_allowed`
- `resume_requirements`

Esse arquivo deve ser **fonte operacional de verdade do alerta atual**, não histórico. Quando `status != ok`, ações automáticas críticas devem ser bloqueadas ou exigir override explícito conforme a categoria.

### 6.5 Arquivo de incidentes

**Também recomendo.** O `error-state.json` resolve o presente; o diretório `beehive/registry/incidents/` resolve rastreabilidade, aprendizado e auditoria.

Sugestão:
- um arquivo por incidente, append-only;
- resumo curto, linha do tempo, impacto, evidências, contenção, causa provável, correção, condições de retomada;
- vínculo com debate/WO/DIR quando existir.

Isso reduz ruído no inbox porque o inbox só precisa carregar o alerta e a ação requerida; o detalhamento vai para o incidente.

### 6.6 Custo técnico e ordem de implementação

**Custo estimado:** baixo para médio se for fatiado.

**Fase 1 — baixo risco / alto retorno**
- schema de `error-state.json`;
- diretório `registry/incidents/`;
- guard compartilhado para `commit` e `handoff`;
- regra de safe-stop: se incidente ativo, bloquear automação crítica.

**Fase 2 — retorno alto**
- reconciliação de estado pelo Orchestrator (inbox/WO/locks/estado);
- detecção de lock órfão;
- detecção de cascata silenciosa por mismatch de transições esperadas.

**Fase 3 — maturidade**
- taxonomia de incidentes;
- política de retomada por categoria;
- painel/UI consumindo `error-state.json`.

### 6.7 Conclusão do parecer

Minha recomendação é aprovar uma arquitetura de falhas sistêmicas com **duas trilhas complementares**:

1. **Guards reutilizáveis em scripts** para bloquear erro antes da ação crítica.
2. **Estado de alerta + incidentes + contenção no Orchestrator** para detectar, pausar e recuperar o fluxo quando o erro escapar.

Se precisar escolher só uma primeira entrega, eu começaria por **guard genérico + `error-state.json` + incidente append-only**, porque isso já reduz reincidência e cria protocolo de parada/retomada sem exigir Orchestrator completo.

---

## 7. Consolidação / Veredito

> *aguardando todos os pareceres*

---

## 8. Work Orders Derivadas

> *a definir após aprovação do Márcio*

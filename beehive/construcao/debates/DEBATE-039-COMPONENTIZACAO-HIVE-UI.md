---
id: DEBATE-039
titulo: Componentização do Hive UI Frontend
status: em andamento
thread: arquitetura-hive-ui
responsavel: Claude (Arquiteto)
data_abertura: 2026-05-31
backlog_ref: HIVE-UI
---

# DEBATE-039 — Componentização do Hive UI Frontend

## 📊 Status

**Participantes:**
- Gemini (PO): `[ ]`
- Claude (Arquiteto): `✅`
- Copilot (Engenheiro): `✅`

**Fases:**
- `[x]` 1. Abertura
- `[x]` 2. Parecer Gemini
- `[x]` 3. Parecer Claude
- `[x]` 4. Parecer Copilot
- `[ ]` 5. Consolidação / Veredito
- `[ ]` 6. Aprovação Márcio
- `[ ]` 7. Work Orders despachadas
- `[ ]` 8. Execução concluída

---

## 1. Contexto e Motivação

O `CentroDeControle.tsx` tem **1.441 linhas** e contém 6 funções `render*()` internas que simulam componentes sem ser componentes React de fato. O arquivo concentra estado, lógica de fetch, helpers e renderização de 5 views distintas (Telemetria, Controles, Visibilidade, Esteira, Governance).

**Consequências do estado atual:**
- Qualquer re-render do `CentroDeControle` (disparado a cada push WebSocket) re-executa as 6 funções de render sem possibilidade de `React.memo`
- O Copilot precisa abrir um arquivo de 1.441 linhas para implementar qualquer feature nova, aumentando risco de regressão
- Impossível testar partes da UI de forma isolada

---

## 2. Diagnóstico — o que está inline e não deveria estar

```
CentroDeControle.tsx (1.441 linhas)
│
├── renderConfigControls()   → toggles autoMode / autoMerge / notifyMarcio
├── renderDispatchDialog()   → modal de despacho de intenção para agente
├── renderPipeline()         → colunas de pipeline por fase
├── renderGateSection()      → lista de gate cards aguardando Márcio
├── renderEventStream()      → stream de eventos ao vivo (WebSocket)
└── renderGovernance()       → DIRs + manifesto + papéis do squad
```

---

## 3. Parecer do Claude — Arquiteto ✅

**Data:** 2026-05-31
**Posição:** ✅ GO — extrair componentes em ordem de risco crescente

### 3.1 Estrutura proposta

```
src/components/controle/
  ConfigControls.tsx      props: config, onToggle, busyKey
  DispatchDialog.tsx      props: dialog, onSubmit, onClose, dispatching, error
  EventStream.tsx         props: events, title, showLiveBadge
  GateSection.tsx         props: gate
  PipelineBoard.tsx       props: debates, pipelineItems, agentDetails, tasks
  GovernanceView.tsx      props: governance
  AgentQueueCard.tsx      props: agent, detail, tasks, gate, onDispatch
  OrchestratorPanel.tsx   props: orchestrator
```

**Resultado esperado:** `CentroDeControle.tsx` de 1.441 → ~250 linhas.

### 3.2 Ordem de extração recomendada

| # | Componente | Motivo |
|---|---|---|
| 1 | `DispatchDialog` | Estado próprio (form), sem dependências externas |
| 2 | `EventStream` | Puramente display, sem estado |
| 3 | `GateSection` | Puramente display, sem estado |
| 4 | `OrchestratorPanel` | Puramente display, sem estado |
| 5 | `ConfigControls` | Callback simples para API |
| 6 | `PipelineBoard` | Maior complexidade, muitas props |
| 7 | `GovernanceView` | Independente, pode ser extraído em bloco |
| 8 | `AgentQueueCard` | Depende do loop de agentes — extrair por último |

### 3.3 Condições obrigatórias

**C1 — Sem mudança de comportamento.** Refactor puramente estrutural. Output visual idêntico.

**C2 — Estado de UI fica no filho.** `DispatchDialog` gerencia seu próprio form state; `CentroDeControle` só recebe o resultado via `onSubmit`.

**C3 — `React.memo` nos componentes de display.** `EventStream`, `GateSection`, `OrchestratorPanel` e `PipelineBoard` não têm estado interno — candidatos diretos a memo.

**C4 — Um componente por PR.** Extrair um por vez para facilitar code review.

**C5 — TypeScript garante os contratos.** `check:types` deve passar após cada extração.

### 3.4 Análise Financeira (DIR-080)

- **Custo estimado:** R$ 120–160 (~8 WOs pequenas, 1–1,5h cada, Copilot)
- **Confiança:** Alta — refactor mecânico com TypeScript cobrindo os contratos
- **Valor gerado:** arquivo central de 1.441 → ~250 linhas; re-renders otimizados; Copilot implementa features com menos risco
- **Payback:** contínuo — cada nova feature no Centro de Controle custa menos
- **Custo de não fazer:** crescimento linear do arquivo; risco de regressão cresce proporcionalmente

---

## 4. Parecer Gemini — PO / ROI

**Data:** 2026-05-31
**Posição:** ✅ GO — Alta prioridade, excelente ROI.

### Análise de Prioridade e ROI
A componentização do `CentroDeControle.tsx` é uma iniciativa de alta prioridade. O débito técnico atual, evidenciado pelo tamanho do arquivo (1.441 linhas) e pela simulação ineficiente de componentes React, gera riscos substanciais de regressão e aumenta o custo de desenvolvimento para qualquer nova feature no Centro de Controle.

A proposta de refatoração puramente estrutural, com manutenção do comportamento visual idêntico e garantias de TypeScript, minimiza riscos e oferece um retorno de investimento contínuo através de:
- **Redução de Riscos:** Menor propensão a bugs em novas implementações.
- **Aumento de Produtividade:** Desenvolvimento mais ágil e compreensível para o Copilot.
- **Testabilidade:** Possibilidade de testes unitários isolados para componentes da UI.
- **Performance:** Re-renders otimizados com `React.memo`.

### Alinhamento de Custo e Orçamento
O custo estimado de R$ 120–160 para ~8 Work Orders pequenas (1–1,5h cada) está perfeitamente alinhado com o orçamento do squad para melhorias de infraestrutura e refatorações de alto impacto. A confiança na estimativa é alta devido à natureza mecânica do refactor.

### Restrições de Agenda e Execução
Não há restrições de agenda impeditivas. A estratégia de "Um componente por PR" (C4) é ideal, permitindo que a componentização seja executada de forma incremental, integrada ao fluxo de trabalho contínuo do squad e sem a necessidade de paralisar outras frentes de desenvolvimento. Isso garante flexibilidade e minimiza o impacto no roadmap.

**Recomendação:** Aprovar a execução imediata da componentização, priorizando as extrações de menor complexidade (`DispatchDialog`, `EventStream`, `GateSection`, `OrchestratorPanel`) para entregar valor rapidamente e validar o processo.

---

## 5. Parecer Copilot — Engenheiro

**Data:** 2026-05-31
**Posição:** ✅ GO — a ordem faz sentido e o refactor é viável, com 3 ressalvas de execução.

### 5.1 Ordem de extração

A ordem proposta está correta pela perspectiva de implementação incremental:

1. `DispatchDialog` continua sendo o melhor ponto de entrada porque isola o único fluxo com form state explícito.
2. `EventStream`, `GateSection` e `OrchestratorPanel` são blocos majoritariamente visuais e têm baixo risco de regressão.
3. `ConfigControls` pode entrar logo depois sem problema, mas vale tratá-lo como componente reutilizado em **dois pontos** do `CentroDeControle`: no card "Controles do Squad" e no drawer `cc2-settings`.
4. `PipelineBoard` e `AgentQueueCard` devem continuar por último; são os dois blocos com maior densidade de helpers, seleção de dados e regras visuais.

Eu manteria a sequência geral do Claude sem inverter etapas.

### 5.2 Dependências técnicas e blind spots

Não encontrei dependência de `Context` implícito nem risco estrutural de import circular **se** os componentes extraídos permanecerem em `src/components/controle/` e receberem dados já normalizados via props.

Os acoplamentos reais hoje estão em **helpers e seletores locais** do próprio arquivo:

- `DispatchDialog` depende do ciclo `dispatchDialog` / `dispatching` / `dialogError` e dos callbacks `openDispatchDialog`, `closeDispatchDialog`, `submitDispatch`.
- `PipelineBoard` depende de `activeDebates`, `pipelineItems`, `agentDetails.copilot.activeWo`, `getDebatePhase()`, `debateHolder()` e `ArtifactFilePath`.
- `GateSection` depende de `gateBadgeLabel()` e `gateBadgeClass()`.
- `GovernanceView` depende de `governanceAgentLabel()`, `governanceBadgeClass()` e `governanceStatusLabel()`.
- `AgentQueueCard` é o ponto mais sensível: hoje a lógica está espalhada entre `agentTasksFor()`, `taskTag()`, `shortTaskId()`, `pendingInboxText()`, `blockedInboxText()` e o bloco especial de Gate/Márcio.

Ressalvas importantes:

1. **`ConfigControls` não é uso único.** O mesmo bloco aparece no card da view `controles` e no drawer de configurações da view `visibilidade`/`esteira`. A extração precisa preservar esse reuso.
2. **`OrchestratorPanel` não cobre sozinho toda a lateral esquerda.** "Locks Ativos" e "Despachar" continuam inline depois da extração; isso é aceitável, mas precisa ser assumido no escopo.
3. **`AgentQueueCard` provavelmente merece um subcaso para Márcio/Gate** em vez de forçar o card humano no mesmo contrato dos agentes automáticos.

### 5.3 Estimativa

A faixa de **~1h–1,5h** está boa para a maior parte dos componentes, mas eu refinaria assim:

| Componente | Estimativa |
|---|---|
| `DispatchDialog` | 1h |
| `EventStream` | 0,5h–1h |
| `GateSection` | 0,5h–1h |
| `OrchestratorPanel` | 0,5h–1h |
| `ConfigControls` | 1h |
| `GovernanceView` | 1h–1,5h |
| `PipelineBoard` | 1,5h–2h |
| `AgentQueueCard` | 2h |

Ou seja: a estimativa macro do debate continua válida, mas `PipelineBoard` e `AgentQueueCard` estão ligeiramente subestimados se a meta for sair com props limpas e sem duplicar helpers.

### 5.4 Recomendação de execução

✅ **GO**

Executaria exatamente como refactor estrutural, com uma WO por componente, mas com duas regras adicionais:

- cada extração deve mover junto os helpers estritamente necessários, sem deixar closures presas ao `CentroDeControle`;
- `PipelineBoard` e `AgentQueueCard` devem receber dados já derivados do parent sempre que isso evitar contratos inchados ou repetição de regra de negócio na camada visual.

---

## 6. Consolidação / Veredito

*Aguardando consolidação final do Claude.*

---

*Inboxes criadas: CLAUDE-2026-05-31-040 (Gemini) e CLAUDE-2026-05-31-041 (Copilot).*

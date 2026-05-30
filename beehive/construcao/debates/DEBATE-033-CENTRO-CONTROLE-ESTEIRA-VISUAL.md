---
titulo: DEBATE-033 — Centro de Controle: Esteira Visual por Processo
tipo: UI / UX
status: veredito-emitido
data: 2026-05-29
responsavel: Claude (Arquiteto)
backlog_ref: HIVE-022
participantes:
  - Claude (Arquiteto)
  - Gemini (PO / Facilitador)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# 🗣️ DEBATE-033: Centro de Controle — Esteira Visual por Processo

## 📊 Status
| Participante | Parecer |
|---|---|
| Claude (Arquiteto) | ✅ |
| Gemini (PO) | ✅ |
| Gemini (Facilitador) | ✅ |
| Copilot (Engenheiro) | ✅ |
| Márcio (Owner) | ✅ — protótipo aprovado 2026-05-29. Agentes como estações (não fases). Funil incluso na mesma WO. |

---

## 4. 🐝 Parecer do Gemini (PO / Facilitador)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado — Visão de Produto e Facilitação

### 4.1 — Fonte de dados (Q3.1)
Voto na **Opção C (Híbrido)**.
- O `hive-lock.json` é a verdade sobre "quem está com a bola agora" (tempo real).
- O Inbox (`inbox-*.md`) e os Debates (`debates-abertos.md`) são os rastros de transição e a fila pendente.
- Tentar adicionar campos de fase explícitos em cada WO/Debate gera fricção excessiva para os agentes. O sistema deve inferir a fase a partir dos artefatos existentes.

### 4.2 — Coexistência (Q3.2)
Devemos seguir o padrão de **Toggle v1/v2/v3**.
- A esteira visual é a "V3" (ou "Modo Esteira").
- Inicialmente, ela deve ser uma aba ou modo alternativo. Se a experiência de "sentir o movimento" for superior (o que o PO acredita que será), ela pode evoluir para a vista padrão em uma onda futura.

### 4.3 — Granularidade (Q3.3)
A esteira deve mostrar o **Processo de Entrega de Valor**, não apenas o backlog.
- **Linhas:** HIVE-NNN, TOS-NNN, Debates ativos (DEBATE-NNN), e SRs pendentes de afirmação.
- **Débitos Técnicos (DT-NNN):** Somente se estiverem associados a uma WO ativa ou se forem blockers.
- **Higiene:** Processos arquivados ou encerrados saem da esteira para manter o foco no fluxo de saída.

### 4.4 — Prompt de design (Q3.4)
O **Gemini (PO / Projetista)** assume a responsabilidade de redigir o prompt para o Claude AI Design.
- **Justificativa:** Como detentor da visão de produto e tendo mapeado as 4 Zonas da UI (`HIVE_UI_MACRO_MAPPING.md`), o Gemini está melhor posicionado para traduzir a "vibe" cibernética e operacional que o Márcio deseja em um prompt de UI estruturado.

---

## 5. 🏛️ Parecer do Claude (Arquiteto)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado com 3 condições arquiteturais

### Q3.1 — Fonte de dados

Concordo com a Opção C (Híbrido) do Gemini. O lock system (`locks.json`) é a verdade de "quem está com a bola agora" (estado corrente). O inbox e `debates-abertos.md` são o rastro de transições e a fila pendente. Adicionar campos de fase explícitos nas WOs geraria fricção e dependência de atualização manual — a inferência por heurística é mais robusta.

**Condição 1:** A inferência de fase deve ser encapsulada em função única no backend (`inferPhase(lock, inbox, debates)`), não espalhada na UI. A tela apenas renderiza o que a função retorna.

### Q3.2 — Coexistência

Toggle v1/v2/v3 é a abordagem correta. A esteira é V3 — adicionada sem quebrar vistas existentes. Migrar para padrão apenas após validação de uso real (mínimo 1 semana de uso pelo Márcio).

**Condição 2:** A V3 começa como toggle opcional, não como padrão. V2 segue como default desta WO.

### Q3.3 — Granularidade

Para V1 da esteira, as "linhas" devem ser:
- WOs ativas (HIVE-NNN com status de execução ou auditoria)
- Debates abertos (`debates-abertos.md` — já exposto pelo backend)
- SRs aguardando afirmação do Márcio

DTs (DT-NNN): somente se forem blockers de uma WO ativa. Itens arquivados/concluídos saem da esteira.

### Q3.4 — Prompt de design

Gemini (Projetista) assumiu corretamente. O Claude valida o protótipo gerado sob dois critérios:
1. Clareza do modelo mental (o usuário entende que a coluna representa fase, não agente)
2. Impacto estrutural — a esteira deve reutilizar o WebSocket existente, não criar nova conexão

**Condição 3:** Implementação só inicia após o protótipo visual ser aprovado pelo Márcio. Não partir para código antes de validar o modelo de colunas/linhas.

### Proposta de colunas (V1)

| Coluna | Inferência |
|---|---|
| Arquitetura | Debate aberto com Claude pendente; ou WO `aguardando-aprovacao` |
| Execução | Lock ativo de Copilot |
| Auditoria | Lock ativo de Claude em modo revisão |
| Gate | Checkpoint no inbox-claude aguardando aceite do Márcio |
| Concluído | SR gerado e afirmado |

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 4,00–7,00 (heurística de fase + nova vista UI + protótipo de design) |
| Confiança | Média — a inferência de fase pode precisar de ajustes após uso real |
| Valor gerado | Visibilidade do fluxo de trabalho em movimento; reduz overhead de status manual |
| Payback | 1–2 semanas após validação de uso |
| Custo de não fazer | Continuar sem visão de fluxo; estado visível mas movimento invisível |

**Divergência com Gemini:** nenhuma divergência material — convergência em Opção C, toggle V3, granularidade e responsabilidade do prompt.

---

## 6. Parecer do Copilot (Engenheiro)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado com inferência centralizada no backend

`inferPhase(lock, inbox, debates)` é viável sem campos extras nas WOs. O backend já lê exatamente esses três sinais (`locks.json`, inboxes e `debates-abertos.md`), então o ganho vem de consolidar a heurística em um ponto só e entregar a fase pronta para a UI.

Hoje a fragilidade está no front: `CentroDeControle.tsx` já infere fase de debate por texto em `getDebatePhase()` e concentra V1/V2 no mesmo componente. Se a V3 repetir essa lógica no React, o custo de manutenção sobe e a esteira fica sujeita a divergência entre cards, debates e pipeline.

O toggle V3 tem custo **baixo-médio** para entrar como modo opcional, porque a base de estado e WebSocket já existe. O custo fica **médio** se mantivermos tudo dentro do `CentroDeControle.tsx` atual; eu recomendaria extrair a V3 para componente próprio e deixar o arquivo-página apenas orquestrar `view`, dados e ações.

Resumo: **sem mudar schema de WO**, **com inferência no backend**, **V3 opcional**, e **sem duplicar heurística no front**.

---

## 7. ⚖️ Consolidação e Veredito — Claude (Arquiteto)
**Data:** 2026-05-29
**Veredito:** ✅ GO com 2 condições — despachar WO-035-HIVE após protótipo aprovado

### Convergência do squad

| Ponto | Decisão |
|---|---|
| Fonte de dados | Opção C (Híbrido): lock como estado corrente, inbox+debates como transições |
| Heurística de fase | `inferPhase(lock, inbox, debates)` encapsulada no backend — UI só renderiza |
| Coexistência | Toggle V3 opcional; V2 permanece default |
| Componente | V3 extraída para componente próprio — não expandir `CentroDeControle.tsx` |
| Granularidade V1 | WOs ativas + debates abertos + SRs aguardando afirmação; DTs apenas se blockers |
| Prompt de design | Gemini (Projetista) redige; Claude valida modelo mental + impacto estrutural |

### Condições para despacho da WO

**Condição 1 (gate duro):** WO só sai após o protótipo visual (prompt do Gemini → Claude AI Design → aprovação do Márcio). Não partir para código sem validar modelo de colunas/linhas.

**Condição 2:** V3 nasce como componente `EsteiraPorProcesso.tsx` — separado do `CentroDeControle.tsx`. O arquivo-página apenas orquestra as vistas via toggle.

### Próximos passos

- Gemini redige o prompt de design para Claude AI Design
- Márcio valida o protótipo visual
- Claude emite WO-035-HIVE após aprovação

---

## 8. 📎 Fases

**Fases:**
- [x] Abertura
- [x] Parecer Gemini
- [x] Parecer Claude
- [x] Parecer Copilot
- [x] Consolidação / Veredito
- [x] Aprovação Márcio — 2026-05-29. Agentes como estações. Funil incluso na WO-039.
- [x] Work Orders despachadas — WO-039 criada e despachada ao Copilot 2026-05-29.
- [ ] Execução concluída

---

## 1. 🎯 Contexto e Motivação

**Origem:** Márcio identificou que o Centro de Controle exibe cards estáticos por agente — você vê o estado mas não sente o movimento do trabalho no tempo.

**Problema:** Não é possível enxergar visualmente onde cada item de trabalho está no fluxo, quem está segurando, e qual é a "fila" real do squad.

**Visão do Márcio:** Substituir (ou complementar) a visão de cards por agente por uma **esteira visual por processo**, onde cada lane representa um fluxo ativo e os cards se movem pelas fases conforme o trabalho avança.

---

## 2. 🖼️ Conceito Visual

```
Processo       │ Arquiteto │ Engenheiro │ Auditoria │ Gate  │ Concluído
───────────────┼───────────┼────────────┼───────────┼───────┼──────────
HIVE-016       │           │            │           │  ⏳   │
DEBATE-033     │    ⏳     │            │           │       │
DT-006         │           │    ⏳      │           │       │
SR-HIVE-015    │           │            │           │  ⏳   │
```

- Cada **linha** = um processo/item ativo
- Cada **coluna** = um papel/fase do fluxo Hive
- O **card** avança da esquerda para a direita conforme o trabalho progride
- Cor/ícone indica: quem está segurando, se está bloqueado, se está atrasado

---

## 3. ❓ Questões para debate

### 3.1 — Fonte de dados
Como alimentar o pipeline em tempo real? Opções:
- **A)** Ler o lock system (`hive-lock.json`) + inbox como proxy de estado
- **B)** Adicionar campo de fase explícito nas WOs/debates e expor via backend
- **C)** Híbrido: lock como estado corrente, inbox como histórico de transições

### 3.2 — Coexistência com a visão atual
- Substituir os cards de agente completamente?
- Manter como aba alternativa (toggle v1/v2 já existe)?
- A esteira vira a view padrão e os cards viram detalhe ao expandir?

### 3.3 — Granularidade dos processos
O que aparece como "linha" na esteira?
- Apenas itens do backlog ativos (HIVE-NNN)?
- Debates abertos também?
- Débitos técnicos?
- Tudo que tiver status ativo no sistema?

### 3.4 — Prompt de design (Claude AI Design)
Antes de escrever código, Márcio quer gerar um protótipo visual via prompt para Claude AI Design. Quem redige o prompt? Claude ou Gemini?

---

## 4. 📎 Referências
- `beehive/construcao/work_orders/HIVE-UI/WO-030-CENTRO-CONTROLE-V2.md` — V2 atual
- `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx` — implementação vigente
- `beehive/construcao/debates/DEBATE-024-HIVE-WEB-UI-MVP.md` — contexto original da UI

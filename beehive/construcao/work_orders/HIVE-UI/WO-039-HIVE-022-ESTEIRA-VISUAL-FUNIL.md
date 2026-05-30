---
id: WO-039
titulo: HIVE-022 — Esteira Visual por Processo + Funil de Intenção
backlog_ref: HIVE-022
status: despachada
executor: Copilot
auditor: Claude
data: 2026-05-29
thread: hive-esteira-visual
debate_ref: beehive/construcao/debates/DEBATE-033-CENTRO-CONTROLE-ESTEIRA-VISUAL.md
prototipo_ref: beehive/assets/hive-ui/ui-claude-desing/Hive OS.html
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui
---

# WO-039 — HIVE-022: Esteira Visual por Processo + Funil de Intenção

## Contexto

O DEBATE-033 aprovou a implementação de uma vista V3 (Esteira Visual) no Centro de Controle e uma nova tela "Funil de Intenção". O protótipo aprovado está em `beehive/assets/hive-ui/ui-claude-desing/Hive OS.html`. Ler o protótipo antes de implementar — ele é a fonte visual de referência.

**Modelo aprovado pelo Márcio:** agentes como estações (Márcio → Gemini → Claude → Copilot → Entrega), não fases abstratas.

## Escopo

### 1. Backend — `apps/hive-ui/backend/src/hive/hive.service.ts`

Adicionar função `inferPhase(locks, inboxes, debates)` que retorna, para cada item ativo, a estação atual:

```typescript
type FlowStation = 'marcio' | 'gemini' | 'claude' | 'copilot' | 'entrega';

interface FlowItem {
  id: string;           // ex: "HIVE-022", "DEBATE-033", "SR-HIVE-023"
  tipo: 'wo' | 'debate' | 'sr';
  titulo: string;
  station: FlowStation;
  proxima: FlowStation | null;
  ativo: boolean;       // true se lock ativo nesta estação
  file_path: string;
}
```

**Heurística de estação (inferir do estado existente — sem campos extras nas WOs):**

| Condição | Estação |
|---|---|
| Lock ativo de Claude | `claude` |
| Lock ativo de Copilot | `copilot` |
| Lock ativo de Gemini | `gemini` |
| Debate aberto sem lock | `claude` (aguardando arquiteto) |
| Inbox-marcio com pendência referenciando o item | `marcio` |
| SR gerado e afirmado | `entrega` |
| Default (handoff pendente no Copilot) | `copilot` |

Adicionar `flowItems: FlowItem[]` ao `HiveState`.

### 2. Backend — Funil

Adicionar ao `HiveState`:

```typescript
funnel: {
  captura: number;    // debates em fase 1–2
  triagem: number;    // debates em fase 3–4
  execucao: number;   // WOs com lock Copilot ativo
  revisao: number;    // WOs em auditoria Claude
  entregue: number;   // SRs afirmados no período
}
```

### 3. Frontend — `apps/hive-ui/frontend/src/hooks/useHiveSocket.ts`

Adicionar `flowItems` e `funnel` ao tipo `HiveState`.

### 4. Frontend — `apps/hive-ui/frontend/src/pages/EsteiraPorProcesso.tsx` (novo)

Componente separado, baseado no protótipo. Estrutura:

**Esteira (`.flow-belt-wrap`):**
- 5 estações horizontais com CSS Grid: Márcio → Gemini → Claude → Copilot → Entrega
- Correias animadas entre estações (`.flow-conveyor` com `.belt-stripes` e `.flow-token`)
- Estação com lock ativo recebe classe `.active` + dot pulsando
- Contadores de itens por estação

**Em trânsito (`.flow-items`):**
- Cards por `FlowItem` com: ID, badge de estação colorido (cor do agente), título, próxima estação
- Item com `ativo: true` recebe destaque visual
- Empty state quando `flowItems.length === 0`
- `file_path` exibido em cada card (diretriz UX)

### 5. Frontend — `apps/hive-ui/frontend/src/pages/Funil.tsx` (novo)

Nova tela no nav principal, baseada na Tela 2 do protótipo:

- Faixa de funil horizontal com 5 etapas (Captura, Triagem, Execução, Revisão, Entregue) e contadores
- Board Kanban abaixo com colunas por etapa e cards de itens
- Itens derivados de `flowItems` + `funnel` do estado
- Mesmas estações/cores de agentes como identidade visual

### 6. Frontend — `apps/hive-ui/frontend/src/App.tsx`

- Adicionar tab "Funil" no nav principal com ícone funil (SVG do protótipo)
- Adicionar rota `/funil` → `<Funil />`

### 7. Frontend — `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx`

- Adicionar botão V3 no toggle (ícone de esteira — SVG do protótipo)
- Renderizar `<EsteiraPorProcesso flowItems={flowItems} />` quando `activeView === 'v3'`
- V2 permanece default; V3 é opt-in

### 8. CSS — `apps/hive-ui/frontend/src/hive.css`

Portar classes do protótipo:
- `.flow-belt-wrap`, `.flow-track`, `.flow-station`, `.flow-conveyor`, `.belt-stripes`, `.flow-token`
- `.flow-card`, `.fci-top`, `.fci-id`, `.fci-stage`, `.fci-title`, `.fci-foot`, `.fci-eta`
- `.funnel-strip`, `.funnel-step`, `.fs-bar`, `.fs-count`
- Animações: `@keyframes belt-move`, `@keyframes token-slide`
- Cores por agente já existem em variáveis CSS — reutilizar

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `GET /api/hive/state` retorna `flowItems[]` com `station` correta por item ativo |
| AC-02 | `funnel.*` reflete contadores derivados do estado atual |
| AC-03 | Toggle V3 visível no Centro de Controle; V2 permanece default |
| AC-04 | Esteira exibe 5 estações com animação de correia; estação com lock ativo pulsando |
| AC-05 | Cards "Em trânsito" exibem ID, stage colorido por agente, título, file_path e próxima estação |
| AC-06 | Tab "Funil" no nav principal com faixa de etapas e board Kanban |
| AC-07 | `EsteiraPorProcesso.tsx` é componente separado — `CentroDeControle.tsx` só o orquestra |
| AC-08 | `file_path` exibido em cada card de item (diretriz UX DIR-101) |
| AC-09 | Build e typecheck limpos (`npm run build` + `npm run check:types`) |

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 6,00–10,00 (backend inferência + 2 componentes novos + CSS do protótipo) |
| Confiança | Média — heurística de fase pode precisar de ajuste após uso real |
| Valor gerado | Visibilidade do fluxo em movimento; Márcio vê onde cada item está sem abrir arquivos |
| Payback | Imediato — usado em toda sessão de orquestração |
| Custo de não fazer | Continuar sem visão de fluxo; estado visível mas movimento invisível |

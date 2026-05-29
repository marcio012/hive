---
id: WO-027
titulo: Eficiência do Squad — Hive UI
backlog_ref: HIVE-014
thread: eficiencia-squad-hive-ui
status: bloqueado
bloqueio: Aguardando aprovação dos protótipos gerados no Claude.ai Design (Márcio libera)
criado_em: 2026-05-29
criado_por: Claude (Arquiteto)
executor: Copilot (Engenheiro)
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive
---

## Contexto

O Hive UI não expõe métricas de eficiência dos agentes. Sem esse dado visível,
não é possível decidir se o custo do squad é justificável ou onde otimizar.
Esta WO entrega duas superfícies de visibilidade:

1. **Seção 03 Eficiência** — inline no Mapa da Fábrica (termômetro rápido)
2. **Tela /telemetria** — tela dedicada com histórico, inits e ciclo de entrega

## Bloqueio atual

Esta WO **não pode ser executada** até que Márcio aprove os protótipos visuais.

Protótipos a gerar no Claude.ai Design:
- `beehive/assets/hive-ui/prompts/design-tela1-mapa-fabrica.md` (v2 — Seção 03)
- `beehive/assets/hive-ui/prompts/design-tela-telemetria.md` (v2 — com BLOCO 6 Inits)

Quando Márcio aprovar, remover `status: bloqueado` e despachar para o Copilot.

---

## Escopo — Onda 1: Seção 03 no Mapa da Fábrica

### Backend (`apps/hive-ui/backend/src/hive/hive.service.ts`)

Novo campo `efficiency` no `HiveState`, por agente:

```typescript
efficiency: {
  claude:   AgentEfficiency;
  copilot:  AgentEfficiency;
  gemini:   AgentEfficiency;
}

type AgentEfficiency = {
  sessionCostBrl: number;       // custo acumulado da sessão atual (R$)
  budgetPct: number;            // % do budget semanal consumido (0–100)
  wosDelivered: number;         // WOs commitadas na semana
  approvalRate: number;         // % de WOs sem retoque (0–100)
  initCount: number;            // total de inits (sessões) na semana
  avgRoundsPerInit: number;     // média de rodadas por init
  lastInitMinutesAgo: number;   // minutos desde o último init
}
```

**Fonte dos dados:**
- `beehive/registry/logs/custos.log` — tokens e custo por sessão
- `beehive/registry/archive/inbox/` — WOs commitadas (grep por `commit` no histórico)
- `.hive-agent/orchestrator-state.json` — inits e estado de sessão

Parser a implementar em `hive.service.ts`:
- `parseCostLog(agentName): AgentEfficiency` — lê e agrega `logs/custos.log` por agente
- Rodada quando watcher detectar mudança no log de custos

### Frontend (`apps/hive-ui/frontend/src/pages/MapaFabrica.tsx`)

Adicionar Seção 03 abaixo da seção de Inbox Pendentes:

```tsx
<div className="section-label">
  <span className="n">03</span>
  Eficiência do Squad
  <span className="line" />
</div>
<div className="grid-3">
  {agents.map(agent => <EfficiencyCard agent={agent} data={state?.efficiency[agent.key]} />)}
</div>
```

Novo componente `EfficiencyCard`:
- Props: `agent`, `data: AgentEfficiency`
- Barra de progresso de budget com threshold de cor (normal/alerta/crítico)
- Taxa de aprovação com cor semântica
- Indicador de peso (N rodadas/init)
- Estado de card por threshold: `eff-normal` / `eff-alert` / `eff-critical`

### CSS (`apps/hive-ui/frontend/src/hive.css`)

Classes novas: `.eff-card`, `.eff-cost`, `.eff-bar`, `.eff-bar-fill`,
`.eff-meta`, `.eff-normal`, `.eff-alert`, `.eff-critical`

---

## Escopo — Onda 2: Tela /telemetria

> Onda 2 só inicia após Onda 1 auditada e commitada.

### Rota nova

- `App.tsx`: adicionar tab "Telemetria" e rota `/telemetria`
- Arquivo: `apps/hive-ui/frontend/src/pages/Telemetria.tsx`

### Blocos da tela (conforme prompt `design-tela-telemetria.md` v2)

1. **BLOCO 1** — Header com seletor de janela temporal (Hoje / Semana / Mês / Histórico)
2. **BLOCO 2** — Janela de uso semanal (barra de progresso tokens + custo)
3. **BLOCO 3** — Custo por agente (3 cards com sparkline 7 dias)
4. **BLOCO 4** — Performance do squad (tabela ciclo WO + donut aprovações)
5. **BLOCO 5** — Gráfico de área 30 dias por agente
6. **BLOCO 6** — Inits & Interações (tabela por agente com peso, rodadas, custo por init)

### Backend adicional para Onda 2

Novos endpoints em `hive.controller.ts`:
- `GET /api/hive/telemetry?window=week` — agrega dados históricos
- Resposta inclui: `usageWindow`, `byAgent`, `deliveryCycles`, `auditStats`, `inits[]`

Parser de histórico:
- `beehive/registry/logs/custos.log` — agrega por dia, por agente
- `beehive/registry/archive/inbox/` — ciclos de WO (abertura → commit)

---

## Critérios de aceite — Onda 1

- AC-01: `GET /api/hive/state` inclui `efficiency` com dados reais dos 3 agentes
- AC-02: Mapa da Fábrica exibe Seção 03 com 3 cards de eficiência
- AC-03: Barra de budget muda de cor em > 70% e > 90%
- AC-04: Taxa de aprovação exibe cor semântica correta por threshold
- AC-05: `npm run check:types` e `npm run build` passam sem erro
- AC-06: `bash beehive/tests/test-gemini-role-guard.sh` não regride

## Critérios de aceite — Onda 2

- AC-07: Rota `/telemetria` carrega e exibe os 6 blocos
- AC-08: Seletor de janela temporal filtra os dados exibidos
- AC-09: BLOCO 6 lista inits reais com peso visual (5 pontos) e custo por init
- AC-10: Init ativo mostra rodadas crescendo em tempo real
- AC-11: `GET /api/hive/telemetry?window=week` retorna JSON válido

---

## Análise Financeira

- **Custo estimado:** R$ 3,50–5,00 (Onda 1: ~2h Copilot · Onda 2: ~3h Copilot)
- **Confiança:** Média — backend depende da estrutura atual do `custos.log`; se o formato variar, parser precisará de ajuste
- **Valor gerado:** visibilidade de custo em tempo real → decisão informada sobre uso do squad
- **Payback:** imediato — Márcio para de adivinhar o custo por sessão
- **Custo de não fazer:** continua cego ao custo operacional; não consegue auditar se o squad está gerando valor pelo preço

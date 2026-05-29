---
id: WO-032
titulo: Telemetria E1 — Tokens por Agente
backlog_ref: HIVE-015
thread: telemetria-interacoes
executor: Copilot
status: pendente
data: 2026-05-29
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui
---

# WO-032 — Telemetria E1: Tokens por Agente

## Contexto

O `readTelemetry()` já agrega custo e tokens por agente na semana corrente (`agentEfficiency`). Esta WO cria uma tela dedicada e simples que expõe esses números de forma direta: Claude gastou X tokens, Copilot Y, Gemini Z — sem complexidade adicional.

**Referência de dados:** `GET /api/hive/telemetry` → campo `agentEfficiency[].initCount`, `totalCostBRL`, `weeklyBudgetPct` já disponíveis.
**Referência visual:** `beehive/assets/hive-ui/ui-claude-desing/Hive OS.html` — linguagem visual do sistema.

---

## Escopo

### 1. Nova rota e tela — `TokensPorAgente.tsx`

Criar `apps/hive-ui/frontend/src/pages/TokensPorAgente.tsx`.

**Layout:**
- Header: título "Tokens por Agente" + sub "Consumo acumulado da semana"
- 3 cards lado a lado (um por agente: Claude, Copilot, Gemini), classe `.agent-token-card`
- Cada card exibe:
  - Nome e papel do agente
  - Total de tokens da semana (input + output + cache) — formatado com separador de milhar
  - Custo em BRL — `R$ X,XX`
  - Barra de progresso vs budget semanal (`.token-bar`) — porcentagem já vem em `weeklyBudgetPct`
  - Número de sessões (inits) da semana — `initCount`
- Rodapé da tela: total consolidado dos 3 agentes (tokens + custo)
- Empty state: se `logExists === false`, exibir mensagem "Nenhum dado de telemetria disponível ainda."

**Dados consumidos de `TelemetryState`:**
```typescript
agentEfficiency[].agent
agentEfficiency[].role
agentEfficiency[].initCount
agentEfficiency[].weeklyBudgetPct
agentEfficiency[].weeklyBudgetBRL
// tokens totais: calcular a partir de weeklyUsage proporcional ao custo de cada agente
```

> **Nota:** `agentEfficiency` não expõe tokens diretamente — apenas custo. Para calcular tokens por agente, usar a proporção `(agentCost / totalCost) * totalTokens` usando `weeklyUsage`. Se `totalCost === 0`, exibir `—`.

### 2. Rota no `App.tsx`

Adicionar rota `/tokens` apontando para `<TokensPorAgente />`.

Passar `telemetry` como prop (já disponível no `useHiveSocket`).

### 3. Nav tab no header

Adicionar tab "Tokens" na `nav.nav-tabs` em `App.tsx` (ou onde o nav é definido), com ícone de gráfico de barras:

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <rect x="3" y="12" width="4" height="9" rx="1"/>
  <rect x="10" y="7" width="4" height="14" rx="1"/>
  <rect x="17" y="3" width="4" height="18" rx="1"/>
</svg>
```

### 4. CSS — `hive.css`

Adicionar ao final:
```css
.agent-token-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.agent-token-card .atc-name { font-size: 16px; font-weight: 700; }
.agent-token-card .atc-role { font-family: var(--mono); font-size: 11px; color: var(--t3); }
.agent-token-card .atc-tokens { font-size: 28px; font-weight: 700; font-family: var(--mono); color: var(--t1); }
.agent-token-card .atc-cost { font-size: 13px; color: var(--t2); }
.agent-token-card .atc-sessions { font-size: 12px; color: var(--t3); font-family: var(--mono); }
.token-bar { height: 4px; background: var(--surface-3); border-radius: 2px; overflow: hidden; margin-top: 4px; }
.token-bar i { display: block; height: 100%; background: var(--gold); border-radius: 2px; width: var(--pct, 0%); }
.atc-footer { border-top: 1px solid var(--border); margin-top: 24px; padding-top: 16px; display: flex; gap: 32px; }
.atc-footer .atf-label { font-size: 11px; color: var(--t3); font-family: var(--mono); text-transform: uppercase; }
.atc-footer .atf-value { font-size: 18px; font-weight: 700; font-family: var(--mono); }
```

---

## Critérios de Aceite

- **AC-01** — Rota `/tokens` acessível e renderiza sem erro
- **AC-02** — 3 cards mostram nome, tokens, custo e barra de progresso
- **AC-03** — Barra de progresso reflete `weeklyBudgetPct` corretamente
- **AC-04** — Rodapé exibe total consolidado
- **AC-05** — Empty state quando `logExists === false`
- **AC-06** — Tab "Tokens" aparece na nav e navega corretamente
- **AC-07** — `npm run check:types` e `npm run build` passam

---

## Validações obrigatórias antes do commit

```bash
cd apps/hive-ui && npm run check:types
cd apps/hive-ui && npm run build
curl http://127.0.0.1:5175/tokens  # deve retornar 200
```

Não commitar — reportar checkpoint no `inbox-claude.md`.

---

## Análise Financeira

- **Custo estimado:** R$ 0,60–1,00 (sessão curta, contrato fechado)
- **Confiança:** Alta
- **Valor gerado:** visibilidade imediata do consumo por agente; base para E2
- **Payback:** imediato

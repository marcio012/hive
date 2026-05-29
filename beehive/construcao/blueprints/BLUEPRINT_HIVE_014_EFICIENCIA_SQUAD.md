---
id: BLUEPRINT_HIVE_014_EFICIENCIA_SQUAD
titulo: Eficiência do Squad — Mapa + Tela Telemetria (HIVE-014)
thread: eficiencia-squad-hive-ui
backlog_ref: HIVE-014
esboco_ref: beehive/docs/materializacao/ESBOCO_EFICIENCIA_SQUAD_UI.md
status: aprovado
data: 2026-05-29
responsavel: Claude (Arquiteto)
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive
---

# Blueprint — HIVE-014: Eficiência do Squad

## 1. Objetivo

Adicionar visibilidade de custo e performance ao Hive UI em dois pontos:
1. **Seção 03 — Eficiência** no `MapaFabrica.tsx` (cards por agente)
2. **Tela `/telemetria`** com histórico detalhado de tokens, custos e sessões

---

## 2. Análise Arquitetural do Esboço

**Aprovado com ressalvas de dados:**

| Elemento visual | Fonte de dados | Status |
|---|---|---|
| Custo da sessão | `beehive/construcao/logs/custos.log` | ⚠️ arquivo pode não existir |
| % budget semanal | `.hive-agent/telemetry-config.json` | ⚠️ arquivo novo a criar |
| Contagem de WOs | `orchestrator-state.json` | ✅ existe |
| Taxa de aprovação | registros de auditoria | ❌ não rastreado — V1 placeholder |
| Inits / rodadas | `custos.log` + session data | ⚠️ depende do log |
| Breakdown input/output/cache | `custos.log` | ⚠️ depende do log |
| Peso (●●●●●) | algoritmo a definir | ❌ V1 placeholder |

**Decisão arquitetural V1:** o parser deve ser resiliente à ausência do log — retorna estado vazio/zero sem erro. Taxa de aprovação e peso ficam como `null` no contrato e exibem `—` na UI. São DTs não bloqueantes.

---

## 3. Fonte de Dados: custos.log

**Caminho:** `beehive/construcao/logs/custos.log`

**Formato DIR-071:**
```
==================================================
📊 TELEMETRIA DE TOKENS — [AGENTE]
Data/Hora: YYYY-MM-DD HH:mm:ss
Modelo Ativo: [modelo]
--------------------------------------------------
Tokens de Entrada (Prompt): XXX.XXX
Tokens de Saída (Completion): XX.XXX
Custo Estimado da Rodada: R$ X.XXXX BRL
==================================================
```

**Regras de parse:**
- Separar blocos por `==================================================`
- Extrair `AGENTE` da linha `TELEMETRIA DE TOKENS —`
- Data/Hora em ISO local (`YYYY-MM-DD HH:mm:ss`)
- Remover pontos de milhar antes de converter para número
- Semana corrente = últimos 7 dias a partir de agora

---

## 4. Configuração de Budget

**Novo arquivo:** `.hive-agent/telemetry-config.json`

```json
{
  "weeklyBudgetBRL": 70.00,
  "weeklyTokenLimit": 4200000,
  "agents": {
    "claude":  { "weeklyBudgetBRL": 35.00 },
    "copilot": { "weeklyBudgetBRL": 25.00 },
    "gemini":  { "weeklyBudgetBRL": 10.00 }
  }
}
```

Se o arquivo não existir, usar defaults acima. Nunca lançar erro por ausência.

---

## 5. Contrato de API

### 5.1 `GET /api/hive/telemetry`

```typescript
interface AgentEfficiency {
  agent: 'claude' | 'copilot' | 'gemini';
  role: string;
  sessionCostBRL: number;
  weeklyBudgetBRL: number;
  weeklyBudgetPct: number;        // 0-100
  weeklyWOs: number;
  approvalRate: number | null;    // V1: sempre null
  initCount: number;
  avgRoundsPerInit: number | null;
  lastInitMinutesAgo: number | null;
  peso: number | null;            // V1: sempre null
}

interface WeeklyUsage {
  tokensUsed: number;
  tokenLimit: number;
  usagePct: number;
  totalCostBRL: number;
  budgetBRL: number;
  inputTokens: number;
  outputTokens: number;
  cacheTokens: number;
  inputCostBRL: number;
  outputCostBRL: number;
  cacheCostBRL: number;
  resetInDays: number;
}

interface InitSession {
  index: number;
  startedAt: string;
  rounds: number;
  costBRL: number;
  isActive: boolean;
}

interface AgentInitHistory {
  agent: string;
  role: string;
  weeklyInits: InitSession[];
  avgRounds: number;
  avgCostBRL: number;
  totalInits: number;
  totalRounds: number;
  totalCostBRL: number;
}

interface TelemetryState {
  weeklyUsage: WeeklyUsage;
  agentEfficiency: AgentEfficiency[];
  initHistory: AgentInitHistory[];
  logExists: boolean;
  configExists: boolean;
}
```

### 5.2 Regras de negócio
- `weeklyWOs`: contar entradas de `orchestrator-state.json → processedEntries` da semana corrente por agente
- `initCount` / `avgRoundsPerInit`: derivar de blocos no `custos.log` agrupados por agente e data (cada bloco = 1 rodada; sequências no mesmo dia = 1 init)
- `resetInDays`: dias até próxima segunda-feira

---

## 6. Arquivos a Criar / Alterar

```
apps/hive-ui/
  backend/src/hive/
    hive.service.ts           ← adicionar readTelemetry(), parseCostLog(), readTelemetryConfig()
    hive.controller.ts        ← adicionar GET /api/hive/telemetry
  frontend/src/
    pages/
      Telemetria.tsx          ← nova tela /telemetria
    App.tsx                   ← adicionar rota /telemetria
    hive.css                  ← adicionar estilos .eff-* e .telemetry-*
    pages/MapaFabrica.tsx     ← adicionar Seção 03 consumindo /api/hive/telemetry
```

---

## 7. Comportamento de Empty State

Quando `logExists = false`:
- Cards de eficiência exibem `R$ 0,00`, barra em 0%, `—` para métricas indisponíveis
- Tela de telemetria exibe banner: `"Logs de telemetria ainda não gerados. Inicie uma sessão para ver dados."`
- Nunca lançar erro — UI deve ser funcional mesmo sem dados

---

## 8. Débitos Técnicos (DTs) — não bloqueantes

| ID | Descrição |
|---|---|
| DT-008 | Taxa de aprovação real — quando auditoria gerar registros rastreáveis |
| DT-009 | Algoritmo de peso (●●●●●) — proporcional ao custo relativo na semana |
| DT-010 | Endpoint `PATCH /api/hive/telemetry/config` para ajustar budget via UI |

---

## 9. Análise Financeira

| Campo | Valor |
|---|---|
| Custo estimado | R$ 3,50–5,00 (1 sessão Copilot média) |
| Confiança | Alta — escopo bem delimitado, sem dependências externas |
| Valor gerado | Visibilidade de custo em tempo real; base para controle de budget |
| Payback | Imediato — evita surpresas de custo nas sessões seguintes |
| Custo de não fazer | Cegueira de custo; sem dado para otimizar alocação dos agentes |

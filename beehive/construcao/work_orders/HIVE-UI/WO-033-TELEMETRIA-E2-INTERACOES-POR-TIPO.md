---
id: WO-033
titulo: HIVE-016 — Telemetria E2: Interações por Tipo
backlog_ref: HIVE-016
debate_ref: beehive/construcao/debates/DEBATE-030-TELEMETRIA-E2-INTERACOES-POR-TIPO.md
status: despachada
executor: Copilot
auditor: Claude
data: 2026-05-29
thread: telemetria-interacoes
---

# WO-033 — HIVE-016: Telemetria E2 — Interações por Tipo

## Contexto

O DEBATE-030 foi consolidado com veredito GO. Todos os 3 pareceres convergiram. O Hive UI já exibe custo por agente (`/tokens`); esta WO adiciona a dimensão de **propósito** — para quê cada agente foi acionado.

## Escopo

### 1. `beehive/bin/hive-lock.sh`

**Modificar o comando `set`** para aceitar 4º argumento opcional `[tipo]`:

```bash
hive lock set <owner> "<activity>" [tipo]
```

**Tipos válidos (V1):**
`feat` | `fix` | `debate` | `review` | `audit` | `infra` | `chore` | `hotfix` | `discovery`

**Comportamento quando tipo ausente:** gravar `"unknown"` no log + emitir warning em amarelo/vermelho no terminal (severo, não silencioso).

**Modificações no payload do `locks.json`:** adicionar `interaction_id` (formato `ILG-YYYY-MM-DD-NNN` — incremento via contagem do log).

**Novos helpers:**
- `ensure_interaction_store()` — cria `.hive-agent/interaction-log.json` com `{"entries":[]}` se não existir
- `append_interaction_entry()` — append atômico via `jq` no acquire
- `close_interaction_entry()` — fechar a entrada usando `interaction_id` do lock no release

**Formato de entrada no `interaction-log.json`:**
```json
{
  "id": "ILG-2026-05-29-001",
  "owner": "claude",
  "activity": "WO-033",
  "type": "feat",
  "acquired_at": "2026-05-29T10:00:00Z",
  "released_at": null
}
```
`released_at` é `null` na criação; atualizado para timestamp UTC no `release`.

**Invariante:** `interaction-log.json` é append-only. Nunca sobrescrever entradas antigas. Nunca usar como estado de lock.

### 2. `apps/hive-ui/backend/src/hive/hive.service.ts`

Adicionar leitura de `.hive-agent/interaction-log.json` em `getHiveState()`:

```typescript
interactionLog: {
  entries: InteractionEntry[];
  byAgent: Record<string, Record<string, number>>; // { claude: { feat: 3, fix: 1 }, ... }
  totalByType: Record<string, number>;
  mostFrequentType: string | null;
}
```

Retornar `{ entries: [], byAgent: {}, totalByType: {}, mostFrequentType: null }` se o arquivo não existir (empty state).

Adicionar tipo `InteractionEntry` e interface `InteractionLog` no arquivo de tipos da camada Hive.

### 3. `apps/hive-ui/frontend/src/hooks/useHiveSocket.ts`

Adicionar `interactionLog` ao tipo `HiveState` (espelhar o DTO do backend).

### 4. `apps/hive-ui/frontend/src/pages/InteracoesPorTipo.tsx`

Nova página com:
- 3 cards (Claude, Copilot, Gemini) — cada um com breakdown de interações por tipo em barras visuais
- Rodapé consolidado: total de interações do squad + tipo mais frequente
- Empty state: `"Nenhuma interação registrada ainda. Passe o tipo no lock acquire para começar."` quando `entries.length === 0`
- Seguir o padrão visual das demais telas (`TokensPorAgente.tsx` como referência de estrutura)

### 5. `apps/hive-ui/frontend/src/App.tsx`

- Nova rota `/interacoes` → `<InteracoesPorTipo />`
- Nova tab "Interações" na nav (entre "Tokens" e "Telemetria" ou ao final das tabs existentes)

### 6. `apps/hive-ui/frontend/src/hive.css`

Classes necessárias para a nova tela (prefixo `.ipt-*` — Interações Por Tipo):
- `.ipt-card` — card por agente
- `.ipt-bar-container` — container de barras por tipo
- `.ipt-bar` — barra individual
- `.ipt-footer` — rodapé consolidado
- `.ipt-empty` — empty state

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `hive lock set claude "WO-033" feat` grava entrada no `interaction-log.json` com `id`, `owner`, `activity`, `type`, `acquired_at` e `released_at: null` |
| AC-02 | `hive lock set claude "WO-033"` (sem tipo) grava `type: "unknown"` + warning visível no terminal |
| AC-03 | `hive lock release claude` fecha a entrada correspondente via `interaction_id`, preenchendo `released_at` |
| AC-04 | `interaction-log.json` nunca perde entradas anteriores (append-only) |
| AC-05 | `GET /api/hive/state` retorna campo `interactionLog` com `entries`, `byAgent`, `totalByType`, `mostFrequentType` |
| AC-06 | Rota `/interacoes` renderiza com 3 cards e dados reais quando o log tem entradas |
| AC-07 | Empty state exibido quando `entries.length === 0` |
| AC-08 | Build e typecheck limpos (`npm run build` + `npm run check:types` no `apps/hive-ui`) |

## Nota sobre `squad:lock:acquire`

O comando `npm run squad:lock:acquire -- claude "WO-033" feat` chama `hive-lock.sh set`. Confirmar no `package.json` que o 4º argumento é passado corretamente ao script antes de finalizar.

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 2,00–3,50 (script bash + nova tela padrão) |
| Confiança | Alta — lock.sh é linear, padrão de tela já estabelecido |
| Valor gerado | Visibilidade de desvios de roteamento de agentes |
| Payback | 1 semana de uso com dados suficientes para primeira análise |
| Custo de não fazer | Desvios de processo invisíveis; sem base para análise de eficiência por tipo |

## Não fazer

- Não tornar o tipo obrigatório nesta WO (V1 = opcional; V2 = obrigatório em rodada futura)
- Não expandir a tela `/tokens` — nova rota independente
- Não modificar `locks.json` como histórico — apenas adicionar `interaction_id` ao estado atual

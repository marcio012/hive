---
id: WO-027
titulo: Eficiência do Squad — Mapa + Tela Telemetria
backlog_ref: HIVE-014
blueprint_ref: beehive/construcao/blueprints/BLUEPRINT_HIVE_014_EFICIENCIA_SQUAD.md
thread: eficiencia-squad-hive-ui
executor: Copilot
status: commitada
data: 2026-05-29
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui
---

# WO-027 — Eficiência do Squad: Mapa + Tela Telemetria

## Contexto

Gemini (Projetista) entregou o esboço visual em `beehive/docs/materializacao/ESBOCO_EFICIENCIA_SQUAD_UI.md`. Claude (Arquiteto) validou e produziu o blueprint técnico em `beehive/construcao/blueprints/BLUEPRINT_HIVE_014_EFICIENCIA_SQUAD.md`. Esta WO materializa o contrato de implementação.

---

## Escopo

### Backend

**1. `hive.service.ts` — adicionar três métodos:**

```typescript
private readTelemetryConfig(): TelemetryConfig
// Lê .hive-agent/telemetry-config.json; se ausente, usa defaults do blueprint.
// Nunca lança erro.

private parseCostLog(): ParsedCostLog
// Lê beehive/construcao/logs/custos.log; se ausente retorna estrutura vazia (logExists: false).
// Parse de bloco por bloco conforme formato DIR-071.
// Agrupa por agente e semana corrente (últimos 7 dias).

async readTelemetry(): Promise<TelemetryState>
// Agrega parseCostLog() + readTelemetryConfig() + orchestrator-state.json
// Retorna TelemetryState conforme contrato do blueprint.
```

**2. `hive.controller.ts` — adicionar:**
```typescript
@Get('telemetry')
getTelemetry(): Promise<TelemetryState>
```

### Frontend

**3. `MapaFabrica.tsx` — adicionar Seção 03:**
- Consumir `GET /api/hive/telemetry` (pode ser separado do `GET /api/hive/state` ou embutido no mesmo `useHiveSocket`)
- Renderizar 3 cards `.eff-card` (Claude, Copilot, Gemini) conforme esboço
- Empty state: barra 0%, valores `R$ 0,00`, métricas indisponíveis exibem `—`

**4. `Telemetria.tsx` — nova tela `/telemetria`:**
- Bloco Janela Semanal (progress bar tokens, custo total, breakdown input/output/cache)
- Grid de 3 painéis Inits & Interações com tabela por agente
- Banner de empty state quando `logExists = false`

**5. `App.tsx`:**
- Adicionar rota `/telemetria` com link no menu de navegação

**6. `hive.css`:**
- Adicionar classes `.eff-*` (seção eficiência) e `.telemetry-*` / `.usage-*` / `.init-*` (tela telemetria)
- Seguir exatamente os estilos do esboço — não inventar variáveis CSS novas

---

## Critérios de Aceite

| # | Critério |
|---|---|
| AC-01 | `GET /api/hive/telemetry` retorna `TelemetryState` válido mesmo sem `custos.log` (`logExists: false`) |
| AC-02 | Seção 03 aparece no `/mapa` com 3 cards e sem erro quando log ausente |
| AC-03 | Tela `/telemetria` carrega em `http://localhost:5174/telemetria` com HTTP 200 |
| AC-04 | Quando `custos.log` ausente, banner de empty state visível na tela telemetria |
| AC-05 | `npm run check:types` → OK (backend + frontend) |
| AC-06 | `npm run build` → OK (backend + frontend) |
| AC-07 | `bash beehive/tests/test-gemini-role-guard.sh` → PASS |

---

## Arquivos a Alterar

```
apps/hive-ui/backend/src/hive/hive.service.ts
apps/hive-ui/backend/src/hive/hive.controller.ts
apps/hive-ui/frontend/src/pages/MapaFabrica.tsx
apps/hive-ui/frontend/src/pages/Telemetria.tsx        ← novo
apps/hive-ui/frontend/src/App.tsx
apps/hive-ui/frontend/src/hive.css
```

---

## Débitos Técnicos (registrar no backlog, não bloquear)

- DT-008: taxa de aprovação real
- DT-009: algoritmo de peso
- DT-010: endpoint de configuração de budget via UI

---

## Ponto de Parada

**Não commitar.** Implementar tudo, rodar as validações (AC-05, AC-06, AC-07) e reportar checkpoint no `inbox-claude.md` para auditoria.

---

## Mensagem de Commit (após liberação do Claude)

```
feat(hive-ui): HIVE-014 — Eficiência do Squad + Tela Telemetria

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Aprovado: Márcio
```

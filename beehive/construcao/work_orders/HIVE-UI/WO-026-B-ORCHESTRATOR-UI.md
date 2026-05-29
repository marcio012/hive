---
id: WO-026-B
titulo: Orchestrator Core — Integração com Hive UI
debate_ref: DEBATE-026
thread: orquestrador-hibrido-chief-agent
executor: Copilot
status: pendente
dependencia: WO-026-A (executar somente após Core aprovado)
data: 2026-05-29
---

# WO-026-B — Orchestrator: Integração com Hive UI

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive/apps/hive-ui
```

## Contexto

Executar somente após WO-026-A auditada e aprovada.
O Orchestrator Core já escreve `orchestrator-state.json` em `.hive-agent/`.
O watcher do Hive UI já observa `.hive-agent/` — esta WO conecta os pontos.

**Leia antes de executar:**
- `apps/hive-ui/backend/src/hive/hive.service.ts` — `getState()` e `HiveState`
- `apps/hive-ui/frontend/src/hooks/useHiveSocket.ts` — tipo `HiveState` no frontend
- `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx` — onde o estado será exibido
- `apps/orchestrator/src/state.ts` — formato de `orchestrator-state.json`

## O que implementar

### 1. Backend — `hive.service.ts`

**1a. Adicionar ao `HiveState`:**
```typescript
orchestrator: {
  status: 'idle' | 'watching' | 'dispatching' | 'paused' | 'error';
  currentItem: string | null;
  pauseReason: string | null;
} | null;
```

**1b. Adicionar `readOrchestratorState()` no `HiveService`:**
```typescript
private async readOrchestratorState() {
  const statePath = path.join(this.hiveRoot, '.hive-agent', 'orchestrator-state.json');
  const raw = await this.readJsonFile<OrchestratorState>(statePath);
  if (!raw) return null;
  return {
    status: raw.status ?? 'idle',
    currentItem: raw.currentItem ?? null,
    pauseReason: raw.pauseReason ?? null,
  };
}
```

**1c. Incluir no `getState()`:**
Adicionar `readOrchestratorState()` no `Promise.all` e incluir `orchestrator` no retorno.

**1d. Endpoint para eventos do Core:**
```typescript
// hive.controller.ts
@Post('orchestrator/event')
receiveOrchestratorEvent(@Body() payload: { level: string; msg: string }): void {
  this.hiveService.addEvent(payload.level as any, payload.msg);
}
```

### 2. Frontend — `useHiveSocket.ts`

Adicionar ao tipo `HiveState`:
```typescript
orchestrator: {
  status: 'idle' | 'watching' | 'dispatching' | 'paused' | 'error';
  currentItem: string | null;
  pauseReason: string | null;
} | null;
```

### 3. Frontend — `CentroDeControle.tsx`

**3a. Badge de estado ao lado do switch "Modo autônomo":**

Na `ctrl-row` do Modo autônomo, adicionar após o switch:
```tsx
{state?.orchestrator && (
  <span className={`orch-status orch-${state.orchestrator.status}`}>
    ● {state.orchestrator.status}
  </span>
)}
```

**3b. Linha "Em processamento" (aparece só quando `dispatching`):**
```tsx
{state?.orchestrator?.status === 'dispatching' && state.orchestrator.currentItem && (
  <div className="orch-current">
    Processando: <span>{state.orchestrator.currentItem}</span>
  </div>
)}
```

**3c. Banner de pausa (aparece só quando `paused`):**
```tsx
{state?.orchestrator?.status === 'paused' && (
  <div className="panel-feedback error">
    Piloto automático pausado — {state.orchestrator.pauseReason ?? 'motivo não registrado'}
  </div>
)}
```

### 4. CSS — `hive.css`

Adicionar estilos para os novos elementos:
```css
.orch-status { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; margin-left: 10px; }
.orch-idle    { color: var(--t3); }
.orch-watching  { color: var(--green); }
.orch-dispatching { color: var(--gold); }
.orch-paused  { color: var(--orange); }
.orch-error   { color: #ff6b6b; }
.orch-current { font-family: var(--mono); font-size: 12px; color: var(--t2); padding: 6px 0; }
.orch-current span { color: var(--gold); }
```

## Critérios de Aceite

- [ ] `GET /api/hive/state` inclui campo `orchestrator` com `status`, `currentItem`, `pauseReason`
- [ ] Badge de estado aparece ao lado do switch "Modo autônomo" com cor correta por status
- [ ] Quando Core está em `dispatching`: linha "Processando: <item>" aparece no painel
- [ ] Quando Core está em `paused`: banner laranja com motivo aparece no painel
- [ ] `POST /api/hive/orchestrator/event` insere evento no stream da UI
- [ ] `npm run check:types` (frontend + backend) → OK
- [ ] `npm run build` (frontend + backend) → OK

## Restrições

- NÃO reimplementar lógica do Core dentro do NestJS
- NÃO criar novos endpoints além do `/api/hive/orchestrator/event`
- Executar SOMENTE após WO-026-A aprovada

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Confirmação dos critérios
- Screenshot ou descrição visual do badge de estado
- Hash do commit (sem commitar — aguardar auditoria)

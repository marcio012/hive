---
id: WO-026-B
titulo: Integração UI Orchestrator — Estado e Eventos
debate_ref: DEBATE-026
thread: orquestrador-hibrido-chief-agent
executor: Copilot
status: pendente
data: 2026-05-29
---

# WO-026-B — Integração UI Orchestrator

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

DEBATE-026 aprovado em 2026-05-29. 
O Orchestrator Core V1 (WO-026-A) gera estado em `.hive-agent/orchestrator-state.json` e tenta enviar eventos via HTTP.
Esta WO materializa o "outro lado da ponte": a recepção desses dados pelo Hive UI para visibilidade total do Márcio.

**Leia antes de executar:**
- `beehive/construcao/debates/DEBATE-026-ORQUESTRADOR-HIBRIDO-CHIEF-AGENT-PILOTO-AUTOMATICO.md` — seção 7
- `beehive/construcao/work_orders/HIVE/WO-026-A-ORCHESTRATOR-CORE.md` — contrato de estado
- `apps/hive-ui/backend/src/hive/hive.service.ts` — para integração do estado

## O que implementar

### 1. Backend: Recepção de Eventos

Implementar no `HiveController` e `HiveService` o endpoint:
- `POST /api/hive/orchestrator/event`
- Payload: `{ level: 'info' | 'warn' | 'error', msg: string }`
- Ação: Injetar no `EventBuffer` (o mesmo usado pelo watcher de arquivos) para que apareça no stream da UI.

### 2. Backend: Integração de Estado (Checkpoints)

Atualizar o `HiveService` para incluir o estado do Orchestrator no `HiveState` global:
1. Adicionar watcher para `.hive-agent/orchestrator-state.json`.
2. Quando o arquivo mudar, ler e atualizar a propriedade `orchestrator` no `HiveState`.
3. Garantir que o WebSocket emita o update para o frontend.

Interface esperada no `HiveState`:
```typescript
orchestrator: {
  status: 'idle' | 'watching' | 'dispatching' | 'paused' | 'error';
  currentItem: string | null;
  pauseReason: string | null;
  updatedAt: string;
}
```

### 3. Frontend: Visibilidade no Centro de Controle

Atualizar `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx`:
1. **Status Badge:** Mostrar o status atual do orquestrador (ao lado do switch "Modo autônomo").
2. **Current Item:** Se status for `dispatching`, mostrar qual ID está sendo processado.
3. **Pause Alert:** Se status for `paused`, mostrar o `pauseReason` com destaque (ex: banner amarelo ou tooltip).
4. **Visual Feedback:** O switch "Modo autônomo" deve refletir o estado real de `autoMode` (já implementado, mas validar se a sincronia vinda do Core funciona).

### 4. Frontend: Refatoração (DT-004)

Aproveitar a mexida para iniciar a extração de sub-componentes pedida no débito técnico:
- Mover o modal de despacho para `components/DispatchModal.tsx`.
- Mover o painel de locks para `components/LockPanel.tsx`.

## Critérios de Aceite

- [ ] `POST /api/hive/orchestrator/event` funciona e evento aparece no stream da UI → OK
- [ ] Mudar `.hive-agent/orchestrator-state.json` manualmente reflete no frontend sem refresh → OK
- [ ] Status `paused` exibe o motivo na UI de forma clara → OK
- [ ] `CentroDeControle.tsx` teve seu tamanho reduzido pela extração de ao menos um componente → OK
- [ ] `npm run build` em backend e frontend → OK

## Restrições

- NÃO criar dependência circular entre orchestrator e hive-ui (comunicação é via arquivo e HTTP unidirecional).
- NÃO alterar a lógica de roteamento do orquestrador nesta WO.

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Print ou descrição da UI mostrando o status do orquestrador.
- Hash do commit (sem commitar).

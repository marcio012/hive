---
id: WO-026-A
titulo: Orchestrator Core V1 — processo Node.js daemon
debate_ref: DEBATE-026
thread: orquestrador-hibrido-chief-agent
executor: Copilot
status: pendente
data: 2026-05-29
---

# WO-026-A — Orchestrator Core V1

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

DEBATE-026 aprovado em 2026-05-29. Arquitetura ORCH-V1 definida.
O toggle "Modo autônomo" já persiste em `.hive-agent/hive-ui-config.json` (HIVE-UI-003).
Esta WO implementa o processo que lê esse flag e age sobre os inboxes.

**Leia antes de executar:**
- `beehive/construcao/debates/DEBATE-026-ORQUESTRADOR-HIBRIDO-CHIEF-AGENT-PILOTO-AUTOMATICO.md` — seção 7 (arquitetura aprovada)
- `apps/hive-ui/backend/src/hive/hive.service.ts` — padrão de leitura de config e locks existente
- `.hive-agent/hive-ui-config.json` — formato da config

## O que implementar

### Estrutura de arquivos

```
apps/orchestrator/
  src/
    index.ts          — entrypoint do daemon
    watcher.ts        — chokidar watching inboxes + .hive-agent/
    router.ts         — tabela de roteamento YAML → lógica determinística
    dispatcher.ts     — escreve inbox, adquire lock via proxy.sh
    deadman.ts        — Deadman's Switch (falhas consecutivas + timeout)
    state.ts          — lê/escreve .hive-agent/orchestrator-state.json
    logger.ts         — POST /api/hive/orchestrator/event para EventBuffer da UI
  routing.yaml        — tabela de roteamento
  package.json
  tsconfig.json
```

### `routing.yaml` — tabela de roteamento V1

```yaml
rules:
  - match:
      tipo: handoff-executavel
      agent_livre: copilot
    action: dispatch_to_copilot
  - match:
      tipo: pedido-de-parecer
      destinatario: claude
    action: notify_claude
  - match:
      source: copilot
      pattern: "^COPILOT-"
    action: notify_claude
  - match:
      source: gemini
      pattern: "^GEMINI-"
    action: notify_claude
  - default: pause_and_escalate
```

### `state.ts` — formato de `.hive-agent/orchestrator-state.json`

```typescript
interface OrchestratorState {
  status: 'idle' | 'watching' | 'dispatching' | 'paused' | 'error';
  currentItem: string | null;     // ID da entrada em processamento
  pauseReason: string | null;     // motivo se status === 'paused'
  consecutiveFailures: number;
  processedEntries: string[];     // IDs já processados (idempotência)
  updatedAt: string;              // ISO
}
```

Defaults: `{ status: 'idle', currentItem: null, pauseReason: null, consecutiveFailures: 0, processedEntries: [], updatedAt: now }`

### `deadman.ts` — Deadman's Switch

Desativa `autoMode` e pausa o Core quando:
- 3 falhas consecutivas na mesma tarefa
- Timeout de 30 minutos sem progresso numa entrada em `dispatching`

Ao disparar:
1. Escreve `status: 'paused'` + `pauseReason` no `orchestrator-state.json`
2. Escreve `autoMode: false` no `hive-ui-config.json`
3. Envia evento `level: 'warn'` para UI: `"Piloto automático pausado: <motivo>"`

### `dispatcher.ts` — despacho seguro

Antes de despachar:
1. Verificar se agente alvo está com lock livre (ler `locks.json`)
2. Se lock ocupado: enfileirar (retry após 60s, max 3 tentativas)
3. Marcar entrada como processada em `processedEntries` ANTES de escrever no inbox (idempotência)
4. Usar `writeTextAtomic` (tmp → rename) para escrever no inbox

### `package.json` (raiz) — scripts novos

```json
"squad:orchestrator": "node apps/orchestrator/dist/index.js",
"squad:orchestrator:start": "pm2 start apps/orchestrator/dist/index.js --name hive-orchestrator",
"squad:orchestrator:stop": "pm2 stop hive-orchestrator",
"squad:orchestrator:status": "pm2 status hive-orchestrator",
"squad:orchestrator:pause": "node -e \"const s=require('fs');const p='.hive-agent/orchestrator-state.json';const st=JSON.parse(s.readFileSync(p,'utf8'));st.status='paused';st.pauseReason=process.argv[2]||'manual';s.writeFileSync(p,JSON.stringify(st,null,2));\" --"
```

### Integração com Hive UI (via HTTP)

O daemon faz `POST http://localhost:3001/api/hive/orchestrator/event` com:
```json
{ "level": "info|warn|error", "msg": "texto do evento" }
```

O backend NestJS precisa de um endpoint simples para receber isso e injetar no EventBuffer. **Este endpoint será implementado na WO-026-B.**

Por ora: logar no console se o POST falhar (não bloquear o Core).

## Critérios de Aceite

- [ ] `npm run squad:orchestrator` inicia o daemon sem erro
- [ ] Com `autoMode: false` → Core observa inboxes mas não despacha
- [ ] Com `autoMode: true` + nova entrada `handoff-executavel` → Core detecta e roteia para Copilot
- [ ] Entrada já processada (ID em `processedEntries`) → não redisparada
- [ ] Lock ocupado → Core enfileira e retenta após 60s
- [ ] 3 falhas consecutivas → `autoMode` desativado + `status: paused` + evento `warn` na UI
- [ ] `npm run squad:orchestrator:pause "motivo"` → pausa imediata com motivo registrado
- [ ] `npx tsc --noEmit` → OK
- [ ] `npm run build` → OK

## Restrições

- NÃO implementar lógica de auditoria automática de diff — Claude audita manualmente
- NÃO modificar arquivos de governança (`CLAUDE.md`, `COPILOT.md`, `GEMINI.md`) autonomamente
- NÃO fazer rollback de nenhuma ação
- Maestro com IA: fora do escopo desta WO (V2 futuro)

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Confirmação dos critérios
- Log de exemplo de uma rodada de despacho
- Hash do commit (sem commitar — aguardar auditoria)

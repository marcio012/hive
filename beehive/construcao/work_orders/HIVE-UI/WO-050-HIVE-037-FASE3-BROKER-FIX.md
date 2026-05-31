---
id: WO-050
titulo: "Fix Fase 3 Balcão Central: restaurar fluxo Broker + remover chokidar"
backlog_ref: HIVE-037
thread: arquitetura-balcao-central
executor: Copilot-Hive
status: pendente
data: 2026-05-31
auditoria_ref: CLAUDE-2026-05-31-038
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive
---

# WO-050 — Fix Fase 3 Balcão Central: restaurar fluxo Broker + remover chokidar

## Contexto

Code review `CLAUDE-2026-05-31-038` identificou que a migração Fase 3 foi entregue com
`processOnce` como placeholder. O orchestrator completa tarefas sem despachá-las para
nenhum agente (regressão funcional). O `chokidar` também não foi removido do
`package.json`. Esta WO fecha os 4 achados da auditoria.

---

## Escopo — 4 alterações, todas em `beehive/apps/orchestrator/`

### 1. `src/watcher.ts` — restaurar fluxo Inbox → Router → Dispatcher em `processOnce`

**Remover método morto `scheduleProcess()` inteiro** (linhas 74–82 atuais):

```typescript
// REMOVER completamente:
private scheduleProcess(): void {
  if (this.debounceTimer) {
    clearTimeout(this.debounceTimer);
  }
  this.debounceTimer = setTimeout(() => {
    void this.processAll('watcher');
  }, 400);
}
```

**Adicionar imports** no topo do arquivo (após os imports existentes):

```typescript
import { isClosedStatus, listInboxPaths, parseInboxFile } from './inbox';
```

**Substituir o corpo inteiro de `processOnce`** pelo seguinte:

```typescript
private async processOnce(reason: string): Promise<void> {
  const state = await this.stateStore.readState();
  if (state?.status === 'paused') {
    return;
  }

  const config = await this.stateStore.readConfig();
  if (!config.autoMode) {
    await this.deadman.resumeWatching();
    if (reason === 'startup') {
      await this.logger.log('info', 'autoMode desligado: observando sem despachar');
    }
    return;
  }

  await this.deadman.resumeWatching();

  const currentState = await this.stateStore.readState();
  const processedIds = new Set(currentState?.processedEntries ?? []);

  const inboxPaths = await listInboxPaths(this.rootDir);
  for (const inboxPath of inboxPaths) {
    const entries = await parseInboxFile(inboxPath);
    for (const entry of entries) {
      if (processedIds.has(entry.id) || isClosedStatus(entry.status)) {
        continue;
      }

      const decision = this.router.resolve(entry);
      if (!decision) {
        continue;
      }

      await this.deadman.startDispatch(entry.id);
      const result = await this.dispatcher.dispatch(decision, entry);

      if (result.outcome === 'dispatched') {
        await this.deadman.recordSuccess();
      } else if (result.outcome === 'failed') {
        await this.deadman.recordFailure(entry.id, result.reason ?? 'dispatch falhou');
        return;
      }
    }
  }
}
```

**Observações:**
- `router.resolve()` (não `.route()`) — verificar assinatura em `router.ts:26`
- `outcome: 'retry'` e `'ignored'` → continuar para próxima entrada (polling de 60s cuida do retry)
- O campo `retries` e `RETRY_DELAY_MS` no construtor podem ser mantidos por ora (não são prejudiciais)

---

### 2. `src/dispatcher.ts` — remover método morto `readTextFile`

**Remover as linhas 127–133 inteiras:**

```typescript
// REMOVER completamente:
private async readTextFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}
```

Após a remoção, verificar se `fs` (import de `'fs'`) ainda é usado. Continua sendo usado
em `readLock()` via `fs.readFile`, portanto o import permanece.

---

### 3. `package.json` — remover `chokidar` das dependências diretas

**Arquivo:** `beehive/apps/orchestrator/package.json`

Remover a linha:
```json
"chokidar": "^3.6.0",
```

Em seguida, dentro de `beehive/apps/orchestrator/`, executar:
```bash
npm install
```

Isso atualiza `package-lock.json` removendo `chokidar` como dependência direta.
O `chokidar` permanece como dependência transitiva do `pm2` — isso é esperado e correto.

---

## Critérios de aceite

- [ ] `processOnce` lê inbox files via `listInboxPaths` + `parseInboxFile`
- [ ] Entradas já em `processedEntries` ou com status fechado são ignoradas
- [ ] `router.resolve(entry)` é chamado para cada entrada elegível
- [ ] `dispatcher.dispatch(decision, entry)` é chamado com a decisão do router
- [ ] `deadman.startDispatch` e `recordSuccess`/`recordFailure` são invocados corretamente
- [ ] `scheduleProcess()` não existe mais em `watcher.ts`
- [ ] `readTextFile()` não existe mais em `dispatcher.ts`
- [ ] `chokidar` ausente de `dependencies` em `package.json`
- [ ] `npm run check:types` passa sem erros no orchestrator
- [ ] `npm run build` passa sem erros no orchestrator

---

## O que NÃO mudar

- Não alterar `router.ts`, `dispatcher.ts` (além da remoção de `readTextFile`), `inbox.ts`,
  `state.ts`, `deadman.ts`, `types.ts` ou `index.ts`
- Não remover o Map `retries` nem `RETRY_DELAY_MS` do watcher (não prejudicam, remoção fica
  para higiene futura)
- Não mexer em nenhum arquivo fora de `beehive/apps/orchestrator/`

---

## Assinatura esperada no commit

```
Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
```

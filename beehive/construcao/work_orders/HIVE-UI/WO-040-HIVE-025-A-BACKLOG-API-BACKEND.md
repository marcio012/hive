---
id: WO-040
titulo: HIVE-025-A — Backlog API Backend: readBacklogItems + inferPhase
backlog_ref: HIVE-025
debate_ref: beehive/construcao/debates/DEBATE-035-BACKLOG-API-ESTEIRA-MAPA-FABRICA.md
thread: backlog-api-esteira
executor: Copilot
status: executada
data: 2026-05-30
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui/backend
---

# WO-040 — Backlog API Backend

## Contexto

DEBATE-035 consolidado com veredito GO. O `inferPhase()` do backend já processa debates, WOs e SRs. Esta WO adiciona o `BACKLOG.md` como quarta fonte — itens `[ ]` sem match em pipeline/debates aparecem na esteira na estação `marcio`, lane `captura`.

## Escopo

### 1. Interface `BacklogItem`

Adicionar em `hive.service.ts`:

```typescript
export interface BacklogItem {
  id: string;          // ex: "HIVE-017"
  titulo: string;
  prioridade: 'alta' | 'media' | 'dt';
  status: 'pendente' | 'concluido';
}
```

### 2. `readBacklogItems()`

Novo método privado em `HiveService`. Parser regex linha a linha do `BACKLOG.md`:

```
Arquivo: path.join(this.hiveRoot, 'beehive', 'construcao', 'BACKLOG.md')
```

**Três casos a cobrir:**
- `- [ ] HIVE-NNN — titulo ...` → `{ status: 'pendente', prioridade: detectada_pela_secao }`
- `- [x] HIVE-NNN — titulo ...` → `{ status: 'concluido' }` — ignorar, não entra na esteira
- `- **DT-NNN** — titulo` → ignorar, não é item de esteira

**Prioridade pela seção:**
- Linha está após `## 🔴 Alta prioridade` → `'alta'`
- Linha está após `## 🟡 Média prioridade` → `'media'`
- Linha está após `## 🔧 Débito Técnico` → `'dt'` (filtrar, não expor)

**Retorno:** apenas itens `pendente` com prioridade `alta` ou `media`.

### 3. Injeção em `inferPhase()`

Adicionar `backlogItems: BacklogItem[]` como novo parâmetro.

**Deduplicação:** antes de inserir, verificar se o `id` (ex: `HIVE-017`) já aparece em:
- `pipeline[].id` (normalizado, ex: `HIVE-017`)
- `debates[].id` (ex: `DEBATE-NNN`) — comparar por `backlog_ref` se disponível

Se não houver match → inserir como `FlowItem`:

```typescript
{
  id: item.id,
  tipo: 'wo',          // reutiliza tipo existente
  titulo: item.titulo,
  lane: 'captura',
  station: 'marcio',
  proxima: 'gemini',
  ativo: false,
  file_path: 'beehive/construcao/BACKLOG.md',
}
```

### 4. Atualizar chamada de `inferPhase()` em `getState()`

Adicionar `readBacklogItems()` ao `Promise.all` paralelo e passar resultado para `inferPhase()`.

### 5. Chokidar watch

Verificar se `beehive/construcao/BACKLOG.md` já está coberto pelo watch atual. Se não estiver, adicionar ao array de paths monitorados em `hive.gateway.ts`.

## Critérios de Aceite

- **AC-01:** `readBacklogItems()` retorna itens `[ ]` com `id`, `titulo`, `prioridade` e `status: 'pendente'`
- **AC-02:** Itens `[x]` e `DT-*` são filtrados e não entram no retorno
- **AC-03:** Itens sem match em pipeline/debates aparecem em `flowItems` com `station: marcio`, `lane: captura`
- **AC-04:** Itens com match em pipeline ou debates não são duplicados
- **AC-05:** `BACKLOG.md` está coberto pelo chokidar — qualquer edição dispara WebSocket push
- **AC-06:** `npm run check:types` e `npm run build` passam sem erros novos

## Validação

```bash
cd apps/hive-ui/backend && npm run check:types
cd apps/hive-ui/backend && npm run build
curl http://localhost:3001/api/hive/state | jq '.flowItems[] | select(.station == "marcio")'
```

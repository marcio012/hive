---
id: WO-041
titulo: HIVE-025-B — Backlog Esteira Frontend: exibir itens de backlog na estação Márcio
backlog_ref: HIVE-025
debate_ref: beehive/construcao/debates/DEBATE-035-BACKLOG-API-ESTEIRA-MAPA-FABRICA.md
thread: backlog-api-esteira
executor: Gemini
status: executada
data: 2026-05-30
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui/frontend
---

# WO-041 — Backlog Esteira Frontend

## Contexto

Após a WO-040 (backend), o `flowItems` passará a incluir itens do `BACKLOG.md` com `station: marcio` e `lane: captura`. Esta WO adapta o frontend para exibir esses itens corretamente na esteira do Mapa da Fábrica.

**Dependência:** WO-040 deve estar commitada antes da execução desta WO.

## Escopo

### 1. Contagem na estação Márcio

Em `EsteiraPorProcesso.tsx`, a função `getStationCount('marcio')` atualmente retorna `flowItems.filter(i => i.station === 'marcio').length`. Isso já funcionará automaticamente após o backend enviar os itens — verificar e ajustar se necessário.

### 2. Card de item de backlog na seção "Em trânsito"

Os itens com `station: marcio` e `lane: captura` aparecerão na lista `transitItems` (já filtrada por `ativo === true` — verificar se itens de backlog devem ser sempre visíveis independente de `ativo`).

**Ajuste:** mostrar itens de backlog mesmo com `ativo: false`. Sugestão: ampliar o filtro para incluir itens de backlog:

```typescript
const transitItems = flowItems.filter(
  item => item.ativo || item.station === 'marcio'
);
```

### 3. Visual diferenciado para itens de backlog

Cards com `station: marcio` na lane `captura` devem ter visual distinto dos debates/WOs em trânsito:
- Badge `captura` com cor neutra (cinza/gold) em vez de `execução` (verde)
- Label de destino: `→ Gemini` (triagem)
- Sem avatar de agente — usar ícone de backlog ou inicial `M` de Márcio

### 4. Label da estação no card

O `fci-stage` do card deve refletir a lane:
- `captura` → label "no backlog"
- Classe CSS: `fci-stage--captura`

### 5. CSS

Adicionar em `hive.css`:
```css
.fci-stage--captura { background: var(--gold-tint); color: var(--gold); }
```

## Critérios de Aceite

- **AC-01:** Estação Márcio exibe contagem de itens `[ ]` do backlog sem WO/debate
- **AC-02:** Itens de backlog aparecem na seção "Em trânsito" mesmo com `ativo: false`
- **AC-03:** Badge da lane mostra "no backlog" com cor gold
- **AC-04:** Card exibe `→ Gemini` como próxima estação
- **AC-05:** Build limpo: `npm run check:types` e `npm run build` sem erros novos

## Validação

```bash
cd apps/hive-ui/frontend && npm run check:types
cd apps/hive-ui/frontend && npm run build
# Verificar visualmente: abrir Mapa da Fábrica e confirmar cards na estação Márcio
```

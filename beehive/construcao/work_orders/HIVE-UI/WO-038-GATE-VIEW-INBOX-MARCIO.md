---
id: WO-038
titulo: HIVE-023 — Gate View: Painel do Márcio no Hive UI
backlog_ref: HIVE-023
status: despachada
executor: Copilot
auditor: Claude
data: 2026-05-29
thread: hive-gate-view
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui
---

# WO-038 — HIVE-023: Gate View — Painel do Márcio

## Contexto

O Márcio é The Gate — todas as entregas, aprovações e decisões estratégicas passam por ele. Hoje essas atividades estão dispersas em debates, SRs e inboxes sem um ponto central visível.

Esta WO cria:
1. Leitura do `inbox-marcio.md` no backend
2. Nova aba ou seção "Gate" no Centro de Controle com os itens pendentes do Márcio

## Escopo

### 1. `apps/hive-ui/backend/src/hive/hive.service.ts`

Adicionar leitura de `beehive/construcao/inbox-marcio.md` em `getHiveState()`:

```typescript
gate: {
  pendentes: GateItem[];
  total: number;
}
```

**Parser do `inbox-marcio.md`** (mesmo padrão resiliente já usado para inboxes):
- Extrair entradas com `Status: pendente`
- Campos por entrada: `id`, `tipo`, `backlog_ref`, `titulo` (linha `###`), `data`, `sr_ref` (se existir)

```typescript
interface GateItem {
  id: string;           // ex: "GATE-2026-05-29-001"
  tipo: 'sr-afirmacao' | 'gate-commit' | 'aprovacao-debate' | 'decisao-estrategica';
  titulo: string;
  backlog_ref?: string;
  sr_ref?: string;
  data: string;
}
```

Retornar `{ pendentes: [], total: 0 }` se o arquivo não existir.

### 2. `apps/hive-ui/frontend/src/hooks/useHiveSocket.ts`

Adicionar `gate` ao tipo `HiveState`.

### 3. `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx`

Adicionar **badge de contagem** no toggle do Centro de Controle quando `gate.total > 0`:

```
[V1] [V2] [Governança] [Gate 🔴3]
```

Nova aba **"Gate"** com:
- Lista de cards por item pendente
- Badge de tipo colorido: `sr-afirmacao` (azul), `gate-commit` (verde), `aprovacao-debate` (amarelo), `decisao-estrategica` (vermelho)
- Campo `backlog_ref` como subtítulo
- Data da entrada
- Link para o SR quando `sr_ref` existir (abre o arquivo ou exibe referência)
- Empty state: `"Nenhuma atividade aguardando. Tudo em ordem."` com ícone de check

### 4. `apps/hive-ui/frontend/src/hive.css`

Classes prefixo `.gate-*`:
- `.gate-card` — card de item pendente
- `.gate-badge` — badge de tipo
- `.gate-badge--sr` `.gate-badge--commit` `.gate-badge--debate` `.gate-badge--decisao`
- `.gate-empty` — empty state
- `.gate-counter` — contador no tab (bolinha vermelha)

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `GET /api/hive/state` retorna campo `gate` com `pendentes` e `total` |
| AC-02 | Entradas com `Status: pendente` no `inbox-marcio.md` aparecem em `gate.pendentes` |
| AC-03 | `gate.total === 0` quando inbox-marcio não tem pendentes (ou arquivo não existe) |
| AC-04 | Aba "Gate" visível no Centro de Controle com badge de contagem quando `total > 0` |
| AC-05 | Cards exibem tipo, título, backlog_ref e data corretamente |
| AC-06 | Empty state exibido quando `gate.total === 0` |
| AC-07 | Build e typecheck limpos (`npm run build` + `npm run check:types`) |

## Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 2,00–3,50 (parser + nova aba padrão estabelecido) |
| Confiança | Alta — padrão de parsing e aba já existem |
| Valor gerado | Márcio vê em tempo real o que precisa da sua atenção — sem abrir arquivos |
| Payback | Imediato — usado em toda sessão |
| Custo de não fazer | Márcio continua sem visibilidade centralizada do gate; SRs acumulam sem afirmação |

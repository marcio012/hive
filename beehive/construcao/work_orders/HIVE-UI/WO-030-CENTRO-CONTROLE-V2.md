---
id: WO-030
titulo: Centro de Controle V2 — Vista de Visibilidade Completa
backlog_ref: HIVE-UI
thread: centro-controle-v2
executor: Copilot
status: pendente
data: 2026-05-29
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui
---

# WO-030 — Centro de Controle V2: Vista de Visibilidade Completa

## Contexto

O Centro de Controle atual implementa somente o v1 (Controles). O protótipo em `beehive/assets/hive-ui/ui-claude-desing/Hive OS.html` define uma segunda vista (v2 — Visibilidade) que expõe o estado interno do squad por agente: inbox pendente, WO ativa, itens bloqueados e debates em curso. Esta WO implementa a tela completa com dados reais, tornando o v2 a vista padrão.

**Referência visual:** `beehive/assets/hive-ui/ui-claude-desing/Hive OS.html` → seção `#screen-controle` → `#cc-v1` e `#cc-v2`.
**CSS de referência:** `beehive/assets/hive-ui/ui-claude-desing/hive.css` → classes `.cc2-*`, `.phase-bar`, `.debate-*`.

---

## Escopo

### 1. Backend — `hive.service.ts`

#### 1a. Novos tipos

```typescript
export type AgentDetail = {
  inboxPending: number;      // entradas sem "consumida" no Status
  activeWo: string | null;   // activity do lock atual, ou null
  blockedCount: number;      // entradas com "bloqueado" no inbox
};

export type DebateEntry = {
  id: string;          // ex: "DEBATE-027"
  title: string;
  status: string;      // ex: "WOs despachadas", "Consolidado"
  responsible: string;
  active: boolean;     // true se status NÃO for Consolidado/Encerrado
};
```

#### 1b. Novos métodos privados

```typescript
private readInboxPending(agent: 'claude' | 'copilot' | 'gemini'): { pending: number; blocked: number }
```
- Lê `beehive/construcao/inbox-{agent}.md`
- Conta linhas com `**Status:** pendente` (ou ausência de `consumida`)
- Conta entradas com `bloqueado` no corpo
- Retorna zeros se arquivo não existir — nunca lança

```typescript
private readActiveDebates(): DebateEntry[]
```
- Lê `beehive/construcao/debates-abertos.md`
- Parseia a tabela markdown (linhas com `| DEBATE-`)
- Extrai: id (coluna 1), title (coluna 2), status (coluna 3), responsible (coluna 4)
- `active: true` quando status não contém "Consolidado" nem "Encerrado"
- Retorna `[]` se arquivo não existir — nunca lança

#### 1c. Extender `getHiveState()`

Adicionar ao objeto retornado:
```typescript
agentDetails: {
  claude:  { inboxPending, activeWo: locks.claude?.activity ?? null, blockedCount },
  copilot: { inboxPending, activeWo: locks.copilot?.activity ?? null, blockedCount },
  gemini:  { inboxPending, activeWo: locks.gemini?.activity ?? null, blockedCount },
},
debates: this.readActiveDebates(),
```

#### 1d. File watchers adicionais

Adicionar ao `watchHiveFiles()` (ou equivalente) os seguintes caminhos:
- `beehive/construcao/inbox-claude.md`
- `beehive/construcao/inbox-copilot.md`
- `beehive/construcao/inbox-gemini.md`
- `beehive/construcao/debates-abertos.md`

Quando qualquer um mudar → broadcast via WebSocket (mesmo mecanismo já existente).

---

### 2. Tipos frontend — `useHiveSocket.ts`

Adicionar ao tipo `HiveState`:
```typescript
agentDetails?: {
  claude:  AgentDetail;
  copilot: AgentDetail;
  gemini:  AgentDetail;
};
debates?: DebateEntry[];
```

Importar/reexportar `AgentDetail` e `DebateEntry` do backend (ou redefinir localmente se não houver barrel).

---

### 3. Frontend — `CentroDeControle.tsx`

#### 3a. Toggle v1/v2

```typescript
const [view, setView] = useState<'v1' | 'v2'>('v2'); // v2 como default
```

No `page-head`, adicionar ao lado do título o mesmo switcher do protótipo:
```tsx
<div className="bs-view" id="ccView">
  <button className={`bs-view-btn ${view === 'v1' ? 'active' : ''}`}
    onClick={() => setView('v1')} title="Controles (v1)"> … ícone sliders … </button>
  <button className={`bs-view-btn ${view === 'v2' ? 'active' : ''}`}
    onClick={() => setView('v2')} title="Visibilidade (v2)"> … ícone olho … </button>
</div>
```

#### 3b. v1 — sem alterações funcionais

Envolver o conteúdo atual dentro de `{view === 'v1' && ( … )}`. Nenhuma mudança de comportamento.

#### 3c. v2 — implementação completa

Renderizar quando `view === 'v2'`:

**Zona 1 — Estado por agente** (`section-label` "01 Estado por agente")

3 cards `.cc2-agent` (claude / copilot / gemini), dados de `state.agentDetails`:
- `.cc2-head`: avatar, nome, papel (Arquiteto / Engenheiro / Coordenador), badge de lock
  - lock livre: `.cc2-lock.free` + dot verde + "Livre"
  - lock ativo: `.cc2-lock.running` + ícone cadeado + `activeWo`
  - badge `.cc2-count` com `inboxPending` quando > 0
- `.cc2-body`:
  - Se `inboxPending === 0 && blockedCount === 0`: exibir `.cc2-clean` "Nenhuma pendência"
  - Se `inboxPending > 0`: listar até 3 itens `.cc2-item` com label "inbox" e count
  - Se `blockedCount > 0`: item `.cc2-item.blocked` com label "bloqueado"
- `.cc2-foot`: botão "Despachar →" que chama `openDispatchDialog(agent)`

**Zona 2 — Ações Rápidas** (`.cc2-actions`)

Botões:
- "Liberar lock Claude" — visível apenas se `locks.claude` ativo → chama `releaseLock('claude')`
- "Liberar lock Copilot" — visível apenas se `locks.copilot` ativo → chama `releaseLock('copilot')`
- "Liberar lock Gemini" — visível apenas se `locks.gemini` ativo → chama `releaseLock('gemini')`
- "Despachar para Claude" → `openDispatchDialog('claude')`
- "Despachar para Gemini" → `openDispatchDialog('gemini')`
- "Configurações" → toggle do painel abaixo

Se nenhum lock ativo E 0 pendências: exibir mensagem `.cc2-clean` "Squad em repouso — nenhuma ação necessária".

**Zona 3 — Configurações (expansível)**

Painel `.cc2-settings` controlado por `useState<boolean>(false)`:
- Abre/fecha ao clicar "Configurações"
- Contém os mesmos 3 `ctrl-row` do v1 (Modo autônomo, Auto-merge, Notificar Márcio)
- Reutilizar a mesma lógica `toggleConfig` já existente

**Zona 4 — Grid inferior** (`.cc2-grid`, 2 colunas)

**Coluna esquerda — Debates ativos** (`panel`):
- Listar `state.debates` filtrados por `active === true`
- Cada item `.debate`:
  - `.debate-top`: id + badge de status
  - `.debate-title`: title
  - `.phase-bar`: barra de progresso — `--p` calculado pelo índice do status no ciclo padrão (Abertura=1, Parecer Gemini=2, Parecer Claude=3, Parecer Copilot=4, Consolidação=5, Aprovação Márcio=6, WOs despachadas=7, Execução concluída=8)
  - `.debate-meta`: texto do status
- Se `debates` vazio ou todos inativos: exibir "Nenhum debate ativo."

**Coluna direita — Eventos ao vivo** (`panel`):
- Reutilizar o mesmo stream de eventos do v1 (mesma lista `events`)
- Manter o cursor piscante no último item

---

### 4. CSS — `hive.css`

Portar do arquivo de protótipo `beehive/assets/hive-ui/ui-claude-desing/hive.css` **exatamente** as seguintes classes (sem modificação):
- Todas as `.cc2-*` (linhas ~923–1019 do protótipo)
- `.phase-bar` e regras relacionadas
- `.debate`, `.debate-top`, `.debate-title`, `.debate-meta`, `.debate-state`, `.debate-block`, `.debate-adv`, `.debate-id`
- `.cc2-grid`

Adicionar também:
```css
#cc-v1, #cc-v2 { /* nenhum estilo necessário — visibilidade controlada pelo React */ }
```

---

## Critérios de Aceite

- **AC-01** — `GET /api/hive/state` retorna `agentDetails` com `inboxPending`, `activeWo`, `blockedCount` para os 3 agentes
- **AC-02** — `GET /api/hive/state` retorna `debates` com id, title, status, active para debates ativos
- **AC-03** — Modificar qualquer inbox `.md` → WebSocket atualiza `agentDetails` em ≤ 3s
- **AC-04** — Centro de Controle abre em v2 por default
- **AC-05** — Toggle v1/v2 funciona sem recarregar página
- **AC-06** — Cards de agente mostram `inboxPending > 0` quando há entradas pendentes reais
- **AC-07** — Cards de agente mostram "Nenhuma pendência" quando inbox está limpa
- **AC-08** — Debates ativos listados com barra de fase proporcional ao status
- **AC-09** — Botões de liberar lock só aparecem quando o lock está ativo
- **AC-10** — Painel de configurações abre/fecha corretamente no v2
- **AC-11** — `npm run check:types` e `npm run build` passam sem erros

---

## Validações obrigatórias antes do commit

```bash
cd apps/hive-ui && npm run check:types
cd apps/hive-ui && npm run build
bash beehive/tests/test-gemini-role-guard.sh
curl http://127.0.0.1:5175/controle  # deve retornar 200
```

---

## Notas de implementação

- `readInboxPending`: usar regex `/^\*\*Status:\*\*(?!.*consumida)/m` por entrada (delimitada por `---`)
- `readActiveDebates`: a tabela inicia após `| ID |` — pular linhas de cabeçalho e separador `|---|`
- Fase do debate: mapear pelo conteúdo do campo `status` — não depender de número ordinal no arquivo
- Não criar rotas novas — tudo via `getHiveState()` já existente
- Não commitar — reportar checkpoint no `inbox-claude.md` conforme padrão

---

## Onda seguinte — WO-031 (Componentização)

Após WO-030 commitada, abrir **WO-031** para extrair sub-componentes de `CentroDeControle.tsx`. A componentização só faz sentido após o v2 estar completo — fazê-la antes fragmenta um contrato ainda em formação.

Escopo previsto da WO-031:
- `AgentCard.tsx` — card de estado do agente (v2)
- `DebatesPanel.tsx` — painel de debates com phase-bar
- `LockPanel.tsx` — painel de locks ativos (v1 e v2)
- `DispatchPanel.tsx` — painel + modal de despacho
- `SquadControls.tsx` — toggles de configuração

Critério de entrada: WO-030 commitada e `check:types` verde.

---

## Análise Financeira

- **Custo estimado:** R$ 1,80–2,80 (1–2 sessões Copilot médias)
- **Confiança:** Alta — contrato fechado, sem decisões de design abertas
- **Valor gerado:** visibilidade operacional completa do squad em tempo real; reduz tempo de diagnóstico de bloqueios de ~5min para ~10s
- **Payback:** imediato — primeira sessão de uso
- **Custo de não fazer:** operador continua cego ao estado interno; risco de duplicar trabalho ou perder bloqueios silenciosos

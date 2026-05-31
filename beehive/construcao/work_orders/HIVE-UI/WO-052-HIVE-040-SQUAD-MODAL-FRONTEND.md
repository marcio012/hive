---
id: WO-052
titulo: Squad Modal Frontend — botão "Equipe" + CRUD no Centro de Controle
executor: Copilot-Hive
status: despachada
prioridade: alta
backlog_ref: HIVE-UI
thread: gestao-squad
debate_ref: DEBATE-040
depends_on: WO-051
---

# WO-052: Squad Modal — Frontend (Centro de Controle + Mapa Fábrica)

## 1. Contexto

WO-051 cria o backend `GET/PUT /api/squad`. Esta WO consome essa API no frontend:
- botão "Equipe" na view Controles do Centro de Controle
- modal de listagem e edição dos membros do squad
- hidratação de `MapaFabrica.tsx` com dados da API (substitui array hardcoded)

**Dependência:** executar apenas após WO-051 commitada e build verde.

## 2. Tarefas Técnicas

### 2.1 Buscar dados do squad no hook `useHiveSocket`

Adicionar chamada `GET /api/squad` ao carregar estado. Resultado disponível como
`squadMembers: SquadMember[]` no estado do socket/hook. Fallback: array local com
os 4 membros fixos (igual ao seed do `squad.json`).

```typescript
// Em useHiveSocket.ts ou no componente pai
const [squadMembers, setSquadMembers] = useState<SquadMember[]>(SQUAD_FALLBACK);

useEffect(() => {
  fetch('/api/squad')
    .then(r => r.json())
    .then(setSquadMembers)
    .catch(() => {}); // fallback silencioso
}, []);
```

### 2.2 Botão "Equipe" na view Controles (`CentroDeControle.tsx`)

Adicionar ao final da seção `renderConfigControls()`, seguindo o padrão `ctrl-row`:

```tsx
<div className="ctrl-row">
  <div className="cmeta">
    <div className="ct">Equipe do Squad</div>
    <div className="cd">{squadMembers.filter(m => m.active).length} membros ativos</div>
  </div>
  <button
    className="btn-ghost"
    onClick={() => setSquadModalOpen(true)}
    type="button"
  >
    →
  </button>
</div>
```

### 2.3 Modal `SquadModal` (novo componente)

Criar `src/components/controle/SquadModal.tsx`:

```tsx
// Props
interface SquadModalProps {
  members: SquadMember[];
  onClose: () => void;
  onSave: (updated: SquadMember[]) => Promise<void>;
}
```

**Layout do modal** (seguindo padrão `dispatch-modal`):
- Cabeçalho com título "Equipe do Squad" e botão fechar (×)
- Lista dos 4 membros com avatar (initial), nome, papel e botão editar (✎)
- Ao clicar em ✎: campos editáveis inline (`name`, `role`, `model`, `initial`)
- Botões "Cancelar" e "Salvar" no rodapé
- Estado `saving` durante o `PUT /api/squad`
- Exibir mensagem de erro se o save falhar

**Campos editáveis por membro:**
- `name` — texto livre
- `role` — texto livre
- `model` — texto livre
- `initial` — texto livre, máximo 2 chars

**Campos não editáveis na V1:**
- `id` — fixo
- `inbox` — fixo
- `active` — fixo (não expor toggle na V1)

### 2.4 Hidratação de `MapaFabrica.tsx`

Substituir o array local `agents` hardcoded pela prop/dados vindos do estado global:

```tsx
// Antes (hardcoded):
const agents = [
  { key: 'gemini', name: 'Gemini', role: 'Orquestrador', model: 'gemini-flash', initial: 'G' },
  ...
]

// Depois (da API via prop):
// MapaFabrica recebe squadMembers como prop e mapeia para o formato interno
const agents = squadMembers.map(m => ({
  key: m.id as FactoryAgentKey,
  name: m.name,
  role: m.role,
  model: m.model,
  initial: m.initial,
}));
```

**Atenção:** manter o membro `diretor` / `marcio` com `key: 'diretor'` para não quebrar
a lógica de `getAgentValue` — verificar se o `id` do JSON deve ser `'marcio'` ou `'diretor'`
e alinhar com a tipagem `FactoryAgentKey`.

## 3. Critérios de Aceite

- [ ] Botão "Equipe" aparece na view Controles do Centro de Controle
- [ ] Modal abre com os 4 membros carregados da API
- [ ] Editar `role` de um membro e salvar persiste em `squad.json`
- [ ] `MapaFabrica.tsx` exibe os papéis vindos da API (não mais hardcoded)
- [ ] Fallback local funciona se a API não responder
- [ ] `check:types` verde
- [ ] `build` verde

## 4. Escopo Negativo

- **Não** adicionar botão para criar/remover membros
- **Não** editar o campo `inbox` pela UI
- **Não** editar capabilities pela UI
- **Não** alterar `AgentName` type ou a tipagem do WebSocket

---
*Redigido por: Claude (Arquiteto) — 2026-05-31*

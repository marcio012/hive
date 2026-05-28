---
id: BLUEPRINT_HIVE_WEB_UI
titulo: Hive Web UI — MVP
thread: hive-web-ui-mvp
debate_ref: DEBATE-024
status: aprovado
data: 2026-05-28
responsavel: Claude (Arquiteto)
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive
---

# Blueprint — Hive Web UI MVP

## 1. Objetivo

Interface web local que exibe em tempo real o estado operacional do Hive.
**Só leitura.** Zero mudança nos processos existentes.

---

## 2. Estrutura de Arquivos a Criar

```
apps/
  hive-ui/
    backend/
      src/
        app.module.ts
        main.ts
        hive/
          hive.module.ts
          hive.service.ts      # lê arquivos, agrega estado
          hive.controller.ts   # GET /api/hive/state
          hive.gateway.ts      # WebSocket gateway
      package.json
      tsconfig.json
      nest-cli.json
      .env.example
    frontend/
      src/
        App.tsx
        pages/
          FunilIntencao.tsx
          MapaFabrica.tsx
        hooks/
          useHiveSocket.ts
        components/
          BrainstormCard.tsx
          AgentStatus.tsx
          InboxBadge.tsx
          ActiveItem.tsx
      package.json
      vite.config.ts
      tsconfig.json
      index.html
```

---

## 3. Backend — NestJS

### 3.1 Porta e configuração
- Porta: **3001**
- CORS: `http://localhost:5174`
- Prefixo global: `/api`

### 3.2 Dependências
```json
{
  "@nestjs/common": "^10",
  "@nestjs/core": "^10",
  "@nestjs/platform-express": "^10",
  "@nestjs/websockets": "^10",
  "@nestjs/platform-socket.io": "^10",
  "chokidar": "^3",
  "socket.io": "^4",
  "dotenv": "^16",
  "reflect-metadata": "^0.1",
  "rxjs": "^7"
}
```

### 3.3 HiveService — fontes de dados

#### Lock ativo
- **Arquivo:** `{HIVE_ROOT}/.hive-agent/locks.json`
- **Formato:** `{}` (vazio = nenhum lock) ou `{"claude": {"activity": "...", "acquired_at": "..."}}`
- **Retorno:** objeto com chaves `claude`, `copilot`, `gemini` — valor é o objeto do lock ou `null`

#### Item ativo
- **Arquivo:** `{HIVE_ROOT}/.hive-agent/session-state.env`
- **Formato:** `KEY="value"` por linha
- **Campos lidos:** `ACTIVE_ISSUE`, `LAST_ACTION`, `NEXT_STEP`
- **Parser:** split por `\n`, regex `/^(\w+)="(.*)"/` por linha

#### Contagem de inbox pendentes
- **Arquivos:**
  - `{HIVE_ROOT}/beehive/construcao/inbox-claude.md`
  - `{HIVE_ROOT}/beehive/construcao/inbox-copilot.md`
  - `{HIVE_ROOT}/beehive/construcao/inbox-gemini.md`
- **Lógica:** contar ocorrências de `### [` no arquivo; subtrair ocorrências de `consumida` dentro de cada bloco de entrada
- **Método simples:** `(ocorrências de "### [") - (ocorrências de "Status:** consumida")`

#### Arquivos de brainstorm
- **Diretório:** `{HIVE_ROOT}/beehive/cognition/intuition/brainstorm/`
- **Filtro:** arquivos `.md`
- **Campos extraídos do frontmatter** (bloco `---`):
  - `thread`
  - `status`
  - `data`
  - `responsavel`
- **Título:** primeira linha começando com `# ` no arquivo
- **Parser frontmatter:** regex `/\*\* ?(\w+):\*\* ?(.+)/g` (formato atual dos arquivos)

### 3.4 HiveController
```
GET /api/hive/state
```
Retorna snapshot completo do estado:
```json
{
  "locks": {
    "claude": null,
    "copilot": null,
    "gemini": null
  },
  "session": {
    "activeIssue": "CORE-002",
    "lastAction": "...",
    "nextStep": "..."
  },
  "inboxCounts": {
    "claude": 1,
    "copilot": 0,
    "gemini": 0
  },
  "brainstorm": [
    {
      "filename": "HIVE_WEB_UI_STRATEGY.md",
      "title": "Discovery de Produto — HIVE OS: Web Interface",
      "thread": "hive-web-ui-discovery",
      "status": "em-concepcao-visual",
      "date": "2026-05-28",
      "responsible": "Gemini (PO)"
    }
  ]
}
```

### 3.5 HiveGateway (WebSocket)
- Namespace: `/hive`
- Evento emitido: `hive:update` — payload igual ao retorno do `GET /api/hive/state`
- **Trigger:** chokidar observando `{HIVE_ROOT}/beehive/` e `{HIVE_ROOT}/.hive-agent/`
  - `ignored`: `/(^|[\/\\])\../` (dotfiles exceto `.hive-agent`)
  - `persistent`: true
  - `ignoreInitial`: true
  - Debounce: 300ms após último evento antes de emitir

### 3.6 Variável de ambiente
```
# .env.example
HIVE_ROOT=/home/marcio/job/hive
PORT=3001
```

---

## 4. Frontend — React + Vite

### 4.1 Porta e configuração
- Porta: **5174**
- Proxy no `vite.config.ts`: `/api` → `http://localhost:3001`

### 4.2 Dependências
```json
{
  "react": "^18",
  "react-dom": "^18",
  "socket.io-client": "^4"
}
```
Dev: `vite`, `@vitejs/plugin-react`, `typescript`

### 4.3 Estética (conforme DEBATE-024)
- Background: `#050505`
- Cor primária: `#FFD700`
- Secundária: `#1A1A1A`
- Status ativo/sucesso: `#00FF9F` (verde esmeralda)
- Bloqueio/alerta: `#FF4444`
- Tipografia dados: monospace
- Tipografia narrativa: sans-serif
- Bordas finas, glow sutil no amarelo

### 4.4 useHiveSocket (hook)
- Conecta em `ws://localhost:3001/hive` via socket.io-client
- Faz `GET /api/hive/state` no mount para carga inicial
- Escuta `hive:update` e atualiza estado local
- Expõe: `{ state, connected, error }`

### 4.5 Tela — Funil de Intenção (`/funil`)
**Exibe:** lista de arquivos de brainstorm
**Componentes:**
- `BrainstormCard` por arquivo: título, thread, status (badge colorido), data, responsável
- Status badge: `em-ideacao` → amarelo, `em-concepcao-visual` → azul, `concluido` → verde

### 4.6 Tela — Mapa da Fábrica (`/mapa`)
**Exibe:** estado operacional em tempo real
**Componentes:**
- `AgentStatus` × 3 (Claude, Copilot, Gemini): avatar do agente + nome da atividade se lock ativo, ou "Livre" se null
- `InboxBadge` × 3: número de pendências por agente; zero = cinza, >0 = amarelo pulsante
- `ActiveItem`: card com `ACTIVE_ISSUE`, `LAST_ACTION`, `NEXT_STEP` do session-state

### 4.7 App.tsx — navegação
- Duas tabs fixas no topo: "Funil de Intenção" | "Mapa da Fábrica"
- Indicador de conexão WebSocket no canto superior direito (ponto verde/vermelho)
- Rota padrão: `/mapa`

---

## 5. Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `GET /api/hive/state` retorna JSON válido com as 4 chaves |
| AC-02 | Frontend carrega em `http://localhost:5174` sem erros de console |
| AC-03 | Mapa da Fábrica exibe lock, inbox counts e active item corretos |
| AC-04 | Funil de Intenção lista os 3 arquivos de brainstorm existentes com título e status |
| AC-05 | Ao modificar qualquer arquivo em `beehive/`, o Mapa atualiza em até 1s sem F5 |
| AC-06 | Indicador WebSocket fica verde quando conectado |
| AC-07 | `npm run hive:ui` na raiz do hive sobe backend + frontend simultaneamente |

---

## 6. Scripts npm (raiz do hive)

Adicionar em `package.json` raiz:
```json
"hive:ui": "concurrently \"npm run hive:ui:back\" \"npm run hive:ui:front\"",
"hive:ui:back": "cd apps/hive-ui/backend && npm run start:dev",
"hive:ui:front": "cd apps/hive-ui/frontend && npm run dev"
```

Se `concurrently` não estiver instalado na raiz, adicionar como devDependency.

---

## 7. Débito Técnico Rastreável

- **DT-001:** inbox count por regex pode quebrar se o formato das entradas mudar — substituir por parser de frontmatter por bloco em onda futura

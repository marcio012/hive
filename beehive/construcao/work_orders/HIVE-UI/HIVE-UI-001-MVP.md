---
id: CLAUDE-2026-05-28-047
wo_ref: HIVE-UI-001
titulo: Hive Web UI — MVP (Funil de Intenção + Mapa da Fábrica)
thread: hive-web-ui-mvp
debate_ref: DEBATE-024
blueprint_ref: BLUEPRINT_HIVE_WEB_UI
status: concluida
data: 2026-05-28
emitido_por: Claude (Arquiteto)
executor: Copilot
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive
---

# WO HIVE-UI-001 — Hive Web UI MVP

## Missão

Criar `apps/hive-ui/` no repositório `hive` com backend NestJS + frontend React que exibe em tempo real o estado operacional do Hive.

**Spec completa:** `beehive/construcao/blueprints/BLUEPRINT_HIVE_WEB_UI.md`

---

## Escopo

### O que fazer
1. Criar `apps/hive-ui/backend/` — NestJS na porta 3001
   - `HiveService`: lê locks.json, session-state.env, inbox files, brainstorm files
   - `HiveController`: `GET /api/hive/state`
   - `HiveGateway`: WebSocket namespace `/hive`, evento `hive:update`
   - Chokidar watching `beehive/` e `.hive-agent/` com debounce 300ms
2. Criar `apps/hive-ui/frontend/` — React + Vite na porta 5174
   - Hook `useHiveSocket`: carga inicial + escuta WebSocket
   - Tela `/funil` — lista arquivos de brainstorm com BrainstormCard
   - Tela `/mapa` — AgentStatus × 3, InboxBadge × 3, ActiveItem
   - Estética: `#050505` bg, `#FFD700` primária, bordas finas, glow sutil
3. Adicionar scripts `hive:ui`, `hive:ui:back`, `hive:ui:front` ao `package.json` raiz

### O que NÃO fazer
- Não modificar nenhum arquivo em `beehive/`
- Não modificar processos dos agentes
- Não criar endpoints de escrita
- Não instalar dependências globais

---

## Critérios de Aceite

| # | Critério |
|---|---------|
| AC-01 | `GET /api/hive/state` retorna JSON válido com `locks`, `session`, `inboxCounts`, `brainstorm` |
| AC-02 | Frontend carrega em `http://localhost:5174` sem erros de console |
| AC-03 | Mapa da Fábrica exibe lock, inbox counts e active item corretos |
| AC-04 | Funil de Intenção lista os arquivos de brainstorm com título e status |
| AC-05 | Modificar arquivo em `beehive/` → Mapa atualiza em até 1s sem F5 |
| AC-06 | Indicador WebSocket fica verde quando conectado |
| AC-07 | `npm run hive:ui` na raiz sobe backend + frontend |

---

## Ponto de Parada

Ao concluir, reportar ao Claude via `inbox-claude.md`:
- Confirmação de cada AC
- Arquivos criados
- Evidência de `npm run hive:ui` funcionando

Não commitar sem aprovação do Claude.

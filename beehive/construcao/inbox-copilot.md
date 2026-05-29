# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

### [CLAUDE-2026-05-29-066] Liberação de commit — correção scanner inbox
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**thread:** higiene-inbox-copilot
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-025-A-HIGIENE-PREVENCAO.md
**Status:** executada — commit `256637e` realizado em 2026-05-29

Aprovado com ressalva menor. Pode commitar os 4 arquivos do escopo:
`beehive/bin/hive-inbox.sh`, `scripts/inbox-utils.js`, `scripts/inbox-pending.js`, `beehive/tests/test-gemini-role-guard.sh`.
Assinatura: `Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto`
Ressalva (DT não bloqueante): deduplicação assume prepend-first — registrar no backlog como DT.

---

### [CLAUDE-2026-05-29-065] Parecer solicitado — DEBATE-027 Falhas Sistêmicas
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-29
**tipo:** pedido-de-parecer
**thread:** tratamento-falhas-sistemicas
**debate_ref:** beehive/construcao/debates/DEBATE-027-TRATAMENTO-DE-FALHAS-SISTEMICAS-NO-FLUXO-HIVE.md
**Status:** executada — parecer registrado na Seção 6 de `beehive/construcao/debates/DEBATE-027-TRATAMENTO-DE-FALHAS-SISTEMICAS-NO-FLUXO-HIVE.md` em 2026-05-29

DEBATE-027 aberto. Tema: prevenção e recuperação de falhas sistêmicas no fluxo Hive (qualquer categoria — executor errado, auditoria pulada, cascata silenciosa, lock órfão, etc.).

Sua ação: emitir parecer de Engenheiro na Seção 6 do debate. Foco em: viabilidade de implementar guards automáticos, onde ficam (scripts vs DIRs vs Orchestrator), e custo técnico de um arquivo de incidentes + estado de alerta.

---

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

**Tipos de entrada (metadado opcional — aplicar em novas entradas):**
- `alerta-roteamento` — o agente identificou algo mas não tem autoridade para agir; Claude deve decidir

### [CLAUDE-2026-05-29-064] Liberação de commit — WO-026-B Orchestrator UI
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-026
**thread:** orquestrador-hibrido-chief-agent
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-026-B-INTEGRACAO-UI.md
**Status:** executada — commit `3f5ec9d` realizado em 2026-05-29

WO-026-B **aprovada com ressalva menor**. Commit liberado.

**Parecer:**
- ✅ `POST /api/hive/orchestrator/event` — endpoint correto, validação robusta
- ✅ Watcher do gateway cobre `orchestrator-state.json` → debounce 300ms → broadcast
- ✅ `addOrchestratorEvent()` faz push imediato via `subscribeState()` quando evento chega por HTTP
- ✅ Banner `orch-banner` para status `paused` visível no Centro de Controle
- ✅ `currentItem` e badge de status implementados
- ⚠️ AC-04 (extração DT-004): `DispatchModal` e `LockPanel` **não foram extraídos** — `CentroDeControle.tsx` permanece com 565 linhas. DT-004 segue no backlog, não bloqueia este commit.

**Ação:** commitar os arquivos do escopo da WO-026-B com mensagem:
`feat(hive-ui): WO-026-B — Integração UI Orchestrator Core`
`Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto`
`Aprovado: Márcio`

---

### [CLAUDE-2026-05-29-070] Go — iniciar WO-026-B Orchestrator UI
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-026
**thread:** orquestrador-hibrido-chief-agent
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-026-B-ORCHESTRATOR-UI.md
**Status:** executada — WO-026-B implementada sem commit em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-39`

WO-026-A auditada e aprovada. Pode iniciar WO-026-B agora.
Integrar `orchestrator-state.json` ao `HiveState` + badge no Centro de Controle + endpoint para eventos do Core.
Após concluir, reportar checkpoint no `inbox-claude.md` sem commitar.

---

### [CLAUDE-2026-05-29-069] Commit liberado — WO-026-A Orchestrator Core
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-026
**thread:** orquestrador-hibrido-chief-agent
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-026-A-ORCHESTRATOR-CORE.md
**Status:** executada — commit `53abf8f` realizado em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-38`

WO-026-A aprovada com ressalvas menores (DT-006 e DT-007 registrados no backlog — não bloqueantes).

Commitar todos os arquivos de `apps/orchestrator/` + scripts adicionados em `package.json`.

Mensagem de commit obrigatória:
```
feat(orchestrator): WO-026-A — Orchestrator Core V1 daemon Node.js

Watcher chokidar sobre inbox-*.md + hive-ui-config.json + locks.json.
Roteamento determinístico via routing.yaml. Idempotência por
processedEntries em orchestrator-state.json. Bootstrap semeia entradas
existentes para evitar replay na inicialização. Dispatcher com escrita
atômica (tmp→rename) e retry 60s/3x se lock ocupado. Deadman's Switch:
3 falhas consecutivas ou timeout 30min → autoMode=false + status=paused.
Logger não bloqueia se UI retornar 404.

DT-006: markProcessed após writeTextAtomic (ordem invertida — baixo risco).
DT-007: agent_livre no routing.yaml decorativo — lock verificado no dispatcher.

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Approved by: Márcio
```

---

### [CLAUDE-2026-05-29-068] Go — iniciar WO-026-A Orchestrator Core
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-026
**thread:** orquestrador-hibrido-chief-agent
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-026-A-ORCHESTRATOR-CORE.md
**Status:** executada — WO-026-A iniciada e concluída sem commit em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-36`

DEBATE-026 aprovado. Márcio autorizou execução agora.
Execute a WO-026-A: implemente `apps/orchestrator/` conforme o contrato técnico.
Após concluir, reporte checkpoint no `inbox-claude.md` sem commitar.
WO-026-B aguarda WO-026-A auditada — não iniciar em paralelo.

---

### [CLAUDE-2026-05-29-065] Commit liberado — WO-025-B contenção de inbox
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-025
**thread:** higiene-inbox-copilot
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-025-B-HIGIENE-CONTENCAO.md
**Status:** executada — commit `81773c0` realizado em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-35`

WO-025-B auditada e aprovada com ressalva menor.

**Commit liberado para os 4 arquivos do escopo:**
1. `scripts/inbox-utils.js`
2. `scripts/inbox-lint.js`
3. `scripts/inbox-pre-commit.js`
4. `.githooks/pre-commit`

**Mensagem de commit sugerida:**
```
feat(inbox): add containment hygiene checks (WO-025-B)

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Aprovado: Márcio
```

**Ressalva (não bloqueia):** `inCodeFence` não é resetado ao iniciar nova entrada — sem impacto em conteúdo válido. Registrar como observação interna se quiser, mas não retrabalhar agora.

**DT registrado:** DT-005 no backlog — migrar `inbox-utils.js` para TypeScript compartilhado quando o Orchestrator Core (pós-DEBATE-026) entrar.

---

### [CLAUDE-2026-05-29-064] Commit liberado — WO-025-A prevenção de inbox
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-025
**thread:** higiene-inbox-copilot
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-025-A-HIGIENE-PREVENCAO.md
**Status:** executada — commit `8db27c6` realizado em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-33`

WO-025-A auditada e aprovada com ressalva menor.
Commit liberado para os 5 arquivos do escopo:
`TEMPLATE_HANDOFF.md`, `beehive/.claude/CLAUDE.md`, `scripts/inbox-lint.js`, `package.json`, `beehive/bin/hive-inbox.sh`.

Ressalva (registrar como DT na WO-025-B): entradas `consumida` antigas com corpo > 30 linhas continuarão aparecendo no lint — ruído crescente, mas não bloqueante (exit 0).

Após o commit, aguardar instrução para WO-025-B (limpeza/containment).

---
- `pedido-de-parecer` — aguarda posição do Copilot sem execução de código
- `handoff-executavel` — contrato fechado com WO do Claude; Copilot pode executar
Entradas sem tipo: tratar como `pedido-de-parecer` por padrão.

---

<!-- novas entradas abaixo — mais recente no topo -->

### [CLAUDE-2026-05-29-067] WO-026-B: Orchestrator — Integração com Hive UI
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-026
**thread:** orquestrador-hibrido-chief-agent
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-026-B-ORCHESTRATOR-UI.md
**Status:** executada — WO-026-B implementada sem commit em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-39`
**dependencia:** WO-026-A aprovada ✅

Integrar estado do Orchestrator Core ao Hive UI: `orchestrator-state.json` → `HiveState` → badge de status no Centro de Controle + endpoint para eventos do Core.
Critérios-chave: badge colored por status, banner de pausa, `check:types` e `build` OK.

---

### [CLAUDE-2026-05-29-066] WO-026-A: Orchestrator Core V1 — daemon Node.js
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-026
**thread:** orquestrador-hibrido-chief-agent
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-026-A-ORCHESTRATOR-CORE.md
**Status:** executada — implementação concluída sem commit em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-36`

Implementar `apps/orchestrator/` como processo Node.js separado: watcher chokidar, roteamento YAML determinístico, idempotência via `orchestrator-state.json`, Deadman's Switch (3 falhas → pausa), pm2 scripts.
Critérios-chave: autoMode off → observa sem agir; autoMode on → roteia handoff-executavel para Copilot; sem redisparo de entrada já processada.

---

### [CLAUDE-2026-05-29-065] WO-025-B: Higiene de Inbox — Onda 2 (Contenção)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-025
**thread:** higiene-inbox-copilot
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-025-B-HIGIENE-CONTENCAO.md
**Status:** executada — implementação commitada via `81773c0`; retorno final registrado no `inbox-claude.md` como `COPILOT-2026-05-29-35`
**dependencia:** WO-025-A aprovada primeiro

Pre-commit hook diff-aware que bloqueia apenas novas entradas > 30 linhas + limpeza de entradas longas ativas (extração para `legacy-inbox/`).
Critérios-chave: hook não bloqueia commits sem inbox; lint reporta 0 violações ativas após limpeza.

---

### [CLAUDE-2026-05-29-064] WO-025-A: Higiene de Inbox — Onda 1 (Prevenção)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-025
**thread:** higiene-inbox-copilot
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-025-A-HIGIENE-PREVENCAO.md
**Status:** pendente

Criar `TEMPLATE_HANDOFF.md` + atualizar `CLAUDE.md` com padrão DIR-088 + script `npm run squad:inbox:lint` (não bloqueante, reporta entradas > 30 linhas) + integrar ao `squad:inbox`.
Critérios-chave: lint executa sem erro, reporta violações existentes, integrado ao `squad:inbox`.

---

### [CLAUDE-2026-05-29-063] Pedido de Parecer — DEBATE-025 e DEBATE-026
**De:** Claude (Arquiteto) → Copilot (Engenheiro)
**Data:** 2026-05-29
**tipo:** pedido-de-parecer
**thread:** higiene-inbox-copilot / orquestrador-hibrido-chief-agent
**Status:** executada — pareceres cobertos: DEBATE-025 já registrado anteriormente; DEBATE-026 registrado em 2026-05-29; retorno ao Claude em `COPILOT-2026-05-29-31`

Copilot, preciso do seu parecer de Engenheiro nos dois debates abertos. Leia os pareceres do Gemini e do Claude antes de responder. Registre na seção 6 de cada arquivo.

- **DEBATE-025** — `beehive/construcao/debates/DEBATE-025-POLITICA-HIGIENE-INBOX.md`
  Foco: viabilidade técnica do pre-commit hook (como detectar apenas a entrada nova no diff), do script de lint e do novo template de handoff. Você consegue trabalhar com inbox curto + link para WO?

- **DEBATE-026** — `beehive/construcao/debates/DEBATE-026-ORQUESTRADOR-HIBRIDO-CHIEF-AGENT-PILOTO-AUTOMATICO.md`
  Foco: viabilidade de implementar o Orchestrator Core como processo Node.js/bash separado que observa inboxes via watcher. Riscos de implementação, dependências e complexidade estimada.

Retornar ao `inbox-claude.md` após registrar os pareceres.

---

### [CLAUDE-2026-05-29-062] Liberação de commit — HIVE-UI-003
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-UI-003
**thread:** hive-web-ui-mvp
**Status:** executada — commit `1309cdd` realizado em 2026-05-29; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-29-29`

HIVE-UI-003 auditada e **aprovada com ressalva menor** (DT-004 registrado no BACKLOG.md).

**Ação:** commitar os 5 arquivos da implementação HIVE-UI-003.

**Mensagem de commit obrigatória:**
```
feat(hive-ui): HIVE-UI-003 — Centro de Controle funcional

Lock release via POST /api/hive/lock/release/:agent com execFile +
proxy.sh. Config persistida em .hive-agent/hive-ui-config.json com
escrita atômica (tmp → rename). Dispatch escreve entrada UI-* no
inbox do agente escolhido via anchor ou fallback.

Frontend: switches consomem state.config do WebSocket (sem estado
local), loading states granulares por chave, modal de despacho com
aria attributes, toast auto-dismiss, commandCount via events.filter.

DT-004 registrado: CentroDeControle.tsx (~450 linhas) — extrair
sub-componentes em onda futura.

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Approved by: Márcio
```

---

### [CLAUDE-2026-05-29-059] Handoff — HIVE-UI-003: Hive UI funcional (lock release + switches persistidos + despacho)
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** HIVE-UI-003
**thread:** hive-web-ui-mvp
**Status:** executada — ✅ Aprovado com ressalva menor em 2026-05-29; commit liberado via CLAUDE-2026-05-29-062. DT-004 registrado no BACKLOG.md.

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive/apps/hive-ui
```

## Contexto

A UI do Hive está visualmente completa (HIVE-UI-002 — commit 3060a46) mas os controles não têm efeito real:
- Botão "Forçar liberação" de lock → visual sem ação
- Switches (Modo autônomo, Auto-merge, Notificar Márcio) → estado local React, não persiste
- Botões de despacho (Claude / Copilot / Gemini / + Nova intenção) → visual sem ação

**Leia antes de executar:**
- `apps/hive-ui/backend/src/hive/hive.service.ts` — serviço atual
- `apps/hive-ui/backend/src/hive/hive.controller.ts` — endpoints existentes
- `apps/hive-ui/backend/src/hive/hive.gateway.ts` — WebSocket gateway
- `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx` — componente com os controles mockados
- `apps/hive-ui/frontend/src/hooks/useHiveSocket.ts` — hook de estado

**Não implementar:** lógica de orquestrador autônomo — isso está em debate (DEBATE-026). O switch "Modo autônomo" deve persistir o estado mas sem acionar nenhum comportamento real de orquestração por enquanto.

---

## Parte 1 — Backend

### 1.1 Endpoint: liberar lock de agente

```
POST /api/hive/lock/release/:agent
```

Executa via `child_process.execFile` o script npm equivalente a:
```bash
npm run squad:lock:release -- <agent>
```

Usar `execFile` com caminho absoluto do script — não `exec` com string shell.
Retornar `{ ok: true }` em sucesso ou `{ ok: false, error: string }` em falha.
Emitir evento no `EventBuffer`: `{ level: 'lock', msg: 'Lock de <agent> liberado via UI' }`.

### 1.2 Endpoint: ler e salvar config do squad

```
GET  /api/hive/config          → retorna HiveConfig
POST /api/hive/config          → body: Partial<HiveConfig>, salva e retorna HiveConfig atualizado
```

**Arquivo de persistência:** `.hive-agent/hive-ui-config.json`

```typescript
interface HiveConfig {
  autoMode: boolean;       // Modo autônomo (sem efeito real — DEBATE-026 pendente)
  autoMerge: boolean;      // Auto-merge em verde
  notifyMarcio: boolean;   // Notificar Márcio
}
```

Defaults se arquivo não existir: `{ autoMode: false, autoMerge: false, notifyMarcio: true }`.

### 1.3 Endpoint: despachar intenção

```
POST /api/hive/dispatch
Body: { agent: 'claude' | 'copilot' | 'gemini', message: string }
```

Escreve entrada no inbox do agente escolhido:
- Claude → `beehive/construcao/inbox-claude.md`
- Copilot → `beehive/construcao/inbox-copilot.md`
- Gemini → `beehive/construcao/inbox-gemini.md`

**Formato da entrada a escrever (append no topo, após o comentário `<!-- novas entradas -->`)**:
```markdown
### [UI-{YYYY-MM-DD}-{HH:mm}] Intenção despachada via Hive UI
**De:** Márcio (via Hive UI) → {Agent}
**Data:** {YYYY-MM-DD}
**tipo:** pedido-de-parecer
**Status:** pendente

{message}

---
```

Retornar `{ ok: true }` em sucesso.
Emitir evento: `{ level: 'info', msg: 'Intenção despachada para <agent> via UI' }`.

### 1.4 Incluir `config` no HiveState e emitir via WebSocket

Adicionar ao `HiveState`:
```typescript
config: HiveConfig;
```

O `getState()` deve chamar `readConfig()` e incluir no retorno.
O gateway já emite `hive:update` com o estado completo — nenhuma mudança necessária no gateway.

---

## Parte 2 — Frontend

### 2.1 Hook `useHiveSocket.ts`

Adicionar `config` ao tipo `HiveState`:
```typescript
config: {
  autoMode: boolean;
  autoMerge: boolean;
  notifyMarcio: boolean;
} | null;
```

### 2.2 `CentroDeControle.tsx`

**Remover** os `useState` locais de `autoMode`, `autoMerge` e `notifyMarcio`.
**Usar** `state.config` como fonte de verdade (inicializar via WebSocket).

**Ao clicar num switch:**
```typescript
const toggleConfig = async (key: keyof HiveConfig, value: boolean) => {
  await fetch('/api/hive/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [key]: value }),
  });
  // estado atualiza via próximo hive:update do WebSocket
};
```

**Botão "Forçar liberação":**
```typescript
const releaseLock = async (agent: string) => {
  await fetch(`/api/hive/lock/release/${agent}`, { method: 'POST' });
};
```

**Botões de despacho (Claude / Copilot / Gemini):**
- Ao clicar: abrir modal inline simples com `<textarea>` para digitar a mensagem e botão "Despachar"
- Submit: `POST /api/hive/dispatch` com `{ agent, message }`
- Fechar modal após sucesso + toast simples ("Intenção despachada para Claude")

**Botão "+ Nova intenção":**
- Mesmo modal mas com `<select>` para escolher o agente + `<textarea>` para mensagem

**Contador "Comandos":**
- Contar entradas de `state.events` com `level === 'info'` e `msg` contendo "despachada" ou "liberado"
- Exibir esse número no lugar do "—"

---

## Critérios de Aceite

- [ ] Clicar "Forçar liberação" → lock liberado, evento aparece no stream, botão some da lista
- [ ] Toggle "Modo autônomo" → estado persiste após recarregar a página
- [ ] Toggle "Notificar Márcio" → idem
- [ ] Clicar "Copilot" em Despachar → modal abre, digitar mensagem, submit → entrada aparece em `inbox-copilot.md`
- [ ] "+ Nova intenção" → modal com select de agente funciona
- [ ] `npm run check:types` (frontend e backend) → OK
- [ ] `npm run build` (frontend e backend) → OK

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Confirmação dos critérios
- Commit hash (sem commitar — aguardar auditoria)

### [CLAUDE-2026-05-28-058] Liberação de commit — HIVE-UI-002
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**tipo:** handoff-executavel
**backlog_ref:** HIVE-UI-002
**thread:** hive-web-ui-mvp
**Status:** consumida — commit `3060a46` realizado em 2026-05-28

HIVE-UI-002 auditada e **aprovada com ressalva menor** (App.tsx grande — refatorar futuramente, não bloqueia).

**Ação:** commitar os 11 arquivos da implementação HIVE-UI-002.

**Mensagem de commit obrigatória:**
```
feat(hive-ui): v2 — novo design system + 3 telas + fluxo apresentatório

Shell com Space Grotesk + IBM Plex Mono, hive.css com design tokens
premium. Landing e login mockados para fluxo de showroom.

Tela 1 (Mapa da Fábrica): agent cards com pulse/glow, inbox badges
animados, item ativo. Tela 2 (Funil): kanban 5 colunas com dados
reais de FILA_CLAUDE.md e FILA_COPILOT.md. Tela 3 (Centro de
Controle): uptime, locks, switches, dispatch e stream de eventos.

Backend: pipeline parser dual (Claude+Copilot), EventBuffer em
memória, uptime, eventos contextualizados por watcher.

Ressalva registrada: App.tsx (722 linhas) — refatorar em componentes
menores em onda futura.

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Approved by: Márcio
```

---

### [CLAUDE-2026-05-28-057] Handoff — TOS-013 Onda 2: formulário de branding na Settings
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**tipo:** handoff-executavel
**backlog_ref:** TOS-013
**thread:** branding-dinamico-white-label
**Status:** executada — ✅ Aprovado com ressalva menor em 2026-05-29; commit ef5532d validado. TOS-013 fechado. DT-003 registrado no BACKLOG-TOS.md.

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS/frontend
```

## Contexto

TOS-013 Onda 1 já entregou: CSS vars completas, fallback FluxoLabel, sem FOUC (commit b151437).
Esta Onda 2 é **puramente frontend** — o backend já está pronto:

- Endpoint: `PATCH /api/tenant/admin/:id` — aceita todos os campos de branding via `UpdateAdminTenantDto`
- Campos disponíveis: `brandingNome`, `brandingTagline`, `brandingLogoUrl`, `brandingCoverUrl`, `brandingCorPrimaria`, `brandingCorSecundaria`, `brandingTextoSobrePrimaria`, `brandingFundoPagina`, `brandingFundoPainel`, `brandingTextoPrimario`, `brandingTextoSecundario`
- A tela `Settings.tsx` existe mas está vazia

**Leia antes de executar:**
- `frontend/src/app/components/pages/Settings.tsx` — estado atual (vazio)
- `backend/src/tenant/dto/admin-tenant.dto.ts` — `UpdateAdminTenantDto` com todos os campos
- `frontend/src/app/api.ts` — padrão de chamada `api.xxx()`
- `frontend/src/app/tenant/TenantThemeProvider.tsx` — como as CSS vars são injetadas

---

## O que implementar

### 1. Adicionar método em `api.ts`

```typescript
getBrandingAdmin: (tenantId: string) =>
  request<UpdateAdminTenantDto>(`/tenant/admin/${tenantId}`, 'GET'),

updateBranding: (tenantId: string, dto: Partial<UpdateAdminTenantDto>) =>
  request<void>(`/tenant/admin/${tenantId}`, 'PATCH', dto),
```

### 2. Reescrever `Settings.tsx`

Formulário de branding com os campos abaixo. **Apenas admin** pode ver e salvar (verificar com `isAdmin()`).

**Campos do formulário (todos opcionais):**

| Campo | Tipo | Label |
|---|---|---|
| `brandingNome` | text | Nome da marca |
| `brandingTagline` | text | Slogan |
| `brandingLogoUrl` | url | URL do logo |
| `brandingCoverUrl` | url | URL da capa |
| `brandingCorPrimaria` | color | Cor primária |
| `brandingCorSecundaria` | color | Cor secundária |
| `brandingTextoSobrePrimaria` | color | Texto sobre primária |
| `brandingFundoPagina` | color | Fundo da página |
| `brandingFundoPainel` | color | Fundo do painel |

Os campos `brandingTextoPrimario` e `brandingTextoSecundario` podem ser omitidos desta versão (menos críticos).

**Fluxo:**
1. No mount: chamar `api.getBrandingAdmin(user.tenantId)` para pré-preencher os campos
2. Inputs de cor: usar `<input type="color">` — simples e sem dependência
3. Inputs de texto: `<input type="text">` com placeholder
4. Preview ao vivo: a cada mudança de cor, atualizar as CSS vars no `document.documentElement` usando `root.style.setProperty()` — igual ao que `TenantThemeProvider` já faz
5. Botão "Salvar": chamar `api.updateBranding(user.tenantId, formData)` com `PATCH`
6. Feedback: toast simples ("Branding salvo!" / "Erro ao salvar")

**Preview ao vivo — mapeamento de campo → CSS var:**
```typescript
const CSS_MAP: Record<string, string> = {
  brandingCorPrimaria:        '--tenant-primary',
  brandingCorSecundaria:      '--tenant-secondary',
  brandingTextoSobrePrimaria: '--tenant-text-on-primary',
  brandingFundoPagina:        '--tenant-page-bg',
  brandingFundoPainel:        '--tenant-panel-bg',
};
```

**Não-admin:** exibir mensagem "Configurações disponíveis apenas para administradores."

### 3. Adicionar rota em `routes.tsx`

Verificar se `/app/settings` já está registrada. Se não, adicionar:
```typescript
import Settings from "./components/pages/Settings";
// children de /app:
{ path: "settings", Component: Settings },
```

---

## Critérios de Aceite

- [ ] Admin acessa `/app/settings` e vê o formulário de branding
- [ ] Campos pré-preenchidos com dados atuais do tenant
- [ ] Mudar cor primária atualiza visualmente a UI em tempo real (sem salvar)
- [ ] Clicar "Salvar" chama `PATCH /api/tenant/admin/:id` e retorna sucesso
- [ ] Não-admin vê mensagem de acesso restrito
- [ ] `npm run check:types` (frontend) → OK
- [ ] `npm run build` (frontend) → OK

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Confirmação dos critérios
- Commit hash

---

### [CLAUDE-2026-05-28-056] Handoff — Hive Web UI v2: novo design system + 3 telas
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**tipo:** handoff-executavel
**backlog_ref:** HIVE-UI-002
**thread:** hive-web-ui-mvp
**Status:** executada — ✅ Aprovado com ressalva menor em 2026-05-28; retorno consumido no `inbox-claude.md` (`COPILOT-2026-05-28-26`). Commit liberado via `CLAUDE-2026-05-28-058`

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive/apps/hive-ui
```

## Contexto

O Claude.ai Design gerou o design system completo do Hive Web UI v2 em:
`beehive/assets/hive-ui/ui-claude-desing/`

Arquivos de referência obrigatória (ler antes de implementar):
- `Hive OS.html` — HTML completo das 3 telas com dados de exemplo
- `hive.css` — sistema visual completo (CSS variables, componentes)
- `app.js` — lógica de tabs, clock, animações

A implementação React existente em `apps/hive-ui/frontend/` será substituída pelo novo design.

---

## PARTE 1 — Design System

### 1.1 Copiar `hive.css`

Copiar `beehive/assets/hive-ui/ui-claude-desing/hive.css` para:
`apps/hive-ui/frontend/src/hive.css`

Sem modificações — usar o CSS tal como está.

### 1.2 Adicionar fontes em `index.html`

Adicionar no `<head>` do `apps/hive-ui/frontend/index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

### 1.3 Importar CSS em `main.tsx`

```typescript
import './hive.css';
```

---

## PARTE 2 — Backend: novos dados

### 2.1 Adicionar ao `HiveState` em `hive.service.ts`

```typescript
export interface HiveState {
  locks: ...        // já existe
  session: ...      // já existe
  inboxCounts: ...  // já existe
  brainstorm: ...   // já existe
  pipeline: PipelineItem[];   // NOVO
  events: HiveEvent[];        // NOVO
  uptime: number;             // NOVO — segundos desde start do servidor
}

export interface PipelineItem {
  id: string;
  title: string;
  stage: 'triagem' | 'execucao' | 'revisao' | 'concluido';
  agent: 'claude' | 'copilot' | 'gemini' | 'marcio';
  priority: 'hi' | 'md' | 'lo';
  updatedAt: string; // ISO
}

export interface HiveEvent {
  ts: string;       // HH:mm:ss
  level: 'ok' | 'info' | 'warn' | 'err' | 'lock';
  msg: string;
}
```

### 2.2 `readPipeline()` em `HiveService`

Ler `FILA_COPILOT.md` e `FILA_CLAUDE.md` de `beehive/construcao/tasks/`.
Extrair itens das tabelas markdown com regex: `| ID | ... | Status |`

Mapear status para stage:
- `pendente` → `triagem`
- `em andamento` / `em execucao` → `execucao`
- `em revisao` / `aguarda` → `revisao`
- `✅` / `concluido` → `concluido` (incluir só os 3 mais recentes)

### 2.3 `readEvents()` em `HiveService`

Manter ring buffer em memória de até 20 eventos (classe `EventBuffer` no service).
Iniciar com 1 evento: `{ ts: agora, level: 'info', msg: 'Hive UI conectado' }`.

Expor método `addEvent(level, msg)` — chamado internamente quando:
- Lock muda (detectado pelo watcher)
- Inbox muda (detectado pelo watcher)

### 2.4 `uptime`

```typescript
private readonly startedAt = Date.now();
getUptime(): number { return Math.floor((Date.now() - this.startedAt) / 1000); }
```

---

## PARTE 3 — Frontend: componentes e telas

A abordagem é usar as classes CSS do `hive.css` via `className` no JSX.
Não usar `style={{}}` inline — usar as classes do design system.

### 3.1 Reescrever `App.tsx` — Shell

```tsx
// Header com: brand, nav-tabs (3 tabs), ws-status (clock + pill + operador)
// Tab ativa recebe className "nav-tab active"
// Relógio: setInterval a cada segundo formatando new Date() como HH:mm:ss
// Rotas: estado local com useState<'/mapa'|'/funil'|'/controle'>
```

SVGs das tabs: copiar exatamente do `Hive OS.html` (grid icon, funil icon, sliders icon).
Logo: hexagon SVG + `<b>HIVE</b><span>OS</span>`.

### 3.2 Reescrever `MapaFabrica.tsx` — Tela 1

Estrutura de seções:
```
<div className="page">
  <div className="page-head">...</div>
  <div className="section-label">01 AGENTES</div>
  <div className="grid-3">
    <AgentCard agent="claude" ... />
    <AgentCard agent="copilot" ... />
    <AgentCard agent="gemini" ... />
  </div>
  <div className="section-label">02 INBOX · PENDÊNCIAS</div>
  <div className="grid-3">
    <InboxCard agent="claude" count={...} />
    ...
  </div>
  <ActiveItem ... />
</div>
```

**AgentCard** — classes:
- Container: `agent-card active` ou `agent-card free`
- Ícone: `agent-ico`
- Badge: `badge green` ou `badge gray`
- Activity bar: `act-bar` com `<i>` interno (animação CSS)
- Pulse corner: `dot green pulse agent-corner`

**InboxCard** — classes:
- Container: `inbox-card pending glow-border-pulse` (se count > 0) ou `inbox-card`
- Ícone: `inbox-ico`
- Contagem: `inbox-count`

**ActiveItem** — classes: `active-item`, `ai-head`, `ai-grid`, `ai-col`

### 3.3 Reescrever `FunilIntencao.tsx` — Tela 2 (pipeline kanban)

5 colunas: Captura | Triagem | Execução | Revisão | Mergeado

Fonte de dados: `state.pipeline` (do WebSocket).

```tsx
// funnel-strip: 5 cards com contagem por stage
// board: 5 colunas .col com .col-stack de .intent cards
// intent.active se stage === 'execucao'
// prio: .prio.hi/.md/.lo
// mini-av: .av-claude/.av-copilot/.av-gemini/.av-human
```

Captura e Mergeado podem exibir dados mock estáticos por enquanto
(sem fonte de dados real para essas etapas neste momento).

### 3.4 Criar `CentroDeControle.tsx` — Tela 3 (nova)

```
<div className="page">
  <div className="page-head">...</div>

  {/* Stats: uptime, locks ativos, comandos (mock 0), taxa sucesso (mock 100%) */}
  <div className="cc-stats">
    <div className="stat good">Uptime</div>
    <div className="stat gold">Locks ativos</div>
    <div className="stat">Comandos (—)</div>
    <div className="stat good">Status</div>
  </div>

  <div className="cc-grid">
    {/* Coluna esquerda */}
    <div>
      {/* Panel: Locks Ativos */}
      {/* Panel: Controles (toggles visuais, sem backend por ora) */}
      {/* Panel: Despachar (botões visuais, sem backend por ora) */}
    </div>

    {/* Coluna direita: Stream de Eventos */}
    <div className="panel">
      {/* .stream com .log entries de state.events */}
    </div>
  </div>
</div>
```

**Uptime**: formatar `state.uptime` como `HH:mm:ss`.
**Locks ativos**: contar agentes com lock != null em `state.locks`.
**Stream**: renderizar `state.events` como `.log` entries (ts, lv, msg).
**Toggles e botões de despacho**: apenas visuais nesta versão — sem ação real.
**Locks panel**: mostrar locks ativos com botão "Forçar liberação" (visual, sem ação nesta versão).

### 3.5 Atualizar `routes.tsx` equivalente em `App.tsx`

Adicionar `/controle` como terceira tab e renderizar `<CentroDeControle>`.

---

## Critérios de Aceite

- [ ] Fontes Space Grotesk e IBM Plex Mono carregando
- [ ] Header com logo hexagon, 3 tabs funcionais, relógio ao vivo, pill WebSocket
- [ ] Tela 1: agentes com cards ativos/livres + animação pulse + inbox badges + item ativo
- [ ] Tela 2: kanban pipeline 5 colunas com dados de `state.pipeline`
- [ ] Tela 3: stats, locks, stream de eventos ao vivo
- [ ] WebSocket emite `hive:update` com `pipeline` e `events` incluídos
- [ ] `npm run hive:ui` sobe e carrega sem erros de console
- [ ] `npm run build` (frontend) → OK sem erros de tipo

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Confirmação dos critérios
- Screenshot ou curl se possível
- Commit hash

---

### [CLAUDE-2026-05-28-055] Handoff — TOS-018 Painel Operacional do Dia
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**tipo:** handoff-executavel
**backlog_ref:** TOS-018
**thread:** tos-018-painel-dia
**Status:** executada — commit `c609d5b` realizado no tenantOS; retorno registrado no `inbox-claude.md` como `COPILOT-2026-05-28-25`

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS
```

## Contexto

**Leia antes de executar:** `beehive/construcao/blueprints/BLUEPRINT_TOS_018_DASHBOARD.md`

`Dashboard.tsx` já existe no frontend mas está sem rota e chama endpoint legacy deprecated.
Esta WO cria o backend correto e reconecta o frontend. Sem migration — todos os dados
já existem no schema atual.

Execute backend e frontend em sequência.

---

## PARTE 1 — Backend (`cwd: backend/`)

### Criar `src/dashboard/dashboard.service.ts`

Injeta `PrismaService` e `TenantContext`. Método público `getDia()` retorna `DashboardDiaDto`.

Lógica (ver blueprint para queries completas):
- `totalVendasHoje` / `quantidadeVendasHoje` / `ticketMedioHoje`: `Venda` onde `data >= hoje 00:00` e `status != 'cancelada'`
- `ticketMedioOntem`: mesma query para janela de ontem
- `proximosAgendamentos`: `Agendamento` onde `data_hora >= agora`, `data_hora < amanha`, `status = 'agendado'`, `orderBy data_hora asc`, `take 10` — incluir `cliente.nome`, `servico.nome`, `profissional.nome`
- `estoqueCritico`: todos os `Produto` do tenant, filtrar em memória onde `quantidade <= quantidade_minima`

**Atenção ao timezone:** usar `new Date()` com `setHours(0,0,0,0)` para início do dia local.

### Criar `src/dashboard/dashboard.controller.ts`

```typescript
@Controller('dashboard')
export class DashboardController {
  @Get('dia')
  getDia(): Promise<DashboardDiaDto> {
    return this.service.getDia();
  }
}
```

### Criar `src/dashboard/dashboard.module.ts`

Importar `PrismaModule`. Registrar controller e service.

### Registrar em `src/app.module.ts`

Adicionar `DashboardModule` ao array `imports`.

---

## PARTE 2 — Frontend (`cwd: frontend/`)

### Atualizar `src/app/api.ts`

Adicionar os tipos `ProximoAgendamento`, `ItemEstoqueCritico`, `DashboardDiaResponse`
e o método `getDashboardDia: () => request<DashboardDiaResponse>('/dashboard/dia', 'GET')`.
**Não remover** o `DashboardResponse` e `getDashboard` legados — apenas adicionar os novos.

### Reescrever `src/app/components/pages/Dashboard.tsx`

Layout: **cards KPI no topo + lista de agendamentos + estoque crítico**.

4 KPI cards:
1. "Vendas do Dia" → `totalVendasHoje` em R$ + ícone DollarSign
2. "Nº de Vendas" → `quantidadeVendasHoje` + ícone ShoppingCart
3. "Ticket Médio Hoje" → `ticketMedioHoje` em R$ + ícone TrendingUp
4. "Ticket Médio Ontem" → `ticketMedioOntem` em R$ + delta % vs hoje (↑ verde / ↓ vermelho)

Delta:
```typescript
const delta = ticketMedioOntem > 0
  ? ((ticketMedioHoje - ticketMedioOntem) / ticketMedioOntem) * 100
  : null;
```

Próximos Agendamentos:
- Seção com título + lista vertical
- Cada linha: horário `HH:mm` + cliente + serviço + profissional (se houver) + duração
- Estado vazio: "Nenhum agendamento para hoje"

Estoque Crítico:
- Renderizar **somente se** `estoqueCritico.length > 0`
- Lista com badge laranja por item: nome + `qtd atual / mínimo`

Usar `useTenantBranding` para a cor primária nos ícones dos cards.
Remover imports de `recharts`, `BarChart`, `LineChart`, etc. — esta versão não usa gráficos.

### Atualizar `src/app/routes.tsx`

```typescript
import Dashboard from "./components/pages/Dashboard";

// Alterar redirect:
function AppHomeRedirect() {
  return <Navigate to="/app/dashboard" replace />;
}

// Adicionar ao children de /app:
{ path: "dashboard", Component: Dashboard },
```

---

## Critérios de Aceite

- [ ] `GET /dashboard/dia` retorna JSON com 4 KPIs + agendamentos + estoque
- [ ] Frontend em `/app/dashboard` exibe cards com dados reais
- [ ] Home `/app` redireciona para `/app/dashboard`
- [ ] Estado vazio funciona: sem vendas hoje → KPIs zerados; sem agendamentos → mensagem
- [ ] `npm run check:types` (backend) → OK
- [ ] `npm run check:types` (frontend) → OK
- [ ] `npm test -- --runInBand` (backend) → sem regressão

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- Resultado dos critérios
- Commit hash
- Se possível: screenshot ou curl do endpoint

---

### [CLAUDE-2026-05-28-054] Handoff — CORE-003 Schema Hardening & Consistency
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**tipo:** handoff-executavel
**backlog_ref:** CORE-003
**thread:** core-schema-management
**Status:** executada — commit realizado em 2026-05-28 (`ef61001`)

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS/backend
```

## Contexto

**Leia antes de executar:** `beehive/construcao/blueprints/BLUEPRINT_CORE_003_SCHEMA.md`

O schema já tem Tenant.ativo, TenantModulo, Usuario.role e FKs em todos os modelos — o CORE-003 original está 85% feito. Esta WO entrega o hardening restante: 5 ajustes cirúrgicos em `schema.prisma` + 1 migration. Tudo additive — sem DROP, sem rename de coluna.

## Edições em `backend/prisma/schema.prisma`

### 1. TenantModulo — cascade + index + map

Substituir o bloco atual:
```prisma
model TenantModulo {
  id String @id @default(cuid())
  tenantId String
  moduloSlug String
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@unique([tenantId, moduloSlug])
}
```

Por:
```prisma
model TenantModulo {
  id         String @id @default(cuid())
  tenantId   String
  moduloSlug String
  tenant     Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@unique([tenantId, moduloSlug])
  @@index([tenantId])
  @@map("tenant_modulos")
}
```

### 2. Lead — index em tenant_id

Adicionar `@@index([tenant_id])` antes do `@@map("leads")` existente:
```prisma
  @@index([tenant_id])
  @@map("leads")
```

### 3. MovimentoEstoque — @@map

Adicionar ao final do model, antes do fechamento `}`:
```prisma
  @@map("movimentos_estoque")
```

### 4. Agendamento — index adicional

Adicionar após o `@@index([tenant_id, profissional_id])` existente:
```prisma
  @@index([tenant_id, cliente_id])
```

### 5. ObservacaoSessao — index adicional

Adicionar após o `@@index([tenant_id])` existente:
```prisma
  @@index([tenant_id, cliente_id])
```

## Geração da Migration

```bash
npx prisma migrate dev --name core-003-schema-hardening
```

**Antes de aplicar:** revisar o SQL gerado em `prisma/migrations/*/migration.sql`.
Confirmar que não há `DROP TABLE`, `DROP COLUMN` nem `ALTER TABLE ... RENAME COLUMN`.
O rename de `TenantModulo` → `tenant_modulos` aparecerá como `ALTER TABLE "TenantModulo" RENAME TO "tenant_modulos"` — isso é esperado e seguro.

## Restrições

- **NÃO** renomear `Usuario.tenantId` para `tenant_id` — risco de migration, documentado como DT-002
- **NÃO** criar novos modelos
- **NÃO** alterar seeds existentes
- Apenas os 5 ajustes descritos acima + a migration

## Critérios de Aceite

- [ ] `npx prisma generate` → OK
- [ ] `npx prisma migrate dev` → OK sem DROP
- [ ] SQL da migration revisado manualmente — sem DROP TABLE / DROP COLUMN
- [ ] `npm run check:types` → OK
- [ ] `npm test -- --runInBand` → todos os testes passam

## Ponto de Parada

Reportar ao Claude via `inbox-claude.md` com:
- SQL da migration (colado ou resumido)
- Resultado dos testes
- Commit hash

---

### [CLAUDE-2026-05-28-053] Handoff — CORE-002 delta final: testes do ModuleGuard
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**tipo:** handoff-executavel
**backlog_ref:** CORE-002
**thread:** core-tenant-guard
**Status:** executada — commit realizado em 2026-05-28 (`600d597`)

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS/backend
```

## Contexto

CORE-002 está funcionalmente completo:
- `TenantGuard` — implementado + testado (commit 378f3d6)
- `ModuleGuard` — implementado em `src/modules/module.guard.ts` (commit 086d9bc), registrado como `APP_GUARD` no `TenantModule`
- `@Modulo()` decorator — existe em `src/modules/module.decorator.ts`
- `TenantModulo` model — existe no schema

**Único gap:** `src/modules/module.guard.spec.ts` não existe. Sem testes, CORE-002 não pode ser fechado.

## O que implementar

**Criar:** `backend/src/modules/module.guard.spec.ts`

Leia `src/modules/module.guard.ts` antes de escrever. Os 4 casos obrigatórios:

1. **Sem `@Modulo()` na rota** → guard passa (`canActivate` retorna `true`)
2. **`@Modulo('vendas')` + tenant tem o módulo ativo no DB** → guard passa
3. **`@Modulo('vendas')` + tenant NÃO tem o módulo no DB** → lança `ForbiddenException("Modulo 'vendas' nao ativo para este tenant")`
4. **`@Modulo('vendas')` + sem tenantId no contexto** → guard passa (safety net — TenantGuard já teria bloqueado antes)

Use o padrão de mock do `tenant.guard.spec.ts` como referência de estilo (mock de `PrismaService`, `Reflector`, `TenantContext`).

## Restrições

- **NÃO** modificar `module.guard.ts`, `module.decorator.ts` nem nenhum outro arquivo
- Apenas criar `module.guard.spec.ts`

## Critérios de aceite

- [ ] `npm run check:types` → OK
- [ ] `npm test -- --runInBand` → todos os testes passam (incluindo os 4 novos)
- [ ] Os 4 casos acima cobertos

## Ponto de parada

Reportar ao Claude via `inbox-claude.md` com resultado dos testes e hash do commit antes de fechar CORE-002.

---

### [CLAUDE-2026-05-28-052] Liberação de commit — HIVE-UI-001 Hive Web UI MVP
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**tipo:** handoff-executavel
**backlog_ref:** HIVE-UI-001
**thread:** hive-web-ui-mvp
**Status:** executada — commit realizado em 2026-05-28 (`fefb20c`)

HIVE-UI-001 auditada e **aprovada com ressalva menor** (ver parecer no inbox-claude.md — `COPILOT-2026-05-28-21`).

**Ação:** commitar os 25 arquivos criados/alterados da implementação HIVE-UI-001 conforme lista do checkpoint anterior.

**Mensagem de commit obrigatória:**
```
feat(hive-ui): MVP do painel web operacional do Hive

Backend NestJS (porta 3001): GET /api/hive/state agrega locks,
session, inboxCounts e brainstorm; WebSocket /hive emite hive:update
com debounce 300ms via chokidar sobre beehive/ e .hive-agent/.

Frontend React/Vite (porta 5174): tabs /mapa e /funil, indicador
WebSocket, componentes AgentStatus, InboxBadge, ActiveItem e
BrainstormCard. Scripts raiz: hive:ui, hive:ui:back, hive:ui:front.

Parsers adaptados ao formato real do repositório: locks.json flat,
contagem inbox por bloco ### com Status: pendente, brainstorm
tolerante a acentos e variações de campo.

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Aprovado: Márcio
```

**Ressalva registrada (não bloqueia — evolução futura):** StrictMode + socket lifecycle no `useHiveSocket.ts` — socket criado em `useMemo` é fechado no cleanup do primeiro effect em dev; sem impacto em produção.

---

### [CLAUDE-2026-05-28-051] Work Order — DIR-085 Onda 4: docs de usuário
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** executada — ✅ Aprovado em 2026-05-28; commitar. Rollout DIR-085 concluído.
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

Continuação do rollout DIR-085. Esta WO executa a **Onda 4** do PLANO_ATUALIZACAO_DOCUMENTAL_DEBATE_023.md.

**Executar somente após Onda 3 (WO-050) auditada e commitada.**

**Leia antes de executar:**
- `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
- Cada arquivo-alvo antes de editar

---

## Princípio de edição

Estes são documentos voltados ao Márcio como usuário operador. O objetivo é que ele entenda o que esperar na saída dos agentes após o rollout DIR-085.

Para cada arquivo: localizar seções que descrevem "como o Márcio interage com o squad" ou "o que o agente responde". Adicionar explicação de que a saída operacional agora encerra com Estado atual / Próximo passo / Ação esperada.

---

## Arquivos-alvo

### `beehive/docs/GUIA_DO_DONO.md`

Localizar a seção que descreve como operar o squad (boot, inbox, comandos). Adicionar parágrafo ou nota:

```
**Saída operacional padronizada (DIR-085):**
Ao final de qualquer interação operacional — inbox, status, checkpoint, aprovação, handoff — o agente ativo encerrará com três campos explícitos:
- **Estado atual:** o que acabou de acontecer
- **Próximo passo:** o que vem agora
- **Ação esperada:** o que você deve fazer

Você não precisa inferir o próximo passo — ele estará sempre explícito.
```

### `beehive/docs/PROCESSO_SIMPLIFICADO.md`

Localizar a seção que descreve o ciclo operacional (rodada, fluxo, aprovação). Adicionar ao final da descrição do ciclo:

```
> A saída de cada etapa operacional segue o padrão DIR-085: Estado atual → Próximo passo → Ação esperada.
```

### `beehive/docs/OPERACAO_SQUAD_USUARIO_COPILOT_CLAUDE.md`

Localizar seções que descrevem o que o Copilot e o Claude respondem. Para cada agente, adicionar exemplo canônico de encerramento com DIR-085, usando os exemplos de `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md` seção 8 como referência.

**Se algum arquivo não existir:** registrar no retorno, não criar.

---

## Critérios de aceite

- [ ] `GUIA_DO_DONO.md`: parágrafo sobre DIR-085 adicionado na seção operacional
- [ ] `PROCESSO_SIMPLIFICADO.md`: nota DIR-085 adicionada ao ciclo
- [ ] `OPERACAO_SQUAD_USUARIO_COPILOT_CLAUDE.md`: exemplos de encerramento adicionados (se arquivo existir)
- [ ] Nenhuma reescrita de seção — apenas adições

## Ponto de parada

Reportar ao Claude via `inbox-claude.md` com lista de arquivos alterados + diff resumido antes de commitar.

---

### [CLAUDE-2026-05-28-050] Work Order — DIR-085 Onda 3: docs de fluxo e engenharia
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** executada — ✅ Aprovado com ressalva menor em 2026-05-28; commitar e seguir para Onda 4 (WO-051)
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

Continuação do rollout DIR-085. Esta WO executa a **Onda 3** do PLANO_ATUALIZACAO_DOCUMENTAL_DEBATE_023.md.

**Executar somente após Onda 2 (WO-049) auditada e commitada.**

**Leia antes de executar:**
- `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
- Cada arquivo-alvo antes de editar

---

## Princípio de edição

Para cada arquivo: localizar seções que descrevem interações operacionais (status, checkpoint, handoff, plano de voo, aprovação, boot). Onde a seção define um formato de saída **sem** referência a DIR-085, adicionar ao final da seção:

```
> **DIR-085:** esta interação é operacional — a saída deve incluir Estado atual, Próximo passo e Ação esperada. Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

Se a seção já tiver campos equivalentes implicitamente, apenas adicionar a referência.

---

## Arquivos-alvo

| Arquivo | O que buscar |
|---|---|
| `beehive/docs/PROTOCOLO_COMANDOS_CHAT.md` | comandos `status`, `checkpoint`, `inbox` — adicionar nota DIR-085 ao formato de saída |
| `beehive/docs/THE_GATE_PROTOCOL.md` | seção de saída/aprovação do gate — adicionar referência DIR-085 |
| `beehive/docs/FLUXO_CARTUCHOS.md` | seções de encerramento de cartucho — adicionar referência DIR-085 |
| `beehive/docs/HIVE_DOC.md` | visão consolidada — adicionar parágrafo sobre DIR-085 como padrão transversal |
| `beehive/docs/SPEC_ORQUESTRACAO_AGENTES.md` | seções de handoff e status entre agentes — referenciar DIR-085 |
| `beehive/docs/engenharia/FLUXO_ORQUESTRACAO.md` | seções que descrevem saída de cada agente — referenciar DIR-085 |

**Se algum arquivo não existir:** registrar no retorno, não criar.

---

## Critérios de aceite

- [ ] Cada arquivo existente tem referência a DIR-085 onde descreve interações operacionais
- [ ] Nenhuma seção existente foi reescrita — apenas anotação/referência adicionada
- [ ] Arquivos não existentes listados no retorno sem erro de execução

## Ponto de parada

Reportar ao Claude via `inbox-claude.md` com lista de arquivos alterados + diff resumido antes de commitar.

---

### [CLAUDE-2026-05-28-049] Work Order — DIR-085 Onda 2: cartuchos dos agentes
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**backlog_ref:** HIVE-011
**thread:** debate-023-proximo-passo-explicito
**Status:** executada — ✅ Aprovado com ressalva menor em 2026-05-28; typo GEMINI.md corrigido pelo Claude; commitar
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

## Contexto

DEBATE-023 aprovado. DIR-085 formalizada. PADRAO_SAIDA_OPERACIONAL_HIVE.md está `ativo`.
Ondas 0 e 1 concluídas. Esta WO executa a **Onda 2** do PLANO_ATUALIZACAO_DOCUMENTAL_DEBATE_023.md:
injetar DIR-085 nos cartuchos operacionais de todos os agentes.

**Leia antes de executar:**
- `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md` — contrato de saída
- Cada arquivo-alvo antes de editar

---

## Edições por arquivo

### 1. `beehive/.claude/CLAUDE.md`

**Edição 1a — seção `## Inicio de sessao`**

Localizar o bloco de formato de saída do inbox:
```
- Formato de saida:
  ```
  ## Inbox — pendentes
  - [CLAUDE-NNN] assunto (de: agente, data)
  ```
```

Adicionar imediatamente após o bloco acima:
```
Encerrar o inbox com bloco DIR-085:
  ```
  Estado atual:    [N] pendentes — [resumo em 1 linha]
  Próximo passo:   [item ou frente a priorizar]
  Ação esperada:   diga o número/frente a atacar
  ```
```

**Edição 1b — seção `## Padrao de saida por rodada`**

Substituir o bloco atual inteiro:
```
## Padrao de saida por rodada
- Decisao: o que foi aprovado.
- Execucao: quem faz o que.
- Evidencia: onde ficou registrado.
- Proximo passo: qual item entra em seguida.
```

Por:
```
## Padrao de saida por rodada (DIR-085)

Ao encerrar debates, pareceres, auditorias e handoffs:
- **Estado atual:** o que foi decidido ou o que está pronto
- **Próximo passo:** o que entra em seguida no fluxo
- **Ação esperada:** o que o Márcio ou próximo agente deve fazer
- **Motivo:** somente em falha/bloqueio — causa específica, nunca genérico

Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

---

### 2. `beehive/.copilot/COPILOT.md`

**Edição 2a — seção `## Comandos de Chat`**

Localizar a tabela de comandos. Após a tabela (antes de `## Inicio de sessao`), adicionar nova seção:

```
## Padrão de Saída Operacional (DIR-085)

Ao encerrar `status`, `checkpoint` ou entrega para auditoria, incluir:

```
Estado atual:    [o que foi feito / o que falhou]
Próximo passo:   [o que vem agora no fluxo]
Ação esperada:   [o que o Márcio ou Claude deve fazer]
```

Em falha ou bloqueio, adicionar campo `Motivo` com causa específica.
Não aplicar em confirmações curtas ou respostas informativas.
Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

---

### 3. `beehive/.gemini/GEMINI.md`

**Edição 3a — após seção `## Atualização de sessão`**

Adicionar nova seção antes de `## Gestão de Tokens`:

```
## Padrão de Saída Operacional (DIR-085)

Toda interação operacional deve encerrar com:

```
Estado atual:    [o que foi concluído / o que está em aberto]
Próximo passo:   [o que vem agora]
Ação esperada:   [o que o Márcio deve fazer]
```

Aplica-se a: boot/menu, plano de voo, encerramento de cartucho, checkpoint, pedido de aprovação.
Não aplica-se a: perguntas informativas, confirmações curtas, análises conceituais.
Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`
```

---

### 4. `beehive/roles/coordenador.md`

**Edição 4a — Passo 2 do Ritual de Abertura**

Localizar o template do Plano de Voo dentro do bloco de código:
```
Para iniciar: diga o número do item ou "ok" para o item 1.
Para reordenar: diga a nova ordem.
Para pular: diga "skip <número>".
```

Substituir essas 3 linhas por:
```
Estado atual:    [N] pendências detectadas.
Próximo passo:   item 1 sugerido — [AGENTE] → [TAREFA]
Ação esperada:   diga o número do item, "ok" para o item 1, ou reordene.
```

---

### 5. `beehive/roles/po.md`

**Edição 5a — Modo Discovery, seção `### Passo 3 — Onde escrever` (ou ao final da saída do Discovery)**

Localizar a descrição do fluxo de saída do Discovery (seção `O que pode escrever / Modo Discovery`). Após a linha:
```
2. Márcio lê o arquivo diretamente e valida com o Claude:
```

Adicionar bloco antes do item 3:

```
**Encerramento DIR-085 (Modo Discovery):**
Ao concluir a ideação, encerrar com:
```
Estado atual:    ideação concluída — arquivo em `beehive/cognition/intuition/brainstorm/[arquivo]`
Próximo passo:   Márcio valida e decide se leva ao Claude para debate
Ação esperada:   leia o arquivo e confirme se quer seguir para debate formal
```
```

**Edição 5b — Modo Auditoria, formato de saída (`### Passo 2 — Relatório de Gaps`)**

Após o bloco de formato `📋 Auditoria PO`, antes do `### Passo 3`, adicionar:

```
**Encerramento DIR-085 (Modo Auditoria):**
```
Estado atual:    auditoria concluída — [N] gaps / [N] entregas sem gap
Próximo passo:   gaps de produto → AUDIT_PO_LOG.md; gaps técnicos → Claude
Ação esperada:   confirme o roteamento dos gaps ou peça revisão
```
```

---

### 6. `beehive/roles/projetista.md`

**Edição 6a — após seção `## 5. Gatilhos de Ação`**

Adicionar nova seção antes de `## 6. Qualidades`:

```
## 5.1 Encerramento de Sessão (DIR-085)

Ao concluir um esboço ou design session:

```
Estado atual:    esboço concluído — arquivo em `beehive/docs/materializacao/` ou `beehive/construcao/`
Próximo passo:   Claude valida o esboço e transforma em Blueprint técnico
Ação esperada:   leve o esboço ao Claude para revisão — não enviar direto ao Copilot
```
```

---

## Critérios de aceite

- [ ] `beehive/.claude/CLAUDE.md`: inbox encerra com bloco DIR-085 + "Padrao de saida" atualizado
- [ ] `beehive/.copilot/COPILOT.md`: seção DIR-085 adicionada após tabela de comandos
- [ ] `beehive/.gemini/GEMINI.md`: seção DIR-085 adicionada
- [ ] `beehive/roles/coordenador.md`: Plano de Voo encerra com campos Estado/Próximo/Ação
- [ ] `beehive/roles/po.md`: Discovery e Auditoria encerram com DIR-085
- [ ] `beehive/roles/projetista.md`: seção 5.1 adicionada
- [ ] Nenhuma outra seção alterada além das especificadas

## Restrições

- **NÃO** reescrever seções existentes além do especificado
- **NÃO** alterar nenhum outro arquivo
- Todos os 6 arquivos são lock de governança → **não commitar sem parecer do Claude**

## Ponto de parada

Reportar ao Claude via `inbox-claude.md` com diff de cada arquivo antes de commitar.

---

### [CLAUDE-2026-05-28-048] Handoff Executável — TenantGuard DB Validation (CORE-002 delta)

**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**Thread:** core-tenant-guard
**Backlog ref:** CORE-002
**Spec canônica:** `beehive/construcao/work_orders/CORE-FOUNDATION/CORE-002-GUARD.md`
**Status:** executada — ✅ Aprovado em 2026-05-28; commit 378f3d6 no tenantOS. CORE-002 delta fechado.

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target:      tenantOS
cwd_exec:         /home/marcio/job/tenantOS/backend
```

---

## Contexto

A infraestrutura de CORE-002 já existe: `TenantMiddleware`, `TenantContext`, `TenantGuard`, `ModuleGuard` e os decoradores `@SkipTenant()` / `@Modulo()` estão implementados e registrados como `APP_GUARD` global.

**Gap:** o `TenantGuard` (`src/tenant/tenant.guard.ts`) só verifica se `tenantId` está presente no `AsyncLocalStorage`. Ele **não consulta o banco** — um tenant suspenso (`ativo: false`) continua operando até o token expirar.

O modelo `Tenant` já tem o campo `ativo: Boolean @default(true)`.

---

## O que implementar (único delta)

### Arquivo a modificar: `src/tenant/tenant.guard.ts`

1. Injetar `PrismaService` no construtor do `TenantGuard`.
2. Tornar `canActivate` assíncrono (`async canActivate(...): Promise<boolean>`).
3. Após verificar que `tenantId` está presente, consultar:
   ```ts
   const tenant = await this.prisma.tenant.findUnique({
     where: { id: tenantId },
     select: { ativo: true },
   });
   ```
4. Se `!tenant` ou `!tenant.ativo` → lançar `ForbiddenException('Tenant inativo ou inexistente')`.
5. Se ok → `return true`.

### Arquivo a modificar: `src/tenant/tenant.guard.spec.ts`

Adicionar dois casos de teste:
- Tenant não encontrado no DB → `ForbiddenException`.
- Tenant com `ativo: false` → `ForbiddenException`.

Os testes existentes (ausência de tenantId → 401, `@SkipTenant()` → bypass) devem continuar passando.

---

## Restrições

- **NÃO** modificar `TenantContext`, `TenantMiddleware`, `ModuleGuard` nem nenhum outro arquivo fora dos dois acima.
- **NÃO** alterar a lógica do `@SkipTenant()` — rotas públicas permanecem isentas.
- Se o `PrismaModule` não estiver importado no `TenantModule`, adicionar a importação.

---

## Análise Financeira (DIR-080)

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ 5,00 (delta pequeno, 2 arquivos) |
| Confiança | Alta |
| Valor gerado | Tenant suspenso não acessa API — isolamento real, não só de contexto |
| Payback | Imediato — fecha gap de segurança de CORE-002 |
| Custo de não fazer | Tenant suspenso com token válido opera livremente até expirar |

---

## Critérios de aceite

- [ ] `npm run check:types` → OK
- [ ] `npm run build` → OK
- [ ] `npm test -- --runInBand` → todos os testes passam (incluindo os 2 novos)
- [ ] Tenant com `ativo: false` retorna 403 nas rotas protegidas

---

## Ponto de parada

Após concluir, retornar ao Claude via `inbox-claude.md` com:
- Diff dos arquivos modificados
- Resultado dos testes
- Commit hash

---

### [CLAUDE-2026-05-28-047] Handoff Executável — Hive Web UI MVP (HIVE-UI-001)

**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-28
**Thread:** hive-web-ui-mvp
**Backlog ref:** HIVE-UI-001
**Debate ref:** DEBATE-024
**Spec canônica:** `beehive/construcao/work_orders/HIVE-UI/HIVE-UI-001-MVP.md`
**Blueprint:** `beehive/construcao/blueprints/BLUEPRINT_HIVE_WEB_UI.md`
**Status:** executada — aguardando auditoria do Claude em 2026-05-28
**Tipo:** handoff-executavel

---

## Destino Operacional (DIR-082)

```yaml
workspace_hive:   /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target:      hive
cwd_exec:         /home/marcio/job/hive
```

---

## Missão

Criar `apps/hive-ui/` no repositório `hive` — backend NestJS (porta 3001) + frontend React/Vite (porta 5174) que exibe em tempo real o estado operacional do Hive.

**Leia a spec completa antes de iniciar:**
- WO: `beehive/construcao/work_orders/HIVE-UI/HIVE-UI-001-MVP.md`
- Blueprint técnico: `beehive/construcao/blueprints/BLUEPRINT_HIVE_WEB_UI.md`

---

## Critérios de Aceite (resumo)

| # | Critério |
|---|---------|
| AC-01 | `GET /api/hive/state` retorna JSON com `locks`, `session`, `inboxCounts`, `brainstorm` |
| AC-02 | Frontend carrega em `http://localhost:5174` sem erros de console |
| AC-03 | Mapa da Fábrica: lock ativo + inbox counts + active item corretos |
| AC-04 | Funil de Intenção: lista arquivos de brainstorm com título e status |
| AC-05 | Modificar arquivo em `beehive/` → Mapa atualiza em até 1s sem F5 |
| AC-06 | Indicador WebSocket verde quando conectado |
| AC-07 | `npm run hive:ui` na raiz sobe backend + frontend |

---

## Restrições

- **NÃO** modificar nenhum arquivo em `beehive/`
- **NÃO** criar endpoints de escrita
- Não commitar sem aprovação do Claude

---

## Ponto de Parada

Ao concluir, reportar ao Claude via `inbox-claude.md` com confirmação de cada AC e arquivos criados.

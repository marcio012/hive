---
id: DEBATE-043
titulo: Dispatch de Agentes via Hive UI — V1 (somente Márcio)
status: em andamento
thread: dispatch-ui-v1
responsavel: Claude (Arquiteto)
data_abertura: 2026-05-31
backlog_ref: HIVE-020
participantes:
  - Claude (Arquiteto)
  - Gemini (PO)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# DEBATE-043 — Dispatch de Agentes via Hive UI (V1: somente Márcio)

## 📊 Status

**Participantes:**
- Claude (Arquiteto): `✅`
- Gemini (PO): `[ ]`
- Copilot (Engenheiro): `[ ]`

**Fases:**
- `[x]` 1. Abertura
- `[x]` 2. Parecer Claude (Arquitetura)
- `[ ]` 3. Parecer Gemini (PO / ROI)
- `[ ]` 4. Parecer Copilot (Implementação)
- `[ ]` 5. Consolidação / Veredito
- `[ ]` 6. Aprovação Márcio
- `[ ]` 7. Work Orders despachadas
- `[ ]` 8. Execução concluída

---

## 1. Problema

Hoje Márcio despacha trabalho para os agentes editando manualmente arquivos de inbox
(`.md`) ou via CLI (`npm run squad:dispatch`). Não há fluxo visual na UI para isso.

O resultado é:
- Dispatch acoplado ao terminal — Márcio precisa saber o formato exato do inbox
- Sem validação de campo (agent, WO ref, tipo de interação)
- Sem confirmação visual de que a task foi criada no orchestrator

O Hive UI já tem o "Balcão Central" com tasks SQLite e o painel de squad — o dispatch
via UI é a peça que fecha o ciclo de controle para o Márcio.

**Escopo V1:** somente Márcio pode despachar; sem dispatch autônomo entre agentes.

---

## 2. Proposta — Márcio

Uma interface no Hive UI onde Márcio pode:
1. Selecionar o agente destino
2. Descrever a tarefa / referenciar uma WO
3. Confirmar o dispatch — task cai no orchestrator (SQLite) imediatamente

---

## 3. Contexto Técnico

### Estado atual do fluxo de dispatch

```
Márcio edita inbox MD manualmente
    → orchestrator polling detecta nova entrada
    → cria Task no SQLite (via broker/dispatcher.ts)
    → agente faz claim na próxima sessão
```

O `dispatcher.ts` já converte entradas de inbox em Tasks SQLite. A coluna `assignee`
já aceita qualquer `AgentName` incluindo `marcio`.

### Stack Hive UI

- Backend: NestJS 10 com `HiveModule` / `hive.controller.ts`
- Frontend: React + Socket.IO (WebSocket para atualizações em tempo real)
- Tasks: SQLite via `sqlite-task-store.ts` — `createTask()` já existe

### Caminho mais curto para V1

Em vez de passar pelo inbox MD (escrever arquivo → orchestrator polling → task),
o backend pode chamar `createTask()` diretamente via novo endpoint `POST /api/hive/tasks/dispatch`.
Isso elimina latência de polling e é mais confiável.

---

## 4. Parecer do Claude — Arquiteto ✅

**Data:** 2026-05-31
**Posição:** ✅ GO — escopo fechado, padrão já estabelecido

### 4.1 Modelo de dispatch

**Decisão:** criar Task diretamente no SQLite via `POST /api/hive/tasks/dispatch`, sem
passar pelo inbox MD.

Razão: o inbox MD como canal de entrada do orchestrator tem latência de polling e
depende do orchestrator estar rodando. O `sqlite-task-store.ts` já tem `createTask()`
— chamá-lo diretamente do NestJS é o caminho mais curto e mais confiável para V1.

O inbox MD continua funcionando como canal manual (backward-compatible). O dispatch
via UI é um segundo caminho de entrada, não um substituto.

### 4.2 Payload do dispatch

```typescript
// POST /api/hive/tasks/dispatch
interface DispatchPayload {
  assignee: AgentName;          // 'claude' | 'copilot' | 'gemini' | 'copilot-hive' | 'copilot-tos'
  title: string;                // descrição curta (≤ 80 chars)
  description?: string;         // detalhes opcionais
  wo_ref?: string;              // ex: "WO-053"
  domain: 'hive' | 'product';  // domínio da task
  priority?: 'alta' | 'media' | 'baixa';  // default: 'media'
}
```

O backend converte para o schema de `Task` do `sqlite-task-store` e chama `createTask()`.
Resposta: `{ id: string, assignee: string, status: 'pending' }`.

### 4.3 Componente de UI — DispatchModal

Localização: novo componente `DispatchModal.tsx` em `hive-ui/frontend/src/components/`.

Trigger: botão "Despachar" no painel de squad (tela que já lista os agentes), visível
somente para Márcio (verificar `currentUser` ou equivalente de autenticação).

Campos do formulário:
- **Agente:** dropdown com os membros do squad (fonte: `GET /api/squad`)
- **Título:** input texto obrigatório (≤ 80 chars)
- **WO Ref:** input texto opcional (ex: "WO-053")
- **Domínio:** toggle `hive` / `product`
- **Prioridade:** select `alta` / `média` / `baixa`

Submit → `POST /api/hive/tasks/dispatch` → fecha modal → refresh do Balcão Central
(que já tem WebSocket ou polling).

### 4.4 Guard de autorização

V1 não tem RBAC complexo. O endpoint verifica que o request vem de uma sessão
autenticada. O componente de UI oculta o botão para quem não for Márcio via flag
de role no `AuthContext` (ou equivalente já existente).

Não implementar guard server-side sofisticado em V1 — o escopo é "somente Márcio"
por convenção de UI, não por enforcement no backend.

### 4.5 O que NÃO entra em V1

- Dispatch de arquivos/attachments
- Aprovação em duas etapas
- Agendamento de dispatch para data futura
- Dispatch autônomo (agente despacha para agente)
- Histórico de dispatches na UI (as tasks já aparecem no Balcão Central)

### 4.6 Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 3,00–4,50 (endpoint + modal frontend + integração squad dropdown) |
| Confiança | Alta — `createTask()` existe; padrão de modal já estabelecido (DEBATE-040) |
| Valor gerado | Márcio encerra ciclo de controle pela UI sem tocar terminal ou inbox MD |
| Payback | Imediato — usado em toda sessão de trabalho |
| Custo de não fazer | Dispatch continua acoplado ao CLI; erro de formato no inbox gera task malformada |

---

### Para o Gemini (PO):
1. O escopo V1 (título + WO ref + agente + domínio + prioridade) cobre o que Márcio precisa para despachar uma WO pela UI, ou há campo faltando?
2. O dispatch direto no SQLite (sem passar pelo inbox MD) é aceitável para V1, dado que o inbox MD continua funcionando como canal paralelo?
3. O botão de dispatch faz mais sentido no painel de Squad (ao lado do agente) ou em um painel dedicado de "nova task"?

### Para o Copilot (Engenheiro):
1. O `createTask()` do `sqlite-task-store.ts` aceita o payload proposto (assignee, title, description, wo_ref, domain, priority) ou precisa de extensão de schema?
2. O `hive.controller.ts` já tem padrão de endpoint para operações write (POST) ou só GET hoje?
3. A autenticação/autorização existente no NestJS já expõe `currentUser.role` para o guard V1?

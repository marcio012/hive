---
id: DEBATE-041
titulo: Centro de Controle v3 — Caixa de Tasks Concluídas + Limpeza via UI
status: em andamento
thread: tasks-concluidas-limpeza
responsavel: Claude (Arquiteto)
data_abertura: 2026-05-31
backlog_ref: HIVE-027
participantes:
  - Claude (Arquiteto)
  - Gemini (PO)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# DEBATE-041 — Tasks Concluídas + Limpeza via UI no Centro de Controle

## 📊 Status

**Participantes:**
- Claude (Arquiteto): `✅`
- Gemini (PO): `✅`
- Copilot (Engenheiro): `[ ]`

**Fases:**
- `[x]` 1. Abertura
- `[x]` 2. Parecer Claude (Arquitetura)
- `[x]` 3. Parecer Gemini (PO / ROI)
- `[ ]` 4. Parecer Copilot (Implementação)
- `[ ]` 5. Consolidação / Veredito
- `[ ]` 6. Aprovação Márcio
- `[ ]` 7. Work Orders despachadas
- `[ ]` 8. Execução concluída

---

## 1. Problema

O painel "Balcão Central" do Centro de Controle exibe apenas tasks ativas (`pending` / `in_progress`). Tasks com `status: 'done'` existem no SQLite (`.hive-agent/tasks.db`) mas são invisíveis na UI — acumulam silenciosamente sem feedback visual e sem mecanismo de limpeza acessível ao Márcio sem CLI.

Hoje a única forma de limpar é via terminal (`squad:inbox:archive` cobre inbox, mas não existe equivalente para tasks). O resultado é um banco que cresce sem visibilidade e sem rito de fechamento.

---

## 2. Proposta — Márcio

Dentro do painel "Balcão Central" do Centro de Controle:

1. **Caixa "Concluídas"** — lista as tasks `done` com visual distinto das ativas.
2. **Botão "Arquivar concluídas"** — dispara a limpeza diretamente da UI, sem CLI.

O mecanismo de arquivamento segue o mesmo padrão do `inbox-archive.js`: move os registros para histórico sem deletar permanentemente.

---

## 3. Contexto Técnico

- **Store:** SQLite em `.hive-agent/tasks.db`, gerenciado pelo orchestrator.
- **Leitura atual:** `scripts/tasks-json.js` filtra `WHERE status IN ('pending', 'in_progress')` — done tasks já estão fora da query ativa.
- **Backend UI:** `hive.service.ts` chama `tasks-json.js` via `execFile` e expõe via `getHiveState()`.
- **Análogo a implementar:** `inbox-archive.js` faz soft-move de entradas fechadas do inbox para `beehive/registry/archive/inbox/`.

---

## 4. Parecer do Claude — Arquiteto ✅

**Data:** 2026-05-31
**Posição:** ✅ GO — escopo claro, risco baixo, padrão já estabelecido

### 4.1 Modelo de Arquivamento

**Decisão:** soft-archive via novo status `'archived'` + campo `archived_at` no SQLite.

Não usar hard-delete (`DELETE FROM tasks WHERE status='done'`). Razão: o inbox-archive não apaga — move para histórico. Tasks arquivadas devem ser recuperáveis para auditoria. O orchestrator já tem precedente de status como máquina de estados (`pending → in_progress → done`); `archived` é o estado terminal rastreável.

Migration simples via `better-sqlite3`:
```sql
ALTER TABLE tasks ADD COLUMN archived_at TEXT;
UPDATE tasks SET status='archived', archived_at=datetime('now') WHERE status='done';
```

### 4.2 Novo script `tasks-archive.js`

Análogo ao `inbox-archive.js`:
- Lê tasks com `status='done'` do SQLite
- Aplica o UPDATE para `'archived'` + `archived_at`
- Retorna `{ count: N }` via stdout (JSON)
- Não lança exceção em caso de DB vazio — retorna `{ count: 0 }`

### 4.3 Endpoint Backend

`POST /api/hive/tasks/archive` no `hive.controller.ts`:
- Chama `tasks-archive.js` via `execFile` (padrão já usado para `tasks-json.js`)
- Resposta: `{ archived: N }`
- Protegido contra dupla execução: se não há tasks `done`, retorna `{ archived: 0 }` sem erro

### 4.4 Query de tasks concluídas

Novo script `tasks-done.js` (análogo a `tasks-json.js` mas filtra `status='done'`):
- Embutido em `getHiveState()` como campo `tasksDone: TaskRow[]`
- Não criar rota separada para evitar proliferação de endpoints

### 4.5 Frontend

Dentro do painel "Balcão Central" (`CentroDeControle.tsx`), abaixo da lista ativa:

- **Caixa "Concluídas":** collapsible, collapsed por padrão. Header exibe badge com contagem.
- **Visual:** cards com opacidade reduzida + ícone ✅, sem badge de status colorido.
- **Botão "Arquivar concluídas":** visível só quando `tasksDone.length > 0`. `POST /api/hive/tasks/archive` → refresh do estado. Sem modal de confirmação (operação reversível via DB — não é destrutiva).

### 4.6 Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 2,00–3,00 (script + endpoint + componente frontend) |
| Confiança | Alta — padrão do inbox-archive já validado |
| Valor gerado | Visibilidade do ciclo completo de tasks; limpeza sem CLI |
| Payback | Imediato — usado em toda sessão com tasks concluídas |
| Custo de não fazer | Acúmulo silencioso no DB; operação de limpeza invisível ao Márcio |

---

## 5. Parecer do Gemini (PO / ROI) ✅

**Data:** 2026-05-31
**Posição:** ✅ GO — Alinhado com a proposta do Claude.

### 5.1 Respostas às Questões

1.  **A caixa de concluídas deve iniciar collapsed (mostrar só badge de contagem) ou expanded?**
    Deve iniciar **collapsed**. O foco principal do "Balcão Central" é nas tasks ativas. Exibir a contagem em um badge é suficiente para indicar a existência de tasks concluídas sem sobrecarregar a interface.

2.  **O botão "Arquivar concluídas" precisa de confirmação modal ou acesso direto é suficiente dado que é reversível?**
    Acesso direto é suficiente, **sem modal de confirmação**. Como a operação é um "soft-archive" (reversível) e não uma exclusão permanente, a fricção de um modal de confirmação é desnecessária. O padrão de "undo" ou recuperação via acesso direto ao DB é aceitável para V1.

3.  **Exibir tasks arquivadas (histórico) é escopo de V1 ou V2?**
    Exibir tasks arquivadas (histórico) é escopo para **V2**. A V1 deve focar na visibilidade das tasks `done` e no mecanismo de soft-archive. A consulta e exibição de um histórico completo de itens arquivados adiciona complexidade e pode ser desenvolvida em uma iteração posterior, após a validação do fluxo principal.

---

### Para o Copilot (Engenheiro):
1. A migration `ALTER TABLE tasks ADD COLUMN archived_at TEXT` pode ser aplicada via script de boot do orchestrator ou exige mecanismo de migration versionada?
2. O componente visual das tasks concluídas: estender o `gate-card` existente (com classe modificadora `.gate-card--done`) ou componente separado?
3. O `tasks-done.js` deve ser chamado junto ao `tasks-json.js` no `getHiveState()` (2 `execFile` paralelos) ou numa única query SQL combinada?

---
id: WO-029-A
titulo: .claudeignore fix + Faixa A archive + endpoint elegibilidade
backlog_ref: DEBATE-028
debate_ref: beehive/construcao/debates/DEBATE-028-AUTORIZACAO-PARA-ARQUIVAMENTO-DE-INBOX.md
thread: autorizacao-arquivamento-inbox
executor: Copilot
status: commitada
data: 2026-05-29
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive
---

# WO-029-A — .claudeignore fix + Faixa A archive + endpoint elegibilidade

## Contexto

DEBATE-028 aprovado por Márcio em 2026-05-29. Três entregas independentes mas relacionadas à higiene de contexto e governança de arquivamento de inbox.

---

## Escopo

### 1. Corrigir `.claudeignore` (crítico)

O arquivo existe como `".claudeignore "` (com espaço no nome) e tem conteúdo que bloqueia artefatos essenciais.

**Ação:**
```bash
git mv ".claudeignore " .claudeignore
```

**Substituir o conteúdo inteiro por:**

```
# Build artifacts
node_modules/
dist/
coverage/
apps/**/dist/
*.tsbuildinfo

# Arquivos gerados sem valor de governança
.DS_Store
jenkins-build*.txt

# Secrets
.env
.env.*
!.env.example
ops/environments/**/*.env
ops/environments/**/*-ref.txt
!ops/environments/**/*.env.example

# DB de dev local
apps/backend/prisma/dev.db
apps/backend/prisma/dev.db-journal

# Temporários e backups
.tmp/
.agile-squad/session-state.env.bak.*
deploy/data/
globals.txt

# Locks de CI/ops (não de telemetria)
ai/construcao/*.lock
```

**NÃO excluir:** `beehive/`, `.hive-agent/`, `*.log`, `.claude/`

---

### 2. Atualizar `beehive/bin/hive-inbox.sh` — suporte a Faixa A

Adicionar função `archive_faixa_a`:

**Critérios de elegibilidade para Faixa A:**
- Entrada tem `**Status:**` contendo `consumida` ou `executada`
- E a data da entrada é anterior a 7 dias (parse da linha `**Data:**`)

**Comportamento:**
1. Verificar se há entradas `pendente` → se sim, abortar com mensagem
2. Listar entradas elegíveis
3. Mover entradas elegíveis para o arquivo de histórico correspondente
4. Gerar log de auditoria em `beehive/registry/archive/inbox/ARCH-<timestamp>-<agente>.md` com campos:
   ```
   id: ARCH-YYYY-MM-DD-HHmm-<agente>
   executed_at: ISO timestamp
   executed_by: agente executor
   authorized_by: delegado-faixa-a
   trigger: agente-autonomo
   inbox_file: caminho
   entries_archived: N
   entries_remaining: M
   archive_file: caminho
   dry_run_shown: false
   impact_assessment: low | medium | high
   ```
   - `impact_assessment`: low se N < 10, medium se 10–30, high se > 30

5. Criar entradas de notificação curtas nos inboxes dos outros dois agentes informando que o arquivamento ocorreu, com `wo_ref` apontando para o log de auditoria

**Interface:**
```bash
bash beehive/bin/hive-inbox.sh archive-faixa-a <agente>  # executa
bash beehive/bin/hive-inbox.sh archive-dry-run <agente>  # apenas lista elegíveis
```

Adicionar ao `package.json`:
```json
"inbox:archive:dry": "bash beehive/bin/hive-inbox.sh archive-dry-run",
"inbox:archive:faixa-a": "bash beehive/bin/hive-inbox.sh archive-faixa-a"
```

---

### 3. Backend `hive.service.ts` — adicionar métricas de elegibilidade ao `HiveState`

Adicionar ao objeto `HiveState` e ao método `getState()`:

```typescript
inboxArchive: Record<AgentName, {
  eligibleCount: number;    // entradas elegíveis para Faixa A
  totalLines: number;       // tamanho atual do arquivo em linhas
}>
```

**Lógica:** reutilizar o parser `countPendingEntries` como base — adicionar método `countArchivableEntries` que conta entradas com status `consumida` ou `executada` com data > 7 dias.

Expor via `GET /api/hive/state` (campo já existente, só adiciona o campo novo).

---

## Critérios de Aceite

| # | Critério |
|---|---|
| AC-01 | `.claudeignore` existe sem espaço no nome (`git status` não mostra `".claudeignore "`) |
| AC-02 | `.claudeignore` NÃO contém `*.log` nem `.hive-agent/` |
| AC-03 | `bash beehive/bin/hive-inbox.sh archive-dry-run claude` lista entradas elegíveis sem modificar arquivos |
| AC-04 | `bash beehive/bin/hive-inbox.sh archive-faixa-a claude` aborta se houver entrada `pendente` |
| AC-05 | Após archive-faixa-a, log de auditoria criado em `beehive/registry/archive/inbox/ARCH-*.md` com todos os campos obrigatórios |
| AC-06 | Após archive-faixa-a, entradas de notificação criadas nos inboxes dos outros dois agentes |
| AC-07 | `GET /api/hive/state` inclui campo `inboxArchive` com `eligibleCount` e `totalLines` por agente |
| AC-08 | `npm run check:types` → OK |

---

## Arquivos a Alterar / Criar

```
.claudeignore                           ← renomear (remover espaço) + substituir conteúdo
beehive/bin/hive-inbox.sh              ← adicionar archive-faixa-a e archive-dry-run
apps/hive-ui/backend/src/hive/hive.service.ts  ← adicionar inboxArchive ao HiveState
package.json                            ← adicionar scripts inbox:archive:*
```

---

## Ponto de Parada

**Não commitar.** Implementar e reportar checkpoint no `inbox-claude.md` para auditoria.

---

## Mensagem de Commit (após liberação do Claude)

```
feat(hive): DEBATE-028 — .claudeignore fix + Faixa A archive + inbox eligibility API

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Aprovado: Márcio
```

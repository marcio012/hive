---
id: WO-028-A
titulo: Falhas Sistêmicas — Fase 1: error-state + Guard + Incidents
backlog_ref: DEBATE-027
debate_ref: beehive/construcao/debates/DEBATE-027-TRATAMENTO-DE-FALHAS-SISTEMICAS-NO-FLUXO-HIVE.md
dir_ref: DIR-090
thread: tratamento-falhas-sistemicas
executor: Copilot
status: commitada
data: 2026-05-29
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive
---

# WO-028-A — Falhas Sistêmicas Fase 1: error-state + Guard + Incidents

## Contexto

DEBATE-027 aprovado por Márcio em 2026-05-29. DIR-090 define a taxonomia de falhas e o protocolo de safe-stop. Esta WO implementa a Fase 1: artefatos de estado, guard genérico e diretório de incidentes.

---

## Escopo

### 1. `.hive-agent/error-state.json` — schema e script de escrita

Criar script `scripts/hive-error-state.js` com três operações:

```
node scripts/hive-error-state.js set <category> <severity> "<affected_flows>" "<resume_requirements>"
node scripts/hive-error-state.js clear
node scripts/hive-error-state.js read
```

Schema do JSON (DIR-090):
```json
{
  "status": "ok | alert | paused",
  "incident_id": "INC-YYYY-MM-DD-NNN | null",
  "detected_at": "ISO timestamp | null",
  "detected_by": "claude | copilot | gemini | orchestrator | null",
  "category": "<ver DIR-090> | null",
  "severity": "low | medium | high | critical | null",
  "affected_flows": [],
  "auto_mode_allowed": true,
  "resume_requirements": ""
}
```

**Gravação:** obrigatoriamente atômica via `.tmp` + `rename` (igual ao padrão `hive.service.ts`).

**Estado inicial:** criar `.hive-agent/error-state.json` com `status: ok` se não existir.

Adicionar ao `package.json`:
```json
"hive:error:set": "node scripts/hive-error-state.js set",
"hive:error:clear": "node scripts/hive-error-state.js clear",
"hive:error:read": "node scripts/hive-error-state.js read"
```

---

### 2. `beehive/registry/incidents/` — diretório e template

Criar o diretório e o arquivo `TEMPLATE_INCIDENTE.md`:

```markdown
---
id: INC-YYYY-MM-DD-NNN
detected_at: ISO timestamp
detected_by: agente
category: executor_errado | auditoria_pulada | roteamento_incorreto | estado_inconsistente | cascata_silenciosa | lock_orfao | commit_sem_liberacao
severity: low | medium | high | critical
affected_flows: []
---

## Linha do tempo

- `HH:mm` — evento

## Contenção imediata

## Causa provável

## Correção aplicada

## Condições para retomar

## DIR criada/atualizada
```

---

### 3. `scripts/hive-action-guard.js` — guard genérico

Módulo Node reutilizável. Interface:

```javascript
// Retorna { allowed: boolean, reason: string }
checkGuard({
  actor,          // 'claude' | 'copilot' | 'gemini'
  action,         // 'commit' | 'handoff' | 'audit' | 'dispatch' | 'close'
  target,         // WO ID, inbox path, etc.
  authorityRef,   // inbox entry ID ou liberação que autoriza
  expectedState,  // estado esperado do artefato antes da ação
  workspace,      // path raiz do workspace
  repo,           // nome do repo
})
```

**Validações obrigatórias (todas bloqueantes):**
1. `error-state.json` com `status != ok` → bloqueia qualquer ação com `auto_mode_allowed: false`
2. `actor` tem autoridade para `action` conforme DIR-040 e DIR-089
3. Para `commit`: verifica campo `executor:` na WO referenciada (DIR-089)
4. Para `handoff`: verifica que `wo_ref`, `executor`, `workspace_hive`, `workspace_target`, `repo_target`, `cwd_exec` estão presentes

Adicionar ao `package.json`:
```json
"hive:guard:check": "node scripts/hive-action-guard.js"
```

---

### 4. Integração com `hive-inbox.sh` e `hive-commit-guard.sh` (se existir)

Se existir `beehive/bin/hive-commit-guard.sh` ou equivalente, atualizar para chamar `hive-action-guard.js` como validação adicional.

---

## Critérios de Aceite

| # | Critério |
|---|---|
| AC-01 | `npm run hive:error:set executor_errado high "WO-028" "Claude auditar"` cria `.hive-agent/error-state.json` com status `alert` |
| AC-02 | `npm run hive:error:clear` volta `status` para `ok` e zera campos de incidente |
| AC-03 | `npm run hive:error:read` exibe o JSON atual formatado |
| AC-04 | Script de set usa gravação atômica (`.tmp` + rename) |
| AC-05 | `beehive/registry/incidents/` criado com `TEMPLATE_INCIDENTE.md` |
| AC-06 | `hive-action-guard.js` bloqueia commit se `actor != executor` na WO |
| AC-07 | `hive-action-guard.js` bloqueia qualquer ação se `error-state.json` tiver `status: alert` e `auto_mode_allowed: false` |
| AC-08 | `npm run hive:guard:check` existe e é executável |

---

## Arquivos a Criar / Alterar

```
scripts/hive-error-state.js          ← novo
scripts/hive-action-guard.js         ← novo
beehive/registry/incidents/          ← diretório novo
beehive/registry/incidents/TEMPLATE_INCIDENTE.md  ← novo
package.json                          ← adicionar scripts
```

---

## Ponto de Parada

**Não commitar.** Implementar, rodar os ACs e reportar checkpoint no `inbox-claude.md`.

---

## Mensagem de Commit (após liberação do Claude)

```
feat(hive): DEBATE-027 Fase 1 — error-state, guard genérico e registry de incidentes

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Aprovado: Márcio
```

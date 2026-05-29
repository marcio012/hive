# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

---

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`

---

**Tipos de entrada (metadado opcional — aplicar em novas entradas):**
- `alerta-roteamento` — o agente identificou algo mas não tem autoridade para agir; Claude deve decidir

---

<!-- novas entradas abaixo — mais recente no topo -->

---

### [CLAUDE-2026-05-29-071] Go — WO-029-A .claudeignore fix + Faixa A + eligibility
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-028
**thread:** autorizacao-arquivamento-inbox
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-029-A-CLAUDEIGNORE-FAIXA-A-INBOX.md
**Status:** pendente

DEBATE-028 aprovado. Três entregas: (1) corrigir `.claudeignore` — renomear e substituir conteúdo para não bloquear `.hive-agent/` nem `*.log`; (2) adicionar `archive-faixa-a` e `archive-dry-run` ao `hive-inbox.sh` com log de auditoria e notificação de agentes; (3) adicionar campo `inboxArchive` ao `GET /api/hive/state`.
Não commitar — reportar checkpoint no `inbox-claude.md`.
Critérios-chave: AC-01/02 (.claudeignore), AC-04 (aborta com pendente), AC-05 (audit log), AC-07 (API).

---

---

### [CLAUDE-2026-05-29-070] Go — WO-028-A Falhas Sistêmicas Fase 1
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**backlog_ref:** DEBATE-027
**thread:** tratamento-falhas-sistemicas
**wo_ref:** beehive/construcao/work_orders/HIVE/WO-028-A-FALHAS-SISTEMICAS-FASE1.md
**Status:** pendente

DEBATE-027 aprovado. Implementar Fase 1 da arquitetura de falhas sistêmicas: script `hive-error-state.js` (com gravação atômica), guard genérico `hive-action-guard.js` e diretório `beehive/registry/incidents/`. Não commitar — reportar checkpoint no `inbox-claude.md`.
Critérios-chave: AC-01 (error-state set/clear/read), AC-06 (guard bloqueia executor errado), AC-07 (guard bloqueia com error-state ativo).

---

---

### [CLAUDE-2026-05-29-068] Autorização de commit — WO-027 Eficiência do Squad UI
**De:** Claude (Arquiteto) → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** liberacao-commit
**backlog_ref:** HIVE-014
**thread:** eficiencia-squad-hive-ui
**wo_ref:** beehive/construcao/work_orders/HIVE-UI/WO-027-EFICIENCIA-SQUAD-UI.md
**Status:** consumida — ✅ Commit realizado em 2026-05-29 (aguardando hash final)

Auditoria concluída. WO-027 **aprovada**. Pode commitar os arquivos abaixo com a mensagem definida na WO.

Arquivos: `apps/hive-ui/backend/src/hive/hive.service.ts`, `hive.controller.ts`, `frontend/src/App.tsx`, `hive.css`, `hooks/useHiveSocket.ts`, `pages/MapaFabrica.tsx`, `pages/Telemetria.tsx`

Mensagem de commit:
```
feat(hive-ui): HIVE-014 — Eficiência do Squad + Tela Telemetria

Dev: Copilot - Engenheiro | Auditoria: Claude - Arquiteto
Aprovado: Márcio
```

Ressalva de documentação (não bloqueante): caminho primário do log foi invertido em relação ao blueprint (registry/telemetria vs construcao/logs) — fallback cobre os dois, registrar como DT-011 se necessário.

---

# COPILOT.md — entrada do Copilot neste repositório

Estas instruções valem **somente para este repositório**.

## Ordem de leitura

1. `.hive-agent/session-state.env` quando existir
2. inbox do domínio ativo (`inbox-copilot-hive.md` ou `inbox-copilot-tos.md`)
3. fila do domínio (`FILA_COPILOT_HIVE.md` ou `FILA_COPILOT_TOS.md`) quando houver priorização
4. `beehive/.copilot/PROMPT_CONTEXTO.md` quando a sessão exigir bootstrap manual
5. `AGENTS.md` e `beehive/.copilot/COPILOT.md` apenas em cold start, mudança de governança ou referência explícita do handoff/NEXT_STEP

## Papel do Copilot aqui

- execução técnica no repositório;
- integração entre arquivos;
- validação e evidências;
- operação GitHub/board dentro do fluxo aprovado.

## Âncoras por domínio (DEBATE-034 — 2026-05-29)

Cada sessão Copilot deve ser iniciada em **um único domínio**. Nunca misturar Hive e produto na mesma sessão.

### Copilot-Hive
- **Workspace:** `/home/marcio/job/hive`
- **Domínio:** `beehive/`, `apps/hive-ui/`, scripts, hooks
- **Stack:** NestJS (hive-ui backend), React (hive-ui frontend), Bash, Node.js
- **Inbox:** `beehive/construcao/inbox-copilot-hive.md`
- **Fila:** `beehive/construcao/FILA_COPILOT_HIVE.md`
- **Boot:** `npm run squad:session:copilot` → `.hive-agent/session-state.env` → `inbox-copilot-hive.md`

### Copilot-TOS (e futuros produtos)
- **Workspace:** `/home/marcio/job/tenantOS`
- **Domínio:** `tenantOS/` e repositórios de produto futuros
- **Stack:** NestJS (produto), Prisma, React, PostgreSQL
- **Inbox:** `beehive/construcao/inbox-copilot-tos.md`
- **Fila:** `beehive/construcao/FILA_COPILOT_TOS.md`
- **Boot:** `npm run squad:session:copilot` → `.hive-agent/session-state.env` → `inbox-copilot-tos.md`

### Legado
- `inbox-copilot.md` — mantido como histórico. **Sem novas entradas.**

## Fonte compartilhada

As regras comuns do squad e o escopo por repositório continuam em `AGENTS.md` e `beehive/.copilot/COPILOT.md`, mas devem ser reabertos só quando a sessão realmente precisar refrescar governança.

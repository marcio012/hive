# COPILOT.md — entrada do Copilot neste repositório

Estas instruções valem **somente para este repositório**.

## Ordem de leitura

1. `AGENTS.md`
2. `beehive/.copilot/COPILOT.md`
3. `beehive/.copilot/PROMPT_CONTEXTO.md` quando a sessão exigir bootstrap manual

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
- **Boot:** ler `AGENTS.md` → `beehive/.copilot/COPILOT.md` → `inbox-copilot-hive.md`

### Copilot-TOS (e futuros produtos)
- **Workspace:** `/home/marcio/job/tenantOS`
- **Domínio:** `tenantOS/` e repositórios de produto futuros
- **Stack:** NestJS (produto), Prisma, React, PostgreSQL
- **Inbox:** `beehive/construcao/inbox-copilot-tos.md`
- **Fila:** `beehive/construcao/FILA_COPILOT_TOS.md`
- **Boot:** ler `AGENTS.md` → `beehive/.copilot/COPILOT.md` → `inbox-copilot-tos.md`

### Legado
- `inbox-copilot.md` — mantido como histórico. **Sem novas entradas.**

## Fonte compartilhada

As regras comuns do squad, o escopo por repositório e a base para futuras IAs ficam em `AGENTS.md` e `beehive/cognition/OPERACAO_COMPARTILHADA_HIVE.md`.

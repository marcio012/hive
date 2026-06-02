# Prompt de contexto para novas sessões com Copilot

Use este bloco quando a sessão precisar de bootstrap manual.

## Leitura mínima
- `.hive-agent/session-state.env`
- `ACTIVE_ROLE_CONTEXT_FILE` quando `ACTIVE_ROLE` estiver preenchido no `session-state.env`
- `beehive/construcao/inbox-copilot-hive.md` **ou** `beehive/construcao/inbox-copilot-tos.md` (domínio ativo)
- `beehive/construcao/FILA_COPILOT_HIVE.md` **ou** `beehive/construcao/FILA_COPILOT_TOS.md` quando a prioridade importar

## Referências estáveis (sob demanda)
- `AGENTS.md`
- `COPILOT.md`
- `beehive/.copilot/COPILOT.md`
- `beehive/roles/roles.yaml`
- `beehive/cognition/diretrizes.md`
- `beehive/construcao/BACKLOG.md` quando a tarefa depender de backlog/WO

Não releia as referências estáveis em toda sessão. Reabra apenas em cold start, mudança de governança, ou quando `NEXT_STEP` / handoff apontar para elas.

## Pedido recomendado
"Copilot, rode `npm run squad:session:copilot`, leia `.hive-agent/session-state.env`, carregue `ACTIVE_ROLE_CONTEXT_FILE` se `ACTIVE_ROLE` estiver preenchido, e depois leia o inbox do domínio ativo. Se `NEXT_STEP` apontar para algum arquivo, leia só esse arquivo adicional e execute o próximo passo aprovado."

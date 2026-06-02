# Prompt de contexto para novas sessoes com Copilot

Use este bloco quando a sessao precisar de bootstrap manual.

## Leitura minima
- `.hive-agent/session-state.env`
- `ACTIVE_ROLE_CONTEXT_FILE` quando `ACTIVE_ROLE` estiver preenchido no `session-state.env`
- `beehive/construcao/inbox-copilot-hive.md` **ou** `beehive/construcao/inbox-copilot-tos.md` (dominio ativo)
- `beehive/construcao/FILA_COPILOT_HIVE.md` **ou** `beehive/construcao/FILA_COPILOT_TOS.md` quando a prioridade importar

## Referencias estaveis (sob demanda)
- `AGENTS.md`
- `COPILOT.md`
- `beehive/.copilot/COPILOT.md`
- `beehive/roles/roles.yaml`
- `beehive/cognition/diretrizes.md`
- `beehive/construcao/BACKLOG.md` quando a tarefa depender de backlog/WO

Nao releia as referencias estaveis em toda sessao. Reabra apenas em cold start, mudanca de governanca, ou quando `NEXT_STEP` / handoff apontar para elas.

## Pedido recomendado
"Copilot, rode `npm run squad:session:copilot`, leia `.hive-agent/session-state.env`, carregue `ACTIVE_ROLE_CONTEXT_FILE` se `ACTIVE_ROLE` estiver preenchido, e depois leia o inbox do dominio ativo. Se `NEXT_STEP` apontar para algum arquivo, leia so esse arquivo adicional e execute o proximo passo aprovado."

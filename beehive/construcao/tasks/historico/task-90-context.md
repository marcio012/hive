---
issue: "#90"
titulo: "feat(platform): aprovação manual no pipeline dispara notificação WhatsApp ao lead"
owner_atual: encerrado
iniciado_em: 2026-05-23
ultimo_checkpoint: 2026-05-23T07:08:00Z
status: FECHADA
---

## Contexto

Hoje a proposta só é enviada quando o lead responde "SIM" pelo WhatsApp.
Quando o platform admin move um lead para gate `aprovado` no pipeline, nenhuma notificação é disparada.

Infra Twilio (webhook, credenciais, APP_URL) está 100% funcional após #65.

## Escopo

### Backend — único arquivo a alterar

`apps/core/src/agente-vendas/aprovacao.service.ts` (ou onde estiver `PlatformLeadsService.updateGate`)

Quando `updateGate(id, 'aprovado')` for chamado:
1. Checar se `lead.gate !== 'proposta_enviada'` (idempotência)
2. Checar se `lead.telefone` está preenchido
3. Se sim: disparar `PropostaService.enviarFinal(leadId)` em background (`void`)
4. Se não: apenas mudar o gate normalmente, sem erro

### Frontend — nenhuma mudança

O botão de mover gate já existe no pipeline Kanban (#78 — Claude).

## Critérios de aceite

- [x] Mover lead para `aprovado` no pipeline → dispara `PropostaService.enviarFinal(leadId)` em background
- [x] Se lead não tiver telefone, gate muda normalmente sem erro
- [x] Não reenviar proposta se gate já for `proposta_enviada`

## Onde está o código relevante

- `apps/core/src/agente-vendas/aprovacao.service.ts` — lógica de aprovação
- `apps/core/src/agente-vendas/proposta.service.ts` — `enviarFinal(leadId)`
- `apps/core/src/whatsapp/lead.service.ts` — modelo do lead (telefone, gate)
- Endpoint gate: `PATCH /api/platform/leads/:id/gate`

## Checkpoints automáticos

- 2026-05-23T06:15:00Z | owner=copilot | last=Claude criou contexto após fechar #65 | next=Copilot implementa lógica de disparo no updateGate
- 2026-05-23T06:33:00Z | owner=copilot | last=Copilot implementou a lógica no PlatformLeadsService e adicionou spec de cobertura | next=Revisar/commitar a #90 e então virar a fila para #84
- 2026-05-23T07:08:00Z | owner=encerrado | last=Copilot comentou evidência e fechou a #90 no GitHub | next=Fila real vira para a #86

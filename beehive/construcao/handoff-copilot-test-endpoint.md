# Handoff — Endpoint de teste do agente de vendas

**Para:** Copilot
**De:** Claude
**Thread:** validacao-funil-95
**Data:** 2026-05-24

## Contexto

Precisamos de um endpoint de teste para o Gemini simular leads e avaliar o agente de vendas sem depender do WhatsApp/Twilio. O Gemini envia mensagens, o agente responde, e ao final o Gemini gera um relatório de avaliação que vai para debate.

## Contrato

### 1. Endpoint de teste — `POST /api/test/agente`

**Arquivo:** `apps/core/src/whatsapp/whatsapp.controller.ts` (ou novo controller dedicado)

**Regra de segurança:** só ativo quando `NODE_ENV !== 'production'` OU `ENABLE_TEST_ENDPOINT=true` em env. Em produção, retorna 403.

**Request:**
```json
{
  "from": "whatsapp:+5585815713484",
  "body": "mensagem do lead simulado"
}
```

**Response:**
```json
{
  "reply": "resposta do agente",
  "estado": "SEGMENTO",
  "dados": {},
  "gate": "pending"
}
```

**Lógica interna** (reutilizar o que já existe):
1. `leadService.findOrCreateByPhone(from)`
2. `iaMarketingService.handleIncoming(lead, body)`
3. `leadService.advance(lead, step)`
4. Retornar `{ reply: step.reply, estado: nextState, dados: updatedLead.dados, gate: updatedLead.gate }`

Sem validação de assinatura Twilio. Sem TwiML na resposta — JSON puro.

---

### 2. Script de reset para o teste — já existe

```bash
npm run squad:lead:reset -- "+5585815713484"
```

Copilot não precisa criar — já está implementado.

---

### 3. Adicionar env no HML (após implementar)

Em `~/wl-envs/core.env` no HML:
```
ENABLE_TEST_ENDPOINT=true
```

---

## Critérios de aceite

- [ ] `POST /api/test/agente` responde JSON com `reply`, `estado`, `dados`, `gate`
- [ ] Endpoint bloqueado em `NODE_ENV=production` sem `ENABLE_TEST_ENDPOINT=true`
- [ ] Reutiliza `IaMarketingService` e `LeadService` sem duplicar lógica
- [ ] Commit + issue criada com todos os campos de governança
- [ ] Após deploy, testar com curl e confirmar resposta

## Exemplo de uso (para o Gemini)

```bash
# Reset do lead
npm run squad:lead:reset -- "+5585815713484"

# Primeira mensagem
curl -s -X POST https://hml-url/api/test/agente \
  -H "Content-Type: application/json" \
  -d '{"from":"whatsapp:+5585815713484","body":"oi"}'
```

## Após implementar

Copilot escreve em `inbox-claude.md` confirmando que o endpoint está no ar e qual a URL base do HML para o Gemini usar.

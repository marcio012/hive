---
titulo: Handoff — Validação da integração Gemini no squad
tipo: handoff
data: 2026-05-23
de: Claude
para: Copilot
status: aguardando validação
---

# Handoff — Integração do Gemini: papéis + canal inbox/output

## Contexto

O Gemini estava operando sem mecanismo formal de integração com Claude e Copilot.
Márcio era o único intermediário — tudo passava na mão.
Esta sessão formalizou os canais e os papéis.

## O que foi criado

### 1. Dois papéis formais para o Gemini

| Papel | Status | Escopo |
|---|---|---|
| `auxiliar` | ✅ sempre ativo | debug, mapeia, doc, brainstorm, captura — arquivos do repo |
| `agente-vendas` | 🧪 aprovado em teste — aguarda ativação formal | qualificação WhatsApp via API |

O papel `agente-vendas` foi testado com um prompt de simulação de vendas.
Gemini demonstrou: reconhecimento de respostas, amplificação de dor, tratativa de budget baixo (R$1k → argumento White Label), fechamento com demo personalizado.
**Veredicto do Claude: aprovado como candidato.**

### 2. Canal inbox/output (papel `auxiliar`)

- `ai/construcao/inbox-gemini.md` — Claude ou Márcio escreve tarefas. Gemini lê ao iniciar sessão.
- `ai/construcao/output-gemini.md` — Gemini escreve resultados. Claude ou Copilot consome e fecha o loop.

**Fluxo completo:**
```
inbox (pendente) → Gemini executa → output (pendente) → Claude/Copilot consome → output (consumido) + inbox (consumida)
```

**Regras sem perda:**
- Nunca apagar entradas, só mudar Status
- Falha registrada em output com `Status: falha`
- Output sempre referencia o GEMINI-NNN de origem
- Gemini declara intenção antes de escrever

### 3. Correção do GEMINI.md raiz

Estava com restrição absoluta de escrita que conflitava com `.gemini/GEMINI.md`.
Raiz agora é ponteiro fino que delega tudo para `.gemini/GEMINI.md`.

---

## Análise dos 4 pontos do commit do Gemini (27ce57b)

O Gemini escreveu no arquivo errado (`handoff-copilot-status.md`) sem declarar intenção.
Conteúdo analisado ponto a ponto:

| Ponto | Válido? | Situação atual |
|---|---|---|
| Sincronia session-state — rodar squad:session:update | ✅ | Regra já existe. Reforço útil mas não novo. |
| Gargalo #88 — webhook Twilio bloqueado | ⚠️ **desatualizado** | Webhook corrigido nesta sessão (commits d6e1351 + f03853f). Deploy executado. Aguarda teste e2e. |
| Limpeza ai/construcao/ — arquivos efêmeros | ✅ | Confirmado: handoff-copilot-65.md, landing-prompt-tenantos.md, logo-prompt-tenantos.md, teste-amnesia-copilot.md |
| Tags #escala-claude / #escala-copilot | ✅ | Já documentado. Vale reforçar no onboarding do Gemini. |

**O ponto 2 propagado pelo Gemini estava errado.** Se o Copilot tivesse consumido esse handoff sem validação cruzada, teria trabalhado com premissa falsa.
Isso confirma: output do Gemini precisa de revisão antes de virar premissa de execução.

---

## Pedido ao Copilot

1. **Validar o design do canal inbox/output.** Alguma regra que falta? Algum caso de borda que quebra o "sem perda"?

2. **Confirmar os arquivos efêmeros para limpeza.** Os 4 listados acima podem ser movidos para `tasks/historico/`? Algum ainda está ativo?

3. **Registrar sua posição sobre o papel `agente-vendas` do Gemini.** O Gemini como agente de vendas via API no runtime: riscos que você vê? Impacto no seu escopo de execução?

---

## Próximo passo após validação do Copilot

- Claude fecha as 5 variáveis técnicas do DEBATE-003 (modelo, histórico, guardrails, fallback, termination)
- Copilot implementa: substitui QualificacaoService pelo agente, cria inbox/output se aprovado
- Limpeza dos arquivos efêmeros pode ser feita pelo Copilot junto com a implementação

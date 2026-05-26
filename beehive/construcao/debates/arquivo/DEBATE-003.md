# DEBATE-003 — IA Marketing Vivo no WhatsApp

**Status:** 🟢 contrato fechado — implementar em HML (teste evolutivo)
**Aberto em:** 2026-05-23
**Owner:** Claude (design) + Márcio (decisão final)

## Conceito aprovado

Substituir `QualificacaoService` (máquina de estados rígida) por agente de IA especialista em marketing consultivo. A IA conduz a conversa livremente, adapta-se ao cliente, entrega dados estruturados quando o lead está qualificado.

## Arquitetura proposta

```
WhatsApp → webhook → [IA Marketing Agent]
                           ↓
                    histórico no DB (por lead)
                           ↓
               resposta + dados parciais
                           ↓
               quando concluído → OrcamentoService → DossierService → PropostaService
```

## Output contract da IA

```json
{
  "reply": "mensagem para o lead",
  "estado": "em_qualificacao | concluido | aguardando",
  "dados_coletados": { "segmento": "...", "tipo_negocio": "...", "tamanho": "...", "dores": "...", "orcamento": "..." }
}
```

## Variáveis fechadas — decisões para HML (2026-05-23)

| Variável | Decisão |
|----------|---------|
| Modelo | **Gemini API** (`gemini-2.0-flash`) — já pago via Google AI Pro. Candidato de teste. Futuro: comparar com outros modelos/open source. |
| Histórico | **`leads.dados.historico`** como array JSON (já é jsonb). Máx 20 mensagens. Congela após `CONCLUIDO`. |
| Guardrails | Nunca prometer preços, prazos, funcionalidades específicas nem comparar concorrentes. Se perguntado → redirecionar para a proposta. |
| Fallback | API error → resposta genérica + estado não avança + log. JSON inválido → retry 1x → fallback. Timeout → "Tive uma dificuldade técnica, pode repetir?" |
| Termination | Mínimo obrigatório: `segmento`, `dor_principal`, `budget`, `horizonte`, `logo_cores`. Hard stop: 15 trocas. Gate `qualificado` quando IA julgar suficiente. |

## O que NÃO muda

Webhook NestJS, OrcamentoService, DossierService, PropostaService, Pipeline do Platform Admin — todos intactos.

## Insights capturados

Pensamentos e observações soltos sobre este debate ficam em `ai/construcao/insights-buffer.md`.

**No início de cada sessão do DEBATE-003:**
1. Gemini filtra o buffer pelas tags `#agente-vendas`, `#qualificacao`, `#twilio`, `#ia-marketing` e devolve um digest curto.
2. Claude qualifica o digest — o que entra no debate, o que promove, o que descarta.
3. Só então continua o design.

Gemini filtra. Claude qualifica. O buffer não é decisão.

Tags de escala:
- `#escala-claude` → tema arquitetural, traz para o debate antes de rotar
- `#escala-copilot` → virou contrato fechado, pode rotar direto

## Baseline real — conversa do teste (2026-05-23)

Conversa real do Márcio com o sistema atual. É o ponto de partida do design do novo diálogo.

```
[17:53] Lead:    oi
[17:53] Bot:     Oi! Eu sou o assistente de qualificacao da Fluxo. Vou te fazer algumas
                 perguntas rapidas para entender o seu cenario.
                 Qual e o segmento do seu negocio?
[17:54] Lead:    Mercado
[17:54] Bot:     Qual e a principal dor operacional que voce quer resolver hoje?
[17:54] Lead:    Estoque
[17:54] Bot:     O que hoje esta mais critico no processo comercial ou operacional?
[17:56] Lead:    Problema operacional a tabela de produtos do estoque entra e saida
                 ou seja eu nao visibilidade do que entra e do que sai.
[17:56] Bot:     Em quanto tempo voce quer colocar essa solucao para rodar?
[17:58] Lead:    Olha eu nao quero para agora, daqui para 3 meses
[17:58] Bot:     Voce ja tem uma faixa de budget pensada para esse projeto?
[17:58] Lead:    R$ 1000,00
[17:58] Bot:     Voce ja tem logo, cores e identidade visual definidos?
[17:58] Lead:    Sim tenho
[17:58] Bot:     Perfeito. Qualificacao concluida com sucesso! Nosso proximo passo e montar
                 a proposta com base nessas respostas.
```

**O que o sistema atual desperdiçou:**

| Mensagem do lead | O que o sistema fez | O que deveria ter feito |
|---|---|---|
| "Mercado" | Avançou para próxima pergunta | Validar + contextualizar ("Supermercado, mercearia, atacado?") |
| "Estoque" | Avançou para próxima pergunta | Aprofundar ("Mais entradas, saídas ou ambos?") |
| "eu nao tenho visibilidade do que entra e do que sai" | Avançou para próxima pergunta | Reconhecer a dor + conectar com a solução |
| "daqui para 3 meses" | Avançou para próxima pergunta | Validar viabilidade + criar urgência suave |
| "R$ 1000,00" | Avançou para próxima pergunta | Qualificar se é viável (R$1k é baixo — como tratar?) |

**Diagnóstico:** o sistema atual coleta dados mas não vende. Não cria rapport, não valida, não cria desejo. O lead termina qualificado mas frio.

## Teste de viabilidade do Gemini como agente de vendas

**Parecer do Copilot — Posição: ✅ candidato sério**

- Reconheceu a dor com contexto de negócio
- Amplificou a dor corretamente, traduzindo para perda de venda e compra errada
- Tratou o budget de R$1.000 como vantagem do modelo white-label
- Criou próximo passo comercial desejável ("demo com a cara da Mercearia do João")
- Soou mais vendedor do que bot

**Ressalva do Copilot:** desempenho bom em simulação, mas ainda não prova estabilidade em runtime real. Guardrails obrigatórios antes de promover para implementação.

**Conclusão:** Gemini aprovado como candidato real para a próxima rodada de validação.

## Handoff de implementação

Ver `ai/construcao/handoff-copilot-ia-marketing.md` — contrato fechado para o Copilot implementar o `IaMarketingService`.

**Pré-requisito:** `GEMINI_API_KEY` adicionada em `~/wl-envs/core.env` no HML antes do deploy.

---

## Parecer do Gemini sobre o modelo (2026-05-23)

**Posição: ✅ gemini-2.0-flash**

- **Latência:** Resposta rápida essencial para UX de WhatsApp.
- **Custo:** Uso da assinatura Google AI Pro reduz custo marginal a quase zero.
- **Naturalidade:** Testes mostraram tom consultivo e rapport superior em PT-BR.
- **Confiabilidade:** JSON de saída estruturado e estável para integração com backend.


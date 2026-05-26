---
titulo: Handoff — Implementação do IaMarketingService (Gemini como agente de vendas)
tipo: handoff
data: 2026-05-23
de: Claude
para: Copilot
status: pronto para implementar
---

# Handoff — IaMarketingService com Gemini API

## Objetivo

Substituir o `QualificacaoService` (máquina de estados rígida) por um agente de IA consultivo
que conduz a conversa de qualificação de forma natural, cria desejo e contorna objeções.
Ambiente alvo: **HML** (teste evolutivo — medir e iterar).

## O que NÃO muda

- `WhatsappController` — intacto
- `WhatsappService.handleIncoming()` — assinatura intacta
- `LeadService`, `OrcamentoService`, `DossierService`, `PropostaService` — intactos
- Tabela `leads` e schema Prisma — sem migration necessária (`dados` já é jsonb)
- Webhook, validação de assinatura Twilio — intactos

## O que muda

`QualificacaoService` → substituído por `IaMarketingService`

`WhatsappService` passa a chamar `IaMarketingService.handleIncoming()` no lugar do `QualificacaoService`.

## Contrato da interface (não muda)

```typescript
export interface QualificacaoStepResult {
  nextState: LeadEstado;
  reply: string;
  dadosPatch?: Record<string, string>;
  gate?: string;
  orcamento?: Prisma.InputJsonValue;
}
```

O `IaMarketingService` deve retornar o mesmo tipo.

## Implementação do IaMarketingService

### Dependência

```bash
npm --prefix apps/core install @google/generative-ai
```

### Variável de ambiente (adicionar em ~/wl-envs/core.env no HML)

```
GEMINI_API_KEY=<chave da Google AI>
```

### Modelo

`gemini-2.0-flash` — rápido, custo baixo, já disponível via Google AI Pro.

### Histórico por lead

Armazenar em `leads.dados.historico` como array de mensagens:

```typescript
type HistoricoMensagem = { role: 'user' | 'model'; parts: [{ text: string }] };
```

Máx 20 mensagens. Após estado `CONCLUIDO`, não appender mais.

### System prompt

```
Você é um consultor de vendas da Fluxo, empresa que oferece sistemas white-label para
pequenos negócios. Seu objetivo é qualificar o lead de forma consultiva — criar rapport,
amplificar a dor, mostrar o valor da solução e coletar as informações necessárias para
a proposta.

Conduza a conversa naturalmente, como um vendedor experiente. Não dispare perguntas em
sequência como formulário. Valide as respostas, mostre empatia, amplifique a dor com
linguagem do negócio do lead (não técnica).

Quando tiver coletado segmento, dor principal, budget, horizonte e identidade visual,
encerre com um próximo passo comercial concreto e tangível para o lead.

NUNCA:
- Prometer preços, valores ou prazos específicos de entrega
- Prometer funcionalidades que não foram validadas
- Comparar com concorrentes
- Encerrar sem um próximo passo claro para o lead

Se perguntado sobre preço → "nossa proposta vai trazer isso com base no que você me contou"
Se perguntado sobre prazo de entrega → "o time técnico define isso na proposta"

Responda sempre em português brasileiro. Máximo 3 frases por mensagem — WhatsApp, não email.
Quando julgar que tem informações suficientes (segmento, dor, budget, horizonte, identidade
visual), retorne um JSON no seguinte formato — e apenas o JSON, sem texto ao redor:

{
  "reply": "mensagem de fechamento para o lead",
  "estado": "concluido",
  "dados_coletados": {
    "segmento": "...",
    "dor_principal": "...",
    "situacao_critica": "...",
    "horizonte": "...",
    "budget": "...",
    "logo_cores": "..."
  }
}

Enquanto ainda estiver qualificando, responda apenas com o texto da próxima mensagem
(sem JSON).
```

### Lógica do IaMarketingService

```typescript
async handleIncoming(lead: LeadRecord, message: string): Promise<QualificacaoStepResult> {
  // 1. Carregar histórico do lead
  // 2. Appender mensagem do usuário ao histórico
  // 3. Chamar Gemini API com system prompt + histórico
  // 4. Tentar parsear JSON da resposta
  //    - Se JSON válido com estado "concluido" → extrair dados, retornar nextState CONCLUIDO
  //    - Se texto simples → retornar nextState EM_QUALIFICACAO (manter estado atual)
  // 5. Salvar histórico atualizado em leads.dados.historico
  // 6. Fallback em qualquer erro → resposta genérica + estado não avança
}
```

### Estados do lead

- Estado inicial `BOAS_VINDAS` → IA inicia a conversa
- Durante qualificação → estado fica em `SEGMENTO` (reutilizar estado existente ou criar `EM_QUALIFICACAO`)
- Quando IA retorna JSON com `estado: "concluido"` → `nextState = CONCLUIDO`, `gate = 'qualificado'`
- Hard stop: se `historico.length >= 30` (15 trocas) → forçar encerramento com o que tiver

### Fallback

```typescript
catch (error) {
  logger.error('IaMarketingService falhou', error);
  return {
    nextState: lead.estado as LeadEstado,
    reply: 'Tive uma dificuldade técnica agora. Pode repetir sua última mensagem?',
  };
}
```

## Checklist de entrega

- [ ] `IaMarketingService` criado em `apps/core/src/whatsapp/ia-marketing.service.ts`
- [ ] `WhatsappModule` registra `IaMarketingService` e injeta no `WhatsappService`
- [ ] `WhatsappService` chama `IaMarketingService` no lugar do `QualificacaoService`
- [ ] `QualificacaoService` mantido no código mas não mais chamado (não deletar ainda — comparação futura)
- [ ] `GEMINI_API_KEY` adicionada no `~/wl-envs/core.env` do HML
- [ ] `@google/generative-ai` instalado em `apps/core`
- [ ] `npm run ci:core:checktypes` passa
- [ ] `npm run ci:core:build` passa
- [ ] Deploy em HML via pipeline
- [ ] Teste manual: mandar "oi" para o sandbox do Twilio e verificar resposta consultiva

## O que medir após o deploy

- Tom da resposta: consultivo ou formulário?
- Tratamento de budget baixo: redireciona para white-label ou descarta?
- Encerramento: gera próximo passo concreto?
- Estabilidade: JSON malformado? Erros de API? Timeouts?

Registrar observações no `insights-buffer.md` com tag `#agente-vendas #hml-teste`.

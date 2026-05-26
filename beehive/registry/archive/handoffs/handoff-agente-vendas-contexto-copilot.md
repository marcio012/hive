---
titulo: Handoff — Contexto Agente de Vendas para Copilot
tipo: handoff
status: ativo
ultima_revisao: 2026-05-22 (atualizado pós-debate V2)
responsavel: Claude - Arquiteto
destino: Copilot - Dev
---

# Contexto: Agente de Vendas — o que aconteceu e onde estamos

## Por que este documento existe

O debate sobre o Agente de Vendas começou numa conversa do Márcio com o Copilot Web em abril/2026
e foi retomado e consolidado numa sessão Claude Code em 2026-05-21.
Este documento traz o Copilot CLI para dentro do contexto sem depender do histórico de chat.

---

## O que é o Agente de Vendas

Uma ferramenta interna do Márcio para captar clientes do White Label MVP.
Não é um produto que os clientes do White Label usam — é o funil de vendas do próprio Márcio.

O agente conduz o prospect do primeiro contato até a proposta pronta.
Márcio aprova tudo antes do envio. O agente não fecha nada sozinho.

---

## De onde veio a ideia

Na conversa do Copilot Web, o Márcio queria:
- Um agente que vendesse seus serviços de TI (apps, sites, RPA, sustentação, prototipação, consultoria)
- Que usasse o "template oficial" do processo (= o dossier + blueprint que já existe no repo)
- Que ficasse sob supervisão total dele no início
- Que pudesse ganhar autonomia gradual

Na sessão Claude Code de 2026-05-21, o escopo foi expandido para o White Label:
O agente não vende os serviços avulsos de TI — ele capta empresas que vão contratar o White Label MVP.

---

## Fluxo definido

```
Canais de entrada (todos: WhatsApp, Landing Page, Instagram, LinkedIn, Email)
    ↓
Motor de conversa com IA (chatbot/wizard)
    ↓ faz gate de qualificação automaticamente
Dossier gerado automaticamente
    ↓ usa template existente do repo
Motor de orçamento
    ↓ seleciona blueprint do nicho + calcula valor
Geração de layout via Claude.ai Designer
    ↓ mockup do White Label com a cara do cliente — output: PDF
Canal de aprovação pessoal do Márcio (WhatsApp ou Telegram)
    ↓ Márcio aprova com 1 clique
Cliente recebe proposta
```

---

## Decisões já tomadas pelo Márcio

1. **Todos os canais** — WhatsApp, Landing Page, Instagram, LinkedIn, Email
2. **Layout simples** — White Label com a cara do cliente via prompts Claude.ai Designer. Saída em PDF. Entregável pago na V2.
3. **Ferramenta interna** — só para o Márcio captar clientes do White Label. V2 futura pode virar feature para clientes do White Label usarem também.
4. **Canal de aprovação** — WhatsApp ou Telegram pessoal do Márcio. Decisão final pendente entre as duas opções.

---

## Decisões tomadas em 2026-05-22 (V2)

- **Canal de aprovação**: WhatsApp via **Twilio Sandbox** (mock que migra para produção sem reescrita)
- **Outreach ativo**: fora do escopo V2 — valida inbound primeiro
- **Motor de conversa**: fluxo fixo (state machine), não IA livre
- **Claude API**: entra apenas na geração do dossier e rascunho da proposta

Blueprint V2 completo: `ai/produto/blueprints/agente-vendas-v2-blueprint.md`

---

## Artefatos existentes que o agente usa

| O que o agente precisa | Onde está no repo |
|---|---|
| Gate de qualificação | `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md` |
| Template do dossier | `docs/planning/dossies/templates/TEMPLATE_DOSSIE_NICHO.md` |
| Exemplos de dossier | `docs/planning/dossies/exemplos/` |
| Blueprints de nicho | `ai/produto/blueprints/` |
| Captação visual | `docs/schema/CAPTACAO_VISUAL_CLIENTE_V1.md` |

---

## Artefatos entregues nesta frente

| Artefato | Issue | Status |
|---|---|---|
| Landing page pública `/landing` | #52 | Entregue — validada pelo Márcio |
| Demo Mesa Viva | #53 | Entregue |
| Script de qualificação consultiva | #54 | Entregue — `docs/sales/script-qualificacao-v1.md` |
| Endpoint de onboarding de tenant | #47 | Entregue |

---

## Artefatos que ainda precisam ser criados (V2)

Ver blueprint completo: `ai/produto/blueprints/agente-vendas-v2-blueprint.md`

| Frente | Executor | Status |
|---|---|---|
| Infra Twilio + Webhook NestJS | Copilot | todo |
| State machine de qualificação | Copilot | todo |
| Motor de orçamento | Claude | todo |
| Geração do dossier via Claude API | Claude | todo |
| Canal de aprovação (WhatsApp Twilio) | Copilot | todo |
| Envio da proposta ao lead | Copilot | todo |
| PDF da proposta | Opcional V2 | — |

---

## Frentes faseadas

| Frente | Prioridade |
|---|---|
| Captação + qualificação + dossier automático | V1 core |
| Orçamento automatizado | V1 core |
| Canal de aprovação pessoal | V1 core |
| Layout White Label → PDF | V1 entregável |
| Outreach ativo | V1 opcional / V2 |
| Proposta Visual como produto pago | V2 |
| Clientes do White Label usando o mesmo funil | V3 visão |

---

## Debates encerrados em 2026-05-22

1. **Roteamento Claude vs Copilot**
   - decisão do Márcio: calibrar por natureza da task, não por papel fixo;
   - Claude assume contexto acumulado, conceito + código e documentação estratégica;
   - Copilot assume contrato fechado, execução pura, endpoints, boilerplate e ajustes técnicos diretos;
   - registro operacional: `DIR-040` em `ai/construcao/DIRETRIZES_ATIVAS.md`.

2. **Rastreabilidade de ideias "inside" no board**
   - decisão do Márcio: usar **label `idea:inside`** em vez de criar coluna nova;
   - toda ideia deve linkar a issue originadora no corpo;
   - revisão do conjunto de ideias acontece nos momentos de planejamento;
   - registro operacional: `DIR-041` em `ai/construcao/DIRETRIZES_ATIVAS.md`.

---

## Próxima ação operacional do Copilot

**Imediato (paralelo ao debate V2):**

1. **Revisão cruzada do #46** (User CRUD tenant-scoped — entregue pelo Claude)
   - Validar: todos os endpoints protegidos por `@Roles('admin')`, isolamento por tenant, senha nunca exposta, 409/404 corretos
   - Postar revisão cruzada no issue #46 com parecer objetivo

2. **Iniciar #44** (Produto CRUD completo no core)
   - Mesmo padrão do #46: `TenantContext` + `@Roles('admin')` + DTOs com class-validator + service + controller + module
   - Endpoints: `POST`, `PATCH/:id`, `DELETE/:id` (GET já existe)
   - Referência de implementação: `apps/core/src/users/` (padrão exato a seguir)

**Após o Márcio dar OK nos itens em review (#46, #47, #48):**

3. **#45** — Venda detalhe e cancelamento no core
4. **Frente 1 do V2** — Infra Twilio + Webhook (blueprint: `ai/produto/blueprints/agente-vendas-v2-blueprint.md`)

---

## Parecer do Copilot (2026-05-21)

Leitura do Copilot: a direção do handoff está boa e já sustenta blueprint, mas a V1 ainda está larga demais.

### Corte recomendado pelo Copilot

1. V1 real = inbound only + 1 canal de aprovação + dossier automático + orçamento + proposta simples.
2. Canal de aprovação recomendado para começar = **Telegram**, por simplicidade de bot e fluxo controlado.
3. Claude.ai Designer deve entrar primeiro como **etapa assistida**, não como automação total.
4. Outreach ativo deve ficar fora da V1.

Síntese: **V1 prova o funil. V2 expande canais e automações.**

---

## Documento-mãe desta frente

- `ai/produto/agente-vendas-ideia-viva.md` — leitura obrigatória antes de qualquer trabalho nesta frente
- `ai/produto/blueprints/agente-vendas-v1-blueprint.md` — blueprint de execução fechado

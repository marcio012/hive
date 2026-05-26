---
titulo: Agente de Vendas V2 — Blueprint de Arquitetura
tipo: blueprint
status: proposto
ultima_revisao: 2026-05-22
responsavel: Claude - Arquiteto
executor: Copilot - Dev | Claude - Arquiteto
origem: debate Claude Code (2026-05-22) — decisoes registradas em agente-vendas-ideia-viva.md
---

# Agente de Vendas V2 — Blueprint

## Objetivo

Automatizar o funil de vendas do White Label MVP: do primeiro contato via WhatsApp até a proposta pronta para aprovação do Márcio — sem intervenção manual em nenhuma etapa exceto a aprovação final.

O V1 provou que o funil existe (landing + script). O V2 faz o agente operar o funil.

---

## Decisões de arquitetura

| Decisão | Escolha | Motivo |
|---|---|---|
| Canal de entrada do lead | WhatsApp via Twilio Sandbox | Sem aprovação Meta, migra para produção sem reescrita |
| Motor de conversa | State machine (fluxo fixo) | Previsível, auditável, custo zero de IA na conversa |
| Inteligência (IA) | Claude API | Apenas na geração do dossier e rascunho da proposta |
| Canal de aprovação | WhatsApp do Márcio via Twilio | Mesmo canal, mensagem com resumo + próximos passos |
| Outreach ativo | Fora do escopo V2 | Valida inbound antes de escalar saída |
| Backend | NestJS (core existente) | Novo módulo `agente-vendas` no monorepo |

---

## Fluxo técnico V2

```
Lead envia mensagem via WhatsApp
        ↓
Twilio recebe e faz POST → /api/agente-vendas/webhook
        ↓
NestJS identifica lead (telefone) e carrega estado da conversa
        ↓
State machine executa próximo passo do fluxo de qualificação
        ↓
    [etapas da conversa — veja abaixo]
        ↓
Gate: aprovado / estacionado / rejeitado
        ↓ (se aprovado)
Claude API gera dossier preenchido + rascunho de proposta
        ↓
Motor de orçamento calcula valor com base nos módulos selecionados
        ↓
Twilio envia mensagem ao Márcio com resumo do lead + proposta
        ↓
Márcio responde: APROVAR / EDITAR / REJEITAR
        ↓
    [se APROVAR]
Lead recebe proposta final pelo WhatsApp
```

---

## Etapas da conversa (state machine)

| Estado | Mensagem enviada ao lead | Dado coletado |
|---|---|---|
| `BOAS_VINDAS` | "Olá! Antes de tudo, me conta: qual é o nome do seu negócio?" | `nomeNegocio` |
| `SEGMENTO` | "Legal! E qual é o segmento? (Restaurante / Pet Shop / Barbearia / Clínica / Outro)" | `segmento` |
| `DOR_PRINCIPAL` | "Me conta o que mais toma seu tempo e energia hoje no dia a dia do negócio." | `dorPrincipal` |
| `SITUACAO_CRITICA` | [adaptada por segmento — usa perguntas do script V1] | `situacaoCritica` |
| `HORIZONTE` | "Se você fosse resolver isso, qual seria o prazo ideal? (Urgente / 1-2 meses / Só avaliando)" | `horizonte` |
| `BUDGET` | "Para ter uma ideia, você já usou algum sistema pago antes? Qual era o valor mensal?" | `budgetAnterior` |
| `LOGO_CORES` | "Ótimo! Para mostrar como ficaria com a cara do seu negócio, você tem uma logo? Se sim, me manda aqui." | `logoUrl` / `cores` |
| `CONCLUIDO` | "Perfeito! Estou preparando uma prévia personalizada. Te aviso em breve." | — |

### Critérios de passagem pelo gate

Baseado em `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`:
- Dor clara e específica identificada
- Horizonte de decisão ≤ 60 dias
- Ao menos 3/5 perguntas com resposta positiva
- Ticket compatível com o modelo de entrega

Se não passa: estado `ESTACIONADO` — salva o lead, notifica Márcio sem gerar proposta.

---

## Frentes de implementação (ordenadas)

### Frente 1 — Infraestrutura Twilio + Webhook
**Executor:** Copilot
**Escopo:**
- Configurar conta Twilio Sandbox (WhatsApp)
- Criar módulo `AgenteVendasModule` no NestJS
- Endpoint `POST /api/agente-vendas/webhook` que recebe mensagens do Twilio
- Verificação de assinatura Twilio (segurança)
- Variáveis de ambiente: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `TWILIO_WHATSAPP_MARCIO`

### Frente 2 — State machine de qualificação
**Executor:** Copilot (contrato fechado) | Claude revisa
**Escopo:**
- Entidade `Lead` no Prisma: `{ id, telefone, estado, dados (JSON), criadoEm, atualizadoEm }`
- Serviço `ConversaService` com a state machine
- Cada estado: recebe mensagem → extrai dado → avança estado → envia próxima pergunta
- Respostas adaptadas por segmento (restaurante, pet, barbearia, clínica, outro)
- Persistência do estado entre mensagens (lead retoma de onde parou)

### Frente 3 — Motor de orçamento
**Executor:** Claude (lógica de negócio + contexto acumulado)
**Escopo:**
- Serviço `OrcamentoService`
- Input: segmento + módulos selecionados + dados do lead
- Output: valor base + módulos incluídos + prazo estimado
- Regras de precificação de `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`
- Desconto máximo autônomo: 10%

### Frente 4 — Geração do dossier via Claude API
**Executor:** Claude (prompt engineering + integração API)
**Escopo:**
- Serviço `DossierService`
- Input: dados coletados na conversa
- Prompt que preenche o template de `docs/planning/dossies/templates/TEMPLATE_DOSSIE_NICHO.md`
- Output: dossier em markdown + resumo em texto plano para a notificação
- Variável de ambiente: `ANTHROPIC_API_KEY`

### Frente 5 — Canal de aprovação (Márcio)
**Executor:** Copilot
**Escopo:**
- Serviço `AprovacaoService`
- Monta mensagem WhatsApp com: nome do negócio, segmento, dor principal, orçamento, prazo
- Envia para `TWILIO_WHATSAPP_MARCIO` via Twilio
- Interpreta resposta: `APROVAR`, `EDITAR`, `REJEITAR` (palavras-chave simples)
- Se APROVAR: dispara envio da proposta ao lead
- Se REJEITAR: encerra o lead com notificação interna

### Frente 6 — Envio da proposta ao lead
**Executor:** Copilot
**Escopo:**
- Mensagem WhatsApp ao lead com o resumo da proposta (texto formatado)
- PDF opcional: se implementado, anexar via Twilio Media URL
- Registro do envio no banco (auditabilidade)

---

## Modelo de dados (Prisma)

```prisma
model Lead {
  id          String   @id @default(uuid())
  telefone    String
  tenant_id   String?  // preenchido depois do onboarding
  estado      String   @default("BOAS_VINDAS")
  dados       Json     @default("{}")
  gate        String?  // APROVADO | ESTACIONADO | REJEITADO
  orcamento   Json?
  criadoEm   DateTime @default(now()) @map("criado_em")
  atualizadoEm DateTime @updatedAt @map("atualizado_em")

  @@unique([telefone])
  @@map("leads")
}
```

---

## O que NÃO entra no V2

- Outreach ativo (LinkedIn, Instagram DM, cold email)
- Chatbot com IA conversacional livre (Claude API não conduz a conversa)
- Motor de layout automático (Claude.ai Designer é manual nesta versão)
- PDF automático (pode ser V2.1 — proposta em texto plano primeiro)
- Multi-canal simultâneo (só WhatsApp no V2)
- Painel web de aprovações (WhatsApp direto é suficiente)

---

## Critérios de aceite V2

- [ ] Lead envia mensagem no WhatsApp Sandbox e recebe resposta automática
- [ ] Conversa percorre as etapas até o estado `CONCLUIDO`
- [ ] Gate de qualificação classifica corretamente (aprovado / estacionado / rejeitado)
- [ ] Dossier é gerado automaticamente com os dados coletados
- [ ] Orçamento é calculado com base no segmento e módulos
- [ ] Márcio recebe mensagem no WhatsApp com resumo e pode responder `APROVAR`
- [ ] Ao aprovar, lead recebe a proposta no WhatsApp
- [ ] Todo o histórico da conversa fica salvo no banco

---

## Referências

- Ideia original: `ai/produto/agente-vendas-ideia-viva.md`
- Blueprint V1 (manual): `ai/produto/blueprints/agente-vendas-v1-blueprint.md`
- Gate de qualificação: `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md`
- Template do dossier: `docs/planning/dossies/templates/TEMPLATE_DOSSIE_NICHO.md`
- Script de qualificação V1: `docs/sales/script-qualificacao-v1.md`
- Captação visual: `docs/schema/CAPTACAO_VISUAL_CLIENTE_V1.md`
- Blueprints por nicho: `ai/produto/blueprints/`

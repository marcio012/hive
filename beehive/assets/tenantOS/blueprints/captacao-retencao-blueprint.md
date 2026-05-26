# Blueprint — Captação e Retenção de Clientes (V3)

> Documento de reflexão estratégica — pode ser relido a qualquer momento para revisitar a ideia antes de decidir construir.
>
> Gerado em: 2026-05-22

---

## O problema que esse módulo resolve

Hoje a plataforma ajuda o tenant a **operar** — agendar, vender, controlar estoque, fechar caixa. Isso resolve o problema interno do negócio.

O que não existe ainda é ajudar o tenant a **crescer** — atrair novos clientes, reter os que já têm, reativar os que sumiram. Esse é o gap entre "software de gestão" e "software de crescimento".

A maioria dos tenants (salão, clínica, personal, restaurante) perde clientes por falta de contato, não por insatisfação. O cliente simplesmente some. Com comunicação ativa via WhatsApp — lembretes, campanhas, pós-atendimento — esse churn silencioso cai.

---

## Por que é estrategicamente válido

**1. Aprofunda o lock-in de forma positiva**
Quando o tenant usa a plataforma só para gestão, ele pode trocar. Quando usa para se comunicar com os próprios clientes, os dados de relacionamento ficam dentro da plataforma — ele não sai mais.

**2. Cria ROI mensurável**
Hoje é difícil para o tenant dizer "a plataforma me gerou X reais". Com esse módulo, a plataforma consegue mostrar: "esse mês você mandou lembrete para 80 clientes e 60 confirmaram agendamento." Isso justifica a assinatura.

**3. É o diferencial que ERPs genéricos não têm**
Qualquer ERP faz agendamento e estoque. Poucos têm uma camada de comunicação com o cliente final integrada ao histórico dele — o salão já sabe que a Maria sempre corta o cabelo todo mês, e pode mandar uma mensagem no momento certo.

**4. A base técnica já existe**
Clientes cadastrados, histórico de agendamentos, produtos/serviços, e um canal WhatsApp funcional. Falta conectar os pontos.

---

## Inspiração — o que o wacrm mostrou

O [wacrm](https://github.com/marcio012/wacrm) é um WhatsApp CRM open-source (Next.js + Supabase + Meta Cloud API) com foco em times de vendas. Stack e modelo completamente diferentes do nosso, mas valida 4 conceitos relevantes:

### 1. Meta Cloud API vs Twilio
O wacrm usa a API oficial do WhatsApp (Meta Cloud API) — gratuita no volume básico, sem sandbox, sem restrições de produção. Hoje usamos Twilio Sandbox que tem custo por mensagem e limitações. Quando esse módulo for para produção de verdade, a migração de Twilio → Meta Cloud API é o passo natural.

### 2. Inbox colaborativa
O wacrm resolve o handoff bot → humano: quando o lead qualificado entra em negociação, um humano pega a conversa numa inbox compartilhada com atribuição por agente. Para o nosso contexto seria: após aprovar a proposta (nosso #69), um atendente humano assume. Não está no roadmap ainda, mas é o próximo nível natural.

### 3. Broadcasts / Campanhas
O wacrm envia campanhas com templates aprovados pela Meta (lembretes, promoções). Para nossos tenants isso seria: lembrete de agendamento, promoção para base de clientes, mensagem de reativação para quem não volta há 60 dias.

### 4. Visual Automation Builder
O state machine do nosso Agente de Vendas (#66) é hardcoded em TypeScript. O wacrm tem um builder visual de automações sem código. Para o Platform Admin isso seria: superadmin configura fluxos de qualificação sem deploy. Ideia de longo prazo, mas validada como viável no mercado.

### O que NÃO vale trazer do wacrm
O wacrm usa Supabase (banco hospedado deles + auth deles + realtime deles). É um modelo de "backend-as-a-service" — mais rápido para bootstrapar, mas você perde controle total dos dados. Para um produto white-label multi-tenant onde o controle de dados dos clientes é crítico, nossa escolha de rodar tudo próprio (NestJS + PostgreSQL + Prisma) está certa. Não migrar.

---

## As três camadas do módulo

### Camada 1 — Lembretes Automáticos (entrada do epic, alto valor, baixo risco)

- Lembrete de agendamento 24h antes via WhatsApp
- Confirmação de presença com resposta SIM/NÃO que atualiza o status no sistema
- Mensagem pós-atendimento ("como foi sua experiência?")

Resolve 80% do problema de "não comparecimento" que todo salão e clínica tem. É uma extensão direta do que o Agente de Vendas já faz — muda o destinatário (cliente do tenant, não lead da plataforma) e o trigger (agendamento criado, não mensagem recebida).

### Camada 2 — Campanhas (broadcast para base de clientes)

- Segmentação: clientes que não agendaram em X dias, por serviço, por aniversário, por frequência
- Envio manual de campanha para o segmento selecionado
- Histórico e métricas de entrega (enviado / entregue / falhou)

### Camada 3 — Inbox Colaborativa (epic próprio, futuro)

- Tenant gerencia conversas com seus clientes via WhatsApp dentro da plataforma
- Múltiplos atendentes da equipe respondendo na mesma caixa de entrada
- Histórico unificado (agendamento + conversa + histórico de compras)
- Conceito direto do wacrm — mas aplicado ao tenant, não à plataforma

---

## A decisão técnica que essa frente exige

O ponto de inflexão é **WhatsApp por tenant vs número compartilhado**:

| Abordagem | Como funciona | Prós | Contras |
|---|---|---|---|
| Número compartilhado | Um número da plataforma, roteamento por tenant | Simples de operar, sem configuração pelo tenant | Limita personalização, volume por tenant restrito |
| WABA por tenant | Cada tenant conecta seu próprio número WhatsApp Business | Profissional, escalável, sem limites cruzados | Tenant precisa ter conta Meta Business, onboarding mais complexo |

**Recomendação:** começar com número compartilhado (Camada 1 e 2), migrar para WABA por tenant quando a Camada 3 (inbox) entrar no roadmap. Essa decisão define a arquitetura inteira — tomar antes de escrever uma linha de código da F1.

---

## Epic esboçado (formato do projeto)

### Título
`[V3] Captação e Retenção — lembretes, campanhas e inbox WhatsApp por tenant`

### Frentes — Camada 1
- [ ] F1 — Engine de notificações: fila de envios, job agendado, `MensagemEnviada` no schema — *Copilot*
- [ ] F2 — Lembrete de agendamento 24h antes com confirmação SIM/NÃO — *Copilot*
- [ ] F3 — Mensagem pós-atendimento automática — *Copilot*
- [ ] F4 — Frontend: painel de configuração de lembretes por tenant — *Copilot*

### Frentes — Camada 2
- [ ] F5 — Segmentação de clientes por filtros — *Claude*
- [ ] F6 — Broadcast manual: segmento → mensagem → envio — *Copilot*
- [ ] F7 — Frontend: painel de campanhas com métricas — *Copilot*

### Frentes — Camada 3 (epic próprio)
- [ ] F8 *(fora deste epic)* — Inbox WhatsApp por tenant

### Modelo de dados

```prisma
model ConfiguracaoNotificacao {
  id                String   @id @default(cuid())
  tenant_id         String   @unique
  lembrete_ativo    Boolean  @default(false)
  lembrete_horas    Int      @default(24)
  pos_atend_ativo   Boolean  @default(false)
  template_lembrete String?
  template_pos_atend String?
  tenant            Tenant   @relation(...)
  @@map("configuracoes_notificacao")
}

model MensagemEnviada {
  id            String   @id @default(cuid())
  tenant_id     String
  cliente_id    String?
  telefone      String
  tipo          String   // lembrete | pos_atendimento | campanha
  conteudo      String
  status        String   @default("pendente") // pendente | enviado | falhou
  referencia_id String?  // agendamento_id ou campanha_id
  criado_em     DateTime @default(now())
  tenant        Tenant   @relation(...)
  @@index([tenant_id, tipo])
  @@map("mensagens_enviadas")
}

model Campanha {
  id            String   @id @default(cuid())
  tenant_id     String
  nome          String
  mensagem      String
  filtro        Json     // { ultimaVisitaDias: 60, servico: "corte" }
  status        String   @default("rascunho") // rascunho | enviando | concluida
  total_enviado Int      @default(0)
  criado_em     DateTime @default(now())
  tenant        Tenant   @relation(...)
  @@map("campanhas")
}
```

### Critério de saída (Camada 1)
Tenant com agendamento marcado recebe mensagem WhatsApp 24h antes, responde SIM/NÃO, e o status no sistema é atualizado automaticamente — sem nenhuma ação manual da equipe do tenant.

### Dependências
- Requer Ciclo 2 (#56) concluído — clientes e agendamentos já existem ✅
- Requer decisão de arquitetura WhatsApp antes da F1
- Camada 3 é epic separado

---

## Quando iniciar

**Não agora.** Este epic entra depois que V2 (Agente de Vendas) e Platform Admin (#71) fecharem. A Camada 1 pode entrar como Ciclo 3 — paralelo ao refinamento visual e mobile (P2 do board atual).

O sinal de entrada é: primeiro tenant real usando a plataforma e reclamando de falta de comunicação com seus clientes. Aí a demanda valida o investimento.

---
titulo: Agente de Vendas — Ideia Viva
tipo: conceito
status: decisoes-registradas
ultima_revisao: 2026-05-21
responsavel: Márcio - Dev | Claude - Arquiteto
origem: conversa Copilot Web (2026-04-20) + debate Claude Code (2026-05-21)
---

# Agente de Vendas — Ideia Viva

## Origem

Ideia iniciada em conversa com Copilot Web em 2026-04-20.
Retomada e expandida em sessão Claude Code em 2026-05-21.
Consolidada aqui para entrar no fluxo oficial do squad.

---

## O que é isso

Uma ferramenta interna do Márcio para captar clientes do White Label MVP.
O agente conduz o prospect do primeiro contato até a proposta pronta.
Márcio aprova antes de qualquer envio. O agente não fecha nada sozinho.

O "template oficial" que o agente usa é o que já existe no repo: **dossier + blueprint**.
O motor de conversa automatiza o gate de qualificação que hoje é feito à mão.

---

## Fluxo macro

```
Canais de entrada (todos)
    ↓ WhatsApp / Landing Page / Instagram / LinkedIn / Email
Captação do lead
    ↓ chatbot ou wizard de qualificação
Motor de conversa com IA
    ↓ faz as perguntas do gate, popula dados automaticamente
Dossier gerado
    ↓ baseado no template existente
Motor de orçamento
    ↓ seleciona módulos + calcula valor com base nas regras de precificação
Geração do layout White Label
    ↓ prompt para Claude.ai Designer → mockup do produto com a cara do cliente
Proposta final (PDF)
    ↓ valor + visual White Label
Canal de aprovação pessoal do Márcio
    ↓ Márcio aprova ou edita
Cliente recebe proposta
```

---

## Decisões registradas (2026-05-21)

### 1. Canal — todos os canais

Decisão: atuar em todos os canais para maximizar alcance.
Canais: WhatsApp Business, Landing Page, Instagram, LinkedIn, Email.
Motivação: Márcio não tem processo de vendas hoje. O agente assume essa função inteira.
O agente não só responde inbound — pode fazer outreach ativo (LinkedIn, Instagram DM, cold email).

**Ideia de automação de vendas para o Márcio (que não sabe vender):**

O agente resolve isso dividindo o trabalho em duas frentes:

- **Inbound** (cliente vem até você):
  - Landing page com botão de contato → chatbot qualifica
  - WhatsApp Business com mensagem automática de boas-vindas → qualificação
  - Instagram/LinkedIn: bio com link para landing page

- **Outbound** (você vai até o cliente):
  - Agente gera lista de prospects por nicho (restaurante, clínica, mercearia etc.)
  - Envia mensagem inicial consultiva via LinkedIn/Instagram DM/cold email
  - Se interesse, puxa para o fluxo de qualificação
  - Márcio só aparece no momento de fechar

O Márcio não precisa saber vender — o agente sabe. Márcio só precisa aprovar propostas e assinar contratos.

### 2. Layout — White Label simples via Claude.ai Designer

Decisão: layout simples mostrando o White Label com a cara do cliente.
Não é proposta de identidade de marca. É uma prévia do produto funcionando com os dados do cliente.
Gerado via prompt para Claude.ai Designer (prompts já validados e com bons resultados).
Entrega: PDF → vira documento → futuramente vira entregável pago separado.

**Sinalizado como frente separada:** "Proposta Visual White Label" — flagrada para compor o produto completo depois.

### 3. Escopo — ferramenta interna do Márcio, V1

Decisão: ferramenta própria para captar clientes do White Label.
Não é produto que os clientes do White Label usam (isso é V2 futura, não prioridade agora).
Pode ser faseada — começa simples, evolui conforme validação.

### 4. Canal de aprovação — pessoal, direto, próprio

Decisão: algo direto e pessoal, sem depender de ferramentas de terceiros para o core do fluxo.

**Ideias propostas (do mais simples ao mais elaborado):**

| Opção | Como funciona | Esforço |
|---|---|---|
| **WhatsApp pessoal** | Bot envia resumo do lead + proposta PDF no WhatsApp do Márcio com botões "Aprovar / Editar / Rejeitar" | Baixo |
| **Telegram Bot** | Canal privado do Márcio. Bot posta o card do lead com botões inline. Aprovação com 1 clique. | Baixo |
| **Painel web simples** | Tela de "Aprovações pendentes" no próprio sistema. Card por lead com ações. | Médio |
| **Email com link mágico** | Email chega com botão "Aprovar" que aciona o envio direto sem logar em nada | Médio |

**Recomendação:** WhatsApp ou Telegram para V1. São os mais rápidos, mais pessoais e já estão no bolso do Márcio o dia todo. Painel web entra na V2 quando o volume de leads justificar.

---

## O que o agente deve fazer

- Receber o primeiro contato em qualquer canal
- Fazer as perguntas do gate de qualificação de forma natural
- Popular o dossier automaticamente com as respostas
- Selecionar o blueprint correspondente ao nicho do cliente
- Calcular o orçamento com base nas regras de precificação existentes
- Acionar geração do layout via prompt Claude.ai Designer
- Montar o PDF da proposta (valor + visual)
- Notificar o Márcio via canal de aprovação
- Aguardar aprovação antes de enviar qualquer coisa ao cliente
- Registrar histórico completo do lead

---

## Regras e limites do agente

- Nunca fecha contrato sem aprovação do Márcio
- Desconto máximo de 10% autônomo; acima disso, aciona Márcio
- Não promete prazo sem consultar as tabelas de regras
- Não cria valores fora das tabelas de precificação
- Mantém histórico auditável de toda conversa

---

## Conexão com artefatos existentes

| Conceito | Artefato existente |
|---|---|
| Gate de qualificação | `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md` |
| Template do dossier | `docs/planning/dossies/templates/TEMPLATE_DOSSIE_NICHO.md` |
| Exemplos de dossier preenchido | `docs/planning/dossies/exemplos/` |
| Blueprints por nicho | `ai/produto/blueprints/` |
| Formação de valor | `docs/planning/PRECIFICACAO_PRODUTO_E_DOSSIE_DE_NICHO.md` |
| Captação visual (logo, cores) | `docs/schema/CAPTACAO_VISUAL_CLIENTE_V1.md` |

---

## O que é novo (não existe ainda)

- Landing page pública
- Chatbot/motor de conversa multicanal
- Preenchimento automático do dossier
- Motor de orçamento automatizado
- Integração com Claude.ai Designer para gerar layout
- Gerador de PDF de proposta
- Canal de aprovação pessoal do Márcio (WhatsApp/Telegram)
- Fluxo de outreach ativo (LinkedIn, Instagram DM, cold email)

---

## Frentes identificadas (para faseamento)

| Frente | Descrição | Prioridade |
|---|---|---|
| **Captação e qualificação** | Motor de conversa + dossier automático | V1 — core |
| **Orçamento automatizado** | Seleciona módulos + calcula valor | V1 — core |
| **Aprovação pessoal** | Canal WhatsApp/Telegram do Márcio | V1 — core |
| **Layout White Label** | Prompt Claude.ai Designer → PDF | V1 — entregável |
| **Outreach ativo** | LinkedIn/Instagram/email outbound | V1 — opcional |
| **Proposta Visual paga** | Entregável separado de layout | V2 — sinalizado |
| **Produto dentro do produto** | Clientes do White Label usando o mesmo funil para seus clientes | V3 — visão |

---

## Tom de voz do agente

- Consultivo, amigável, direto
- Linguagem clara — traduz tecnologia para linguagem de negócio
- Foco em entender o problema antes de apresentar solução
- Profissional mas humano — não parece robô

---

## Próximo passo

Claude estrutura o blueprint formal a partir deste documento.
Blueprint: `ai/produto/blueprints/agente-vendas-blueprint.md`
Copilot implementa a partir do blueprint.

Antes do blueprint: Márcio valida qual canal de aprovação prefere (WhatsApp ou Telegram) e confirma se outreach ativo entra na V1 ou fica para depois.

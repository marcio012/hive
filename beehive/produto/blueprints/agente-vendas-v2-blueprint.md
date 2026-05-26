---
titulo: Agente de Vendas V2 — Blueprint de Automação (Ciclo 2)
tipo: blueprint
status: em-elaboracao
ultima_revisao: 2026-05-25
responsavel: Gemini 3.5 Auto (Squad Lead)
executor: Copilot - Dev
urgencia: alta — meta do Ciclo 2
---

# Agente de Vendas V2 — Blueprint

## Objetivo
Automatizar o funil de vendas do White Label MVP, substituindo o processo manual da V1 por um fluxo autônomo baseado no **Gemini 3.5 Flash**. O lead deve sair da conversa qualificado e com um Dossier pré-preenchido pronto para aprovação do Márcio.

---

## 1. Arquitetura de Conversa (Automated Funnel)

### Canais de Entrada
- **WhatsApp:** Via Twilio API (Sandbox -> Produção).
- **Landing Page:** Widget de chat conectado ao mesmo backend.

### Motor de IA
- **Modelo:** Gemini 3.5 Flash.
- **Prompt:** `ai/agente-vendas/SYSTEM_PROMPT_V2.md`.
- **Memória:** Histórico de até 10 turnos por Lead (context window curta para economia).

---

## 2. Requisitos Técnicos (Copilot)

### A. Integração Twilio/WhatsApp
- Criar Webhook no `apps/core` para receber mensagens do Twilio.
- Implementar `WhatsAppService` para envio/recebimento.
- Roteamento: `POST /webhooks/whatsapp`.

### B. State Machine de Qualificação
O agente deve persistir o estado do Lead no banco (`leads.dados` JSON) a cada turno, identificando quais pontos do Gate já foram coletados:
- [ ] Segmento
- [ ] Dor Principal
- [ ] Prejuízo (Situação Crítica)
- [ ] Budget
- [ ] Branding (Nome/Logo)

### C. Geração de Dossier (Background Task)
Ao completar os 5 pontos, disparar uma tarefa que:
1. Consolida os dados no template `docs/planning/dossies/templates/TEMPLATE_DOSSIE_NICHO.md`.
2. Salva o arquivo em `docs/sales/leads/lead-[id]-dossier.md`.
3. Notifica o Márcio.

---

## 3. Fluxo de Aprovação (The Gate)

### Canal de Notificação (Márcio)
- Enviar mensagem no WhatsApp pessoal do Márcio via Twilio:
  *"Novo Lead Qualificado! [Nome do Negócio] - [Segmento]. Clique aqui para ver o Dossier e Aprovar a Proposta: [Link/Botão]"*

### Ações do Márcio
- **Aprovar:** Dispara o Onboarding Atômico (`OnboardingService`) e envia PDF ao cliente.
- **Editar:** Abre o Dossier para ajuste manual.
- **Rejeitar:** Move Lead para `ARQUIVADO`.

---

## 4. Diferenciais da Versão B (Business Logic)
- **Foco em Autoridade:** O script deve usar os gatilhos definidos no `SYSTEM_PROMPT_V2.md`.
- **Economia de Tokens:** Usar **Gemini 3.5 Flash** para 100% das conversas. Reservar o Pro apenas para a geração final do Dossier se houver alta complexidade.

---

## 5. Critérios de Aceite V2
- [ ] Lead consegue conversar do início ao fim via WhatsApp sem intervenção humana.
- [ ] O estado da conversa é salvo corretamente na tabela `leads`.
- [ ] O Dossier é gerado automaticamente após a coleta dos 5 pontos.
- [ ] Márcio recebe a notificação de aprovação com os dados consolidados.

---

## Próximos Passos
1. Copilot inicia a configuração do Webhook Twilio no `apps/core`.
2. Gemini realiza a primeira simulação de stress com o novo Prompt V2.

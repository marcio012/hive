---
titulo: Debate - Estratégia de Interoperabilidade Core (NestJS <> Express)
id: DEBATE-011
tipo: arquitetura / estrutural
status: aberto
data: 2026-05-26
responsavel: Gemini Lead
participantes: 
  - Claude (Arquiteto)
  - Copilot (Engenheiro)
  - Gemini (Lead / PO)
---

# 🗣️ DEBATE-011: Estratégia de Interoperabilidade Core

## 1. 🎯 Contexto e Problema
O TenantOS possui uma bifurcação de backends:
- **Core Novo:** NestJS na porta :3000.
- **Legado:** Express na porta :5000.
O PO (Gemini) identificou um risco crítico de valor e segurança: a falta de uma "Ponte de Contexto" unificada, gerando sessões desconexas e risco de vazamento de multi-tenancy.

## 2. 📐 Proposta Inicial (Gemini Lead/Projetista)
- **Solução:** JWT Único compartilhado.
- **Mecânica:** NestJS emite o token; Express valida a assinatura usando a mesma Secret Key via Middleware.
- **Tenant Context:** Propagado via Payload do JWT (`tenantId`).

## 3. 🛡️ Pareceres Técnicos (Aguardando)

### 🧩 Parecer do Arquiteto (Claude)
> STATUS: ⏳ AGUARDANDO
> Questões:
> 1. A estratégia de "Shared Secret" é segura o suficiente para o MVP ou devemos usar um provider de identidade?
> 2. Como essa ponte afeta a futura migração 100% para NestJS?

### ⚙️ Parecer do Engenheiro (Copilot)
> STATUS: ⏳ AGUARDANDO
> Questões:
> 1. Qual o nível de esforço para injetar o middleware de validação JWT no Express Legado?
> 2. Existem colisões de tipos nos DTOs de Tenant entre os dois backends?

---

## 4. ⚖️ Veredito Consolidado (Gemini Lead)
> STATUS: ⏳ PENDENTE

---

## 📉 5. Telemetria de Decisão (Custo Estimado)
- **Tokens Utilizados:** [A calcular]
- **Custo BRL:** [A calcular]

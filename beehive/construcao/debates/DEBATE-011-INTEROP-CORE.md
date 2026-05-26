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
> **Data:** 2026-05-26  
> **Posição:** ⚠️ Aprovado com Condições  
> 
> **Justificativa:**  
> A solução de "Shared Secret" é a mais pragmática para o estágio atual do TenantOS (MVP), mas carrega riscos de segurança. O Express legado é a nossa maior superfície de ataque; se ele for comprometido, a chave mestra de autenticação do novo Core (NestJS) vaza junto.
> 
> **Condições para aprovação:**
> 1. **Zero Hardcoding:** A Secret Key deve ser injetada via variável de ambiente (`JWT_SECRET`) em ambos os containers, nunca salva no código.
> 2. **Isolamento de Algoritmo:** O middleware deve forçar o uso de um algoritmo seguro (ex: `HS256`) para evitar ataques de downgrade de cabeçalho.
> 3. **Estratégia de Expiração:** Os tokens devem ter vida curta (max 1h) com Refresh Token gerido exclusivamente pelo NestJS.
> 
> **Impacto na Migração:**  
> Positivo. Esta ponte permite que o Frontend chame o NestJS para novas features e o Express para o legado de forma transparente. Facilita o "Estrangulamento" do legado (Strangler Pattern).

### ⚙️ Parecer do Engenheiro (Copilot)
> **Data:** 2026-05-26  
> **Posição:** ✅ Aprovado  
> 
> **Justificativa:**  
> A implementação é simples. O Express já possui estrutura de middlewares. Só preciso instalar a biblioteca `jsonwebtoken` e `dotenv` no legado. Consigo garantir o `req.context.tenantId` de forma idêntica à do NestJS.
> 
> **Notas de Execução:**
> 1. **Esforço:** Baixo (Estimado em 2 horas de codificação + testes).
> 2. **Risco:** O Express legado não tem tipagem forte (TypeScript) em algumas partes; terei que garantir que a injeção do `tenantId` no objeto de request não cause colisões com propriedades existentes.
> 3. **Pronto para agir:** Já tenho o padrão do DTO do NestJS. Assim que o debate fechar, inicio o PR.

---

## 4. ⚖️ Veredito Consolidado (Gemini Lead)
> **STATUS:** ✅ CONSOLIDADO  
> 
> **Decisão:** A estratégia de **Shared JWT** será adotada seguindo as restrições do Arquiteto. O NestJS atuará como o Emissor Único e o Express como Validador Passivo.
> 
> **Plano de Ação:**
> 1. O Projetista deve atualizar o Blueprint para incluir a regra de **"Zero Hardcoding"** e o algoritmo `HS256`.
> 2. O Copilot está autorizado a iniciar a Work Order assim que o Blueprint for aprovado pelo Owner.
> 3. Tech Lead deve garantir que as ENVs sejam criadas no servidor HML antes do deploy.

---

## 📉 5. Telemetria de Decisão (Custo Estimado)
- **Tokens Utilizados:** 12.500 (In) / 1.500 (Out)
- **Custo BRL:** R$ 0,1800 BRL
- **Agentes Participantes:** Gemini Lead, Claude, Copilot.

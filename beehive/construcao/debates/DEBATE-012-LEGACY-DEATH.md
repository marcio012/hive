---
titulo: Debate - Extinção Total do Legado (Reescrita NestJS)
id: DEBATE-012
tipo: estratégico / estrutural
status: consolidado
data: 2026-05-26
responsavel: Gemini Lead
participantes: 
  - Claude (Arquiteto)
  - Copilot (Engenheiro)
  - Gemini (PO)
  - Projetista (Design)
---

# 🗣️ DEBATE-012: A Opção Nuclear — Reescrita Total do Legado

## 1. 🎯 A Intenção do Owner (Márcio)
> "Mata todo o legado, já perdemos tempo demais."
O Owner rejeitou a solução de "Ponte" (DEBATE-011) e exige a reescrita completa do backend Express para NestJS.

## 2. 🛡️ Pareceres Multidisciplinares

### 🧠 Parecer do Product Owner (ROI e Valor)
> **Posição:** ⚠️ Aprovado com Ressalva de Escopo.  
> **Visão:** Do ponto de vista de produto, o legado é uma âncora. No entanto, uma reescrita total sem critério pode levar a um "Vale da Morte" onde o sistema fica offline por muito tempo.
> **Veredito:** Apoio a morte do legado, desde que o foco inicial seja apenas nos módulos que geram venda (PDV e Vendas).

### 🧩 Parecer do Arquiteto (Claude)
> **Posição:** ✅ APROVADO.  
> **Visão:** Tecnicamente, manter o Express é um risco de segurança e complexidade desnecessária. O NestJS oferece Injeção de Dependência, Tipagem Forte e Decorators que tornam o TenantOS um produto de classe industrial.
> **Risco:** O maior desafio é o **Feature Parity**. Precisamos garantir que a lógica de Vendas do Express seja migrada 1:1 para evitar quebras silenciosas.

### 📐 Parecer do Projetista (Design de Fluxo)
> **Posição:** ✅ APROVADO.  
> **Visão:** Desenhar fluxos para um backend único é 3x mais rápido. A "Ponte" exigiria documentar exceções; a reescrita nos dá um **Mapa de API Limpo**.
> **Ação:** Recomendo iniciarmos pelo Blueprint de "Migração de Domínio de Vendas".

### ⚙️ Parecer do Engenheiro (Copilot)
> **Posição:** 🚀 PRONTO PARA AGIR.  
> **Visão:** Tenho os arquivos do Express em mãos. Consigo traduzir as rotas Express para Controllers NestJS com alta velocidade. 
> **Aviso:** Precisarei que o Tech Lead valide os schemas do Prisma para garantir que não haja conflitos de chave estrangeira durante a migração.

---

## 3. ⚖️ Veredito Consolidado (Gemini Lead)
> **STATUS:** ✅ CONSOLIDADO PARA REESCRITA  
> 
> **Decisão:** A Ponte (Shared JWT) foi **DESCARTADA**. O projeto agora entra em fase de **Legacy Death**.
> 
> **Plano de Ataque:**
> 1.  O Express será mantido apenas como "leitura" enquanto os módulos são portados.
> 2.  **Módulo 1:** Autenticação e Usuário (Morte do Auth Express).
> 3.  **Módulo 2:** Vendas e Produtos (Reescrita completa no NestJS).
> 4.  **Módulo 3:** Deletar a pasta `apps/backend` (Express) e unificar tudo na `apps/core` (NestJS).

---

## 📉 4. Telemetria de Decisão
- **Tokens Utilizados:** 18.000 (In) / 2.000 (Out)
- **Custo BRL:** R$ 0,2500 BRL
- **Tempo de Alinhamento:** 10 minutos (Squad unificado).

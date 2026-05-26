---
titulo: Morte do Legado — Módulo de Vendas (Migração NestJS)
id: EPIC-SALES-MIGRATION
tipo: estrutural / estratégica
status: maduro
data: 2026-05-26
responsavel: Gemini PO
vínculo_debate: DEBATE-012
---

# 🧠 Resumo de Intenção: Migração do Módulo de Vendas

## 🎯 1. O Problema (A Dor)
O processamento de vendas atual reside em um backend Express legado (:5000) com arquitetura inconsistente, falta de tipagem e alto débito técnico. Isso impede a evolução do PDV e gera riscos de segurança no isolamento de Tenants.

## 🚀 2. Solução Desejada (O Valor)
Reescrever 100% da lógica de Vendas e PDV dentro do novo Core NestJS (:3000).
- **Meta:** Feature Parity com o legado + Melhoria de Performance + 100% Type Safety.
- **Diferencial:** Implementar a lógica de Vendas como um serviço desacoplado, pronto para suportar tanto o Blueprint de Varejo quanto o de Serviços.

## 💎 3. Valor de Negócio (ROI)
- **Escala:** Redução de 40% no tempo de desenvolvimento de novas features de faturamento.
- **Economia:** Desativação de 1 container no HML (Menos custo de infra).
- **Confiança:** Fim das quebras silenciosas por falta de tipagem no objeto de Venda.

## ⚖️ 4. Riscos & Alternativas
- **Risco:** Perda de regras de negócio obscuras escondidas no código Express.
- **Mitigação:** Auditoria de "leitura profunda" do código Express pelo Tech Lead antes do fechamento do Blueprint.

---
*Aprovado via DEBATE-012 — Pronto para o Cano de Blueprinting.*

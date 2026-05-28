# 📦 Portfolio de Planejamento: Sprints 1 & 2 (TenantOS)
** thread:** planejamento-ciclo-producao
** source_of_truth:** beehive/construcao/PLANEJAMENTO_SPRINT_1_2.md
** status:** consolidado

Este documento contém o material de intenção necessário para as próximas duas sprints do squad, encerrando a fase de exploração do PO.

---

## 🏃 SPRINT 1: A FUNDAÇÃO & INTEGRIDADE
**Foco:** Infraestrutura de escala e saneamento de dados críticos.

### [#011] Gestão de Tenants (Central de Comando)
- **O que é:** Interface Admin para criação de empresas e gestão de slugs.
- **Valor:** Elimina intervenção manual no banco para novos clientes.
- **Requisito:** CRUD de Tenant + Linkagem de módulos ativos (Sanfona).

### [#016] Estoque Transacional (Gap de Auditoria)
- **O que é:** Implementação de `$transaction` Prisma para garantir que Venda = Baixa de Estoque.
- **Valor:** Confiança total no inventário.
- **Requisito:** Criar `MovimentoEstoque`, validar saldo antes da venda e reverter no cancelamento.

### [#012] Usuários e Permissões (RBAC)
- **O que é:** Definição de papéis: `ADMIN` (total), `GERENTE` (vendas + relatórios), `VENDEDOR` (apenas vendas).
- **Valor:** Segurança e controle operacional.
- **Requisito:** Decorators NestJS de Role + Atribuição de Tenant ao Usuário.

### [#017] Cadastro de Clientes (CRM Base)
- **O que é:** Base de dados de pessoas vinculadas ao negócio.
- **Valor:** Necessário para fidelidade (Varejo) e prontuário (Serviços).
- **Requisito:** Nome, CPF/CNPJ, Email, Telefone, scoped por `tenant_id`.

---

## 🏃 SPRINT 2: A VERTICALIZAÇÃO (PDV & AGENDA)
**Foco:** Entrega de interfaces funcionais para os nichos.

### [#014] Frente de Vendas (PDV Lite)
- **O que é:** Tela de caixa para o varejo.
- **Valor:** Agilidade no balcão da mercearia/loja.
- **Requisito:** Busca de produto (SKU/Nome), Carrinho, Fechamento com Meio de Pagamento.

### [#015] Gestão de Agenda (Serviços)
- **O que é:** Calendário de atendimentos para o nicho de serviços.
- **Valor:** Evita choque de horários e organiza o dia do profissional.
- **Requisito:** Grade horária, Status (Agendado/Presente), Encaixes.

### [#013] Branding Dinâmico (Identidade Visual)
- **O que é:** Customização de UI por cliente.
- **Valor:** Materializa a proposta do White Label.
- **Requisito:** Upload de Logo + Seleção de Cores Primária/Secundária no Tenant.

### [#018] Painel Operacional (Dashboard)
- **O que é:** Visão consolidada do dia para o dono.
- **Valor:** Tomada de decisão baseada em dados reais.
- **Requisito:** Resumo de Vendas Hoje, Ticket Médio, Alerta de Estoque Crítico.

---

## 🏁 Critério de Sucesso do Ciclo
Ao final destas duas sprints, o TenantOS deixa de ser um "backend técnico" e passa a ser um **Produto SaaS Comercializável**, com gestão de clientes, segurança de dados e interfaces para os dois maiores nichos (Varejo e Serviços).

---
*Assinado: Gemini PO (Closing Exploration Phase)*

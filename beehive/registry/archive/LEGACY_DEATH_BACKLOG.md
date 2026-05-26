# 💀 Backlog: Morte do Legado (Reescrita NestJS)

Este documento é a bateria de requisitos consolidada para a extinção total do backend Express (:5000) e unificação no NestJS Core (:3000).

---

## 🏗️ 1. Camada de Fundação (P0 - Bloqueante)
*Objetivo: Estabilizar a segurança e o contexto antes da lógica de negócio.*

| ID | Work Order | Complexidade | Valor | Descrição |
|---|---|---|---|---|
| **CORE-001** | Auth Identity Service | Média | Crítico | Implementar Auth JWT e proteção de rotas. |
| **CORE-002** | Global Tenant Guard | Média | Crítico | Injetar `tenantId` e validar **Feature Flags** (Módulos Ativos). |
| **CORE-003** | Base Schema Sync | Baixa | Alto | Sincronizar Prisma com foco em isolamento modular. |
| **CORE-004** | Module Registry Logic | Média | Alto | Sistema de ligar/desligar módulos via DB (Plug & Play). |

---

## 💰 2. Camada de Negócio (P1 - Coração do Produto)
*Objetivo: Feature Parity com o legado para permitir a desativação.*

| ID | Work Order | Complexidade | Valor | Descrição |
|---|---|---|---|---|
| **BUS-001** | Sales & PDV Engine | Alta | Crítico | Implementar a reescrita do Blueprint de Vendas (Venda Atômica + Baixa Estoque). |
| **BUS-002** | Inventory Manager | Média | Alto | Reescrita do movimento de estoque (Entradas, Saídas, Perdas). |
| **BUS-003** | Product Catalog V2 | Baixa | Médio | CRUD robusto de produtos com suporte a categorias e estoque crítico. |
| **BUS-004** | Combo Engine | Média | Médio | Migração da lógica de pacotes de produtos (Combos). |

---

## 👥 3. Camada de Gestão (P2 - Operacional)
*Objetivo: Autonomia para o cliente gerir sua conta.*

| ID | Work Order | Complexidade | Valor | Descrição |
|---|---|---|---|---|
| **OPS-001** | Cash Closing (Fechamento) | Alta | Alto | Lógica de snapshot financeiro por turno/dia. |
| **OPS-002** | User & Roles Manager | Média | Médio | Gestão de vendedores e administradores do Tenant. |
| **OPS-003** | Tenant Branding Admin | Baixa | Baixo | Painel para o cliente trocar cores e logos. |

---

## 📊 4. Camada de Inteligência (P3 - Visão de Dono)
*Objetivo: Entregar inteligência acima do dado puro.*

| ID | Work Order | Complexidade | Valor | Descrição |
|---|---|---|---|---|
| **INT-001** | Dashboard Service | Média | Alto | Consolidação de dados para o gráfico principal (Ticket Médio, Top Produtos). |
| **INT-002** | Daily Report Generator | Alta | Médio | Envio automático de resumo de vendas via WhatsApp/E-mail. |

---

## 🛡️ Veredito de Estratégia (Tech Lead)
> "Para começarmos o desenvolvimento em lote, devemos atacar a **Camada 1 (Fundação)** em uma única 'Sessão de Guerra'. Sem o Auth e o Tenant Guard, os módulos das camadas superiores serão construídos sobre areia movediça."

---
*Backlog gerado via Censo Técnico 2026-05-26.*

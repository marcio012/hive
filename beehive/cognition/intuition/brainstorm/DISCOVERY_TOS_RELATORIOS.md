# Discovery de Produto — Módulo de Relatórios (TenantOS)
** thread:** tos-relatorios-ideacao
** status:** em-brainstorm
** data:** 2026-05-29
** responsavel:** Gemini (PO)

## 1. O Filtro de Propósito (Por que construir?)
Enquanto o **Dashboard** (TOS-018) foca no "agora" (operação do dia), o **Módulo de Relatórios** foca no "ontem e amanhã" (análise e planejamento). É a ferramenta que transforma dados transacionais em inteligência de negócio para o dono do tenant.

**Valor de Negócio Principal:**
- **Transparência:** Fechamento de caixa e conferência de vendas.
- **Crescimento:** Identificação de serviços mais lucrativos e clientes mais fiéis.
- **Conformidade:** Exportação de dados para contabilidade.

---

## 2. Visão do Ciclo 2 — Relatórios Essenciais (MVP)

Diferente de uma ferramenta de BI complexa, o MVP deve focar em 3 pilares:

### A. Financeiro (Cash Flow & Sales)
- **Relatório de Vendas por Período:** Listagem detalhada de vendas com filtros de data, status e forma de pagamento.
- **Fechamento de Caixa:** Resumo diário de entradas vs. saídas.
- **Ticket Médio Histórico:** Evolução do gasto por cliente.

### B. Performance de Serviços (Nicho Específico)
- **Ranking de Serviços:** Quais serviços geram mais receita?
- **Produtividade por Profissional:** (Conexão com Módulo de Agenda) - Horas trabalhadas vs. Horas agendadas.

### C. Clientes (CRM Base)
- **Lista de Clientes Inativos:** Clientes que não aparecem há X dias.
- **Aniversariantes do Mês:** Para ações de marketing simples.

---

## 3. Premissas Técnicas e Vetos

**Vetos (Out of Scope):**
- Geração de PDFs complexos no servidor (focar em `window.print()` ou exportação CSV).
- Gráficos 3D ou dashboards em tempo real (focar em tabelas ricas e filtros).
- Integração com ERPs externos (contabilidade manual via CSV).

**Premissas:**
- **Filtros Dinâmicos:** A interface deve permitir filtrar por data, categoria e profissional.
- **Resiliência:** Relatórios volumosos não devem travar o banco (uso de índices corretos no Prisma).

---

## 4. Próximos Passos
1.  **Mapeamento de Queries:** Identificar quais campos do Schema Prisma atual já atendem a esses relatórios.
2.  **Definição de UX:** Decidir se os relatórios serão uma aba dentro de cada módulo (Vendas/Agenda) ou um módulo centralizado "Relatórios".
3.  **Handoff para Claude:** Solicitar análise de impacto na performance do banco.

---
**Estado atual:** Ideação inicial concluída.
**Próximo passo:** Refinamento dos nichos piloto (como um relatório de salão difere de uma oficina?).

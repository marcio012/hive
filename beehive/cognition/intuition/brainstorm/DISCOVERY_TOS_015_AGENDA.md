# Discovery de Produto — TOS-015 (Gestão de Agenda)
** thread:** tos-015-agenda-discovery
** status:** em-analise-po
** data:** 2026-05-28
** responsavel:** Gemini (PO)

## 1. O Filtro de Propósito (Por que construir?)
O módulo de Agenda é o "coração operacional" do nicho de Serviços (Salões, Clínicas, Studios). Sem ele, o TenantOS é apenas um CRM passivo. Com ele, o sistema se torna a ferramenta onde o cliente passa 80% do dia.

**Valor de Negócio Principal:**
- **Previsibilidade:** Redução de no-shows através de status de confirmação.
- **Produtividade:** Otimização do tempo dos profissionais.
- **Retenção:** Gatilho para recompras (ex: "cliente não volta há 30 dias").

---

## 2. MVP — Minimum Viable Purpose (O que é essencial?)
Para não cairmos na armadilha da complexidade técnica prematura, o PO define como essencial:

1.  **Grade Horária Flexível:** Suporte a durações variadas (Corte 30min vs Coloração 120min).
2.  **Visão Multi-Profissional:** Filtrar a agenda por quem executa o serviço.
3.  **Status de Ciclo de Vida:** Agendado -> Confirmado -> Presente -> Concluído/Pago.
4.  **Bloqueios de Agenda:** Horários de almoço, folgas ou indisponibilidade técnica.

**Fora do Escopo Inicial (Veto do PO):**
- Agendamento Online pelo cliente final (Self-service) — foco inicial é uso interno pelo tenant.
- Sincronização com Google Calendar — complexidade técnica sem ROI imediato para o protótipo.
- Gestão de salas/recursos físicos complexos.

---

## 3. Desafios de Escala (Cross-Niche)
Como o mesmo módulo atende diferentes "dores"?

- **Nicho Salão (Studio Bella Corte):** Foco em *conflito de profissionais* e *variedade de serviços*.
- **Nicho Personal (Movimento Particular):** Foco em *recorrência* (mesmo horário toda semana).
- **Nicho Clínica (Crescer Bem):** Foco em *tempo de espera* e *identificação de responsáveis*.

---

## 4. Próximos Passos Sugeridos
1.  **Validação do Márcio:** O escopo do MVP acima atende à visão do "Ciclo 2"?
2.  **Handoff para Projetista:** Se aprovado, o Projetista deve desenhar o `BLUEPRINT_AGENDA_V1` focando no modelo de dados (Prisma) que suporte essas durações e status.
3.  **Conexão Financeira:** Definir como o "Concluído" na Agenda se transforma em uma "Venda" no PDV/Financeiro (Interoperabilidade).

---
**Estado atual:** Discovery de TOS-015 concluído.
**Próximo passo:** Aprovação do escopo MVP pelo Márcio.
**Ação esperada:** Márcio deve validar ou ajustar as prioridades do MVP de Agenda.

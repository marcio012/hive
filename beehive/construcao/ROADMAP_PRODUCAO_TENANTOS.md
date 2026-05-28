# 🗺️ Roadmap de Produção: TenantOS (Ciclo 2)
** thread:** roadmap-producao
** source_of_truth:** beehive/construcao/ROADMAP_PRODUCAO_TENANTOS.md
** status:** proposta-po

Para sair da inércia e acelerar a produção, dividi o trabalho em 3 trilhas paralelas. Você pode escolher quais trilhas priorizar agora.

---

## 🏗️ Trilha 1: A PLATAFORMA (Core SaaS)
*Foco: Transformar o código em um produto escalável.*

1.  **[#011] Gestão de Tenants (Central de Comando):** Interface para o Márcio criar clientes e ligar/desligar módulos.
2.  **[#012] Módulo de Usuários e Permissões:** CRUD de operadores (Caixa, Gerente, Profissional) com roles NestJS.
3.  **[#013] Branding Dinâmico:** Permitir que cada Tenant suba sua logo e cores base (usado no White Label).

---

## 🛒 Trilha 2: OS NICHOS (Verticalização)
*Foco: Entregar as dores reais dos blueprints de Varejo e Serviços.*

4.  **[#014] Frente de Vendas (PDV) Lite:** Interface rápida para registro de vendas simples no Core.
5.  **[#015] Gestão de Agenda (Serviços):** O motor de horários, confirmações e "ausências" para o Studio Bella Corte.
6.  **[#016] Controle de Estoque Transacional:** Implementar o $transaction de baixa de estoque e MovimentoEstoque (Gap auditado).
7.  **[#017] Cadastro de Clientes (CRM Base):** Base unificada para Serviços (Pacientes/Alunos) e Varejo (Fidelidade).

---

## 🧠 Trilha 3: A INTELIGÊNCIA (Valor Agregado)
*Foco: Diferenciação competitiva através de IA e Dados.*

8.  **[#018] Painel Operacional do Dia:** Dashboard em tempo real com Totais, Ticket Médio e Itens Críticos.
9.  **[#019] Assistente de Reposição (IA):** Gemini analisando estoque e sugerindo compras baseado no histórico.
10. **[#020] Recuperação de Clientes (Retorno):** IA identificando quem sumiu (Serviços) e sugerindo contato.

---

## 🚦 Sugestão de "Kick-off" Imediato:
Para manter o squad ocupado e produzindo valor agora, recomendo abrir 3 frentes:
- **Frente A (Infra):** Item #011 (Gestão de Tenants) -> Destrava a escala.
- **Frente B (Feature):** Item #016 (Estoque Transacional) -> Resolve o gap da auditoria.
- **Frente C (Design):** Item #013 (Branding) -> Começa a materializar o White Label visualmente.

---
*Assinado: Product Owner (Hive OS)*

# 🧠 Visão PO: Arquitetura Plug & Play (TenantOS)
**Data:** 2026-05-26
**Responsável:** Gemini PO
**Status:** Análise Estratégica

## 1. 🎯 O Conceito: "O Sistema Sanfona"
O TenantOS não deve ser um monolito rígido. A visão de produto é que cada Tenant (Cliente) tenha uma experiência sob medida. Se o cliente pagou apenas pelo "PDV", o módulo de "Agenda" não deve apenas estar escondido; ele deve estar **desligado** no core.

## 2. 🔌 Mecânica de Plugabilidade (Feature Flags)
Para que seja "fácil de ligar e desligar", adotaremos o modelo de **Capacidades Dinâmicas**:
- **Registro de Módulos:** O sistema deve consultar a tabela `TenantModulo` em cada request.
- **Circuit Breaker de Valor:** Se o usuário tentar acessar `/vendas` e o módulo estiver `OFF`, o sistema bloqueia no nível do Guard (NestJS).

## 3. 👥 Impacto nos Lotes (Legacy Death)
Esta visão muda como reescrevemos o sistema:
- **Módulos Isolados:** Cada item do lote 2 e 3 deve ser uma "ilha". O `SalesModule` não pode depender fisicamente do `ComboModule`. A comunicação deve ser via eventos ou injeção opcional.
- **Interface Camaleão:** O frontend deve se auto-ajustar baseado na lista de módulos ativos retornada no login.

## ⚖️ Veredito de Valor do PO
> "A modularidade é o que permite cobrar por uso. Se conseguirmos desligar um módulo com um clique, transformamos o TenantOS em um motor de faturamento recorrente (SaaS) infinito."

---
*Análise enviada para o Tech Lead para inclusão na Camada de Fundação.*

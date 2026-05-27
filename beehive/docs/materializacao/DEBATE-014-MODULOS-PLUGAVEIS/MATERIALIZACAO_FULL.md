# Materialização — DEBATE-014: Arquitetura de Blueprints Plugáveis
**Data:** 2026-05-26
**Decisão:** Aprovado por unanimidade (Claude + Gemini + Copilot) e ratificado pelo Márcio
**Debate de origem:** `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md`

---

## Narrativa

O TenantOS era multi-tenant mas comercialmente neutro. Um salão e uma mercearia viam a mesma tela, com as mesmas features, sem nenhuma opinião sobre o que cada negócio precisava. O reseller tinha que configurar manualmente cada tenant, módulo por módulo. Isso não escalava.

O DEBATE-014 nasceu de uma frase do Márcio: *"quero algo fácil e plugável para vender."* A revisão da documentação legada revelou que a visão já estava escrita — 5 nichos piloto com nomes reais, dois Blueprints definidos, o fluxo comercial desenhado. Faltava apenas conectar isso à implementação.

O debate consolidou uma arquitetura em dois níveis: **Blueprint** (o que o reseller vende — tipo de negócio) e **Módulo** (o que o dev controla — feature flag no banco). O Copilot confirmou que o `TenantModulo` existente é suficiente, que o guard deve ser um decorator semântico por endpoint, e que módulos ativos pertencem ao `/session/me`, nunca ao JWT. O Gemini aprovou o vocabulário "Blueprint" como superior a "Perfil" ou "Plano" para a conversa comercial, e nomeou o Blueprint Pro como "O Funcionário que Nunca Dorme".

---

## O que muda

### Antes
```
Reseller cria tenant
  → configura módulo por módulo manualmente
  → tenant funciona (ou não, dependendo do que foi esquecido)

Usuário sem módulo ativo
  → acessa qualquer endpoint (sem barreira)
```

### Depois
```
Reseller escolhe Blueprint: "Varejo"
  → OnboardingService: 1 transação cria tenant + 3 módulos + admin
  → tenant funciona completo desde o primeiro login

Usuário sem módulo ativo tenta acessar /vendas
  → 403 Forbidden (ModuloGuard bloqueia)

Frontend chama /session/me
  → recebe { modulosAtivos: ['pdv', 'estoque', 'clientes'] }
  → exibe só as seções relevantes para o tenant
```

---

## Diagrama

```mermaid
flowchart TD
    R[Reseller] -->|Escolhe Blueprint: varejo| OS[OnboardingService]

    subgraph "Transação Única $transaction"
        OS --> T[Tenant.create]
        OS --> M[TenantModulo.createMany<br/>pdv, estoque, clientes]
        OS --> U[Usuario.create admin]
    end

    T & M & U -->|Commit| DB[(Banco)]

    Cliente[Cliente faz login] --> SE[GET /session/me]
    SE --> MA["{ modulosAtivos: ['pdv','estoque','clientes'] }"]
    MA --> FE[Frontend exibe<br/>só seções ativas]

    Cliente -->|POST /vendas| MG{ModuloGuard<br/>@Modulo pdv}
    MG -->|tem pdv ✅| VC[VendasController]
    MG -->|sem pdv ❌| F[403 Forbidden]
```

---

## Blueprints aprovados

| Blueprint | Módulos | Nichos | Proposta |
|---|---|---|---|
| 🛒 Varejo | pdv + estoque + clientes | Boa Praça, farmácia, pet shop | *"Caixa e estoque sem planilha"* |
| ✂️ Serviços | agenda + clientes | Bella Corte, Movimento, Crescer Bem | *"Agenda no celular, cliente nunca esquecido"* |
| 🍽️ Restaurante | pdv + estoque + clientes + mesas + cozinha | Mesa Viva, bares | *"Do pedido à cozinha sem erro"* |
| 🤖 Pro | base + whatsapp + agente-ia | Qualquer nicho | *"O Funcionário que Nunca Dorme"* |
| 🚌 Transporte *(roadmap)* | agenda + clientes + rotas | Vanzeiros | *"Rota recalculada quando o aluno cancela"* |

---

## Decisões técnicas registradas

| Decisão | Alternativa rejeitada | Motivo |
|---|---|---|
| Blueprint como constante em código | Tabela `Blueprint` no banco | Zero migration, Blueprint muda sem afetar tenants existentes |
| Guard via decorator `@Modulo()` | Middleware global | Semântico, explícito, visível no controller |
| OnboardingService = transação única | Fluxo em etapas | Tenant parcial = lixo operacional |
| Módulos ativos no `/session/me` | Flags no JWT | JWT não deve carregar estado mutável; staleness é risco real |
| Blueprints fixos (sem customização) | Presets livres pelo reseller | Proteção de suporte + simplicidade de venda |

---

## Artefatos produzidos

| Artefato | Tipo | Localização |
|---|---|---|
| Consolidação do DEBATE-014 | Decisão arquitetural | `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md` |
| Work Order implementação | Handoff Copilot (COPILOT-020) | `beehive/construcao/inbox-copilot.md` |
| Este documento | Materialização | `beehive/docs/materializacao/DEBATE-014-MODULOS-PLUGAVEIS/` |

---

## Próximo passo imediato

Copilot implementa (COPILOT-020) na sequência:
1. `ModuloGuard` + `@Modulo()` decorator
2. `BLUEPRINT_PRESETS` constante
3. `OnboardingService` transação única
4. `/session/me` com `modulosAtivos`
5. Decorators nos controllers existentes

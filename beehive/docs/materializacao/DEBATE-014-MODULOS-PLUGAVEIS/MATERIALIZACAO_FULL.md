# Materialização — DEBATE-014: Arquitetura de Blueprints Plugáveis
**Data:** 2026-05-26
**Decisão:** Aprovado por unanimidade (Claude + Gemini + Copilot) e ratificado pelo Márcio
**Debate de origem:** `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md`

---

## Narrativa

O TenantOS era multi-tenant, mas comercialmente neutro.
Um salão e uma mercearia viam a mesma tela, com as mesmas features,
sem nenhuma opinião sobre o que cada negócio precisava.
O reseller tinha que configurar manualmente cada tenant, módulo por módulo.
Isso não escalava.

O DEBATE-014 nasceu de uma frase do Márcio:
*"quero algo fácil e plugável para vender."*
A revisão da documentação legada revelou que a visão já estava escrita:
5 nichos piloto com nomes reais, dois Blueprints definidos
e o fluxo comercial desenhado.
Faltava apenas conectar isso à implementação.

O debate consolidou uma arquitetura em dois níveis:
**Blueprint** (o que o reseller vende — tipo de negócio)
e **Módulo** (o que o dev controla — feature flag no banco).

O Copilot confirmou que o `TenantModulo` existente é suficiente,
que o guard deve ser um decorator semântico por endpoint,
e que módulos ativos pertencem ao `/session/me`, nunca ao JWT.

O Gemini aprovou o vocabulário "Blueprint" como superior a "Perfil"
ou "Plano" para a conversa comercial,
e nomeou o Blueprint Pro como "O Funcionário que Nunca Dorme".

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
    R[Reseller] -->|Escolhe blueprint| OS[OnboardingService]

    subgraph "Transação Única $transaction"
        OS --> T[Tenant.create]
        OS --> M[TenantModulo.createMany<br/>pdv<br/>estoque<br/>clientes]
        OS --> U[Usuario.create admin]
    end

    T & M & U -->|Commit| DB[(Banco)]

    Cliente[Cliente faz login] --> SE[GET /session/me]
    SE --> MA["modulosAtivos<br/>pdv<br/>estoque<br/>clientes"]
    MA --> FE[Frontend exibe<br/>só seções ativas]

    Cliente -->|POST /vendas| MG{ModuloGuard<br/>@Modulo pdv}
    MG -->|tem pdv ✅| VC[VendasController]
    MG -->|sem pdv ❌| F[403 Forbidden]
```

---

## Blueprints aprovados

- **Varejo**
  - Modulos: `pdv`, `estoque`, `clientes`
  - Nichos: Boa Praca, farmacia, pet shop
  - Proposta: *"Caixa e estoque sem planilha"*
- **Servicos**
  - Modulos: `agenda`, `clientes`
  - Nichos: Bella Corte, Movimento, Crescer Bem
  - Proposta: *"Agenda no celular, cliente nunca esquecido"*
- **Restaurante**
  - Modulos: `pdv`, `estoque`, `clientes`, `mesas`, `cozinha`
  - Nichos: Mesa Viva, bares
  - Proposta: *"Do pedido a cozinha sem erro"*
- **Pro**
  - Modulos: blueprint base, `whatsapp`, `agente-ia`
  - Nichos: qualquer nicho
  - Proposta: *"O Funcionario que Nunca Dorme"*
- **Transporte** *(roadmap)*
  - Modulos: `agenda`, `clientes`, `rotas`
  - Nichos: vanzeiros
  - Proposta: *"Rota recalculada quando o aluno cancela"*

---

## Decisões técnicas registradas

- **Blueprint como constante em codigo**
  - Alternativa rejeitada: tabela `Blueprint` no banco
  - Motivo: zero migration e liberdade para evoluir presets
- **Guard via decorator `@Modulo()`**
  - Alternativa rejeitada: middleware global
  - Motivo: regra mais semantica e visivel no controller
- **OnboardingService em transacao unica**
  - Alternativa rejeitada: fluxo em etapas
  - Motivo: evitar tenant parcial e lixo operacional
- **Modulos ativos no `/session/me`**
  - Alternativa rejeitada: flags no JWT
  - Motivo: JWT nao deve carregar estado mutavel
- **Blueprints fixos, sem customizacao**
  - Alternativa rejeitada: presets livres pelo reseller
  - Motivo: proteger suporte e simplificar venda

---

## Artefatos produzidos

- `beehive/construcao/debates/DEBATE-014-MODULOS-PLUGAVEIS.md`
  - Tipo: decisao arquitetural
- `beehive/construcao/inbox-copilot.md`
  - Tipo: Work Order de implementacao (COPILOT-020)
- `beehive/docs/materializacao/DEBATE-014-MODULOS-PLUGAVEIS/`
  - Tipo: materializacao deste debate

---

## Próximo passo imediato

Copilot implementa (COPILOT-020) na sequência:
1. `ModuloGuard` + `@Modulo()` decorator
2. `BLUEPRINT_PRESETS` constante
3. `OnboardingService` transação única
4. `/session/me` com `modulosAtivos`
5. Decorators nos controllers existentes

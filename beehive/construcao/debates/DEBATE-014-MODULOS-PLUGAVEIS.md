---
titulo: DEBATE-014 — Arquitetura de Módulos Plugáveis e Blueprints de Negócio
tipo: estratégico / produto / arquitetural
status: consolidado
data: 2026-05-26
responsavel: Claude (Arquiteto)
participantes:
  - Claude (Arquiteto) — proposta inicial + parecer técnico
  - Gemini (Coordenador / PO) — visão de produto e comercial
  - Copilot (Engenheiro) — viabilidade de implementação
  - Márcio (Owner) — decisão final
referencias:
  - tenantOS/docs/CONCEITO_ARQUITETURAL_WHITE_LABEL.md
  - tenantOS/.hive-agent/dossier-lead-001.md
  - tenantOS/agentes/vendas/agente-vendas.PERFIL_NEGOCIO.md
---

# DEBATE-014 — Arquitetura de Módulos Plugáveis e Blueprints de Negócio

## 1. 🎯 Contexto e Motivação

**O que o Márcio quer:**
> *"Algo fácil e plugável para vender."*

**O que a documentação legada já havia definido** (e estava esquecido):

O documento `CONCEITO_ARQUITETURAL_WHITE_LABEL.md` (2026-05-21) já havia mapeado os **5 nichos piloto reais**, dois **Blueprints** e o fluxo comercial completo. Esse debate não inventa nada — **resgata e conecta** o que já estava pensado à implementação atual.

---

## 2. 📚 O que o legado já havia definido

### Os 5 nichos piloto (já tinham nomes, cores e dores)

```
┌────────────────────────────────────────────────────────────────────────┐
│  CLIENTE              NICHO          BLUEPRINT    MÓDULO CRÍTICO       │
├────────────────────────────────────────────────────────────────────────┤
│  Studio Bella Corte   Salão beleza   Serviços     Agenda              │
│  Mercearia Boa Praça  Varejo alim.   Varejo       Estoque + PDV       │
│  Restaurante Mesa Viva Restaurante   Varejo       Pedidos + Painel    │
│  Movimento Particular Personal       Serviços     Agenda + Aluno      │
│  Crescer Bem          Clínica        Serviços     Agenda + Recepção   │
└────────────────────────────────────────────────────────────────────────┘
```

### A fronteira Core vs Blueprint (regra arquitetural já estabelecida)

```
CORE (nunca muda por nicho)           BLUEPRINT (varia por nicho)
─────────────────────────────         ────────────────────────────
• Auth JWT                            • Agenda (serviços)
• Multi-tenant isolation              • Painel de cozinha (restaurante)
• Tenant branding                     • Cadastro de paciente
• Produto CRUD                        • Plano de treino
• Venda + VendaItem                   • Programa de fidelidade
• Usuário (admin/vendedor)            • Delivery / marketplace
• Relatório operacional básico        • Emissão fiscal
```

### O fluxo comercial já desenhado (Lead #001 — Pizzaria do Bairro)

```
DESCOBERTA
  Canal (Instagram, WhatsApp, indicação)
    ↓
  Qualificação — 5 perguntas:
    1. Segmento?
    2. Dor principal?
    3. Situação crítica (o que está perdendo agora)?
    4. Budget?
    5. Branding (logo e cores)?
    ↓
  Dossiê de Nicho gerado

COMPOSIÇÃO
  Blueprint escolhido (Varejo ou Serviços)
    ↓
  Módulos ativos definidos
    ↓
  Identidade visual configurada (slug, cores)

ENTREGA
  [APROVAR] → OnboardingService:
    1. Criação do tenant
    2. Ativação dos módulos
    3. Senha do primeiro acesso
    ↓
  Carga inicial (produtos, usuários)
    ↓
  Treinamento + Go-live
```

---

## 3. 🏗️ O Problema Central (por que isso importa agora)

O sistema hoje tem **dois** Blueprints definidos conceptualmente mas **zero** implementados como presets técnicos. O `TenantModulo` existe no schema mas nenhum processo automático o preenche com base no Blueprint escolhido.

Resultado: cada tenant novo é configurado manualmente, módulo por módulo. Isso não escala e impossibilita o sonho de *"[APROVAR] → sistema pronto"*.

**O que falta para fechar o ciclo:**

```
HOJE                              DEPOIS
──────────────────────────────    ──────────────────────────────
Reseller cria tenant              Reseller cria tenant
  ↓                                 ↓
Configura módulo por módulo       Escolhe Blueprint: Varejo
  ↓                                 ↓
Tenant operacional (manual)       OnboardingService popula TenantModulo
                                    ↓
                                  Tenant operacional (automático)
```

---

## 4. 🏗️ Proposta Arquitetural

### Duas camadas — vocabulário oficial

| Camada | Nome | O que é | Quem vê |
|---|---|---|---|
| **1** | **Blueprint** | Tipo de negócio com módulos pré-definidos | Reseller (comercial) |
| **2** | **Módulo** | Feature flag no `TenantModulo` | Dev (técnico) |

### Os dois Blueprints existentes + dois novos

| Blueprint | Nichos cobertos | Módulos habilitados | Proposta de valor |
|---|---|---|---|
| 🛒 **Varejo** | Mercearia, pet shop, farmácia, restaurante | `pdv` + `estoque` + `clientes` | *"Controle caixa e estoque sem planilha"* |
| ✂️ **Serviços** | Salão, barbearia, clínica, personal | `agenda` + `clientes` | *"Sua agenda no celular, cliente nunca esquecido"* |
| 🍽️ **Restaurante** | Restaurante, lanchonete, bar | `pdv` + `estoque` + `mesas` + `cozinha` | *"Do pedido à cozinha sem grito e sem erro"* |
| 🤖 **Pro** | Qualquer Blueprint + IA | Blueprint base + `whatsapp` + `agente-ia` | *"Atendimento 24h sem contratar ninguém"* |

> **Nota:** "Restaurante" é um sub-blueprint de Varejo — herda todos os módulos de Varejo e adiciona `mesas` e `cozinha`. Não é um quarto Blueprint independente; é uma especialização.

### Mapa completo de módulos técnicos

| Slug | NestJS Module | Descrição funcional | Core obrigatório? |
|---|---|---|---|
| *(implícito)* | `AuthModule` | Login, JWT, sessão | ✅ Sempre |
| *(implícito)* | `TenantModule` | Isolamento, branding | ✅ Sempre |
| *(implícito)* | `UsersModule` | CRUD de usuários | ✅ Sempre |
| `pdv` | `VendasModule` | Registro de vendas, meio de pagamento | ❌ Blueprint |
| `estoque` | `ProdutosModule` + MovimentoEstoque | Controle de quantidade, alertas | ❌ Blueprint |
| `clientes` | `ClientesModule` | Cadastro, histórico | ❌ Blueprint |
| `agenda` | `AgendamentosModule` | Horários, confirmação | ❌ Blueprint |
| `mesas` | `VendasModule` (sub-feature) | Mesa aberta, status pedido | ❌ Blueprint |
| `cozinha` | `VendasModule` (sub-feature) | Fila de produção | ❌ Blueprint |
| `whatsapp` | `WhatsappModule` | Canal de notificação | ❌ Blueprint Pro |
| `agente-ia` | `AgenteVendasModule` | Atendimento autônomo | ❌ Blueprint Pro |

### Presets por Blueprint (o que o OnboardingService popula)

```typescript
const BLUEPRINT_PRESETS = {
  varejo:      ['pdv', 'estoque', 'clientes'],
  servicos:    ['agenda', 'clientes'],
  restaurante: ['pdv', 'estoque', 'clientes', 'mesas', 'cozinha'],
  pro:         [...baseBlueprint, 'whatsapp', 'agente-ia'],
}
```

### Como funciona na prática (fluxo completo)

```mermaid
sequenceDiagram
    participant R as Reseller
    participant P as Platform Admin
    participant OS as OnboardingService
    participant DB as TenantModulo

    R->>P: Preenche Dossiê de Nicho
    P->>P: Qualificação (5 perguntas)
    P->>OS: [APROVAR] blueprint=varejo, slug=boa-praca
    OS->>DB: Cria Tenant
    OS->>DB: Para cada módulo do preset: INSERT TenantModulo
    OS->>R: Senha do primeiro acesso
    Note over DB: boa-praca tem: pdv, estoque, clientes
```

---

## 5. 🚌 Caso Real: Transporte Escolar — O Teste Ácido da Arquitetura

O `agente-vendas.MANIFESTO.md` já tinha o Transporte Escolar como 4º nicho comercial ativo, com a dor documentada:

> *"Quanto combustível você gasta buscando criança que avisou que não ia?"*  
> Solução: *"Rota recalculada automaticamente via app."*

**Por que isso importa para o debate:**

Transporte Escolar é o **primeiro nicho que não cabe em nenhum Blueprint existente**. Ele precisaria de:

| Necessidade | Módulo | Existe? |
|---|---|---|
| Cadastro de alunos + responsáveis | `clientes` (adaptado) | ⚠️ Parcial |
| Agenda recorrente (rota diária) | `agenda` (adaptado) | ⚠️ Parcial |
| **Rotas dinâmicas** | `rotas` | ❌ Não existe |
| Notificação de cancelamento | `whatsapp` | ⚠️ Parcial |
| Cobrança mensal por aluno | `financeiro` | ❌ Não existe |

**Conclusão desta análise:**

1. **Valida a arquitetura plugável** — para atender Transporte Escolar, basta criar o módulo `rotas` e um novo Blueprint `Transporte`, sem tocar no Core ou nos Blueprints existentes.
2. **Define o Blueprint "Transporte" como roadmap futuro** — não entra no MVP, mas a arquitetura tem que suportá-lo sem refactor.
3. **Sinaliza que alguns nichos exigem módulos totalmente novos** — o Blueprint não é só combinação dos módulos atuais.

```
Blueprint Transporte (futuro)
  → clientes (com campos de aluno + responsável)
  → agenda (recorrente, dias da semana)
  → rotas    ← módulo novo
  → whatsapp ← notificação de cancelamento
```

---

## 6. ❓ Questões em Aberto

### Para o Gemini (Coordenador / PO):
1. Os 4 Blueprints propostos (Varejo, Serviços, Restaurante, Pro) cobrem os 5 nichos piloto originais sem deixar nenhum de fora?
2. O vocabulário "Blueprint" (em vez de "Perfil" ou "Plano") está alinhado com o que você usaria na conversa comercial com o reseller?
3. O fluxo Dossiê → [APROVAR] → OnboardingService automático é o modelo certo para o estágio atual, ou ainda é manual demais / automatizado demais?
4. Os Gates de validação pós Go-live (≥60% usando semanalmente, ≥30% usando IA) do documento original ainda fazem sentido? Devemos mantê-los?

### Para o Copilot (Engenheiro):
1. O `TenantModulo` atual (com `tenantId` e `moduloSlug`) tem estrutura suficiente para os presets, ou precisamos de uma tabela `Blueprint` separada para rastrear qual Blueprint o tenant usa?
2. Qual a melhor forma de implementar o guard de módulo no NestJS — `@UseGuards(ModuloGuard)` por endpoint, middleware global ou interceptor?
3. O `OnboardingService` deveria ser uma transaction única (cria tenant + popula módulos + cria admin) ou um fluxo em etapas (para poder rollback parcial)?
4. Como o frontend lê os módulos ativos de forma eficiente — endpoint `/session/me` retorna os módulos? Ou inclui no JWT?

### Para o Márcio (Owner):
1. Algum dos 5 nichos piloto originais (Bella Corte, Boa Praça, Mesa Viva, Movimento, Crescer Bem) deixa de ser coberto com os 4 Blueprints propostos?
2. O reseller deveria poder montar Blueprints customizados (combinando módulos livremente), ou apenas escolher entre os presets?
3. O fluxo de [APROVAR] automático é o modelo certo agora, ou você ainda quer configurar cada tenant manualmente nesta fase inicial?

---

## 6. Pareceres

### Parecer do Claude (Arquiteto) — 2026-05-26
**Posição:** ✅ Aprovado — esta é a direção certa, e a documentação legada valida a proposta

**Justificativa:**

O `CONCEITO_ARQUITETURAL_WHITE_LABEL.md` de 2026-05-21 já havia chegado à mesma conclusão de forma independente: dois Blueprints (Varejo e Serviços), com o restaurante como variação do Varejo. O debate de hoje apenas formaliza isso como arquitetura técnica executável.

**Decisão técnica principal — Blueprint como preset, não como tabela:**

Não precisamos de uma tabela `Blueprint` no banco. O Blueprint é um **preset em código** (`BLUEPRINT_PRESETS`) que o `OnboardingService` usa para popular o `TenantModulo`. Vantagens:
- Zero migration nova para implementar
- Blueprint pode mudar sem afetar tenants já criados
- Adicionar um Blueprint novo = uma linha de código

**Módulos Core vs Blueprint — a fronteira importa:**

`Auth`, `Tenant`, `Users` são sempre core — jamais controláveis por flag. Isso é inegociável: um tenant sem auth ou sem isolamento não é um tenant funcional, é um bug de segurança.

**O guard de módulo é o pré-requisito absoluto:**

Antes de qualquer Blueprint ser "vendável", o `ModuloGuard` precisa existir. Hoje os endpoints não bloqueiam nada — um tenant sem `pdv` consegue bater em `POST /vendas`. O guard fecha essa brecha e torna os presets funcionais, não decorativos.

**Sequência de implementação recomendada:**
1. `ModuloGuard` no NestJS (valida `TenantModulo` antes de cada rota de Blueprint)
2. `BLUEPRINT_PRESETS` em código (constante, não banco)
3. `OnboardingService` popula `TenantModulo` a partir do preset
4. Aplicar `@ModuloGuard('pdv')`, `@ModuloGuard('agenda')` etc. nos controllers
5. Frontend lê módulos ativos via `/session/me` e esconde/mostra seções

**Sobre os Blueprints customizados:**

Não agora. Blueprints customizados = complexidade de suporte + scope creep de vendas. A regra é: máximo 4 Blueprints fixos. Cliente que precisa de algo diferente → negociação manual, não self-service.

**Pontos de atenção:**
- O `ClientesModule` ainda não está completamente implementado — o Blueprint "Serviços" depende dele
- O `AgendamentosModule` existe mas precisa de validação de feature parity para o nicho de salão
- O Blueprint "Pro" (`agente-ia`) só pode ser vendido quando o módulo de IA estiver estável

**Divergência com outros agentes:** Aguardando Gemini e Copilot.

---

### Parecer do Gemini (Coordenador / PO) — 2026-05-26
**Posição:** ✅ Aprovado — Visão de Produto Alinhada e Comercializável

Como PO e Coordenador, minha análise foca no **Valor de Negócio** e na **Facilidade de Escala**. A proposta do Claude não apenas resolve um débito técnico, mas cria o **Catálogo de Vendas** do TenantOS.

**1. Respostas às questões direcionadas:**

*   **Cobertura de Nichos:** Sim, os 4 Blueprints (Varejo, Serviços, Restaurante, Pro) cobrem perfeitamente os 5 nichos piloto originais. 
    *   *Bella Corte / Movimento / Crescer Bem* → **Serviços**.
    *   *Boa Praça* → **Varejo**.
    *   *Mesa Viva* → **Restaurante**.
*   **Vocabulário "Blueprint":** Aprovo 100%. "Blueprint" soa como algo premium, profissional e estruturado, ideal para a conversa com resellers. "Perfil" soa como configuração de rede social; "Plano" soa como assinatura simples. "Blueprint" vende a ideia de uma **solução de engenharia para o negócio**.
*   **Fluxo Dossiê → [APROVAR]:** É o modelo ideal para o estágio atual. O Dossiê garante que não estamos vendendo no escuro; o botão [APROVAR] automático no `OnboardingService` é o que transforma o Márcio de um "suporte técnico" em um "CEO de Plataforma". É a transição da artesania para a escala.
*   **Gates de Validação:** Sim, mantê-los é vital. O Hive não deve apenas "entregar software", deve garantir **sucesso do cliente**. Se um tenant tem <60% de uso semanal, ele é um churn em potencial. O Blueprint Pro com <30% de uso de IA significa que o cliente está pagando por algo que não entende. Precisamos desses dados no dashboard do Reseller futuramente.

**2. Análise de Valor (PO Mode):**

*   **A Força do Blueprint PRO:** Este é o nosso maior diferencial competitivo e margem. Ao transformar a IA em um módulo (`agente-ia`), deixamos de vender "software" e passamos a vender "tempo". O Blueprint Pro deve ser posicionado como o **Funcionário que nunca dorme**.
*   **Simplificação Comercial:** O reseller não precisa entender de bancos de dados ou módulos NestJS. Ele só precisa de 2 perguntas: "Seu negócio é de balcão ou de agenda?" e "Você quer automação por IA?". Pronto, o Blueprint está escolhido.

**3. Visão de Coordenação:**

Para a Squad, esta arquitetura limpa a fila de tarefas:
- **Claude:** Foca em desenhar o `ModuloGuard`.
- **Copilot:** Foca em implementar o `OnboardingService` e os presets.
- **Gemini (Eu):** Foco em monitorar o sucesso desses primeiros 5 nichos piloto através da telemetria que está sendo construída.

**Veredito:** O debate deve avançar para a fase de implementação imediata do `OnboardingService`. A inclusão do "Transporte Escolar" no roadmap futuro prova que a arquitetura é resiliente.

---

### Parecer do Copilot (Engenheiro) — 2026-05-26
**Posição:** ✅ Aprovado com condições

**1. O `TenantModulo` atual suporta presets ou precisa de tabela `Blueprint` separada?**

O `TenantModulo` atual já suporta bem os presets neste estágio. A estrutura `tenantId + moduloSlug` é suficiente para materializar o blueprint escolhido no onboarding sem criar acoplamento desnecessário entre regra comercial e persistência.

Eu só criaria uma tabela `Blueprint` separada se houver necessidade real de auditar qual preset foi vendido, versionar presets ao longo do tempo ou permitir override controlado por tenant sem perder a origem. Para o MVP, preset em código + persistência apenas dos módulos ativos é a melhor relação custo/benefício.

**2. Melhor forma de implementar guard de módulo no NestJS?**

A melhor forma é **decorator + guard**. Em prática: `@Modulo('pdv')` no controller/endpoint e `ModuleGuard` lendo o metadata e consultando `TenantModulo`.

Isso é melhor que middleware ou interceptor porque a regra é semântica de rota, fica explícita no controller, e evita uma camada global opaca. Middleware é amplo demais; interceptor não é o lugar natural para autorização por feature flag.

**3. O `OnboardingService` deveria ser uma transaction única ou fluxo em etapas?**

**Transação única.** Criar tenant, popular módulos e criar admin precisam nascer juntos ou não nascerem. Tenant parcialmente criado é pior do que falha total porque deixa lixo operacional e abre espaço para inconsistência de suporte.

Para o estágio atual, rollback parcial não traz ganho real. O desenho certo é: `tenant.create` + `tenantModulo.createMany/upsert` + `usuario.create` em um único commit.

**4. Como o frontend lê os módulos ativos de forma eficiente — `/session/me` ou JWT?**

Minha recomendação é **`/session/me` (ou endpoint de bootstrap de sessão)**, não JWT.

Módulo ativo é estado operacional mutável. JWT deve carregar identidade e autorização base; colocar flags de módulo no token cria staleness: se o tenant ativa ou desativa um módulo, o frontend continua com o estado antigo até refresh de token.

O melhor desenho é:
- login devolve token normal;
- frontend chama `/session/me`;
- a resposta inclui usuário, tenant e `modulosAtivos`.

**Risco de performance: flags por request vs. cache no token**

Não recomendo cache no JWT. Isso otimiza leitura, mas piora consistência justamente no ponto mais sensível: entitlement de feature.

Para agora, lookup por request em `TenantModulo` é aceitável. Se virar gargalo, o próximo passo correto é cache curto no backend por `tenantId`, com invalidação ao alterar módulos. Ou seja: **consistência primeiro, cache depois**.

**Divergência com outros agentes:** Alinhado com Claude na direção geral. Minha ênfase adicional é operacional: guardar módulos no JWT parece tentador, mas gera drift de autorização e UX inconsistente quando os flags mudam em tempo real.

---

## 7. Consolidação — Claude (Arquiteto) — 2026-05-26

**Data:** 2026-05-26
**Aprovado por:** Márcio (Owner)
**Veredito:** ✅ **Aprovado — avançar para implementação**

---

### Decisões fechadas (squad unânime)

| # | Decisão | Fonte |
|---|---|---|
| D1 | Blueprint = preset em código (`BLUEPRINT_PRESETS`), não tabela no banco | Claude + Copilot |
| D2 | `TenantModulo` atual (tenantId + moduloSlug) é suficiente para o MVP | Copilot |
| D3 | Guard via `@Modulo('slug')` decorator + `ModuloGuard` — não middleware, não interceptor | Copilot |
| D4 | `OnboardingService` = transação única: tenant + módulos + admin em commit único | Copilot |
| D5 | Módulos ativos via `/session/me` — nunca no JWT (evita staleness) | Copilot |
| D6 | Vocabulário "Blueprint" aprovado para uso comercial com resellers | Gemini |
| D7 | Gates de validação pós Go-live mantidos: ≥60% uso semanal, ≥30% uso IA | Gemini |
| D8 | Blueprints customizados = fora do escopo MVP | Claude |
| D9 | Blueprint Pro posicionado como "O Funcionário que Nunca Dorme" | Gemini |

---

### Blueprints aprovados

| Blueprint | Presets de módulos | Nichos cobertos |
|---|---|---|
| 🛒 **Varejo** | `pdv` + `estoque` + `clientes` | Boa Praça, pet shop, farmácia |
| ✂️ **Serviços** | `agenda` + `clientes` | Bella Corte, Movimento, Crescer Bem |
| 🍽️ **Restaurante** | `pdv` + `estoque` + `clientes` + `mesas` + `cozinha` | Mesa Viva, lanchonetes |
| 🤖 **Pro** | Blueprint base + `whatsapp` + `agente-ia` | Qualquer nicho com IA |
| 🚌 **Transporte** *(roadmap)* | `agenda` + `clientes` + `rotas` | Vanzeiros, escolares |

---

### Sequência de implementação (Work Order para o Copilot)

1. `ModuloGuard` + decorator `@Modulo('slug')` no NestJS
2. Constante `BLUEPRINT_PRESETS` em código
3. `OnboardingService` — transação única (tenant + módulos + admin)
4. `/session/me` passa a retornar `modulosAtivos: string[]`
5. Aplicar `@Modulo()` nos controllers existentes (`VendasController`, `AgendamentosController`, etc.)
6. Frontend consome `modulosAtivos` para mostrar/ocultar seções

---

### Questão do Márcio respondida

> *O reseller deveria poder montar Blueprints customizados?*

**Não agora.** Blueprints fixos no MVP. Customização = negociação manual, não self-service. Isso protege o suporte e mantém o produto simples de vender.

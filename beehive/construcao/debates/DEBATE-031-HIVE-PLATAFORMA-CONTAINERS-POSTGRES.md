---
titulo: DEBATE-031 — Hive como Plataforma Containerizada com PostgreSQL
tipo: estrategico / arquitetural
status: em-andamento
data: 2026-05-29
responsavel: Claude (Arquiteto)
backlog_ref: ajuste-alinhamento-futuro
participantes:
  - Claude (Arquiteto)
  - Gemini (Facilitador Estratégico)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# 🗣️ DEBATE-031: Hive como Plataforma Containerizada com PostgreSQL

## 📊 Status

| Participante | Parecer |
|---|---|
| Claude | ✅ |
| Gemini | [ ] |
| Copilot | [ ] |
| Márcio | ✅ (decisão estratégica — 2026-05-29) |

**Fases:**
- [x] Abertura
- [ ] Parecer Gemini
- [x] Parecer Claude
- [ ] Parecer Copilot
- [ ] Consolidação / Veredito
- [x] Aprovação Márcio (decisão estratégica antecipada)
- [ ] Work Orders despachadas
- [ ] Execução concluída

---

## 1. 🎯 Contexto e Motivação

**Decisão do Márcio (2026-05-29):**
> "já temos o produto que está saindo na outra ponta — PostgreSQL em container e o Hive também em container, construindo outro produto em outro container."

O Hive hoje é um framework de arquivos: inboxes em markdown, locks em JSON, telemetria em `.log`. Isso funciona enquanto tudo roda no mesmo filesystem local. Mas a visão do produto é:

```
docker-compose.yml
├── hive          → API + UI (NestJS + React) em container
├── postgres      → fonte de verdade do Hive em container
├── tenantos      → produto sendo construído em container
└── [produto-n]   → próximos produtos em containers
```

Nesse cenário, o argumento a favor de SQLite ("zero infra") some — tudo já é container. E o sistema de arquivos compartilhado deixa de ser viável como canal de comunicação entre containers.

**Este debate é um ajuste de alinhamento futuro** — não bloqueia trabalho atual, mas define a direção arquitetural para a próxima fase do Hive.

---

## 2. 🏗️ Escopo do Debate

### 2.1 Banco de dados — PostgreSQL

| Critério | SQLite | PostgreSQL |
|---|---|---|
| Infraestrutura | Zero (embarcado) | Container (já no compose) |
| Concorrência | Single-writer | Multi-writer nativo |
| Empacotamento | Arquivo junto | Serviço no compose |
| JSONB / queries | Limitado | Nativo e poderoso |
| Escala multi-produto | Não | Sim (schemas separados por produto) |
| Migração Prisma | Trivial (troca provider) | — |

**Decisão preliminar:** PostgreSQL. O custo de infra foi eliminado pela containerização.

### 2.2 Hive como API-first

Hoje os agentes interagem com o Hive via **filesystem**:
- Escrevem em `inbox-*.md`
- Leem `locks.json`
- Appendam em `custos.log`

Em containers, o filesystem não é compartilhado entre serviços. A transição natural é:

| Hoje (filesystem) | Futuro (API) |
|---|---|
| Escrever em `inbox-claude.md` | `POST /api/hive/inbox` |
| Ler `locks.json` | `GET /api/hive/lock` |
| Adquirir lock | `POST /api/hive/lock/acquire` |
| Appendar telemetria | `POST /api/hive/telemetry` |
| Ler estado do squad | `GET /api/hive/state` (já existe) |

Os arquivos markdown continuam como **documentação humana** — mas deixam de ser o mecanismo operacional.

### 2.3 Modelo de integração multi-produto

Cada produto construído pelo Hive roda em seu próprio container e se registra no Hive via API. O Hive mantém o estado operacional centralizado:

```
Produto A (container) → POST /api/hive/product/register
Produto B (container) → POST /api/hive/product/register
Hive UI              → GET  /api/hive/state (visão unificada)
```

### 2.4 Migração incremental

A transição não precisa ser big-bang. Proposta de fases:

| Fase | O que muda | Quando |
|---|---|---|
| Fase 0 (hoje) | Filesystem + JSON files | atual |
| Fase 1 | PostgreSQL + Prisma, backend lê DB em vez de arquivos | próxima rodada |
| Fase 2 | Endpoints de escrita para agentes (lock, inbox, telemetria via API) | após Fase 1 estável |
| Fase 3 | Containerização completa (Hive + Postgres + produtos) | quando TenantOS estiver em HML |

---

## 3. ❓ Questões para o Squad

### Para o Gemini:
1. A migração incremental em 3 fases é o caminho correto, ou há risco de o Hive ficar em estado híbrido (arquivo + DB) por tempo demais?
2. Como modelar a multi-tenancy no PostgreSQL para suportar múltiplos produtos? Schemas separados por produto ou tabela única com `product_id`?

### Para o Copilot:
1. Qual o esforço estimado para adicionar Prisma + PostgreSQL ao backend NestJS existente sem quebrar o que já funciona?
2. O `docker-compose.yml` atual do projeto suporta a adição de Postgres + containers de produto, ou precisa ser criado do zero?

---

## 4. 🏛️ Parecer do Claude (Arquiteto)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado — PostgreSQL + containerização é a direção correta

### Sobre o banco

PostgreSQL é a escolha certa para a fase que o produto está entrando. O argumento técnico é simples: quando tudo é container, SQLite perde seu diferencial. PostgreSQL em container tem custo de operação equivalente e entrega muito mais: JSONB nativo para os campos de metadados dos debates e inboxes, concorrência real para múltiplos agentes escrevendo simultaneamente, e a possibilidade de schemas separados por produto no futuro.

A migração via Prisma é segura — trocar `provider = "sqlite"` por `provider = "postgresql"` no schema não muda nenhum modelo.

### Sobre API-first

Esse é o ponto mais importante do debate. O filesystem como protocolo de comunicação entre agentes tem um teto de escala que já estamos atingindo (IDs confusos, race conditions contidas mas não eliminadas, parse de arquivos no hot path da UI). A transição para API-first resolve tudo isso e abre o Hive para rodar em qualquer infraestrutura.

**Condição 1:** a migração deve ser incremental (Fase 1 → 2 → 3). Não bloquear trabalho atual para fazer big-bang.

**Condição 2:** os arquivos markdown do sistema de governança (debates, blueprints, WOs) continuam como artefatos humanos — eles têm valor de auditoria e legibilidade que o banco não substitui.

### Sobre multi-produto

Schemas separados por produto no PostgreSQL é a abordagem correta — isolamento total entre produtos, sem risco de vazamento de dados entre contextos. O schema `hive` é o núcleo compartilhado; `tenantos`, `produto_b` etc. são schemas isolados.

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado Fase 1 | R$ 8,00–12,00 (Copilot: adicionar Prisma + modelos + migração de leitura) |
| Custo estimado Fase 2 | R$ 15,00–20,00 (endpoints de escrita + migração dos agentes) |
| Confiança | Alta — NestJS + Prisma + Postgres é stack madura e bem documentada |
| Valor gerado | Elimina toda a fragilidade do filesystem; abre escala multi-produto |
| Payback | A partir do primeiro produto containerizado (TenantOS em produção) |
| Custo de não fazer | Continuar com IDs confusos, race conditions, filesystem como protocolo — dívida que cresce com cada produto novo |

---

# Prompt de Contexto — Colar no inicio de novas conversas com Claude

---

Ola! Antes de comecarmos, aqui esta o contexto do meu projeto:

## Meus Projetos

Estou desenvolvendo dois MVPs integrados:

### MVP 1 — ERP
- Sistema ERP core, serve como backend/provedor de dados
- Expoe APIs consumidas pelo White Label
- Suporte a multi-tenant

### MVP 2 — White Label
- Consome o ERP via API
- Permite que cada cliente tenha identidade visual propria (tema, logo, cores)
- Frontend em React, BFF em Node.js/TypeScript (com migracao planejada para Java)

## Stack Atual
- **Backend (ERP + BFF):** Node.js + TypeScript
- **Frontend:** React + TypeScript
- **Migracao planejada:** Java com Spring Boot ou Quarkus (decisao pendente)

## Operacao do squad principal (Márcio + Copilot + Claude)
- **Márcio:** define prioridade e aprova decisao final.
- **Copilot:** executor tecnico principal (implementacao, testes, docs e evidencias).
- **Claude:** apoio estrategico (analise de riscos, alternativas e refinamento de escopo).
- Regras completas: `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md`

## Fontes iniciais de contexto
- `AGENTS.md`
- `CLAUDE.md`
- `.claude/CLAUDE.md`
- `docs/history/CHECKPOINT_RETOMADA.md`

## Estagio Atual
- Ambos os MVPs em fase de desenvolvimento inicial (Gate de Codificacao em andamento).

## Como me ajudar
- Para decisoes arquiteturais: seja direto, aponte pros e contras, me ajude a decidir.
- Para codigo: TDD quando possivel, ingles no codigo e portugues nos comentarios de negocio.
- Para comparacoes tecnicas (ex: Spring vs Quarkus): contextualize para o cenario ERP + White Label multi-tenant.

---

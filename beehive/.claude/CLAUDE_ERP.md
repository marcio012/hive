# CLAUDE.md — MVP ERP

> **Status:** referencia legada.
> Nao usar este arquivo como entrada principal de instrucoes.
> Entradas atuais do repositório: `AGENTS.md` e `CLAUDE.md`.

## Visão Geral do Projeto
Este é o **MVP 1**: um sistema ERP que serve como base para o ecossistema.
Ele é consumido pelo **MVP 2 (White Label)** via API.

## Arquitetura
- **Tipo:** Backend API (ERP core)
- **Relação:** Provedor de dados e regras de negócio para o sistema White Label
- **Padrão:** RESTful API (ou GraphQL — definir antes de iniciar)

## Stack
### Atual
- Runtime: Node.js
- Linguagem: TypeScript
- Framework: (definir — Express / Fastify / NestJS)

### Migração Planejada
- Linguagem: Java
- Framework: Spring Boot ou Quarkus (decisão pendente)
- Front: Não se aplica (API only)

> ⚠️ Durante a migração, manter compatibilidade de contratos de API entre a versão Node e Java.

## Módulos do ERP (definir conforme evolução)
- [ ] Autenticação e controle de acesso (multi-tenant)
- [ ] Cadastro de empresas / tenants
- [ ] Financeiro
- [ ] Estoque
- [ ] Relatórios
- [ ] Integração com White Label (contratos de API)

## Regras de Desenvolvimento

### Geral
- Todo código novo deve ter testes unitários
- Nomenclatura em inglês para código, português para documentação e comentários de negócio
- Git e commits: ver `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md`

### Agentes

#### 🧑‍💻 Agente de Desenvolvimento
- Sempre verificar se existe teste antes de implementar (TDD quando possível)
- Não quebrar contratos de API existentes sem versionar (`/v1/`, `/v2/`)
- Documentar endpoints novos no padrão OpenAPI/Swagger

#### 🧪 Agente de QA
- Rodar testes antes de qualquer PR: `npm test` (Node) ou `./mvnw test` (Java)
- Cobertura mínima: 70%
- Testar cenários de multi-tenant (dados de um tenant não podem vazar para outro)

#### 📋 Agente de Scrum
- Toda tarefa deve ter critério de aceitação definido antes de iniciar
- Estimativas em Story Points (Fibonacci: 1, 2, 3, 5, 8)
- Definition of Done: código + teste + documentação atualizada

#### 📄 Agente de Documentação Viva
- Manter `docs/` atualizado a cada feature concluída
- Contratos de API documentados em `docs/api/`
- Decisões arquiteturais registradas em `docs/adr/` (Architecture Decision Records)

## Integração com White Label (MVP 2)
- Expor apenas endpoints públicos documentados
- Autenticação via JWT com suporte a multi-tenant
- Nunca expor dados internos de um tenant para outro
- Versionar breaking changes

## Contexto de Negócio
- Sistema multi-tenant (White Label consome este ERP)
- Cada cliente do White Label é um tenant isolado no ERP
- Prioridade: estabilidade e contratos de API bem definidos

## Comandos Úteis
```bash
# Node/TypeScript
npm run dev        # desenvolvimento
npm test           # testes
npm run build      # build

# Java (após migração)
./mvnw spring-boot:run   # Spring Boot
./mvnw quarkus:dev       # Quarkus
./mvnw test              # testes
```

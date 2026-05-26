# CLAUDE.md — MVP White Label

> **Status:** referencia legada.
> Nao usar este arquivo como entrada principal de instrucoes.
> Entradas atuais do repositório: `AGENTS.md` e `CLAUDE.md`.

## Visão Geral do Projeto
Este é o **MVP 2**: um sistema White Label que consome o ERP (MVP 1) como backend core.
Permite que diferentes clientes tenham sua própria instância com identidade visual customizada.

## Arquitetura
- **Tipo:** Full Stack (Frontend + BFF ou API Gateway)
- **Relação:** Consome o ERP via API. Não acessa banco de dados do ERP diretamente.
- **Padrão:** O White Label orquestra chamadas ao ERP e adapta para cada tenant/cliente

## Stack
### Atual
- Frontend: React + TypeScript
- Backend/BFF: Node.js + TypeScript
- Framework Frontend: (definir — Vite / Next.js)

### Migração Planejada (BFF/Backend)
- Linguagem: Java
- Framework: Spring Boot ou Quarkus
- Frontend: permanece React

## Módulos White Label
- [ ] Configuração de tema por tenant (cores, logo, tipografia)
- [ ] Autenticação (delegada ao ERP)
- [ ] Dashboard customizável por cliente
- [ ] Módulos habilitáveis por tenant (financeiro, estoque, etc.)
- [ ] Gestão de usuários por tenant

## Regras de Desenvolvimento

### Geral
- O White Label **nunca** deve conter regras de negócio do ERP — isso fica no MVP 1
- Toda comunicação com o ERP via HTTP (contratos versionados)
- Nomenclatura em inglês para código, português para docs e comentários de negócio
- Git e commits: ver `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md`

### Customização White Label
- Temas armazenados por tenant (CSS variables ou theme tokens)
- Nenhum componente de UI deve ter cores hardcoded — sempre via variáveis de tema
- Logo e assets por tenant carregados dinamicamente

### Agentes

#### 🧑‍💻 Agente de Desenvolvimento
- Frontend: componentes React reutilizáveis e orientados a tema
- Nunca chamar o banco do ERP diretamente — sempre via API
- Manter compatibilidade com as versões de API do ERP consumidas

#### 🧪 Agente de QA
- Testes de componentes React: Vitest + Testing Library
- Testes E2E: Playwright (definir)
- Testar comportamento com diferentes temas/tenants
- Verificar que dados de tenant A não aparecem para tenant B

#### 📋 Agente de Scrum
- Toda tarefa deve ter critério de aceitação antes de iniciar
- Estimativas em Story Points (Fibonacci: 1, 2, 3, 5, 8)
- Definition of Done: código + teste + tema validado + docs atualizada

#### 📄 Agente de Documentação Viva
- Manter `docs/` atualizado a cada feature
- Documentar quais endpoints do ERP são consumidos em `docs/erp-integration/`
- Registrar decisões em `docs/adr/`

## Integração com ERP (MVP 1)
- Base URL do ERP configurada via variável de ambiente: `ERP_API_URL`
- Autenticação: JWT recebido do ERP, repassado nas chamadas
- Nunca expor o token do ERP diretamente ao frontend
- Em caso de mudança de versão do ERP, atualizar `docs/erp-integration/`

## Contexto de Negócio
- Cada cliente final é um tenant com sua identidade visual própria
- O White Label é a "casca" — o ERP é o "cérebro"
- Prioridade: experiência visual por tenant + estabilidade da integração com ERP

## Variáveis de Ambiente
```env
ERP_API_URL=http://localhost:3001     # URL do ERP (MVP 1)
ERP_API_VERSION=v1
JWT_SECRET=seu-secret
TENANT_ID=identificador-do-tenant
```

## Comandos Úteis
```bash
# Frontend React
npm run dev        # desenvolvimento
npm test           # testes unitários
npm run build      # build produção

# BFF Node/TypeScript
npm run dev:bff
npm test

# Java (após migração do BFF)
./mvnw spring-boot:run
./mvnw test
```

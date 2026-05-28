# 🧠 Resumo de Intenção: Módulo de Gestão de Tenants (v1.0)
** thread:** gestao-tenants-core
** source_of_truth:** beehive/collective_intelligence/ideacao/RESUMO_INTENCAO_GESTAO_TENANTS_V1.md
** status:** rascunho-po

## 1. 🎯 Dor do Usuário (O "Porquê")
Hoje, para criar um novo cliente no TenantOS ou ativar uma funcionalidade (ex: Módulo de Vendas), o Márcio precisa intervir manualmente no banco de dados via Prisma Studio. Isso não escala. O sistema precisa de uma "Central de Comando" onde a criação de novos negócios e a ativação de módulos sejam operações de interface.

## 2. 💎 Valor de Negócio (ROI)
- **Escala SaaS:** Permite que o TenantOS suporte centenas de clientes sem esforço manual.
- **Faturamento Dinâmico:** Viabiliza o modelo de "Pague pelo que usar" (Sanfona), ativando/desativando módulos instantaneamente.
- **Onboarding Rápido:** Reduz o tempo de setup de um novo cliente de minutos para segundos.

## 3. 📋 Requisitos Funcionais (O "O quê")

### A. Gestão de Empresas (Tenants)
- **CRUD Completo:** Criar, Editar, Listar e Desativar Tenants.
- **Identidade Base:** Nome, CNPJ/CPF, Slug Único (ex: `minha-loja.tenantos.com.br`), Email de Contato.
- **Status de Operação:** Ativo / Suspenso / Aguardando Onboarding.

### B. Painel de Controle de Módulos (Plug & Play)
- **Seletor de Capacidades:** Interface para ligar/desligar módulos por Tenant:
    - [ ] Vendas (Core)
    - [ ] Estoque (Core)
    - [ ] Financeiro (Expandido)
    - [ ] Agente de Vendas (Premium - BLOQUEADO)
- **Persistência:** Deve refletir imediatamente na tabela `TenantModulo`.

### C. Gestão de Usuários Master
- Associar o primeiro usuário "Admin" ao Tenant no ato da criação.

## 🛡️ 4. Regras de Ouro (Segurança & Negócio)
- **Isolamento de Slug:** O slug deve ser validado via Regex e ser único em todo o sistema.
- **Soerania Admin:** Apenas o `Márcio` (ou um usuário com role `SUPER_ADMIN`) pode acessar o CRUD de Tenants.
- **Auditoria:** Toda ativação/desativação de módulo deve gerar um log de auditoria.

---

## 📐 5. Próximos Passos Sugeridos
1. **Debate Técnico:** Como garantir que o cache de permissões seja invalidado quando um módulo for desligado?
2. **Blueprint:** Desenhar o `TenantService` e o `ModuloGuard`.
3. **Materialização:** Criar a UI de "Painel do Admin" no White Label.

---
*Assinado: Product Owner (Hive Framework)*

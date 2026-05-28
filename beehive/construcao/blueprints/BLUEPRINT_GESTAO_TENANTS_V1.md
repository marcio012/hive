# Blueprint: Gestão de Tenants & Módulos Plugáveis (#011)
** thread:** gestao-tenants-core
** source_of_truth:** beehive/construcao/blueprints/BLUEPRINT_GESTAO_TENANTS_V1.md
** status:** aprovado-arquiteto
** ID da Issue:** #011

---

## 1. Objetivo (O QUE)
Implementar a infraestrutura de controle SaaS do TenantOS no NestJS Core, permitindo o CRUD de Tenants (Empresas) e o controle dinâmico de ativação de módulos (Conceito Sanfona).

## 2. Contexto e Motivação (POR QUE)
Atualmente, a criação de novos Tenants e a ativação de funcionalidades são feitas via manipulação direta de DB. Este módulo centraliza a "inteligência de plataforma", permitindo que o Márcio gerencie o ecossistema via interface e que o sistema bloqueie automaticamente módulos não contratados.

## 3. Contrato Técnico (COMO)

### 3.1 Evolução do Schema Prisma
Local: `tenantOS/backend/prisma/schema.prisma`

```prisma
model Tenant {
  id          String   @id @default(cuid())
  nome        String
  slug        String   @unique // ex: 'restaurante-do-marcio'
  cnpj        String?  @unique
  email       String   @unique
  status      String   @default("ativo") // 'ativo' | 'suspenso' | 'aguardando_onboarding'
  logoUrl     String?
  corPrimaria String?  @default("#3B82F6")
  criado_em   DateTime @default(now())
  
  // Relações
  usuarios    Usuario[]
  modulos     TenantModulo[]
  // ... outras relações existentes (Vendas, Produtos, etc)
}

model TenantModulo {
  id        String   @id @default(cuid())
  tenantId  String
  modulo    String   // 'vendas' | 'estoque' | 'agenda' | 'financeiro'
  ativo     Boolean  @default(true)
  criado_em DateTime @default(now())

  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, modulo])
}
```

### 3.2 Lógica do `ModuloGuard`
Local: `tenantOS/backend/src/common/guards/modulo.guard.ts`

**Funcionamento:**
1. O Guard lê o nome do módulo necessário via decorator `@Modulo('nome_modulo')`.
2. Recupera o `tenantId` do `TenantContext` (AsyncLocalStorage).
3. Verifica na tabela `TenantModulo` se o módulo está ativo.
4. **Cache Strategy:** Utilizar um `Map` simples em memória no Service (ou Redis no futuro) para armazenar os módulos ativos do Tenant por 5 minutos, invalidando no `onModuleUpdate`.

### 3.3 Endpoints (Admin Central)
Local: `tenantOS/backend/src/admin/tenants.controller.ts`

- `POST /admin/tenants`: Cria novo Tenant + Ativa módulos base (Varejo/Serviços).
- `GET /admin/tenants`: Lista todos os clientes e status.
- `PATCH /admin/tenants/:id/modulos`: Liga/Desliga um módulo específico.
- `PATCH /admin/tenants/:id/status`: Suspende ou Reativa um cliente.

## 4. Critérios de Aceite (DONE)
- [ ] CRUD de Tenants funcionando com validação de slug único.
- [ ] Ativação de um módulo reflete imediatamente na capacidade do Tenant de acessar as rotas protegidas.
- [ ] Tentativa de acesso a módulo desativado retorna `403 Forbidden` com mensagem: "Módulo [NOME] não contratado".
- [ ] Schema Prisma migrado e `npx prisma generate` executado.
- [ ] Teste unitário do `ModuloGuard` cobrindo cenários `Ativo` e `Inativo`.

## 5. Restrições e Proibições (NÃO FAZER)
- Proibido expor endpoints `/admin/*` para usuários que não sejam `SUPER_ADMIN` ou o próprio `Márcio`.
- Proibido deletar registros físicos de `Tenant` (usar `status: 'suspenso'`).
- Proibido hardcoded de IDs de Tenants no código.

---

## 💰 Análise Financeira (DIR-080)
- **Custo de Implementação:** R$ 1,50 (NestJS Guard + Prisma Migration).
- **ROI:** Vital para o modelo de faturamento por módulo (SaaS).

---
*Assinado: Claude (Arquiteto Hive OS)*

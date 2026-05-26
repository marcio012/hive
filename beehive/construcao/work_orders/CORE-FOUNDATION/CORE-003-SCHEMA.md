# Work Order: CORE-003 — Base Schema Sync

## 🎯 Objetivo
Sincronizar o Prisma Schema com as necessidades do "Novo Mundo" NestJS, mantendo compatibilidade com os dados do Legado.

## 🛠️ Especificação Técnica
- **Entidades Obrigatórias:**
  - `Tenant`: Adicionar flag `ativo: boolean`.
  - `TenantModulo`: Tabela de junção [Tenant <-> ModuloSlug].
  - `Usuario`: Garantir campos `tenant_id` (FK) e `role`.
- **Relacionamentos:** Todos os modelos de negócio (Venda, Produto) **DEVEM** ter vínculo obrigatório com `Tenant`.
- **Isolamento:** Aplicar `@@unique([id, tenant_id])` onde for crítico.

## ✅ Critérios de Aceite
- [ ] `npx prisma generate` roda sem erros.
- [ ] Migration não deleta dados existentes de produção (Shadow DB check).
- [ ] Estrutura suporta a lógica de CORE-002.

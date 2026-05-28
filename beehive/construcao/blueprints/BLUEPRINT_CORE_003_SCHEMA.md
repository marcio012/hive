---
id: BLUEPRINT_CORE_003_SCHEMA
titulo: CORE-003 — Schema Hardening & Consistency
backlog_ref: CORE-003
thread: core-schema-management
debate_ref: —
status: aprovado
data: 2026-05-28
responsavel: Claude (Arquiteto)
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/tenantOS
repo_target: tenantOS
cwd_exec: /home/marcio/job/tenantOS/backend
---

# Blueprint — CORE-003: Schema Hardening & Consistency

## 1. Contexto e Revisão do Escopo Original

A WO original do CORE-003 pediu:
- `Tenant.ativo` → ✅ já existe
- `TenantModulo` → ✅ já existe
- `Usuario.tenantId + role` → ✅ já existe
- FKs em todos os modelos de negócio → ✅ já existe

O schema evoluiu durante CORE-001 e CORE-002. **CORE-003 é agora um trabalho de hardening e consistência**, não de criação de estrutura nova.

---

## 2. Gaps Identificados

### 2.1 TenantModulo — sem cascade e sem index (risco operacional)

```prisma
// atual — problemático
model TenantModulo {
  id         String @id @default(cuid())
  tenantId   String
  moduloSlug String
  tenant     Tenant @relation(fields: [tenantId], references: [id])
  @@unique([tenantId, moduloSlug])
}
```

**Problemas:**
- Sem `onDelete: Cascade` → deletar um Tenant falha silenciosamente se ele tiver módulos registrados
- Sem `@@index([tenantId])` → queries de lookup de módulo por tenant fazem full scan
- Sem `@@map` → tabela fica com nome gerado automaticamente pelo Prisma (`TenantModulo`)

**Correção:**
```prisma
model TenantModulo {
  id         String @id @default(cuid())
  tenantId   String
  moduloSlug String
  tenant     Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  @@unique([tenantId, moduloSlug])
  @@index([tenantId])
  @@map("tenant_modulos")
}
```

---

### 2.2 Lead — tenant_id sem FK relation (risco de integridade)

```prisma
// atual — loose
model Lead {
  tenant_id String?  // string pura, sem FK
  ...
}
```

**Contexto:** Leads entram antes de ser associados a um tenant (estado `BOAS_VINDAS`). A ausência de FK é intencional para leads anônimos, mas uma vez associado ao tenant, não há garantia de integridade.

**Decisão arquitetural:** manter `tenant_id` como `String?` sem FK, mas adicionar `@@index([tenant_id])` para performance de queries filtradas por tenant. A integridade é garantida na camada de serviço (Lead só é associado a tenant existente).

```prisma
model Lead {
  ...
  @@index([tenant_id])
  @@map("leads")  // já tem
}
```

---

### 2.3 MovimentoEstoque — sem @@map (inconsistência de naming)

Todos os modelos que têm tabela SQL deveriam declarar `@@map` explícito para evitar que o Prisma gere nomes automáticos que variam por versão.

**Correção:**
```prisma
model MovimentoEstoque {
  ...
  @@map("movimentos_estoque")
}
```

---

### 2.4 Inconsistência tenantId vs tenant_id no Usuario

`Usuario` usa `tenantId` (camelCase) enquanto todos os outros modelos usam `tenant_id` (snake_case).

**Decisão:** NÃO migrar. O risco de renomear a coluna no DB (migration + update de todos os serviços que referenciam `tenantId`) supera o benefício cosmético. Documentar como exceção histórica.

---

### 2.5 Indexes faltando em modelos de alta consulta

| Modelo | Index faltando | Impacto |
|--------|---------------|---------|
| `Agendamento` | `[tenant_id, cliente_id]` | queries de histórico por cliente |
| `ObservacaoSessao` | `[tenant_id, cliente_id]` | idem |
| `MovimentoEstoque` | já tem `[tenant_id, criado_em]` e `[tenant_id, produto_id]` ✅ | — |

---

## 3. Escopo do CORE-003

### O que entra

| # | Arquivo | Mudança |
|---|---------|---------|
| 1 | `prisma/schema.prisma` | TenantModulo: `onDelete: Cascade` + `@@index` + `@@map` |
| 2 | `prisma/schema.prisma` | Lead: `@@index([tenant_id])` |
| 3 | `prisma/schema.prisma` | MovimentoEstoque: `@@map("movimentos_estoque")` |
| 4 | `prisma/schema.prisma` | Agendamento: `@@index([tenant_id, cliente_id])` |
| 5 | `prisma/schema.prisma` | ObservacaoSessao: `@@index([tenant_id, cliente_id])` |
| 6 | Migration gerada | 1 migration incremental |
| 7 | `prisma/seeds/` | Nenhuma alteração — seeds não mudam |

### O que NÃO entra

- Renaming de `tenantId` → `tenant_id` no `Usuario` (risco, adiar)
- Novos modelos de negócio (fora do escopo de schema core)
- Seed de módulos padrão (entra em CORE-004 se necessário)

---

## 4. Migration Strategy

Todas as mudanças são **additive** (sem drop de coluna, sem rename):
- `onDelete: Cascade` em TenantModulo é safe: apenas muda comportamento de delete
- `@@map` altera nome da tabela no DB — **requer atenção**: se a tabela `TenantModulo` já existe com dados, a migration fará um `ALTER TABLE ... RENAME TO tenant_modulos`
- Indexes são always safe

**Validação obrigatória antes de aplicar:**
```bash
npx prisma migrate dev --name core-003-schema-hardening --create-only
# revisar o SQL gerado manualmente antes de aplicar
npx prisma migrate dev
```

---

## 5. Critérios de Aceite

- [ ] `npx prisma generate` → OK
- [ ] `npx prisma migrate dev` → OK sem drop de dado
- [ ] `TenantModulo` tem cascade: deletar tenant com módulos não falha
- [ ] `npm run check:types` → OK
- [ ] `npm test -- --runInBand` → todos os testes passam (sem regressão)
- [ ] SQL da migration revisado e sem DROP TABLE / DROP COLUMN

---

## 6. Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 3–5 (delta pequeno, 1 arquivo + 1 migration) |
| Confiança | Alta |
| Valor gerado | Schema production-safe: sem risco de falha silenciosa em delete de tenant com módulos |
| Payback | Imediato — fecha risco operacional antes de ter tenants reais em produção |
| Custo de não fazer | Delete de tenant com módulos falha em runtime sem mensagem clara; queries de módulo fazem full scan |

---

## 7. Débito Técnico Rastreável

- **DT-002:** `Usuario.tenantId` em camelCase — diverge do padrão do restante do schema. Adiar para quando houver janela de migration sem dados de produção.

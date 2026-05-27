# Blueprint: Migração de Autenticação e Usuários (Legacy Death)
**Vínculo:** DEBATE-012 (Módulo 1)
**Status:** 🟡 EM DEFINIÇÃO
**Versão:** 1.0.0

---

## 1. 🎯 Objetivo
Unificar a autenticação no **NestJS Core**, eliminando o endpoint de login legado do Express e garantindo a integridade dos dados multi-tenant.

## 2. ⚡ Desafios da Migração
| Item | Legado (Express) | Novo (NestJS Core) | Estratégia |
| :--- | :--- | :--- | :--- |
| **ID do Usuário** | `Int` (autoincrement) | `String` (CUID) | Gerar novo CUID, manter old_id como meta. |
| **Senha** | Texto Plano (Inseguro) | BCrypt Hash | Hashear todas as senhas no ato da migração. |
| **Multi-tenancy** | Não explícito (Single Tenant) | Obrigatório (`tenantId`) | Vincular todos os usuários legados a um Tenant específico. |
| **Papéis (Roles)** | `tipo` ('admin', 'vendedor') | `role` ('admin', 'vendedor') | De/Para 1:1. |

---

## 🏗️ Arquitetura de Transição

### 1. Script de Migração de Dados (`migrate-users.ts`)
Um script idempotente que:
- Lê do banco legado (Prisma Client Legacy).
- Para cada usuário:
    - Verifica se já existe no Core (por email + tenantId).
    - Hashea a senha (`bcrypt.hash(user.senha, 10)`).
    - Cria o registro no Core vinculando ao `tenantId` alvo.

### 2. Compatibilidade de Login
O Core já possui `/auth/login`. O frontend legado (PDV) deve ser atualizado para:
1.  Enviar `tenantSlug` (novo campo obrigatório).
2.  Apontar para a URL do Core (`:3000/api/auth/login`).

---

## 🛠️ Especificação de Implementação (Work Order)

### Passo 1: Preparação do Core
- Adicionar campo `legacy_id` (Int, opcional) ao model `Usuario` no `schema.prisma` do Core para rastreabilidade.
- Executar `npx prisma migrate dev`.

### Passo 2: Script de Migração
- Criar `beehive/bin/migrate-legacy-auth.sh` que executa um script TS especializado.

### Passo 3: Validação
- Realizar login via Postman no Core usando credenciais migradas.
- Validar se o JWT retornado contém o `tenantId` e `tipo` corretos.

---
## ⚖️ Critério de Aceite
- [ ] Usuários legados conseguem logar no Core.
- [ ] Nenhuma senha é armazenada em texto plano no banco unificado.
- [ ] O endpoint `/login` do Express pode ser desativado com segurança.

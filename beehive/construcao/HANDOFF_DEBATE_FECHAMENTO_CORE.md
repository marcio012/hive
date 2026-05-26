# Handoff — Debate de Fechamento do Core MVP

**Data:** 2026-05-21
**Autor:** Claude (análise estratégica)
**Para:** Trio (Márcio + Copilot + Claude)
**Objetivo:** Base para debate de priorização e estimativa de conclusão do core

---

## Contexto

Ao final da sessão de hoje, foi solicitada uma análise completa do estado atual do projeto para determinar:
1. Conseguimos fechar o core hoje?
2. O que ainda falta?
3. A documentação das entidades está adequada?

Este documento registra as conclusões e abre os pontos para debate do trio.

---

## Veredicto

> **Core MVP está aproximadamente 50% completo. Não é possível fechar hoje.**
>
> O bloqueador principal é a ausência de **Auth JWT no core** — enquanto a autenticação depende do backend legado, nenhuma página do frontend migra de verdade para o core.

---

## Estado atual do core (apps/core)

### Módulos NestJS

| Módulo | Endpoints | Estado |
|---|---|---|
| `health` | GET /health | ✅ pronto |
| `prisma` | — | ✅ isolamento por tenant (AsyncLocalStorage) |
| `tenant` | GET /tenants/:slug/branding | ✅ branding V1 expandido (pendente #35 fechar) |
| `session` | GET /session/me | ⚠️ parcial — sem auth próprio |
| `produtos` | GET /produtos | ⚠️ read-only, sem CRUD |
| `vendas` | GET /vendas, POST /vendas | ⚠️ parcial — sem cancelamento, sem GET/:id |

### Infraestrutura multi-tenant

- `AsyncLocalStorage` + `TenantGuard` + header `X-Tenant-ID`: **sólido**
- Isolamento de dados por tenant: **confirmado no Prisma**
- Autenticação de usuário: **inexistente no core** (delegada ao legado)

---

## O que falta — priorizado

### Bloco 1 — Crítico (desbloqueia migração do legado)

| Item | Descrição | Impacto |
|---|---|---|
| **Auth JWT** | Login, emissão de token, refresh, guard de rota | Todas as páginas dependem disso para migrar |
| **Tenant CRUD** | Criar, editar, listar tenants via API | Hoje é operação manual no banco |
| **User CRUD** | Cadastro, atualização, listagem de usuários por tenant | Sem isso não há operação real multi-tenant |

### Bloco 2 — Funcionalidade V1 (paridade com legado)

| Item | Descrição |
|---|---|
| **Produto CRUD completo** | POST, PUT, DELETE (hoje só GET /produtos) |
| **Venda: detalhe + cancelamento** | GET /vendas/:id, PATCH /vendas/:id (cancelar) |
| **Fechar #35** | `prisma migrate deploy` + validação branding endpoint + fechar issue |

### Bloco 3 — Qualidade e operação

| Item | Descrição |
|---|---|
| **Swagger/OpenAPI** | Zero documentação de endpoint hoje |
| **Testes unitários** | 0% de cobertura no core |
| **RBAC via guard** | Roles `admin`/`vendedor` aplicadas no core, não só no frontend |

---

## Estado do frontend

### Dependência do core

| Página | Backend atual | Pode migrar? |
|---|---|---|
| Vendas | ✅ core | migrada |
| Dashboard | legado | bloqueada por Auth JWT |
| Estoque | legado | bloqueada por Auth JWT + Produto CRUD |
| Cadastro Produtos | legado | bloqueada por Auth JWT + Produto CRUD |
| Entradas/Saídas | legado | bloqueada por Auth JWT |
| Fechamento | legado | bloqueada por Auth JWT |
| Relatórios | legado | bloqueada por Auth JWT |
| Vendedores | legado | bloqueada por Auth JWT + User CRUD |
| Configurações | legado | bloqueada por Auth JWT + Tenant CRUD |
| Login | ✅ core (branding) | auth ainda legado |

**Resumo:** 9 de 10 páginas ainda dependem do legado. A migração em bloco está diretamente bloqueada pela ausência de Auth JWT no core.

---

## Estado do banco

### Schema (5 entidades)

| Entidade | Campos-chave | Estado |
|---|---|---|
| `Tenant` | slug, ativo, 11 campos branding | ✅ completo para V1 |
| `Usuario` | email, tipo (role), tenantId | ✅ modelado |
| `Produto` | sku, preços, estoque, tenantId | ✅ modelado |
| `Venda` | total, status, tenantId | ✅ modelado |
| `VendaItem` | produtoId, qtd, precoUnit | ✅ modelado |

O schema está bem modelado e não faltam entidades para o MVP. O problema é que a API não expõe nem opera a maioria delas ainda.

---

## Estado da documentação

### O que existe

| Documento | Tipo | Localização |
|---|---|---|
| 4 ADRs (decisões arquiteturais) | ✅ | `docs/adr/` |
| Arquitetura multi-tenant | ✅ | `docs/schema/ARQUITETURA_ALVO_MULTI_TENANT.md` |
| Branding schema V1 | ✅ | `docs/schema/BRANDING_VISUAL_TENANT_MVP.md` |
| Captação visual V1 | ✅ | `docs/schema/CAPTACAO_VISUAL_CLIENTE_V1.md` |
| Diretrizes ativas do trio | ✅ | `ai/construcao/DIRETRIZES_ATIVAS.md` |

### O que falta

| Documento | Descrição | Prioridade |
|---|---|---|
| Spec de endpoints do core | Contrato de cada endpoint: path, payload, response, erros | Alta |
| Doc por módulo NestJS | Responsabilidade, dependências, guards de cada módulo | Média |
| Diagrama integração legado↔core | Mapa visual do strangler fig em andamento | Média |
| ADR: escolha do NestJS | Decisão formal do framework (hoje implícita) | Baixa |
| Descritivo por entidade | README-style com regras de negócio por entidade | Baixa |

---

## Proposta de sequência para fechar o core

```
Sprint atual (fechar pendentes):
  1. Fechar #35 — migrate deploy + validar endpoint branding V1     (Copilot)
  2. Fechar #37 — frontend branding V1 no Login e Layout             (Copilot)
  3. Fechar #38 — QA visual flow end-to-end                         (Márcio)

Próximo bloco (desbloquear migração):
  4. Auth JWT no core — login/token/guard                            (Copilot)
  5. Tenant CRUD + User CRUD                                         (Copilot)
  6. Produto CRUD completo                                           (Copilot)

Bloco de migração:
  7. Migrar páginas restantes do frontend (strangler fig)            (Copilot)
  8. RBAC guard no core                                              (Copilot)

Bloco de qualidade (pré-Gate):
  9. Swagger/OpenAPI                                                 (Copilot)
 10. Testes unitários do core                                        (Copilot)
```

**Estimativa realista:** fechar o core completo leva mais **2–3 dias** no ritmo atual do trio.

---

## Pontos abertos para debate

1. **Auth JWT:** implementar do zero no core ou reaproveitar o legado com adaptador? O legado já tem auth funcional — valeria um wrapper temporário para desbloquear a migração mais rápido?

2. **Tenant + User CRUD:** criar issues separadas ou agrupar em uma única issue de "operação admin"?

3. **Testes:** o Gate de qualidade exige cobertura mínima? Se sim, qual % define o critério de aceite?

4. **Swagger:** gerar automático via decorator NestJS (já está disponível na stack) ou manter manual?

5. **Strangler fig:** migrar página por página conforme Auth estiver pronto, ou aguardar o core completo para migrar tudo de uma vez?

---

## Issues abertas relacionadas

| Issue | Título | Status | Dono |
|---|---|---|---|
| #32 | Debater expansão do ajuste visual | in-progress | claude |
| #34 | V1 operacional captação visual cliente | todo | — |
| #35 | Contrato V1 e persistência no Tenant | in-progress | claude |
| #36 | Derivação de paleta pela logo | blocked | claude |
| #37 | Frontend branding V1 Login e Layout | in-progress | copilot |
| #38 | QA fluxo visual V1 | todo | — |

---

_Gerado por Claude em sessão 2026-05-21 para debate do trio._

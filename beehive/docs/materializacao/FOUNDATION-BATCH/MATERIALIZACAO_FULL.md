# Materialização: Lote 1 — Fundação & Cérebro Modular

---

## 📖 Narrativa de Valor (O "Por Quê")
O Lote 1 é a reconstrução do "Cérebro" do TenantOS. Até agora, o sistema não tinha um segurança na porta (Auth) nem sabia separar quem é quem (TenantContext). Este lote instala o motor de segurança JWT e prepara a arquitetura para ser **Plug & Play**, permitindo que o Márcio ligue e desligue funcionalidades do cliente com um clique no banco de dados.

### 🚀 O que este lote entrega?
- **Paz de Espírito:** Blindagem contra vazamento de dados entre clientes.
- **Modelo de SaaS Industrial:** O sistema passa a entender "Capacidades" (Módulos).
- **Pronto para a Escala:** Sem este lote, o sistema seria apenas um brinquedo técnico; com ele, torna-se uma plataforma comercializável.

---

## 📐 Fluxo de Segurança (A Visão de Voo)
*Foco: Como o TenantGuard protege a fábrica.*

```mermaid
graph TD
    A[Request do Usuário] --> B{Possui JWT?}
    B -->|Não| C[401 Unauthorized]
    B -->|Sim| D{Auth Service: Valida JWT}
    
    D -->|Válido| E{TenantGuard: Módulo Ativo?}
    D -->|Inválido| F[403 Forbidden]
    
    E -->|Sim| G[Injeta req.user.tenantId]
    E -->|Não| H[403 Módulo Desativado]
    
    G --> I[Controller de Negócio]
```

---

## ⛓️ Orquestração de Login & Contexto (A Visão de Engrenagem)
*Foco: A vida de um token do NestJS até o Service.*

```mermaid
sequenceDiagram
    participant U as Usuário
    participant A as AuthModule
    participant G as TenantGuard
    participant S as BusinessService
    participant DB as Prisma DB

    U->>A: POST /auth/login
    A->>DB: Busca Usuário + Salt
    DB-->>A: Credenciais OK
    A-->>U: Retorna JWT (c/ tenantId)

    Note over U, S: Requisição Protegida
    U->>G: GET /api/v2/sales (Bearer JWT)
    G->>DB: Verifica Módulo "Sales" ativo p/ Tenant
    DB-->>G: Status: Ativo
    G->>S: Transmite Request + context(tenantId)
    S->>DB: Query: SELECT FROM sales WHERE tenant_id = context
    DB-->>S: Dados Seguros
    S-->>U: JSON Response
```

---

## 🛡️ Auditoria do Tech Lead
- **Status de Engenharia:** ✅ WORK ORDERS PRONTAS
- **Lote:** FOUNDATION (CORE-001 até 004)

> "A fundação agora contempla a visão de negócio Modular. O Copilot tem um contrato fechado para soldar a segurança do sistema."

---
*Materialização gerada sob diretriz DIR-070.*

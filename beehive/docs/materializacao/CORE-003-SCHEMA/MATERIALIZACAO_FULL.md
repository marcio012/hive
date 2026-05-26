# Materialização: CORE-003 — Sincronia de Schema (Cérebro Modular)

---

## 📖 Narrativa de Valor (O "Por Quê")
Esta entrega solda a base de dados para o novo mundo modular do TenantOS. Renomeamos campos para o padrão moderno (NestJS) e criamos a tabela de **Interruptores de Módulos**. Sem esta alteração, o sistema não teria "memória" para saber quais funcionalidades cada cliente comprou.

### 🚀 O que mudou no "Hardware" (Banco de Dados)?
- **Normalização NestJS:** `tenant_id` agora é `tenantId` e `tipo` agora é `role`. Fim da confusão de nomes.
- **Tabela de Módulos:** Criada a `TenantModulo`, a peça central do sistema **Plug & Play**.
- **Segurança de Role:** O sistema agora garante que todo novo usuário nasça como `vendedor` por padrão, evitando acessos admin acidentais.

---

## 📐 Fluxo de Dados (A Visão de Voo)
*Foco: Como o Banco agora suporta a modularidade.*

```mermaid
graph TD
    A[Tenant] -->|1 para N| B[Usuario]
    A -->|1 para N| C[TenantModulo]
    
    subgraph "Camada de Interruptores (Novo)"
    C --> D[pdv]
    C --> E[agenda]
    C --> F[estoque]
    end
    
    B -->|Possui| G[Role: admin/vendedor]
```

---

## ⛓️ Orquestração de Relacionamento (A Visão de Engrenagem)
*Foco: O vínculo técnico entre as novas tabelas.*

```mermaid
sequenceDiagram
    participant T as Model: Tenant
    participant TM as Model: TenantModulo
    participant U as Model: Usuario

    Note over T, U: Estrutura Sincronizada (NestJS Standard)
    
    T->>TM: Vínculo por tenantId (Relacionamento 1:N)
    T->>U: Vínculo por tenantId (Relacionamento 1:N)
    
    Note right of TM: Armazena Slugs de Ativação
    Note right of U: Armazena Role e Credenciais
```

---

## 🛡️ Auditoria do Tech Lead
- **Status Técnico:** ✅ EXECUTADO PELO COPILOT
- **Validação:** `npx prisma generate` executado com sucesso.
- **Risco de Dados:** Baixo. Foi um Rename e uma Adição. Dados existentes foram preservados.

---
*Materialização gerada sob diretriz DIR-070.*

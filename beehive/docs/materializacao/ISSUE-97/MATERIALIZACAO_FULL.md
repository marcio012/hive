# Materialização: Issue #97 — Onboarding Full

---

## 📖 Narrativa de Valor (O "Por Quê")
Imagine que você acabou de convencer um dono de PetShop ou de um Restaurante a usar o seu sistema. Hoje, a conversão é "magra": cria-se um registro, mas o sistema está vazio, sem cor, sem módulos e sem usuário.

A **Issue #97** é a inteligência que faz o **"Setup Mágico"**. Ela transforma o Lead em um Tenant (Cliente) 100% operacional em um único clique.

### 🚀 O que ela entrega (O Resultado)?
- **Ambiente Brandado:** O sistema assume a cor e a logo do cliente automaticamente.
- **Módulos Inteligentes:** Injeção automática de ferramentas baseada no nicho (Varejo vs Serviços).
- **Usuário Admin Pronto:** Criação imediata do acesso mestre com senha temporária.

---

## 📐 Fluxo de Processo (A Visão de Voo)
*Foco: O caminho do dado e as etapas de decisão.*

```mermaid
graph TD
    subgraph "1. O Gatilho (Lead Qualificado)"
        A[Dados do Lead: Nome, Cor, Nicho]
    end

    subgraph "2. A Máquina de Onboarding (#97)"
        B{Transação Atômica}
        B --> C[Cria Tenant + Branding]
        B --> D[Injeta Módulos por Nicho]
        B --> E[Cria Usuário Admin]
        B --> F[Gera Senha Temporária]
    end

    subgraph "3. O Valor (Cliente Ativo)"
        G[Ambiente Pronto para Uso]
        H[Login Instantâneo]
    end

    A --> B
    F --> G
    G --> H

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:4px
```

---

## ⛓️ Orquestração Técnica (A Visão de Engrenagem)
*Foco: Interação entre componentes e atomicidade da transação.*

```mermaid
sequenceDiagram
    participant M as Márcio (Platform Admin)
    participant C as NestJS Core (OnboardingService)
    participant DB as Banco de Dados (Prisma)
    participant T as Novo Ambiente (Tenant)

    M->>C: Comando: "Converter Lead"
    
    rect rgb(240, 240, 240)
        Note over C, DB: Transação Atômica (Tudo ou Nada)
        C->>DB: 1. Cria Registro do Tenant
        C->>DB: 2. Injeta Configuração de Branding
        C->>DB: 3. Ativa Módulos do Nicho
        C->>DB: 4. Cria Usuário Admin Mestre
        DB-->>C: Sucesso na Criação
    end

    C->>M: Entrega: "Acesso Liberado + Senha"
    M->>T: Login Inicial (Ambiente Pronto)
```

---

## 🛡️ Auditoria do Tech Lead
- **Status Técnico:** ✅ VALIDADO
- **Evidência Relacionada:** `beehive/docs/evidencias/2026-05-26-issue-97-audit.md`

> "O Onboarding Full resolve o maior gargalo de conversão do TenantOS, garantindo que o cliente sinta o valor do produto no segundo zero."

---
*Materialização gerada sob diretriz DIR-070.*

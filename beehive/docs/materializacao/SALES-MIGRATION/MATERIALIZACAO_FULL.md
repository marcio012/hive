# Materialização: Morte do Legado (Módulo de Vendas)

---

## 📖 Narrativa de Valor (O "Por Quê")
O Módulo de Vendas é o motor financeiro do TenantOS. Mantê-lo no Express legado é como correr uma maratona com uma bola de ferro no pé. Esta reescrita para NestJS Core elimina o débito técnico, garante que nenhum dado de venda seja perdido por falhas de tipo e prepara o sistema para escalar.

### 🚀 O que este desenho entrega?
- **Segurança Atômica:** Uso de Prisma Transactions para garantir que a venda só exista se o estoque for baixado.
- **Desenvolvimento Acelerado:** Uma API limpa e tipada para que novas funções (como cupom de desconto) sejam criadas em horas, não dias.
- **Unificação de Cérebro:** O Frontend passa a falar com um único backend, reduzindo erros de conexão e latência.

---

## 📐 Fluxo de Transição (A Visão de Voo)
*Foco: Como o legado morre e o novo nasce.*

```mermaid
graph TD
    A[Frontend] --> B{Router / Gateway}
    
    subgraph "Mundo Velho (Morte Programada)"
    B -.->|LEGACY: Desativado| C[Express :5000]
    C -.-> D[(DB Legado)]
    end
    
    subgraph "Mundo Novo (NestJS Core)"
    B -->|NOVO: /api/v2/sales| E[SalesController]
    E --> F[SalesService]
    F --> G[Prisma Transaction]
    G --> H[(Database Unificado)]
    end
    
    style C fill:#eee,stroke:#999,color:#999
    style E fill:#bfb,stroke:#333,stroke-width:2px
```

---

## ⛓️ Orquestração de Engenharia (A Visão de Engrenagem)
*Foco: A precisão da transação no NestJS.*

```mermaid
sequenceDiagram
    participant FE as Frontend (PDV)
    participant SC as SalesController
    participant SS as SalesService
    participant DB as Prisma (Transaction)
    participant ES as InventoryService

    FE->>SC: POST /api/v2/sales (CreateSaleDto)
    SC->>SS: processSale(dto)
    
    rect rgb(240, 240, 240)
        Note over SS, DB: Início da Transação
        SS->>DB: 1. Valida disponibilidade de estoque
        SS->>DB: 2. Cria registro Venda (Header)
        SS->>DB: 3. Injeta registros VendaItem
        SS->>ES: 4. Aciona baixa de estoque (MovimentoEstoque)
        DB-->>SS: Commit Sucesso
    end

    SS-->>SC: Objeto Venda Consolidado
    SC-->>FE: HTTP 201 Created
```

---

## 🛡️ Auditoria do Projetista
- **Status de Design:** ✅ PRONTO PARA OBRA
- **Contrato de Saída:** `beehive/construcao/blueprints/BLUEPRINT_LEGACY_DEATH_SALES.md`

> "Este desenho é o primeiro prego no caixão do Express. Focamos em atomicidade total para dar confiança ao Owner no fechamento de caixa."

---
*Materialização gerada sob diretriz DIR-070.*

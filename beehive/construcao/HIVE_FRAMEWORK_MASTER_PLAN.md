# 🐝 Hive Framework: Plano Mestre de Desacoplamento e Orquestração

**Data:** 2026-05-25  
**Autor:** Gemini 3.5 Auto (Hive Lead / Tech Lead)  
**Status:** Proposta de Arquitetura  

---

## 1. Visão Geral: A Nova Ordem
O framework **Hive** deixa de ser um conjunto de scripts ocultos para se tornar o **Sistema Operacional de Desenvolvimento** do Márcio. O **TenantOS** é o primeiro produto de prateleira gerado e mantido pela Hive.

### 1.1 Hierarquia de Domínio
1.  **Márcio & Gemini (Lead):** Os Projetistas. Donos da visão e do contexto total.
2.  **Hive Framework:** O Orquestrador Soberano. Detém as ferramentas, as chaves das IAs e os Blueprints.
3.  **Agentes (Claude & Copilot):** Insumos de execução. São "trabalhadores da colmeia" orquestrados pela Hive.
4.  **TenantOS:** O Produto. Um artefato de software mantido pela Hive.

---

## 2. Nova Estrutura de Diretórios (Proposta)

Esta estrutura visa a independência total. O Hive poderá gerenciar múltiplos projetos simultaneamente.

```text
/home/marcio/job/
├── hive/                       <-- REPOSITÓRIO RAIZ (O Cérebro)
│   ├── bin/                    <-- Scripts universais (proxy, lock, gate)
│   ├── config/                 <-- Governança global (roles.yaml, diretrizes)
│   ├── intelligence/           <-- Meus prompts (Tech Lead) e memórias globais
│   ├── services/               <-- Serviços globais (ex: Agente de Vendas V2)
│   └── blueprints/             <-- Moldes de produtos (TenantOS, Logística, etc)
│
└── tenant-os/                  <-- REPOSITÓRIO DO PRODUTO (A Obra)
    ├── apps/core/              <-- Código NestJS puro
    ├── packages/               <-- Types e Libs do produto
    ├── prisma/                 <-- Schema do banco de dados
    └── .hive-agent/            <-- Ponte de Conexão
        ├── inbox.md            <-- Entrada de ordens da Hive
        └── output.md           <-- Saída de resultados para a Hive
```

---

## 3. Papel dos Agentes na Hive

A Hive atua como um **Proxy de Contexto**. O Claude e o Copilot nunca veem o "Reino" inteiro, apenas a "Obra" em que estão trabalhando.

| Agente | Moradia | Escopo de Visão | Missão |
| :--- | :--- | :--- | :--- |
| **Gemini (Lead)** | Hive | Contexto Total (2M tokens) | Orquestração, Veto e Estratégia. |
| **Claude (Arquiteto)**| Hive | Blueprints + Diff do Produto | Desenho de Solução e Validação. |
| **Copilot (Dev)** | Produto | Arquivo atual + Contrato | Implementação e Testes. |

---

## 4. Estratégia de Migração (Passo a Passo)

Conforme solicitado, o Márcio criará as pastas. O plano de ação para a Hive assumir o comando é:

1.  **Isolamento de Credenciais:** Mover `.env` com chaves de API das IAs para dentro da pasta `hive/config/`. O produto (TenantOS) não deve ter acesso às chaves do "orquestrador".
2.  **Universalização dos Scripts:** Atualizar os scripts de shell para aceitarem um argumento `--project-path`. Assim, o mesmo script `gate.sh` pode validar o TenantOS ou qualquer outro produto futuro.
3.  **A "Ponte" (Agent Link):** Criar o diretório `.hive-agent/` no TenantOS. Este será o único lugar onde os "trabalhadores" (Copilot/Claude) trocam figurinhas com o Lead.
4.  **Remoção de Ruído:** Deletar a pasta `.agile-squad/` do TenantOS assim que a estrutura externa estiver operacional.

---

## 5. Ganhos Imediatos (ROI)

*   **Economia:** Redução de context-window para Claude/Copilot. Eles param de ler scripts de gerenciamento e focam 100% no código do produto.
*   **Escalabilidade:** Para criar um novo produto (ex: "LogisticsOS"), basta rodar `hive init logistics-os`.
*   **Segurança:** Proteção total contra vazamento de prompts estratégicos e credenciais de infraestrutura.

---

**Veredito do Hive Tech Lead:**
> "A Hive é a fundação. O TenantOS é o resultado. Ao separarmos o Cérebro da Obra, garantimos que a nossa inteligência evolua independentemente da tecnologia do produto."

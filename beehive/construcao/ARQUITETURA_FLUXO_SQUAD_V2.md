# Arquitetura de Fluxo & Visão Técnica: Squad Framework V2

Este documento detalha a infraestrutura lógica e operacional da nossa "Fábrica de Software", unindo a visão de processos aos mecanismos técnicos de execução.

---

## 1. Topologia de Orquestração (High Performance)

```mermaid
graph TD
    %% Entradas
    User((Márcio)) -->|Visão/Decisão| Gemini
    Lead_WA((Lead WhatsApp)) -->|Dados Brutos| WA_Service[IaMarketingService]

    %% Camada de Liderança e Integração
    subgraph Lideranca [Gemini - Squad Lead / Integrador]
        Gemini[Gemini CLI] -->|Brainstorm| Sync[Sessão de Alinhamento]
        Gemini -->|Captura| Buffer[insights-buffer.md]
        Gemini -->|Escrita Proativa| Inbox[Inboxes Agentes]
        Gemini -->|Auditoria| Gate[Gate de Qualidade]
    end

    %% Camada Estratégica
    subgraph Estrategia [Claude - Arquiteto]
        Inbox -->|Tarefa Design| Claude[Claude Code]
        Claude -->|ADR / Blueprint| Handoff[handoff-tecnico.md]
    end

    %% Camada de Execução
    subgraph Execucao [Copilot - Engenheiro]
        Handoff -->|Contrato Fechado| Copilot[Copilot CLI]
        Copilot -->|Código + Testes| Repo[(Repositório Git)]
        Copilot -->|Evidência| Docs[docs/evidencias/]
    end

    %% Fluxo de Dados do Onboarding
    WA_Service -->|JSON| Lead_Table[(DB: Lead)]
    Lead_Table -->|Trigger Conversão| Onboarding[OnboardingService]
    Onboarding -->|Prisma TX| Tenant_DB[(DB: Tenant + User + Modulo)]

    %% Ciclo de Fechamento
    Docs -->|Revisão| Gate
    Gate -->|Síntese| User
    User -->|OK Final| Push[Push para Main/HML]

    %% Estilização
    style Gemini fill:#3b82f6,color:#fff
    style Claude fill:#8b5cf6,color:#fff
    style Copilot fill:#10b981,color:#fff
    style User fill:#f97316,color:#fff
    style Onboarding fill:#ef4444,color:#fff
```

---

## 2. Visão Técnica: O Processo Atômico de Onboarding (#97)

O Onboarding não é apenas um formulário, mas uma **Transação de Estado Atômica**. O diagrama abaixo descreve a sequência técnica exata implementada para garantir que nenhum tenant nasça "capenga".

```mermaid
sequenceDiagram
    participant M as Márcio (Admin)
    participant G as Gemini (Lead)
    participant S as OnboardingService
    participant DB as Banco de Dados (Prisma)
    participant C as Cliente (Tenant)

    M->>G: "Converter Lead #ID"
    G->>S: Executa convertLead(dto)
    Note over S: Início da Prisma $transaction
    S->>DB: Criar Tenant (Slug, Branding)
    S->>DB: Ativar Módulos do Blueprint (createMany)
    S->>DB: Criar Usuário Admin (senha_hash)
    S->>DB: Atualizar Lead (status: CONVERTIDO)
    Note over S: Fim da Transação (Commit)
    S-->>G: Retorna OnboardingResult (Senha Temporária)
    G-->>M: Apresenta Dossiê de Boas-vindas
    M->>C: Envia credenciais via WhatsApp
```

---

## 3. Visão Técnica: Mecanismos de Governança

A robustez do Squad V2 baseia-se em três pilares técnicos:

### A. Configuração como Código (YAML)
Em vez de instruções em texto livre, o papel de cada agente é regido pelo `ROLES_CONFIG.yaml`.
*   **Vantagem:** Permite que o CLI valide permissões antes da execução.
*   **Parsing:** O Gemini Lead lê o YAML para decidir quais tarefas pode delegar ou assumir.

### B. Sincronização e Lock (Flock)
Como operamos com múltiplos terminais simultâneos, a escrita nos Inboxes e no Board usa um sistema de **Lock por Arquivo (`flock`)**.
*   **Mecanismo:** `scripts/local/squad-inbox-write.sh` garante que duas IAs não escrevam no mesmo `.md` ao mesmo tempo, evitando perda de tarefas (TOCTOU).

### C. Semáforo de Execução (DIR-047)
O feedback loop entre o usuário e os agentes é regido por estados visíveis:
*   🟢 **[PODE EXECUTAR]**: A IA tem permissão total.
*   🟡 **[AGUARDA MÁRCIO]**: Checkpoint de segurança ou dúvida.
*   🔴 **[BLOQUEADO]**: Falha de auditoria ou correção pendente.

---

## 4. Fluxo de Transformação de Dados

O valor do TenantOS reside na **Inteligência Comercial** integrada:

| Origem (Lead JSON) | Motor de Inferência | Destino (Schema Core) |
| :--- | :--- | :--- |
| `nicho: 'Salão'` | Blueprint Mapper | `TenantModulo`: Agenda, Clientes |
| `logo: 'base64...'` | Design Assistant | `Branding.logo_url` |
| `cor: '#FF5733'` | Color Extractor | `Branding.cor_primaria` |
| `email: 'joao@...'` | User Factory | `Usuario.email` (admin) |

---
*Documento de referência técnica — Squad V2 "High Performance".*

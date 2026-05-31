# Diagrama de Interação: O Balcão Central (Pull-based)

Este diagrama representa a lógica de "Balcão" (Broker) que estamos debatendo.

## 1. Versão Mermaid (Lógica de Sequência)

```mermaid
sequenceDiagram
    participant D as Diretor (Márcio)
    participant B as O BALCÃO (Broker)
    participant I as Integrador (Gemini)
    participant A as Arquiteto (Claude)
    participant V as Dev (Copilot)

    Note over D,V: Fluxo de Pull (Puxar Trabalho)

    D->>B: Publica Objetivo (TASK-001)
    I->>B: Monitora & Notifica Papéis
    
    A->>B: "Sou Arquiteto, tem algo para mim?"
    B-->>A: Entrega TASK-001 (Status: Em Execução)
    Note right of A: Arquiteto trabalha isolado
    A->>B: Devolve Blueprint (Status: Revisão / Ready for Dev)
    
    V->>B: "Sou Dev, tem algo para mim?"
    B-->>V: Entrega TASK-001 (Status: Em Execução)
    Note right of V: Dev implementa código
    V->>B: Devolve Código/PR (Status: Aguardando Validação)
    
    I->>B: Valida Integridade & Notifica Diretor
    D->>B: Revisa Resultado Final
    D->>B: Aprova & Encerra (Status: Concluído)
```

## 2. Representação Visual (ASCII)

```text
       [DIRETOR] ───────────┐
                            │ (1) Publica Objetivo
                            ▼
                    ┌───────────────┐
                    │   O BALCÃO    │ ◄──── (2) Integrador Monitora
                    └───────────────┘
                      ▲           ▲
         (3) Puxa Task│           │ (5) Puxa Task
         (4) Devolve  │           │ (6) Devolve
             Blueprint│           │     Código
                      ▼           ▼
                 [ARQUITETO]     [DEV]
```

---
*Nota: Este rascunho lógico deve ser usado como base para a criação do diagrama final no Draw.io.*

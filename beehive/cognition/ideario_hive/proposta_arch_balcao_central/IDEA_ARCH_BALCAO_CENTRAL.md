---
titulo: Manifesto do Balcão Central (Central Broker Architecture)
tipo: arquitetura
status: rascunho
ultima_revisao: 2026-05-30
responsavel: Integrador (Gemini)
---

# ARCH-001: Arquitetura do Balcão Central

Este documento define a mudança de paradigma na comunicação da Squad Hive: do modelo de **Handoff Direto** para o modelo de **Fila Centralizada (Balcão)**.

## 1. O Paradigma do Balcão (Broker)

A partir desta diretriz, a comunicação entre papéis (Arquiteto, Dev, Integrador, Diretor) deixa de ser ponto-a-ponto. 

### 1.1 Regras de Ouro
*   **Centralidade:** O Balcão é a única fonte da verdade sobre o que precisa ser feito.
*   **Desacoplamento:** Um papel não precisa saber "quem" é o executor do próximo passo, apenas qual "papel" é necessário.
*   **Pull-based:** Agentes não "empurram" trabalho; eles "puxam" trabalho do Balcão quando estão disponíveis.

## 2. A Unidade de Trabalho: Ordem de Serviço (Task)

Toda interação no Hive deve ser encapsulada em uma Task no Balcão.

### 2.1 Estrutura de uma Task (Proposta)
| Campo | Descrição |
|---|---|
| `ID` | Identificador único (ex: TASK-123) |
| `Issuer` | O papel que criou a task (ex: Diretor) |
| `Target Role` | O papel necessário para executar (ex: Arquiteto) |
| `Status` | Pendente \| Em Execução \| Revisão \| Concluído |
| `Priority` | Baixa \| Média \| Alta \| Crítica |
| `Payload` | O contexto, links para blueprints e objetivos claros |
| `Handoff Trace` | Histórico de quem passou por essa task |

## 3. Fluxo de Interação no Balcão

1.  **Publicação:** O `Issuer` publica a Task no Balcão.
2.  **Sinalização:** O Balcão emite um sinal (ex: mudança em arquivo central ou evento via Web UI).
3.  **Assunção:** Um agente assume a Task, mudando o status para `Em Execução`.
4.  **Devolução:** Ao terminar, o agente publica o resultado de volta no Balcão e sinaliza o próximo papel necessário (ou devolve para o `Issuer`).

---
*Status: Aguardando discussão do Ponto 1 com o Diretor.*

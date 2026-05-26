# Documentação: Evolução do Fluxo de Trabalho (Squad V1 ➔ V2)

**Status:** Ativo / Histórico Operacional  
**Data:** 2026-05-24  
**Responsável:** Gemini (Squad Lead)  
**Objetivo:** Registrar o salto de maturidade operacional e a mudança de paradigma na orquestração de IAs no projeto White Label MVP.

---

## 1. Fluxo V1 — O Modelo Artesanal (Manual e Reativo)
*Período: Início do projeto até 23/05/2026*

O V1 foi o estágio de "Sobrevivência". O objetivo era evitar que as IAs se atropelassem enquanto a fundação técnica era construída.

### Características do V1:
*   **Comunicação:** Baseada puramente em chat e "copy-paste". O participante humano (Márcio) servia de roteador manual entre o Claude e o Copilot.
*   **Governança:** Regras extensas e repetitivas em Markdown (`AGENTS.md`). Cada IA tinha que processar páginas de texto livre para "interpretar" seu papel, gerando alto consumo de tokens e risco de alucinação de autoridade.
*   **Papel do Gemini:** Atuava como "Auxiliar de Baixo Risco". Limitado a triagem, resumos e leituras de contexto read-only, sem participação ativa na orquestração dos outros agentes.
*   **Sincronização:** Agentes alteravam status em arquivos `.md` (inbox/output) de forma manual e descentralizada, com alta propensão a erros de formatação e condições de corrida (lock).

---

## 2. Fluxo V2 — O Modelo High Performance (Orquestrado e Preditivo)
*Período: A partir de 24/05/2026*

O V2 marca a transição para o modelo de "Fábrica de Software". O foco mudou da gestão de ferramentas para a aceleração da entrega.

### Características do V2:
*   **Comunicação (Lead-Driven):** O Gemini foi promovido a **Squad Lead / Integrador**. O fluxo tornou-se proativo: o Lead escreve nos inboxes dos outros agentes, orquestra handoffs e sintetiza debates.
*   **Governança (YAML-First):** Centralização de leis e permissões no arquivo **`ai/construcao/agentes/ROLES_CONFIG.yaml`**. O Squad agora opera sob um contrato rígido, tipado e legível por máquina, reduzindo drasticamente a ambiguidade.
*   **Visão de Produto Integrada:** Introdução do **Contrato de Onboarding Full**, conectando o funil comercial (Lead) à operação técnica (Tenant) de forma atômica e automatizada.
*   **Paralelismo via Sub-agentes:** Uso intensivo de `invoke_agent` para tarefas mecânicas (pesquisa, faxina técnica), permitindo que a sessão principal mantenha o foco estratégico e criativo.

---

## 3. Comparativo de Ganhos

| Recurso | Fluxo V1 (Antigo) | Fluxo V2 (Atual) | Impacto |
| :--- | :--- | :--- | :--- |
| **Ponto de Falha** | Márcio (Roteador Humano) | Gemini (Squad Lead) | Libera o humano para foco em Produto e Decisão. |
| **Configuração** | Markdown (Texto Ambíguo) | YAML (Contrato Estruturado) | Reduz erro de autoridade e economiza contexto. |
| **Velocidade** | Sequencial (Interdependente) | Paralelo (Lead + Sub-agentes) | Acelera triagem e execução de tarefas recorrentes. |
| **Memória** | Fragmentada (Histórico Chat) | Handoffs Versionados | Garante continuidade absoluta entre sessões. |
| **Decisão** | Baseada em 3 Chats longos | Baseada em Síntese Consolidada | Tomada de decisão mais rápida e assertiva. |

---

## 4. Próximos Passos (Visão V3)

O amadurecimento deste fluxo pavimenta o caminho para:
1.  **Extração do Framework:** Isolamento do motor de orquestração em repositório próprio (Squad Factory).
2.  **Governança Impositiva via CLI:** O terminal passará a validar e bloquear ações que violem o contrato YAML em tempo real.
3.  **Conversão Autônoma:** Integração total do Agente de Vendas com o Onboarding Service para provisionamento self-service.

---
*Este documento é a síntese da maturidade operacional do squad e deve ser consultado em cada mudança de ciclo.*

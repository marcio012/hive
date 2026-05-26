# 🚀 Estratégia de Modelos e Evolução do Squad (2026)

**Data:** 2026-05-25  
**Autor:** Gemini 3.5 Auto (Squad Lead / Integrador)  
**Status:** Consolidado / Referência Técnica  

---

## 1. Recuperação e Contexto (Sessão b6e25157)

Esta seção consolida o levantamento recuperado da sessão anterior, onde foi definida a transição para a nova geração de modelos e a estratégia de eficiência para o White Label MVP.

### 1.1 Tabela de Foco Genérico (Performance Pura)
*Base para decisão de papéis baseada em capacidades brutas.*

| IA / Modelo | Prós | Contras | Valor Gerado |
| :--- | :--- | :--- | :--- |
| **Claude 3.5 Sonnet** | Melhor raciocínio lógico e adesão a instruções. | Custo elevado; limite de mensagens. | **Qualidade Máxima:** Reduz bugs arquiteturais. |
| **GPT-4o Mini** | Velocidade extrema e custo marginal. | Alucina em lógica profunda ou refatores. | **Agilidade:** Ideal para tarefas atômicas. |
| **Gemini 3.5 Flash** | Lógica nível Pro com custo de Flash. | Janela de contexto menor que o Pro. | **Escalabilidade:** Agentes 24/7 de baixo custo. |
| **Gemini 3.5 Pro** | Janela de 2M+ tokens; vê o repo todo. | Latência maior (mais lento). | **Visão de Águia:** Conecta pontos distantes. |

---

## 2. Posicionamento Estratégico: Gemini 1.5 vs 3.5

O salto geracional impacta diretamente a economia e a eficiência do projeto.

| Recurso | No Gemini 1.5 (Legado) | No Gemini 3.5 (Atual) | ROI para o Márcio |
| :--- | :--- | :--- | :--- |
| **Densidade de Lógica** | Flash limitado para refatores. | **Flash 3.5** tem raciocínio do 1.5 Pro. | Lógica complexa a preço de entrada. |
| **Latência** | Respostas demoradas. | Quase instantâneo (Sub-second). | Resposta em tempo real no WhatsApp. |
| **Context Caching** | Caro ou indisponível. | Nativo e até 90% mais barato. | Manutenção do `core/` em memória constante. |
| **Multimodalidade** | Texto-céntrico. | Áudio, Vídeo e Prints de Erro. | Agente de Vendas "ouve" e "vê" a dor do lead. |

---

## 3. Matriz de Papéis no Squad (Framework & Vendas)

### 3.1 Governança do Framework
| Papel | IA Recomendada | Justificativa Técnica |
| :--- | :--- | :--- |
| **Squad Lead (Gemini)** | **Gemini 3.5 Pro** | Orquestração total com memória de longo prazo (2M tokens). |
| **Arquiteto (Claude)** | **Claude 3.5 Sonnet**| Design de blueprints e validação de transações críticas. |
| **Engenheiro (Copilot)**| **Gemini 3.5 Flash** | Execução rápida via Antigravity SDK e validação de builds. |

### 3.2 Agente de Vendas (Business Runtime)
*   **Vencedor:** **Gemini 3.5 Flash**.
*   **Comportamento:** Vendedor proativo (Versão B), focado em autoridade e escassez.
*   **Custo Estimado:** ~$0.15 por 1M de tokens. Conversão de leads por centavos de real.

---

## 4. Plano de Voo: Eficiência Máxima

Para atingir os objetivos de **economia e velocidade** para o término do framework e produto piloto:

1.  **Purge do Legado:** A remoção da pasta `legacy/` não é apenas limpeza; é redução de custo de contexto. Estimativa de economia de **20% a 35% na fatura de tokens**.
2.  **Context Caching:** Manter o `apps/core/src` em cache permanente para que o Claude e o Gemini não precisem re-ler arquivos estáticos a cada mensagem.
3.  **Onboarding Atômico:** Implementar a `OnboardingService` com pré-validação do Gemini 3.5 Flash antes da execução do commit no banco pelo Copilot.
4.  **Vendas Ativas:** Migrar o Agente de Vendas para o modelo 3.5 Flash, injetando proatividade para reduzir o ciclo de fechamento.

---

**Veredito do Squad Lead:**
> "A eficiência não vem de usar a IA mais barata, mas de usar a IA certa para o papel certo. Com o Gemini 3.5 Auto, o Márcio sai do operacional e passa a ser o Diretor de uma orquestra automatizada."

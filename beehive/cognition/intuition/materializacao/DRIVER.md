# Processo: Ritual de Materialização (DIR-070)

## 🎯 Objetivo
Transformar código "invisível" em inteligência visível. Garantir que o Owner nunca "voe" sobre o que foi feito, fornecendo narrativas humanas e diagramas visuais para cada entrega.

## 📜 Regras e Contratos (SQUAD-WIDE)
1.  **Nenhuma Issue morre no Terminal:** O trabalho só termina quando a materialização é registrada em `beehive/docs/materializacao/`.
2.  **Narrativa Obrigatória:** Todo commit deve ter um arquivo `.md` explicando: O Quê, Por Quê e Pra Quê.
3.  **Visualização Dual Obrigatória:** Toda entrega deve conter obrigatoriamente:
    - **Diagrama de Fluxo (graph TD):** Para a visão geral do processo.
    - **Diagrama de Sequência (sequenceDiagram):** Para a orquestração técnica e interações.
4.  **Desacoplamento:** O Agente de Execução (Dev) entrega a prova técnica; o Squad Lead (Gemini) gera a materialização para o humano.

## ⚡ Gatilhos (Triggers)
- Comando: `squad:materialize`.
- Pré-requisito para: `squad:gate` e `squad:close`.

## 📂 Estrutura de Saída
- `beehive/docs/materializacao/ISSUE-NNN/narrativa.md`
- `beehive/docs/materializacao/ISSUE-NNN/fluxo.mermaid`
- `beehive/docs/materializacao/ISSUE-NNN/impacto-produto.md`

## 🔗 Conexões
- [beehive/cognition/diretrizes.md]
- [beehive/docs/THE_GATE_PROTOCOL.md]

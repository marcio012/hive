# AGENTS.md — Governança do Hive Framework

Este arquivo é o ponto de entrada para todos os agentes de IA. A estrutura de papéis e permissões foi centralizada no Hive para otimizar o contexto e a velocidade de entrega.

## Fonte Única de Verdade (Single Source of Truth)

Toda a definição de papéis, permissões e hierarquia de escalada agora reside em:
👉 **`beehive/roles/roles.yaml`**

## Camadas do Hive

- **Márcio - Dev**: Proprietário da Colmeia, decisão final e direção do produto.
- **Gemini - Hive Lead / Tech Lead**: Orquestração operacional, poder de veto, integração técnica e síntese.
- **Claude - Arquiteto / Estrategista**: Desenho de soluções, blueprints e tese técnica.
- **Copilot - Engenheiro de Software**: Execução técnica e implementação de código.

## Instruções Específicas por Agente

Para detalhes operacionais sobre *como* cada agente deve atuar (prompts, modos, comandos):

- **Gemini**: `beehive/.gemini/GEMINI.md`
- **Claude**: `beehive/.claude/CLAUDE.md`
- **Copilot**: `beehive/.copilot/COPILOT.md`

## Regras Operacionais Críticas

1. **Leitura Obrigatória:** Antes de qualquer tarefa, leia o `roles.yaml` e as `beehive/cognition/diretrizes.md`.
2. **Handoffs:** Devem seguir o padrão: Contexto, Objetivo, Sequência e Checkpoint.
3. **Escalada:** Problemas técnicos não resolvidos pelo Copilot sobem para o Gemini (Tech Lead); impasses arquiteturais sobem para o Claude.

---
*Este arquivo deve ser mantido enxuto. Alterações estruturais nos papéis devem ser feitas no arquivo YAML.*

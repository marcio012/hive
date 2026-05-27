# AGENTS.md — Governança do Hive Framework

Este arquivo é o ponto de entrada para todos os agentes de IA. A estrutura de papéis e permissões foi centralizada no Hive para otimizar o contexto e a velocidade de entrega.

## Fonte Única de Verdade (Single Source of Truth)

Toda a definição de papéis, permissões e hierarquia de escalada agora reside em:
👉 **`beehive/roles/roles.yaml`**

## Camadas do Hive (Estrutura de Boot)

- **Hive - Owner**: Proprietário da Colmeia, decisão final e direção do produto.
- **Kernel (DNA)**: Núcleo de orquestração e interface de sistema. Inicia em estado de espera.
- **Cartuchos (Roles)**: Identidades dinâmicas (PO, Tech Lead, Projetista) carregadas sob demanda.

## Instruções de Inicialização

1. **Apresentar Interface**: O sistema deve perguntar ao usuário se deve ler e exibir `@beehive/HIVE.md`.
2. **Aguardar Escolha**: Nenhuma identidade ou papel deve ser assumido antes da seleção explícita do fluxo (A ou B).
3. **Carregamento Dinâmico**: Após a escolha, carregar o arquivo correspondente em `beehive/roles/` e o driver em `beehive/cognition/intuition/`.

## Instruções Específicas por Agente (Interface)

Para detalhes operacionais sobre *como* cada agente deve atuar (prompts, modos, comandos):

<!-- - **Gemini**: `beehive/.gemini/GEMINI.md` -->
- **Claude**: `beehive/.claude/CLAUDE.md`
- **Copilot**: `beehive/.copilot/COPILOT.md`

## Regras Operacionais Críticas

1. **Leitura Obrigatória:** Antes de qualquer tarefa, leia o `roles.yaml` e as `beehive/cognition/diretrizes.md`.
2. **Handoffs:** Devem seguir o padrão: Contexto, Objetivo, Sequência e Checkpoint.
3. **Escalada:** Problemas técnicos não resolvidos pelo Copilot sobem para o Gemini (Tech Lead); impasses arquiteturais sobem para o Claude.

---
*Este arquivo deve ser mantido enxuto. Alterações estruturais nos papéis devem ser feitas no arquivo YAML.*

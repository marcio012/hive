# IA para Construcao do Projeto

Esta area concentra artefatos de IA para produtividade de engenharia, operacao e documentacao viva.

## Estrutura
- agentes/: papeis operacionais do squad (Dev, QA, Arquitetura), com leitura preferencial a partir de `agentes/README.md`.
- sustentacao/: diagnostico e validacao de fluxo operacional (Jenkins/CI/CD).
- lifecycle/: automacao para atualizar docs/PROJECT_LIFECYCLE.md.
- OPERACAO_COMPARTILHADA_SQUAD.md: regras comuns entre Usuario, Copilot e Claude.

## Comandos principais
- Diagnostico Jenkins: npm run ai:sustentacao:jenkins:diagnose
- Validacao de fluxo: npm run ai:sustentacao:deploy:validate
- Atualizar lifecycle: npm run ai:lifecycle:update
- Dry-run lifecycle: npm run ai:lifecycle:dry-run
- Smoke lifecycle: npm run ai:lifecycle:smoke

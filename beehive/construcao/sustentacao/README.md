# Sustentacao IA

Material para diagnostico autonomo de falhas operacionais, com foco em Jenkins local, paridade CI e validacao de deploy.

Localizacao: `ai/construcao/sustentacao`.

## Objetivo
Permitir que o agente rode analises sem apoio manual, gere evidencias e proponha causa raiz de forma reproduzivel no mesmo host.

## Conteudo
- `jenkins-local-analysis.md`: analise do gap entre GitHub Actions e Jenkins local.
- `scripts/diagnose-jenkins-local.sh`: coleta diagnostico do ambiente Jenkins local, analisa o ultimo `jenkins-build*.txt` e sugere causa provavel + acao.
- `scripts/validate-deploy-flow.sh`: executa fluxo de validacao em etapas (ci, build de imagem e smoke local).

## Uso rapido
- Diagnostico: `npm run ai:sustentacao:jenkins:diagnose`
- Validacao de fluxo: `npm run ai:sustentacao:deploy:validate`

Os relatorios sao gravados em `.tmp/sustentacao/`.

# Kit de Portabilidade do Squad Agil

Objetivo: permitir levar o mesmo fluxo (board + labels + milestones + issues base + documentacao viva) para outro repositorio em poucos passos.

## O que e portavel
- Processo e rituais do squad.
- Scripts de automacao do board.
- Modelo de planejamento e retomada.
- Base de labels, milestones e issues iniciais.

## Arquivos-chave do kit
- `.agile-squad/config.env.example`
- `.agile-squad/config.env`
- `scripts/local/roadmap-squad-bootstrap.sh`
- `scripts/local/roadmap-board-sync.sh`
- `docs/planning/OPERACAO_AGIL_AUTOMATIZADA.md`

## Como portar para outro repositorio

1. Copiar o kit para o novo repo
- Pasta `.agile-squad/`
- Scripts em `scripts/local/`
- Docs de planning que desejar reaproveitar

2. Configurar alvo
- Copiar `.agile-squad/config.env.example` para `.agile-squad/config.env`
- Ajustar `SQUAD_OWNER`, `SQUAD_REPO` e `SQUAD_PROJECT_TITLE`

3. Rodar bootstrap
- `npm run agile:squad:bootstrap`

4. Sincronizar status
- `npm run agile:board:sync`

5. Definir foco unico inicial
- `npm run agile:board:focus -- 7`

## Observacoes
- O bootstrap e idempotente para labels/milestones e tenta evitar duplicacao de issues por titulo.
- Se ja existir board com mesmo titulo, ele reaproveita o project.
- O numero do project e salvo em `.agile-squad/config.env`.

## Estrategia de extracao
- Manter o tooling do trio/squad neste repositorio enquanto o fluxo e validado em uso real.
- Separar logicamente tooling de operacao e codigo de produto antes de qualquer extracao fisica.
- Considerar repositorio separado apenas quando houver pelo menos um reuso real adicional ou quando o kit estiver estavel.

## Requisitos
- GitHub CLI autenticado (`gh auth status`).
- `jq` instalado no ambiente.

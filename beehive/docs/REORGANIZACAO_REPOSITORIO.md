# Reorganizacao do Repositorio (Plano de Transicao)

## Objetivo
Organizar o projeto em dominios claros sem interromper o fluxo atual de desenvolvimento e deploy.

## Fase atual (aplicada)
- Criacao de `docs/`, `ops/` e `ai/` na raiz.
- Inclusao de runbooks operacionais iniciais:
  - `docs/runbooks/hml-login.md`
  - `docs/runbooks/deploy-hml.md`
- Inclusao de ADR inicial:
  - `docs/adr/ADR-0001-organizacao-repositorio.md`
- Padronizacao inicial de operacao HML:
  - Wrappers em `ops/scripts` (`deploy-hml.sh`, `smoke-hml.sh`, `logs-hml.sh`)
  - Arquivo de exemplo de ambiente em `ops/environments/hml/hml.env.example`
- Expansao da padronizacao por ambiente:
  - `ops/environments/dev` com `dev.env.example`
  - `ops/environments/prod` com `prod.env.example`
  - Wrapper adicional `ops/scripts/status-hml.sh`
- Inicio da trilha monorepo de produto:
  - Scaffolding `apps/` criado como destino de backend/frontend
  - Scaffolding `packages/` criado com pacote inicial `packages/types`
  - ADR de migracao controlada: `docs/adr/ADR-0002-migracao-apps-packages.md`
- Onda de compatibilidade de caminho novo:
  - CI e scripts da raiz com fallback para `apps/*` e legado
  - backend movido fisicamente para `apps/backend`, com proxy legado em `backend/`
  - frontend movido fisicamente para `apps/frontend`, com proxy legado em `frontend/`
- Evolucao da trilha CI/CD e estrutura de pipeline:
  - `Jenkinsfile` migrado para `ci_cd/Jenkinsfile`.
  - Script Path do job multibranch atualizado para `ci_cd/Jenkinsfile`.
  - Remocao do wrapper da raiz (`Jenkinsfile`) apos validacao de carregamento direto do novo caminho.
  - Validacao de execucao confirmada via log: `Obtained ci_cd/Jenkinsfile ...`.
  - Ajuste de fluxo CI/CD mantido:
    - parametro `PIPELINE_STREAM` (`all|ci|cd`)
    - promocao CI -> CD automatica opcional (`AUTO_PROMOTE_CI_TO_CD`)
    - promocao de artefato no CD por `SOURCE_BUILD_NUMBER`.

## Evidencias recentes (2026-05-04)
- Build 74: `SUCCESS` (fluxo CI reduzido para validacao de esteira).
- Build 75: `FAILURE` por indisponibilidade de SSH remoto em HML:
  - erro observado: `ssh: connect to host casakek.duckdns.org port 62622: Connection refused`.
- Diagnostico: falha de ambiente remoto (conectividade/servico SSH), sem regressao estrutural da migracao de repositorio.

## Marco de decisao (2026-05-04 - redesenho CI/CD)
- Diretriz aprovada para a proxima iteracao:
  - Separar pipeline em dois arquivos: `ci_cd/Jenkinsfile_CI` e `ci_cd/Jenkinsfile_CD`.
  - `Jenkinsfile_CI` executa apenas build/validacao tecnica (com teste opcional), sem deploy.
  - `Jenkinsfile_CD` executa apenas deploy/publicacao, sem rebuild.
- Regra de branch para deploy:
  - `develop` -> HML local (mesmo servidor/ambiente do Jenkins).
  - `main` -> PROD remoto (apos PR aprovado e merge).
- Regra de custo:
  - Sem Docker Hub no fluxo principal.
  - Handoff de imagem por artefato OCI (save/load) e transferencia segura entre ambientes.

## Proxima fase sugerida
1. Atualizar deploy local e documentacoes para eliminar referencias legadas de frontend/backend.
2. Adicionar wrappers de rollback em `ops/scripts`.
3. Consolidar checklist de release com gates por ambiente.
4. Remover fallback legado apos janela de estabilidade.

## Princípios
- Mudanca incremental e segura.
- Sem quebra de pipeline existente.
- Rastreabilidade por ADR para decisoes estruturais.

# Diagnostico Jenkins por log

## Fonte analisada
- Console log historico de build Jenkins (commit 7310604, arquivo jenkins-build.txt no historico git).

## Causa raiz (bloqueante)
Falha no stage Container Build (Local) por configuracao incompleta de namespace rootless do Podman no ambiente do Jenkins.

Evidencias do log:
- Warning previo:
  - Using rootless single mapping into the namespace.
- Erro final de build:
  - potentially insufficient UIDs or GIDs available in user namespace (requested 0:42 for /etc/gshadow)
  - Check /etc/subuid and /etc/subgid and run podman system migrate
  - lchown /etc/gshadow: invalid argument

Impacto:
- Stage Container Build falha e todo restante (push/deploy/smoke) e pulado.

## Itens secundarios (nao bloqueantes para o build de imagem)
1. Publicacao de status no GitHub sem permissao:
   - Resource not accessible by integration (403)
2. Credencial de status ausente/incompativel:
   - github-status-token nao encontrada ou tipo incompativel
3. Warnings de engine (Node 20 no Jenkins versus 18.20.8 no projeto):
   - nao derrubaram o pipeline neste log.

## Leitura tecnica
- GitHub Actions passou porque valida apenas codigo (install/test/build).
- Jenkins local executa build de imagem com Podman rootless; e nesse ponto quebrou por mapeamento UID/GID.

## Segunda validacao sugerida (manual)
1. No host/container do Jenkins, garantir subuid/subgid para o usuario que executa o Jenkins.
2. Rodar podman system migrate no mesmo usuario do Jenkins.
3. Reexecutar pipeline com:
   - PUSH_DOCKERHUB=false
   - DEPLOY_REMOTE_SERVER=false
   - DEPLOY_HML_LOCAL=false
4. Se passar, reabilitar PUSH_DOCKERHUB e validar etapa de push separadamente.
5. Depois reabilitar DEPLOY_REMOTE_SERVER e validar deploy remoto.

## Comandos de apoio
- npm run ai:sustentacao:jenkins:diagnose
- npm run ai:sustentacao:deploy:validate

Relatorio local de diagnostico de ambiente atual:
- .tmp/sustentacao/jenkins-diagnose-20260429-165859.md

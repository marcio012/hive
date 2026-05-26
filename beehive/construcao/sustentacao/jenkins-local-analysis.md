# Analise: Jenkins local x GitHub Actions

## Diagnostico atual
O GitHub Actions passou porque o workflow `CI` executa apenas install/test/build.

O Jenkins local possui pipeline mais amplo no `Jenkinsfile`, com defaults:
- `PUSH_DOCKERHUB=true`
- `DEPLOY_REMOTE_SERVER=true`

Com isso, mesmo quando test/build estao corretos, o job pode quebrar em etapas de:
- login/push Docker Hub
- deploy remoto via SSH
- preflight de autorizacao de push
- dependencias de runtime do host Jenkins (podman, podman-compose, sshpass, subuid/subgid)

## Gap estrutural
- GitHub Actions valida CI de codigo.
- Jenkins valida CI + release/deploy.

Portanto, sucesso no Actions nao garante sucesso no Jenkins local.

## Hipoteses mais provaveis de falha no Jenkins local
1. Credencial Docker Hub sem permissao de push no namespace/repo.
2. Credencial SSH remota ausente/incorreta para deploy.
3. `podman-compose` ausente no ambiente Jenkins local.
4. Podman rootless sem configuracao de `subuid/subgid`.

## Proxima validacao recomendada
1. Rodar `npm run ai:sustentacao:jenkins:diagnose` para gerar evidencia local automatica.
2. Rodar `npm run ai:sustentacao:deploy:validate` para validar fluxo sem deploy remoto real.
3. Executar Jenkins com parametros reduzidos para isolar a falha de deploy:
   - `PUSH_DOCKERHUB=false`
   - `DEPLOY_REMOTE_SERVER=false`
   - `DEPLOY_HML_LOCAL=false`

Se passar nesse modo, a quebra esta no bloco de release/deploy, nao no bloco de CI.

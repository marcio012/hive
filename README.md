# Hive Framework OS

Este repositório contém o **Hive Framework**, um Kernel de Inteligência Simbiótica projetado para orquestração de squads e gestão autônoma de projetos (Obras).

## Estrutura do Framework

O Framework opera a partir da raiz deste repositório, utilizando a seguinte organização:

- **`.hive-agent/`**: Ponte de comunicação ativa (Agent Bridge) para o desenvolvimento do próprio Framework.
- **`beehive/`**: Diretório de Ativos Operacionais. Contém os binários, regras de governança (roles), diretrizes de cognição e documentação técnica.
- **`package.json`**: Ponto de entrada para comandos orquestradores.

## Como funciona

O Hive é um framework **portável**. Ele pode ser "acoplado" a qualquer projeto externo (como o TenantOS) apontando para os seus binários em `beehive/bin/`. Quando acoplado, ele cria uma ponte de comunicação na raiz do projeto alvo, mantendo a inteligência centralizada aqui.

## Comandos Principais

Utilize os scripts do `package.json` na raiz:
- `npm run hive:status`: Dashboard de controle.
- `npm run hive:session:gemini`: Início de sessão para o Tech Lead.
- `npm run hive:insight`: Captura de ideias para o buffer.

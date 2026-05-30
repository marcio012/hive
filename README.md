# Hive Framework OS

Este repositório **é** o Hive Framework, um Kernel de Inteligência Simbiótica projetado para orquestração de squads e gestão autônoma de projetos.

## Estrutura do Sistema

O Hive opera a partir da raiz deste repositório. O "Sistema" compreende toda a estrutura de arquivos aqui presente, organizada da seguinte forma:

- **Raiz (`/`)**: O corpo principal do Framework, contendo as pontes de comunicação e pontos de entrada.
<!-- - **`.hive-agent/`**: Ponte de comunicação ativa (Agent Bridge) para o desenvolvimento do próprio Framework. -->
- **`beehive/`**: **Diretório de Ativos Operacionais**. É o "HD" do sistema, contendo binários, regras de governança (roles), diretrizes de cognição e documentação técnica.
- **`package.json`**: O console de comandos do Kernel.

## Como funciona

O Hive é um framework **portável**. O repositório inteiro funciona como um Sistema Operacional que pode ser "acoplado" a qualquer projeto externo. A inteligência e os processos residem na raiz e em suas subpastas operacionais.

## Comandos Principais

Utilize os scripts do `package.json` na raiz:
- `npm run squad:inbox -- copilot`: Leitura rápida do inbox operacional do domínio ativo.
- `npm run squad:session:gemini`: Início de sessão base do Gemini.
- `npm run squad:session:end:gemini`: Encerra a sessão/cartucho ativo do Gemini antes de trocar de papel.
- `npm run squad:bridge -- copilot`: Inicializa a ponte operacional do agente.
- `npm run squad:gate`: Roda o Gate técnico antes do commit final.

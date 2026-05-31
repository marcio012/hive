---
titulo: Referência de Comandos do HIVE (CLI)
tipo: engenharia
status: ativo
ultima_revisao: 2026-05-30
responsavel: Márcio (Owner)
---

# 🐝 COMMANDS REFERENCE: O Console do HIVE

Este documento é o mapa definitivo dos comandos disponíveis no `package.json` do Hive OS. Ele está estruturado em três níveis de profundidade: **Mapa Visual** para acesso rápido, **Manual Operacional** para o dia a dia e **Referência Técnica** para manutenção do Core.

---

## 🗺️ PARTE 1: Mapa Visual (Cheat Sheet Rápido)

### 🧠 Sessões e Papéis (Agent Roles)
| Comando | Ação | Para que serve? |
| :--- | :--- | :--- |
| `npm run gemini:po` | 👑 Inicia Gemini como PO | Tomar decisões de negócio e criar demandas. |
| `npm run gemini:projetista` | 📐 Inicia Gemini como Arquiteto | Desenhar Blueprints e aprovar debates estruturais. |
| `npm run gemini:coordenador` | 🚦 Inicia Gemini como Coordenador | Orquestrar o fluxo de trabalho e despachar WOs. |
| `npm run gemini:raw` | 🔓 Inicia Gemini em Modo Neutro | Papel de Staff Engineer. IA atuando estritamente em leitura, análise sistêmica e aconselhamento (Prós/Contras). Não edita arquivos. |
| `npm run po:demand` | 📝 Nova Demanda | Atalho para o PO criar uma nova entrada no backlog. |

### 🛠️ Sessões do Squad (Engineers)
| Comando | Ação | Para que serve? |
| :--- | :--- | :--- |
| `npm run squad:session:claude` | 🤖 Abre Claude | Sessão com o Arquiteto/Revisor (Auditoria). |
| `npm run squad:session:copilot` | 🧑‍💻 Abre Copilot | Sessão com o Engenheiro executor (Código). |

### 🛡️ Governança e Operação
| Comando | Ação | Para que serve? |
| :--- | :--- | :--- |
| `npm run squad:lock:acquire` | 🔒 Travar Workspace | Garante exclusividade de execução para um agente. |
| `npm run squad:telemetry` | 📊 Registrar Custo | Atualiza o log financeiro da operação. |
| `npm run squad:inbox:lint` | 🧹 Validar Inbox | Verifica integridade do arquivo `inbox-gemini.md`. |

---

## 📖 PARTE 2: Manual Operacional (O Dia a Dia)

### Bloco: SQUAD PROXIES
Estes comandos são atalhos para interações fundamentais da infraestrutura ágil.
*   `squad:bridge`: Estabelece a ponte de comunicação entre o agente e o ambiente externo.
*   `squad:inbox`: Faz a leitura rápida das caixas de entrada de trabalho pendente.
*   `squad:next`: Busca a próxima Work Order (WO) ou tarefa da esteira.

### Bloco: AGENT SESSIONS & ROLES
Onde a cognição é instanciada. Cada comando carrega o agente com um "estado de mente" específico.
*   `gemini:po`, `gemini:projetista`, `gemini:coordenador`: Carregam os cartuchos de contexto (`beehive/roles/*.md`), garantindo **Character Fidelity** na sessão do Gemini.
*   `gemini:raw` (ou sessão padrão sem cartucho): Invoca o modo Staff Engineer (Neutral). Um ambiente limpo e isolado para análise estratégica de alto nível, debate de trade-offs e revisão arquitetural. Neste modo, a IA atua apenas como conselheira técnica (Advisory) e **nunca** edita arquivos do projeto diretamente.
*   `squad:session:*`: Inicia sessões interativas no terminal para as IAs executoras (Claude/Copilot), usando o proxy apropriado.

### Bloco: GOVERNANCE & TELEMETRY
Os comandos que mantêm a integridade e os registros da Colmeia.
*   `squad:lock:*`: Gerencia quem tem o "teclado" no momento (`acquire`, `release`, `assert`). Evita conflitos quando múltiplos agentes operam o repositório.
*   `squad:cost:*`: Dispara os scripts de telemetria que atualizam `custos.log` com base em tokens usados e modelo selecionado.
*   `squad:inbox:lint` / `archive`: Processos de higiene. O Lint garante que o inbox não está corrompido, e o Archive move as entradas concluídas para o histórico, mantendo a RAM da IA leve.
*   `hive:error:*`: Interface de controle de "Safe Stop". Lê ou escreve o `.hive-agent/error-state.json` caso haja incidentes.

---

## ⚙️ PARTE 3: Referência Técnica (Deep Dive)

Abaixo, o mapeamento de como o `package.json` resolve cada chamada de script internamente.

### 1. Sistema de Proxy (`.agile-squad/proxy.sh`)
O script `proxy.sh` é o roteador principal do repositório. Quase todas as chamadas de nível superior passam por ele antes de atingir as ferramentas nativas.
*   **Dependências**: Ele mapeia comandos como `squad:session:gemini` para a execução interna (provavelmente inicializando a CLI nativa das respectivas plataformas de IA).
*   **Comportamento**: Ao receber os argumentos de Role (ex: `gemini:po`), o proxy é responsável por injetar os arquivos do respectivo cartucho no buffer de inicialização do agente.

### 2. Scripts Nativos em NodeJS (`scripts/*.js`)
Tarefas que requerem manipulação de JSON complexa ou lógica estrita (Guards) são escritas em JS puro para independência.
*   `inbox-lint.js`: Analisa `inbox-gemini.md` verificando formatação estrutural.
*   `hive-error-state.js`: Manipula o `error-state.json`. Usado pela DIR-090 (Taxonomia de Falhas) para registrar incidentes ou recuperar o sistema de um estado `paused`.
*   `hive-action-guard.js`: Motor de autorização. Chamado antes de comandos destrutivos ou transições de pipeline para validar se o ator atual detém a permissão necessária.

### 3. Orquestrador (`apps/orchestrator/`)
O núcleo operacional que monitora a esteira do Hive (DEBATE-026).
*   `squad:orchestrator:start`: Inicia o orquestrador em modo daemon via `pm2` para ficar residente.
*   O orchestrator consulta continuamente o `dispatcher.ts` e `watcher.ts` para reconciliar estados entre o mundo externo e o repositório local.

---

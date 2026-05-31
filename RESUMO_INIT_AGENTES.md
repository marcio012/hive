# Resumo: Fluxo de Inicialização de Agentes (Hive Framework)

## Visão Geral
O Hive Framework utiliza um modelo de carregamento dinâmico de contexto ("Cartuchos" e "Papéis") para otimizar o uso de tokens e manter as fronteiras de responsabilidade bem definidas.

## 1. Núcleo (DNA) - Carregado por todos (exceto modo NEUTRAL)
- `roles.yaml` (Definição de permissões e atores)
- `manifesto.md` (Visão e limites)
- `diretrizes.md` (Regras de ouro do projeto)

## 2. Especialização por Agente

### Gemini (Lead / Integrador)
- **Boot:** Lê o DNA + `beehive/HIVE.md` (Menu de Inicialização).
- **Runtime:** Carrega o cartucho escolhido (`roles/po.md`, `roles/projetista.md`, `roles/coordenador.md`).
- **Inbox:** `beehive/construcao/inbox-gemini.md`.

### Claude (Auditor / Arquiteto)
- **Boot:** Lê o DNA + `roles/claude.md`.
- **Runtime:** Baseia-se em `blueprints/` e `work_orders/` para gerar especificações ou auditar código.
- **Inbox:** `beehive/construcao/inbox-claude.md`.

### Copilot (Executor)
- **Boot:** Lê `roles/copilot.md` e `.copilot/COPILOT.md`.
- **Runtime:** Lê estritamente a Work Order (WO-xxx.md) designada para a tarefa.
- **Inbox:** `beehive/construcao/inbox-copilot.md`.

## 3. Fechamento e Telemetria
Todo fechamento de tarefa exige a geração de evidência (`SR_ENTREGA_TEMPLATE.md` ou `HANDOFF`) e o registro de custos operacionais via `beehive/bin/hive-telemetry.sh`.

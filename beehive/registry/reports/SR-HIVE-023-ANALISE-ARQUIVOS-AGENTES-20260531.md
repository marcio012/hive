# SR-HIVE-023 — Análise do Projeto e Auditoria de Arquivos de Agentes

**Data:** 2026-05-31  
**Autor:** Claude (Arquiteto)  
**Origem:** Sessão de análise exploratória com Márcio  
**Escopo:** Visão geral do projeto + mapeamento de contexto por agente + auditoria de obsolescência

---

## 1. Análise Geral do Projeto

### O que é o Hive

O **Hive OS** é um kernel de inteligência simbiótica — um framework portável que orquestra squads de IA (Claude, Copilot, Gemini) com papéis definidos, fluxo de trabalho automatizado e governança por diretrizes.

### Arquitetura (3 camadas)

| Camada | Componente | Status |
|---|---|---|
| **Orquestração** | Orchestrator (TypeScript + SQLite WAL) + Central Broker | Estável |
| **Interface** | Hive UI (NestJS 10 + React 18 + Socket.io) | Em evolução |
| **Infraestrutura** | Containers + PostgreSQL | Planejado (DEBATE-031) |

### Principais Componentes

#### Hive Orchestrator
- **Stack:** TypeScript, Node 24, better-sqlite3, pm2
- **Responsabilidade:** Daemon autônomo que monitora inboxes, roteia tarefas entre agentes e executa decisões de despacho via Central Broker
- **Status:** Estável. WO-050 restaurou fluxo Broker após DEBATE-037 Fase 3.

#### Hive UI
- **Backend:** NestJS 10 + Socket.io + JWT
- **Frontend:** React 18 + Vite + TlDraw 2.0
- **Features:** Telemetria em tempo real, Centro de Controle (Kanban), Painel de Governança, Lock System

#### Sistema de Inboxes / Roteamento
- Inboxes append-only por agente (máx. 600 chars/entrada)
- Roteamento via `routing.yaml` → Orchestrator decide despachador
- Storage: SQLite WAL (`tasks.db`) + Central Broker

### Estado Atual (2026-05-31)

**Frentes ativas:**
- **DEBATE-038** — Consolidação da camada de API do Broker no backend NestJS (Opção B aprovada)
- **WO-050** — Code review aprovado; fluxo Broker restaurado no Orchestrator

**Pendências no working tree:**
- `DEBATE-038-*.md` e 3 diagramas TlDraw — não commitados
- `hive.service.ts` modificado
- `inbox-claude.md` e `debates-abertos.md` com atualizações

**Débito técnico:** 10 itens registrados, todos classificados como LOW, sem bloqueantes críticos.

### Próximas Fases

1. **DEBATE-038** — Expor Central Broker via API REST no NestJS
2. **DEBATE-031** — Containerizar Hive + migrar para PostgreSQL
3. **DEBATE-029** — Módulo de gestão de agenda/serviços
4. **DEBATE-030** — Telemetria E2 (interações por tipo de agente)

---

## 2. Mapeamento de Arquivos por Agente ao Iniciar Sessão

### Claude (Arquiteto + Auditor)

**Arquivo principal:** `beehive/.claude/CLAUDE.md`

| Camada | Arquivos |
|---|---|
| **Core (sempre)** | `CLAUDE.md`, `dna/manifesto.md`, `cognition/CORE_GUARDS.md`, `cognition/diretrizes.md` |
| **Inbox** | `construcao/inbox-claude.md` |
| **Anchor Set** | `construcao/BACKLOG.md`, `construcao/debates-abertos.md` |
| **On-demand** | `CLAUDE_REF.md`, `CLAUDE_HML.md`, `CLAUDE_ERP.md`, `CLAUDE_WhiteLabel.md` |
| **Hooks automáticos** | `hooks/check-inbox.sh` (ao submeter), `hooks/save-session.sh` (ao encerrar) |

### Copilot (Engenheiro / Executor)

**Arquivo principal:** `COPILOT.md` (raiz)

| Camada | Arquivos |
|---|---|
| **Bootstrap** | `.hive-agent/session-state.env` (se existir) |
| **Inbox por domínio** | `inbox-copilot-hive.md` ou `inbox-copilot-tos.md` |
| **Fila por domínio** | `FILA_COPILOT_HIVE.md` ou `FILA_COPILOT_TOS.md` |
| **Papéis** | `roles/copilot.md` + `roles/copilot-hive.md` ou `copilot-tos.md` |
| **Anchor Set** | `BACKLOG.md`, `debates-abertos.md`, `roles.yaml` |
| **Cold start** | `AGENTS.md`, `CORE_GUARDS.md` |

### Gemini (Squad Lead / Facilitador)

**Arquivo principal:** `GEMINI.md` (raiz)

| Camada | Arquivos |
|---|---|
| **Core (sempre)** | `roles/roles.yaml`, `dna/manifesto.md`, `cognition/diretrizes.md` |
| **Inbox** | `construcao/inbox-gemini.md` |
| **Cartuchos (escolha)** | `roles/po-hive.md`, `roles/po-produto.md`, `roles/projetista.md`, `roles/coordenador.md` |
| **Exclusivo** | `cognition/ideario_hive/` (Gemini + Márcio apenas) |

### Fluxo de Bootstrap Resumido

```
Claude  → CLAUDE.md → manifesto + CORE_GUARDS + diretrizes → inbox-claude
Copilot → COPILOT.md → session-state → inbox-copilot-{hive|tos} → fila
Gemini  → GEMINI.md → roles.yaml + manifesto → cartucho escolhido → inbox-gemini
```

### Estado Persistente Compartilhado

| Arquivo | Propósito |
|---|---|
| `.hive-agent/session-state.env` | Estado da sessão anterior (Copilot) |
| `.hive-agent/error-state.json` | Falhas sistêmicas |
| `.hive-agent/orchestrator-state.json` | Estado do Orchestrator |

---

## 3. Auditoria de Arquivos Obsoletos / Sem Uso

### Remover (2 arquivos — antagonistas ao projeto)

| Arquivo | Motivo |
|---|---|
| `AGENTS_reset.md` | Contém "SYSTEM OVERRIDE" para desativar instruções de agentes. Sem referências ativas. |
| `prompt_rest_agente.md` | Conteúdo idêntico ao anterior, duplicado. Sem referências. |

> **Risco:** Arquivos soltos na raiz com conteúdo que contraria a governança do projeto.

### Arquivar (3 arquivos — marcados como legado no próprio conteúdo)

| Arquivo | Motivo |
|---|---|
| `beehive/.claude/CLAUDE_ERP.md` | Cabeçalho interno: "referencia legada, não usar como entrada principal" |
| `beehive/.claude/CLAUDE_WhiteLabel.md` | Idem — marcado como referência legada |
| `beehive/roles/tech-lead.md` | Papel dissolvido em 2026-05-26 por conflito de interesse estrutural |

> **Destino sugerido:** `beehive/registry/archive/docs/` para ERP e WhiteLabel; `beehive/registry/archive/roles/` para tech-lead.

### Atualizar (3 arquivos — existem mas com referências inválidas)

| Arquivo | Problema |
|---|---|
| `beehive/.copilot/COPILOT_REF.md` | Referencia caminho `ai/construcao/` que não existe mais |
| `beehive/.claude/PROMPT_CONTEXTO.md` | Menciona stacks antigas (ERP MVP, White Label); não reflete pós-DEBATE-037 |
| `beehive/.copilot/PROMPT_CONTEXTO.md` | Menciona `inbox-copilot.md` singular (hoje: `inbox-copilot-hive.md` / `inbox-copilot-tos.md`) |

### Auditar (13+ arquivos em `beehive/construcao/`)

Arquivos sem modificação desde 2026-05-26, possivelmente handoffs consumidos ou documentos superseded:

| Arquivo | Suspeita |
|---|---|
| `ARQUITETURA_FLUXO_SQUAD_V2.md` | "V2" sugere versão antiga superada |
| `EVOLUCAO_SQUAD_V1_V2.md` | Historicamente superseded |
| `HIVE_FRAMEWORK_MASTER_PLAN.md` | Plano mestre possivelmente desatualizado |
| `PLANEJAMENTO_SPRINT_1_2.md` | Sprint 1/2 provavelmente concluída |
| `HANDOFF_DEBATE_FECHAMENTO_CORE.md` | Handoff possivelmente consumido |
| `briefing-copilot-2026-05-22.md` | Briefing de sessão já encerrada |
| `handoff-copilot-debate007-sidecar.md` | DEBATE-007 ainda aberto? |
| `teste-amnesia-copilot.md` | Checklist de teste possivelmente consumido |
| `AJUSTES_SCRIPTS_SQUAD.md` | Scripts legados? |
| `AJUSTE_COPILOT_INICIO_SESSAO.md` | Pode conflitar com COPILOT.md atual |
| `CONTEXTO_TASK_COMPARTILHADO.md` | Possivelmente redundante com task pack atual |
| `TEMPLATES_COMUNICACAO.md` | Template fora do diretório correto |
| `ESTRUTURA_DETALHADA_MANIFESTO.md` | Possível duplicação do manifesto |

### Manter (confirmados ativos)

- Todos os arquivos em `cognition/diretrizes/` (DIR-071, DIR-082, etc.)
- `roles/claude.md`, `copilot-hive.md`, `copilot-tos.md`, `po-hive.md`, `po-produto.md`, `coordenador.md`
- `cognition/CORE_GUARDS.md`, `dna/manifesto.md`
- `registry/archive/inbox/*-historico.md` (arquivo correto e intencional)

---

## 4. Resumo Executivo

### Contagem de Ações

| Ação | Qtd |
|---|---|
| Remover imediatamente | 2 |
| Arquivar | 3 |
| Atualizar | 3 |
| Auditar / confirmar consumo | 13+ |
| Manter sem alteração | Maioria |

### Pontos de Atenção

1. **Arquivos override soltos na raiz** (`AGENTS_reset.md`, `prompt_rest_agente.md`) — risco de confundir agentes novos ao iniciar sessão
2. **PROMPT_CONTEXTO desatualizado** — referências a caminhos e produtos que não existem mais podem causar contexto incorreto no bootstrap
3. **13+ arquivos em `construcao/` sem toque há 5+ dias** — em período de atividade intensa, isso indica documentos não consumidos ou abandonados

### Saúde Geral

O projeto está em estado operacional sólido. A governança (CORE_GUARDS, diretrizes, roles) está atualizada. Os arquivos problemáticos são minoria e concentrados em dois grupos: resíduos de sessões antigas em `construcao/` e arquivos de contexto com referências desatualizadas nos diretórios `.claude/` e `.copilot/`.

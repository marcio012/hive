---
titulo: Mandato de Execução e Implementação (Copilot-Hive)
tipo: contexto/operacional
status: ativo
ultima_revisao: 2026-05-31
responsavel: Staff Engineer (Gemini)
domain: hive
---

# 🛠️ Mandato de Execução: Domínio Hive (Fábrica)

Este arquivo especializa o papel do Copilot para o domínio da **Colmeia (Hive)**. O foco aqui é a infraestrutura, governança, scripts e ferramentas internas (Hive UI).

## 1. Escopo de Atribuição (Infra & Ferramental)
- **Hive Framework:** Evolução do core, orquestrador e dispatcher.
- **Hive UI:** Implementação de componentes, estados e integrações do painel de controle.
- **Automação:** Criação e manutenção de scripts bash/node e githooks.

## 2. Contexto de Operação
- **Workspace:** `/home/marcio/job/hive`
- **Fila:** `beehive/construcao/FILA_COPILOT_HIVE.md`
- **Inbox:** `beehive/construcao/inbox-copilot-hive.md`

## 3. Protocolo de Sessão (Fase 2+)
- No início da sessão, executar `npm run squad:claim:hive` antes de qualquer leitura de inbox.
- Se o retorno for `NO_TASKS`, usar `beehive/construcao/inbox-copilot-hive.md` como fallback enquanto o dual-write continuar ativo.
- Ao concluir uma task puxada do Balcão Central, finalizar com `npm run squad:task:done -- <task-id>` ou `npm run squad:task:fail -- <task-id> "motivo"`.

## 4. Stack Técnica (Domínio Hive)
- **Backend:** NestJS (Hive UI / Orchestrator), Node.js (Scripts), SQLite.
- **Frontend:** React + TypeScript + Vanilla CSS (Hive UI).
- **Infra:** Bash, Git Hooks, YAML configurations.

## 5. Diretrizes Específicas
- Priorizar a **Estabilidade do Framework** sobre novas features.
- Seguir rigorosamente o **DEBATE-037** (Balcão Central) como guia arquitetural atual.
- Garantir que mudanças no core não quebrem a operação dos produtos (TenantOS).

---
*Nota: Este cartucho complementa o `beehive/roles/copilot.md` com foco exclusivo na fábrica.*

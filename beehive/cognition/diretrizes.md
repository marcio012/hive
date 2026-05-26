---
titulo: Diretrizes Globais da Colmeia (SSoT)
tipo: governanca
status: ativo
ultima_revisao: 2026-05-26
responsavel: Márcio (Owner) | Gemini (Tech Lead)
---

# 📜 Diretrizes Globais — Hive Framework

Este documento é a **Fonte Única de Verdade (Single Source of Truth)** para o desenvolvimento e orquestração. Qualquer violação destas regras deve ser barrada pelo Hive Tech Lead.

---

## 1. Regras de Ouro da Colmeia
1.  **Independência de Contexto:** IAs de execução (Copilot/Claude) nunca recebem o diretório `hive/` ao atuar em produtos (ex: TenantOS). Elas operam apenas sobre o código da obra alvo.
2.  **Contratos Obrigatórios:** Nenhuma funcionalidade complexa inicia sem um arquivo de contrato técnico (ex: `CONTRATO_ONBOARDING.md`) validado pelo Tech Lead.
3.  **Veto do Lead:** Se a implementação de qualquer agente divergir do contrato ou dos blueprints, o Tech Lead **DEVE** bloquear a tarefa e reportar ao Márcio.
4.  **Autoridade da Raiz:** O Framework é o repositório inteiro. A pasta `beehive/` é o diretório de ativos.

## 2. Padrões Técnicos Universais
- **Arquitetura:** Preferência total por **Composição e Delegação** sobre herança.
- **Segurança:** Credenciais e chaves de API **NUNCA** entram no repositório. Devem morar em Vault ou variáveis de ambiente seguras.
- **Economia:** O agente deve ser conciso. Evitar prolixidade para reduzir consumo de tokens.

## 3. Protocolos de Operação
- **Vago? Pare.** Se a instrução for ambígua, o agente não chuta. Usa o Template de Ambiguidade.
- **Handoffs:** A transição entre agentes deve conter: Contexto, Objetivo, Passos e Ponto de Parada.
- **Certificação de Risco:** Antes de alterações críticas (deleções, migrações), rodar um relatório de "Go/No-Go".

---

## 4. Registro Histórico de Diretrizes (DIR)

As diretrizes abaixo foram estabelecidas ao longo da evolução da Colmeia e permanecem vigentes.

| ID | Título | Resumo |
|---|---|---|
| DIR-001 | Escopo Padrão | Toda nova regra vale para todos os agentes por padrão. |
| DIR-004 | Nomenclatura | Referir-se ao humano como **Márcio**. Padrão: Nome-Papel. |
| DIR-006 | Política de Commits | Conventional Commits obrigatórios. Sem Co-authored de IA. |
| DIR-007 | Sem Burocracia | Toda regra nova precisa justificar ganho real de clareza. |
| DIR-032 | Escopo por Repo | Configuração de agentes não vaza entre projetos diferentes. |
| DIR-040 | Governança V2 | Claude (Arquiteto), Copilot (Engenheiro), Gemini (Lead). |
| DIR-042 | Gemini Lead | Gemini CLI orquestra inboxes e facilita processos criativos. |
| DIR-051 | Âncora da Verdade | `resposta-ancora.md` na raiz é lei máxima e deve ser limpa após uso. |

*(Nota: O registro completo detalhado de todas as 51 diretrizes está arquivado em `beehive/cognition/registry/DIRETRIZES_ATIVAS_LEGACY.md` para consulta de auditoria).*

---
## 5. Manutenção de Diretrizes
- Toda nova diretriz recebe um ID sequencial (`DIR-NNN`).
- Nunca deletar uma entrada — apenas marcar como revogada no histórico.
- O Tech Lead é o responsável por manter este documento sincronizado com as decisões do Márcio.

---
*Assinado: Gemini 1.5 Pro (Hive Tech Lead)*

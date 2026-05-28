---
titulo: Diretrizes Globais da Colmeia (SSoT)
tipo: governanca
status: ativo
ultima_revisao: 2026-05-28
responsavel: Márcio (Owner) | Gemini (Facilitador Estratégico) | Claude (Arquiteto)
---

# 📜 Diretrizes Globais — Hive Framework

Este documento é a **Fonte Única de Verdade (Single Source of Truth)** para o desenvolvimento e orquestração. Qualquer violação destas regras deve ser barrada pelo Claude (Arquiteto + Auditor Técnico).

---

## 1. Regras de Ouro da Colmeia
1.  **Independência de Contexto:** IAs de execução (Copilot/Claude) nunca recebem o diretório `hive/` ao atuar em produtos (ex: TenantOS). Elas operam apenas sobre o código da obra alvo.
2.  **Contratos Obrigatórios:** Nenhuma funcionalidade complexa inicia sem um arquivo de contrato técnico (ex: `CONTRATO_ONBOARDING.md`) validado pelo Claude (Arquiteto).
3.  **Veto do Arquiteto:** Se a implementação de qualquer agente divergir do contrato ou dos blueprints, o Claude **DEVE** bloquear a tarefa e reportar ao Márcio.
4.  **Autoridade da Raiz:** O Framework é o repositório inteiro. A pasta `beehive/` é o diretório de ativos.

## 2. Padrões Técnicos Universais
- **Arquitetura:** Preferência total por **Composição e Delegação** sobre herança.
- **Segurança:** Credenciais e chaves de API **NUNCA** entram no repositório. Devem morar em Vault ou variáveis de ambiente seguras.
- **Economia:** O agente deve ser conciso. Evitar prolixidade para reduzir consumo de tokens.

## 2. Contexto Obrigatório (O que você lê)
- `beehive/dna/manifesto.md` (Constituição).
- `beehive/dna/HIVE_PROCESS_TOPOLOGY.md` (Mapa da Fábrica).
- `beehive/MAPA_DA_COLMEIA.md` (Manual de Navegação).

## 3. Protocolos de Operação
- **Topologia de Processos:** Todos os fluxos seguem o modelo de "Canos" definido em `beehive/dna/HIVE_PROCESS_TOPOLOGY.md`.
- **Handoffs:** A transição entre agentes deve conter: Contexto, Objetivo, Passos e Ponto de Parada.
- **Handoffs Multi-repo (DIR-082):** Sempre declarar `workspace_hive`, `workspace_target`, `repo_target` e `cwd_exec`. É proibido delegar execução em repositório externo deixando o agente descobrir o destino por busca ampla.
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
| DIR-060 | Role vs Process | Separação entre Regras de Papel e Regras de Processo. |
| DIR-070 | Materialização | Proibido finalizar task sem Narrativa e Diagrama visual. |
| DIR-071 | Higiene v2 | Transição para Higiene por Protocolo e Context Packs. |
| DIR-080 | Análise Financeira | Pareceres e blueprints do Claude exigem seção financeira obrigatória. |
| DIR-081 | Aceite Técnico | Copilot gera aceite técnico automático antes de execução/commit. |
| DIR-082 | Workspaces Explícitos | Handoffs multi-repo devem declarar workspace de origem e destino. |
| DIR-083 | Formato de Debates | Todo debate deve ter bloco `## 📊 Status` com participantes (✅/[-]/[ ]) e fases ([x]/[F]/[ ]/[-]). Obrigatório desde a abertura. |
| DIR-084 | Rastreio por ID | Todo handoff, work order e commit deve referenciar o ID pai do backlog (`HIVE-NNN` ou `TOS-NNN`). |
| DIR-085 | Saída Operacional Explícita | Interações operacionais devem encerrar com estado atual, próximo passo e ação esperada. Falhas incluem campo `motivo`. Exceções: respostas informativas, conceituais e confirmações sem fluxo ativo. |

*(Nota: O registro completo detalhado de todas as 51 diretrizes está arquivado em `beehive/cognition/registry/DIRETRIZES_ATIVAS_LEGACY.md` para consulta de auditoria).*

---

## 5. Arquitetura de Cognição: Role vs Process (DIR-060)

Para garantir a modularidade e a escalabilidade do HIVE, as regras de atuação são divididas em duas camadas independentes:

### 1. Camada de Papel (Role Rules)
- **Onde moram:** `beehive/roles/`
- **O que definem:** A **personalidade, postura e limites cognitivos** do agente (Ex: Tom de voz, foco em valor, proibições de conhecimento técnico).
- **Vigência:** Permanente enquanto o papel estiver ativo. É o "Como o agente pensa".

### 2. Camada de Processo (Process Rules)
- **Onde moram:** `beehive/cognition/intuition/[processo]/GUARDS.md`
- **O que definem:** Os **limites físicos, operacionais e rituais** de uma etapa específica da linha de produção (Ex: Proibição de criar arquivos, diagramas obrigatórios, local de saída de dados).
- **Vigência:** Temporária, restrita à execução daquela fase específica. É o "O que o agente pode fazer aqui".

**Regra de Ouro:** O Processo invoca o Papel. A execução final deve ser a intersecção de ambas as camadas, garantindo que o agente certo opere dentro do trilho certo.

---
## 6. Manutenção de Diretrizes
- Toda nova diretriz recebe um ID sequencial (`DIR-NNN`).
- Nunca deletar uma entrada — apenas marcar como revogada no histórico.
- O Claude (Arquiteto + Auditor Técnico) é o responsável por manter este documento sincronizado com as decisões do Márcio.

---
## 7. DIR-084 — Protocolo de Rastreio por ID

Todo handoff, work order e commit deve referenciar o ID pai do backlog.
- Itens do Hive: `HIVE-NNN` (ex: `HIVE-004`)
- Itens do TenantOS: `TOS-NNN` (ex: `TOS-011`)
- Handoffs incluem campo obrigatório: `backlog_ref: HIVE-NNN` ou `backlog_ref: TOS-NNN`
- Commits incluem no corpo: `Ref: HIVE-NNN` ou `Ref: TOS-NNN`
- Item concluído no backlog registra: data + commit hash

---
## 8. DIR-085 — Saída Operacional Explícita

Ao encerrar interações operacionais, o agente deve explicitar:
1. **Estado atual** — o que acabou de acontecer ou o estado do fluxo
2. **Próximo passo** — o que vem agora
3. **Ação esperada** — o que o Márcio ou próximo agente deve fazer

Em casos de **falha ou bloqueio**, adicionar obrigatoriamente:
4. **Motivo** — causa específica e identificável (nunca genérico)

**Onde é obrigatório:** boot/menu, plano de voo, checkpoint, handoff, pedido de aprovação, status, encerramento operacional, falha/bloqueio.
**Onde não se aplica:** respostas conceituais, explicações técnicas pontuais, confirmações curtas sem fluxo ativo.
**Fonte:** DEBATE-023 | Padrão completo: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`

---
*Assinado: Gemini 1.5 Pro (Facilitador Estratégico) + Claude Sonnet 4.6 (Arquiteto)*

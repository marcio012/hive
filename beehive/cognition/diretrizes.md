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
5.  **Sigilo de Ideação:** O diretório `beehive/cognition/ideario_hive/` é de acesso restrito. O protocolo de operação está definido em `beehive/cognition/ideario_hive/PROTOCOLO_SIGILO.md` (acesso exclusivo Diretor/Integrador). Claude e Copilot não possuem acesso a esta área.

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
| DIR-086 | Status Report por Entrega | Ao fechar qualquer item de backlog (`HIVE-NNN` ou `TOS-NNN`), o Copilot gera um `SR-NNN` usando `SR_ENTREGA_TEMPLATE.md`. O SR é o gate narrativo para afirmação do Owner — distinto do ACEITE (recibo técnico). |
| DIR-087 | Limpeza de Processos ao Encerrar | Claude e Copilot devem verificar e encerrar processos, servidores e portas abertas antes de reportar conclusão de qualquer tarefa com execução. |
| DIR-090 | Taxonomia de Falhas Sistêmicas | Define as categorias de falha de fluxo do Hive, o protocolo de safe-stop via `error-state.json` e as responsabilidades de detecção, contenção e recuperação por agente. |
| DIR-091 | Rigor de Cano — Sequência Sem Pulo | Toda demanda que resulte em trabalho deve originar de uma Ideação formalizada. Nenhum cano inicia sem o anterior materializado. Claude bloqueia pulo de cano como falha sistêmica `cano_pulado`. |
| DIR-092 | Márcio como Agente Ativo | Márcio pode adquirir lock e assinar commits por qualquer papel do squad. `marcio` é owner válido no sistema de lock com soberania de override sobre qualquer agente. |

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

## 9. DIR-086 — Status Report por Entrega

Ao fechar qualquer item de backlog (`HIVE-NNN` ou `TOS-NNN`), o Copilot deve gerar um **Status Report de Entrega (SR-NNN)** usando o template `beehive/construcao/templates/SR_ENTREGA_TEMPLATE.md`.

**Distinção de artefatos:**
- `ACEITE-NNN` — recibo técnico gerado pelo Copilot, auditado por Claude. Público interno do squad.
- `SR-NNN` — narrativa executiva gerada pelo Copilot para o Márcio. Gate final antes de marcar o item como `[x]` no backlog.

**Onde armazenar:**
- Itens `HIVE-NNN` → `beehive/registry/reports/SR-HIVE-NNN-[slug].md`
- Itens `TOS-NNN` → `tenantOS/docs/history/status-reports/SR-TOS-NNN-[slug].md`

**Campos obrigatórios no SR:** `id`, `backlog_ref`, `aceite_ref`, `commit_ref`, resumo executivo, valor gerado e afirmação do Owner.

**Quando não é necessário:** itens encerrados retroativamente sem entrega nova (fechamentos arquivísticos).

**Fonte:** HIVE-003 | Template: `beehive/construcao/templates/SR_ENTREGA_TEMPLATE.md`

## 10. DIR-087 — Limpeza de Processos e Portas ao Encerrar

Ao finalizar qualquer tarefa de desenvolvimento ou validação que tenha iniciado servidores, processos em background ou listeners de porta, **Claude e Copilot devem verificar e encerrar esses processos antes de reportar conclusão**.

**Checklist obrigatório ao encerrar tarefa com execução:**
- [ ] Nenhum processo de dev server rodando em background (`pkill`, `kill`, `Ctrl+C` conforme o caso)
- [ ] Nenhuma porta ocupada deixada aberta (verificar com `lsof -i :<porta>` ou `ss -tlnp`)
- [ ] Containers ou serviços temporários iniciados para teste encerrados

**Quando se aplica:** sempre que o agente rodou `npm run dev`, `npm start`, `node`, `python`, servidores de teste, migrações com servidor em background, ou qualquer comando que bifurca processo.

**Quando não se aplica:** tarefas puramente documentais, edições de arquivo, leituras.

**Responsabilidade:** Claude e Copilot. PO e Coordenador não executam — não se aplica a eles.

---

## 11. DIR-090 — Taxonomia de Falhas Sistêmicas no Fluxo Hive

**Origem:** DEBATE-027 | **Data:** 2026-05-29

### Categorias de falha

| Categoria | Definição | Severidade padrão |
|---|---|---|
| `executor_errado` | Agente executa ação que pertence a outro (ex: Claude commita o que é do Copilot) | high |
| `auditoria_pulada` | Ação crítica executada sem o parecer/liberação do auditor designado | high |
| `roteamento_incorreto` | Inbox ou WO entregue ao agente errado; WO sem campo `executor:` | medium |
| `estado_inconsistente` | Inbox com `pendente` após commit; WO em `em-execução` após encerramento | medium |
| `cascata_silenciosa` | Falha em etapa A não sinalizada; etapa B executa sobre estado inválido | high |
| `lock_orfao` | Agente trava lock e encerra sessão sem liberar | medium |
| `commit_sem_liberacao` | Commit realizado sem a entrada de inbox correspondente ter sido marcada `consumida` | high |

### Protocolo de safe-stop

Quando qualquer agente detecta uma falha sistêmica:

1. **Escrever** `.hive-agent/error-state.json` atomicamente (via `.tmp` + `rename`) com os campos:
   - `status`: `alert` | `paused`
   - `incident_id`: `INC-YYYY-MM-DD-NNN`
   - `detected_at`: ISO timestamp
   - `detected_by`: agente
   - `category`: uma das categorias acima
   - `severity`: `low` | `medium` | `high` | `critical`
   - `affected_flows`: lista de WOs/inboxes/commits afetados
   - `auto_mode_allowed`: `false` se severity >= high
   - `resume_requirements`: condições para retomar

2. **Criar** arquivo de incidente em `beehive/registry/incidents/INC-YYYY-MM-DD-NNN.md` com schema definido no DEBATE-027 Seção 5.4.

3. **Não continuar** automação crítica (commits, handoffs, despachos de WO) enquanto `status != ok`.

4. Se `severity: high` ou `critical`, **abrir entrada** no `inbox-claude.md` para revisão arquitetural.

### Responsabilidades

| Agente | Detecção | Escrita error-state | Recuperação |
|---|---|---|---|
| Qualquer agente | Pode detectar e sinalizar | ✅ Pode escrever | Não — precisa de Claude |
| Claude (Arquiteto) | Auditor principal | ✅ Pode escrever | ✅ Autoriza retomada |
| Copilot (Engenheiro) | Pode detectar em execução | ✅ Pode escrever | ❌ Aguarda Claude |
| Orchestrator | Detecção contínua / reconciliação | ✅ Pode escrever | Parcial (pausa automação) |

### Guards obrigatórios (implementados na WO-028-A)

Todo guard de ação crítica deve validar:
- `actor` autorizado para a `action`
- Dependência/auditoria satisfeita antes da ação
- Estado da inbox/WO compatível com a transição
- Lock válido ou ausência explícita de lock obrigatório
- `workspace` e `repo` corretos declarados

**Guard sem consequência bloqueante não é guard — é documentação.** Se a ação é crítica, o guard deve bloquear e exigir override documentado.

---

## 12. DIR-091 — Rigor de Cano: Sequência Sem Pulo

**Origem:** decisão do PO (Márcio) em 2026-05-29

Toda demanda que resulte em trabalho (implementação, debate, WO, handoff, commit) deve obrigatoriamente originar de uma **Ideação formalizada** e percorrer os canos em sequência. Nenhum cano pode iniciar sem o anterior ter sido completado e sua saída materializada.

### Guards obrigatórios — Claude (Arquiteto) DEVE impor:

| Antes de criar... | Verificar que existe... |
|---|---|
| WO / handoff ao Copilot | Blueprint aprovado (`BLUEPRINT-NNN.md` ou seção de contrato técnico equivalente) |
| Blueprint | Debate (`DEBATE-NNN.md` com veredito) se estrutural — ou Ideação se não estrutural |
| Debate | Ideação registrada (entrada de backlog ou `RESUMO_INTENCAO.md`) |
| Commit | Auditoria documentada (checkpoint consumido no inbox-claude) |
| Item fechado no backlog | SR gerado (DIR-086) |

### Consequência de pulo de cano:
1. Claude **recusa** o handoff e informa o cano faltante ao Márcio
2. O pulo é registrado como falha `cano_pulado` (DIR-090)
3. Não há exceção por pressão de tempo ou urgência — se urgente, o cano é simplificado, nunca omitido

### Onde se aplica:
- Toda interação do Márcio que resulte em demanda de trabalho
- Não se aplica a consultas puramente informativas sem produto esperado

---

## 13. DIR-092 — Márcio como Agente Ativo: Lock e Assinatura

**Origem:** decisão do PO (Márcio) em 2026-05-29

Márcio é soberano da colmeia e pode atuar diretamente como executor quando necessário.

### Direitos do Márcio no sistema de lock:
- Adquirir lock com `marcio` como owner (igual a qualquer agente)
- Override/break de lock de qualquer agente com flag `--force` (sem bloqueio)
- Delegar lock para um agente com `--delegate <agent>` (Márcio libera, agente executa)
- `marcio` nunca é bloqueado por lock de outro agente

### Assinaturas de commit válidas quando Márcio executa:
- `Dev: Márcio - PO` — trabalho próprio
- `Dev: Márcio - PO (substituindo Claude - Arquiteto)` — em substituição
- `Dev: Márcio - PO (substituindo Copilot - Engenheiro)` — em substituição

### Implementação técnica (WO-033):
- `hive-lock.sh`: aceitar `marcio` como owner válido; `--force` quebra lock sem checagem; `--delegate <agent>` grava owner=agent + delegated_by=marcio
- Assinaturas adicionadas ao `CLAUDE.md` e `feedback-commits.md`

---

*Assinado: Gemini 1.5 Pro (Facilitador Estratégico) + Claude Sonnet 4.6 (Arquiteto)*

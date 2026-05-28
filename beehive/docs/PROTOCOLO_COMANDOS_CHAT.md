# Protocolo de Comandos de Chat do Squad

**Status:** visão em construção — aberto para ressalvas do Márcio
**Criado em:** 2026-05-24
**Owner:** Márcio (produto) + Claude (arquitetura)

---

## Contexto

O squad opera via chat (Claude Code, Copilot CLI, Gemini CLI). Hoje, parte dos comandos são npm scripts (`npm run squad:inbox`) e parte são palavras-chave no chat (`opiniao:`, `inbox`). O problema: o vocabulário não é consistente entre os 3 agentes, e comandos npm não são amigáveis para quem não é dev.

**Visão:** um vocabulário padronizado de comandos de chat, reconhecido por todos os agentes, que qualquer pessoa digita diretamente no campo de input — sem precisar conhecer npm, scripts ou estrutura de arquivos.

---

## Princípios

1. **Palavras, não comandos técnicos** — `inbox` não `npm run squad:inbox`
2. **Consistente entre agentes** — o mesmo comando funciona igual no Claude, Copilot e Gemini
3. **Acessível para não-devs** — quem não conhece o projeto entende o que digitar
4. **Extensível** — novos comandos seguem o mesmo padrão

---

## Vocabulário atual (estado dos 3 agentes)

| Comando | O que faz | Claude | Copilot | Gemini |
|---|---|---|---|---|
| `opiniao: DEBATE-NNN` | Coleta parecer estruturado do agente | ✅ | ✅ | ✅ |
| `inbox` | Lê mensagens pendentes do agente | ✅ | ❌ | ❌ |
| `insight: texto` | Captura ideia e gera comando pronto | ❌ | ❌ | ✅ |
| `captura: texto` | Alias de `insight:` | ❌ | ❌ | ✅ |
| `brainstorm: texto` | Organiza visão solta em digest estruturado | ❌ | ❌ | ✅ |
| `visao: texto` | Alias de `brainstorm:` | ❌ | ❌ | ✅ |
| `debug: tema` | Investiga falha em modo read-only | ❌ | ❌ | ✅ |
| `investiga: tema` | Alias de `debug:` | ❌ | ❌ | ✅ |
| `mapeia: tema` | Escaneia código legado | ❌ | ❌ | ✅ |
| `legado: tema` | Alias de `mapeia:` | ❌ | ❌ | ✅ |
| `doc: tema` | Gera documento derivado de artefatos | ❌ | ❌ | ✅ |

**Lacunas visíveis:**
- `inbox` só o Claude entende — Copilot e Gemini não tratam como atalho
- Comandos de status, lock, debate não existem como palavras de chat em nenhum agente

---

## Vocabulário alvo (padronizado — todos os agentes)

### Comandos universais (todos os 3 agentes devem entender)

| Comando | O que faz | Notas |
|---|---|---|
| `inbox` | Lê mensagens pendentes do agente | Já existe no Claude |
| `status` | Mostra estado atual do squad (issue ativa, lock, próximo passo) | Não existe formalmente |
| `opiniao: DEBATE-NNN` | Coleta parecer estruturado | Já existe nos 3 |
| `checkpoint` | Lê último ponto de retomada | Não existe como chat command |

### Comandos por agente (específicos do papel)

**Claude (arquiteto):**

| Comando | O que faz |
|---|---|
| `debate: tema` | Abre debate formal com posição do Claude + questões para outros agentes |
| `consolida: DEBATE-NNN` | Consolida debate após todos os pareceres |
| `handoff: copilot` | Gera handoff de implementação para o Copilot |
| `risco: tema` | Levanta riscos arquiteturais de uma decisão |

**Copilot (executor):**

| Comando | O que faz |
|---|---|
| `inbox` | Lê `inbox-copilot.md` e lista tarefas pendentes |
| `status` | Mostra issue ativa, lock e próximo passo |
| `concluido: TASK-NNN` | Marca tarefa como executada e notifica Claude |

**Gemini (auxiliar):**

| Comando | O que faz |
|---|---|
| `inbox` | Lê `inbox-gemini.md` e lista tarefas pendentes |
| `insight: texto` | Captura ideia e gera comando pronto (já existe) |
| `brainstorm: texto` | Organiza visão solta (já existe) |
| `debug: tema` | Investiga falha read-only (já existe) |
| `mapeia: tema` | Escaneia código legado (já existe) |
| `doc: tema` | Gera documento derivado (já existe) |

---

## Regras de design dos comandos

1. **Formato:** `palavra:` seguido de argumento opcional — `opiniao: DEBATE-005` ou apenas `inbox`
2. **Sem flags, sem parâmetros técnicos** — nada de `--option` ou `--flag`
3. **Ação imediata** — o agente executa ao receber o comando, sem pedir confirmação (exceto ações destrutivas)
4. **Saída padronizada** — cada comando tem um formato fixo de resposta (como `opiniao:` já tem)
5. **Caso de agente errado** — se o comando não pertence ao agente, ele responde: `"Este comando pertence ao [agente]. Encaminhe para o terminal correto."`

> **DIR-085:** quando comandos operacionais como `inbox`, `status` e `checkpoint` gerarem resposta, o encerramento deve incluir **Estado atual**, **Próximo passo** e **Ação esperada**. Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`

---

## Roadmap de implementação

### Fase 1 — Completar o vocabulário universal (agora)
- [ ] Adicionar `inbox` ao Copilot CLI (`.copilot/COPILOT.md`)
- [ ] Adicionar `inbox` ao Gemini (`.gemini/GEMINI.md`)
- [ ] Adicionar `status` aos 3 agentes
- [ ] Adicionar `checkpoint` aos 3 agentes

### Fase 2 — Comandos por papel (próxima rodada)
- [ ] `debate:`, `consolida:`, `handoff:`, `risco:` no Claude
- [ ] `concluido:` no Copilot

### Fase 3 — Interface não-dev (quando o White Label validar receita)
- Comandos funcionam também via interface web, Slack ou WhatsApp
- Não-devs interagem com o squad sem abrir terminal
- Conecta com SPEC_ORQUESTRACAO_AGENTES Fase 3

---

## Referências

- `SPEC_ORQUESTRACAO_AGENTES.md` — visão da ferramenta de orquestração
- `.claude/CLAUDE.md` — `opiniao:` e `inbox` implementados
- `.copilot/COPILOT.md` — `opiniao:` implementado
- `.gemini/GEMINI.md` — modos implementados (`insight:`, `brainstorm:`, `debug:`, `mapeia:`, `doc:`, `opiniao:`)

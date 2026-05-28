# Spec — Ferramenta de Orquestração de Agentes

**Status:** visão futura — documentar padrões que já existem no squad para embasar a implementação
**Criado em:** 2026-05-23
**Owner:** Márcio (produto) + Claude (arquitetura)

---

## Contexto

O squad atual (Claude + Copilot + Gemini) opera com orquestração manual: Márcio repassa contexto entre agentes, coleta pareceres individualmente e consolida decisões. Essa camada manual funciona, mas não escala.

Este documento registra os padrões já funcionando no squad que devem ser a base da ferramenta de orquestração futura.

---

## Padrões já estabelecidos

### 1. Protocolo de Opinião (`opiniao:`)

**O que é:** comando padronizado que qualquer agente entende como "leia o contexto indicado e me dê sua posição".

**Formato:**
```
opiniao: <DEBATE-NNN | caminho do arquivo | tema>
```

**Comportamento esperado de cada agente:**
1. Lê o contexto indicado
2. Identifica questões direcionadas a ele
3. Responde com posição clara (✅ / ❌ / ⚠️) + justificativa
4. Escreve no arquivo do debate ou devolve no chat

**Por que isso importa para a ferramenta futura:**
É o primeiro protocolo de broadcast do squad — um input, múltiplos agentes respondem de forma independente e estruturada. A ferramenta pode automatizar: enviar `opiniao:` para todos, coletar respostas, detectar divergências, montar consolidação.

---

### 2. Canal Inbox/Output por Agente

**O que é:** arquivos dedicados para comunicação assíncrona entre agentes sem Márcio como intermediário obrigatório.

**Arquivos:**
- `ai/construcao/inbox-gemini.md` — entrada para Gemini
- `ai/construcao/output-gemini.md` — saída do Gemini
- `ai/construcao/inbox-claude.md` — proposto no DEBATE-005
- `ai/construcao/inbox-copilot.md` — proposto no DEBATE-005

**Formato de tarefa:**
```
[AGENT-NNN] título
papel: <papel ativo>
de: <remetente>
para: <destinatário>
contexto: ...
esperado: ...
status: pendente | executada | consumida
```

> **DIR-085:** quando a mensagem representar um handoff, status ou retomada operacional, a resposta associada deve explicitar **Estado atual**, **Próximo passo** e **Ação esperada**. Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`

**Por que isso importa:**
É o modelo de mensageria assíncrona do squad. A ferramenta futura substitui os arquivos por um bus de mensagens real, mantendo o mesmo contrato.

---

### 3. Papéis por Agente

**O que é:** cada agente opera sob papéis declarados. Tarefas têm papel obrigatório — agente só executa se o papel estiver ativo.

**Papéis atuais:**

| Agente | Papel | Status | Escopo |
|---|---|---|---|
| Claude | `arquiteto` | sempre ativo | debate, arquitetura, revisão, consolidação |
| Copilot | `executor` | sempre ativo | implementação com contrato fechado |
| Gemini | `auxiliar` | sempre ativo | debug, mapeia, doc, brainstorm, captura |
| Gemini | `agente-vendas` | ativação explícita | qualificação WhatsApp via API |

**Por que isso importa:**
A ferramenta futura usa papéis para roteamento automático. `opiniao:` vai para todos. Tarefa de implementação vai para `executor`. Tarefa de mapeamento vai para `auxiliar`. Debate vai para `arquiteto`.

---

### 4. Ciclo de Debate Estruturado

**Fluxo atual:**
```
Márcio identifica problema
        ↓
Claude abre debate com posição + questões por agente
        ↓
Copilot responde questões do Copilot
Gemini responde questões do Gemini
        ↓
Claude consolida após todos responderem
        ↓
Márcio decide
        ↓
Claude fecha debate + gera handoff de implementação
```

> **DIR-085:** a consolidação do debate, o handoff emitido pelo Claude e os status intermediários entre agentes devem usar o encerramento com **Estado atual**, **Próximo passo** e **Ação esperada**. Ref: `beehive/construcao/PADRAO_SAIDA_OPERACIONAL_HIVE.md`

**Por que isso importa:**
É o ciclo de tomada de decisão do squad. A ferramenta futura automatiza o disparo (envia `opiniao:` para cada agente), monitora quem respondeu, notifica Márcio quando todos têm parecer e apresenta a consolidação.

---

### 5. Estado Compartilhado vs. Canal de Mensagens

**Lição aprendida (DEBATE-005):**
`session-state.env` é estado operacional, não canal de mensagens. Quando usado como canal, sobrescrita é garantida.

**Separação correta:**
- `session-state.env` → lock, issue ativa, próximo passo para Márcio
- `inbox-*.md` → mensagens entre agentes (append-only, nunca sobrescrever)

**Por que isso importa:**
A ferramenta futura precisa de dois stores separados: estado operacional (quem tem o lock, o que está rodando) e mensageria (o que um agente comunicou para o outro). Misturar os dois garante perda de dados.

---

## Roadmap da ferramenta futura

### Fase 1 — Formalizar o que já existe (agora)
- [x] Protocolo `opiniao:` implementado nos 3 agentes
- [x] Canal inbox/output para Gemini
- [ ] Canal inbox para Claude e Copilot (DEBATE-005)
- [ ] `session-state.env` purificado: só estado operacional

### Fase 2 — CLI de orquestração (quando o White Label validar receita)
- Comando `npm run squad:broadcast -- "opiniao: DEBATE-NNN"` — envia para todos os agentes e monitora respostas
- Comando `npm run squad:consolidar -- DEBATE-NNN` — chama Claude para consolidar após todos responderem
- Dashboard de debates abertos + status de pareceres por agente

### Fase 3 — Orquestrador com API (produto portável)
- Bus de mensagens substituindo os arquivos inbox/output
- Roteamento automático por papel
- Integração com GitHub Issues para fechar o ciclo debate → issue → implementação
- SDK portável para outros projetos (ligação com Antigravity SDK como candidato)

---

## Referências

- `AGENTS.md` — papéis e regras do squad
- `ai/construcao/OPERACAO_COMPARTILHADA_SQUAD.md` — operação compartilhada
- `ai/construcao/debates-abertos.md` — DEBATE-005 (canal de comunicação)
- `.claude/CLAUDE.md`, `.copilot/COPILOT.md`, `.gemini/GEMINI.md` — implementação do `opiniao:` por agente
- `docs/planning/KIT_PORTABILIDADE_SQUAD.md` — portabilidade do framework

---
titulo: Prompt de Design — Tela 4: Brainstorm Board v2
produto: hive-ui
tela: /brainstorm
versao: v2
data: 2026-05-29
responsavel: Claude (Arquiteto)
destino: Claude.ai Design
supersedes: design-tela4-brainstorm-board.md
---

# Prompt para Claude.ai Design — Tela 4: Brainstorm Board v2

> Colar no Claude.ai junto com `hive.css` e `Hive OS.html` como contexto.

---

Você criou anteriormente o design do Hive OS — painel operacional dark com design system próprio (Space Grotesk + IBM Plex Mono, CSS variables --gold, --green, --orange, --surface-1, --surface-2, --border, componentes .panel, .page-head, .intent, .prio, .mini-av, .badge).

Preciso de uma versão revisada da **Tela 4: Brainstorm Board**, agora com uma camada de estado operacional do squad no topo antes do kanban.

---

## Por que mudar

A versão anterior mostrava apenas os arquivos de brainstorm. Mas o usuário (Márcio) precisa saber **o que está pendente no squad** antes de navegar pelas ideias — sem precisar consultar outro agente. A tela passa a responder duas perguntas de uma vez: "o que os agentes estão segurando?" e "como está a ideação?".

---

## BLOCO 1 — Squad Radar (novo, topo da tela)

Faixa horizontal abaixo do .page-head. Título: **"Estado do squad agora"**.

Três cards lado a lado — um por agente (Claude · Copilot · Gemini):

```
┌─────────────────────────────────┐
│  [C] Claude — Arquiteto          │
│  ──────────────────────────────  │
│  📥 3 pendentes no inbox         │
│  🔒 Livre                        │
│  Último: DEBATE-026 consolidado  │
└─────────────────────────────────┘
```

- Avatar do agente no header (av-claude / av-copilot / av-gemini), cor correspondente
- Badge de inbox: pill com count — verde se 0, laranja #FF6B35 se > 0
- Status de lock: "🔒 Em execução: WO-026-A" (laranja) ou "Livre" (verde)
- Última atividade: uma linha curta, fonte mono, cor --t3
- Se inbox > 0: card com border-left 3px #FF6B35 (requer atenção)
- Se inbox = 0 e livre: card com border-left 3px #00FF9F (tudo ok)

---

## BLOCO 2 — Filtros

Barra horizontal logo abaixo do Squad Radar:
- Filtro de agente responsável: pills selecionáveis (Todos · Claude · Copilot · Gemini · Márcio)
- Input de busca por thread: placeholder "filtrar por thread..."
- Botão "+ Novo brainstorm" alinhado à direita (.disp-btn.primary)

---

## BLOCO 3 — Kanban de Brainstorms

5 colunas side-by-side com scroll vertical independente:

1. **Captura** — ideia bruta, sem estrutura
2. **Refinando** — em aprofundamento pelo agente responsável
3. **Pronto p/ Debate** — maduro o suficiente para abrir DEBATE-NNN
4. **Em Debate** — debate formal aberto (referencia DEBATE-NNN)
5. **Arquivado** — executado ou descartado

Cada coluna: header com nome + contagem de cards.

**Card de brainstorm:**
- Título (peso 500, fonte UI)
- Badge do agente responsável (mini-av: av-claude / av-copilot / av-gemini / av-human)
- Thread em mono pequeno, cor --t3
- Data no canto inferior direito
- Se coluna "Em Debate": badge pill --gold com ID do debate (ex: DEBATE-026)
- Hover: borda --gold opacity baixa + cursor pointer

---

## Dados de exemplo

**Squad Radar:**
- Claude: 1 pendente · Livre · "Último: WO-026-A auditoria pendente"
- Copilot: 3 pendentes · Em execução: WO-026-A · "Último: checkpoint aguardado"
- Gemini: 0 pendentes · Livre · "Último: parecer DEBATE-026 emitido"

**Kanban:**
- "Orquestrador Híbrido" | thread: orquestrador-hibrido | Claude | Em Debate → DEBATE-026 | 2026-05-29
- "Política de Higiene de Inbox" | thread: higiene-inbox | Claude | Arquivado | 2026-05-28
- "Hive Web UI Strategy" | thread: hive-web-ui | Gemini | Arquivado | 2026-05-28
- "Discovery TOS-015 Agenda" | thread: tos-015-agenda | Gemini | Pronto p/ Debate | 2026-05-27
- "Ideia: Rate Limit por Agente" | thread: orquestrador-hibrido | Márcio | Captura | 2026-05-29
- "Módulo de Relatórios PDF" | thread: relatorios | Gemini | Refinando | 2026-05-29

---

Entregue HTML + classes do design system existente. O Squad Radar deve ser visualmente distinto do kanban — use uma faixa com fundo ligeiramente diferente (--surface-2) para separar as duas zonas.

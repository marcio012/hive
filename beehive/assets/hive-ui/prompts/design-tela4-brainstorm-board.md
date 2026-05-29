---
titulo: Prompt de Design — Tela 4: Brainstorm Board
produto: hive-ui
tela: /brainstorm
versao: v1
data: 2026-05-29
responsavel: Claude (Arquiteto)
---

# Prompt para Claude.ai Design — Tela 4: Brainstorm Board

> Colar no Claude.ai junto com `hive.css` e `Hive OS.html` como contexto.

---

Você criou anteriormente o design do Hive OS — um painel operacional com design system próprio (Space Grotesk + IBM Plex Mono, dark theme, CSS variables como --gold, --green, --orange, --surface-1, --surface-2, --border, etc.) e componentes como .panel, .page-head, .cc-grid, .intent, .prio, .mini-av, .badge.

Preciso de uma nova tela chamada **Brainstorm Board** para o Hive OS, seguindo exatamente o mesmo design system.

---

## Propósito da tela

Organizar os arquivos de brainstorm do squad em um kanban visual. Cada card representa um brainstorm (arquivo .md com campos: título, thread, responsável, status). O objetivo é dar visibilidade rápida do estado das ideias — da captura até virar um debate formal.

---

## Colunas do kanban (5)

1. **Captura** — ideia bruta recém-criada, ainda sem estrutura
2. **Refinando** — em aprofundamento pelo agente responsável
3. **Pronto p/ Debate** — maduro o suficiente para abrir um DEBATE-NNN
4. **Em Debate** — já tem debate formal aberto (referencia DEBATE-NNN)
5. **Arquivado** — executado ou descartado

---

## Card de brainstorm

Cada card deve mostrar:
- Título do brainstorm (fonte UI, peso 500)
- Badge do agente responsável (mini-av estilo já existente: av-claude / av-copilot / av-gemini / av-human)
- Thread (texto pequeno, fonte mono, cor --t3)
- Data (pequena, canto inferior direito)
- Se coluna "Em Debate": badge pequeno com o ID do debate (ex: DEBATE-023) em --gold

---

## Layout

- Header igual às outras telas: .page-head com título + subtítulo "ideação do squad"
- Barra de filtro horizontal abaixo do header: filtrar por agente responsável (todos / Claude / Copilot / Gemini) e por thread (input de busca)
- Kanban: 5 colunas side-by-side com scroll vertical independente por coluna
- Cada coluna tem: header com nome + contagem de cards
- Botão "+ Novo brainstorm" no canto superior direito do header (estilo .disp-btn.primary)
- Cards com hover sutil (borda --gold com opacity baixa) e cursor pointer

---

## Dados de exemplo (use para preencher os cards)

- "Hive Web UI Strategy" | thread: hive-web-ui-discovery | Gemini | Refinando | 2026-05-28
- "Dashboard Showroom Bella Corte" | thread: showroom-bella-corte | Gemini | Arquivado | 2026-05-26
- "Orquestrador Híbrido" | thread: orquestrador-hibrido | Claude | Em Debate → DEBATE-026 | 2026-05-29
- "Política de Higiene de Inbox" | thread: higiene-inbox | Claude | Em Debate → DEBATE-025 | 2026-05-28
- "Discovery TOS-015 Agenda" | thread: tos-015-agenda | Gemini | Pronto p/ Debate | 2026-05-27
- "Macro Mapping Hive UI" | thread: hive-ui-macro | Gemini | Arquivado | 2026-05-28
- "Ideia: Rate Limit por Agente" | thread: orquestrador-hibrido | Márcio | Captura | 2026-05-29

---

Entregue HTML + CSS inline (ou usando as classes do design system existente). Mantenha consistência total com o Hive OS já criado.

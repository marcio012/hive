---
titulo: Prompt de Design — Tela 3: Centro de Controle v2
produto: hive-ui
tela: /controle
versao: v2
data: 2026-05-29
responsavel: Claude (Arquiteto)
destino: Claude.ai Design
supersedes: design-tela3-centro-controle.md
---

# Prompt para Claude.ai Design — Tela 3: Centro de Controle v2

> Colar no Claude.ai junto com `hive.css` e `Hive OS.html` como contexto.

---

Você criou anteriormente o design do Hive OS. Preciso de uma versão evoluída da tela "Centro de Controle" — mantendo o design system (dark mode, --gold, --green, --orange, Space Grotesk + IBM Plex Mono) mas com foco diferente: a v1 era sobre *controles e ações*; a v2 é sobre **visibilidade operacional primeiro, ação em segundo**.

O problema resolvido: hoje Márcio precisa consultar o Claude para saber o que está pendente. A v2 coloca essa resposta visualmente na abertura da tela.

---

## HIERARQUIA DA TELA (de cima para baixo)

### Zona 1 — Header da tela

```
Centro de Controle
"Estado ao vivo do squad — decida sem consultar"    [live-dot]
```

### Zona 2 — Estado por Agente (3 colunas, ~30% da altura)

Três painéis horizontais, um por agente. Cada painel tem duas zonas internas:

**Cabeçalho do painel:**
- Avatar do agente (av-claude = ouro, av-copilot = azul, av-gemini = roxo)
- Nome + papel (Claude · Arquiteto / Copilot · Engenheiro / Gemini · PO)
- Indicador de lock: pill "Em execução" laranja ou "Livre" verde

**Corpo do painel — lista de inbox pendentes:**
- Cada item: ID monospace + assunto (truncado, 1 linha) + badge de tipo
  - `handoff-executavel` → pill laranja
  - `pedido-de-parecer` → pill cinza
  - `pendente-bloqueado` → pill vermelha com ícone cadeado
- Se vazio: "Nenhuma pendência" em verde

**Rodapé do painel:**
- Botão "Despachar" pequeno (ghost, abre modal inline)

Dados de exemplo:
```
Claude — Arquiteto                          [Livre]
  (inbox vazio — verde)

Copilot — Engenheiro                        [🔒 WO-026-A]
  CLAUDE-2026-05-29-068  Go — WO-026-A           [handoff-executavel]
  CLAUDE-2026-05-29-066  Orchestrator Core V1    [handoff-executavel]
  CLAUDE-2026-05-29-067  WO-026-B (bloqueada)    [🔒 bloqueado]

Gemini — PO                                 [Livre]
  (inbox vazio — verde)
```

---

### Zona 3 — Ações Rápidas (linha horizontal de botões)

Barra de 4 ações centrais, sempre visível:

```
  [🔓 Liberar lock Copilot]   [→ Despachar para Claude]   [→ Despachar para Gemini]   [⚙ Configurações]
```

- Liberar lock: só ativo se há lock — cinza/desabilitado se livre
- Despachar: abre modal inline (mesmo da v1, com textarea + agente)
- Configurações: expande painel inline com os switches (autoMode, autoMerge, notifyMarcio)

---

### Zona 4 — Grid inferior (2 colunas)

**Coluna esquerda — Debates Abertos:**
- Título: "Debates ativos"
- Cards de debate com: ID, título, fase atual (barra de progresso 8 fases), quem está bloqueando, botão "Avançar" se for a vez do Márcio
- Exemplo:
  - DEBATE-026 · Orquestrador Híbrido · Fase 7 (Work Orders despachadas) · ✅ Concluído
  - DEBATE-025 · Higiene de Inbox · Fase 8 (Execução) · ✅ Concluído

**Coluna direita — Stream de Eventos:**
- Título: "Eventos ao vivo"
- Lista de logs com ts + level + msg (igual à v1)
- Linha de cursor piscando no final

---

## Estados visuais importantes

- **Copilot em execução**: painel com border-left 4px --gold + fundo levemente iluminado
- **Item bloqueado**: ícone cadeado vermelho + texto esmaecido
- **Inbox com pendências**: badge count pill laranja no header do painel
- **Tudo limpo**: todos os painéis com border-left verde + sem badges de alerta

---

Gere em HTML de alta fidelidade, 1440px, dark mode. Priorize a legibilidade da Zona 2 (estado por agente) — é onde o olhar do Márcio cai primeiro.

---
titulo: Prompt de Design — Tela 2: Funil de Intenção
produto: hive-ui
tela: /funil
versao: v1
criado_em: 2026-05-28
criado_por: Claude (Arquiteto)
destino: Claude.ai Design
---

```
Crie o design de uma tela chamada "Funil de Intenção" — parte do painel
operacional "Hive Web UI", um cockpit de controle para um squad de agentes
de IA (Claude, Copilot, Gemini) orquestrado por um humano chamado Márcio.

═══════════════════════════════════════
SISTEMA VISUAL
═══════════════════════════════════════

Tema: dark mode absoluto, estética de terminal premium com toques de UI moderna.

Paleta:
  Background:    #050505
  Surface:       #111111
  Surface alt:   #1A1A1A
  Border sutil:  rgba(255,255,255,0.08)
  Primária:      #FFD700  (amarelo ouro)
  Sucesso/Ativo: #00FF9F  (verde esmeralda)
  Azul:          #44B5FF
  Texto 1:       #F5F5F5
  Texto 2:       #8A8A8A

Tipografia: Inter para títulos/labels, JetBrains Mono para dados.
Bordas: 12–16px border-radius. Bordas 1px.

Shell — header fixo no topo:
  - Logo "HIVE OS" em amarelo à esquerda
  - Indicador WebSocket à direita: bolinha verde + "conectado"
  - Tabs: "Mapa da Fábrica" | "Funil de Intenção" | "Centro de Controle"
  - Tab ativa com fundo amarelo e texto preto

═══════════════════════════════════════
TELA — FUNIL DE INTENÇÃO
═══════════════════════════════════════

Subtítulo: "Pipeline de brainstorms e ideações"

Layout kanban com 3 colunas de altura total, separadas por divisores sutis.

COLUNA 1 — "Em Ideação"
  Header da coluna:
    - Dot amarelo #FFD700 pulsando
    - Título "Em Ideação" semi-bold
    - Badge contador: "3 itens" em pill cinza escuro

  Cards (border esquerda 3px #FFD700):
    Exemplo card 1:
      - Título: "Discovery — Hive OS: Web Interface" bold 15px
      - Tag pill: "hive-web-ui-discovery" fundo #FFD70015 texto amarelo
      - Data: "2026-05-28" monospace 12px cinza
      - Responsável: avatar "G" (Gemini) + "Gemini (PO)"

    Exemplo card 2:
      - Título: "Estratégia de Branding Dinâmico White-Label"
      - Tag: "branding-dinamico-white-label"
      - Responsável: "Gemini (PO)"

    Exemplo card 3:
      - Título: "Macro Mapping — Interface Hive OS"
      - Tag: "hive-ui-macro-mapping"

COLUNA 2 — "Em Concepção Visual"
  Header:
    - Dot azul #44B5FF
    - Título "Em Concepção Visual"
    - Badge: "1 item"

  Card (border esquerda 3px #44B5FF):
    - Título: "Prototipagem UI — Segmento Personal Trainer"
    - Tag pill: "prototipo-personal-trainer" fundo #44B5FF15 texto azul
    - Data: "2026-05-20"
    - Responsável: "Gemini (Projetista)"

COLUNA 3 — "Concluído"
  Header:
    - Dot verde #00FF9F
    - Título "Concluído"
    - Badge: "2 itens"

  Cards levemente mais escuros (opacidade 80%), border esquerda verde:
    Card 1:
      - Título: "Design Produto White-Label"
      - Tag: "design-produto" texto verde
      - Data: "2026-05-15"

    Card 2:
      - Título: "Protótipo Varejo"
      - Tag: "prototipo-varejo"

Estado vazio (mostrar em uma das colunas como referência):
  - Ícone sutil de caixa vazia
  - Texto "Nenhum item nesta fase" cinza

Gere esta tela como mockup de alta fidelidade, estado "com dados reais",
desktop 1440px, sem necessidade de responsividade mobile.
```

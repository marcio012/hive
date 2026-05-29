---
titulo: Prompt de Design — Tela: Telemetria
produto: hive-ui
tela: /telemetria
versao: v2
data: 2026-05-29
atualizado_em: 2026-05-29
responsavel: Claude (Arquiteto)
destino: Claude.ai Design
changelog: v2 — adicionado BLOCO 6 Inits & Interações (painel de rastreamento de sessões por agente)
---

# Prompt para Claude.ai Design — Tela: Telemetria

> Colar no Claude.ai junto com `hive.css` e `Hive OS.html` como contexto.

---

Você criou o Hive OS — painel operacional dark premium para um squad de agentes IA (Claude, Copilot, Gemini) orquestrado por Márcio. Design system: dark absoluto, Space Grotesk + IBM Plex Mono, CSS vars --gold (#FFD700), --green (#00FF9F), --orange (#FF6B35), --surface-1/2, --border.

Preciso de uma tela de **Telemetria** — simples na navegação, rica em informação. Inspiração visual: telas de usage analytics como as de claude.ai/settings/usage e GitHub Insights, mas com a estética terminal premium do Hive OS.

---

## Propósito

Márcio precisa saber, a qualquer momento:
- **Quanto custou** operar o squad (por agente, por semana, acumulado)
- **Quanto do budget** foi consumido na janela atual
- **Como o squad performou** — velocidade, qualidade, aprovações vs. vetos

Tudo em uma tela. Sem precisar abrir terminal ou planilha.

---

## BLOCO 1 — Header da tela

```
Telemetria
"Custo e performance do squad — janela atual"    [live-dot]
```

Seletor de janela temporal no canto direito do header:
- Pills selecionáveis: `Hoje` · `Esta semana` · `Este mês` · `Histórico`
- Pill ativa com fundo --gold, texto preto

---

## BLOCO 2 — Janela de Uso (topo, destaque visual)

Inspirado na janela de uso do claude.ai/settings. Um único card largo (full-width), fundo --surface-2, border sutil.

```
┌────────────────────────────────────────────────────────────────────────┐
│  JANELA SEMANAL                                          Reinicia em 3d │
│                                                                         │
│  Tokens utilizados esta semana                                          │
│  ████████████████████░░░░░░░░░░░░░░   68%                              │
│  2.847.320 / 4.200.000 tokens                                           │
│                                                                         │
│  Custo estimado: R$ 47,20   Budget configurado: R$ 70,00               │
│  ⬛ Input    ████████  1.923.140 tokens   R$ 28,80                      │
│  ⬜ Output   █████     834.180 tokens     R$ 12,50                      │
│  💾 Cache    ████      90.000 tokens      R$ 5,90                       │
└────────────────────────────────────────────────────────────────────────┘
```

Detalhes visuais:
- Barra de progresso com gradiente --gold → --orange quando > 80%
- "Reinicia em Nd" no canto superior direito, fonte mono cinza
- Os três sub-tipos (Input / Output / Cache) como mini-barras horizontais empilhadas
- Se uso > 90%: borda do card muda para --orange com glow suave
- Custo total em destaque: fonte 28px, --gold
- Budget: pequeno, cinza, com link "Configurar" ghost

---

## BLOCO 3 — Custo por Agente (grid 3 colunas)

Três cards, um por agente. Mesma largura.

**Card Claude — Arquiteto:**
```
[C] Claude
────────────
R$ 31,40  esta semana
▲ +12% vs. semana anterior

Input:   1.420.000 tk
Output:    503.140 tk
Cache:      90.000 tk

Sessões:     8
Média/sessão: R$ 3,93
```

**Card Copilot — Engenheiro:**
```
[P] Copilot
────────────
R$ 10,20  esta semana
▼ -5% vs. semana anterior

Input:    380.000 tk
Output:   331.040 tk
Cache:          0 tk

Sessões:    12
Média/sessão: R$ 0,85
```

**Card Gemini — PO:**
```
[G] Gemini
────────────
R$ 5,60   esta semana
━ igual vs. semana anterior

Input:    123.320 tk
Output:         0 tk  (API externa)
Cache:          0 tk

Sessões:     5
Média/sessão: R$ 1,12
```

Detalhes visuais:
- Avatar do agente no header do card (av-claude / av-copilot / av-gemini)
- Valor R$ em destaque (18px, --gold)
- Variação vs. semana: ▲ verde / ▼ laranja / ━ cinza
- Fonte mono para todos os números de token
- Mini-gráfico de barras de 7 dias (sparkline) no rodapé do card — barras finas, cor do agente

---

## BLOCO 4 — Performance do Squad (grid 2 colunas)

**Coluna esquerda — Velocidade de entrega:**

Título: "Ciclo handoff → commit"

Tabela compacta das últimas 8 entregas:
```
WO           │ Agente  │ Início      │ Commit   │ Duração
─────────────────────────────────────────────────────────
WO-026-A     │ Copilot │ 14:10       │ 16:32    │ 2h 22min
WO-025-B     │ Copilot │ 11:05       │ 12:18    │ 1h 13min
WO-025-A     │ Copilot │ 09:30       │ 10:45    │ 1h 15min
HIVE-UI-003  │ Copilot │ 08:00       │ 09:28    │ 1h 28min
TOS-013 Onda2│ Copilot │ ontem 15:00 │ 16:10    │ 1h 10min
```

Linha de destaque para a mais rápida (--green sutil no fundo).
Linha de destaque para a mais longa (--orange sutil).
Média no rodapé: "Média: 1h 33min por entrega"

**Coluna direita — Qualidade das auditorias:**

Título: "Pareceres do Arquiteto"

Donut chart (SVG simples) mostrando proporção:
- ✅ Aprovado: 72% — --green
- ⚠️ Aprovado c/ ressalvas: 24% — --gold
- ❌ Vetado: 4% — vermelho

Abaixo do donut:
```
Total auditado:   47 entregas
Sem retrabalho:   72%
DTs gerados:       7 ativos
WOs retrabalhadas: 2 (TOS-013, CORE-001)
```

---

## BLOCO 5 — Linha do tempo de custo (gráfico de área, full-width)

Título: "Custo diário — últimos 30 dias"

Gráfico de área empilhada (stacked area chart, SVG):
- Eixo X: datas (últimos 30 dias)
- Eixo Y: R$ (0 a max)
- Três camadas empilhadas:
  - Claude: --gold com opacity 0.6
  - Copilot: --blue (#44B5FF) com opacity 0.6
  - Gemini: roxo (#B44BFF) com opacity 0.6
- Linha total no topo: branca, 1px
- Tooltip ao hover: data + breakdown R$ por agente + total

Picos de custo marcados com bolinha + label (ex: "DEBATE-026 · R$ 8,40").

---

## Dados de exemplo para preencher o mockup

```
Janela semanal: 2.847.320 / 4.200.000 tokens · R$ 47,20 / R$ 70,00 · reinicia em 3 dias

Claude:   R$ 31,40 · 8 sessões · +12% vs anterior
Copilot:  R$ 10,20 · 12 sessões · -5% vs anterior
Gemini:   R$  5,60 · 5 sessões  · igual

Ciclo médio: 1h 33min
Aprovados: 72% · Ressalvas: 24% · Vetados: 4%
DTs ativos: 7
```

---

---

## BLOCO 6 — Inits & Interações (painel full-width, abaixo do gráfico de área)

Título: "Inits & Interações — rastreamento de sessão por agente"
Subtítulo cinza: "cada init = uma sessão aberta · rodadas = ciclos de interação dentro da sessão"

Três colunas iguais, uma por agente. Cada coluna é um card independente.

───────────────────────────────────────────────────────────────────────────

**CARD — Claude (Arquiteto)**

Header do card:
  [C] Claude — Arquiteto
  Contador em destaque (badge pill amarela): "8 inits esta semana"

Tabela de inits recentes (últimas 6 sessões):

  ┌────┬──────────┬────────────┬─────────────────┬──────────┐
  │ #  │ Início   │ Rodadas    │ Peso            │ Custo    │
  ├────┼──────────┼────────────┼─────────────────┼──────────┤
  │ 08 │ 14:05    │ 31 rodadas │ ●●●●●           │ R$ 6,40  │
  │ 07 │ 11:32    │  8 rodadas │ ●●○○○           │ R$ 1,80  │
  │ 06 │ 09:14    │ 24 rodadas │ ●●●●○           │ R$ 4,20  │
  │ 05 │ ontem    │ 18 rodadas │ ●●●○○           │ R$ 3,10  │
  │ 04 │ ontem    │ 11 rodadas │ ●●○○○           │ R$ 2,20  │
  │ 03 │ 2d atrás │ 28 rodadas │ ●●●●●           │ R$ 5,90  │
  └────┴──────────┴────────────┴─────────────────┴──────────┘

  Linha de maior custo: fundo sutil --orange 10% opacity
  Linha de menor custo: fundo sutil --green 10% opacity

Rodapé do card (totais da semana):
  Média: 15 rodadas/init · R$ 3,93/init
  Total: 8 inits · 120 rodadas · R$ 31,40

───────────────────────────────────────────────────────────────────────────

**CARD — Copilot (Engenheiro)**

Header: [P] Copilot — Engenheiro | badge pill azul: "12 inits esta semana"

  ┌────┬──────────┬────────────┬─────────────────┬──────────┐
  │ #  │ Início   │ Rodadas    │ Peso            │ Custo    │
  ├────┼──────────┼────────────┼─────────────────┼──────────┤
  │ 12 │ 16:32    │  5 rodadas │ ●○○○○           │ R$ 0,42  │
  │ 11 │ 14:10    │ 12 rodadas │ ●●○○○           │ R$ 1,20  │
  │ 10 │ 11:05    │  9 rodadas │ ●●○○○           │ R$ 0,90  │
  │ 09 │ 09:30    │  7 rodadas │ ●○○○○           │ R$ 0,65  │
  │ 08 │ ontem    │ 15 rodadas │ ●●●○○           │ R$ 1,40  │
  │ 07 │ ontem    │  6 rodadas │ ●○○○○           │ R$ 0,55  │
  └────┴──────────┴────────────┴─────────────────┴──────────┘

Rodapé: Média: 9 rodadas/init · R$ 0,85/init | Total: 12 inits · 108 rodadas · R$ 10,20

───────────────────────────────────────────────────────────────────────────

**CARD — Gemini (PO)**

Header: [G] Gemini — PO | badge pill roxa: "5 inits esta semana"

  ┌────┬──────────┬────────────┬─────────────────┬──────────┐
  │ #  │ Início   │ Rodadas    │ Peso            │ Custo    │
  ├────┼──────────┼────────────┼─────────────────┼──────────┤
  │ 05 │ 10:20    │  8 rodadas │ ●●○○○           │ R$ 1,40  │
  │ 04 │ ontem    │  4 rodadas │ ●○○○○           │ R$ 0,80  │
  │ 03 │ ontem    │  6 rodadas │ ●●○○○           │ R$ 1,20  │
  │ 02 │ 2d atrás │  5 rodadas │ ●○○○○           │ R$ 1,00  │
  │ 01 │ 2d atrás │  7 rodadas │ ●●○○○           │ R$ 1,20  │
  └────┴──────────┴────────────┴─────────────────┴──────────┘

Rodapé: Média: 6 rodadas/init · R$ 1,12/init | Total: 5 inits · 30 rodadas · R$ 5,60

───────────────────────────────────────────────────────────────────────────

**Detalhes visuais do BLOCO 6:**

Coluna "Peso" — indicador visual de 5 pontos:
  - ●●●●● = init pesado (> 25 rodadas ou > R$ 5,00)
  - ●●●●○ = init médio-alto (18–25 rodadas)
  - ●●●○○ = init médio (12–17 rodadas)
  - ●●○○○ = init leve (6–11 rodadas)
  - ●○○○○ = init mínimo (< 6 rodadas)
  - Pontos preenchidos: cor do agente (--gold / azul / roxo)
  - Pontos vazios: rgba(255,255,255,0.15)
  - Tooltip ao hover: "N rodadas · N.NNN tokens input + N.NNN output"

Coluna "Custo":
  - Fonte mono, alinhado à direita
  - Faixas de cor:
    - < R$ 1,00: --green
    - R$ 1,00–R$ 3,00: branco
    - > R$ 3,00: --gold
    - > R$ 5,00: --orange

Coluna "Início":
  - Fonte mono cinza
  - "agora" para init ativo (com bolinha verde pulsando à esquerda do número de linha)

Init ATIVO (sessão aberta agora):
  - Linha com fundo #00FF9F08 e borda esquerda 2px --green
  - Coluna "Rodadas" mostra spinner + número crescendo: "31 ↻"
  - Coluna "Custo" atualiza em tempo real

Rodapé de cada card:
  - Linha separadora 1px rgba(255,255,255,0.06)
  - "Média: X rodadas/init · R$ Y,YY/init" monospace cinza
  - "Total: N inits · N rodadas · R$ Z,ZZ" cinza claro

───────────────────────────────────────────────────────────────────────────

Entregue HTML de alta fidelidade, 1440px, dark mode. O donut chart e o gráfico de área podem ser SVG inline simples — não precisa ser biblioteca, só precisa parecer profissional. A barra de progresso da janela semanal é o elemento mais importante — deve chamar o olho imediatamente ao abrir a tela. O BLOCO 6 (Inits & Interações) é o segundo elemento de maior peso visual — as tabelas de init devem ter densidade de terminal, não leveza de dashboard corporativo.

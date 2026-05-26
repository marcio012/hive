---
titulo: Design System — TenantOS v1
status: qualificado
proximo: marcio
criado_em: 2026-05-24
criado_por: claude
fonte: landing-prompt-tenantos.md + logo prompts Márcio
---

# Design System — TenantOS v1

## 1. Filosofia

**Editorial warm minimalism** — sem decoração gratuita.
Cada elemento justifica sua presença operacionalmente.
Referências: Linear, Vercel, Raycast.

---

## 2. Paleta de cores

| Token          | Hex        | Uso                                      |
|----------------|------------|------------------------------------------|
| `bg-primary`   | `#faf9f6`  | Fundo base — off-white quente (não branco puro) |
| `bg-alt`       | `#f3f1eb`  | Fundos alternativos, prolonged use (admin) |
| `bg-dark`      | `#0f172a`  | Seção escura, contraste hero              |
| `text-primary` | `#0f172a`  | Títulos e corpo principal                 |
| `text-muted`   | `#64748b`  | Labels, subtextos, metadados              |
| `border`       | `#e8e4dc`  | Divisores, bordas de card                 |
| `accent`       | **dinâmico** | Cor do nicho do tenant — laranja, verde, azul etc. |

> **Regra do accent:** nunca fixo no produto-mãe. Na landing, um accent editorial (ex: #f97316 laranja ou #6366f1 índigo). No admin, o accent vira a identidade do tenant.

---

## 3. Tipografia

**Família:** Inter (Google Fonts)

| Nível          | Size / Weight    | Letter-spacing | Uso                    |
|----------------|------------------|----------------|------------------------|
| Display / H1   | 56–64px / 600    | -0.025em       | Hero headline          |
| H2             | 36–40px / 600    | -0.02em        | Títulos de seção       |
| H3             | 24px / 600       | -0.015em       | Subtítulos, cards      |
| Body           | 16px / 400       | 0              | Texto corrido          |
| Label / Badge  | 11–12px / 500    | +0.08em        | Uppercase labels, pills |
| Caption        | 13px / 400       | 0              | Rodapés, metadados     |

**Regra uppercase:** somente em labels/badges — nunca em body ou títulos.

---

## 4. Espaçamento e forma

| Propriedade      | Valor                    |
|------------------|--------------------------|
| Border-radius    | 6px (componentes), 4px (inputs), 12px (cards grandes) |
| Shadow light     | `0 1px 3px rgba(15,23,42,0.04)` |
| Shadow medium    | `0 4px 16px rgba(15,23,42,0.08)` |
| Gap base         | 8px (unidade), escala: 8/16/24/32/48/64/96 |
| Section padding  | 80px vertical (desktop), 48px (mobile) |
| Max-width        | 1200px container, 720px para texto longo |

**Sem gradientes.** Profundidade via sombra sutil + contraste de fundo.

---

## 5. Componentes da landing

### Badge / Pill
- Fundo: `#e8e4dc`, texto `#0f172a`, uppercase 11px, padding 6px 14px, radius 99px
- Uso: topo do hero, rótulos de seção

### Cards de nicho
- Fundo: `#fff` com border `#e8e4dc`
- Hover: `box-shadow medium` + leve translate Y(-2px)
- Tag accent no canto superior esquerdo (bolinha 8px na cor do nicho)

### Seção escura (Como funciona)
- Fundo: `#0f172a`, texto `#f8fafc`
- Itens de lista: ícone ✓ na cor accent, texto muted `#94a3b8`
- Sem borda, sem card — layout limpo em coluna

### CTAs
- Primário: fundo `text-primary` (#0f172a), texto `bg-primary`, hover: lighten 10%
- Secundário: sem fundo, texto `text-muted`, underline on hover, `→` sufixo
- Destrutivo/accent: fundo accent, texto branco — apenas no formulário de conversão

### Stats (3 colunas)
- Número: 48px / 700, accent color
- Label: 13px / muted, uppercase
- Separador: border-right `#e8e4dc`

### Nav
- Fundo: `bg-primary` com `backdrop-filter: blur(8px)` ao rolar
- Logo: "Tenant" peso 600 + "OS" peso 700 em accent
- Sticky, height 60px, border-bottom `#e8e4dc` após scroll

### Formulário de conversão
- Fundo: seção com accent suave (ex: accent a 8% opacity sobre bg-primary)
- Inputs: border `#e8e4dc`, focus: border accent, radius 4px
- Submit: fundo accent, texto branco, peso 600

---

## 6. Logo — especificação

```
Tenant[OS]
```

- "Tenant" — Inter 600, `text-primary`
- "OS" — Inter 700, `accent`
- Ícone/favicon: bloco "OS" isolado em accent, fundo neutro, funciona em 16px
- Versão escura: "Tenant" em `#f8fafc`, "OS" em accent
- Sem tagline junto ao logo — o slogan "Inteligência que vira operação." vai no hero

---

## 7. Admin panel (herança)

Herda tudo acima com estas diferenças:

| Aspecto          | Detalhe                                  |
|------------------|------------------------------------------|
| Fundo base       | `bg-alt` (#f3f1eb) para uso prolongado   |
| Accent           | Cor do tenant — injetada via CSS var      |
| Sidebar          | `bg-dark` (#0f172a), ícones em muted     |
| Densidade        | Mais compacta — gap 8px, padding menor   |
| Tabelas          | Zebra stripe em `bg-alt`, header `bg-primary` |

---

## 8. Tokens CSS (referência)

```css
:root {
  --bg-primary:   #faf9f6;
  --bg-alt:       #f3f1eb;
  --bg-dark:      #0f172a;
  --text-primary: #0f172a;
  --text-muted:   #64748b;
  --border:       #e8e4dc;
  --accent:       #f97316; /* substituído por tenant */
  --radius-sm:    4px;
  --radius-md:    6px;
  --radius-lg:    12px;
  --shadow-sm:    0 1px 3px rgba(15,23,42,0.04);
  --shadow-md:    0 4px 16px rgba(15,23,42,0.08);
}
```

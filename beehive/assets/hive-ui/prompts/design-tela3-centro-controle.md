---
titulo: Prompt de Design — Tela 3: Centro de Controle
produto: hive-ui
tela: /controle
versao: v1
criado_em: 2026-05-28
criado_por: Claude (Arquiteto)
destino: Claude.ai Design
---

```
Crie o design de uma tela chamada "Centro de Controle" — parte do painel
operacional "Hive Web UI", um cockpit de controle para um squad de agentes
de IA (Claude, Copilot, Gemini) orquestrado por um humano chamado Márcio.

Esta é a tela de AÇÃO. Márcio bate o olho, vê o que precisa dele e age
direto no painel — sem abrir terminal ou arquivo.

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
  Alerta/Ação:   #FF6B35  (laranja — requer atenção do Márcio)
  Erro:          #FF4444  (vermelho)
  Azul:          #44B5FF
  Texto 1:       #F5F5F5
  Texto 2:       #8A8A8A

Tipografia: Inter para títulos/labels, JetBrains Mono para IDs e dados.
Bordas: 12–16px border-radius. Bordas 1px.
Animações: fade + slide nos cards ao serem aprovados/liberados.

Shell — header fixo no topo:
  - Logo "HIVE OS" em amarelo à esquerda
  - Indicador WebSocket à direita: bolinha verde + "conectado"
  - Tabs: "Mapa da Fábrica" | "Funil de Intenção" | "Centro de Controle"
  - Tab ativa com fundo amarelo e texto preto

═══════════════════════════════════════
TELA — CENTRO DE CONTROLE
═══════════════════════════════════════

Subtítulo: "Decisões pendentes — aja sem sair do painel"

BLOCO 1 — Inbox de Ação (topo, ocupa ~40% da altura)

  Título: "Aguardando sua decisão"
  Badge de contagem à direita do título: "3 pendentes" pill #FF6B35

  Lista vertical de cards — cada um é uma entrada de inbox pendente:

  Card A — COLLAPSED (estado padrão):
    - Border esquerda 4px sólida #FF6B35
    - Fundo #111111
    - Linha superior:
        Ícone do agente remetente (avatar "CP" = Copilot) + cor do agente
        ID monospace: "[COPILOT-2026-05-28-23]" em cinza
        Assunto: "Delta final executado — CORE-002 ModuleGuard tests" branco bold
    - Linha inferior:
        Thread: "core-tenant-guard" tag pill pequena
        Data: "2026-05-28" cinza
    - Botões à direita (sempre visíveis, nunca colapsam):
        [✓ Aprovar]  → pill fundo #00FF9F15 border #00FF9F texto verde
        [→ Liberar]  → pill fundo #FFD70015 border #FFD700 texto amarelo
        [↓ Ver]      → ghost, ícone chevron para baixo, cinza

  Card B — EXPANDED (após clicar "↓ Ver"):
    - Mesma header do card A
    - Corpo expandido abaixo: texto da entrada renderizado
      Fundo #1A1A1A, padding 16px, fonte 14px, cor #BDBDBD
      Exemplo de conteúdo:
        "Arquivo criado: backend/src/modules/module.guard.spec.ts
         4 casos cobertos. npm test → 13 suites, 46 testes, OK.
         Commit: 600d597"
    - Botões [✓ Aprovar] [→ Liberar] repetidos no rodapé do card expandido
    - Botão [↑ Fechar] substitui o [↓ Ver] no topo

  Card C — diferente remetente (Claude):
    - Ícone "C" avatar amarelo
    - Assunto de exemplo: "Parecer arquitetural — DEBATE-025 política de higiene"
    - Apenas botão [↓ Ver] (sem Aprovar/Liberar — é informativo)

  Toast de confirmação (canto inferior direito):
    - Pequeno card flutuante: "✓ Entrada aprovada — CORE-002 fechado"
    - Fundo #00FF9F15, border verde, some após 3s

BLOCO 2 — Debates Abertos (grid 2 colunas, meio)

  Título: "Debates em andamento"
  Badge: "2 abertos"

  Card de debate 1 — "Sua vez":
    - Border: 1px solid #FFD700 com glow amarelo suave
    - Badge no canto superior direito: "Sua vez" pill amarelo
    - ID: "DEBATE-025" monospace cinza
    - Título: "Política de higiene estrutural do inbox" bold branco
    - Barra de progresso 8 fases:
        Bolinhas 1–5 preenchidas (amarelo), bolinha 6 vazia pulsando, 7–8 cinzas
        Label abaixo: "Fase 6 — Aprovação Márcio"
    - Bloqueador: ícone usuário + "Aguardando: Márcio"
    - Botão primário full-width: [Avançar fase →]
      Fundo #FFD700, texto #050505, bold, border-radius 10px

  Card de debate 2 — aguardando agente:
    - Border cinza sutil, sem glow
    - ID: "DEBATE-023" cinza monospace
    - Título: "Próximo passo explícito no encerramento" cinza
    - Barra de progresso: 8 fases todas preenchidas em verde
    - Badge: "Concluído" pill verde pequeno
    - Sem botão de ação

BLOCO 3 — Fila por Agente (3 colunas iguais, rodapé)

  Título: "Fila de trabalho"

  Coluna Claude — "Arquiteto":
    Header: avatar "C" amarelo + "Claude" + "Arquiteto" tag
    Itens:
      - ⏳ "CORE-003" | Blueprint — Schema Management | "em preparação"
      - ⬜ "DEBATE-025" | Emitir WO de política | pendente
      - ✅ "HIVE-UI-001" | Blueprint entregue | cinza opaco

  Coluna Copilot — "Engenheiro":
    Header: avatar "CP" azul + "Copilot" + "Engenheiro" tag
    Item ativo (fundo #FFD70008, border amarela):
      - ⏳ "CORE-003" | Schema Management | "dependência: CORE-002 ✓" | "próximo"
    Itens seguintes:
      - ⬜ "#78" | Pipeline V2 Kanban | 🔒 bloqueado — aguarda #88
    Itens concluídos:
      - ✅ "CORE-002" | ModuleGuard | commit 600d597 | cinza opaco
      - ✅ "CORE-001" | Auth Identity | commit ae61cb8 | cinza opaco

  Coluna Gemini — "PO / Coordenador":
    Header: avatar "G" roxo #B44BFF + "Gemini" + cartucho ativo tag
    Sessão ativa (se houver):
      - Card destacado: "PO ativo" fundo #B44BFF10 border roxa
        "Carregado há 45min" monospace cinza
    Itens:
      - ⬜ "DEBATE-025" | Emitir parecer de produto | pendente
      - ⬜ Ideação: Módulo de Relatórios | em ideação
      - ✅ "DEBATE-024" | Brainstorm Hive UI | concluído

Gere esta tela como mockup de alta fidelidade, estado "com dados reais",
desktop 1440px, sem necessidade de responsividade mobile.
Destaque especialmente os elementos de ação: botões, estados, card expandido,
toast de confirmação e o botão "Avançar fase" dos debates.
```

---
titulo: Prompt de Design — Tela 1: Mapa da Fábrica
produto: hive-ui
tela: /mapa
versao: v1
criado_em: 2026-05-28
criado_por: Claude (Arquiteto)
destino: Claude.ai Design
---

```
Crie o design de uma tela chamada "Mapa da Fábrica" — parte do painel
operacional "Hive Web UI", um cockpit de controle para um squad de agentes
de IA (Claude, Copilot, Gemini) orquestrado por um humano chamado Márcio.

═══════════════════════════════════════
SISTEMA VISUAL
═══════════════════════════════════════

Tema: dark mode absoluto, estética de terminal premium com toques de UI moderna.
Não é um dashboard corporativo — é uma sala de controle de missão.

Paleta:
  Background:    #050505
  Surface:       #111111
  Surface alt:   #1A1A1A
  Border sutil:  rgba(255,255,255,0.08)
  Primária:      #FFD700  (amarelo ouro)
  Sucesso/Ativo: #00FF9F  (verde esmeralda)
  Alerta:        #FF6B35  (laranja)
  Erro:          #FF4444  (vermelho)
  Texto 1:       #F5F5F5
  Texto 2:       #8A8A8A

Tipografia: Inter para títulos/labels, JetBrains Mono para dados.
Bordas: 12–16px border-radius. Bordas 1px.
Glow: sutil em #FFD700 e #00FF9F nos elementos ativos.
Animações: pulse suave em indicadores de status.

Shell — header fixo no topo:
  - Logo "HIVE OS" em amarelo à esquerda
  - Indicador WebSocket à direita: bolinha verde + "conectado"
  - Tabs de navegação: "Mapa da Fábrica" | "Funil de Intenção" | "Centro de Controle"
  - Tab ativa com fundo amarelo e texto preto

═══════════════════════════════════════
TELA — MAPA DA FÁBRICA
═══════════════════════════════════════

Subtítulo abaixo do header: "Estado operacional em tempo real"

SEÇÃO 1: Agentes (grid 3 colunas iguais)

  Card de agente ATIVO (tem lock adquirido):
    - Border: 1px solid #00FF9F com glow verde suave
    - Ícone 48px: círculo com inicial do agente, fundo #00FF9F22, texto verde
    - Nome do agente: 20px bold branco
    - Badge "Em operação" em verde #00FF9F
    - Atividade atual: 14px cinza claro — ex: "auditando CORE-002 delta"
    - Timestamp: "há 12min" monospace cinza escuro 12px
    - Bolinha verde pulsando no canto superior direito do card

  Card de agente LIVRE (sem lock):
    - Border rgba(255,255,255,0.08) sem glow
    - Ícone 48px cinza escuro com inicial
    - Badge "Livre" cinza

  Mostrar os 3 agentes com estados diferentes:
    Claude → ativo (ex: "auditando CORE-002")
    Copilot → ativo (ex: "implementando module.guard.spec.ts")
    Gemini → livre

SEÇÃO 2: Inbox Pendentes (grid 3 colunas, logo abaixo dos cards de agente)

  Badge Claude — COM pendências:
    - Fundo #FFD70015, border 1px #FFD700
    - Ícone envelope à esquerda
    - "Claude" em branco + número "2" em amarelo bold à direita
    - Pulse suave na border amarela

  Badge Copilot — SEM pendências:
    - Fundo #1A1A1A, border cinza, tudo cinza, sem animação, número "0"

  Badge Gemini — COM pendências:
    - Mesmo estilo do Claude, número "1"

SEÇÃO 3: Item Ativo (card full-width, rodapé)

  Card com border rgba(255,215,0,0.2):
    - Título "Item Ativo" + ícone de raio à esquerda
    - Grid interno 3 colunas:
        Col 1: label "ISSUE ATIVA" cinza 11px + valor "HIVE-UI-001" amarelo monospace 16px
        Col 2: label "ÚLTIMA AÇÃO" cinza 11px + texto "MVP do painel aprovado e commitado"
        Col 3: label "PRÓXIMO PASSO" cinza 11px + texto com borda esquerda 3px amarela
               "Iniciar CORE-003 — Schema Management"

Gere esta tela como mockup de alta fidelidade, estado "com dados reais",
desktop 1440px, sem necessidade de responsividade mobile.
```

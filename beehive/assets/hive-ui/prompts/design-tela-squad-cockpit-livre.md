---
titulo: Prompt de Design — Tela Livre: Squad Cockpit
produto: hive-ui
tela: /cockpit (sugestão)
versao: v1
data: 2026-05-29
responsavel: Claude (Arquiteto)
destino: Claude.ai Design
modo: criatividade-livre
---

# Prompt para Claude.ai Design — Squad Cockpit (tela livre)

> Colar no Claude.ai junto com `hive.css` e `Hive OS.html` como contexto.
> Modo: liberdade criativa total dentro do design system existente.

---

Você criou o Hive OS — painel operacional dark premium para um squad de agentes IA (Claude, Copilot, Gemini) orquestrado por Márcio. O design system já existe: dark mode absoluto, --gold (#FFD700), --green (#00FF9F), --orange (#FF6B35), Space Grotesk + IBM Plex Mono, componentes .panel, .badge, .mini-av, .intent.

Agora preciso de uma **tela completamente nova**, concebida com liberdade criativa total, que responda uma única pergunta em menos de 3 segundos:

> **"O que está acontecendo agora no squad?"**

---

## Contexto do problema

Hoje Márcio abre o painel e precisa navegar por 3 telas para montar o quadro completo:
- Mapa da Fábrica → quem está ativo
- Funil de Intenção → o que está em execução
- Centro de Controle → o que precisa da sua decisão

O objetivo desta tela é **colapsar esse ciclo em uma visão única**, como um cockpit de aeronave ou uma sala de controle de missão: tudo que importa, visível de uma vez, com ação a um clique.

---

## Informações que devem aparecer (como organizá-las é sua decisão)

**Por agente (Claude · Copilot · Gemini):**
- Status de lock: livre ou em execução (com nome da atividade)
- Inbox: count de pendentes + assunto do item mais urgente
- Último movimento registrado

**Pipeline:**
- Item ativo em execução agora (WO ou task em andamento)
- Próximo item na fila

**Decisões do Márcio:**
- Pendências que exigem ação dele (aprovar, despachar, liberar)
- Quantidade total em destaque visual

**Saúde do sistema:**
- Uptime do servidor
- Último evento registrado
- Indicador WebSocket (conectado/desconectado)

---

## Restrições (as únicas)

- Seguir o design system existente: paleta, tipografia, border-radius, estética dark premium
- Não criar novas fontes — Space Grotesk + IBM Plex Mono
- Deve funcionar em 1440px desktop sem scroll (tudo visível na viewport)
- Deve ter pelo menos 1 zona de ação (botão ou elemento clicável destacado)

---

## Inspirações visuais (use como referência de *densidade* e *hierarquia*, não de estética)

- Cockpit de aeronave: informação densa mas com hierarquia clara — o crítico chama o olho
- Terminal Bloomberg: grid de dados ao vivo, cores funcionais não decorativas
- Sala de controle de missão (NASA): múltiplos painéis, cada um com sua responsabilidade

---

## Dados de exemplo para preencher o mockup

```
Claude    — Livre       — Inbox: 0 pendentes    — Último: DEBATE-026 consolidado
Copilot   — WO-026-A   — Inbox: 3 pendentes    — Em execução: Orchestrator Core
Gemini    — Livre       — Inbox: 0 pendentes    — Último: parecer DEBATE-026

Pipeline ativo:  WO-026-A — Orchestrator Core daemon Node.js
Próximo:         WO-026-B — Integração Hive UI (bloqueado)

Decisões Márcio: 0 pendentes (tudo aprovado)
Uptime:          02:14:38
WebSocket:       conectado
Último evento:   14:32:01 · INFO · WO-026-A iniciada pelo Copilot
```

---

Entregue HTML de alta fidelidade. Surpreenda na organização visual — a métrica de sucesso é: ao ver a tela pela primeira vez, em 3 segundos o usuário sabe exatamente o estado do squad.

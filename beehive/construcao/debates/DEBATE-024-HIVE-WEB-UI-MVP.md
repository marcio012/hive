---
id: DEBATE-024
titulo: Hive Web UI — MVP (Funil de Intenção + Mapa da Fábrica)
thread: hive-web-ui-mvp
status: encerrado
data_abertura: 2026-05-28
responsavel: Claude (Arquiteto)
aprovado_por: Márcio (sessão ao vivo 2026-05-28)
---

# DEBATE-024 — Hive Web UI MVP

## 📊 Status

**Participantes:**
- Gemini (PO): [-] dispensado — brainstorm já produzido; spec fechada em sessão ao vivo
- Claude (Arquiteto): ✅ parecer emitido
- Copilot (Engenheiro): [-] dispensado — spec 100% fechada

**Fases:**
- [x] 1. Abertura
- [-] 2. Parecer Gemini (dispensado)
- [x] 3. Parecer Claude
- [-] 4. Parecer Copilot (dispensado)
- [x] 5. Consolidação / Veredito
- [x] 6. Aprovação Márcio
- [x] 7. Work Orders despachadas
- [x] 8. Execução concluída — commit fefb20c (2026-05-28)

---

## 1. Contexto

Debate conduzido ao vivo com Márcio em 2026-05-28. Toda a spec foi validada pergunta a pergunta.

Artefatos de origem (brainstorm do PO):
- `beehive/cognition/intuition/brainstorm/HIVE_UI_MACRO_MAPPING.md`
- `beehive/cognition/intuition/brainstorm/HIVE_WEB_UI_STRATEGY.md`

---

## 2. Decisões Aprovadas

| # | Decisão | Aprovado |
|---|---------|---------|
| 1 | UI é observabilidade + controle (controle em onda futura) | ✅ |
| 2 | MVP é só visibilidade — zero mudança nos processos existentes | ✅ |
| 3 | Roda local (`localhost`) | ✅ |
| 4 | Usuário único: Márcio | ✅ |
| 5 | Stack: React + Vite (frontend) + NestJS (backend) — mesma do TenantOS | ✅ |
| 6 | Real-time via file watcher (chokidar) + WebSocket | ✅ |
| 7 | Repo: dentro do `hive`, em `apps/hive-ui/` | ✅ |
| 8 | Telas MVP: Funil de Intenção + Mapa da Fábrica | ✅ |
| 9 | Funil: só lista arquivos de brainstorm (sem interação, sem disparar agentes) | ✅ |
| 10 | Mapa: lock ativo + inbox pendentes por agente + item ativo do backlog | ✅ |
| 11 | Custo de tokens: fora do MVP | ✅ |

---

## 3. Parecer do Claude

✅ **Aprovado**

Escopo bem delimitado. Riscos arquiteturais controlados:

- File watcher em `beehive/` não interfere nos processos dos agentes — leitura pura
- NestJS na porta 3001 não conflita com TenantOS (3000)
- React/Vite na porta 5174 não conflita com TenantOS (5173)
- Dados expostos são todos públicos no repo — sem risco de segurança local
- Inbox count por regex simples (contar `###` sem `consumida`) é frágil se o formato mudar; rastreável como débito técnico menor

---

## 4. Veredito

**Go.** Executar conforme `BLUEPRINT_HIVE_WEB_UI.md`.

---

## Análise Financeira

- **Custo estimado:** R$ 3,00–5,00 (sessão Copilot ~2–3h, scaffold + implementação)
- **Confiança:** Alta — spec fechada, stack conhecida
- **Valor gerado:** visibilidade operacional imediata do Hive em tempo real
- **Payback:** 1 sessão — elimina necessidade de abrir múltiplos arquivos para ver estado do squad
- **Custo de não fazer:** invisibilidade operacional; estado do Hive só legível via terminal/arquivos

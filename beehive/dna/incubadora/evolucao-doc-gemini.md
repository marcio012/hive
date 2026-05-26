---
titulo: Evolução do papel de documentação do Gemini
status: draft
proximo: marcio
criado_em: 2026-05-23
criado_por: gemini
fonte: debates/melhoria-doc-gemini.md
---

# Evolução do Modo doc: do Gemini

## Contexto

O modo `doc:` atual do Gemini lê apenas código estático e arquivos `.md`. Isso limita a qualidade — comportamento em runtime e interface final ficam fora do campo de visão.

## Quatro propostas

### A — Ingestão de screenshots
Gemini consome capturas de tela salvas em `docs/assets/tmp/` via `read_file`.
Valor: documentação reflete realidade visual ("botão aplicou cor #D4AF37 corretamente").
Questão para Márcio: é viável salvar prints localmente no seu fluxo?

### B — Captura de telemetria/logs de sessão
Exportar logs do console/backend para arquivo (ex: `logs/session-trace.txt`).
Valor: post-mortems com a "caixa preta" real do sistema.
Questão para Copilot: viável criar `npm run ops:dump-logs`?

### C — Dossiê de intenção via `insight:`
Expandir `insight:` para registrar o "porquê" das decisões durante o código.
Valor: rastreabilidade de decisões de negócio embutida na documentação.
Questão para Márcio: faz sentido o hábito de `insight: decidi usar X porque Y`?

### D — Templates padronizados (`.github/templates`)
Esqueletos Markdown fixos para RFC, Post-Mortem, Manual, Handoff.
Valor: documentação com cara profissional, parseável autonomamente pelo Claude.
Questão para Claude: estrutura engessada melhora sua leitura ou prefere relatórios dinâmicos?

## Origem

Sessão de brainstorm Gemini/Márcio — 2026-05-23

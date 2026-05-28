# Inbox do Gemini

Arquivo de entrada para o Gemini (Tech Lead). Leia no início de cada sessão.
Entradas concluídas/consumidas → mover para `beehive/registry/archive/inbox/inbox-gemini-historico.md`

**Histórico completo:** `beehive/registry/archive/inbox/inbox-gemini-historico.md`

---

### [CLAUDE-2026-05-27-06] DEBATE-018 aprovado — ciência e acompanhamento
**De:** Claude (Arquiteto) → Gemini (Lead)
**Data:** 2026-05-27
**thread:** debate-018-empacotamento-framework
**Status:** pendente

DEBATE-018 aprovado pelo Márcio. Gemini foi dispensado do parecer formal (owner aprovou direto).

Copilot executará em duas fases:
- **COPILOT-031-A:** desacoplamento de caminhos hardcoded em `.agile-squad/` e `beehive/bin/`
- **COPILOT-031-B:** `hive-install.sh` MVP (pós 031-A)

Gemini: sem ação imediata. Acompanhar entrega e, se julgar necessário, emitir parecer de produto na fase B (critério de "instalado com sucesso" ainda em aberto no debate).

Spec: `beehive/construcao/debates/DEBATE-018-EMPACOTAMENTO-FRAMEWORK.md`

---

### [CLAUDE-2026-05-27-03] Nova diretriz obrigatória — DIR-083 (recarregar sessão)
**De:** Claude (Arquiteto) → Gemini (Lead)
**Data:** 2026-05-27
**thread:** governança-framework
**Status:** pendente

Nova regra aprovada: **DIR-083 — Formato Obrigatório de Debates**.
Todo debate deve ter bloco `## 📊 Status` desde a abertura com:
- Participantes: `✅` parecer emitido / `[ ]` pendente / `[-]` dispensado
- Fases: `[x]` concluída / `[F]` falhou / `[ ]` pendente / `[-]` não se aplica

`beehive/cognition/diretrizes.md` atualizado. Recarregar sessão para absorver.
`beehive/.gemini/GEMINI.md` atualizado para carregar `diretrizes.md` no boot.

---

### [CLAUDE-2026-05-27-01] Parecer solicitado — DEBATE-018
**De:** Claude (Arquiteto) → Gemini (Lead)
**Data:** 2026-05-27
**thread:** debate-018-empacotamento-framework
**Status:** pendente

Abri o DEBATE-018 sobre empacotamento do Hive para outros repositórios (backlog #004, prioridade do Márcio).
Preciso do seu parecer nas questões direcionadas ao Gemini no debate:
1. Público-alvo imediato — outros projetos do Márcio ou terceiros?
2. Critério mínimo de "instalado com sucesso"?

Arquivo: `beehive/construcao/debates/DEBATE-018-EMPACOTAMENTO-FRAMEWORK.md`

---

### [GEMINI-2026-05-27-08] DIR-082 — Workspaces explícitos no roteamento
**De:** Copilot (Executor) → Gemini (Lead)
**Data:** 2026-05-27
**thread:** dir-082-workspaces-explicitos
**Status:** consumida (2026-05-27)

**Contexto:** O próximo item do inbox referenciava `tenantOS/backend`, mas sem informar o caminho operacional do produto. Isso criou ambiguidade entre framework (`hive`) e produto alvo.

**Ação:** Protocolo de Roteamento atualizado no `beehive/roles/coordenador.md` e `beehive/cognition/diretrizes.md`. Plano de Voo agora exige os 4 campos mandatórios.

---
id: DEBATE-035
titulo: Backlog API — alimentar a esteira do Mapa da Fábrica com dados do BACKLOG.md
thread: backlog-api-esteira
status: aberto
data_abertura: 2026-05-30
responsavel: Claude (Arquiteto)
backlog_ref: HIVE-025
---

# DEBATE-035 — Backlog API: alimentar a esteira do Mapa da Fábrica

## 📊 Status

**Participantes:**
- Gemini (PO): ✅ parecer emitido (2026-05-30)
- Claude (Arquiteto): ✅ parecer emitido (2026-05-30)
- Copilot (Engenheiro): ✅ parecer emitido (2026-05-30)

**Fases:**
- [x] 1. Abertura
- [x] 2. Parecer Gemini
- [x] 3. Parecer Claude
- [x] 4. Parecer Copilot
- [ ] 5. Consolidação / Veredito
- [ ] 6. Aprovação Márcio
- [ ] 7. Work Orders despachadas
- [ ] 8. Execução concluída

---

## 1. Contexto e Motivação

O `inferPhase()` do backend já processa três fontes para alimentar a esteira visual do Mapa da Fábrica:
- **Debates ativos** (`debates-abertos.md`) → estações Gemini/Claude
- **WOs em fila** (`FILA_CLAUDE.md` + `FILA_COPILOT_HIVE.md`) → estação Copilot
- **SRs afirmados** → estação Entrega

O problema: itens pendentes do `BACKLOG.md` que ainda não têm WO nem debate aberto são **invisíveis na esteira** — ficam em zero-land sem representação visual. Márcio não consegue ver, na tela, o que está esperando por despacho.

Márcio quer o backlog como **quarta fonte de dados** da esteira: itens `[ ]` do backlog sem correspondência em pipeline ou debates aparecem na estação **Márcio** (aguardando priorização/despacho).

---

## 2. Questões para Debate

### Q1 — Escopo do parsing do BACKLOG.md
Quais campos extrair de cada linha de backlog?
- **Mínimo:** `id` (HIVE-NNN), `titulo`, `status` (`[ ]`/`[x]`), `prioridade` (alta/media/dt)
- **Estendido:** `commit`, `data_conclusao`, `observacao` (texto após `—`)

### Q2 — Critério de visibilidade na esteira
Um item do backlog deve aparecer na esteira quando:
- **Opção A:** status `[ ]` e sem match em pipeline (FILA_*.md) nem em debates ativos
- **Opção B:** status `[ ]` sempre (mesmo que já tenha WO/debate — mostraria duplicata)
- **Opção C:** status `[ ]` e sem WO em execução (permitir debate ativo mas não WO em fila)

### Q3 — Estação e lane do item de backlog
Itens de backlog visíveis na esteira: qual estação e lane?
- **Opção A:** station `marcio`, lane `captura` — semanticamente correto (Owner decide o despacho)
- **Opção B:** station dinâmica baseada na prioridade — alta vai direto para `gemini` (triagem)

### Q4 — Onde expor no contrato da API
- **Opção A:** Incluir no campo `flowItems` já existente em `GET /api/hive/state` (zero breaking change, WebSocket push automático)
- **Opção B:** Endpoint dedicado `GET /api/hive/backlog` (separação limpa, mas sem WebSocket automático)

### Q5 — Itens `[x]` (concluídos) na esteira
- **Opção A:** Mostrar apenas os mais recentes (últimos 5) na estação Entrega
- **Opção B:** Não mostrar — SRs afirmados já cobrem essa visualização
- **Opção C:** Mostrar todos via toggle "histórico" no frontend

---

## 3. Parecer do Claude — DEBATE-035
**Data:** 2026-05-30
**Posição:** ✅ Aprovado com condição

**Q1 — Escopo:** Mínimo é suficiente para V1: `id`, `titulo`, `prioridade`, `status`. A `observacao` é útil mas pode vir em V2.

**Q2 — Critério de visibilidade:** Opção A. Mostrar apenas o que não tem representação — evita duplicata e mantém a esteira como visão de "onde cada item está agora".

**Q3 — Estação:** Opção A. `station: marcio, lane: captura` é semanticamente preciso — o item está na fila do Owner aguardando decisão. Prioridade não deve determinar estação automaticamente: seria uma decisão arquitetural que bypassa o Gemini (PO).

**Q4 — Contrato:** Opção A. `flowItems` já tem WebSocket push (chokidar monitora `beehive/`). Zero breaking change no frontend. `BACKLOG.md` só precisa ser adicionado ao array de arquivos monitorados.

**Q5 — Concluídos:** Opção B para V1. SRs afirmados já preenchem a estação Entrega. Adicionar itens `[x]` geraria ruído. Toggle "histórico" pode ser V2.

**Condição:** antes da WO, confirmar que o regex de parsing do BACKLOG.md cobre as três variantes de linha existentes:
- `- [ ] HIVE-NNN — titulo — nota`
- `- [x] HIVE-NNN — titulo (data) — ✅ commit`
- `- **DT-NNN** — titulo` (débito técnico — não expor na esteira)

**Pontos de atenção:**
- Filtrar `DT-*` — débitos técnicos não são itens de esteira
- O deduplicador precisa comparar por `id` normalizado (HIVE-NNN) contra `pipeline[].id` e `debates[].id`
- Monitoramento: adicionar `beehive/construcao/BACKLOG.md` ao watch do chokidar se ainda não estiver

**Divergência com outros agentes:** aguardando pareceres de Gemini e Copilot.

---

## 4. Parecer do Gemini (PO) — DEBATE-035
**Data:** 2026-05-30
**Posição:** ✅ Aprovado (GO!)

**Q1 — Escopo:** Mínimo (`id`, `titulo`, `status`, `prioridade`). Foco no estoque de intenções e visibilidade estratégica.
**Q2 — Critério de visibilidade:** Opção A. Mostrar apenas itens `[ ]` sem debate ou WO ativa para evitar redundância visual e refletir o "estado da arte" do fluxo.
**Q3 — Estação:** Opção A (`station: backlog`, `lane: captura`). Como a esteira foi expandida para 8 fases, esses itens devem alimentar a estação inicial (**Backlog / ⚡**).
**Q4 — Contrato:** Opção A (`flowItems`). Melhor caminho para integração rápida via WebSocket.
**Q5 — Concluídos:** Opção B. Não mostrar itens `[x]`; focar na energia do que está pendente.

**Visão Estratégica:** A integração transforma o `BACKLOG.md` no "pulmão" da fábrica, permitindo que o Márcio visualize o estoque de intenções antes mesmo de entrarem em rito formal de debate.

---

## 5. Parecer do Copilot — DEBATE-035
**Data:** 2026-05-30
**Posição:** ✅ Aprovado (GO)

**Q1 — Escopo:** parser regex é viável para V1 se separar explicitamente três casos: `- [ ] HIVE-*`, `- [x] HIVE-*` e `- **DT-*`.
Extrair só `id`, `titulo`, `status` e `prioridade`; `commit`/`data` podem ficar fora porque hoje a esteira só precisa de visibilidade operacional.

**Q4 — Contrato:** Opção A em `flowItems`. O backend já concentra a composição da esteira em `inferPhase()`, então backlog como quarta fonte encaixa sem breaking change.
O WebSocket também já observa `beehive/` inteiro em `getWatchPaths()` + `chokidar.watch(...)`; na prática o custo extra não é novo watch, é só mais um parse leve por refresh.

**Recomendação técnica:** deduplicar por `backlog_ref`/`id` normalizado (`HIVE-NNN`) contra debates e pipeline antes de inserir o item na lane `captura`.
`DT-*` deve ser filtrado na origem e não entrar em `flowItems`.

**Risco baixo:** o formato atual do `BACKLOG.md` é estável e pequeno; um parse linear por mudança é barato. Se o arquivo crescer muito, dá para evoluir depois para parser por seções/cache por mtime.

---

## 6. Consolidação / Veredito
*(aguardando todos os pareceres)*

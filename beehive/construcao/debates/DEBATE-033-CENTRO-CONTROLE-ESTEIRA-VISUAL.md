---
titulo: DEBATE-033 — Centro de Controle: Esteira Visual por Processo
tipo: UI / UX
status: aberto
data: 2026-05-29
responsavel: Claude (Arquiteto)
backlog_ref: HIVE-022
participantes:
  - Claude (Arquiteto)
  - Gemini (PO / Facilitador)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# 🗣️ DEBATE-033: Centro de Controle — Esteira Visual por Processo

## 📊 Status

| Participante | Parecer |
|---|---|
| Claude (Arquiteto) | [ ] |
| Gemini (PO) | [ ] |
| Gemini (Facilitador) | [ ] |
| Copilot (Engenheiro) | [ ] |
| Márcio (Owner) | ✅ — ideação aprovada 2026-05-29 |

**Fases:**
- [x] Abertura
- [ ] Parecer Gemini
- [ ] Parecer Claude
- [ ] Parecer Copilot
- [ ] Consolidação / Veredito
- [ ] Aprovação Márcio
- [ ] Work Orders despachadas
- [ ] Execução concluída

---

## 1. 🎯 Contexto e Motivação

**Origem:** Márcio identificou que o Centro de Controle exibe cards estáticos por agente — você vê o estado mas não sente o movimento do trabalho no tempo.

**Problema:** Não é possível enxergar visualmente onde cada item de trabalho está no fluxo, quem está segurando, e qual é a "fila" real do squad.

**Visão do Márcio:** Substituir (ou complementar) a visão de cards por agente por uma **esteira visual por processo**, onde cada lane representa um fluxo ativo e os cards se movem pelas fases conforme o trabalho avança.

---

## 2. 🖼️ Conceito Visual

```
Processo       │ Arquiteto │ Engenheiro │ Auditoria │ Gate  │ Concluído
───────────────┼───────────┼────────────┼───────────┼───────┼──────────
HIVE-016       │           │            │           │  ⏳   │
DEBATE-033     │    ⏳     │            │           │       │
DT-006         │           │    ⏳      │           │       │
SR-HIVE-015    │           │            │           │  ⏳   │
```

- Cada **linha** = um processo/item ativo
- Cada **coluna** = um papel/fase do fluxo Hive
- O **card** avança da esquerda para a direita conforme o trabalho progride
- Cor/ícone indica: quem está segurando, se está bloqueado, se está atrasado

---

## 3. ❓ Questões para debate

### 3.1 — Fonte de dados
Como alimentar o pipeline em tempo real? Opções:
- **A)** Ler o lock system (`hive-lock.json`) + inbox como proxy de estado
- **B)** Adicionar campo de fase explícito nas WOs/debates e expor via backend
- **C)** Híbrido: lock como estado corrente, inbox como histórico de transições

### 3.2 — Coexistência com a visão atual
- Substituir os cards de agente completamente?
- Manter como aba alternativa (toggle v1/v2 já existe)?
- A esteira vira a view padrão e os cards viram detalhe ao expandir?

### 3.3 — Granularidade dos processos
O que aparece como "linha" na esteira?
- Apenas itens do backlog ativos (HIVE-NNN)?
- Debates abertos também?
- Débitos técnicos?
- Tudo que tiver status ativo no sistema?

### 3.4 — Prompt de design (Claude AI Design)
Antes de escrever código, Márcio quer gerar um protótipo visual via prompt para Claude AI Design. Quem redige o prompt? Claude ou Gemini?

---

## 4. 📎 Referências
- `beehive/construcao/work_orders/HIVE-UI/WO-030-CENTRO-CONTROLE-V2.md` — V2 atual
- `apps/hive-ui/frontend/src/pages/CentroDeControle.tsx` — implementação vigente
- `beehive/construcao/debates/DEBATE-024-HIVE-WEB-UI-MVP.md` — contexto original da UI

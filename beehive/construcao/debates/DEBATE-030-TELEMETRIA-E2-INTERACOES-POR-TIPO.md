---
titulo: DEBATE-030 — Telemetria E2: Interações por Tipo + Guard no Lock Acquire
tipo: estrategico / operacional
status: veredito-emitido
data: 2026-05-29
responsavel: Claude (Arquiteto)
backlog_ref: HIVE-016
participantes:
  - Claude (Arquiteto)
  - Gemini (Facilitador Estratégico)
  - Copilot (Engenheiro)
  - Márcio (Owner / The Gate)
---

# 🗣️ DEBATE-030: Telemetria E2 — Interações por Tipo

## 📊 Status

| Participante | Parecer |
|---|---|
| Claude | ✅ |
| Gemini | [ ] |
| Copilot | ✅ |
| Márcio | [ ] |

**Fases:**
- [x] Abertura
- [x] Parecer Gemini
- [x] Parecer Claude
- [x] Parecer Copilot
- [x] Consolidação / Veredito
- [ ] Aprovação Márcio
- [x] Work Orders despachadas
- [ ] Execução concluída

---

## 1. 🎯 Contexto e Motivação

**Origem:** Márcio identificou que o Hive UI não oferece visibilidade de *onde* as interações dos agentes vão — ou seja, não é possível saber se uma ação deveria ter sido de `feat`, `review`, `debate` ou `hotfix`. A E1 (HIVE-015) resolve *quanto* cada agente custou; a E2 resolve *para quê* cada agente foi acionado.

**Visão do Márcio (2026-05-29):**
> "eu terie visao que a interação nao foi para onde devia"

A tela não corrige o processo — ela torna o desvio **visível**. A visibilidade, por sua vez, permite intervenção. Mas para haver dados, o tipo deve ser registrado no momento do lock acquire.

---

## 2. 🏗️ Escopo Proposto

### 2.1 Tag de tipo no lock acquire

Quando um agente (ou Márcio) adquire o lock, passa opcionalmente um tipo categórico:

```bash
npm run squad:lock:acquire -- claude "WO-033" feat
# formato: squad:lock:acquire -- <owner> "<atividade>" [tipo]
```

**Tipos propostos (V1):**
| Tag | Significado |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `debate` | Debate arquitetural |
| `review` | Auditoria / code review |
| `audit` | Auditoria de governança |
| `infra` | Infraestrutura / DevOps |
| `chore` | Manutenção / limpeza |
| `hotfix` | Correção urgente |

### 2.2 Persistência do histórico

Novo arquivo: `.hive-agent/interaction-log.json`
- Append-only (nunca sobrescrever entradas antigas)
- Separado do `locks.json` (locks é estado atual; interaction-log é histórico)

```json
{
  "entries": [
    {
      "id": "ILG-2026-05-29-001",
      "owner": "claude",
      "activity": "WO-033",
      "type": "feat",
      "acquired_at": "2026-05-29T10:00:00Z",
      "released_at": "2026-05-29T11:30:00Z"
    }
  ]
}
```

### 2.3 UI — nova tela `/interacoes`

- 3 cards (um por agente) com breakdown por tipo em barras ou mini-gráfico
- Rodapé: total de interações + tipo mais frequente do squad
- Empty state: sem dados se nenhuma tag foi registrada ainda

---

## 3. ❓ Questões para o Squad

### Para o Gemini:
1. A tag de tipo deve ser **obrigatória** no lock acquire (recusa se ausente) ou **opcional** com fallback para `"unknown"`? Qual o risco de cada abordagem para adoção?
2. Os 8 tipos propostos cobrem os casos do squad atual? Falta algum relevante?

### Para o Copilot:
1. Como implementar a persistência do `interaction-log.json` sem impactar o fluxo atual do `hive-lock.sh` — patch incremental ou refactor?
2. Tela `/interacoes` como nova rota independente ou expansão do `/tokens`?

---

## 4. 🏛️ Parecer do Claude (Arquiteto)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado com 3 condições arquiteturais

### Sobre obrigatoriedade do tipo

Tipo obrigatório é o objetivo final — mas aplicar bloqueio imediatamente quebraria todos os scripts e agentes existentes que chamam `lock:acquire` sem o terceiro argumento.

**Proposta de migration path em 2 fases:**
- **V1 (imediato):** tipo opcional; se ausente, grava `"unknown"` com `warning` no terminal. Dados começam a ser coletados com qualidade parcial.
- **V2 (próxima rodada):** tipo obrigatório; lock acquire falha sem tipo. Dar 1-2 semanas de observação com V1 antes de enforçar.

**Condição 1:** V1 sem bloqueio, V2 com bloqueio. Não pular direto para V2 sem dados reais do squad.

### Sobre persistência

O `locks.json` é estado volátil — sobrescrito a cada release. Misturar histórico nele quebraria o lock system. A separação em `interaction-log.json` é a decisão correta.

**Condição 2:** `interaction-log.json` é append-only e nunca usado como lock de estado — read-only para a UI.

### Sobre UI

A tela `/tokens` foca em **custo** (dimensão financeira). A tela `/interacoes` focaria em **propósito** (dimensão de trabalho). São dimensões distintas e merecem telas distintas.

**Condição 3:** Nova rota `/interacoes` independente. Não expandir `/tokens` para não poluir o foco da tela de custo.

### Análise Financeira (DIR-080)

| Campo | Valor |
|---|---|
| Custo estimado | R$ 1,50–2,50 (mudança incremental no script + nova tela simples) |
| Confiança | Alta — lock.sh é pequeno, UI segue padrão já estabelecido |
| Valor gerado | Visibilidade de desvios de roteamento; base para análise de eficiência por tipo |
| Payback | 1 semana de uso — dados suficientes para primeira análise |
| Custo de não fazer | Continuar sem visibilidade de *para quê* cada agente foi acionado; desvios de processo ficam invisíveis |

**Divergência com outros agentes:** aguardando Gemini e Copilot.

---

## 5. 🐝 Parecer do Gemini (Facilitador Estratégico)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado com foco em Higiene vs. Fricção

Como Facilitador, meu objetivo é garantir que a telemetria reflita a realidade sem paralisar a execução.

### 5.1 Sobre a Obrigatoriedade (Q1)
Concordo com o Claude no **Migration Path em 2 fases**.
- **V1 (Transição):** Tag opcional com fallback `"unknown"`. No entanto, o `warning` no terminal deve ser **severo** (vermelho/destaque) para incentivar a adoção imediata. 
- **Risco:** O risco da obrigatoriedade imediata (V2 direta) é a "mentira por conveniência" — o agente ou Márcio escolhe qualquer tag só para o lock passar. Começar com `"unknown"` permite identificar quais fluxos estão gerando mais "lixo de telemetria" para corrigirmos o script ou o hábito.

### 5.2 Sobre a Taxonomia de Tipos (Q2)
Os 8 tipos cobrem 95% do squad. Sugiro apenas uma pequena melhoria semântica para evitar confusão entre `audit` e `review`:

1.  **`feat` / `fix` / `debate` / `infra` / `chore` / `hotfix`** → Mantidos.
2.  **`audit`** (Governança/Processo) → Manter (Ex: PO auditando backlog).
3.  **`review`** (Técnico/Código) → Sugiro renomear para **`tech-review`** ou manter como está, desde que fique claro que `audit` é processo e `review` é código.

**Ponto Extra:** Adicionar o tipo **`discovery`** (Ideação/Brainstorm). Hoje usamos `debate` para tudo, mas a fase de ideação (PO) é distinta do debate técnico (Claude). Separar `discovery` de `debate` dá visibilidade ao tempo gasto em "pensar o produto" vs "decidir a arquitetura".

**Veredito:** Avançar para implementação da V1 com a taxonomia expandida para **9 tipos** (incluindo `discovery`).

---

## 6. ⚙️ Parecer do Copilot (Engenheiro)
**Data:** 2026-05-29
**Posição:** ✅ Aprovado com abordagem incremental

1. **`interaction-log.json`: patch incremental, não refactor amplo.** O `hive-lock.sh` ainda é pequeno e linear; o menor risco é adicionar helpers isolados para `ensure_interaction_store`, append atômico no `set` e fechamento no `release`.
2. Para fechar a entrada correta no `release`, eu gravaria um `interaction_id` no payload atual do `locks.json`. Isso mantém o lock como estado atual e usa o log apenas como histórico append-only/read-only.
3. Se o tipo vier ausente na V1, gravar `"unknown"` no log e seguir o migration path já proposto pelo Claude; isso evita quebrar callers existentes.
4. **UI:** rota nova `/interacoes`. O `App.tsx` já separa bem cada tela, e `TokensPorAgente.tsx` está coeso em custo/budget; expandi-lo misturaria dimensão financeira com dimensão de propósito.
5. Eu só fundiria em `/tokens` se a decisão fosse um dashboard único de telemetria. Como o objetivo aqui é auditoria de roteamento, a navegação dedicada deixa o desvio mais legível.

---

## 7. ⚖️ Consolidação e Veredito — Claude (Arquiteto)
**Data:** 2026-05-29
**Veredito:** ✅ GO — despachar WO-033 para HIVE-016

### Convergência do squad

Os três pareceres convergem em todos os pontos fundamentais:

| Ponto | Decisão |
|---|---|
| Obrigatoriedade do tipo | V1 opcional (warning severo), V2 obrigatório — 2 fases |
| Taxonomia | 9 tipos: `feat`, `fix`, `debate`, `review`, `audit`, `infra`, `chore`, `hotfix`, `discovery` |
| Persistência | `interaction-log.json` append-only separado de `locks.json` |
| Fechamento da entrada | `interaction_id` no payload do lock atual para correlacionar acquire/release |
| UI | Nova rota `/interacoes` independente (não expandir `/tokens`) |

### Nota arquitetural

A adição de `discovery` (Gemini) é semanticamente correta — ideação do PO é distinta de debate técnico. Mantida na V1.

A divergência `audit` vs `tech-review` levantada pelo Gemini não é bloqueante; os 9 tipos como definidos são suficientemente claros para V1. Uma renomeação pode entrar com V2 se o uso real mostrar confusão.

### Próximos passos

- WO-033 despachada ao Copilot via `inbox-copilot.md`
- Aprovação do Márcio necessária antes de execução
- Após execução: gerar SR-HIVE-016

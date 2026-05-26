# Template: Sessão de Planning Poker
# Status: aprovado

---

## Convenção de uso

- O registro oficial da sessão é um **comentário na própria issue do GitHub**.
- Nenhum arquivo local por issue — o GitHub é a fonte de verdade.
- O campo `Estimativa (SP)` no board só é preenchido **após** o comentário estar publicado com baseline aprovado.
- Para postar: `gh issue comment NNN --body "$(cat <<'EOF' ... EOF)"`
- Preferencia operacional: `npm run squad:planning:upsert -- --issue NNN --body-file /tmp/planning.md --marker "## 🃏 Planning Poker"`
- Antes de postar novo comentário, verificar os últimos comentários da issue para evitar duplicidade da mesma rodada.
- Se já existir comentário da rodada em andamento, atualizar o comentário existente em vez de publicar outro.
- Se ocorrer duplicidade por reexecução, manter apenas um comentário final da rodada e remover os demais.

---

## Bloco a postar como comentário na issue

```markdown
## 🃏 Planning Poker — #NNN

### Contexto da issue

**Objetivo:** <resultado esperado, em 1-2 frases>

**Escopo — entra:**
- ...

**Escopo — não entra:**
- ...

**Critérios de aceite:**
- [ ] ...

**Riscos e dependências:**
- ...

---

### Votos

> Escala: 1 · 2 · 3 · 5 · 8 · 13

| Participante | Voto (SP) | Risco principal |
|---|---|---|
| Usuário | — | |
| Copilot | — | |
| Claude | — | |

<!-- Se divergência > 2×, registrar debate abaixo e nova rodada -->

---

### Decisão final

**Baseline aprovado (SP):**
**Esforço estimado (dias úteis):**
**Risco consolidado:** baixo / médio / alto
**Premissas:**
- ...
**Responsável:**
**Aprovado pelo usuário em:** YYYY-MM-DD
```

---

## Gate antes de atualizar o board

- [ ] Contexto publicado e lido pelos 3 participantes
- [ ] Votos registrados na tabela acima
- [ ] Usuário aprovou o baseline
- [ ] `Estimativa (SP)` atualizado no GitHub Project

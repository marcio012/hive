# Ajustes nos Scripts do Trio
# Revisao: Claude — 2026-05-18
# Status: aguardando implementacao pelo Copilot

---

## Contexto

Scripts revisados durante validacao de robustez do handoff entre agentes.
Dois ajustes obrigatorios antes de retomar execucao de produto.

---

## Ajuste 1 — `planning-comment-upsert.sh`: alinhar marker com o template

**Problema:**
O marker default e `## Planning Poker`, mas o template aprovado em
`ai/construcao/TEMPLATE_PLANNING_POKER.md` usa `## 🃏 Planning Poker` (com emoji).
O `startswith()` vai falhar ao buscar comentarios existentes — nenhum update vai ocorrer,
apenas criacao de duplicatas.

**Correcao:**
Alterar o marker default do script para `## 🃏 Planning Poker`:
```bash
MARKER="## 🃏 Planning Poker"
```
Ou remover o emoji do template e padronizar sem emoji. Escolher um e aplicar nos dois lugares.

---

## Ajuste 2 — `trio-handoff-validate.sh`: task file ausente = warn, nao fail

**Problema:**
O script falha com `validate=fail` se `ai/construcao/tasks/task-NNN-context.md` nao existir.
Mas o arquivo de contexto e opcional — so obrigatorio para tasks com SP >= 5 ou complexidade alta
(definido em `ai/construcao/CONTEXTO_TASK_COMPARTILHADO.md`).
Para tasks simples, o validate sempre falhara sem motivo real.

**Correcao:**
Substituir o bloco de erro por um aviso:
```bash
# antes (linha 41-44):
if [[ ! -f "$TASK_FILE" ]]; then
  echo "validate=fail reason=task_context_missing ..." >&2
  exit 1
fi

# depois:
if [[ ! -f "$TASK_FILE" ]]; then
  echo "validate=warn reason=task_context_absent issue=${ACTIVE_ISSUE} (opcional para tasks simples)"
fi
```
O script deve continuar e retornar `validate=ok` mesmo sem o arquivo.

---

## O que NAO precisa mudar

- `trio-handoff-auto.sh` — aprovado sem ajustes
- `trio:planning:upsert` — logica aprovada, depende do Ajuste 1 para funcionar corretamente
- Integracao no `package.json` — aprovada

---

## Criterio de aceite

- [ ] Marker alinhado entre script e template (sem divergencia)
- [ ] `trio:handoff:validate` retorna `ok` para issues sem arquivo de contexto
- [ ] `trio:handoff:validate` retorna `warn` (nao `fail`) para task file ausente
- [ ] Rodar `npm run trio:handoff:validate` e confirmar `validate=ok` no estado atual

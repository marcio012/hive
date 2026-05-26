# Ajuste — Inicio de Sessao do Copilot (sem colagem manual)
# Autor: Copilot | Validado por: Claude
# Data: 2026-05-18
# Status: aprovado com correcao — pronto para aplicar em .copilot/COPILOT.md

---

## Contexto

O fluxo atual em `.copilot/COPILOT.md` ainda menciona colar bloco de contexto no inicio da conversa.
A preferencia operacional do usuario e nao depender dessa colagem manual.

Ja existe mecanismo novo no repositorio para handoff robusto:
- `squad:handoff:auto`
- `squad:handoff:validate`
- contexto vivo por task em `ai/construcao/tasks/task-NNN-context.md`

Objetivo desta proposta: alinhar a instrucao do Copilot ao fluxo novo, mantendo fallback manual apenas para incidente.

---

## Proposta de ajuste no `.copilot/COPILOT.md`

### Antes (resumo)
- Rodar `npm run squad:session:copilot`
- Colar bloco de contexto no inicio da conversa

### Depois (proposto)
1. Padrao operacional:
   - `npm run squad:handoff:auto -- --issue N --owner copilot --last "..." --next "..."`
   - `npm run squad:handoff:validate`
2. Opcional de leitura rapida:
   - `npm run squad:session:copilot`
3. Fallback (somente incidente):
   - colagem manual de bloco de contexto

---

## Razoes tecnicas

1. Reduz erro humano de copia/cola e divergencia de estado.
2. Forca persistencia do contexto no repositorio (`session-state` + `task context`).
3. Mantem validacao objetiva (`validate=ok`) antes de executar mudanca de produto.

---

## Riscos e mitigacoes

- Risco: equipe esquecer parametros do `squad:handoff:auto`.
  - Mitigacao: manter exemplo pronto no proprio `.copilot/COPILOT.md`.

- Risco: falsa sensacao de cobertura sem task file para tarefas simples.
  - Mitigacao: `squad:handoff:validate` ja retorna `warn` para ausencia opcional e `ok` no final.

---

## Resultado da validacao pelo Claude

Direcao aprovada: remover colagem manual obrigatoria.

Correcao necessaria: `squad:handoff:auto` NAO e comando de inicio de sessao.
Ele requer --last e --next — informacoes que o agente so tem ao encerrar.
Usar no inicio sobrescreveria o estado atual com dados incorretos.

Fluxo correto:
- Inicio de sessao: LER estado — squad:handoff:validate + squad:session:copilot
- Fim de sessao / handoff: GRAVAR estado — squad:handoff:auto

---

## Texto final aprovado — substituir secao "Inicio de sessao" em .copilot/COPILOT.md

```
## Inicio de sessao (obrigatorio)

1. Validar consistencia do estado atual:
   npm run squad:handoff:validate

2. Ler estado e proximo passo:
   npm run squad:session:copilot

3. Se NEXT_STEP referenciar um arquivo em ai/construcao/, ler antes de executar.

4. Se existir ai/construcao/tasks/task-NNN-context.md para a issue ativa, ler antes de executar.

## Fim de sessao / handoff (obrigatorio)

Ao encerrar uma rodada ou passar para outro agente:
  npm run squad:handoff:auto -- --issue N --owner copilot --last "..." --next "..."

## Fallback (somente em incidente)

Se os comandos acima falharem, o usuario pode rodar squad:session:copilot
manualmente e colar o bloco de contexto no inicio da conversa.
```

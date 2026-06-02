---
id: WO-053
titulo: Lock System — Márcio com --force e --delegate em hive-lock.sh
backlog_ref: HIVE-019
diretriz_ref: DIR-092
executor: Copilot
auditor: Claude
status: pendente
prioridade: media
data: 2026-05-31
---

# WO-053 — Lock System: --force e --delegate para Márcio

## 1. Contexto

DIR-092 definiu que Márcio é agente ativo com direitos especiais no sistema de lock:
soberania de override sobre qualquer agente e capacidade de delegar lock. O `marcio`
já é `AgentName` válido no orchestrator e o `hive-lock.sh` não tem VALID_OWNERS
restritivo — Márcio já pode adquirir lock normalmente. O que falta são as duas
operações especiais descritas na diretriz: `--force` e `--delegate`.

## 2. Arquivo alvo

`beehive/bin/hive-lock.sh`

## 3. Tarefas Técnicas

### 3.1 Parsing de flags

Adicionar parsing de flags após os argumentos posicionais. Inserir **antes** do bloco `case "$CMD"`:

```bash
# Parse de flags especiais
FORCE=false
DELEGATE_TO=""

_remaining_args=()
_i=1
for _arg in "${@:2}"; do
  case "$_arg" in
    --force)          FORCE=true ;;
    --delegate)       : ;;  # próximo arg é o agent — tratado no case do comando
    --delegate=*)     DELEGATE_TO="${_arg#--delegate=}" ;;
    *)                _remaining_args+=("$_arg") ;;
  esac
  _i=$((_i + 1))
done
```

Na prática, processar `--force` e `--delegate <agent>` como flags globais antes do `case`.
A lógica exata de extração dos args posicionais pode ser adaptada, desde que o comportamento
final seja o especificado em 3.2, 3.3 e 3.4.

### 3.2 Comando `set` com `--force`

Quando `--force` está presente E `OWNER=marcio`:
- Pular o bloco `if [[ "$CURRENT_OWNER" != "$OWNER" ]]` que retorna `LOCKED`
- Fechar a interação existente (se houver) antes de escrever a nova
- Escrever o novo lock normalmente

Saída esperada:
```
FORCE-LOCK: Márcio override de '<owner_anterior>' — Colmeia assumida por 'marcio'
```

Se `--force` for usado por qualquer owner que **não seja** `marcio`, retornar erro:
```
ERRO: --force é exclusivo do owner 'marcio'
```

### 3.3 Comando `release` com `--force`

Quando `--force` está presente E `OWNER=marcio`:
- Pular o bloco `if [[ "$CURRENT_OWNER" != "$OWNER" ]]` que retorna erro
- Fechar a interação existente do owner atual (não de marcio)
- Limpar o lock

Saída esperada:
```
FORCE-RELEASE: Márcio liberou lock de '<owner_anterior>'
```

Mesma restrição: `--force` só válido com `OWNER=marcio`.

### 3.4 Comando `delegate`

Novo comando: `hive lock delegate marcio <agent> "<activity>" [tipo]`

```
CMD="${1:-}"      → delegate
OWNER="${2:-}"    → marcio
DELEGATE_TO="${3:-}"  → agent de destino
EXTRA="${4:-}"    → activity
TYPE_ARG="${5:-}"
```

Comportamento:
1. Validar que `OWNER=marcio` (único owner válido para delegate)
2. Validar que `DELEGATE_TO` é um AgentName válido (`claude|copilot|gemini|copilot-hive|copilot-tos`)
3. Fechar a interação atual de marcio (se lock pertence a marcio)
4. Criar nova interação para `DELEGATE_TO` com `type=INTERACTION_TYPE`
5. Gravar lock com `owner=DELEGATE_TO` + campo extra `delegated_by: "marcio"` no JSON

O `write_lock` precisa aceitar um 5º argumento opcional `delegated_by`:

```bash
write_lock() {
  local owner="$1"
  local activity="$2"
  local acquired_at="$3"
  local interaction_id="$4"
  local delegated_by="${5:-}"

  if [[ -n "$delegated_by" ]]; then
    jq -n \
      --arg owner "$owner" \
      --arg activity "$activity" \
      --arg acquired_at "$acquired_at" \
      --arg interaction_id "$interaction_id" \
      --arg delegated_by "$delegated_by" \
      '{owner: $owner, activity: $activity, acquired_at: $acquired_at, interaction_id: $interaction_id, delegated_by: $delegated_by}' > "$LOCK_FILE"
  else
    # comportamento atual preservado
    jq -n \
      --arg owner "$owner" \
      --arg activity "$activity" \
      --arg acquired_at "$acquired_at" \
      --arg interaction_id "$interaction_id" \
      '{owner: $owner, activity: $activity, acquired_at: $acquired_at, interaction_id: $interaction_id}' > "$LOCK_FILE"
  fi
}
```

Saída esperada:
```
DELEGATE: Lock transferido de 'marcio' para '<agent>' [Atividade: <activity>]
```

### 3.5 Atualizar `usage()`

Adicionar ao bloco `usage()`:

```
  set <owner> "<activity>" [tipo] [--force]   --force: somente marcio, override de qualquer lock
  release <owner> [--force]                   --force: somente marcio, libera lock de qualquer agente
  delegate marcio <agent> "<activity>" [tipo] Transfere lock de marcio para agent
```

## 4. Casos de uso validados pelo executor

```bash
# 1. Márcio adquire lock (já funcionava — manter)
npm run squad:lock:acquire -- marcio "revisando hotfix"

# 2. Márcio força override em lock do Claude
npm run squad:lock:acquire -- marcio "hotfix urgente" --force

# 3. Márcio força liberação do lock do Copilot
bash beehive/bin/hive-lock.sh release marcio --force

# 4. Márcio delega lock para o Claude
bash beehive/bin/hive-lock.sh delegate marcio claude "implementar WO-054" feat
```

## 5. Restrições

- `--force` só aceito quando `OWNER=marcio`; qualquer outro owner retorna erro e exit 1
- `delegate` só aceito quando `OWNER=marcio`
- O campo `delegated_by` no `locks.json` é informativo — não bloqueia nem altera lógica de check/release
- Sem mudanças no orchestrator ou no Hive UI nesta WO

## 6. Análise Financeira

- Custo estimado: R$ 1,00–1,50 (script bash, sem dependências novas)
- Confiança: Alta — lógica existente é clara e bem estruturada
- Valor gerado: Márcio pode intervir em qualquer lock sem CLI manual; fluxo de override auditável
- Payback: Imediato — útil em qualquer sessão onde Márcio precise substituir um agente
- Custo de não fazer: Márcio precisa editar manualmente `locks.json` para override — frágil e não auditado

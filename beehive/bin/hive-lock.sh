#!/usr/bin/env bash
# beehive/bin/hive-lock.sh
# Gerencia trava operacional simples do squad com persistência em JSON.

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
LOCK_DIR="$PROJECT_PATH/.hive-agent"
LOCK_FILE="$LOCK_DIR/locks.json"
INTERACTION_LOG_FILE="$LOCK_DIR/interaction-log.json"
VALID_INTERACTION_TYPES=(feat fix debate review audit infra chore hotfix discovery)

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

usage() {
  echo -e "${YELLOW}Uso: hive lock <set|release|check|list> <owner> [activity|read|write]${NC}"
  echo "Comandos:"
  echo "  set <owner> \"<activity>\" [tipo]    Cria ou renova o lock para o owner."
  echo "  release <owner>              Libera o lock se o owner for o atual."
  echo "  check <owner> [read|write]   Verifica se o owner pode ler/escrever."
  echo "  list                         Exibe o lock atual."
  exit 1
}

ensure_jq() {
  if ! command -v jq >/dev/null 2>&1; then
    echo -e "${RED}ERRO: jq requerido${NC}"
    exit 1
  fi
}

ensure_store() {
  mkdir -p "$LOCK_DIR"

  if [[ ! -f "$LOCK_FILE" ]] || [[ ! -s "$LOCK_FILE" ]]; then
    echo '{}' > "$LOCK_FILE"
  fi
}

ensure_interaction_store() {
  mkdir -p "$LOCK_DIR"

  if [[ ! -f "$INTERACTION_LOG_FILE" ]] || [[ ! -s "$INTERACTION_LOG_FILE" ]]; then
    printf '{\n  "entries": []\n}\n' > "$INTERACTION_LOG_FILE"
    return
  fi

  if ! jq -e '.entries | arrays' "$INTERACTION_LOG_FILE" >/dev/null 2>&1; then
    local backup_file="$INTERACTION_LOG_FILE.corrupt.$(date -u '+%Y%m%dT%H%M%SZ')"
    cp "$INTERACTION_LOG_FILE" "$backup_file"
    echo -e "${RED}WARN: interaction-log.json inválido; backup salvo em $(basename "$backup_file") e store reinicializado.${NC}"
    printf '{\n  "entries": []\n}\n' > "$INTERACTION_LOG_FILE"
  fi
}

current_owner() {
  jq -r '.owner // empty' "$LOCK_FILE"
}

current_activity() {
  jq -r '.activity // empty' "$LOCK_FILE"
}

current_interaction_id() {
  jq -r '.interaction_id // empty' "$LOCK_FILE"
}

has_lock() {
  [[ -n "$(current_owner)" ]]
}

write_lock() {
  local owner="$1"
  local activity="$2"
  local acquired_at="$3"
  local interaction_id="$4"

  jq -n \
    --arg owner "$owner" \
    --arg activity "$activity" \
    --arg acquired_at "$acquired_at" \
    --arg interaction_id "$interaction_id" \
    '{owner: $owner, activity: $activity, acquired_at: $acquired_at, interaction_id: $interaction_id}' > "$LOCK_FILE"
}

clear_lock() {
  echo '{}' > "$LOCK_FILE"
}

is_valid_interaction_type() {
  local candidate="$1"
  local valid_type

  for valid_type in "${VALID_INTERACTION_TYPES[@]}"; do
    if [[ "$valid_type" == "$candidate" ]]; then
      return 0
    fi
  done

  return 1
}

normalize_interaction_type() {
  local raw_type="${1:-}"

  if [[ -z "$raw_type" ]]; then
    echo -e "${RED}WARN: tipo de interação ausente; registrando como 'unknown'.${NC}" >&2
    printf 'unknown'
    return
  fi

  local normalized="${raw_type,,}"
  if ! is_valid_interaction_type "$normalized"; then
    echo -e "${RED}ERRO: tipo inválido '$raw_type'. Tipos válidos: ${VALID_INTERACTION_TYPES[*]}${NC}" >&2
    exit 1
  fi

  printf '%s' "$normalized"
}

next_interaction_id() {
  local day_prefix
  local daily_count

  day_prefix="$(date -u '+%Y-%m-%d')"
  daily_count="$(jq -r --arg day "$day_prefix" '[.entries[] | select((.acquired_at // "") | startswith($day))] | length' "$INTERACTION_LOG_FILE")"

  printf 'ILG-%s-%03d' "$day_prefix" "$((daily_count + 1))"
}

append_interaction_entry() {
  local entry_json="$1"
  local tmp_file

  tmp_file="$(mktemp "$LOCK_DIR/interaction-log.json.tmp.XXXXXX")"
  if jq --argjson entry "$entry_json" '.entries += [$entry]' "$INTERACTION_LOG_FILE" > "$tmp_file"; then
    mv "$tmp_file" "$INTERACTION_LOG_FILE"
    return 0
  fi

  rm -f "$tmp_file"
  echo -e "${RED}ERRO: não foi possível registrar a interação no interaction-log.json.${NC}" >&2
  exit 1
}

close_interaction_entry() {
  local interaction_id="$1"
  local released_at="$2"
  local tmp_file

  if [[ -z "$interaction_id" ]]; then
    return 0
  fi

  if [[ ! -f "$INTERACTION_LOG_FILE" ]]; then
    return 0
  fi

  if ! jq -e --arg interaction_id "$interaction_id" '.entries | any(.id == $interaction_id)' "$INTERACTION_LOG_FILE" >/dev/null 2>&1; then
    echo -e "${YELLOW}WARN: interaction_id '$interaction_id' não encontrado no interaction-log.json; lock será liberado mesmo assim.${NC}" >&2
    return 0
  fi

  tmp_file="$(mktemp "$LOCK_DIR/interaction-log.json.tmp.XXXXXX")"
  if jq \
    --arg interaction_id "$interaction_id" \
    --arg released_at "$released_at" \
    '.entries |= map(if .id == $interaction_id and (.released_at == null or .released_at == "") then . + {released_at: $released_at} else . end)' \
    "$INTERACTION_LOG_FILE" > "$tmp_file"; then
    mv "$tmp_file" "$INTERACTION_LOG_FILE"
    return 0
  fi

  rm -f "$tmp_file"
  echo -e "${YELLOW}WARN: não foi possível fechar a interação '$interaction_id'; lock será liberado mesmo assim.${NC}" >&2
  return 0
}

ensure_jq
ensure_store
ensure_interaction_store

CMD="${1:-}"
OWNER="${2:-}"
EXTRA="${3:-}"
TYPE_ARG="${4:-}"

case "$CMD" in
  set)
    if [[ -z "$OWNER" || -z "$EXTRA" ]]; then
      usage
    fi

    INTERACTION_TYPE="$(normalize_interaction_type "$TYPE_ARG")"
    ACQUIRED_AT="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    INTERACTION_ID="$(next_interaction_id)"

    if has_lock; then
      CURRENT_OWNER="$(current_owner)"
      if [[ "$CURRENT_OWNER" != "$OWNER" ]]; then
        echo -e "${RED}LOCKED: Colmeia ocupada por '$CURRENT_OWNER'${NC}"
        echo -e "${RED}Atividade: $(current_activity)${NC}"
        exit 1
      fi

      close_interaction_entry "$(current_interaction_id)" "$ACQUIRED_AT"
    fi

    INTERACTION_ENTRY="$(jq -cn \
      --arg id "$INTERACTION_ID" \
      --arg owner "$OWNER" \
      --arg activity "$EXTRA" \
      --arg type "$INTERACTION_TYPE" \
      --arg acquired_at "$ACQUIRED_AT" \
      '{id: $id, owner: $owner, activity: $activity, type: $type, acquired_at: $acquired_at, released_at: null}')"
    append_interaction_entry "$INTERACTION_ENTRY"

    write_lock "$OWNER" "$EXTRA" "$ACQUIRED_AT" "$INTERACTION_ID"
    echo -e "${GREEN}LOCK: Colmeia assumida por '$OWNER' [Atividade: $EXTRA] [Tipo: $INTERACTION_TYPE] [Interaction: $INTERACTION_ID]${NC}"
    ;;

  release)
    if [[ -z "$OWNER" ]]; then
      usage
    fi

    if ! has_lock; then
      echo -e "${YELLOW}FREE: Colmeia já está livre${NC}"
      exit 0
    fi

    CURRENT_OWNER="$(current_owner)"
    if [[ "$CURRENT_OWNER" != "$OWNER" ]]; then
      echo -e "${RED}ERRO: Não é possível liberar lock de '$CURRENT_OWNER' sendo '$OWNER'${NC}"
      exit 1
    fi

    close_interaction_entry "$(current_interaction_id)" "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    clear_lock
    echo -e "${GREEN}RELEASE: Colmeia liberada por '$OWNER'${NC}"
    ;;

  check)
    if [[ -z "$OWNER" ]]; then
      usage
    fi

    MODE="${EXTRA:-read}"
    if [[ "$MODE" != "read" && "$MODE" != "write" ]]; then
      usage
    fi

    if ! has_lock; then
      if [[ "$MODE" == "write" ]]; then
        echo -e "${GREEN}FREE: Colmeia disponível para escrita${NC}"
      else
        echo -e "${GREEN}FREE: Colmeia livre${NC}"
      fi
      exit 0
    fi

    CURRENT_OWNER="$(current_owner)"
    if [[ "$CURRENT_OWNER" == "$OWNER" ]]; then
      echo -e "${GREEN}OWNED: Você possui o controle da colmeia${NC}"
      exit 0
    fi

    if [[ "$MODE" == "write" ]]; then
      echo -e "${RED}LOCKED: Colmeia ocupada por '$CURRENT_OWNER'${NC}"
    else
      echo -e "${YELLOW}BUSY: Colmeia sendo operada por '$CURRENT_OWNER'${NC}"
    fi
    exit 1
    ;;

  list)
    if has_lock; then
      cat "$LOCK_FILE"
    else
      echo '{}'
    fi
    ;;

  *)
    usage
    ;;
esac

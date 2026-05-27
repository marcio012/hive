#!/usr/bin/env bash
# beehive/bin/hive-lock.sh
# Gerencia trava operacional simples do squad com persistência em JSON.

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
LOCK_DIR="$PROJECT_PATH/.hive-agent"
LOCK_FILE="$LOCK_DIR/locks.json"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

usage() {
  echo -e "${YELLOW}Uso: hive lock <set|release|check|list> <owner> [activity|read|write]${NC}"
  echo "Comandos:"
  echo "  set <owner> \"<activity>\"    Cria ou renova o lock para o owner."
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

current_owner() {
  jq -r '.owner // empty' "$LOCK_FILE"
}

current_activity() {
  jq -r '.activity // empty' "$LOCK_FILE"
}

has_lock() {
  [[ -n "$(current_owner)" ]]
}

write_lock() {
  local owner="$1"
  local activity="$2"

  jq -n \
    --arg owner "$owner" \
    --arg activity "$activity" \
    --arg acquired_at "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \
    '{owner: $owner, activity: $activity, acquired_at: $acquired_at}' > "$LOCK_FILE"
}

clear_lock() {
  echo '{}' > "$LOCK_FILE"
}

ensure_jq
ensure_store

CMD="${1:-}"
OWNER="${2:-}"
EXTRA="${3:-}"

case "$CMD" in
  set)
    if [[ -z "$OWNER" || -z "$EXTRA" ]]; then
      usage
    fi

    if has_lock; then
      CURRENT_OWNER="$(current_owner)"
      if [[ "$CURRENT_OWNER" != "$OWNER" ]]; then
        echo -e "${RED}LOCKED: Colmeia ocupada por '$CURRENT_OWNER'${NC}"
        echo -e "${RED}Atividade: $(current_activity)${NC}"
        exit 1
      fi
    fi

    write_lock "$OWNER" "$EXTRA"
    echo -e "${GREEN}LOCK: Colmeia assumida por '$OWNER' [Atividade: $EXTRA]${NC}"
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

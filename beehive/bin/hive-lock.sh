#!/usr/bin/env bash
# hive/bin/hive-lock.sh
# Gerencia travas de arquivos para evitar colisões entre agentes

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"

LOCK_FILE="$PROJECT_PATH/.hive-agent/locks.json"
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

usage() {
  echo -e "${YELLOW}Uso: hive lock <comando> [arquivo] --agent [nome]${NC}"
  echo "Comandos:"
  echo "  set      Trava um arquivo para um agente"
  echo "  release  Libera a trava de um arquivo"
  echo "  list     Mostra todas as travas ativas"
  echo "  check    Verifica se um arquivo está travado"
  exit 1
}

# Inicializa o arquivo de locks se não existir
mkdir -p "$PROJECT_PATH/.hive-agent"
if [[ ! -f "$LOCK_FILE" ]]; then
  echo "{}" > "$LOCK_FILE"
fi

CMD=${1:-""}
FILE=${2:-""}
AGENT=${4:-"unknown"} # Assume que --agent [nome] é passado

case "$CMD" in
  set)
    if [[ -z "$FILE" ]]; then usage; fi
    # Verifica se já existe trava
    HAVE_LOCK=$(grep -c "\"$FILE\"" "$LOCK_FILE" || true)
    if [[ "$HAVE_LOCK" -gt 0 ]]; then
      CURRENT_OWNER=$(grep -A 1 "\"$FILE\"" "$LOCK_FILE" | grep "owner" | cut -d'"' -f4)
      echo -e "${RED}Erro: Arquivo '$FILE' já está travado por '$CURRENT_OWNER'${NC}"
      exit 1
    fi
    # Adiciona trava (Lógica simplificada para MVP)
    # Em produção usaríamos um parser JSON real como 'jq'
    echo "Agente $AGENT travou $FILE"
    # Placeholder para persistência real
    ;;

  list)
    echo -e "${YELLOW}=== TRAVAS ATIVAS ===${NC}"
    cat "$LOCK_FILE"
    ;;

  release)
    if [[ -z "$FILE" ]]; then usage; fi
    echo -e "${GREEN}Trava liberada para $FILE${NC}"
    # Lógica de remoção...
    ;;

  check)
    if [[ -z "$FILE" ]]; then usage; fi
    HAVE_LOCK=$(grep -c "\"$FILE\"" "$LOCK_FILE" || true)
    if [[ "$HAVE_LOCK" -gt 0 ]]; then
      echo "LOCKED"
    else
      echo "FREE"
    fi
    ;;

  *) usage ;;
esac

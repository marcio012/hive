#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
STATE_FILE="$PROJECT_PATH/.hive-agent/session-state.env"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
  echo -e "${YELLOW}Uso: npm run squad:next -- <numero>${NC}"
  echo "Exemplo: npm run squad:next -- 1"
  exit 1
}

if [[ $# -lt 1 ]]; then
  usage
fi

ITEM_NUMBER="$1"
if [[ ! "$ITEM_NUMBER" =~ ^[0-9]+$ ]]; then
  echo -e "${RED}Erro: o item do Plano de Voo deve ser um numero.${NC}"
  exit 1
fi

if [[ ! -f "$STATE_FILE" ]]; then
  echo -e "${YELLOW}Plano de Voo não encontrado. Rode npm run gemini:coordenador primeiro.${NC}"
  exit 1
fi

NEXT_AGENT_KEY="NEXT_${ITEM_NUMBER}_AGENT"
NEXT_TASK_KEY="NEXT_${ITEM_NUMBER}_TASK"
NEXT_REF_KEY="NEXT_${ITEM_NUMBER}_REF"
NEXT_REFERENCE_KEY="NEXT_${ITEM_NUMBER}_REFERENCE"

set +u
source "$STATE_FILE"
set -u

NEXT_AGENT="${!NEXT_AGENT_KEY:-}"
NEXT_TASK="${!NEXT_TASK_KEY:-}"
NEXT_REF="${!NEXT_REF_KEY:-${!NEXT_REFERENCE_KEY:-}}"

if [[ -z "$NEXT_AGENT" || -z "$NEXT_TASK" ]]; then
  echo -e "${YELLOW}Plano de Voo não encontrado. Rode npm run gemini:coordenador primeiro.${NC}"
  exit 1
fi

case "$NEXT_AGENT" in
  claude|copilot|gemini) ;;
  *)
    echo -e "${RED}Erro: agente invalido no Plano de Voo: $NEXT_AGENT${NC}"
    exit 1
    ;;
esac

mkdir -p "$(dirname "$STATE_FILE")"
TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

grep -Ev '^CURRENT_(ITEM|AGENT|TASK|REF)=' "$STATE_FILE" > "$TMP_FILE" || true
{
  echo "CURRENT_ITEM=\"$ITEM_NUMBER\""
  echo "CURRENT_AGENT=\"$NEXT_AGENT\""
  echo "CURRENT_TASK=\"$NEXT_TASK\""
  if [[ -n "$NEXT_REF" ]]; then
    echo "CURRENT_REF=\"$NEXT_REF\""
  fi
} >> "$TMP_FILE"
mv "$TMP_FILE" "$STATE_FILE"

echo -e "${BLUE}=== SQUAD NEXT — ITEM $ITEM_NUMBER ===${NC}"
echo -e "Agente    : ${GREEN}$NEXT_AGENT${NC}"
echo "Tarefa    : $NEXT_TASK"
if [[ -n "$NEXT_REF" ]]; then
  echo "Referencia: $NEXT_REF"
fi
echo "===================================="

exec npm run --silent "hive:session:$NEXT_AGENT"

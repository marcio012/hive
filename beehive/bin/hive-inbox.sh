#!/usr/bin/env bash
# hive/bin/hive-inbox.sh
# Lê o inbox do agente e lista tarefas pendentes

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"

AGENT_NAME=${1:-"gemini"}
INBOX_FILE="$HIVE_HOME/beehive/construcao/inbox-$AGENT_NAME.md"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== HIVE INBOX — $AGENT_NAME ===${NC}"

if [[ ! -f "$INBOX_FILE" ]]; then
  echo -e "${RED}Erro: Arquivo de inbox não encontrado em $INBOX_FILE${NC}"
  exit 1
fi

echo -e "${BLUE}Pendências em $(basename "$INBOX_FILE"):${NC}"

# Procura por entradas iniciadas por `###` e filtra as que estão pendentes
PENDING_OUTPUT="$(
  awk '
    function flush_entry() {
      if (capturing && pending) {
        print "---"
        print entry
      }
      entry = ""
      pending = 0
      capturing = 0
    }

    /^### / {
      flush_entry()
      entry = $0
      capturing = 1
      next
    }

    capturing {
      entry = entry ORS $0
      if (tolower($0) ~ /^\*\*status:\*\*[[:space:]]*pendente/ || tolower($0) ~ /^status:[[:space:]]*pendente/) {
        pending = 1
      }
    }

    END {
      flush_entry()
    }
  ' "$INBOX_FILE" | sed '/^[[:space:]]*$/d'
)"

if [[ -n "$PENDING_OUTPUT" ]]; then
  printf '%s\n' "$PENDING_OUTPUT"
else
  echo "  (Nenhuma tarefa pendente)"
fi

echo -e "\n===================================="

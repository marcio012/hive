#!/usr/bin/env bash
# hive/bin/hive-inbox.sh
# Lê o inbox do agente e lista tarefas pendentes

set -euo pipefail

# Variáveis injetadas pelo hive.sh principal:
HIVE_HOME="${HIVE_HOME:-$(pwd)}"
PROJECT_PATH="${PROJECT_PATH:-$(pwd)}"

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

# Procura por blocos que contenham 'pendente' (case-insensitive)
# Usa RS para separar por '---' e filtra blocos com 'pendente'
awk -v RS='---' 'tolower($0) ~ /status: pendente/ { print "---" $0 }' "$INBOX_FILE" | grep -E "^### |[Ss]tatus: " || echo "  (Nenhuma tarefa pendente)"

echo -e "\n===================================="

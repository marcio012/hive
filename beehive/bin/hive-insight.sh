#!/usr/bin/env bash
# hive/bin/hive-insight.sh
# Captura insights e anexa ao buffer global

set -euo pipefail

# Variáveis injetadas pelo hive.sh principal:
HIVE_HOME="${HIVE_HOME:-$(pwd)}"
BUFFER_FILE="$HIVE_HOME/beehive/construcao/insights-buffer.md"

INSIGHT=$1
TAGS=${2:-""}

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

if [[ -z "$INSIGHT" ]]; then
  echo -e "${YELLOW}Uso: hive insight \"descricao do insight\" \"#tags\"${NC}"
  exit 1
fi

TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
ENTRY="- [$TIMESTAMP] $INSIGHT $TAGS"

# Insere no topo do buffer (após o header)
# Procura a linha com 'insights abaixo' e insere logo depois
sed -i "/insights abaixo/a $ENTRY" "$BUFFER_FILE"

echo -e "${GREEN}Insight capturado com sucesso!${NC}"
echo "  $ENTRY"

#!/usr/bin/env bash
#
# hive/bin/hive-po-demand.sh
# Abre novas demandas do PO no backlog do Hive.

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
BACKLOG_FILE="$HIVE_HOME/beehive/construcao/BACKLOG.md"
TMP_FILE=""

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

cleanup() {
  if [[ -n "$TMP_FILE" && -f "$TMP_FILE" ]]; then
    rm -f "$TMP_FILE"
  fi
}

trap cleanup EXIT

if [[ ! -f "$BACKLOG_FILE" ]]; then
  echo -e "${RED}Erro: backlog não encontrado em $BACKLOG_FILE${NC}"
  exit 1
fi

last_number=$(grep -oE '#[0-9]{3}' "$BACKLOG_FILE" | tr -d '#' | sort -n | tail -1 || true)
last_number=${last_number:-000}
next_number=$(printf '%03d' "$((10#$last_number + 1))")

read -r -p "Título da demanda: " title
title=$(printf '%s' "$title" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')

if [[ -z "$title" ]]; then
  echo -e "${RED}Erro: título não pode ficar vazio${NC}"
  exit 1
fi

read -r -p "Prioridade? [1=Alta / 2=Média / 3=Baixa]: " priority

case "$priority" in
  1) section='## 🔴 Alta prioridade' ;;
  2) section='## 🟡 Média prioridade' ;;
  3) section='## 🟢 Baixa prioridade / Ideias' ;;
  *)
    echo -e "${RED}Erro: prioridade inválida. Use 1, 2 ou 3.${NC}"
    exit 1
    ;;
esac

if grep -Fq "— $title" "$BACKLOG_FILE"; then
  echo -e "${YELLOW}Aviso: já existe uma demanda com este título no backlog.${NC}"
  exit 0
fi

entry="- [ ] #$next_number — $title"
TMP_FILE=$(mktemp)

if ! awk -v section="$section" -v entry="$entry" '
  $0 == section {
    print
    print entry
    inserted=1
    next
  }
  { print }
  END { exit inserted ? 0 : 1 }
' "$BACKLOG_FILE" > "$TMP_FILE"; then
  echo -e "${RED}Erro: seção de prioridade não encontrada no backlog${NC}"
  exit 1
fi

mv "$TMP_FILE" "$BACKLOG_FILE"
TMP_FILE=""

echo -e "${GREEN}✅ Demanda #$next_number adicionada ao backlog${NC}"

#!/usr/bin/env bash
# beehive/bin/hive-inbox.sh
# Escaneia inboxes e debates abertos, mostrando apenas pendencias reais.

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
INBOX_DIR="$PROJECT_PATH/beehive/construcao"
DEBATES_DIR="$INBOX_DIR/debates"
TARGET_AGENT="${1:-}"
LINT_SCRIPT="$ROOT_DIR/scripts/inbox-lint.js"
PENDING_SCRIPT="$ROOT_DIR/scripts/inbox-pending.js"
ARCHIVE_SCRIPT="$ROOT_DIR/scripts/inbox-archive.js"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

extract_pending_inbox_entries() {
  local file="$1"
  node "$PENDING_SCRIPT" "$file"
}

debate_pending_for_agent() {
  local file="$1"
  local agent_label="$2"

  awk -v agent_label="$agent_label" '
    BEGIN {
      is_open = 1
      has_question = 0
      has_parecer = 0
      debate_id = ""
      title = ""
    }

    /^status:/ {
      status_line = tolower($0)
      is_open = (status_line ~ /aberto/ || status_line ~ /open/ || status_line ~ /pendente/)
    }

    /^titulo:/ {
      title = $0
      sub(/^titulo:[[:space:]]*/, "", title)
    }

    debate_id == "" && /DEBATE-[0-9]+/ {
      if (match($0, /DEBATE-[0-9]+/)) {
        debate_id = substr($0, RSTART, RLENGTH)
      }
    }

    {
      lowered = tolower($0)
      agent_lower = tolower(agent_label)

      if ((lowered ~ /para o/ || lowered ~ /quest/) && lowered ~ agent_lower) {
        has_question = 1
      }

      if (lowered ~ /parecer do/ &&
          lowered ~ agent_lower &&
          lowered !~ /aguardo parecer/ &&
          lowered !~ /nao consultado/ &&
          lowered !~ /não consultado/) {
        has_parecer = 1
      }
    }

    END {
      if (is_open && has_question && !has_parecer) {
        printf "%s\t%s\n", debate_id, title
      }
    }
  ' "$file"
}

echo -e "${YELLOW}=== HIVE INBOX SCANNER ===${NC}"

if [[ -f "$LINT_SCRIPT" ]]; then
  node "$LINT_SCRIPT" || true
  echo
fi

if [[ -f "$ARCHIVE_SCRIPT" ]]; then
  ARCHIVE_ARGS=(--quiet)
  if [[ -n "$TARGET_AGENT" ]]; then
    ARCHIVE_ARGS+=("$TARGET_AGENT")
  fi
  ARCHIVE_REPORT="$(node "$ARCHIVE_SCRIPT" "${ARCHIVE_ARGS[@]}" || true)"
  if [[ -n "$ARCHIVE_REPORT" ]]; then
    printf '%s\n\n' "$ARCHIVE_REPORT"
  fi
fi

shopt -s nullglob
FILES=("$INBOX_DIR"/inbox-*.md)
shopt -u nullglob

if (( ${#FILES[@]} == 0 )); then
  echo -e "${RED}Nenhum arquivo de inbox encontrado em $INBOX_DIR${NC}"
  exit 1
fi

TOTAL_PENDING=0

for FILE in "${FILES[@]}"; do
  AGENT="$(basename "$FILE" | sed 's/inbox-\(.*\)\.md/\1/')"

  if [[ -n "$TARGET_AGENT" && "$AGENT" != "$TARGET_AGENT" ]]; then
    continue
  fi

  echo -e "\n${BLUE}Agente: ${AGENT}${NC}"

  PENDING_TASKS="$(extract_pending_inbox_entries "$FILE")"
  DEBATE_ALERTS=""

  shopt -s nullglob
  for debate_file in "$DEBATES_DIR"/DEBATE-*.md; do
    debate_info="$(debate_pending_for_agent "$debate_file" "$AGENT")"

    if [[ -z "$debate_info" ]]; then
      continue
    fi

    debate_id="${debate_info%%$'\t'*}"
    debate_title="${debate_info#*$'\t'}"

    if [[ -n "$debate_id" ]] && grep -Fqi "$debate_id" "$FILE"; then
      continue
    fi

    DEBATE_ALERTS+="  [${debate_id:-DEBATE}] ${debate_title} (parecer pendente em debate; sem inbox materializado)"$'\n'
  done
  shopt -u nullglob

  if [[ -n "$PENDING_TASKS" ]]; then
    echo "$PENDING_TASKS"
    COUNT=$(printf '%s\n' "$PENDING_TASKS" | grep -c "^  \[" || true)
    TOTAL_PENDING=$((TOTAL_PENDING + COUNT))
  fi

  if [[ -n "$DEBATE_ALERTS" ]]; then
    echo -e "  ${YELLOW}Pendências vindas de debates abertos:${NC}"
    printf '%s' "$DEBATE_ALERTS"
    COUNT=$(printf '%s' "$DEBATE_ALERTS" | grep -c "^  \[" || true)
    TOTAL_PENDING=$((TOTAL_PENDING + COUNT))
  fi

  if [[ -z "$PENDING_TASKS" && -z "$DEBATE_ALERTS" ]]; then
    echo -e "  ${GREEN}(Tudo limpo)${NC}"
  fi
done

echo -e "\n${YELLOW}Total de pendências: $TOTAL_PENDING${NC}"
echo -e "===================================="

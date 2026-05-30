#!/usr/bin/env bash
# beehive/bin/hive-inbox.sh
# Escaneia inboxes e debates abertos, mostrando apenas pendencias reais.

set -euo pipefail

HIVE_HOME="${HIVE_HOME:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
INBOX_DIR="$PROJECT_PATH/beehive/construcao"
DEBATES_DIR="$INBOX_DIR/debates"
COMMAND="${1:-scan}"
TARGET_AGENT="${1:-}"
LINT_SCRIPT="$HIVE_HOME/scripts/inbox-lint.js"
PENDING_SCRIPT="$HIVE_HOME/scripts/inbox-pending.js"
ARCHIVE_SCRIPT="$HIVE_HOME/scripts/inbox-archive.js"
FAIXA_A_SCRIPT="$HIVE_HOME/scripts/inbox-faixa-a.js"
SESSION_STATE_FILE="$PROJECT_PATH/.hive-agent/session-state.env"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

extract_pending_inbox_entries() {
  local file="$1"
  node "$PENDING_SCRIPT" "$file"
}

resolve_copilot_target() {
  local legacy_inbox="$INBOX_DIR/inbox-copilot.md"
  local hive_inbox="$INBOX_DIR/inbox-copilot-hive.md"
  local tos_inbox="$INBOX_DIR/inbox-copilot-tos.md"
  local configured_target=""
  local project_name

  if [[ -f "$SESSION_STATE_FILE" ]]; then
    configured_target="$(grep -E '^COPILOT_ACTIVE_INBOX=' "$SESSION_STATE_FILE" | head -1 | cut -d'"' -f2 || true)"
    if [[ "$configured_target" == "copilot-hive" && -f "$hive_inbox" ]]; then
      printf '%s' "$configured_target"
      return
    fi
    if [[ "$configured_target" == "copilot-tos" && -f "$tos_inbox" ]]; then
      printf '%s' "$configured_target"
      return
    fi
  fi

  if [[ -f "$hive_inbox" && ! -f "$tos_inbox" ]]; then
    printf '%s' "copilot-hive"
    return
  fi
  if [[ -f "$tos_inbox" && ! -f "$hive_inbox" ]]; then
    printf '%s' "copilot-tos"
    return
  fi

  project_name="$(basename "$PROJECT_PATH" | tr '[:upper:]' '[:lower:]')"
  if [[ "$project_name" == "hive" && -f "$hive_inbox" ]]; then
    printf '%s' "copilot-hive"
    return
  fi
  if [[ "$project_name" == "tenantos" && -f "$tos_inbox" ]]; then
    printf '%s' "copilot-tos"
    return
  fi
  if [[ -f "$hive_inbox" ]]; then
    printf '%s' "copilot-hive"
    return
  fi
  if [[ -f "$tos_inbox" ]]; then
    printf '%s' "copilot-tos"
    return
  fi
  if [[ -f "$legacy_inbox" ]]; then
    printf '%s' "copilot"
    return
  fi

  printf '%s' "copilot"
}

normalize_target_agent() {
  local target="$1"

  if [[ "$target" == "copilot" ]]; then
    resolve_copilot_target
    return
  fi

  printf '%s' "$target"
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

case "$COMMAND" in
  archive-faixa-a|archive-dry-run)
    TARGET_AGENT="${2:-}"
    if [[ -z "$TARGET_AGENT" ]]; then
      echo -e "${RED}Uso: bash beehive/bin/hive-inbox.sh ${COMMAND} <agente>${NC}"
      exit 1
    fi
    TARGET_AGENT="$(normalize_target_agent "$TARGET_AGENT")"

    if [[ ! -f "$FAIXA_A_SCRIPT" ]]; then
      echo -e "${RED}Script de Faixa A não encontrado: $FAIXA_A_SCRIPT${NC}"
      exit 1
    fi

    if [[ "$COMMAND" == "archive-dry-run" ]]; then
      node "$FAIXA_A_SCRIPT" --dry-run "$TARGET_AGENT"
    else
      node "$FAIXA_A_SCRIPT" --write "$TARGET_AGENT"
    fi
    exit $?
    ;;
  scan)
    TARGET_AGENT=""
    ;;
  *)
    TARGET_AGENT="$(normalize_target_agent "${1:-}")"
    COMMAND="scan"
    ;;
esac

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

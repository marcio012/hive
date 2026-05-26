#!/usr/bin/env bash
# Hook Stop do Claude Code — salva session_id para retomada sem re-consumo de tokens.
# Portavel: escreve em .claude/last-session.txt (sempre presente).
# Opcional: atualiza .agile-squad/session-state.env se existir (projeto com squad).
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
CLAUDE_DIR="$ROOT_DIR/.claude"
SESSION_FILE="$CLAUDE_DIR/last-session.txt"
SESSION_STATE_FILE="$ROOT_DIR/.agile-squad/session-state.env"

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty' 2>/dev/null)

[ -z "$SESSION_ID" ] && exit 0

{
  echo "CLAUDE_SESSION_ID=${SESSION_ID}"
  echo "CLAUDE_RESUME_CMD=claude --resume ${SESSION_ID}"
  echo "CLAUDE_CONTINUE_CMD=claude --continue"
  echo "SAVED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
} > "$SESSION_FILE"

# Atualiza session-state.env somente se existir (projeto com squad)
if [ -f "$SESSION_STATE_FILE" ]; then
  if grep -q "^CLAUDE_SESSION_ID=" "$SESSION_STATE_FILE" 2>/dev/null; then
    sed -i "s|^CLAUDE_SESSION_ID=.*|CLAUDE_SESSION_ID=\"${SESSION_ID}\"|" "$SESSION_STATE_FILE"
  else
    echo "CLAUDE_SESSION_ID=\"${SESSION_ID}\"" >> "$SESSION_STATE_FILE"
  fi
fi

#!/usr/bin/env bash
# Hook Stop — loga custo da sessão Claude automaticamente na telemetria do Hive.
# Lê o transcript JSONL, soma tokens novos desde o último checkpoint,
# e registra em beehive/registry/telemetria/custos.log.
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TELEMETRY_SCRIPT="$ROOT_DIR/beehive/bin/hive-telemetry.sh"
CLAUDE_DIR="$ROOT_DIR/.claude"
STATE_FILE="$CLAUDE_DIR/telemetry-state.json"

command -v python3 >/dev/null 2>&1 || exit 0
command -v jq     >/dev/null 2>&1 || exit 0

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty' 2>/dev/null)
[ -z "$SESSION_ID" ] && exit 0

# Monta o path do transcript: ~/.claude/projects/<project-slug>/<session_id>.jsonl
PROJECT_SLUG=$(echo "$ROOT_DIR" | tr '/' '-')
TRANSCRIPT="$HOME/.claude/projects/$PROJECT_SLUG/${SESSION_ID}.jsonl"

# Usa transcript_path do payload como alternativa (se disponível)
TRANSCRIPT_FROM_PAYLOAD=$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null)
[ -n "$TRANSCRIPT_FROM_PAYLOAD" ] && [ -f "$TRANSCRIPT_FROM_PAYLOAD" ] && \
  TRANSCRIPT="$TRANSCRIPT_FROM_PAYLOAD"

[ -f "$TRANSCRIPT" ] || exit 0

# Lê o checkpoint (número de linhas já processadas nesta sessão)
LAST_LINE=0
if [ -f "$STATE_FILE" ]; then
  LAST_LINE=$(jq -r --arg sid "$SESSION_ID" '.[$sid].last_line // 0' "$STATE_FILE" 2>/dev/null || echo 0)
fi

# Processa o JSONL — soma tokens das mensagens novas
RESULT=$(python3 - "$TRANSCRIPT" "$LAST_LINE" <<'PYEOF'
import sys, json

transcript_path, start_line_str = sys.argv[1], sys.argv[2]
start_line = int(start_line_str)

total_input = 0
total_output = 0
model = "claude-sonnet-4-6"
current_line = 0

with open(transcript_path) as f:
    for line_num, raw in enumerate(f):
        current_line = line_num + 1
        if line_num < start_line:
            continue
        try:
            entry = json.loads(raw.strip())
            if entry.get("type") == "assistant":
                msg = entry.get("message", {})
                usage = msg.get("usage", {})
                # Cache read é ~10x mais barato — pesa 10%
                total_input += usage.get("input_tokens", 0)
                total_input += usage.get("cache_creation_input_tokens", 0)
                total_input += usage.get("cache_read_input_tokens", 0) // 10
                total_output += usage.get("output_tokens", 0)
                if msg.get("model"):
                    model = msg["model"]
        except Exception:
            pass

print(f"{total_input}|{total_output}|{model}|{current_line}")
PYEOF
2>/dev/null) || exit 0

IFS='|' read -r tokens_in tokens_out model new_line <<< "$RESULT"

[ "${tokens_in:-0}" -eq 0 ] && [ "${tokens_out:-0}" -eq 0 ] && exit 0

# Custo estimado em BRL (Sonnet: $3/1M in, $15/1M out, câmbio ~5x)
custo_raw=$(echo "scale=10; ($tokens_in * 0.000015) + ($tokens_out * 0.000075)" | bc 2>/dev/null || echo "0")
custo=$(printf "%.4f" "$custo_raw" 2>/dev/null || echo "0.0000")

bash "$TELEMETRY_SCRIPT" "Claude Arquiteto" "$model" "$tokens_in" "$tokens_out" "$custo" >/dev/null 2>&1

# Atualiza checkpoint para a próxima rodada
mkdir -p "$CLAUDE_DIR"
if [ -f "$STATE_FILE" ]; then
  TMP=$(mktemp)
  jq --arg sid "$SESSION_ID" --argjson line "$new_line" '.[$sid] = {"last_line": $line}' "$STATE_FILE" > "$TMP"
  mv "$TMP" "$STATE_FILE"
else
  echo "{\"$SESSION_ID\": {\"last_line\": $new_line}}" > "$STATE_FILE"
fi

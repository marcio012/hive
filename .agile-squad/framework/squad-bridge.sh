#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_PATHS_SCRIPT="$ROOT_DIR/.agile-squad/framework/hive-paths.sh"

if [[ -n "${HIVE_HOME:-}" && -f "${HIVE_HOME%/}/.agile-squad/framework/hive-paths.sh" ]]; then
  HIVE_PATHS_SCRIPT="${HIVE_HOME%/}/.agile-squad/framework/hive-paths.sh"
elif [[ -n "${HIVE_HOME:-}" && -f "$(dirname "${HIVE_HOME%/}")/.agile-squad/framework/hive-paths.sh" ]]; then
  HIVE_PATHS_SCRIPT="$(dirname "${HIVE_HOME%/}")/.agile-squad/framework/hive-paths.sh"
fi

if [[ ! -f "$HIVE_PATHS_SCRIPT" ]]; then
  echo "Erro: helper de paths do Hive não encontrado em $HIVE_PATHS_SCRIPT"
  exit 1
fi

# shellcheck disable=SC1090
source "$HIVE_PATHS_SCRIPT"
resolve_hive_paths "$ROOT_DIR"

AGENT_NAME="${1:-copilot}"

exec bash "$BEEHIVE_PATH/bin/hive-session-start.sh" "$AGENT_NAME"

#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK_HELPER="$SCRIPT_DIR/../../.agile-squad/framework/hive-paths.sh"

if [[ ! -f "$FRAMEWORK_HELPER" ]]; then
  echo "Erro: helper de paths do Hive não encontrado em $FRAMEWORK_HELPER" >&2
  return 1 2>/dev/null || exit 1
fi

# shellcheck disable=SC1090
source "$FRAMEWORK_HELPER"

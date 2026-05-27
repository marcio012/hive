#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
FRAMEWORK_RUNNER="$ROOT_DIR/.agile-squad/framework/run.sh"

if [[ ! -x "$FRAMEWORK_RUNNER" ]]; then
  echo "Erro: sidecar do framework não encontrado em $FRAMEWORK_RUNNER"
  exit 1
fi

exec bash "$FRAMEWORK_RUNNER" "$@"

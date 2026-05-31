#!/usr/bin/env bash

# Inicio de sessao Copilot-Hive (Fase 2+):
# 1. executar `npm run squad:claim:hive` antes de qualquer leitura de inbox
# 2. se retornar `NO_TASKS`, usar `beehive/construcao/inbox-copilot-hive.md` como fallback
# O inbox MD continua em dual-write ate a Fase 3.

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

FRAMEWORK_RUNNER="$ROOT_DIR/.agile-squad/framework/run.sh"

if [[ ! -x "$FRAMEWORK_RUNNER" ]]; then
  echo "Erro: sidecar do framework não encontrado em $FRAMEWORK_RUNNER"
  exit 1
fi

exec bash "$FRAMEWORK_RUNNER" "$@"

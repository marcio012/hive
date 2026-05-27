#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
FRAMEWORK_DIR="$ROOT_DIR/.agile-squad/framework"
NODE_MAJOR=""

ensure_node24() {
  if ! command -v node >/dev/null 2>&1; then
    echo "Erro: Node.js não encontrado. Node v24+ é requerido para o sidecar do Hive."
    exit 1
  fi

  NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
  if (( NODE_MAJOR >= 24 )); then
    return
  fi

  if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    nvm use 24 >/dev/null
    NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
    if (( NODE_MAJOR >= 24 )); then
      return
    fi
  fi

  echo "Erro: Node v24+ é requerido para o sidecar do Hive."
  exit 1
}

SCRIPT_NAME="${1:-}"
if [[ -z "$SCRIPT_NAME" ]]; then
  echo "Uso: .agile-squad/framework/run.sh <script> [args...]"
  exit 1
fi
shift

ensure_node24

export HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
export PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
export HIVE_ROLES="${HIVE_ROLES:-$ROOT_DIR/beehive/roles/roles.yaml}"

cd "$FRAMEWORK_DIR"
exec npm run --silent "$SCRIPT_NAME" -- "$@"

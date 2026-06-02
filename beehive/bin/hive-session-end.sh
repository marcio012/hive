#!/usr/bin/env bash
#
# hive/bin/hive-session-end.sh
# Encerra o fingerprint de sessão de um agente.

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
SESSION_DIR="$PROJECT_PATH/.hive-agent"
ROLE_CONTEXT_FILE="$SESSION_DIR/active-role-context.md"

AGENT_NAME=${1:-""}

if [[ -z "$AGENT_NAME" ]]; then
  echo "Uso: hive session-end <agente>"
  exit 1
fi

case "$AGENT_NAME" in
  gemini)
    LOCK_FILE="$SESSION_DIR/gemini-session.lock"
    if [[ -f "$LOCK_FILE" ]]; then
      rm -f "$LOCK_FILE"
      rm -f "$ROLE_CONTEXT_FILE"
      echo "Sessão Gemini encerrada. Próximo cartucho liberado."
    else
      rm -f "$ROLE_CONTEXT_FILE"
      echo "Nenhuma sessão Gemini ativa para encerrar."
    fi
    ;;
  *)
    echo "Sessão '$AGENT_NAME' não exige encerramento explícito."
    ;;
esac

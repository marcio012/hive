#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
export HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
export PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
export HIVE_ROLES="${HIVE_ROLES:-$ROOT_DIR/beehive/roles/roles.yaml}"

AGENT_NAME="${1:-copilot}"

exec bash "$ROOT_DIR/beehive/bin/hive-session-start.sh" "$AGENT_NAME"

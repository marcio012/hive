#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
FRAMEWORK_DIR="$ROOT_DIR/.agile-squad/framework"

echo "==> Preparando projeto raiz"
(cd "$ROOT_DIR" && npm install --ignore-scripts --no-package-lock)

echo "==> Preparando sidecar do framework"
(cd "$FRAMEWORK_DIR" && npm install --ignore-scripts --no-package-lock)

echo "Setup concluído para produto e framework."

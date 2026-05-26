#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
OUT_DIR="${ROOT_DIR}/.tmp/sustentacao"
TS="$(date +%Y%m%d-%H%M%S)"
REPORT="${OUT_DIR}/deploy-validate-${TS}.md"

mkdir -p "${OUT_DIR}"

step() {
  echo "[sustentacao] $*"
}

run_step() {
  local title="$1"
  local cmd="$2"
  step "${title}"
  if bash -lc "cd '${ROOT_DIR}' && ${cmd}"; then
    echo "- ${title}: ok" >> "${REPORT}"
  else
    echo "- ${title}: falhou" >> "${REPORT}"
    return 1
  fi
}

{
  echo "# Deploy Validation Flow"
  echo
  echo "- timestamp: ${TS}"
  echo "- branch: $(git -C "${ROOT_DIR}" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
  echo "- commit: $(git -C "${ROOT_DIR}" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  echo
  echo "## Resultados"
} > "${REPORT}"

run_step "CI parity check" "npm run check:all"
run_step "Container local smoke (dev profile)" "npm run local:container:test"

step "Validacao concluida"
echo
step "Relatorio: ${REPORT}"

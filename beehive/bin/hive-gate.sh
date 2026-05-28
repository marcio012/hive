#!/usr/bin/env bash
# hive/bin/hive-gate.sh
# Validador de conformidade da Colmeia (The Gate)

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
HIVE_ROLES="${HIVE_ROLES:-$HIVE_HOME/beehive/roles/roles.yaml}"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== HIVE QUALITY GATE ===${NC}"

# 1. Validação de Commits (Conventional Commits)
echo -n "Check: Commits... "
LAST_COMMIT=$(git log -1 --pretty=%s)
COMMIT_REGEX='^(feat|fix|chore|docs|test|refactor|style|perf)(\([[:alnum:]_.-]+\))?(!)?: .+$'
if [[ $LAST_COMMIT =~ $COMMIT_REGEX ]]; then
  echo -e "${GREEN}PASS${NC} ($LAST_COMMIT)"
else
  echo -e "${RED}FAIL${NC}"
  echo "  Erro: O último commit não segue o padrão Conventional Commits."
  exit 1
fi

# 2. Validação de Evidência (Procura por smoke/test no output.md)
echo -n "Check: Evidência Técnica... "
OUTPUT_FILE="$PROJECT_PATH/.hive-agent/output.md"
if [[ -f "$OUTPUT_FILE" ]] && grep -qiE "evidência|smoke|test|build" "$OUTPUT_FILE"; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC}"
  echo "  Erro: Nenhuma evidência técnica encontrada em .hive-agent/output.md"
  exit 1
fi

# 3. Validação de Regras (DIR-048: Documentação)
echo -n "Check: Documentação (DIR-048)... "
if grep -qi "doc:" "$OUTPUT_FILE" || [[ $LAST_COMMIT =~ ^docs: ]]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${YELLOW}WARN${NC} (Verifique se há impacto documental)"
fi

echo -e "\n${GREEN}Portão aberto. A tarefa está qualificada para o OK do Márcio.${NC}"
echo "===================================="

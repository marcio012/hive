#!/usr/bin/env bash
# hive/bin/hive-status.sh
# Mostra o painel de controle do Hive e o estado da Obra (projeto)

set -euo pipefail

# Variáveis injetadas pelo hive.sh principal:
# HIVE_HOME, PROJECT_PATH, HIVE_ROLES

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}=== HIVE DASHBOARD ===${NC}"

# 1. Status do Framework (O Cérebro)
echo -e "${BLUE}[Framework]${NC}"
echo "Localização : $HIVE_HOME"
if [[ -f "$HIVE_ROLES" ]]; then
  echo -e "Governança  : ${GREEN}Ativa${NC} (roles.yaml ok)"
else
  echo -e "Governança  : ${RED}Inativa${NC}"
fi

# 2. Status do Projeto (A Obra)
echo -e "\n${BLUE}[Projeto: $(basename "$PROJECT_PATH")]${NC}"
if [[ -d "$PROJECT_PATH/.hive-agent" ]]; then
  echo -e "Ponte Agent : ${GREEN}Conectada${NC} (.hive-agent/ ok)"
else
  echo -e "Ponte Agent : ${YELLOW}Desconectada${NC} (Aguardando boot)"
fi

# 3. Agentes e Modelos (Extraído do roles.yaml)
echo -e "\n${BLUE}[Enxame de Agentes]${NC}"
# Extrai as chaves sob 'agents:' (ex: gemini, claude, copilot)
grep -E "^  [a-z]+:" "$HIVE_ROLES" | while read -r line; do
  AGENT=$(echo "$line" | sed 's/  //' | sed 's/://')
  # Busca a role logo abaixo do nome do agente
  ROLE=$(grep -A 1 "  $AGENT:" "$HIVE_ROLES" | grep "role:" | cut -d'"' -f2 || echo "n/a")
  echo -e "  - ${AGENT^} ($ROLE)"
done

# 4. Estado da Sessão (via ponte)
STATE_FILE="$PROJECT_PATH/.hive-agent/session-state.env"
if [[ -f "$STATE_FILE" ]]; then
  echo -e "\n${BLUE}[Última Atividade]${NC}"
  source "$STATE_FILE" 2>/dev/null || true
  echo "  Ação: ${LAST_ACTION:-"Nenhuma registrada"}"
  echo "  Foco: ${ACTIVE_ISSUE:-"Livre"}"
fi

echo -e "\n===================================="

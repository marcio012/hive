#!/usr/bin/env bash
# hive/bin/hive-session-start.sh
# Inicializa o contexto do agente dentro da Colmeia

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
HIVE_ROLES="${HIVE_ROLES:-$HIVE_HOME/beehive/roles/roles.yaml}"

AGENT_NAME=${1:-"gemini"} # Assume gemini se não for passado nada
shift || true

ROLE_NAME=""
MODE_NAME=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --role)
      ROLE_NAME="${2:-}"
      shift 2
      ;;
    --mode)
      MODE_NAME="${2:-}"
      shift 2
      ;;
    *)
      echo -e "\033[0;31mErro: argumento desconhecido '$1'.\033[0m"
      exit 1
      ;;
  esac
done

if [[ -n "$ROLE_NAME" && ! -f "$HIVE_HOME/beehive/roles/$ROLE_NAME.md" ]]; then
  echo -e "\033[0;31mErro: cartucho '$ROLE_NAME' não encontrado em beehive/roles/.\033[0m"
  exit 1
fi

echo -e "\033[1;33m=== HIVE SESSION START — $AGENT_NAME ===\033[0m"

# 1. Validação de Território
if [[ ! -f "$PROJECT_PATH/package.json" ]] && [[ ! -d "$PROJECT_PATH/.git" ]]; then
  echo -e "\033[0;31mErro: O diretório atual não parece ser uma 'Obra' (projeto) válida.\033[0m"
  exit 1
fi

# 2. Extração de Metadados da Colmeia (via roles.yaml)
# Busca o modelo complexo ou dedicado definido para o agente
MODEL=$(grep -A 15 "$AGENT_NAME:" "$HIVE_ROLES" | grep -E "complex:|model:" | head -1 | cut -d'"' -f2 || echo "default")
ROLE_FILE=""
if [[ -n "$ROLE_NAME" ]]; then
  ROLE_FILE="beehive/roles/$ROLE_NAME.md"
fi

# 3. Registro de Sessão
echo -e "Agente Ativo : \033[0;32m$AGENT_NAME\033[0m"
echo -e "Modelo       : \033[0;32m$MODEL\033[0m"
if [[ -n "$ROLE_NAME" ]]; then
  echo -e "Cartucho     : \033[0;32m$ROLE_NAME\033[0m"
fi
if [[ -n "$MODE_NAME" ]]; then
  echo -e "Modo         : \033[0;32m$MODE_NAME\033[0m"
fi
if [[ -n "$ROLE_FILE" ]]; then
  echo -e "Contexto     : \033[0;32m$ROLE_FILE\033[0m"
fi
echo -e "Projeto      : \033[0;32m$(basename "$PROJECT_PATH")\033[0m"
echo -e "Status Hive  : \033[0;32mSoberano\033[0m"
echo -e "Data/Hora    : $(date '+%Y-%m-%dT%H:%M:%SZ')"
echo "===================================="

# 4. Preparação da Ponte (.hive-agent no projeto)
# Se a pasta de ponte não existir no projeto, cria o básico
if [[ ! -d "$PROJECT_PATH/.hive-agent" ]]; then
  mkdir -p "$PROJECT_PATH/.hive-agent"
  touch "$PROJECT_PATH/.hive-agent/inbox.md"
  touch "$PROJECT_PATH/.hive-agent/output.md"
  echo "Ponte .hive-agent inicializada no projeto."
fi

echo -e "\033[0;32mHive operacional. Pronto para orquestrar.\033[0m"

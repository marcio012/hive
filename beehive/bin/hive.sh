#!/usr/bin/env bash
# hive/bin/hive.sh
# Ponto de entrada universal do Hive Framework

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

usage() {
  echo -e "${YELLOW}Uso: hive <comando> [argumentos] [--project-path path]${NC}"
  echo ""
  echo "Comandos Disponíveis:"
  echo "  session-start  Inicia uma sessão de IA no projeto atual"
  echo "  status         Mostra o estado do Hive e do projeto"
  echo "  lock           Gerencia travas de edição de arquivos"
  echo "  gate           Valida a tarefa atual contra o contrato"
  echo "  handoff        Gera resumo de transição entre agentes"
  echo "  insight        Captura insights para o buffer global"
  exit 1
}

# Parse de argumentos simples
if [[ $# -lt 1 ]]; then usage; fi

CMD=$1
shift

# Verifica se o comando existe no bin/ do Hive
SCRIPT_PATH="$HIVE_HOME/beehive/bin/hive-$CMD.sh"

if [[ ! -f "$SCRIPT_PATH" ]]; then
  # Tenta mapeamento de nomes (retrocompatibilidade e conveniência)
  case "$CMD" in
    inbox) SCRIPT_PATH="$HIVE_HOME/beehive/bin/hive-inbox.sh" ;;
    *) echo -e "${RED}Erro: Comando '$CMD' não encontrado em $HIVE_HOME/beehive/bin/${NC}"; exit 1 ;;
  esac
fi

# Injeção de Contexto Global para o Script Filho
export HIVE_HOME
export PROJECT_PATH
export HIVE_ROLES="$HIVE_HOME/beehive/roles/roles.yaml"

# Executa o script específico do comando
exec bash "$SCRIPT_PATH" "$@"
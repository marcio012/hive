#!/usr/bin/env bash
# hive/bin/hive-session-start.sh
# Inicializa o contexto do agente dentro da Colmeia

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
HIVE_ROLES="${HIVE_ROLES:-$HIVE_HOME/beehive/roles/roles.yaml}"
SESSION_DIR="$PROJECT_PATH/.hive-agent"
GEMINI_LOCK_FILE="$SESSION_DIR/gemini-session.lock"

AGENT_NAME=${1:-"gemini"} # Assume gemini se não for passado nada
shift || true

ROLE_NAME=""
MODE_NAME=""

ensure_bridge_dir() {
  if [[ ! -d "$SESSION_DIR" ]]; then
    mkdir -p "$SESSION_DIR"
    touch "$SESSION_DIR/inbox.md"
    touch "$SESSION_DIR/output.md"
    echo "Ponte .hive-agent inicializada no projeto."
  fi
}

normalize_gemini_role() {
  if [[ -n "$ROLE_NAME" ]]; then
    printf '%s' "$ROLE_NAME"
  else
    printf '%s' "coordenador"
  fi
}

write_gemini_lock() {
  local active_role="$1"
  local active_mode="$2"

  cat > "$GEMINI_LOCK_FILE" <<EOF
GEMINI_ACTIVE_ROLE="$active_role"
GEMINI_ACTIVE_MODE="$active_mode"
GEMINI_SESSION_STARTED_AT="$(date '+%Y-%m-%dT%H:%M:%SZ')"
EOF
}

assert_gemini_role_boundary() {
  local requested_role="$1"
  local requested_mode="$2"
  local active_role=""
  local active_mode=""

  if [[ ! -f "$GEMINI_LOCK_FILE" ]]; then
    return 0
  fi

  set +u
  # shellcheck disable=SC1090
  source "$GEMINI_LOCK_FILE" 2>/dev/null || true
  set -u

  active_role="${GEMINI_ACTIVE_ROLE:-lead}"
  active_mode="${GEMINI_ACTIVE_MODE:-}"

  if [[ "$active_role" == "$requested_role" && "$active_mode" == "$requested_mode" ]]; then
    return 0
  fi

  echo -e "\033[0;31mErro: Troca de cartucho detectada para Gemini.\033[0m"
  echo "Sessão Gemini ativa : role=${active_role} mode=${active_mode:-padrao}"
  echo "Sessão solicitada   : role=${requested_role} mode=${requested_mode:-padrao}"
  echo ""
  echo "Feche a CLI atual do Gemini, rode:"
  echo "  npm run squad:session:end:gemini"
  echo "e então inicie a nova sessão/cartucho."
  exit 1
}

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

ensure_bridge_dir

if [[ "$AGENT_NAME" == "gemini" ]]; then
  assert_gemini_role_boundary "$(normalize_gemini_role)" "$MODE_NAME"
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
if [[ "$AGENT_NAME" == "gemini" ]]; then
  write_gemini_lock "$(normalize_gemini_role)" "$MODE_NAME"
fi

echo -e "\033[0;32mHive operacional. Pronto para orquestrar.\033[0m"

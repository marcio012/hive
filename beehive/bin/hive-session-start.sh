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
SESSION_STATE_FILE="$SESSION_DIR/session-state.env"

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

resolve_copilot_binding() {
  local legacy_inbox="$PROJECT_PATH/beehive/construcao/inbox-copilot.md"
  local hive_inbox="$PROJECT_PATH/beehive/construcao/inbox-copilot-hive.md"
  local tos_inbox="$PROJECT_PATH/beehive/construcao/inbox-copilot-tos.md"
  local project_name

  case "$ROLE_NAME" in
    copilot-hive)
      printf '%s' "copilot-hive|hive"
      return
      ;;
    copilot-tos)
      printf '%s' "copilot-tos|product"
      return
      ;;
  esac

  if [[ -f "$hive_inbox" && ! -f "$tos_inbox" ]]; then
    printf '%s' "copilot-hive|hive"
    return
  fi
  if [[ -f "$tos_inbox" && ! -f "$hive_inbox" ]]; then
    printf '%s' "copilot-tos|product"
    return
  fi

  project_name="$(basename "$PROJECT_PATH" | tr '[:upper:]' '[:lower:]')"
  if [[ "$project_name" == "hive" && -f "$hive_inbox" ]]; then
    printf '%s' "copilot-hive|hive"
    return
  fi
  if [[ "$project_name" == "tenantos" && -f "$tos_inbox" ]]; then
    printf '%s' "copilot-tos|product"
    return
  fi
  if [[ -f "$hive_inbox" ]]; then
    printf '%s' "copilot-hive|hive"
    return
  fi
  if [[ -f "$tos_inbox" ]]; then
    printf '%s' "copilot-tos|product"
    return
  fi
  if [[ -f "$legacy_inbox" ]]; then
    printf '%s' "copilot|"
    return
  fi
}

refresh_session_state() {
  local started_at session_date project_name active_role active_mode copilot_binding copilot_inbox copilot_domain
  local temp_file

  started_at="$(date '+%Y-%m-%dT%H:%M:%SZ')"
  session_date="$(date '+%Y-%m-%d')"
  project_name="$(basename "$PROJECT_PATH")"
  active_role=""
  active_mode="$MODE_NAME"
  copilot_inbox=""
  copilot_domain=""

  if [[ "$AGENT_NAME" == "gemini" ]]; then
    active_role="$(normalize_gemini_role)"
  elif [[ -n "$ROLE_NAME" ]]; then
    active_role="$ROLE_NAME"
  fi

  if [[ "$AGENT_NAME" == "copilot" ]]; then
    copilot_binding="$(resolve_copilot_binding || true)"
    IFS='|' read -r copilot_inbox copilot_domain <<< "$copilot_binding"
  fi

  temp_file="$(mktemp)"
  if [[ -f "$SESSION_STATE_FILE" ]]; then
    grep -Ev '^(SESSION_DATE|LAST_SESSION_START_AT|ACTIVE_AGENT|ACTIVE_ROLE|ACTIVE_MODE|ACTIVE_PROJECT|COPILOT_ACTIVE_INBOX|COPILOT_ACTIVE_DOMAIN)=' "$SESSION_STATE_FILE" > "$temp_file" || true
  fi

  {
    printf 'SESSION_DATE="%s"\n' "$session_date"
    printf 'LAST_SESSION_START_AT="%s"\n' "$started_at"
    printf 'ACTIVE_AGENT="%s"\n' "$AGENT_NAME"
    printf 'ACTIVE_ROLE="%s"\n' "$active_role"
    printf 'ACTIVE_MODE="%s"\n' "$active_mode"
    printf 'ACTIVE_PROJECT="%s"\n' "$project_name"
    if [[ -n "$copilot_inbox" ]]; then
      printf 'COPILOT_ACTIVE_INBOX="%s"\n' "$copilot_inbox"
      printf 'COPILOT_ACTIVE_DOMAIN="%s"\n' "$copilot_domain"
    fi
  } >> "$temp_file"

  mv "$temp_file" "$SESSION_STATE_FILE"
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
refresh_session_state

echo -e "\033[0;32mHive operacional. Pronto para orquestrar.\033[0m"

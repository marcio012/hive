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
ROLE_CONTEXT_FILE="$SESSION_DIR/active-role-context.md"

AGENT_NAME=${1:-"gemini"} # Assume gemini se não for passado nada
shift || true

ROLE_NAME=""
MODE_NAME=""
EFFECTIVE_MODE=""
ROLE_SOURCE_FILE=""

ensure_bridge_dir() {
  if [[ ! -d "$SESSION_DIR" ]]; then
    mkdir -p "$SESSION_DIR"
    touch "$SESSION_DIR/inbox.md"
    touch "$SESSION_DIR/output.md"
    echo "Ponte .hive-agent inicializada no projeto."
  fi
}

normalize_gemini_role() {
  printf '%s' "$ROLE_NAME"
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

list_available_roles() {
  local roles_dir="$HIVE_HOME/beehive/roles"
  local roles
  if [[ ! -d "$roles_dir" ]]; then
    return 0
  fi

  mapfile -t roles < <(
    find "$roles_dir" -maxdepth 1 -type f -name '*.md' -printf '%f\n' | \
      sed 's/\.md$//' | sort
  )

  if [[ ${#roles[@]} -eq 0 ]]; then
    return 0
  fi

  local joined=""
  local role
  for role in "${roles[@]}"; do
    if [[ -n "$joined" ]]; then
      joined+=", "
    fi
    joined+="$role"
  done

  printf '%s\n' "$joined"
}

resolve_role_source_file() {
  if [[ -z "$ROLE_NAME" ]]; then
    ROLE_SOURCE_FILE=""
    return 0
  fi

  ROLE_SOURCE_FILE="$HIVE_HOME/beehive/roles/$ROLE_NAME.md"
  if [[ -f "$ROLE_SOURCE_FILE" ]]; then
    return 0
  fi

  echo -e "\033[0;31mErro: cartucho '$ROLE_NAME' não encontrado em beehive/roles/.\033[0m"
  local available_roles
  available_roles="$(list_available_roles)"
  if [[ -n "$available_roles" ]]; then
    echo "Papéis disponíveis: $available_roles"
  fi
  exit 1
}

read_role_default_mode() {
  local source_file="$1"
  if [[ -z "$source_file" || ! -f "$source_file" ]]; then
    return 0
  fi

  awk '
    BEGIN {
      in_frontmatter = 0
      frontmatter_started = 0
      in_config = 0
    }
    NR == 1 && $0 == "---" {
      in_frontmatter = 1
      frontmatter_started = 1
      next
    }
    in_frontmatter && $0 == "---" {
      exit
    }
    !frontmatter_started {
      exit
    }
    in_frontmatter && /^config:[[:space:]]*$/ {
      in_config = 1
      next
    }
    in_config && /^[^[:space:]]/ {
      in_config = 0
    }
    in_config && /^[[:space:]]+modo:[[:space:]]*/ {
      mode = $0
      sub(/^[[:space:]]+modo:[[:space:]]*/, "", mode)
      sub(/[[:space:]]+#.*$/, "", mode)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", mode)
      print mode
      exit
    }
  ' "$source_file"
}

resolve_effective_mode() {
  local default_mode=""

  if [[ -n "$MODE_NAME" ]]; then
    EFFECTIVE_MODE="$MODE_NAME"
    return 0
  fi

  default_mode="$(read_role_default_mode "$ROLE_SOURCE_FILE")"
  EFFECTIVE_MODE="$default_mode"
}

clear_role_context_file() {
  rm -f "$ROLE_CONTEXT_FILE"
}

render_role_context_file() {
  if [[ -z "$ROLE_SOURCE_FILE" ]]; then
    clear_role_context_file
    return 0
  fi

  awk \
    -v effective_mode="$EFFECTIVE_MODE" \
    -v agent_name="$AGENT_NAME" \
    -v role_name="$ROLE_NAME" \
    -v source_file="beehive/roles/$ROLE_NAME.md" '
      BEGIN {
        in_frontmatter = 0
        frontmatter_started = 0
        in_config = 0
        mode_written = 0
        session_written = 0
      }
      NR == 1 && $0 == "---" {
        frontmatter_started = 1
        in_frontmatter = 1
        print "<!-- AUTO-GERADO por hive-session-start.sh. Fonte: " source_file " -->"
        print "---"
        next
      }
      in_frontmatter && $0 == "---" {
        if (in_config && !mode_written && effective_mode != "") {
          print "  modo: " quote(effective_mode)
          mode_written = 1
        }
        if (!session_written) {
          print "session:"
          print "  agente: " quote(agent_name)
          print "  papel: " quote(role_name)
          print "  modo_efetivo: " quote(effective_mode)
          print "  arquivo_fonte: " quote(source_file)
          session_written = 1
        }
        print "---"
        in_frontmatter = 0
        next
      }
      in_frontmatter && /^config:[[:space:]]*$/ {
        in_config = 1
        print
        next
      }
      in_frontmatter {
        if (in_config && /^[^[:space:]]/) {
          if (!mode_written && effective_mode != "") {
            print "  modo: " quote(effective_mode)
            mode_written = 1
          }
          in_config = 0
        }
        if (in_config && /^[[:space:]]+modo:[[:space:]]*/) {
          print "  modo: " quote(effective_mode)
          mode_written = 1
          next
        }
        print
        next
      }
      {
        print
      }
      function quote(value) {
        escaped = value
        gsub(/"/, "\\\"", escaped)
        return "\"" escaped "\""
      }
    ' "$ROLE_SOURCE_FILE" > "$ROLE_CONTEXT_FILE"
}

refresh_session_state() {
  local started_at session_date project_name active_role active_mode active_role_source_file active_role_context_file copilot_binding copilot_inbox copilot_domain
  local temp_file

  started_at="$(date '+%Y-%m-%dT%H:%M:%SZ')"
  session_date="$(date '+%Y-%m-%d')"
  project_name="$(basename "$PROJECT_PATH")"
  active_role=""
  active_mode="$EFFECTIVE_MODE"
  active_role_source_file=""
  active_role_context_file=""
  copilot_inbox=""
  copilot_domain=""

  if [[ "$AGENT_NAME" == "gemini" ]]; then
    active_role="$(normalize_gemini_role)"
  elif [[ -n "$ROLE_NAME" ]]; then
    active_role="$ROLE_NAME"
  fi

  if [[ -n "$ROLE_SOURCE_FILE" ]]; then
    active_role_source_file="${ROLE_SOURCE_FILE#$HIVE_HOME/}"
    active_role_context_file="${ROLE_CONTEXT_FILE#$PROJECT_PATH/}"
  fi

  if [[ "$AGENT_NAME" == "copilot" ]]; then
    copilot_binding="$(resolve_copilot_binding || true)"
    IFS='|' read -r copilot_inbox copilot_domain <<< "$copilot_binding"
  fi

  temp_file="$(mktemp)"
  if [[ -f "$SESSION_STATE_FILE" ]]; then
    grep -Ev '^(SESSION_DATE|LAST_SESSION_START_AT|ACTIVE_AGENT|ACTIVE_ROLE|ACTIVE_MODE|ACTIVE_PROJECT|ACTIVE_ROLE_SOURCE_FILE|ACTIVE_ROLE_CONTEXT_FILE|COPILOT_ACTIVE_INBOX|COPILOT_ACTIVE_DOMAIN)=' "$SESSION_STATE_FILE" > "$temp_file" || true
  fi

  {
    printf 'SESSION_DATE="%s"\n' "$session_date"
    printf 'LAST_SESSION_START_AT="%s"\n' "$started_at"
    printf 'ACTIVE_AGENT="%s"\n' "$AGENT_NAME"
    printf 'ACTIVE_ROLE="%s"\n' "$active_role"
    printf 'ACTIVE_MODE="%s"\n' "$active_mode"
    printf 'ACTIVE_PROJECT="%s"\n' "$project_name"
    printf 'ACTIVE_ROLE_SOURCE_FILE="%s"\n' "$active_role_source_file"
    printf 'ACTIVE_ROLE_CONTEXT_FILE="%s"\n' "$active_role_context_file"
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
  local active_role_source_file=""

  if [[ ! -f "$GEMINI_LOCK_FILE" ]]; then
    return 0
  fi

  set +u
  # shellcheck disable=SC1090
  source "$GEMINI_LOCK_FILE" 2>/dev/null || true
  set -u

  active_role="${GEMINI_ACTIVE_ROLE-}"
  active_mode="${GEMINI_ACTIVE_MODE-}"

  if [[ -n "$active_role" && -z "$active_mode" ]]; then
    active_role_source_file="$HIVE_HOME/beehive/roles/$active_role.md"
    if [[ -f "$active_role_source_file" ]]; then
      active_mode="$(read_role_default_mode "$active_role_source_file")"
    fi
  fi

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
    --modo)
      MODE_NAME="${2:-}"
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

ensure_bridge_dir
resolve_role_source_file
resolve_effective_mode

if [[ "$AGENT_NAME" == "gemini" ]]; then
  assert_gemini_role_boundary "$(normalize_gemini_role)" "$EFFECTIVE_MODE"
fi

render_role_context_file

echo -e "\033[1;33m=== HIVE SESSION START — $AGENT_NAME ===\033[0m"

# 1. Validação de Território
if [[ ! -f "$PROJECT_PATH/package.json" ]] && [[ ! -d "$PROJECT_PATH/.git" ]]; then
  echo -e "\033[0;31mErro: O diretório atual não parece ser uma 'Obra' (projeto) válida.\033[0m"
  exit 1
fi

# 2. Extração de Metadados da Hive (via roles.yaml)
# Busca o modelo complexo ou dedicado definido para o agente
MODEL=$(grep -A 15 "$AGENT_NAME:" "$HIVE_ROLES" | grep -E "complex:|model:" | head -1 | cut -d'"' -f2 || echo "default")
AGENT_ROLE_LABEL=$(grep -A 5 "^  $AGENT_NAME:" "$HIVE_ROLES" | grep 'role:' | head -1 | cut -d'"' -f2 || echo "")

# 3. Registro de Sessão
echo -e "Agente Ativo : \033[0;32m$AGENT_NAME\033[0m"
echo -e "Modelo       : \033[0;32m$MODEL\033[0m"
if [[ -n "$AGENT_ROLE_LABEL" ]]; then
  echo -e "Papéis       : \033[0;32m$AGENT_ROLE_LABEL\033[0m"
fi
if [[ -n "$ROLE_NAME" ]]; then
  echo -e "Cartucho     : \033[0;32m$ROLE_NAME\033[0m"
fi
if [[ -n "$EFFECTIVE_MODE" ]]; then
  echo -e "Modo         : \033[0;32m$EFFECTIVE_MODE\033[0m"
fi
if [[ -n "$ROLE_SOURCE_FILE" ]]; then
  echo -e "Fonte papel  : \033[0;32m${ROLE_SOURCE_FILE#$HIVE_HOME/}\033[0m"
  echo -e "Contexto     : \033[0;32m${ROLE_CONTEXT_FILE#$PROJECT_PATH/}\033[0m"
fi
echo -e "Projeto      : \033[0;32m$(basename "$PROJECT_PATH")\033[0m"
echo -e "Status Hive  : \033[0;32mSoberano\033[0m"
echo -e "Data/Hora    : $(date '+%Y-%m-%dT%H:%M:%SZ')"
echo "===================================="

# 4. Preparação da Ponte (.hive-agent no projeto)
if [[ "$AGENT_NAME" == "gemini" ]]; then
  write_gemini_lock "$(normalize_gemini_role)" "$EFFECTIVE_MODE"
fi
refresh_session_state

echo -e "\033[0;32mHive operacional. Pronto para orquestrar.\033[0m"

# 5. Resumo de Pendências do Inbox
show_inbox_summary() {
  local inbox_file="$1"
  if [[ ! -f "$inbox_file" ]]; then
    return
  fi

  local pending_titles
  pending_titles=$(awk '/^### \[/{title=$0} /\*\*Status:\*\* pendente/{print title}' "$inbox_file")

  if [[ -z "$pending_titles" ]]; then
    echo -e "\033[0;32mInbox limpo — nenhuma pendência.\033[0m"
    return
  fi

  local count
  count=$(echo "$pending_titles" | grep -c '^' || true)

  echo ""
  echo -e "\033[1;33m--- $count pendência(s) no inbox ---\033[0m"
  while IFS= read -r line; do
    local entry
    entry="${line#\#\#\# }"
    echo -e "  \033[0;33m•\033[0m $entry"
  done <<< "$pending_titles"
  echo "------------------------------------"
}

INBOX_FILE=""
case "$AGENT_NAME" in
  claude)
    INBOX_FILE="$PROJECT_PATH/beehive/construcao/inbox-claude.md"
    ;;
  gemini)
    INBOX_FILE="$PROJECT_PATH/beehive/construcao/inbox-gemini.md"
    ;;
  copilot)
    case "$ROLE_NAME" in
      copilot-hive) INBOX_FILE="$PROJECT_PATH/beehive/construcao/inbox-copilot-hive.md" ;;
      copilot-tos)  INBOX_FILE="$PROJECT_PATH/beehive/construcao/inbox-copilot-tos.md" ;;
      *)            INBOX_FILE="$PROJECT_PATH/beehive/construcao/inbox-copilot.md" ;;
    esac
    ;;
esac

if [[ -n "$INBOX_FILE" ]]; then
  show_inbox_summary "$INBOX_FILE"
fi

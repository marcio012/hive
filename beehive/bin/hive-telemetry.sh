#!/usr/bin/env bash
# beehive/bin/hive-telemetry.sh
# HIVE TELEMETRY - Registro de Custos e Métricas de Sessão

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
LOG_FILE="$HIVE_HOME/beehive/registry/telemetria/custos.log"
DATE_STAMP=$(date '+%Y-%m-%d %H:%M:%S')
DAY_STAMP=$(date '+%Y-%m-%d')

# Valores padrão (podem ser passados via argumentos)
AGENTE="${1:-"NOME_AGENTE"}"
MODELO="${2:-"modelo-desconhecido"}"
TOKENS_IN="${3:-0}"
TOKENS_OUT="${4:-0}"
CUSTO_BRL="${5:-0.0000}"
SESSION_KEY="${SESSION_ID:-${HIVE_SESSION_ID:-${CLAUDE_SESSION_ID:-$DAY_STAMP}}}"

# Garante que o diretório existe
mkdir -p "$(dirname "$LOG_FILE")"

# Gera o bloco de log
cat <<EOF >> "$LOG_FILE"
==================================================
📊 TELEMETRIA DE TOKENS — [$AGENTE]
Data/Hora: $DATE_STAMP
Session ID: [$SESSION_KEY]
Modelo Ativo: [$MODELO]
--------------------------------------------------
Tokens de Entrada (Prompt): $TOKENS_IN
Tokens de Saída (Completion): $TOKENS_OUT
Custo Estimado da Rodada: R$ $CUSTO_BRL BRL
==================================================
EOF

readarray -t ACCUMULATORS < <(
  awk -v target_day="$DAY_STAMP" -v target_session="$SESSION_KEY" '
    BEGIN {
      fallback_by_day = (target_session == target_day)
    }

    /^Data\/Hora:/ {
      day = substr($2, 1, 10)
    }

    /^Session ID:/ {
      session = $0
      sub(/^Session ID: \[/, "", session)
      sub(/\]$/, "", session)
    }

    /^Custo Estimado da Rodada:/ {
      cost = $6 + 0
    }

    /^=+$/ {
      if (cost != "") {
        if (day == target_day) {
          day_total += cost
        }

        if (session == target_session || (fallback_by_day && session == "" && day == target_day)) {
          session_total += cost
        }
      }

      day = ""
      session = ""
      cost = ""
    }

    END {
      printf "%.4f\n%.4f\n", session_total + 0, day_total + 0
    }
  ' "$LOG_FILE"
)

ACUM_SESSAO="${ACCUMULATORS[0]:-0.0000}"
ACUM_DIA="${ACCUMULATORS[1]:-0.0000}"
CUSTO_RESPOSTA=$(printf "%.4f" "$CUSTO_BRL" 2>/dev/null || echo "$CUSTO_BRL")

echo ""
echo "💰 ${AGENTE} / ${MODELO} — R$ ${CUSTO_RESPOSTA} | Sessão: R$ ${ACUM_SESSAO} | Dia: R$ ${ACUM_DIA}"
echo "   Tokens: IN ${TOKENS_IN} | OUT ${TOKENS_OUT}"

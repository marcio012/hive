#!/usr/bin/env bash
# beehive/bin/hive-cost.sh
# HIVE COST DASHBOARD — Visão de custo por agente e por sessão
# Uso: npm run squad:cost           → resumo do dia
#      npm run squad:cost -- --all  → histórico completo
#      npm run squad:cost -- --log  → registrar custo manual do Claude

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
LOG_FILE="$ROOT_DIR/beehive/registry/telemetria/custos.log"
CONFIG_FILE="$ROOT_DIR/beehive/config.env"
TELEMETRY_SCRIPT="$ROOT_DIR/beehive/bin/hive-telemetry.sh"
TODAY=$(date '+%Y-%m-%d')
MODE="${1:-}"

# ── Cores ──────────────────────────────────────────────────────────────────
BOLD="\033[1m"
DIM="\033[2m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
RED="\033[31m"
RESET="\033[0m"

strip_quotes() {
  local value="${1:-}"
  value="${value%\"}"
  value="${value#\"}"
  printf '%s' "$value"
}

fmt_money() {
  local value="${1:-0}"
  local decimals="${2:-2}"
  printf "%.${decimals}f" "$value" 2>/dev/null || printf "%s" "$value"
}

read_margin() {
  [[ -f "$CONFIG_FILE" ]] || {
    echo "ERRO: arquivo de configuração não encontrado em $CONFIG_FILE" >&2
    exit 1
  }

  local raw
  raw=$(grep -E '^MARGEM_ALVO=' "$CONFIG_FILE" | tail -n 1 | cut -d'=' -f2- || true)
  raw=$(strip_quotes "$raw")

  [[ -n "$raw" ]] || {
    echo "ERRO: MARGEM_ALVO ausente em $CONFIG_FILE" >&2
    exit 1
  }

  awk -v margin="$raw" 'BEGIN { exit !(margin > 0 && margin < 1) }' || {
    echo "ERRO: MARGEM_ALVO deve ser um decimal entre 0 e 1 em $CONFIG_FILE" >&2
    exit 1
  }

  printf '%s' "$raw"
}

sum_cost_for_day() {
  local target_day="$1"

  awk -v target_day="$target_day" '
    /^Data\/Hora:/ {
      day = substr($2, 1, 10)
    }

    /^Custo Estimado da Rodada:/ {
      cost = $6 + 0
    }

    /^=+$/ {
      if (day == target_day && cost != "") {
        total += cost
      }

      day = ""
      cost = ""
    }

    END {
      printf "%.4f", total + 0
    }
  ' "$LOG_FILE"
}

# ── Modo: registrar custo manual do Claude ──────────────────────────────────
if [[ "$MODE" == "--log" ]]; then
  echo -e "${CYAN}${BOLD}📋 Registrar custo da sessão Claude${RESET}"
  echo -e "${DIM}(use /cost no Claude Code para obter os números)${RESET}"
  echo ""
  read -rp "Tokens de entrada:  " tokens_in
  read -rp "Tokens de saída:    " tokens_out
  read -rp "Modelo (ex: claude-sonnet-4-6): " modelo

  # Preços aproximados Claude Sonnet (USD → BRL ~5x)
  # Input: $3/1M = R$0.000015/token
  # Output: $15/1M = R$0.000075/token
  custo=$(echo "scale=4; ($tokens_in * 0.000015) + ($tokens_out * 0.000075)" | bc 2>/dev/null || echo "0.0000")

  bash "$TELEMETRY_SCRIPT" "Claude Arquiteto" "$modelo" "$tokens_in" "$tokens_out" "$custo"
  exit 0
fi

# ── Verifica se log existe ──────────────────────────────────────────────────
if [[ ! -f "$LOG_FILE" ]]; then
  echo -e "${YELLOW}⚠️  Nenhum log de custo encontrado em:${RESET}"
  echo -e "   $LOG_FILE"
  echo ""
  echo -e "${DIM}O log é criado automaticamente quando os agentes registram uso.${RESET}"
  exit 0
fi

if [[ -z "$MODE" ]]; then
  MARGEM_ALVO=$(read_margin)
  custo_dia=$(sum_cost_for_day "$TODAY")
  break_even=$(awk -v cost="$custo_dia" -v margin="$MARGEM_ALVO" 'BEGIN { printf "%.4f", cost / (1 - margin) }')
  margem_pct=$(awk -v margin="$MARGEM_ALVO" 'BEGIN { printf "%.0f", margin * 100 }')

  echo "📊 Resumo Financeiro — $TODAY"
  printf "Custo operacional do dia:      R$ %s\n" "$(fmt_money "$custo_dia" 2)"
  printf "Break-even (margem %s%%):       R$ %s faturamento mínimo\n" "$margem_pct" "$(fmt_money "$break_even" 2)"
  printf "Faturamento recomendado:       R$ %s\n" "$(fmt_money "$break_even" 2)"
  exit 0
fi

# ── Filtra por data ─────────────────────────────────────────────────────────
if [[ "$MODE" == "--all" ]]; then
  FILTRO=""
  TITULO="Histórico completo"
else
  FILTRO="$TODAY"
  TITULO="Hoje — $TODAY"
fi

# ── Parser do log ────────────────────────────────────────────────────────────
# Extrai blocos: agente, modelo, tokens_in, tokens_out, custo
parse_log() {
  local agente="" modelo="" tokens_in=0 tokens_out=0 custo="0.0000" data=""

  while IFS= read -r linha; do
    if [[ "$linha" =~ ^📊\ TELEMETRIA.*\[(.+)\]$ ]]; then
      agente="${BASH_REMATCH[1]}"
    elif [[ "$linha" =~ ^Data/Hora:\ (.+)$ ]]; then
      data="${BASH_REMATCH[1]}"
    elif [[ "$linha" =~ ^Modelo\ Ativo:\ \[(.+)\]$ ]]; then
      modelo="${BASH_REMATCH[1]}"
    elif [[ "$linha" =~ ^Tokens\ de\ Entrada.*:\ ([0-9]+) ]]; then
      tokens_in="${BASH_REMATCH[1]}"
    elif [[ "$linha" =~ ^Tokens\ de\ Saída.*:\ ([0-9]+) ]]; then
      tokens_out="${BASH_REMATCH[1]}"
    elif [[ "$linha" =~ ^Custo\ Estimado.*:\ R\$\ ([0-9.]+) ]]; then
      custo="${BASH_REMATCH[1]}"
    elif [[ "$linha" == "==================================================" ]] && [[ -n "$agente" ]]; then
      # Filtra por data se necessário
      if [[ -z "$FILTRO" ]] || [[ "$data" == *"$FILTRO"* ]]; then
        echo "$agente|$modelo|$tokens_in|$tokens_out|$custo"
      fi
      agente="" modelo="" tokens_in=0 tokens_out=0 custo="0.0000" data=""
    fi
  done < "$LOG_FILE"
}

# ── Coleta dados ─────────────────────────────────────────────────────────────
mapfile -t ENTRADAS < <(parse_log)

if [[ ${#ENTRADAS[@]} -eq 0 ]]; then
  echo -e "${YELLOW}Nenhuma entrada encontrada para: $TITULO${RESET}"
  [[ -z "$FILTRO" ]] || echo -e "${DIM}Tente: npm run squad:cost -- --all${RESET}"
  exit 0
fi

# ── Agrupa por agente ─────────────────────────────────────────────────────────
declare -A agente_custo
declare -A agente_rodadas
declare -A agente_tokens_in
declare -A agente_tokens_out
total_custo=0

for entrada in "${ENTRADAS[@]}"; do
  IFS='|' read -r agente modelo tokens_in tokens_out custo <<< "$entrada"
  agente_custo[$agente]=$(echo "scale=4; ${agente_custo[$agente]:-0} + $custo" | bc)
  agente_rodadas[$agente]=$(( ${agente_rodadas[$agente]:-0} + 1 ))
  agente_tokens_in[$agente]=$(( ${agente_tokens_in[$agente]:-0} + tokens_in ))
  agente_tokens_out[$agente]=$(( ${agente_tokens_out[$agente]:-0} + tokens_out ))
  total_custo=$(echo "scale=4; $total_custo + $custo" | bc)
done

# ── Exibe dashboard ───────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${CYAN}║     💰 HIVE COST DASHBOARD — $TITULO${RESET}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${RESET}"
echo ""

printf "${BOLD}%-25s %8s %12s %12s %12s${RESET}\n" "Agente" "Rodadas" "Tokens IN" "Tokens OUT" "Custo (BRL)"
echo -e "${DIM}──────────────────────────────────────────────────────────────────${RESET}"

# Ordena agentes por custo decrescente (usa | como separador para nomes com espaço)
sorted_agents=$(for agente in "${!agente_custo[@]}"; do
  echo "${agente_custo[$agente]}|$agente"
done | sort -t'|' -k1 -rn | cut -d'|' -f2-)

while IFS= read -r agente; do
  [[ -z "$agente" ]] && continue
  custo_fmt=$(fmt_money "${agente_custo[$agente]}" 4)
  printf "%-25s %8s %12s %12s %12s\n" \
    "$agente" \
    "${agente_rodadas[$agente]}" \
    "${agente_tokens_in[$agente]}" \
    "${agente_tokens_out[$agente]}" \
    "R\$ $custo_fmt"
done <<< "$sorted_agents"

total_fmt=$(fmt_money "$total_custo" 4)
echo -e "${DIM}──────────────────────────────────────────────────────────────────${RESET}"
echo -e "${BOLD}Total de rodadas: ${#ENTRADAS[@]}${RESET}"
echo -e "${BOLD}${GREEN}Total estimado:   R\$ $total_fmt BRL${RESET}"
echo ""
echo -e "${DIM}⚠  Estimativas. Para custo exato do Claude: use /cost no Claude Code.${RESET}"
echo -e "${DIM}   Para registrar custo manual do Claude: npm run squad:cost -- --log${RESET}"
echo ""

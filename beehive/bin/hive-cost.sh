#!/usr/bin/env bash
# beehive/bin/hive-cost.sh
# HIVE COST DASHBOARD — Visão de custo por agente e por sessão
# Uso: npm run squad:cost           → resumo do dia
#      npm run squad:cost -- --all  → histórico completo
#      npm run squad:cost -- --log  → registrar custo manual do Claude

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
LOG_FILE="$ROOT_DIR/beehive/registry/telemetria/custos.log"
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

  mkdir -p "$(dirname "$LOG_FILE")"
  cat >> "$LOG_FILE" <<EOF
==================================================
📊 TELEMETRIA DE TOKENS — [Claude Arquiteto]
Data/Hora: $(date '+%Y-%m-%d %H:%M:%S')
Modelo Ativo: [$modelo]
--------------------------------------------------
Tokens de Entrada (Prompt): $tokens_in
Tokens de Saída (Completion): $tokens_out
Custo Estimado da Rodada: R$ $custo BRL
==================================================
EOF
  echo -e "${GREEN}[OK]${RESET} Custo registrado: R\$ $custo BRL"
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

for agente in "${!agente_custo[@]}"; do
  printf "%-25s %8s %12s %12s %12s\n" \
    "$agente" \
    "${agente_rodadas[$agente]}" \
    "${agente_tokens_in[$agente]}" \
    "${agente_tokens_out[$agente]}" \
    "R\$ ${agente_custo[$agente]}"
done

echo -e "${DIM}──────────────────────────────────────────────────────────────────${RESET}"
echo -e "${BOLD}Total de rodadas: ${#ENTRADAS[@]}${RESET}"
echo -e "${BOLD}${GREEN}Total estimado:   R\$ $total_custo BRL${RESET}"
echo ""
echo -e "${DIM}⚠  Estimativas. Para custo exato do Claude: use /cost no Claude Code.${RESET}"
echo -e "${DIM}   Para registrar custo manual do Claude: npm run squad:cost -- --log${RESET}"
echo ""

#!/usr/bin/env bash
# beehive/bin/hive-telemetry.sh
# HIVE TELEMETRY - Registro de Custos e Métricas de Sessão

set -euo pipefail

# Configurações
HIVE_HOME="${HIVE_HOME:-$(pwd)}"
LOG_FILE="$HIVE_HOME/beehive/registry/telemetria/custos.log"
DATE_STAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Valores padrão (podem ser passados via argumentos)
AGENTE="${1:-"NOME_AGENTE"}"
MODELO="${2:-"modelo-desconhecido"}"
TOKENS_IN="${3:-0}"
TOKENS_OUT="${4:-0}"
CUSTO_BRL="${5:-0.0000}"

# Garante que o diretório existe
mkdir -p "$(dirname "$LOG_FILE")"

# Gera o bloco de log
cat <<EOF >> "$LOG_FILE"
==================================================
📊 TELEMETRIA DE TOKENS — [$AGENTE]
Data/Hora: $DATE_STAMP
Modelo Ativo: [$MODELO]
--------------------------------------------------
Tokens de Entrada (Prompt): $TOKENS_IN
Tokens de Saída (Completion): $TOKENS_OUT
Custo Estimado da Rodada: R$ $CUSTO_BRL BRL
==================================================
EOF

echo -e "\033[1;32m[PASS]\033[0m Métrica registrada com sucesso em $LOG_FILE"

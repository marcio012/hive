#!/usr/bin/env bash

# ==============================================================================
# SCRIPT: gemini-neutral-init.sh
# FINALIDADE: Inicialização limpa para o papel de Conselheiro Neutro.
# CONTEXTO: Ideário Hive - foca em estratégia pura ignorando o maquinário da fábrica.
# ==============================================================================

# Objetivo: Inicialização limpa para o papel de Conselheiro Neutro.
# Este script ignora propositalmente o maquinário da fábrica para focar em estratégia pura.

set -euo pipefail

echo "[gemini:neutral] Iniciando modo Conselheiro Neutro..."

# 1. Limpeza de rastro operacional (Mental Flush)
# Garante que não estamos carregando estados de tasks pendentes no ambiente
unset HIVE_CURRENT_TASK
unset HIVE_ACTIVE_ROLE

# 2. Verificação de Ambiente Estratégico
# Em vez de inboxes, verificamos se o Idário está acessível (nossa âncora)
IDEARIO_PATH="beehive/cognition/ideario_hive"
if [[ -d "$IDEARIO_PATH" ]]; then
  echo "[gemini:neutral] Âncora estratégica detectada: $IDEARIO_PATH"
else
  echo "[gemini:neutral] Aviso: Idário não encontrado. Operando em modo de ideação livre."
fi

# 3. Configuração do Comportamento (Gatilho de Contexto)
# Este modo prioriza a análise sobre a execução.
export GEMINI_MODE="neutral-advisor"
export GEMINI_STRICT_PRIVACY="true"

echo "[gemini:neutral] Pronto. Pronto para o debate profundo sem amarras operacionais."

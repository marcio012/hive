#!/usr/bin/env bash
# beehive/bin/hive-check.sh
# HIVE SENTINEL - Ferramenta de Integridade e Governança

set -euo pipefail

# Caminhos base
HIVE_HOME="${HIVE_HOME:-$(pwd)}"
PROJECT_PATH="${PROJECT_PATH:-$(pwd)}"
CONFIG_FILE="$HIVE_HOME/beehive/config/config.env"
STATE_FILE="$PROJECT_PATH/.hive-agent/session-state.env"
DIRETRIZES_FILE="$HIVE_HOME/beehive/cognition/diretrizes.md"
EVIDENCIAS_DIR="$HIVE_HOME/beehive/docs/evidencias"

# Cores
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}🐝 HIVE SENTINEL - Verificando Integridade do Sistema${NC}"
echo "---------------------------------------------------------"

STATUS_FINAL=0

# --- PILLAR A: Evidence Guard ---
if [[ -f "$CONFIG_FILE" ]]; then
  # Carrega variáveis sem exportar para o shell atual
  ISSUE_ID=$(grep "SQUAD_ACTIVE_ISSUE" "$CONFIG_FILE" | cut -d'"' -f2)
  if [[ -n "$ISSUE_ID" && "$ISSUE_ID" != "null" ]]; then
    # Procura por arquivos que contenham o ID da issue no nome ou no conteúdo
    if [[ -d "$EVIDENCIAS_DIR" ]]; then
      EVIDENCIA_FOUND=$(find "$EVIDENCIAS_DIR" -maxdepth 1 -name "*$ISSUE_ID*" 2>/dev/null | wc -l)
    else
      EVIDENCIA_FOUND=0
    fi
    
    if [[ "$EVIDENCIA_FOUND" -gt 0 ]]; then
      echo -e "[${GREEN}PASS${NC}] Rastreabilidade: Evidência encontrada para #$ISSUE_ID."
    else
      echo -e "[${YELLOW}WARN${NC}] Rastreabilidade: Nenhuma evidência em docs/evidencias/ para #$ISSUE_ID!"
      # STATUS_FINAL=1 # Warn não bloqueia por enquanto, conforme blueprint
    fi
  fi
fi

# --- PILLAR B: Kernel Sync ---
if [[ -f "$CONFIG_FILE" && -f "$STATE_FILE" ]]; then
  K_ISSUE=$(grep "SQUAD_ACTIVE_ISSUE" "$CONFIG_FILE" | cut -d'"' -f2)
  S_ISSUE=$(grep "ACTIVE_ISSUE" "$STATE_FILE" | cut -d'"' -f2 | sed 's/#//' | awk '{print $1}')
  
  if [[ "$K_ISSUE" == "$S_ISSUE" ]]; then
    echo -e "[${GREEN}PASS${NC}] Sincronia de Kernel: Issue #$K_ISSUE alinhada."
  else
    echo -e "[${RED}FAIL${NC}] Sincronia de Kernel: Config (#$K_ISSUE) != Sessão (#$S_ISSUE)!"
    STATUS_FINAL=1
  fi
fi

# --- PILLAR C: DIR-035 Audit ---
if [[ -f "$DIRETRIZES_FILE" ]]; then
  ULTIMA_REV=$(grep "ultima_revisao:" "$DIRETRIZES_FILE" | awk '{print $2}')
  # Verifica apenas o Gemini neste exemplo, expansível para outros
  GEMINI_CONTEXT="$HIVE_HOME/beehive/.gemini/GEMINI.md"
  if [[ -f "$GEMINI_CONTEXT" ]]; then
    # Verifica se a data da última revisão está no contexto do agente
    if grep -q "$ULTIMA_REV" "$GEMINI_CONTEXT"; then
      echo -e "[${GREEN}PASS${NC}] Alinhamento (DIR-035): Agentes sincronizados com diretrizes ($ULTIMA_REV)."
    else
      echo -e "[${RED}FAIL${NC}] Alinhamento (DIR-035): Diretrizes obsoletas nos agentes!"
      STATUS_FINAL=1
    fi
  fi
fi

# --- PILLAR D: System Ping ---
# Verifica se os backends estão respondendo (timeout curto de 1s)
CORE_UP=0
LEGACY_UP=0

echo -n "Pinging Port 3000 (Core)... "
if (echo > /dev/tcp/127.0.0.1/3000) >/dev/null 2>&1; then 
  echo -e "${GREEN}UP${NC}"; CORE_UP=1
else 
  echo -e "${RED}DOWN${NC}"
fi

echo -n "Pinging Port 5000 (Legado)... "
if (echo > /dev/tcp/127.0.0.1/5000) >/dev/null 2>&1; then 
  echo -e "${GREEN}UP${NC}"; LEGACY_UP=1
else 
  echo -e "${RED}DOWN${NC}"
fi

echo "---------------------------------------------------------"
if [[ $STATUS_FINAL -eq 0 ]]; then
  # Se houver avisos de ping ou evidência, o status é "OK com ressalvas"
  if [[ $CORE_UP -eq 1 && $LEGACY_UP -eq 1 ]]; then
    echo -e "Status Final: ${GREEN}INTEGRIDADE CONFIRMADA${NC}"
  else
    echo -e "Status Final: ${YELLOW}ESTÁVEL (Ambiente Offline)${NC}"
  fi
else
  echo -e "Status Final: ${RED}ALERTA DE GOVERNANÇA${NC} (Corrigir falhas de Sincronia/DIR-035)"
fi

exit $STATUS_FINAL

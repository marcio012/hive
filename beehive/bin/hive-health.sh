#!/usr/bin/env bash
# beehive/bin/hive-health.sh
# HIVE HEALTH - Diagnóstico Profundo do Hardware do Sistema (FileSystem)

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
PROJECT_PATH="${PROJECT_PATH:-$ROOT_DIR}"
BRIDGE_DIR="$PROJECT_PATH/.hive-agent"

# Cores
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🛠️ HIVE HEALTH - Auditoria de Integridade do Kernel${NC}"
echo "---------------------------------------------------------"

HEALTH_STATUS=0

# 1. Check de Camadas (Pastas Vitais)
echo -n "Camadas de DNA, Operação e Registro... "
MISSING_DIRS=()
for dir in "beehive/dna" "beehive/construcao" "beehive/registry" "beehive/bin"; do
  if [ ! -d "$HIVE_HOME/$dir" ]; then MISSING_DIRS+=("$dir"); fi
done

if [ ${#MISSING_DIRS[@]} -eq 0 ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}FALHA${NC} (Pastas ausentes: ${MISSING_DIRS[*]})"
  HEALTH_STATUS=1
fi

# 2. Check de Permissões (Binários)
echo -n "Permissões de Execução (Scripts bin/)... "
NON_EXEC=()
for script in "$HIVE_HOME/beehive/bin/"*.sh; do
  if [ ! -x "$script" ]; then NON_EXEC+=("$(basename "$script")"); fi
done

if [ ${#NON_EXEC[@]} -eq 0 ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}AVISO${NC} (Scripts não executáveis: ${NON_EXEC[*]})"
  # Dica: chmod +x beehive/bin/*.sh
fi

# 3. Check de Locks Órfãos
echo -n "Busca por Locks Órfãos... "
if [ -d "$BRIDGE_DIR" ]; then
  ORPHAN_LOCKS=$(find "$BRIDGE_DIR" -name "*.lock" -mmin +120) # Locks com mais de 2h
  if [ -z "$ORPHAN_LOCKS" ]; then
    echo -e "${GREEN}LIMPO${NC}"
  else
    echo -e "${YELLOW}AVISO${NC} (Detectados locks antigos em .hive-agent/)"
    echo "  Comando para limpar: rm $BRIDGE_DIR/*.lock"
  fi
else
  echo -e "${YELLOW}SKIP${NC} (.hive-agent não encontrado)"
fi

# 4. Check de Configuração
echo -n "Integridade de Configuração (config.env)... "
if [ -f "$HIVE_HOME/beehive/config.env" ]; then
  if grep -q "SQUAD_OWNER" "$HIVE_HOME/beehive/config.env"; then
    echo -e "${GREEN}OK${NC}"
  else
    echo -e "${RED}CORRUPTO${NC} (SQUAD_OWNER não encontrado)"
    HEALTH_STATUS=1
  fi
else
  echo -e "${RED}AUSENTE${NC}"
  HEALTH_STATUS=1
fi

echo "---------------------------------------------------------"
if [ $HEALTH_STATUS -eq 0 ]; then
  echo -e "Veredito: ${GREEN}KERNEL SAUDÁVEL${NC}"
else
  echo -e "Veredito: ${RED}KERNEL COMPROMETIDO${NC} (Consulte o SQUAD_SOS_GUIDE.md)"
fi

exit $HEALTH_STATUS

#!/usr/bin/env bash
# hive/bin/hive-session-start.sh
# Inicializa o contexto do agente dentro da Colmeia

set -euo pipefail

# Variáveis injetadas pelo hive.sh principal:
# HIVE_HOME, PROJECT_PATH, HIVE_ROLES

AGENT_NAME=${1:-"gemini"} # Assume gemini se não for passado nada

echo -e "\033[1;33m=== HIVE SESSION START — $AGENT_NAME ===\033[0m"

# 1. Validação de Território
if [[ ! -f "$PROJECT_PATH/package.json" ]] && [[ ! -d "$PROJECT_PATH/.git" ]]; then
  echo -e "\033[0;31mErro: O diretório atual não parece ser uma 'Obra' (projeto) válida.\033[0m"
  exit 1
fi

# 2. Extração de Metadados da Colmeia (via roles.yaml)
# Busca o modelo complexo definido para o agente
MODEL=$(grep -A 15 "$AGENT_NAME:" "$HIVE_ROLES" | grep "complex:" | cut -d'"' -f2 || echo "default")

# 3. Registro de Sessão
echo -e "Agente Ativo : \033[0;32m$AGENT_NAME\033[0m"
echo -e "Modelo       : \033[0;32m$MODEL\033[0m"
echo -e "Projeto      : \033[0;32m$(basename "$PROJECT_PATH")\033[0m"
echo -e "Status Hive  : \033[0;32mSoberano\033[0m"
echo -e "Data/Hora    : $(date '+%Y-%m-%dT%H:%M:%SZ')"
echo "===================================="

# 4. Preparação da Ponte (.hive-agent no projeto)
# Se a pasta de ponte não existir no projeto, cria o básico
if [[ ! -d "$PROJECT_PATH/.hive-agent" ]]; then
  mkdir -p "$PROJECT_PATH/.hive-agent"
  touch "$PROJECT_PATH/.hive-agent/inbox.md"
  touch "$PROJECT_PATH/.hive-agent/output.md"
  echo "Ponte .hive-agent inicializada no projeto."
fi

echo -e "\033[0;32mHive operacional. Pronto para orquestrar.\033[0m"

# 5. Exibe a Página Inicial (HIVE.md)
if [[ -f "$HIVE_HOME/beehive/HIVE.md" ]]; then
  echo -e "\n"
  cat "$HIVE_HOME/beehive/HIVE.md"
  echo -e "\n"
fi

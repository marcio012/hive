#!/usr/bin/env bash
# beehive/bin/hive-view.sh
# Comando para visualizar arquivos sem numeração de linha e com formatação limpa.

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Uso: npm run hive:view -- <caminho_do_arquivo>"
  exit 1
fi

FILE_PATH=$1

if [[ ! -f "$FILE_PATH" ]]; then
  echo "Erro: Arquivo '$FILE_PATH' não encontrado."
  exit 1
fi

echo -e "\n--- [VISUALIZANDO: $FILE_PATH] ---\n"
cat "$FILE_PATH"
echo -e "\n--- [FIM DO ARQUIVO] ---\n"

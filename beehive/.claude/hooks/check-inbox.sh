#!/bin/bash
# Hook: Verifica inbox do Claude no início de cada mensagem
# Executado via UserPromptSubmit — roda antes de processar o prompt

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
INBOX="$REPO_ROOT/beehive/construcao/inbox-claude.md"

[ ! -f "$INBOX" ] && exit 0

# Conta entradas pendentes
PENDENTES=$(grep -c "status: pendente\|status:pendente" "$INBOX" 2>/dev/null || echo "0")

if [ "$PENDENTES" -gt 0 ]; then
  echo ""
  echo "╔══════════════════════════════════════════╗"
  echo "║  📬 INBOX: $PENDENTES entrada(s) pendente(s)          ║"
  echo "║  Arquivo: beehive/construcao/inbox-claude.md  ║"
  echo "╚══════════════════════════════════════════╝"
  echo ""
  # Lista os assuntos pendentes
  grep -A2 "status: pendente\|status:pendente" "$INBOX" | grep "^\###\|^de:\|^para:" | head -10
  echo ""
fi

exit 0

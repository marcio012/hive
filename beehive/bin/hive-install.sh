#!/usr/bin/env bash
#
# Inicializa uma nova instância do Hive em um repositório-alvo sem copiar o core.

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_PATHS_SCRIPT="$ROOT_DIR/.agile-squad/framework/hive-paths.sh"

if [[ -n "${HIVE_HOME:-}" && -f "${HIVE_HOME%/}/.agile-squad/framework/hive-paths.sh" ]]; then
  HIVE_PATHS_SCRIPT="${HIVE_HOME%/}/.agile-squad/framework/hive-paths.sh"
elif [[ -n "${HIVE_HOME:-}" && -f "$(dirname "${HIVE_HOME%/}")/.agile-squad/framework/hive-paths.sh" ]]; then
  HIVE_PATHS_SCRIPT="$(dirname "${HIVE_HOME%/}")/.agile-squad/framework/hive-paths.sh"
fi

if [[ ! -f "$HIVE_PATHS_SCRIPT" ]]; then
  echo "Erro: helper de paths do Hive não encontrado em $HIVE_PATHS_SCRIPT" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$HIVE_PATHS_SCRIPT"
resolve_hive_paths "$ROOT_DIR"

TARGET_REPO="${1:-}"

if [[ -z "$TARGET_REPO" ]]; then
  echo "Uso: bash $BEEHIVE_PATH/bin/hive-install.sh TARGET_REPO" >&2
  exit 1
fi

TARGET_REPO="$(mkdir -p "$TARGET_REPO" && cd "$TARGET_REPO" && pwd)"
TARGET_NAME="$(basename "$TARGET_REPO")"
TARGET_BEEHIVE="$TARGET_REPO/beehive"
TARGET_FRAMEWORK="$TARGET_REPO/.agile-squad/framework"
VERSION_FILE="$BEEHIVE_PATH/VERSION"
HIVE_VERSION="$(tr -d '[:space:]' < "$VERSION_FILE" 2>/dev/null || true)"

if [[ -z "$HIVE_VERSION" ]]; then
  HIVE_VERSION="0.0.0-dev"
fi

mkdir -p \
  "$TARGET_BEEHIVE/construcao/debates" \
  "$TARGET_BEEHIVE/registry/archive/inbox" \
  "$TARGET_BEEHIVE/registry/telemetria" \
  "$TARGET_BEEHIVE/registry/aceites" \
  "$TARGET_REPO/.githooks" \
  "$TARGET_FRAMEWORK" \
  "$TARGET_REPO/.claude"

cp "$HIVE_HOME/.agile-squad/proxy.sh" "$TARGET_REPO/.agile-squad/proxy.sh"
cp "$HIVE_HOME/.githooks/commit-msg" "$TARGET_REPO/.githooks/commit-msg"
cp "$HIVE_HOME/.agile-squad/framework/run.sh" "$TARGET_FRAMEWORK/run.sh"
cp "$HIVE_HOME/.agile-squad/framework/setup.sh" "$TARGET_FRAMEWORK/setup.sh"
cp "$HIVE_HOME/.agile-squad/framework/squad-bridge.sh" "$TARGET_FRAMEWORK/squad-bridge.sh"
cp "$HIVE_HOME/.agile-squad/framework/hive-paths.sh" "$TARGET_FRAMEWORK/hive-paths.sh"
cp "$HIVE_HOME/.agile-squad/framework/.nvmrc" "$TARGET_FRAMEWORK/.nvmrc"
cp "$HIVE_HOME/.agile-squad/framework/package.json" "$TARGET_FRAMEWORK/package.json"

cat > "$TARGET_BEEHIVE/config.env" <<EOF
SQUAD_OWNER="CHANGE_ME"
SQUAD_REPO="CHANGE_ME/${TARGET_NAME}"
SQUAD_PROJECT_NUMBER="0"
SQUAD_PROJECT_TITLE="${TARGET_NAME}"
SQUAD_ACTIVE_ISSUE="null"
CLAUDE_MODEL="claude-sonnet-4-6"
COPILOT_MODEL="gpt-4o"
MARGEM_ALVO=0.40
HIVE_VERSION="${HIVE_VERSION}"
EOF

cat > "$TARGET_BEEHIVE/construcao/inbox-copilot.md" <<'EOF'
# Inbox — Copilot

Canal de entrada de contexto e tarefas para o Copilot.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-historico.md`
EOF

cat > "$TARGET_BEEHIVE/construcao/inbox-claude.md" <<'EOF'
# Inbox do Claude

Arquivo de entrada para o Claude. Leia no início de cada sessão.
Entradas concluídas/consumidas → mover para `beehive/registry/archive/inbox/inbox-claude-historico.md`

**Histórico completo:** `beehive/registry/archive/inbox/inbox-claude-historico.md`
EOF

cat > "$TARGET_BEEHIVE/construcao/inbox-gemini.md" <<'EOF'
# Inbox — Gemini

Canal de entrada de contexto e tarefas para o Gemini.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

**Histórico completo:** `beehive/registry/archive/inbox/inbox-gemini-historico.md`
EOF

touch \
  "$TARGET_BEEHIVE/registry/archive/inbox/inbox-copilot-historico.md" \
  "$TARGET_BEEHIVE/registry/archive/inbox/inbox-claude-historico.md" \
  "$TARGET_BEEHIVE/registry/archive/inbox/inbox-gemini-historico.md" \
  "$TARGET_BEEHIVE/registry/telemetria/custos.log"

PACKAGE_JSON="$TARGET_REPO/package.json"
SQUAD_SCRIPTS='{
  "setup": "bash .agile-squad/proxy.sh setup",
  "squad:bridge": "bash .agile-squad/proxy.sh squad:bridge",
  "squad:inbox": "bash .agile-squad/proxy.sh hive:inbox",
  "squad:session:claude": "bash .agile-squad/proxy.sh hive:session:claude",
  "squad:session:gemini": "bash .agile-squad/proxy.sh hive:session:gemini",
  "squad:session:copilot": "bash .agile-squad/proxy.sh hive:session:copilot",
  "squad:telemetry": "bash .agile-squad/proxy.sh hive:telemetry",
  "squad:lock:acquire": "bash .agile-squad/proxy.sh hive lock set",
  "squad:lock:release": "bash .agile-squad/proxy.sh hive lock release",
  "squad:lock:assert": "bash .agile-squad/proxy.sh hive lock check",
  "squad:gate": "bash .agile-squad/proxy.sh hive:gate",
  "squad:cost": "bash .agile-squad/proxy.sh squad:cost",
  "squad:cost:all": "bash .agile-squad/proxy.sh squad:cost:all",
  "squad:cost:log": "bash .agile-squad/proxy.sh squad:cost:log",
  "squad:next": "bash .agile-squad/proxy.sh squad:next",
  "gemini:po:auditoria": "bash .agile-squad/proxy.sh gemini:po:auditoria",
  "po:demand": "bash .agile-squad/proxy.sh po:demand"
}'

node - "$PACKAGE_JSON" "$TARGET_NAME" "$SQUAD_SCRIPTS" <<'NODE'
const fs = require('fs');

const packagePath = process.argv[2];
const defaultName = process.argv[3];
const scripts = JSON.parse(process.argv[4]);

let pkg = {};
if (fs.existsSync(packagePath)) {
  pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

pkg.name ||= defaultName;
pkg.private ??= true;
pkg.type ||= 'commonjs';
pkg.scripts ||= {};

for (const [name, command] of Object.entries(scripts)) {
  if (!pkg.scripts[name]) {
    pkg.scripts[name] = command;
  }
}

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
NODE

echo "Hive instalado em $TARGET_REPO"
echo "Core externo : $BEEHIVE_PATH"
echo "Versão       : $HIVE_VERSION"

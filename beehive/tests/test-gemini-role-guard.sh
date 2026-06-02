#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HIVE_HOME="${HIVE_HOME:-$ROOT_DIR}"
TMP_DIR="$(mktemp -d)"
TEST_REPO="$TMP_DIR/workspace"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$TEST_REPO"
cd "$TEST_REPO"
git init --quiet
git config user.name "Test Runner"
git config user.email "test@example.com"
printf '{ "name": "temp-workspace" }\n' > package.json

run_session_start() {
  local agent="$1"
  shift
  (
    cd "$TEST_REPO"
    HIVE_HOME="$HIVE_HOME" PROJECT_PATH="$TEST_REPO" \
      bash "$HIVE_HOME/beehive/bin/hive-session-start.sh" "$agent" "$@"
  )
}

run_session_end() {
  local agent="$1"
  shift || true
  (
    cd "$TEST_REPO"
    HIVE_HOME="$HIVE_HOME" PROJECT_PATH="$TEST_REPO" \
      bash "$HIVE_HOME/beehive/bin/hive-session-end.sh" "$agent" "$@"
  )
}

assert_file_contains() {
  local file="$1"
  local pattern="$2"
  if ! grep -Fq "$pattern" "$file"; then
    echo "Assertion failed: expected '$pattern' in $file"
    exit 1
  fi
}

assert_success() {
  if ! "$@"; then
    echo "Assertion failed: command should succeed: $*"
    exit 1
  fi
}

assert_failure_contains() {
  local expected="$1"
  shift
  local output
  set +e
  output="$("$@" 2>&1)"
  local status=$?
  set -e
  if [[ $status -eq 0 ]]; then
    echo "Assertion failed: command should fail: $*"
    exit 1
  fi
  if [[ "$output" != *"$expected"* ]]; then
    echo "Assertion failed: expected failure output to contain '$expected'"
    echo "$output"
    exit 1
  fi
}

assert_output_contains() {
  local output="$1"
  local expected="$2"
  if [[ "$output" != *"$expected"* ]]; then
    echo "Assertion failed: expected output to contain '$expected'"
    echo "$output"
    exit 1
  fi
}

assert_file_exists() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "Assertion failed: expected file to exist: $file"
    exit 1
  fi
}

assert_file_not_exists() {
  local file="$1"
  if [[ -f "$file" ]]; then
    echo "Assertion failed: expected file to be absent: $file"
    exit 1
  fi
}

assert_file_not_contains() {
  local file="$1"
  local unexpected="$2"
  if grep -Fq "$unexpected" "$file"; then
    echo "Assertion failed: expected '$unexpected' to be absent from $file"
    exit 1
  fi
}

assert_output_not_contains() {
  local output="$1"
  local unexpected="$2"
  if [[ "$output" == *"$unexpected"* ]]; then
    echo "Assertion failed: expected output not to contain '$unexpected'"
    echo "$output"
    exit 1
  fi
}

assert_jq_equals() {
  local file="$1"
  local filter="$2"
  local expected="$3"
  local actual

  actual="$(jq -r "$filter" "$file")"
  if [[ "$actual" != "$expected" ]]; then
    echo "Assertion failed: expected jq '$filter' on $file to be '$expected', got '$actual'"
    exit 1
  fi
}

LOCK_FILE="$TEST_REPO/.hive-agent/gemini-session.lock"
ROLE_CONTEXT_FILE="$TEST_REPO/.hive-agent/active-role-context.md"

assert_success run_session_start gemini
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE=""'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_ROLE=""'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_MODE=""'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_ROLE_CONTEXT_FILE=""'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_ROLE_SOURCE_FILE=""'
assert_file_not_exists "$ROLE_CONTEXT_FILE"

assert_success run_session_start gemini
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE=""'

assert_failure_contains "Troca de cartucho detectada" run_session_start gemini --role arquiteto

assert_success run_session_end gemini
if [[ -f "$LOCK_FILE" ]]; then
  echo "Assertion failed: lock file should be removed after neutral session-end"
  exit 1
fi

assert_success run_session_start gemini --role arquiteto
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="arquiteto"'
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_MODE="decisivo"'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_ROLE="arquiteto"'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_MODE="decisivo"'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_ROLE_SOURCE_FILE="beehive/roles/arquiteto.md"'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_ROLE_CONTEXT_FILE=".hive-agent/active-role-context.md"'
assert_file_exists "$ROLE_CONTEXT_FILE"
assert_file_contains "$ROLE_CONTEXT_FILE" 'modo: "decisivo"'
assert_file_contains "$ROLE_CONTEXT_FILE" 'papel: "arquiteto"'

assert_success run_session_start gemini --role arquiteto
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="arquiteto"'
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_MODE="decisivo"'

assert_failure_contains "Troca de cartucho detectada" run_session_start gemini --role po
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="arquiteto"'

assert_success run_session_end gemini
if [[ -f "$LOCK_FILE" ]]; then
  echo "Assertion failed: lock file should be removed after session-end"
  exit 1
fi

assert_success run_session_start gemini --role po
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="po"'
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_MODE=""'
assert_file_contains "$ROLE_CONTEXT_FILE" 'papel: "po"'

cat > "$LOCK_FILE" <<'EOF'
GEMINI_ACTIVE_ROLE="projetista"
GEMINI_ACTIVE_MODE=""
GEMINI_SESSION_PID="999999"
GEMINI_SESSION_STARTED_AT="2026-05-28T00:00:00Z"
EOF

assert_success run_session_start gemini --role projetista
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="projetista"'
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_MODE="exploratorio"'

assert_success run_session_end gemini
assert_file_not_exists "$ROLE_CONTEXT_FILE"

assert_success run_session_start gemini --role dev --modo completo
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="dev"'
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_MODE="completo"'
assert_file_contains "$ROLE_CONTEXT_FILE" 'modo: "completo"'

assert_success run_session_end gemini
assert_failure_contains "Papéis disponíveis:" run_session_start gemini --role inexistente

assert_success run_session_start claude
assert_success run_session_start copilot
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_AGENT="copilot"'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_PROJECT="workspace"'

assert_success run_session_start copilot --role copilot-hive
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'ACTIVE_ROLE="copilot-hive"'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'COPILOT_ACTIVE_INBOX="copilot-hive"'
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'COPILOT_ACTIVE_DOMAIN="hive"'

INBOX_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" bash "$HIVE_HOME/beehive/bin/hive-inbox.sh" copilot
)"
assert_output_contains "$INBOX_OUTPUT" "Agente: copilot-hive"
assert_output_contains "$INBOX_OUTPUT" "Inbox não materializado"
assert_output_not_contains "$INBOX_OUTPUT" "Alvo de inbox inválido"

ARCHIVE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" node "$HIVE_HOME/scripts/inbox-archive.js" copilot
)"
assert_output_contains "$ARCHIVE_OUTPUT" "inbox-copilot-hive.md"
assert_output_not_contains "$ARCHIVE_OUTPUT" "Alvo de inbox inválido"

mkdir -p "$TEST_REPO/beehive/construcao/debates"
cat > "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md" <<'EOF'
### [CLAUDE-2026-05-29-064] Commit liberado — WO-025-A prevenção de inbox
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**Status:** executada — commit `8db27c6` realizado.

```text
### [IGNORAR-EM-CODE-FENCE] Cabeçalho falso
**Status:** pendente
```

---

### [CLAUDE-2026-05-29-064] WO-025-A: Higiene de Inbox — Onda 1 (Prevenção)
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**Status:** pendente

Entrada antiga já encerrada por uma atualização mais recente.

---

### [UI-{YYYY-MM-DD}-{HH:mm}] Intenção despachada via Hive UI
**De:** Hive UI → Copilot (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**Status:** pendente

Nova pendência real.
EOF
printf '' > "$TEST_REPO/beehive/construcao/inbox-claude.md"
printf '' > "$TEST_REPO/beehive/construcao/inbox-gemini.md"
assert_success run_session_start copilot
assert_file_contains "$TEST_REPO/.hive-agent/session-state.env" 'COPILOT_ACTIVE_INBOX="copilot-hive"'

INBOX_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" bash "$HIVE_HOME/beehive/bin/hive-inbox.sh" copilot
)"
assert_output_contains "$INBOX_OUTPUT" "Agente: copilot-hive"
assert_output_contains "$INBOX_OUTPUT" "[UI-{YYYY-MM-DD}-{HH:mm}] Intenção despachada via Hive UI (pendente)"
assert_output_not_contains "$INBOX_OUTPUT" "[CLAUDE-2026-05-29-064] WO-025-A: Higiene de Inbox — Onda 1 (Prevenção) (pendente)"
assert_output_not_contains "$INBOX_OUTPUT" "[IGNORAR-EM-CODE-FENCE]"
assert_output_not_contains "$INBOX_OUTPUT" "Alvo de inbox inválido"

cat > "$TEST_REPO/beehive/construcao/inbox-claude.md" <<'EOF'
### [COPILOT-2026-05-29-001] Entrega concluída
**De:** Copilot (Executor) → Claude (Arquiteto)
**Data:** 2026-05-29
**tipo:** checkpoint
**Status:** consumida

Entrega finalizada e sem pendências.

---

# Inbox do Claude

Arquivo de entrada para o Claude (Arquiteto / Auditor Técnico).
Entradas concluídas/consumidas → mover para `beehive/registry/archive/inbox/inbox-claude-historico.md`

### [GEMINI-2026-05-29-002] Parecer pendente
**De:** Gemini (Coordenador) → Claude (Arquiteto)
**Data:** 2026-05-29
**tipo:** pedido-de-parecer
**Status:** pendente

Avaliar o debate ativo.
EOF

CLAUDE_ARCHIVE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" node "$HIVE_HOME/scripts/inbox-archive.js" --write claude
)"
assert_output_contains "$CLAUDE_ARCHIVE_OUTPUT" "inbox-claude.md — 1 entrada(s) movida(s) para o histórico"
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-claude.md" "# Inbox do Claude"
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-claude.md" "[GEMINI-2026-05-29-002] Parecer pendente"
if grep -Fq "[COPILOT-2026-05-29-001]" "$TEST_REPO/beehive/construcao/inbox-claude.md"; then
  echo "Assertion failed: closed Claude entry should be removed from active inbox"
  exit 1
fi
assert_file_contains "$TEST_REPO/beehive/registry/archive/inbox/inbox-claude-historico.md" "[COPILOT-2026-05-29-001] Entrega concluída"

cat > "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md" <<'EOF'
# Inbox — Copilot-Hive

Canal de entrada de contexto e tarefas para o Copilot-Hive.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

### [CLAUDE-2026-05-20-001] Entrada antiga
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-20
**tipo:** handoff-executavel
**Status:** executada

Arquivar por idade.

---

### [CLAUDE-2026-05-29-002] Entrada recente
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**Status:** executada

Ainda deve permanecer no inbox ativo.

---

**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-hive-historico.md`

**Tipos de entrada (metadado opcional — aplicar em novas entradas):**
- `alerta-roteamento` — o agente identificou algo mas não tem autoridade para agir; Claude deve decidir

### [UI-{YYYY-MM-DD}-{HH:mm}] Intenção despachada via Hive UI
**De:** Hive UI → Copilot (Executor)
**Data:** {YYYY-MM-DD}
**tipo:** handoff-executavel
**Status:** executada

Modelo inválido de data não deve quebrar nem ser arquivado.
EOF

COPILOT_ARCHIVE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" node "$HIVE_HOME/scripts/inbox-archive.js" --write --now 2026-05-29T12:00:00Z copilot
)"
assert_output_contains "$COPILOT_ARCHIVE_OUTPUT" "inbox-copilot-hive.md"
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md" '**Histórico completo:** `beehive/registry/archive/inbox/inbox-copilot-hive-historico.md`'
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md" "**Tipos de entrada (metadado opcional — aplicar em novas entradas):**"
if grep -Fq "[CLAUDE-2026-05-20-001]" "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md"; then
  echo "Assertion failed: old Copilot entry should be removed from active inbox"
  exit 1
fi
if grep -Fq "[CLAUDE-2026-05-29-002]" "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md"; then
  echo "Assertion failed: closed Copilot-Hive entries should be removed from active inbox during archive"
  exit 1
fi
assert_file_contains "$TEST_REPO/beehive/registry/archive/inbox/inbox-copilot-hive-historico.md" "[CLAUDE-2026-05-20-001] Entrada antiga"
assert_file_contains "$TEST_REPO/beehive/registry/archive/inbox/inbox-copilot-hive-historico.md" "[CLAUDE-2026-05-29-002] Entrada recente"

cat > "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md" <<'EOF'
# Inbox — Copilot-Hive

Canal de entrada de contexto e tarefas para o Copilot-Hive.
Append-only — nunca apagar entradas. Apenas atualizar `status`.
Entradas com mais de 7 dias e status consumida/executada → mover para `registry/archive/inbox/`.

### [CLAUDE-2026-05-29-010] Entrega recente
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**Status:** executada

Pode ser arquivada apenas com autorização manual explícita.

---

### [CLAUDE-2026-05-29-011] Pendência real
**De:** Claude (Arquiteto) → Copilot-Hive (Executor)
**Data:** 2026-05-29
**tipo:** handoff-executavel
**Status:** pendente

Deve permanecer no inbox ativo.
EOF

COPILOT_MANUAL_ARCHIVE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" node "$HIVE_HOME/scripts/inbox-archive.js" --write --manual copilot
)"
assert_output_contains "$COPILOT_MANUAL_ARCHIVE_OUTPUT" "inbox-copilot-hive.md — 1 entrada(s) movida(s) para o histórico"
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md" "[CLAUDE-2026-05-29-011] Pendência real"
if grep -Fq "[CLAUDE-2026-05-29-010]" "$TEST_REPO/beehive/construcao/inbox-copilot-hive.md"; then
  echo "Assertion failed: manual archive should remove closed Copilot entry from active inbox"
  exit 1
fi
assert_file_contains "$TEST_REPO/beehive/registry/archive/inbox/inbox-copilot-hive-historico.md" "[CLAUDE-2026-05-29-010] Entrega recente"

mkdir -p "$TEST_REPO/beehive/registry/archive/inbox"
cat > "$TEST_REPO/beehive/registry/archive/inbox/inbox-claude-historico.md" <<'EOF'
### [COPILOT-2026-05-29-099] Histórico congelado
**De:** Copilot (Executor) → Claude (Arquiteto)
**Data:** 2026-05-29
**Status:** consumida

Linha 01
Linha 02
Linha 03
Linha 04
Linha 05
Linha 06
Linha 07
Linha 08
Linha 09
Linha 10
Linha 11
Linha 12
Linha 13
Linha 14
Linha 15
Linha 16
Linha 17
Linha 18
Linha 19
Linha 20
Linha 21
Linha 22
Linha 23
Linha 24
Linha 25
Linha 26
Linha 27
Linha 28
Linha 29
Linha 30
Linha 31
EOF

(
  cd "$TEST_REPO"
  git add beehive/registry/archive/inbox/inbox-claude-historico.md
  node "$HIVE_HOME/scripts/inbox-pre-commit.js"
)

mkdir -p "$TEST_REPO/beehive/construcao/work_orders/HIVE"
cat > "$TEST_REPO/beehive/construcao/work_orders/HIVE/WO-TEST-GUARD.md" <<'EOF'
---
id: WO-TEST
executor: Copilot
status: pendente
---
EOF

ERROR_SET_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" HIVE_ACTOR=copilot node "$HIVE_HOME/scripts/hive-error-state.js" set executor_errado high "WO-028, inbox-copilot" "Claude auditar"
)"
assert_output_contains "$ERROR_SET_OUTPUT" '"status": "alert"'
assert_file_contains "$TEST_REPO/.hive-agent/error-state.json" '"detected_by": "copilot"'
assert_file_contains "$TEST_REPO/.hive-agent/error-state.json" '"auto_mode_allowed": false'
assert_file_exists "$TEST_REPO/beehive/registry/incidents/INC-$(date -u +%F)-001.md"
assert_file_contains "$TEST_REPO/beehive/registry/incidents/INC-$(date -u +%F)-001.md" '## Linha do tempo'
assert_file_exists "$HIVE_HOME/beehive/registry/incidents/TEMPLATE_INCIDENTE.md"

ERROR_READ_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" node "$HIVE_HOME/scripts/hive-error-state.js" read
)"
assert_output_contains "$ERROR_READ_OUTPUT" '"severity": "high"'

assert_failure_contains \
  "error-state ativo" \
  node "$HIVE_HOME/scripts/hive-action-guard.js" \
    --actor copilot \
    --action close \
    --workspace "$TEST_REPO" \
    --repo workspace

ERROR_CLEAR_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" node "$HIVE_HOME/scripts/hive-error-state.js" clear
)"
assert_output_contains "$ERROR_CLEAR_OUTPUT" '"status": "ok"'
assert_file_contains "$TEST_REPO/.hive-agent/error-state.json" '"status": "ok"'

assert_failure_contains \
  "executor da WO é copilot" \
  node "$HIVE_HOME/scripts/hive-action-guard.js" \
    --actor claude \
    --action commit \
    --target beehive/construcao/work_orders/HIVE/WO-TEST-GUARD.md \
    --workspace "$TEST_REPO" \
    --repo workspace

cat > "$TEST_REPO/beehive/construcao/inbox-claude.md" <<'EOF'
# Inbox do Claude

**Histórico completo:** `beehive/registry/archive/inbox/inbox-claude-historico.md`

<!-- novas entradas abaixo -->

---

### [CLAUDE-2026-05-10-001] Elegível Faixa A
**De:** Copilot (Executor) → Claude (Arquiteto)
**Data:** 2026-05-10
**tipo:** informativo
**Status:** executada

Pode ser arquivada na Faixa A.
EOF

cat > "$TEST_REPO/beehive/construcao/inbox-copilot.md" <<'EOF'
# Inbox — Copilot

<!-- novas entradas abaixo -->
EOF

cat > "$TEST_REPO/beehive/construcao/inbox-gemini.md" <<'EOF'
# Inbox — Gemini

<!-- novas entradas abaixo -->
EOF

DRY_RUN_OUTPUT="$(
  cd "$TEST_REPO" && \
  PROJECT_PATH="$TEST_REPO" bash "$HIVE_HOME/beehive/bin/hive-inbox.sh" archive-dry-run claude
)"
assert_output_contains "$DRY_RUN_OUTPUT" "1 entrada(s) elegível(eis) para Faixa A"
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-claude.md" "[CLAUDE-2026-05-10-001] Elegível Faixa A"

cat > "$TEST_REPO/beehive/construcao/inbox-claude.md" <<'EOF'
# Inbox do Claude

**Histórico completo:** `beehive/registry/archive/inbox/inbox-claude-historico.md`

<!-- novas entradas abaixo -->

---

### [CLAUDE-2026-05-29-001] Pendência ativa
**De:** Copilot (Executor) → Claude (Arquiteto)
**Data:** 2026-05-29
**tipo:** ação
**Status:** pendente

Impede o arquivamento automático.

---

### [CLAUDE-2026-05-10-001] Elegível Faixa A
**De:** Copilot (Executor) → Claude (Arquiteto)
**Data:** 2026-05-10
**tipo:** informativo
**Status:** executada

Pode ser arquivada na Faixa A.
EOF

assert_failure_contains \
  "há 1 pendência(s) ativa(s) no inbox" \
  env PROJECT_PATH="$TEST_REPO" HIVE_HOME="$HIVE_HOME" bash "$HIVE_HOME/beehive/bin/hive-inbox.sh" archive-faixa-a claude

cat > "$TEST_REPO/beehive/construcao/inbox-claude.md" <<'EOF'
# Inbox do Claude

**Histórico completo:** `beehive/registry/archive/inbox/inbox-claude-historico.md`

<!-- novas entradas abaixo -->

---

### [CLAUDE-2026-05-10-001] Elegível Faixa A
**De:** Copilot (Executor) → Claude (Arquiteto)
**Data:** 2026-05-10
**tipo:** informativo
**Status:** executada

Pode ser arquivada na Faixa A.
EOF

FAIXA_A_OUTPUT="$(
  cd "$TEST_REPO" && \
  PROJECT_PATH="$TEST_REPO" node "$HIVE_HOME/scripts/inbox-faixa-a.js" --write claude --now 2026-05-29T12:00:00Z
)"
assert_output_contains "$FAIXA_A_OUTPUT" "Log: beehive/registry/archive/inbox/ARCH-2026-05-29-1200-claude.md"
assert_file_not_contains "$TEST_REPO/beehive/construcao/inbox-claude.md" "[CLAUDE-2026-05-10-001] Elegível Faixa A"
assert_file_contains "$TEST_REPO/beehive/registry/archive/inbox/inbox-claude-historico.md" "[CLAUDE-2026-05-10-001] Elegível Faixa A"
assert_file_exists "$TEST_REPO/beehive/registry/archive/inbox/ARCH-2026-05-29-1200-claude.md"
assert_file_contains "$TEST_REPO/beehive/registry/archive/inbox/ARCH-2026-05-29-1200-claude.md" "authorized_by: delegado-faixa-a"
assert_file_contains "$TEST_REPO/beehive/registry/archive/inbox/ARCH-2026-05-29-1200-claude.md" "trigger: agente-autonomo"
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-copilot.md" "ARCH-2026-05-29-1200-claude-NOTIF-COPILOT"
assert_file_contains "$TEST_REPO/beehive/construcao/inbox-gemini.md" "ARCH-2026-05-29-1200-claude-NOTIF-GEMINI"

rm -f "$TEST_REPO/.hive-agent/interaction-log.json"
printf '{}\n' > "$TEST_REPO/.hive-agent/locks.json"

LOCK_ACQUIRE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" npm run --silent squad:lock:acquire -- claude "WO-033" feat 2>&1
)"
assert_output_contains "$LOCK_ACQUIRE_OUTPUT" "[Tipo: feat]"
assert_file_exists "$TEST_REPO/.hive-agent/interaction-log.json"
assert_jq_equals "$TEST_REPO/.hive-agent/locks.json" '.owner' "claude"
assert_jq_equals "$TEST_REPO/.hive-agent/locks.json" '.interaction_id' "ILG-$(date -u +%F)-001"
assert_jq_equals "$TEST_REPO/.hive-agent/interaction-log.json" '.entries | length' "1"
assert_jq_equals "$TEST_REPO/.hive-agent/interaction-log.json" '.entries[0].type' "feat"
assert_jq_equals "$TEST_REPO/.hive-agent/interaction-log.json" '.entries[0].released_at' "null"

LOCK_RELEASE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" npm run --silent squad:lock:release -- claude 2>&1
)"
assert_output_contains "$LOCK_RELEASE_OUTPUT" "RELEASE: Colmeia liberada por 'claude'"
assert_jq_equals "$TEST_REPO/.hive-agent/locks.json" 'keys | length' "0"
if [[ "$(jq -r '.entries[0].released_at' "$TEST_REPO/.hive-agent/interaction-log.json")" == "null" ]]; then
  echo "Assertion failed: expected first interaction to be closed on release"
  exit 1
fi

UNKNOWN_LOCK_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" npm run --silent squad:lock:acquire -- claude "WO-033 sem tipo" 2>&1
)"
assert_output_contains "$UNKNOWN_LOCK_OUTPUT" "tipo de interação ausente"
assert_output_contains "$UNKNOWN_LOCK_OUTPUT" "[Tipo: unknown]"
assert_jq_equals "$TEST_REPO/.hive-agent/interaction-log.json" '.entries | length' "2"
assert_jq_equals "$TEST_REPO/.hive-agent/interaction-log.json" '.entries[1].type' "unknown"
assert_jq_equals "$TEST_REPO/.hive-agent/locks.json" '.interaction_id' "ILG-$(date -u +%F)-002"

UNKNOWN_RELEASE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" npm run --silent squad:lock:release -- claude 2>&1
)"
assert_output_contains "$UNKNOWN_RELEASE_OUTPUT" "RELEASE: Colmeia liberada por 'claude'"
if [[ "$(jq -r '.entries[1].released_at' "$TEST_REPO/.hive-agent/interaction-log.json")" == "null" ]]; then
  echo "Assertion failed: expected second interaction to be closed on release"
  exit 1
fi

rm -f "$TEST_REPO/.hive-agent/interaction-log.json"
cat > "$TEST_REPO/.hive-agent/locks.json" <<'EOF'
{"owner":"claude","activity":"legacy-lock","acquired_at":"2026-05-29T00:00:00Z"}
EOF
LEGACY_RELEASE_OUTPUT="$(
  cd "$HIVE_HOME" && \
  PROJECT_PATH="$TEST_REPO" npm run --silent squad:lock:release -- claude 2>&1
)"
assert_output_contains "$LEGACY_RELEASE_OUTPUT" "RELEASE: Colmeia liberada por 'claude'"
assert_jq_equals "$TEST_REPO/.hive-agent/locks.json" 'keys | length' "0"
assert_jq_equals "$TEST_REPO/.hive-agent/interaction-log.json" '.entries | length' "0"

echo "PASS: Gemini role guard integration"

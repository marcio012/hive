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

LOCK_FILE="$TEST_REPO/.hive-agent/gemini-session.lock"

assert_success run_session_start gemini --role coordenador
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="coordenador"'

assert_success run_session_start gemini --role coordenador
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="coordenador"'

assert_failure_contains "Troca de cartucho detectada" run_session_start gemini --role po
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="coordenador"'

assert_success run_session_end gemini
if [[ -f "$LOCK_FILE" ]]; then
  echo "Assertion failed: lock file should be removed after session-end"
  exit 1
fi

assert_success run_session_start gemini --role po
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="po"'

cat > "$LOCK_FILE" <<'EOF'
GEMINI_ACTIVE_ROLE="projetista"
GEMINI_ACTIVE_MODE=""
GEMINI_SESSION_PID="999999"
GEMINI_SESSION_STARTED_AT="2026-05-28T00:00:00Z"
EOF

assert_success run_session_start gemini --role projetista
assert_file_contains "$LOCK_FILE" 'GEMINI_ACTIVE_ROLE="projetista"'

assert_success run_session_start claude
assert_success run_session_start copilot

echo "PASS: Gemini role guard integration"

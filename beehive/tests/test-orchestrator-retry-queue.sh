#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

cd "$ROOT_DIR"

node --input-type=commonjs <<'EOF'
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { OrchestratorWatcher } = require(path.join(
  process.cwd(),
  'beehive',
  'apps',
  'orchestrator',
  'dist',
  'watcher.js',
));

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hive-retry-queue-'));

const cleanup = () => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
};

(async () => {
try {
  const inboxDir = path.join(tempRoot, 'beehive', 'construcao');
  fs.mkdirSync(inboxDir, { recursive: true });
  fs.writeFileSync(
    path.join(inboxDir, 'inbox-claude.md'),
    [
      '### [ENTRY-RETRY] Retry candidate',
      '**Status:** pendente',
      '**tipo:** handoff-executavel',
      '**De:** Claude → Copilot-Hive',
      '',
      'Payload retry.',
      '',
      '---',
      '',
      '### [ENTRY-FRESH] Fresh candidate',
      '**Status:** pendente',
      '**tipo:** handoff-executavel',
      '**De:** Claude → Copilot-Hive',
      '',
      'Payload fresh.',
      '',
      '---',
      '',
    ].join('\n'),
    'utf8',
  );

  const state = {
    status: 'watching',
    currentItem: null,
    pauseReason: null,
    consecutiveFailures: 0,
    processedEntries: [],
    updatedAt: new Date(0).toISOString(),
  };

  const deadmanCalls = [];
  const dispatchCalls = [];
  let retryDispatches = 0;

  const watcher = Object.create(OrchestratorWatcher.prototype);
  watcher.rootDir = tempRoot;
  watcher.stateStore = {
    async readState() {
      return { ...state, processedEntries: [...state.processedEntries] };
    },
    async readConfig() {
      return { autoMode: true, autoMerge: false, notifyMarcio: true };
    },
    async markProcessed(entryId) {
      if (!state.processedEntries.includes(entryId)) {
        state.processedEntries.push(entryId);
      }
      return { ...state, processedEntries: [...state.processedEntries] };
    },
  };
  watcher.logger = { async log() {} };
  watcher.taskStore = {};
  watcher.router = {
    resolve() {
      return { action: 'dispatch', target: 'copilot-hive' };
    },
  };
  watcher.dispatcher = {
    async dispatch(_decision, entry) {
      dispatchCalls.push(entry.id);

      if (entry.id === 'ENTRY-FRESH') {
        if (!state.processedEntries.includes(entry.id)) {
          state.processedEntries.push(entry.id);
        }
        return { outcome: 'dispatched' };
      }

      retryDispatches += 1;
      return { outcome: 'retry', reason: 'lock ocupado por gemini' };
    },
  };
  watcher.deadman = {
    async resumeWatching() {
      deadmanCalls.push(['resumeWatching']);
    },
    async startDispatch(entryId) {
      deadmanCalls.push(['startDispatch', entryId]);
    },
    async recordSuccess() {
      deadmanCalls.push(['recordSuccess']);
    },
    async recordFailure(entryId, reason) {
      deadmanCalls.push(['recordFailure', entryId, reason]);
    },
    async pause(reason) {
      deadmanCalls.push(['pause', reason]);
    },
  };
  watcher.processing = false;
  watcher.pendingRescan = false;
  watcher.debounceTimer = null;
  watcher.timeoutInterval = null;
  watcher.retries = new Map();

  const realNow = Date.now;
  const realSetTimeout = global.setTimeout;
  const realClearTimeout = global.clearTimeout;

  let now = 1_000_000;
  const timers = [];

  Date.now = () => now;
  global.setTimeout = (fn, delay) => {
    const handle = { fn, delay, cleared: false };
    timers.push(handle);
    return handle;
  };
  global.clearTimeout = (handle) => {
    if (handle) {
      handle.cleared = true;
    }
  };

  try {
    watcher.scheduleRetry('ENTRY-RETRY');

    assert.equal(timers.length, 1);
    assert.equal(timers[0].delay, 120000);
    assert.equal(watcher.retries.get('ENTRY-RETRY').attempts, 1);
    assert.equal(watcher.retries.get('ENTRY-RETRY').nextAttemptAt, now + 120000);

    await watcher.processOnce('polling');

    assert.deepEqual(dispatchCalls, ['ENTRY-FRESH']);
    assert.deepEqual(
      deadmanCalls.filter((call) => call[0] === 'startDispatch'),
      [['startDispatch', 'ENTRY-FRESH']],
    );

    dispatchCalls.length = 0;
    deadmanCalls.length = 0;
    now += 120000;

    await watcher.processOnce('retry');

    assert.deepEqual(dispatchCalls, ['ENTRY-RETRY']);
    assert.equal(retryDispatches, 1);
    assert.equal(watcher.retries.get('ENTRY-RETRY').attempts, 2);
    assert.equal(watcher.retries.get('ENTRY-RETRY').nextAttemptAt, now + 300000);
    assert.equal(timers.length, 2);
    assert.equal(timers[1].delay, 300000);
  } finally {
    Date.now = realNow;
    global.setTimeout = realSetTimeout;
    global.clearTimeout = realClearTimeout;
  }
} finally {
  cleanup();
}
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
EOF

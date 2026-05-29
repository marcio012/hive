'use strict';

const fs = require('fs');
const path = require('path');

const { parseInboxEntries } = require('./inbox-utils');
const { normalizeActor, readErrorState } = require('./hive-error-state');

const ACTION_AUTHORITIES = {
  commit: new Set(['claude', 'copilot']),
  handoff: new Set(['claude']),
  audit: new Set(['claude']),
  dispatch: new Set(['claude', 'gemini', 'orchestrator']),
  close: new Set(['claude', 'copilot', 'gemini', 'orchestrator']),
};

function printUsage() {
  console.log('Usage:');
  console.log('  node scripts/hive-action-guard.js --actor <agent> --action <commit|handoff|audit|dispatch|close> [options]');
  console.log('Options:');
  console.log('  --target <wo-id|path>');
  console.log('  --authority-ref <inbox-entry-id>');
  console.log('  --expected-state <value>');
  console.log('  --workspace <path>');
  console.log('  --repo <name>');
}

function parseCliArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key || !key.startsWith('--')) {
      throw new Error(`argumento inválido: ${key || '(vazio)'}`);
    }
    if (value === undefined) {
      throw new Error(`flag sem valor: ${key}`);
    }
    parsed[key.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
  }
  return parsed;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function parseFrontmatter(content) {
  const lines = content.replace(/\r/g, '').split('\n');
  if (lines[0] !== '---') {
    return new Map();
  }

  const metadata = new Map();
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === '---') {
      break;
    }
    const match = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (match) {
      metadata.set(match[1], match[2].trim());
    }
  }
  return metadata;
}

function normalizeRelativePath(projectPath, candidate) {
  if (!candidate) {
    return null;
  }

  if (path.isAbsolute(candidate)) {
    return candidate;
  }

  return path.join(projectPath, candidate);
}

function resolveWorkOrderPath(projectPath, target) {
  const directPath = normalizeRelativePath(projectPath, target);
  if (directPath && fs.existsSync(directPath)) {
    return directPath;
  }

  const workOrdersDir = path.join(projectPath, 'beehive', 'construcao', 'work_orders');
  const normalizedTarget = String(target || '').trim();
  const matches = walkFiles(workOrdersDir).filter((filePath) => {
    if (!filePath.endsWith('.md')) {
      return false;
    }
    const basename = path.basename(filePath);
    return basename === normalizedTarget || basename.startsWith(`${normalizedTarget}-`);
  });

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    throw new Error(`target ambíguo para WO: ${target}`);
  }

  throw new Error(`WO não encontrada: ${target}`);
}

function extractEntryMetadata(entry) {
  const metadata = {};
  for (const line of entry.lines) {
    const match = line.match(/^\*\*([^:]+):\*\*\s*(.+)$/);
    if (match) {
      metadata[match[1].trim().toLowerCase()] = match[2].trim();
    }
  }
  return metadata;
}

function validateSystemState(input) {
  const state = readErrorState(input.workspace);
  if (state.status !== 'ok' && state.auto_mode_allowed === false) {
    return {
      allowed: false,
      reason: `error-state ativo (${state.category || 'incidente sem categoria'}) — incidente ${state.incident_id || 'sem id'}`,
    };
  }
  return null;
}

function validateActorAuthority(input) {
  if (!input.actor) {
    return null;
  }

  const allowedActors = ACTION_AUTHORITIES[input.action];
  if (!allowedActors) {
    return {
      allowed: false,
      reason: `ação inválida: ${input.action}`,
    };
  }

  if (!allowedActors.has(input.actor)) {
    return {
      allowed: false,
      reason: `ator ${input.actor} não tem autoridade para ${input.action}`,
    };
  }

  return null;
}

function validateCommitGuard(input) {
  if (input.action !== 'commit' || !input.target || !input.actor) {
    return null;
  }

  const workOrderPath = resolveWorkOrderPath(input.workspace, input.target);
  const metadata = parseFrontmatter(fs.readFileSync(workOrderPath, 'utf8'));
  const executor = normalizeActor(metadata.get('executor'));

  if (!executor) {
    return {
      allowed: false,
      reason: `executor da WO ausente ou inválido em ${path.relative(input.workspace, workOrderPath)}`,
    };
  }

  if (input.actor !== executor) {
    return {
      allowed: false,
      reason: `executor da WO é ${executor}; ${input.actor} não pode commitar ${path.basename(workOrderPath)}`,
    };
  }

  return null;
}

function validateHandoffGuard(input) {
  if (input.action !== 'handoff' || !input.target || !input.authorityRef) {
    return null;
  }

  const inboxPath = normalizeRelativePath(input.workspace, input.target);
  if (!inboxPath || !fs.existsSync(inboxPath)) {
    return {
      allowed: false,
      reason: `inbox do handoff não encontrada: ${input.target}`,
    };
  }

  const entries = parseInboxEntries(fs.readFileSync(inboxPath, 'utf8'));
  const entry = entries.find((candidate) => candidate.id === input.authorityRef);
  if (!entry) {
    return {
      allowed: false,
      reason: `authorityRef não encontrada no inbox: ${input.authorityRef}`,
    };
  }

  const metadata = extractEntryMetadata(entry);
  const missingFields = [
    'wo_ref',
    'executor',
    'workspace_hive',
    'workspace_target',
    'repo_target',
    'cwd_exec',
  ].filter((field) => !metadata[field]);

  if (missingFields.length > 0) {
    return {
      allowed: false,
      reason: `handoff sem campos obrigatórios: ${missingFields.join(', ')}`,
    };
  }

  return null;
}

function checkGuard(input) {
  const normalizedInput = {
    ...input,
    actor: normalizeActor(input.actor),
    action: input.action,
    authorityRef: input.authorityRef,
    expectedState: input.expectedState,
    target: input.target,
    workspace: path.resolve(input.workspace || process.env.PROJECT_PATH || path.resolve(__dirname, '..')),
    repo: input.repo || path.basename(path.resolve(input.workspace || process.env.PROJECT_PATH || path.resolve(__dirname, '..'))),
  };

  const validations = [
    validateSystemState,
    validateActorAuthority,
    validateCommitGuard,
    validateHandoffGuard,
  ];

  for (const validation of validations) {
    const result = validation(normalizedInput);
    if (result && result.allowed === false) {
      return result;
    }
  }

  return {
    allowed: true,
    reason: 'guard ok',
  };
}

function main() {
  if (process.argv.length <= 2) {
    printUsage();
    process.exit(0);
  }

  const input = parseCliArgs(process.argv.slice(2));
  const result = checkGuard(input);
  if (!result.allowed) {
    console.error(`❌ ${result.reason}`);
    process.exit(1);
  }

  console.log(`✅ ${result.reason}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  ACTION_AUTHORITIES,
  checkGuard,
  extractEntryMetadata,
  parseCliArgs,
  parseFrontmatter,
  resolveWorkOrderPath,
};

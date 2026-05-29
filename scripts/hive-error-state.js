'use strict';

const fs = require('fs');
const path = require('path');

const ALLOWED_ACTORS = new Set(['claude', 'copilot', 'gemini', 'orchestrator']);
const ALLOWED_CATEGORIES = new Set([
  'executor_errado',
  'auditoria_pulada',
  'roteamento_incorreto',
  'estado_inconsistente',
  'cascata_silenciosa',
  'lock_orfao',
  'commit_sem_liberacao',
]);
const ALLOWED_SEVERITIES = new Set(['low', 'medium', 'high', 'critical']);

function resolveProjectPaths(projectRoot = process.env.PROJECT_PATH || path.resolve(__dirname, '..')) {
  const projectPath = path.resolve(projectRoot);
  const hiveAgentDir = path.join(projectPath, '.hive-agent');
  const incidentsDir = path.join(projectPath, 'beehive', 'registry', 'incidents');

  return {
    projectPath,
    hiveAgentDir,
    errorStatePath: path.join(hiveAgentDir, 'error-state.json'),
    incidentsDir,
  };
}

function buildOkState() {
  return {
    status: 'ok',
    incident_id: null,
    detected_at: null,
    detected_by: null,
    category: null,
    severity: null,
    affected_flows: [],
    auto_mode_allowed: true,
    resume_requirements: '',
  };
}

function normalizeActor(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();
  return ALLOWED_ACTORS.has(normalized) ? normalized : null;
}

function writeJsonAtomic(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  // Known limitation: this avoids partial writes, but concurrent updates still use last-write-wins.
  fs.writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.renameSync(tempPath, filePath);
}

function parseAffectedFlows(rawValue) {
  if (!rawValue) {
    return [];
  }

  return String(rawValue)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function readErrorState(projectRoot, options = {}) {
  const { errorStatePath } = resolveProjectPaths(projectRoot);
  if (!fs.existsSync(errorStatePath)) {
    return buildOkState();
  }

  const parsed = JSON.parse(fs.readFileSync(errorStatePath, 'utf8'));
  return {
    ...buildOkState(),
    ...parsed,
    affected_flows: Array.isArray(parsed.affected_flows) ? parsed.affected_flows : [],
  };
}

function nextIncidentId(incidentsDir, now) {
  fs.mkdirSync(incidentsDir, { recursive: true });
  const datePart = now.toISOString().slice(0, 10);
  const matcher = new RegExp(`^INC-${datePart}-(\\d{3})\\.md$`);
  const maxSequence = fs
    .readdirSync(incidentsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.match(matcher))
    .filter(Boolean)
    .reduce((currentMax, match) => Math.max(currentMax, Number(match[1])), 0);

  return `INC-${datePart}-${String(maxSequence + 1).padStart(3, '0')}`;
}

function buildIncidentDocument(state) {
  const affectedFlows = state.affected_flows.map((flow) => `  - ${flow}`).join('\n');
  const timelineTimestamp = state.detected_at.slice(11, 16);

  return `---
id: ${state.incident_id}
detected_at: ${state.detected_at}
detected_by: ${state.detected_by || 'null'}
category: ${state.category}
severity: ${state.severity}
affected_flows:
${affectedFlows || '  -'}
---

## Linha do tempo

- \`${timelineTimestamp}\` — Incidente registrado via \`hive-error-state.js\`

## Contenção imediata

- Safe-stop aplicado conforme \`.hive-agent/error-state.json\`

## Causa provável

- A preencher

## Correção aplicada

- A preencher

## Condições para retomar

${state.resume_requirements || '- A preencher'}

## DIR criada/atualizada

- DIR-090
`;
}

function createIncidentFile(paths, state) {
  fs.mkdirSync(paths.incidentsDir, { recursive: true });
  const incidentPath = path.join(paths.incidentsDir, `${state.incident_id}.md`);
  if (!fs.existsSync(incidentPath)) {
    fs.writeFileSync(incidentPath, buildIncidentDocument(state), 'utf8');
  }
  return incidentPath;
}

function printUsage() {
  console.log('Usage:');
  console.log('  node scripts/hive-error-state.js set [actor] <category> <severity> "<affected_flows>" "<resume_requirements>"');
  console.log('  node scripts/hive-error-state.js clear');
  console.log('  node scripts/hive-error-state.js read');
}

function handleSet(rawArgs) {
  const args = [...rawArgs];
  let actor = normalizeActor(process.env.HIVE_ACTOR || process.env.HIVE_AGENT || process.env.AGENT_NAME);

  if (args.length === 5 && normalizeActor(args[0])) {
    actor = normalizeActor(args.shift());
  }

  if (args.length !== 4) {
    throw new Error('set exige <category> <severity> "<affected_flows>" "<resume_requirements>"');
  }

  const [category, severity, affectedFlowsRaw, resumeRequirements] = args;
  if (!ALLOWED_CATEGORIES.has(category)) {
    throw new Error(`categoria inválida: ${category}`);
  }
  if (!ALLOWED_SEVERITIES.has(severity)) {
    throw new Error(`severity inválida: ${severity}`);
  }

  const paths = resolveProjectPaths();
  const now = new Date();
  const incidentId = nextIncidentId(paths.incidentsDir, now);
  const state = {
    status: 'alert',
    incident_id: incidentId,
    detected_at: now.toISOString(),
    detected_by: actor,
    category,
    severity,
    affected_flows: parseAffectedFlows(affectedFlowsRaw),
    auto_mode_allowed: !['high', 'critical'].includes(severity),
    resume_requirements: String(resumeRequirements),
  };

  writeJsonAtomic(paths.errorStatePath, state);
  createIncidentFile(paths, state);
  console.log(JSON.stringify(state, null, 2));
}

function handleClear() {
  const paths = resolveProjectPaths();
  const state = buildOkState();
  writeJsonAtomic(paths.errorStatePath, state);
  console.log(JSON.stringify(state, null, 2));
}

function handleRead() {
  console.log(JSON.stringify(readErrorState(), null, 2));
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command) {
    printUsage();
    process.exit(0);
  }

  if (command === 'set') {
    handleSet(args);
    return;
  }

  if (command === 'clear') {
    handleClear();
    return;
  }

  if (command === 'read') {
    handleRead();
    return;
  }

  printUsage();
  process.exit(1);
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
  ALLOWED_ACTORS,
  ALLOWED_CATEGORIES,
  ALLOWED_SEVERITIES,
  buildOkState,
  normalizeActor,
  parseAffectedFlows,
  readErrorState,
  resolveProjectPaths,
  writeJsonAtomic,
};

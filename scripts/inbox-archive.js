'use strict';

const fs = require('fs');
const path = require('path');
const {
  isClosedStatus,
  parseInboxEntries,
} = require('./inbox-utils');

const rootDir = path.resolve(__dirname, '..');
const projectPath = path.resolve(process.env.PROJECT_PATH || rootDir);
const inboxDir = path.join(projectPath, 'beehive/construcao');
const archiveDir = path.join(projectPath, 'beehive/registry/archive/inbox');
const inboxFiles = {
  claude: path.join(inboxDir, 'inbox-claude.md'),
  copilot: path.join(inboxDir, 'inbox-copilot.md'),
  gemini: path.join(inboxDir, 'inbox-gemini.md'),
};

const structuralRules = [
  {
    name: 'heading',
    match: (line) => /^# /.test(line),
    collect(lines, startIndex) {
      const block = [];
      for (let index = startIndex; index < lines.length; index += 1) {
        if (index > startIndex && /^### \[[^\]]+\]/.test(lines[index])) {
          break;
        }
        block.push(lines[index]);
      }
      return {
        block: trimBlock(block),
        endIndex: startIndex + block.length - 1,
      };
    },
  },
  {
    name: 'history',
    match: (line) => /^\*\*Histórico completo:\*\*/.test(line.trim()),
    collect: collectUntilNextRule,
  },
  {
    name: 'types',
    match: (line) => /^\*\*Tipos de entrada/.test(line.trim()),
    collect: collectUntilNextRule,
  },
  {
    name: 'marker',
    match: (line) => /^<!-- novas entradas abaixo/.test(line.trim()),
    collect(lines, startIndex) {
      return {
        block: trimBlock([lines[startIndex]]),
        endIndex: startIndex,
      };
    },
  },
];

function trimBlock(lines) {
  const block = [...lines];
  while (block.length > 0 && block[0].trim() === '') {
    block.shift();
  }
  while (block.length > 0 && block[block.length - 1].trim() === '') {
    block.pop();
  }
  return block;
}

function collectUntilNextRule(lines, startIndex) {
  const block = [];
  for (let index = startIndex; index < lines.length; index += 1) {
    if (index > startIndex && /^### \[[^\]]+\]/.test(lines[index])) {
      break;
    }
    if (index > startIndex && structuralRules.some((rule) => rule.match(lines[index]))) {
      break;
    }
    block.push(lines[index]);
  }
  return {
    block: trimBlock(block),
    endIndex: startIndex + block.length - 1,
  };
}

function normalizeBlock(blockLines) {
  return trimBlock(blockLines).join('\n');
}

function extractStructuralBlocks(content) {
  const lines = content.replace(/\r/g, '').split('\n');
  const blocks = new Map();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const rule = structuralRules.find((candidate) => candidate.match(line));
    if (!rule || blocks.has(rule.name)) {
      continue;
    }

    const collected = rule.collect(lines, index);
    const normalized = normalizeBlock(collected.block);
    if (normalized) {
      blocks.set(rule.name, normalized);
    }
    index = Math.max(index, collected.endIndex);
  }

  return blocks;
}

function resolveAgent(target) {
  if (!target) {
    return null;
  }

  if (inboxFiles[target]) {
    return target;
  }

  const fileName = path.basename(target);
  const match = fileName.match(/^inbox-(.+)\.md$/);
  if (!match) {
    return null;
  }

  return match[1];
}

function resolveTargets(args) {
  if (args.length === 0) {
    return Object.keys(inboxFiles);
  }

  const resolved = [];
  for (const arg of args) {
    const agent = resolveAgent(arg);
    if (!agent || !inboxFiles[agent]) {
      throw new Error(`Alvo de inbox inválido: ${arg}`);
    }
    if (!resolved.includes(agent)) {
      resolved.push(agent);
    }
  }
  return resolved;
}

function readEntryDate(entry) {
  const dateLine = entry.lines.find((line) => /^\*\*[Dd]ata:\*\*/.test(line.trim()));
  if (!dateLine) {
    return null;
  }

  const rawDate = dateLine.replace(/^\*\*[Dd]ata:\*\*\s*/, '').trim();
  if (!rawDate) {
    return null;
  }
  if (rawDate.includes('{')) {
    return { rawDate, parsedDate: null, isTemplate: true };
  }

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return { rawDate, parsedDate: null, isTemplate: false };
  }

  return { rawDate, parsedDate, isTemplate: false };
}

function shouldArchiveEntry(agent, entry, now) {
  if (!isClosedStatus(entry.status)) {
    return { archive: false };
  }

  if (agent === 'copilot') {
    const dateInfo = readEntryDate(entry);
    if (!dateInfo) {
      return {
        archive: false,
        warning: `data inválida ou ausente na entrada [${entry.id}]`,
      };
    }
    if (dateInfo.isTemplate) {
      return { archive: false };
    }
    if (!dateInfo.parsedDate) {
      return {
        archive: false,
        warning: `data inválida ou ausente na entrada [${entry.id}]`,
      };
    }

    const minDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    if (dateInfo.parsedDate > minDate) {
      return { archive: false };
    }
  }

  return { archive: true };
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function withTrailingNewline(text) {
  return text.endsWith('\n') ? text : `${text}\n`;
}

function buildActiveContent(content, keptEntries) {
  const blocks = extractStructuralBlocks(content);
  const segments = [];

  for (const key of ['heading', 'history', 'types', 'marker']) {
    const block = blocks.get(key);
    if (block) {
      segments.push(block);
    }
  }

  for (const entry of keptEntries) {
    const normalized = normalizeBlock(entry.lines);
    if (normalized) {
      segments.push(normalized);
    }
  }

  return withTrailingNewline(segments.join('\n\n---\n\n'));
}

function buildArchiveContent(existingContent, archivedEntries, timestamp) {
  const normalizedExisting = existingContent.trim();
  const segments = normalizedExisting ? [normalizedExisting] : [];
  segments.push(`<!-- Entradas arquivadas em ${timestamp} — limpeza de inbox por política de higiene -->`);

  for (const entry of archivedEntries) {
    const normalized = normalizeBlock(entry.lines);
    if (normalized) {
      segments.push(normalized);
    }
  }

  return withTrailingNewline(segments.join('\n\n---\n\n'));
}

function writeAtomically(filePath, content) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, content, 'utf8');
  fs.renameSync(tempPath, filePath);
}

function archiveInbox(agent, options) {
  const inboxPath = inboxFiles[agent];
  const archivePath = path.join(archiveDir, `inbox-${agent}-historico.md`);

  if (!fs.existsSync(inboxPath)) {
    return {
      agent,
      inboxPath,
      archivePath,
      archivedCount: 0,
      warnings: [`arquivo não encontrado: ${path.basename(inboxPath)}`],
    };
  }

  const content = fs.readFileSync(inboxPath, 'utf8');
  const entries = parseInboxEntries(content);
  const keptEntries = [];
  const archivedEntries = [];
  const warnings = [];

  for (const entry of entries) {
    const decision = shouldArchiveEntry(agent, entry, options.now);
    if (decision.warning) {
      warnings.push(decision.warning);
    }

    if (decision.archive) {
      archivedEntries.push(entry);
      continue;
    }

    keptEntries.push(entry);
  }

  if (options.write && archivedEntries.length > 0) {
    ensureDirectory(archiveDir);
    const existingArchive = fs.existsSync(archivePath)
      ? fs.readFileSync(archivePath, 'utf8')
      : '';
    const timestamp = options.now.toISOString().slice(0, 10);
    const nextArchiveContent = buildArchiveContent(existingArchive, archivedEntries, timestamp);
    const nextActiveContent = buildActiveContent(content, keptEntries);
    writeAtomically(archivePath, nextArchiveContent);
    writeAtomically(inboxPath, nextActiveContent);
  }

  return {
    agent,
    inboxPath,
    archivePath,
    archivedCount: archivedEntries.length,
    warnings,
  };
}

function parseArgs(argv) {
  const options = {
    write: false,
    quiet: false,
    now: new Date(),
  };
  const targets = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      options.write = true;
      continue;
    }
    if (arg === '--quiet') {
      options.quiet = true;
      continue;
    }
    if (arg === '--now') {
      const rawDate = argv[index + 1];
      if (!rawDate) {
        throw new Error('Uso: --now <ISO_DATE>');
      }
      const parsedDate = new Date(rawDate);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(`Data inválida para --now: ${rawDate}`);
      }
      options.now = parsedDate;
      index += 1;
      continue;
    }
    targets.push(arg);
  }

  return {
    options,
    targets: resolveTargets(targets),
  };
}

function formatCommand(agent) {
  const mode = ' -- --write';
  return `npm run squad:inbox:archive${mode} ${agent}`.trim();
}

function main() {
  const { options, targets } = parseArgs(process.argv.slice(2));
  let hasOutput = false;

  for (const agent of targets) {
    const result = archiveInbox(agent, options);
    if (result.archivedCount > 0) {
      hasOutput = true;
      if (options.write) {
        console.log(`🧹 inbox-${agent}.md — ${result.archivedCount} entrada(s) movida(s) para o histórico`);
      } else {
        console.log(
          `🧹 inbox-${agent}.md — ${result.archivedCount} entrada(s) encerrada(s) elegível(eis) para arquivamento. Rode: ${formatCommand(agent)}`,
        );
      }
    } else if (!options.quiet) {
      hasOutput = true;
      console.log(`✅ inbox-${agent}.md — sem entradas elegíveis para arquivamento`);
    }

    for (const warning of result.warnings) {
      hasOutput = true;
      console.log(`⚠️  inbox-${agent}.md — ${warning}`);
    }
  }

  if (!hasOutput && !options.quiet) {
    console.log('✅ Nenhuma ação de arquivamento necessária');
  }
}

main();

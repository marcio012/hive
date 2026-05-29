'use strict';

const { execSync } = require('child_process');
const path = require('path');
const {
  MAX_INBOX_BODY_LINES,
  parseInboxEntries,
} = require('./inbox-utils');

function runGit(command) {
  return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function runGitOptional(command) {
  try {
    return runGit(command);
  } catch {
    return '';
  }
}

function getStagedInboxFiles() {
  const output = runGit('git diff --cached --name-only --diff-filter=ACMR');
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /(^|\/)beehive\/construcao\/inbox-.*\.md$/.test(line));
}

function readStagedFile(filePath) {
  return runGitOptional(`git show :0:${filePath}`);
}

function readHeadFile(filePath) {
  return runGitOptional(`git show HEAD:${filePath}`);
}

function collectViolations(filePath) {
  const stagedEntries = parseInboxEntries(readStagedFile(filePath));
  const baseEntries = parseInboxEntries(readHeadFile(filePath));
  const baseById = new Map(baseEntries.map((entry) => [entry.id, entry]));
  const violations = [];

  for (const stagedEntry of stagedEntries) {
    const baseEntry = baseById.get(stagedEntry.id);
    const isNewEntry = !baseEntry;
    const bodyChanged = !baseEntry || stagedEntry.bodyText !== baseEntry.bodyText;

    if (!bodyChanged) {
      continue;
    }

    if (!isNewEntry && baseEntry.bodyLineCount > MAX_INBOX_BODY_LINES) {
      continue;
    }

    if (stagedEntry.bodyLineCount <= MAX_INBOX_BODY_LINES) {
      continue;
    }

    violations.push({
      filePath,
      id: stagedEntry.id,
      bodyLineCount: stagedEntry.bodyLineCount,
    });
  }

  return violations;
}

function main() {
  const inboxFiles = getStagedInboxFiles();
  if (inboxFiles.length === 0) {
    process.exit(0);
  }

  const violations = inboxFiles.flatMap(collectViolations);

  if (violations.length === 0) {
    process.exit(0);
  }

  for (const violation of violations) {
    console.error(
      `❌ DIR-088: entrada [${violation.id}] em ${path.basename(violation.filePath)} tem ${violation.bodyLineCount} linhas no corpo (limite: ${MAX_INBOX_BODY_LINES})`,
    );
    console.error(
      '   Mova o contrato técnico para beehive/construcao/work_orders/ e referencie via wo_ref.',
    );
    console.error('   Template: beehive/construcao/work_orders/TEMPLATE_HANDOFF.md');
  }

  process.exit(1);
}

main();

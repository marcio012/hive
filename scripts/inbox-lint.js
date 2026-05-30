'use strict';

const fs = require('fs');
const path = require('path');
const {
  MAX_INBOX_BODY_LINES,
  isClosedStatus,
  parseInboxEntries,
} = require('./inbox-utils');

const rootDir = path.resolve(__dirname, '..');
const inboxFiles = [
  path.join(rootDir, 'beehive/construcao/inbox-claude.md'),
  path.join(rootDir, 'beehive/construcao/inbox-copilot-hive.md'),
  path.join(rootDir, 'beehive/construcao/inbox-copilot-tos.md'),
  path.join(rootDir, 'beehive/construcao/inbox-gemini.md'),
];

function lintFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      fileName: path.basename(filePath),
      missing: true,
      activeViolations: [],
      ignoredViolations: [],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const entries = parseInboxEntries(content);
  const activeViolations = [];
  const ignoredViolations = [];

  for (const entry of entries) {
    if (entry.bodyLineCount <= MAX_INBOX_BODY_LINES) {
      continue;
    }

    if (isClosedStatus(entry.status)) {
      ignoredViolations.push(entry);
      continue;
    }

    activeViolations.push(entry);
  }

  return {
    fileName: path.basename(filePath),
    missing: false,
    activeViolations,
    ignoredViolations,
  };
}

let hasActiveViolations = false;

for (const filePath of inboxFiles) {
  const result = lintFile(filePath);

  if (result.missing) {
    console.log(`⚠️  ${result.fileName} — arquivo não encontrado`);
    continue;
  }

  if (result.activeViolations.length === 0) {
    console.log(`✅  ${result.fileName} — sem violações`);
  } else {
    hasActiveViolations = true;
    for (const violation of result.activeViolations) {
      console.log(
        `⚠️  ${result.fileName} — [${violation.id}] — ${violation.bodyLineCount} linhas (limite: ${MAX_INBOX_BODY_LINES})`,
      );
    }
  }

  for (const violation of result.ignoredViolations) {
    console.log(
      `ℹ️  ${result.fileName} — [${violation.id}] ignorada (status encerrado, ${violation.bodyLineCount} linhas)`,
    );
  }
}

if (!hasActiveViolations) {
  console.log('✅  Nenhuma violação ativa de higiene de inbox');
}

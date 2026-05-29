'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const inboxFiles = [
  path.join(rootDir, 'beehive/construcao/inbox-claude.md'),
  path.join(rootDir, 'beehive/construcao/inbox-copilot.md'),
  path.join(rootDir, 'beehive/construcao/inbox-gemini.md'),
];
const maxBodyLines = 30;

function splitBlocks(content) {
  return content
    .split(/^### \[/m)
    .slice(1)
    .map((chunk) => `### [${chunk}`);
}

function parseBlock(block) {
  const lines = block.replace(/\r/g, '').split('\n');
  const header = lines[0] || '';
  const idMatch = header.match(/^### \[([^\]]+)\]/);
  const id = idMatch ? idMatch[1] : 'ID desconhecido';
  const statusIndex = lines.findIndex((line) => /^\*\*[Ss]tatus:\*\*/.test(line.trim()));

  if (statusIndex === -1) {
    return { id, bodyLineCount: 0 };
  }

  const bodyLines = lines.slice(statusIndex + 1);

  while (bodyLines.length > 0) {
    const lastLine = bodyLines[bodyLines.length - 1].trim();
    if (lastLine === '' || lastLine === '---') {
      bodyLines.pop();
      continue;
    }
    break;
  }

  return {
    id,
    bodyLineCount: bodyLines.length,
  };
}

function lintFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      fileName: path.basename(filePath),
      missing: true,
      violations: [],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = splitBlocks(content);
  const violations = blocks
    .map(parseBlock)
    .filter((block) => block.bodyLineCount > maxBodyLines);

  return {
    fileName: path.basename(filePath),
    missing: false,
    violations,
  };
}

let hasViolations = false;

for (const filePath of inboxFiles) {
  const result = lintFile(filePath);

  if (result.missing) {
    console.log(`⚠️  ${result.fileName} — arquivo não encontrado`);
    continue;
  }

  if (result.violations.length === 0) {
    console.log(`✅  ${result.fileName} — sem violações`);
    continue;
  }

  hasViolations = true;
  for (const violation of result.violations) {
    console.log(
      `⚠️  ${result.fileName} — [${violation.id}] — ${violation.bodyLineCount} linhas (limite: ${maxBodyLines})`,
    );
  }
}

if (!hasViolations) {
  console.log('✅  Nenhuma violação ativa de higiene de inbox');
}

'use strict';

const MAX_INBOX_BODY_LINES = 30;
const CLOSED_STATUS_PREFIXES = ['consumida', 'executada', 'arquivada'];

function normalizeStatus(status = '') {
  return status.trim().toLowerCase();
}

function isClosedStatus(status = '') {
  const normalized = normalizeStatus(status);
  return CLOSED_STATUS_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function trimTrailingBodyLines(lines) {
  const trimmed = [...lines];
  while (trimmed.length > 0) {
    const lastLine = trimmed[trimmed.length - 1].trim();
    if (lastLine === '' || lastLine === '---') {
      trimmed.pop();
      continue;
    }
    break;
  }
  return trimmed;
}

function buildEntry(rawLines) {
  const lines = rawLines.map((line) => line.replace(/\r$/, ''));
  const header = lines[0] || '';
  const idMatch = header.match(/^### \[([^\]]+)\]/);
  const id = idMatch ? idMatch[1] : 'ID desconhecido';
  const statusIndex = lines.findIndex((line) => /^\*\*[Ss]tatus:\*\*/.test(line.trim()));
  const statusLine = statusIndex >= 0 ? lines[statusIndex] : '';
  const status = statusLine.replace(/^\*\*[Ss]tatus:\*\*\s*/, '').trim();
  const bodyLines = statusIndex >= 0 ? trimTrailingBodyLines(lines.slice(statusIndex + 1)) : [];

  return {
    id,
    header,
    lines,
    blockText: lines.join('\n'),
    status,
    statusIndex,
    bodyLines,
    bodyText: bodyLines.join('\n'),
    bodyLineCount: bodyLines.length,
  };
}

function parseInboxEntries(content) {
  const lines = content.replace(/\r/g, '').split('\n');
  const entries = [];
  let currentLines = null;
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const isFence = trimmed.startsWith('```');

    if (!inCodeFence && /^### \[[^\]]+\]/.test(line)) {
      if (currentLines) {
        entries.push(buildEntry(currentLines));
      }
      currentLines = [line];
      continue;
    }

    if (currentLines) {
      currentLines.push(line);
    }

    if (isFence) {
      inCodeFence = !inCodeFence;
    }
  }

  if (currentLines) {
    entries.push(buildEntry(currentLines));
  }

  return entries;
}

module.exports = {
  MAX_INBOX_BODY_LINES,
  isClosedStatus,
  normalizeStatus,
  parseInboxEntries,
};

import { promises as fs } from 'fs';
import * as path from 'path';

import { AgentName, InboxEntry } from './types';

const CLOSED_STATUS_PREFIXES = ['consumida', 'executada', 'arquivada'];
const ENTRY_HEADER_REGEX = /^### \[([^\]]+)\]\s*(.*)$/;

function normalizeMetadataKey(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

function normalizeAgentName(value: string | undefined): AgentName | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (/copilot[-\s]?hive/.test(normalized)) {
    return 'copilot-hive';
  }
  if (/copilot[-\s]?tos/.test(normalized)) {
    return 'copilot-tos';
  }
  if (normalized.includes('claude')) {
    return 'claude';
  }
  if (normalized.includes('copilot')) {
    return 'copilot';
  }
  if (normalized.includes('gemini')) {
    return 'gemini';
  }
  if (normalized.includes('marcio')) {
    return 'marcio';
  }

  return null;
}

function extractTargetFromDe(value: string | undefined): AgentName | null {
  if (!value || !value.includes('→')) {
    return null;
  }

  const [, target] = value.split('→');
  return normalizeAgentName(target);
}

function buildEntry(
  lines: string[],
  filePath: string,
  source: AgentName,
): InboxEntry | null {
  const header = lines[0]?.trim() ?? '';
  const headerMatch = header.match(ENTRY_HEADER_REGEX);

  if (!headerMatch) {
    return null;
  }

  const metadata: Record<string, string> = {};
  let bodyStartIndex = lines.length;

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    const metadataMatch = line.match(/^\*\*\s*([^:*]+?)\s*:\*\*\s*(.+)$/);
    if (!metadataMatch) {
      bodyStartIndex = index;
      break;
    }

    metadata[normalizeMetadataKey(metadataMatch[1])] = metadataMatch[2].trim();
  }

  const bodyLines = lines.slice(bodyStartIndex);
  while (bodyLines.length > 0) {
    const lastLine = bodyLines[bodyLines.length - 1].trim();
    if (lastLine === '' || lastLine === '---') {
      bodyLines.pop();
      continue;
    }
    break;
  }

  return {
    id: headerMatch[1],
    title: headerMatch[2].trim() || headerMatch[1],
    source,
    filePath,
    status: metadata.status ?? '',
    tipo: metadata.tipo ?? null,
    destinatario: extractTargetFromDe(metadata.de),
    bodyText: bodyLines.join('\n').trim(),
    metadata,
  };
}

export function normalizeStatus(status = ''): string {
  return status.trim().toLowerCase();
}

export function isClosedStatus(status = ''): boolean {
  const normalized = normalizeStatus(status);
  return CLOSED_STATUS_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function insertInboxEntry(content: string, entry: string): string {
  const anchor = '<!-- novas entradas abaixo';
  const anchorIndex = content.indexOf(anchor);

  if (anchorIndex >= 0) {
    const lineEnd = content.indexOf('\n', anchorIndex);
    if (lineEnd === -1) {
      return `${content}\n${entry}`;
    }

    return `${content.slice(0, lineEnd + 1)}\n${entry}${content.slice(lineEnd + 1)}`;
  }

  const separatorIndex = content.indexOf('\n---\n');
  if (separatorIndex >= 0) {
    const insertAt = separatorIndex + '\n---\n'.length;
    return `${content.slice(0, insertAt)}\n${entry}${content.slice(insertAt)}`;
  }

  return `${content.trimEnd()}\n\n${entry}`;
}

export function buildDispatchEntry(entry: InboxEntry, target: AgentName): string {
  const now = new Date();
  const iso = now.toISOString();
  const date = iso.slice(0, 10);
  const identifier = iso.replace(/[-:.TZ]/g, '').slice(0, 14);
  const sourceLabel = entry.source.toUpperCase();
  const targetLabel =
    target === 'claude'
      ? 'Claude'
      : target === 'copilot'
        ? 'Copilot'
        : target === 'copilot-hive'
          ? 'Copilot-Hive'
          : target === 'copilot-tos'
            ? 'Copilot-TOS'
            : 'Gemini';

  const metadataLines = [
    `**De:** Orchestrator → ${targetLabel}`,
    `**Data:** ${date}`,
    `**tipo:** ${entry.tipo ?? 'handoff-executavel'}`,
    '**Status:** pendente',
    `**source_entry:** ${entry.id}`,
    `**source_agent:** ${entry.source}`,
  ];

  for (const key of ['thread', 'backlog_ref', 'wo_ref', 'dependencia']) {
    const value = entry.metadata[key];
    if (value) {
      metadataLines.push(`**${key}:** ${value}`);
    }
  }

  return [
    `### [ORCH-${identifier}-${sourceLabel}] ${entry.title}`,
    ...metadataLines,
    '',
    'Encaminhado automaticamente pelo Orchestrator Core.',
    entry.bodyText ? '' : undefined,
    entry.bodyText || undefined,
    '',
    '---',
    '',
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n');
}

export async function listInboxPaths(rootDir: string): Promise<string[]> {
  return ['claude', 'copilot', 'gemini', 'copilot-hive', 'copilot-tos', 'marcio'].map((agent) =>
    path.join(rootDir, 'beehive', 'construcao', `inbox-${agent}.md`),
  );
}

export async function parseInboxFile(filePath: string): Promise<InboxEntry[]> {
  const filename = path.basename(filePath);
  const source = normalizeAgentName(filename) ?? 'claude';
  let content = '';

  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch {
    return [];
  }

  const lines = content.replace(/\r/g, '').split('\n');
  const entries: InboxEntry[] = [];
  let currentLines: string[] | null = null;
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const isFence = trimmed.startsWith('```');
    const isHeader = /^### \[[^\]]+\]/.test(line);

    if (!inCodeFence && isHeader) {
      if (currentLines) {
        const entry = buildEntry(currentLines, filePath, source);
        if (entry) {
          entries.push(entry);
        }
      }

      currentLines = [line];
      inCodeFence = false;
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
    const entry = buildEntry(currentLines, filePath, source);
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

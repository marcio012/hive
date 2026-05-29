'use strict';

const fs = require('fs');
const path = require('path');

const {
  archiveDir,
  archiveInbox,
  inboxFiles,
  writeAtomically,
} = require('./inbox-archive');
const { getPendingEntries, parseInboxEntries } = require('./inbox-utils');

const rootDir = path.resolve(__dirname, '..');
const projectPath = path.resolve(process.env.PROJECT_PATH || rootDir);

function usage() {
  console.log('Usage: node scripts/inbox-faixa-a.js <--dry-run|--write> <agente> [--now ISO_DATE]');
}

function parseArgs(argv) {
  let mode = null;
  let now = new Date();
  const targets = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run' || arg === '--write') {
      mode = arg;
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
      now = parsedDate;
      index += 1;
      continue;
    }
    targets.push(arg);
  }

  if (!mode || targets.length !== 1 || !inboxFiles[targets[0]]) {
    usage();
    process.exit(1);
  }

  return {
    mode,
    agent: targets[0],
    now,
  };
}

function readInboxEntries(agent) {
  const inboxPath = inboxFiles[agent];
  if (!fs.existsSync(inboxPath)) {
    throw new Error(`Inbox não encontrada: ${path.relative(projectPath, inboxPath)}`);
  }

  const content = fs.readFileSync(inboxPath, 'utf8');
  return {
    inboxPath,
    content,
    entries: parseInboxEntries(content),
  };
}

function buildArchiveAuditId(agent, now) {
  const iso = now.toISOString();
  const datePart = iso.slice(0, 10);
  const timePart = iso.slice(11, 16).replace(':', '');
  return `ARCH-${datePart}-${timePart}-${agent}`;
}

function assessImpact(count) {
  if (count > 30) {
    return 'high';
  }
  if (count >= 10) {
    return 'medium';
  }
  return 'low';
}

function buildAuditLogContent({
  archiveId,
  now,
  agent,
  inboxPath,
  archivePath,
  entriesArchived,
  entriesRemaining,
  impactAssessment,
  archivedIds,
}) {
  const relativeInboxPath = path.relative(projectPath, inboxPath);
  const relativeArchivePath = path.relative(projectPath, archivePath);
  const archivedList = archivedIds.map((id) => `- ${id}`).join('\n');

  return `---
id: ${archiveId}
executed_at: ${now.toISOString()}
executed_by: ${agent}
authorized_by: delegado-faixa-a
trigger: agente-autonomo
inbox_file: ${relativeInboxPath}
entries_archived: ${entriesArchived}
entries_remaining: ${entriesRemaining}
archive_file: ${relativeArchivePath}
dry_run_shown: false
impact_assessment: ${impactAssessment}
---

## Entradas arquivadas

${archivedList || '- nenhuma'}
`;
}

function upsertNotification(inboxPath, entryId, entryText) {
  const content = fs.existsSync(inboxPath) ? fs.readFileSync(inboxPath, 'utf8') : '';
  const entries = parseInboxEntries(content);
  if (entries.some((entry) => entry.id === entryId)) {
    return false;
  }

  const marker = '<!-- novas entradas abaixo';
  const markerIndex = content.indexOf(marker);
  const block = `---\n\n${entryText.trim()}\n\n`;

  let nextContent;
  if (markerIndex >= 0) {
    const markerLineEnd = content.indexOf('\n', markerIndex);
    const insertAt = markerLineEnd >= 0 ? markerLineEnd + 1 : content.length;
    nextContent = `${content.slice(0, insertAt)}\n${block}${content.slice(insertAt)}`;
  } else if (content.trim()) {
    nextContent = `${content.trimEnd()}\n\n${block}`;
  } else {
    nextContent = `${entryText.trim()}\n`;
  }

  writeAtomically(inboxPath, nextContent.endsWith('\n') ? nextContent : `${nextContent}\n`);
  return true;
}

function createNotifications(agent, archiveId, auditLogRelativePath, now) {
  const others = Object.keys(inboxFiles).filter((candidate) => candidate !== agent);
  const date = now.toISOString().slice(0, 10);
  const created = [];

  for (const other of others) {
    const entryId = `${archiveId}-NOTIF-${other.toUpperCase()}`;
    const title = `Arquivamento Faixa A executado — inbox-${agent}`;
    const entryText = `### [${entryId}] ${title}
**De:** ${agent} (Executor) → ${other} (Executor)
**Data:** ${date}
**tipo:** informativo
**thread:** autorizacao-arquivamento-inbox
**wo_ref:** ${auditLogRelativePath}
**Status:** consumida — ✅ Notificação automática registrada em ${date}.

Arquivamento Faixa A executado para \`inbox-${agent}.md\`. Log de auditoria: \`${auditLogRelativePath}\`.`;

    if (upsertNotification(inboxFiles[other], entryId, entryText)) {
      created.push(other);
    }
  }

  return created;
}

function main() {
  const { mode, agent, now } = parseArgs(process.argv.slice(2));
  const { inboxPath, entries } = readInboxEntries(agent);
  const pendingEntries = getPendingEntries(entries);
  const preview = archiveInbox(agent, {
    now,
    policy: 'faixa-a',
    write: false,
  });

  if (mode === '--dry-run') {
    if (preview.archivedCount === 0) {
      console.log(`✅ inbox-${agent}.md — nenhuma entrada elegível para Faixa A`);
      return;
    }

    console.log(`🧪 inbox-${agent}.md — ${preview.archivedCount} entrada(s) elegível(eis) para Faixa A`);
    for (const entry of preview.archivedEntries) {
      console.log(`- [${entry.id}] ${entry.title}`);
    }
    return;
  }

  if (pendingEntries.length > 0) {
    console.error(`❌ inbox-${agent}.md — abortado: há ${pendingEntries.length} pendência(s) ativa(s) no inbox`);
    process.exit(1);
  }

  if (preview.archivedCount === 0) {
    console.log(`✅ inbox-${agent}.md — nenhuma entrada elegível para Faixa A`);
    return;
  }

  const result = archiveInbox(agent, {
    now,
    policy: 'faixa-a',
    write: true,
  });

  const archiveId = buildArchiveAuditId(agent, now);
  const logPath = path.join(archiveDir, `${archiveId}.md`);
  const auditLogRelativePath = path.relative(projectPath, logPath);
  const impactAssessment = assessImpact(result.archivedCount);
  const remainingEntries = parseInboxEntries(fs.readFileSync(inboxPath, 'utf8')).length;

  writeAtomically(
    logPath,
    buildAuditLogContent({
      archiveId,
      now,
      agent,
      inboxPath,
      archivePath: result.archivePath,
      entriesArchived: result.archivedCount,
      entriesRemaining: remainingEntries,
      impactAssessment,
      archivedIds: result.archivedEntries.map((entry) => entry.id),
    }),
  );

  const createdNotifications = createNotifications(agent, archiveId, auditLogRelativePath, now);
  console.log(`🧹 inbox-${agent}.md — ${result.archivedCount} entrada(s) arquivada(s) via Faixa A`);
  console.log(`📝 Log: ${auditLogRelativePath}`);
  if (createdNotifications.length > 0) {
    console.log(`📣 Notificações: ${createdNotifications.join(', ')}`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
}

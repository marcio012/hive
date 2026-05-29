'use strict';

const fs = require('fs');
const path = require('path');
const { getPendingEntries, parseInboxEntries } = require('./inbox-utils');

function formatStatus(status = '') {
  return status.trim() || 'pendente';
}

function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Uso: node scripts/inbox-pending.js <arquivo>');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo de inbox não encontrado: ${filePath}`);
    process.exit(1);
  }

  const entries = parseInboxEntries(fs.readFileSync(filePath, 'utf8'));
  const pendingEntries = getPendingEntries(entries);

  for (const entry of pendingEntries) {
    console.log(`  [${entry.id}] ${entry.title} (${formatStatus(entry.status)})`);
  }
}

main();

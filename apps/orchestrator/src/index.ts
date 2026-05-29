import * as path from 'path';

import { OrchestratorLogger } from './logger';
import { StateStore } from './state';
import { OrchestratorWatcher } from './watcher';

async function main(): Promise<void> {
  const rootDir = path.resolve(__dirname, '..', '..', '..');
  const logger = new OrchestratorLogger();
  const stateStore = new StateStore(rootDir);
  const watcher = new OrchestratorWatcher(rootDir, stateStore, logger);

  const shutdown = async (signal: string) => {
    await logger.log('info', `Encerrando Orchestrator Core (${signal})`);
    await watcher.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  await watcher.start();
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(`[orchestrator:error] ${message}`);
  process.exitCode = 1;
});

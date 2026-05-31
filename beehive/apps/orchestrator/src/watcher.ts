import * as path from 'path';

import { TaskStore } from './db/task-store';
import { DeadmanSwitch } from './deadman';
import { Dispatcher } from './dispatcher';
import { isClosedStatus, listInboxPaths, parseInboxFile } from './inbox';
import { OrchestratorLogger } from './logger';
import { Router } from './router';
import { StateStore } from './state';

const RETRY_DELAY_MS = 60_000;

interface RetryHandle {
  attempts: number;
  timer: NodeJS.Timeout;
}

export class OrchestratorWatcher {
  private readonly router: Router;
  private readonly dispatcher: Dispatcher;
  private readonly deadman: DeadmanSwitch;
  private processing = false;
  private pendingRescan = false;
  private debounceTimer: NodeJS.Timeout | null = null;
  private timeoutInterval: NodeJS.Timeout | null = null;
  private readonly retries = new Map<string, RetryHandle>();

  constructor(
    private readonly rootDir: string,
    private readonly stateStore: StateStore,
    private readonly logger: OrchestratorLogger,
    private readonly taskStore: TaskStore,
  ) {
    this.router = new Router(rootDir);
    this.dispatcher = new Dispatcher(rootDir, stateStore, logger, taskStore);
    this.deadman = new DeadmanSwitch(stateStore, logger);
  }

  async start(): Promise<void> {
    await this.router.load();

    const state = await this.stateStore.ensureState([]);
    if (state.status !== 'paused') {
      await this.deadman.resumeWatching();
    }

    await this.processAll('startup');

    this.timeoutInterval = setInterval(() => {
      void this.deadman.checkForTimeout();
      void this.processAll('polling');
    }, 60_000);

    await this.logger.log('info', 'Orchestrator Core iniciado (Modo Broker)');
  }

  async stop(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.timeoutInterval) {
      clearInterval(this.timeoutInterval);
      this.timeoutInterval = null;
    }

    for (const retry of this.retries.values()) {
      clearTimeout(retry.timer);
    }
    this.retries.clear();
  }

  private async processAll(reason: string): Promise<void> {
    if (this.processing) {
      this.pendingRescan = true;
      return;
    }

    this.processing = true;

    try {
      do {
        this.pendingRescan = false;
        await this.processOnce(reason);
      } while (this.pendingRescan);
    } finally {
      this.processing = false;
    }
  }

  private async processOnce(reason: string): Promise<void> {
    const state = await this.stateStore.readState();
    if (state?.status === 'paused') {
      return;
    }

    const config = await this.stateStore.readConfig();
    if (!config.autoMode) {
      await this.deadman.resumeWatching();
      if (reason === 'startup') {
        await this.logger.log('info', 'autoMode desligado: observando sem despachar');
      }
      return;
    }

    await this.deadman.resumeWatching();

    const currentState = await this.stateStore.readState();
    const processedIds = new Set(currentState?.processedEntries ?? []);

    const inboxPaths = await listInboxPaths(this.rootDir);
    for (const inboxPath of inboxPaths) {
      const entries = await parseInboxFile(inboxPath);
      for (const entry of entries) {
        if (processedIds.has(entry.id) || isClosedStatus(entry.status)) {
          continue;
        }

        const decision = this.router.resolve(entry);
        if (!decision) {
          continue;
        }

        await this.deadman.startDispatch(entry.id);
        const result = await this.dispatcher.dispatch(decision, entry);

        if (result.outcome === 'dispatched') {
          await this.deadman.recordSuccess();
        } else if (result.outcome === 'failed') {
          await this.deadman.recordFailure(entry.id, result.reason ?? 'dispatch falhou');
          return;
        }
      }
    }
  }
}

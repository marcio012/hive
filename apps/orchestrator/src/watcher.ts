import chokidar, { FSWatcher } from 'chokidar';
import { promises as fs } from 'fs';
import * as path from 'path';

import { DeadmanSwitch } from './deadman';
import { isClosedStatus, listInboxPaths, normalizeStatus, parseInboxFile } from './inbox';
import { Dispatcher } from './dispatcher';
import { OrchestratorLogger } from './logger';
import { Router } from './router';
import { StateStore } from './state';
import { DispatchResult, InboxEntry } from './types';

const RETRY_DELAY_MS = 60_000;

interface RetryHandle {
  attempts: number;
  timer: NodeJS.Timeout;
}

export class OrchestratorWatcher {
  private readonly router: Router;
  private readonly dispatcher: Dispatcher;
  private readonly deadman: DeadmanSwitch;
  private watcher: FSWatcher | null = null;
  private processing = false;
  private pendingRescan = false;
  private debounceTimer: NodeJS.Timeout | null = null;
  private timeoutInterval: NodeJS.Timeout | null = null;
  private readonly retries = new Map<string, RetryHandle>();

  constructor(
    private readonly rootDir: string,
    private readonly stateStore: StateStore,
    private readonly logger: OrchestratorLogger,
  ) {
    this.router = new Router(rootDir);
    this.dispatcher = new Dispatcher(rootDir, stateStore, logger);
    this.deadman = new DeadmanSwitch(stateStore, logger);
  }

  async start(): Promise<void> {
    await this.router.load();

    const inboxPaths = await listInboxPaths(this.rootDir);
    const seedEntries = (await Promise.all(inboxPaths.map((filePath) => parseInboxFile(filePath))))
      .flat()
      .map((entry) => entry.id);

    const state = await this.stateStore.ensureState(seedEntries);
    if (state.status !== 'paused') {
      await this.deadman.resumeWatching();
    }

    await this.processAll('startup');

    this.watcher = chokidar.watch(
      [
        path.join(this.rootDir, 'beehive', 'construcao', 'inbox-*.md'),
        path.join(this.rootDir, '.hive-agent', 'hive-ui-config.json'),
        path.join(this.rootDir, '.hive-agent', 'locks.json'),
      ],
      {
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 300,
          pollInterval: 100,
        },
      },
    );

    this.watcher.on('all', () => {
      this.scheduleProcess();
    });

    this.timeoutInterval = setInterval(() => {
      void this.deadman.checkForTimeout();
    }, 60_000);

    await this.logger.log('info', 'Orchestrator Core iniciado e observando inboxes');
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

    await this.watcher?.close();
    this.watcher = null;
  }

  private scheduleProcess(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      void this.processAll('watcher');
    }, 400);
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

    const inboxPaths = await listInboxPaths(this.rootDir);
    for (const filePath of inboxPaths) {
      const entries = await parseInboxFile(filePath);

      for (const entry of entries) {
        if (!(await this.shouldHandleEntry(entry))) {
          continue;
        }

        const decision = this.router.resolve(entry);
        if (!decision) {
          continue;
        }

        if (decision.action === 'pause_and_escalate') {
          await this.deadman.pause(`sem rota segura para ${entry.id}`);
          return;
        }

        if (this.retries.has(entry.id)) {
          continue;
        }

        await this.handleDispatch(entry, 0);
        return;
      }
    }
  }

  private async shouldHandleEntry(entry: InboxEntry): Promise<boolean> {
    if (entry.id.startsWith('ORCH-')) {
      return false;
    }

    if (isClosedStatus(entry.status) || normalizeStatus(entry.status) !== 'pendente') {
      return false;
    }

    const state = await this.stateStore.readState();
    if (!state) {
      return true;
    }

    return !state.processedEntries.includes(entry.id);
  }

  private async handleDispatch(entry: InboxEntry, attempts: number): Promise<void> {
    const decision = this.router.resolve(entry);
    if (!decision) {
      return;
    }

    await this.deadman.startDispatch(entry.id);
    const result = await this.dispatcher.dispatch(decision, entry);
    await this.handleDispatchResult(entry, attempts, result);
  }

  private async handleDispatchResult(
    entry: InboxEntry,
    attempts: number,
    result: DispatchResult,
  ): Promise<void> {
    if (result.outcome === 'dispatched' || result.outcome === 'ignored') {
      await this.deadman.recordSuccess();
      return;
    }

    if (result.outcome === 'retry' && attempts < 3) {
      await this.deadman.resumeWatching();
      const timer = setTimeout(() => {
        void this.retryEntry(entry.id, attempts + 1);
      }, RETRY_DELAY_MS);

      this.retries.set(entry.id, {
        attempts: attempts + 1,
        timer,
      });

      await this.logger.log(
        'info',
        `Entrada ${entry.id} enfileirada para nova tentativa em 60s (${attempts + 1}/3)`,
      );
      return;
    }

    await this.deadman.recordFailure(entry.id, result.reason ?? 'falha desconhecida');
  }

  private async retryEntry(entryId: string, attempts: number): Promise<void> {
    const handle = this.retries.get(entryId);
    if (!handle || handle.attempts !== attempts) {
      return;
    }

    this.retries.delete(entryId);

    const entry = await this.findEntry(entryId);
    if (!entry || !(await this.shouldHandleEntry(entry))) {
      return;
    }

    await this.handleDispatch(entry, attempts);
  }

  private async findEntry(entryId: string): Promise<InboxEntry | null> {
    const inboxPaths = await listInboxPaths(this.rootDir);
    for (const filePath of inboxPaths) {
      const entries = await parseInboxFile(filePath);
      const match = entries.find((entry) => entry.id === entryId);
      if (match) {
        return match;
      }
    }

    return null;
  }
}

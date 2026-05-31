import * as path from 'path';

import { TaskStore } from './db/task-store';
import { DeadmanSwitch } from './deadman';
import { Dispatcher } from './dispatcher';
import { isClosedStatus, listInboxPaths, parseInboxFile } from './inbox';
import { OrchestratorLogger } from './logger';
import { Router } from './router';
import { StateStore } from './state';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [2 * 60_000, 5 * 60_000, 10 * 60_000];

interface RetryHandle {
  attempts: number;
  timer: NodeJS.Timeout;
  nextAttemptAt: number;
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

        const pendingRetry = this.retries.get(entry.id);
        if (pendingRetry && pendingRetry.nextAttemptAt > Date.now()) {
          continue;
        }

        const decision = this.router.resolve(entry);
        if (!decision) {
          continue;
        }

        if (decision.action === 'pause_and_escalate') {
          await this.deadman.pause(`Entrada sem rota definida: ${entry.id} — ${entry.title}`);
          return;
        }

        await this.deadman.startDispatch(entry.id);
        const result = await this.dispatcher.dispatch(decision, entry);

        if (result.outcome === 'dispatched') {
          const pending = this.retries.get(entry.id);
          if (pending) {
            clearTimeout(pending.timer);
            this.retries.delete(entry.id);
          }
          await this.deadman.recordSuccess();
        } else if (result.outcome === 'retry') {
          await this.deadman.resumeWatching();
          this.scheduleRetry(entry.id);
        } else if (result.outcome === 'failed') {
          await this.deadman.recordFailure(entry.id, result.reason ?? 'dispatch falhou');
          return;
        }
      }
    }
  }

  private scheduleRetry(entryId: string): void {
    const existing = this.retries.get(entryId);
    const attempts = (existing?.attempts ?? 0) + 1;

    if (existing?.timer) {
      clearTimeout(existing.timer);
    }

    if (attempts > MAX_RETRY_ATTEMPTS) {
      this.retries.delete(entryId);
      void this.logger.log(
        'warn',
        `Entrada ${entryId}: ${MAX_RETRY_ATTEMPTS} tentativas esgotadas (lock ocupado) — entrada ignorada`,
      );
      void this.stateStore.markProcessed(entryId);
      return;
    }

    const delayMs = RETRY_DELAYS_MS[attempts - 1] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
    const nextAttemptAt = Date.now() + delayMs;
    const timer = setTimeout(() => {
      void this.processAll('retry');
    }, delayMs);

    this.retries.set(entryId, { attempts, timer, nextAttemptAt });
    void this.logger.log(
      'info',
      `Entrada ${entryId}: retry ${attempts}/${MAX_RETRY_ATTEMPTS} agendado em ${delayMs / 1000}s`,
    );
  }
}

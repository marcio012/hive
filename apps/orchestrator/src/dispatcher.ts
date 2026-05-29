import { execFile as execFileCallback } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { buildDispatchEntry, insertInboxEntry } from './inbox';
import { OrchestratorLogger } from './logger';
import { StateStore } from './state';
import { AgentName, DispatchResult, InboxEntry, LockState, RouteDecision } from './types';

const execFile = promisify(execFileCallback);

export class Dispatcher {
  private readonly proxyScriptPath: string;
  private readonly lockPath: string;

  constructor(
    private readonly rootDir: string,
    private readonly stateStore: StateStore,
    private readonly logger: OrchestratorLogger,
  ) {
    this.proxyScriptPath = path.join(rootDir, '.agile-squad', 'proxy.sh');
    this.lockPath = path.join(rootDir, '.hive-agent', 'locks.json');
  }

  async dispatch(decision: RouteDecision, entry: InboxEntry): Promise<DispatchResult> {
    if (!decision.target) {
      return { outcome: 'ignored' };
    }

    if (entry.source === decision.target) {
      return { outcome: 'ignored' };
    }

    const lock = await this.readLock();
    if (lock.owner && lock.owner !== decision.target) {
      return {
        outcome: 'retry',
        reason: `lock ocupado por ${lock.owner}`,
      };
    }

    const targetPath = path.join(
      this.rootDir,
      'beehive',
      'construcao',
      `inbox-${decision.target}.md`,
    );

    const existingContent = await this.readTextFile(targetPath);
    const nextEntry = buildDispatchEntry(entry, decision.target);
    const updatedContent = insertInboxEntry(existingContent, nextEntry);

    await this.stateStore.writeTextAtomic(targetPath, updatedContent);
    await this.stateStore.markProcessed(entry.id);

    try {
      await this.acquireLock(decision.target, `Orchestrator dispatch ${entry.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.logger.log(
        'warn',
        `Dispatch ${entry.id} escrito, mas lock para ${decision.target} não foi adquirido: ${message}`,
      );
    }

    await this.logger.log('info', `Entrada ${entry.id} roteada para ${decision.target}`);
    return { outcome: 'dispatched' };
  }

  private async acquireLock(target: AgentName, activity: string): Promise<void> {
    await execFile(
      'bash',
      [this.proxyScriptPath, 'hive', 'lock', 'set', target, activity],
      { cwd: this.rootDir },
    );
  }

  private async readLock(): Promise<LockState> {
    try {
      const raw = JSON.parse(await fs.readFile(this.lockPath, 'utf8')) as Record<string, unknown>;
      if (typeof raw.owner === 'string') {
        return {
          owner: raw.owner as AgentName,
          activity: typeof raw.activity === 'string' ? raw.activity : null,
          acquiredAt: typeof raw.acquired_at === 'string' ? raw.acquired_at : null,
        };
      }
    } catch {
      return {
        owner: null,
        activity: null,
        acquiredAt: null,
      };
    }

    return {
      owner: null,
      activity: null,
      acquiredAt: null,
    };
  }

  private async readTextFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return '';
    }
  }
}

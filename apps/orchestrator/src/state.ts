import { promises as fs } from 'fs';
import * as path from 'path';

import { HiveConfig, OrchestratorState } from './types';

const DEFAULT_CONFIG: HiveConfig = {
  autoMode: false,
  autoMerge: false,
  notifyMarcio: true,
};

const DEFAULT_STATE: OrchestratorState = {
  status: 'idle',
  currentItem: null,
  pauseReason: null,
  consecutiveFailures: 0,
  processedEntries: [],
  updatedAt: new Date(0).toISOString(),
};

export class StateStore {
  readonly rootDir: string;
  readonly hiveAgentDir: string;
  readonly statePath: string;
  readonly configPath: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.hiveAgentDir = path.join(rootDir, '.hive-agent');
    this.statePath = path.join(this.hiveAgentDir, 'orchestrator-state.json');
    this.configPath = path.join(this.hiveAgentDir, 'hive-ui-config.json');
  }

  async ensureState(seedEntries: string[] = []): Promise<OrchestratorState> {
    const existing = await this.readState();
    if (existing) {
      return existing;
    }

    const seededState: OrchestratorState = {
      ...DEFAULT_STATE,
      processedEntries: [...new Set(seedEntries)],
      updatedAt: new Date().toISOString(),
    };
    await this.writeState(seededState);
    return seededState;
  }

  async readState(): Promise<OrchestratorState | null> {
    const raw = await this.readJsonFile<Partial<OrchestratorState>>(this.statePath);
    if (!raw) {
      return null;
    }

    return {
      status: raw.status ?? DEFAULT_STATE.status,
      currentItem: raw.currentItem ?? DEFAULT_STATE.currentItem,
      pauseReason: raw.pauseReason ?? DEFAULT_STATE.pauseReason,
      consecutiveFailures: raw.consecutiveFailures ?? DEFAULT_STATE.consecutiveFailures,
      processedEntries: Array.isArray(raw.processedEntries)
        ? [...new Set(raw.processedEntries.filter((value): value is string => typeof value === 'string'))]
        : [],
      updatedAt: raw.updatedAt ?? new Date().toISOString(),
    };
  }

  async writeState(state: OrchestratorState): Promise<void> {
    await this.writeTextAtomic(this.statePath, `${JSON.stringify(state, null, 2)}\n`);
  }

  async updateState(
    updater: (current: OrchestratorState) => OrchestratorState,
  ): Promise<OrchestratorState> {
    const current = (await this.readState()) ?? {
      ...DEFAULT_STATE,
      updatedAt: new Date().toISOString(),
    };
    const next = updater(current);
    next.updatedAt = new Date().toISOString();
    await this.writeState(next);
    return next;
  }

  async markProcessed(entryId: string): Promise<OrchestratorState> {
    return this.updateState((current) => ({
      ...current,
      processedEntries: current.processedEntries.includes(entryId)
        ? current.processedEntries
        : [...current.processedEntries, entryId],
    }));
  }

  async readConfig(): Promise<HiveConfig> {
    const raw = await this.readJsonFile<Partial<HiveConfig>>(this.configPath);
    return {
      autoMode: raw?.autoMode ?? DEFAULT_CONFIG.autoMode,
      autoMerge: raw?.autoMerge ?? DEFAULT_CONFIG.autoMerge,
      notifyMarcio: raw?.notifyMarcio ?? DEFAULT_CONFIG.notifyMarcio,
    };
  }

  async updateConfig(partial: Partial<HiveConfig>): Promise<HiveConfig> {
    const current = await this.readConfig();
    const next: HiveConfig = {
      autoMode: partial.autoMode ?? current.autoMode,
      autoMerge: partial.autoMerge ?? current.autoMerge,
      notifyMarcio: partial.notifyMarcio ?? current.notifyMarcio,
    };
    await this.writeTextAtomic(this.configPath, `${JSON.stringify(next, null, 2)}\n`);
    return next;
  }

  async readJsonFile<T>(filePath: string): Promise<T | null> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }

  async writeTextAtomic(filePath: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tempPath, content, 'utf8');
    await fs.rename(tempPath, filePath);
  }
}

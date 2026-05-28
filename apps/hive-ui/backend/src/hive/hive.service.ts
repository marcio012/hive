import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

type AgentName = 'claude' | 'copilot' | 'gemini';

interface RawLock {
  owner?: string;
  activity?: string;
  acquired_at?: string;
}

export interface AgentLock {
  activity: string | null;
  acquiredAt: string | null;
}

export interface HiveState {
  locks: Record<AgentName, AgentLock | null>;
  session: {
    activeIssue: string | null;
    lastAction: string | null;
    nextStep: string | null;
  };
  inboxCounts: Record<AgentName, number>;
  brainstorm: Array<{
    filename: string;
    title: string;
    thread: string | null;
    status: string | null;
    date: string | null;
    responsible: string | null;
  }>;
}

const AGENTS: AgentName[] = ['claude', 'copilot', 'gemini'];

@Injectable()
export class HiveService {
  private readonly hiveRoot = path.resolve(
    process.env.HIVE_ROOT || path.resolve(process.cwd(), '../../..'),
  );

  getWatchPaths(): string[] {
    return [
      path.join(this.hiveRoot, 'beehive'),
      path.join(this.hiveRoot, '.hive-agent'),
    ];
  }

  async getState(): Promise<HiveState> {
    const [locks, session, inboxCounts, brainstorm] = await Promise.all([
      this.readLocks(),
      this.readSession(),
      this.readInboxCounts(),
      this.readBrainstormFiles(),
    ]);

    return {
      locks,
      session,
      inboxCounts,
      brainstorm,
    };
  }

  private async readLocks(): Promise<Record<AgentName, AgentLock | null>> {
    const emptyLocks = AGENTS.reduce(
      (acc, agent) => ({ ...acc, [agent]: null }),
      {} as Record<AgentName, AgentLock | null>,
    );

    const raw = await this.readJsonFile<Record<string, unknown>>(
      path.join(this.hiveRoot, '.hive-agent', 'locks.json'),
    );

    if (!raw) {
      return emptyLocks;
    }

    if (typeof raw.owner === 'string' && AGENTS.includes(raw.owner as AgentName)) {
      const lock = raw as RawLock;
      return {
        ...emptyLocks,
        [raw.owner as AgentName]: {
          activity: lock.activity ?? null,
          acquiredAt: lock.acquired_at ?? null,
        },
      };
    }

    for (const agent of AGENTS) {
      const candidate = raw[agent];
      if (candidate && typeof candidate === 'object') {
        const lock = candidate as RawLock;
        emptyLocks[agent] = {
          activity: lock.activity ?? null,
          acquiredAt: lock.acquired_at ?? null,
        };
      }
    }

    return emptyLocks;
  }

  private async readSession(): Promise<HiveState['session']> {
    const content = await this.readTextFile(
      path.join(this.hiveRoot, '.hive-agent', 'session-state.env'),
    );

    const values: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const match = line.match(/^(\w+)="(.*)"$/);
      if (match) {
        values[match[1]] = match[2];
      }
    }

    return {
      activeIssue: values.ACTIVE_ISSUE ?? null,
      lastAction: values.LAST_ACTION ?? null,
      nextStep: values.NEXT_STEP ?? null,
    };
  }

  private async readInboxCounts(): Promise<Record<AgentName, number>> {
    const counts = await Promise.all(
      AGENTS.map(async (agent) => {
        const filePath = path.join(
          this.hiveRoot,
          'beehive',
          'construcao',
          `inbox-${agent}.md`,
        );

        return [agent, await this.countPendingEntries(filePath)] as const;
      }),
    );

    return Object.fromEntries(counts) as Record<AgentName, number>;
  }

  private async countPendingEntries(filePath: string): Promise<number> {
    const content = await this.readTextFile(filePath);
    if (!content) {
      return 0;
    }

    const blocks = content
      .split(/^### \[/m)
      .slice(1)
      .map((block) => `### [${block}`);

    return blocks.filter((block) => /\*\*Status:\*\*\s*pendente\b/i.test(block))
      .length;
  }

  private async readBrainstormFiles(): Promise<HiveState['brainstorm']> {
    const directory = path.join(
      this.hiveRoot,
      'beehive',
      'cognition',
      'intuition',
      'brainstorm',
    );

    let filenames: string[] = [];
    try {
      filenames = await fs.readdir(directory);
    } catch {
      return [];
    }

    const items = await Promise.all(
      filenames
        .filter((filename) => filename.endsWith('.md'))
        .map(async (filename) => {
          const content = await this.readTextFile(path.join(directory, filename));
          const title =
            content
              .split('\n')
              .find((line) => line.startsWith('# '))
              ?.replace(/^# /, '')
              .trim() ?? filename;

          const metadata = this.parseMetadata(content);

          return {
            filename,
            title,
            thread: metadata.thread ?? null,
            status: metadata.status ?? null,
            date: metadata.data ?? metadata.date ?? null,
            responsible:
              metadata.responsavel ?? metadata.responsible ?? metadata.responsavel_ ??
              null,
          };
        }),
    );

    return items.sort((a, b) => a.filename.localeCompare(b.filename));
  }

  private parseMetadata(content: string): Record<string, string> {
    const metadata: Record<string, string> = {};
    const regex = /^\*\*\s*([^:*]+?)\s*:\*\*\s*(.+)$/gm;

    for (const match of content.matchAll(regex)) {
      const normalizedKey = match[1]
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();

      metadata[normalizedKey] = match[2].trim();
    }

    return metadata;
  }

  private async readJsonFile<T>(filePath: string): Promise<T | null> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }

  private async readTextFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return '';
    }
  }
}

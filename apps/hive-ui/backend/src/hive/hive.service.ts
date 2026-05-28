import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

type AgentName = 'claude' | 'copilot' | 'gemini';
type PipelineStage = 'triagem' | 'execucao' | 'revisao' | 'concluido';
type PipelineAgent = AgentName | 'marcio';

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
  pipeline: PipelineItem[];
  events: HiveEvent[];
  uptime: number;
}

export interface PipelineItem {
  id: string;
  title: string;
  stage: PipelineStage;
  agent: PipelineAgent;
  priority: 'hi' | 'md' | 'lo';
  updatedAt: string;
}

export interface HiveEvent {
  ts: string;
  level: 'ok' | 'info' | 'warn' | 'err' | 'lock';
  msg: string;
}

const AGENTS: AgentName[] = ['claude', 'copilot', 'gemini'];

@Injectable()
export class HiveService {
  private readonly startedAt = Date.now();
  private readonly hiveRoot = path.resolve(
    process.env.HIVE_ROOT || path.resolve(process.cwd(), '../../..'),
  );
  private readonly events: HiveEvent[] = [this.createEvent('info', 'Hive UI conectado')];

  getWatchPaths(): string[] {
    return [
      path.join(this.hiveRoot, 'beehive'),
      path.join(this.hiveRoot, '.hive-agent'),
    ];
  }

  async getState(): Promise<HiveState> {
    const [locks, session, inboxCounts, brainstorm, pipeline] = await Promise.all([
      this.readLocks(),
      this.readSession(),
      this.readInboxCounts(),
      this.readBrainstormFiles(),
      this.readPipeline(),
    ]);

    return {
      locks,
      session,
      inboxCounts,
      brainstorm,
      pipeline,
      events: [...this.events],
      uptime: this.getUptime(),
    };
  }

  addEvent(level: HiveEvent['level'], msg: string): void {
    this.events.unshift(this.createEvent(level, msg));
    if (this.events.length > 20) {
      this.events.length = 20;
    }
  }

  getUptime(): number {
    return Math.floor((Date.now() - this.startedAt) / 1000);
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

  private async readPipeline(): Promise<PipelineItem[]> {
    const [claudeItems, copilotItems] = await Promise.all([
      this.readClaudePipeline(),
      this.readCopilotPipeline(),
    ]);

    const combined = [...claudeItems, ...copilotItems].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
    const concluded = combined
      .filter((item) => item.stage === 'concluido')
      .slice(0, 3)
      .map((item) => item.id);

    return combined.filter(
      (item) => item.stage !== 'concluido' || concluded.includes(item.id),
    );
  }

  private async readClaudePipeline(): Promise<PipelineItem[]> {
    const filePath = path.join(
      this.hiveRoot,
      'beehive',
      'construcao',
      'tasks',
      'FILA_CLAUDE.md',
    );
    const [content, stats] = await Promise.all([
      this.readTextFile(filePath),
      this.safeStat(filePath),
    ]);

    const sections = ['Em andamento', 'Pendente', 'Concluído'] as const;

    return sections.flatMap((section, sectionIndex) => {
      const rows = this.extractSectionRows(content, section);
      const items: PipelineItem[] = [];

      rows.forEach((cells, rowIndex) => {
        const id = cells[0];
        const title = cells[2];
        if (!id || !title) {
          return;
        }

        items.push({
          id,
          title,
          stage: this.mapClaudeStage(section, cells[3] ?? null),
          agent: 'claude',
          priority: this.derivePriority(id, title),
          updatedAt: new Date(
            (stats?.mtimeMs ?? Date.now()) - (sectionIndex * 60 + rowIndex) * 1000,
          ).toISOString(),
        });
      });

      return items;
    });
  }

  private async readCopilotPipeline(): Promise<PipelineItem[]> {
    const filePath = path.join(
      this.hiveRoot,
      'beehive',
      'construcao',
      'tasks',
      'FILA_COPILOT.md',
    );
    const [content, stats] = await Promise.all([
      this.readTextFile(filePath),
      this.safeStat(filePath),
    ]);

    const rows = this.extractSectionRows(content, 'Fila ordenada');

    const items: PipelineItem[] = [];

    rows.forEach((cells, rowIndex) => {
      const id = cells[1];
      const title = cells[2];
      const rawStatus = cells[4] ?? '';

      if (!id || !title) {
        return;
      }

      const stage = this.mapCopilotStage(rawStatus);
      if (!stage) {
        return;
      }

      items.push({
        id,
        title,
        stage,
        agent: 'copilot',
        priority: this.derivePriority(id, title),
        updatedAt: new Date(((stats?.mtimeMs ?? Date.now()) - rowIndex * 1000)).toISOString(),
      });
    });

    return items;
  }

  private extractSectionRows(content: string, sectionTitle: string): string[][] {
    const lines = content.split('\n');
    const startIndex = lines.findIndex(
      (line) => line.trim().toLowerCase() === `## ${sectionTitle}`.toLowerCase(),
    );

    if (startIndex === -1) {
      return [];
    }

    const sectionLines: string[] = [];
    for (let index = startIndex + 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.trim().startsWith('## ')) {
        break;
      }

      sectionLines.push(line);
    }

    return sectionLines
      .map((line) => line.trim())
      .filter((line) => line.startsWith('|'))
      .map((line) => this.parseMarkdownTableRow(line))
      .filter(
        (cells, index) =>
          index > 1 &&
          cells.length > 0 &&
          !cells.every((cell) => /^-+$/.test(cell)) &&
          !/^id$/i.test(cells[0] ?? ''),
      );
  }

  private parseMarkdownTableRow(line: string): string[] {
    return line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
  }

  private mapClaudeStage(
    section: 'Em andamento' | 'Pendente' | 'Concluído',
    status: string | null,
  ): PipelineStage {
    if (section === 'Concluído') {
      return 'concluido';
    }

    if (section === 'Pendente') {
      return 'triagem';
    }

    if (status && /revis/i.test(status)) {
      return 'revisao';
    }

    return 'execucao';
  }

  private mapCopilotStage(rawStatus: string): PipelineStage | null {
    if (/✅|conclu/i.test(rawStatus)) {
      return 'concluido';
    }

    if (/revis|aguarda/i.test(rawStatus)) {
      return 'revisao';
    }

    if (/execu|andamento|prepar/i.test(rawStatus)) {
      return 'execucao';
    }

    if (/pendente|bloqueado/i.test(rawStatus)) {
      return 'triagem';
    }

    return null;
  }

  private derivePriority(id: string, title: string): PipelineItem['priority'] {
    if (/^CORE|^DEBATE/i.test(id) || /crit|schema|guard/i.test(title)) {
      return 'hi';
    }

    if (/^HIVE|^TOS|pipeline|ui/i.test(`${id} ${title}`)) {
      return 'md';
    }

    return 'lo';
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

  private async safeStat(filePath: string): Promise<{ mtimeMs: number } | null> {
    try {
      return await fs.stat(filePath);
    } catch {
      return null;
    }
  }

  private createEvent(level: HiveEvent['level'], msg: string): HiveEvent {
    return {
      ts: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      level,
      msg,
    };
  }
}

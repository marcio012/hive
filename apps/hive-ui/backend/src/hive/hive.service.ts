import { Injectable } from '@nestjs/common';
import { execFile as execFileCallback } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

type AgentName = 'claude' | 'copilot' | 'gemini';
type PipelineStage = 'triagem' | 'execucao' | 'revisao' | 'concluido';
type PipelineAgent = AgentName | 'marcio';
type DispatchAgent = AgentName;

const execFile = promisify(execFileCallback);

export interface HiveConfig {
  autoMode: boolean;
  autoMerge: boolean;
  notifyMarcio: boolean;
}

export interface HiveActionResult {
  ok: boolean;
  error?: string;
}

export interface DispatchPayload {
  agent: DispatchAgent;
  message: string;
}

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
  config: HiveConfig;
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
const DEFAULT_CONFIG: HiveConfig = {
  autoMode: false,
  autoMerge: false,
  notifyMarcio: true,
};

@Injectable()
export class HiveService {
  private readonly startedAt = Date.now();
  private readonly hiveRoot = path.resolve(
    process.env.HIVE_ROOT || path.resolve(process.cwd(), '../../..'),
  );
  private readonly configPath = path.join(
    this.hiveRoot,
    '.hive-agent',
    'hive-ui-config.json',
  );
  private readonly proxyScriptPath = path.join(this.hiveRoot, '.agile-squad', 'proxy.sh');
  private readonly events: HiveEvent[] = [this.createEvent('info', 'Hive UI conectado')];

  getWatchPaths(): string[] {
    return [
      path.join(this.hiveRoot, 'beehive'),
      path.join(this.hiveRoot, '.hive-agent'),
    ];
  }

  async getState(): Promise<HiveState> {
    const [locks, config, session, inboxCounts, brainstorm, pipeline] = await Promise.all([
      this.readLocks(),
      this.readConfig(),
      this.readSession(),
      this.readInboxCounts(),
      this.readBrainstormFiles(),
      this.readPipeline(),
    ]);

    return {
      locks,
      config,
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

  isAgentName(value: string): value is AgentName {
    return AGENTS.includes(value as AgentName);
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

  async releaseLock(agent: AgentName): Promise<HiveActionResult> {
    try {
      await execFile(
        'bash',
        [this.proxyScriptPath, 'hive', 'lock', 'release', agent],
        { cwd: this.hiveRoot },
      );
      this.addEvent('lock', `Lock de ${agent} liberado via UI`);
      return { ok: true };
    } catch (error) {
      const message = this.extractExecError(error, 'Falha ao liberar lock.');
      return { ok: false, error: message };
    }
  }

  async dispatchIntent(payload: DispatchPayload): Promise<HiveActionResult> {
    const message = payload.message.trim();
    if (!message) {
      return { ok: false, error: 'Mensagem obrigatória.' };
    }

    const inboxPath = path.join(
      this.hiveRoot,
      'beehive',
      'construcao',
      `inbox-${payload.agent}.md`,
    );
    const content = await this.readTextFile(inboxPath);
    const entry = this.buildDispatchEntry(payload.agent, message);
    const updated = this.insertInboxEntry(content, entry);

    await this.writeTextAtomic(inboxPath, updated);
    this.addEvent('info', `Intenção despachada para ${payload.agent} via UI`);

    return { ok: true };
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

  private async writeTextAtomic(filePath: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, content, 'utf8');
    await fs.rename(tempPath, filePath);
  }

  private extractExecError(error: unknown, fallback: string): string {
    if (error && typeof error === 'object') {
      const stderr = 'stderr' in error ? error.stderr : null;
      if (typeof stderr === 'string' && stderr.trim()) {
        return stderr.replace(/\u001b\[[0-9;]*m/g, '').trim();
      }

      const stdout = 'stdout' in error ? error.stdout : null;
      if (typeof stdout === 'string' && stdout.trim()) {
        return stdout.replace(/\u001b\[[0-9;]*m/g, '').trim();
      }

      const message = 'message' in error ? error.message : null;
      if (typeof message === 'string' && message.trim()) {
        return message.trim();
      }
    }

    return fallback;
  }

  private buildDispatchEntry(agent: DispatchAgent, message: string): string {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    });

    return [
      `### [UI-${date}-${time}] Intenção despachada via Hive UI`,
      `**De:** Márcio (via Hive UI) → ${this.getAgentLabel(agent)}`,
      `**Data:** ${date}`,
      `**tipo:** pedido-de-parecer`,
      `**Status:** pendente`,
      '',
      message,
      '',
      '---',
      '',
    ].join('\n');
  }

  private getAgentLabel(agent: DispatchAgent): string {
    if (agent === 'claude') {
      return 'Claude';
    }

    if (agent === 'copilot') {
      return 'Copilot';
    }

    return 'Gemini';
  }

  private insertInboxEntry(content: string, entry: string): string {
    const anchor = '<!-- novas entradas abaixo';
    const anchorIndex = content.indexOf(anchor);

    if (anchorIndex >= 0) {
      const lineEnd = content.indexOf('\n', anchorIndex);
      if (lineEnd === -1) {
        return `${content}\n${entry}`;
      }

      return `${content.slice(0, lineEnd + 1)}\n${entry}${content.slice(lineEnd + 1)}`;
    }

    const separatorIndex = content.indexOf('\n---\n');
    if (separatorIndex >= 0) {
      const insertAt = separatorIndex + '\n---\n'.length;
      return `${content.slice(0, insertAt)}\n${entry}${content.slice(insertAt)}`;
    }

    return `${content.trimEnd()}\n\n${entry}`;
  }
}

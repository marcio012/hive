import { Injectable } from '@nestjs/common';
import { execFile as execFileCallback } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import {
  FileBasedGovernanceRepository,
  type GovernanceData,
  type GovernanceRepository,
} from './governance.repository';

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

export type OrchestratorStatus = 'idle' | 'watching' | 'dispatching' | 'paused' | 'error';
export type OrchestratorEventLevel = 'info' | 'warn' | 'error';

export interface HiveOrchestratorState {
  status: OrchestratorStatus;
  currentItem: string | null;
  pauseReason: string | null;
  updatedAt: string | null;
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

export interface AgentDetail {
  inboxPending: number;
  activeWo: string | null;
  blockedCount: number;
}

export interface DebateEntry {
  id: string;
  title: string;
  status: string;
  responsible: string;
  active: boolean;
  file_path: string;
}

export type GateItemType =
  | 'sr-afirmacao'
  | 'gate-commit'
  | 'aprovacao-debate'
  | 'decisao-estrategica';

export interface GateItem {
  id: string;
  tipo: GateItemType;
  titulo: string;
  backlog_ref?: string;
  sr_ref?: string;
  data: string;
  file_path: string;
}

export interface HiveGateState {
  pendentes: GateItem[];
  total: number;
}

export interface HiveState {
  locks: Record<AgentName, AgentLock | null>;
  config: HiveConfig;
  orchestrator: HiveOrchestratorState | null;
  session: {
    activeIssue: string | null;
    lastAction: string | null;
    nextStep: string | null;
  };
  inboxCounts: Record<AgentName, number>;
  inboxArchive: Record<AgentName, { eligibleCount: number; totalLines: number }>;
  agentDetails: Record<AgentName, AgentDetail>;
  gate: HiveGateState;
  debates: DebateEntry[];
  brainstorm: Array<{
    filename: string;
    file_path: string;
    title: string;
    thread: string | null;
    status: string | null;
    date: string | null;
    responsible: string | null;
  }>;
  pipeline: PipelineItem[];
  governance: GovernanceData;
  events: HiveEvent[];
  uptime: number;
}

export interface TelemetryConfig {
  weeklyBudgetBRL: number;
  weeklyTokenLimit: number;
  agents: Record<AgentName, { weeklyBudgetBRL: number }>;
}

export interface AgentEfficiency {
  agent: AgentName;
  role: string;
  sessionCostBRL: number;
  totalCostBRL: number;
  weeklyBudgetBRL: number;
  weeklyBudgetPct: number;
  weeklyWOs: number;
  approvalRate: number | null;
  initCount: number;
  avgRoundsPerInit: number | null;
  lastInitMinutesAgo: number | null;
  peso: number | null;
}

export interface WeeklyUsage {
  tokensUsed: number;
  tokenLimit: number;
  usagePct: number;
  totalCostBRL: number;
  budgetBRL: number;
  inputTokens: number;
  outputTokens: number;
  cacheTokens: number;
  inputCostBRL: number;
  outputCostBRL: number;
  cacheCostBRL: number;
  resetInDays: number;
}

export interface InitSession {
  index: number;
  startedAt: string;
  rounds: number;
  costBRL: number;
  isActive: boolean;
}

export interface AgentInitHistory {
  agent: AgentName;
  role: string;
  weeklyInits: InitSession[];
  avgRounds: number;
  avgCostBRL: number;
  totalInits: number;
  totalRounds: number;
  totalCostBRL: number;
}

export interface TelemetryState {
  weeklyUsage: WeeklyUsage;
  agentEfficiency: AgentEfficiency[];
  initHistory: AgentInitHistory[];
  logExists: boolean;
  configExists: boolean;
}

export interface PipelineItem {
  id: string;
  title: string;
  stage: PipelineStage;
  agent: PipelineAgent;
  priority: 'hi' | 'md' | 'lo';
  updatedAt: string;
  file_path: string | null;
}

export interface HiveEvent {
  ts: string;
  level: 'ok' | 'info' | 'warn' | 'err' | 'lock';
  msg: string;
}

const AGENTS: AgentName[] = ['claude', 'copilot', 'gemini'];
const CLOSED_STATUS_PREFIXES = [
  'consumida',
  'executada',
  'arquivada',
  'concluida',
  'concluída',
  'feito',
  'feita',
  'done',
] as const;
const DEFAULT_CONFIG: HiveConfig = {
  autoMode: false,
  autoMerge: false,
  notifyMarcio: true,
};
const AGENT_ROLES: Record<AgentName, string> = {
  claude: 'Arquiteto',
  copilot: 'Engenheiro',
  gemini: 'Lead',
};
const DEFAULT_TELEMETRY_CONFIG: TelemetryConfig = {
  weeklyBudgetBRL: 70,
  weeklyTokenLimit: 4_200_000,
  agents: {
    claude: { weeklyBudgetBRL: 35 },
    copilot: { weeklyBudgetBRL: 25 },
    gemini: { weeklyBudgetBRL: 10 },
  },
};

interface ParsedTelemetryConfig {
  config: TelemetryConfig;
  configExists: boolean;
}

interface ParsedCostEntry {
  agent: AgentName;
  occurredAt: string;
  sessionId: string | null;
  inputTokens: number;
  outputTokens: number;
  cacheTokens: number;
  totalCostBRL: number;
  inputCostBRL: number;
  outputCostBRL: number;
  cacheCostBRL: number;
}

interface ParsedCostLog {
  logExists: boolean;
  entries: ParsedCostEntry[];
}

interface TelemetryInitAggregate {
  sessionId: string;
  startedAt: string;
  lastAt: string;
  rounds: number;
  costBRL: number;
}

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
  private readonly telemetryConfigPath = path.join(
    this.hiveRoot,
    '.hive-agent',
    'telemetry-config.json',
  );
  private readonly telemetryLogPaths = [
    path.join(this.hiveRoot, 'beehive', 'registry', 'telemetria', 'custos.log'),
    path.join(this.hiveRoot, 'beehive', 'construcao', 'logs', 'custos.log'),
  ];
  private readonly proxyScriptPath = path.join(this.hiveRoot, '.agile-squad', 'proxy.sh');
  private readonly governanceRepository: GovernanceRepository;
  private readonly events: HiveEvent[] = [this.createEvent('info', 'Hive UI conectado')];
  private readonly stateListeners = new Set<(state: HiveState) => void | Promise<void>>();

  constructor() {
    this.governanceRepository = new FileBasedGovernanceRepository(this.hiveRoot);
  }

  getWatchPaths(): string[] {
    return [
      path.join(this.hiveRoot, 'beehive'),
      path.join(this.hiveRoot, '.hive-agent'),
      path.join(this.hiveRoot, 'beehive', 'construcao', 'inbox-claude.md'),
      path.join(this.hiveRoot, 'beehive', 'construcao', 'inbox-copilot.md'),
      path.join(this.hiveRoot, 'beehive', 'construcao', 'inbox-gemini.md'),
      path.join(this.hiveRoot, 'beehive', 'construcao', 'inbox-marcio.md'),
      path.join(this.hiveRoot, 'beehive', 'construcao', 'debates-abertos.md'),
    ];
  }

  async getState(): Promise<HiveState> {
    const [
      locks,
      config,
      orchestrator,
      session,
      inboxCounts,
      inboxArchive,
      inboxDetails,
      gate,
      debates,
      brainstorm,
      pipeline,
      governance,
    ] =
      await Promise.all([
        this.readLocks(),
        this.readConfig(),
        this.readOrchestratorState(),
        this.readSession(),
        this.readInboxCounts(),
        this.readInboxArchiveState(),
        this.readAgentInboxDetails(),
        this.readGateState(),
        this.readActiveDebates(),
        this.readBrainstormFiles(),
        this.readPipeline(),
        this.governanceRepository.getAll(),
      ]);

    return {
      locks,
      config,
      orchestrator,
      session,
      inboxCounts,
      inboxArchive,
      agentDetails: {
        claude: {
          ...inboxDetails.claude,
          activeWo: locks.claude?.activity ?? null,
        },
        copilot: {
          ...inboxDetails.copilot,
          activeWo: locks.copilot?.activity ?? null,
        },
        gemini: {
          ...inboxDetails.gemini,
          activeWo: locks.gemini?.activity ?? null,
        },
      },
      gate,
      debates,
      brainstorm,
      pipeline,
      governance,
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

  isOrchestratorEventLevel(value: string): value is OrchestratorEventLevel {
    return value === 'info' || value === 'warn' || value === 'error';
  }

  subscribeState(listener: (state: HiveState) => void | Promise<void>): () => void {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  async addOrchestratorEvent(level: OrchestratorEventLevel, msg: string): Promise<void> {
    this.addEvent(level === 'error' ? 'err' : level, msg);
    await this.broadcastState();
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

  async readTelemetry(): Promise<TelemetryState> {
    const now = Date.now();
    const [parsedLog, parsedConfig, orchestratorRaw] = await Promise.all([
      this.parseCostLog(),
      this.readTelemetryConfig(),
      this.readJsonFile<{ processedEntries?: string[] }>(
        path.join(this.hiveRoot, '.hive-agent', 'orchestrator-state.json'),
      ),
    ]);

    const weeklyEntries = parsedLog.entries.filter((entry) => this.isWithinWeeklyWindow(entry.occurredAt, now));
    const weeklyWorkOrders = this.countWeeklyWorkOrders(orchestratorRaw?.processedEntries ?? [], now);

    const weeklyUsage = this.buildWeeklyUsage(weeklyEntries, parsedConfig.config, now);
    const initHistory = AGENTS.map((agent) => this.buildAgentInitHistory(agent, weeklyEntries, now));
    const initHistoryMap = Object.fromEntries(
      initHistory.map((item) => [item.agent, item]),
    ) as Record<AgentName, AgentInitHistory>;
    const agentCostMap = this.sumCostByAgent(weeklyEntries);

    return {
      weeklyUsage,
      agentEfficiency: AGENTS.map((agent) => {
        const history = initHistoryMap[agent];
        const latestInit = history.weeklyInits[0] ?? null;
        const weeklyBudgetBRL = parsedConfig.config.agents[agent].weeklyBudgetBRL;
        const rawBudgetPct = weeklyBudgetBRL > 0
          ? (agentCostMap[agent] / weeklyBudgetBRL) * 100
          : 0;

        return {
          agent,
          role: AGENT_ROLES[agent],
          sessionCostBRL: latestInit?.costBRL ?? 0,
          totalCostBRL: agentCostMap[agent],
          weeklyBudgetBRL,
          weeklyBudgetPct: this.clampPct(rawBudgetPct),
          weeklyWOs: weeklyWorkOrders[agent],
          approvalRate: null,
          initCount: history.totalInits,
          avgRoundsPerInit: history.totalInits > 0 ? history.avgRounds : null,
          lastInitMinutesAgo: latestInit
            ? this.diffMinutesFromNow(latestInit.startedAt, now)
            : null,
          peso: null,
        };
      }),
      initHistory,
      logExists: parsedLog.logExists,
      configExists: parsedConfig.configExists,
    };
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

  private async readTelemetryConfig(): Promise<ParsedTelemetryConfig> {
    const raw = await this.readJsonFile<Partial<TelemetryConfig>>(this.telemetryConfigPath);

    return {
      configExists: Boolean(raw),
      config: {
        weeklyBudgetBRL: raw?.weeklyBudgetBRL ?? DEFAULT_TELEMETRY_CONFIG.weeklyBudgetBRL,
        weeklyTokenLimit: raw?.weeklyTokenLimit ?? DEFAULT_TELEMETRY_CONFIG.weeklyTokenLimit,
        agents: {
          claude: {
            weeklyBudgetBRL:
              raw?.agents?.claude?.weeklyBudgetBRL ??
              DEFAULT_TELEMETRY_CONFIG.agents.claude.weeklyBudgetBRL,
          },
          copilot: {
            weeklyBudgetBRL:
              raw?.agents?.copilot?.weeklyBudgetBRL ??
              DEFAULT_TELEMETRY_CONFIG.agents.copilot.weeklyBudgetBRL,
          },
          gemini: {
            weeklyBudgetBRL:
              raw?.agents?.gemini?.weeklyBudgetBRL ??
              DEFAULT_TELEMETRY_CONFIG.agents.gemini.weeklyBudgetBRL,
          },
        },
      },
    };
  }

  private async parseCostLog(): Promise<ParsedCostLog> {
    const logPath = await this.findFirstExistingPath(this.telemetryLogPaths);
    if (!logPath) {
      return { logExists: false, entries: [] };
    }

    const content = await this.readTextFile(logPath);
    if (!content.trim()) {
      return { logExists: true, entries: [] };
    }

    const entries = content
      .split('==================================================')
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => this.parseCostLogBlock(block))
      .filter((entry): entry is ParsedCostEntry => entry !== null);

    return {
      logExists: true,
      entries,
    };
  }

  private parseCostLogBlock(block: string): ParsedCostEntry | null {
    const rawAgent = this.matchField(block, /TELEMETRIA DE TOKENS\s+[—-]\s+\[([^\]]+)\]/i);
    const occurredAt = this.parseLocalDateTime(
      this.matchField(block, /Data\/Hora:\s*([0-9:-]+\s+[0-9:]+)/i),
    );
    const agent = this.normalizeTelemetryAgent(rawAgent);

    if (!agent || !occurredAt) {
      return null;
    }

    const sessionId = this.matchField(block, /Session ID:\s*\[([^\]]+)\]/i);
    const inputTokens = this.parseTokenValue(
      this.matchField(block, /Tokens de Entrada \(Prompt\):\s*([0-9.]+)/i),
    );
    const outputTokens = this.parseTokenValue(
      this.matchField(block, /Tokens de Saída \(Completion\):\s*([0-9.]+)/i),
    );
    const cacheTokens = this.parseTokenValue(
      this.matchField(block, /Tokens de Cache(?: \(Prompt\))?:\s*([0-9.]+)/i),
    );
    const totalCostBRL = this.parseCurrencyValue(
      this.matchField(block, /Custo Estimado da Rodada:\s*R\$\s*([0-9.]+)/i),
    );
    const tokenBase = inputTokens + outputTokens + cacheTokens;
    const inputCostBRL = tokenBase > 0 ? totalCostBRL * (inputTokens / tokenBase) : 0;
    const outputCostBRL = tokenBase > 0 ? totalCostBRL * (outputTokens / tokenBase) : 0;
    const cacheCostBRL = tokenBase > 0 ? totalCostBRL * (cacheTokens / tokenBase) : 0;

    return {
      agent,
      occurredAt,
      sessionId,
      inputTokens,
      outputTokens,
      cacheTokens,
      totalCostBRL,
      inputCostBRL,
      outputCostBRL,
      cacheCostBRL,
    };
  }

  private buildWeeklyUsage(
    entries: ParsedCostEntry[],
    config: TelemetryConfig,
    now: number,
  ): WeeklyUsage {
    const totals = entries.reduce(
      (acc, entry) => ({
        inputTokens: acc.inputTokens + entry.inputTokens,
        outputTokens: acc.outputTokens + entry.outputTokens,
        cacheTokens: acc.cacheTokens + entry.cacheTokens,
        totalCostBRL: acc.totalCostBRL + entry.totalCostBRL,
        inputCostBRL: acc.inputCostBRL + entry.inputCostBRL,
        outputCostBRL: acc.outputCostBRL + entry.outputCostBRL,
        cacheCostBRL: acc.cacheCostBRL + entry.cacheCostBRL,
      }),
      {
        inputTokens: 0,
        outputTokens: 0,
        cacheTokens: 0,
        totalCostBRL: 0,
        inputCostBRL: 0,
        outputCostBRL: 0,
        cacheCostBRL: 0,
      },
    );
    const tokensUsed = totals.inputTokens + totals.outputTokens + totals.cacheTokens;
    const usagePct =
      config.weeklyTokenLimit > 0 ? (tokensUsed / config.weeklyTokenLimit) * 100 : 0;

    return {
      tokensUsed,
      tokenLimit: config.weeklyTokenLimit,
      usagePct: this.clampPct(usagePct),
      totalCostBRL: totals.totalCostBRL,
      budgetBRL: config.weeklyBudgetBRL,
      inputTokens: totals.inputTokens,
      outputTokens: totals.outputTokens,
      cacheTokens: totals.cacheTokens,
      inputCostBRL: totals.inputCostBRL,
      outputCostBRL: totals.outputCostBRL,
      cacheCostBRL: totals.cacheCostBRL,
      resetInDays: this.getResetInDays(now),
    };
  }

  private buildAgentInitHistory(
    agent: AgentName,
    entries: ParsedCostEntry[],
    now: number,
  ): AgentInitHistory {
    const grouped = new Map<string, TelemetryInitAggregate>();

    entries
      .filter((entry) => entry.agent === agent)
      .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt))
      .forEach((entry) => {
        const sessionKey = entry.sessionId?.trim() || entry.occurredAt.slice(0, 10);
        const current = grouped.get(sessionKey);

        if (current) {
          current.rounds += 1;
          current.costBRL += entry.totalCostBRL;
          current.lastAt = entry.occurredAt;
          return;
        }

        grouped.set(sessionKey, {
          sessionId: sessionKey,
          startedAt: entry.occurredAt,
          lastAt: entry.occurredAt,
          rounds: 1,
          costBRL: entry.totalCostBRL,
        });
      });

    const sessions = [...grouped.values()].sort((left, right) => right.startedAt.localeCompare(left.startedAt));
    const totalRounds = sessions.reduce((sum, session) => sum + session.rounds, 0);
    const totalCostBRL = sessions.reduce((sum, session) => sum + session.costBRL, 0);

    return {
      agent,
      role: AGENT_ROLES[agent],
      weeklyInits: sessions.map((session, index) => ({
        index: sessions.length - index,
        startedAt: session.startedAt,
        rounds: session.rounds,
        costBRL: session.costBRL,
        isActive: this.diffMinutesFromNow(session.lastAt, now) <= 30,
      })),
      avgRounds: sessions.length > 0 ? totalRounds / sessions.length : 0,
      avgCostBRL: sessions.length > 0 ? totalCostBRL / sessions.length : 0,
      totalInits: sessions.length,
      totalRounds,
      totalCostBRL,
    };
  }

  private sumCostByAgent(entries: ParsedCostEntry[]): Record<AgentName, number> {
    return entries.reduce(
      (acc, entry) => ({
        ...acc,
        [entry.agent]: acc[entry.agent] + entry.totalCostBRL,
      }),
      {
        claude: 0,
        copilot: 0,
        gemini: 0,
      } as Record<AgentName, number>,
    );
  }

  private countWeeklyWorkOrders(
    processedEntries: string[],
    now: number,
  ): Record<AgentName, number> {
    const counts: Record<AgentName, number> = {
      claude: 0,
      copilot: 0,
      gemini: 0,
    };

    for (const entryId of processedEntries) {
      const match = entryId.match(/^([A-Z]+)-(\d{4}-\d{2}-\d{2})-/);
      if (!match) {
        continue;
      }

      const agent = this.normalizeTelemetryAgent(match[1]);
      const occurredAt = this.parseLocalDateTime(`${match[2]} 00:00:00`);

      if (!agent || !occurredAt || !this.isWithinWeeklyWindow(occurredAt, now)) {
        continue;
      }

      counts[agent] += 1;
    }

    return counts;
  }

  private normalizeTelemetryAgent(value: string | null): AgentName | null {
    if (!value) {
      return null;
    }

    const normalized = value.trim().toLowerCase();

    if (normalized.includes('claude')) {
      return 'claude';
    }

    if (normalized.includes('copilot')) {
      return 'copilot';
    }

    if (normalized.includes('gemini')) {
      return 'gemini';
    }

    return null;
  }

  private parseLocalDateTime(value: string | null): string | null {
    if (!value) {
      return null;
    }

    const match = value.trim().match(
      /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
    );
    if (!match) {
      return null;
    }

    const [, year, month, day, hour, minute, second] = match;
    const localDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );

    return Number.isNaN(localDate.getTime()) ? null : localDate.toISOString();
  }

  private parseTokenValue(value: string | null): number {
    if (!value) {
      return 0;
    }

    return Number(value.replace(/\./g, '').replace(',', '.')) || 0;
  }

  private parseCurrencyValue(value: string | null): number {
    if (!value) {
      return 0;
    }

    return Number(value.replace(/\./g, '#').replace(',', '.').replace(/#/g, '.')) || 0;
  }

  private matchField(content: string, regex: RegExp): string | null {
    const match = content.match(regex);
    return match?.[1]?.trim() ?? null;
  }

  private async findFirstExistingPath(candidates: string[]): Promise<string | null> {
    for (const candidate of candidates) {
      if (await this.safeStat(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  private isWithinWeeklyWindow(isoDate: string, now: number): boolean {
    const value = new Date(isoDate).getTime();
    if (Number.isNaN(value)) {
      return false;
    }

    return value >= now - 7 * 24 * 60 * 60 * 1000 && value <= now;
  }

  private diffMinutesFromNow(isoDate: string, now: number): number {
    const value = new Date(isoDate).getTime();
    if (Number.isNaN(value)) {
      return 0;
    }

    return Math.max(0, Math.floor((now - value) / 60000));
  }

  private getResetInDays(now: number): number {
    const current = new Date(now);
    const day = current.getDay();
    return ((8 - day) % 7) || 7;
  }

  private clampPct(value: number): number {
    return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
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

  private async readOrchestratorState(): Promise<HiveOrchestratorState | null> {
    const raw = await this.readJsonFile<Partial<HiveOrchestratorState>>(
      path.join(this.hiveRoot, '.hive-agent', 'orchestrator-state.json'),
    );

    if (!raw) {
      return null;
    }

    return {
      status: this.isOrchestratorStatus(raw.status) ? raw.status : 'idle',
      currentItem: raw.currentItem ?? null,
      pauseReason: raw.pauseReason ?? null,
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : null,
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

  private async readAgentInboxDetails(): Promise<
    Record<AgentName, Omit<AgentDetail, 'activeWo'>>
  > {
    const details = await Promise.all(
      AGENTS.map(async (agent) => {
        const { pending, blocked } = await this.readInboxPending(agent);
        return [
          agent,
          {
            inboxPending: pending,
            blockedCount: blocked,
          },
        ] as const;
      }),
    );

    return Object.fromEntries(details) as Record<AgentName, Omit<AgentDetail, 'activeWo'>>;
  }

  private async readGateState(): Promise<HiveGateState> {
    const filePath = path.join(this.hiveRoot, 'beehive', 'construcao', 'inbox-marcio.md');
    const content = await this.readTextFile(filePath);

    if (!content) {
      return { pendentes: [], total: 0 };
    }

    const pendentes = this.getLatestInboxBlocks(content)
      .map((block) => this.parseGateItem(block, filePath))
      .filter((item): item is GateItem => item !== null);

    return {
      pendentes,
      total: pendentes.length,
    };
  }

  private async readInboxPending(
    agent: AgentName,
  ): Promise<{ pending: number; blocked: number }> {
    const filePath = path.join(this.hiveRoot, 'beehive', 'construcao', `inbox-${agent}.md`);
    const content = await this.readTextFile(filePath);

    if (!content) {
      return { pending: 0, blocked: 0 };
    }

    const blocks = this.getLatestInboxBlocks(content);

    return blocks.reduce(
      (acc, block) => {
        const status = this.extractInboxField(block, 'Status');
        const isClosed = status ? this.isClosedInboxStatus(status) : false;

        if (!isClosed) {
          acc.pending += 1;
        }

        if (!isClosed && /\bbloquead[oa]\b/i.test(block)) {
          acc.blocked += 1;
        }

        return acc;
      },
      { pending: 0, blocked: 0 },
    );
  }

  private async readActiveDebates(): Promise<DebateEntry[]> {
    const filePath = path.join(this.hiveRoot, 'beehive', 'construcao', 'debates-abertos.md');
    const content = await this.readTextFile(filePath);
    const repoFilePath = this.toRepoRelativePath(filePath);

    if (!content) {
      return [];
    }

    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('|') && /DEBATE-/i.test(line))
      .map((line) => this.parseMarkdownTableRow(line))
      .map((cells) => {
        const id = this.stripMarkdownFormatting(cells[0] ?? '');
        const title = this.stripMarkdownFormatting(cells[1] ?? '');
        const status = this.stripMarkdownFormatting(cells[2] ?? '');
        const responsible = this.stripMarkdownFormatting(cells[3] ?? '');
        const active = !/(consolidado|encerrado)/i.test(status);

        return {
          id,
          title,
          status,
          responsible,
          active,
          file_path: repoFilePath,
        } satisfies DebateEntry;
      })
      .filter((entry) => entry.id && entry.title);
  }

  private async readInboxArchiveState(): Promise<
    Record<AgentName, { eligibleCount: number; totalLines: number }>
  > {
    const counts = await Promise.all(
      AGENTS.map(async (agent) => {
        const filePath = path.join(
          this.hiveRoot,
          'beehive',
          'construcao',
          `inbox-${agent}.md`,
        );

        const content = await this.readTextFile(filePath);
        return [
          agent,
          {
            eligibleCount: this.countArchivableEntries(content),
            totalLines: content ? content.replace(/\r/g, '').split('\n').length : 0,
          },
        ] as const;
      }),
    );

    return Object.fromEntries(counts) as Record<
      AgentName,
      { eligibleCount: number; totalLines: number }
    >;
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

  private countArchivableEntries(content: string | null): number {
    if (!content) {
      return 0;
    }

    const sevenDaysAgo = this.startOfDay(new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)));
    const latestBlocks = this.getLatestInboxBlocks(content);

    return latestBlocks.filter((block) => {
      const status = this.extractInboxField(block, 'Status');
      if (!status || !this.isClosedInboxStatus(status)) {
        return false;
      }

      const date = this.parseInboxDate(this.extractInboxField(block, 'Data'));
      if (!date) {
        return false;
      }

      return this.startOfDay(date).getTime() <= sevenDaysAgo.getTime();
    }).length;
  }

  private getLatestInboxBlocks(content: string): string[] {
    const blocks = content
      .replace(/\r/g, '')
      .split(/^### \[/m)
      .slice(1)
      .map((block) => `### [${block}`);
    const latestBlocks: string[] = [];
    const seenIds = new Set<string>();

    for (const block of blocks) {
      const idMatch = block.match(/^### \[([^\]]+)\]/m);
      const id = idMatch?.[1];
      if (!id || seenIds.has(id)) {
        continue;
      }
      seenIds.add(id);
      latestBlocks.push(block);
    }

    return latestBlocks;
  }

  private extractInboxField(block: string, fieldName: string): string | null {
    const escapedField = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = block.match(new RegExp(`^\\*\\*${escapedField}:\\*\\*\\s*(.+)$`, 'im'));
    return match?.[1]?.trim() ?? null;
  }

  private isClosedInboxStatus(status: string): boolean {
    const normalized = status.trim().toLowerCase();
    return CLOSED_STATUS_PREFIXES.some((prefix) => normalized.startsWith(prefix));
  }

  private parseInboxDate(rawDate: string | null): Date | null {
    if (!rawDate || rawDate.includes('{')) {
      return null;
    }

    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
      ? new Date(`${rawDate}T00:00:00`)
      : new Date(rawDate);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private startOfDay(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  private parseGateItem(block: string, filePath: string): GateItem | null {
    const status = this.extractInboxField(block, 'Status');
    if (!status || !this.isPendingInboxStatus(status)) {
      return null;
    }

    const headingMatch = block.match(/^### \[([^\]]+)\]\s*(.+)$/m);
    const id = headingMatch?.[1]?.trim();
    const titulo = this.stripMarkdownFormatting(headingMatch?.[2] ?? '');

    if (!id || !titulo) {
      return null;
    }

    const tipo = this.parseGateTipo(this.extractInboxField(block, 'tipo'));
    const backlogRef = this.stripOptionalInboxField(this.extractInboxField(block, 'backlog_ref'));
    const srRef = this.stripOptionalInboxField(this.extractInboxField(block, 'sr_ref'));
    const data = this.stripOptionalInboxField(this.extractInboxField(block, 'Data')) ?? '';

    return {
      id,
      tipo,
      titulo,
      ...(backlogRef ? { backlog_ref: backlogRef } : {}),
      ...(srRef ? { sr_ref: srRef } : {}),
      data,
      file_path: this.toRepoRelativePath(filePath),
    };
  }

  private isPendingInboxStatus(status: string): boolean {
    return /^pendente\b/i.test(status.trim());
  }

  private parseGateTipo(rawTipo: string | null): GateItemType {
    switch ((rawTipo ?? '').trim().toLowerCase()) {
      case 'sr-afirmacao':
        return 'sr-afirmacao';
      case 'gate-commit':
        return 'gate-commit';
      case 'aprovacao-debate':
        return 'aprovacao-debate';
      default:
        return 'decisao-estrategica';
    }
  }

  private stripOptionalInboxField(value: string | null): string | null {
    if (!value) {
      return null;
    }

    const stripped = this.stripMarkdownFormatting(value);
    return stripped || null;
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
          const filePath = path.join(directory, filename);
          const content = await this.readTextFile(filePath);
          const title =
            content
              .split('\n')
              .find((line) => line.startsWith('# '))
              ?.replace(/^# /, '')
              .trim() ?? filename;

          const metadata = this.parseMetadata(content);

          return {
            filename,
            file_path: this.toRepoRelativePath(filePath),
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
          file_path: this.toRepoRelativePath(filePath),
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
        file_path: this.toRepoRelativePath(filePath),
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

  private stripMarkdownFormatting(value: string): string {
    return value.replace(/\*\*/g, '').trim();
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

  private toRepoRelativePath(filePath: string): string {
    return path.relative(this.hiveRoot, filePath).split(path.sep).join('/');
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

  private isOrchestratorStatus(value: unknown): value is OrchestratorStatus {
    return (
      value === 'idle' ||
      value === 'watching' ||
      value === 'dispatching' ||
      value === 'paused' ||
      value === 'error'
    );
  }

  private async broadcastState(): Promise<void> {
    if (this.stateListeners.size === 0) {
      return;
    }

    const state = await this.getState();
    await Promise.all([...this.stateListeners].map((listener) => listener(state)));
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

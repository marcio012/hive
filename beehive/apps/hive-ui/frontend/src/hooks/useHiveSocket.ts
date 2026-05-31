import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export type AgentName = 'claude' | 'copilot' | 'gemini';
export type SquadMemberId = AgentName | 'marcio';

export type PipelineStage = 'triagem' | 'execucao' | 'revisao' | 'concluido';

export type PipelineAgent = AgentName | 'marcio';
export type FlowStation = 'marcio' | 'gemini' | 'claude' | 'copilot' | 'entrega';
export type FunnelLane = 'captura' | 'triagem' | 'execucao' | 'revisao' | 'entregue';
export type OrchestratorStatus = 'idle' | 'watching' | 'dispatching' | 'paused' | 'error';

export interface PipelineItem {
  id: string;
  title: string;
  stage: PipelineStage;
  agent: PipelineAgent;
  priority: 'hi' | 'md' | 'lo';
  updatedAt: string;
  file_path: string | null;
}

export interface FlowItem {
  id: string;
  tipo: 'wo' | 'debate' | 'sr';
  titulo: string;
  lane: FunnelLane;
  station: FlowStation;
  proxima: FlowStation | null;
  ativo: boolean;
  file_path: string;
}

export interface FunnelState {
  captura: number;
  triagem: number;
  execucao: number;
  revisao: number;
  entregue: number;
}

export interface HiveEvent {
  ts: string;
  level: 'ok' | 'info' | 'warn' | 'err' | 'lock';
  msg: string;
}

export interface AgentDetail {
  inboxPending: number;
  activeWo: string | null;
  blockedCount: number;
  contextBytes: number;
}

export interface TaskRow {
  id: string;
  title: string;
  domain: 'hive' | 'product' | 'shared';
  status: 'pending' | 'in_progress' | 'done' | 'failed';
  assignee: string | null;
  priority: 'urgent' | 'normal' | 'low';
  thread: string | null;
  backlog_ref: string | null;
  wo_ref: string | null;
  fail_reason: string | null;
  source_entry: string | null;
  created_at: string;
  updated_at: string;
  claimed_at: string | null;
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

export interface DirectiveEntry {
  id: string;
  titulo: string;
  resumo: string;
  data?: string;
  status?: string;
}

export interface ManifestoContent {
  principios: Array<{ titulo: string; corpo: string }>;
}

export interface RoleEntry {
  agente: string;
  papel: string;
  descricao: string;
}

export interface InteractionEntry {
  id: string;
  owner: string;
  activity: string;
  type: string;
  acquired_at: string;
  released_at: string | null;
}

export interface InteractionLog {
  entries: InteractionEntry[];
  byAgent: Record<string, Record<string, number>>;
  totalByType: Record<string, number>;
  mostFrequentType: string | null;
}

export interface SquadMember {
  id: SquadMemberId;
  name: string;
  role: string;
  model: string;
  initial: string;
  inbox?: string;
  active: boolean;
}

export const SQUAD_FALLBACK: SquadMember[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'Facilitador Estratégico / PO',
    model: 'gemini-1.5-pro',
    initial: 'G',
    inbox: 'beehive/construcao/inbox-gemini.md',
    active: true,
  },
  {
    id: 'claude',
    name: 'Claude',
    role: 'Arquiteto + Auditor Técnico',
    model: 'claude-sonnet-4-6',
    initial: 'C',
    inbox: 'beehive/construcao/inbox-claude.md',
    active: true,
  },
  {
    id: 'copilot',
    name: 'Copilot',
    role: 'Engenheiro / Executor',
    model: 'gpt-4o',
    initial: 'P',
    inbox: 'beehive/construcao/inbox-copilot-hive.md',
    active: true,
  },
  {
    id: 'marcio',
    name: 'Márcio',
    role: 'Owner / The Gate',
    model: 'Human',
    initial: 'M',
    active: true,
  },
];

export interface HiveState {
  locks: Record<AgentName, { activity: string | null; acquiredAt: string | null } | null>;
  config: {
    autoMode: boolean;
    autoMerge: boolean;
    notifyMarcio: boolean;
  } | null;
  orchestrator: {
    status: OrchestratorStatus;
    currentItem: string | null;
    pauseReason: string | null;
    updatedAt: string | null;
    offline: boolean;
  } | null;
  session: {
    activeIssue: string | null;
    lastAction: string | null;
    nextStep: string | null;
  };
  inboxArchive: Record<AgentName, { eligibleCount: number; totalLines: number }>;
  agentDetails?: Record<AgentName, AgentDetail>;
  tasks: TaskRow[];
  gate: {
    pendentes: GateItem[];
    total: number;
  };
  debates?: DebateEntry[];
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
  flowItems?: FlowItem[];
  funnel?: FunnelState;
  governance: {
    directives: DirectiveEntry[];
    manifesto: ManifestoContent;
    roles: RoleEntry[];
  };
  interactionLog: InteractionLog;
  events: HiveEvent[];
  uptime: number;
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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export function useHiveSocket() {
  const [state, setState] = useState<HiveState | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>(SQUAD_FALLBACK);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socket = useMemo(
    () =>
      io('http://localhost:3001/hive', {
        transports: ['websocket', 'polling'],
      }),
    [],
  );

  useEffect(() => {
    let mounted = true;

    const syncTelemetry = async () => {
      const payload = await fetchJson<TelemetryState>('/api/hive/telemetry');
      if (mounted) {
        setTelemetry(payload);
        setError(null);
      }
    };

    const syncSquadMembers = async () => {
      try {
        const payload = await fetchJson<SquadMember[]>('/api/squad');
        if (mounted) {
          setSquadMembers(payload);
        }
      } catch {
        if (mounted) {
          setSquadMembers(SQUAD_FALLBACK);
        }
      }
    };

    Promise.all([fetchJson<HiveState>('/api/hive/state'), syncTelemetry(), syncSquadMembers()])
      .then(([payload]) => {
        if (mounted) {
          setState(payload);
        }
      })
      .catch((fetchError: Error) => {
        if (mounted) {
          setError(fetchError.message);
        }
      });

    socket.on('connect', () => {
      if (!mounted) {
        return;
      }

      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      if (mounted) {
        setConnected(false);
      }
    });

    socket.on('hive:update', (payload: HiveState) => {
      if (mounted) {
        setState(payload);
      }

      void syncTelemetry().catch((fetchError: Error) => {
        if (mounted) {
          setError(fetchError.message);
        }
      });
    });

    socket.on('connect_error', (socketError: Error) => {
      if (mounted) {
        setConnected(false);
        setError(socketError.message);
      }
    });

    return () => {
      mounted = false;
      socket.removeAllListeners();
      socket.close();
    };
  }, [socket]);

  async function saveSquadMembers(updated: SquadMember[]): Promise<SquadMember[]> {
    const response = await fetch('/api/squad', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (!response.ok) {
      const fallback = `HTTP ${response.status}`;
      try {
        const payload = (await response.json()) as { message?: string; error?: string };
        throw new Error(payload.message ?? payload.error ?? fallback);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(fallback);
      }
    }

    const payload = (await response.json()) as SquadMember[];
    setSquadMembers(payload);
    return payload;
  }

  return { state, telemetry, squadMembers, connected, error, saveSquadMembers };
}

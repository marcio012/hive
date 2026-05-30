import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export type AgentName = 'claude' | 'copilot' | 'gemini';

export type PipelineStage = 'triagem' | 'execucao' | 'revisao' | 'concluido';

export type PipelineAgent = AgentName | 'marcio';
export type OrchestratorStatus = 'idle' | 'watching' | 'dispatching' | 'paused' | 'error';

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
}

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
  } | null;
  session: {
    activeIssue: string | null;
    lastAction: string | null;
    nextStep: string | null;
  };
  inboxCounts: Record<AgentName, number>;
  inboxArchive: Record<AgentName, { eligibleCount: number; totalLines: number }>;
  agentDetails?: Record<AgentName, AgentDetail>;
  gate: {
    pendentes: GateItem[];
    total: number;
  };
  debates?: DebateEntry[];
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

    Promise.all([fetchJson<HiveState>('/api/hive/state'), syncTelemetry()])
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

  return { state, telemetry, connected, error };
}

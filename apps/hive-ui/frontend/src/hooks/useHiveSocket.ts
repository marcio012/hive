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

export function useHiveSocket() {
  const [state, setState] = useState<HiveState | null>(null);
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

    fetch('/api/hive/state')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return (await response.json()) as HiveState;
      })
      .then((payload) => {
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
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('hive:update', (payload: HiveState) => {
      setState(payload);
    });

    socket.on('connect_error', (socketError: Error) => {
      setConnected(false);
      setError(socketError.message);
    });

    return () => {
      mounted = false;
      socket.removeAllListeners();
      socket.close();
    };
  }, [socket]);

  return { state, connected, error };
}

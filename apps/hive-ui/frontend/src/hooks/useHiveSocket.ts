import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export interface HiveState {
  locks: Record<
    'claude' | 'copilot' | 'gemini',
    { activity: string | null; acquiredAt: string | null } | null
  >;
  session: {
    activeIssue: string | null;
    lastAction: string | null;
    nextStep: string | null;
  };
  inboxCounts: Record<'claude' | 'copilot' | 'gemini', number>;
  brainstorm: Array<{
    filename: string;
    title: string;
    thread: string | null;
    status: string | null;
    date: string | null;
    responsible: string | null;
  }>;
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

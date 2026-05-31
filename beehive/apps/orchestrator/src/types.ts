export type AgentName = 'claude' | 'copilot' | 'gemini';

export type OrchestratorStatus =
  | 'idle'
  | 'watching'
  | 'dispatching'
  | 'paused'
  | 'error';

export interface HiveConfig {
  autoMode: boolean;
  autoMerge: boolean;
  notifyMarcio: boolean;
}

export interface OrchestratorState {
  status: OrchestratorStatus;
  currentItem: string | null;
  pauseReason: string | null;
  consecutiveFailures: number;
  processedEntries: string[];
  updatedAt: string;
}

export interface LockState {
  owner: AgentName | null;
  activity: string | null;
  acquiredAt: string | null;
}

export interface InboxEntry {
  id: string;
  title: string;
  source: AgentName;
  filePath: string;
  status: string;
  tipo: string | null;
  destinatario: AgentName | null;
  bodyText: string;
  metadata: Record<string, string>;
}

export type RouteAction = 'dispatch_to_copilot' | 'notify_claude' | 'pause_and_escalate';

export interface RouteDecision {
  action: RouteAction;
  target: AgentName | null;
}

export interface DispatchResult {
  outcome: 'dispatched' | 'retry' | 'ignored' | 'failed';
  reason?: string;
}

export interface RoutingRule {
  match?: {
    tipo?: string;
    destinatario?: string;
    source?: string;
    pattern?: string;
    agent_livre?: string;
  };
  action?: RouteAction;
  default?: RouteAction;
}

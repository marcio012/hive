export type AgentName = 'claude' | 'copilot' | 'gemini' | 'copilot-hive' | 'copilot-tos';

export type TaskDomain = 'hive' | 'product' | 'shared';
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'failed';
export type TaskPriority = 'urgent' | 'normal' | 'low';

export interface Task {
  id: string;
  title: string;
  domain: TaskDomain;
  payload: string;
  status: TaskStatus;
  assignee: AgentName | null;
  priority: TaskPriority;
  thread: string | null;
  backlog_ref: string | null;
  wo_ref: string | null;
  source_agent: string | null;
  source_entry: string | null;
  created_at: string;
  updated_at: string;
  claimed_at: string | null;
}

export interface ClaimResult {
  claimed: boolean;
  task: Task | null;
}

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

export type RouteAction =
  | 'dispatch_to_copilot'
  | 'dispatch_to_copilot_hive'
  | 'dispatch_to_copilot_tos'
  | 'notify_claude'
  | 'pause_and_escalate';

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

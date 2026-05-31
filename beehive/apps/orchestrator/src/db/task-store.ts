import { AgentName, ClaimResult, Task, TaskDomain } from '../types';

export interface TaskStore {
  createTask(task: Omit<Task, 'created_at' | 'updated_at'>): Promise<Task>;
  claimTask(domain: TaskDomain, agent: AgentName): Promise<ClaimResult>;
  completeTask(id: string): Promise<void>;
  failTask(id: string, reason?: string): Promise<void>;
  listPending(domain?: TaskDomain): Promise<Task[]>;
}

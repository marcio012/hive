export type SquadMemberId = 'claude' | 'copilot' | 'gemini' | 'marcio';

export const SQUAD_MEMBER_IDS: SquadMemberId[] = ['claude', 'copilot', 'gemini', 'marcio'];

export class SquadMemberDto {
  id!: SquadMemberId;
  name!: string;
  role!: string;
  model!: string;
  initial!: string;
  inbox?: string;
  active!: boolean;
}

export const DEFAULT_SQUAD_MEMBERS: SquadMemberDto[] = [
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

export type SquadMemberId = 'claude' | 'copilot' | 'gemini' | 'marcio';

export interface SquadMember {
  id: SquadMemberId;
  name: string;
  role: string;
  model: string;
  initial: string;
  inbox: string;
  active: boolean;
}

export const DEFAULT_SQUAD_MEMBERS: SquadMember[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'Orquestrador',
    model: 'gemini-flash',
    initial: 'G',
    inbox: 'inbox-gemini.md',
    active: true,
  },
  {
    id: 'claude',
    name: 'Claude',
    role: 'Arquiteto',
    model: 'claude-sonnet',
    initial: 'C',
    inbox: 'inbox-claude.md',
    active: true,
  },
  {
    id: 'copilot',
    name: 'Copilot',
    role: 'Engenheiro',
    model: 'gpt-5.4',
    initial: 'P',
    inbox: 'inbox-copilot-hive.md',
    active: true,
  },
  {
    id: 'marcio',
    name: 'Diretor',
    role: 'Product Owner',
    model: 'Human / Owner',
    initial: 'M',
    inbox: 'inbox-marcio.md',
    active: true,
  },
];

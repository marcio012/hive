import React from 'react';
import { type AgentName, type HiveState } from '../hooks/useHiveSocket';

type AgentCardProps = {
  agentKey: AgentName | 'marcio';
  name: string;
  role: string;
  model: string;
  initial: string;
  state: HiveState | null;
};

function formatLockAge(value: string | null): string {
  if (!value) return 'ocioso';
  const diffMs = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return 'agora';
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  return `há ${minutes} min`;
}

function formatStartTime(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `iniciou ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export const AgentCardPremium: React.FC<AgentCardProps> = ({
  agentKey,
  name,
  role,
  model,
  initial,
  state,
}) => {
  const lock = state?.locks[agentKey as AgentName] ?? null;
  const active = Boolean(lock);

  return (
    <div className={`agent-card ${active ? 'active' : 'free'} ${agentKey}`}>
      {active && <span className="dot pulse agent-corner"></span>}
      <div className="agent-top">
        <div className="agent-ico">
          {agentKey === 'claude' && (
            <svg className="gear" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3.1"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15Z"/>
            </svg>
          )}
          {agentKey === 'copilot' && (
            <svg className="brk" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path className="brk-l" d="m8 8-4 4 4 4"/><path className="brk-r" d="m16 8 4 4-4 4"/><line className="brk-s" x1="13.5" y1="6" x2="10.5" y2="18"/>
            </svg>
          )}
          {agentKey === 'gemini' && (
            <svg className="compass" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8.5"/><path className="needle" d="m9 15 1.6-4.4L15 9l-1.6 4.4L9 15Z" fill="currentColor" stroke="none"/>
            </svg>
          )}
          {agentKey === 'marcio' && <span>{initial}</span>}
        </div>
        <div className="agent-meta">
          <span className={`badge ${active ? 'status' : 'gray'}`}>
            <span className={`dot ${active ? '' : 'gray'}`}></span>
            {active ? 'Em operação' : 'Livre'}
          </span>
          <div className="agent-name">{name}</div>
          <div className="agent-model">{model} · {active ? 'lock adquirido' : 'aguardando despacho'}</div>
        </div>
      </div>
      <div className={`agent-activity ${active ? '' : 'idle'}`}>
        <div className="what">
          {active ? (
            <>
              <span className="tag">▸</span>
              {lock?.activity}
            </>
          ) : (
            'Sem operação ativa — pronto para receber tarefa'
          )}
        </div>
        {active && <div className="act-bar"><i></i></div>}
        <div className="when">
          <span className={`dot ${active ? 'ac' : 'gray'}`} style={{ width: 6, height: 6 }}></span>
          {active ? (
            <>
              há {formatLockAge(lock?.acquiredAt ?? null).replace('há ', '')} · {formatStartTime(lock?.acquiredAt ?? null)}
            </>
          ) : (
            <>ocioso há {formatLockAge(lock?.acquiredAt ?? null).replace('há ', '')}</>
          )}
        </div>
      </div>
    </div>
  );
};

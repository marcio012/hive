import React from 'react';
import { type AgentName, type HiveState } from '../hooks/useHiveSocket';

type AgentCardProps = {
  agentKey: AgentName;
  name: string;
  model: string;
  initial: string;
  state: HiveState | null;
};

const CTX_WARN = 8 * 1024; // 8 KB
const CTX_CRITICAL = 15 * 1024; // 15 KB

function contextLevel(bytes: number): 'ok' | 'warn' | 'critical' {
  if (bytes === 0) return 'ok';
  if (bytes >= CTX_CRITICAL) return 'critical';
  if (bytes >= CTX_WARN) return 'warn';
  return 'ok';
}

function formatContextBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const CTX_LABEL: Record<'ok' | 'warn' | 'critical', string> = {
  ok: 'init saudável',
  warn: 'monitorar',
  critical: 'higiene urgente',
};

function formatLockAge(value: string | null): string {
  if (!value) return 'sem lock recente';
  const diffMs = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return 'agora';
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  return minutes === 0 ? 'agora' : `há ${minutes}min`;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agentKey,
  name,
  model,
  initial,
  state,
}) => {
  const lock = state?.locks[agentKey] ?? null;
  const active = Boolean(lock);
  const inboxCount = state?.inboxCounts[agentKey] ?? 0;
  const inboxLevel = inboxCount >= 3 ? 'red' : inboxCount >= 1 ? 'gold' : null;
  const ctxBytes = state?.agentDetails?.[agentKey]?.contextBytes ?? 0;
  const ctxLevel = contextLevel(ctxBytes);

  return (
    <article className={`agent-card ${active ? 'active' : 'free'} ctx-${ctxLevel}`}>
      {active ? <span className="dot green pulse agent-corner" /> : null}

      <div className="agent-top">
        {/* Coluna 1: Ícone */}
        <div className="agent-ico">{initial}</div>

        {/* Coluna 2: Informação */}
        <div className="agent-meta">
          <div className="agent-name">{name}</div>
          <div className="agent-model">{model}</div>
        </div>

        {/* Coluna 3: Sinal do Init (Bytes) */}
        <div className={`agent-context-cost ctx-cost--${ctxLevel} context-emphasis`}>
          <span className="ctx-bytes">{formatContextBytes(ctxBytes)}</span>
          <span className="ctx-badge">{CTX_LABEL[ctxLevel]}</span>
        </div>
      </div>

      <div className={`agent-activity ${active ? '' : 'idle'}`}>
        <div className="what">
          {active ? <span className="tag">▸</span> : null}
          {lock?.activity ?? 'Sem operação ativa — pronto para receber tarefa'}
        </div>
        {active ? (
          <div className="act-bar">
            <i />
          </div>
        ) : null}
        <div className="when">
          <span className={`dot ${active ? 'green' : 'gray'}`} />
          {formatLockAge(lock?.acquiredAt ?? null)}
          {inboxLevel ? (
            <span className={`inbox-badge inbox-${inboxLevel}`}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {inboxCount}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
};

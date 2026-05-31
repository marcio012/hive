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

const CTX_WARN = 8 * 1024;
const CTX_CRITICAL = 15 * 1024;

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

export const AgentCard: React.FC<AgentCardProps> = ({
  agentKey,
  name,
  role,
  model,
  initial,
  state,
}) => {
  const lock = state?.locks[agentKey as AgentName] ?? null;
  const active = Boolean(lock);
  const ctxBytes = state?.agentDetails?.[agentKey as AgentName]?.contextBytes ?? 0;
  const ctxLevel = contextLevel(ctxBytes);

  return (
    <article className={`agent-card-v2 ${active ? 'is-active' : 'is-free'} agent-${agentKey} ctx-${ctxLevel}`}>
      <div className="agent-v2-header">
        {/* Ícone Estilizado */}
        <div className="agent-v2-icon">
          {agentKey === 'claude' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15Z" />
            </svg>
          )}
          {agentKey === 'copilot' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
            </svg>
          )}
          {agentKey === 'gemini' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="m16.2 7.8-2 2.1-2.2 2.2-2.1 2.1" /><path d="m7.8 7.8 2.1 2 2.2 2.2 2.1 2.1" />
            </svg>
          )}
          {agentKey === 'marcio' && <span className="initial-m">{initial}</span>}
        </div>

        <div className="agent-v2-meta">
          <div className="agent-v2-status">
            <span className="status-dot"></span>
            {active ? 'Em operação' : 'Livre'}
          </div>
          <div className="agent-v2-title">Agente</div>
          <div className="agent-v2-subtitle">{name} · {role}</div>
        </div>

        {/* Indicador de Inicialização (Bytes) - Integrado como Badge Superior */}
        <div className={`agent-v2-bytes ctx-level-${ctxLevel}`}>
          {formatContextBytes(ctxBytes)}
        </div>

        {/* Ponto de status no canto */}
        <div className="corner-status-dot"></div>
      </div>

      <div className="agent-v2-body">
        <div className="agent-v2-activity">
          {active ? (
            <>
              <span className="arrow">▸</span>
              {lock?.activity}
            </>
          ) : (
            <span className="idle-text">Sem operação ativa — pronto para receber tarefa</span>
          )}
        </div>

        <div className="agent-v2-footer">
          <span className="time-ago">{formatLockAge(lock?.acquiredAt ?? null)}</span>
          {active && lock?.acquiredAt && (
            <>
              <span className="sep">·</span>
              <span className="start-time">{formatStartTime(lock.acquiredAt)}</span>
            </>
          )}
          {!active && (
            <>
              <span className="sep">·</span>
              <span className="model-name">{model}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

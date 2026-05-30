import { useMemo } from 'react';
import { type AgentName, type HiveState, type TelemetryState } from '../hooks/useHiveSocket';
import { ArtifactFilePath } from '../components/ArtifactFilePath';
import { ActiveItem } from '../components/ActiveItem';
import { EsteiraPorProcesso } from './EsteiraPorProcesso';

type MapaFabricaProps = {
  state: HiveState | null;
  telemetry: TelemetryState | null;
};

const agents: Array<{
  key: AgentName;
  name: string;
  model: string;
  initial: string;
}> = [
  { key: 'claude', name: 'Claude', model: 'claude-sonnet', initial: 'C' },
  { key: 'copilot', name: 'Copilot', model: 'gpt-5.4', initial: 'P' },
  { key: 'gemini', name: 'Gemini', model: 'gemini-pro', initial: 'G' },
];

function formatLockAge(value: string | null): string {
  if (!value) {
    return 'sem lock recente';
  }

  const diffMs = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) {
    return 'agora';
  }

  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  return minutes === 0 ? 'agora' : `há ${minutes}min`;
}

function formatMinutesAgo(value: number | null): string {
  if (value === null) {
    return '—';
  }

  if (value <= 0) {
    return 'agora';
  }

  return `há ${value}min`;
}

function formatCurrency(value: number | null | undefined): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return `${Math.round(value)}%`;
}

const CTX_WARN     = 8 * 1024;   // 8 KB
const CTX_CRITICAL = 15 * 1024;  // 15 KB

function contextLevel(bytes: number): 'ok' | 'warn' | 'critical' {
  if (bytes === 0)              return 'ok';
  if (bytes >= CTX_CRITICAL)   return 'critical';
  if (bytes >= CTX_WARN)       return 'warn';
  return 'ok';
}

function formatContextBytes(bytes: number): string {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const CTX_LABEL: Record<'ok' | 'warn' | 'critical', string> = {
  ok:       'init saudável',
  warn:     'monitorar',
  critical: 'higiene urgente',
};

function formatMetric(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

const STATIONS = [
  { key: 'marcio',  name: 'Márcio',  role: 'Operador',       initial: 'M', cls: 'human'   },
  { key: 'gemini',  name: 'Gemini',  role: 'Product Owner',  initial: 'G', cls: 'gemini'  },
  { key: 'claude',  name: 'Claude',  role: 'Arquiteto',      initial: 'C', cls: 'claude'  },
  { key: 'copilot', name: 'Copilot', role: 'Engenheiro',     initial: 'P', cls: 'copilot' },
  { key: 'entrega', name: 'Entrega', role: 'Mergeado',       initial: '✓', cls: 'deliver' },
] as const;

export function MapaFabrica({ state, telemetry }: MapaFabricaProps) {
  const activeIssue = state?.session.activeIssue ?? '—';
  const lastAction = state?.session.lastAction ?? 'Sem ação registrada.';
  const nextStep = state?.session.nextStep ?? 'Aguardando próximo passo definido.';
  const efficiencyByAgent = useMemo(
    () =>
      new Map((telemetry?.agentEfficiency ?? []).map((item) => [item.agent, item])),
    [telemetry],
  );

  const stationCount: Record<string, { n: number; label: string }> = {
    gemini:  { n: state?.agentDetails?.gemini?.inboxPending  ?? 0, label: 'em triagem'  },
    claude:  { n: state?.agentDetails?.claude?.inboxPending  ?? 0, label: 'em análise'  },
    copilot: { n: state?.agentDetails?.copilot?.activeWo ? 1 : 0,  label: 'em execução' },
  };

  const transitDebates = (state?.debates ?? []).filter((d) => d.active);
  const copilotWo = state?.agentDetails?.copilot?.activeWo ?? null;
  const activeCopilotPipelineItem = useMemo(
    () =>
      (state?.pipeline ?? []).find((item) => item.agent === 'copilot' && item.stage === 'execucao') ??
      null,
    [state?.pipeline],
  );

  return (
    <main className="screen active">
      <div className="page page-map">
        <div className="page-head">
          <h1>Mapa da Fábrica</h1>
          <div className="sub">
            <span className="live-dot" />
            Estado operacional em tempo real
          </div>
        </div>

        <div className="section-label">
          <span className="n">01</span>
          Agentes
          <span className="line" />
        </div>

        <div className="grid-3">
          {agents.map((agent) => {
            const lock = state?.locks[agent.key] ?? null;
            const active = Boolean(lock);
            const inboxCount = state?.inboxCounts[agent.key] ?? 0;
            const inboxLevel = inboxCount >= 3 ? 'red' : inboxCount >= 1 ? 'gold' : null;
            const ctxBytes = state?.agentDetails?.[agent.key]?.contextBytes ?? 0;
            const ctxLevel = contextLevel(ctxBytes);

            return (
              <article key={agent.key} className={`agent-card ${active ? 'active' : 'free'} ctx-${ctxLevel}`}>
                {active ? <span className="dot green pulse agent-corner" /> : null}
                <div className="agent-top">
                  <div className="agent-ico">{agent.initial}</div>
                  <div className="agent-meta">
                    <span className={`badge ${active ? 'green' : 'gray'}`}>
                      <span className={`dot ${active ? 'green' : 'gray'}`} />
                      {active ? 'Em operação' : 'Livre'}
                    </span>
                    <div className="agent-name-row">
                      <div className="agent-name">{agent.name}</div>
                      <div className={`agent-context-cost ctx-cost--${ctxLevel}`}>
                        <span className="ctx-bytes">{formatContextBytes(ctxBytes)}</span>
                        <span className="ctx-badge">{CTX_LABEL[ctxLevel]}</span>
                      </div>
                    </div>
                    <div className="agent-model">
                      {agent.model} · {active ? 'lock adquirido' : 'aguardando despacho'}
                    </div>
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
          })}
        </div>

        <ActiveItem 
          activeIssue={activeIssue}
          lastAction={lastAction}
          nextStep={nextStep}
        />

        <EsteiraPorProcesso state={state} />

        <div className="section-label">
          <span className="n">03</span>
          Inbox · Pendências
          <span className="line" />
        </div>

        <div className="grid-3">
          {agents.map((agent) => {
            const count = state?.inboxCounts[agent.key] ?? 0;
            const pending = count > 0;

            return (
              <div
                key={agent.key}
                className={`inbox-card ${pending ? 'pending glow-border-pulse' : ''}`.trim()}
              >
                <div className="inbox-ico">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>
                <div>
                  <div className="who">{agent.name}</div>
                  <div className="desc">{pending ? 'aprovações aguardando' : 'inbox limpa'}</div>
                </div>
                <div className="inbox-count">{count}</div>
              </div>
            );
          })}
        </div>

        <div className="section-label">
          <span className="n">04</span>
          Eficiência do Squad
          <span className="line" />
        </div>

        <div className="grid-3">
          {agents.map((agent) => {
            const metrics = efficiencyByAgent.get(agent.key);
            const budgetPct = metrics?.weeklyBudgetPct ?? 0;
            const cardState =
              budgetPct >= 90 ? 'eff-critical' : budgetPct >= 75 ? 'eff-alert' : '';

            return (
              <article key={agent.key} className={`eff-card ${cardState}`.trim()}>
                <div className="eff-head">
                  <div className={`eff-avatar av-${agent.key}`}>{agent.initial}</div>
                  <div>
                    <div className="eff-name">{agent.name}</div>
                    <div className="eff-role">{metrics?.role ?? 'Sem dados'}</div>
                  </div>
                  {metrics?.lastInitMinutesAgo !== null &&
                  metrics?.lastInitMinutesAgo !== undefined &&
                  metrics.lastInitMinutesAgo <= 30 ? (
                    <span className="eff-pill">
                      <span className="dot green pulse" />
                      init ativa
                    </span>
                  ) : (
                    <span className="eff-pill muted">sem init</span>
                  )}
                </div>

                <div className="eff-grid">
                  <div className="eff-metric">
                    <span>WO’s semana</span>
                    <strong>{formatMetric(metrics?.weeklyWOs ?? 0, 0)}</strong>
                  </div>
                  <div className="eff-metric">
                    <span>Custo sessão</span>
                    <strong>{formatCurrency(metrics?.sessionCostBRL)}</strong>
                  </div>
                  <div className="eff-metric">
                    <span>Inits</span>
                    <strong>{formatMetric(metrics?.initCount ?? 0, 0)}</strong>
                  </div>
                  <div className="eff-metric">
                    <span>Rodadas/init</span>
                    <strong>{formatMetric(metrics?.avgRoundsPerInit)}</strong>
                  </div>
                </div>

                <div className="eff-progress">
                  <div className="eff-progress-meta">
                    <span>Budget semanal</span>
                    <span>{formatPercent(metrics?.weeklyBudgetPct ?? 0)}</span>
                  </div>
                  <div className="eff-bar">
                    <i style={{ width: `${Math.max(0, Math.min(100, budgetPct))}%` }} />
                  </div>
                  <div className="eff-progress-foot">
                    <span>{formatCurrency(metrics?.weeklyBudgetBRL)}</span>
                    <span>{formatMinutesAgo(metrics?.lastInitMinutesAgo ?? null)}</span>
                  </div>
                </div>

                <div className="eff-foot">
                  <span>Aprovação: {formatPercent(metrics?.approvalRate)}</span>
                  <span>Peso: {formatMetric(metrics?.peso, 0)}</span>
                </div>
              </article>
            );
          })}
        </div>

        
      </div>
    </main>
  );
}

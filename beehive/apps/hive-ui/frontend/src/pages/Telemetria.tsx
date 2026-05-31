import { type AgentName, type TelemetryState } from '../hooks/useHiveSocket';

type TelemetriaProps = {
  telemetry: TelemetryState | null;
};

const agentOrder: AgentName[] = ['claude', 'copilot', 'gemini'];
const agentInitials: Record<AgentName, string> = {
  claude: 'C',
  copilot: 'P',
  gemini: 'G',
};

function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return '—';
  }

  return `${Math.round(value)}%`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function estimateWeight(rounds: number): string {
  if (rounds <= 0) {
    return '—';
  }

  return '●'.repeat(Math.max(1, Math.min(5, Math.ceil(rounds / 4))));
}

export function Telemetria({ telemetry }: TelemetriaProps) {
  const weeklyUsage = telemetry?.weeklyUsage;
  const efficiencyByAgent = new Map((telemetry?.agentEfficiency ?? []).map((item) => [item.agent, item]));
  const historyByAgent = new Map((telemetry?.initHistory ?? []).map((item) => [item.agent, item]));

  return (
    <main className="screen active">
      <div className="page">
        <div className="page-head">
          <h1>Telemetria do Squad</h1>
          <div className="sub">
            <span className="live-dot" />
            Custos, tokens e ritmo semanal por agente
          </div>
        </div>

        {!telemetry?.logExists ? (
          <div className="telemetry-banner">
            <span className="dot orange" />
            `custos.log` indisponível. O cockpit está usando placeholders seguros até a telemetria voltar.
          </div>
        ) : null}

        <div className="telemetry-usage">
          <article className="usage-card">
            <div className="usage-head">
              <div>
                <span className="eyebrow">budget semanal</span>
                <h2>
                  {formatCurrency(weeklyUsage?.totalCostBRL ?? 0)}
                  <small> / {formatCurrency(weeklyUsage?.budgetBRL ?? 0)}</small>
                </h2>
              </div>
              <span className="usage-pill">
                {formatPercent(weeklyUsage?.usagePct ?? 0)} · reset em {weeklyUsage?.resetInDays ?? 0}d
              </span>
            </div>

            <div className="usage-bar">
              <i style={{ width: `${Math.max(0, Math.min(100, weeklyUsage?.usagePct ?? 0))}%` }} />
            </div>

            <div className="usage-stats">
              <div>
                <span>Tokens usados</span>
                <strong>{formatNumber(weeklyUsage?.tokensUsed ?? 0)}</strong>
              </div>
              <div>
                <span>Limite semanal</span>
                <strong>{formatNumber(weeklyUsage?.tokenLimit ?? 0)}</strong>
              </div>
              <div>
                <span>Input</span>
                <strong>{formatNumber(weeklyUsage?.inputTokens ?? 0)}</strong>
              </div>
              <div>
                <span>Output</span>
                <strong>{formatNumber(weeklyUsage?.outputTokens ?? 0)}</strong>
              </div>
            </div>
          </article>

          <article className="usage-breakdown">
            <div className="usage-breakdown-head">
              <h3>Custos por categoria</h3>
              <span className="eyebrow">estimativa BRL</span>
            </div>

            <div className="usage-breakdown-grid">
              <div className="usage-mini">
                <span>Input</span>
                <strong>{formatCurrency(weeklyUsage?.inputCostBRL ?? 0)}</strong>
                <small>{formatNumber(weeklyUsage?.inputTokens ?? 0)} tokens</small>
              </div>
              <div className="usage-mini">
                <span>Output</span>
                <strong>{formatCurrency(weeklyUsage?.outputCostBRL ?? 0)}</strong>
                <small>{formatNumber(weeklyUsage?.outputTokens ?? 0)} tokens</small>
              </div>
              <div className="usage-mini">
                <span>Cache</span>
                <strong>{formatCurrency(weeklyUsage?.cacheCostBRL ?? 0)}</strong>
                <small>{formatNumber(weeklyUsage?.cacheTokens ?? 0)} tokens</small>
              </div>
            </div>
          </article>
        </div>

        <div className="section-label">
          <span className="n">01</span>
          Inits & Interações
          <span className="line" />
        </div>

        <div className="telemetry-grid">
          {agentOrder.map((agent) => {
            const efficiency = efficiencyByAgent.get(agent);
            const history = historyByAgent.get(agent);

            return (
              <article key={agent} className="telemetry-agent-card">
                <div className="telemetry-agent-head">
                  <div className={`eff-avatar av-${agent}`}>{agentInitials[agent]}</div>
                  <div>
                    <div className="eff-name">{agent}</div>
                    <div className="eff-role">{efficiency?.role ?? 'Sem dados'}</div>
                  </div>
                  <span className="telemetry-inline-pill">
                    {formatNumber(efficiency?.initCount ?? 0)} inits
                  </span>
                </div>

                <div className="telemetry-summary">
                  <div>
                    <span>WO’s semana</span>
                    <strong>{formatNumber(efficiency?.weeklyWOs ?? 0)}</strong>
                  </div>
                  <div>
                    <span>Rodadas/init</span>
                    <strong>
                      {efficiency?.avgRoundsPerInit === null || efficiency?.avgRoundsPerInit === undefined
                        ? '—'
                        : formatNumber(efficiency.avgRoundsPerInit, 1)}
                    </strong>
                  </div>
                  <div>
                    <span>Aprovação</span>
                    <strong>{formatPercent(efficiency?.approvalRate ?? null)}</strong>
                  </div>
                </div>

                <div className="telemetry-table-wrap">
                  <table className="telemetry-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Início</th>
                        <th>Rodadas</th>
                        <th>Peso</th>
                        <th>Custo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(history?.weeklyInits ?? []).length > 0 ? (
                        history?.weeklyInits.map((session) => (
                          <tr key={`${agent}-${session.index}-${session.startedAt}`}>
                            <td>
                              <span className="mono-cell">
                                {session.index}
                                {session.isActive ? ' ↻' : ''}
                              </span>
                            </td>
                            <td>{formatDateTime(session.startedAt)}</td>
                            <td>{formatNumber(session.rounds)}</td>
                            <td>{estimateWeight(session.rounds)}</td>
                            <td>{formatCurrency(session.costBRL)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="telemetry-empty">
                            Sem inits nesta janela semanal.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

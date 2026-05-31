import { useMemo } from 'react';
import { type AgentEfficiency, type AgentName, type TelemetryState } from '../hooks/useHiveSocket';

type TelemetriaProps = {
  telemetry: TelemetryState | null;
};

const agentOrder: AgentName[] = ['claude', 'copilot', 'gemini'];
export const agentMeta: Record<AgentName, { name: string; initial: string }> = {
  claude: { name: 'Claude', initial: 'C' },
  copilot: { name: 'Copilot', initial: 'P' },
  gemini: { name: 'Gemini', initial: 'G' },
};

export function clampPct(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function allocateTokensByCost(
  metrics: AgentEfficiency[],
  totalTokens: number,
  totalCostBRL: number,
): Map<AgentName, number | null> {
  const result = new Map<AgentName, number | null>(agentOrder.map((agent) => [agent, null]));
  if (totalCostBRL <= 0 || totalTokens <= 0) return result;

  const rawShares = metrics.map((metric) => {
    const exact = (metric.totalCostBRL / totalCostBRL) * totalTokens;
    const floored = Math.floor(exact);
    return { agent: metric.agent, floored, fraction: exact - floored };
  });

  let remaining = totalTokens - rawShares.reduce((sum, item) => sum + item.floored, 0);
  rawShares
    .sort((left, right) => right.fraction - left.fraction)
    .forEach((item, index) => {
      result.set(item.agent, item.floored + (index < remaining ? 1 : 0));
    });

  return result;
}

export function formatTelNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatTelCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number | null): string {
  if (value === null) return '—';
  return `${Math.round(value)}%`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function estimateWeight(rounds: number): string {
  if (rounds <= 0) return '—';
  return '●'.repeat(Math.max(1, Math.min(5, Math.ceil(rounds / 4))));
}

export function TelemetriaContent({ telemetry }: { telemetry: TelemetryState | null }) {
  const weeklyUsage = telemetry?.weeklyUsage;
  const efficiencyByAgent = new Map((telemetry?.agentEfficiency ?? []).map((item) => [item.agent, item]));
  const historyByAgent = new Map((telemetry?.initHistory ?? []).map((item) => [item.agent, item]));

  const allocatedTokens = useMemo(
    () =>
      allocateTokensByCost(
        telemetry?.agentEfficiency ?? [],
        weeklyUsage?.tokensUsed ?? 0,
        weeklyUsage?.totalCostBRL ?? 0,
      ),
    [telemetry, weeklyUsage],
  );

  const totalConsolidatedCost = useMemo(
    () => (telemetry?.agentEfficiency ?? []).reduce((sum, item) => sum + item.totalCostBRL, 0),
    [telemetry],
  );

  return (
    <>
      {telemetry?.logExists ? (
        <>
          <div className="grid-3">
            {agentOrder.map((agent) => {
              const metric = efficiencyByAgent.get(agent);
              const tokens = allocatedTokens.get(agent) ?? null;
              const budgetPct = clampPct(metric?.weeklyBudgetPct ?? 0);

              return (
                <article key={agent} className="agent-token-card">
                  <div className="telemetry-agent-head">
                    <div className={`eff-avatar av-${agent}`}>{agentMeta[agent].initial}</div>
                    <div>
                      <div className="atc-name">{agentMeta[agent].name}</div>
                      <div className="atc-role">{metric?.role ?? 'Sem dados'}</div>
                    </div>
                  </div>
                  <div className="atc-tokens">{tokens === null ? '—' : formatTelNumber(tokens)}</div>
                  <div className="atc-cost">{formatTelCurrency(metric?.totalCostBRL ?? 0)}</div>
                  <div>
                    <div className="eff-progress-meta">
                      <span>Budget semanal</span>
                      <span>{Math.round(budgetPct)}%</span>
                    </div>
                    <div className="token-bar">
                      <i style={{ width: `${budgetPct}%` }} />
                    </div>
                  </div>
                  <div className="atc-sessions">{metric?.initCount ?? 0} sessões na semana</div>
                </article>
              );
            })}
          </div>

          {/* <footer className="atc-footer">
            <div>
              <div className="atf-label">Tokens totais</div>
              <div className="atf-value">{formatTelNumber(weeklyUsage?.tokensUsed ?? 0)}</div>
            </div>
            <div>
              <div className="atf-label">Custo total</div>
              <div className="atf-value">{formatTelCurrency(totalConsolidatedCost)}</div>
            </div>
          </footer> */}
        </>
      ) : null}

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
                {formatTelCurrency(weeklyUsage?.totalCostBRL ?? 0)}
                <small> / {formatTelCurrency(weeklyUsage?.budgetBRL ?? 0)}</small>
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
              <strong>{formatTelNumber(weeklyUsage?.tokensUsed ?? 0)}</strong>
            </div>
            <div>
              <span>Limite semanal</span>
              <strong>{formatTelNumber(weeklyUsage?.tokenLimit ?? 0)}</strong>
            </div>
            <div>
              <span>Input</span>
              <strong>{formatTelNumber(weeklyUsage?.inputTokens ?? 0)}</strong>
            </div>
            <div>
              <span>Output</span>
              <strong>{formatTelNumber(weeklyUsage?.outputTokens ?? 0)}</strong>
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
              <strong>{formatTelCurrency(weeklyUsage?.inputCostBRL ?? 0)}</strong>
              <small>{formatTelNumber(weeklyUsage?.inputTokens ?? 0)} tokens</small>
            </div>
            <div className="usage-mini">
              <span>Output</span>
              <strong>{formatTelCurrency(weeklyUsage?.outputCostBRL ?? 0)}</strong>
              <small>{formatTelNumber(weeklyUsage?.outputTokens ?? 0)} tokens</small>
            </div>
            <div className="usage-mini">
              <span>Cache</span>
              <strong>{formatTelCurrency(weeklyUsage?.cacheCostBRL ?? 0)}</strong>
              <small>{formatTelNumber(weeklyUsage?.cacheTokens ?? 0)} tokens</small>
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
                <div className={`eff-avatar av-${agent}`}>{agentMeta[agent].initial}</div>
                <div>
                  <div className="eff-name">{agent}</div>
                  <div className="eff-role">{efficiency?.role ?? 'Sem dados'}</div>
                </div>
                <span className="telemetry-inline-pill">
                  {formatTelNumber(efficiency?.initCount ?? 0)} inits
                </span>
              </div>

              <div className="telemetry-summary">
                <div>
                  <span>WO's semana</span>
                  <strong>{formatTelNumber(efficiency?.weeklyWOs ?? 0)}</strong>
                </div>
                <div>
                  <span>Rodadas/init</span>
                  <strong>
                    {efficiency?.avgRoundsPerInit === null || efficiency?.avgRoundsPerInit === undefined
                      ? '—'
                      : formatTelNumber(efficiency.avgRoundsPerInit, 1)}
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
                          <td>{formatTelNumber(session.rounds)}</td>
                          <td>{estimateWeight(session.rounds)}</td>
                          <td>{formatTelCurrency(session.costBRL)}</td>
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
    </>
  );
}

export function Telemetria({ telemetry }: TelemetriaProps) {
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
        <TelemetriaContent telemetry={telemetry} />
      </div>
    </main>
  );
}

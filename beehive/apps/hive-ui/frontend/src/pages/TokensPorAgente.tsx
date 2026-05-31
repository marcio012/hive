import { useMemo } from 'react';
import { type AgentEfficiency, type AgentName, type TelemetryState } from '../hooks/useHiveSocket';

type TokensPorAgenteProps = {
  telemetry: TelemetryState | null;
};

const AGENT_ORDER: AgentName[] = ['claude', 'copilot', 'gemini'];

const AGENT_META: Record<AgentName, { name: string; initial: string }> = {
  claude: { name: 'Claude', initial: 'C' },
  copilot: { name: 'Copilot', initial: 'P' },
  gemini: { name: 'Gemini', initial: 'G' },
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
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

function clampPct(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function allocateTokensByCost(
  metrics: AgentEfficiency[],
  totalTokens: number,
  totalCostBRL: number,
): Map<AgentName, number | null> {
  const result = new Map<AgentName, number | null>(AGENT_ORDER.map((agent) => [agent, null]));

  if (totalCostBRL <= 0 || totalTokens <= 0) {
    return result;
  }

  const rawShares = metrics.map((metric) => {
    const exact = (metric.totalCostBRL / totalCostBRL) * totalTokens;
    const floored = Math.floor(exact);

    return {
      agent: metric.agent,
      floored,
      fraction: exact - floored,
    };
  });

  let remaining = totalTokens - rawShares.reduce((sum, item) => sum + item.floored, 0);

  rawShares
    .sort((left, right) => right.fraction - left.fraction)
    .forEach((item, index) => {
      const extra = index < remaining ? 1 : 0;
      result.set(item.agent, item.floored + extra);
    });

  return result;
}

export function TokensPorAgente({ telemetry }: TokensPorAgenteProps) {
  const metricsByAgent = useMemo(
    () => new Map((telemetry?.agentEfficiency ?? []).map((item) => [item.agent, item])),
    [telemetry],
  );

  const weeklyUsage = telemetry?.weeklyUsage;
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
    <main className="screen active">
      <div className="page">
        <div className="page-head">
          <h1>Tokens por Agente</h1>
          <div className="sub">
            <span className="live-dot" />
            Consumo acumulado da semana
          </div>
        </div>

        {!telemetry?.logExists ? (
          <div className="telemetry-banner">
            <span className="dot orange" />
            Nenhum dado de telemetria disponível ainda.
          </div>
        ) : (
          <>
            <div className="grid-3">
              {AGENT_ORDER.map((agent) => {
                const metric = metricsByAgent.get(agent);
                const tokens = allocatedTokens.get(agent) ?? null;
                const role = metric?.role ?? 'Sem dados';
                const cost = metric?.totalCostBRL ?? 0;
                const budgetPct = clampPct(metric?.weeklyBudgetPct ?? 0);

                return (
                  <article key={agent} className="agent-token-card">
                    <div className="telemetry-agent-head">
                      <div className={`eff-avatar av-${agent}`}>{AGENT_META[agent].initial}</div>
                      <div>
                        <div className="atc-name">{AGENT_META[agent].name}</div>
                        <div className="atc-role">{role}</div>
                      </div>
                    </div>

                    <div className="atc-tokens">{tokens === null ? '—' : formatNumber(tokens)}</div>
                    <div className="atc-cost">{formatCurrency(cost)}</div>

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

            <footer className="atc-footer">
              <div>
                <div className="atf-label">Tokens totais</div>
                <div className="atf-value">{formatNumber(weeklyUsage?.tokensUsed ?? 0)}</div>
              </div>
              <div>
                <div className="atf-label">Custo total</div>
                <div className="atf-value">{formatCurrency(totalConsolidatedCost)}</div>
              </div>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}

import '../premium.css';
import { type AgentName, type HiveState, type TelemetryState } from '../hooks/useHiveSocket';
import { ActiveItemPremium } from '../components/ActiveItemPremium';
import { AgentCardPremium } from '../components/AgentCardPremium';
import { EsteiraPremium } from '../components/EsteiraPremium';

type DashboardSimplesProps = {
  state: HiveState | null;
  telemetry: TelemetryState | null;
};

type FactoryAgentKey = AgentName | 'marcio';

const agents: Array<{
  key: FactoryAgentKey;
  name: string;
  role: string;
  model: string;
  initial: string;
}> = [
  { key: 'claude',  name: 'Claude',  role: 'Arquiteto',      model: 'claude-sonnet', initial: 'C' },
  { key: 'copilot', name: 'Copilot', role: 'Engenheiro',     model: 'gpt-4o',        initial: 'G' },
  { key: 'gemini',  name: 'Gemini',  role: 'Product Owner',  model: 'gemini-pro',    initial: 'A' },
];

function getAgentValue<T>(
  record: Record<AgentName, T> | null | undefined,
  agent: FactoryAgentKey,
): T | undefined {
  if (!record) return undefined;
  switch (agent) {
    case 'claude':
      return record.claude;
    case 'copilot':
      return record.copilot;
    case 'gemini':
      return record.gemini;
    case 'marcio':
      return undefined;
  }
}

export function DashboardSimples({ state }: DashboardSimplesProps) {
  const activeIssue = state?.session.activeIssue ?? '—';
  const lastAction = state?.session.lastAction ?? 'Sem ação registrada.';
  const nextStep = state?.session.nextStep ?? 'Aguardando próximo passo definido.';

  return (
    <main className="screen active premium-theme">
      <div className="page page-map">
        <div className="page-head">
          <h1>Operação do Squad</h1>
          <div className="sub">
            <span className="live-dot" />
            Visão simplificada em tempo real
          </div>
        </div>

        {/* Seção 01: Agentes */}
        <div className="section-label">
          <span className="n">01</span>
          Agentes
          <span className="line" />
        </div>

        <div className="grid-3" style={{ marginBottom: 30 }}>
          {agents.map((agent) => (
            <AgentCardPremium
              key={agent.key}
              agentKey={agent.key}
              initial={agent.initial}
              model={agent.model}
              name={agent.name}
              role={agent.role}
              state={state}
            />
          ))}
        </div>

        {/* Seção 02: Item Ativo */}
        <ActiveItemPremium 
          activeIssue={activeIssue}
          lastAction={lastAction}
          nextStep={nextStep}
        />

        {/* Seção 03: Esteira de Produção */}
        <EsteiraPremium state={state} />

        {/* Seção 04: Inbox Pendentes */}
        <div className="section-label" style={{ marginTop: 30 }}>
          <span className="n">04</span>
          Inbox · Pendências
          <span className="line" />
        </div>

        <div className="grid-3">
          {agents.map((agent) => {
            const count = getAgentValue(state?.inboxCounts ?? null, agent.key) ?? 0;
            const pending = count > 0;

            return (
              <div
                key={agent.key}
                className={`inbox-card ${pending ? 'pending glow-border-pulse' : ''}`.trim()}
                data-agent={agent.key}
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
      </div>
    </main>
  );
}

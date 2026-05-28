import { type AgentName, type HiveState } from '../hooks/useHiveSocket';

type MapaFabricaProps = {
  state: HiveState | null;
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

function formatMinutesAgo(value: string | null): string {
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

export function MapaFabrica({ state }: MapaFabricaProps) {
  const activeIssue = state?.session.activeIssue ?? '—';
  const lastAction = state?.session.lastAction ?? 'Sem ação registrada.';
  const nextStep = state?.session.nextStep ?? 'Aguardando próximo passo definido.';

  return (
    <main className="screen active">
      <div className="page">
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

            return (
              <article key={agent.key} className={`agent-card ${active ? 'active' : 'free'}`}>
                {active ? <span className="dot green pulse agent-corner" /> : null}
                <div className="agent-top">
                  <div className="agent-ico">{agent.initial}</div>
                  <div className="agent-meta">
                    <span className={`badge ${active ? 'green' : 'gray'}`}>
                      <span className={`dot ${active ? 'green' : 'gray'}`} />
                      {active ? 'Em operação' : 'Livre'}
                    </span>
                    <div className="agent-name">{agent.name}</div>
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
                  {active ? <div className="act-bar"><i /></div> : null}
                  <div className="when">
                    <span className={`dot ${active ? 'green' : 'gray'}`} />
                    {formatMinutesAgo(lock?.acquiredAt ?? null)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="section-label">
          <span className="n">02</span>
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
                  <div className="desc">
                    {pending ? 'aprovações aguardando' : 'inbox limpa'}
                  </div>
                </div>
                <div className="inbox-count">{count}</div>
              </div>
            );
          })}
        </div>

        <div className="active-item">
          <div className="ai-head">
            <span className="bolt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
              </svg>
            </span>
            <h3>Item Ativo</h3>
            <span className="pill">foco da fábrica</span>
          </div>
          <div className="ai-grid">
            <div className="ai-col">
              <div className="lab">Issue ativa</div>
              <div className="issue">{activeIssue}</div>
            </div>
            <div className="ai-col">
              <div className="lab">Última ação</div>
              <div className="val">{lastAction}</div>
            </div>
            <div className="ai-col">
              <div className="lab">Próximo passo</div>
              <div className="next">{nextStep}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

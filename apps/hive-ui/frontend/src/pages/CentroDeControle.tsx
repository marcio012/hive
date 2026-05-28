import { useMemo, useState } from 'react';
import { type AgentName, type HiveState } from '../hooks/useHiveSocket';

type CentroDeControleProps = {
  state: HiveState | null;
};

function formatUptime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function agentClass(agent: AgentName): string {
  if (agent === 'claude') {
    return 'av-claude';
  }

  if (agent === 'copilot') {
    return 'av-copilot';
  }

  return 'av-gemini';
}

function agentLabel(agent: AgentName): string {
  return agent === 'copilot' ? 'P' : agent.charAt(0).toUpperCase();
}

export function CentroDeControle({ state }: CentroDeControleProps) {
  const [autoMode, setAutoMode] = useState(true);
  const [autoMerge, setAutoMerge] = useState(false);
  const [notifyMarcio, setNotifyMarcio] = useState(true);

  const activeLocks = useMemo(
    () =>
      (Object.entries(state?.locks ?? {}) as Array<[AgentName, HiveState['locks'][AgentName]]>).filter(
        ([, lock]) => lock,
      ),
    [state],
  );

  const events = state?.events ?? [];

  return (
    <main className="screen active">
      <div className="page">
        <div className="page-head">
          <h1>Centro de Controle</h1>
          <div className="sub">
            <span className="live-dot" />
            Decisões pendentes — aja sem sair do painel
          </div>
        </div>

        <div className="cc-stats">
          <div className="stat good">
            <div className="k">Uptime</div>
            <div className="v">{formatUptime(state?.uptime ?? 0)}</div>
          </div>
          <div className="stat gold">
            <div className="k">Locks ativos</div>
            <div className="v">
              {activeLocks.length}
              <small> / 3 agentes</small>
            </div>
          </div>
          <div className="stat">
            <div className="k">Comandos</div>
            <div className="v">—</div>
          </div>
          <div className="stat good">
            <div className="k">Status</div>
            <div className="v">{events.length > 0 ? 'ONLINE' : 'IDLE'}</div>
          </div>
        </div>

        <div className="cc-grid">
          <div>
            <div className="panel">
              <div className="ph">
                <span className="ph-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                <h3>Locks Ativos</h3>
                <span className="ph-meta">{activeLocks.length} detidos</span>
              </div>
              <div className="pb">
                {activeLocks.length > 0 ? (
                  activeLocks.map(([agent, lock]) => (
                    <div key={agent} className="lock-row">
                      <div className={`la ${agentClass(agent)}`}>{agentLabel(agent)}</div>
                      <div className="lmeta">
                        <div className="res">
                          {lock?.activity ?? 'sem atividade'}
                          <span className="by"> · {agent}</span>
                        </div>
                        <div className="since">{lock?.acquiredAt ?? 'sem timestamp'}</div>
                      </div>
                      <button className="btn-ghost" type="button">
                        Forçar liberação
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="lock-row">
                    <div className="lmeta">
                      <div className="res">Nenhum lock ativo</div>
                      <div className="since">squad livre para despacho</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="ph">
                <span className="ph-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <circle cx="9" cy="8" r="2.4" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                    <circle cx="15" cy="16" r="2.4" />
                  </svg>
                </span>
                <h3>Controles do Squad</h3>
              </div>
              <div className="pb">
                <div className="ctrl-row">
                  <div className="cmeta">
                    <div className="ct">Modo autônomo</div>
                    <div className="cd">agentes despacham sem confirmação</div>
                  </div>
                  <button
                    className={`switch ${autoMode ? 'on' : ''}`}
                    onClick={() => setAutoMode((value) => !value)}
                    type="button"
                  >
                    <i />
                  </button>
                </div>
                <div className="ctrl-row">
                  <div className="cmeta">
                    <div className="ct">Auto-merge em verde</div>
                    <div className="cd">merge se CI passar e review aprovado</div>
                  </div>
                  <button
                    className={`switch ${autoMerge ? 'on' : ''}`}
                    onClick={() => setAutoMerge((value) => !value)}
                    type="button"
                  >
                    <i />
                  </button>
                </div>
                <div className="ctrl-row">
                  <div className="cmeta">
                    <div className="ct">Notificar Márcio</div>
                    <div className="cd">push em pendências e falhas</div>
                  </div>
                  <button
                    className={`switch ${notifyMarcio ? 'on' : ''}`}
                    onClick={() => setNotifyMarcio((value) => !value)}
                    type="button"
                  >
                    <i />
                  </button>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="ph">
                <span className="ph-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m5 12 14-7-7 14-2-5-5-2Z" />
                  </svg>
                </span>
                <h3>Despachar</h3>
              </div>
              <div className="pb">
                <div className="dispatch">
                  <button className="disp-btn" type="button">
                    <span className="dot gold" />
                    Claude
                  </button>
                  <button className="disp-btn" type="button">
                    <span className="dot green" />
                    Copilot
                  </button>
                  <button className="disp-btn" type="button">
                    <span className="dot gray" />
                    Gemini
                  </button>
                  <button className="disp-btn primary" type="button">
                    + Nova intenção
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="ph">
              <span className="ph-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m4 7 5 5-5 5" />
                  <line x1="12" y1="17" x2="20" y2="17" />
                </svg>
              </span>
              <h3>Stream de Eventos</h3>
              <span className="ph-meta">ao vivo</span>
            </div>
            <div className="pb">
              <div className="stream">
                {events.map((event) => (
                  <div key={`${event.ts}-${event.msg}`} className="log">
                    <span className="ts">{event.ts}</span>
                    <span className={`lv ${event.level}`}>{event.level.toUpperCase()}</span>
                    <span className="msg">{event.msg}</span>
                  </div>
                ))}
                <div className="log">
                  <span className="ts">--:--:--</span>
                  <span className="lv info">INFO</span>
                  <span className="msg">
                    aguardando próximo evento
                    <span className="cursor" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

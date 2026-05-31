import { useMemo } from 'react';
import { type AgentName, type HiveState } from '../hooks/useHiveSocket';

type InteracoesPorTipoProps = {
  state: HiveState | null;
};

const AGENT_ORDER: AgentName[] = ['claude', 'copilot', 'gemini'];

const AGENT_META: Record<AgentName, { name: string; initial: string; role: string }> = {
  claude: { name: 'Claude', initial: 'C', role: 'auditoria & arquitetura' },
  copilot: { name: 'Copilot', initial: 'P', role: 'execução & testes' },
  gemini: { name: 'Gemini', initial: 'G', role: 'pesquisa & coordenação' },
};

const TYPE_LABELS: Record<string, string> = {
  feat: 'Feat',
  fix: 'Fix',
  debate: 'Debate',
  review: 'Review',
  audit: 'Audit',
  infra: 'Infra',
  chore: 'Chore',
  hotfix: 'Hotfix',
  discovery: 'Discovery',
  unknown: 'Unknown',
};

function formatTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

export function InteracoesPorTipo({ state }: InteracoesPorTipoProps) {
  const interactionLog = state?.interactionLog ?? {
    entries: [],
    byAgent: {},
    totalByType: {},
    mostFrequentType: null,
  };

  const totalInteractions = interactionLog.entries.length;
  const monitoredTypes = Object.keys(interactionLog.totalByType).length;

  const breakdownByAgent = useMemo(
    () =>
      Object.fromEntries(
        AGENT_ORDER.map((agent) => {
          const entries = Object.entries(interactionLog.byAgent[agent] ?? {}).sort(
            (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
          );
          return [agent, entries] as const;
        }),
      ) as Record<AgentName, Array<[string, number]>>,
    [interactionLog.byAgent],
  );

  return (
    <main className="screen active">
      <div className="page">
        <div className="page-head">
          <h1>Interações por Tipo</h1>
          <div className="sub">
            <span className="live-dot" />
            Propósito registrado a cada acquire do squad
          </div>
        </div>

        {totalInteractions === 0 ? (
          <div className="ipt-empty">
            Nenhuma interação registrada ainda. Passe o tipo no lock acquire para começar.
          </div>
        ) : (
          <>
            <div className="grid-3">
              {AGENT_ORDER.map((agent) => {
                const rows = breakdownByAgent[agent];
                const totalByAgent = rows.reduce((sum, [, count]) => sum + count, 0);

                return (
                  <article key={agent} className="ipt-card">
                    <div className="telemetry-agent-head">
                      <div className={`eff-avatar av-${agent}`}>{AGENT_META[agent].initial}</div>
                      <div>
                        <div className="atc-name">{AGENT_META[agent].name}</div>
                        <div className="atc-role">{AGENT_META[agent].role}</div>
                      </div>
                    </div>

                    <div className="ipt-total">{totalByAgent}</div>
                    <div className="ipt-total-label">interações registradas</div>

                    <div className="ipt-bar-container">
                      {rows.length > 0 ? (
                        rows.map(([type, count]) => {
                          const width = totalByAgent > 0 ? (count / totalByAgent) * 100 : 0;
                          return (
                            <div key={`${agent}-${type}`} className="ipt-bar-row">
                              <div className="ipt-bar-meta">
                                <span>{formatTypeLabel(type)}</span>
                                <span>{count}</span>
                              </div>
                              <div className="ipt-bar">
                                <i style={{ width: `${Math.max(width, count > 0 ? 8 : 0)}%` }} />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="ipt-card-empty">Nenhuma interação deste agente ainda.</div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className="ipt-footer">
              <div>
                <div className="atf-label">Total do squad</div>
                <div className="atf-value">{totalInteractions}</div>
              </div>
              <div>
                <div className="atf-label">Tipo mais frequente</div>
                <div className="atf-value">
                  {interactionLog.mostFrequentType ? formatTypeLabel(interactionLog.mostFrequentType) : '—'}
                </div>
              </div>
              <div>
                <div className="atf-label">Tipos monitorados</div>
                <div className="atf-value">{monitoredTypes}</div>
              </div>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}

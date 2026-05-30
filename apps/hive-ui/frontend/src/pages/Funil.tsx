import { ArtifactFilePath } from '../components/ArtifactFilePath';
import { type FlowItem, type FunnelLane, type HiveState } from '../hooks/useHiveSocket';

type FunilProps = {
  state: HiveState | null;
};

const LANES: Array<{
  key: FunnelLane;
  title: string;
  description: string;
}> = [
  {
    key: 'captura',
    title: 'Captura',
    description: 'Debates em abertura e parecer inicial.',
  },
  {
    key: 'triagem',
    title: 'Triagem',
    description: 'Debates qualificados para consolidacao tecnica.',
  },
  {
    key: 'execucao',
    title: 'Execucao',
    description: 'WOs em andamento na esteira tecnica.',
  },
  {
    key: 'revisao',
    title: 'Revisao',
    description: 'Itens aguardando auditoria ou aprovacao.',
  },
  {
    key: 'entregue',
    title: 'Mergeado',
    description: 'SRs afirmados e prontos para historico.',
  },
];

function stationLabel(station: FlowItem['station']): string {
  switch (station) {
    case 'marcio':
      return 'Marcio';
    case 'gemini':
      return 'Gemini';
    case 'claude':
      return 'Claude';
    case 'copilot':
      return 'Copilot';
    case 'entrega':
      return 'Entrega';
    default:
      return station;
  }
}

export function Funil({ state }: FunilProps) {
  const flowItems = state?.flowItems ?? [];
  const funnel = state?.funnel;

  return (
    <div className="page-shell funnel-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Hive UI</span>
          <h1>Funil de Intencao</h1>
          <p className="sub">
            Visao operacional do pipeline: captura, triagem, execucao, revisao e entregas.
          </p>
        </div>
      </div>

      <section className="card flow-board">
        <div className="funnel-strip">
          {LANES.map((lane) => (
            <div key={lane.key} className={`funnel-step funnel-step--${lane.key}`}>
              <div className="fs-label">{lane.title}</div>
              <div className="fs-bar">
                <div className="fs-fill" />
              </div>
              <div className="fs-count">{funnel?.[lane.key] ?? 0}</div>
            </div>
          ))}
        </div>

        <div className="board">
          {LANES.map((lane) => {
            const laneItems = flowItems.filter((item) => item.lane === lane.key);

            return (
              <section key={lane.key} className={`col col--${lane.key}`}>
                <header className="col-head">
                  <div>
                    <h3>{lane.title}</h3>
                    <p>{lane.description}</p>
                  </div>
                  <span className="fc-n">{laneItems.length}</span>
                </header>

                <div className="col-list">
                  {laneItems.length > 0 ? (
                    laneItems.map((item) => (
                      <article key={`${item.tipo}-${item.id}`} className="intent">
                        <div className="flow-card-v3__top">
                          <span className={`fci-stage fci-stage--${item.station}`}>
                            {stationLabel(item.station)}
                          </span>
                          <span className="fci-id">{item.id}</span>
                        </div>
                        <strong>{item.titulo}</strong>
                        <p className="flow-card-v3__next">
                          Destino: <span>{item.proxima ? stationLabel(item.proxima) : 'Concluido'}</span>
                        </p>
                        <ArtifactFilePath path={item.file_path} className="artifact-path--compact" />
                      </article>
                    ))
                  ) : (
                    <div className="flow-empty">Nenhum item nesta faixa.</div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import { ArtifactFilePath } from '../components/ArtifactFilePath';
import type { FlowItem, FlowStation } from '../hooks/useHiveSocket';

interface EsteiraPorProcessoProps {
  flowItems: FlowItem[];
}

const STATIONS: Array<{
  key: FlowStation;
  label: string;
  helper: string;
}> = [
  { key: 'marcio', label: 'Marcio', helper: 'Aprovacao e despacho do owner' },
  { key: 'gemini', label: 'Gemini', helper: 'Captura e parecer inicial' },
  { key: 'claude', label: 'Claude', helper: 'Arquitetura e auditoria' },
  { key: 'copilot', label: 'Copilot', helper: 'Execucao tecnica' },
  { key: 'entrega', label: 'Entrega', helper: 'SRs afirmados no fluxo' },
];

function stationLabel(station: FlowStation | null): string {
  if (!station) {
    return 'Concluido';
  }

  return STATIONS.find((entry) => entry.key === station)?.label ?? station;
}

export function EsteiraPorProcesso({ flowItems }: EsteiraPorProcessoProps) {
  const itemsByStation = STATIONS.map((station) => ({
    ...station,
    items: flowItems.filter((item) => item.station === station.key),
  }));

  return (
    <div className="flow-v3">
      <div className="flow-track flow-track-v3">
        {itemsByStation.map((station) => {
          const hasActive = station.items.some((item) => item.ativo);

          return (
            <section
              key={station.key}
              className={`flow-station flow-station-v3 ${station.key} ${hasActive ? 'active' : ''}`}
            >
              <header className="flow-station__header">
                <div>
                  <p className="flow-station__eyebrow">Estacao</p>
                  <h3>{station.label}</h3>
                  <p className="flow-station__helper">{station.helper}</p>
                </div>
                <span className="flow-station__count">{station.items.length}</span>
              </header>

              <div className="flow-station__cards">
                {station.items.length > 0 ? (
                  station.items.map((item) => (
                    <article key={`${item.tipo}-${item.id}`} className="flow-card-v3">
                      <div className="flow-card-v3__top">
                        <span className={`fci-stage fci-stage--${item.station}`}>{item.tipo}</span>
                        <span className="fci-id">{item.id}</span>
                      </div>
                      <strong>{item.titulo}</strong>
                      <p className="flow-card-v3__next">
                        Proxima etapa: <span>{stationLabel(item.proxima)}</span>
                      </p>
                      <ArtifactFilePath path={item.file_path} className="artifact-path--compact" />
                    </article>
                  ))
                ) : (
                  <div className="flow-empty">Nenhum item nesta etapa.</div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

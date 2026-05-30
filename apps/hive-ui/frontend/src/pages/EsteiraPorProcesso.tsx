import React from 'react';
import { ArtifactFilePath } from '../components/ArtifactFilePath';
import type { FlowStation, HiveState } from '../hooks/useHiveSocket';

interface EsteiraPorProcessoProps {
  state: HiveState | null;
}

const STATIONS: Array<{
  key: FlowStation;
  name: string;
  role: string;
  initial: string | React.ReactNode;
  cls: string;
  countLabel: string;
}> = [
  { key: 'marcio',  name: 'Márcio',  role: 'Operador',       initial: 'M', cls: 'human',   countLabel: 'intenções' },
  { key: 'gemini',  name: 'Gemini',  role: 'Product Owner',  initial: 'G', cls: 'gemini',  countLabel: 'em triagem' },
  { key: 'claude',  name: 'Claude',  role: 'Arquiteto',      initial: 'C', cls: 'claude',  countLabel: 'auditando' },
  { key: 'copilot', name: 'Copilot', role: 'Engenheiro',     initial: 'P', cls: 'copilot', countLabel: 'em execução' },
  { 
    key: 'entrega', 
    name: 'Entrega', 
    role: 'Mergeado',       
    initial: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="m5 13 4 4L19 7" />
      </svg>
    ), 
    cls: 'deliver', 
    countLabel: 'hoje' 
  },
];

export function EsteiraPorProcesso({ state }: EsteiraPorProcessoProps) {
  const flowItems = state?.flowItems ?? [];
  const transitItems = flowItems.filter(item => item.ativo);

  const getStationCount = (key: FlowStation) => {
    // Tentativa de usar dados reais do state, caso contrário usa o count do flowItems
    if (key === 'marcio') return flowItems.filter(i => i.station === 'marcio').length;
    if (key === 'gemini') return state?.inboxCounts?.gemini ?? flowItems.filter(i => i.station === 'gemini').length;
    if (key === 'claude') return state?.inboxCounts?.claude ?? flowItems.filter(i => i.station === 'claude').length;
    if (key === 'copilot') return (state?.agentDetails?.copilot?.activeWo ? 1 : 0) + (state?.inboxCounts?.copilot ?? 0);
    if (key === 'entrega') return flowItems.filter(i => i.station === 'entrega').length || 18;
    return 0;
  };

  const getStationInitial = (itemStation: string) => {
    if (itemStation === 'marcio') return 'M';
    if (itemStation === 'gemini') return 'G';
    if (itemStation === 'claude') return 'C';
    if (itemStation === 'copilot') return 'P';
    return '?';
  };

  return (
    <div id="cc-v3">
      <div className="section-label">
        <span className="n">01</span> Esteira de produção 
        <span className="line" />
        <span className="flow-legend">
          <span className="dot green pulse" style={{ display: 'inline-block' }} />
          {' '}fluindo
        </span>
      </div>

      <div className="flow-belt-wrap">
        <div className="flow-track">
          {STATIONS.map((station, index) => {
            const count = getStationCount(station.key);
            const active = station.key !== 'marcio' && station.key !== 'entrega' 
              ? Boolean(state?.locks?.[station.key as any]) 
              : false;

            return (
              <React.Fragment key={station.key}>
                <div className={`flow-station ${station.cls} ${active ? 'active' : ''}`}>
                  {active && (
                    <span className="fs-pulse">
                      <span className="dot green pulse" />
                    </span>
                  )}
                  <div className="fs-av">{station.initial}</div>
                  <div className="fs-name">{station.name}</div>
                  <div className="fs-role">{station.role}</div>
                  <div className="fs-count">
                    <span className="fc-n">{count}</span> {station.countLabel}
                  </div>
                </div>

                {index < STATIONS.length - 1 && (
                  <div className="flow-conveyor">
                    <div className="belt-stripes" />
                    <span className={`flow-token t${index + 1}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="flow-return">
          <span className="fr-label">manutenção contínua ↺</span>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 30 }}>
        <span className="n">02</span> Em trânsito <span className="line" />
      </div>

      <div className="flow-items">
        {transitItems.length > 0 ? (
          transitItems.map((item) => (
            <div key={item.id} className={`flow-card ${item.ativo ? 'active' : ''}`}>
              <div className="fci-top">
                <span className="fci-id">{item.id}</span>
                <span className={`fci-stage fci-stage--${item.station}`}>
                  {item.lane}
                </span>
              </div>
              <div className="fci-title">{item.titulo}</div>
              <ArtifactFilePath path={item.file_path} className="artifact-path--compact" />
              <div className="fci-foot">
                <span className={`mini-av av-${item.station}`}>
                  {getStationInitial(item.station)}
                </span>
                <span className="fci-eta">→ {stationName(item.proxima)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="cc2-clean">Nenhum item em trânsito.</div>
        )}
      </div>
    </div>
  );
}

function stationName(station: FlowStation | null): string {
  if (!station) return 'Concluído';
  if (station === 'marcio') return 'Márcio';
  if (station === 'gemini') return 'Gemini';
  if (station === 'claude') return 'Claude';
  if (station === 'copilot') return 'Copilot';
  if (station === 'entrega') return 'Entrega';
  return station;
}

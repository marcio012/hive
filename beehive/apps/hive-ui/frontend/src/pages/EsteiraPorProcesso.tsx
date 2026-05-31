import React from 'react';
import { ArtifactFilePath } from '../components/ArtifactFilePath';
import type { AgentName, FlowItem, FlowStation, HiveState } from '../hooks/useHiveSocket';

interface EsteiraPorProcessoProps {
  state: HiveState | null;
}

const STATIONS: Array<{
  key: string;
  name: string;
  role: string;
  initial: string | React.ReactNode;
  cls: string;
  countLabel: string;
}> = [
  { key: 'backlog',   name: 'Backlog',      role: 'Márcio Owner',   initial: '⚡', cls: 'st-backlog',   countLabel: 'na captura' },
  { key: 'debate',    name: 'Debate',       role: 'Gemini Lead',    initial: '🗣️', cls: 'st-debate',    countLabel: 'em discussão' },
  { key: 'blueprint', name: 'Blueprint',    role: 'Claude Arq',     initial: '📐', cls: 'st-blueprint', countLabel: 'contratos' },
  { key: 'wo',        name: 'Work Order',   role: 'Claude Arq',     initial: '📋', cls: 'st-wo',        countLabel: 'despachados' },
  { key: 'execucao',  name: 'Execução',     role: 'Copilot Eng',    initial: '🛠️', cls: 'st-exec',      countLabel: 'codando' },
  { key: 'auditoria', name: 'Auditoria',    role: 'Claude Arq',     initial: '🔍', cls: 'st-audit',     countLabel: 'revisando' },
  { key: 'sr',        name: 'Status Report',role: 'Copilot Eng',    initial: '📊', cls: 'st-sr',        countLabel: 'gerados' },
  { 
    key: 'gate',      
    name: 'The Gate',     
    role: 'Márcio Owner',   
    initial: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
        <path d="M12 22V12" />
        <path d="M12 12L3 7" />
        <path d="M12 12l9-5" />
      </svg>
    ), 
    cls: 'st-gate', 
    countLabel: 'afirmando' 
  },
];

export function EsteiraPorProcesso({ state }: EsteiraPorProcessoProps) {
  const flowItems = state?.flowItems ?? [];
  const transitItems = flowItems.filter(item => item.ativo || isBacklogCapture(item));

  const getStationCount = (key: string) => {
    if (key === 'backlog')   return flowItems.filter(i => i.station === 'marcio' && i.lane === 'captura').length;
    if (key === 'debate')    return (state?.debates?.filter(d => d.active).length || 0);
    if (key === 'blueprint') return flowItems.filter(i => i.station === 'claude' && i.lane === 'triagem').length;
    if (key === 'wo')        return flowItems.filter(i => i.station === 'claude' && i.lane === 'revisao').length;
    if (key === 'execucao')  return state?.agentDetails?.copilot?.activeWo ? 1 : 0;
    if (key === 'auditoria') return state?.agentDetails?.claude?.inboxPending ?? 0;
    if (key === 'sr')        return state?.gate?.pendentes?.filter(g => g.tipo === 'sr-afirmacao').length || 0;
    if (key === 'gate')      return state?.gate?.total ?? 0;
    return 0;
  };

  const getAgentByStation = (key: string): AgentName | 'human' => {
    if (key === 'backlog' || key === 'gate') return 'human';
    if (key === 'debate') return 'gemini';
    if (key === 'blueprint' || key === 'wo' || key === 'auditoria') return 'claude';
    if (key === 'execucao' || key === 'sr') return 'copilot';
    return 'human';
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
            const agentKey = getAgentByStation(station.key);
            const active = agentKey !== 'human'
              ? Boolean(state?.locks?.[agentKey])
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
                    <span className={`flow-token t${(index % 4) + 1}`} />
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
                <span className={`fci-stage ${flowItemStageClass(item)}`}>
                  {flowItemStageLabel(item)}
                </span>
              </div>
              <div className="fci-title">{item.titulo}</div>
              <ArtifactFilePath path={item.file_path} className="artifact-path--compact" />
              <div className="fci-foot">
                <span className={`mini-av av-${item.station}`}>
                  {isBacklogCapture(item) ? 'M' : item.station.charAt(0).toUpperCase()}
                </span>
                <span className="fci-eta">→ {flowItemNextStation(item)}</span>
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

function isBacklogCapture(item: FlowItem): boolean {
  return item.station === 'marcio' && item.lane === 'captura';
}

function flowItemStageLabel(item: FlowItem): string {
  return isBacklogCapture(item) ? 'no backlog' : item.lane;
}

function flowItemStageClass(item: FlowItem): string {
  return isBacklogCapture(item) ? 'fci-stage--captura' : `fci-stage--${item.station}`;
}

function flowItemNextStation(item: FlowItem): string {
  if (isBacklogCapture(item)) {
    return 'Gemini';
  }

  return stationName(item.proxima);
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

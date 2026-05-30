import React, { type CSSProperties } from 'react';
import { type DebateEntry } from '../hooks/useHiveSocket';
import { ArtifactFilePath } from './ArtifactFilePath';

type DebateCardProps = {
  entry: DebateEntry;
};

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getDebatePhase(status: string): number {
  const normalized = normalizeText(status);

  if (normalized.includes('abertura')) {
    return 1;
  }
  if (normalized.includes('parecer gemini')) {
    return 2;
  }
  if (normalized.includes('parecer claude')) {
    return 3;
  }
  if (normalized.includes('parecer copilot')) {
    return 4;
  }
  if (normalized.includes('aprovacao marcio') || normalized.includes('aguardando parecer de marcio')) {
    return 6;
  }
  if (normalized.includes('wo') && normalized.includes('despachadas')) {
    return 7;
  }
  if (normalized.includes('execucao concluida') || normalized.includes('encerrado')) {
    return 8;
  }

  return 4;
}

function debateStateClass(entry: DebateEntry): 'turn' | 'done' {
  return getDebatePhase(entry.status) >= 7 ? 'done' : 'turn';
}

function phaseStyle(phase: number): CSSProperties {
  return { '--p': phase } as CSSProperties;
}

function getResponsibleClass(responsible: string): string {
  const normalized = responsible.toLowerCase();
  if (normalized.includes('claude')) return 'av-claude';
  if (normalized.includes('copilot')) return 'av-copilot';
  if (normalized.includes('gemini')) return 'av-gemini';
  return '';
}

export const DebateCard: React.FC<DebateCardProps> = ({ entry }) => {
  const phase = getDebatePhase(entry.status);
  const isTurn = debateStateClass(entry) === 'turn';
  const respClass = getResponsibleClass(entry.responsible || '');

  return (
    <div className={`debate ${isTurn ? 'active' : ''}`}>
      <div className="debate-top">
        <span className="debate-id">{entry.id}</span>
        <span className={`debate-state ${debateStateClass(entry)}`}>{entry.status}</span>
      </div>
      
      <div className="debate-title" title={entry.title}>
        {entry.title}
      </div>

      <div className="phase-bar">
        <i style={phaseStyle(phase)} />
      </div>

      <ArtifactFilePath path={entry.file_path} className="artifact-path--compact" />

      <div className="debate-meta">
        <span className="debate-status-text">{entry.status}</span>
        <span className={`debate-block ${respClass}`.trim()}>{entry.responsible}</span>
      </div>
    </div>
  );
};

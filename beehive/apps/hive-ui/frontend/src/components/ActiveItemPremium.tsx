import React from 'react';

type ActiveItemProps = {
  activeIssue: string;
  lastAction: string;
  nextStep: string;
};

export const ActiveItemPremium: React.FC<ActiveItemProps> = ({
  activeIssue,
  lastAction,
  nextStep,
}) => {
  return (
    <div className="active-item" style={{ marginBottom: 20 }}>
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
  );
};

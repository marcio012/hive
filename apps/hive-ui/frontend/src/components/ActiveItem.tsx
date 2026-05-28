type ActiveItemProps = {
  activeIssue: string | null;
  lastAction: string | null;
  nextStep: string | null;
};

export function ActiveItem({
  activeIssue,
  lastAction,
  nextStep,
}: ActiveItemProps) {
  return (
    <section
      style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255, 215, 0, 0.28)',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <h3 style={{ margin: '0 0 12px' }}>Item Ativo</h3>
      <div
        style={{
          display: 'grid',
          gap: 10,
          gridTemplateColumns: '1fr',
        }}
      >
        <div>
          <div style={{ color: '#8A8A8A', fontSize: 12 }}>ACTIVE_ISSUE</div>
          <div style={{ fontFamily: 'monospace' }}>{activeIssue ?? '—'}</div>
        </div>
        <div>
          <div style={{ color: '#8A8A8A', fontSize: 12 }}>LAST_ACTION</div>
          <div>{lastAction ?? '—'}</div>
        </div>
        <div>
          <div style={{ color: '#8A8A8A', fontSize: 12 }}>NEXT_STEP</div>
          <div>{nextStep ?? '—'}</div>
        </div>
      </div>
    </section>
  );
}

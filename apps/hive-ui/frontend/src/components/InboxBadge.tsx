type InboxBadgeProps = {
  agent: string;
  count: number;
};

export function InboxBadge({ agent, count }: InboxBadgeProps) {
  const active = count > 0;

  return (
    <div
      style={{
        alignItems: 'center',
        background: active ? '#FFD70022' : '#262626',
        border: `1px solid ${active ? '#FFD700' : '#4A4A4A'}`,
        borderRadius: 12,
        color: active ? '#FFD700' : '#A3A3A3',
        display: 'flex',
        fontFamily: 'monospace',
        gap: 12,
        justifyContent: 'space-between',
        padding: '10px 12px',
      }}
    >
      <span>{agent}</span>
      <strong>{count}</strong>
    </div>
  );
}

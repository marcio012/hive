type BrainstormCardProps = {
  title: string;
  thread: string | null;
  status: string | null;
  date: string | null;
  responsible: string | null;
  filename: string;
};

const statusColors: Record<string, string> = {
  'em-ideacao': '#FFD700',
  'em-concepcao-visual': '#44B5FF',
  concluido: '#00FF9F',
};

export function BrainstormCard(props: BrainstormCardProps) {
  const color = statusColors[props.status ?? ''] ?? '#8A8A8A';

  return (
    <article
      style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255, 215, 0, 0.28)',
        borderRadius: 14,
        boxShadow: '0 0 16px rgba(255, 215, 0, 0.08)',
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <strong style={{ fontSize: 18 }}>{props.title}</strong>
        <span
          style={{
            background: `${color}22`,
            border: `1px solid ${color}`,
            borderRadius: 999,
            color,
            fontSize: 12,
            padding: '4px 10px',
            textTransform: 'uppercase',
          }}
        >
          {props.status ?? 'sem-status'}
        </span>
      </div>

      <div
        style={{
          color: '#AFAFAF',
          display: 'grid',
          gap: 6,
          marginTop: 12,
        }}
      >
        <span>Thread: {props.thread ?? '—'}</span>
        <span>Data: {props.date ?? '—'}</span>
        <span>Responsável: {props.responsible ?? '—'}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
          Arquivo: {props.filename}
        </span>
      </div>
    </article>
  );
}

type AgentStatusProps = {
  agent: 'claude' | 'copilot' | 'gemini';
  activity: string | null;
};

const labels = {
  claude: 'Claude',
  copilot: 'Copilot',
  gemini: 'Gemini',
};

const icons = {
  claude: 'C',
  copilot: 'CP',
  gemini: 'G',
};

export function AgentStatus({ agent, activity }: AgentStatusProps) {
  const busy = Boolean(activity);

  return (
    <article
      style={{
        background: '#1A1A1A',
        border: `1px solid ${busy ? 'rgba(0,255,159,0.5)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
        <div
          style={{
            alignItems: 'center',
            background: busy ? '#00FF9F22' : '#2A2A2A',
            borderRadius: '50%',
            color: busy ? '#00FF9F' : '#B0B0B0',
            display: 'flex',
            fontFamily: 'monospace',
            fontSize: 13,
            height: 42,
            justifyContent: 'center',
            width: 42,
          }}
        >
          {icons[agent]}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{labels[agent]}</div>
          <div style={{ color: busy ? '#00FF9F' : '#8A8A8A', fontSize: 14 }}>
            {busy ? 'Em operação' : 'Livre'}
          </div>
        </div>
      </div>

      <div
        style={{
          color: '#BDBDBD',
          marginTop: 12,
          minHeight: 40,
        }}
      >
        {activity ?? 'Nenhum lock ativo.'}
      </div>
    </article>
  );
}

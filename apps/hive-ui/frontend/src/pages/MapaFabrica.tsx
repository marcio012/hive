import { ActiveItem } from '../components/ActiveItem';
import { AgentStatus } from '../components/AgentStatus';
import { InboxBadge } from '../components/InboxBadge';
import { HiveState } from '../hooks/useHiveSocket';

type MapaFabricaProps = {
  state: HiveState | null;
};

export function MapaFabrica({ state }: MapaFabricaProps) {
  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <header>
        <h2 style={{ marginBottom: 6 }}>Mapa da Fábrica</h2>
        <p style={{ color: '#AFAFAF', margin: 0 }}>
          Locks, inboxes e item ativo do Hive em tempo real.
        </p>
      </header>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <AgentStatus agent="claude" activity={state?.locks.claude?.activity ?? null} />
        <AgentStatus agent="copilot" activity={state?.locks.copilot?.activity ?? null} />
        <AgentStatus agent="gemini" activity={state?.locks.gemini?.activity ?? null} />
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <InboxBadge agent="Claude" count={state?.inboxCounts.claude ?? 0} />
        <InboxBadge agent="Copilot" count={state?.inboxCounts.copilot ?? 0} />
        <InboxBadge agent="Gemini" count={state?.inboxCounts.gemini ?? 0} />
      </div>

      <ActiveItem
        activeIssue={state?.session.activeIssue ?? null}
        lastAction={state?.session.lastAction ?? null}
        nextStep={state?.session.nextStep ?? null}
      />
    </section>
  );
}

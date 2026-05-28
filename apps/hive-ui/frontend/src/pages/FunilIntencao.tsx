import { BrainstormCard } from '../components/BrainstormCard';
import { HiveState } from '../hooks/useHiveSocket';

type FunilIntencaoProps = {
  state: HiveState | null;
};

export function FunilIntencao({ state }: FunilIntencaoProps) {
  const brainstorm = state?.brainstorm ?? [];

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <header>
        <h2 style={{ marginBottom: 6 }}>Funil de Intenção</h2>
        <p style={{ color: '#AFAFAF', margin: 0 }}>
          Brainstorms ativos refletidos diretamente do filesystem do Hive.
        </p>
      </header>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {brainstorm.map((item) => (
          <BrainstormCard key={item.filename} {...item} />
        ))}
      </div>
    </section>
  );
}

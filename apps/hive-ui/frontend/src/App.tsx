import { useEffect, useState } from 'react';
import { FunilIntencao } from './pages/FunilIntencao';
import { MapaFabrica } from './pages/MapaFabrica';
import { useHiveSocket } from './hooks/useHiveSocket';

type Route = '/mapa' | '/funil';

const shellStyle: Record<string, string | number> = {
  background: '#050505',
  color: '#F5F5F5',
  minHeight: '100vh',
  padding: 24,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
};

function normalizeRoute(pathname: string): Route {
  return pathname === '/funil' ? '/funil' : '/mapa';
}

export function App() {
  const [route, setRoute] = useState<Route>(normalizeRoute(window.location.pathname));
  const { state, connected, error } = useHiveSocket();

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextRoute: Route) => {
    window.history.pushState({}, '', nextRoute);
    setRoute(nextRoute);
  };

  return (
    <main style={shellStyle}>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ color: '#FFD700', margin: 0 }}>Hive Web UI</h1>
          <p style={{ color: '#9A9A9A', margin: '6px 0 0' }}>
            MVP do painel operacional do Hive
          </p>
        </div>

        <div
          style={{
            alignItems: 'center',
            background: '#141414',
            border: `1px solid ${connected ? '#00FF9F' : '#FF4444'}`,
            borderRadius: 999,
            display: 'flex',
            gap: 10,
            padding: '8px 12px',
          }}
        >
          <span
            style={{
              background: connected ? '#00FF9F' : '#FF4444',
              borderRadius: '50%',
              boxShadow: `0 0 14px ${connected ? '#00FF9F' : '#FF4444'}`,
              height: 10,
              width: 10,
            }}
          />
          <span>{connected ? 'WebSocket conectado' : 'WebSocket desconectado'}</span>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          ['/mapa', 'Mapa da Fábrica'],
          ['/funil', 'Funil de Intenção'],
        ].map(([value, label]) => {
          const active = route === value;
          return (
            <button
              key={value}
              onClick={() => navigate(value as Route)}
              style={{
                background: active ? '#FFD700' : '#161616',
                border: '1px solid #FFD700',
                borderRadius: 10,
                color: active ? '#050505' : '#FFD700',
                cursor: 'pointer',
                fontSize: 15,
                padding: '10px 14px',
              }}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </nav>

      {error ? (
        <div
          style={{
            background: '#2A1111',
            border: '1px solid #FF4444',
            borderRadius: 12,
            color: '#FF8E8E',
            marginBottom: 20,
            padding: 12,
          }}
        >
          Erro de conexão: {error}
        </div>
      ) : null}

      {route === '/funil' ? (
        <FunilIntencao state={state} />
      ) : (
        <MapaFabrica state={state} />
      )}
    </main>
  );
}

import { useEffect, useState } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

type DiagramMeta = { name: string; filename: string };

export function Diagramas() {
  const [list, setList] = useState<DiagramMeta[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/hive/diagrams', { credentials: 'include' })
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    fetch(`/api/hive/diagrams/${encodeURIComponent(selected)}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selected]);

  return (
    <div className="page diagramas-page">
      <aside className="diagramas-sidebar">
        <div className="ph">
          <span className="ph-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <h3>Diagramas</h3>
        </div>
        <div className="diagramas-list">
          {list.length === 0 && (
            <p className="dim" style={{ padding: '0.5rem 0', fontSize: '0.8rem' }}>
              Nenhum diagrama encontrado.
            </p>
          )}
          {list.map((d) => (
            <button
              key={d.filename}
              type="button"
              className={`diagramas-item ${selected === d.filename ? 'active' : ''}`}
              onClick={() => setSelected(d.filename)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {d.name}
            </button>
          ))}
        </div>
      </aside>

      <div className="diagramas-canvas">
        {loading && (
          <div className="diagramas-empty">
            <span className="dot gold pulse display-inline" />
            <span style={{ marginLeft: '0.5rem' }}>Carregando…</span>
          </div>
        )}

        {!loading && !content && (
          <div className="diagramas-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <p style={{ opacity: 0.4, marginTop: '0.75rem' }}>Selecione um diagrama na lista</p>
          </div>
        )}

        {!loading && content && (
          <Tldraw
            key={selected}
            onMount={(editor) => {
              try {
                const IDX = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                const validIdx = (n: number) => n < IDX.length ? 'a' + IDX[n] : 'b0' + IDX[n - IDX.length];
                let shapeCount = 0;
                const raw = content.records as Array<Record<string, unknown>>;
                const records = raw.map((r) => {
                  if (r.typeName === 'document') {
                    const p = (r.props as Record<string, unknown>) ?? {};
                    return { id: r.id, typeName: 'document', gridSize: 10, name: (p.name as string) ?? '', meta: {} };
                  }
                  if (r.typeName === 'page') {
                    return { meta: {}, ...r };
                  }
                  if (r.typeName === 'shape') {
                    const base = { rotation: 0, isLocked: false, opacity: 1, meta: {}, index: validIdx(shapeCount++) };
                    const ep = (r.props as Record<string, unknown>) ?? {};
                    if (r.type === 'geo') {
                      return {
                        ...base, ...r, index: base.index,
                        props: { labelColor: 'black', dash: 'draw', size: 'm', font: 'draw', align: 'middle', verticalAlign: 'middle', url: '', growY: 0, scale: 1, ...ep },
                      };
                    }
                    if (r.type === 'arrow') {
                      const s = (ep.start as Record<string, unknown>) ?? {};
                      const e = (ep.end as Record<string, unknown>) ?? {};
                      return {
                        ...base, ...r, index: base.index,
                        props: { labelColor: 'black', scale: 1, ...ep, start: { x: s.x ?? 0, y: s.y ?? 0 }, end: { x: e.x ?? 0, y: e.y ?? 0 } },
                      };
                    }
                    return { ...base, ...r, index: base.index };
                  }
                  return r;
                });
                const snapshot = {
                  store: Object.fromEntries(records.map((r) => [r.id as string, r])),
                  schema: content.schema,
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                editor.store.loadSnapshot(snapshot as any);
                editor.zoomToFit({ animation: { duration: 0 } });
              } catch (e) {
                console.error('Erro ao carregar diagrama:', e);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

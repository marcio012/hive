import { useEffect, useMemo, useState } from 'react';
import { type SquadMember } from '../../hooks/useHiveSocket';

type SquadModalProps = {
  members: SquadMember[];
  onClose: () => void;
  onSave: (updated: SquadMember[]) => Promise<void>;
};

function cloneMembers(members: SquadMember[]): SquadMember[] {
  return members.map((member) => ({ ...member }));
}

function sanitizeMembers(members: SquadMember[]): SquadMember[] {
  return members.map((member) => ({
    ...member,
    name: member.name.trim(),
    role: member.role.trim(),
    model: member.model.trim(),
    initial: member.initial.trim().toUpperCase().slice(0, 2),
  }));
}

export function SquadModal({ members, onClose, onSave }: SquadModalProps) {
  const [draft, setDraft] = useState<SquadMember[]>(() => cloneMembers(members));
  const [editingId, setEditingId] = useState<SquadMember['id'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(cloneMembers(members));
    setEditingId(null);
    setError(null);
  }, [members]);

  const hasChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(members),
    [draft, members],
  );

  function updateMember(id: SquadMember['id'], field: 'name' | 'role' | 'model' | 'initial', value: string) {
    setDraft((current) =>
      current.map((member) =>
        member.id === id
          ? {
              ...member,
              [field]: field === 'initial' ? value.toUpperCase().slice(0, 2) : value,
            }
          : member,
      ),
    );
  }

  async function submit() {
    try {
      setSaving(true);
      setError(null);
      await onSave(sanitizeMembers(draft));
      setEditingId(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Falha ao salvar equipe.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dispatch-modal squad-modal" role="dialog" aria-labelledby="squad-modal-title" aria-modal="true">
      <div className="dispatch-modal-head">
        <h4 id="squad-modal-title">Equipe do Squad</h4>
        <button className="btn-ghost" disabled={saving} onClick={onClose} type="button">
          Fechar
        </button>
      </div>

      <div className="squad-list">
        {draft.map((member) => {
          const editing = editingId === member.id;

          return (
            <article key={member.id} className={`squad-row ${editing ? 'is-editing' : ''}`}>
              <div className="squad-avatar">{member.initial}</div>
              <div className="squad-content">
                <div className="squad-head">
                  <div>
                    <div className="squad-name">{member.name}</div>
                    <div className="squad-meta">{member.role}</div>
                  </div>
                  <button
                    className="btn-ghost squad-edit-btn"
                    disabled={saving}
                    onClick={() => setEditingId((current) => (current === member.id ? null : member.id))}
                    type="button"
                  >
                    ✎
                  </button>
                </div>

                {editing ? (
                  <div className="squad-edit-grid">
                    <label className="dispatch-field">
                      <span>Nome</span>
                      <input
                        disabled={saving}
                        onChange={(event) => updateMember(member.id, 'name', event.target.value)}
                        type="text"
                        value={member.name}
                      />
                    </label>
                    <label className="dispatch-field">
                      <span>Papel</span>
                      <input
                        disabled={saving}
                        onChange={(event) => updateMember(member.id, 'role', event.target.value)}
                        type="text"
                        value={member.role}
                      />
                    </label>
                    <label className="dispatch-field">
                      <span>Modelo</span>
                      <input
                        disabled={saving}
                        onChange={(event) => updateMember(member.id, 'model', event.target.value)}
                        type="text"
                        value={member.model}
                      />
                    </label>
                    <label className="dispatch-field">
                      <span>Inicial</span>
                      <input
                        disabled={saving}
                        maxLength={2}
                        onChange={(event) => updateMember(member.id, 'initial', event.target.value)}
                        type="text"
                        value={member.initial}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="squad-summary">
                    <span>{member.model}</span>
                    <span>{member.inbox}</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {error ? <div className="panel-feedback error">{error}</div> : null}

      <div className="dispatch-actions">
        <button className="disp-btn" disabled={saving} onClick={onClose} type="button">
          Cancelar
        </button>
        <button
          className="disp-btn primary"
          disabled={saving || !hasChanges}
          onClick={() => void submit()}
          type="button"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}

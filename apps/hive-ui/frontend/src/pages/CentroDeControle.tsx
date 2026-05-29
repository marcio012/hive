import { useEffect, useMemo, useState } from 'react';
import { type AgentName, type HiveState, type OrchestratorStatus } from '../hooks/useHiveSocket';

type CentroDeControleProps = {
  state: HiveState | null;
};

type HiveConfig = NonNullable<HiveState['config']>;
type DispatchAgent = AgentName;

type DispatchDialogState = {
  agent: DispatchAgent | '';
  message: string;
  selectEnabled: boolean;
};

type ToastState = {
  kind: 'success' | 'error';
  message: string;
} | null;

const DEFAULT_CONFIG: HiveConfig = {
  autoMode: false,
  autoMerge: false,
  notifyMarcio: true,
};

function formatUptime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function agentClass(agent: AgentName): string {
  if (agent === 'claude') {
    return 'av-claude';
  }

  if (agent === 'copilot') {
    return 'av-copilot';
  }

  return 'av-gemini';
}

function agentLabel(agent: AgentName): string {
  return agent === 'copilot' ? 'P' : agent.charAt(0).toUpperCase();
}

function orchestratorLabel(status: OrchestratorStatus | null | undefined): string {
  if (status === 'watching') {
    return 'MONITORANDO';
  }

  if (status === 'dispatching') {
    return 'DESPACHANDO';
  }

  if (status === 'paused') {
    return 'PAUSADO';
  }

  if (status === 'error') {
    return 'ERRO';
  }

  return 'IDLE';
}

export function CentroDeControle({ state }: CentroDeControleProps) {
  const [busyConfigKey, setBusyConfigKey] = useState<keyof HiveConfig | null>(null);
  const [releasingAgent, setReleasingAgent] = useState<AgentName | null>(null);
  const [dispatchDialog, setDispatchDialog] = useState<DispatchDialogState | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const config = state?.config ?? DEFAULT_CONFIG;
  const orchestrator = state?.orchestrator ?? null;

  const activeLocks = useMemo(
    () =>
      (Object.entries(state?.locks ?? {}) as Array<[AgentName, HiveState['locks'][AgentName]]>).filter(
        ([, lock]) => lock,
      ),
    [state],
  );

  const events = state?.events ?? [];
  const commandCount = useMemo(
    () =>
      events.filter(
        (event) =>
          (event.level === 'info' || event.level === 'lock') &&
          /(despachad|liberad)/i.test(event.msg),
      ).length,
    [events],
  );

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function parseActionResponse(response: Response): Promise<{ ok: boolean; error?: string }> {
    if (!response.ok) {
      const fallback = `HTTP ${response.status}`;
      try {
        const payload = (await response.json()) as { message?: string; error?: string };
        throw new Error(payload.message ?? payload.error ?? fallback);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(fallback);
      }
    }

    return (await response.json()) as { ok: boolean; error?: string };
  }

  async function toggleConfig(key: keyof HiveConfig, value: boolean) {
    try {
      setActionError(null);
      setBusyConfigKey(key);
      const response = await fetch('/api/hive/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? `HTTP ${response.status}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao salvar configuração.';
      setActionError(message);
      setToast({ kind: 'error', message });
    } finally {
      setBusyConfigKey(null);
    }
  }

  async function releaseLock(agent: AgentName) {
    try {
      setActionError(null);
      setReleasingAgent(agent);
      const result = await parseActionResponse(
        await fetch(`/api/hive/lock/release/${agent}`, { method: 'POST' }),
      );

      if (!result.ok) {
        throw new Error(result.error ?? 'Falha ao liberar lock.');
      }

      setToast({ kind: 'success', message: `Lock de ${agent} liberado.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao liberar lock.';
      setActionError(message);
      setToast({ kind: 'error', message });
    } finally {
      setReleasingAgent(null);
    }
  }

  function openDispatchDialog(agent?: DispatchAgent) {
    setDialogError(null);
    setDispatchDialog({
      agent: agent ?? '',
      message: '',
      selectEnabled: !agent,
    });
  }

  function closeDispatchDialog() {
    if (dispatching) {
      return;
    }
    setDialogError(null);
    setDispatchDialog(null);
  }

  async function submitDispatch() {
    if (!dispatchDialog) {
      return;
    }

    if (!dispatchDialog.agent) {
      setDialogError('Selecione o agente de destino.');
      return;
    }

    if (!dispatchDialog.message.trim()) {
      setDialogError('Digite a intenção antes de despachar.');
      return;
    }

    try {
      setDispatching(true);
      setDialogError(null);
      setActionError(null);
      const result = await parseActionResponse(
        await fetch('/api/hive/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent: dispatchDialog.agent,
            message: dispatchDialog.message,
          }),
        }),
      );

      if (!result.ok) {
        throw new Error(result.error ?? 'Falha ao despachar intenção.');
      }

      const label =
        dispatchDialog.agent === 'claude'
          ? 'Claude'
          : dispatchDialog.agent === 'copilot'
            ? 'Copilot'
            : 'Gemini';

      setToast({ kind: 'success', message: `Intenção despachada para ${label}.` });
      setDispatchDialog(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao despachar intenção.';
      setDialogError(message);
      setToast({ kind: 'error', message });
    } finally {
      setDispatching(false);
    }
  }

  return (
    <main className="screen active">
      <div className="page">
        {toast ? (
          <div className={`toast toast-${toast.kind}`} role="status" aria-live="polite">
            {toast.message}
          </div>
        ) : null}

        {orchestrator?.status === 'paused' ? (
          <div className="orch-banner" role="status">
            <strong>Orchestrator pausado.</strong>
            <span>{orchestrator.pauseReason ?? 'Aguardando intervenção manual.'}</span>
          </div>
        ) : null}

        <div className="page-head">
          <h1>Centro de Controle</h1>
          <div className="sub">
            <span className="live-dot" />
            Decisões pendentes — aja sem sair do painel
          </div>
        </div>

        <div className="cc-stats">
          <div className="stat good">
            <div className="k">Uptime</div>
            <div className="v">{formatUptime(state?.uptime ?? 0)}</div>
          </div>
          <div className="stat gold">
            <div className="k">Locks ativos</div>
            <div className="v">
              {activeLocks.length}
              <small> / 3 agentes</small>
            </div>
          </div>
          <div className="stat">
            <div className="k">Comandos</div>
            <div className="v">{commandCount}</div>
          </div>
          <div className="stat good">
            <div className="k">Orchestrator</div>
            <div className="v">{orchestratorLabel(orchestrator?.status)}</div>
          </div>
        </div>

        <div className="cc-grid">
          <div>
            <div className="panel">
              <div className="ph">
                <span className="ph-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 6h10" />
                    <path d="M7 12h10" />
                    <path d="M7 18h7" />
                    <circle cx="17" cy="18" r="2" />
                  </svg>
                </span>
                <h3>Orchestrator</h3>
                <span className={`ph-meta orch-status orch-${orchestrator?.status ?? 'idle'}`}>
                  {orchestratorLabel(orchestrator?.status)}
                </span>
              </div>
              <div className="pb">
                <div className="orch-card">
                  <div className="orch-row">
                    <span className="orch-label">Item atual</span>
                    <strong className="orch-current">
                      {orchestrator?.currentItem ?? 'Nenhum item em processamento'}
                    </strong>
                  </div>
                  <div className="orch-row">
                    <span className="orch-label">Estado</span>
                    <span className={`orch-pill orch-${orchestrator?.status ?? 'idle'}`}>
                      {orchestratorLabel(orchestrator?.status)}
                    </span>
                  </div>
                  {orchestrator?.pauseReason ? (
                    <div className="panel-feedback error">{orchestrator.pauseReason}</div>
                  ) : null}
                  <div className="orch-hint">
                    {orchestrator?.status === 'dispatching'
                      ? 'O core está despachando a próxima ação para a inbox correta.'
                      : orchestrator?.status === 'watching'
                        ? 'O core está monitorando inboxes e locks para reagir em tempo real.'
                        : orchestrator?.status === 'paused'
                          ? 'A execução automática foi interrompida e precisa de decisão manual.'
                          : orchestrator?.status === 'error'
                            ? 'O core registrou falha; verifique o stream de eventos para diagnosticar.'
                            : 'O core está pronto para processar novas entradas.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="ph">
                <span className="ph-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                <h3>Locks Ativos</h3>
                <span className="ph-meta">{activeLocks.length} detidos</span>
              </div>
              <div className="pb">
                {activeLocks.length > 0 ? (
                  activeLocks.map(([agent, lock]) => (
                    <div key={agent} className="lock-row">
                      <div className={`la ${agentClass(agent)}`}>{agentLabel(agent)}</div>
                      <div className="lmeta">
                        <div className="res">
                          {lock?.activity ?? 'sem atividade'}
                          <span className="by"> · {agent}</span>
                        </div>
                        <div className="since">{lock?.acquiredAt ?? 'sem timestamp'}</div>
                      </div>
                      <button
                        className="btn-ghost"
                        disabled={releasingAgent === agent}
                        onClick={() => void releaseLock(agent)}
                        type="button"
                      >
                        {releasingAgent === agent ? 'Liberando...' : 'Forçar liberação'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="lock-row">
                    <div className="lmeta">
                      <div className="res">Nenhum lock ativo</div>
                      <div className="since">squad livre para despacho</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="ph">
                <span className="ph-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <circle cx="9" cy="8" r="2.4" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                    <circle cx="15" cy="16" r="2.4" />
                  </svg>
                </span>
                <h3>Controles do Squad</h3>
              </div>
              <div className="pb">
                <div className="ctrl-row">
                  <div className="cmeta">
                    <div className="ct">Modo autônomo</div>
                    <div className="cd">agentes despacham sem confirmação</div>
                  </div>
                  <button
                    className={`switch ${config.autoMode ? 'on' : ''}`}
                    disabled={busyConfigKey === 'autoMode'}
                    onClick={() => void toggleConfig('autoMode', !config.autoMode)}
                    type="button"
                  >
                    <i />
                  </button>
                </div>
                <div className="ctrl-row">
                  <div className="cmeta">
                    <div className="ct">Auto-merge em verde</div>
                    <div className="cd">merge se CI passar e review aprovado</div>
                  </div>
                  <button
                    className={`switch ${config.autoMerge ? 'on' : ''}`}
                    disabled={busyConfigKey === 'autoMerge'}
                    onClick={() => void toggleConfig('autoMerge', !config.autoMerge)}
                    type="button"
                  >
                    <i />
                  </button>
                </div>
                <div className="ctrl-row">
                  <div className="cmeta">
                    <div className="ct">Notificar Márcio</div>
                    <div className="cd">push em pendências e falhas</div>
                  </div>
                  <button
                    className={`switch ${config.notifyMarcio ? 'on' : ''}`}
                    disabled={busyConfigKey === 'notifyMarcio'}
                    onClick={() => void toggleConfig('notifyMarcio', !config.notifyMarcio)}
                    type="button"
                  >
                    <i />
                  </button>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="ph">
                <span className="ph-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m5 12 14-7-7 14-2-5-5-2Z" />
                  </svg>
                </span>
                <h3>Despachar</h3>
              </div>
              <div className="pb">
                <div className="dispatch">
                  <button className="disp-btn" onClick={() => openDispatchDialog('claude')} type="button">
                    <span className="dot gold" />
                    Claude
                  </button>
                  <button className="disp-btn" onClick={() => openDispatchDialog('copilot')} type="button">
                    <span className="dot green" />
                    Copilot
                  </button>
                  <button className="disp-btn" onClick={() => openDispatchDialog('gemini')} type="button">
                    <span className="dot gray" />
                    Gemini
                  </button>
                  <button className="disp-btn primary" onClick={() => openDispatchDialog()} type="button">
                    + Nova intenção
                  </button>
                </div>
                {actionError ? <div className="panel-feedback error">{actionError}</div> : null}
                {dispatchDialog ? (
                  <div className="dispatch-modal" role="dialog" aria-modal="true" aria-labelledby="dispatch-title">
                    <div className="dispatch-modal-head">
                      <h4 id="dispatch-title">Despachar intenção</h4>
                      <button className="btn-ghost" onClick={closeDispatchDialog} type="button">
                        Fechar
                      </button>
                    </div>
                    {dispatchDialog.selectEnabled ? (
                      <label className="dispatch-field">
                        <span>Agente</span>
                        <select
                          value={dispatchDialog.agent}
                          onChange={(event) =>
                            setDispatchDialog((current) =>
                              current
                                ? { ...current, agent: event.target.value as DispatchAgent | '' }
                                : current,
                            )
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="claude">Claude</option>
                          <option value="copilot">Copilot</option>
                          <option value="gemini">Gemini</option>
                        </select>
                      </label>
                    ) : null}
                    <label className="dispatch-field">
                      <span>Mensagem</span>
                      <textarea
                        value={dispatchDialog.message}
                        onChange={(event) =>
                          setDispatchDialog((current) =>
                            current ? { ...current, message: event.target.value } : current,
                          )
                        }
                        placeholder="Descreva a intenção para o agente..."
                        rows={5}
                      />
                    </label>
                    {dialogError ? <div className="panel-feedback error">{dialogError}</div> : null}
                    <div className="dispatch-actions">
                      <button className="disp-btn" onClick={closeDispatchDialog} type="button">
                        Cancelar
                      </button>
                      <button className="disp-btn primary" disabled={dispatching} onClick={() => void submitDispatch()} type="button">
                        {dispatching ? 'Despachando...' : 'Despachar'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="ph">
              <span className="ph-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m4 7 5 5-5 5" />
                  <line x1="12" y1="17" x2="20" y2="17" />
                </svg>
              </span>
              <h3>Stream de Eventos</h3>
              <span className="ph-meta">ao vivo</span>
            </div>
            <div className="pb">
              <div className="stream">
                {events.map((event) => (
                  <div key={`${event.ts}-${event.msg}`} className="log">
                    <span className="ts">{event.ts}</span>
                    <span className={`lv ${event.level}`}>{event.level.toUpperCase()}</span>
                    <span className="msg">{event.msg}</span>
                  </div>
                ))}
                <div className="log">
                  <span className="ts">--:--:--</span>
                  <span className="lv info">INFO</span>
                  <span className="msg">
                    aguardando próximo evento
                    <span className="cursor" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import {
  type AgentDetail,
  type AgentName,
  type DebateEntry,
  type HiveState,
  type OrchestratorStatus,
} from '../hooks/useHiveSocket';

type CentroDeControleProps = {
  state: HiveState | null;
};

type HiveConfig = NonNullable<HiveState['config']>;
type DispatchAgent = AgentName;
type ControlView = 'v1' | 'v2';

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

const DEFAULT_AGENT_DETAIL: AgentDetail = {
  inboxPending: 0,
  activeWo: null,
  blockedCount: 0,
};

const AGENTS: AgentName[] = ['claude', 'copilot', 'gemini'];

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

function agentBadgeLabel(agent: AgentName): string {
  return agent === 'copilot' ? 'P' : agent.charAt(0).toUpperCase();
}

function agentName(agent: AgentName): string {
  if (agent === 'claude') {
    return 'Claude';
  }

  if (agent === 'copilot') {
    return 'Copilot';
  }

  return 'Gemini';
}

function agentRole(agent: AgentName): string {
  if (agent === 'claude') {
    return 'Arquiteto';
  }

  if (agent === 'copilot') {
    return 'Engenheiro';
  }

  return 'Coordenador';
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

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getDebatePhase(status: string): number {
  const normalized = normalizeText(status);

  if (normalized.includes('abertura')) {
    return 1;
  }

  if (normalized.includes('parecer gemini')) {
    return 2;
  }

  if (normalized.includes('parecer claude')) {
    return 3;
  }

  if (normalized.includes('parecer copilot')) {
    return 4;
  }

  if (normalized.includes('consolidacao') || normalized.includes('consolidado')) {
    return 5;
  }

  if (normalized.includes('aprovacao marcio') || normalized.includes('aguardando parecer de marcio')) {
    return 6;
  }

  if (normalized.includes('wo') && normalized.includes('despachadas')) {
    return 7;
  }

  if (normalized.includes('execucao concluida') || normalized.includes('encerrado')) {
    return 8;
  }

  return 4;
}

function debateStateClass(entry: DebateEntry): 'turn' | 'done' {
  return getDebatePhase(entry.status) >= 7 ? 'done' : 'turn';
}

function pendingInboxText(count: number): string {
  return count === 1 ? '1 entrada pendente na inbox' : `${count} entradas pendentes na inbox`;
}

function blockedInboxText(count: number): string {
  return count === 1 ? '1 item bloqueado' : `${count} itens bloqueados`;
}

function viewSubtitle(view: ControlView): string {
  return view === 'v2'
    ? 'Visibilidade total do squad em tempo real'
    : 'Decisões pendentes — aja sem sair do painel';
}

function phaseStyle(phase: number): CSSProperties {
  return { '--p': phase } as CSSProperties;
}

export function CentroDeControle({ state }: CentroDeControleProps) {
  const [busyConfigKey, setBusyConfigKey] = useState<keyof HiveConfig | null>(null);
  const [releasingAgent, setReleasingAgent] = useState<AgentName | null>(null);
  const [dispatchDialog, setDispatchDialog] = useState<DispatchDialogState | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [view, setView] = useState<ControlView>('v2');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const config = state?.config ?? DEFAULT_CONFIG;
  const orchestrator = state?.orchestrator ?? null;
  const events = state?.events ?? [];
  const debates = state?.debates ?? [];

  const activeLocks = useMemo(
    () =>
      (Object.entries(state?.locks ?? {}) as Array<[AgentName, HiveState['locks'][AgentName]]>).filter(
        ([, lock]) => lock,
      ),
    [state],
  );

  const agentDetails = useMemo(
    () => ({
      claude: state?.agentDetails?.claude ?? DEFAULT_AGENT_DETAIL,
      copilot: state?.agentDetails?.copilot ?? DEFAULT_AGENT_DETAIL,
      gemini: state?.agentDetails?.gemini ?? DEFAULT_AGENT_DETAIL,
    }),
    [state],
  );

  const commandCount = useMemo(
    () =>
      events.filter(
        (event) =>
          (event.level === 'info' || event.level === 'lock') &&
          /(despachad|liberad)/i.test(event.msg),
      ).length,
    [events],
  );

  const totalInboxPending = useMemo(
    () => AGENTS.reduce((sum, agent) => sum + agentDetails[agent].inboxPending, 0),
    [agentDetails],
  );

  const totalBlocked = useMemo(
    () => AGENTS.reduce((sum, agent) => sum + agentDetails[agent].blockedCount, 0),
    [agentDetails],
  );

  const activeDebates = useMemo(() => debates.filter((entry) => entry.active), [debates]);

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

      setToast({
        kind: 'success',
        message: `Intenção despachada para ${agentName(dispatchDialog.agent)}.`,
      });
      setDispatchDialog(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao despachar intenção.';
      setDialogError(message);
      setToast({ kind: 'error', message });
    } finally {
      setDispatching(false);
    }
  }

  function renderConfigControls() {
    return (
      <>
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
      </>
    );
  }

  function renderDispatchDialog() {
    if (!dispatchDialog) {
      return null;
    }

    return (
      <div className="dispatch-modal" role="dialog" aria-labelledby="dispatch-title" aria-modal="true">
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
          <button
            className="disp-btn primary"
            disabled={dispatching}
            onClick={() => void submitDispatch()}
            type="button"
          >
            {dispatching ? 'Despachando...' : 'Despachar'}
          </button>
        </div>
      </div>
    );
  }

  function debateHolder(phase: number): string {
    if (phase <= 2) return 'Gemini';
    if (phase === 3) return 'Claude';
    if (phase === 4) return 'Copilot';
    if (phase === 5) return 'Consolidando';
    return '';
  }

  function renderPipeline() {
    type PlItem = { id: string; title: string; hint?: string };

    const byPhase = (phases: number[]): PlItem[] =>
      activeDebates
        .filter((d) => phases.includes(getDebatePhase(d.status)))
        .map((d) => ({ id: d.id, title: d.title, hint: debateHolder(getDebatePhase(d.status)) }));

    const copilotWo = agentDetails.copilot.activeWo;

    const stages: Array<{ key: string; label: string; sub: string; cls: string; items: PlItem[] }> = [
      { key: 'debate',    label: 'Debate',    sub: 'Squad',   cls: 'av-gemini',  items: byPhase([1, 2, 3, 4, 5]) },
      { key: 'wo',        label: 'WO criada', sub: 'Claude',  cls: 'av-claude',  items: byPhase([7]) },
      { key: 'execucao',  label: 'Execução',  sub: 'Copilot', cls: 'av-copilot', items: copilotWo ? [{ id: 'WO', title: copilotWo }] : [] },
      { key: 'auditoria', label: 'Auditoria', sub: 'Claude',  cls: 'av-claude',  items: [] },
      { key: 'gate',      label: 'Gate',      sub: 'Márcio',  cls: 'av-human',   items: byPhase([6]) },
      { key: 'sr',        label: 'SR',        sub: 'Copilot', cls: 'av-copilot', items: [] },
    ];

    return (
      <div className="pipeline">
        {stages.map((stage) => (
          <div key={stage.key} className="pl-col">
            <div className="pl-head">
              <span className={`pl-av ${stage.cls}`}>{stage.sub.charAt(0)}</span>
              <div className="pl-meta">
                <div className="pl-role">{stage.label}</div>
                <div className="pl-sub">{stage.sub}</div>
              </div>
              {stage.items.length > 0 ? <span className="pl-count">{stage.items.length}</span> : null}
            </div>
            <div className="pl-cards">
              {stage.items.map((item) => (
                <div key={item.id} className="pl-card">
                  <span className="pl-id">{item.id}</span>
                  <span className="pl-title">{item.title}</span>
                  {item.hint ? <span className="pl-hint">↳ {item.hint}</span> : null}
                </div>
              ))}
              {stage.items.length === 0 ? <div className="pl-empty">livre</div> : null}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderEventStream(title: string, showLiveBadge = false) {
    return (
      <div className="panel">
        <div className="ph">
          <span className="ph-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m4 7 5 5-5 5" />
              <line x1="12" x2="20" y1="17" y2="17" />
            </svg>
          </span>
          <h3>{title}</h3>
          {showLiveBadge ? (
            <span className="ph-meta">
              <span
                className="dot green pulse"
                style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }}
              />
              ao vivo
            </span>
          ) : (
            <span className="ph-meta">ao vivo</span>
          )}
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
    );
  }

  return (
    <main className="screen active">
      <div className="page">
        {toast ? (
          <div className={`toast toast-${toast.kind}`} aria-live="polite" role="status">
            {toast.message}
          </div>
        ) : null}

        {orchestrator?.status === 'paused' ? (
          <div className="orch-banner" role="status">
            <strong>Orchestrator pausado.</strong>
            <span>{orchestrator.pauseReason ?? 'Aguardando intervenção manual.'}</span>
          </div>
        ) : null}

        <div
          className="page-head"
          style={{ alignItems: 'flex-start', display: 'flex', gap: 20, justifyContent: 'space-between' }}
        >
          <div>
            <h1>Centro de Controle</h1>
            <div className="sub">
              <span className="live-dot" />
              {viewSubtitle(view)}
            </div>
          </div>
          <div className="bs-view" id="ccView" style={{ marginTop: 4 }}>
            <button
              className={`bs-view-btn ${view === 'v1' ? 'active' : ''}`}
              onClick={() => setView('v1')}
              title="Controles (v1)"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" width="16">
                <line x1="4" x2="20" y1="8" y2="8" />
                <circle cx="9" cy="8" r="2.4" />
                <line x1="4" x2="20" y1="16" y2="16" />
                <circle cx="15" cy="16" r="2.4" />
              </svg>
            </button>
            <button
              className={`bs-view-btn ${view === 'v2' ? 'active' : ''}`}
              onClick={() => setView('v2')}
              title="Visibilidade (v2)"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" width="16">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        {view === 'v1' ? (
          <div id="cc-v1">
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
                        <rect height="9" rx="2" width="14" x="5" y="11" />
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
                          <div className={`la ${agentClass(agent)}`}>{agentBadgeLabel(agent)}</div>
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
                        <line x1="4" x2="20" y1="8" y2="8" />
                        <circle cx="9" cy="8" r="2.4" />
                        <line x1="4" x2="20" y1="16" y2="16" />
                        <circle cx="15" cy="16" r="2.4" />
                      </svg>
                    </span>
                    <h3>Controles do Squad</h3>
                  </div>
                  <div className="pb">{renderConfigControls()}</div>
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
                    {renderDispatchDialog()}
                  </div>
                </div>
              </div>

              {renderEventStream('Stream de Eventos')}
            </div>
          </div>
        ) : null}

        {view === 'v2' ? (
          <div id="cc-v2">
            <div className="section-label">
              <span className="n">01</span> Estado por agente <span className="line" />
            </div>
            <div className="grid-3" style={{ marginBottom: 26 }}>
              {AGENTS.map((agent) => {
                const detail = agentDetails[agent];
                const isRunning = Boolean(detail.activeWo);

                return (
                  <div key={agent} className={`cc2-agent ${agent} ${isRunning ? 'running' : ''}`}>
                    <div className="cc2-head">
                      <span className="cc2-av">{agentBadgeLabel(agent)}</span>
                      <div className="cc2-id">
                        <div className="cc2-name">{agentName(agent)}</div>
                        <div className="cc2-role">{agentRole(agent)}</div>
                      </div>
                      {isRunning ? (
                        <span className="cc2-lock running">
                          <svg viewBox="0 0 24 24" fill="none" height="11" stroke="currentColor" strokeWidth="2.2" width="11">
                            <rect height="9" rx="2" width="14" x="5" y="11" />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                          </svg>
                          {detail.activeWo}
                        </span>
                      ) : (
                        <span className="cc2-lock free">
                          <span className="dot" />
                          Livre
                        </span>
                      )}
                      {detail.inboxPending > 0 ? <span className="cc2-count">{detail.inboxPending}</span> : null}
                    </div>
                    <div className="cc2-body">
                      {detail.inboxPending === 0 && detail.blockedCount === 0 ? (
                        <div className="cc2-clean">
                          <svg viewBox="0 0 24 24" fill="none" height="15" stroke="currentColor" strokeWidth="2.2" width="15">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                          Nenhuma pendência
                        </div>
                      ) : (
                        <>
                          {detail.inboxPending > 0 ? (
                            <div className="cc2-item">
                              <span className="cc2-iid">INBOX</span>
                              <span className="cc2-subj">{pendingInboxText(detail.inboxPending)}</span>
                              <span className="cc2-tag handoff">inbox</span>
                            </div>
                          ) : null}
                          {detail.blockedCount > 0 ? (
                            <div className="cc2-item blocked">
                              <span className="cc2-iid">BLOCK</span>
                              <span className="cc2-subj">{blockedInboxText(detail.blockedCount)}</span>
                              <span className="cc2-tag blocked">bloqueado</span>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                    <div className="cc2-foot">
                      <button className="btn-ghost" onClick={() => openDispatchDialog(agent)} type="button">
                        Despachar →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cc2-actions">
              {activeLocks.map(([agent]) => (
                <button
                  key={`release-${agent}`}
                  className="cc2-action"
                  disabled={releasingAgent === agent}
                  onClick={() => void releaseLock(agent)}
                  type="button"
                >
                  <svg viewBox="0 0 24 24" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" width="16">
                    <rect height="9" rx="2" width="14" x="5" y="11" />
                    <path d="M8 11V7a4 4 0 0 1 7-2.6" />
                  </svg>
                  {releasingAgent === agent ? `Liberando ${agentName(agent)}...` : `Liberar lock ${agentName(agent)}`}
                </button>
              ))}
              <button className="cc2-action cc2-dispatch" onClick={() => openDispatchDialog('claude')} type="button">
                <span className="d" style={{ background: 'var(--claude)' }} />
                Despachar para Claude
              </button>
              <button className="cc2-action cc2-dispatch" onClick={() => openDispatchDialog('gemini')} type="button">
                <span className="d" style={{ background: 'var(--gemini)' }} />
                Despachar para Gemini
              </button>
              <button className="cc2-action" onClick={() => setSettingsOpen((current) => !current)} type="button">
                <svg viewBox="0 0 24 24" fill="none" height="16" stroke="currentColor" strokeWidth="1.8" width="16">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15Z" />
                </svg>
                Configurações
              </button>
            </div>

            <div className="section-label" style={{ marginTop: 24 }}>
              <span className="n">02</span> Esteira de Processos <span className="line" />
            </div>
            {renderPipeline()}

            {activeLocks.length === 0 && totalInboxPending === 0 && totalBlocked === 0 ? (
              <div className="cc2-clean" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" height="15" stroke="currentColor" strokeWidth="2.2" width="15">
                  <path d="m5 13 4 4L19 7" />
                </svg>
                Squad em repouso — nenhuma ação necessária
              </div>
            ) : null}

            {actionError ? <div className="panel-feedback error">{actionError}</div> : null}
            {renderDispatchDialog()}

            <div className={`cc2-settings ${settingsOpen ? 'open' : ''}`}>{renderConfigControls()}</div>

            <div className="cc2-grid">
              <div className="panel">
                <div className="ph">
                  <span className="ph-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M8 10h8M8 14h5" />
                      <path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" />
                    </svg>
                  </span>
                  <h3>Debates ativos</h3>
                </div>
                <div className="pb" style={{ paddingTop: 6 }}>
                  {activeDebates.length > 0 ? (
                    activeDebates.map((entry) => (
                      <div
                        key={entry.id}
                        className={`debate ${debateStateClass(entry) === 'turn' ? 'active' : ''}`}
                      >
                        <div className="debate-top">
                          <span className="debate-id">{entry.id}</span>
                          <span className={`debate-state ${debateStateClass(entry)}`}>{entry.status}</span>
                        </div>
                        <div className="debate-title">{entry.title}</div>
                        <div className="phase-bar">
                          <i style={phaseStyle(getDebatePhase(entry.status))} />
                        </div>
                        <div className="debate-meta">
                          {entry.status}
                          <span className="debate-block">{entry.responsible}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="cc2-clean">
                      <svg viewBox="0 0 24 24" fill="none" height="15" stroke="currentColor" strokeWidth="2.2" width="15">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                      Nenhum debate ativo.
                    </div>
                  )}
                </div>
              </div>

              {renderEventStream('Eventos ao vivo', true)}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

import { type HiveState, type PipelineAgent, type PipelineItem, type PipelineStage } from '../hooks/useHiveSocket';

type FunilIntencaoProps = {
  state: HiveState | null;
};

type BoardColumn = {
  key: 'captura' | PipelineStage;
  label: string;
  items: PipelineItem[];
};

const captureItems: PipelineItem[] = [
  {
    id: 'HIVE-091',
    title: 'Exportar relatório de squad em PDF',
    stage: 'triagem',
    agent: 'marcio',
    priority: 'lo',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HIVE-090',
    title: 'Webhook do GitHub para abrir intenção',
    stage: 'triagem',
    agent: 'marcio',
    priority: 'md',
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

function avatarClass(agent: PipelineAgent): string {
  if (agent === 'claude') {
    return 'av-claude';
  }

  if (agent === 'copilot') {
    return 'av-copilot';
  }

  if (agent === 'gemini') {
    return 'av-gemini';
  }

  return 'av-human';
}

function avatarLabel(agent: PipelineAgent): string {
  if (agent === 'marcio') {
    return 'M';
  }

  return agent.charAt(0).toUpperCase();
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs)) {
    return 'sem atualização';
  }

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return 'agora';
  }

  if (minutes < 60) {
    return `há ${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `há ${hours}h`;
  }

  return date.toLocaleDateString('pt-BR');
}

function renderIntent(item: PipelineItem) {
  return (
    <div key={`${item.agent}-${item.id}-${item.updatedAt}`} className={`intent ${item.stage === 'execucao' ? 'active' : ''}`}>
      <div className="intent-top">
        <div className="intent-id-wrap">
          <span className="it-id">{item.id}</span>
        </div>
        <span className={`prio ${item.priority}`} />
      </div>
      <div className="it-title">{item.title}</div>
      <div className="it-foot">
        <span className={`mini-av ${avatarClass(item.agent)}`}>{avatarLabel(item.agent)}</span>
        <span className="t">{formatUpdatedAt(item.updatedAt)}</span>
      </div>
    </div>
  );
}

function renderColumn(column: BoardColumn) {
  return (
    <div key={column.key} className="col">
      <div className="col-head">
        {column.label}
        <span className="ct">{column.items.length}</span>
      </div>
      <div className="col-stack">
        {column.items.length > 0 ? (
          column.items.map(renderIntent)
        ) : (
          <div className="intent">
            <div className="it-title">Nenhum item nesta fase</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FunilIntencao({ state }: FunilIntencaoProps) {
  const pipeline = state?.pipeline ?? [];
  const triagem = pipeline.filter((item) => item.stage === 'triagem');
  const execucao = pipeline.filter((item) => item.stage === 'execucao');
  const revisao = pipeline.filter((item) => item.stage === 'revisao');
  const concluido = pipeline.filter((item) => item.stage === 'concluido');

  const columns: BoardColumn[] = [
    { key: 'captura', label: 'Captura', items: captureItems },
    { key: 'triagem', label: 'Triagem', items: triagem },
    { key: 'execucao', label: 'Execução', items: execucao },
    { key: 'revisao', label: 'Revisão', items: revisao },
    { key: 'concluido', label: 'Mergeado', items: concluido },
  ];

  return (
    <main className="screen active">
      <div className="page">
        <div className="page-head">
          <h1>Funil de Intenção</h1>
          <div className="sub">
            <span className="live-dot" />
            Pipeline de brainstorms e ideações
          </div>
        </div>

        <div className="funnel-strip">
          <div className="funnel-step">
            <div className="fs-top">
              <span className="fs-name">Captura</span>
            </div>
            <div className="fs-count">{captureItems.length}</div>
            <div className="fs-bar">
              <i className="gray" />
            </div>
            <span className="arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
          <div className="funnel-step">
            <div className="fs-top">
              <span className="fs-name">Triagem</span>
            </div>
            <div className="fs-count">{triagem.length}</div>
            <div className="fs-bar">
              <i className="gray" />
            </div>
            <span className="arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
          <div className="funnel-step exec">
            <div className="fs-top">
              <span className="fs-name">Execução</span>
              {execucao.length > 0 ? <span className="dot green pulse" /> : null}
            </div>
            <div className="fs-count">{execucao.length}</div>
            <div className="fs-bar">
              <i />
            </div>
            <span className="arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
          <div className="funnel-step rev">
            <div className="fs-top">
              <span className="fs-name">Revisão</span>
            </div>
            <div className="fs-count">{revisao.length}</div>
            <div className="fs-bar">
              <i />
            </div>
            <span className="arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
          <div className="funnel-step">
            <div className="fs-top">
              <span className="fs-name">Mergeado</span>
            </div>
            <div className="fs-count">{concluido.length}</div>
            <div className="fs-bar">
              <i className="gray" />
            </div>
          </div>
        </div>

        <div className="board">{columns.map(renderColumn)}</div>
      </div>
    </main>
  );
}

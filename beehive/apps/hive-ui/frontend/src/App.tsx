import { useEffect, useMemo, useState } from 'react';
import { useHiveSocket } from './hooks/useHiveSocket';
import { CentroDeControle } from './pages/CentroDeControle';
import { DashboardSimples } from './pages/DashboardSimples';
import { Diagramas } from './pages/Diagramas';
import { Funil } from './pages/Funil';

import { MapaFabrica } from './pages/MapaFabrica';
import { Telemetria } from './pages/Telemetria';


type PublicRoute = '/' | '/landing' | '/login';
type CockpitRoute = '/mapa' | '/operacao' | '/funil' | '/controle' | '/diagramas';
type Route = PublicRoute | CockpitRoute;

type NavItem = {
  route: CockpitRoute;
  label: string;
  renderIcon: () => JSX.Element;
};

function normalizeRoute(pathname: string): Route {
  if (pathname === '/' || pathname === '/landing') {
    return pathname === '/' ? '/' : '/landing';
  }

  if (pathname === '/login') {
    return '/login';
  }

  if (pathname === '/operacao') {
    return '/operacao';
  }

  if (pathname === '/funil') {
    return '/funil';
  }

  if (pathname === '/controle') {
    return '/controle';
  }

  if (pathname === '/diagramas') {
    return '/diagramas';
  }

  return '/mapa';
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function isCockpitRoute(route: Route): route is CockpitRoute {
  return (
    route === '/mapa' ||
    route === '/operacao' ||
    route === '/funil' ||
    route === '/controle' ||
    route === '/diagramas'
  );
}

function getStoredSession(): boolean {
  return window.localStorage.getItem('hive-ui-demo-session') === 'ok';
}

function setStoredSession(active: boolean): void {
  if (active) {
    window.localStorage.setItem('hive-ui-demo-session', 'ok');
    return;
  }

  window.localStorage.removeItem('hive-ui-demo-session');
}

const navItems: NavItem[] = [
  {
    route: '/mapa',
    label: 'Mapa da Fábrica',
    renderIcon: () => (
      <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    route: '/operacao',
    label: 'Operação',
    renderIcon: () => (
      <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    route: '/funil',
    label: 'Funil de Intenção',
    renderIcon: () => (
      <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
      </svg>
    ),
  },
  {
    route: '/controle',
    label: 'Centro de Controle',
    renderIcon: () => (
      <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="4" y1="8" x2="20" y2="8" />
        <circle cx="9" cy="8" r="2.4" />
        <line x1="4" y1="16" x2="20" y2="16" />
        <circle cx="15" cy="16" r="2.4" />
      </svg>
    ),
  },
  {
    route: '/diagramas',
    label: 'Diagramas',
    renderIcon: () => (
      <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
];

function renderScreen(route: CockpitRoute, data: ReturnType<typeof useHiveSocket>) {
  if (route === '/operacao') {
    return <DashboardSimples state={data.state} telemetry={data.telemetry} />;
  }

  if (route === '/funil') {
    return <Funil state={data.state} />;
  }

  if (route === '/controle') {
    return <CentroDeControle state={data.state} telemetry={data.telemetry} />;
  }

  if (route === '/diagramas') {
    return <Diagramas />;
  }

  return <MapaFabrica state={data.state} telemetry={data.telemetry} />;
}

type ShellHeaderProps = {
  route: CockpitRoute;
  clock: string;
  connected: boolean;
  connectionLabel: string;
  onNavigate: (route: Route) => void;
  onLogout: () => void;
};

function ShellHeader({
  route,
  clock,
  connected,
  connectionLabel,
  onNavigate,
  onLogout,
}: ShellHeaderProps) {
  return (
    <header className="shell-header">
      <div className="brand">
        <span className="hex">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" fill="#FFD700" opacity="0.14" />
            <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" stroke="#FFD700" strokeWidth="1.4" />
            <path d="M12 7.5 16.3 10v4L12 16.5 7.7 14v-4L12 7.5Z" fill="#FFD700" />
          </svg>
        </span>
        <b>HIVE</b>
        <span>OS</span>
      </div>

      <nav className="nav-tabs" aria-label="Telas do Hive UI">
        {navItems.map((item) => (
          <button
            key={item.route}
            className={`nav-tab ${route === item.route ? 'active' : ''}`}
            onClick={() => onNavigate(item.route)}
            type="button"
          >
            {item.renderIcon()}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="ws-status">
        <div className="ws-clock">{clock}</div>
        <div className="ws-pill">
          <span className={`dot ${connected ? 'green pulse' : 'gray'}`} />
          <span className="label">{connectionLabel}</span>
          <span aria-hidden="true">·</span>
          <span>/hive</span>
        </div>
        <button className="nav-tab" onClick={() => onLogout()} type="button">
          Sair
        </button>
        <div className="operator">
          <span>Márcio</span>
          <span className="av">M</span>
        </div>
      </div>
    </header>
  );
}

type LandingPageProps = {
  onEnter: () => void;
  onOpenLogin: () => void;
};

function LandingPage({ onEnter, onOpenLogin }: LandingPageProps) {
  return (
    <>
      <nav className="lp-nav">
        <div className="brand">
          <span className="hex">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" fill="#FFD700" opacity="0.14" />
              <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" stroke="#FFD700" strokeWidth="1.4" />
              <path d="M12 7.5 16.3 10v4L12 16.5 7.7 14v-4L12 7.5Z" fill="#FFD700" />
            </svg>
          </span>
          <b>HIVE</b>
          <span>OS</span>
        </div>
        <div className="links">
          <a href="#produto">Produto</a>
          <a href="#agentes">Agentes</a>
          <a href="#fluxo">Como funciona</a>
          <button className="cta" onClick={onOpenLogin} type="button">
            Entrar no cockpit →
          </button>
        </div>
      </nav>

      <header className="lp">
        <div className="hero">
          <div>
            <span className="eyebrow lp-eyebrow">
              <span className="dot gold" />
              Otimização de squads de IA
            </span>
            <h1>
              Seu squad entrega o produto — e <em>continua mantendo</em>.
            </h1>
            <p className="lede">
              O Hive orquestra <b>Claude, Copilot e Gemini</b> como um time de alta
              performance: prioriza o que importa, entrega um produto de verdade no final e{' '}
              <b>fica de plantão para manter, corrigir e evoluir</b> — com você no comando.
            </p>
            <div className="hero-cta">
              <button className="cta" onClick={onOpenLogin} type="button">
                Entrar no cockpit →
              </button>
              <button className="cta ghost" onClick={onEnter} type="button">
                Abrir o mapa
              </button>
            </div>
            <div className="hero-meta">
              <div>
                <b>3×</b>throughput do squad
              </div>
              <div>
                <b>1</b>produto em produção
              </div>
              <div>
                <b>24/7</b>manutenção contínua
              </div>
            </div>
          </div>

          <div className="viz">
            <svg viewBox="0 0 400 400" fill="none">
              <line className="flow" x1="200" y1="200" x2="200" y2="70" stroke="#FFD700" strokeWidth="1.5" opacity=".6" />
              <line className="flow" x1="200" y1="200" x2="320" y2="280" stroke="#00FF9F" strokeWidth="1.5" opacity=".6" />
              <line className="flow" x1="200" y1="200" x2="80" y2="280" stroke="#8fb0ff" strokeWidth="1.5" opacity=".6" />
              <path d="M200 150 248 177v54l-48 27-48-27v-54L200 150Z" fill="#FFD700" opacity=".1" />
              <path d="M200 150 248 177v54l-48 27-48-27v-54L200 150Z" stroke="#FFD700" strokeWidth="1.6" />
              <path d="M200 174 224 188v26l-24 14-24-14v-26L200 174Z" fill="#FFD700" />
              <text x="200" y="298" textAnchor="middle" className="node-label">
                HIVE OS
              </text>
              <circle className="pulse-ring" cx="200" cy="60" r="7" fill="#FFD700" />
              <circle cx="200" cy="60" r="22" fill="#111" stroke="#FFD700" strokeWidth="1.4" />
              <text x="200" y="65" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fill="#FFD700">
                C
              </text>
              <text x="200" y="34" textAnchor="middle" className="node-label">
                Claude
              </text>
              <circle className="pulse-ring pulse-delay" cx="330" cy="288" r="7" fill="#00FF9F" />
              <circle cx="330" cy="288" r="22" fill="#111" stroke="#00FF9F" strokeWidth="1.4" />
              <text x="330" y="293" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fill="#00FF9F">
                G
              </text>
              <text x="330" y="328" textAnchor="middle" className="node-label">
                Copilot
              </text>
              <circle cx="70" cy="288" r="22" fill="#111" stroke="#8fb0ff" strokeWidth="1.4" />
              <text x="70" y="293" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fill="#8fb0ff">
                A
              </text>
              <text x="70" y="328" textAnchor="middle" className="node-label">
                Gemini
              </text>
            </svg>
          </div>
        </div>
      </header>

      <section className="lp sec" id="produto">
        <div className="sec-eyebrow">Como o Hive otimiza o squad</div>
        <h2>Menos coordenação manual. Mais entrega.</h2>
        <p>
          Três visões que tiram o atrito do time: todo mundo enxerga o mesmo estado, o
          trabalho flui sem colisão e a qualidade fica sob controle — do primeiro commit à
          manutenção.
        </p>
        <div className="feat-grid">
          <div className="feat">
            <div className="glyph">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div className="fnum">01 · Mapa da Fábrica</div>
            <h3>Visibilidade total do squad</h3>
            <p>
              Cada agente em um card vivo: lock, atividade e tempo. Zero trabalho
              duplicado, zero espera — o time para de perguntar &quot;quem está mexendo
              nisso?&quot;.
            </p>
          </div>
          <div className="feat g2">
            <div className="glyph">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
              </svg>
            </div>
            <div className="fnum">02 · Funil de Intenção</div>
            <h3>Da intenção à entrega</h3>
            <p>
              Cada ideia vira entrega mensurável, avançando por estágios até o merge.
              Throughput previsível e gargalos visíveis antes de virarem problema.
            </p>
          </div>
          <div className="feat">
            <div className="glyph">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="4" y1="8" x2="20" y2="8" />
                <circle cx="9" cy="8" r="2.4" />
                <line x1="4" y1="16" x2="20" y2="16" />
                <circle cx="15" cy="16" r="2.4" />
              </svg>
            </div>
            <div className="fnum">03 · Centro de Controle</div>
            <h3>Qualidade sob seu comando</h3>
            <p>
              Você ajusta prioridades, libera locks e mantém o padrão. O squad acelera, mas
              quem decide o rumo do produto é sempre você.
            </p>
          </div>
        </div>
      </section>

      <section className="lp sec" id="agentes">
        <div className="sec-eyebrow">O squad</div>
        <h2>Cada agente no papel certo.</h2>
        <p>
          O Hive aloca a força de cada modelo onde ela rende mais e coordena os locks para o
          time nunca colidir nem retrabalhar — entrega e manutenção, lado a lado.
        </p>
        <div className="agents-row">
          <div className="agent-chip">
            <div className="ac-ico ac-claude">C</div>
            <div>
              <div className="ac-name">Claude</div>
              <div className="ac-role">claude-sonnet · auditoria & arquitetura</div>
            </div>
          </div>
          <div className="agent-chip">
            <div className="ac-ico ac-copilot">G</div>
            <div>
              <div className="ac-name">Copilot</div>
              <div className="ac-role">gpt-codex · implementação & testes</div>
            </div>
          </div>
          <div className="agent-chip">
            <div className="ac-ico ac-gemini">A</div>
            <div>
              <div className="ac-name">Gemini</div>
              <div className="ac-role">gemini-pro · pesquisa & apoio</div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp sec" id="fluxo">
        <div className="sec-eyebrow">Do MVP à manutenção</div>
        <h2>Entrega o produto. E não abandona depois.</h2>
        <p>
          O squad não se dissolve no lançamento. Ele entra em um ciclo contínuo — otimizar,
          entregar, manter — para o produto seguir vivo e evoluindo.{' '}
          <span className="gold-text">↻ em loop</span>
        </p>
        <div className="steps">
          <div className="step">
            <div className="sn">01 · Otimizar</div>
            <h4>Afina o squad</h4>
            <p>
              O Hive prioriza intenções e distribui o trabalho entre os agentes certos. O
              time rende mais — sem virar caos.
            </p>
          </div>
          <div className="step">
            <div className="sn">02 · Entregar</div>
            <h4>Lança o produto</h4>
            <p>
              Da triagem ao merge, o squad converge para um produto real em produção, com
              qualidade revisada por você.
            </p>
          </div>
          <div className="step">
            <div className="sn">03 · Manter</div>
            <h4>Mantém vivo</h4>
            <p>
              Pós-launch o squad fica de plantão: corrige bugs, aplica melhorias e mantém o
              produto saudável — em loop.
            </p>
          </div>
        </div>
      </section>

      <section className="final">
        <h2>Um squad que entrega — e fica para manter.</h2>
        <p>Otimize seu time de agentes, lance o produto e mantenha tudo de pé. Com você no comando.</p>
        <div className="hero-cta final-actions">
          <button className="cta" onClick={onOpenLogin} type="button">
            Entrar no cockpit →
          </button>
        </div>
      </section>

      <footer className="lp-foot">
        <span className="dot green pulse display-inline" />
        <span>HIVE OS</span>
        <span className="lp-foot-right">ws://hive · conectado · operado por Márcio</span>
      </footer>
    </>
  );
}

type LoginPageProps = {
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
};

function LoginPage({ submitting, onSubmit, onBack }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    setVisibleLines(0);
    const timers = Array.from({ length: 5 }, (_, index) =>
      window.setTimeout(() => setVisibleLines((current) => Math.max(current, index + 1)), 350 + index * 380),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <div className="login-wrap">
      <section className="brand-panel">
        <div className="hexfield">
          <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <pattern id="hexp" width="60" height="52" patternUnits="userSpaceOnUse">
                <path d="M15 1 45 1 60 26 45 51 15 51 0 26Z" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="600" height="800" fill="url(#hexp)" />
          </svg>
        </div>
        <div className="bp-top brand">
          <span className="hex">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" fill="#FFD700" opacity="0.14" />
              <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" stroke="#FFD700" strokeWidth="1.4" />
              <path d="M12 7.5 16.3 10v4L12 16.5 7.7 14v-4L12 7.5Z" fill="#FFD700" />
            </svg>
          </span>
          <b>HIVE</b>
          <span>OS</span>
        </div>
        <div className="bp-center">
          <div className="viz login-viz">
            <svg viewBox="0 0 400 400" fill="none">
              <line className="flow" x1="200" y1="200" x2="200" y2="70" stroke="#FFD700" strokeWidth="1.5" opacity=".55" />
              <line className="flow" x1="200" y1="200" x2="320" y2="280" stroke="#00FF9F" strokeWidth="1.5" opacity=".55" />
              <line className="flow" x1="200" y1="200" x2="80" y2="280" stroke="#8fb0ff" strokeWidth="1.5" opacity=".55" />
              <path d="M200 150 248 177v54l-48 27-48-27v-54L200 150Z" fill="#FFD700" opacity=".1" />
              <path d="M200 150 248 177v54l-48 27-48-27v-54L200 150Z" stroke="#FFD700" strokeWidth="1.6" />
              <path d="M200 174 224 188v26l-24 14-24-14v-26L200 174Z" fill="#FFD700" />
              <text x="200" y="300" textAnchor="middle" className="node-label">
                HIVE OS
              </text>
              <circle className="pulse-ring" cx="200" cy="60" r="7" fill="#FFD700" />
              <circle cx="200" cy="60" r="22" fill="#0e0e0e" stroke="#FFD700" strokeWidth="1.4" />
              <text x="200" y="65" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fill="#FFD700">
                C
              </text>
              <circle className="pulse-ring pulse-delay" cx="320" cy="280" r="7" fill="#00FF9F" />
              <circle cx="320" cy="280" r="22" fill="#0e0e0e" stroke="#00FF9F" strokeWidth="1.4" />
              <text x="320" y="285" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fill="#00FF9F">
                G
              </text>
              <circle cx="80" cy="280" r="22" fill="#0e0e0e" stroke="#8fb0ff" strokeWidth="1.4" />
              <text x="80" y="285" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fill="#8fb0ff">
                A
              </text>
            </svg>
          </div>
        </div>
        <div className="bootlog">
          {[
            ['› inicializando ', 'hive os', ' v1.0…'],
            ['› verificando integridade do squad… ', 'ok', ''],
            ['› claude · copilot · gemini → ', 'online', ''],
            ['› protocolo de lock distribuído… ', 'ativo', ''],
            ['› aguardando operador', '', ''],
          ].map(([prefix, highlight, suffix], index) => (
            <span key={prefix} className={`l ${visibleLines > index ? 'show' : ''}`}>
              {prefix}
              {highlight ? (
                <span className={index === 0 ? 'gold' : 'ok'}>{highlight}</span>
              ) : null}
              {suffix}
              {index === 4 ? <span className="cur" /> : null}
            </span>
          ))}
        </div>
      </section>

      <section className="form-panel">
        <form
          className="form-card"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="fc-eyebrow">
            <span className="dot gold" />
            Autenticação do operador
          </div>
          <h1>Entrar no cockpit</h1>
          <p className="hint">Acesse o painel de orquestração do seu squad de IA.</p>

          <div className="field">
            <label htmlFor="op">Operador</label>
            <div className="input">
              <span className="ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </span>
              <input id="op" type="text" placeholder="marcio" defaultValue="marcio" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="pw">Chave de acesso</label>
            <div className="input">
              <span className="ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <input id="pw" type={showPassword ? 'text' : 'password'} placeholder="••••••••••" defaultValue="hive-os" />
              <button
                type="button"
                className="reveal"
                aria-label="mostrar senha"
                onClick={() => setShowPassword((value) => !value)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="row-between">
            <button
              type="button"
              className={`remember ${remember ? 'on' : ''}`}
              onClick={() => setRemember((value) => !value)}
            >
              <span className="check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </span>
              Manter sessão
            </button>
            <button type="button" className="forgot">
              Esqueci a chave
            </button>
          </div>

          <button type="submit" className={`submit ${submitting ? 'loading' : ''}`}>
            <span className="spin" />
            <span className="label">{submitting ? 'Abrindo cockpit...' : 'Entrar no cockpit →'}</span>
          </button>

          <div className="alt">
            <button type="button" className="alt-btn" onClick={onBack}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="9" cy="9" r="4" />
                <path d="M13 13l6 6m-3-3 2-2" />
              </svg>
              Voltar para a landing
            </button>
          </div>

          <div className="agents-mini">
            <span>squad pronto:</span>
            <span className="a ac-claude">C</span>
            <span className="a ac-copilot">G</span>
            <span className="a ac-gemini">A</span>
          </div>
        </form>

        <div className="ws-line">
          <span className={`dot ${submitting ? 'green pulse' : 'gold pulse'} display-inline`} />
          <span>{submitting ? 'ws://hive · conectado' : 'estabelecendo conexão ws://hive…'}</span>
        </div>
      </section>
    </div>
  );
}

export function App() {
  const [route, setRoute] = useState<Route>(normalizeRoute(window.location.pathname));
  const [authenticated, setAuthenticated] = useState<boolean>(() => getStoredSession());
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const hiveSocket = useHiveSocket();
  const { connected, error } = hiveSocket;

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const navigate = (nextRoute: Route) => {
    window.history.pushState({}, '', nextRoute);
    setRoute(nextRoute);
  };

  useEffect(() => {
    if (isCockpitRoute(route) && !authenticated) {
      navigate('/login');
    }
  }, [authenticated, route]);

  const enterCockpit = (nextRoute: CockpitRoute = '/mapa') => {
    setStoredSession(true);
    setAuthenticated(true);
    setSubmittingLogin(false);
    navigate(nextRoute);
  };

  const logout = () => {
    setStoredSession(false);
    setAuthenticated(false);
    setSubmittingLogin(false);
    navigate('/landing');
  };

  const simulateLogin = () => {
    setSubmittingLogin(true);
    window.setTimeout(() => enterCockpit('/mapa'), 700);
  };

  const connectionLabel = useMemo(
    () => (connected ? 'conectado' : 'reconectando'),
    [connected],
  );

  if (!authenticated && (route === '/' || route === '/landing')) {
    return <LandingPage onEnter={() => enterCockpit('/mapa')} onOpenLogin={() => navigate('/login')} />;
  }

  if (!authenticated && route === '/login') {
    return (
      <LoginPage
        submitting={submittingLogin}
        onSubmit={simulateLogin}
        onBack={() => navigate('/landing')}
      />
    );
  }

  const cockpitRoute = isCockpitRoute(route) ? route : '/mapa';

  return (
    <>
      <ShellHeader
        route={cockpitRoute}
        clock={clock}
        connected={connected}
        connectionLabel={connectionLabel}
        onNavigate={navigate}
        onLogout={logout}
      />

      {error ? (
        <div className="page">
          <div className="panel">
            <div className="ph">
              <span className="ph-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5" />
                  <path d="M12 16h.01" />
                </svg>
              </span>
              <h3>Conexão do cockpit</h3>
            </div>
            <div className="pb">{error}</div>
          </div>
        </div>
      ) : null}

      {renderScreen(cockpitRoute, hiveSocket)}
    </>
  );
}

/* ============================================================
   HIVE OS — app.js
   Navegação de tabs + micro-animações (mockup de alta fidelidade)
   ============================================================ */
(function () {
  'use strict';

  // velocidade da simulação (controlada pelo Tweak)
  let speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sim')) || 1;

  window.HIVE = {
    setSpeed(v) { speed = Math.max(0.1, Number(v) || 1); }
  };

  /* -------- navegação de tabs -------- */
  const tabs = document.querySelectorAll('.nav-tab');
  const screens = {
    mapa: document.getElementById('screen-mapa'),
    funil: document.getElementById('screen-funil'),
    controle: document.getElementById('screen-controle'),
    brainstorm: document.getElementById('screen-brainstorm'),
  };
  function go(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.screen === name));
    Object.entries(screens).forEach(([k, el]) => el.classList.toggle('active', k === name));
    history.replaceState(null, '', '#' + name);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }
  tabs.forEach(t => t.addEventListener('click', () => go(t.dataset.screen)));
  const initial = (location.hash || '').replace('#', '');
  if (screens[initial]) go(initial);

  /* -------- relógio do header (tempo real) -------- */
  const clock = document.getElementById('wsClock');
  function tickClock() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    if (clock) clock.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* -------- uptime do squad (sobe, escalado pela velocidade) -------- */
  const uptimeEl = document.getElementById('uptime');
  let uptime = 4 * 3600 + 12 * 60 + 38; // 04:12:38
  function renderUptime() {
    const p = n => String(n).padStart(2, '0');
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    if (uptimeEl) uptimeEl.textContent = `${p(h)}:${p(m)}:${p(s)}`;
  }
  renderUptime();
  setInterval(() => { uptime += speed; renderUptime(); }, 1000);

  /* -------- contadores "há Xmin" subindo -------- */
  // cada elemento .ago guarda um valor float em minutos; sobe ~1min a cada (8s / speed)
  const agoEls = [...document.querySelectorAll('.ago')].map(el => ({
    el, val: parseFloat(el.dataset.min) || 0
  }));
  setInterval(() => {
    agoEls.forEach(o => {
      o.val += (1000 / 8000) * speed; // fração de minuto por tick de 1s
      o.el.textContent = Math.floor(o.val);
    });
  }, 1000);

  /* -------- toggles do Centro de Controle -------- */
  document.querySelectorAll('[data-toggle]').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });

  /* -------- Centro de Controle: alternância v1/v2 -------- */
  (function () {
    const v1 = document.getElementById('cc-v1');
    const v2 = document.getElementById('cc-v2');
    const v3 = document.getElementById('cc-v3');
    const sub = document.getElementById('ccSub');
    if (!v1 || !v2) return;
    const btns = document.querySelectorAll('#ccView .bs-view-btn');
    const SUBS = {
      v1: 'Orquestração manual do squad',
      v2: 'Estado ao vivo do squad — decida sem consultar',
      v3: 'Esteira de produção — o trabalho fluindo entre as estações',
    };
    function setView(view) {
      v1.style.display = view === 'v1' ? '' : 'none';
      v2.style.display = view === 'v2' ? 'block' : 'none';
      if (v3) v3.style.display = view === 'v3' ? 'block' : 'none';
      btns.forEach(b => b.classList.toggle('active', b.dataset.view === view));
      if (sub) sub.textContent = SUBS[view] || SUBS.v1;
      try { localStorage.setItem('hive-cc-view', view); } catch (e) {}
    }
    btns.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
    let saved = 'v1';
    try { saved = localStorage.getItem('hive-cc-view') || 'v1'; } catch (e) {}
    setView(saved);

    // configurações expansíveis
    const settingsBtn = document.getElementById('cc2Settings');
    const settingsPanel = document.getElementById('cc2SettingsPanel');
    if (settingsBtn && settingsPanel) {
      settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
        settingsBtn.style.borderColor = settingsPanel.classList.contains('open') ? 'var(--gold-line)' : '';
        settingsBtn.style.color = settingsPanel.classList.contains('open') ? 'var(--gold)' : '';
      });
    }

    // liberar lock do Copilot
    const releaseBtn = document.getElementById('cc2Release');
    if (releaseBtn) releaseBtn.addEventListener('click', () => {
      if (releaseBtn.disabled) return;
      const panel = document.querySelector('.cc2-agent.copilot');
      if (panel) {
        panel.classList.remove('running');
        panel.classList.add('free');
        const lock = panel.querySelector('.cc2-lock');
        if (lock) { lock.className = 'cc2-lock free'; lock.innerHTML = '<span class="dot"></span> Livre'; }
      }
      releaseBtn.disabled = true;
      releaseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7-2.6"/></svg> Lock liberado ✓';
      releaseBtn.style.color = 'var(--green)';
    });

    // despachar (feedback)
    document.querySelectorAll('.cc2-dispatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.agent || 'agente';
        const o = btn.style.boxShadow;
        btn.style.boxShadow = '0 0 0 2px var(--green)';
        setTimeout(() => { btn.style.boxShadow = o; }, 450);
      });
    });

    // avançar debate
    document.querySelectorAll('.debate-adv').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.debate');
        const bar = card.querySelector('.phase-bar i');
        let p = parseInt(card.querySelector('.phase-bar').dataset.phase) || 4;
        if (p < 8) { p++; bar.style.setProperty('--p', p); card.querySelector('.phase-bar').dataset.phase = p;
          card.querySelector('.debate-meta').firstChild.textContent = `Fase ${p} · em progresso `; }
        if (p >= 8) {
          const st = card.querySelector('.debate-state'); st.className = 'debate-state done'; st.textContent = '✓ Concluído';
          card.classList.remove('active'); btn.remove();
        }
      });
    });
  })();

  /* -------- MODAL: inbox por agente -------- */
  const INBOX = {
    claude: {
      name: 'Claude', glyph: 'C', accent: 'var(--claude)',
      items: [
        { id: 'CORE-002', title: 'Aprovar relatório de auditoria do delta de locks', prio: 'hi', meta: ['revisão técnica', 'há 6min'] },
        { id: 'HIVE-UI-001', title: 'Confirmar merge do MVP do painel operacional', prio: 'md', meta: ['aguarda você', 'há 22min'] },
      ],
    },
    copilot: {
      name: 'Copilot', glyph: 'G', accent: 'var(--green)',
      items: [],
    },
    gemini: {
      name: 'Gemini', glyph: 'A', accent: '#8fb0ff',
      items: [
        { id: 'API-022', title: 'Liberar deploy do endpoint /agents/heartbeat', prio: 'md', meta: ['CI verde', 'há 9min'] },
      ],
    },
  };

  const overlay = document.getElementById('inboxModal');
  const mIco = document.getElementById('inboxModalIco');
  const mTitle = document.getElementById('inboxModalTitle');
  const mCount = document.getElementById('inboxModalCount');
  const mList = document.getElementById('inboxList');
  const mEmpty = document.getElementById('inboxEmpty');
  const mFootMeta = document.getElementById('inboxFootMeta');
  const mClearAll = document.getElementById('inboxClearAll');
  let currentAgent = null;

  function syncCard(agentKey) {
    const card = document.querySelector(`.inbox-card[data-agent="${agentKey}"]`);
    if (!card) return;
    const n = INBOX[agentKey].items.length;
    card.querySelector('.inbox-count').textContent = n;
    const desc = card.querySelector('.desc');
    if (n === 0) {
      card.classList.remove('pending', 'glow-border-pulse');
      card.querySelector('.who').style.color = 'var(--t2)';
      if (desc) desc.textContent = 'inbox limpa';
    } else {
      card.classList.add('pending', 'glow-border-pulse');
      card.querySelector('.who').style.color = '';
      if (desc) desc.textContent = n === 1 ? 'aprovação aguardando' : 'aprovações aguardando';
    }
  }

  function renderModal() {
    const a = INBOX[currentAgent];
    if (!a) return;
    mIco.textContent = a.glyph;
    mIco.style.color = a.accent;
    mIco.style.background = 'color-mix(in srgb, ' + a.accent + ' 12%, transparent)';
    mIco.style.borderColor = 'color-mix(in srgb, ' + a.accent + ' 30%, transparent)';
    mTitle.textContent = 'Inbox de ' + a.name;
    mCount.textContent = a.items.length;
    mFootMeta.textContent = a.items.length + (a.items.length === 1 ? ' item' : ' itens');
    mClearAll.disabled = a.items.length === 0;

    mList.innerHTML = '';
    a.items.forEach((it) => {
      const li = document.createElement('li');
      li.className = 'inbox-item';
      li.innerHTML =
        `<span class="it-prio ${it.prio}"></span>` +
        `<div class="it-main">` +
          `<div class="it-id">${it.id}</div>` +
          `<div class="it-title">${it.title}</div>` +
          `<div class="it-meta">${it.meta.map(m => `<span>${m}</span>`).join('')}</div>` +
        `</div>` +
        `<button class="it-del" type="button" title="Remover" aria-label="Remover ${it.id}">` +
          `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/></svg>` +
        `</button>`;
      li.querySelector('.it-del').addEventListener('click', () => {
        li.classList.add('removing');
        setTimeout(() => {
          a.items = a.items.filter(x => x !== it);
          renderModal();
          syncCard(currentAgent);
        }, 240);
      });
      mList.appendChild(li);
    });
    mEmpty.classList.toggle('show', a.items.length === 0);
  }

  function openModal(agentKey) {
    currentAgent = agentKey;
    renderModal();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    currentAgent = null;
  }

  document.querySelectorAll('.inbox-card button.inbox-ico').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.closest('.inbox-card').dataset.agent;
      if (key) openModal(key);
    });
  });
  document.getElementById('inboxModalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  mClearAll.addEventListener('click', () => {
    const a = INBOX[currentAgent];
    if (!a || !a.items.length) return;
    const items = mList.querySelectorAll('.inbox-item');
    items.forEach((li, i) => setTimeout(() => li.classList.add('removing'), i * 50));
    setTimeout(() => {
      a.items = [];
      renderModal();
      syncCard(currentAgent);
    }, items.length * 50 + 240);
  });
  /* -------- forçar liberação (feedback visual) -------- */
  document.querySelectorAll('.btn-ghost').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.lock-row');
      if (!row) return;
      btn.textContent = 'Liberado ✓';
      btn.style.color = 'var(--green)';
      btn.style.borderColor = 'rgba(0,255,159,0.5)';
      btn.disabled = true;
      row.style.opacity = '0.5';
    });
  });

  /* -------- despachar (feedback) -------- */
  document.querySelectorAll('.disp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.style.boxShadow;
      btn.style.boxShadow = '0 0 0 2px var(--green)';
      setTimeout(() => { btn.style.boxShadow = original; }, 450);
      pushEvent({ lv: 'info', html: `comando enviado → <b>${btn.textContent.trim()}</b>` });
    });
  });

  /* -------- BRAINSTORM BOARD: filtros + visões -------- */
  (function () {
    const board = document.getElementById('bsBoard');
    if (!board) return;
    const agentBtns = document.querySelectorAll('#bsAgentFilter .bs-seg-btn');
    const search = document.getElementById('bsSearch');
    const result = document.getElementById('bsResult');
    const empty = document.getElementById('bsEmpty');
    const cards = [...board.querySelectorAll('.bs-card')];
    let agentFilter = 'todos';

    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const COL_STATUS = {
      captura:   { label: 'Captura',     color: 'var(--t2)' },
      refinando: { label: 'Refinando',   color: 'var(--gemini)' },
      pronto:    { label: 'Pronto',      color: 'var(--gold)' },
      debate:    { label: 'Em debate',   color: 'var(--green)' },
      arquivado: { label: 'Arquivado',   color: '#6a6a6a' },
    };
    const AGENT_LABEL = { claude: 'Claude', copilot: 'Copilot', gemini: 'Gemini', human: 'Márcio' };

    function apply() {
      const q = (search.value || '').trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const okAgent = agentFilter === 'todos' || card.dataset.agent === agentFilter;
        const okThread = !q || (card.dataset.thread || '').toLowerCase().includes(q)
          || card.querySelector('.bs-title').textContent.toLowerCase().includes(q);
        const show = okAgent && okThread;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      board.querySelectorAll('.bs-col').forEach(col => {
        const n = col.querySelectorAll('.bs-card:not(.hidden)').length;
        col.querySelector('.col-head .ct').textContent = n;
      });
      result.textContent = visible + (visible === 1 ? ' brainstorm' : ' brainstorms');
      empty.classList.toggle('show', visible === 0);
    }

    agentBtns.forEach(btn => btn.addEventListener('click', () => {
      agentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      agentFilter = btn.dataset.agent;
      apply();
    }));
    search.addEventListener('input', apply);

    // cria um card e o insere no topo da coluna
    function addCard(colKey, agent) {
      const stack = board.querySelector(`.bs-col[data-col="${colKey}"] .bs-stack`);
      if (!stack) return;
      const card = document.createElement('article');
      card.className = 'bs-card';
      card.dataset.agent = agent || 'human';
      card.dataset.thread = 'novo-brainstorm';
      const d = new Date();
      const av = { claude: 'av-claude', copilot: 'av-copilot', gemini: 'av-gemini', human: 'av-human' }[card.dataset.agent];
      const ini = { claude: 'C', copilot: 'G', gemini: 'A', human: 'M' }[card.dataset.agent];
      card.innerHTML =
        `<div class="bs-title" contenteditable="true">Novo brainstorm…</div>` +
        `<div class="bs-thread">› novo-brainstorm</div>` +
        `<div class="bs-foot"><span class="mini-av ${av}">${ini}</span><span class="bs-date">${d.getDate()} ${meses[d.getMonth()]}</span></div>`;
      stack.insertBefore(card, stack.firstChild);
      cards.push(card);
      if (board.classList.contains('trello')) decorateCard(card);
      apply();
      const t = card.querySelector('.bs-title');
      t.focus();
      const range = document.createRange(); range.selectNodeContents(t);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    }

    document.getElementById('bsNew').addEventListener('click', () => addCard('captura', 'human'));

    /* ---- modo Trello: decora cards + monta footers/menus ---- */
    function decorateCard(card) {
      if (card.querySelector('.bs-labels')) return;
      const colKey = card.closest('.bs-col').dataset.col;
      const st = COL_STATUS[colKey] || COL_STATUS.captura;
      const agent = card.dataset.agent;
      const labels = document.createElement('div');
      labels.className = 'bs-labels';
      labels.innerHTML =
        `<span class="bs-chip" style="--chip:${st.color}"><span class="chip-dot"></span>${st.label}</span>` +
        `<span class="bs-chip" style="--chip:var(--ac)">${AGENT_LABEL[agent] || agent}</span>`;
      card.insertBefore(labels, card.firstChild);
    }
    function buildTrelloExtras() {
      board.querySelectorAll('.bs-col').forEach(col => {
        // menu "⋯" no header
        if (!col.querySelector('.col-menu')) {
          const menu = document.createElement('button');
          menu.className = 'col-menu'; menu.type = 'button'; menu.title = 'Opções da lista';
          menu.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>`;
          col.querySelector('.col-head').appendChild(menu);
        }
        // rodapé "+ adicionar cartão"
        if (!col.querySelector('.bs-add')) {
          const add = document.createElement('button');
          add.className = 'bs-add'; add.type = 'button';
          add.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Adicionar cartão`;
          add.addEventListener('click', () => addCard(col.dataset.col, 'human'));
          col.appendChild(add);
        }
      });
      cards.forEach(decorateCard);
    }

    /* ---- alternância de visão ---- */
    const viewBtns = document.querySelectorAll('#bsView .bs-view-btn');
    function setView(view) {
      const trello = view === 'trello';
      board.classList.toggle('trello', trello);
      viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === view));
      if (trello) buildTrelloExtras();
      try { localStorage.setItem('hive-bs-view', view); } catch (e) {}
    }
    viewBtns.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
    let saved = 'board';
    try { saved = localStorage.getItem('hive-bs-view') || 'board'; } catch (e) {}
    setView(saved);

    apply();
  })();

  /* -------- stream de eventos: novos eventos chegando -------- */
  const stream = document.getElementById('stream');
  const tail = document.getElementById('streamTail');
  const tailTs = document.getElementById('tailTs');

  const POOL = [
    { lv: 'info', html: 'heartbeat de <b>Gemini</b> ok' },
    { lv: 'ok',   html: 'lint passou em <span class="g">module.guard.spec.ts</span>' },
    { lv: 'lock', html: '<b>Claude</b> renovou lock <span class="g">CORE-002</span>' },
    { lv: 'info', html: 'delta auditado: 0 regressões' },
    { lv: 'warn', html: 'fila de triagem com 4 itens' },
    { lv: 'ok',   html: 'CI verde em <b>API-022</b>' },
    { lv: 'info', html: 'snapshot de estado persistido' },
    { lv: 'ok',   html: '12 testes adicionados por <b>Copilot</b>' },
    { lv: 'lock', html: '<b>Copilot</b> renovou lock <span class="g">module.guard</span>' },
    { lv: 'info', html: 'Márcio visualizou PR <b>HIVE-UI-001</b>' },
  ];
  const LV_LABEL = { info: 'INFO', ok: 'OK', warn: 'WARN', err: 'ERR', lock: 'LOCK' };

  function nowStamp() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function pushEvent(ev) {
    pushTo(stream, tail, tailTs, ev);
    pushTo(
      document.getElementById('stream2'),
      document.getElementById('streamTail2'),
      document.getElementById('tailTs2'),
      ev
    );
  }

  function pushTo(streamEl, tailEl, tailTsEl, ev) {
    if (!streamEl || !tailEl) return;
    const row = document.createElement('div');
    row.className = 'log';
    row.innerHTML = `<span class="ts">${nowStamp()}</span><span class="lv ${ev.lv}">${LV_LABEL[ev.lv]}</span><span class="msg">${ev.html}</span>`;
    row.style.opacity = '0';
    row.style.transform = 'translateY(-4px)';
    row.style.transition = 'opacity .35s, transform .35s';
    streamEl.insertBefore(row, tailEl);
    requestAnimationFrame(() => { row.style.opacity = '1'; row.style.transform = 'none'; });
    if (tailTsEl) tailTsEl.textContent = nowStamp();
    const logs = streamEl.querySelectorAll('.log');
    if (logs.length > 40 && logs[0] !== tailEl) logs[0].remove();
    streamEl.scrollTop = streamEl.scrollHeight;
  }

  let poolIdx = 0;
  function scheduleEvent() {
    const delay = (4200 + Math.random() * 2600) / speed;
    setTimeout(() => {
      pushEvent(POOL[poolIdx % POOL.length]);
      poolIdx++;
      scheduleEvent();
    }, delay);
  }
  scheduleEvent();
})();

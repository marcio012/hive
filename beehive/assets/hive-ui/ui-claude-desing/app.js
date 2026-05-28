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
    if (!stream || !tail) return;
    const row = document.createElement('div');
    row.className = 'log';
    row.innerHTML = `<span class="ts">${nowStamp()}</span><span class="lv ${ev.lv}">${LV_LABEL[ev.lv]}</span><span class="msg">${ev.html}</span>`;
    row.style.opacity = '0';
    row.style.transform = 'translateY(-4px)';
    row.style.transition = 'opacity .35s, transform .35s';
    stream.insertBefore(row, tail);
    requestAnimationFrame(() => { row.style.opacity = '1'; row.style.transform = 'none'; });
    if (tailTs) tailTs.textContent = nowStamp();
    // limita histórico no DOM
    const logs = stream.querySelectorAll('.log');
    if (logs.length > 40 && logs[0] !== tail) logs[0].remove();
    stream.scrollTop = stream.scrollHeight;
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

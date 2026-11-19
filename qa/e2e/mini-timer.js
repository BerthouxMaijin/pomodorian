// Mini timer (Document Picture-in-Picture) end-to-end checks, real API.
const { chromium } = require('playwright');
const path = require('path');
const BASE = 'http://localhost:3100/';
const SHOTS = path.join(__dirname, 'shots');
require('fs').mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
const errors = [];
function check(name, ok, detail = '') {
  if (ok) { pass++; console.log('PASS', name, detail); }
  else { fail++; console.log('FAIL', name, detail); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const LONG = 'Write the quarterly report introduction and polish every single paragraph until it shines';

async function setup(browser, { settings = {}, tasks = [], viewport = { width: 1280, height: 800 }, removeApi = false } = {}) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(({ settings, tasks, removeApi }) => {
    if (location.origin !== 'http://localhost:3100') return;
    if (!sessionStorage.getItem('__seeded')) {
      sessionStorage.setItem('__seeded', '1');
      localStorage.setItem('ga-consent', 'denied');
      localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
      localStorage.setItem('pomodorian_settings', JSON.stringify(settings));
      localStorage.setItem('pomodorian_tasks', JSON.stringify(tasks));
    }
    if (removeApi) {
      delete window.documentPictureInPicture;
      try { delete Window.prototype.documentPictureInPicture; } catch {}
    }
  }, { settings, tasks, removeApi });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('main: ' + e.message));
  ctx.on('page', (p) => p.on('pageerror', (e) => errors.push('pip: ' + e.message)));
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  return { ctx, page };
}

function task(title, id = 't1') {
  return { id, title, estimatedPomodoros: 2, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 };
}

async function openPip(ctx, page) {
  const pPromise = ctx.waitForEvent('page', { timeout: 5000 });
  await page.click('[data-testid=mini-timer-button]');
  const pip = await pPromise;
  await pip.waitForSelector('[data-testid=mini-timer]', { timeout: 5000 });
  return pip;
}
const mainTime = (page) => page.locator('main [role=timer]').innerText();
const pipTime = (pip) => pip.locator('[data-testid=mini-timer-time]').innerText();
const mainStatus = (page) => page.evaluate(() => {
  const t = document.querySelector('main').innerText;
  return /\bPAUSE\b/.test(t) ? 'running' : /RESUME/.test(t) ? 'paused' : /START/.test(t) ? 'idle' : '?';
});

(async () => {
  const browser = await chromium.launch();

  // 1. Prerendered HTML has no button.
  const html = await (await fetch(BASE)).text();
  check('prerendered HTML has no mini timer button', !html.includes('mini-timer-button'));

  // 2. Feature detection: API absent -> no button.
  {
    const { ctx, page } = await setup(browser, { removeApi: true });
    const has = await page.evaluate(() => 'documentPictureInPicture' in window);
    await sleep(500);
    check('API removed: no button', !has && (await page.locator('[data-testid=mini-timer-button]').count()) === 0, `api=${has}`);
    await ctx.close();
  }

  // 3. Main flow, dark theme, with a long task.
  const { ctx, page } = await setup(browser, { settings: { theme: 'dark', language: 'en' }, tasks: [task(LONG)] });
  const btn = page.locator('[data-testid=mini-timer-button]');
  check('API present: button rendered', (await btn.count()) === 1);
  const isLast = await page.evaluate(() => {
    const b = document.querySelector('[data-testid=mini-timer-button]');
    const prev = b.previousElementSibling;
    return !b.nextElementSibling && prev && prev.getAttribute('aria-label') === 'Settings';
  });
  check('button is last in header group, right after Settings', isLast);
  const sameStyle = await page.evaluate(() => {
    const b = document.querySelector('[data-testid=mini-timer-button]').getBoundingClientRect();
    const s = document.querySelector('header button[aria-label=Settings]').getBoundingClientRect();
    return b.width === s.width && b.height === s.height && b.top === s.top;
  });
  check('button same size and row as Settings', sameStyle);
  check('aria-pressed false when closed', (await btn.getAttribute('aria-pressed')) === 'false');
  check('aria-label closed', (await btn.getAttribute('aria-label')) === 'Open the mini timer');
  await page.screenshot({ path: path.join(SHOTS, 'header-dark.png'), clip: { x: 0, y: 0, width: 1280, height: 80 } });

  const listenersBefore = await (async () => {
    const cdp = await ctx.newCDPSession(page);
    const { result } = await cdp.send('Runtime.evaluate', { expression: 'window' });
    const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId });
    const { result: d } = await cdp.send('Runtime.evaluate', { expression: 'document.documentElement' });
    const { listeners: l2 } = await cdp.send('DOMDebugger.getEventListeners', { objectId: d.objectId });
    return listeners.length + l2.length;
  })();

  let pip = await openPip(ctx, page);
  check('click opens a PiP window', !!pip && (await page.evaluate(() => !!window.documentPictureInPicture.window)));
  check('aria-pressed true when open', (await btn.getAttribute('aria-pressed')) === 'true');
  check('aria-label open', (await btn.getAttribute('aria-label')) === 'Close the mini timer');
  check('PiP title and lang', (await pip.title()) === 'Pomodorian mini timer' && (await pip.evaluate(() => document.documentElement.lang)) === 'en');
  check('PiP theme dark', (await pip.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'dark');
  const font = await pip.locator('[data-testid=mini-timer-time]').evaluate((el) => getComputedStyle(el).fontFamily);
  check('PiP uses the app font (Geist)', /geist/i.test(font), font);
  const fontLoaded = await pip.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some((f) => /geist/i.test(f.family) && f.status === 'loaded'); });
  check('Geist font face loaded in PiP', fontLoaded);
  check('portal not in main document', (await page.locator('[data-testid=mini-timer]').count()) === 0);
  check('idle: time equal', (await mainTime(page)) === (await pipTime(pip)), await pipTime(pip));
  check('idle: control says START', (await pip.locator('[data-testid=mini-timer-toggle]').innerText()) === 'START');
  check('pomodoro colour red', (await pip.locator('[data-testid=mini-timer-progress]').evaluate((e) => getComputedStyle(e).backgroundColor)) === 'rgb(239, 68, 68)');
  check('no task line before a task is active', (await pip.locator('[data-testid=mini-timer-task]').count()) === 0);
  await pip.setViewportSize({ width: 260, height: 180 });
  await pip.screenshot({ path: path.join(SHOTS, 'pip-dark-pomodoro-idle-notask.png') });

  // Start from the mini window.
  await pip.click('[data-testid=mini-timer-toggle]');
  await sleep(400);
  check('PiP START starts the page timer', (await mainStatus(page)) === 'running');
  check('control says PAUSE', (await pip.locator('[data-testid=mini-timer-toggle]').innerText()) === 'PAUSE');
  let same = 0;
  for (let i = 0; i < 5; i++) {
    await sleep(1000);
    const [a, b] = await Promise.all([mainTime(page), pipTime(pip)]);
    if (a === b) same++; else console.log('   diff', a, b);
  }
  check('running: PiP time equals page time each second (5 samples)', same === 5, `${same}/5`);
  const t = await pipTime(pip);
  check('time moved', t !== '25:00', t);
  const taskEl = pip.locator('[data-testid=mini-timer-task]');
  check('task title shown', (await taskEl.count()) === 1 && (await taskEl.innerText()) === LONG);
  const trunc = await taskEl.evaluate((e) => ({ s: e.scrollWidth, c: e.clientWidth, o: getComputedStyle(e).textOverflow, w: getComputedStyle(e).whiteSpace }));
  check('task title truncated on one line', trunc.s > trunc.c && trunc.o === 'ellipsis' && trunc.w === 'nowrap', JSON.stringify(trunc));
  const progressW = await pip.locator('[data-testid=mini-timer-progress]').evaluate((e) => parseFloat(e.style.width));
  check('progress bar advances', progressW > 0, progressW + '%');
  await pip.screenshot({ path: path.join(SHOTS, 'pip-dark-pomodoro-running-task.png') });

  // Pause / resume from the mini window.
  await pip.click('[data-testid=mini-timer-toggle]');
  await sleep(300);
  check('PiP PAUSE pauses the page timer', (await mainStatus(page)) === 'paused');
  check('control says RESUME', (await pip.locator('[data-testid=mini-timer-toggle]').innerText()) === 'RESUME');
  const p1 = await pipTime(pip); await sleep(1300); const p2 = await pipTime(pip);
  check('paused: time frozen', p1 === p2 && p2 === (await mainTime(page)), `${p1} ${p2}`);
  await pip.screenshot({ path: path.join(SHOTS, 'pip-dark-pomodoro-paused-task.png') });
  await pip.click('[data-testid=mini-timer-toggle]');
  await sleep(300);
  check('PiP RESUME resumes the page timer', (await mainStatus(page)) === 'running');

  // Space in the mini window.
  await pip.bringToFront();
  await pip.locator('[data-testid=mini-timer-time]').click();
  await pip.keyboard.press(' ');
  await sleep(300);
  check('Space in PiP pauses', (await mainStatus(page)) === 'paused');
  await pip.keyboard.press(' ');
  await sleep(300);
  check('Space in PiP resumes', (await mainStatus(page)) === 'running');
  await pip.locator('[data-testid=mini-timer-toggle]').focus();
  await pip.keyboard.press(' ');
  await sleep(300);
  check('Space with the control focused toggles once (paused)', (await mainStatus(page)) === 'paused');
  await pip.keyboard.press(' ');
  await sleep(300);
  check('Space with the control focused toggles once (running)', (await mainStatus(page)) === 'running');

  // Theme follows.
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await sleep(200);
  check('PiP follows theme change to light', (await pip.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'light');
  let bgs;
  for (let i = 0; i < 4; i++) {
    bgs = await Promise.all([page.evaluate(() => getComputedStyle(document.body).backgroundColor), pip.evaluate(() => { const e = document.querySelector('[data-testid=mini-timer]'); const c = getComputedStyle(e); return c.backgroundColor + ' tr=' + c.transitionProperty + '/' + c.transitionDuration; })]);
    console.log('   bg sample', bgs.join(' | '));
    await sleep(400);
  }
  bgs[1] = bgs[1].split(' tr=')[0];
  check('PiP background matches page background (light)', bgs[0] === bgs[1], bgs.join(' vs '));
  await pip.screenshot({ path: path.join(SHOTS, 'pip-light-pomodoro-running-task.png') });
  await page.screenshot({ path: path.join(SHOTS, 'header-light-open.png'), clip: { x: 0, y: 0, width: 1280, height: 80 } });

  // Break colours (mode switch on the page with the keyboard).
  await page.bringToFront();
  await page.keyboard.press('2');
  await sleep(400);
  check('short break colour green', (await pip.locator('[data-testid=mini-timer-progress]').evaluate((e) => getComputedStyle(e).backgroundColor)) === 'rgb(34, 197, 94)');
  check('task hidden during a break (like the page)', (await pip.locator('[data-testid=mini-timer-task]').count()) === 0);
  check('break: time equal', (await mainTime(page)) === (await pipTime(pip)), await pipTime(pip));
  await pip.screenshot({ path: path.join(SHOTS, 'pip-light-shortbreak-idle.png') });
  await pip.click('[data-testid=mini-timer-toggle]');
  await sleep(1300);
  check('break started from PiP', (await mainStatus(page)) === 'running');
  await pip.screenshot({ path: path.join(SHOTS, 'pip-light-shortbreak-running.png') });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await sleep(200);
  check('PiP follows theme change back to dark', (await pip.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'dark');
  await pip.screenshot({ path: path.join(SHOTS, 'pip-dark-shortbreak-running.png') });
  await page.keyboard.press('3');
  await sleep(400);
  check('long break colour blue', (await pip.locator('[data-testid=mini-timer-progress]').evaluate((e) => getComputedStyle(e).backgroundColor)) === 'rgb(59, 130, 246)');
  await pip.screenshot({ path: path.join(SHOTS, 'pip-dark-longbreak-idle.png') });
  await page.keyboard.press('1');
  await sleep(400);

  // Language follows.
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('pomodorian_settings'));
    s.language = 'fr';
    localStorage.setItem('pomodorian_settings', JSON.stringify(s));
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await sleep(300);
  check('reload closed the PiP window', ctx.pages().length === 1, `pages=${ctx.pages().length}`);
  pip = await openPip(ctx, page);
  check('fr: PiP title, lang, control', (await pip.title()) === 'Mini minuteur Pomodorian' && (await pip.evaluate(() => document.documentElement.lang)) === 'fr' && (await pip.locator('[data-testid=mini-timer-toggle]').innerText()) === 'DÉMARRER');
  check('fr: button label', (await btn.getAttribute('aria-label')) === 'Fermer le mini minuteur');

  // Close by the header button.
  await page.click('[data-testid=mini-timer-button]');
  await sleep(400);
  check('header button closes the window', ctx.pages().length === 1 && (await page.evaluate(() => window.documentPictureInPicture.window === null)));
  check('aria-pressed back to false', (await btn.getAttribute('aria-pressed')) === 'false');

  // Close by the window itself (as its close button would).
  pip = await openPip(ctx, page);
  await pip.click('[data-testid=mini-timer-toggle]');
  await sleep(300);
  await pip.evaluate(() => window.close());
  await sleep(500);
  check('closing the window flips the button back', (await btn.getAttribute('aria-pressed')) === 'false' && ctx.pages().length === 1);
  const s1 = await mainTime(page); await sleep(1300); const s2 = await mainTime(page);
  check('page timer keeps running after the window closed', (await mainStatus(page)) === 'running' && s1 !== s2, `${s1} -> ${s2}`);
  // Pause the page for a clean state
  await page.keyboard.press(' ');

  // Cycles.
  for (let i = 0; i < 6; i++) {
    pip = await openPip(ctx, page);
    if (i % 2) await page.click('[data-testid=mini-timer-button]');
    else await pip.close();
    await sleep(300);
  }
  check('6 open/close cycles: one page left, button off', ctx.pages().length === 1 && (await btn.getAttribute('aria-pressed')) === 'false');
  check('no orphan portal in the main document', (await page.locator('[data-testid=mini-timer]').count()) === 0);
  const listenersAfter = await (async () => {
    const cdp = await ctx.newCDPSession(page);
    const { result } = await cdp.send('Runtime.evaluate', { expression: 'window' });
    const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId });
    const { result: d } = await cdp.send('Runtime.evaluate', { expression: 'document.documentElement' });
    const { listeners: l2 } = await cdp.send('DOMDebugger.getEventListeners', { objectId: d.objectId });
    return listeners.length + l2.length;
  })();
  console.log('   listeners on window + <html>: before', listenersBefore, 'after (after a reload)', listenersAfter);
  check('no extra listeners left on the page window', listenersAfter <= listenersBefore);
  // Theme observer released: change the theme, nothing throws, closed window untouched.
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await sleep(200);
  pip = await openPip(ctx, page);
  check('re-open after cycles works and has current theme', (await pip.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'light');
  await page.click('[data-testid=mini-timer-button]');
  await ctx.close();

  // 4. MutationObserver accounting across cycles (instrumented page).
  {
    const ctx2 = await browser.newContext();
    await ctx2.addInitScript(() => {
      if (location.origin !== 'http://localhost:3100') return;
      localStorage.setItem('ga-consent', 'denied');
      localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
      window.__obs = 0;
      const o = MutationObserver.prototype.observe, d = MutationObserver.prototype.disconnect;
      MutationObserver.prototype.observe = function (t, opts) { if (opts && opts.attributeFilter && opts.attributeFilter.includes('data-theme')) { this.__theme = true; window.__obs++; } return o.call(this, t, opts); };
      MutationObserver.prototype.disconnect = function () { if (this.__theme) { this.__theme = false; window.__obs--; } return d.call(this); };
    });
    const p = await ctx2.newPage();
    p.on('pageerror', (e) => errors.push('main2: ' + e.message));
    await p.goto(BASE); await p.waitForLoadState('networkidle');
    const base = await p.evaluate(() => window.__obs);
    for (let i = 0; i < 4; i++) {
      const w = await openPip(ctx2, p);
      if (i % 2) await w.close(); else await p.click('[data-testid=mini-timer-button]');
      await sleep(300);
    }
    const after = await p.evaluate(() => window.__obs);
    check('theme observers released after 4 cycles', after === base, `base=${base} after=${after}`);
    await ctx2.close();
  }

  // 5. Locales and narrow header.
  for (const [lang, expected] of [['fr', 'Ouvrir le mini minuteur'], ['de', 'Mini-Timer öffnen'], ['ja', 'ミニタイマーを開く']]) {
    const { ctx, page } = await setup(browser, { settings: { theme: 'dark', language: lang } });
    await sleep(300);
    const b = page.locator('[data-testid=mini-timer-button]');
    const label = await b.getAttribute('aria-label');
    const title = await b.getAttribute('title');
    check(`${lang}: button aria-label`, label === expected, `${label} / title=${title}`);
    await ctx.close();
  }
  for (const theme of ['dark', 'light']) {
    const { ctx, page } = await setup(browser, { settings: { theme, language: 'en' }, viewport: { width: 360, height: 740 } });
    await sleep(300);
    const m = await page.evaluate(() => {
      const h = document.querySelector('header');
      const b = document.querySelector('[data-testid=mini-timer-button]').getBoundingClientRect();
      return { hs: h.scrollWidth, hc: h.clientWidth, doc: document.documentElement.scrollWidth, right: b.right, top: b.top };
    });
    check(`360px ${theme}: header fits with the button`, m.hs <= m.hc && m.doc <= 360 && m.right <= 360, JSON.stringify(m));
    await page.screenshot({ path: path.join(SHOTS, `header-360-${theme}.png`), clip: { x: 0, y: 0, width: 360, height: 80 } });
    // also with a counter like the "#N" one before the chart button
    const m2 = await page.evaluate(() => {
      const a = document.querySelector('header button[aria-label=Analytics]');
      const s = document.createElement('span');
      s.className = 'text-sm text-muted tabular-nums px-2';
      s.textContent = '#12';
      a.before(s);
      const h = document.querySelector('header');
      const b = document.querySelector('[data-testid=mini-timer-button]').getBoundingClientRect();
      const r = { hs: h.scrollWidth, hc: h.clientWidth, doc: document.documentElement.scrollWidth, right: b.right };
      s.remove();
      return r;
    });
    check(`360px ${theme}: header fits with button and a #12 counter`, m2.hs <= m2.hc && m2.doc <= 360 && m2.right <= 360, JSON.stringify(m2));
    await ctx.close();
  }
  {
    const { ctx, page } = await setup(browser, { settings: { theme: 'light', language: 'en' } });
    await page.screenshot({ path: path.join(SHOTS, 'header-light.png'), clip: { x: 0, y: 0, width: 1280, height: 80 } });
    // light pip, pomodoro idle no task / running no task
    const w = await openPip(ctx, page);
    await w.setViewportSize({ width: 260, height: 180 });
    await w.screenshot({ path: path.join(SHOTS, 'pip-light-pomodoro-idle-notask.png') });
    await w.setViewportSize({ width: 420, height: 260 });
    await w.screenshot({ path: path.join(SHOTS, 'pip-light-resized-420x260.png') });
    await ctx.close();
  }

  check('no uncaught page errors', errors.length === 0, errors.join(' | '));
  console.log(`\n${pass} passed, ${fail} failed`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

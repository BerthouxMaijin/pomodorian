// Focus mode + daily goal checks. Server: PORT=3211 npx next start
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const URL = 'http://localhost:3100/';
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
const results = [];
const pageErrors = [];
function check(name, ok, detail = '') {
  if (ok) pass++; else fail++;
  const line = `${ok ? 'PASS' : 'FAIL'} ${name}${detail && !ok ? ' :: ' + detail : detail && ok ? ' (' + detail + ')' : ''}`;
  results.push(line);
  console.log(line);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// React commit counter (DevTools hook stub) + one-time localStorage seed.
function initScript({ seed, countCommits }) {
  if (countCommits) {
    window.__commits = 0;
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      supportsFiber: true,
      renderers: new Map(),
      inject() { return 1; },
      onCommitFiberRoot() { window.__commits++; },
      onCommitFiberUnmount() {},
      onPostCommitFiberRoot() {},
      onScheduleFiberRoot() {},
      checkDCE() {},
      isDisabled: false,
    };
  }
  if (!localStorage.getItem('__seeded')) {
    localStorage.setItem('__seeded', '1');
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const now = Date.now();
    const s = seed || {};
    localStorage.setItem('ga-consent', s.consent === false ? '' : 'denied');
    if (s.consent === false) localStorage.removeItem('ga-consent');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    if (s.settings) localStorage.setItem('pomodorian_settings', JSON.stringify(s.settings));
    if (s.tasks) localStorage.setItem('pomodorian_tasks', JSON.stringify(s.tasks));
    if (s.todaySessions !== undefined) {
      const list = [];
      for (let i = 0; i < s.todaySessions; i++) {
        list.push({ id: 't' + i, date: today, startedAt: new Date(now - (i + 1) * 3600e3).toISOString(), endedAt: new Date(now - (i + 1) * 3600e3 + 1500e3).toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: null, taskTitle: null, completed: true });
      }
      // Noise that must not count: yesterday's pomodoro, today's break.
      list.push({ id: 'y', date: yesterday, startedAt: new Date(now - 86400e3).toISOString(), endedAt: new Date(now - 86400e3).toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: null, taskTitle: null, completed: true });
      list.push({ id: 'b', date: today, startedAt: new Date(now - 600e3).toISOString(), endedAt: new Date(now - 300e3).toISOString(), durationMinutes: 5, mode: 'shortBreak', taskId: null, taskTitle: null, completed: true });
      localStorage.setItem('pomodorian_sessions', JSON.stringify(list));
    }
    if (s.timer) {
      const t = s.timer;
      const total = t.totalTime ?? 1500;
      localStorage.setItem('pomodorian_current_state', JSON.stringify({
        mode: t.mode, status: t.status, timeRemaining: t.remaining ?? total, totalTime: total,
        pomodorosCompleted: t.done ?? 0,
        endTime: t.status === 'running' ? now + (t.remaining ?? total) * 1000 : null,
        savedAt: now,
      }));
    }
  }
}

async function open(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 390, height: 844 },
    locale: opts.locale || 'en-US',
    colorScheme: opts.theme || 'dark',
    reducedMotion: opts.reducedMotion || 'no-preference',
  });
  await ctx.addInitScript(initScript, { seed: opts.seed, countCommits: !!opts.countCommits });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => pageErrors.push(`${opts.label || ''}: ${e.message}`));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.mouse.move(5, 400);
  return { ctx, page };
}

const RUNNING = { mode: 'pomodoro', status: 'running' };
const attr = (page) => page.evaluate(() => document.documentElement.getAttribute('data-focus-mode'));

// Effective opacity: product of the opacities up the ancestor chain.
async function opacities(page) {
  return page.evaluate(() => {
    const eff = (el) => {
      let o = 1;
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
      return Math.round(o * 100) / 100;
    };
    const q = (s) => document.querySelector(s);
    const faded = {
      header: q('header'),
      modes: q('main [role="group"]'),
      sounds: q('main > [data-focus-fade]:not([role])'),
      tasks: q('main > div > [data-focus-fade]'),
      info: q('section[data-focus-fade]'),
      footer: q('footer'),
      pill: q('button.fixed.bottom-4'),
    };
    const protectedEls = {
      timerRing: q('[data-focus-anchor] svg'),
      controls: q('[data-focus-anchor] + div button'),
      taskLine: [...document.querySelectorAll('main > div')].find((d) => /^#\d/.test(d.textContent.trim())),
      undo: q('[data-testid="undo-banner"]'),
      modal: q('[role="dialog"]'),
      consent: q('.consent-banner'),
    };
    const out = { faded: {}, protected: {} };
    for (const [k, el] of Object.entries(faded)) out.faded[k] = el ? eff(el) : null;
    for (const [k, el] of Object.entries(protectedEls)) out.protected[k] = el ? eff(el) : null;
    out.fadeCount = document.querySelectorAll('[data-focus-fade]').length;
    return out;
  });
}
const allFaded = (o) => Object.entries(o.faded).every(([, v]) => v !== null && v <= 0.26);
const allFull = (o) => Object.entries(o.faded).every(([, v]) => v === null || v >= 0.99);
const protectedFull = (o) => Object.entries(o.protected).every(([, v]) => v === null || v >= 0.99);

(async () => {
  const browser = await chromium.launch();

  // ---------- 1. Fade after idle on a running pomodoro ----------
  {
    const { ctx, page } = await open(browser, { seed: { timer: RUNNING, tasks: [{ id: 'a', title: 'Write the report', estimatedPomodoros: 2, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 }] }, label: 'fade' });
    check('running pomodoro: <html data-focus-mode="armed"> right away', (await attr(page)) === 'armed', String(await attr(page)));
    await sleep(2500);
    check('still armed (not faded) after 2.5s idle', (await attr(page)) === 'armed');
    await page.screenshot({ path: `${SHOTS}/390-dark-restored.png` });
    await sleep(3200);
    check('dim after ~4s idle', (await attr(page)) === 'dim');
    const o = await opacities(page);
    check('7 areas marked data-focus-fade', o.fadeCount === 7, String(o.fadeCount));
    check('header, modes, sounds, tasks, info, footer, pill faded to 0.25', allFaded(o), JSON.stringify(o.faded));
    check('timer ring, controls, task line stay at 1', o.protected.timerRing === 1 && o.protected.controls === 1 && o.protected.taskLine === 1, JSON.stringify(o.protected));
    await page.screenshot({ path: `${SHOTS}/390-dark-faded.png` });
    await page.screenshot({ path: `${SHOTS}/390-dark-faded-full.png`, fullPage: true });

    // Still clickable / accessible while faded
    const a11y = await page.evaluate(() => ({
      inert: document.querySelectorAll('[inert]').length,
      hidden: [...document.querySelectorAll('[data-focus-fade]')].some((e) => e.closest('[aria-hidden="true"]')),
      pe: [...document.querySelectorAll('[data-focus-fade]')].some((e) => getComputedStyle(e).pointerEvents === 'none'),
    }));
    check('no inert, no aria-hidden, no pointer-events:none on faded areas', a11y.inert === 0 && !a11y.hidden && !a11y.pe, JSON.stringify(a11y));

    // Pointer move restores at once
    await page.mouse.move(200, 300);
    check('pointer move: attribute back to armed immediately', (await attr(page)) === 'armed');
    await sleep(350);
    let o2 = await opacities(page);
    check('pointer move: all areas back to full opacity within 350ms', allFull(o2), JSON.stringify(o2.faded));

    // Key press restores
    await sleep(5600);
    check('dim again after idle', (await attr(page)) === 'dim');
    await page.keyboard.press('Shift');
    check('key press: restored immediately', (await attr(page)) === 'armed');
    await sleep(350);
    o2 = await opacities(page);
    check('key press: full opacity within 350ms', allFull(o2));

    // Tab into the task list
    await sleep(5600);
    check('dim again (before Tab)', (await attr(page)) === 'dim');
    // Programmatic focus (no key event) on a task list control: focusin alone restores.
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('main [data-focus-fade] button')].find((b) => /Add Task|Plan with AI/.test(b.textContent));
      t.focus();
    });
    check('focus entering the task list (no key event): restored', (await attr(page)) === 'armed');
    await page.evaluate(() => document.activeElement.blur());
    await sleep(5600);
    check('dim again (before keyboard Tab)', (await attr(page)) === 'dim');
    let reached = false;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const inTasks = await page.evaluate(() => {
        const a = document.activeElement;
        return !!a && !!a.closest('main [data-focus-fade]') && /Add Task|Plan with AI|Write the report|Today|Previous day/.test((a.textContent || '') + (a.getAttribute('aria-label') || ''));
      });
      if (inTasks) { reached = true; break; }
    }
    check('keyboard Tab reaches the task list while focus mode is on', reached);
    check('Tab into task list: restored', (await attr(page)) === 'armed');
    await sleep(350);
    o2 = await opacities(page);
    check('Tab: full opacity', allFull(o2));

    // Text field focused: nothing fades while typing a task
    await page.evaluate(() => document.activeElement.blur());
    const addBtn = page.locator('main button', { hasText: 'Add Task' }).first();
    await addBtn.click();
    const input = page.locator('main input[type="text"], main input:not([type])').first();
    const hasInput = await input.count();
    if (hasInput) {
      await input.focus();
      await page.keyboard.type('New task');
      await sleep(5800);
      check('text field focused: no fade while composing a task', (await attr(page)) === 'armed');
      await page.keyboard.press('Escape');
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
    } else check('task input found', false);

    // Modal open while faded: modal stays at 1
    await page.keyboard.press('s');
    await page.waitForSelector('[role="dialog"]');
    await sleep(5800);
    const o3 = await opacities(page);
    check('settings modal open: page behind fades, modal itself stays at 1', (await attr(page)) === 'dim' && o3.protected.modal === 1, `${await attr(page)} ${o3.protected.modal}`);
    await page.keyboard.press('Escape');

    // Scrolled down to the info section: no fade
    await page.evaluate(() => document.querySelector('section[data-focus-fade]').scrollIntoView());
    await sleep(6000);
    const o4 = await opacities(page);
    check('scrolled to the info section: nothing fades', (await attr(page)) === 'armed' && allFull(o4), `${await attr(page)} ${JSON.stringify(o4.faded)}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(5800);
    check('back to the top: fades again', (await attr(page)) === 'dim');

    // Pause: no fade
    await page.keyboard.press('Space');
    await sleep(300);
    check('pause: attribute removed', (await attr(page)) === null);
    await sleep(5000);
    o2 = await opacities(page);
    check('paused: nothing fades after idle', (await attr(page)) === null && allFull(o2));
    await page.keyboard.press('Space');
    await sleep(300);
    check('resume: armed again', (await attr(page)) === 'armed');
    await ctx.close();
  }

  // ---------- 2. Idle, break, consent banner, reduced motion ----------
  {
    const { ctx, page } = await open(browser, { label: 'idle' });
    await sleep(5000);
    check('idle (fresh profile): no focus attribute, nothing fades', (await attr(page)) === null && allFull(await opacities(page)));
    await ctx.close();
  }
  {
    const { ctx, page } = await open(browser, { seed: { timer: { mode: 'shortBreak', status: 'running', totalTime: 300 } }, label: 'break' });
    await sleep(5000);
    check('running short break: nothing fades', (await attr(page)) === null && allFull(await opacities(page)));
    await ctx.close();
  }
  {
    const { ctx, page } = await open(browser, { seed: { timer: { mode: 'longBreak', status: 'running', totalTime: 900 }, settings: { neverDumbAutoOpen: false } }, label: 'longbreak' });
    await sleep(5000);
    check('running long break: nothing fades', (await attr(page)) === null);
    await ctx.close();
  }
  {
    const { ctx, page } = await open(browser, { seed: { timer: RUNNING, consent: false }, label: 'consent' });
    const hasBanner = await page.locator('.consent-banner').count();
    await sleep(5800);
    const o = await opacities(page);
    check('consent banner shown and stays at 1 while the rest fades', hasBanner > 0 && (await attr(page)) === 'dim' && o.protected.consent === 1, `${hasBanner} ${o.protected.consent}`);
    await ctx.close();
  }
  {
    const { ctx, page } = await open(browser, { seed: { timer: RUNNING }, reducedMotion: 'reduce', label: 'reduced' });
    await sleep(4500);
    const tr = await page.evaluate(() => getComputedStyle(document.querySelector('header')).transitionDuration);
    const o = await opacities(page);
    check('reduced motion: faded with no transition', (await attr(page)) === 'dim' && o.faded.header <= 0.26 && /^0s|0\.00001s|1e-05s/.test(tr), tr);
    await ctx.close();
  }
  {
    // Undo banner lives outside every faded area
    const { ctx, page } = await open(browser, { seed: { timer: { mode: 'pomodoro', status: 'paused', remaining: 1300, totalTime: 1500 } }, label: 'undo' });
    await page.locator('main button[aria-label="Reset timer"]').click();
    await page.waitForSelector('[data-testid="undo-banner"]');
    await sleep(800);
    const inside = await page.evaluate(() => !!document.querySelector('[data-testid="undo-banner"]').closest('[data-focus-fade]'));
    const o = await opacities(page);
    check('undo banner is outside the faded areas, at full opacity', !inside && o.protected.undo === 1, `${inside} ${o.protected.undo}`);
    await ctx.close();
  }

  // ---------- 3. Toggle off disables it, survives reload ----------
  {
    const { ctx, page } = await open(browser, { seed: { timer: RUNNING }, label: 'toggle' });
    await page.keyboard.press('s');
    const toggle = page.locator('[role="dialog"] button[aria-label="Fade distractions during a Pomodoro"]');
    check('settings: focus mode toggle in Display, on by default', (await toggle.getAttribute('aria-pressed')) === 'true');
    const inDisplay = await page.evaluate(() => {
      const t = document.querySelector('[role="dialog"] button[aria-label="Fade distractions during a Pomodoro"]');
      return t.closest('section').querySelector('h3').textContent;
    });
    check('toggle sits in the Display section', inDisplay === 'Display', inDisplay);
    await toggle.click();
    check('toggle off: aria-pressed false', (await toggle.getAttribute('aria-pressed')) === 'false');
    await page.keyboard.press('Escape');
    check('toggle off: attribute removed at once', (await attr(page)) === null);
    await sleep(5000);
    check('toggle off: nothing fades', (await attr(page)) === null && allFull(await opacities(page)));
    await page.reload({ waitUntil: 'networkidle' });
    await sleep(5000);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')).focusMode);
    check('toggle off survives a reload', stored === false && (await attr(page)) === null);
    await ctx.close();
  }

  // ---------- 4. No extra React work ----------
  {
    const measure = async (focusMode) => {
      const { ctx, page } = await open(browser, { seed: { timer: RUNNING, settings: { focusMode } }, countCommits: true, label: 'commits' });
      await sleep(1000);
      const c0 = await page.evaluate(() => window.__commits);
      const t0 = Date.now();
      await sleep(6000); // crosses the idle delay: dim happens in here
      for (let i = 0; i < 60; i++) { await page.mouse.move(100 + i * 3, 300 + (i % 7)); await sleep(30); } // ~2s of pointer moves
      await sleep(500);
      const c1 = await page.evaluate(() => window.__commits);
      const secs = (Date.now() - t0) / 1000;
      const a = await attr(page);
      await ctx.close();
      return { commits: c1 - c0, secs: Math.round(secs * 10) / 10, attr: a };
    };
    const on = await measure(true);
    const off = await measure(false);
    check('commit counter works (hook stub saw commits)', on.commits > 0 && off.commits > 0, JSON.stringify({ on, off }));
    check('focus mode on vs off: same number of React commits over ~9s incl. the fade and 2s of pointer moves (no extra work beyond the tick)', Math.abs(on.commits - off.commits) <= 2, JSON.stringify({ on, off }));
  }

  // ---------- 5. Daily goal chip ----------
  {
    const { ctx, page } = await open(browser, { label: 'goal-fresh' });
    const chip = page.locator('[data-testid="daily-goal"]');
    check('fresh profile: chip shows 0/8', (await chip.innerText()).trim() === '0/8', await chip.innerText());
    check('chip aria-label "0 of 8 Pomodoros today"', (await chip.getAttribute('aria-label')) === '0 of 8 Pomodoros today', await chip.getAttribute('aria-label'));
    const box = await chip.boundingBox();
    check('chip touch target at least 40x40', box.width >= 40 && box.height >= 40, `${box.width}x${box.height}`);
    check('old "#N" counter gone from the header', !(/#\d/.test(await page.locator('header').innerText())));
    await page.screenshot({ path: `${SHOTS}/chip-0-dark.png`, clip: { x: 0, y: 0, width: 390, height: 70 } });
    const html = await (await page.request.get(URL)).text();
    check('chip not in the prerendered HTML (shown after hydration)', !html.includes('daily-goal'));
    await ctx.close();
  }
  {
    const { ctx, page } = await open(browser, { seed: { todaySessions: 3, timer: { mode: 'pomodoro', status: 'running', remaining: 3, totalTime: 1500 } }, label: 'goal-mid' });
    const chip = page.locator('[data-testid="daily-goal"]');
    check('3 sessions today (+ yesterday + a break): chip 3/8', (await chip.innerText()).trim() === '3/8', await chip.innerText());
    await page.screenshot({ path: `${SHOTS}/chip-3-dark.png`, clip: { x: 0, y: 0, width: 390, height: 70 } });
    await page.waitForFunction(() => document.querySelector('[data-testid="daily-goal"]').textContent.trim() === '4/8', null, { timeout: 8000 }).catch(() => {});
    check('pomodoro completes: chip increments to 4/8', (await chip.innerText()).trim() === '4/8', await chip.innerText());
    check('not reached yet: muted colour, no data-reached', (await chip.getAttribute('data-reached')) === null);
    // Goal changed in Settings
    await page.keyboard.press('s');
    const field = page.locator('[role="dialog"] input[aria-label="Daily goal (Pomodoros)"]');
    const pos = await page.evaluate(() => {
      const f = document.querySelector('[role="dialog"] input[aria-label="Daily goal (Pomodoros)"]');
      const row = f.closest('div');
      const prev = row.previousElementSibling;
      return { section: f.closest('section').querySelector('h3').textContent, prevLabel: prev && prev.querySelector('input') && prev.querySelector('input').getAttribute('aria-label') };
    });
    check('daily goal row in the Timer section, right under Long Break interval', /Timer/.test(pos.section) && pos.prevLabel === 'Long Break interval', JSON.stringify(pos));
    check('daily goal field min 1 max 24, value 8', (await field.getAttribute('min')) === '1' && (await field.getAttribute('max')) === '24' && (await field.inputValue()) === '8');
    await field.fill('30');
    await field.fill('4');
    await page.keyboard.press('Escape');
    await page.mouse.move(5, 600);
    await sleep(500);
    const reachedColor = await chip.evaluate((e) => getComputedStyle(e).color);
    check('goal set to 4 in Settings: chip follows (4/4)', (await chip.innerText()).trim() === '4/4', await chip.innerText());
    check('goal reached: data-reached + emerald colour', (await chip.getAttribute('data-reached')) === 'true' && /52, 211, 153|oklch\(0\.765 0\.177 163|oklch\(76\.5|lab\(75\.0/.test(reachedColor), reachedColor);
    check('goal reached: aria-label says so', (await chip.getAttribute('aria-label')) === 'Daily goal reached: 4 of 4 Pomodoros today', await chip.getAttribute('aria-label'));
    await page.screenshot({ path: `${SHOTS}/chip-goal-dark.png`, clip: { x: 0, y: 0, width: 390, height: 70 } });
    await page.reload({ waitUntil: 'networkidle' });
    check('goal and count survive a reload (4/4)', (await chip.innerText()).trim() === '4/4', await chip.innerText());
    await chip.click();
    const dlg = page.locator('[role="dialog"][aria-label="Report"]');
    check('chip click opens the report', await dlg.isVisible());
    await ctx.close();
  }
  {
    // Out-of-range stored goal is clamped; light-theme colours
    const { ctx, page } = await open(browser, { theme: 'light', seed: { todaySessions: 8, settings: { dailyGoal: 8 } }, label: 'goal-light' });
    const chip = page.locator('[data-testid="daily-goal"]');
    const c = await chip.evaluate((e) => getComputedStyle(e).color);
    check('light theme, goal reached: darker emerald (emerald-700)', (await chip.innerText()).trim() === '8/8' && /4, 120, 87|oklch\(0\.508 0\.118 165|lab\(44\.4/.test(c), c);
    await page.screenshot({ path: `${SHOTS}/chip-goal-light.png`, clip: { x: 0, y: 0, width: 390, height: 70 } });
    await page.evaluate(() => { localStorage.setItem('pomodorian_settings', JSON.stringify({ dailyGoal: 99 })); });
    await page.reload({ waitUntil: 'networkidle' });
    check('stored goal 99 is clamped to 24', (await chip.innerText()).trim() === '8/24', await chip.innerText());
    await ctx.close();
  }
  {
    const { ctx, page } = await open(browser, { theme: 'light', seed: { todaySessions: 3 }, label: 'goal-light-mid' });
    await page.screenshot({ path: `${SHOTS}/chip-3-light.png`, clip: { x: 0, y: 0, width: 390, height: 70 } });
    await ctx.close();
  }

  // ---------- 6. Locales at 320px ----------
  const LOC = {
    fr: { locale: 'fr-FR', label: "Aujourd'hui : 2 pomodoros sur 8", toggle: 'Estomper les distractions pendant un pomodoro', goal: 'Objectif du jour (pomodoros)' },
    de: { locale: 'de-DE', label: 'Heute: 2 von 8 Pomodoros', toggle: 'Ablenkungen während eines Pomodoros dimmen', goal: 'Tagesziel (Pomodoros)' },
    ja: { locale: 'ja-JP', label: '今日のポモドーロ：8個中2個', toggle: 'ポモドーロ中は周りを目立たなくする', goal: '1日の目標（ポモドーロ数）' },
    es: { locale: 'es-ES', label: 'Hoy: 2 de 8 pomodoros' },
    pt: { locale: 'pt-BR', label: 'Hoje: 2 de 8 pomodoros' },
    it: { locale: 'it-IT', label: 'Oggi: 2 pomodori su 8' },
    zh: { locale: 'zh-CN', label: '今日番茄钟：已完成 2 个，目标 8 个' },
    en: { locale: 'en-US', label: '2 of 8 Pomodoros today' },
  };
  for (const [code, L] of Object.entries(LOC)) {
    for (const theme of code === 'fr' ? ['dark', 'light'] : ['dark']) {
      const { ctx, page } = await open(browser, { viewport: { width: 320, height: 640 }, locale: L.locale, theme, seed: { todaySessions: 2, timer: RUNNING }, label: code });
      const chip = page.locator('[data-testid="daily-goal"]');
      await page.waitForFunction(() => !document.documentElement.hasAttribute('data-i18n-pending'), null, { timeout: 6000 }).catch(() => {});
      const lab = await chip.getAttribute('aria-label');
      const fit = await page.evaluate(() => {
        const h = document.querySelector('header');
        const r = [...h.querySelectorAll('*')].reduce((m, e) => Math.max(m, e.getBoundingClientRect().right), 0);
        return { scroll: document.documentElement.scrollWidth, headerRight: Math.round(r), headerScroll: h.scrollWidth, headerClient: h.clientWidth };
      });
      check(`${code} ${theme} 320px: chip label "${L.label}"`, lab === L.label, lab);
      check(`${code} ${theme} 320px: header fits, no horizontal scroll`, fit.scroll <= 320 && fit.headerRight <= 320 && fit.headerScroll <= fit.headerClient, JSON.stringify(fit));
      if (L.toggle) {
        await page.screenshot({ path: `${SHOTS}/320-${code}-${theme}-restored.png` });
        await sleep(5800);
        const o = await opacities(page);
        check(`${code} ${theme} 320px: fades after idle, timer kept`, (await attr(page)) === 'dim' && allFaded(o) && protectedFull(o), JSON.stringify(o));
        await page.screenshot({ path: `${SHOTS}/320-${code}-${theme}-faded.png` });
        await page.keyboard.press('s');
        const tg = page.locator(`[role="dialog"] button[aria-label="${L.toggle}"]`);
        const gf = page.locator(`[role="dialog"] input[aria-label="${L.goal}"]`);
        const dfit = await page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); return { sw: d.scrollWidth, cw: d.clientWidth }; });
        check(`${code} ${theme} 320px: settings shows the toggle and the goal field, no overflow`, (await tg.count()) === 1 && (await gf.count()) === 1 && dfit.sw <= dfit.cw, JSON.stringify(dfit));
        const tb = await tg.boundingBox();
        check(`${code} 320px: toggle on screen`, tb && tb.x + tb.width <= 320);
        await gf.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${SHOTS}/320-${code}-${theme}-settings-goal.png` });
        await tg.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${SHOTS}/320-${code}-${theme}-settings-toggle.png` });
      }
      await ctx.close();
    }
  }

  // ---------- 7. Extra screenshots ----------
  for (const [w, h, name] of [[1280, 800, 'desktop'], [390, 844, '390'], [320, 640, '320']]) {
    for (const theme of ['dark', 'light']) {
      if (name === '390' && theme === 'dark') continue; // taken in section 1
      const { ctx, page } = await open(browser, { viewport: { width: w, height: h }, theme, seed: { todaySessions: 5, timer: RUNNING }, label: 'shots' });
      await page.screenshot({ path: `${SHOTS}/${name}-${theme}-restored.png` });
      await sleep(5800);
      await page.screenshot({ path: `${SHOTS}/${name}-${theme}-faded.png` });
      await ctx.close();
    }
  }

  check('no uncaught page errors', pageErrors.length === 0, pageErrors.join(' | '));
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  fs.writeFileSync(path.join(__dirname, 'focus-results.txt'), results.join('\n') + `\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

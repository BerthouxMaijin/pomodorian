const { chromium, devices } = require('playwright');
const out = __dirname + '/shots/';
const results = [];
const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`); };
const time = (page) => page.locator('[role=timer] span').first().innerText();
const secs = (t) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
const TASKS = [
  { id: 'a1', title: 'Write the Q4 investor update', estimatedPomodoros: 3, completedPomodoros: 1, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 },
  { id: 'a2', title: 'Review pull requests', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: true, order: 1 },
];
(async () => {
  const browser = await chromium.launch();

  // ---------- 1. Reload mid-pomodoro ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:3100/');
    await page.evaluate((t) => { localStorage.setItem('ga-consent', 'denied'); localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true'); localStorage.setItem('pomodorian_tasks', JSON.stringify(t)); }, TASKS);
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByText('Review pull requests').first().click();   // link 2nd task
    await page.getByRole('button', { name: /^START$/ }).click();
    await page.waitForTimeout(3200);
    const workers = page.workers().map(w => w.url());
    check('countdown beats come from the worker', workers.some(u => u.endsWith('/timer-worker.js')), workers.join(','));
    const before = secs(await time(page));
    check('timer counts down', before <= 1497 && before >= 1495, String(before));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const after = secs(await time(page));
    check('reload: still running, time continued', after < before && after > before - 6, `${before} -> ${after}`);
    check('reload: PAUSE shown (running)', await page.getByRole('button', { name: /^PAUSE$/ }).isVisible());
    const linked = await page.locator('main').getByText('Review pull requests').first().isVisible();
    const label = await page.locator('main > div.text-sm').first().innerText().catch(() => '');
    check('reload: active task kept', /Review pull requests/.test(label), label.replace(/\n/g, ' '));

    // pause then reload
    await page.getByRole('button', { name: /^PAUSE$/ }).click();
    const paused = secs(await time(page));
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const pausedAfter = secs(await time(page));
    check('reload while paused: same time, RESUME shown', pausedAfter === paused && await page.getByRole('button', { name: /^RESUME$/ }).isVisible(), `${paused} -> ${pausedAfter}`);

    // reset still works
    await page.getByRole('button', { name: 'Reset timer' }).click();
    check('reset returns to 25:00', (await time(page)) === '25:00');

    // skip: pomodoro -> short break
    await page.getByRole('button', { name: /^START$/ }).click();
    await page.getByRole('button', { name: 'Skip to break' }).click();
    const pressed = await page.getByRole('button', { name: 'Short Break' }).getAttribute('aria-pressed');
    const sessions0 = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_sessions') || '[]').length);
    check('skip moves to short break, nothing recorded', pressed === 'true' && (await time(page)) === '05:00' && sessions0 === 0, `pressed=${pressed} sessions=${sessions0}`);
    await page.getByRole('button', { name: /^START$/ }).click();
    await page.getByRole('button', { name: 'Skip break' }).click();
    check('skip break returns to pomodoro', (await page.getByRole('button', { name: 'Pomodoro', exact: true }).getAttribute('aria-pressed')) === 'true');

    // ---------- 2. Timer ended while the page was closed ----------
    await page.evaluate(() => {
      const now = Date.now();
      localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 1500, totalTime: 1500, pomodorosCompleted: 0, endTime: now - 5 * 60 * 1000, savedAt: now - 30 * 60 * 1000 }));
      localStorage.setItem('pomodorian_active_task', JSON.stringify('a2'));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const st = await page.evaluate(() => ({
      sessions: JSON.parse(localStorage.getItem('pomodorian_sessions') || '[]'),
      tasks: JSON.parse(localStorage.getItem('pomodorian_tasks') || '[]'),
      snap: JSON.parse(localStorage.getItem('pomodorian_current_state')),
    }));
    const s = st.sessions[st.sessions.length - 1];
    check('ended while away: session recorded on the linked task', st.sessions.length === 1 && s && s.taskId === 'a2' && s.mode === 'pomodoro', JSON.stringify(s && { taskId: s.taskId, min: s.durationMinutes }));
    check('ended while away: task pomodoro count +1', st.tasks.find(t => t.id === 'a2').completedPomodoros === 1);
    check('ended while away: now on short break, idle, count 1', st.snap.mode === 'shortBreak' && st.snap.status === 'idle' && st.snap.pomodorosCompleted === 1, JSON.stringify(st.snap));

    // stale snapshot (ended 3h ago) is dropped
    await page.evaluate(() => {
      const now = Date.now();
      localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 1500, totalTime: 1500, pomodorosCompleted: 2, endTime: now - 3 * 3600 * 1000, savedAt: now - 4 * 3600 * 1000 }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const n2 = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_sessions') || '[]').length);
    check('ended 3h ago: not credited, idle at 25:00', n2 === 1 && (await time(page)) === '25:00' && await page.getByRole('button', { name: /^START$/ }).isVisible(), `sessions=${n2}`);

    // corrupt snapshot does not break the page
    await page.evaluate(() => localStorage.setItem('pomodorian_current_state', '{"mode":"nope"'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    check('corrupt snapshot ignored', (await time(page)) === '25:00');

    // ---------- 3. Natural completion (1-minute pomodoro shortened via snapshot) ----------
    await page.evaluate(() => {
      const now = Date.now();
      localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 3, totalTime: 1500, pomodorosCompleted: 0, endTime: now + 3000, savedAt: now }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(4500);
    const n3 = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_sessions') || '[]').length);
    check('live completion: session recorded and break offered', n3 === 2 && (await page.getByRole('button', { name: 'Short Break' }).getAttribute('aria-pressed')) === 'true' && (await time(page)) === '05:00', `sessions=${n3}`);

    // ---------- 4. Settings number field ----------
    await page.getByRole('button', { name: 'Pomodoro', exact: true }).click();
    await page.getByRole('button', { name: 'Settings' }).click();
    const field = page.getByRole('dialog').getByRole('spinbutton').first();
    await field.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    const empty = await field.inputValue();
    await page.keyboard.type('50');
    const typed = await field.inputValue();
    await page.keyboard.press('Escape');
    check('settings: field can be cleared then typed (50)', empty === '' && typed === '50' && (await time(page)) === '50:00', `empty="${empty}" typed="${typed}" timer=${await time(page)}`);

    // shortcuts with modifier do nothing
    await page.waitForTimeout(100);
    await page.keyboard.press('Control+2');
    check('Ctrl+2 does not switch mode', (await page.getByRole('button', { name: 'Pomodoro', exact: true }).getAttribute('aria-pressed')) === 'true');
    await page.keyboard.press('2');
    await page.waitForTimeout(100);
    check('plain 2 still switches to short break', (await page.getByRole('button', { name: 'Short Break' }).getAttribute('aria-pressed')) === 'true');
    // lazy modals open
    await page.keyboard.press('r');
    check('report opens ', await page.getByRole('dialog', { name: 'Report' }).isVisible());
    await page.keyboard.press('Escape');
    await page.keyboard.press('?');
    check('shortcuts open ', await page.getByRole('dialog', { name: 'Keyboard shortcuts' }).isVisible());
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: /Plan with AI/ }).click();
    await page.waitForTimeout(400);
    check('AI planner opens ', await page.locator('textarea').first().isVisible());
    check('no uncaught page errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // ---------- 5. Mobile: first visit with consent banner, tap targets, widths ----------
  for (const [label, vp] of [['iphone13', devices['iPhone 13']], ['se-375x553', { viewport: { width: 375, height: 553 }, isMobile: true, hasTouch: true }], ['small-320', { viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true }]]) {
    const ctx = await browser.newContext({ ...vp, deviceScaleFactor: 1, locale: 'fr-FR' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const start = await page.getByRole('button', { name: /^(START|DÉMARRER)$/ }).boundingBox(); // fr-FR context: the app is now in French
    const banner = await page.locator('.consent-banner').boundingBox();
    const clear = banner && (start.y + start.height <= banner.y || banner.y + banner.height <= start.y);
    check(`${label}: START not covered by the consent banner (FR copy)`, clear, `start ${Math.round(start.y)}-${Math.round(start.y + start.height)} banner ${banner && Math.round(banner.y)}-${banner && Math.round(banner.y + banner.height)}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    check(`${label}: no horizontal overflow`, !overflow);
    await page.screenshot({ path: `${out}after-${label}-firstvisit.png` });
    await page.getByRole('button', { name: /Refuser|Decline/ }).click();
    await page.evaluate((t) => localStorage.setItem('pomodorian_tasks', JSON.stringify(t)), TASKS);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const small = await page.evaluate(() => {
      const res = [];
      for (const el of document.querySelectorAll('main button, header button, body > button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // include the invisible ::before hit area
        const b = getComputedStyle(el, '::before');
        let w = r.width, h = r.height;
        if (b.content !== 'none' && b.position === 'absolute') { w = parseFloat(b.width) || w; h = parseFloat(b.height) || h; }
        if (w < 36 || h < 36) res.push(`${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24)}: ${Math.round(w)}x${Math.round(h)}`);
      }
      return res;
    });
    check(`${label}: no control under 36x40 except the drag handle`, small.filter(x => !x.startsWith('Reorder') && !x.startsWith('Déplacer')).length === 0, small.join('; '));
    const del = page.getByRole('button', { name: /^(Edit|Modifier) / }).first();
    const op = await del.evaluate(el => getComputedStyle(el).opacity);
    check(`${label}: edit pencil visible on touch`, Number(op) > 0, `opacity=${op}`);
    const fs = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Add Task|Ajouter une tâche/.test(x.textContent)); b.click(); return new Promise(r => setTimeout(() => r(getComputedStyle(document.querySelector('main input')).fontSize), 100)); });
    check(`${label}: task input is 16px (no iOS zoom)`, fs === '16px', fs);
    await page.screenshot({ path: `${out}after-${label}-home.png` });
    await ctx.close();
  }

  // ---------- 6. Light theme before hydration (app JS blocked) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(() => { localStorage.setItem('ga-consent', 'denied'); localStorage.setItem('pomodorian_settings', JSON.stringify({ theme: 'light' })); });
    const page = await ctx.newPage();
    await page.route('**/_next/static/chunks/**/*.js', r => r.abort()); await page.route('**/_next/static/chunks/*.js', r => r.abort());
    await page.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
    const pre = await page.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme'), bg: getComputedStyle(document.body).backgroundColor }));
    check('light theme applied before React loads', pre.theme === 'light' && pre.bg === 'rgb(248, 249, 250)', JSON.stringify(pre));
    await ctx.close();
  }
  console.log(results.join('\n'));
  await browser.close();
})();

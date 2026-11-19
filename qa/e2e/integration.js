// Checks that only make sense once the four features live together.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'http://localhost:3100';
const results = [];
const check = (n, ok, d = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  [' + d + ']' : ''}`);
(async () => {
  const browser = await chromium.launch();
  // 1. Header never overflows, with the goal at its widest and the mini timer button where it is allowed.
  for (const w of [320, 360, 399, 400, 430, 1280]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
    await ctx.addInitScript(() => {
      localStorage.setItem('ga-consent', 'denied');
      localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('pomodorian_settings', JSON.stringify({ dailyGoal: 24 }));
      localStorage.setItem('pomodorian_sessions', JSON.stringify(Array.from({ length: 12 }, (_, i) => ({ id: 's' + i, date: today, startedAt: new Date().toISOString(), endedAt: new Date().toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: null, taskTitle: null, completed: true }))));
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const chip = document.querySelector('[data-testid=daily-goal]');
      const mini = document.querySelector('[data-testid=mini-timer-button]');
      const name = [...document.querySelectorAll('header span')].find(s => s.textContent.trim() === 'Pomodorian');
      const nb = name.getBoundingClientRect(), cb = chip.getBoundingClientRect();
      return { overflow: document.documentElement.scrollWidth > window.innerWidth, chip: chip.textContent.trim(), miniVisible: !!mini && getComputedStyle(mini).display !== 'none', gap: Math.round(cb.left - nb.right) };
    });
    check(`header at ${w}px: no overflow, name and goal do not touch`, !r.overflow && r.gap >= 0 && r.chip === '12/24' && r.miniVisible === (w >= 400), JSON.stringify(r));
    if (w === 400 || w === 320) await page.screenshot({ path: `shots/cross-header-${w}.png`, clip: { x: 0, y: 0, width: w, height: 80 } });
    await ctx.close();
  }
  // 2. Backup round trip keeps the three new settings.
  {
    const seed = { dailyGoal: 6, focusMode: false, pauseAmbientsOnBreak: true, language: 'fr', theme: 'light' };
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    await ctx.addInitScript((seed) => { localStorage.setItem('ga-consent', 'denied'); localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true'); if (!localStorage.getItem('seeded')) { localStorage.setItem('pomodorian_settings', JSON.stringify(seed)); localStorage.setItem('seeded', '1'); } }, seed);
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Réglages' }).click();
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('dialog').getByRole('button', { name: /Exporter/ }).click()]);
    const file = __dirname + '/cross-backup.json';
    await dl.saveAs(file);
    const exported = JSON.parse(fs.readFileSync(file, 'utf8'));
    check('export holds the new settings', exported.data.settings.dailyGoal === 6 && exported.data.settings.focusMode === false && exported.data.settings.pauseAmbientsOnBreak === true, JSON.stringify(exported.data.settings));
    await ctx.close();
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'fr-FR' });
    await ctx2.addInitScript(() => { localStorage.setItem('ga-consent', 'denied'); localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true'); });
    const p2 = await ctx2.newPage();
    const errors = []; p2.on('pageerror', e => errors.push(e.message));
    await p2.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p2.getByRole('button', { name: 'Réglages' }).click();
    await p2.getByRole('dialog').locator('input[type=file]').setInputFiles(file);
    await p2.getByRole('dialog').getByRole('button', { name: /^Remplacer/ }).click();
    await p2.waitForLoadState('networkidle');
    await p2.waitForTimeout(800);
    const got = await p2.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')));
    check('import restores the new settings', got.dailyGoal === 6 && got.focusMode === false && got.pauseAmbientsOnBreak === true, JSON.stringify(got));
    const chip = await p2.locator('[data-testid=daily-goal]').innerText();
    check('restored goal shows in the header', chip.trim() === '0/6', chip);
    check('no uncaught page errors', errors.length === 0, errors.join(' | '));
    await ctx2.close();
  }
  console.log(results.join('\n'));
  await browser.close();
})();

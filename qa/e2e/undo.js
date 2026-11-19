const { chromium } = require('playwright');
const BASE = 'http://localhost:3100/';
const out = __dirname + '/shots/';
const results = [];
const check = (n, ok, d = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  [' + d + ']' : ''}`);
const time = (p) => p.locator('[role=timer] span').first().innerText();
const secs = (t) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
const wait = (p, ms = 250) => p.waitForTimeout(ms);
const banner = (p) => p.getByTestId('undo-banner');
const snap = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_current_state')));

async function seed(page, { status = 'running', left = 462, mode = 'pomodoro', total = 1500, theme } = {}) {
  await page.evaluate(({ status, left, mode, total, theme }) => {
    const now = Date.now();
    localStorage.setItem('ga-consent', 'denied');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    if (theme) localStorage.setItem('pomodorian_settings', JSON.stringify({ theme }));
    localStorage.setItem('pomodorian_current_state', JSON.stringify({
      mode, status, timeRemaining: status === 'paused' ? left : total, totalTime: total, pomodorosCompleted: 0,
      endTime: status === 'running' ? now + left * 1000 : null, savedAt: now }));
  }, { status, left, mode, total, theme });
  await page.reload({ waitUntil: 'networkidle' });
  await wait(page, 600);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE);

  // 1. key 2 on a running pomodoro
  await seed(page);
  const t0 = secs(await time(page));
  await page.keyboard.press('2'); await wait(page);
  const txt = await banner(page).innerText().catch(() => '');
  check('key 2: banner shown with stop time', /Pomodoro stopped at\s+07:4\d/.test(txt), txt.replace(/\n/g, ' '));
  check('key 2: switched to short break 05:00', (await time(page)) === '05:00');
  check('banner role=status', (await banner(page).getAttribute('role')) === 'status');
  check('undo title shows Z hint', (await page.getByTestId('undo-button').getAttribute('title')) === 'Undo (Z)');
  await wait(page, 2000);
  await page.getByTestId('undo-button').click(); await wait(page, 500);
  const t1 = secs(await time(page));
  check('undo (click): running pomodoro, clock kept flowing', await page.getByRole('button', { name: /^PAUSE$/ }).isVisible()
    && (await page.getByRole('button', { name: 'Pomodoro', exact: true }).getAttribute('aria-pressed')) === 'true'
    && t1 <= t0 - 2 && t1 >= t0 - 4, `${t0} -> ${t1}`);
  check('undo: banner gone', (await banner(page).count()) === 0);
  let s = await snap(page);
  check('undo: snapshot persisted running pomodoro, totalTime kept', s.mode === 'pomodoro' && s.status === 'running' && s.totalTime === 1500 && Math.abs(s.endTime - Date.now() - t1 * 1000) < 2000, JSON.stringify(s));
  await page.reload({ waitUntil: 'networkidle' }); await wait(page, 600);
  const t2 = secs(await time(page));
  check('undo survives reload', await page.getByRole('button', { name: /^PAUSE$/ }).isVisible() && Math.abs(t2 - t1) <= 3, `${t1} -> ${t2}`);

  // 2. mode tab + Z key
  await page.getByRole('button', { name: 'Long Break' }).click(); await wait(page);
  check('mode tab: banner shown', await banner(page).isVisible());
  check('mode tab: on long break', (await page.getByRole('button', { name: 'Long Break' }).getAttribute('aria-pressed')) === 'true');
  await page.screenshot({ path: out + 'desktop-dark.png' });
  await page.locator('body').click({ position: { x: 5, y: 300 } }); await wait(page);
  await page.keyboard.press('z'); await wait(page, 500);
  check('Z key: undo works', (await banner(page).count()) === 0 && await page.getByRole('button', { name: /^PAUSE$/ }).isVisible()
    && (await page.getByRole('button', { name: 'Pomodoro', exact: true }).getAttribute('aria-pressed')) === 'true');
  await page.keyboard.press('Control+z'); await wait(page);
  check('Ctrl+Z without banner: no effect', await page.getByRole('button', { name: /^PAUSE$/ }).isVisible());

  // 3. Skip button
  await page.getByRole('button', { name: 'Skip to break' }).click(); await wait(page);
  check('skip: banner shown', await banner(page).isVisible());
  await page.keyboard.press('Control+z'); await wait(page);
  check('Ctrl+Z with banner: ignored', await banner(page).isVisible() && (await time(page)) === '05:00');
  await page.getByTestId('undo-button').click(); await wait(page, 500);
  check('skip undo: running pomodoro', await page.getByRole('button', { name: /^PAUSE$/ }).isVisible());

  // 4. Reset on a paused pomodoro
  await seed(page, { status: 'paused', left: 462 });
  check('seed paused 07:42', (await time(page)) === '07:42');
  await page.getByRole('button', { name: 'Reset timer' }).click(); await wait(page);
  check('reset: banner shown, timer 25:00', await banner(page).isVisible() && (await time(page)) === '25:00');
  await wait(page, 1500);
  await page.getByTestId('undo-button').click(); await wait(page, 500);
  check('reset undo: paused, same time', (await time(page)) === '07:42' && await page.getByRole('button', { name: /^RESUME$/ }).isVisible());
  s = await snap(page);
  check('reset undo: snapshot paused 462', s.status === 'paused' && s.timeRemaining === 462 && s.endTime === null, JSON.stringify(s));
  await page.reload({ waitUntil: 'networkidle' }); await wait(page, 600);
  check('paused undo survives reload', (await time(page)) === '07:42' && await page.getByRole('button', { name: /^RESUME$/ }).isVisible());

  // 5. timeout
  await page.keyboard.press('3'); await wait(page);
  check('timeout: banner shown', await banner(page).isVisible());
  await wait(page, 7000);
  check('timeout: still visible at 7s', await banner(page).isVisible());
  await wait(page, 1600);
  check('timeout: gone after ~8s', (await banner(page).count()) === 0);
  await page.keyboard.press('z'); await wait(page);
  check('Z after timeout: nothing', (await time(page)) === '15:00');

  // 6. start dismisses
  await seed(page);
  await page.keyboard.press('2'); await wait(page);
  await page.getByRole('button', { name: /^START$/ }).click(); await wait(page, 400);
  check('starting a new timer dismisses banner', (await banner(page).count()) === 0);

  // 7. under 60s
  await seed(page, { left: 1500 - 30 });
  await page.keyboard.press('2'); await wait(page);
  check('no banner under 60s elapsed', (await banner(page).count()) === 0);
  await seed(page, { status: 'paused', left: 1500 - 59 });
  await page.getByRole('button', { name: 'Reset timer' }).click(); await wait(page);
  check('no banner paused 59s elapsed', (await banner(page).count()) === 0);

  // 8. skip a break
  await seed(page, { mode: 'shortBreak', total: 300, left: 100 });
  await page.getByRole('button', { name: 'Skip break' }).click(); await wait(page);
  check('no banner when skipping a break', (await banner(page).count()) === 0);

  // 9. idle pomodoro mode switch
  await seed(page, { status: 'idle' });
  await page.keyboard.press('2'); await wait(page);
  check('no banner for idle pomodoro', (await banner(page).count()) === 0);

  // 10. endTime passes while banner visible -> completion path
  await seed(page, { left: 3 });
  await page.keyboard.press('2'); await wait(page);
  check('near-end: banner shown', await banner(page).isVisible());
  await wait(page, 3500);
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_sessions') || '[]').length);
  await page.keyboard.press('z'); await wait(page, 1500);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_sessions') || '[]').length);
  s = await snap(page);
  check('expired endTime: completion path runs (session recorded, on break)', after === before + 1 && s.mode === 'shortBreak' && s.pomodorosCompleted === 1, `${before}->${after} ${JSON.stringify(s)}`);

  // 11. natural completion: no banner
  await seed(page, { left: 2 });
  await wait(page, 3000);
  check('natural completion: no banner', (await banner(page).count()) === 0);

  check('no uncaught page errors', errors.length === 0, errors.join(' | '));

  // screenshots
  for (const [name, vp, theme] of [['mobile-dark', { width: 390, height: 664 }, 'dark'], ['mobile-light', { width: 390, height: 664 }, 'light'], ['desktop-light', { width: 1280, height: 800 }, 'light'], ['mobile320-light', { width: 320, height: 568 }, 'light'], ['mobile320-dark', { width: 320, height: 568 }, 'dark']]) {
    const mobile = vp.width < 500;
    const c = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
    const p = await c.newPage();
    await p.goto(BASE);
    await seed(p, { theme });
    await p.getByRole('button', { name: 'Short Break' }).click(); await wait(p, 600);
    const bb = await banner(p).boundingBox();
    const btn = await p.getByTestId('undo-button').boundingBox();
    const pill = await p.locator('button.fixed.bottom-4').first().boundingBox().catch(() => null);
    const overlap = pill && !(bb.x + bb.width <= pill.x || pill.x + pill.width <= bb.x || bb.y + bb.height <= pill.y || pill.y + pill.height <= bb.y);
    check(`${name}: undo button >= 40px, no pill overlap, in viewport`, btn.height >= 40 && pill && !overlap && bb.x >= 0 && bb.x + bb.width <= vp.width, `banner=${JSON.stringify(bb)} btn.h=${btn.height} pill=${JSON.stringify(pill)}`);
    await p.screenshot({ path: out + name + '.png' });
    await c.close();
  }
  // with consent banner visible
  {
    const c = await browser.newContext({ viewport: { width: 390, height: 664 } });
    const p = await c.newPage();
    await p.goto(BASE);
    await seed(p);
    await p.evaluate(() => localStorage.removeItem('ga-consent'));
    await p.reload({ waitUntil: 'networkidle' }); await wait(p, 600);
    await p.keyboard.press('2'); await wait(p, 600);
    const z = await banner(p).evaluate(el => getComputedStyle(el).zIndex);
    const cz = await p.locator('.consent-banner').evaluate(el => getComputedStyle(el).zIndex).catch(() => 'none');
    check('banner z-index below consent banner', Number(z) < Number(cz), `banner=${z} consent=${cz}`);
    await p.screenshot({ path: out + 'mobile-consent.png' });
    await c.close();
  }
  console.log(results.join('\n'));
  await browser.close();
})().catch(e => { console.log(results.join('\n')); console.error(e); process.exit(1); });

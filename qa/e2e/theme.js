const { chromium } = require('playwright');
const BASE = 'http://localhost:3100';
const results = [];
const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`); };
const theme = (page) => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
const bg = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const LIGHT_BG = 'rgb(248, 249, 250)', DARK_BG = 'rgb(10, 10, 10)';
const errors = [];

async function ctxWith(browser, colorScheme, settings) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme });
  await ctx.addInitScript((s) => {
    if (sessionStorage.getItem('__seeded')) return; // seed once, so later choices survive reloads
    sessionStorage.setItem('__seeded', '1');
    localStorage.setItem('ga-consent', 'denied');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    if (s) localStorage.setItem('pomodorian_settings', JSON.stringify(s));
    else localStorage.removeItem('pomodorian_settings');
  }, settings);
  return ctx;
}

async function preHydration(browser, colorScheme, settings, path = '/') {
  const ctx = await ctxWith(browser, colorScheme, settings);
  const page = await ctx.newPage();
  await page.route('**/_next/static/chunks/**/*.js', r => r.abort());
  await page.route('**/_next/static/chunks/*.js', r => r.abort());
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  const r = { theme: await theme(page), bg: await bg(page) };
  await ctx.close();
  return r;
}

async function hydrated(browser, colorScheme, settings, path = '/') {
  const ctx = await ctxWith(browser, colorScheme, settings);
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${path}: ${e.message}`));
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const r = { theme: await theme(page), bg: await bg(page) };
  return { ctx, page, r };
}

(async () => {
  const browser = await chromium.launch();
  const cases = [
    ['no settings + light device', 'light', null, 'light'],
    ['no settings + dark device', 'dark', null, 'dark'],
    ['settings without theme + light device', 'light', { pomodoroDuration: 1500 }, 'light'],
    ['stored dark + light device', 'light', { theme: 'dark' }, 'dark'],
    ['stored light + dark device', 'dark', { theme: 'light' }, 'light'],
    ['stored system + light device', 'light', { theme: 'system' }, 'light'],
  ];
  for (const path of ['/', '/blog', '/25-minute-timer']) {
    for (const [name, scheme, s, want] of cases) {
      if (path !== '/' && name.startsWith('settings without')) continue;
      const pre = await preHydration(browser, scheme, s, path);
      const wantBg = want === 'light' ? LIGHT_BG : DARK_BG;
      check(`${path} ${name}: ${want} before app JS`, pre.theme === want && pre.bg === wantBg, JSON.stringify(pre));
      const { ctx, r } = await hydrated(browser, scheme, s, path);
      check(`${path} ${name}: ${want} after hydration`, r.theme === want, JSON.stringify(r));
      await ctx.close();
    }
  }

  // Live switching in the app
  {
    const { ctx, page } = await hydrated(browser, 'light', null, '/');
    check('app system: starts light', (await theme(page)) === 'light');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(150);
    check('app system: device -> dark flips page live', (await theme(page)) === 'dark' && (await bg(page)) !== LIGHT_BG);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(150);
    check('app system: device -> light flips back', (await theme(page)) === 'light');

    await page.getByRole('button', { name: 'Settings' }).click();
    const select = page.getByRole('dialog').locator('select:has(option[value="system"])');
    const opts = await select.locator('option').allInnerTexts();
    check('settings: Theme select offers System, Light, Dark', opts.join(',') === 'System,Light,Dark', opts.join(','));
    check('settings: default value is System', (await select.inputValue()) === 'system');
    await select.selectOption('dark');
    await page.waitForTimeout(100);
    check('choose Dark: page dark', (await theme(page)) === 'dark');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(150);
    check('choose Dark: device switching does nothing', (await theme(page)) === 'dark');
    await select.selectOption('system');
    await page.waitForTimeout(100);
    check('choose System again: follows device (light)', (await theme(page)) === 'light');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(150);
    check('choose System again: device -> dark follows', (await theme(page)) === 'dark');
    await select.selectOption('light');
    await page.keyboard.press('Escape');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')).theme);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    check('choice (Light on dark device) survives reload', stored === 'light' && (await theme(page)) === 'light', `stored=${stored}`);
    // explicit Light also sticks on the blog (same origin storage)
    await page.goto(BASE + '/blog', { waitUntil: 'networkidle' });
    check('choice applies to the blog too', (await theme(page)) === 'light');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(150);
    check('blog: explicit Light ignores device change', (await theme(page)) === 'light');
    await ctx.close();
  }

  // Live switching on non-app pages with system
  for (const path of ['/blog', '/25-minute-timer']) {
    const { ctx, page } = await hydrated(browser, 'dark', null, path);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(150);
    check(`${path} system: device -> light flips live`, (await theme(page)) === 'light');
    await ctx.close();
  }

  check('no uncaught page errors', errors.length === 0, errors.join(' | '));
  console.log(results.join('\n'));
  await browser.close();
  process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
})();

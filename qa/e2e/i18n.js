// i18n verification for the app core: 8 locales, layout at 390/320, language
// setting, legacy aiLanguage, no-flash, notifications and title.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const PORT = 3100;
const URL = `http://localhost:${PORT}/`;
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const LOCALES = [
  ['en', 'en-US'], ['fr', 'fr-FR'], ['es', 'es-ES'], ['de', 'de-DE'],
  ['pt', 'pt-BR'], ['it', 'it-IT'], ['ja', 'ja-JP'], ['zh', 'zh-CN'],
];
const EXPECT = {
  en: { start: 'START', short: 'Short Break', lang: 'en' },
  fr: { start: 'DÉMARRER', short: 'Pause courte', lang: 'fr' },
  es: { start: 'INICIAR', short: 'Pausa corta', lang: 'es' },
  de: { start: 'START', short: 'Kurze Pause', lang: 'de' },
  pt: { start: 'INICIAR', short: 'Pausa curta', lang: 'pt' },
  it: { start: 'AVVIA', short: 'Pausa breve', lang: 'it' },
  ja: { start: '開始', short: '短い休憩', lang: 'ja' },
  zh: { start: '开始', short: '短休息', lang: 'zh-Hans' },
};
// Strings that are legitimately identical to the English UI in a locale.
const SAME_AS_EN = {
  all: ['Pomodorian', 'Lo-fi', 'CSV', 'Markdown', '#', '·', '/', 'Write report', 'Review PR', '🌧', '🌲', '🔥', '☕', '🎧', 'English', 'Français', 'Español', 'Deutsch', 'Português', 'Italiano', '日本語', '中文'],
  fr: ['Pomodoro', 'Blog', 'Café', 'PAUSE', 'Focus', 'Pomos', 'Volume', 'Pomodoros', 'Pomodoro arrêté à'],
  es: ['Pomodoro', 'Blog', 'Pomos', 'Pomodoros'],
  de: ['Pomodoro', 'Blog', 'Café', 'START', 'PAUSE', 'Pomos', 'Pomodoros', 'System'],
  pt: ['Pomodoro', 'Blog', 'Café', 'Pomos', 'Volume', 'Pomodoros'],
  it: ['Pomodoro', 'Blog', 'Focus', 'Volume', 'Report', 'Report (R)'],
  ja: ['AI'],
  zh: ['AI'],
};

const today = new Date().toISOString().slice(0, 10);
const now = Date.now();
const SESSIONS = [
  { id: 's1', date: today, startedAt: new Date(now - 3e6).toISOString(), endedAt: new Date(now).toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: 't1', taskTitle: 'Write report', completed: true },
  { id: 's2', date: today, startedAt: new Date(now - 6e6).toISOString(), endedAt: new Date(now - 4e6).toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: null, taskTitle: null, completed: true },
  { id: 's3', date: today, startedAt: new Date(now - 9e6).toISOString(), endedAt: new Date(now - 8e6).toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: 'gone', taskTitle: null, completed: true },
];
const TASKS = [
  { id: 't1', title: 'Write report', estimatedPomodoros: 3, completedPomodoros: 1, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 },
  { id: 't2', title: 'Review PR', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: true, order: 1 },
];

let pass = 0, fail = 0;
const results = [];
function check(name, ok, detail = '') {
  ok ? pass++ : fail++;
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
}

async function newContext(browser, locale, { width = 390, height = 844, settings, seed = true, extra = {} } = {}) {
  const ctx = await browser.newContext({ locale, viewport: { width, height }, deviceScaleFactor: 1, ...extra });
  await ctx.addInitScript(({ TASKS, SESSIONS, settings, seed }) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('ga-consent', 'denied');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    localStorage.setItem('pomodorian_data_version', '2');
    if (seed) {
      localStorage.setItem('pomodorian_tasks', JSON.stringify(TASKS));
      localStorage.setItem('pomodorian_sessions', JSON.stringify(SESSIONS));
    }
    if (settings) localStorage.setItem('pomodorian_settings', JSON.stringify(settings));
  }, { TASKS, SESSIONS, settings, seed });
  return ctx;
}

// Visible text and labels of the app core (header, main, dialogs, undo banner).
async function coreStrings(page) {
  return page.evaluate(() => {
    const roots = [...document.querySelectorAll('header, main, [role=dialog], [data-testid=undo-banner]')];
    const out = new Set();
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent.trim();
        const el = n.parentElement;
        if (!t || !el) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        out.add(t);
      }
      root.querySelectorAll('[aria-label],[title],[placeholder]').forEach((el) => {
        for (const a of ['aria-label', 'title', 'placeholder']) {
          const v = el.getAttribute(a);
          if (v) out.add(v);
        }
      });
      root.querySelectorAll('option').forEach((o) => out.add(o.textContent.trim()));
    }
    return [...out];
  });
}

async function noHorizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement.scrollWidth <= window.innerWidth;
    const offenders = [];
    for (const el of document.querySelectorAll('header *, main *, [role=dialog] *')) {
      if (el.closest('.overflow-x-auto')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > window.innerWidth + 0.5 || r.left < -0.5) offenders.push(`${el.tagName}.${(el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 30)}:${(el.textContent || '').trim().slice(0, 20)}`);
    }
    return { doc, offenders: offenders.slice(0, 5) };
  });
}

async function oneLine(page) {
  return page.evaluate(() => {
    const group = document.querySelector('main [role=group]');
    const modes = [...group.querySelectorAll('button')];
    const tops = modes.map((b) => Math.round(b.getBoundingClientRect().top));
    const modeLines = modes.map((b) => {
      const s = b.querySelector('span');
      const lh = parseFloat(getComputedStyle(s).lineHeight) || 20;
      return s.getBoundingClientRect().height <= lh * 1.5;
    });
    const groupFits = group.scrollWidth <= group.clientWidth + 1 && group.getBoundingClientRect().right <= window.innerWidth;
    const controls = [...document.querySelectorAll('main .flex.items-center.gap-4 > button')];
    const ctrlTops = controls.map((b) => Math.round(b.getBoundingClientRect().top));
    const ctrlLines = controls.map((b) => {
      const s = b.querySelector('span');
      if (!s) return true;
      const lh = parseFloat(getComputedStyle(s).lineHeight) || 28;
      return s.getBoundingClientRect().height <= lh * 1.5 && b.getBoundingClientRect().right <= window.innerWidth;
    });
    return {
      modes: new Set(tops).size === 1 && modeLines.every(Boolean) && groupFits,
      controls: new Set(ctrlTops).size <= 1 && ctrlLines.every(Boolean),
      widths: modes.map((b) => Math.round(b.getBoundingClientRect().width)),
      groupRight: Math.round(group.getBoundingClientRect().right),
    };
  });
}

const fastForward = (page, ms) => page.evaluate((ms) => {
  const real = Date.now.bind(Date);
  const offset = (window.__offset || 0) + ms;
  window.__offset = offset;
  Date.now = () => real() + offset;
  if (!window.__realPerf) { window.__realPerf = performance.now.bind(performance); }
}, ms);

(async () => {
  const browser = await chromium.launch();
  const pageErrors = [];
  let enStrings = null;

  // ---------- 1. Every locale: screens, leftovers, layout ----------
  for (const [code, locale] of LOCALES) {
    const ctx = await newContext(browser, locale);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => pageErrors.push(`${code}: ${e.message}`));
    await page.goto(URL, { waitUntil: 'networkidle' });
    const exp = EXPECT[code];
    const strings = new Set();
    const add = async () => (await coreStrings(page)).forEach((s) => strings.add(s));

    const lang = await page.evaluate(() => document.documentElement.lang);
    const pending = await page.evaluate(() => document.documentElement.hasAttribute('data-i18n-pending'));
    check(`${code}: <html lang>=${exp.lang}, no pending attribute after load`, lang === exp.lang && !pending, `lang=${lang} pending=${pending}`);
    const startText = await page.locator('main .flex.items-center.gap-4 > button').first().innerText();
    check(`${code}: start button reads ${exp.start}`, startText.trim() === exp.start, startText);
    check(`${code}: short break tab reads ${exp.short}`, await page.getByRole('button', { name: exp.short, exact: true }).isVisible());

    await page.locator('main button[aria-expanded]').click();
    await page.locator('main .grid-cols-5 button').first().click();
    await add();
    // layout at 390 and 320
    for (const w of [390, 320]) {
      await page.setViewportSize({ width: w, height: 844 });
      await page.waitForTimeout(150);
      const ov = await noHorizontalOverflow(page);
      const ol = await oneLine(page);
      check(`${code}@${w}: no horizontal overflow on main`, ov.doc && ov.offenders.length === 0, ov.offenders.join(', '));
      check(`${code}@${w}: mode selector and controls on one line`, ol.modes && ol.controls, `widths=${ol.widths} right=${ol.groupRight}`);
      await page.locator('main button[aria-expanded]').click(); // collapse sounds for the shot
      await page.screenshot({ path: path.join(SHOTS, `main-${code}-${w}.png`), fullPage: false });
      await page.locator('main button[aria-expanded]').click();
    }
    await page.setViewportSize({ width: 390, height: 844 });

    // settings
    await page.keyboard.press('s');
    await page.waitForTimeout(250);
    await add();
    for (const w of [390, 320]) {
      await page.setViewportSize({ width: w, height: 844 });
      await page.waitForTimeout(150);
      const ov = await page.evaluate(() => {
        const d = document.querySelector('[role=dialog]');
        const bad = [];
        d.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect(), dr = d.getBoundingClientRect();
          if (r.width && (r.right > dr.right + 0.5 || r.left < dr.left - 0.5)) bad.push((el.textContent || el.tagName).trim().slice(0, 25));
        });
        // toggles and selects keep their size next to a wrapped label
        const toggles = [...d.querySelectorAll('button[aria-pressed]')].map((b) => Math.round(b.getBoundingClientRect().width));
        return { fits: d.scrollWidth <= d.clientWidth + 1, bad: bad.slice(0, 4), toggles };
      });
      check(`${code}@${w}: settings fit, labels wrap, toggles keep 40px`, ov.fits && ov.bad.length === 0 && ov.toggles.every((t) => t === 40), `${ov.bad.join(', ')} toggles=${ov.toggles}`);
      if (w === 390 && ['fr', 'de', 'ja', 'en'].includes(code)) {
        await page.screenshot({ path: path.join(SHOTS, `settings-${code}-390.png`) });
        await page.locator('[role=dialog]').evaluate((d) => d.scrollTo(0, d.scrollHeight));
        await page.screenshot({ path: path.join(SHOTS, `settings-${code}-390-bottom.png`) });
        await page.locator('[role=dialog]').evaluate((d) => d.scrollTo(0, 0));
      }
      if (w === 320 && ['fr', 'de', 'ja'].includes(code)) await page.screenshot({ path: path.join(SHOTS, `settings-${code}-320.png`) });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const langValue = await page.getByTestId('language-select').inputValue();
    check(`${code}: language select defaults to auto`, langValue === 'auto', langValue);
    await page.keyboard.press('Escape');

    // report: week, month, day
    await page.keyboard.press('r');
    await page.waitForTimeout(250);
    await add();
    const tabs = page.locator('[role=dialog] .w-fit button');
    await tabs.nth(2).click(); await page.waitForTimeout(150); await add();
    if (['fr', 'ja', 'de'].includes(code)) await page.screenshot({ path: path.join(SHOTS, `report-${code}-month.png`) });
    await tabs.nth(0).click(); await page.waitForTimeout(150); await add();
    await page.setViewportSize({ width: 320, height: 844 });
    await page.waitForTimeout(150);
    const repFit = await page.evaluate(() => {
      const d = document.querySelector('[role=dialog]');
      const cards = [...d.querySelectorAll('.grid-cols-4 > div')].map((c) => {
        const [v, l] = c.querySelectorAll('p');
        const single = (p) => p.getBoundingClientRect().height <= parseFloat(getComputedStyle(p).lineHeight) * 1.5 && p.scrollWidth <= p.clientWidth + 1;
        const oneLine = single(v) && single(l);
        return c.scrollWidth <= c.clientWidth + 1 && oneLine;
      });
      return d.scrollWidth <= d.clientWidth + 1 && cards.every(Boolean);
    });
    check(`${code}@320: report stat cards fit, values and labels on one line`, repFit);
    if (['fr', 'ja', 'de', 'zh'].includes(code)) await page.screenshot({ path: path.join(SHOTS, `report-${code}-day-320.png`) });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.keyboard.press('Escape');

    // shortcuts
    await page.keyboard.press('?');
    await page.waitForTimeout(250);
    await add();
    await page.keyboard.press('Escape');

    // task editor
    await page.locator('main [role=button][aria-pressed]').first().dblclick({ position: { x: 120, y: 12 } });
    await page.waitForTimeout(200);
    await add();
    if (['fr', 'ja'].includes(code)) await page.screenshot({ path: path.join(SHOTS, `editor-${code}.png`) });
    await page.keyboard.press('Escape');
    // add form
    await page.locator('main button.border-dashed').click();
    await add();
    await page.keyboard.press('Escape');
    // previous day
    await page.locator('main h2').locator('xpath=preceding-sibling::button').click();
    await add();
    await page.locator('main h2').locator('xpath=following-sibling::button[2]').click();

    // running, paused, undo banner
    await page.locator('main .flex.items-center.gap-4 > button').first().click();
    await page.waitForTimeout(300);
    await add();
    await fastForward(page, 120000);
    await page.waitForTimeout(500);
    await page.locator('main .flex.items-center.gap-4 > button').first().click(); // pause
    await page.waitForTimeout(200);
    await add();
    await page.locator('main .flex.items-center.gap-4 > button').nth(1).click(); // reset
    await page.waitForTimeout(400);
    const undoVisible = await page.getByTestId('undo-banner').isVisible();
    await add();
    check(`${code}: undo banner shown`, undoVisible);
    if (['fr', 'de', 'ja', 'zh'].includes(code)) {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.waitForTimeout(100);
      const ub = await page.getByTestId('undo-banner').evaluate((b) => b.scrollWidth <= b.clientWidth + 1 && b.getBoundingClientRect().right <= window.innerWidth);
      check(`${code}@320: undo banner fits`, ub);
      await page.screenshot({ path: path.join(SHOTS, `undo-${code}-320.png`) });
    }

    const list = [...strings];
    if (code === 'en') {
      enStrings = new Set(list);
      fs.writeFileSync(path.join(__dirname, 'strings-en.json'), JSON.stringify(list, null, 1));
    } else {
      const allowed = new Set([...SAME_AS_EN.all, ...(SAME_AS_EN[code] || [])]);
      const leftovers = list.filter((s) => enStrings.has(s) && !allowed.has(s) && !/^[\d\s:.,/·#%hmd-]+$/.test(s) && s.length > 1 && !(code === 'de' && /^November \d{4}$/.test(s)));
      // English words inside composed strings (aria-labels with a task title etc.)
      const words = ['Skip', 'Reset', 'Settings', 'Report', 'Analytics', 'remaining', 'Delete', 'Edit', 'Mark as', 'Reorder', 'linked', 'Untracked', 'deleted task', 'focused', 'Previous', 'Next', 'Today', 'volume', 'Timer mode', 'Close', 'Undo'];
      const composed = list.filter((s) => words.some((w) => new RegExp(`\\b${w}\\b`).test(s)) && !(code === 'it' && s.startsWith('Report')));
      check(`${code}: no leftover English in the app core`, leftovers.length === 0 && composed.length === 0, [...leftovers, ...composed].slice(0, 12).join(' | '));
      fs.writeFileSync(path.join(__dirname, `strings-${code}.json`), JSON.stringify(list, null, 1));
    }
    check(`${code}: no em dash or ampersand in the copy`, code === 'en' || list.every((s) => !/[—&]/.test(s) || /Write report|Review PR/.test(s)), list.filter((s) => /[—&]/.test(s)).join(' | '));
    await ctx.close();
  }

  // ---------- 2. en-US renders the English copy ----------
  {
    const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'base-en.json'), 'utf8'));
    void base; // full diff is done by compare.js; here the key strings
    const ctx = await newContext(browser, 'en-US');
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    const t = await page.locator('main').innerText();
    check('en-US: START, Short Break, + Add Task, Plan with AI, Time to focus!', ['START', 'Short Break', 'Long Break', '+ Add Task', 'Plan with AI', 'Time to focus!', 'Ambient Sounds', 'Today'].every((s) => t.includes(s)));
    await ctx.close();
  }

  // ---------- 3. Language select on a French browser ----------
  {
    const ctx = await newContext(browser, 'fr-FR');
    const page = await ctx.newPage();
    page.on('pageerror', (e) => pageErrors.push(`select: ${e.message}`));
    let plannerBody = null;
    await page.route('**/api/ai-planner', async (route) => {
      plannerBody = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sessionGoal: 'Objetivo', totalEstimatedPomodoros: 2, tasks: [{ title: 'Tarea uno', estimatedPomodoros: 2, rationale: '' }], tips: '' }) });
    });
    await page.goto(URL, { waitUntil: 'networkidle' });
    check('select: French browser starts in French', (await page.locator('main .flex.items-center.gap-4 > button').first().innerText()).trim() === 'DÉMARRER');
    await page.keyboard.press('s');
    const options = await page.getByTestId('language-select').locator('option').allInnerTexts();
    check('select: Auto then the 8 languages in their own names', options.join('|') === 'Automatique|English|Français|Español|Deutsch|Português|Italiano|日本語|中文', options.join('|'));
    await page.getByTestId('language-select').selectOption('es');
    await page.waitForTimeout(150);
    const dlg = await page.locator('[role=dialog] h2').innerText();
    const startEs = (await page.locator('main .flex.items-center.gap-4 > button').first().innerText()).trim();
    check('select: choosing Español switches the UI at once', dlg === 'Ajustes' && startEs === 'INICIAR', `${dlg} / ${startEs}`);
    check('select: <html lang> follows (es)', (await page.evaluate(() => document.documentElement.lang)) === 'es');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')).language);
    check('select: stored as settings.language = es', stored === 'es', stored);
    await page.keyboard.press('Escape');
    await page.reload({ waitUntil: 'networkidle' });
    const afterReload = (await page.locator('main .flex.items-center.gap-4 > button').first().innerText()).trim();
    check('select: survives a reload', afterReload === 'INICIAR', afterReload);
    await page.getByRole('button', { name: 'Planificar con IA' }).click();
    await page.locator('[role=dialog] textarea, textarea').first().fill('Terminar el informe');
    await page.getByRole('button', { name: 'Generar plan' }).click();
    await page.waitForTimeout(500);
    check('select: AI planner request carries language es', plannerBody && plannerBody.language === 'es', JSON.stringify(plannerBody));
    check('select: AI planner UI in Spanish', await page.getByText('Objetivo de la sesión').isVisible());
    await page.keyboard.press('Escape');
    // back to Auto: French again
    await page.keyboard.press('s');
    await page.getByTestId('language-select').selectOption('auto');
    await page.waitForTimeout(150);
    check('select: Auto returns to the browser language', (await page.locator('[role=dialog] h2').innerText()) === 'Réglages');
    await page.keyboard.press('Escape');
    // feedback and never dumb follow the setting
    await page.keyboard.press('s');
    await page.getByTestId('language-select').selectOption('de');
    await page.keyboard.press('Escape');
    const fb = await page.locator('button[aria-label]').filter({ hasText: /Feedback|Fehler/ }).first().getAttribute('aria-label').catch(() => null);
    check('select: feedback trigger follows the setting (de)', !!fb && !/Send feedback/.test(fb), fb);
    await ctx.close();
  }

  // ---------- 4. Legacy aiLanguage ----------
  {
    const ctx = await newContext(browser, 'en-US', { settings: { aiLanguage: 'de', theme: 'system' } });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    check('legacy: {aiLanguage:"de"} on an English browser gives German', await page.getByRole('button', { name: 'Kurze Pause', exact: true }).isVisible());
    await ctx.close();
    const ctx2 = await newContext(browser, 'fr-FR', { settings: { aiLanguage: 'en', theme: 'system' } });
    const page2 = await ctx2.newPage();
    await page2.goto(URL, { waitUntil: 'networkidle' });
    check('legacy: {aiLanguage:"en"} on a French browser gives French', (await page2.locator('main .flex.items-center.gap-4 > button').first().innerText()).trim() === 'DÉMARRER');
    await ctx2.close();
    const ctx3 = await newContext(browser, 'fr-FR', { settings: { aiLanguage: 'ja', language: 'auto' } });
    const page3 = await ctx3.newPage();
    await page3.goto(URL, { waitUntil: 'networkidle' });
    check('legacy: explicit "auto" beats a legacy aiLanguage', (await page3.locator('main .flex.items-center.gap-4 > button').first().innerText()).trim() === 'DÉMARRER');
    await ctx3.close();
  }

  // ---------- 5. No flash with a slowed-down load ----------
  for (const [code, locale, expectHidden] of [['fr', 'fr-FR', true], ['ja', 'ja-JP', true], ['en', 'en-US', false]]) {
    const ctx = await newContext(browser, locale, { seed: false });
    const page = await ctx.newPage();
    await page.route(/\/_next\/static\/chunks\/.*\.js/, async (route) => {
      await new Promise((r) => setTimeout(r, 1200));
      await route.continue();
    });
    const samples = [];
    page.on('domcontentloaded', () => {});
    const nav = page.goto(URL, { waitUntil: 'load' });
    await page.waitForSelector('main', { state: 'attached' });
    const t0 = Date.now();
    let shot = false;
    while (Date.now() - t0 < 4000) {
      const s = await page.evaluate(() => {
        const btn = document.querySelector('main .flex.items-center.gap-4 > button span');
        if (!btn) return null;
        return {
          pending: document.documentElement.hasAttribute('data-i18n-pending'),
          text: btn.textContent,
          visible: getComputedStyle(btn).visibility === 'visible',
          frame: document.querySelector('main [role=group]').getBoundingClientRect().width > 0,
        };
      }).catch(() => null);
      if (s) samples.push({ t: Date.now() - t0, ...s });
      if (s && !shot && Date.now() - t0 > 300) {
        await page.screenshot({ path: path.join(SHOTS, `noflash-${code}-early.png`) });
        shot = true;
      }
      await page.waitForTimeout(40);
    }
    await nav;
    await page.screenshot({ path: path.join(SHOTS, `noflash-${code}-late.png`) });
    const englishShown = samples.filter((s) => s.visible && s.text === 'START');
    const hiddenEarly = samples.filter((s) => s.t < 900).every((s) => s.visible === !expectHidden);
    const final = samples[samples.length - 1];
    const firstTranslated = samples.find((s) => s.visible && s.text === EXPECT[code].start);
    if (expectHidden) {
      check(`noflash ${code}: English START never visible during a slow load`, englishShown.length === 0, `${samples.length} samples`);
      check(`noflash ${code}: text hidden early, layout kept`, hiddenEarly && samples[0].frame, `first=${JSON.stringify(samples[0])}`);
      check(`noflash ${code}: translated text revealed after hydration`, final.visible && final.text === EXPECT[code].start && !final.pending, `at ${firstTranslated && firstTranslated.t}ms`);
    } else {
      check('noflash en: English visible immediately, no pending attribute', samples.every((s) => s.visible && !s.pending && s.text === 'START'), JSON.stringify(samples[0]));
    }
    await ctx.close();
  }

  // ---------- 6. CSS fallback: JS chunks never load ----------
  {
    const ctx = await newContext(browser, 'fr-FR', { seed: false });
    const page = await ctx.newPage();
    await page.route(/\/_next\/static\/chunks\/.*\.js/, (route) => route.abort());
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const early = await page.evaluate(() => getComputedStyle(document.querySelector('main .flex.items-center.gap-4 > button span')).visibility);
    await page.waitForTimeout(2200);
    const late = await page.evaluate(() => getComputedStyle(document.querySelector('main .flex.items-center.gap-4 > button span')).visibility);
    check('fallback: without JS chunks the text is hidden at 0.5s, shown (English) by 2.7s', early === 'hidden' && late === 'visible', `${early} -> ${late}`);
    await ctx.close();
  }

  // ---------- 7. Notifications and document title ----------
  for (const [code, locale, body, titleRe] of [
    ['fr', 'fr-FR', "Bien joué ! C'est l'heure de la pause.", /^\d\d:\d\d - Pause courte$/],
    ['ja', 'ja-JP', 'お疲れさまでした！休憩しましょう。', /^\d\d:\d\d - 短い休憩$/],
    ['en', 'en-US', 'Great work! Time for a break.', /^\d\d:\d\d - Short Break$/],
  ]) {
    const ctx = await newContext(browser, locale, { seed: false, settings: { pomodoroDuration: 60, notificationsEnabled: true } });
    await ctx.addInitScript(() => {
      window.__notes = [];
      class FakeNotification {
        static permission = 'granted';
        static requestPermission() { return Promise.resolve('granted'); }
        constructor(title, opts) { window.__notes.push({ title, body: opts && opts.body }); }
      }
      window.Notification = FakeNotification;
      if (window.ServiceWorkerRegistration) {
        ServiceWorkerRegistration.prototype.showNotification = function (title, opts) { window.__notes.push({ title, body: opts && opts.body }); return Promise.resolve(); };
      }
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => pageErrors.push(`notify ${code}: ${e.message}`));
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.locator('main .flex.items-center.gap-4 > button').first().click();
    await fastForward(page, 61000);
    await page.waitForTimeout(1500);
    const notes = await page.evaluate(() => window.__notes);
    check(`notify ${code}: end-of-pomodoro notification in the active locale`, notes.some((n) => n.title === 'Pomodorian' && n.body === body), JSON.stringify(notes));
    // now in short break; start it and read the title
    await page.locator('main .flex.items-center.gap-4 > button').first().click();
    await page.waitForTimeout(1200);
    const title = await page.title();
    check(`title ${code}: document title uses the active locale`, titleRe.test(title), title);
    await ctx.close();
  }

  check('no uncaught page errors', pageErrors.length === 0, pageErrors.slice(0, 5).join(' | '));
  console.log(`\n${pass} passed, ${fail} failed`);
  fs.writeFileSync(path.join(__dirname, 'i18n-results.txt'), results.join('\n') + `\n${pass} passed, ${fail} failed\n`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();

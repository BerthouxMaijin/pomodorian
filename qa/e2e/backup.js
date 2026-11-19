const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const BASE = 'http://localhost:3100';
const results = [];
const check = (name, ok, detail = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + String(detail).slice(0, 300) + ']' : ''}`);
};
const pageErrors = [];
const SHOTS = path.join(DIR, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const INCLUDED = {
  tasks: 'pomodorian_tasks',
  settings: 'pomodorian_settings',
  sessions: 'pomodorian_sessions',
  ambients: 'pomodorian_ambients',
  neverDumb: 'pomodorian_neverdumb',
};
const EXCLUDED = ['pomodorian_current_state', 'pomodorian_active_task', 'ga-consent', 'pomodorian-feedback-prompt-v1-dismissed'];
const EN = {
  tooLarge: 'This file is too large to be a Pomodorian backup. Nothing was changed.',
  notJson: "This file can't be read. Choose a Pomodorian backup (.json). Nothing was changed.",
  notBackup: 'This file is not a Pomodorian backup. Nothing was changed.',
  unsupported: 'This backup comes from a newer version of Pomodorian. Reload the page and try again. Nothing was changed.',
  invalid: 'This backup is damaged or incomplete. Nothing was changed.',
};

const dayKey = (d) => d.toISOString().split('T')[0];
const localKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function richProfile() {
  const now = Date.now();
  const iso = (ms) => new Date(ms).toISOString();
  const tasks = [
    { id: 't-ai-1', title: 'Outline the chapter', estimatedPomodoros: 3, completedPomodoros: 2, completed: false, createdAt: iso(now - 3 * 864e5), completedAt: null, aiGenerated: true, order: 0 },
    { id: 't-ai-2', title: 'Draft section 2 «with quotes» & ünïcode', estimatedPomodoros: 2, completedPomodoros: 2, completed: true, createdAt: iso(now - 3 * 864e5), completedAt: iso(now - 3600e3), aiGenerated: true, order: 1 },
    { id: 't-man-1', title: 'Reply to reviewers', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: iso(now - 864e5), completedAt: null, aiGenerated: false, order: 2 },
    { id: 't-man-2', title: 'Plan tomorrow', estimatedPomodoros: 1, completedPomodoros: 1, completed: false, createdAt: iso(now - 600e3), completedAt: null, aiGenerated: false, order: 3 },
  ];
  const sessions = [];
  let n = 0;
  for (let day = 20; day >= 0; day--) {
    if (day % 6 === 5) continue;
    const base = now - day * 864e5 - 4 * 3600e3;
    const count = 2 + (day % 3);
    for (let i = 0; i < count; i++) {
      const end = base + i * 35 * 60e3;
      const task = tasks[i % 3];
      sessions.push({ id: `s${n++}`, date: dayKey(new Date(end)), startedAt: iso(end - 30 * 60e3), endedAt: iso(end), durationMinutes: 30, mode: 'pomodoro', taskId: i === 2 ? null : task.id, taskTitle: i === 2 ? null : task.title, completed: true });
      sessions.push({ id: `s${n++}`, date: dayKey(new Date(end + 5 * 60e3)), startedAt: iso(end), endedAt: iso(end + 5 * 60e3), durationMinutes: 5, mode: 'shortBreak', taskId: null, taskTitle: null, completed: true });
    }
  }
  const days = {};
  for (let d = 0; d < 5; d++) days[localKey(new Date(now - d * 864e5))] = 1 + (d % 2);
  return {
    pomodorian_tasks: tasks,
    pomodorian_settings: { pomodoroDuration: 1800, shortBreakDuration: 300, longBreakDuration: 1200, longBreakInterval: 3, autoStartBreaks: true, autoStartPomodoros: false, neverDumbAutoOpen: false, alarmSound: 'bell', alarmVolume: 0.8, theme: 'light', notificationsEnabled: false, showTimeInTitle: true, language: 'fr' },
    pomodorian_sessions: sessions,
    pomodorian_ambients: { rain: { active: false, volume: 0.6 }, cafe: { active: false, volume: 0.3 }, lofi: { active: false, volume: 0.45 } },
    pomodorian_neverdumb: { total: 7, days, rotation: { 'serious:fr': 3, 'fun:fr': 1 }, lastPath: 'fun' },
    pomodorian_data_version: '2',
    pomodorian_active_task: 't-ai-1',
    pomodorian_current_state: { mode: 'pomodoro', status: 'paused', timeRemaining: 900, totalTime: 1800, pomodorosCompleted: 2, endTime: null, savedAt: now },
  };
}

async function newCtx(browser, seed, opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 }, colorScheme: opts.colorScheme || 'dark', acceptDownloads: true });
  await ctx.addInitScript((s) => {
    if (sessionStorage.getItem('__seeded')) return;
    sessionStorage.setItem('__seeded', '1');
    localStorage.setItem('ga-consent', 'denied');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    if (s) for (const [k, v] of Object.entries(s)) if (v !== undefined && v !== null) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  }, seed || null);
  return ctx;
}

async function open(ctx, url = '/') {
  const page = await ctx.newPage();
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  return page;
}

async function openSettings(page) {
  await page.mouse.click(5, 5);
  await page.keyboard.press('s');
  await page.waitForSelector('[data-testid=backup-section]');
  await page.locator('[data-testid=backup-section]').scrollIntoViewIfNeeded();
}

const snapshot = (page) => page.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
const parsed = (page, key) => page.evaluate((k) => { const v = localStorage.getItem(k); return v === null ? null : JSON.parse(v); }, key);
const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function stableStringify(v) {
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}';
  return JSON.stringify(v);
}

async function reportText(page) {
  await page.mouse.click(5, 5);
  await page.keyboard.press('r');
  await page.waitForTimeout(600);
  const t = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop(); return d ? d.innerText : ''; });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  return t;
}

async function pickFile(page, name, content) {
  await page.locator('[data-testid=backup-file]').setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.isBuffer(content) ? content : Buffer.from(content) });
}

async function importAndReload(page, file) {
  await page.locator('[data-testid=backup-file]').setInputFiles(file);
  await page.waitForSelector('[data-testid=backup-replace]');
  const nav = page.waitForNavigation({ waitUntil: 'networkidle' });
  await page.click('[data-testid=backup-replace]');
  await nav;
  await page.waitForTimeout(700);
}

(async () => {
  const browser = await chromium.launch();
  const profile = richProfile();

  // ---------------- 1. Export from a rich profile
  const srcCtx = await newCtx(browser, profile);
  const src = await open(srcCtx);
  const original = {};
  for (const k of Object.values(INCLUDED)) original[k] = await parsed(src, k);
  check('seeded profile still intact after load', stableStringify(original.pomodorian_tasks) === stableStringify(profile.pomodorian_tasks) && original.pomodorian_sessions.length === profile.pomodorian_sessions.length);
  const srcReport = await reportText(src);
  check('source report renders numbers', /\d/.test(srcReport), srcReport.slice(0, 120).replace(/\n/g, ' | '));
  await openSettings(src);
  check('Data section is the last section of Settings', await src.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog] section')]; return d[d.length - 1]?.getAttribute('data-testid') === 'backup-section'; }));
  check('section title is French in fr profile', (await src.locator('[data-testid=backup-section] h3').innerText()).toLowerCase() === 'données');
  const [download] = await Promise.all([src.waitForEvent('download'), src.click('[data-testid=backup-export]')]);
  const fname = download.suggestedFilename();
  const today = localKey(new Date());
  check('download filename pomodorian-backup-YYYY-MM-DD.json', fname === `pomodorian-backup-${today}.json`, fname);
  const exportPath = path.join(DIR, 'export.json');
  await download.saveAs(exportPath);
  const file = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  check('format marker', file.format === 'pomodorian-backup');
  check('format version 1', file.formatVersion === 1);
  check('exportedAt is a recent ISO date', Math.abs(Date.parse(file.exportedAt) - Date.now()) < 120e3, file.exportedAt);
  check('dataVersion carried', file.dataVersion === '2');
  check('data has exactly the five parts', deepEq(Object.keys(file.data).sort(), Object.keys(INCLUDED).sort()), Object.keys(file.data).join(','));
  for (const [part, key] of Object.entries(INCLUDED)) check(`export ${part} equals localStorage`, stableStringify(file.data[part]) === stableStringify(original[key]));
  const raw = fs.readFileSync(exportPath, 'utf8');
  for (const k of EXCLUDED) check(`excluded key absent: ${k}`, !raw.includes(k));
  check('timer snapshot not exported (no savedAt/endTime)', !raw.includes('savedAt') && !raw.includes('"endTime"'));

  // ---------------- 2. Import into a fresh context
  const dstCtx = await newCtx(browser, null);
  const dst = await open(dstCtx);
  await openSettings(dst);
  await dst.locator('[data-testid=backup-file]').setInputFiles(exportPath);
  await dst.waitForSelector('[data-testid=backup-replace]');
  const summary = await dst.locator('[data-testid=backup-summary]').innerText();
  check('confirmation shows warning', (await dst.locator('[data-testid=backup-section]').innerText()).includes('This replaces the data on this device.'));
  const nPomo = profile.pomodorian_sessions.filter((s) => s.mode === 'pomodoro').length;
  check('confirmation summary counts', summary.includes('4 tasks') && summary.includes(`${nPomo} pomodoros`), summary);
  check('nothing written before Replace', (await parsed(dst, 'pomodorian_tasks')) === null || (await parsed(dst, 'pomodorian_tasks')).length === 0);
  const nav = dst.waitForNavigation({ waitUntil: 'networkidle' });
  await dst.click('[data-testid=backup-replace]');
  await nav;
  await dst.waitForTimeout(800);
  for (const key of Object.values(INCLUDED)) check(`restored ${key} deep-equal`, stableStringify(await parsed(dst, key)) === stableStringify(original[key]));
  check('restored data version 2', (await parsed(dst, 'pomodorian_data_version')) === 2 || (await dst.evaluate(() => localStorage.getItem('pomodorian_data_version'))) === '2');
  check('no timer snapshot restored as running', ((await parsed(dst, 'pomodorian_current_state')) || {}).status !== 'running');
  check('UI theme light', (await dst.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'light');
  check('UI language fr', (await dst.evaluate(() => document.documentElement.lang)) === 'fr');
  const body = await dst.evaluate(() => document.body.innerText);
  check('UI shows tasks', body.includes('Outline the chapter') && body.includes('Reply to reviewers') && body.includes('Plan tomorrow'));
  const dstReport = await reportText(dst);
  check('report numbers identical to source', dstReport === srcReport, dstReport.slice(0, 160).replace(/\n/g, ' | '));
  await openSettings(dst);
  check('alarm select shows bell', (await dst.evaluate(() => [...document.querySelectorAll('[role=dialog] select')].map((s) => s.value))).includes('bell'));
  await dst.keyboard.press('Escape');

  // ---------------- 3. Cancel writes nothing
  const cCtx = await newCtx(browser, { pomodorian_tasks: [{ id: 'keep', title: 'Keep me', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 }], pomodorian_data_version: '2' });
  const c = await open(cCtx);
  await openSettings(c);
  const before = await snapshot(c);
  await c.locator('[data-testid=backup-file]').setInputFiles(exportPath);
  await c.waitForSelector('[data-testid=backup-cancel]');
  await c.click('[data-testid=backup-cancel]');
  await c.waitForTimeout(300);
  check('Cancel: storage unchanged', deepEq(await snapshot(c), before));
  check('Cancel: back to buttons', await c.locator('[data-testid=backup-export]').isVisible());
  check('Cancel: tasks still shown', (await c.evaluate(() => document.body.innerText)).includes('Keep me'));

  // ---------------- 4. Rejections
  const good = JSON.parse(raw);
  const mutate = (fn) => { const g = JSON.parse(raw); fn(g); return JSON.stringify(g); };
  const cases = [
    ['not JSON', 'notes.json', 'hello, this is not json {', EN.notJson],
    ['empty file', 'empty.json', '', EN.notJson],
    ['JSON array', 'arr.json', '[1,2,3]', EN.notBackup],
    ['wrong marker', 'other.json', mutate((g) => { g.format = 'someapp-backup'; }), EN.notBackup],
    ['missing marker', 'nomark.json', JSON.stringify(good.data), EN.notBackup],
    ['unsupported format version', 'v2.json', mutate((g) => { g.formatVersion = 2; }), EN.unsupported],
    ['newer DATA_VERSION', 'dv99.json', mutate((g) => { g.dataVersion = '99'; }), EN.unsupported],
    ['task with wrong type', 'badtask.json', mutate((g) => { g.data.tasks[0].estimatedPomodoros = '3'; }), EN.invalid],
    ['task missing id', 'noid.json', mutate((g) => { delete g.data.tasks[1].id; }), EN.invalid],
    ['duplicate task ids', 'dup.json', mutate((g) => { g.data.tasks[1].id = g.data.tasks[0].id; }), EN.invalid],
    ['session bad mode', 'badmode.json', mutate((g) => { g.data.sessions[0].mode = 'nap'; }), EN.invalid],
    ['session negative duration', 'neg.json', mutate((g) => { g.data.sessions[0].durationMinutes = -5; }), EN.invalid],
    ['settings bad theme', 'theme.json', mutate((g) => { g.data.settings.theme = 'neon'; }), EN.invalid],
    ['volume out of bounds', 'vol.json', mutate((g) => { g.data.settings.alarmVolume = 7; }), EN.invalid],
    ['title as HTML object payload', 'html-obj.json', mutate((g) => { g.data.tasks[0].title = { __html: '<img src=x onerror="window.__pwned=1">' }; }), EN.invalid],
    ['title over 1000 chars', 'long.json', mutate((g) => { g.data.tasks[0].title = '<script>'.repeat(200); }), EN.invalid],
    ['data not an object', 'datastr.json', mutate((g) => { g.data = '<script>alert(1)</script>'; }), EN.invalid],
    ['oversized file', 'big.json', Buffer.alloc(6 * 1024 * 1024, 32), EN.tooLarge],
  ];
  const rCtx = await newCtx(browser, { pomodorian_tasks: [{ id: 'keep', title: 'Keep me', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 }], pomodorian_data_version: '2' });
  const r = await open(rCtx);
  await openSettings(r);
  const rBefore = await snapshot(r);
  let errorShotDone = false;
  for (const [name, fileName, content, msg] of cases) {
    await pickFile(r, fileName, content);
    await r.waitForTimeout(250);
    const shown = (await r.locator('[data-testid=backup-error]').count()) ? await r.locator('[data-testid=backup-error]').innerText() : '(none)';
    const noConfirm = (await r.locator('[data-testid=backup-replace]').count()) === 0;
    check(`reject ${name}: message`, shown === msg && noConfirm, shown);
    check(`reject ${name}: nothing written`, deepEq(await snapshot(r), rBefore));
    if (!errorShotDone) errorShotDone = true;
  }
  check('rejections: no script ran', !(await r.evaluate(() => window.__pwned)));

  // valid file with markup in a title: accepted, rendered as text
  const markup = '<img src=x onerror="window.__pwned=1"><b>bold</b><script>window.__pwned=2</script>';
  const mFile = mutate((g) => { g.data.tasks[0].title = markup; g.data.settings.language = 'en'; });
  const mCtx = await newCtx(browser, null);
  const m = await open(mCtx);
  await openSettings(m);
  await importAndReload(m, { name: 'markup.json', mimeType: 'application/json', buffer: Buffer.from(mFile) });
  const mBody = await m.evaluate(() => document.body.innerText);
  check('markup title shown as literal text', mBody.includes(markup));
  check('markup title: no injected element, no script ran', !(await m.evaluate(() => window.__pwned)) && (await m.evaluate(() => document.querySelectorAll('img[src="x"], b:not([class])').length)) === 0);

  // unknown keys are dropped
  const uFile = mutate((g) => { g.data.tasks[0].evil = 'x'; g.data.settings.__proto_hack = 1; g.data.extraPart = { a: 1 }; g.extra = 1; g.data.ambients.unknownSound = { active: true, volume: 1 }; });
  const uCtx = await newCtx(browser, null);
  const u = await open(uCtx);
  await openSettings(u);
  await importAndReload(u, { name: 'unknown.json', mimeType: 'application/json', buffer: Buffer.from(uFile) });
  const uTasks = await parsed(u, 'pomodorian_tasks');
  const uSettings = await parsed(u, 'pomodorian_settings');
  const uAmb = await parsed(u, 'pomodorian_ambients');
  check('unknown keys dropped', !('evil' in uTasks[0]) && !('__proto_hack' in uSettings) && !('unknownSound' in uAmb) && (await u.evaluate(() => Object.keys(localStorage).every((k) => !k.includes('extra')))));

  // ---------------- 5. Older DATA_VERSION goes through migrations
  const old = {
    format: 'pomodorian-backup', formatVersion: 1, exportedAt: '2025-03-01T10:00:00.000Z', dataVersion: null,
    data: {
      tasks: [
        { id: 'o1', title: 'Old done task', estimatedPomodoros: 2, completedPomodoros: 2, completed: true, createdAt: '2025-02-20T09:00:00.000Z', aiGenerated: false },
        { id: 'o2', title: 'Old open task', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: '2025-02-21T09:00:00.000Z', aiGenerated: true },
      ],
      sessions: [
        { id: 'os1', date: '2025-02-20', startedAt: '2025-02-20T09:00:00.000Z', endedAt: '2025-02-20T09:25:00.000Z', durationMinutes: 25, mode: 'pomodoro', taskId: 'o1', completed: true },
        { id: 'os2', date: '2025-02-20', startedAt: '2025-02-20T10:00:00.000Z', endedAt: '2025-02-20T10:25:00.000Z', durationMinutes: 25, mode: 'pomodoro', taskId: null, completed: true },
      ],
      settings: { theme: 'dark', language: 'en' },
    },
  };
  const oCtx = await newCtx(browser, profile);
  const o = await open(oCtx);
  await openSettings(o);
  await importAndReload(o, { name: 'old.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(old)) });
  const oTasks = await parsed(o, 'pomodorian_tasks');
  const oSessions = await parsed(o, 'pomodorian_sessions');
  check('old backup: tasks got order 0..n-1', oTasks.map((t) => t.order).join(',') === '0,1', JSON.stringify(oTasks.map((t) => t.order)));
  check('old backup: completedAt backfilled', oTasks[0].completedAt === '2025-02-20T09:00:00.000Z' && oTasks[1].completedAt === null);
  check('old backup: session taskTitle backfilled', oSessions[0].taskTitle === 'Old done task' && oSessions[1].taskTitle === null);
  check('old backup: DATA_VERSION now 2', (await o.evaluate(() => localStorage.getItem('pomodorian_data_version'))) === '2');
  check('old backup: parts missing from file are cleared', (await parsed(o, 'pomodorian_ambients')) === null && (await parsed(o, 'pomodorian_neverdumb')) === null);
  check('old backup: UI shows imported tasks only', (await o.evaluate(() => document.body.innerText)).includes('Old open task') && !(await o.evaluate(() => document.body.innerText)).includes('Reply to reviewers'));

  // ---------------- 6. Import while a pomodoro runs
  const pCtx = await newCtx(browser, { pomodorian_tasks: [{ id: 'run-task', title: 'Running task', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 }], pomodorian_data_version: '2', pomodorian_settings: { language: 'en' } });
  const p = await open(pCtx);
  await p.mouse.click(5, 5);
  await p.keyboard.press(' ');
  await p.waitForTimeout(2500);
  const runBefore = await parsed(p, 'pomodorian_current_state');
  check('pomodoro running before import', runBefore && runBefore.status === 'running', JSON.stringify(runBefore));
  check('active task linked before import', (await parsed(p, 'pomodorian_active_task')) === 'run-task');
  await openSettings(p);
  await importAndReload(p, exportPath);
  const runAfter = await parsed(p, 'pomodorian_current_state');
  check('running pomodoro keeps its endTime through import', runAfter && runAfter.status === 'running' && runAfter.endTime === runBefore.endTime, JSON.stringify(runAfter));
  const t1 = await p.evaluate(() => document.title);
  await p.waitForTimeout(2200);
  const t2 = await p.evaluate(() => document.title);
  check('timer still counting down after reload', t1 !== t2 && /\d\d:\d\d/.test(t2), `${t1} -> ${t2}`);
  check('dangling active task link cleared', (await parsed(p, 'pomodorian_active_task')) === null);
  check('imported tasks shown while running', (await p.evaluate(() => document.body.innerText)).includes('Outline the chapter'));

  // active task kept when the imported list has it
  const kCtx = await newCtx(browser, { ...profile, pomodorian_current_state: undefined });
  const k = await open(kCtx);
  await k.mouse.click(5, 5);
  await k.keyboard.press(' ');
  await k.waitForTimeout(1200);
  const kActive = await parsed(k, 'pomodorian_active_task');
  await openSettings(k);
  await importAndReload(k, exportPath);
  check('active task kept when it exists in the backup', kActive && (await parsed(k, 'pomodorian_active_task')) === kActive, kActive);

  // ---------------- 7. 320px in fr, de, ja + touch targets + screenshots
  for (const lang of ['fr', 'de', 'ja', 'es', 'pt', 'it', 'zh', 'en']) {
    const lCtx = await newCtx(browser, { pomodorian_settings: { language: lang, theme: 'dark' } }, { viewport: { width: 320, height: 700 } });
    const l = await open(lCtx);
    await openSettings(l);
    const fit = async () => l.evaluate(() => {
      const dlg = document.querySelector('[role=dialog]');
      const sec = document.querySelector('[data-testid=backup-section]');
      const over = [...sec.querySelectorAll('*')].filter((el) => { const r = el.getBoundingClientRect(); const d = dlg.getBoundingClientRect(); return r.width > 0 && (r.right > d.right + 0.5 || r.left < d.left - 0.5); }).length;
      const btns = [...sec.querySelectorAll('button')].map((b) => b.getBoundingClientRect().height);
      return { docOverflow: document.documentElement.scrollWidth > window.innerWidth, dlgOverflow: dlg.scrollWidth > dlg.clientWidth, over, minBtn: Math.min(...btns) };
    });
    const f1 = await fit();
    check(`${lang} 320px at rest fits, buttons >= 40px`, !f1.docOverflow && !f1.dlgOverflow && f1.over === 0 && f1.minBtn >= 40, JSON.stringify(f1));
    if (['fr', 'de', 'ja'].includes(lang)) await l.locator('[data-testid=backup-section]').screenshot({ path: path.join(SHOTS, `320-${lang}-rest.png`) });
    await l.locator('[data-testid=backup-file]').setInputFiles(exportPath);
    await l.waitForSelector('[data-testid=backup-replace]');
    const f2 = await fit();
    check(`${lang} 320px confirmation fits, buttons >= 40px`, !f2.docOverflow && !f2.dlgOverflow && f2.over === 0 && f2.minBtn >= 40, JSON.stringify(f2));
    if (['fr', 'de', 'ja'].includes(lang)) await l.locator('[data-testid=backup-section]').screenshot({ path: path.join(SHOTS, `320-${lang}-confirm.png`) });
    await l.click('[data-testid=backup-cancel]');
    await pickFile(l, 'x.json', mutate((g) => { g.formatVersion = 2; }));
    await l.waitForSelector('[data-testid=backup-error]');
    const f3 = await fit();
    check(`${lang} 320px error fits`, !f3.docOverflow && !f3.dlgOverflow && f3.over === 0, JSON.stringify(f3));
    if (['fr', 'de', 'ja'].includes(lang)) await l.locator('[data-testid=backup-section]').screenshot({ path: path.join(SHOTS, `320-${lang}-error.png`) });
    await lCtx.close();
  }

  // Screenshots: widths x themes x states (English)
  for (const [w, h] of [[390, 844], [320, 700], [1280, 900]]) {
    for (const theme of ['dark', 'light']) {
      const sCtx = await newCtx(browser, { pomodorian_settings: { language: 'en', theme } }, { viewport: { width: w, height: h } });
      const s = await open(sCtx);
      await openSettings(s);
      const dlg = s.locator('[role=dialog]');
      await dlg.evaluate((d) => { d.scrollTop = d.scrollHeight; });
      await s.screenshot({ path: path.join(SHOTS, `${w}-${theme}-rest.png`) });
      await s.locator('[data-testid=backup-file]').setInputFiles(exportPath);
      await s.waitForSelector('[data-testid=backup-replace]');
      await dlg.evaluate((d) => { d.scrollTop = d.scrollHeight; });
      await s.screenshot({ path: path.join(SHOTS, `${w}-${theme}-confirm.png`) });
      await s.click('[data-testid=backup-cancel]');
      await pickFile(s, 'x.json', 'not json');
      await s.waitForSelector('[data-testid=backup-error]');
      await dlg.evaluate((d) => { d.scrollTop = d.scrollHeight; });
      await s.screenshot({ path: path.join(SHOTS, `${w}-${theme}-error.png`) });
      await sCtx.close();
    }
  }

  check('no uncaught page errors', pageErrors.length === 0, pageErrors.join(' || '));
  await browser.close();
  const pass = results.filter((x) => x.startsWith('PASS')).length;
  console.log(results.join('\n'));
  console.log(`\n${pass}/${results.length} PASS`);
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });

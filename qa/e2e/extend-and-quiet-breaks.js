// "+5 min" (flow extension) and quiet breaks checks. Run: node flow.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://localhost:3100';
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => {
  const line = `${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`;
  results.push(line);
  console.log(line);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isAlarm = (src) => /alarm-/.test(src || '');

const INSTRUMENT = () => {
  const log = (window.__log = []);
  const els = (window.__els = []);
  const now = () => Math.round(performance.timeOrigin + performance.now());
  const Orig = window.Audio;
  let n = 0;
  function Wrapped(src) {
    const a = src === undefined ? new Orig() : new Orig(src);
    a.__id = ++n;
    els.push(a);
    log.push({ t: now(), ev: 'new', id: a.__id, src: String(src) });
    return a;
  }
  Wrapped.prototype = Orig.prototype;
  window.Audio = Wrapped;
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    log.push({ t: now(), ev: 'play', id: this.__id, src: this.src, vol: this.volume, muted: this.muted });
    return play.call(this);
  };
  const pause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.pause = function () {
    log.push({ t: now(), ev: 'pause', id: this.__id, src: this.src });
    return pause.call(this);
  };
  window.__snap = () => els.map((a) => ({ id: a.__id, src: a.src, vol: a.volume, paused: a.paused, muted: a.muted }));
  window.__samples = [];
  const realSetInterval = window.setInterval.bind(window);
  realSetInterval(() => window.__samples.push({ t: now(), s: window.__snap().filter((x) => !x.paused) }), 50);
};

const task = (id, title, order = 0, extra = {}) => ({
  id, title, estimatedPomodoros: 3, completedPomodoros: 0, completed: false,
  createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order, ...extra,
});

async function newPage(browser, seed, opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 } });
  await ctx.addInitScript(INSTRUMENT);
  await ctx.addInitScript((seed) => {
    if (sessionStorage.getItem('__seeded')) return;
    sessionStorage.setItem('__seeded', '1');
    localStorage.setItem('ga-consent', 'denied');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, JSON.stringify(v));
  }, seed);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  if (opts.clock) await page.clock.install();
  return { ctx, page, errors };
}

const baseSeed = (settings = {}, extra = {}) => ({
  pomodorian_settings: {
    pomodoroDuration: 4, shortBreakDuration: 4, longBreakDuration: 6, longBreakInterval: 4,
    autoStartBreaks: false, autoStartPomodoros: false, neverDumbAutoOpen: false,
    alarmSound: 'gentle', alarmVolume: 0.7, theme: 'dark', ...settings,
  },
  pomodorian_tasks: [task('t1', 'Write the report', 0), task('t2', 'Answer emails', 1)],
  pomodorian_active_task: 't1',
  ...extra,
});

const ls = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
const modeOf = async (page) => {
  for (const [name, m] of [['Pomodoro', 'pomodoro'], ['Short Break', 'shortBreak'], ['Long Break', 'longBreak']]) {
    if ((await page.getByRole('button', { name, exact: true }).getAttribute('aria-pressed')) === 'true') return m;
  }
  return null;
};
const timerText = (page) => page.locator('[role="timer"]').getAttribute('aria-label');
const extendBtn = (page) => page.getByTestId('flow-extend');
const isRunning = (page) => page.getByRole('button', { name: 'PAUSE', exact: true }).isVisible();
const pomCount = (page) => ls(page, 'pomodorian_current_state').then((s) => s && s.pomodorosCompleted);
const alarmsPlaying = (page) => page.evaluate(() => window.__snap().filter((x) => /alarm-/.test(x.src) && !x.paused && !x.muted).length);
const rainState = (page) => page.evaluate(() => {
  const r = window.__snap().filter((x) => /rain/.test(x.src));
  return r.map((x) => ({ paused: x.paused, vol: Math.round(x.vol * 1000) / 1000 }));
});
const rainPlaying = async (page) => (await rainState(page)).some((x) => !x.paused);
async function clickStart(page) {
  await page.getByRole('button', { name: 'START', exact: true }).click();
}
async function waitFor(fn, timeout = 15000, step = 100) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    try { if (await fn()) return true; } catch {}
    await sleep(step);
  }
  return false;
}
// Hide the mouse cursor activity: move away once so nothing later counts as input.

// ---------------- Extension scenarios ----------------

async function sBasic(browser) {
  const { ctx, page, errors } = await newPage(browser, baseSeed(), { clock: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  const done = await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  check('[basic] pomodoro completes into a short break (clock flows after install)', done);
  check('[basic] +5 min button appears at completion', await extendBtn(page).isVisible());
  check('[basic] button text and accessible label', (await extendBtn(page).textContent()) === '+5 min' && (await extendBtn(page).getAttribute('aria-label')) === 'Keep focusing for 5 more minutes');
  let sessions = await ls(page, 'pomodorian_sessions');
  const s0 = sessions[0];
  check('[basic] one session recorded at completion', sessions.length === 1 && s0.mode === 'pomodoro' && s0.taskId === 't1', JSON.stringify(sessions.map((s) => [s.mode, s.durationMinutes, s.taskId])));
  let tasks = await ls(page, 'pomodorian_tasks');
  check('[basic] task count 1, cycle count 1', tasks[0].completedPomodoros === 1 && (await pomCount(page)) === 1);
  await sleep(400);
  check('[basic] alarm is ringing before taking it', (await alarmsPlaying(page)) === 1);

  // Switch the active task meanwhile: the extension must go back to the original task.
  await page.evaluate(() => localStorage.setItem('pomodorian_active_task', JSON.stringify('t2')));
  await extendBtn(page).click();
  await sleep(300);
  check('[basic] taking it: pomodoro mode, running', (await modeOf(page)) === 'pomodoro' && (await isRunning(page)));
  const tt = await timerText(page);
  check('[basic] taking it: 05:00 countdown', /^0(5:00|4:59) remaining$/.test(tt), tt);
  check('[basic] taking it: alarm silenced', (await alarmsPlaying(page)) === 0);
  check('[basic] taking it: button gone', !(await extendBtn(page).isVisible()));
  check('[basic] taking it: same task active (t1)', (await ls(page, 'pomodorian_active_task')) === 't1');
  const snap = await ls(page, 'pomodorian_current_state');
  check('[basic] snapshot carries the extension (session id)', snap.extensionOf === s0.id && snap.status === 'running' && snap.totalTime === 300, JSON.stringify(snap));
  const row = await page.locator('main').getByText(/^#\d+$/).textContent();
  check('[basic] focus row shows #1 during the extension (same pomodoro)', row === '#1', row);

  // End of the extension.
  await page.clock.fastForward(300 * 1000);
  const back = await waitFor(async () => (await modeOf(page)) === 'shortBreak', 8000);
  check('[basic] extension end: back on the short break that was due', back);
  await sleep(300);
  check('[basic] extension end: alarm rings', (await page.evaluate(() => window.__log.filter((e) => e.ev === 'play' && /alarm-/.test(e.src) && !e.muted).length)) >= 2);
  sessions = await ls(page, 'pomodorian_sessions');
  check('[basic] extension end: still exactly one session, 5 min longer, later end', sessions.length === 1 && sessions[0].id === s0.id && sessions[0].durationMinutes === s0.durationMinutes + 5 && sessions[0].endedAt > s0.endedAt, JSON.stringify(sessions.map((s) => [s.durationMinutes, s.endedAt])));
  tasks = await ls(page, 'pomodorian_tasks');
  check('[basic] extension end: task count and cycle count unchanged', tasks[0].completedPomodoros === 1 && tasks[1].completedPomodoros === 0 && (await pomCount(page)) === 1);
  check('[basic] extension end: offered again', await extendBtn(page).isVisible());
  check('[basic] extension end: break not started (auto-start off)', !(await isRunning(page)));

  // Second extension: +10 in total.
  await extendBtn(page).click();
  await sleep(200);
  await page.clock.fastForward(300 * 1000);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 8000);
  await sleep(300);
  sessions = await ls(page, 'pomodorian_sessions');
  check('[basic] taken twice: +10 minutes on the same session', sessions.length === 1 && sessions[0].durationMinutes === s0.durationMinutes + 10, JSON.stringify(sessions.map((s) => s.durationMinutes)));
  check('[basic] taken twice: counts unchanged', (await ls(page, 'pomodorian_tasks'))[0].completedPomodoros === 1 && (await pomCount(page)) === 1);
  // Stats panel: 1 pomodoro.
  const statsLine = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_sessions')).filter((s) => s.mode === 'pomodoro').length);
  check('[basic] stats source: one pomodoro session', statsLine === 1);

  check('[basic] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sLongBreak(browser) {
  const seed = baseSeed({}, {
    pomodorian_current_state: { mode: 'pomodoro', status: 'idle', timeRemaining: 4, totalTime: 4, pomodorosCompleted: 3, endTime: null, savedAt: Date.now() },
  });
  const { ctx, page, errors } = await newPage(browser, seed, { clock: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'longBreak', 12000);
  check('[long] 4th pomodoro ends on a long break', (await modeOf(page)) === 'longBreak' && (await pomCount(page)) === 4);
  await extendBtn(page).click();
  await sleep(200);
  check('[long] extension running in pomodoro mode', (await modeOf(page)) === 'pomodoro' && (await isRunning(page)));
  const row = await page.locator('main').getByText(/^#\d+$/).textContent();
  check('[long] focus row shows #4 during the extension', row === '#4', row);
  await page.clock.fastForward(300 * 1000);
  const ok = await waitFor(async () => (await modeOf(page)) === 'longBreak', 8000);
  check('[long] extension end: the long break that was due', ok);
  check('[long] cycle count still 4 (next pomodoro is #5 of a new cycle)', (await pomCount(page)) === 4);
  const sessions = await ls(page, 'pomodorian_sessions');
  check('[long] one session, +5', sessions.length === 1 && sessions[0].durationMinutes === Math.round(4 / 60) + 5);
  check('[long] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sDismissals(browser) {
  const { ctx, page, errors } = await newPage(browser, baseSeed(), {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  // (0) offer window, real time
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  const t0 = Date.now();
  await sleep(50000);
  check('[dismiss] still offered after 50 s', await extendBtn(page).isVisible());
  const gone = await waitFor(async () => !(await extendBtn(page).isVisible()), 15000, 200);
  check('[dismiss] offer goes away after about a minute', gone && Date.now() - t0 < 63000 && Date.now() - t0 > 58000, `${Date.now() - t0} ms`);
  await page.getByRole('button', { name: 'Pomodoro', exact: true }).click();
  // (a) manual break start
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  check('[dismiss] offered at completion', await extendBtn(page).isVisible());
  await clickStart(page);
  await sleep(300);
  check('[dismiss] starting the break by hand removes it', !(await extendBtn(page).isVisible()));
  // break ends -> pomodoro idle: no offer after a break
  await waitFor(async () => (await modeOf(page)) === 'pomodoro', 12000);
  await sleep(300);
  check('[dismiss] not offered after a break ends', !(await extendBtn(page).isVisible()));
  // (b) mode switch
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  check('[dismiss] offered again at the next completion', await extendBtn(page).isVisible());
  await page.getByRole('button', { name: 'Long Break', exact: true }).click();
  await sleep(300);
  check('[dismiss] switching mode removes it', !(await extendBtn(page).isVisible()));
  // (c) keyboard: "1" (mode switch shortcut)
  await page.getByRole('button', { name: 'Pomodoro', exact: true }).click();
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  await page.keyboard.press('1');
  await sleep(300);
  check('[dismiss] keyboard mode switch removes it', !(await extendBtn(page).isVisible()) && (await modeOf(page)) === 'pomodoro');
  check('[dismiss] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sAbandon(browser) {
  const { ctx, page, errors } = await newPage(browser, baseSeed({ pomodoroDuration: 1500 }, {
    pomodorian_current_state: { mode: 'pomodoro', status: 'running', timeRemaining: 3, totalTime: 1500, pomodorosCompleted: 0, endTime: Date.now() + 6000, savedAt: Date.now() },
  }), {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  const s0 = (await ls(page, 'pomodorian_sessions'))[0];
  check('[abandon] seeded pomodoro completed and recorded (25 min)', !!s0 && s0.durationMinutes === 25);
  // (a) reset
  await extendBtn(page).click();
  await sleep(1500);
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click();
  await page.getByRole('button', { name: 'Reset timer', exact: true }).click();
  await sleep(300);
  let tt = await timerText(page);
  check('[abandon] reset of an extension: idle full pomodoro (25:00), not 05:00', (await modeOf(page)) === 'pomodoro' && tt === '25:00 remaining', tt);
  check('[abandon] reset: no undo banner for an extension', !(await page.getByTestId('undo-banner').isVisible()));
  let sessions = await ls(page, 'pomodorian_sessions');
  check('[abandon] reset adds nothing', sessions.length === 1 && sessions[0].durationMinutes === 25);
  check('[abandon] snapshot no longer marks an extension', !(await ls(page, 'pomodorian_current_state')).extensionOf);
  check('[abandon] counts unchanged (1/1)', (await pomCount(page)) === 1 && (await ls(page, 'pomodorian_tasks'))[0].completedPomodoros === 1);
  // (b) skip: needs a fresh offer -> run a seeded completion again
  await page.evaluate(() => localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 3, totalTime: 1500, pomodorosCompleted: 1, endTime: Date.now() + 3000, savedAt: Date.now() })));
  await page.reload({ waitUntil: 'networkidle' });
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  await extendBtn(page).click();
  await sleep(1200);
  await page.getByRole('button', { name: 'Skip to break', exact: true }).click();
  await sleep(300);
  check('[abandon] skip of an extension: on short break, no undo banner', (await modeOf(page)) === 'shortBreak' && !(await page.getByTestId('undo-banner').isVisible()));
  sessions = await ls(page, 'pomodorian_sessions');
  check('[abandon] skip adds nothing', sessions.length === 2 && sessions.every((s) => s.durationMinutes === 25));
  // (c) mode switch
  await page.evaluate(() => localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 3, totalTime: 1500, pomodorosCompleted: 2, endTime: Date.now() + 3000, savedAt: Date.now() })));
  await page.reload({ waitUntil: 'networkidle' });
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  await extendBtn(page).click();
  await sleep(1200);
  await page.getByRole('button', { name: 'Long Break', exact: true }).click();
  await sleep(300);
  sessions = await ls(page, 'pomodorian_sessions');
  check('[abandon] mode switch adds nothing, no undo banner', sessions.length === 3 && sessions.every((s) => s.durationMinutes === 25) && !(await page.getByTestId('undo-banner').isVisible()));
  check('[abandon] cycle count = 3 completed pomodoros', (await pomCount(page)) === 3);
  // (d) a normal pomodoro interruption still offers undo
  await page.getByRole('button', { name: 'Pomodoro', exact: true }).click();
  await page.evaluate(() => localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 1400, totalTime: 1500, pomodorosCompleted: 3, endTime: Date.now() + 1400000, savedAt: Date.now() })));
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Skip to break', exact: true }).click();
  await sleep(300);
  check('[abandon] normal pomodoro skip still offers undo', await page.getByTestId('undo-banner').isVisible());
  check('[abandon] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sAutoStart(browser) {
  const { ctx, page, errors } = await newPage(browser, baseSeed({ autoStartBreaks: true }), { clock: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  await sleep(500);
  check('[auto] break auto-started', await isRunning(page));
  check('[auto] +5 min still offered during the running break', await extendBtn(page).isVisible());
  await page.clock.fastForward(2000);
  await sleep(100);
  // Break is 4 s: take it before the break ends.
  await extendBtn(page).click();
  await sleep(300);
  check('[auto] taking it replaces the running break with a 05:00 pomodoro', (await modeOf(page)) === 'pomodoro' && (await isRunning(page)) && /^0(5:00|4:59) remaining$/.test(await timerText(page)));
  await page.clock.fastForward(300 * 1000);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 8000);
  await sleep(500);
  check('[auto] extension end: break auto-starts again', (await modeOf(page)) === 'shortBreak' && (await isRunning(page)));
  const sessions = await ls(page, 'pomodorian_sessions');
  check('[auto] one session, +5, no break session recorded', sessions.length === 1 && sessions[0].durationMinutes === 5, JSON.stringify(sessions.map((s) => [s.mode, s.durationMinutes])));
  check('[auto] still offered after the extension', await extendBtn(page).isVisible());
  check('[auto] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sReload(browser) {
  const { ctx, page, errors } = await newPage(browser, baseSeed(), {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  const s0 = (await ls(page, 'pomodorian_sessions'))[0];
  await extendBtn(page).click();
  await sleep(1500);
  await page.reload({ waitUntil: 'networkidle' });
  await sleep(500);
  const tt = await timerText(page);
  check('[reload] mid-extension: still a running pomodoro near 04:5x', (await modeOf(page)) === 'pomodoro' && (await isRunning(page)) && /^04:5\d remaining$/.test(tt), tt);
  const row = await page.locator('main').getByText(/^#\d+$/).textContent();
  check('[reload] extension flag survived (#1, not #2)', row === '#1' && (await ls(page, 'pomodorian_current_state')).extensionOf === s0.id, row);
  // Shorten what is left, reload again, let it end.
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('pomodorian_current_state'));
    s.endTime = Date.now() + 2500;
    localStorage.setItem('pomodorian_current_state', JSON.stringify(s));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 10000);
  await sleep(300);
  const sessions = await ls(page, 'pomodorian_sessions');
  check('[reload] end after reload: one session +5, counts unchanged', sessions.length === 1 && sessions[0].durationMinutes === s0.durationMinutes + 5 && (await pomCount(page)) === 1 && (await ls(page, 'pomodorian_tasks'))[0].completedPomodoros === 1, JSON.stringify(sessions.map((s) => s.durationMinutes)));
  // Paused extension survives too.
  await extendBtn(page).click();
  await sleep(1200);
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click();
  await page.reload({ waitUntil: 'networkidle' });
  await sleep(300);
  const snap = await ls(page, 'pomodorian_current_state');
  check('[reload] paused extension restores paused with its flag', snap.status === 'paused' && snap.extensionOf === s0.id && (await page.getByRole('button', { name: 'RESUME', exact: true }).isVisible()));
  // Malformed flag degrades to a plain pomodoro without dropping the snapshot.
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('pomodorian_current_state'));
    s.extensionOf = 42;
    localStorage.setItem('pomodorian_current_state', JSON.stringify(s));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await sleep(300);
  const snap2 = await ls(page, 'pomodorian_current_state');
  check('[reload] malformed flag: snapshot kept (paused 5-min pomodoro), flag dropped', snap2.status === 'paused' && snap2.totalTime === 300 && snap2.extensionOf === null, JSON.stringify(snap2));
  check('[reload] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// ---------------- Quiet breaks ----------------

const rainSeed = (settings) => baseSeed(settings, { pomodorian_ambients: { rain: { active: true, volume: 0.6 } } });
const samplesRain = (page, from, to) => page.evaluate(([from, to]) => window.__samples.filter((s) => s.t >= from && s.t <= to).map((s) => ({ t: s.t, v: (s.s.find((x) => /rain/.test(x.src)) || { vol: null }).vol })), [from, to]);
const lastAlarmPlay = (page) => page.evaluate(() => window.__log.filter((e) => e.ev === 'play' && /alarm-/.test(e.src) && !e.muted).pop());
const rainPressed = (page) => page.getByRole('button', { name: /Rain/ }).first().getAttribute('aria-pressed');

async function openSounds(page) {
  const toggle = page.getByRole('button', { name: 'Ambient Sounds' });
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
}

async function sQuietOn(browser) {
  const { ctx, page, errors } = await newPage(browser, rainSeed({ pauseAmbientsOnBreak: true }), {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await sleep(600);
  check('[quiet] rain plays during the pomodoro', await rainPlaying(page));
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  const ring = await lastAlarmPlay(page);
  await sleep(600);
  const st1 = await rainState(page);
  check('[quiet] rain still playing (ducked) while the alarm rings', st1.some((x) => !x.paused && x.vol < 0.13), JSON.stringify(st1));
  const stopped = await waitFor(async () => !(await rainPlaying(page)), 9000, 50);
  check('[quiet] rain stops after the alarm', stopped);
  const alarmEnd = await page.evaluate(() => {
    const a = window.__els.find((x) => /alarm-/.test(x.src) && x.duration);
    return a ? a.duration : null;
  });
  const samples = await samplesRain(page, ring.t, ring.t + 9000);
  const playing = samples.filter((s) => s.v !== null);
  const lastPlaying = playing[playing.length - 1];
  const afterRingEnd = playing.filter((s) => s.t > ring.t + alarmEnd * 1000 + 100);
  check('[quiet] stop comes after the ring has finished', lastPlaying && lastPlaying.t > ring.t + alarmEnd * 1000, `ring=${alarmEnd}s lastPlaying=+${lastPlaying && lastPlaying.t - ring.t}ms`);
  check('[quiet] short fade (not a hard cut), never back above the ducked level', afterRingEnd.length >= 5 && afterRingEnd.every((s) => s.v <= 0.125) && new Set(afterRingEnd.map((s) => s.v.toFixed(3))).size >= 4, afterRingEnd.map((s) => s.v.toFixed(3)).join(','));
  const stored = await ls(page, 'pomodorian_ambients');
  check('[quiet] stored mix unchanged', stored.rain.active === true && stored.rain.volume === 0.6, JSON.stringify(stored));
  await openSounds(page);
  check('[quiet] mixer still shows rain active', (await rainPressed(page)) === 'true');
  await clickStart(page); // break
  await sleep(800);
  check('[quiet] starting the break keeps rain off', !(await rainPlaying(page)));
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click();
  await sleep(200);
  await page.getByRole('button', { name: 'RESUME', exact: true }).click();
  await sleep(500);
  check('[quiet] pause + resume inside a break keeps rain off', !(await rainPlaying(page)));
  await waitFor(async () => (await modeOf(page)) === 'pomodoro', 12000);
  await sleep(4000);
  check('[quiet] break over, pomodoro idle: rain still off', !(await rainPlaying(page)));
  await clickStart(page);
  const back = await waitFor(async () => (await rainState(page)).some((x) => !x.paused && Math.abs(x.vol - 0.6) < 0.001), 3000, 50);
  check('[quiet] next pomodoro starts: rain back at its stored volume', back, JSON.stringify(await rainState(page)));
  // pause / resume inside a pomodoro still work
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click();
  await sleep(200);
  const pausedOff = !(await rainPlaying(page));
  await page.getByRole('button', { name: 'RESUME', exact: true }).click();
  await sleep(300);
  check('[quiet] pause/resume inside a pomodoro still pause and resume rain', pausedOff && (await rainPlaying(page)));
  // manual switch to a break
  await page.getByRole('button', { name: 'Short Break', exact: true }).click();
  const offManual = await waitFor(async () => !(await rainPlaying(page)), 3000, 50);
  check('[quiet] manual switch to a break: rain fades out', offManual);
  await page.getByRole('button', { name: 'Pomodoro', exact: true }).click();
  await clickStart(page);
  await sleep(1200);
  check('[quiet] back with the pomodoro', await rainPlaying(page));
  // Skip
  await page.getByRole('button', { name: 'Skip to break', exact: true }).click();
  const offSkip = await waitFor(async () => !(await rainPlaying(page)), 3000, 50);
  check('[quiet] Skip into a break: rain fades out', offSkip);
  // setting switched off mid-break
  await page.getByRole('button', { name: 'Settings', exact: true }).first().click();
  const toggle = page.getByRole('button', { name: 'Pause Ambient Sounds on Breaks' });
  check('[quiet] settings toggle shown, on', (await toggle.getAttribute('aria-pressed')) === 'true');
  await toggle.click();
  const backOff = await waitFor(async () => (await rainState(page)).some((x) => !x.paused && Math.abs(x.vol - 0.6) < 0.001), 3000, 50);
  check('[quiet] setting switched off mid-break brings rain back', backOff);
  check('[quiet] setting persisted off', (await ls(page, 'pomodorian_settings')).pauseAmbientsOnBreak === false);
  await toggle.click(); // on again, mid-break, idle
  const offAgain = await waitFor(async () => !(await rainPlaying(page)), 3000, 50);
  check('[quiet] switched on again mid-break: rain fades out', offAgain);
  await page.keyboard.press('Escape');
  // +5 min during a quiet break brings the sound back (it is focus again)
  check('[quiet] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sQuietExtension(browser) {
  const { ctx, page, errors } = await newPage(browser, rainSeed({ pauseAmbientsOnBreak: true, autoStartBreaks: true, shortBreakDuration: 60 }), {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  const off = await waitFor(async () => !(await rainPlaying(page)), 9000, 50);
  check('[quiet+5] auto-started break: rain off after the alarm', off && (await isRunning(page)));
  await extendBtn(page).click();
  const back = await waitFor(async () => (await rainState(page)).some((x) => !x.paused && Math.abs(x.vol - 0.6) < 0.001), 3000, 50);
  check('[quiet+5] taking +5 min brings rain back with the focus', back);
  check('[quiet+5] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sQuietNeverDumb(browser) {
  const seed = rainSeed({ pauseAmbientsOnBreak: true, autoStartBreaks: true, neverDumbAutoOpen: true, longBreakDuration: 120 });
  seed.pomodorian_current_state = { mode: 'pomodoro', status: 'idle', timeRemaining: 4, totalTime: 4, pomodorosCompleted: 3, endTime: null, savedAt: Date.now() };
  const { ctx, page, errors } = await newPage(browser, seed, {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'longBreak', 12000);
  const opened = await waitFor(() => page.getByRole('dialog').first().isVisible(), 4000);
  check('[quiet+nd] Never Dumb opens on the long break', opened);
  await waitFor(async () => !(await rainPlaying(page)), 9000, 50);
  await page.keyboard.press('Escape');
  await sleep(1500);
  check('[quiet+nd] closing Never Dumb in a quiet break keeps rain off', !(await rainPlaying(page)));
  check('[quiet+nd] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sQuietHeld(browser) {
  const { ctx, page, errors } = await newPage(browser, rainSeed({ pauseAmbientsOnBreak: true, shortBreakDuration: 120 }), {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await sleep(500);
  await page.getByRole('button', { name: 'Skip to break', exact: true }).click();
  await waitFor(async () => !(await rainPlaying(page)), 3000, 50);
  await clickStart(page); // break running
  await sleep(300);
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click(); // timer pause holds ambients
  await page.keyboard.press('s');
  await page.getByRole('button', { name: 'Pause Ambient Sounds on Breaks' }).click();
  await sleep(1500);
  check('[held] setting off while the break is paused: rain stays paused with the timer', !(await rainPlaying(page)));
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'RESUME', exact: true }).click();
  const back = await waitFor(async () => (await rainState(page)).some((x) => !x.paused && Math.abs(x.vol - 0.6) < 0.001), 3000, 50);
  check('[held] resuming the timer then brings rain back (setting off)', back);
  const pauses = await page.evaluate(() => window.__log.filter((e) => e.ev === 'play' && /rain/.test(e.src)).length);
  check('[held] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

async function sQuietOff(browser) {
  const { ctx, page, errors } = await newPage(browser, rainSeed({}), {});
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  check('[off] default setting is off', (await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')).pauseAmbientsOnBreak)) === undefined);
  await clickStart(page);
  await waitFor(async () => (await modeOf(page)) === 'shortBreak', 12000);
  const ring = await lastAlarmPlay(page);
  await sleep(700);
  const ducked = (await rainState(page)).some((x) => !x.paused && x.vol < 0.13);
  await sleep(6000);
  const st = await rainState(page);
  check('[off] alarm ducks rain, then rain is back at 0.6 in the break (today)', ducked && st.some((x) => !x.paused && Math.abs(x.vol - 0.6) < 0.001), JSON.stringify(st));
  const pausesSinceRing = await page.evaluate((t) => window.__log.filter((e) => e.ev === 'pause' && /rain/.test(e.src) && e.t >= t).length, ring.t);
  check('[off] rain never paused by the break', pausesSinceRing === 0);
  await page.getByRole('button', { name: 'Pomodoro', exact: true }).click();
  await sleep(1500);
  check('[off] manual switch keeps rain playing', await rainPlaying(page));
  await openSounds(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).first().click();
  check('[off] toggle shown, off', (await page.getByRole('button', { name: 'Pause Ambient Sounds on Breaks' }).getAttribute('aria-pressed')) === 'false');
  check('[off] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// ---------------- Locales at 320 px + screenshots ----------------

async function showOffer(browser, { lang, width, height, theme, name, full }) {
  const seed = baseSeed({ language: lang, theme, pauseAmbientsOnBreak: true }, {
    pomodorian_current_state: { mode: 'pomodoro', status: 'running', timeRemaining: 3, totalTime: 1500, pomodorosCompleted: 1, endTime: Date.now() + 4000, savedAt: Date.now() },
    pomodorian_ambients: { rain: { active: true, volume: 0.6 } },
  });
  const { ctx, page, errors } = await newPage(browser, seed, { viewport: { width, height } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const btn = extendBtn(page);
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await sleep(500);
  const box = await btn.boundingBox();
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  const label = await btn.textContent();
  const aria = await btn.getAttribute('aria-label');
  await page.mouse.move(0, height - 1);
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: !!full, clip: full ? undefined : { x: 0, y: 0, width, height: Math.min(height, 760) } });
  // Settings at the same width
  await page.getByRole('button').filter({ has: page.locator('svg') }).first(); // noop
  await page.keyboard.press('s');
  await sleep(400);
  const dialog = page.getByRole('dialog').first();
  const toggleRow = dialog.locator('button[aria-pressed]').nth(3); // 3 automation toggles + quiet toggle
  await toggleRow.scrollIntoViewIfNeeded();
  const tBox = await toggleRow.boundingBox();
  const tAria = await toggleRow.getAttribute('aria-label');
  const sw2 = await page.evaluate(() => document.documentElement.scrollWidth);
  await page.screenshot({ path: path.join(SHOTS, `${name}-settings.png`) });
  await ctx.close();
  return { box, sw, sw2, label, aria, tBox, tAria, errors };
}

const EXPECT = {
  fr: { label: '+5 min', aria: 'Continuer 5 minutes de plus', quiet: "Couper l'ambiance pendant les pauses" },
  de: { label: '+5 Min.', aria: '5 Minuten weiter fokussieren', quiet: 'Ambient-Sounds in Pausen stoppen' },
  ja: { label: '+5分', aria: 'あと5分集中する', quiet: '休憩中は環境音を止める' },
};

async function sLocales(browser) {
  for (const lang of ['fr', 'de', 'ja']) {
    const r = await showOffer(browser, { lang, width: 320, height: 760, theme: 'dark', name: `loc-${lang}-320` });
    const e = EXPECT[lang];
    check(`[${lang} 320] +5 button translated (text + aria-label)`, r.label === e.label && r.aria === e.aria, `${r.label} | ${r.aria}`);
    check(`[${lang} 320] button within the viewport, >=40px tall, no horizontal scroll`, r.box && r.box.x >= 0 && r.box.x + r.box.width <= 320 && r.box.height >= 40 && r.sw <= 320, JSON.stringify({ box: r.box, sw: r.sw }));
    check(`[${lang} 320] quiet breaks toggle translated and inside the modal`, r.tAria === e.quiet && r.tBox && r.tBox.x + r.tBox.width <= 320 && r.sw2 <= 320, JSON.stringify({ tAria: r.tAria, tBox: r.tBox, sw2: r.sw2 }));
    check(`[${lang} 320] no uncaught page errors`, r.errors.length === 0, r.errors.join(' | '));
  }
}

async function sShots(browser) {
  for (const theme of ['dark', 'light']) {
    for (const [w, h, tag] of [[390, 844, '390'], [320, 700, '320'], [1280, 900, 'desktop']]) {
      const r = await showOffer(browser, { lang: 'en', width: w, height: h, theme, name: `shot-${tag}-${theme}` });
      check(`[shot ${tag} ${theme}] button visible, >=40px, no horizontal scroll`, r.box && r.box.height >= 40 && r.sw <= w, JSON.stringify({ box: r.box, sw: r.sw }));
    }
  }
}

(async () => {
  const browser = await chromium.launch();
  const only = process.argv[2];
  const all = { sBasic, sLongBreak, sDismissals, sAbandon, sAutoStart, sReload, sQuietOn, sQuietExtension, sQuietNeverDumb, sQuietHeld, sQuietOff, sLocales, sShots };
  for (const [name, fn] of Object.entries(all)) {
    if (only && !only.split(',').includes(name)) continue;
    try { await fn(browser); } catch (e) { check(`${name} crashed`, false, e.message.split('\n')[0]); }
  }
  await browser.close();
  const pass = results.filter((r) => r.startsWith('PASS')).length;
  const fail = results.filter((r) => r.startsWith('FAIL')).length;
  fs.writeFileSync(path.join(__dirname, 'flow-results.txt'), results.join('\n') + `\n${pass} passed, ${fail} failed\n`);
  console.log(`${pass} passed, ${fail} failed`);
})();

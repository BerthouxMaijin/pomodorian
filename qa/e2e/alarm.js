// Alarm behaviour checks for the useSound changes. Run: NODE_PATH=$(npm root -g) node alarm-test.js
const { chromium } = require('playwright');
const BASE = 'http://localhost:3100';
const results = [];
const check = (name, ok, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isAlarm = (src) => /alarm-/.test(src || '');
const isAmbient = (src) => /\/sounds\//.test(src || '') && !isAlarm(src) && !/tick-start/.test(src);

// Injected before any page script: tag every Audio element and log new / play / pause.
const INSTRUMENT = () => {
  window.__hidden = false;
  Object.defineProperty(Document.prototype, 'visibilityState', { configurable: true, get() { return window.__hidden ? 'hidden' : 'visible'; } });
  Object.defineProperty(Document.prototype, 'hidden', { configurable: true, get() { return !!window.__hidden; } });
  const log = (window.__log = []);
  const els = (window.__els = []);
  const t0 = performance.timeOrigin;
  const now = () => Math.round(t0 + performance.now());
  const Orig = window.Audio;
  let n = 0;
  function Wrapped(src) {
    const a = src === undefined ? new Orig() : new Orig(src);
    a.__id = ++n;
    els.push(a);
    log.push({ t: now(), ev: 'new', id: a.__id, src: String(src), gesture: navigator.userActivation.isActive });
    return a;
  }
  Wrapped.prototype = Orig.prototype;
  window.Audio = Wrapped;
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    const entry = { t: now(), ev: 'play', id: this.__id, src: this.src, vol: this.volume, muted: this.muted, gesture: navigator.userActivation.isActive };
    log.push(entry);
    const p = play.call(this);
    p.then(() => (entry.result = 'ok'), (e) => (entry.result = e.name));
    return p;
  };
  const pause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.pause = function () {
    log.push({ t: now(), ev: 'pause', id: this.__id, src: this.src });
    return pause.call(this);
  };
  window.__snap = () => els.map((a) => ({ id: a.__id, src: a.src, vol: a.volume, paused: a.paused, muted: a.muted, ct: a.currentTime, dur: a.duration }));
  // Sample playing elements every 50 ms for volume curves.
  window.__samples = [];
  setInterval(() => window.__samples.push({ t: now(), s: window.__snap().filter((x) => !x.paused) }), 50);
};

async function newPage(browser, seed) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
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
  return { ctx, page, errors };
}

const settings = (extra) => ({ pomodorian_settings: { pomodoroDuration: 6, autoStartBreaks: false, autoStartPomodoros: false, alarmSound: 'gentle', alarmVolume: 0.7, ...extra } });
const getLog = (page) => page.evaluate(() => window.__log);
const alarmPlays = (log, from = 0) => log.filter((e) => e.ev === 'play' && isAlarm(e.src) && !e.muted && e.t >= from);
const startBtn = (page) => page.getByRole('button', { name: /^START$/ });
async function clickStart(page) {
  const box = await startBtn(page).boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  // park the mouse without generating input later
  return Date.now();
}
async function waitForRing(page, n = 1, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const log = await getLog(page);
    if (alarmPlays(log).length >= n) return log;
    await sleep(100);
  }
  return getLog(page);
}

// ---------- Scenarios ----------

// Hidden tab, nobody there: 5 rings, 8 s apart, ducked rain, primed elements reused.
async function sHiddenRepeat(browser) {
  const { ctx, page, errors } = await newPage(browser, { ...settings(), pomodorian_ambients: { rain: { active: true, volume: 0.6 } } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const tClick = await clickStart(page);
  await page.evaluate(() => (window.__hidden = true));
  let log = await getLog(page);
  const clickWindow = log.filter((e) => e.t >= tClick - 200 && e.t <= tClick + 1500);
  const primedNew = clickWindow.filter((e) => e.ev === 'new' && isAlarm(e.src));
  const primedPlays = clickWindow.filter((e) => e.ev === 'play' && isAlarm(e.src));
  check('START click creates the 3 alarm elements inside the gesture', primedNew.length === 3 && primedNew.every((e) => e.gesture), primedNew.map((e) => `${e.id}:${e.src.split('/').pop()}:g=${e.gesture}`).join(' '));
  check('priming plays are muted and inside the gesture', primedPlays.length === 3 && primedPlays.every((e) => e.muted && e.gesture), primedPlays.map((e) => `${e.id} muted=${e.muted} g=${e.gesture} ${e.result}`).join(' '));
  await sleep(1000);
  const afterPrime = await page.evaluate(() => window.__snap().filter((x) => /alarm-/.test(x.src)));
  check('primed alarm elements are paused, rewound and unmuted again', afterPrime.length === 3 && afterPrime.every((x) => x.paused && x.ct === 0 && !x.muted), JSON.stringify(afterPrime.map((x) => [x.id, x.paused, x.ct, x.muted])));

  log = await waitForRing(page, 1, 15000);
  const first = alarmPlays(log)[0];
  check('alarm rings at completion', !!first, first && `t+${first.t - tClick}ms`);
  if (!first) { await ctx.close(); return; }
  const newAtCompletion = log.filter((e) => e.ev === 'new' && isAlarm(e.src) && e.t >= first.t - 1000);
  const primedIds = primedNew.map((e) => e.id);
  check('completion reuses a primed element (no new Audio for the alarm)', newAtCompletion.length === 0 && primedIds.includes(first.id) && first.src.endsWith('alarm-gentle.mp3'), `id=${first.id} primed=${primedIds} newAtCompletion=${newAtCompletion.length}`);
  check('alarm plays at the configured volume (0.7), unmuted', Math.abs(first.vol - 0.7) < 1e-6 && !first.muted, `vol=${first.vol} muted=${first.muted} result=${first.result}`);
  await sleep(700);
  const ct = await page.evaluate((id) => window.__els.find((a) => a.__id === id).currentTime, first.id);
  check('alarm element is actually playing (currentTime advances)', ct > 0.3, `currentTime=${ct.toFixed(2)} after 700ms`);
  // Duck check during the ring
  const samples = await page.evaluate(() => window.__samples);
  const during = samples.filter((s) => s.t > first.t + 450 && s.t < first.t + 2500).flatMap((s) => s.s.filter((x) => /rain/.test(x.src)));
  const before = samples.filter((s) => s.t > first.t - 1500 && s.t < first.t - 50).flatMap((s) => s.s.filter((x) => /rain/.test(x.src)));
  const maxDuring = Math.max(...during.map((x) => x.vol));
  const beforeVol = before.length ? before[before.length - 1].vol : NaN;
  check('rain ducks to ~20% while the alarm rings', beforeVol > 0.59 && maxDuring < 0.13 && during.length >= 4, `before=${beforeVol} maxDuring=${maxDuring.toFixed(3)} n=${during.length}`);
  // duck ramp duration
  const ramp = samples.filter((s) => s.t >= first.t - 50 && s.t <= first.t + 600).map((s) => [s.t - first.t, (s.s.find((x) => /rain/.test(x.src)) || {}).vol]);
  const reached = ramp.find(([, v]) => v !== undefined && v < 0.125);
  check('duck is a smooth ramp of about 300 ms', reached && reached[0] >= 200 && reached[0] <= 500 && ramp.some(([, v]) => v > 0.2 && v < 0.55), `ramp=${ramp.map(([t, v]) => `${t}:${v && v.toFixed(2)}`).join(' ')}`);

  // Wait out the whole sequence: 5 rings at 0, 8, 16, 24, 32 s, last one ends ~35.5 s.
  await sleep(41000);
  log = await getLog(page);
  const plays = alarmPlays(log);
  const gaps = plays.slice(1).map((p, i) => p.t - plays[i].t);
  check('hidden + no input: exactly 5 rings', plays.length === 5, `rings=${plays.length}`);
  check('rings are ~8 s apart', gaps.length === 4 && gaps.every((g) => g > 7700 && g < 8600), gaps.join(','));
  const snap = await page.evaluate(() => window.__snap());
  const rain = snap.filter((x) => /rain/.test(x.src) && !x.paused);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_ambients')));
  check('after the last ring, rain is back at its stored volume', rain.length === 1 && Math.abs(rain[0].vol - 0.6) < 1e-6, JSON.stringify(rain.map((x) => x.vol)));
  check('stored ambient volume untouched', stored.rain.volume === 0.6 && stored.rain.active === true, JSON.stringify(stored));
  const alarmsPlaying = snap.filter((x) => /alarm-/.test(x.src) && !x.paused);
  check('nothing still ringing after the sequence', alarmsPlaying.length === 0);
  check('[hidden-repeat] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Visible and recent input: one ring only.
async function sPresent(browser) {
  const { ctx, page, errors } = await newPage(browser, settings());
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await sleep(4000);
  await page.mouse.move(50, 700); // pointer input ~2 s before completion
  const log = await waitForRing(page, 1, 10000);
  await sleep(12000);
  const plays = alarmPlays(await getLog(page));
  check('visible + input in the last seconds: one ring only', plays.length === 1, `rings=${plays.length}`);
  check('[present] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// A reaction stops the repeats: click, key.
async function sReact(browser, kind) {
  const { ctx, page, errors } = await newPage(browser, { ...settings(), pomodorian_ambients: { forest: { active: true, volume: 0.5 } } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await page.evaluate(() => (window.__hidden = true));
  const log = await waitForRing(page, 1, 15000);
  const first = alarmPlays(log)[0];
  await sleep(1000);
  const tReact = Date.now();
  if (kind === 'click') { await page.mouse.down(); await page.mouse.up(); } else await page.keyboard.press('Shift');
  await sleep(14000);
  const after = await getLog(page);
  const plays = alarmPlays(after);
  const snap = await page.evaluate(() => window.__snap());
  const forest = snap.filter((x) => /forest/.test(x.src) && !x.paused);
  check(`a ${kind} stops the repeats (no ring after it)`, !!first && plays.length === 1, `rings=${plays.length}`);
  check(`after the ${kind}, the current ring plays out and the ambient comes back to 0.5`, forest.length === 1 && Math.abs(forest[0].vol - 0.5) < 1e-6, JSON.stringify(forest.map((x) => x.vol)));
  check(`[react-${kind}] no uncaught page errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Starting the next timer cuts the alarm at once.
async function sNewTimer(browser) {
  const { ctx, page, errors } = await newPage(browser, settings());
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await clickStart(page);
  await page.evaluate(() => (window.__hidden = true));
  const log = await waitForRing(page, 1, 15000);
  const first = alarmPlays(log)[0];
  await sleep(800);
  await page.evaluate(() => (window.__hidden = false));
  const tStart = await clickStart(page); // starts the short break
  await sleep(150);
  const snap = await page.evaluate(() => window.__snap().filter((x) => /alarm-/.test(x.src) && !x.paused));
  await sleep(12000);
  const plays = alarmPlays(await getLog(page));
  const running = await page.getByRole('button', { name: /^PAUSE$/ }).isVisible();
  check('starting a new timer silences the ringing alarm at once', !!first && snap.length === 0, `playing after START=${snap.length}`);
  check('starting a new timer cancels the repeats', plays.length === 1 && running, `rings=${plays.length} running=${running}`);
  check('[new-timer] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Ducking while a rain crossfade and a lofi hand-off happen during the ring.
async function sCrossfade(browser) {
  const { ctx, page, errors } = await newPage(browser, { ...settings({ pomodoroDuration: 8 }), pomodorian_ambients: { rain: { active: true, volume: 0.6 }, lofi: { active: true, volume: 0.5 } } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const tClick = await clickStart(page);
  await page.evaluate(() => (window.__hidden = true));
  // Completion at ~8 s. Put rain 1.2 s and lofi 3 s from their ends at ~7 s so
  // the rain crossfade lands inside the duck ramp and the lofi hand-off spans the ring.
  await sleep(Math.max(0, tClick + 7000 - Date.now()));
  await page.evaluate(() => {
    for (const a of window.__els) {
      if (a.paused || !isFinite(a.duration)) continue;
      if (/rain/.test(a.src)) a.currentTime = a.duration - 1.2;
      if (/lofi/.test(a.src)) a.currentTime = a.duration - 3;
    }
  });
  const log = await waitForRing(page, 1, 10000);
  const first = alarmPlays(log)[0];
  // Stop repeats right after the first ring starts so the sequence ends after it.
  await sleep(600);
  await page.keyboard.press('Shift');
  await sleep(12000);
  const samples = await page.evaluate(() => window.__samples);
  const fullLog = await getLog(page);
  const lastAlarmPause = first && first.t + 3500; // gentle lasts 3.45 s
  const duringRing = samples.filter((s) => s.t > first.t + 400 && s.t < first.t + 3300).flatMap((s) => s.s.filter((x) => /rain|lofi/.test(x.src)));
  const maxRainDuring = Math.max(0, ...duringRing.filter((x) => /rain/.test(x.src)).map((x) => x.vol));
  const maxLofiDuring = Math.max(0, ...duringRing.filter((x) => /lofi/.test(x.src)).map((x) => x.vol));
  const rainNews = fullLog.filter((e) => e.ev === 'new' && /rain/.test(e.src) && e.t > tClick + 6000);
  const lofiNews = fullLog.filter((e) => e.ev === 'new' && /lofi/.test(e.src) && e.t > tClick + 6000);
  const rainSwap = fullLog.filter((e) => e.ev === 'play' && /rain/.test(e.src) && e.t > tClick + 6500);
  const lofiSwap = fullLog.filter((e) => e.ev === 'play' && /lofi/.test(e.src) && e.t > tClick + 6500);
  check('a rain crossfade happened around the alarm', rainSwap.length >= 1, `rain plays after 6.5s=${rainSwap.map((e) => e.t - first.t).join(',')} news=${rainNews.length}`);
  check('a lofi hand-off happened around the alarm', lofiSwap.length >= 1, `lofi plays=${lofiSwap.map((e) => e.t - first.t).join(',')}`);
  check('during the ring, rain and lofi stay ducked through the crossfade and hand-off', maxRainDuring <= 0.6 * 0.2 + 1e-6 && maxLofiDuring <= 0.5 * 0.2 + 1e-6, `maxRain=${maxRainDuring.toFixed(3)} maxLofi=${maxLofiDuring.toFixed(3)}`);
  const snap = await page.evaluate(() => window.__snap().filter((x) => !x.paused));
  const rain = snap.filter((x) => /rain/.test(x.src));
  const lofi = snap.filter((x) => /lofi/.test(x.src));
  check('afterwards rain is back at 0.6 and lofi at 0.5 (one element each)', rain.length === 1 && lofi.length === 1 && Math.abs(rain[0].vol - 0.6) < 1e-6 && Math.abs(lofi[0].vol - 0.5) < 1e-6, `rain=${rain.map((x) => x.vol)} lofi=${lofi.map((x) => x.vol)}`);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_ambients')));
  check('stored mix untouched after crossfade + duck', stored.rain.volume === 0.6 && stored.lofi.volume === 0.5, JSON.stringify(stored));
  check('[crossfade] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Settings preview and changing the alarm sound.
async function sSettings(browser) {
  const { ctx, page, errors } = await newPage(browser, settings({ pomodoroDuration: 1500 }));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Settings' });
  let t = Date.now();
  await dialog.locator('select').filter({ has: page.locator('option[value="bell"]') }).selectOption('bell');
  await sleep(600);
  let log = await getLog(page);
  let p = alarmPlays(log, t);
  check('choosing an alarm sound plays it once', p.length === 1 && p[0].src.endsWith('alarm-bell.mp3') && Math.abs(p[0].vol - 0.7) < 1e-6, p.map((e) => `${e.src.split('/').pop()} vol=${e.vol} ${e.result}`).join(' '));
  const bellId = p[0] && p[0].id;
  // Slider: drag and release
  const slider = dialog.locator('input[type=range]');
  const box = await slider.boundingBox();
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
  await page.mouse.down();
  t = Date.now();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2, { steps: 5 });
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 5 });
  await sleep(200);
  log = await getLog(page);
  const duringDrag = alarmPlays(log, t).length;
  await page.mouse.up();
  await sleep(500);
  log = await getLog(page);
  p = alarmPlays(log, t);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')));
  check('no preview while dragging the volume slider', duringDrag === 0, `plays during drag=${duringDrag}`);
  check('releasing the volume slider plays the selected alarm once at the new volume', p.length === 1 && p[0].src.endsWith('alarm-bell.mp3') && Math.abs(p[0].vol - stored.alarmVolume) < 1e-6 && stored.alarmVolume > 0.8, p.map((e) => `vol=${e.vol}`).join(' ') + ` stored=${stored.alarmVolume}`);
  // Release outside the slider
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
  await page.mouse.down();
  t = Date.now();
  await page.mouse.move(box.x + box.width * 0.2, box.y + 120, { steps: 6 });
  await page.mouse.up();
  await sleep(400);
  p = alarmPlays(await getLog(page), t);
  const stored2 = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')));
  check('releasing the slider outside its box still previews', p.length === 1 && Math.abs(p[0].vol - stored2.alarmVolume) < 1e-6, p.map((e) => `vol=${e.vol}`).join(' ') + ` stored=${stored2.alarmVolume}`);
  // Keyboard
  await slider.focus();
  t = Date.now();
  await page.keyboard.press('ArrowRight');
  await sleep(300);
  p = alarmPlays(await getLog(page), t);
  const stored3 = await page.evaluate(() => JSON.parse(localStorage.getItem('pomodorian_settings')));
  check('arrow key on the slider previews at the new volume', p.length === 1 && Math.abs(p[0].vol - stored3.alarmVolume) < 1e-6, p.map((e) => `vol=${e.vol}`).join(' ') + ` stored=${stored3.alarmVolume}`);
  await page.keyboard.press('Escape');
  // Now shorten the pomodoro and complete: the bell must ring, same element as the preview.
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('pomodorian_settings')); s.pomodoroDuration = 5; localStorage.setItem('pomodorian_settings', JSON.stringify(s)); });
  // settings live in React state; change duration through the field instead
  await page.getByRole('button', { name: 'Settings' }).click();
  const field = page.getByRole('dialog').getByRole('spinbutton').first();
  await field.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('1');
  await page.keyboard.press('Escape');
  await sleep(200);
  const shown = await page.locator('[role=timer] span').first().innerText();
  const tStart = await clickStart(page);
  await sleep(1500);
  const shown2 = await page.locator('[role=timer] span').first().innerText();
  check('settings: pomodoro shortened to 1:00 and running', shown === '01:00' && shown2 !== '01:00', `${shown} -> ${shown2}`);
  await page.evaluate(() => (window.__hidden = true));
  const nBefore = alarmPlays(await getLog(page)).length;
  log = await waitForRing(page, nBefore + 1, 75000);
  const completion = alarmPlays(log, tStart + 1000)[0];
  const newAlarm = log.filter((e) => e.ev === 'new' && isAlarm(e.src) && completion && e.t > completion.t - 1000);
  check('after changing the sound to Bell, completion rings the Bell', completion && completion.src.endsWith('alarm-bell.mp3') && Math.abs(completion.vol - stored3.alarmVolume) < 1e-6, completion && `${completion.src.split('/').pop()} vol=${completion.vol} t+${completion.t - tStart}`);
  check('the Bell element at completion is the one created and played in a gesture before (no new Audio)', completion && completion.id === bellId && newAlarm.length === 0, `id=${completion && completion.id} previewId=${bellId}`);
  check('[settings] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Timer tool page: rings, repeats, START stops it.
async function sToolPage(browser) {
  const { ctx, page, errors } = await newPage(browser, { pomodorian_settings: { alarmSound: 'classic', alarmVolume: 0.8 } });
  await page.goto(BASE + '/1-minute-timer', { waitUntil: 'networkidle' });
  const btn = page.getByRole('button', { name: /^Start$/ });
  const box = await btn.boundingBox();
  const tClick = Date.now();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  let log = await getLog(page);
  const primed = log.filter((e) => e.ev === 'play' && isAlarm(e.src) && e.muted && e.gesture);
  check('tool page: Start primes the alarm elements in the gesture', primed.length === 3, `primed=${primed.length}`);
  log = await waitForRing(page, 2, 85000);
  const plays = alarmPlays(log);
  check('tool page: alarm rings at the end, at the saved sound and volume', plays.length >= 1 && plays[0].src.endsWith('alarm-classic.mp3') && Math.abs(plays[0].vol - 0.8) < 1e-6, plays[0] && `${plays[0].src.split('/').pop()} vol=${plays[0].vol} t+${plays[0].t - tClick}ms result=${plays[0].result}`);
  check('tool page: unattended alarm repeats', plays.length >= 2, `rings so far=${plays.length}`);
  const btn2 = page.getByRole('button', { name: /^Start$/ });
  const b2 = await btn2.boundingBox();
  await page.mouse.click(b2.x + b2.width / 2, b2.y + b2.height / 2);
  await sleep(150);
  const playing = await page.evaluate(() => window.__snap().filter((x) => /alarm-/.test(x.src) && !x.paused).length);
  const n = alarmPlays(await getLog(page)).length;
  await sleep(10000);
  const n2 = alarmPlays(await getLog(page)).length;
  check('tool page: Start (stopAlarm) silences it and no ring follows', playing === 0 && n2 === n, `playing=${playing} rings ${n} -> ${n2}`);
  check('[tool page] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Unmount: navigating away mid-sequence leaves nothing ringing.
async function sUnmount(browser) {
  const { ctx, page, errors } = await newPage(browser, { pomodorian_settings: { alarmSound: 'gentle', alarmVolume: 0.5 } });
  await page.goto(BASE + '/1-minute-timer', { waitUntil: 'networkidle' });
  const btn = page.getByRole('button', { name: /^Start$/ });
  const box = await btn.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.evaluate(() => (window.__hidden = true));
  await waitForRing(page, 1, 85000);
  // client-side navigation unmounts EmbeddedTimer (same document, so the log survives)
  await page.evaluate(() => (window.__hidden = false));
  const link = page.locator('a[href="/"]').first();
  const tNav = Date.now();
  await link.evaluate((a) => a.click());
  await page.waitForURL(BASE + '/', { timeout: 10000 }).catch(() => {});
  await sleep(12000);
  const log = await getLog(page);
  const sameDoc = log.length > 0;
  const later = alarmPlays(log, tNav + 200);
  const playing = await page.evaluate(() => window.__snap().filter((x) => /alarm-/.test(x.src) && !x.paused).length);
  check('unmount (client navigation) mid-sequence: nothing keeps ringing', sameDoc && later.length === 0 && playing === 0, `sameDoc=${sameDoc} ringsAfterNav=${later.length} playing=${playing} url=${page.url()}`);
  check('[unmount] no uncaught page errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  const only = process.argv[2];
  const all = { sHiddenRepeat, sPresent, sReactClick: (b) => sReact(b, 'click'), sReactKey: (b) => sReact(b, 'key'), sNewTimer, sCrossfade, sSettings, sToolPage, sUnmount };
  const pick = only ? only.split(',').map((k) => all[k]) : Object.values(all);
  await Promise.all(pick.map((f) => f(browser).catch((e) => check(`scenario crashed: ${f.name}`, false, e.message))));
  console.log(results.join('\n'));
  console.log(`\n${results.filter((r) => r.startsWith('PASS')).length} pass, ${results.filter((r) => r.startsWith('FAIL')).length} fail`);
  await browser.close();
})();

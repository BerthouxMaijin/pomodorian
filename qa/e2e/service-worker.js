// Usage: node sw-verify.js [phase]   phase = main (default) | deploy
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'http://localhost:3100';
const STATE = __dirname + '/state.json';
const results = [];
const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`); };
const time = (page) => page.locator('[role=timer] span').first().innerText();
const secs = (t) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
const TASKS = [
  { id: 'a1', title: 'Write the Q4 investor update', estimatedPomodoros: 3, completedPomodoros: 1, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 },
];
const phase = process.argv[2] || 'main';

(async () => {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
  const userDataStateExists = fs.existsSync(STATE);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  const swRequests = [];
  ctx.on('request', (r) => { if (r.serviceWorker()) swRequests.push(r.url()); });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  const responses = [];
  page.on('response', (r) => responses.push({ url: r.url(), status: r.status(), sw: r.fromServiceWorker() }));

  const swState = () => page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return { active: reg?.active?.state ?? null, scope: reg?.scope ?? null, controlled: !!navigator.serviceWorker.controller, caches: await caches.keys() };
  });
  const buildId = () => page.evaluate(() => {
    const s = [...document.scripts].map((x) => x.src).find((u) => /\/_next\/static\/chunks\//.test(u));
    return document.documentElement.innerHTML.match(/"buildId":"([^"]+)"|\\"b\\":\\"([^\\]+)\\"/)?.slice(1).find(Boolean) ?? s;
  });

  if (phase === 'main') {
    // ---- 1. First visit: registers and activates
    await page.goto(BASE + '/');
    await page.evaluate((t) => {
      localStorage.setItem('ga-consent', 'denied');
      localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
      localStorage.setItem('pomodorian_tasks', JSON.stringify(t));
    }, TASKS);
    for (let i = 0; i < 60; i++) {
      if ((await swState()).active === 'activated') break;
      await page.waitForTimeout(250);
    }
    let st = await swState();
    check('SW registers and activates on first visit, scope /', st.active === 'activated' && st.scope === BASE + '/', JSON.stringify(st));
    await page.waitForTimeout(2500); // let the cache-urls message finish
    const keys = await page.evaluate(async () => {
      const out = {};
      for (const k of await caches.keys()) out[k] = (await (await caches.open(k)).keys()).map((r) => new URL(r.url).pathname + new URL(r.url).search);
      return out;
    });
    const staticKeys = keys['pomodorian-static-v2'] || [];
    check('precached: / page, timer-worker, alarms, build files', (keys['pomodorian-pages-v2'] || []).includes('/') && staticKeys.includes('/timer-worker.js') && (keys['pomodorian-audio-v2'] || []).length === 4 && staticKeys.filter((k) => k.startsWith('/_next/static/')).length > 5,
      `pages=${(keys['pomodorian-pages-v2'] || []).join(',')} static=${staticKeys.length} audio=${(keys['pomodorian-audio-v2'] || []).length}`);
    const allKeys = Object.values(keys).flat();
    check('no ambient MP3, /api or RSC entry in any cache', !allKeys.some((k) => /\/sounds\/(rain|forest|fireplace|cafe|lofi)/.test(k) || k.startsWith('/api/') || k.includes('_rsc')), `${allKeys.length} entries`);

    // controlled reload
    await page.reload({ waitUntil: 'networkidle' });
    st = await swState();
    check('page is controlled after reload', st.controlled);

    // ---- 2. Offline
    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const offlineTitle = await page.title();
    const taskVisible = await page.getByText('Write the Q4 investor update').first().isVisible().catch(() => false);
    check('offline reload shows the app with tasks', /Pomodorian/.test(offlineTitle) && taskVisible && (await time(page)) === '25:00', offlineTitle);
    await page.getByRole('button', { name: /^START$/ }).click();
    await page.waitForTimeout(3200);
    const t1 = secs(await time(page));
    const workers = page.workers().map((w) => w.url());
    check('offline: timer counts down', t1 <= 1497 && t1 >= 1495, String(t1));
    check('offline: heartbeat from /timer-worker.js', workers.some((u) => u.endsWith('/timer-worker.js')), workers.join(','));
    // alarm plays offline
    const offAlarm = await page.evaluate(async () => {
      const a = new Audio('/sounds/alarm-gentle.mp3'); a.muted = true;
      try { await a.play(); } catch (e) { return { err: String(e) }; }
      const c0 = a.currentTime; await new Promise((r) => setTimeout(r, 800));
      return { readyState: a.readyState, c0, c1: a.currentTime, duration: a.duration, error: a.error && a.error.code };
    });
    check('offline: alarm sound loads and plays from cache', !offAlarm.err && offAlarm.readyState >= 2 && offAlarm.c1 > offAlarm.c0, JSON.stringify(offAlarm));
    // a page never visited, offline
    const r404 = await page.goto(BASE + '/privacy').catch((e) => e);
    const offText = await page.locator('h1').first().innerText().catch(() => '');
    check('offline: unvisited page shows the offline notice', /offline/i.test(offText), offText);
    await page.goto(BASE + '/');
    await page.getByRole('button', { name: 'Reset timer' }).click().catch(() => {});
    await ctx.setOffline(false);

    // ---- 3. Online: HTML from network
    swRequests.length = 0;
    await page.reload({ waitUntil: 'networkidle' });
    check('online again: SW fetched / from the network', swRequests.some((u) => u === BASE + '/'), swRequests.filter((u) => !u.includes('_next')).join(','));

    // ---- 4. Notification on completion
    await ctx.grantPermissions(['notifications'], { origin: BASE });
    // Android Chrome behaviour: the constructor throws. The SW path must be used.
    await ctx.addInitScript(() => {
      const Real = window.Notification;
      class Throwing { constructor() { throw new TypeError("Failed to construct 'Notification': Illegal constructor. Use ServiceWorkerRegistration.showNotification() instead."); } }
      Object.defineProperty(Throwing, 'permission', { get: () => Real.permission });
      Throwing.requestPermission = Real.requestPermission.bind(Real);
      window.Notification = Throwing;
    });
    await page.evaluate(() => {
      const now = Date.now();
      localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 3, totalTime: 1500, pomodorosCompleted: 0, endTime: now + 3000, savedAt: now }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    const notes = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return (await reg.getNotifications()).map((n) => ({ title: n.title, body: n.body, tag: n.tag, icon: n.icon }));
    });
    check('pomodoro completion -> registration.showNotification', notes.length === 1 && notes[0].tag === 'pomodorian-timer' && notes[0].body === 'Great work! Time for a break.', JSON.stringify(notes));
    // break completion replaces it (same tag)
    await page.evaluate(() => {
      const now = Date.now();
      localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'shortBreak', status: 'running', timeRemaining: 2, totalTime: 300, pomodorosCompleted: 1, endTime: now + 2000, savedAt: now }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    const notes2 = await page.evaluate(async () => (await (await navigator.serviceWorker.getRegistration()).getNotifications()).map((n) => n.body));
    check('break completion replaces it (one notification, same tag)', notes2.length === 1 && notes2[0] === "Break is over. Let's focus!", JSON.stringify(notes2));
    // notificationsEnabled=false -> nothing
    await page.evaluate(async () => {
      for (const n of await (await navigator.serviceWorker.getRegistration()).getNotifications()) n.close();
      const s = JSON.parse(localStorage.getItem('pomodorian_settings') || '{}');
      s.notificationsEnabled = false; localStorage.setItem('pomodorian_settings', JSON.stringify(s));
      const now = Date.now();
      localStorage.setItem('pomodorian_current_state', JSON.stringify({ mode: 'pomodoro', status: 'running', timeRemaining: 2, totalTime: 1500, pomodorosCompleted: 1, endTime: now + 2000, savedAt: now }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    const notes3 = await page.evaluate(async () => (await (await navigator.serviceWorker.getRegistration()).getNotifications()).length);
    check('notificationsEnabled=false -> no notification', notes3 === 0, String(notes3));
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('pomodorian_settings') || '{}'); s.notificationsEnabled = true; localStorage.setItem('pomodorian_settings', JSON.stringify(s)); localStorage.removeItem('pomodorian_current_state'); });
    await page.reload({ waitUntil: 'networkidle' });

    // ---- 5. Audio with the worker in control
    responses.length = 0;
    const audio = await page.evaluate(async () => {
      const run = async (src) => {
        const a = new Audio(src); a.muted = true; a.preload = 'auto';
        try { await a.play(); } catch (e) { return { err: String(e) }; }
        const c0 = a.currentTime; await new Promise((r) => setTimeout(r, 1200));
        a.currentTime = Math.min(5, a.duration / 2); // seek: forces another Range request
        await new Promise((r) => setTimeout(r, 600));
        const out = { readyState: a.readyState, c0, c1: a.currentTime, duration: a.duration, error: a.error && a.error.code };
        a.pause(); return out;
      };
      return { alarm: await run('/sounds/alarm-bell.mp3'), ambient: await run('/sounds/rain.mp3') };
    });
    check('alarm sound loads and plays (SW in control)', !audio.alarm.err && audio.alarm.readyState >= 2 && audio.alarm.c1 > audio.alarm.c0, JSON.stringify(audio.alarm));
    check('ambient sound loads and plays (SW in control)', !audio.ambient.err && audio.ambient.readyState >= 2 && audio.ambient.c1 > audio.ambient.c0, JSON.stringify(audio.ambient));
    const audioResp = responses.filter((r) => r.url.includes('/sounds/'));
    const ambientResp = audioResp.filter((r) => r.url.includes('rain'));
    const alarmResp = audioResp.filter((r) => r.url.includes('alarm-bell'));
    check('ambient: Range requests 206 straight from network (not SW)', ambientResp.length > 0 && ambientResp.every((r) => (r.status === 206 || r.status === 200) && !r.sw), JSON.stringify(ambientResp));
    check('alarm: answered by the SW, 200/206', alarmResp.length > 0 && alarmResp.every((r) => (r.status === 206 || r.status === 200) && r.sw), JSON.stringify(alarmResp));
    // byte-exact Range slicing
    const slice = await page.evaluate(async () => {
      const full = new Uint8Array(await (await fetch('/sounds/alarm-classic.mp3', { cache: 'no-store' })).arrayBuffer());
      const out = [];
      for (const range of ['bytes=100-199', 'bytes=0-', 'bytes=-50', 'bytes=60000-99999999', 'bytes=99999999-']) {
        const r = await fetch('/sounds/alarm-classic.mp3', { headers: { Range: range } });
        const b = new Uint8Array(await r.arrayBuffer());
        const cr = r.headers.get('content-range');
        let ok;
        const m = cr && /bytes (\d+)-(\d+)\/(\d+)/.exec(cr);
        if (r.status === 206 && m) {
          const s = +m[1], e = +m[2];
          ok = +m[3] === full.length && b.length === e - s + 1 && +r.headers.get('content-length') === b.length && b.every((x, i) => x === full[s + i]);
        } else ok = r.status === 416 && cr === `bytes */${full.length}`;
        out.push({ range, status: r.status, cr, len: b.length, ok });
      }
      return { size: full.length, out };
    });
    check('SW Range slicing is byte-exact, 416 when out of range', slice.out.every((x) => x.ok), JSON.stringify(slice.out.map((x) => `${x.range}:${x.status}:${x.cr}:${x.ok}`)));

    // ---- 6. /api not served from cache
    responses.length = 0;
    const api = await page.evaluate(async () => {
      const a = await fetch('/api/feedback');
      const b = await fetch('/api/ai-planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      return [a.status, b.status];
    });
    const apiResp = responses.filter((r) => r.url.includes('/api/'));
    const apiCached = await page.evaluate(async () => {
      for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) if (new URL(r.url).pathname.startsWith('/api/')) return true;
      return false;
    });
    check('/api requests bypass the SW and are never cached', apiResp.length === 2 && apiResp.every((r) => !r.sw) && !apiCached, JSON.stringify(apiResp) + ' ' + api.join(','));

    // ---- 7. Client-side navigation to /blog and back
    responses.length = 0;
    await page.locator('header a[href="/blog"]').click();
    await page.waitForURL('**/blog');
    await page.waitForLoadState('networkidle');
    const blogH = await page.locator('h1').first().innerText();
    const rsc = responses.filter((r) => r.url.includes('_rsc') || r.url.includes('/blog'));
    check('client nav to /blog works (RSC not from SW)', /blog|pomodoro/i.test(blogH) && rsc.every((r) => !r.sw || !r.url.includes('_rsc')), `${blogH} | ${rsc.map((r) => r.url.replace(BASE, '') + ':' + r.status + (r.sw ? ':sw' : '')).join(' ')}`);
    await page.goBack();
    await page.waitForURL(BASE + '/');
    await page.waitForTimeout(800);
    check('back to / works, timer shown', (await time(page)) === '25:00');

    fs.writeFileSync(STATE, JSON.stringify(await ctx.storageState()));
    // keep the browser profile for the deploy phase: save caches state not possible; deploy phase uses a persistent context instead
  }
  check('no uncaught page errors', errors.length === 0, errors.join(' | '));
  console.log(results.join('\n'));
  await browser.close();
})().catch((e) => { console.log(results.join('\n')); console.error(e); process.exit(1); });

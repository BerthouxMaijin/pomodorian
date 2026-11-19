// Dumps the visible text, aria-labels, titles and placeholders of the app core
// screens for one browser locale. Usage: node capture.js <locale> <out.json> [settingsJSON]
const { chromium } = require('playwright');
const fs = require('fs');
const PORT = 3100;
const [locale = 'en-US', out = 'capture.json', settingsJson] = process.argv.slice(2);

const today = new Date().toISOString().slice(0, 10);
const sessions = [
  { id: 's1', date: today, startedAt: new Date(Date.now() - 3e6).toISOString(), endedAt: new Date().toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: 't1', taskTitle: 'Write report', completed: true },
  { id: 's2', date: today, startedAt: new Date(Date.now() - 6e6).toISOString(), endedAt: new Date(Date.now() - 4e6).toISOString(), durationMinutes: 25, mode: 'pomodoro', taskId: null, taskTitle: null, completed: true },
];
const tasks = [
  { id: 't1', title: 'Write report', estimatedPomodoros: 3, completedPomodoros: 1, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: false, order: 0 },
  { id: 't2', title: 'Review PR', estimatedPomodoros: 1, completedPomodoros: 0, completed: false, createdAt: new Date().toISOString(), completedAt: null, aiGenerated: true, order: 1 },
];

async function dump(page) {
  return page.evaluate(() => {
    const texts = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.trim();
      if (!t) continue;
      const el = n.parentElement;
      if (!el || el.closest('script,style,noscript')) continue;
      if (el.closest('footer,[data-info-section]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      texts.push(t);
    }
    const attrs = [];
    document.querySelectorAll('[aria-label],[title],[placeholder]').forEach((el) => {
      if (el.closest('footer')) return;
      for (const a of ['aria-label', 'title', 'placeholder']) {
        const v = el.getAttribute(a);
        if (v) attrs.push(`${a}=${v}`);
      }
    });
    const options = [...document.querySelectorAll('option')].map((o) => o.textContent.trim());
    return { texts, attrs, options, lang: document.documentElement.lang, title: document.title };
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale, viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(({ tasks, sessions, settingsJson }) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('ga-consent', 'denied');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    localStorage.setItem('pomodorian_tasks', JSON.stringify(tasks));
    localStorage.setItem('pomodorian_sessions', JSON.stringify(sessions));
    localStorage.setItem('pomodorian_data_version', '2');
    if (settingsJson) localStorage.setItem('pomodorian_settings', settingsJson);
  }, { tasks, sessions, settingsJson });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  const result = {};
  // open the ambient sounds panel and turn one on, for the volume label
  await page.locator('main button[aria-expanded]').click();
  await page.locator('main .grid-cols-5 button').first().click();
  result.main = await dump(page);
  await page.keyboard.press('s');
  await page.waitForTimeout(300);
  result.settings = await dump(page);
  await page.keyboard.press('Escape');
  await page.keyboard.press('r');
  await page.waitForTimeout(300);
  result.reportWeek = await dump(page);
  await page.locator('[role=dialog] .w-fit button').nth(2).click();
  await page.waitForTimeout(200);
  result.reportMonth = await dump(page);
  await page.locator('[role=dialog] .w-fit button').nth(0).click();
  await page.waitForTimeout(200);
  result.reportDay = await dump(page);
  await page.keyboard.press('Escape');
  await page.keyboard.press('?');
  await page.waitForTimeout(300);
  result.shortcuts = await dump(page);
  await page.keyboard.press('Escape');
  // task editor
  await page.locator('main [role=button][aria-pressed]').first().hover();
  await page.locator('main button[aria-label] >> nth=0');
  const editBtn = page.locator('main [role=button][aria-pressed] button').nth(2);
  await page.locator('main [role=button][aria-pressed]').first().dblclick({ position: { x: 120, y: 12 } });
  await page.waitForTimeout(200);
  result.editor = await dump(page);
  await page.keyboard.press('Escape');
  // add form
  await page.locator('main button.border-dashed').click();
  result.addForm = await dump(page);
  await page.keyboard.press('Escape');
  // previous day
  await page.locator('main h2').locator('xpath=preceding-sibling::button').click();
  result.prevDay = await dump(page);
  await page.locator('main h2').locator('xpath=following-sibling::button[2]').click();
  // undo banner: start, fake 2 minutes, reset
  await page.locator('main .flex.items-center.gap-4 button').first().click();
  result.running = await dump(page);
  await page.evaluate(() => { const o = Date.now; const t = o() ; Date.now = () => o() + 120000; });
  await page.waitForTimeout(500);
  await page.locator('main .flex.items-center.gap-4 button').first().click(); // pause
  result.paused = await dump(page);
  await page.locator('main .flex.items-center.gap-4 button').nth(1).click(); // reset
  await page.waitForTimeout(300);
  result.undo = await dump(page);
  result.errors = errors;
  void editBtn;
  fs.writeFileSync(out, JSON.stringify(result, null, 1));
  console.log('written', out, 'errors', errors.length);
  await browser.close();
})();

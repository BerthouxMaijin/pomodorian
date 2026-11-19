const { chromium } = require('playwright');
const fs = require('fs');
const URL = 'http://localhost:3100/';
const out = __dirname + '/shots/';
fs.mkdirSync(out, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`); };
const now = new Date().toISOString();
const mk = (id, title, est, done, ai, order) => ({ id, title, estimatedPomodoros: est, completedPomodoros: done, completed: false, createdAt: now, completedAt: null, aiGenerated: ai, order });
const TASKS = [
  mk('a1', 'Write the Q4 investor update', 3, 1, false, 0),
  mk('a2', 'Review pull requests', 1, 0, true, 1),
  mk('a3', 'Plan the offsite', 2, 0, false, 2),
];
const LONG = [
  mk('l1', 'Supercalifragilisticexpialidocious-refactor-of-the-entire-authentication-module-and-tests', 12, 10, true, 0),
  mk('l2', 'A long but normal title that will need to wrap onto several lines on a narrow phone', 4, 2, true, 1),
];
const wait = (p, ms = 250) => p.waitForTimeout(ms);
const stored = (p) => p.evaluate(() => ({
  tasks: JSON.parse(localStorage.getItem('pomodorian_tasks') || '[]'),
  active: JSON.parse(localStorage.getItem('pomodorian_active_task') || 'null'),
}));

async function setup(browser, ctxOpts, tasks = TASKS, theme = 'dark', active = null) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(URL);
  await page.evaluate(({ t, theme, active }) => {
    localStorage.clear();
    localStorage.setItem('ga-consent', 'denied');
    localStorage.setItem('pomodorian-feedback-prompt-v1-dismissed', 'true');
    localStorage.setItem('pomodorian_tasks', JSON.stringify(t));
    localStorage.setItem('pomodorian_settings', JSON.stringify({ theme }));
    if (active) localStorage.setItem('pomodorian_active_task', JSON.stringify(active));
  }, { t: tasks, theme, active });
  await page.reload({ waitUntil: 'networkidle' });
  await wait(page, 500);
  return { ctx, page, errors };
}
const row = (page, title) => page.locator('[role=button][aria-pressed]', { hasText: title }).first();
const editor = (page) => page.locator('form:has(button:text-is("Save"))');

(async () => {
  const browser = await chromium.launch();
  const allErrors = [];

  // ---------- Desktop ----------
  {
    const { ctx, page, errors } = await setup(browser, { viewport: { width: 1280, height: 900 } }, TASKS, 'dark', 'a2');
    const r1 = row(page, 'Write the Q4 investor update');
    await r1.hover();
    await wait(page, 300);
    const pencil = r1.getByRole('button', { name: 'Edit task' });
    const xBtn = r1.getByRole('button', { name: 'Delete task' });
    const op = async (l) => Number(await l.evaluate((el) => getComputedStyle(el).opacity));
    check('desktop: pencil and x revealed on hover', (await op(pencil)) === 1 && (await op(xBtn)) === 1 && await xBtn.isVisible());
    await page.mouse.move(5, 5); await wait(page, 300);
    check('desktop: pencil hidden at rest', (await op(pencil)) === 0);
    await page.mouse.move(5, 5); await page.locator('div.w-full:has(> div > div > h2)').screenshot({ path: out + 'desktop-dark-rest.png' });

    // open via pencil, active task unchanged
    const activeBefore = (await stored(page)).active;
    await r1.hover(); await pencil.click(); await wait(page);
    const titleInput = editor(page).getByRole('textbox', { name: 'Task title' });
    check('pencil opens the editor', await editor(page).isVisible());
    check('editor: title field focused', await titleInput.evaluate((el) => el === document.activeElement));
    // click inside editor (empty area + stepper) does not toggle active task
    await editor(page).click({ position: { x: 5, y: 5 } }); await wait(page);
    await editor(page).getByRole('button', { name: 'One pomodoro more' }).click(); await wait(page);
    await editor(page).getByRole('button', { name: 'One pomodoro less' }).click(); await wait(page);
    const activeAfter = (await stored(page)).active;
    check('opening/clicking the editor keeps the active task', activeBefore === 'a2' && activeAfter === 'a2', `${activeBefore} -> ${activeAfter}`);
    check('editor: no drag handle while editing', (await editor(page).getByRole('button', { name: /^Reorder/ }).count()) === 0);
    await page.mouse.move(5, 5); await page.locator('div.w-full:has(> div > div > h2)').screenshot({ path: out + 'desktop-dark-editor.png' });

    // Space in the title field does not start the timer
    await titleInput.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Space'); await wait(page);
    check('Space while typing in editor does not start timer', await page.getByRole('button', { name: /^START$/ }).isVisible());
    // Space on stepper button increments and does not start the timer
    const plus = editor(page).getByRole('button', { name: 'One pomodoro more' });
    await plus.focus();
    await page.keyboard.press('Space'); await wait(page);
    check('stepper: Space on plus increments, timer not started', (await editor(page).locator('output').innerText()) === '4' && await page.getByRole('button', { name: /^START$/ }).isVisible(), await editor(page).locator('output').innerText());
    await page.keyboard.press('Enter'); await wait(page);
    check('stepper: Enter on plus increments', (await editor(page).locator('output').innerText()) === '5');
    // Escape cancels without change
    await page.keyboard.press('Escape'); await wait(page, 400);
    let st = await stored(page);
    const t1 = st.tasks.find((t) => t.id === 'a1');
    check('Escape cancels without change', !(await editor(page).isVisible()) && t1.title === 'Write the Q4 investor update' && t1.estimatedPomodoros === 3, JSON.stringify({ title: t1.title, est: t1.estimatedPomodoros }));
    const focusOnPencil = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    check('focus returns to the pencil on close', focusOnPencil === 'Edit task', focusOnPencil);

    // rename + estimate 3 via Save, on a2 (1 -> 3)
    const r2 = row(page, 'Review pull requests');
    await r2.hover(); await r2.getByRole('button', { name: 'Edit task' }).click(); await wait(page);
    await editor(page).getByRole('textbox').fill('Review open PRs');
    await editor(page).getByRole('button', { name: 'One pomodoro more' }).click();
    await editor(page).getByRole('button', { name: 'One pomodoro more' }).click();
    await editor(page).getByRole('button', { name: 'Save' }).click(); await wait(page, 400);
    const r2b = row(page, 'Review open PRs');
    check('rename + estimate 3 shows 0/3', (await r2b.innerText()).includes('0/3'), (await r2b.innerText()).replace(/\n/g, ' '));
    await page.reload({ waitUntil: 'networkidle' }); await wait(page, 500);
    st = await stored(page);
    const t2 = st.tasks.find((t) => t.id === 'a2');
    check('persisted after reload', (await row(page, 'Review open PRs').innerText()).includes('0/3') && t2.title === 'Review open PRs' && t2.estimatedPomodoros === 3 && t2.completedPomodoros === 0 && t2.aiGenerated === true, JSON.stringify(t2));
    check('active task still a2 after edit', st.active === 'a2');

    // Enter saves; estimate lower than done allowed (a1 done=1, set est 1 then less is blocked at 1)
    const r1b = row(page, 'Write the Q4 investor update');
    await r1b.hover(); await r1b.getByRole('button', { name: 'Edit task' }).click(); await wait(page);
    await editor(page).getByRole('textbox').fill('Write the Q4 update');
    for (let i = 0; i < 4; i++) await editor(page).getByRole('button', { name: 'One pomodoro less' }).click({ force: true });
    const minusDisabled = await editor(page).getByRole('button', { name: 'One pomodoro less' }).getAttribute('aria-disabled');
    await editor(page).getByRole('textbox').press('Enter'); await wait(page, 400);
    st = await stored(page);
    const t1b = st.tasks.find((t) => t.id === 'a1');
    check('Enter saves (title + estimate clamped at 1, completed kept)', t1b.title === 'Write the Q4 update' && t1b.estimatedPomodoros === 1 && t1b.completedPomodoros === 1 && minusDisabled === 'true', JSON.stringify(t1b));
    check('row shows 1/1 after lowering estimate', (await row(page, 'Write the Q4 update').innerText()).includes('1/1'));

    // stepper max 20
    const r3 = row(page, 'Plan the offsite');
    await r3.dblclick(); await wait(page);
    check('double click on title opens the editor', await editor(page).isVisible());
    for (let i = 0; i < 25; i++) await editor(page).getByRole('button', { name: 'One pomodoro more' }).click({ force: true });
    check('stepper caps at 20', (await editor(page).locator('output').innerText()) === '20');
    await editor(page).getByRole('button', { name: 'Cancel' }).click(); await wait(page, 400);
    check('Cancel leaves estimate unchanged', (await stored(page)).tasks.find((t) => t.id === 'a3').estimatedPomodoros === 2);
    results.push(`INFO  double click toggles the active task twice (pre-existing): a2 -> ${(await stored(page)).active}`);
    await row(page, 'Review open PRs').click(); await wait(page);

    // Delete from editor
    await r3.hover(); await r3.getByRole('button', { name: 'Edit task' }).click(); await wait(page);
    await editor(page).getByRole('button', { name: 'Delete task' }).click(); await wait(page, 400);
    st = await stored(page);
    check('Delete from the editor removes the task', !st.tasks.some((t) => t.id === 'a3') && (await page.getByText('Plan the offsite').count()) === 0);

    // Add a task with estimate 2
    await page.getByRole('button', { name: '+ Add Task' }).click(); await wait(page);
    await page.getByPlaceholder('What are you working on?').fill('Draft blog post');
    await page.getByRole('button', { name: 'One pomodoro more' }).click(); await wait(page);
    await page.mouse.move(5, 5); await page.locator('div.w-full:has(> div > div > h2)').screenshot({ path: out + 'desktop-dark-addform.png' });
    // Space on add-form stepper must not start timer
    await page.getByRole('button', { name: 'One pomodoro more' }).focus();
    await page.keyboard.press('Space'); await page.keyboard.press('Space'); await wait(page);
    await page.getByRole('button', { name: 'One pomodoro less' }).click();
    await page.getByRole('button', { name: 'One pomodoro less' }).click();
    check('add form: Space on stepper does not start timer', await page.getByRole('button', { name: /^START$/ }).isVisible());
    await page.getByRole('button', { name: 'Add', exact: true }).click(); await wait(page, 400);
    st = await stored(page);
    const nt = st.tasks.find((t) => t.title === 'Draft blog post');
    check('add with estimate 2', nt && nt.estimatedPomodoros === 2 && (await row(page, 'Draft blog post').innerText()).includes('0/2'), JSON.stringify(nt));
    // add form stepper resets to 1
    await page.getByRole('button', { name: '+ Add Task' }).click(); await wait(page);
    check('add form estimate resets to 1', (await page.locator('form output').innerText()) === '1');
    await page.keyboard.press('Escape'); await wait(page, 300);
    check('Escape closes the add form', await page.getByRole('button', { name: '+ Add Task' }).isVisible());

    // Space shortcut still starts timer when nothing is focused
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.keyboard.press('Space'); await wait(page, 400);
    check('Space starts timer when no field focused', await page.getByRole('button', { name: /^PAUSE$/ }).isVisible());
    await page.getByRole('button', { name: /^PAUSE$/ }).click();
    await page.getByRole('button', { name: 'Reset timer' }).click(); await wait(page);

    // Keyboard reorder: order is [a1 Write.., a2 Review.., new Draft]
    const order = async () => (await stored(page)).tasks.sort((a, b) => a.order - b.order).map((t) => t.title);
    const handle = page.getByRole('button', { name: /^Reorder Write the Q4 update/ });
    await handle.focus();
    await page.keyboard.press('ArrowDown'); await wait(page, 400);
    let o = await order();
    check('keyboard reorder (ArrowDown on handle)', o[0] === 'Review open PRs' && o[1] === 'Write the Q4 update', o.join(' | '));
    await page.getByRole('button', { name: /^Reorder Write the Q4 update/ }).focus();
    await page.keyboard.press('ArrowUp'); await wait(page, 400);
    o = await order();
    check('keyboard reorder (ArrowUp on handle)', o[0] === 'Write the Q4 update', o.join(' | '));

    const activeBeforeDrag = (await stored(page)).active;
    // Drag reorder: drag "Draft blog post" to top
    const dRow = row(page, 'Draft blog post');
    await dRow.hover();
    const hb = await page.getByRole('button', { name: /^Reorder Draft blog post/ }).boundingBox();
    const topBox = await row(page, 'Write the Q4 update').boundingBox();
    await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
    await page.mouse.down();
    await page.mouse.move(hb.x + hb.width / 2, hb.y + 10, { steps: 5 });
    await page.mouse.move(hb.x + hb.width / 2, topBox.y - 10, { steps: 25 });
    await wait(page, 200);
    await page.mouse.up(); await wait(page, 600);
    o = await order();
    check('drag reorder still works', o[0] === 'Draft blog post', o.join(' | '));
    check('drag did not change active task', activeBeforeDrag === 'a2' && (await stored(page)).active === 'a2', `${activeBeforeDrag} -> ${(await stored(page)).active}`);

    // Light theme screenshots
    await page.evaluate(() => localStorage.setItem('pomodorian_settings', JSON.stringify({ theme: 'light' })));
    await page.reload({ waitUntil: 'networkidle' }); await wait(page, 500);
    await row(page, 'Review open PRs').hover(); await wait(page, 300);
    await page.mouse.move(5, 5); await page.locator('div.w-full:has(> div > div > h2)').screenshot({ path: out + 'desktop-light-rest.png' });
    await row(page, 'Review open PRs').getByRole('button', { name: 'Edit task' }).click(); await wait(page, 300);
    await page.mouse.move(5, 5); await page.locator('div.w-full:has(> div > div > h2)').screenshot({ path: out + 'desktop-light-editor.png' });

    allErrors.push(...errors.map((e) => 'desktop: ' + e));
    await ctx.close();
  }

  // ---------- Touch ----------
  for (const [label, vp, tasks] of [
    ['mobile-390', { width: 390, height: 664 }, TASKS],
    ['small-320', { width: 320, height: 568 }, LONG],
  ]) {
    for (const theme of ['dark', 'light']) {
      const { ctx, page, errors } = await setup(browser, { viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, tasks, theme, null);
      const first = row(page, tasks[0].title);
      await first.scrollIntoViewIfNeeded();
      const pencil = first.getByRole('button', { name: 'Edit task' });
      const xBtn = first.getByRole('button', { name: 'Delete task' });
      const pOp = Number(await pencil.evaluate((el) => getComputedStyle(el).opacity));
      check(`${label}/${theme}: pencil visible on touch`, (await pencil.isVisible()) && pOp > 0.5, `opacity=${pOp}`);
      check(`${label}/${theme}: row x hidden on touch`, !(await xBtn.isVisible()));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      check(`${label}/${theme}: no horizontal overflow at rest`, !overflow);
      // row contents stay inside row
      const inside = await first.evaluate((el) => { const r = el.getBoundingClientRect(); return [...el.querySelectorAll('*')].every((c) => { const b = c.getBoundingClientRect(); return b.width === 0 || (b.right <= r.right + 0.5 && b.left >= r.left - 0.5); }); });
      check(`${label}/${theme}: row children inside row`, inside);
      // pencil hit area >= 40
      const hit = await pencil.evaluate((el) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el, '::before'); return { w: b.width - 2 * parseFloat(s.left), h: b.height - 2 * parseFloat(s.top) }; });
      check(`${label}/${theme}: pencil hit area >= 40px`, hit.w >= 40 && hit.h >= 40, JSON.stringify(hit));
      const box = await first.boundingBox();
      await page.screenshot({ path: `${out}${label}-${theme}-rest.png` });
      const activeBefore = (await stored(page)).active;
      await pencil.tap(); await wait(page, 300);
      check(`${label}/${theme}: tap pencil opens editor, active unchanged`, (await editor(page).isVisible()) && (await stored(page)).active === activeBefore, `${activeBefore} -> ${(await stored(page)).active}`);
      await editor(page).getByRole('button', { name: 'One pomodoro more' }).tap(); await wait(page);
      check(`${label}/${theme}: tap inside editor keeps active`, (await stored(page)).active === activeBefore);
      const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      check(`${label}/${theme}: no horizontal overflow with editor open`, !overflow2);
      const small = await editor(page).locator('button').evaluateAll((els) => els.map((el) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el, '::before'); const extra = s.content !== 'none' && s.position === 'absolute' ? -2 * parseFloat(s.left || '0') : 0; return { n: el.getAttribute('aria-label') || el.innerText, w: b.width + extra, h: b.height + (s.content !== 'none' && s.position === 'absolute' ? -2 * parseFloat(s.top || '0') : 0) }; }).filter((x) => x.h < 40).map((x) => `${x.n} ${x.w.toFixed(0)}x${x.h.toFixed(0)}`));
      check(`${label}/${theme}: editor buttons >= 40px tall to the finger`, small.length === 0, small.join('; '));
      await editor(page).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}${label}-${theme}-editor.png` });
      allErrors.push(...errors.map((e) => `${label}: ` + e));
      await ctx.close();
    }
  }

  check('no uncaught page errors', allErrors.length === 0, allErrors.join(' / '));
  await browser.close();
  console.log(results.join('\n'));
  console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} passed`);
})().catch((e) => { console.error(e); console.log(results.join('\n')); process.exit(1); });

/**
 * Browser smoke test for timer tool pages, against a running server.
 *
 *   PORT=3123 npm start &
 *   node scripts/seo/smoke-timer-pages.cjs http://localhost:3123 25-minute-timer minuteur-10-minutes ...
 *
 * For each slug: HTTP 200, a <title>, hreflang links, the countdown actually
 * decreasing after Start, no horizontal scroll at 375 px. On the first slug,
 * also runs a full countdown on a fake clock and checks that the end state is
 * usable again (rewound, or switched to the break mode). Exits 1 on failure.
 * Uses the Chromium preinstalled with Playwright.
 */
// CommonJS on purpose: the preinstalled Playwright resolves through require().
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require("playwright");

const START = /^(Start|Démarrer|Iniciar)$/;
const PAUSE = /^(Pause|Pausa)$/;

async function main() {
  const [base, ...slugs] = process.argv.slice(2);
  if (!base || slugs.length === 0) {
    console.error("usage: smoke-timer-pages.cjs <baseUrl> <slug...>");
    process.exit(2);
  }
  const browser = await chromium.launch();
  const failures = [];

  for (const [i, slug] of slugs.entries()) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, isMobile: true });
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    const fail = (m) => failures.push(`${slug}: ${m}`);

    if (i === 0) await page.clock.install();
    const res = await page.goto(`${base}/${slug}`);
    if (!res || res.status() !== 200) {
      fail(`HTTP ${res && res.status()}`);
      await ctx.close();
      continue;
    }
    await page.waitForTimeout(1500); // hydration

    const title = await page.title();
    if (!title) fail("empty <title>");
    const hreflang = await page.locator('link[rel="alternate"][hreflang]').count();
    if (hreflang === 0) fail("no hreflang links");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) fail(`horizontal scroll of ${overflow}px at 375px`);

    const clock = page.locator("span.tabular-nums").first();
    const before = await clock.innerText();
    await page.getByRole("button", { name: START }).first().click();
    try {
      await page.getByRole("button", { name: PAUSE }).first().waitFor({ timeout: 5000 });
    } catch {
      fail("Start did not start the countdown");
    }

    if (i === 0) {
      // Full run on the fake clock, then the timer must be usable again.
      const [m, s] = before.split(":").slice(-2).map(Number);
      const total = before.split(":").length === 3
        ? Number(before.split(":")[0]) * 3600 + m * 60 + s
        : m * 60 + s;
      await page.clock.fastForward(total * 1000 - 1000);
      await page.clock.runFor(3000);
      const status = await page.locator("[role=status]").innerText();
      const after = await clock.innerText();
      if (!status) fail("no end-of-countdown message");
      if (after === "00:00") fail("stuck at 00:00 after the alarm");
      console.log(`${slug}: full countdown ok (${before} -> alarm -> ${after})`);
    } else {
      await page.waitForTimeout(2200);
      const after = await clock.innerText();
      if (after === before) fail(`countdown did not move (${before})`);
    }

    if (pageErrors.length) fail(`page errors: ${pageErrors.join(" | ")}`);
    if (!failures.some((f) => f.startsWith(`${slug}:`))) console.log(`${slug}: ok "${title}"`);
    await ctx.close();
  }

  await browser.close();
  for (const f of failures) console.log(`FAIL ${f}`);
  if (failures.length) process.exit(1);
  console.log("SMOKE OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

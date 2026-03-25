import { google } from "googleapis";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

/* ── Config ───────────────────────────────────────────── */

const SITE_URL = "sc-domain:pomodorian.app";
const KEY_PATH = resolve(process.env.HOME!, "keys/gsc-pomodorian.json");
const EMAIL_TO = "jean-baptiste@maijin.ch";
const RESEND_KEY = process.env.RESEND_API_KEY!;
const DATE = new Date().toISOString().split("T")[0];
const LOG_DIR = resolve(__dirname, "logs");

const KEY_URLS = [
  "https://pomodorian.app/",
  "https://pomodorian.app/blog",
  "https://pomodorian.app/blog/pomodoro-technique-complete-guide",
  "https://pomodorian.app/blog/pomodoro-technique-for-developers",
  "https://pomodorian.app/blog/best-pomodoro-apps-2026",
  "https://pomodorian.app/blog/science-of-flow-state",
  "https://pomodorian.app/blog/ai-productivity-tools-focus",
  "https://pomodorian.app/blog/avoid-burnout-software-engineer",
  "https://pomodorian.app/blog/stop-procrastinating-timeboxing",
  "https://pomodorian.app/blog/ambient-sounds-productivity-science",
  "https://pomodorian.app/online-pomodoro-timer",
  "https://pomodorian.app/pomodoro-timer-for-students",
  "https://pomodorian.app/pomodoro-timer-for-developers",
  "https://pomodorian.app/pomodorian-vs-pomofocus",
  "https://pomodorian.app/blog/fr/technique-pomodoro-guide-complet",
  "https://pomodorian.app/blog/es/tecnica-pomodoro-guia-completa",
  "https://pomodorian.app/blog/de/pomodoro-technik-kompletter-leitfaden",
  "https://pomodorian.app/blog/build-daily-focus-habit-30-days",
  "https://pomodorian.app/blog/prepare-exams-without-burnout",
];

/* ── Auth ─────────────────────────────────────────────── */

const key = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});
const searchconsole = google.searchconsole({ version: "v1", auth });

/* ── API Helpers ──────────────────────────────────────── */

async function getPerformance(startDate: string, endDate: string) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: [], rowLimit: 1 },
  });
  const row = res.data.rows?.[0];
  return {
    clicks: row?.clicks ?? 0,
    impressions: row?.impressions ?? 0,
    ctr: row?.ctr ?? 0,
    position: row?.position ?? 0,
  };
}

async function getTopQueries(startDate: string, endDate: string) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: ["query"], rowLimit: 20 },
  });
  return res.data.rows ?? [];
}

async function getTopPages(startDate: string, endDate: string) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: ["page"], rowLimit: 20 },
  });
  return res.data.rows ?? [];
}

async function getCountries(startDate: string, endDate: string) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: ["country"], rowLimit: 10 },
  });
  return res.data.rows ?? [];
}

async function inspectUrl(url: string) {
  try {
    const res = await searchconsole.urlInspection.index.inspect({
      requestBody: { inspectionUrl: url, siteUrl: SITE_URL },
    });
    const r = res.data.inspectionResult?.indexStatusResult;
    return {
      url,
      verdict: r?.verdict ?? "UNKNOWN",
      state: r?.coverageState ?? "Unknown",
      lastCrawl: r?.lastCrawlTime ?? null,
    };
  } catch {
    return { url, verdict: "ERROR", state: "API error", lastCrawl: null };
  }
}

async function getSitemaps() {
  const res = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
  return res.data.sitemap ?? [];
}

/* ── HTML Report ──────────────────────────────────────── */

function statusBadge(verdict: string) {
  if (verdict === "PASS") return '<span style="color:#10b981;font-weight:600">● Indexed</span>';
  if (verdict === "NEUTRAL") return '<span style="color:#f59e0b;font-weight:600">○ Pending</span>';
  return '<span style="color:#ef4444;font-weight:600">✕ Error</span>';
}

function buildHtml(data: {
  perf: { clicks: number; impressions: number; ctr: number; position: number };
  prevPerf: { clicks: number; impressions: number; ctr: number; position: number };
  queries: any[];
  pages: any[];
  countries: any[];
  indexation: { url: string; verdict: string; state: string; lastCrawl: string | null }[];
  sitemaps: any[];
}) {
  const indexed = data.indexation.filter((u) => u.verdict === "PASS").length;
  const pending = data.indexation.filter((u) => u.verdict === "NEUTRAL").length;
  const errors = data.indexation.filter((u) => u.verdict === "ERROR").length;

  const delta = (curr: number, prev: number) => {
    if (prev === 0 && curr === 0) return "—";
    if (prev === 0) return '<span style="color:#10b981">NEW</span>';
    const pct = ((curr - prev) / prev * 100).toFixed(0);
    const num = Number(pct);
    if (num > 0) return `<span style="color:#10b981">+${pct}%</span>`;
    if (num < 0) return `<span style="color:#ef4444">${pct}%</span>`;
    return "—";
  };

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px">
      <h1 style="color:#fff;font-size:24px;margin:0">🍅 Pomodorian SEO Audit</h1>
      <p style="color:#6b7280;font-size:14px;margin:8px 0 0">${DATE}</p>
    </div>

    <!-- Performance Cards -->
    <div style="display:flex;gap:12px;margin-bottom:24px">
      ${[
        { label: "Clicks", value: data.perf.clicks, prev: data.prevPerf.clicks },
        { label: "Impressions", value: data.perf.impressions, prev: data.prevPerf.impressions },
        { label: "CTR", value: (data.perf.ctr * 100).toFixed(1) + "%", prev: data.prevPerf.ctr, raw: true },
        { label: "Avg Pos", value: data.perf.position ? data.perf.position.toFixed(1) : "—", prev: data.prevPerf.position, raw: true },
      ].map((c) => `
        <div style="flex:1;background:#16161d;border-radius:12px;padding:16px;text-align:center;border:1px solid #1f1f2e">
          <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">${c.label}</div>
          <div style="color:#fff;font-size:24px;font-weight:700;margin:4px 0">${c.raw ? c.value : c.value}</div>
          <div style="font-size:12px">${c.raw ? "" : delta(c.value as number, c.prev as number)}</div>
        </div>
      `).join("")}
    </div>

    <!-- Indexation -->
    <div style="background:#16161d;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #1f1f2e">
      <h2 style="color:#fff;font-size:16px;margin:0 0 4px">Indexation</h2>
      <p style="color:#6b7280;font-size:13px;margin:0 0 16px">${indexed} indexed · ${pending} pending · ${errors} errors · ${data.indexation.length} checked</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="border-bottom:1px solid #1f1f2e">
          <th style="text-align:left;padding:8px 0;color:#6b7280;font-weight:500">URL</th>
          <th style="text-align:right;padding:8px 0;color:#6b7280;font-weight:500">Status</th>
        </tr>
        ${data.indexation.map((u) => `
        <tr style="border-bottom:1px solid #1f1f2e20">
          <td style="padding:8px 0;color:#d1d5db;max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.url.replace("https://pomodorian.app", "")}</td>
          <td style="padding:8px 0;text-align:right">${statusBadge(u.verdict)}</td>
        </tr>`).join("")}
      </table>
    </div>

    <!-- Top Keywords -->
    ${data.queries.length > 0 ? `
    <div style="background:#16161d;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #1f1f2e">
      <h2 style="color:#fff;font-size:16px;margin:0 0 16px">Top Keywords</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="border-bottom:1px solid #1f1f2e">
          <th style="text-align:left;padding:8px 0;color:#6b7280">Query</th>
          <th style="text-align:right;padding:8px 0;color:#6b7280">Clicks</th>
          <th style="text-align:right;padding:8px 0;color:#6b7280">Impr.</th>
          <th style="text-align:right;padding:8px 0;color:#6b7280">Pos.</th>
        </tr>
        ${data.queries.map((q: any) => `
        <tr style="border-bottom:1px solid #1f1f2e20">
          <td style="padding:6px 0;color:#d1d5db">${q.keys[0]}</td>
          <td style="padding:6px 0;text-align:right;color:#fff;font-weight:600">${q.clicks}</td>
          <td style="padding:6px 0;text-align:right;color:#6b7280">${q.impressions}</td>
          <td style="padding:6px 0;text-align:right;color:#6b7280">${q.position.toFixed(1)}</td>
        </tr>`).join("")}
      </table>
    </div>` : `
    <div style="background:#16161d;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #1f1f2e">
      <h2 style="color:#fff;font-size:16px;margin:0 0 8px">Top Keywords</h2>
      <p style="color:#6b7280;font-size:13px;margin:0">No keyword data yet. Check back after indexation.</p>
    </div>`}

    <!-- Sitemap -->
    <div style="background:#16161d;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #1f1f2e">
      <h2 style="color:#fff;font-size:16px;margin:0 0 16px">Sitemap</h2>
      ${data.sitemaps.map((s: any) => `
      <div style="display:flex;justify-content:space-between;font-size:13px">
        <span style="color:#d1d5db">sitemap.xml</span>
        <span style="color:${s.errors > 0 ? "#ef4444" : "#10b981"};font-weight:600">${s.errors > 0 ? s.errors + " errors" : "Healthy"} · ${s.contents?.[0]?.submitted ?? "?"} URLs</span>
      </div>`).join("") || '<p style="color:#6b7280;font-size:13px;margin:0">No sitemaps found</p>'}
    </div>

    <!-- Countries -->
    ${data.countries.length > 0 ? `
    <div style="background:#16161d;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #1f1f2e">
      <h2 style="color:#fff;font-size:16px;margin:0 0 16px">Top Countries</h2>
      ${data.countries.map((c: any) => `
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0">
        <span style="color:#d1d5db">${c.keys[0].toUpperCase()}</span>
        <span style="color:#6b7280">${c.clicks} clicks · ${c.impressions} impr.</span>
      </div>`).join("")}
    </div>` : ""}

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;border-top:1px solid #1f1f2e">
      <p style="color:#6b7280;font-size:12px;margin:0">
        <a href="https://search.google.com/search-console?resource_id=sc-domain:pomodorian.app" style="color:#ef4444;text-decoration:none">Open Google Search Console</a>
        &nbsp;·&nbsp;
        <a href="https://pomodorian.app" style="color:#ef4444;text-decoration:none">pomodorian.app</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

/* ── Main ─────────────────────────────────────────────── */

async function main() {
  console.log(`🔍 Running SEO audit — ${DATE}`);

  const endDate = DATE;
  const startDate = new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0];
  const prevEnd = new Date(new Date(startDate).getTime() - 86400000).toISOString().split("T")[0];
  const prevStart = new Date(new Date(prevEnd).getTime() - 27 * 86400000).toISOString().split("T")[0];

  const [perf, prevPerf, queries, pages, countries, sitemaps] = await Promise.all([
    getPerformance(startDate, endDate),
    getPerformance(prevStart, prevEnd),
    getTopQueries(startDate, endDate),
    getTopPages(startDate, endDate),
    getCountries(startDate, endDate),
    getSitemaps(),
  ]);

  console.log("📊 Performance fetched");

  // Inspect URLs (sequential to respect rate limits)
  const indexation = [];
  for (const url of KEY_URLS) {
    indexation.push(await inspectUrl(url));
  }
  console.log(`🔎 ${indexation.length} URLs inspected`);

  const html = buildHtml({ perf, prevPerf, queries, pages, countries, indexation, sitemaps });

  // Save report
  mkdirSync(LOG_DIR, { recursive: true });
  writeFileSync(resolve(LOG_DIR, `audit-${DATE}.html`), html);
  console.log("💾 Report saved");

  // Send email
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Pomodorian SEO <onboarding@resend.dev>",
      to: EMAIL_TO,
      subject: `🍅 Pomodorian SEO Audit — ${DATE}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Email failed:", err);
    process.exit(1);
  }

  console.log(`📧 Report emailed to ${EMAIL_TO}`);
}

main().catch((err) => {
  console.error("❌ Audit failed:", err);
  process.exit(1);
});

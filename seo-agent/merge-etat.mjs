#!/usr/bin/env node
/**
 * Fusionne inventory.tsv + le snapshot GSC le plus récent -> ETAT-ARTICLES.tsv avec verdicts.
 * Verdicts par règles (le run peut les surcharger à la main ensuite) :
 *   NEW      publié < 30 j (trop tôt pour juger)
 *   STAR     clics >= 1 et position <= 12
 *   FIX      impressions >= 40, position < 8, 0 clic (probleme CTR title/meta)
 *   REFRESH  impressions >= 40, position 8-25 (striking distance)
 *   DORMANT  le reste
 * Usage : node seo-agent/merge-etat.mjs
 */
import fs from "node:fs";
import path from "node:path";

const DIR = import.meta.dirname;
const snapDir = path.join(DIR, "gsc-snapshots");
const latest = fs.readdirSync(snapDir).filter((f) => f.endsWith("-pages.tsv")).sort().pop();
const today = latest.replace("-pages.tsv", "");

function readTsv(p) {
  const [head, ...lines] = fs.readFileSync(p, "utf8").trim().split("\n");
  const cols = head.split("\t");
  return lines.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [cols[i], v])));
}

const inv = readTsv(path.join(DIR, "inventory.tsv"));
const gsc = new Map(readTsv(path.join(snapDir, latest)).map((r) => [r.url, r]));

const cutoffNew = new Date(Date.parse(today + "T00:00:00Z") - 30 * 86400e3);

const out = inv.map((r) => {
  const g = gsc.get(r.url) || {};
  const clicks = +g.clicks || 0, impr = +g.impressions || 0, pos = +g.position || 0;
  let verdict = "DORMANT";
  if (r.date && new Date(r.date) > cutoffNew) verdict = "NEW";
  else if (clicks >= 1 && pos > 0 && pos <= 12) verdict = "STAR";
  else if (impr >= 40 && pos > 0 && pos < 8 && clicks === 0) verdict = "FIX";
  else if (impr >= 40 && pos >= 8 && pos <= 25) verdict = "REFRESH";
  return { ...r, gsc_clicks: clicks, gsc_impr: impr, gsc_pos: pos, gsc_impr_delta: g.impr_delta ?? "", verdict, note: g.note ?? "" };
});

const cols = [...Object.keys(inv[0]), "gsc_clicks", "gsc_impr", "gsc_pos", "gsc_impr_delta", "verdict", "note"];
fs.writeFileSync(path.join(DIR, "ETAT-ARTICLES.tsv"), [cols.join("\t"), ...out.map((r) => cols.map((c) => r[c]).join("\t"))].join("\n") + "\n");
const counts = out.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {});
console.log(`ETAT-ARTICLES.tsv écrit (snapshot ${today}) :`, JSON.stringify(counts));

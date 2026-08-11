#!/usr/bin/env node
/**
 * Inventaire mécanique des contenus SEO (articles blog 4 langues + pages SEO programmatiques).
 * Sortie : TSV sur stdout — une ligne par contenu, métriques "au standard ?" calculables sans LLM.
 * Usage : node seo-agent/inventory.mjs > seo-agent/inventory.tsv
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(import.meta.dirname, "..");
const LANGS = ["en", "fr", "es", "de"];

const rows = [];

function analyzeBody(body) {
  const words = body.split(/\s+/).filter(Boolean).length;
  const h2Count = (body.match(/^##\s/gm) || []).length;
  const faq = /^##.*\b(faq|frequently asked|questions fréquentes|preguntas frecuentes|häufig gestellte)/im.test(body) ? 1 : 0;
  const links = [...body.matchAll(/\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]);
  const internal = links.filter((u) => u.startsWith("/") || u.includes("pomodorian.app")).length;
  const external = links.filter((u) => /^https?:\/\//.test(u) && !u.includes("pomodorian.app")).length;
  const table = /^\|.*\|/m.test(body) ? 1 : 0;
  return { words, h2Count, faq, internal, external, table };
}

for (const lang of LANGS) {
  const dir = path.join(ROOT, "content/blog", lang);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const m = analyzeBody(content);
    const urlPath = lang === "en" ? `/blog/${slug}` : `/blog/${lang}/${slug}`;
    rows.push({
      type: "article", lang, slug, url: urlPath,
      status: data.status ?? "draft",
      date: data.date ?? "", updated: data.updated ?? "",
      translationKey: data.translationKey ?? "",
      ...m,
    });
  }
}

// Pages SEO programmatiques : extraction regex de lib/seo/pages.ts (slug + richesse).
const pagesTs = fs.readFileSync(path.join(ROOT, "lib/seo/pages.ts"), "utf8");
const pageBlocks = pagesTs.split(/\n\s*\{\s*\n\s*slug:/).slice(1);
for (const block of pageBlocks) {
  const slug = (block.match(/^\s*["']([^"']+)["']/) || [])[1];
  if (!slug) continue;
  const sections = (block.match(/heading:/g) || []).length;
  const related = (block.match(/relatedArticleSlugs/) ? 1 : 0);
  rows.push({
    type: "seo-page", lang: "en", slug, url: `/${slug}`,
    status: "published", date: "", updated: "", translationKey: "",
    words: "", h2Count: sections, faq: "", internal: related, external: "", table: "",
  });
}

const cols = ["type", "lang", "slug", "url", "status", "date", "updated", "translationKey", "words", "h2Count", "faq", "internal", "external", "table"];
console.log(cols.join("\t"));
for (const r of rows) console.log(cols.map((c) => r[c]).join("\t"));
console.error(`# ${rows.filter((r) => r.type === "article").length} articles + ${rows.filter((r) => r.type === "seo-page").length} pages SEO`);

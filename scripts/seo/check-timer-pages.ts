/**
 * Quality gate for the timer tool pages (lib/seo/timers/*.ts). Run before
 * every batch is published:
 *
 *   node --experimental-strip-types scripts/seo/check-timer-pages.ts
 *
 * Exits 1 on any error. Warnings do not block. Imports the data files
 * directly (they only import types), so no build step is needed.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { seoPages } from "../../lib/seo/pages.ts";

const TIMERS_DIR = join(import.meta.dirname, "../../lib/seo/timers");
const BLOG_DIR = join(import.meta.dirname, "../../content/blog");
const DATA_FILES = ["en", "fr", "es", "de"];

type Page = {
  slug: string;
  lang: string;
  minutes: number;
  role: string;
  label: string;
  breakMinutes?: number;
  title: string;
  description: string;
  h1: string;
  intro: string;
  useCases: string[];
  sections: { heading: string; body: string }[];
  faq: { q: string; a: string }[];
  relatedArticleSlugs?: string[];
  published: string;
};

const pages: Page[] = [];
for (const lang of DATA_FILES) {
  const file = join(TIMERS_DIR, `${lang}.ts`);
  try {
    readFileSync(file);
  } catch {
    continue;
  }
  const mod = await import(file);
  const list = Object.values(mod).find(Array.isArray) as Page[] | undefined;
  if (list) pages.push(...list);
}

const indexSource = readFileSync(join(TIMERS_DIR, "index.ts"), "utf8");

function publishedBlogSlugs(lang: string): Set<string> {
  const dir = join(BLOG_DIR, lang);
  const slugs = new Set<string>();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    const head = readFileSync(join(dir, f), "utf8").slice(0, 2000);
    const status = head.match(/^status:\s*"?(\w+)"?/m)?.[1];
    const slug = head.match(/^slug:\s*"?([^"\n]+)"?/m)?.[1] ?? f.replace(/\.md$/, "");
    if (status === "published") slugs.add(slug.trim());
  }
  return slugs;
}

const errors: string[] = [];
const warnings: string[] = [];
const err = (p: Page, m: string) => errors.push(`${p.slug}: ${m}`);
const warn = (p: Page, m: string) => warnings.push(`${p.slug}: ${m}`);

const FORBIDDEN = [
  { re: /—/, name: "em dash" },
  { re: /–/, name: "en dash" },
  { re: /&/, name: "ampersand" },
];
// Claims the product cannot back (checked against the code on 2026-10-29).
const FALSE_CLAIMS = [
  /works offline/i,
  /hors ligne/i,
  /sin conexi[oó]n/i,
  /offline nutzbar/i,
  /open[- ]source/i,
  /no data (is )?(sent|collected)/i,
];

const seoSlugs = new Set(seoPages.map((p) => p.slug));
const seen = new Map<string, Page>();
const minutesByLang = new Map<string, Page>();
const titles = new Map<string, Page>();
const descriptions = new Map<string, Page>();
const blogCache = new Map<string, Set<string>>();

for (const p of pages) {
  if (seen.has(p.slug)) err(p, "duplicate slug");
  seen.set(p.slug, p);
  if (seoSlugs.has(p.slug)) err(p, "slug collides with an SEO landing page");
  if (!/^[a-z0-9-]+$/.test(p.slug)) err(p, "slug must be lowercase ascii with dashes");

  const key = `${p.lang}:${p.minutes}`;
  if (minutesByLang.has(key)) err(p, `same duration as ${minutesByLang.get(key)!.slug} in ${p.lang} (cannibalization)`);
  minutesByLang.set(key, p);

  if (titles.has(p.title)) err(p, `same title as ${titles.get(p.title)!.slug}`);
  titles.set(p.title, p);
  if (descriptions.has(p.description)) err(p, `same description as ${descriptions.get(p.description)!.slug}`);
  descriptions.set(p.description, p);

  if (p.title.length > 60) err(p, `title ${p.title.length} chars (max 60)`);
  if (p.description.length < 110 || p.description.length > 165)
    err(p, `description ${p.description.length} chars (110 to 165)`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.published)) err(p, "published must be YYYY-MM-DD");
  if (!["focus", "break", "micro"].includes(p.role)) err(p, `unknown role ${p.role}`);
  if (p.role === "focus" && !p.breakMinutes) warn(p, "focus page without a break mode");
  if (p.useCases.length < 4) err(p, "needs at least 4 use cases");
  if (p.sections.length < 3) err(p, "needs at least 3 sections");
  if (p.faq.length < 3) err(p, "needs at least 3 FAQ entries");

  const text = [
    p.title, p.description, p.h1, p.intro, p.label,
    ...p.useCases,
    ...p.sections.flatMap((s) => [s.heading, s.body]),
    ...p.faq.flatMap((f) => [f.q, f.a]),
  ].join("\n");

  for (const f of FORBIDDEN) if (f.re.test(text)) err(p, `contains ${f.name}`);
  for (const re of FALSE_CLAIMS) if (re.test(text)) err(p, `unverifiable product claim: ${re}`);

  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 380) err(p, `${words} words (min 380): too thin for a page of its own`);

  if (!blogCache.has(p.lang)) blogCache.set(p.lang, publishedBlogSlugs(p.lang));
  const blog = blogCache.get(p.lang)!;
  const related = p.relatedArticleSlugs ?? [];
  if (related.length < 2) warn(p, "fewer than 2 related articles");
  for (const s of related) if (!blog.has(s)) err(p, `related article "${s}" is not published in ${p.lang}`);
}

for (const lang of new Set(pages.map((p) => p.lang))) {
  if (!indexSource.includes(`./${lang}"`)) errors.push(`${lang}.ts is not registered in lib/seo/timers/index.ts`);
}

console.log(`${pages.length} timer pages checked (${[...new Set(pages.map((p) => p.lang))].join(", ")})`);
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
if (errors.length) {
  console.log(`${errors.length} error(s): do not publish.`);
  process.exit(1);
}
console.log("OK");

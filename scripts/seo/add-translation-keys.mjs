#!/usr/bin/env node
/**
 * Injects `translationKey` into the frontmatter of translated article clusters
 * so `getTranslations()` (lib/blog/reader.ts) can emit hreflang alternates.
 *
 * The translationKey value is always the English slug of the cluster.
 * Files that already carry a translationKey are left untouched.
 *
 * Usage:
 *   node scripts/seo/add-translation-keys.mjs            # apply
 *   node scripts/seo/add-translation-keys.mjs --dry-run  # preview only
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");
const LANGS = ["en", "fr", "es", "de"];
const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Each cluster: English slug (= translationKey) mapped to its translations.
 * The `en` entry is implicit — it equals the cluster key.
 */
const CLUSTERS = {
  // --- EN + FR + ES + DE ---
  "best-pomodoro-apps-2026": {
    fr: "meilleures-apps-pomodoro-2026",
    es: "mejores-apps-pomodoro-2026",
    de: "beste-pomodoro-apps-2026",
  },
  "context-switching-cost-development": {
    fr: "cout-changement-contexte-developpeurs",
    es: "coste-cambio-contexto-desarrolladores",
    de: "kontextwechsel-kosten-entwickler",
  },
  "ultradian-rhythms-natural-focus-cycles": {
    fr: "rythmes-ultradiens-cycles-concentration-naturels",
    es: "ritmos-ultradianos-ciclos-concentracion",
    de: "ultradiane-rhythmen-fokus-zyklen",
  },
  "ambient-sounds-productivity-science": {
    fr: "meilleurs-sons-ambiance-concentration",
    es: "mejores-sonidos-ambientales-concentrarse",
    de: "beste-ambient-sounds-konzentrieren",
  },
  "remote-worker-guide-staying-focused": {
    fr: "organiser-journee-teletravail",
    es: "organizar-dia-trabajo-home-office",
    de: "homeoffice-fokussiert-bleiben",
  },

  // --- EN + FR + ES ---
  "best-study-techniques-science": {
    fr: "meilleures-techniques-etude-science",
    es: "mejores-tecnicas-estudio-ciencia",
  },
  "long-pomodoro-sessions-guide": {
    fr: "sessions-pomodoro-longues-guide",
    es: "sesiones-pomodoro-largas-guia",
  },
  "stop-procrastinating-timeboxing": {
    fr: "vaincre-procrastination-pomodoro",
    es: "dejar-procrastinar-tecnica-pomodoro",
  },
  "study-active-recall-spaced-repetition": {
    fr: "pomodoro-etudiants-reviser-efficacement",
    es: "pomodoro-estudiantes-estudiar-mejor",
  },

  // --- EN + FR ---
  "ai-era-productivity-guide": { fr: "productivite-ere-ia-guide" },
  "developer-productivity-ai-era": { fr: "productivite-developpeur-ere-ia" },
  "ai-writing-keep-your-voice": { fr: "ia-ecriture-garder-sa-voix" },
  "consultant-orchestrate-ai-tools": { fr: "consultant-orchestrer-ia" },
  "managers-when-not-to-use-ai": { fr: "managers-quand-ne-pas-utiliser-ia" },
  "pomodoro-2-automated-workflows": { fr: "pomodoro-2-workflows-automatises" },
  "ai-productivity-tools-focus": { fr: "outils-ia-productivite-concentration" },
  "avoid-burnout-software-engineer": { fr: "eviter-burnout-developpeur" },
  "build-daily-focus-habit-30-days": {
    fr: "habitude-concentration-quotidienne-30-jours",
  },
  "customize-pomodoro-intervals": { fr: "personnaliser-intervalles-pomodoro" },
  "2-minute-rule-with-pomodoro": { fr: "regle-2-minutes-pomodoro-combo" },
  "deep-work-programmers-framework": { fr: "deep-work-concentration-profonde" },
  "why-multitasking-kills-productivity": { fr: "multitache-mythe-quoi-faire" },
  "use-pomodoro-breaks-effectively": { fr: "pauses-productives-que-faire" },
  "recover-focus-after-interruption": {
    fr: "recuperer-concentration-apres-interruption",
  },
  "morning-routines-productive-people": { fr: "routine-matinale-gens-productifs" },
};

const filePath = (lang, slug) => path.join(CONTENT_DIR, lang, `${slug}.md`);

/** Flatten clusters into one entry per file, English slug included. */
function buildPlan() {
  const plan = [];
  const errors = [];
  const seen = new Map();

  for (const [key, translations] of Object.entries(CLUSTERS)) {
    const targets = [["en", key], ...Object.entries(translations)];

    for (const [lang, slug] of targets) {
      const file = filePath(lang, slug);

      if (!fs.existsSync(file)) {
        errors.push(`[${key}] missing file: content/blog/${lang}/${slug}.md`);
        continue;
      }

      const dupe = seen.get(file);
      if (dupe) {
        errors.push(
          `[${key}] ambiguous: content/blog/${lang}/${slug}.md is already claimed by cluster "${dupe}"`
        );
        continue;
      }
      seen.set(file, key);

      const raw = fs.readFileSync(file, "utf-8");
      const { data } = matter(raw);

      if (data.status !== "published") {
        errors.push(
          `[${key}] content/blog/${lang}/${slug}.md is "${data.status}" — hreflang only covers published articles`
        );
        continue;
      }

      let action = "write";
      if (data.translationKey === key) action = "skip (already correct)";
      else if (data.translationKey)
        action = `skip (already tagged "${data.translationKey}")`;

      plan.push({ key, lang, slug, file, raw, action });
    }
  }

  return { plan, errors };
}

/** Insert `translationKey: <key>` as the last frontmatter line, byte-preserving the rest. */
function withTranslationKey(raw, key) {
  const lines = raw.split("\n");
  if (lines[0].trim() !== "---") {
    throw new Error("file does not start with a frontmatter delimiter");
  }
  const closing = lines.findIndex((line, i) => i > 0 && line.trim() === "---");
  if (closing === -1) throw new Error("unterminated frontmatter");

  lines.splice(closing, 0, `translationKey: ${key}`);
  return lines.join("\n");
}

/** Every published fr/es/de article should belong to a cluster. */
function reportOrphans(taggedFiles) {
  const orphans = [];
  for (const lang of LANGS) {
    const dir = path.join(CONTENT_DIR, lang);
    if (!fs.existsSync(dir)) continue;

    for (const filename of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const file = path.join(dir, filename);
      const { data } = matter(fs.readFileSync(file, "utf-8"));
      if (data.status !== "published") continue;
      if (data.translationKey || taggedFiles.has(file)) continue;
      orphans.push(`${lang}/${filename.replace(/\.md$/, "")}`);
    }
  }
  return orphans;
}

const { plan, errors } = buildPlan();

console.log(`\n=== Mapping (${Object.keys(CLUSTERS).length} clusters) ===\n`);
for (const key of Object.keys(CLUSTERS)) {
  const rows = plan.filter((p) => p.key === key);
  console.log(`translationKey: ${key}`);
  for (const row of rows) {
    console.log(`  ${row.lang.padEnd(3)} ${row.slug.padEnd(52)} ${row.action}`);
  }
  console.log("");
}

if (errors.length > 0) {
  console.error(`=== ${errors.length} ERROR(S) — nothing written ===`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const toWrite = plan.filter((p) => p.action === "write");
const skipped = plan.filter((p) => p.action !== "write");

if (DRY_RUN) {
  console.log(`--dry-run: would write ${toWrite.length} file(s), skip ${skipped.length}.`);
  process.exit(0);
}

for (const row of toWrite) {
  fs.writeFileSync(row.file, withTranslationKey(row.raw, row.key), "utf-8");
}

const byLang = LANGS.map((lang) => {
  const n = toWrite.filter((r) => r.lang === lang).length;
  return `${lang}=${n}`;
}).join("  ");

console.log("=== Result ===");
console.log(`  tagged:  ${toWrite.length} file(s)   (${byLang})`);
console.log(`  skipped: ${skipped.length} file(s) already tagged`);

const orphans = reportOrphans(new Set(toWrite.map((r) => r.file)));
const nonEn = orphans.filter((o) => !o.startsWith("en/"));
if (nonEn.length > 0) {
  console.log(`\n  WARNING — published non-EN articles with no cluster (${nonEn.length}):`);
  for (const o of nonEn) console.log(`    ${o}`);
} else {
  console.log("\n  All published fr/es/de articles belong to a cluster.");
}
console.log(`  EN articles without a cluster (expected, EN-only): ${orphans.length - nonEn.length}`);

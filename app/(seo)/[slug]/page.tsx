import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { seoPages, getSeoPageBySlug } from "@/lib/seo/pages";
import { getArticleBySlug } from "@/lib/blog/reader";
import { SITE_URL } from "@/lib/constants";
import {
  APP_ID,
  LOGO_ID,
  WEBSITE_ID,
  breadcrumbNode,
  graph,
  siteNodes,
  softwareAppNode,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return seoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      siteName: "Pomodorian",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    alternates: {
      canonical: `${SITE_URL}/${page.slug}`,
    },
  };
}

const features = [
  {
    icon: "🧠",
    title: "AI Session Planner",
    text: "Describe your goal, get a structured task list with time estimates. Supports 8 languages.",
  },
  {
    icon: "🎵",
    title: "Ambient Sounds",
    text: "5 layerable sounds: rain, café, lo-fi, forest, fireplace. All free, individual volume controls.",
  },
  {
    icon: "📊",
    title: "Focus Analytics",
    text: "GitHub-style contribution heatmap, daily focus stats, and streak tracking.",
  },
  {
    icon: "⌨️",
    title: "Keyboard Shortcuts",
    text: "Space to start/pause, 1/2/3 to switch modes, S for settings, R for analytics.",
  },
  {
    icon: "🔒",
    title: "Private by Design",
    text: "All your data stays in your browser. No account, no cloud, no tracking.",
  },
  {
    icon: "🎨",
    title: "Dark & Light Mode",
    text: "Beautiful glassmorphism design with smooth animations. Customize your theme.",
  },
];

interface CompetitorFacts {
  aiPlanning: string;
  ambientSounds: string;
  analytics: string;
  price: string;
  platform: string;
  accountRequired: string;
  offline: string;
}

// Sourced from the competitor facts sheet, verified 2026-07-27.
// Unverified or single-source figures are phrased cautiously rather than stated as exact.
const COMPETITOR_DATA: Record<string, CompetitorFacts> = {
  Pomofocus: {
    aiPlanning: "No",
    ambientSounds: "Yes (free, customizable)",
    analytics: "Basic reports",
    price: "≈ $3/mo (third-party listings)",
    platform: "Web (PWA) + Mac/Windows/Linux apps",
    accountRequired: "No (basic use)",
    offline: "Yes (PWA)",
  },
  Forest: {
    aiPlanning: "No",
    ambientSounds: "1 free, rest paid",
    analytics: "Paid only (Forest Plus)",
    price: "Free tier + paid Plus",
    platform: "iOS, Android, Apple Watch, browser ext.",
    accountRequired: "No for basic use, yes for sync",
    offline: "Yes (timer & stats work offline)",
  },
  "Focus To-Do": {
    aiPlanning: "No",
    ambientSounds: "Yes (white noise, partly free)",
    analytics: "Basic stats (free tier)",
    price: "$1.99 (App Store, billing period unspecified)",
    platform: "Android, iOS, Mac, Windows, Apple Watch, browser ext.",
    accountRequired: "Not documented",
    offline: "Not documented",
  },
  "Toggl Track": {
    aiPlanning: "No",
    ambientSounds: "Not documented",
    analytics: "Reports + CSV/PDF export",
    price: "$9/user/mo (Starter, billed annually)",
    platform: "Web, iOS, Android, Windows, macOS, browser ext.",
    accountRequired: "Yes",
    offline: "Yes (desktop app, syncs later)",
  },
};

const POMODORIAN_FACTS: CompetitorFacts = {
  aiPlanning: "Yes (8 languages)",
  ambientSounds: "5 free sounds",
  analytics: "Heatmap + stats + export",
  price: "Free",
  platform: "Web (any device)",
  accountRequired: "No",
  offline: "No",
};

const COMPARISON_ROWS: { key: keyof CompetitorFacts; label: string }[] = [
  { key: "aiPlanning", label: "AI Session Planning" },
  { key: "ambientSounds", label: "Ambient Sounds" },
  { key: "analytics", label: "Focus Analytics" },
  { key: "price", label: "Price" },
  { key: "platform", label: "Platform" },
  { key: "accountRequired", label: "Account required" },
  { key: "offline", label: "Offline mode" },
];

/** Comparison pages target competitor-brand queries, so the h1 cannot be
 * relied on to name the competitor. Fall back to it only for legacy entries. */
function competitorName(page: typeof seoPages[number]) {
  return page.competitor ?? page.h1.replace("Pomodorian vs ", "");
}

function ComparisonTable({ page }: { page: typeof seoPages[number] }) {
  if (page.category !== "comparison") return null;

  const competitor = competitorName(page);
  const facts = COMPETITOR_DATA[competitor];
  if (!facts) return null;

  return (
    <div className="overflow-x-auto my-10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-muted">Feature</th>
            <th className="text-left py-3 px-4 text-red-400 font-semibold">Pomodorian</th>
            <th className="text-left py-3 px-4 text-muted">{competitor}</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.key} className="border-b border-border/50">
              <td className="py-3 px-4 text-muted">{row.label}</td>
              <td className="py-3 px-4">{POMODORIAN_FACTS[row.key]}</td>
              <td className="py-3 px-4 text-muted">{facts[row.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted mt-2">
        Features and pricing verified on {page.verifiedOn ?? "July 27, 2026"}.
      </p>
    </div>
  );
}

export default async function SeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);

  if (!page) notFound();

  const pageUrl = `${SITE_URL}/${page.slug}`;

  const webPageNode = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": APP_ID },
    primaryImageOfPage: { "@id": LOGO_ID },
    inLanguage: "en",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "header > p"],
    },
  };

  // Mirrors the ComparisonTable rendered below, so the list has visible backing.
  const comparisonNode =
    page.category === "comparison"
      ? {
          "@type": "ItemList",
          "@id": `${pageUrl}#comparison`,
          name: page.h1,
          itemListElement: [
            { "@type": "ListItem", position: 1, item: { "@id": APP_ID } },
            {
              "@type": "ListItem",
              position: 2,
              item: {
                "@type": "SoftwareApplication",
                name: competitorName(page),
                applicationCategory: "ProductivityApplication",
              },
            },
          ],
        }
      : null;

  const crumbs = breadcrumbNode([
    { name: "Home", url: SITE_URL },
    { name: page.h1, url: pageUrl },
  ]);

  return (
    <>
      <JsonLd
        data={graph([
          ...siteNodes,
          softwareAppNode,
          webPageNode,
          ...(comparisonNode ? [comparisonNode] : []),
          crumbs,
        ])}
      />

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            &larr; Back to Pomodorian
          </Link>

          <header className="mt-8 mb-10">
            <h1 className="text-3xl font-bold leading-tight">{page.h1}</h1>
            <p className="text-muted mt-4 text-lg leading-relaxed">
              {page.intro}
            </p>
          </header>

          <ComparisonTable page={page} />

          <section className="my-12">
            <h2 className="text-xl font-bold mb-6">
              Why Pomodorian?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="glass rounded-xl p-5"
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="my-12">
            <h2 className="text-xl font-bold mb-4">
              How to Get Started
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                1. <strong className="text-foreground">Open Pomodorian</strong>: no
                download, no account needed. Works in any browser.
              </p>
              <p>
                2. <strong className="text-foreground">Plan with AI</strong>: click
                the AI planner, describe your goal, and get a structured task list in
                seconds.
              </p>
              <p>
                3. <strong className="text-foreground">Start focusing</strong>: hit
                Start, put on ambient sounds, and work through your tasks one pomodoro
                at a time.
              </p>
              <p>
                4. <strong className="text-foreground">Track your progress</strong>:
                check your analytics to see your focus patterns and build a consistency
                streak.
              </p>
            </div>
          </section>

          {page.sections && page.sections.length > 0 && (
            <section className="my-12 space-y-8">
              {page.sections.map((s) => (
                <div key={s.heading}>
                  <h2 className="text-xl font-bold mb-3">{s.heading}</h2>
                  <p className="text-muted leading-relaxed">{s.body}</p>
                </div>
              ))}
            </section>
          )}

          {page.relatedArticleSlugs && page.relatedArticleSlugs.length > 0 && (
            <section className="my-12">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <div className="space-y-3">
                {page.relatedArticleSlugs
                  .map((s) => {
                    const article = getArticleBySlug(s);
                    if (!article) return null;
                    return (
                      <Link
                        key={s}
                        href={`/blog/${s}`}
                        className="block glass rounded-xl p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="font-semibold">{article.title}</div>
                        <div className="text-sm text-muted mt-1">
                          {article.description}
                        </div>
                      </Link>
                    );
                  })
                  .filter(Boolean)}
              </div>
            </section>
          )}

          <div className="mt-16 glass rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Ready to focus smarter?
            </h3>
            <p className="text-muted mb-4">
              Try Pomodorian, the AI-powered Pomodoro timer. Free, no account
              required.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition-colors"
            >
              Start Focusing
            </Link>
          </div>

          <nav className="mt-12 pt-8 border-t border-border">
            <h2 className="text-sm font-semibold text-muted mb-3">
              Related
            </h2>
            <div className="flex flex-wrap gap-2">
              {seoPages
                .filter((p) => p.slug !== page.slug && p.category === page.category)
                .slice(0, 4)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
                  >
                    {p.h1}
                  </Link>
                ))}
            </div>
            <Link
              href="/blog"
              className="inline-block mt-4 text-sm text-muted hover:text-foreground transition-colors"
            >
              Read the blog &rarr;
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

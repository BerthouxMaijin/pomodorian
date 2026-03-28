import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { seoPages, getSeoPageBySlug } from "@/lib/seo/pages";
import { SITE_URL } from "@/lib/constants";

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
    text: "5 layerable sounds — rain, café, lo-fi, nature, fireplace. All free, individual volume controls.",
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
    icon: "📱",
    title: "Works Offline",
    text: "Install as a PWA, use without internet. All data stays in your browser.",
  },
  {
    icon: "🎨",
    title: "Dark & Light Mode",
    text: "Beautiful glassmorphism design with smooth animations. Customize your theme.",
  },
];

function ComparisonTable({ page }: { page: typeof seoPages[number] }) {
  if (page.category !== "comparison") return null;

  const competitor = page.h1.replace("Pomodorian vs ", "");

  const rows = [
    { feature: "AI Session Planning", pomodorian: "Yes", competitor: competitor === "Pomofocus" ? "No" : competitor === "Forest" ? "No" : competitor === "Focus To-Do" ? "No" : "No" },
    { feature: "Ambient Sounds", pomodorian: "5 free sounds", competitor: competitor === "Pomofocus" ? "Paid only" : "No" },
    { feature: "Focus Analytics", pomodorian: "Heatmap + stats", competitor: competitor === "Toggl Track" ? "Detailed reports" : "Basic" },
    { feature: "Offline Support", pomodorian: "Yes (PWA)", competitor: competitor === "Pomofocus" ? "No" : "Yes" },
    { feature: "Price", pomodorian: "Free", competitor: competitor === "Forest" ? "Paid" : "Freemium" },
    { feature: "Platform", pomodorian: "Web (any device)", competitor: competitor === "Forest" ? "Mobile only" : "Web + Mobile" },
    { feature: "Account Required", pomodorian: "No", competitor: competitor === "Forest" ? "Yes" : "For full features" },
  ];

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
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-border/50">
              <td className="py-3 px-4 text-muted">{row.feature}</td>
              <td className="py-3 px-4">{row.pomodorian}</td>
              <td className="py-3 px-4 text-muted">{row.competitor}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `${SITE_URL}/${page.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Pomodorian",
      url: SITE_URL,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "header > p"],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: page.h1,
        item: `${SITE_URL}/${page.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
                1. <strong className="text-foreground">Open Pomodorian</strong> — no
                download, no account needed. Works in any browser.
              </p>
              <p>
                2. <strong className="text-foreground">Plan with AI</strong> — click
                the AI planner, describe your goal, and get a structured task list in
                seconds.
              </p>
              <p>
                3. <strong className="text-foreground">Start focusing</strong> — hit
                Start, put on ambient sounds, and work through your tasks one pomodoro
                at a time.
              </p>
              <p>
                4. <strong className="text-foreground">Track your progress</strong> —
                check your analytics to see your focus patterns and build a consistency
                streak.
              </p>
            </div>
          </section>

          <div className="mt-16 glass rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Ready to focus smarter?
            </h3>
            <p className="text-muted mb-4">
              Try Pomodorian — the AI-powered Pomodoro timer. Free, no account
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

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPublishedArticles,
  getArticleBySlug,
  getAllSlugs,
} from "@/lib/blog/reader";
import { SITE_URL } from "@/lib/constants";

const SUPPORTED_LANGS = ["en", "fr", "es", "de"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
};

function parsePath(path?: string[]): { lang: Lang; slug?: string } {
  if (!path || path.length === 0) return { lang: "en" };

  const first = path[0];

  if (SUPPORTED_LANGS.includes(first as Lang)) {
    return { lang: first as Lang, slug: path[1] };
  }

  // First segment is not a lang → it's an EN slug
  return { lang: "en", slug: first };
}

// ─── Static params ───────────────────────────────────────────────

export function generateStaticParams() {
  const params: { path: string[] }[] = [];

  for (const lang of SUPPORTED_LANGS) {
    const slugs = getAllSlugs(lang);
    if (slugs.length === 0) continue;

    // Language index (skip "en" — that's the default /blog)
    if (lang !== "en") {
      params.push({ path: [lang] });
    }

    // Article pages
    for (const slug of slugs) {
      params.push({ path: lang === "en" ? [slug] : [lang, slug] });
    }
  }

  return params;
}

// ─── Metadata ────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  const { lang, slug } = parsePath(path);

  if (!slug) {
    const title =
      lang === "en"
        ? "Blog — Pomodorian"
        : `Blog (${LANG_LABELS[lang]}) — Pomodorian`;
    return {
      title,
      description:
        "Articles about the Pomodoro Technique, productivity, focus, and how AI can help you work smarter.",
      openGraph: { title },
      alternates: {
        canonical: `${SITE_URL}/blog${lang === "en" ? "" : `/${lang}`}`,
        languages: {
          en: `${SITE_URL}/blog`,
          fr: `${SITE_URL}/blog/fr`,
          es: `${SITE_URL}/blog/es`,
          de: `${SITE_URL}/blog/de`,
          "x-default": `${SITE_URL}/blog`,
        },
      },
    };
  }

  const article = getArticleBySlug(slug, lang);
  if (!article) return {};

  return {
    title: `${article.title} — Pomodorian Blog`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      siteName: "Pomodorian",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${lang === "en" ? slug : `${lang}/${slug}`}`,
    },
  };
}

// ─── Markdown renderer ──────────────────────────────────────────

function markdownToHtml(md: string): string {
  return md
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-semibold mt-8 mb-3">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-bold mt-10 mb-4">$1</h2>'
    )
    .replace(
      /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g,
      '<a href="$2" class="font-semibold text-red-400 hover:text-red-300 underline underline-offset-2">$1</a>'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-red-400 hover:text-red-300 underline underline-offset-2">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /^\| (.+)$/gm,
      (line) =>
        `<div class="overflow-x-auto text-sm text-muted">${line}</div>`
    )
    .replace(
      /^(\d+)\. \*\*(.+?)\*\*(.*)$/gm,
      '<div class="flex gap-3 my-2"><span class="text-muted font-mono text-sm mt-0.5">$1.</span><div><strong>$2</strong>$3</div></div>'
    )
    .replace(
      /^- \*\*(.+?)\*\*: (.+)$/gm,
      '<div class="flex gap-2 my-1.5 ml-4"><span class="text-muted">•</span><div><strong>$1</strong>: $2</div></div>'
    )
    .replace(
      /^- (.+)$/gm,
      '<div class="flex gap-2 my-1 ml-4"><span class="text-muted">•</span><div>$1</div></div>'
    )
    .replace(/\n\n/g, '</p><p class="my-4 leading-relaxed text-muted">')
    .replace(/^/, '<p class="my-4 leading-relaxed text-muted">')
    .replace(/$/, "</p>");
}

// ─── Language picker ────────────────────────────────────────────

function LangPicker({ current }: { current: Lang }) {
  const langsWithArticles = SUPPORTED_LANGS.filter(
    (l) => getPublishedArticles(l).length > 0
  );

  if (langsWithArticles.length <= 1) return null;

  return (
    <div className="flex gap-2 text-sm">
      {langsWithArticles.map((l) => (
        <Link
          key={l}
          href={l === "en" ? "/blog" : `/blog/${l}`}
          className={`px-3 py-1 rounded-lg transition-colors ${
            l === current
              ? "bg-red-500/20 text-red-400 font-medium"
              : "text-muted hover:text-foreground"
          }`}
        >
          {LANG_LABELS[l]}
        </Link>
      ))}
    </div>
  );
}

// ─── Page component ─────────────────────────────────────────────

export default async function BlogPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const { lang, slug } = parsePath(path);

  // ── Article page ──
  if (slug) {
    const article = getArticleBySlug(slug, lang);
    if (!article) notFound();

    const articleUrl = `${SITE_URL}/blog/${lang === "en" ? slug : `${lang}/${slug}`}`;
    const authorName = article.author || "Jean-Baptiste Berthoux";

    const wordCount = article.content.split(/\s+/).length;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.date,
      inLanguage: lang,
      wordCount,
      author: {
        "@type": "Person",
        name: authorName,
        url: `${SITE_URL}/about`,
        jobTitle: "Founder & Developer",
        sameAs: [
          "https://github.com/BerthouxMaijin",
          "https://linkedin.com/in/jbberthoux",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "Pomodorian",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icons/icon-512.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      keywords: article.keywords.join(", "),
      isPartOf: {
        "@type": "Blog",
        name: "Pomodorian Blog",
        url: `${SITE_URL}/blog`,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "article > header > p"],
      },
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    };

    return (
      <>
        {lang !== "en" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.lang="${lang}"`,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <div className="min-h-screen bg-background text-foreground">
          <article className="max-w-3xl mx-auto px-6 pt-12 pb-20">
            <Link
              href={lang === "en" ? "/blog" : `/blog/${lang}`}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              &larr; All articles
            </Link>

            <header className="mt-8 mb-10">
              <div className="flex items-center gap-3 text-xs text-muted mb-3">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString(
                    lang === "en"
                      ? "en-US"
                      : lang === "fr"
                        ? "fr-FR"
                        : lang === "es"
                          ? "es-ES"
                          : "de-DE",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </time>
                <span>&middot;</span>
                <span>{article.readTime} read</span>
                <span>&middot;</span>
                <span>By {authorName}</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight">
                {article.title}
              </h1>
              <p className="text-muted mt-3 text-lg leading-relaxed">
                {article.description}
              </p>
            </header>

            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(article.content),
              }}
            />

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
          </article>
        </div>
      </>
    );
  }

  // ── Index page ──
  const articles = getPublishedArticles(lang);

  return (
    <>
    {lang !== "en" && (
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}"`,
        }}
      />
    )}
    <div className="min-h-screen bg-background text-foreground">
      <header className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to Pomodorian
        </Link>
        <div className="flex items-center justify-between mt-6">
          <h1 className="text-3xl font-bold">Blog</h1>
          <LangPicker current={lang} />
        </div>
        <p className="text-muted mt-2">
          Guides, tips, and insights on focus, productivity, and the Pomodoro
          Technique.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        {articles.length === 0 ? (
          <p className="text-muted text-center py-12">
            No articles yet in {LANG_LABELS[lang]}. Check back soon!
          </p>
        ) : (
          articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${lang === "en" ? article.slug : `${lang}/${article.slug}`}`}
              className="block glass rounded-2xl p-6 hover:bg-surface-hover transition-colors group"
            >
              <div className="flex items-center gap-3 text-xs text-muted mb-2">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString(
                    lang === "en"
                      ? "en-US"
                      : lang === "fr"
                        ? "fr-FR"
                        : lang === "es"
                          ? "es-ES"
                          : "de-DE",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </time>
                <span>&middot;</span>
                <span>{article.readTime} read</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground group-hover:text-white transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                {article.description}
              </p>
            </Link>
          ))
        )}
      </main>
    </div>
    </>
  );
}

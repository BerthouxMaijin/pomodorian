import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPublishedArticles,
  getArticleBySlug,
  getAllSlugs,
  getTranslations,
} from "@/lib/blog/reader";
import { SITE_URL } from "@/lib/constants";
import { markdownToHtml } from "@/lib/markdown";
import { TrackedCtaLink } from "@/components/blog/TrackedCtaLink";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ORG_ID,
  WEBSITE_ID,
  PERSON_ID,
  siteNodes,
  breadcrumbNode,
  graph,
} from "@/lib/schema";

const SUPPORTED_LANGS = ["en", "fr", "es", "de"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
};

const CTA_STRINGS: Record<
  Lang,
  {
    tagline: string;
    button: string;
    bottomTitle: string;
    bottomText: string;
    bottomButton: string;
  }
> = {
  en: {
    tagline: "Pomodorian is a free, AI-powered Pomodoro timer. No account required.",
    button: "Try the timer",
    bottomTitle: "Ready to focus smarter?",
    bottomText:
      "Try Pomodorian, the AI-powered Pomodoro timer. Free, no account required.",
    bottomButton: "Start Focusing",
  },
  fr: {
    tagline:
      "Pomodorian est un minuteur Pomodoro gratuit dopé à l'IA. Sans compte.",
    button: "Essayer le minuteur",
    bottomTitle: "Prêt à mieux vous concentrer ?",
    bottomText:
      "Essayez Pomodorian, le minuteur Pomodoro dopé à l'IA. Gratuit, sans compte.",
    bottomButton: "Lancer une session",
  },
  es: {
    tagline:
      "Pomodorian es un temporizador Pomodoro gratuito con IA. Sin cuenta.",
    button: "Probar el temporizador",
    bottomTitle: "¿Listo para concentrarte mejor?",
    bottomText:
      "Prueba Pomodorian, el temporizador Pomodoro con IA. Gratis y sin cuenta.",
    bottomButton: "Empezar a concentrarme",
  },
  de: {
    tagline:
      "Pomodorian ist ein kostenloser, KI-gestützter Pomodoro-Timer. Ohne Konto.",
    button: "Timer ausprobieren",
    bottomTitle: "Bereit für besseren Fokus?",
    bottomText:
      "Probiere Pomodorian, den KI-gestützten Pomodoro-Timer. Kostenlos, ohne Konto.",
    bottomButton: "Fokus starten",
  },
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
        ? "Blog | Pomodorian"
        : `Blog (${LANG_LABELS[lang]}) | Pomodorian`;
    return {
      title,
      description:
        "Articles about the Pomodoro Technique, productivity, focus, and how AI can help you work smarter.",
      openGraph: {
        title,
        images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      },
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

  const alternates: Metadata["alternates"] = {
    canonical: `${SITE_URL}/blog/${lang === "en" ? slug : `${lang}/${slug}`}`,
  };

  if (article.translationKey) {
    const translations = getTranslations(article.translationKey);
    if (translations.length > 1) {
      const languages: Record<string, string> = {};
      for (const t of translations) {
        languages[t.lang] =
          `${SITE_URL}/blog/${t.lang === "en" ? t.slug : `${t.lang}/${t.slug}`}`;
      }
      const enTranslation = translations.find((t) => t.lang === "en");
      if (enTranslation) {
        languages["x-default"] = `${SITE_URL}/blog/${enTranslation.slug}`;
      }
      alternates.languages = languages;
    }
  }

  return {
    title:
      article.title.length <= 48
        ? `${article.title} | Pomodorian`
        : article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      siteName: "Pomodorian",
      images: [
        {
          url: `/og/blog?slug=${encodeURIComponent(slug)}&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`/og/blog?slug=${encodeURIComponent(slug)}&lang=${lang}`],
    },
    alternates,
  };
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

// ─── Schema helpers ─────────────────────────────────────────────

function parseReadTimeToISO8601(readTime: string): string | undefined {
  const match = readTime.match(/\d+/);
  return match ? `PT${match[0]}M` : undefined;
}

function formatSourceUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const short = `${parsed.hostname}${parsed.pathname}`;
    return short.length > 60 ? `${short.slice(0, 60)}…` : short;
  } catch {
    return url;
  }
}

const SOURCES_LABEL: Record<Lang, string> = {
  en: "Sources",
  fr: "Sources",
  es: "Fuentes",
  de: "Quellen",
};

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

    const webPageNode = {
      "@type": "WebPage",
      "@id": `${articleUrl}#webpage`,
      url: articleUrl,
      name: article.title,
      description: article.description,
      isPartOf: { "@id": WEBSITE_ID },
      primaryImageOfPage: { "@id": `${articleUrl}#primaryimage` },
      inLanguage: lang,
    };

    const articleNode = {
      "@type": "BlogPosting",
      "@id": `${articleUrl}#article`,
      headline: article.title.slice(0, 110),
      name: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.updated ?? article.date,
      inLanguage: lang,
      wordCount,
      timeRequired: parseReadTimeToISO8601(article.readTime),
      keywords: article.keywords,
      image: {
        "@type": "ImageObject",
        "@id": `${articleUrl}#primaryimage`,
        url: article.image ?? `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
      },
      author: { "@id": PERSON_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": `${SITE_URL}/blog#blog` },
      mainEntityOfPage: { "@id": `${articleUrl}#webpage` },
      ...(article.sources.length > 0 && { citation: article.sources }),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "article > header > p"],
      },
    };

    const crumbs = breadcrumbNode([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: article.title, url: articleUrl },
    ]);

    return (
      <>
        <JsonLd
          data={graph([...siteNodes, webPageNode, articleNode, crumbs])}
        />

        <div className="min-h-screen bg-background text-foreground">
          <article
            className="max-w-3xl mx-auto px-6 pt-12 pb-20"
            lang={lang !== "en" ? lang : undefined}
          >
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

            <div className="mb-10 glass rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <p className="text-sm text-muted flex-1 leading-relaxed">
                {CTA_STRINGS[lang].tagline}
              </p>
              <TrackedCtaLink
                href="/?utm_source=blog&utm_medium=cta-top"
                position="top"
                lang={lang}
                slug={slug}
                className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-400 transition-colors"
              >
                {CTA_STRINGS[lang].button} &rarr;
              </TrackedCtaLink>
            </div>

            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(article.content),
              }}
            />

            {article.sources.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">
                  {SOURCES_LABEL[lang]}
                </h2>
                <ol className="space-y-1 text-sm">
                  {article.sources.map((source) => (
                    <li key={source}>
                      <a
                        href={source}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-red-400 hover:text-red-300 underline underline-offset-2 break-all"
                      >
                        {formatSourceUrl(source)}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className="mt-16 glass rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">
                {CTA_STRINGS[lang].bottomTitle}
              </h3>
              <p className="text-muted mb-4">{CTA_STRINGS[lang].bottomText}</p>
              <TrackedCtaLink
                href="/?utm_source=blog&utm_medium=cta-bottom"
                position="bottom"
                lang={lang}
                slug={slug}
                className="inline-block px-8 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition-colors"
              >
                {CTA_STRINGS[lang].bottomButton}
              </TrackedCtaLink>
            </div>
          </article>
        </div>
      </>
    );
  }

  // ── Index page ──
  const articles = getPublishedArticles(lang);

  const indexUrl = `${SITE_URL}/blog${lang === "en" ? "" : `/${lang}`}`;
  const blogNode = {
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: indexUrl,
    name: "Pomodorian Blog",
    description:
      "Guides, tips, and insights on focus, productivity, and the Pomodoro Technique.",
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: lang,
    blogPost: articles.map((a) => {
      const url = `${SITE_URL}/blog/${lang === "en" ? a.slug : `${lang}/${a.slug}`}`;
      return {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: a.title.slice(0, 110),
        url,
        datePublished: a.date,
        author: { "@id": PERSON_ID },
      };
    }),
  };
  const indexCrumbs = breadcrumbNode([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: indexUrl },
  ]);

  return (
    <>
    <JsonLd data={graph([...siteNodes, blogNode, indexCrumbs])} />
    <div
      className="min-h-screen bg-background text-foreground"
      lang={lang !== "en" ? lang : undefined}
    >
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

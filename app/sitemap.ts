import type { MetadataRoute } from "next";
import { getPublishedArticles, getTranslations } from "@/lib/blog/reader";
import { seoPages } from "@/lib/seo/pages";
import { SITE_URL } from "@/lib/constants";

const BLOG_LANGS = ["en", "fr", "es", "de"] as const;

/**
 * Static pages have no per-page mtime, and `new Date()` would push a fresh
 * lastmod on every build — which search engines learn to ignore. Bump this
 * when the static copy actually changes.
 */
const LAST_CONTENT_UPDATE = new Date("2026-07-27");

function langPath(lang: string): string {
  return lang === "en" ? "" : `${lang}/`;
}

function alternatesFor(
  translationKey: string | undefined
): { languages: Record<string, string> } | undefined {
  if (!translationKey) return undefined;

  const translations = getTranslations(translationKey);
  if (translations.length < 2) return undefined;

  const languages = Object.fromEntries(
    translations.map(({ lang, slug }) => [
      lang,
      `${SITE_URL}/blog/${langPath(lang)}${slug}`,
    ])
  );

  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = BLOG_LANGS.flatMap((lang) => {
    const articles = getPublishedArticles(lang);
    if (articles.length === 0) return [];

    const prefix = langPath(lang);

    return [
      // Language index (skip EN, it's /blog)
      ...(lang !== "en"
        ? [
            {
              url: `${SITE_URL}/blog/${lang}`,
              lastModified: LAST_CONTENT_UPDATE,
              changeFrequency: "weekly" as const,
              priority: 0.7,
            },
          ]
        : []),
      // Articles
      ...articles.map((article) => ({
        url: `${SITE_URL}/blog/${prefix}${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: alternatesFor(article.translationKey),
      })),
    ];
  });

  const seoEntries = seoPages.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
    ...seoEntries,
    {
      url: `${SITE_URL}/about`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}

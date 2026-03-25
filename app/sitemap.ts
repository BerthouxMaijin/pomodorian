import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/blog/reader";
import { seoPages } from "@/lib/seo/pages";
import { SITE_URL } from "@/lib/constants";

const BLOG_LANGS = ["en", "fr", "es", "de"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = BLOG_LANGS.flatMap((lang) => {
    const articles = getPublishedArticles(lang);
    if (articles.length === 0) return [];

    const prefix = lang === "en" ? "" : `${lang}/`;

    return [
      // Language index (skip EN, it's /blog)
      ...(lang !== "en"
        ? [
            {
              url: `${SITE_URL}/blog/${lang}`,
              lastModified: new Date(),
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
      })),
    ];
  });

  const seoEntries = seoPages.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
    ...seoEntries,
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}

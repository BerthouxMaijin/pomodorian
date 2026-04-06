import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: string;
  keywords: string[];
  status: "published" | "draft";
  score: number;
  sources: string[];
  content: string;
  translationKey?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function readArticlesFromDir(lang: string): Article[] {
  const dir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "Jean-Baptiste Berthoux",
        readTime: data.readTime ?? "",
        keywords: data.keywords ?? [],
        status: data.status ?? "draft",
        score: data.score ?? 0,
        sources: data.sources ?? [],
        content,
        translationKey: data.translationKey,
      };
    });
}

export function getPublishedArticles(lang = "en"): Omit<Article, "content">[] {
  return readArticlesFromDir(lang)
    .filter((a) => a.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ content: _content, ...meta }) => meta);
}

export function getArticleBySlug(
  slug: string,
  lang = "en"
): Article | undefined {
  const articles = readArticlesFromDir(lang);
  return articles.find((a) => a.slug === slug && a.status === "published");
}

export function getAllSlugs(lang = "en"): string[] {
  return getPublishedArticles(lang).map((a) => a.slug);
}

const LANGS = ["en", "fr", "es", "de"] as const;

export function getTranslations(
  translationKey: string
): { lang: string; slug: string }[] {
  const results: { lang: string; slug: string }[] = [];
  for (const lang of LANGS) {
    const articles = readArticlesFromDir(lang);
    const match = articles.find(
      (a) => a.translationKey === translationKey && a.status === "published"
    );
    if (match) {
      results.push({ lang, slug: match.slug });
    }
  }
  return results;
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles } from "@/lib/blog/articles";
import { articleContent } from "@/lib/blog/content";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
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
  };
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-10 mb-4">$1</h2>')
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
      (line) => `<div class="overflow-x-auto text-sm text-muted">${line}</div>`
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  const content = articleContent[slug];

  if (!article || !content) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "Pomodorian",
      url: "https://pomodorian.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Pomodorian",
      url: "https://pomodorian.vercel.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pomodorian.vercel.app/blog/${slug}`,
    },
    keywords: article.keywords.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background text-foreground">
        <article className="max-w-3xl mx-auto px-6 pt-12 pb-20">
          <Link
            href="/blog"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            &larr; All articles
          </Link>

          <header className="mt-8 mb-10">
            <div className="flex items-center gap-3 text-xs text-muted mb-3">
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>&middot;</span>
              <span>{article.readTime} read</span>
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
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
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

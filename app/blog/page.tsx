import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/blog/articles";

export const metadata: Metadata = {
  title: "Blog — Pomodorian",
  description:
    "Articles about the Pomodoro Technique, productivity, focus, and how AI can help you work smarter.",
  openGraph: {
    title: "Blog — Pomodorian",
    description:
      "Articles about the Pomodoro Technique, productivity, focus, and AI-powered planning.",
  },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to Pomodorian
        </Link>
        <h1 className="text-3xl font-bold mt-6">Blog</h1>
        <p className="text-muted mt-2">
          Guides, tips, and insights on focus, productivity, and the Pomodoro
          Technique.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="block glass rounded-2xl p-6 hover:bg-surface-hover transition-colors group"
          >
            <div className="flex items-center gap-3 text-xs text-muted mb-2">
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
            <h2 className="text-xl font-semibold text-foreground group-hover:text-white transition-colors">
              {article.title}
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {article.description}
            </p>
          </Link>
        ))}
      </main>
    </div>
  );
}

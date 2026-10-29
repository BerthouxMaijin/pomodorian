import Link from "next/link";
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
import { EmbeddedTimer } from "@/components/timer/EmbeddedTimer";
import {
  TIMER_HUB_PATH,
  TIMER_UI,
  getTimerPagesByLang,
  type TimerPage,
} from "@/lib/seo/timers";

function blogHref(lang: string, slug: string) {
  return `/blog/${lang === "en" ? slug : `${lang}/${slug}`}`;
}

export function TimerToolPage({ page }: { page: TimerPage }) {
  const t = TIMER_UI[page.lang];
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const hubUrl = `${SITE_URL}${TIMER_HUB_PATH[page.lang]}`;

  const webPageNode = {
    "@type": ["WebPage", "FAQPage"],
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": APP_ID },
    primaryImageOfPage: { "@id": LOGO_ID },
    inLanguage: page.lang,
    datePublished: page.published,
    mainEntity: page.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const crumbs = breadcrumbNode([
    { name: "Pomodorian", url: SITE_URL },
    { name: t.hubTitle, url: hubUrl },
    { name: page.h1, url: pageUrl },
  ]);

  const related = (page.relatedArticleSlugs ?? [])
    .map((slug) => getArticleBySlug(slug, page.lang))
    .filter((a) => a !== undefined);

  const siblings = getTimerPagesByLang(page.lang).filter(
    (p) => p.slug !== page.slug
  );

  return (
    <>
      <JsonLd data={graph([...siteNodes, softwareAppNode, webPageNode, crumbs])} />

      <div
        className="min-h-screen bg-background text-foreground"
        lang={page.lang !== "en" ? page.lang : undefined}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">
          <nav className="text-sm text-muted flex flex-wrap gap-x-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Pomodorian
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={TIMER_HUB_PATH[page.lang]}
              className="hover:text-foreground transition-colors"
            >
              {t.allTimers}
            </Link>
          </nav>

          <header className="mt-6 mb-8">
            <h1 className="text-3xl font-bold leading-tight">{page.h1}</h1>
            <p className="text-muted mt-4 text-lg leading-relaxed">{page.intro}</p>
          </header>

          <EmbeddedTimer
            minutes={page.minutes}
            breakMinutes={page.breakMinutes}
            lang={page.lang}
            slug={page.slug}
            role={page.role}
          />

          <section className="my-12">
            <h2 className="text-xl font-bold mb-4">{t.usesHeading(page.label)}</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed">
              {page.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </section>

          <section className="my-12 space-y-8">
            {page.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-bold mb-3">{s.heading}</h2>
                <p className="text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </section>

          <section className="my-12">
            <h2 className="text-xl font-bold mb-4">{t.faqHeading}</h2>
            <div className="space-y-6">
              {page.faq.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold mb-1">{q}</h3>
                  <p className="text-muted leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section className="my-12">
              <h2 className="text-xl font-bold mb-4">{t.relatedHeading}</h2>
              <div className="space-y-3">
                {related.map((article) => (
                  <Link
                    key={article.slug}
                    href={blogHref(page.lang, article.slug)}
                    className="block glass rounded-xl p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="font-semibold">{article.title}</div>
                    <div className="text-sm text-muted mt-1">{article.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 glass rounded-2xl p-8 text-center">
            <p className="text-muted mb-4">{t.appPitch}</p>
            <Link
              href={page.role === "focus" ? `/?focus=${page.minutes}` : "/"}
              className="inline-block px-8 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition-colors"
            >
              {t.openApp}
            </Link>
          </div>

          {siblings.length > 0 && (
            <nav className="mt-12 pt-8 border-t border-border">
              <h2 className="text-sm font-semibold text-muted mb-3">
                {t.otherTimersHeading}
              </h2>
              <div className="flex flex-wrap gap-2">
                {siblings.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
                  >
                    {p.h1}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

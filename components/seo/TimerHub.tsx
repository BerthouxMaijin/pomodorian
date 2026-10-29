import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { WEBSITE_ID, breadcrumbNode, graph, siteNodes } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  TIMER_HUB_PATH,
  TIMER_UI,
  getTimerPagesByLang,
  timerLangsWithPages,
  type TimerLang,
} from "@/lib/seo/timers";

export function timerHubMetadata(lang: TimerLang): Metadata {
  const t = TIMER_UI[lang];
  const languages: Record<string, string> = Object.fromEntries(
    timerLangsWithPages().map((l) => [l, `${SITE_URL}${TIMER_HUB_PATH[l]}`])
  );
  if (languages.en) languages["x-default"] = languages.en;
  return {
    title: { absolute: `${t.hubTitle} | Pomodorian` },
    description: t.hubIntro,
    alternates: {
      canonical: `${SITE_URL}${TIMER_HUB_PATH[lang]}`,
      languages,
    },
  };
}

export function TimerHub({ lang }: { lang: TimerLang }) {
  const t = TIMER_UI[lang];
  const pages = getTimerPagesByLang(lang);
  const hubUrl = `${SITE_URL}${TIMER_HUB_PATH[lang]}`;

  const listNode = {
    "@type": "CollectionPage",
    "@id": `${hubUrl}#webpage`,
    url: hubUrl,
    name: t.hubTitle,
    description: t.hubIntro,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: lang,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: pages.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/${p.slug}`,
        name: p.h1,
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={graph([
          ...siteNodes,
          listNode,
          breadcrumbNode([
            { name: "Pomodorian", url: SITE_URL },
            { name: t.hubTitle, url: hubUrl },
          ]),
        ])}
      />
      <div
        className="min-h-screen bg-background text-foreground"
        lang={lang !== "en" ? lang : undefined}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            &larr; {t.backHome}
          </Link>
          <header className="mt-6 mb-10">
            <h1 className="text-3xl font-bold leading-tight">{t.hubTitle}</h1>
            <p className="text-muted mt-4 text-lg leading-relaxed">{t.hubIntro}</p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2">
            {pages.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="block glass rounded-xl p-4 hover:bg-white/5 transition-colors"
              >
                <div className="font-semibold">{p.h1}</div>
                <div className="text-sm text-muted mt-1">{p.description}</div>
              </Link>
            ))}
          </div>
          {timerLangsWithPages().length > 1 && (
            <nav className="mt-12 flex flex-wrap gap-3 text-sm">
              {timerLangsWithPages()
                .filter((l) => l !== lang)
                .map((l) => (
                  <Link
                    key={l}
                    href={TIMER_HUB_PATH[l]}
                    hrefLang={l}
                    className="text-red-400 hover:text-red-300 underline underline-offset-2"
                  >
                    {TIMER_UI[l].hubTitle}
                  </Link>
                ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

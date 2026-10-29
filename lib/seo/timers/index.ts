import { SITE_URL } from "@/lib/constants";
import { TIMER_LANGS, type TimerLang, type TimerPage } from "./types";
import { enTimerPages } from "./en";

export * from "./types";
export { TIMER_UI, TIMER_HUB_PATH } from "./copy";

/**
 * Every timer page, all languages. One file per language so a weekly batch
 * only appends to one list. Slugs are flat and localized (/25-minute-timer,
 * /minuteur-25-minutes) and share the [slug] route with the SEO landing pages.
 */
export const timerPages: TimerPage[] = [...enTimerPages];

const bySlug = new Map(timerPages.map((p) => [p.slug, p]));

export function getTimerPageBySlug(slug: string): TimerPage | undefined {
  return bySlug.get(slug);
}

export function getTimerPagesByLang(lang: TimerLang): TimerPage[] {
  return timerPages
    .filter((p) => p.lang === lang)
    .sort((a, b) => a.minutes - b.minutes);
}

/** The same duration in every language that has it, for hreflang. */
export function getTimerAlternates(page: TimerPage): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const lang of TIMER_LANGS) {
    const match = timerPages.find(
      (p) => p.lang === lang && p.minutes === page.minutes
    );
    if (match) languages[lang] = `${SITE_URL}/${match.slug}`;
  }
  if (languages.en) languages["x-default"] = languages.en;
  return languages;
}

export function timerLangsWithPages(): TimerLang[] {
  return TIMER_LANGS.filter((lang) => timerPages.some((p) => p.lang === lang));
}

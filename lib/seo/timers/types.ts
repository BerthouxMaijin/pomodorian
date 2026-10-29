export const TIMER_LANGS = ["en", "fr", "es", "de"] as const;
export type TimerLang = (typeof TIMER_LANGS)[number];

/**
 * What the duration is for on a Pomodoro day. Drives the copy of the hand-off
 * to the app: a focus duration becomes the user's pomodoro length, a break or
 * micro duration does not touch their settings.
 */
export type TimerRole = "focus" | "break" | "micro";

/**
 * A tool page: a working countdown preset to one duration, plus copy that is
 * specific to that duration. The timer is the point of the page; the text
 * exists to say honestly what the duration is good for.
 */
export interface TimerPage {
  slug: string;
  lang: TimerLang;
  minutes: number;
  role: TimerRole;
  /** Duration as it reads in this language's headings: "25 minute",
   * "1 hour", "25 minutes", "25-Minuten". */
  label: string;
  /** Suggested break offered as the second mode of the embedded timer. */
  breakMinutes?: number;
  title: string;
  description: string;
  h1: string;
  /** Answer-first paragraph under the h1. */
  intro: string;
  /** Short, concrete uses for this duration (rendered as a list). */
  useCases: string[];
  sections: { heading: string; body: string }[];
  faq: { q: string; a: string }[];
  /** Blog slugs in the same language. Unknown slugs are skipped at render. */
  relatedArticleSlugs?: string[];
  /** ISO date the page went live, for the sitemap. */
  published: string;
}

/** Interface strings of the embedded timer and of the page shell. */
export interface TimerUiCopy {
  start: string;
  pause: string;
  resume: string;
  reset: string;
  focus: string;
  breakLabel: (minutes: number) => string;
  fullscreen: string;
  exitFullscreen: string;
  sounds: string;
  done: string;
  timeUp: string;
  openAppFocus: (minutes: number) => string;
  openApp: string;
  appPitch: string;
  /** Takes the page label, e.g. "25 minute", "25 minutes", "25-Minuten". */
  usesHeading: (label: string) => string;
  faqHeading: string;
  relatedHeading: string;
  otherTimersHeading: string;
  allTimers: string;
  backHome: string;
  hubTitle: string;
  hubIntro: string;
}

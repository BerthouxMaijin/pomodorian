import type { UiLocale } from "@/lib/i18n/locales";
import type { AppCopy } from "./types";
import { en } from "./en";

export type { AppCopy } from "./types";

// English ships with the page: it is the prerendered language. The other
// seven are loaded on demand, one small chunk per locale, so a visitor only
// downloads the language they use. Each module exports an `AppCopy`, so a
// missing key is a type error.
const LOADERS: Record<Exclude<UiLocale, "en">, () => Promise<AppCopy>> = {
  fr: () => import("./fr").then((m) => m.fr),
  es: () => import("./es").then((m) => m.es),
  de: () => import("./de").then((m) => m.de),
  pt: () => import("./pt").then((m) => m.pt),
  it: () => import("./it").then((m) => m.it),
  ja: () => import("./ja").then((m) => m.ja),
  zh: () => import("./zh").then((m) => m.zh),
};

export const EN_COPY = en;

const loaded = new Map<UiLocale, AppCopy>([["en", en]]);
const pending = new Map<UiLocale, Promise<AppCopy>>();
const listeners = new Set<() => void>();

export function getLoadedAppCopy(locale: UiLocale): AppCopy | undefined {
  return loaded.get(locale);
}

/** Loads a locale's copy once; resolves at once when it is already there. */
export function loadAppCopy(locale: UiLocale): Promise<AppCopy> {
  const ready = loaded.get(locale);
  if (ready) return Promise.resolve(ready);
  let promise = pending.get(locale);
  if (!promise) {
    promise = LOADERS[locale as Exclude<UiLocale, "en">]().then(
      (copy) => {
        loaded.set(locale, copy);
        pending.delete(locale);
        listeners.forEach((listener) => listener());
        return copy;
      },
      (error: unknown) => {
        // Let a later render try again (a flaky network, a new deploy).
        pending.delete(locale);
        throw error;
      }
    );
    pending.set(locale, promise);
  }
  return promise;
}

export function subscribeAppCopy(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

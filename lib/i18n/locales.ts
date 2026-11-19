export const UI_LOCALES = [
  "en",
  "fr",
  "es",
  "de",
  "pt",
  "it",
  "ja",
  "zh",
] as const;

export type UiLocale = (typeof UI_LOCALES)[number];

/** The "Language" setting: "auto" follows the browser. */
export type LanguageSetting = "auto" | UiLocale;

/** Each language in its own name, for the Language select. */
export const LANGUAGE_NAMES: Record<UiLocale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  ja: "日本語",
  zh: "中文",
};

/** Value for `<html lang>`: the Chinese copy is written in simplified script. */
export const HTML_LANG: Record<UiLocale, string> = {
  en: "en",
  fr: "fr",
  es: "es",
  de: "de",
  pt: "pt",
  it: "it",
  ja: "ja",
  zh: "zh-Hans",
};

const localeSet = new Set<string>(UI_LOCALES);

export function isUiLocale(value: unknown): value is UiLocale {
  return typeof value === "string" && localeSet.has(value);
}

export function resolveBrowserLocale(
  languages: readonly string[] | undefined
): UiLocale {
  for (const language of languages ?? []) {
    const baseLanguage = language.toLowerCase().split(/[-_]/)[0];
    if (localeSet.has(baseLanguage)) return baseLanguage as UiLocale;
  }

  return "en";
}

/**
 * The language the app speaks, from the stored settings and the browser.
 * 1. An explicit `language` (one of the 8 locales) wins; "auto" means the browser.
 * 2. With no `language` stored yet, a legacy `aiLanguage` other than "en" is a
 *    choice the person made by hand in "AI Planner > Language". "en" was the
 *    default written into every stored settings object, so it proves nothing.
 * 3. Otherwise the browser languages.
 *
 * `app/layout.tsx` repeats these rules in its inline `locale-init` script:
 * keep both in step.
 */
export function resolveUiLocale(
  settings: unknown,
  languages: readonly string[] | undefined
): UiLocale {
  if (settings && typeof settings === "object") {
    const { language, aiLanguage } = settings as {
      language?: unknown;
      aiLanguage?: unknown;
    };
    if (isUiLocale(language)) return language;
    if (language === undefined && isUiLocale(aiLanguage) && aiLanguage !== "en") {
      return aiLanguage;
    }
  }
  return resolveBrowserLocale(languages);
}

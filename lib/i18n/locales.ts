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

const localeSet = new Set<string>(UI_LOCALES);

export function resolveBrowserLocale(
  languages: readonly string[] | undefined
): UiLocale {
  for (const language of languages ?? []) {
    const baseLanguage = language.toLowerCase().split(/[-_]/)[0];
    if (localeSet.has(baseLanguage)) return baseLanguage as UiLocale;
  }

  return "en";
}

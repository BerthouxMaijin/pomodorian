import { HTML_LANG, type UiLocale } from "./locales";

/** A number written for the locale (1.5 → "1,5" in French). */
export function formatNumber(n: number, locale: UiLocale): string {
  try {
    return new Intl.NumberFormat(HTML_LANG[locale], { maximumFractionDigits: 1 }).format(n);
  } catch {
    return String(n);
  }
}

/** A YYYY-MM-DD key as a short date ("19 nov."). English keeps the raw key,
 * as the tooltips always showed it. */
export function formatDateKey(dateKey: string, locale: UiLocale): string {
  if (locale === "en") return dateKey;
  const [y, m, d] = dateKey.split("-").map(Number);
  try {
    return new Intl.DateTimeFormat(HTML_LANG[locale], {
      day: "numeric",
      month: "short",
      year: y === new Date().getUTCFullYear() ? undefined : "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)));
  } catch {
    return dateKey;
  }
}

/** Short weekday names, Sunday first, for the heatmap rows. */
export function weekdayNames(locale: UiLocale): string[] {
  // 2024-01-07 is a Sunday.
  return Array.from({ length: 7 }, (_, i) => {
    try {
      return new Intl.DateTimeFormat(HTML_LANG[locale], {
        weekday: "short",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(2024, 0, 7 + i)));
    } catch {
      return "";
    }
  });
}

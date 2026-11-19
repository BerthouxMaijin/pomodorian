"use client";

import { useSyncExternalStore } from "react";
import type { UiLocale } from "@/lib/i18n/locales";
import { readUiLocale, subscribeUiLocale } from "@/lib/i18n/localeStore";

// An external store rather than state: any component can ask for the locale
// without prop drilling, and the right value is there on the first client
// render after hydration. The server snapshot is English, like the
// prerendered HTML, so hydration always matches.
const serverSnapshot = (): UiLocale => "en";

/**
 * The app's language: `settings.language`, else a legacy `aiLanguage` other
 * than "en", else the browser (see resolveUiLocale).
 */
export function useUiLocale(): UiLocale {
  return useSyncExternalStore(subscribeUiLocale, readUiLocale, serverSnapshot);
}

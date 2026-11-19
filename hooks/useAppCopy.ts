"use client";

import { useEffect, useSyncExternalStore } from "react";
import { readUiLocale } from "@/lib/i18n/localeStore";
import {
  EN_COPY,
  getLoadedAppCopy,
  loadAppCopy,
  subscribeAppCopy,
  type AppCopy,
} from "@/lib/i18n/app";
import { useUiLocale } from "./useUiLocale";

// Start fetching the visitor's copy as soon as the page code runs, in
// parallel with hydration, instead of waiting for the first effect. The text
// hidden by the locale-init script stays hidden while it loads ("loading"
// stops the 2-second CSS fallback, see globals.css); the home page reveals it
// once the copy is rendered. Safety net: English after 4 seconds.
const PENDING = "data-i18n-pending";
if (typeof window !== "undefined" && window.location.pathname === "/") {
  const root = document.documentElement;
  const reveal = () => root.removeAttribute(PENDING);
  try {
    const locale = readUiLocale();
    // English ships with the page: nothing to load, nothing was hidden.
    if (!getLoadedAppCopy(locale)) {
      if (root.hasAttribute(PENDING)) root.setAttribute(PENDING, "loading");
      const safety = window.setTimeout(reveal, 4000);
      loadAppCopy(locale).then(
        () => window.clearTimeout(safety),
        () => {
          window.clearTimeout(safety);
          reveal();
        }
      );
    }
  } catch {
    reveal();
  }
}

// While a newly chosen language loads (a few milliseconds), keep showing the
// last language that was fully there rather than falling back to English.
let lastCopy: AppCopy = EN_COPY;
subscribeAppCopy(() => {
  const active = getLoadedAppCopy(readUiLocale());
  if (active) lastCopy = active;
});

/** True once the copy of the active locale is loaded. False on the server. */
export function useAppCopyReady(): boolean {
  const locale = useUiLocale();
  return useSyncExternalStore(
    subscribeAppCopy,
    () => getLoadedAppCopy(locale) !== undefined,
    () => false
  );
}

/** The app core copy in the active language. */
export function useAppCopy(): AppCopy {
  const locale = useUiLocale();
  const copy = useSyncExternalStore(
    subscribeAppCopy,
    () => getLoadedAppCopy(locale) ?? lastCopy,
    () => EN_COPY
  );
  useEffect(() => {
    loadAppCopy(locale).catch(() => undefined);
  }, [locale]);
  return copy;
}

import { resolveUiLocale, type UiLocale } from "./locales";
import { STORAGE_KEYS } from "@/lib/types";

// External store behind useUiLocale(): the active locale, read from the stored
// settings and the browser. Kept apart from the copy so that useSettings, also
// used by the timer tool pages, can invalidate it without pulling the copy in.

const listeners = new Set<() => void>();
let cached: UiLocale | null = null;

export function readUiLocale(): UiLocale {
  if (cached) return cached;
  let stored: unknown = null;
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) ?? "null");
  } catch {
    // Unreadable settings or blocked storage: fall back to the browser.
  }
  cached = resolveUiLocale(stored, navigator.languages);
  return cached;
}

/** Re-read the locale, after the settings changed in this tab. */
export function invalidateUiLocale() {
  cached = null;
  listeners.forEach((listener) => listener());
}

function onExternalChange(e: Event) {
  if (e instanceof StorageEvent && e.key !== null && e.key !== STORAGE_KEYS.SETTINGS) return;
  invalidateUiLocale();
}

export function subscribeUiLocale(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("storage", onExternalChange);
    window.addEventListener("languagechange", onExternalChange);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onExternalChange);
      window.removeEventListener("languagechange", onExternalChange);
    }
  };
}

"use client";

import { useSyncExternalStore } from "react";
import { resolveBrowserLocale } from "@/lib/i18n/locales";

const subscribe = () => () => undefined;

export function useBrowserLocale() {
  return useSyncExternalStore(
    subscribe,
    () => resolveBrowserLocale(navigator.languages),
    () => "en" as const
  );
}

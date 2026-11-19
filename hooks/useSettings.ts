"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { invalidateUiLocale } from "@/lib/i18n/localeStore";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { STORAGE_KEYS, type AppSettings } from "@/lib/types";

export function useSettings() {
  const [storedSettings, setSettings, hydrated] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const settings = useMemo(
    () => ({ ...DEFAULT_SETTINGS, ...storedSettings }),
    [storedSettings]
  );

  // The locale store reads the settings from localStorage: tell it once a
  // change has been written (the write happens inside the state updater).
  const language = storedSettings.language;
  useEffect(() => {
    if (hydrated) invalidateUiLocale();
  }, [language, hydrated]);

  const updateSettings = useCallback(
    (partial: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...partial }));
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return { settings, updateSettings, resetSettings, hydrated };
}

"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { STORAGE_KEYS, type AppSettings } from "@/lib/types";

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const updateSettings = useCallback(
    (partial: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return { settings, updateSettings, resetSettings };
}

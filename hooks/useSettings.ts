"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { STORAGE_KEYS, type AppSettings } from "@/lib/types";

export function useSettings() {
  const [storedSettings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const settings = useMemo(
    () => ({ ...DEFAULT_SETTINGS, ...storedSettings }),
    [storedSettings]
  );

  const updateSettings = useCallback(
    (partial: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...partial }));
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return { settings, updateSettings, resetSettings };
}

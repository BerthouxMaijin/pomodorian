"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/types";

export type NeverDumbPath = "serious" | "fun" | "reset";

interface NeverDumbStats {
  total: number;
  /** Local YYYY-MM-DD → exercises completed that day (last 60 active days). */
  days: Record<string, number>;
  /** Next index to serve, per content pool, so pools rotate across breaks. */
  rotation: Record<string, number>;
  lastPath: NeverDumbPath | null;
}

const EMPTY: NeverDumbStats = { total: 0, days: {}, rotation: {}, lastPath: null };
const MAX_DAYS = 60;

// Local calendar day: a streak is about the person's days, not UTC ones.
function localDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeStreak(days: Record<string, number>, today: Date): number {
  const cursor = new Date(today);
  // An unbroken streak may end yesterday: today's break might not be done yet.
  if (!days[localDayKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days[localDayKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useNeverDumbStats() {
  const [stats, setStats] = useLocalStorage<NeverDumbStats>(STORAGE_KEYS.NEVER_DUMB, EMPTY);

  const derived = useMemo(() => {
    const today = new Date();
    return {
      total: stats.total,
      today: stats.days[localDayKey(today)] ?? 0,
      streak: computeStreak(stats.days, today),
      lastPath: stats.lastPath,
    };
  }, [stats]);

  const recordCompletion = useCallback(
    (path: NeverDumbPath) => {
      setStats((prev) => {
        const key = localDayKey(new Date());
        const days = { ...prev.days, [key]: (prev.days[key] ?? 0) + 1 };
        const kept = Object.keys(days).sort().slice(-MAX_DAYS);
        return {
          ...prev,
          total: prev.total + 1,
          days: Object.fromEntries(kept.map((day) => [day, days[day]])),
          lastPath: path,
        };
      });
    },
    [setStats]
  );

  /**
   * Returns the item to serve from a pool of `size` and advances the pool.
   * Call from event handlers only: it writes to localStorage.
   */
  const takeFromPool = useCallback(
    (pool: string, size: number): number => {
      if (size <= 0) return 0;
      const stored = stats.rotation[pool];
      const index = stored === undefined ? Math.floor(Math.random() * size) : stored % size;
      setStats((prev) => ({ ...prev, rotation: { ...prev.rotation, [pool]: (index + 1) % size } }));
      return index;
    },
    [setStats, stats.rotation]
  );

  return { ...derived, recordCompletion, takeFromPool };
}

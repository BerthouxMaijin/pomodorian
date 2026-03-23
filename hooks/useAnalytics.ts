"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import { STORAGE_KEYS, type FocusSession, type TimerMode } from "@/lib/types";

export function useAnalytics() {
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>(
    STORAGE_KEYS.SESSIONS,
    []
  );

  const recordSession = useCallback(
    (mode: TimerMode, durationMinutes: number, taskId: string | null) => {
      const now = new Date();
      const session: FocusSession = {
        id: generateId(),
        date: now.toISOString().split("T")[0],
        startedAt: new Date(
          now.getTime() - durationMinutes * 60 * 1000
        ).toISOString(),
        endedAt: now.toISOString(),
        durationMinutes,
        mode,
        taskId,
        completed: true,
      };
      setSessions((prev) => [...prev, session]);
    },
    [setSessions]
  );

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const pomodoroSessions = sessions.filter((s) => s.mode === "pomodoro" && s.completed);

    // Today
    const todayMinutes = pomodoroSessions
      .filter((s) => s.date === today)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    const todayPomodoros = pomodoroSessions.filter((s) => s.date === today).length;

    // Total
    const totalMinutes = pomodoroSessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0
    );
    const totalPomodoros = pomodoroSessions.length;

    // Streak
    let streak = 0;
    const d = new Date();
    // Check if there's a session today first
    const hasToday = pomodoroSessions.some((s) => s.date === today);
    if (!hasToday) {
      d.setDate(d.getDate() - 1);
    }
    while (true) {
      const dateStr = d.toISOString().split("T")[0];
      if (pomodoroSessions.some((s) => s.date === dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    // Heatmap data (last 365 days)
    const heatmap: Record<string, number> = {};
    for (const s of pomodoroSessions) {
      heatmap[s.date] = (heatmap[s.date] || 0) + s.durationMinutes;
    }

    return {
      todayMinutes,
      todayPomodoros,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      totalPomodoros,
      streak,
      heatmap,
    };
  }, [sessions]);

  return { sessions, recordSession, ...stats };
}

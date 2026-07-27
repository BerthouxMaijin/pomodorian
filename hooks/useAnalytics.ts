"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import {
  STORAGE_KEYS,
  getDateKey,
  type FocusSession,
  type TimerMode,
} from "@/lib/types";
import { runMigrations } from "@/lib/migrations";

export interface RangeStats {
  totalMinutes: number;
  totalPomodoros: number;
  distinctTasks: number;
  dailyBreakdown: { date: string; minutes: number; pomodoros: number }[];
  tasksWorkedOn: {
    taskId: string | null;
    title: string;
    minutes: number;
    pomodoros: number;
  }[];
}

const UNTRACKED_TITLE = "Untracked focus time";

export function computeRangeStats(
  sessions: FocusSession[],
  fromKey: string,
  toKey: string,
  allDayKeys: string[]
): RangeStats {
  const pomodoros = sessions.filter(
    (s) =>
      s.mode === "pomodoro" &&
      s.completed &&
      s.date >= fromKey &&
      s.date <= toKey
  );

  const totalMinutes = pomodoros.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPomodoros = pomodoros.length;

  const dailyMap = new Map<string, { minutes: number; pomodoros: number }>();
  for (const k of allDayKeys) dailyMap.set(k, { minutes: 0, pomodoros: 0 });
  for (const s of pomodoros) {
    const prev = dailyMap.get(s.date) ?? { minutes: 0, pomodoros: 0 };
    dailyMap.set(s.date, {
      minutes: prev.minutes + s.durationMinutes,
      pomodoros: prev.pomodoros + 1,
    });
  }
  const dailyBreakdown = allDayKeys.map((date) => ({
    date,
    ...dailyMap.get(date)!,
  }));

  const taskMap = new Map<
    string,
    { taskId: string | null; title: string; minutes: number; pomodoros: number }
  >();
  for (const s of pomodoros) {
    const key = s.taskId ?? "__no_task__";
    const prev = taskMap.get(key);
    taskMap.set(key, {
      taskId: s.taskId,
      title: prev?.title ?? s.taskTitle ?? UNTRACKED_TITLE,
      minutes: (prev?.minutes ?? 0) + s.durationMinutes,
      pomodoros: (prev?.pomodoros ?? 0) + 1,
    });
  }
  const tasksWorkedOn = Array.from(taskMap.values()).sort(
    (a, b) => b.minutes - a.minutes
  );

  return {
    totalMinutes,
    totalPomodoros,
    distinctTasks: tasksWorkedOn.filter((t) => t.taskId !== null).length,
    dailyBreakdown,
    tasksWorkedOn,
  };
}

export function useAnalytics() {
  const [sessions, setSessions, hydrated] = useLocalStorage<FocusSession[]>(
    STORAGE_KEYS.SESSIONS,
    []
  );

  useEffect(() => {
    runMigrations();
  }, []);

  const recordSession = useCallback(
    (
      mode: TimerMode,
      durationMinutes: number,
      taskId: string | null,
      taskTitle: string | null = null
    ) => {
      const now = new Date();
      const session: FocusSession = {
        id: generateId(),
        date: getDateKey(now),
        startedAt: new Date(
          now.getTime() - durationMinutes * 60 * 1000
        ).toISOString(),
        endedAt: now.toISOString(),
        durationMinutes,
        mode,
        taskId,
        taskTitle,
        completed: true,
      };
      setSessions((prev) => [...prev, session]);
    },
    [setSessions]
  );

  const stats = useMemo(() => {
    const today = getDateKey();
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
      const dateStr = getDateKey(d);
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

  return { sessions, recordSession, hydrated, ...stats };
}

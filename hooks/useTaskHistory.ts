"use client";

import { useCallback, useMemo, useState } from "react";
import { getDateKey, type FocusSession, type Task } from "@/lib/types";

export interface DisplayTask {
  // Unique key for React lists.
  key: string;
  // Real task id if the task still exists, otherwise null.
  taskId: string | null;
  title: string;
  completed: boolean;
  // Pomodoros done specifically on the viewed day.
  pomodorosForDay: number;
  minutesForDay: number;
  // Live values from the current Task record (only when task still exists).
  estimatedPomodoros: number | null;
  totalCompletedPomodoros: number | null;
  aiGenerated: boolean;
  // Task was deleted but historical sessions remain — read-only ghost row.
  isGhost: boolean;
}

interface UseTaskHistoryArgs {
  tasks: Task[];
  sessions: FocusSession[];
}

export function useTaskHistory({ tasks, sessions }: UseTaskHistoryArgs) {
  const [viewDate, setViewDate] = useState<string>(() => getDateKey());

  const today = getDateKey();
  const isToday = viewDate === today;

  const tasksForDate = useMemo<DisplayTask[]>(() => {
    const daySessions = sessions.filter(
      (s) => s.mode === "pomodoro" && s.completed && s.date === viewDate
    );

    // Group sessions by taskId.
    const sessionByTaskId = new Map<
      string,
      { pomodoros: number; minutes: number; lastTitle: string | null }
    >();
    let untrackedPomodoros = 0;
    let untrackedMinutes = 0;
    for (const s of daySessions) {
      if (!s.taskId) {
        untrackedPomodoros += 1;
        untrackedMinutes += s.durationMinutes;
        continue;
      }
      const prev = sessionByTaskId.get(s.taskId) ?? {
        pomodoros: 0,
        minutes: 0,
        lastTitle: null,
      };
      sessionByTaskId.set(s.taskId, {
        pomodoros: prev.pomodoros + 1,
        minutes: prev.minutes + s.durationMinutes,
        lastTitle: s.taskTitle ?? prev.lastTitle,
      });
    }

    const taskById = new Map(tasks.map((t) => [t.id, t]));
    const result: DisplayTask[] = [];
    const seenTaskIds = new Set<string>();

    if (isToday) {
      // Today: carry-over all uncompleted tasks + tasks completed today.
      const orderedTasks = [...tasks].sort((a, b) => a.order - b.order);
      for (const t of orderedTasks) {
        const completedToday =
          t.completed && t.completedAt && getDateKey(new Date(t.completedAt)) === viewDate;
        if (!t.completed || completedToday) {
          const agg = sessionByTaskId.get(t.id);
          result.push({
            key: t.id,
            taskId: t.id,
            title: t.title,
            completed: t.completed,
            pomodorosForDay: agg?.pomodoros ?? 0,
            minutesForDay: agg?.minutes ?? 0,
            estimatedPomodoros: t.estimatedPomodoros,
            totalCompletedPomodoros: t.completedPomodoros,
            aiGenerated: t.aiGenerated,
            isGhost: false,
          });
          seenTaskIds.add(t.id);
        }
      }
    } else {
      // Past day: tasks completed on that day + tasks worked on that day.
      for (const t of tasks) {
        const completedOnDay =
          t.completedAt && getDateKey(new Date(t.completedAt)) === viewDate;
        const workedOnDay = sessionByTaskId.has(t.id);
        if (completedOnDay || workedOnDay) {
          const agg = sessionByTaskId.get(t.id);
          result.push({
            key: t.id,
            taskId: t.id,
            title: t.title,
            completed: !!completedOnDay,
            pomodorosForDay: agg?.pomodoros ?? 0,
            minutesForDay: agg?.minutes ?? 0,
            estimatedPomodoros: t.estimatedPomodoros,
            totalCompletedPomodoros: t.completedPomodoros,
            aiGenerated: t.aiGenerated,
            isGhost: false,
          });
          seenTaskIds.add(t.id);
        }
      }
    }

    // Ghost rows: sessions whose taskId is no longer in the live tasks list.
    for (const [taskId, agg] of sessionByTaskId.entries()) {
      if (seenTaskIds.has(taskId)) continue;
      if (taskById.has(taskId)) continue;
      result.push({
        key: `ghost:${taskId}`,
        taskId: null,
        title: agg.lastTitle ?? "(deleted task)",
        completed: false,
        pomodorosForDay: agg.pomodoros,
        minutesForDay: agg.minutes,
        estimatedPomodoros: null,
        totalCompletedPomodoros: null,
        aiGenerated: false,
        isGhost: true,
      });
    }

    if (untrackedPomodoros > 0) {
      result.push({
        key: "untracked",
        taskId: null,
        title: "Untracked focus time",
        completed: false,
        pomodorosForDay: untrackedPomodoros,
        minutesForDay: untrackedMinutes,
        estimatedPomodoros: null,
        totalCompletedPomodoros: null,
        aiGenerated: false,
        isGhost: true,
      });
    }

    return result;
  }, [tasks, sessions, viewDate, isToday]);

  const totalMinutesForDate = useMemo(
    () => tasksForDate.reduce((sum, t) => sum + t.minutesForDay, 0),
    [tasksForDate]
  );

  const totalPomodorosForDate = useMemo(
    () => tasksForDate.reduce((sum, t) => sum + t.pomodorosForDay, 0),
    [tasksForDate]
  );

  const goPrev = useCallback(() => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setUTCDate(next.getUTCDate() - 1);
      return getDateKey(next);
    });
  }, []);

  const goNext = useCallback(() => {
    setViewDate((d) => {
      if (d >= today) return d;
      const next = new Date(d);
      next.setUTCDate(next.getUTCDate() + 1);
      return getDateKey(next);
    });
  }, [today]);

  const goToday = useCallback(() => setViewDate(today), [today]);

  return {
    viewDate,
    isToday,
    setViewDate,
    goPrev,
    goNext,
    goToday,
    tasksForDate,
    totalMinutesForDate,
    totalPomodorosForDate,
  };
}

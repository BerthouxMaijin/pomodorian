import type { TimerSettings } from "@/lib/types";

/** Editable row of the plan review screen. Never persisted. */
export interface EditableTask {
  key: string; // local React id (generateId()), not the future Task id
  title: string;
  estimatedPomodoros: number; // integer 1..8
  rationale: string | null; // null for manually added rows
}

export interface PlanEstimate {
  pomodoros: number;
  totalMinutes: number;
}

export type PlanDurationSettings = Pick<
  TimerSettings,
  | "pomodoroDuration"
  | "shortBreakDuration"
  | "longBreakDuration"
  | "longBreakInterval"
>;

/**
 * Total duration of a plan, breaks included. `settings` durations are in
 * SECONDS (see lib/types.ts / DEFAULT_SETTINGS). n pomodoros chain with n-1
 * breaks in between; every `longBreakInterval`-th break is a long one.
 */
export function estimatePlanDuration(
  tasks: ReadonlyArray<{ estimatedPomodoros: number }>,
  settings: PlanDurationSettings
): PlanEstimate {
  const pomodoros = tasks.reduce((sum, t) => sum + t.estimatedPomodoros, 0);
  if (pomodoros <= 0) return { pomodoros: 0, totalMinutes: 0 };

  const breaks = pomodoros - 1;
  const interval = settings.longBreakInterval;
  const longBreaks = interval > 0 ? Math.floor(breaks / interval) : 0;
  const shortBreaks = breaks - longBreaks;

  const totalSeconds =
    pomodoros * settings.pomodoroDuration +
    shortBreaks * settings.shortBreakDuration +
    longBreaks * settings.longBreakDuration;

  return { pomodoros, totalMinutes: Math.round(totalSeconds / 60) };
}

/**
 * Language-neutral approximate duration: "45 min" under 1 h, "2 h" on the
 * hour, otherwise "3 h 05" (two-digit minutes).
 */
export function formatApproxDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `${hours} h`;

  return `${hours} h ${minutes.toString().padStart(2, "0")}`;
}

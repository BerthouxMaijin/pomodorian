import type { LanguageSetting } from "./i18n/locales";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export type TimerStatus = "idle" | "running" | "paused";

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  aiGenerated: boolean;
  order: number;
}

export interface TimerSettings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  /** Pomodoros aimed for each day, shown in the header as "3/8". 1 to 24. */
  dailyGoal: number;
  /** While a pomodoro runs, everything but the timer fades after a few idle seconds. */
  focusMode: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: string;
  alarmVolume: number;
}

export interface AppSettings extends TimerSettings {
  /** "system" follows the device's prefers-color-scheme, live. */
  theme: "system" | "dark" | "light";
  notificationsEnabled: boolean;
  showTimeInTitle: boolean;
  neverDumbAutoOpen: boolean;
  /** Language of the app and the AI planner. Absent until chosen in Settings;
   * "auto" follows the browser. Read through useUiLocale(), never directly. */
  language?: LanguageSetting;
  /** Legacy "AI Planner > Language". Only read by resolveUiLocale, which keeps
   * a value other than "en" as the person's choice while `language` is unset. */
  aiLanguage?: string;
}

export interface FocusSession {
  id: string;
  date: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  mode: TimerMode;
  taskId: string | null;
  taskTitle: string | null;
  completed: boolean;
}

export interface AITaskSuggestion {
  title: string;
  estimatedPomodoros: number;
  rationale: string;
}

export interface AIPlannerResponse {
  sessionGoal: string;
  totalEstimatedPomodoros: number;
  tasks: AITaskSuggestion[];
  tips: string;
}

export const STORAGE_KEYS = {
  TASKS: "pomodorian_tasks",
  SETTINGS: "pomodorian_settings",
  SESSIONS: "pomodorian_sessions",
  CURRENT_STATE: "pomodorian_current_state",
  ACTIVE_TASK: "pomodorian_active_task",
  DATA_VERSION: "pomodorian_data_version",
  AMBIENTS: "pomodorian_ambients",
  NEVER_DUMB: "pomodorian_neverdumb",
} as const;

export const DATA_VERSION = "2";

// YYYY-MM-DD key used to bucket sessions by day.
// Uses UTC for backward compatibility with sessions recorded before this helper existed.
export function getDateKey(d: Date = new Date()): string {
  return d.toISOString().split("T")[0];
}

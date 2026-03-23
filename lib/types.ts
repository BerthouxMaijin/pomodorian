export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export type TimerStatus = "idle" | "running" | "paused";

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
  aiGenerated: boolean;
  order: number;
}

export interface TimerSettings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: string;
  alarmVolume: number;
}

export interface AppSettings extends TimerSettings {
  theme: "dark" | "light";
  notificationsEnabled: boolean;
  showTimeInTitle: boolean;
  aiLanguage: string;
}

export interface FocusSession {
  id: string;
  date: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  mode: TimerMode;
  taskId: string | null;
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
} as const;

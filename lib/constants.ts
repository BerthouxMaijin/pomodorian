import type { AppSettings, TimerMode } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  pomodoroDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  alarmSound: "gentle",
  alarmVolume: 0.5,
  theme: "dark",
  notificationsEnabled: true,
  showTimeInTitle: true,
  aiLanguage: "fr",
};

export const AI_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
];

export const MODE_LABELS: Record<TimerMode, string> = {
  pomodoro: "Pomodoro",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export const MODE_COLORS: Record<
  TimerMode,
  { bg: string; accent: string; ring: string }
> = {
  pomodoro: {
    bg: "from-red-950/80 via-red-900/40 to-neutral-950",
    accent: "#ef4444",
    ring: "stroke-red-500",
  },
  shortBreak: {
    bg: "from-emerald-950/80 via-emerald-900/40 to-neutral-950",
    accent: "#22c55e",
    ring: "stroke-emerald-500",
  },
  longBreak: {
    bg: "from-blue-950/80 via-blue-900/40 to-neutral-950",
    accent: "#3b82f6",
    ring: "stroke-blue-500",
  },
};

export const ALARM_SOUNDS: Record<string, { label: string; src: string }> = {
  gentle: { label: "Gentle", src: "/sounds/alarm-gentle.mp3" },
  classic: { label: "Classic", src: "/sounds/alarm-classic.mp3" },
  bell: { label: "Bell", src: "/sounds/alarm-bell.mp3" },
};

export const AMBIENT_SOUNDS = [
  { key: "rain", label: "Rain", icon: "🌧", src: "/sounds/rain.mp3" },
  { key: "cafe", label: "Café", icon: "☕", src: "/sounds/cafe.mp3" },
  { key: "lofi", label: "Lo-fi", icon: "🎧", src: "/sounds/lofi.mp3" },
  { key: "nature", label: "Nature", icon: "🌿", src: "/sounds/nature.mp3" },
  {
    key: "fireplace",
    label: "Fireplace",
    icon: "🔥",
    src: "/sounds/fireplace.mp3",
  },
];

export const KEYBOARD_SHORTCUTS = [
  { key: " ", label: "Space", action: "Start / Pause timer" },
  { key: "1", label: "1", action: "Switch to Pomodoro" },
  { key: "2", label: "2", action: "Switch to Short Break" },
  { key: "3", label: "3", action: "Switch to Long Break" },
  { key: "t", label: "T", action: "Add new task" },
  { key: "s", label: "S", action: "Open / Close settings" },
  { key: "r", label: "R", action: "Open / Close report" },
] as const;

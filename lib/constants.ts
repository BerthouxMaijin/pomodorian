import type { AppSettings, TimerMode } from "./types";

export const SITE_URL = "https://pomodorian.app";
export const SITE_NAME = "Pomodorian";

export const DEFAULT_SETTINGS: AppSettings = {
  pomodoroDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  neverDumbAutoOpen: true,
  alarmSound: "gentle",
  alarmVolume: 0.5,
  pauseAmbientsOnBreak: false,
  theme: "system",
  notificationsEnabled: true,
  showTimeInTitle: true,
  // No `language` here: an absent value is how a stored legacy `aiLanguage`
  // is told apart from an explicit "auto" (see resolveUiLocale).
};

// User-facing labels for the modes, alarm sounds, ambient sounds and keyboard
// shortcuts live in the app copy (lib/i18n/app), keyed like these constants.

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

export const ALARM_SOUNDS = {
  gentle: { src: "/sounds/alarm-gentle.mp3" },
  classic: { src: "/sounds/alarm-classic.mp3" },
  bell: { src: "/sounds/alarm-bell.mp3" },
} as const satisfies Record<string, { src: string }>;

export type AlarmSoundKey = keyof typeof ALARM_SOUNDS;
export const ALARM_SOUND_KEYS = Object.keys(ALARM_SOUNDS) as AlarmSoundKey[];

export const LOFI_KEY = "lofi";

// The "lofi" ambient chains through these instead of looping a single file, so
// a long focus session does not hear the same two minutes over and over. The
// mixer still exposes 5 sounds — see AMBIENT_SOUNDS below.
export const LOFI_TRACKS = [
  "/sounds/lofi.mp3",
  "/sounds/lofi-crackle-loop-drift.mp3",
  "/sounds/lofi-loop-in-dust.mp3",
  "/sounds/lofi-repeat-in-the-dust.mp3",
];

// Ordered nature -> human -> music. The mixer renders this as a 5-column grid,
// so the array order is the reading order: leaving "lofi" in the middle put the
// one music button in the most prominent cell, framed by the field recordings.
export const AMBIENT_SOUNDS = [
  { key: "rain", icon: "🌧", src: "/sounds/rain.mp3" },
  { key: "forest", icon: "🌲", src: "/sounds/forest.mp3" },
  { key: "fireplace", icon: "🔥", src: "/sounds/fireplace.mp3" },
  { key: "cafe", icon: "☕", src: "/sounds/cafe.mp3" },
  { key: LOFI_KEY, icon: "🎧", src: LOFI_TRACKS[0] },
] as const;

export type AmbientSoundKey = (typeof AMBIENT_SOUNDS)[number]["key"];

// `label` is the key cap; null for keys whose name is translated (Space).
export const KEYBOARD_SHORTCUTS = [
  { key: " ", label: null },
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  // Only list shortcuts that have a matching handler in app/page.tsx:
  // this array feeds the user-facing ShortcutsModal.
  { key: "s", label: "S" },
  { key: "r", label: "R" },
] as const;

export type ShortcutKey = (typeof KEYBOARD_SHORTCUTS)[number]["key"];

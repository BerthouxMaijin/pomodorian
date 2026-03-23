import { nanoid } from "nanoid";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function generateId(): string {
  return nanoid(10);
}

export function getDurationForMode(
  mode: "pomodoro" | "shortBreak" | "longBreak",
  settings: {
    pomodoroDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
  }
): number {
  switch (mode) {
    case "pomodoro":
      return settings.pomodoroDuration;
    case "shortBreak":
      return settings.shortBreakDuration;
    case "longBreak":
      return settings.longBreakDuration;
  }
}

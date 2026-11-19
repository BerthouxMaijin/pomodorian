import type { AlarmSoundKey, AmbientSoundKey, ShortcutKey } from "@/lib/constants";
import type { PeriodKind } from "@/lib/date-range";
import type { TimerMode } from "@/lib/types";

/**
 * Copy of the app core (timer, tasks, sounds, settings, report). Every locale
 * implements the whole type: a missing key is a type error.
 * Keep "Pomodoro" and "Pomodorian" untranslated, no em dashes, no ampersands.
 */
export type AppCopy = {
  modes: Record<TimerMode, string>;
  /** Document title while a timer runs: "12:34 - Short Break". */
  documentTitle: (time: string, mode: string) => string;

  timer: {
    modeGroupLabel: string;
    /** aria-label of the countdown: "25:00 remaining". */
    remaining: (time: string) => string;
    start: string;
    pause: string;
    resume: string;
    skipToBreak: string;
    skipBreak: string;
    reset: string;
    timeToFocus: string;
  };

  notifications: {
    breakTime: string;
    focusTime: string;
  };

  undo: {
    /** Followed by the time left: "Pomodoro stopped at 12:34". */
    stoppedAt: string;
    undo: string;
    undoHint: string;
  };

  header: {
    blog: string;
    pomodorosCompleted: string;
    analytics: string;
    reportHint: string;
    settings: string;
    settingsHint: string;
  };

  sounds: {
    toggle: string;
    names: Record<AmbientSoundKey, string>;
    volume: (name: string) => string;
  };

  tasks: {
    previousDay: string;
    nextDay: string;
    today: string;
    emptyToday: string;
    emptyPast: string;
    newTaskPlaceholder: string;
    titleLabel: string;
    cancel: string;
    add: string;
    addTask: string;
    planWithAI: string;
    linked: (title: string) => string;
    link: (title: string) => string;
    markDone: string;
    markNotDone: string;
    edit: string;
    delete: string;
    deleteTask: string;
    save: string;
    reorder: (title: string) => string;
    aiBadge: string;
    untracked: string;
    deletedTask: string;
    estimateLabel: string;
    estimateDecrease: string;
    estimateIncrease: string;
  };

  /** Compact units after a number already formatted for the locale. */
  units: {
    minutes: (n: string) => string;
    hours: (n: string) => string;
    days: (n: string) => string;
  };

  settings: {
    title: string;
    close: string;
    timerSection: string;
    longBreakInterval: string;
    automation: string;
    autoStartBreaks: string;
    autoStartPomodoros: string;
    sound: string;
    alarmSound: string;
    alarmSounds: Record<AlarmSoundKey, string>;
    volume: string;
    display: string;
    language: string;
    languageAuto: string;
    showTimeInTitle: string;
    notifications: string;
    theme: string;
    themeSystem: string;
    themeLight: string;
    themeDark: string;
  };

  shortcuts: {
    title: string;
    dialogLabel: string;
    close: string;
    actions: Record<ShortcutKey, string>;
    spaceKey: string;
    showShortcuts: string;
  };

  report: {
    title: string;
    dialogLabel: string;
    close: string;
    periods: Record<PeriodKind, string>;
    previousPeriod: string;
    nextPeriod: string;
    now: string;
    statFocus: string;
    statPomodoros: string;
    statTasks: string;
    statStreak: string;
    statAllTime: string;
    noSessions: string;
    noTasks: string;
    last20Weeks: string;
    export: string;
    heatmapTitle: string;
    less: string;
    more: string;
    /** Heatmap cell tooltip. `minutes` is already a compact duration. */
    cellTitle: (date: string, minutes: string) => string;
    /** Bar chart column tooltip. */
    barTitle: (date: string, minutes: string) => string;
  };
};

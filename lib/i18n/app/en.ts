import type { AppCopy } from "./types";

export const en: AppCopy = {
  modes: {
    pomodoro: "Pomodoro",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  },
  documentTitle: (time, mode) => `${time} - ${mode}`,

  timer: {
    modeGroupLabel: "Timer mode",
    remaining: (time) => `${time} remaining`,
    start: "START",
    pause: "PAUSE",
    resume: "RESUME",
    skipToBreak: "Skip to break",
    skipBreak: "Skip break",
    reset: "Reset timer",
    timeToFocus: "Time to focus!",
  },

  notifications: {
    breakTime: "Great work! Time for a break.",
    focusTime: "Break is over. Let's focus!",
  },

  undo: {
    stoppedAt: "Pomodoro stopped at",
    undo: "Undo",
    undoHint: "Undo (Z)",
  },

  miniTimer: {
    open: "Open the mini timer",
    close: "Close the mini timer",
    hint: "Mini timer, always on top",
    windowTitle: "Pomodorian mini timer",
  },

  header: {
    blog: "Blog",
    pomodorosCompleted: "Pomodoros completed",
    analytics: "Analytics",
    reportHint: "Report (R)",
    settings: "Settings",
    settingsHint: "Settings (S)",
  },

  focus: {
    focusMode: "Fade distractions during a Pomodoro",
    dailyGoal: "Daily goal (Pomodoros)",
    goalProgress: (done, goal) => `${done} of ${goal} Pomodoros today`,
    goalReached: (done, goal) => `Daily goal reached: ${done} of ${goal} Pomodoros today`,
  },

  sounds: {
    toggle: "Ambient Sounds",
    names: {
      rain: "Rain",
      forest: "Forest",
      fireplace: "Fireplace",
      cafe: "Café",
      lofi: "Lo-fi",
    },
    volume: (name) => `${name} volume`,
  },

  tasks: {
    previousDay: "Previous day",
    nextDay: "Next day",
    today: "Today",
    emptyToday: "No tasks yet.",
    emptyPast: "No tasks tracked on this day.",
    newTaskPlaceholder: "What are you working on?",
    titleLabel: "Task title",
    cancel: "Cancel",
    add: "Add",
    addTask: "+ Add Task",
    planWithAI: "Plan with AI",
    // The English labels predate the no-em-dash rule and are kept verbatim.
    linked: (title) => `${title} — linked to the timer, click to unlink`,
    link: (title) => `${title} — link the timer to this task`,
    markDone: "Mark as done",
    markNotDone: "Mark as not done",
    edit: "Edit task",
    delete: "Delete",
    deleteTask: "Delete task",
    save: "Save",
    reorder: (title) =>
      `Reorder ${title}. Use arrow up and arrow down to move it.`,
    aiBadge: "AI",
    untracked: "Untracked focus time",
    deletedTask: "(deleted task)",
    estimateLabel: "Pomodoros",
    estimateDecrease: "One pomodoro less",
    estimateIncrease: "One pomodoro more",
  },

  units: {
    minutes: (n) => `${n}m`,
    hours: (n) => `${n}h`,
    days: (n) => `${n}d`,
  },

  settings: {
    title: "Settings",
    close: "Close",
    timerSection: "Timer (minutes)",
    longBreakInterval: "Long Break interval",
    automation: "Automation",
    autoStartBreaks: "Auto Start Breaks",
    autoStartPomodoros: "Auto Start Pomodoros",
    sound: "Sound",
    alarmSound: "Alarm Sound",
    alarmSounds: {
      gentle: "Gentle",
      classic: "Digital Alert",
      bell: "Bell",
    },
    volume: "Volume",
    display: "Display",
    language: "Language",
    languageAuto: "Auto",
    showTimeInTitle: "Show time in title",
    notifications: "Desktop notifications",
    theme: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
  },

  shortcuts: {
    title: "Keyboard Shortcuts",
    dialogLabel: "Keyboard shortcuts",
    close: "Close",
    actions: {
      " ": "Start / Pause timer",
      "1": "Switch to Pomodoro",
      "2": "Switch to Short Break",
      "3": "Switch to Long Break",
      s: "Open / Close settings",
      r: "Open / Close report",
    },
    spaceKey: "Space",
    showShortcuts: "Show shortcuts",
  },

  backup: {
    title: "Data",
    export: "Export backup",
    import: "Import backup",
    fileLabel: "Backup file",
    note: "Your data stays in this browser. The exported file is your only copy.",
    replaceWarning: "This replaces the data on this device.",
    summary: (tasks, pomodoros, date) => {
      const parts = `${tasks} ${tasks === 1 ? "task" : "tasks"}, ${pomodoros} ${pomodoros === 1 ? "pomodoro" : "pomodoros"}`;
      return date ? `Backup from ${date}: ${parts}.` : `Backup: ${parts}.`;
    },
    replace: "Replace",
    cancel: "Cancel",
    errors: {
      tooLarge: "This file is too large to be a Pomodorian backup. Nothing was changed.",
      notJson: "This file can't be read. Choose a Pomodorian backup (.json). Nothing was changed.",
      notBackup: "This file is not a Pomodorian backup. Nothing was changed.",
      unsupported: "This backup comes from a newer version of Pomodorian. Reload the page and try again. Nothing was changed.",
      invalid: "This backup is damaged or incomplete. Nothing was changed.",
      readFailed: "The file could not be read. Nothing was changed.",
      writeFailed: "The data could not be saved in this browser. Nothing was changed.",
    },
  },

  report: {
    title: "Analytics",
    dialogLabel: "Report",
    close: "Close",
    periods: { day: "Day", week: "Week", month: "Month" },
    previousPeriod: "Previous period",
    nextPeriod: "Next period",
    now: "Now",
    statFocus: "Focus",
    statPomodoros: "Pomos",
    statTasks: "Tasks",
    statStreak: "Streak",
    statAllTime: "All time",
    noSessions: "No focus sessions in this period.",
    noTasks: "No tasks tracked in this period.",
    last20Weeks: "Last 20 weeks",
    export: "Export",
    heatmapTitle: "Focus History",
    less: "Less",
    more: "More",
    cellTitle: (date, minutes) => `${date}: ${minutes} focused`,
    barTitle: (date, minutes) => `${date} — ${minutes}`,
  },
};

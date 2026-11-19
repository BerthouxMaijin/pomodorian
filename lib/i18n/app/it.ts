import type { AppCopy } from "./types";

export const it: AppCopy = {
  modes: {
    pomodoro: "Pomodoro",
    shortBreak: "Pausa breve",
    longBreak: "Pausa lunga",
  },
  documentTitle: (time, mode) => `${time} - ${mode}`,

  timer: {
    modeGroupLabel: "Modalità del timer",
    remaining: (time) => `Mancano ${time}`,
    start: "AVVIA",
    pause: "PAUSA",
    resume: "RIPRENDI",
    skipToBreak: "Passa alla pausa",
    skipBreak: "Salta la pausa",
    reset: "Azzera il timer",
    timeToFocus: "È ora di concentrarsi!",
  },

  notifications: {
    breakTime: "Ottimo lavoro! È ora di fare una pausa.",
    focusTime: "La pausa è finita. Torniamo a concentrarci!",
  },

  undo: {
    stoppedAt: "Pomodoro fermato a",
    undo: "Annulla",
    undoHint: "Annulla (Z)",
  },

  miniTimer: {
    open: "Apri il mini timer",
    close: "Chiudi il mini timer",
    hint: "Mini timer, sempre in primo piano",
    windowTitle: "Mini timer di Pomodorian",
  },

  header: {
    blog: "Blog",
    pomodorosCompleted: "Pomodori completati",
    analytics: "Statistiche",
    reportHint: "Report (R)",
    settings: "Impostazioni",
    settingsHint: "Impostazioni (S)",
  },

  focus: {
    focusMode: "Attenua le distrazioni durante un pomodoro",
    dailyGoal: "Obiettivo giornaliero (pomodori)",
    goalProgress: (done, goal) => `Oggi: ${done} pomodori su ${goal}`,
    goalReached: (done, goal) => `Obiettivo giornaliero raggiunto: ${done} pomodori su ${goal}`,
  },

  sounds: {
    toggle: "Suoni ambientali",
    names: {
      rain: "Pioggia",
      forest: "Foresta",
      fireplace: "Camino",
      cafe: "Caffè",
      lofi: "Lo-fi",
    },
    volume: (name) => `Volume: ${name}`,
  },

  tasks: {
    previousDay: "Giorno precedente",
    nextDay: "Giorno successivo",
    today: "Oggi",
    emptyToday: "Ancora nessuna attività.",
    emptyPast: "Nessuna attività registrata in questo giorno.",
    newTaskPlaceholder: "Su cosa stai lavorando?",
    titleLabel: "Titolo dell'attività",
    cancel: "Annulla",
    add: "Aggiungi",
    addTask: "+ Aggiungi attività",
    planWithAI: "Pianifica con l'IA",
    linked: (title) =>
      `${title}, collegata al timer. Clicca per scollegarla.`,
    link: (title) => `${title}, collega il timer a questa attività`,
    markDone: "Segna come fatta",
    markNotDone: "Segna come da fare",
    edit: "Modifica attività",
    delete: "Elimina",
    deleteTask: "Elimina l'attività",
    save: "Salva",
    reorder: (title) =>
      `Riordina ${title}. Usa le frecce su e giù per spostarla.`,
    aiBadge: "IA",
    untracked: "Concentrazione senza attività",
    deletedTask: "(attività eliminata)",
    estimateLabel: "Pomodori",
    estimateDecrease: "Un pomodoro in meno",
    estimateIncrease: "Un pomodoro in più",
  },

  units: {
    minutes: (n) => `${n}\u00a0min`,
    hours: (n) => `${n}h`,
    days: (n) => `${n}g`,
  },

  settings: {
    title: "Impostazioni",
    close: "Chiudi",
    timerSection: "Timer (minuti)",
    longBreakInterval: "Pomodori prima della pausa lunga",
    automation: "Automazione",
    autoStartBreaks: "Avvia le pause automaticamente",
    autoStartPomodoros: "Avvia i pomodori automaticamente",
    sound: "Suono",
    alarmSound: "Suono della sveglia",
    alarmSounds: {
      gentle: "Delicato",
      classic: "Allarme digitale",
      bell: "Campana",
    },
    volume: "Volume",
    display: "Visualizzazione",
    language: "Lingua",
    languageAuto: "Automatica",
    showTimeInTitle: "Mostra il tempo nella scheda",
    notifications: "Notifiche desktop",
    theme: "Tema",
    themeSystem: "Sistema",
    themeLight: "Chiaro",
    themeDark: "Scuro",
  },

  shortcuts: {
    title: "Scorciatoie da tastiera",
    dialogLabel: "Scorciatoie da tastiera",
    close: "Chiudi",
    actions: {
      " ": "Avvia o metti in pausa il timer",
      "1": "Passa a Pomodoro",
      "2": "Passa a pausa breve",
      "3": "Passa a pausa lunga",
      s: "Apri o chiudi le impostazioni",
      r: "Apri o chiudi il report",
    },
    spaceKey: "Spazio",
    showShortcuts: "Mostra le scorciatoie",
  },

  backup: {
    title: "Dati",
    export: "Esporta backup",
    import: "Importa backup",
    fileLabel: "File di backup",
    note: "I tuoi dati restano in questo browser. Il file esportato è la tua unica copia.",
    replaceWarning: "Questo sostituisce i dati su questo dispositivo.",
    summary: (tasks, pomodoros, date) => {
      const parts = `${tasks} attività, ${pomodoros} ${pomodoros === 1 ? "pomodoro" : "pomodori"}`;
      return date ? `Backup del ${date}: ${parts}.` : `Backup: ${parts}.`;
    },
    replace: "Sostituisci",
    cancel: "Annulla",
    errors: {
      tooLarge: "Questo file è troppo grande per essere un backup di Pomodorian. Non è stato modificato nulla.",
      notJson: "Impossibile leggere questo file. Scegli un backup di Pomodorian (.json). Non è stato modificato nulla.",
      notBackup: "Questo file non è un backup di Pomodorian. Non è stato modificato nulla.",
      unsupported: "Questo backup viene da una versione più recente di Pomodorian. Ricarica la pagina e riprova. Non è stato modificato nulla.",
      invalid: "Questo backup è danneggiato o incompleto. Non è stato modificato nulla.",
      readFailed: "Impossibile leggere il file. Non è stato modificato nulla.",
      writeFailed: "Impossibile salvare i dati in questo browser. Non è stato modificato nulla.",
    },
  },

  report: {
    title: "Statistiche",
    dialogLabel: "Report",
    close: "Chiudi",
    periods: { day: "Giorno", week: "Settimana", month: "Mese" },
    previousPeriod: "Periodo precedente",
    nextPeriod: "Periodo successivo",
    now: "Adesso",
    statFocus: "Focus",
    statPomodoros: "Pomodori",
    statTasks: "Attività",
    statStreak: "Serie",
    statAllTime: "Totale",
    noSessions: "Nessuna sessione di concentrazione in questo periodo.",
    noTasks: "Nessuna attività registrata in questo periodo.",
    last20Weeks: "Ultime 20 settimane",
    export: "Esporta",
    heatmapTitle: "Cronologia della concentrazione",
    less: "Meno",
    more: "Più",
    cellTitle: (date, minutes) => `${date}: ${minutes} di concentrazione`,
    barTitle: (date, minutes) => `${date}: ${minutes}`,
  },
};

import type { AppCopy } from "./types";

export const fr: AppCopy = {
  modes: {
    pomodoro: "Pomodoro",
    shortBreak: "Pause courte",
    longBreak: "Pause longue",
  },
  documentTitle: (time, mode) => `${time} - ${mode}`,

  timer: {
    modeGroupLabel: "Mode du minuteur",
    remaining: (time) => `Il reste ${time}`,
    start: "DÉMARRER",
    pause: "PAUSE",
    resume: "REPRENDRE",
    skipToBreak: "Passer à la pause",
    skipBreak: "Passer la pause",
    reset: "Réinitialiser le minuteur",
    timeToFocus: "Place à la concentration !",
  },

  notifications: {
    breakTime: "Bien joué ! C'est l'heure de la pause.",
    focusTime: "La pause est finie. On s'y remet !",
  },

  undo: {
    stoppedAt: "Pomodoro arrêté à",
    undo: "Annuler",
    undoHint: "Annuler (Z)",
  },

  miniTimer: {
    open: "Ouvrir le mini minuteur",
    close: "Fermer le mini minuteur",
    hint: "Mini minuteur, toujours au premier plan",
    windowTitle: "Mini minuteur Pomodorian",
  },

  header: {
    blog: "Blog",
    pomodorosCompleted: "Pomodoros terminés",
    analytics: "Statistiques",
    reportHint: "Rapport (R)",
    settings: "Réglages",
    settingsHint: "Réglages (S)",
  },

  sounds: {
    toggle: "Sons d'ambiance",
    names: {
      rain: "Pluie",
      forest: "Forêt",
      fireplace: "Feu",
      cafe: "Café",
      lofi: "Lo-fi",
    },
    volume: (name) => `Volume : ${name}`,
  },

  tasks: {
    previousDay: "Jour précédent",
    nextDay: "Jour suivant",
    today: "Aujourd'hui",
    emptyToday: "Aucune tâche pour l'instant.",
    emptyPast: "Aucune tâche suivie ce jour-là.",
    newTaskPlaceholder: "Sur quoi tu travailles ?",
    titleLabel: "Titre de la tâche",
    cancel: "Annuler",
    add: "Ajouter",
    addTask: "+ Ajouter une tâche",
    planWithAI: "Planifier avec l'IA",
    linked: (title) => `${title}, liée au minuteur. Clique pour la délier.`,
    link: (title) => `${title}, lier le minuteur à cette tâche`,
    markDone: "Marquer comme faite",
    markNotDone: "Marquer comme à faire",
    edit: "Modifier la tâche",
    delete: "Supprimer",
    deleteTask: "Supprimer la tâche",
    save: "Enregistrer",
    reorder: (title) =>
      `Déplacer ${title}. Utilise les flèches haut et bas pour la déplacer.`,
    aiBadge: "IA",
    untracked: "Concentration hors tâche",
    deletedTask: "(tâche supprimée)",
    estimateLabel: "Pomodoros",
    estimateDecrease: "Un pomodoro de moins",
    estimateIncrease: "Un pomodoro de plus",
  },

  units: {
    minutes: (n) => `${n}\u00a0min`,
    hours: (n) => `${n}h`,
    days: (n) => `${n}j`,
  },

  settings: {
    title: "Réglages",
    close: "Fermer",
    timerSection: "Minuteur (minutes)",
    longBreakInterval: "Pomodoros avant la pause longue",
    automation: "Automatisation",
    autoStartBreaks: "Lancer les pauses automatiquement",
    autoStartPomodoros: "Lancer les pomodoros automatiquement",
    sound: "Son",
    alarmSound: "Son de l'alarme",
    alarmSounds: {
      gentle: "Doux",
      classic: "Alerte numérique",
      bell: "Cloche",
    },
    volume: "Volume",
    display: "Affichage",
    language: "Langue",
    languageAuto: "Automatique",
    showTimeInTitle: "Afficher le temps dans l'onglet",
    notifications: "Notifications sur le bureau",
    theme: "Thème",
    themeSystem: "Système",
    themeLight: "Clair",
    themeDark: "Sombre",
  },

  shortcuts: {
    title: "Raccourcis clavier",
    dialogLabel: "Raccourcis clavier",
    close: "Fermer",
    actions: {
      " ": "Démarrer ou mettre en pause",
      "1": "Passer en Pomodoro",
      "2": "Passer en pause courte",
      "3": "Passer en pause longue",
      s: "Ouvrir ou fermer les réglages",
      r: "Ouvrir ou fermer le rapport",
    },
    spaceKey: "Espace",
    showShortcuts: "Afficher les raccourcis",
  },

  backup: {
    title: "Données",
    export: "Exporter une sauvegarde",
    import: "Importer une sauvegarde",
    fileLabel: "Fichier de sauvegarde",
    note: "Tes données restent dans ce navigateur. Le fichier exporté est ta seule copie.",
    replaceWarning: "Cela remplace les données de cet appareil.",
    summary: (tasks, pomodoros, date) => {
      const parts = `${tasks} ${tasks > 1 ? "tâches" : "tâche"}, ${pomodoros} ${pomodoros > 1 ? "pomodoros" : "pomodoro"}`;
      return date ? `Sauvegarde du ${date} : ${parts}.` : `Sauvegarde : ${parts}.`;
    },
    replace: "Remplacer",
    cancel: "Annuler",
    errors: {
      tooLarge: "Ce fichier est trop lourd pour être une sauvegarde Pomodorian. Rien n'a été modifié.",
      notJson: "Ce fichier est illisible. Choisis une sauvegarde Pomodorian (.json). Rien n'a été modifié.",
      notBackup: "Ce fichier n'est pas une sauvegarde Pomodorian. Rien n'a été modifié.",
      unsupported: "Cette sauvegarde vient d'une version plus récente de Pomodorian. Recharge la page et réessaie. Rien n'a été modifié.",
      invalid: "Cette sauvegarde est abîmée ou incomplète. Rien n'a été modifié.",
      readFailed: "Impossible de lire le fichier. Rien n'a été modifié.",
      writeFailed: "Impossible d'enregistrer les données dans ce navigateur. Rien n'a été modifié.",
    },
  },

  report: {
    title: "Statistiques",
    dialogLabel: "Rapport",
    close: "Fermer",
    periods: { day: "Jour", week: "Semaine", month: "Mois" },
    previousPeriod: "Période précédente",
    nextPeriod: "Période suivante",
    now: "Maintenant",
    statFocus: "Focus",
    statPomodoros: "Pomos",
    statTasks: "Tâches",
    statStreak: "Série",
    statAllTime: "Au total",
    noSessions: "Aucune session de concentration sur cette période.",
    noTasks: "Aucune tâche suivie sur cette période.",
    last20Weeks: "20 dernières semaines",
    export: "Exporter",
    heatmapTitle: "Historique de concentration",
    less: "Moins",
    more: "Plus",
    cellTitle: (date, minutes) => `${date} : ${minutes} de concentration`,
    barTitle: (date, minutes) => `${date} : ${minutes}`,
  },
};

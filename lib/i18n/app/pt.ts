import type { AppCopy } from "./types";

export const pt: AppCopy = {
  modes: {
    pomodoro: "Pomodoro",
    shortBreak: "Pausa curta",
    longBreak: "Pausa longa",
  },
  documentTitle: (time, mode) => `${time} - ${mode}`,

  timer: {
    modeGroupLabel: "Modo do timer",
    remaining: (time) => `Faltam ${time}`,
    start: "INICIAR",
    pause: "PAUSAR",
    resume: "RETOMAR",
    skipToBreak: "Pular para a pausa",
    skipBreak: "Pular a pausa",
    reset: "Reiniciar o timer",
    timeToFocus: "Hora de focar!",
  },

  notifications: {
    breakTime: "Bom trabalho! Hora de fazer uma pausa.",
    focusTime: "A pausa acabou. Vamos focar!",
  },

  undo: {
    stoppedAt: "Pomodoro parado em",
    undo: "Desfazer",
    undoHint: "Desfazer (Z)",
  },

  miniTimer: {
    open: "Abrir o mini timer",
    close: "Fechar o mini timer",
    hint: "Mini timer, sempre visível",
    windowTitle: "Mini timer do Pomodorian",
  },

  header: {
    blog: "Blog",
    pomodorosCompleted: "Pomodoros concluídos",
    analytics: "Estatísticas",
    reportHint: "Relatório (R)",
    settings: "Configurações",
    settingsHint: "Configurações (S)",
  },

  sounds: {
    toggle: "Sons ambientes",
    names: {
      rain: "Chuva",
      forest: "Floresta",
      fireplace: "Lareira",
      cafe: "Café",
      lofi: "Lo-fi",
    },
    volume: (name) => `Volume: ${name}`,
  },

  tasks: {
    previousDay: "Dia anterior",
    nextDay: "Próximo dia",
    today: "Hoje",
    emptyToday: "Nenhuma tarefa ainda.",
    emptyPast: "Nenhuma tarefa registrada neste dia.",
    newTaskPlaceholder: "No que você está trabalhando?",
    titleLabel: "Título da tarefa",
    cancel: "Cancelar",
    add: "Adicionar",
    addTask: "+ Adicionar tarefa",
    planWithAI: "Planejar com IA",
    linked: (title) =>
      `${title}, vinculada ao timer. Clique para desvincular.`,
    link: (title) => `${title}, vincular o timer a esta tarefa`,
    markDone: "Marcar como feita",
    markNotDone: "Marcar como pendente",
    edit: "Editar tarefa",
    delete: "Excluir",
    deleteTask: "Excluir a tarefa",
    save: "Salvar",
    reorder: (title) =>
      `Reordenar ${title}. Use as setas para cima e para baixo para movê-la.`,
    aiBadge: "IA",
    untracked: "Foco sem tarefa",
    deletedTask: "(tarefa excluída)",
    estimateLabel: "Pomodoros",
    estimateDecrease: "Um pomodoro a menos",
    estimateIncrease: "Um pomodoro a mais",
  },

  units: {
    minutes: (n) => `${n}\u00a0min`,
    hours: (n) => `${n}h`,
    days: (n) => `${n}d`,
  },

  settings: {
    title: "Configurações",
    close: "Fechar",
    timerSection: "Timer (minutos)",
    longBreakInterval: "Pomodoros até a pausa longa",
    automation: "Automação",
    autoStartBreaks: "Iniciar as pausas automaticamente",
    autoStartPomodoros: "Iniciar os pomodoros automaticamente",
    sound: "Som",
    alarmSound: "Som do alarme",
    alarmSounds: {
      gentle: "Suave",
      classic: "Alerta digital",
      bell: "Sino",
    },
    volume: "Volume",
    display: "Exibição",
    language: "Idioma",
    languageAuto: "Automático",
    showTimeInTitle: "Mostrar o tempo na aba",
    notifications: "Notificações na área de trabalho",
    theme: "Tema",
    themeSystem: "Sistema",
    themeLight: "Claro",
    themeDark: "Escuro",
  },

  shortcuts: {
    title: "Atalhos de teclado",
    dialogLabel: "Atalhos de teclado",
    close: "Fechar",
    actions: {
      " ": "Iniciar ou pausar o timer",
      "1": "Mudar para Pomodoro",
      "2": "Mudar para pausa curta",
      "3": "Mudar para pausa longa",
      s: "Abrir ou fechar as configurações",
      r: "Abrir ou fechar o relatório",
    },
    spaceKey: "Espaço",
    showShortcuts: "Mostrar os atalhos",
  },

  backup: {
    title: "Dados",
    export: "Exportar backup",
    import: "Importar backup",
    fileLabel: "Arquivo de backup",
    note: "Seus dados ficam neste navegador. O arquivo exportado é sua única cópia.",
    replaceWarning: "Isso substitui os dados deste dispositivo.",
    summary: (tasks, pomodoros, date) => {
      const parts = `${tasks} ${tasks === 1 ? "tarefa" : "tarefas"}, ${pomodoros} ${pomodoros === 1 ? "pomodoro" : "pomodoros"}`;
      return date ? `Backup de ${date}: ${parts}.` : `Backup: ${parts}.`;
    },
    replace: "Substituir",
    cancel: "Cancelar",
    errors: {
      tooLarge: "Este arquivo é grande demais para ser um backup do Pomodorian. Nada foi alterado.",
      notJson: "Não foi possível ler este arquivo. Escolha um backup do Pomodorian (.json). Nada foi alterado.",
      notBackup: "Este arquivo não é um backup do Pomodorian. Nada foi alterado.",
      unsupported: "Este backup vem de uma versão mais recente do Pomodorian. Recarregue a página e tente de novo. Nada foi alterado.",
      invalid: "Este backup está danificado ou incompleto. Nada foi alterado.",
      readFailed: "Não foi possível ler o arquivo. Nada foi alterado.",
      writeFailed: "Não foi possível salvar os dados neste navegador. Nada foi alterado.",
    },
  },

  report: {
    title: "Estatísticas",
    dialogLabel: "Relatório",
    close: "Fechar",
    periods: { day: "Dia", week: "Semana", month: "Mês" },
    previousPeriod: "Período anterior",
    nextPeriod: "Próximo período",
    now: "Agora",
    statFocus: "Foco",
    statPomodoros: "Pomos",
    statTasks: "Tarefas",
    statStreak: "Seguidos",
    statAllTime: "No total",
    noSessions: "Nenhuma sessão de foco neste período.",
    noTasks: "Nenhuma tarefa registrada neste período.",
    last20Weeks: "Últimas 20 semanas",
    export: "Exportar",
    heatmapTitle: "Histórico de foco",
    less: "Menos",
    more: "Mais",
    cellTitle: (date, minutes) => `${date}: ${minutes} de foco`,
    barTitle: (date, minutes) => `${date}: ${minutes}`,
  },
};

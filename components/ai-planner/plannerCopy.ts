import { UI_LOCALES, type UiLocale } from "@/lib/i18n/locales";

export type PlannerCopy = {
  title: string;
  closeAriaLabel: string;
  question: string;
  placeholder: string;
  generateCta: string;
  generatingCta: string;
  errorGeneric: string;
  errorRateLimited: string;
  sessionGoalLabel: string;
  tasksHeading: string;
  totalSummary: (pomodoros: number, duration: string) => string;
  pomodoroUnit: (n: number) => string;
  emptyPlanHint: string;
  addTaskCta: string;
  taskTitlePlaceholder: string;
  deleteAriaLabel: string;
  moveUpAriaLabel: string;
  moveDownAriaLabel: string;
  decreaseAriaLabel: string;
  increaseAriaLabel: string;
  startOverCta: string;
  addOnlyCta: (n: number) => string;
  addAndStartCta: string;
};

export const PLANNER_COPY = {
  en: {
    title: "AI Session Planner",
    closeAriaLabel: "Close",
    question: "What do you want to get done in your next pomodoro sessions?",
    placeholder:
      "e.g. Write the intro for my thesis, review 3 PRs, and prep the slides for tomorrow's meeting",
    generateCta: "Generate plan",
    generatingCta: "Generating plan…",
    errorGeneric: "Something went wrong. Please try again in a moment.",
    errorRateLimited: "Too many requests. Try again in an hour.",
    sessionGoalLabel: "Session goal",
    tasksHeading: "Tasks",
    totalSummary: (n, d) =>
      `${n} ${n === 1 ? "pomodoro" : "pomodoros"} ≈ ${d}, breaks included`,
    pomodoroUnit: (n) => `${n} ${n === 1 ? "pomodoro" : "pomodoros"}`,
    emptyPlanHint: "Add at least one task to build your plan.",
    addTaskCta: "Add a task",
    taskTitlePlaceholder: "Task title",
    deleteAriaLabel: "Delete task",
    moveUpAriaLabel: "Move up",
    moveDownAriaLabel: "Move down",
    decreaseAriaLabel: "Decrease pomodoros",
    increaseAriaLabel: "Increase pomodoros",
    startOverCta: "Start over",
    addOnlyCta: (n) => `Add ${n} ${n === 1 ? "task" : "tasks"}`,
    addAndStartCta: "Add & start",
  },
  fr: {
    title: "AI Session Planner",
    closeAriaLabel: "Fermer",
    question:
      "Qu'est-ce que tu veux accomplir dans tes prochaines sessions pomodoro ?",
    placeholder:
      "ex. Rédiger l'intro de mon mémoire, relire 3 PR et préparer les slides de la réunion de demain",
    generateCta: "Générer le plan",
    generatingCta: "Génération du plan…",
    errorGeneric: "Une erreur est survenue. Réessaie dans un instant.",
    errorRateLimited: "Trop de demandes. Réessaie dans une heure.",
    sessionGoalLabel: "Objectif de session",
    tasksHeading: "Tâches",
    totalSummary: (n, d) =>
      `${n} pomodoro${n === 1 ? "" : "s"} ≈ ${d}, pauses comprises`,
    pomodoroUnit: (n) => `${n} pomodoro${n === 1 ? "" : "s"}`,
    emptyPlanHint: "Ajoute au moins une tâche pour construire ton plan.",
    addTaskCta: "Ajouter une tâche",
    taskTitlePlaceholder: "Titre de la tâche",
    deleteAriaLabel: "Supprimer la tâche",
    moveUpAriaLabel: "Monter",
    moveDownAriaLabel: "Descendre",
    decreaseAriaLabel: "Diminuer les pomodoros",
    increaseAriaLabel: "Augmenter les pomodoros",
    startOverCta: "Recommencer",
    addOnlyCta: (n) => `Ajouter ${n} tâche${n >= 2 ? "s" : ""}`,
    addAndStartCta: "Ajouter et démarrer",
  },
  es: {
    title: "AI Session Planner",
    closeAriaLabel: "Cerrar",
    question: "¿Qué quieres lograr en tus próximas sesiones pomodoro?",
    placeholder:
      "p. ej. Escribir la introducción de mi tesis, revisar 3 PR y preparar las diapositivas de la reunión de mañana",
    generateCta: "Generar plan",
    generatingCta: "Generando plan…",
    errorGeneric: "Algo salió mal. Inténtalo de nuevo en un momento.",
    errorRateLimited: "Demasiadas solicitudes. Inténtalo de nuevo en una hora.",
    sessionGoalLabel: "Objetivo de la sesión",
    tasksHeading: "Tareas",
    totalSummary: (n, d) =>
      `${n} ${n === 1 ? "pomodoro" : "pomodoros"} ≈ ${d}, pausas incluidas`,
    pomodoroUnit: (n) => `${n} ${n === 1 ? "pomodoro" : "pomodoros"}`,
    emptyPlanHint: "Añade al menos una tarea para crear tu plan.",
    addTaskCta: "Añadir una tarea",
    taskTitlePlaceholder: "Título de la tarea",
    deleteAriaLabel: "Eliminar la tarea",
    moveUpAriaLabel: "Subir",
    moveDownAriaLabel: "Bajar",
    decreaseAriaLabel: "Reducir los pomodoros",
    increaseAriaLabel: "Aumentar los pomodoros",
    startOverCta: "Empezar de nuevo",
    addOnlyCta: (n) => `Añadir ${n} ${n === 1 ? "tarea" : "tareas"}`,
    addAndStartCta: "Añadir y empezar",
  },
  de: {
    title: "AI Session Planner",
    closeAriaLabel: "Schließen",
    question: "Was willst du in deinen nächsten Pomodoro-Sessions schaffen?",
    placeholder:
      "z. B. Die Einleitung meiner Abschlussarbeit schreiben, 3 PRs reviewen und die Folien fürs Meeting morgen vorbereiten",
    generateCta: "Plan erstellen",
    generatingCta: "Plan wird erstellt…",
    errorGeneric:
      "Etwas ist schiefgelaufen. Bitte versuche es gleich noch einmal.",
    errorRateLimited:
      "Zu viele Anfragen. Versuche es in einer Stunde noch einmal.",
    sessionGoalLabel: "Ziel der Session",
    tasksHeading: "Aufgaben",
    totalSummary: (n, d) =>
      `${n} ${n === 1 ? "Pomodoro" : "Pomodoros"} ≈ ${d}, Pausen inklusive`,
    pomodoroUnit: (n) => `${n} ${n === 1 ? "Pomodoro" : "Pomodoros"}`,
    emptyPlanHint:
      "Füge mindestens eine Aufgabe hinzu, um deinen Plan zu erstellen.",
    addTaskCta: "Aufgabe hinzufügen",
    taskTitlePlaceholder: "Titel der Aufgabe",
    deleteAriaLabel: "Aufgabe löschen",
    moveUpAriaLabel: "Nach oben",
    moveDownAriaLabel: "Nach unten",
    decreaseAriaLabel: "Pomodoros verringern",
    increaseAriaLabel: "Pomodoros erhöhen",
    startOverCta: "Von vorne beginnen",
    addOnlyCta: (n) => `${n} ${n === 1 ? "Aufgabe" : "Aufgaben"} hinzufügen`,
    addAndStartCta: "Hinzufügen und starten",
  },
  pt: {
    title: "AI Session Planner",
    closeAriaLabel: "Fechar",
    question: "O que você quer realizar nas suas próximas sessões pomodoro?",
    placeholder:
      "ex. Escrever a introdução da minha tese, revisar 3 PRs e preparar os slides da reunião de amanhã",
    generateCta: "Gerar plano",
    generatingCta: "Gerando plano…",
    errorGeneric: "Algo deu errado. Tente novamente dentro de momentos.",
    errorRateLimited:
      "Muitas solicitações. Tente novamente dentro de uma hora.",
    sessionGoalLabel: "Objetivo da sessão",
    tasksHeading: "Tarefas",
    totalSummary: (n, d) =>
      `${n} ${n === 1 ? "pomodoro" : "pomodoros"} ≈ ${d}, pausas incluídas`,
    pomodoroUnit: (n) => `${n} ${n === 1 ? "pomodoro" : "pomodoros"}`,
    emptyPlanHint: "Adicione pelo menos uma tarefa para montar o seu plano.",
    addTaskCta: "Adicionar uma tarefa",
    taskTitlePlaceholder: "Título da tarefa",
    deleteAriaLabel: "Excluir a tarefa",
    moveUpAriaLabel: "Mover para cima",
    moveDownAriaLabel: "Mover para baixo",
    decreaseAriaLabel: "Diminuir os pomodoros",
    increaseAriaLabel: "Aumentar os pomodoros",
    startOverCta: "Começar de novo",
    addOnlyCta: (n) => `Adicionar ${n} ${n === 1 ? "tarefa" : "tarefas"}`,
    addAndStartCta: "Adicionar e iniciar",
  },
  it: {
    title: "AI Session Planner",
    closeAriaLabel: "Chiudi",
    question:
      "Cosa vuoi portare a termine nelle tue prossime sessioni pomodoro?",
    placeholder:
      "es. Scrivere l'introduzione della mia tesi, revisionare 3 PR e preparare le slide per la riunione di domani",
    generateCta: "Genera piano",
    generatingCta: "Generazione del piano…",
    errorGeneric: "Qualcosa è andato storto. Riprova tra un istante.",
    errorRateLimited: "Troppe richieste. Riprova tra un'ora.",
    sessionGoalLabel: "Obiettivo della sessione",
    tasksHeading: "Attività",
    totalSummary: (n, d) =>
      `${n} ${n === 1 ? "pomodoro" : "pomodori"} ≈ ${d}, pause incluse`,
    pomodoroUnit: (n) => `${n} ${n === 1 ? "pomodoro" : "pomodori"}`,
    emptyPlanHint: "Aggiungi almeno un'attività per creare il tuo piano.",
    addTaskCta: "Aggiungi un'attività",
    taskTitlePlaceholder: "Titolo dell'attività",
    deleteAriaLabel: "Elimina l'attività",
    moveUpAriaLabel: "Sposta su",
    moveDownAriaLabel: "Sposta giù",
    decreaseAriaLabel: "Riduci i pomodori",
    increaseAriaLabel: "Aumenta i pomodori",
    startOverCta: "Ricomincia",
    addOnlyCta: (n) => `Aggiungi ${n} attività`,
    addAndStartCta: "Aggiungi e avvia",
  },
  ja: {
    title: "AI Session Planner",
    closeAriaLabel: "閉じる",
    question: "次のポモドーロセッションで何を終わらせたいですか？",
    placeholder:
      "例：論文の序論を書く、PRを3件レビューする、明日の会議のスライドを準備する",
    generateCta: "プランを作成",
    generatingCta: "プランを作成中…",
    errorGeneric: "問題が発生しました。少し時間をおいて再度お試しください。",
    errorRateLimited:
      "リクエストが多すぎます。1時間後に再度お試しください。",
    sessionGoalLabel: "セッションの目標",
    tasksHeading: "タスク",
    totalSummary: (n, d) => `ポモドーロ${n}個 ≈ ${d}（休憩込み）`,
    pomodoroUnit: (n) => `${n}ポモドーロ`,
    emptyPlanHint: "プランを作るには、タスクを1つ以上追加してください。",
    addTaskCta: "タスクを追加",
    taskTitlePlaceholder: "タスク名",
    deleteAriaLabel: "タスクを削除",
    moveUpAriaLabel: "上へ移動",
    moveDownAriaLabel: "下へ移動",
    decreaseAriaLabel: "ポモドーロを減らす",
    increaseAriaLabel: "ポモドーロを増やす",
    startOverCta: "最初からやり直す",
    addOnlyCta: (n) => `タスクを${n}件追加`,
    addAndStartCta: "追加して開始",
  },
  zh: {
    title: "AI Session Planner",
    closeAriaLabel: "关闭",
    question: "接下来的番茄钟里你想完成什么？",
    placeholder: "例如：写论文引言、审查 3 个 PR、准备明天会议的幻灯片",
    generateCta: "生成计划",
    generatingCta: "正在生成计划…",
    errorGeneric: "出了点问题，请稍后再试。",
    errorRateLimited: "请求过多，请一小时后再试。",
    sessionGoalLabel: "本次目标",
    tasksHeading: "任务",
    totalSummary: (n, d) => `${n} 个番茄钟 ≈ ${d}，含休息`,
    pomodoroUnit: (n) => `${n} 个番茄钟`,
    emptyPlanHint: "至少添加一个任务来创建你的计划。",
    addTaskCta: "添加任务",
    taskTitlePlaceholder: "任务标题",
    deleteAriaLabel: "删除任务",
    moveUpAriaLabel: "上移",
    moveDownAriaLabel: "下移",
    decreaseAriaLabel: "减少番茄钟",
    increaseAriaLabel: "增加番茄钟",
    startOverCta: "重新开始",
    addOnlyCta: (n) => `添加 ${n} 个任务`,
    addAndStartCta: "添加并开始",
  },
} satisfies Record<UiLocale, PlannerCopy>;

export function resolvePlannerLocale(language: string): UiLocale {
  const base = language.toLowerCase().split(/[-_]/)[0];
  return (UI_LOCALES as readonly string[]).includes(base)
    ? (base as UiLocale)
    : "en";
}

import type { UiLocale } from "./locales";

// Copy of the root error boundary (app/error.tsx). Kept out of the app copy:
// the boundary ships with every page, the app copy only with the home page.
export type ErrorCopy = {
  title: string;
  body: string;
  retry: string;
};

export const ERROR_COPY: Record<UiLocale, ErrorCopy> = {
  en: {
    title: "Something went wrong",
    body: "Your tasks, sessions and settings are stored in this browser and have not been lost.",
    retry: "Try again",
  },
  fr: {
    title: "Un problème est survenu",
    body: "Tes tâches, sessions et réglages sont enregistrés dans ce navigateur et n'ont pas été perdus.",
    retry: "Réessayer",
  },
  es: {
    title: "Algo salió mal",
    body: "Tus tareas, sesiones y ajustes están guardados en este navegador y no se han perdido.",
    retry: "Reintentar",
  },
  de: {
    title: "Etwas ist schiefgelaufen",
    body: "Deine Aufgaben, Sessions und Einstellungen sind in diesem Browser gespeichert und nicht verloren gegangen.",
    retry: "Erneut versuchen",
  },
  pt: {
    title: "Algo deu errado",
    body: "Suas tarefas, sessões e configurações estão salvas neste navegador e não foram perdidas.",
    retry: "Tentar novamente",
  },
  it: {
    title: "Qualcosa è andato storto",
    body: "Le tue attività, sessioni e impostazioni sono salvate in questo browser e non sono andate perse.",
    retry: "Riprova",
  },
  ja: {
    title: "問題が発生しました",
    body: "タスク、セッション、設定はこのブラウザに保存されているため、失われていません。",
    retry: "再試行",
  },
  zh: {
    title: "出了点问题",
    body: "你的任务、专注记录和设置都保存在此浏览器中，没有丢失。",
    retry: "重试",
  },
};

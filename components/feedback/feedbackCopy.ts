export const FEEDBACK_LOCALES = [
  "en",
  "fr",
  "es",
  "de",
  "pt",
  "it",
  "ja",
  "zh",
] as const;

export type FeedbackLocale = (typeof FEEDBACK_LOCALES)[number];

type FeedbackCopy = {
  triggerLabel: string;
  triggerAriaLabel: string;
  backdropAriaLabel: string;
  badge: string;
  closeAriaLabel: string;
  title: string;
  description: string;
  feedbackCta: string;
  feedbackEstimate: string;
  bugCta: string;
  dismissCta: string;
  footer: string;
  emailSubject: string;
  emailQuestions: readonly [string, string, string];
};

export const FEEDBACK_COPY = {
  en: {
    triggerLabel: "Feedback / bug",
    triggerAriaLabel: "Send feedback or report a bug",
    backdropAriaLabel: "Close the feedback dialog",
    badge: "Work in progress",
    closeAriaLabel: "Close",
    title: "Thanks for trying Pomodorian.",
    description:
      "Pomodorian is still being built. Do you have 3 minutes to tell us what helps, what gets in the way, and what is missing?",
    feedbackCta: "Share feedback",
    feedbackEstimate: "~3 min ↗",
    bugCta: "Report a bug",
    dismissCta: "Not now",
    footer: "No endless survey. Three answers are enough.",
    emailSubject: "Pomodorian feedback",
    emailQuestions: [
      "1. What helps me most:",
      "2. What gets in my way:",
      "3. One thing I would add:",
    ],
  },
  fr: {
    triggerLabel: "Feedback / bug",
    triggerAriaLabel: "Envoyer un feedback ou signaler un bug",
    backdropAriaLabel: "Fermer la fenêtre de feedback",
    badge: "En construction",
    closeAriaLabel: "Fermer",
    title: "Merci d’avoir testé Pomodorian.",
    description:
      "C’est encore en construction. Tu as 3 minutes pour nous dire ce qui t’aide, ce qui te gêne et ce qui manque ?",
    feedbackCta: "Donner mon feedback",
    feedbackEstimate: "~3 min ↗",
    bugCta: "Signaler un bug",
    dismissCta: "Pas maintenant",
    footer: "Pas de formulaire interminable. Trois réponses suffisent.",
    emailSubject: "Feedback Pomodorian",
    emailQuestions: [
      "1. Ce qui m’aide le plus :",
      "2. Ce qui me gêne ou me bloque :",
      "3. La chose que j’ajouterais :",
    ],
  },
  es: {
    triggerLabel: "Opinión / error",
    triggerAriaLabel: "Enviar una opinión o informar de un error",
    backdropAriaLabel: "Cerrar la ventana de opinión",
    badge: "En construcción",
    closeAriaLabel: "Cerrar",
    title: "Gracias por probar Pomodorian.",
    description:
      "Pomodorian sigue en construcción. ¿Tienes 3 minutos para contarnos qué te ayuda, qué te molesta y qué falta?",
    feedbackCta: "Enviar mi opinión",
    feedbackEstimate: "~3 min ↗",
    bugCta: "Informar de un error",
    dismissCta: "Ahora no",
    footer: "Sin encuestas interminables. Tres respuestas son suficientes.",
    emailSubject: "Opinión sobre Pomodorian",
    emailQuestions: [
      "1. Lo que más me ayuda:",
      "2. Lo que me molesta o me bloquea:",
      "3. Lo que añadiría:",
    ],
  },
  de: {
    triggerLabel: "Feedback / Fehler",
    triggerAriaLabel: "Feedback senden oder einen Fehler melden",
    backdropAriaLabel: "Feedback-Dialog schließen",
    badge: "In Entwicklung",
    closeAriaLabel: "Schließen",
    title: "Danke, dass du Pomodorian ausprobierst.",
    description:
      "Pomodorian wird noch entwickelt. Hast du 3 Minuten, um uns zu sagen, was dir hilft, was dich stört und was noch fehlt?",
    feedbackCta: "Feedback geben",
    feedbackEstimate: "~3 Min. ↗",
    bugCta: "Fehler melden",
    dismissCta: "Nicht jetzt",
    footer: "Keine endlose Umfrage. Drei Antworten genügen.",
    emailSubject: "Feedback zu Pomodorian",
    emailQuestions: [
      "1. Was mir am meisten hilft:",
      "2. Was mich stört oder blockiert:",
      "3. Was ich ergänzen würde:",
    ],
  },
  pt: {
    triggerLabel: "Feedback / erro",
    triggerAriaLabel: "Enviar feedback ou comunicar um erro",
    backdropAriaLabel: "Fechar a janela de feedback",
    badge: "Em construção",
    closeAriaLabel: "Fechar",
    title: "Obrigado por experimentar o Pomodorian.",
    description:
      "O Pomodorian ainda está em construção. Tem 3 minutos para nos dizer o que ajuda, o que atrapalha e o que está faltando?",
    feedbackCta: "Enviar feedback",
    feedbackEstimate: "~3 min ↗",
    bugCta: "Comunicar um erro",
    dismissCta: "Agora não",
    footer: "Nada de formulários intermináveis. Três respostas são suficientes.",
    emailSubject: "Feedback sobre o Pomodorian",
    emailQuestions: [
      "1. O que mais me ajuda:",
      "2. O que me atrapalha ou bloqueia:",
      "3. O que eu acrescentaria:",
    ],
  },
  it: {
    triggerLabel: "Feedback / bug",
    triggerAriaLabel: "Invia un feedback o segnala un bug",
    backdropAriaLabel: "Chiudi la finestra di feedback",
    badge: "In costruzione",
    closeAriaLabel: "Chiudi",
    title: "Grazie per aver provato Pomodorian.",
    description:
      "Pomodorian è ancora in costruzione. Hai 3 minuti per dirci cosa ti aiuta, cosa ti ostacola e cosa manca?",
    feedbackCta: "Invia il mio feedback",
    feedbackEstimate: "~3 min ↗",
    bugCta: "Segnala un bug",
    dismissCta: "Non ora",
    footer: "Niente moduli interminabili. Bastano tre risposte.",
    emailSubject: "Feedback su Pomodorian",
    emailQuestions: [
      "1. Cosa mi aiuta di più:",
      "2. Cosa mi ostacola o mi blocca:",
      "3. Cosa aggiungerei:",
    ],
  },
  ja: {
    triggerLabel: "フィードバック / バグ",
    triggerAriaLabel: "フィードバックを送る、またはバグを報告する",
    backdropAriaLabel: "フィードバック画面を閉じる",
    badge: "開発中",
    closeAriaLabel: "閉じる",
    title: "Pomodorianをお試しいただき、ありがとうございます。",
    description:
      "Pomodorianはまだ開発中です。役に立つ点、使いにくい点、足りない点を3分で教えていただけますか？",
    feedbackCta: "フィードバックを送る",
    feedbackEstimate: "約3分 ↗",
    bugCta: "バグを報告する",
    dismissCta: "今回はしない",
    footer: "長いアンケートはありません。3つの回答だけで十分です。",
    emailSubject: "Pomodorianへのフィードバック",
    emailQuestions: [
      "1. 最も役に立っている点：",
      "2. 使いにくい、または妨げになっている点：",
      "3. 追加してほしいもの：",
    ],
  },
  zh: {
    triggerLabel: "反馈 / 问题",
    triggerAriaLabel: "发送反馈或报告问题",
    backdropAriaLabel: "关闭反馈窗口",
    badge: "开发中",
    closeAriaLabel: "关闭",
    title: "感谢你试用 Pomodorian。",
    description:
      "Pomodorian 仍在开发中。可以用 3 分钟告诉我们哪些功能有帮助、哪些地方造成困扰，以及还缺少什么吗？",
    feedbackCta: "发送反馈",
    feedbackEstimate: "约3分钟 ↗",
    bugCta: "报告问题",
    dismissCta: "暂时不要",
    footer: "没有冗长的问卷。回答三个问题就够了。",
    emailSubject: "Pomodorian 使用反馈",
    emailQuestions: [
      "1. 对我最有帮助的地方：",
      "2. 给我造成困扰或阻碍的地方：",
      "3. 我希望增加的功能：",
    ],
  },
} satisfies Record<FeedbackLocale, FeedbackCopy>;

const localeSet = new Set<string>(FEEDBACK_LOCALES);

export function resolveFeedbackLocale(
  languages: readonly string[] | undefined
): FeedbackLocale {
  for (const language of languages ?? []) {
    const baseLanguage = language.toLowerCase().split(/[-_]/)[0];
    if (localeSet.has(baseLanguage)) return baseLanguage as FeedbackLocale;
  }

  return "en";
}

export function buildFeedbackEmail(copy: FeedbackCopy): string {
  const body = copy.emailQuestions.join("\n\n");
  return `mailto:jean-baptiste@academieweb3.com?subject=${encodeURIComponent(copy.emailSubject)}&body=${encodeURIComponent(body)}`;
}

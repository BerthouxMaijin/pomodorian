import type { UiLocale } from "@/lib/i18n/locales";

export type FeedbackType = "feedback" | "bug";

export type FeedbackCopy = {
  triggerLabel: string;
  triggerAriaLabel: string;
  backdropAriaLabel: string;
  badge: string;
  closeAriaLabel: string;
  title: string;
  description: string;
  feedbackCta: string;
  bugCta: string;
  dismissCta: string;
  footer: string;
  backLabel: string;
  feedbackFormTitle: string;
  bugFormTitle: string;
  messageLabel: string;
  emailLabel: string;
  emailOptional: string;
  emailPlaceholder: string;
  submitCta: string;
  submittingCta: string;
  privacyNote: string;
  successTitle: string;
  successBody: string;
  successCta: string;
  errorGeneric: string;
  errorTooShort: string;
  errorRateLimited: string;
  errorInvalidEmail: string;
  feedbackQuestions: readonly [string, string, string];
  bugQuestions: readonly [string, string, string];
};

export const FEEDBACK_COPY = {
  en: {
    triggerLabel: "Feedback / bug",
    triggerAriaLabel: "Send feedback or report a bug",
    backdropAriaLabel: "Close the feedback dialog",
    badge: "Always improving",
    closeAriaLabel: "Close",
    title: "Thanks for using Pomodorian.",
    description:
      "Pomodorian keeps evolving, and your feedback decides what comes next. Do you have a minute to tell us what helps, what gets in the way, and what is missing?",
    feedbackCta: "Share feedback",
    bugCta: "Report a bug",
    dismissCta: "Not now",
    footer: "No endless survey. Three answers are enough.",
    backLabel: "Back",
    feedbackFormTitle: "Your feedback",
    bugFormTitle: "Report a bug",
    messageLabel: "Your message",
    emailLabel: "Your email",
    emailOptional: "optional",
    emailPlaceholder: "you@example.com",
    submitCta: "Send",
    submittingCta: "Sending…",
    privacyNote:
      "We send your message, the page you are on and your browser. Nothing else leaves your device.",
    successTitle: "Message sent. Thank you.",
    successBody: "We read everything. If you left your email, we will reply.",
    successCta: "Close",
    errorGeneric: "Sending failed. Please try again in a moment.",
    errorTooShort: "Add a few more words (10 characters minimum).",
    errorRateLimited: "Too many messages. Try again in an hour.",
    errorInvalidEmail: "That email does not look valid.",
    feedbackQuestions: [
      "1. What helps me most:",
      "2. What gets in my way:",
      "3. One thing I would add:",
    ],
    bugQuestions: [
      "1. What I did:",
      "2. What happened:",
      "3. What I expected:",
    ],
  },
  fr: {
    triggerLabel: "Feedback / bug",
    triggerAriaLabel: "Envoyer un feedback ou signaler un bug",
    backdropAriaLabel: "Fermer la fenêtre de feedback",
    badge: "En évolution",
    closeAriaLabel: "Fermer",
    title: "Merci d’utiliser Pomodorian.",
    description:
      "Pomodorian évolue en continu, et c’est ton retour qui décide de la suite. Tu as une minute pour nous dire ce qui t’aide, ce qui te gêne et ce qui manque ?",
    feedbackCta: "Donner mon feedback",
    bugCta: "Signaler un bug",
    dismissCta: "Pas maintenant",
    footer: "Pas de formulaire interminable. Trois réponses suffisent.",
    backLabel: "Retour",
    feedbackFormTitle: "Ton feedback",
    bugFormTitle: "Signaler un bug",
    messageLabel: "Ton message",
    emailLabel: "Ton email",
    emailOptional: "optionnel",
    emailPlaceholder: "toi@exemple.com",
    submitCta: "Envoyer",
    submittingCta: "Envoi…",
    privacyNote:
      "On envoie ton message, la page où tu es et ton navigateur. Rien d’autre ne quitte ton appareil.",
    successTitle: "Message envoyé. Merci.",
    successBody: "On lit tout. Si tu as laissé ton email, on te répond.",
    successCta: "Fermer",
    errorGeneric: "L’envoi a échoué. Réessaie dans un instant.",
    errorTooShort: "Ajoute quelques mots de plus (10 caractères minimum).",
    errorRateLimited: "Trop d’envois. Réessaie dans une heure.",
    errorInvalidEmail: "Cet email ne semble pas valide.",
    feedbackQuestions: [
      "1. Ce qui m’aide le plus :",
      "2. Ce qui me gêne ou me bloque :",
      "3. La chose que j’ajouterais :",
    ],
    bugQuestions: [
      "1. Ce que j’ai fait :",
      "2. Ce qui s’est passé :",
      "3. Ce que j’attendais :",
    ],
  },
  es: {
    triggerLabel: "Opinión / error",
    triggerAriaLabel: "Enviar una opinión o informar de un error",
    backdropAriaLabel: "Cerrar la ventana de opinión",
    badge: "En evolución",
    closeAriaLabel: "Cerrar",
    title: "Gracias por usar Pomodorian.",
    description:
      "Pomodorian evoluciona continuamente, y tu opinión decide lo que viene después. ¿Tienes un minuto para contarnos qué te ayuda, qué te molesta y qué falta?",
    feedbackCta: "Enviar mi opinión",
    bugCta: "Informar de un error",
    dismissCta: "Ahora no",
    footer: "Sin encuestas interminables. Tres respuestas son suficientes.",
    backLabel: "Volver",
    feedbackFormTitle: "Tu opinión",
    bugFormTitle: "Informar de un error",
    messageLabel: "Tu mensaje",
    emailLabel: "Tu correo",
    emailOptional: "opcional",
    emailPlaceholder: "tu@ejemplo.com",
    submitCta: "Enviar",
    submittingCta: "Enviando…",
    privacyNote:
      "Enviamos tu mensaje, la página en la que estás y tu navegador. Nada más sale de tu dispositivo.",
    successTitle: "Mensaje enviado. Gracias.",
    successBody: "Lo leemos todo. Si dejaste tu correo, te responderemos.",
    successCta: "Cerrar",
    errorGeneric: "No se pudo enviar. Inténtalo de nuevo en un momento.",
    errorTooShort: "Añade algunas palabras más (mínimo 10 caracteres).",
    errorRateLimited: "Demasiados envíos. Inténtalo de nuevo en una hora.",
    errorInvalidEmail: "Ese correo no parece válido.",
    feedbackQuestions: [
      "1. Lo que más me ayuda:",
      "2. Lo que me molesta o me bloquea:",
      "3. Lo que añadiría:",
    ],
    bugQuestions: [
      "1. Lo que hice:",
      "2. Lo que ocurrió:",
      "3. Lo que esperaba:",
    ],
  },
  de: {
    triggerLabel: "Feedback / Fehler",
    triggerAriaLabel: "Feedback senden oder einen Fehler melden",
    backdropAriaLabel: "Feedback-Dialog schließen",
    badge: "Wird laufend besser",
    closeAriaLabel: "Schließen",
    title: "Danke, dass du Pomodorian nutzt.",
    description:
      "Pomodorian entwickelt sich laufend weiter, und dein Feedback entscheidet, was als Nächstes kommt. Hast du eine Minute, um uns zu sagen, was dir hilft, was dich stört und was noch fehlt?",
    feedbackCta: "Feedback geben",
    bugCta: "Fehler melden",
    dismissCta: "Nicht jetzt",
    footer: "Keine endlose Umfrage. Drei Antworten genügen.",
    backLabel: "Zurück",
    feedbackFormTitle: "Dein Feedback",
    bugFormTitle: "Fehler melden",
    messageLabel: "Deine Nachricht",
    emailLabel: "Deine E-Mail",
    emailOptional: "optional",
    emailPlaceholder: "du@beispiel.com",
    submitCta: "Senden",
    submittingCta: "Wird gesendet…",
    privacyNote:
      "Wir senden deine Nachricht, die aktuelle Seite und deinen Browser. Sonst verlässt nichts dein Gerät.",
    successTitle: "Nachricht gesendet. Danke.",
    successBody:
      "Wir lesen alles. Wenn du deine E-Mail hinterlassen hast, antworten wir dir.",
    successCta: "Schließen",
    errorGeneric: "Senden fehlgeschlagen. Bitte versuche es gleich noch einmal.",
    errorTooShort: "Schreib noch ein paar Worte mehr (mindestens 10 Zeichen).",
    errorRateLimited: "Zu viele Nachrichten. Versuche es in einer Stunde noch einmal.",
    errorInvalidEmail: "Diese E-Mail sieht nicht gültig aus.",
    feedbackQuestions: [
      "1. Was mir am meisten hilft:",
      "2. Was mich stört oder blockiert:",
      "3. Was ich ergänzen würde:",
    ],
    bugQuestions: [
      "1. Was ich gemacht habe:",
      "2. Was passiert ist:",
      "3. Was ich erwartet habe:",
    ],
  },
  pt: {
    triggerLabel: "Feedback / erro",
    triggerAriaLabel: "Enviar feedback ou comunicar um erro",
    backdropAriaLabel: "Fechar a janela de feedback",
    badge: "Em evolução",
    closeAriaLabel: "Fechar",
    title: "Obrigado por usar o Pomodorian.",
    description:
      "O Pomodorian evolui continuamente, e o seu feedback decide o que vem a seguir. Tem um minuto para nos dizer o que ajuda, o que atrapalha e o que está faltando?",
    feedbackCta: "Enviar feedback",
    bugCta: "Comunicar um erro",
    dismissCta: "Agora não",
    footer: "Nada de formulários intermináveis. Três respostas são suficientes.",
    backLabel: "Voltar",
    feedbackFormTitle: "O seu feedback",
    bugFormTitle: "Comunicar um erro",
    messageLabel: "A sua mensagem",
    emailLabel: "O seu email",
    emailOptional: "opcional",
    emailPlaceholder: "voce@exemplo.com",
    submitCta: "Enviar",
    submittingCta: "A enviar…",
    privacyNote:
      "Enviamos a sua mensagem, a página onde está e o seu navegador. Mais nada sai do seu dispositivo.",
    successTitle: "Mensagem enviada. Obrigado.",
    successBody: "Lemos tudo. Se deixou o seu email, respondemos.",
    successCta: "Fechar",
    errorGeneric: "O envio falhou. Tente novamente dentro de momentos.",
    errorTooShort: "Acrescente mais algumas palavras (mínimo 10 caracteres).",
    errorRateLimited: "Demasiados envios. Tente novamente dentro de uma hora.",
    errorInvalidEmail: "Esse email não parece válido.",
    feedbackQuestions: [
      "1. O que mais me ajuda:",
      "2. O que me atrapalha ou bloqueia:",
      "3. O que eu acrescentaria:",
    ],
    bugQuestions: [
      "1. O que fiz:",
      "2. O que aconteceu:",
      "3. O que esperava:",
    ],
  },
  it: {
    triggerLabel: "Feedback / bug",
    triggerAriaLabel: "Invia un feedback o segnala un bug",
    backdropAriaLabel: "Chiudi la finestra di feedback",
    badge: "In evoluzione",
    closeAriaLabel: "Chiudi",
    title: "Grazie per usare Pomodorian.",
    description:
      "Pomodorian evolve di continuo, e il tuo feedback decide cosa arriva dopo. Hai un minuto per dirci cosa ti aiuta, cosa ti ostacola e cosa manca?",
    feedbackCta: "Invia il mio feedback",
    bugCta: "Segnala un bug",
    dismissCta: "Non ora",
    footer: "Niente moduli interminabili. Bastano tre risposte.",
    backLabel: "Indietro",
    feedbackFormTitle: "Il tuo feedback",
    bugFormTitle: "Segnala un bug",
    messageLabel: "Il tuo messaggio",
    emailLabel: "La tua email",
    emailOptional: "facoltativo",
    emailPlaceholder: "tu@esempio.com",
    submitCta: "Invia",
    submittingCta: "Invio…",
    privacyNote:
      "Inviamo il tuo messaggio, la pagina in cui ti trovi e il tuo browser. Nient’altro lascia il tuo dispositivo.",
    successTitle: "Messaggio inviato. Grazie.",
    successBody: "Leggiamo tutto. Se hai lasciato la tua email, ti rispondiamo.",
    successCta: "Chiudi",
    errorGeneric: "Invio non riuscito. Riprova tra un istante.",
    errorTooShort: "Aggiungi qualche parola in più (minimo 10 caratteri).",
    errorRateLimited: "Troppi invii. Riprova tra un’ora.",
    errorInvalidEmail: "Questa email non sembra valida.",
    feedbackQuestions: [
      "1. Cosa mi aiuta di più:",
      "2. Cosa mi ostacola o mi blocca:",
      "3. Cosa aggiungerei:",
    ],
    bugQuestions: [
      "1. Cosa ho fatto:",
      "2. Cosa è successo:",
      "3. Cosa mi aspettavo:",
    ],
  },
  ja: {
    triggerLabel: "フィードバック / バグ",
    triggerAriaLabel: "フィードバックを送る、またはバグを報告する",
    backdropAriaLabel: "フィードバック画面を閉じる",
    badge: "進化中",
    closeAriaLabel: "閉じる",
    title: "Pomodorianをご利用いただき、ありがとうございます。",
    description:
      "Pomodorianは日々進化しています。次に何を作るかは、皆さんの声で決まります。役に立つ点、使いにくい点、足りない点を1分で教えていただけますか？",
    feedbackCta: "フィードバックを送る",
    bugCta: "バグを報告する",
    dismissCta: "今回はしない",
    footer: "長いアンケートはありません。3つの回答だけで十分です。",
    backLabel: "戻る",
    feedbackFormTitle: "フィードバック",
    bugFormTitle: "バグを報告する",
    messageLabel: "メッセージ",
    emailLabel: "メールアドレス",
    emailOptional: "任意",
    emailPlaceholder: "you@example.com",
    submitCta: "送信",
    submittingCta: "送信中…",
    privacyNote:
      "送信されるのはメッセージ、現在のページ、ブラウザの情報だけです。それ以外が端末から出ることはありません。",
    successTitle: "送信しました。ありがとうございます。",
    successBody:
      "すべて目を通しています。メールアドレスをご記入いただいた場合は返信します。",
    successCta: "閉じる",
    errorGeneric: "送信に失敗しました。少し時間をおいて再度お試しください。",
    errorTooShort: "もう少し詳しく書いてください（10文字以上）。",
    errorRateLimited: "送信が多すぎます。1時間後に再度お試しください。",
    errorInvalidEmail: "このメールアドレスは正しくないようです。",
    feedbackQuestions: [
      "1. 最も役に立っている点：",
      "2. 使いにくい、または妨げになっている点：",
      "3. 追加してほしいもの：",
    ],
    bugQuestions: [
      "1. 行った操作：",
      "2. 実際に起きたこと：",
      "3. 期待していたこと：",
    ],
  },
  zh: {
    triggerLabel: "反馈 / 问题",
    triggerAriaLabel: "发送反馈或报告问题",
    backdropAriaLabel: "关闭反馈窗口",
    badge: "持续进化中",
    closeAriaLabel: "关闭",
    title: "感谢你使用 Pomodorian。",
    description:
      "Pomodorian 在持续进化，你的反馈决定它接下来的方向。可以用 1 分钟告诉我们哪些功能有帮助、哪些地方造成困扰，以及还缺少什么吗？",
    feedbackCta: "发送反馈",
    bugCta: "报告问题",
    dismissCta: "暂时不要",
    footer: "没有冗长的问卷。回答三个问题就够了。",
    backLabel: "返回",
    feedbackFormTitle: "你的反馈",
    bugFormTitle: "报告问题",
    messageLabel: "你的留言",
    emailLabel: "你的邮箱",
    emailOptional: "选填",
    emailPlaceholder: "you@example.com",
    submitCta: "发送",
    submittingCta: "发送中…",
    privacyNote:
      "我们只发送你的留言、当前页面和浏览器信息。其他数据都不会离开你的设备。",
    successTitle: "已发送，谢谢。",
    successBody: "我们会阅读每一条留言。如果你留下了邮箱，我们会回复你。",
    successCta: "关闭",
    errorGeneric: "发送失败，请稍后再试。",
    errorTooShort: "请再多写几个字（至少 10 个字符）。",
    errorRateLimited: "发送次数过多，请一小时后再试。",
    errorInvalidEmail: "这个邮箱地址似乎无效。",
    feedbackQuestions: [
      "1. 对我最有帮助的地方：",
      "2. 给我造成困扰或阻碍的地方：",
      "3. 我希望增加的功能：",
    ],
    bugQuestions: [
      "1. 我做了什么：",
      "2. 发生了什么：",
      "3. 我期望的结果：",
    ],
  },
} satisfies Record<UiLocale, FeedbackCopy>;

export function buildMessagePlaceholder(
  copy: FeedbackCopy,
  type: FeedbackType
): string {
  const questions =
    type === "bug" ? copy.bugQuestions : copy.feedbackQuestions;
  return questions.join("\n\n");
}

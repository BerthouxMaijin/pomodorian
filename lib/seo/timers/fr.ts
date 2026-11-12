import type { TimerPage } from "./types";

// French timer pages, from week 3 (2026-11-12). Volumes are monthly searches
// in France from OpenSEO on 2026-10-29; see seo-agent/timer-pages/QUEUE.tsv.
// Written for French readers (vouvoiement, as in the UI strings) around local
// references: cohérence cardiaque 365, Code du travail, Grand oral du bac,
// "Silence, on lit !", not translated from the English pages.
export const frTimerPages: TimerPage[] = [
  {
    slug: "minuteur-5-minutes",
    lang: "fr",
    minutes: 5,
    role: "break",
    label: "5 minutes",
    title: "Minuteur 5 minutes : compte à rebours gratuit",
    description:
      "Minuteur de 5 minutes gratuit, en un clic : pour la pause courte Pomodoro, une séance de cohérence cardiaque ou l'interclasse.",
    h1: "Minuteur 5 minutes",
    intro:
      "Cinq minutes de compte à rebours, puis une alarme. C'est la pause courte de la méthode Pomodoro, mais aussi la durée d'une séance de cohérence cardiaque ou d'un interclasse : assez pour souffler, trop court pour se perdre dans autre chose.",
    useCases: [
      "La pause courte entre deux sessions Pomodoro de 25 minutes.",
      "Une séance de cohérence cardiaque selon la méthode 365.",
      "L'interclasse, pour changer de salle sans courir.",
      "Se lever, s'étirer et remplir son verre d'eau.",
      "Un sas entre deux visioconférences.",
    ],
    sections: [
      {
        heading: "La pause courte de la méthode Pomodoro",
        body: "La méthode Pomodoro alterne 25 minutes de travail concentré et une pause de 3 à 5 minutes, avec une pause plus longue toutes les quatre sessions. Cinq minutes suffisent pour décrocher de la tâche sans perdre le fil : le cerveau souffle, la suite reste fraîche. À condition que la pause en soit une, c'est-à-dire sans messagerie ni fil d'actualité.",
      },
      {
        heading: "Cinq minutes de cohérence cardiaque",
        body: "La cohérence cardiaque, popularisée en France par le médecin David O'Hare sous le nom de méthode 365, propose de respirer lentement, environ six respirations par minute, pendant cinq minutes, trois fois par jour. Lancez le minuteur, inspirez sur cinq secondes, expirez sur cinq secondes, et laissez l'alarme vous dire quand c'est terminé, sans regarder l'heure.",
      },
      {
        heading: "Un sas entre deux rendez-vous",
        body: "Enchaîner les visioconférences sans respirer, c'est arriver à la troisième avec la tête encore dans la première. Prévoyez cinq minutes entre deux réunions et lancez le minuteur dès que la première se termine : noter les décisions, se lever, regarder par la fenêtre. À l'alarme, vous êtes prêt pour la suivante, au lieu d'y entrer en courant.",
      },
    ],
    faq: [
      {
        q: "Cinq minutes de pause, est-ce suffisant ?",
        a: "Entre deux sessions courtes, oui. Après quatre sessions, la méthode Pomodoro prévoit une pause plus longue, de 15 à 30 minutes.",
      },
      {
        q: "Que se passe-t-il à la fin du compte à rebours ?",
        a: "Une alarme retentit, puis le minuteur revient à 05:00, prêt pour la prochaine pause.",
      },
      {
        q: "Puis-je ajouter un son d'ambiance ?",
        a: "Oui. Sous le minuteur, choisissez pluie, forêt, cheminée, café ou lo-fi, seuls ou à plusieurs. Le son se met en pause avec le minuteur et s'arrête à la fin.",
      },
    ],
    relatedArticleSlugs: [
      "guide-complet-pomodoro-debutants",
      "pauses-productives-que-faire",
      "meditation-pauses-pomodoro",
    ],
    published: "2026-11-12",
  },
  {
    slug: "minuteur-10-minutes",
    lang: "fr",
    minutes: 10,
    role: "break",
    label: "10 minutes",
    title: "Minuteur 10 minutes : compte à rebours gratuit en ligne",
    description:
      "Minuteur de 10 minutes gratuit : pour aérer la pièce, fermer sa journée de travail ou relire ses fiches avant un partiel. Sans inscription.",
    h1: "Minuteur 10 minutes",
    intro:
      "Ce minuteur décompte dix minutes et sonne à la fin. Dix minutes, c'est assez pour vraiment couper ou boucler une petite chose de A à Z, et assez court pour trouver sa place dans n'importe quelle journée.",
    useCases: [
      "Aérer la pièce en grand, fenêtres ouvertes.",
      "Fermer sa journée de télétravail avant de décrocher.",
      "Relire ses fiches juste avant un partiel.",
      "Prendre un café à la machine sans que ça dure une heure.",
      "La pause après 50 minutes de travail.",
    ],
    sections: [
      {
        heading: "Dix minutes pour aérer",
        body: "Les campagnes de santé publique recommandent d'aérer son logement au moins dix minutes par jour, même en hiver. En télétravail, on y pense rarement, alors que l'air d'une pièce fermée s'alourdit vite. Profitez d'une pause : ouvrez grand, lancez le minuteur, et refermez à l'alarme, au lieu de laisser la fenêtre ouverte en vous demandant depuis quand.",
      },
      {
        heading: "Le rituel de fin de journée",
        body: "Le droit à la déconnexion existe dans le Code du travail, mais en télétravail, c'est souvent à soi de tracer la ligne. Dix minutes suffisent pour un rituel de fermeture : noter ce qui reste, écrire la première tâche de demain, fermer les onglets et ranger le bureau. À l'alarme, la journée est finie, et le cerveau le sait.",
      },
      {
        heading: "Avant un partiel : relire, pas apprendre",
        body: "Les dernières minutes avant un examen ne servent plus à apprendre du neuf. Utilisez-les pour relire calmement vos fiches : le plan, les formules, les deux ou trois points que vous vouliez absolument retenir. Dix minutes donnent un cadre clair, et quand l'alarme sonne, vous rangez tout et vous entrez dans la salle.",
      },
    ],
    faq: [
      {
        q: "Le minuteur est-il gratuit ?",
        a: "Oui. Pas de compte, pas de publicité, rien à installer.",
      },
      {
        q: "Puis-je l'afficher en grand pour une classe ou une réunion ?",
        a: "Oui, si le navigateur le permet : le bouton plein écran agrandit le compte à rebours, et la touche Échap vous ramène à la page. Sur iPhone, les navigateurs ne proposent pas le plein écran pour les pages web, le bouton n'apparaît donc pas.",
      },
      {
        q: "Le minuteur continue-t-il si je change d'onglet ?",
        a: "Oui. Le temps restant est calculé à partir de l'heure réelle et reste exact à votre retour. Dans un onglet en arrière-plan, certains navigateurs peuvent retarder l'alarme d'une minute au plus, sauf si un son d'ambiance est en cours.",
      },
    ],
    relatedArticleSlugs: [
      "organiser-journee-teletravail",
      "pomodoro-etudiants-reviser-efficacement",
      "pauses-productives-que-faire",
    ],
    published: "2026-11-12",
  },
  {
    slug: "minuteur-15-minutes",
    lang: "fr",
    minutes: 15,
    role: "break",
    label: "15 minutes",
    title: "Minuteur 15 minutes : pause longue et micro-sieste",
    description:
      "Minuteur de 15 minutes gratuit : la pause longue de la méthode Pomodoro, un quart d'heure de lecture ou une micro-sieste en début d'après-midi.",
    h1: "Minuteur 15 minutes",
    intro:
      "Un quart d'heure, décompté, avec une alarme à la fin. C'est la pause longue de la méthode Pomodoro, celle qui vient après quatre sessions de travail, et un format qui a fait ses preuves ailleurs, de la micro-sieste au quart d'heure de lecture.",
    useCases: [
      "La pause longue après quatre sessions Pomodoro.",
      "Un quart d'heure de lecture, téléphone posé.",
      "Une micro-sieste en début d'après-midi.",
      "Faire un tour du pâté de maisons.",
      "Répéter une présentation en temps réel.",
    ],
    sections: [
      {
        heading: "La pause longue de la méthode Pomodoro",
        body: "Après quatre sessions de 25 minutes, la méthode Pomodoro prévoit une pause plus longue, de 15 à 30 minutes. C'est celle-là qui recharge vraiment : manger quelque chose, sortir à la lumière du jour, parler à quelqu'un d'autre que son écran. Quinze minutes en sont le bas de la fourchette et conviennent à la plupart des journées.",
      },
      {
        heading: "Le quart d'heure de lecture",
        body: "L'association Silence, on lit ! a popularisé dans des écoles et des entreprises un principe simple : chaque jour, tout le monde s'arrête un quart d'heure pour lire le livre de son choix. Vous pouvez l'appliquer seul. Posez le téléphone dans une autre pièce, lancez le minuteur, et lisez jusqu'à l'alarme. C'est court, mais quotidien, c'est beaucoup de pages sur une année.",
      },
      {
        heading: "Une micro-sieste qui ne laisse pas groggy",
        body: "On recommande souvent les siestes courtes, autour de 10 à 20 minutes, parce qu'elles s'arrêtent avant le sommeil profond, celui qui rend le réveil pénible. Allongez-vous, lancez le minuteur et laissez l'alarme vous réveiller. Sur téléphone, laissez la page ouverte et ne verrouillez pas l'appareil vous-même : tant que le minuteur tourne, la page garde l'écran allumé si votre navigateur le permet.",
      },
    ],
    faq: [
      {
        q: "Combien de temps doit durer la pause longue ?",
        a: "Entre 15 et 30 minutes, après quatre sessions. Un quart d'heure suffit la plupart du temps ; prenez davantage après une matinée exigeante.",
      },
      {
        q: "Puis-je enchaîner deux quarts d'heure ?",
        a: "Oui. À l'alarme, le minuteur revient à 15:00, et un clic sur Démarrer lance le second. Cela fait une demi-heure, par exemple pour la pause déjeuner.",
      },
      {
        q: "Puis-je mettre en pause puis reprendre ?",
        a: "Oui. Pause conserve le temps restant, Reprendre repart de là, et Réinitialiser remet le minuteur à 15 minutes.",
      },
    ],
    relatedArticleSlugs: [
      "guide-complet-pomodoro-debutants",
      "pauses-never-dumb",
      "rythmes-ultradiens-cycles-concentration-naturels",
    ],
    published: "2026-11-12",
  },
  {
    slug: "minuteur-20-minutes",
    lang: "fr",
    minutes: 20,
    role: "focus",
    breakMinutes: 5,
    label: "20 minutes",
    title: "Minuteur 20 minutes : compte à rebours pour se concentrer",
    description:
      "Minuteur de 20 minutes gratuit avec pause de 5 minutes : pour réviser par petites sessions ou s'entraîner au Grand oral du bac.",
    h1: "Minuteur 20 minutes",
    intro:
      "Vingt minutes de concentration, puis cinq minutes de pause : à l'alarme, le minuteur passe de lui-même sur la pause, il suffit de cliquer sur Démarrer. Un peu plus court qu'un Pomodoro classique, ce format aide à se lancer quand la tâche paraît lourde ou que la concentration flanche.",
    useCases: [
      "S'entraîner au Grand oral du bac en conditions réelles.",
      "Réviser par petites sessions, avec une pause entre chaque.",
      "Faire les devoirs d'un enfant par étapes.",
      "Commencer une tâche qu'on repousse depuis des jours.",
      "Un circuit de renforcement ou d'étirements.",
    ],
    sections: [
      {
        heading: "S'entraîner au Grand oral",
        body: "Au baccalauréat, le Grand oral dure vingt minutes, après vingt minutes de préparation : environ cinq minutes de présentation, dix minutes d'échange avec le jury, puis cinq minutes sur le projet d'orientation. S'entraîner avec un vrai compte à rebours apprend à tenir ce rythme. Lancez le minuteur pour la préparation, puis relancez-le pour l'épreuve, à voix haute, sans tricher sur le temps.",
      },
      {
        heading: "Vingt minutes, c'est aussi la pause légale",
        body: "Le Code du travail prévoit qu'à partir de six heures de travail dans la journée, le salarié a droit à une pause d'au moins vingt minutes consécutives. Si vous avez tendance à la grignoter en restant devant l'écran, ce minuteur peut servir à l'inverse : lancez-le au début de la pause, levez-vous, et ne revenez qu'à l'alarme.",
      },
      {
        heading: "Réviser par petites sessions",
        body: "Réviser trois heures d'affilée donne l'impression de travailler, mais l'attention décroche bien avant la fin. Des sessions de vingt minutes, avec une vraie pause entre chacune, obligent à se tester régulièrement au lieu de relire en boucle. Fermez le cours, essayez de retrouver l'essentiel de mémoire, et vérifiez ensuite.",
      },
    ],
    faq: [
      {
        q: "Pourquoi 20 minutes plutôt que 25 ?",
        a: "Les 25 minutes de la méthode Pomodoro sont une convention. En cas de difficulté de concentration, par exemple avec un TDAH, une session plus courte peut faciliter le démarrage. Si tout va bien, vous allongerez ensuite.",
      },
      {
        q: "À quoi sert le lien vers l'application complète ?",
        a: "Il ouvre Pomodorian et règle votre durée de concentration enregistrée sur 20 minutes, jusqu'à ce que vous la changiez dans les réglages. La durée de pause reste celle de vos réglages. L'application ajoute une liste de tâches, un planificateur par IA et des statistiques de concentration.",
      },
      {
        q: "Faut-il un compte ou une application ?",
        a: "Non. Le minuteur fonctionne directement dans le navigateur, sans inscription ni installation. Le son d'ambiance choisi est mémorisé par votre navigateur pour la prochaine visite.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-etudiants-reviser-efficacement",
      "pomodoro-tdah",
      "meilleures-techniques-etude-science",
    ],
    published: "2026-11-12",
  },
  {
    slug: "minuteur-30-minutes",
    lang: "fr",
    minutes: 30,
    role: "focus",
    breakMinutes: 5,
    label: "30 minutes",
    title: "Minuteur 30 minutes : compte à rebours gratuit",
    description:
      "Minuteur de 30 minutes gratuit avec pause de 5 minutes : une demi-heure de sport par jour, une séance de travail ou un appel tenu à l'heure.",
    h1: "Minuteur 30 minutes",
    intro:
      "Une demi-heure, décomptée, avec une alarme à la fin et une pause de cinq minutes juste à côté. Trente minutes, c'est l'unité que tout le monde a déjà en tête : un créneau d'agenda, une séance de sport, une demi-heure de révisions le soir.",
    useCases: [
      "La demi-heure d'activité physique quotidienne.",
      "Une séance de travail de 30 minutes suivie de 5 minutes de pause.",
      "Une demi-heure de révisions le soir, pas une de plus.",
      "Tenir un appel ou une réunion dans son créneau.",
      "Avancer sur la paperasse sans y passer l'après-midi.",
    ],
    sections: [
      {
        heading: "La demi-heure d'activité physique",
        body: "Les recommandations françaises de santé publique invitent les adultes à pratiquer au moins trente minutes d'activité physique dynamique par jour, et l'école élémentaire a généralisé trente minutes d'activité physique quotidienne. Marche rapide, vélo, séance à la maison : avec un minuteur, la demi-heure a un début et une fin nets, ce qui aide à s'y tenir.",
      },
      {
        heading: "La paperasse en un bloc",
        body: "Déclaration d'impôts, dossier de mutuelle, factures à classer : la paperasse a le don de s'étaler sur tout un week-end. Donnez-lui une demi-heure, lancez le minuteur et avancez jusqu'à l'alarme. Ce qui n'est pas fini passe au prochain bloc, mais il ne déborde plus sur le reste de la journée.",
      },
      {
        heading: "Une variante du Pomodoro",
        body: "Un rythme de 30 minutes de travail et 5 minutes de pause garde l'esprit de la méthode Pomodoro tout en collant aux créneaux de l'agenda. Deux sessions et leurs pauses tiennent en un peu plus d'une heure. C'est une bonne étape pour ceux qui trouvent 25 minutes un peu court, sans aller jusqu'aux blocs de 50 minutes.",
      },
    ],
    faq: [
      {
        q: "Combien de sessions de 30 minutes par jour ?",
        a: "Il n'y a pas de bon chiffre. Prévoyez celles dont votre travail a besoin, et arrêtez d'en ajouter quand vous sentez nettement l'attention baisser.",
      },
      {
        q: "Quelle pause après 30 minutes ?",
        a: "Cinq minutes, c'est le mode pause intégré au minuteur. Après trois ou quatre sessions, prenez une pause longue de 15 à 30 minutes.",
      },
      {
        q: "Le lien vers l'application change-t-il mes réglages ?",
        a: "Oui : il règle votre durée de concentration enregistrée sur 30 minutes. Vous pouvez la modifier à tout moment dans les réglages de l'application.",
      },
    ],
    relatedArticleSlugs: [
      "personnaliser-intervalles-pomodoro",
      "vaincre-procrastination-pomodoro",
      "organiser-journee-teletravail",
    ],
    published: "2026-11-12",
  },
];

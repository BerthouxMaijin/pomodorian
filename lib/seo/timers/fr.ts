import type { TimerPage } from "./types";

// French timer pages, from week 3 (2026-11-12). Volumes are monthly searches
// in France from OpenSEO on 2026-10-29; see seo-agent/timer-pages/QUEUE.tsv.
// Written for French readers (vouvoiement, as in the UI strings). Each page
// is built on French references and its own FAQ topics, so it does not
// mirror the English or German page of the same duration.
export const frTimerPages: TimerPage[] = [
  {
    slug: "minuteur-5-minutes",
    lang: "fr",
    minutes: 5,
    role: "break",
    label: "5 minutes",
    title: "Minuteur 5 minutes : compte à rebours gratuit",
    description:
      "Minuteur de 5 minutes gratuit, en un clic : pour une séance de cohérence cardiaque, l'interclasse ou la pause courte de la méthode Pomodoro.",
    h1: "Minuteur 5 minutes",
    intro:
      "Cinq minutes, une alarme, rien d'autre. C'est la durée d'une séance de cohérence cardiaque, d'un interclasse au collège ou de la pause courte de la méthode Pomodoro : le temps de souffler, sans que la suite vous échappe.",
    useCases: [
      "Une séance de cohérence cardiaque selon la méthode 365.",
      "L'interclasse, pour changer de salle sans courir.",
      "La pause courte entre deux sessions Pomodoro.",
      "Une pause pour tout le monde, fumeurs ou non.",
      "Un temps calme avant de prendre la parole.",
    ],
    sections: [
      {
        heading: "Cinq minutes de cohérence cardiaque",
        body: "La cohérence cardiaque, popularisée en France par le médecin David O'Hare sous le nom de méthode 365, propose de respirer lentement, environ six respirations par minute, pendant cinq minutes, trois fois par jour. Lancez le minuteur, inspirez sur cinq secondes, expirez sur cinq secondes, et laissez l'alarme vous dire quand c'est terminé, sans regarder l'heure.",
      },
      {
        heading: "L'interclasse, en classe et ailleurs",
        body: "Dans beaucoup de collèges et de lycées, cinq minutes séparent deux cours : le temps de ranger ses affaires, de changer de salle et de s'installer. Les enseignants peuvent afficher ce minuteur pour que tout le monde voie le temps qui reste. À la maison, le même principe aide à passer d'une matière à l'autre sans traîner entre les deux.",
      },
      {
        heading: "Une pause, même sans cigarette",
        body: "Dans bien des bureaux, les fumeurs s'accordent naturellement quelques minutes dehors, quand les autres restent rivés à l'écran. Rien n'empêche de s'offrir la même respiration sans cigarette : se lever, marcher jusqu'à la fenêtre, discuter deux minutes avec un collègue. Cinq minutes au minuteur, et vous revenez sans culpabiliser.",
      },
    ],
    faq: [
      {
        q: "Le minuteur donne-t-il le rythme des respirations ?",
        a: "Non. Il décompte seulement les cinq minutes. Pour le rythme de cinq secondes à l'inspiration et cinq à l'expiration, comptez dans votre tête ; le minuteur vous évite simplement de surveiller l'heure.",
      },
      {
        q: "Combien de séances de cohérence cardiaque par jour ?",
        a: "La méthode 365 en propose trois par jour, par exemple le matin, avant le déjeuner et en fin d'après-midi.",
      },
      {
        q: "Peut-on l'afficher sur un tableau numérique ou un vidéoprojecteur ?",
        a: "Oui, depuis le navigateur de l'ordinateur de la classe. Le bouton plein écran agrandit le compte à rebours là où le navigateur le permet, et la touche Échap ramène à la page.",
      },
    ],
    relatedArticleSlugs: [
      "guide-complet-pomodoro-debutants",
      "meditation-pauses-pomodoro",
      "pauses-productives-que-faire",
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
      "Minuteur de 10 minutes gratuit : pour aérer la pièce, lire avec un enfant ou couper les notifications en fin de journée. Sans inscription.",
    h1: "Minuteur 10 minutes",
    intro:
      "Appuyez sur Démarrer : dix minutes s'écoulent, l'alarme sonne. Dix minutes, c'est le temps qu'on recommande pour aérer une pièce, celui d'une lecture partagée avec un enfant, ou d'un vrai décrochage avant la soirée.",
    useCases: [
      "Aérer la pièce en grand, fenêtres ouvertes.",
      "Lire chaque soir avec un enfant qui apprend à lire.",
      "Couper les notifications professionnelles avant la soirée.",
      "Boucler une petite tâche du début à la fin.",
      "Se préparer au calme avant une visioconférence importante.",
    ],
    sections: [
      {
        heading: "Dix minutes pour aérer",
        body: "Les campagnes de santé publique recommandent d'aérer son logement au moins dix minutes par jour, même en hiver. En télétravail, on y pense rarement, alors que l'air d'une pièce fermée s'alourdit vite. Profitez d'une pause : ouvrez grand, lancez le minuteur et refermez à l'alarme, au lieu de laisser la fenêtre ouverte en vous demandant depuis quand.",
      },
      {
        heading: "Lire avec un enfant, un peu chaque jour",
        body: "Quand un enfant apprend à lire, beaucoup d'enseignants conseillent de lire un peu avec lui chaque jour plutôt que longtemps de temps en temps. Dix minutes, c'est assez pour une page ou deux à voix haute, pas assez pour que la séance tourne au bras de fer. Le minuteur fixe la limite à votre place : à l'alarme, on s'arrête, même au milieu d'une phrase.",
      },
      {
        heading: "Décrocher pour de bon",
        body: "Le droit à la déconnexion est inscrit dans le Code du travail, mais en télétravail, le téléphone professionnel reste souvent à portée de main. Prenez dix minutes en fin de journée pour faire le ménage : mettre la messagerie en mode silencieux, désactiver les notifications de l'outil de discussion, poser le téléphone dans un tiroir. À l'alarme, la soirée commence vraiment.",
      },
    ],
    faq: [
      {
        q: "Faut-il aérer même quand il fait froid ?",
        a: "Oui, c'est justement ce que recommandent les campagnes de santé publique : tous les jours, en grand, y compris l'hiver. Le minuteur évite de laisser la fenêtre ouverte plus que nécessaire.",
      },
      {
        q: "Le minuteur continue-t-il dans un onglet en arrière-plan ?",
        a: "Oui. Le temps restant est calculé à partir de l'heure réelle et reste exact à votre retour. Certains navigateurs peuvent toutefois retarder l'alarme d'une minute au plus dans un onglet en arrière-plan, sauf si un son d'ambiance est en cours.",
      },
      {
        q: "Peut-on lancer plusieurs fois dix minutes d'affilée ?",
        a: "Oui. À l'alarme, le minuteur revient à 10:00 : un clic sur Démarrer suffit pour repartir.",
      },
    ],
    relatedArticleSlugs: [
      "organiser-journee-teletravail",
      "pauses-productives-que-faire",
      "recuperer-concentration-apres-interruption",
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
      "Minuteur de 15 minutes gratuit : un quart d'heure de lecture, la récréation, la répétition d'un exposé ou la pause longue Pomodoro.",
    h1: "Minuteur 15 minutes",
    intro:
      "Un quart d'heure, et l'alarme sonne. C'est la durée d'une récréation à l'école élémentaire, du quart d'heure de lecture que certaines écoles ont rendu quotidien, ou d'un exposé de classe, et c'est aussi le bas de la fourchette de la pause longue Pomodoro.",
    useCases: [
      "Un quart d'heure de lecture, téléphone posé.",
      "Chronométrer une récréation ou un temps libre.",
      "Répéter un exposé de quinze minutes en temps réel.",
      "Une micro-sieste en début d'après-midi.",
      "La pause longue après quatre sessions Pomodoro.",
    ],
    sections: [
      {
        heading: "Le quart d'heure de lecture",
        body: "L'association Silence, on lit ! a popularisé dans des écoles et des entreprises un principe simple : chaque jour, tout le monde s'arrête un quart d'heure pour lire le livre de son choix. Vous pouvez l'appliquer seul. Posez le téléphone dans une autre pièce, lancez le minuteur et lisez jusqu'à l'alarme. C'est court, mais chaque jour, cela fait beaucoup de pages sur une année.",
      },
      {
        heading: "Répéter un exposé en temps réel",
        body: "Un exposé de quinze minutes se prépare montre en main. Répétez-le à voix haute avec le minuteur, et notez où vous en êtes au milieu : si l'introduction a déjà mangé sept minutes, c'est elle qu'il faut couper. Deux ou trois passages suffisent souvent pour trouver le bon rythme, et le jour J, vous saurez à quoi ressemblent quinze minutes.",
      },
      {
        heading: "La récréation, côté parents et enseignants",
        body: "À l'école élémentaire, la récréation dure en général un quart d'heure par demi-journée. À la maison, le même format marche bien entre deux devoirs : quinze minutes vraiment libres, puis retour au bureau à l'alarme. Le minuteur évite le débat sur le temps qui reste, puisque tout le monde le voit.",
      },
    ],
    faq: [
      {
        q: "Que lire en un quart d'heure ?",
        a: "Quelques pages d'un roman, un long article, un chapitre de bande dessinée. Un livre papier évite les notifications qui interrompent la lecture sur écran.",
      },
      {
        q: "Et pour une micro-sieste ?",
        a: "On recommande souvent 10 à 20 minutes, pour se réveiller avant le sommeil profond et ne pas se sentir vaseux. Un quart d'heure laisse quelques minutes pour s'endormir.",
      },
      {
        q: "Que faire si l'alarme ne sonne pas sur mon téléphone ?",
        a: "Vérifiez le volume, laissez la page ouverte et ne verrouillez pas l'appareil vous-même. Tant que le minuteur tourne, la page garde l'écran allumé si votre navigateur le permet.",
      },
    ],
    relatedArticleSlugs: [
      "habitude-concentration-quotidienne-30-jours",
      "pauses-never-dumb",
      "guide-complet-pomodoro-debutants",
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
      "Minuteur de 20 minutes gratuit avec pause de 5 minutes : pour s'entraîner au Grand oral du bac ou prendre enfin sa pause légale de 20 minutes.",
    h1: "Minuteur 20 minutes",
    intro:
      "Vingt minutes, c'est la durée du Grand oral du bac et celle de la pause minimale prévue par le Code du travail. Ce minuteur les décompte, avec une pause de cinq minutes à côté pour qui l'utilise comme session de travail courte.",
    useCases: [
      "S'entraîner au Grand oral du bac en conditions réelles.",
      "Prendre vraiment sa pause légale de vingt minutes.",
      "Accompagner les devoirs d'un enfant, par étapes.",
      "Une session de révision courte avec auto-interrogation.",
      "Un circuit de renforcement ou d'étirements.",
    ],
    sections: [
      {
        heading: "S'entraîner au Grand oral",
        body: "Au baccalauréat, le Grand oral dure vingt minutes, après vingt minutes de préparation : une présentation, puis un échange avec le jury. S'entraîner avec un vrai compte à rebours apprend à tenir le temps. Lancez le minuteur pour la préparation ; à l'alarme, revenez sur « Minuteur 20 min » et cliquez sur Démarrer pour l'épreuve, à voix haute, sans tricher.",
      },
      {
        heading: "Vingt minutes, c'est aussi la pause légale",
        body: "Le Code du travail prévoit qu'à partir de six heures de travail dans la journée, le salarié a droit à une pause d'au moins vingt minutes consécutives. Si vous avez tendance à la grignoter en restant devant l'écran, lancez le minuteur au début de la pause, levez-vous, et ne revenez qu'à l'alarme.",
      },
      {
        heading: "Réviser en s'interrogeant",
        body: "Relire un cours donne l'impression de travailler, mais on retient mieux en se testant. Une session de vingt minutes est l'occasion de le faire : lisez une partie, fermez le cours, essayez de retrouver l'essentiel de mémoire sur une feuille, puis vérifiez. Cinq minutes de pause, et on passe à la partie suivante.",
      },
    ],
    faq: [
      {
        q: "Comment enchaîner préparation et épreuve du Grand oral ?",
        a: "Lancez les vingt minutes de préparation. À l'alarme, le minuteur passe sur la pause : cliquez sur « Minuteur 20 min », puis sur Démarrer, pour chronométrer l'épreuve.",
      },
      {
        q: "À quoi sert le lien vers l'application complète ?",
        a: "Il ouvre Pomodorian et règle votre durée de concentration enregistrée sur 20 minutes, jusqu'à ce que vous la changiez dans les réglages. La durée de pause reste celle de vos réglages.",
      },
      {
        q: "Le minuteur fonctionne-t-il sur téléphone pendant un oral blanc ?",
        a: "Oui, dans le navigateur, sans application. Laissez la page ouverte : pendant le décompte, elle garde l'écran allumé si votre navigateur le permet.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-etudiants-reviser-efficacement",
      "meilleures-techniques-etude-science",
      "pomodoro-tdah",
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
      "Minuteur de 30 minutes gratuit avec pause de 5 minutes : une demi-heure de sport, un entraînement à l'examen du code ou les devoirs du soir.",
    h1: "Minuteur 30 minutes",
    intro:
      "Trente minutes au compteur, une pause de cinq minutes en réserve. Une demi-heure, c'est la dose quotidienne d'activité physique recommandée aux adultes, la durée approximative de l'examen du code de la route, et un bon format pour les devoirs du soir.",
    useCases: [
      "La demi-heure d'activité physique de la journée.",
      "Une série d'entraînement au code de la route.",
      "Les devoirs du soir, avec une fin annoncée.",
      "Une séance de travail suivie de 5 minutes de pause.",
      "Une lecture de dossier avant une réunion.",
    ],
    sections: [
      {
        heading: "La demi-heure d'activité physique",
        body: "Les recommandations françaises de santé publique invitent les adultes à pratiquer au moins trente minutes d'activité physique dynamique par jour, et le ministère a généralisé en 2022 trente minutes d'activité physique quotidienne à l'école primaire. Marche rapide, vélo, séance à la maison : avec un minuteur, la demi-heure a un début et une fin nets, ce qui aide à s'y tenir.",
      },
      {
        heading: "S'entraîner au code de la route",
        body: "L'examen théorique du code se passe sur une série de quarante questions, en une demi-heure environ. S'entraîner dans les mêmes conditions aide à gérer le rythme : lancez le minuteur, enchaînez une série sans faire de pause, puis corrigez vos erreurs une fois l'alarme passée. Vous saurez si vous bloquez trop longtemps sur certaines questions.",
      },
      {
        heading: "Les devoirs du soir, avec une fin annoncée",
        body: "Les devoirs qui n'en finissent pas usent tout le monde. Annoncez une demi-heure, lancez le minuteur à la vue de l'enfant et tenez-vous-en à l'alarme : ce qui n'est pas fini sera repris demain ou signalé à l'enseignant. Une fin connue d'avance rend souvent le début plus facile.",
      },
    ],
    faq: [
      {
        q: "Trente minutes de sport d'un seul coup ou en plusieurs fois ?",
        a: "Les deux comptent. Si une demi-heure d'affilée est difficile à caser, plusieurs séances plus courtes dans la journée vont aussi dans le bon sens.",
      },
      {
        q: "Peut-on écouter de la musique pendant la séance ?",
        a: "Oui. Sous le minuteur, le son lo-fi ou un son de pluie peut tourner pendant le décompte ; il se met en pause avec le minuteur et s'arrête à l'alarme.",
      },
      {
        q: "Et si les devoirs ne sont pas finis à l'alarme ?",
        a: "Faites une courte pause, puis décidez ensemble : une seconde demi-heure, ou la suite demain. L'important est que la limite ait été posée avant de commencer.",
      },
    ],
    relatedArticleSlugs: [
      "personnaliser-intervalles-pomodoro",
      "vaincre-procrastination-pomodoro",
      "meilleures-techniques-etude-science",
    ],
    published: "2026-11-12",
  },
];

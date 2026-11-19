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
      "Minuteur de 10 minutes gratuit : pour aérer la pièce, lire avec un enfant ou ranger la maison en famille avant le dîner. Sans inscription.",
    h1: "Minuteur 10 minutes",
    intro:
      "Appuyez sur Démarrer : dix minutes s'écoulent, l'alarme sonne. Dix minutes, c'est le temps qu'on recommande pour aérer une pièce, celui d'une lecture partagée avec un enfant, ou d'un rangement express à plusieurs.",
    useCases: [
      "Aérer la pièce en grand, fenêtres ouvertes.",
      "Lire chaque soir avec un enfant qui apprend à lire.",
      "Un rangement express en famille avant le dîner.",
      "Boucler une petite tâche du début à la fin.",
      "Se préparer au calme avant une visioconférence importante.",
    ],
    sections: [
      {
        heading: "Dix minutes pour aérer",
        body: "Le ministère de la Santé et l'ADEME recommandent d'aérer son logement au moins dix minutes par jour, même en hiver. En télétravail, on y pense rarement, alors que l'air d'une pièce fermée s'alourdit vite. Profitez d'une pause : ouvrez grand, lancez le minuteur et refermez à l'alarme, au lieu de laisser la fenêtre ouverte en vous demandant depuis quand.",
      },
      {
        heading: "Lire avec un enfant, un peu chaque jour",
        body: "Quand un enfant apprend à lire, beaucoup d'enseignants conseillent de lire un peu avec lui chaque jour plutôt que longtemps de temps en temps. Dix minutes, c'est assez pour une page ou deux à voix haute, pas assez pour que la séance tourne au bras de fer. Le minuteur fixe la limite à votre place : à l'alarme, on s'arrête à la fin de la phrase.",
      },
      {
        heading: "Le rangement express à plusieurs",
        body: "Ranger seul une maison entière décourage ; ranger dix minutes à plusieurs, beaucoup moins. Avant le dîner, lancez le minuteur et donnez à chacun une zone : le salon, l'entrée, sa chambre. Personne ne discute la durée, puisque tout le monde voit le temps qui reste, et à l'alarme on s'arrête, même si tout n'est pas parfait. Répété chaque soir, ça suffit souvent.",
      },
    ],
    faq: [
      {
        q: "Faut-il aérer même quand il fait froid ?",
        a: "Oui, c'est justement la recommandation : tous les jours, en grand, y compris l'hiver. Le minuteur évite de laisser la fenêtre ouverte plus que nécessaire.",
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
    title: "Minuteur 15 minutes : lecture, exposé et récréation",
    description:
      "Minuteur de 15 minutes gratuit : un quart d'heure de lecture, la récréation, la répétition d'un exposé ou la pause longue Pomodoro.",
    h1: "Minuteur 15 minutes",
    intro:
      "Un quart d'heure, et l'alarme sonne. C'est la durée d'une récréation à l'école élémentaire, du quart d'heure de lecture que certaines écoles ont rendu quotidien, ou d'un exposé de quinze minutes à préparer.",
    useCases: [
      "Un quart d'heure de lecture, téléphone posé.",
      "Chronométrer une récréation ou un temps libre.",
      "Répéter un exposé de quinze minutes en temps réel.",
      "La pause longue après quatre sessions Pomodoro.",
      "Un temps de calme avant le coucher.",
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
        q: "Comment découper un exposé de quinze minutes ?",
        a: "Une introduction courte, deux ou trois parties, une conclusion. Notez à quelle minute chaque partie doit commencer, puis vérifiez-le en répétant avec le minuteur.",
      },
      {
        q: "Peut-on afficher le minuteur en classe pendant la récréation ?",
        a: "Oui, sur l'ordinateur relié au tableau numérique. Le bouton plein écran agrandit le compte à rebours là où le navigateur le permet, et la touche Échap ramène à la page.",
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
      "Un oral blanc à deux, chacun son tour.",
    ],
    sections: [
      {
        heading: "S'entraîner au Grand oral",
        body: "Au baccalauréat, le Grand oral dure vingt minutes, après vingt minutes de préparation : une présentation, puis un échange avec le jury. S'entraîner avec un vrai compte à rebours apprend à tenir le temps. Chronométrez la préparation, puis l'épreuve elle-même, à voix haute et sans tricher sur le temps : la manipulation est détaillée dans les questions plus bas.",
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
        q: "Comment utiliser les vingt minutes de préparation ?",
        a: "Une possibilité : quelques minutes pour choisir l'angle, le reste pour un plan et une poignée de mots-clés, pas un texte rédigé. L'oral sonne plus naturel quand on ne lit pas.",
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
        body: "L'examen théorique du code se passe sur une série de quarante questions, avec une vingtaine de secondes par question, soit une demi-heure environ en tout. Pour vous y préparer, faites une série complète d'une traite : lancez le minuteur, enchaînez les quarante questions sans vous arrêter, et ne regardez la correction qu'après l'alarme, comme le jour de l'examen.",
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
      {
        q: "Le lien vers l'application change-t-il mes réglages ?",
        a: "Oui : il règle votre durée de concentration enregistrée sur 30 minutes. La durée de pause reste celle de vos réglages, et vous pouvez tout modifier à tout moment.",
      },
    ],
    relatedArticleSlugs: [
      "personnaliser-intervalles-pomodoro",
      "vaincre-procrastination-pomodoro",
      "meilleures-techniques-etude-science",
    ],
    published: "2026-11-12",
  },
  // Week 4 (2026-11-19).
  {
    slug: "minuteur-25-minutes",
    lang: "fr",
    minutes: 25,
    role: "focus",
    breakMinutes: 5,
    label: "25 minutes",
    title: "Minuteur 25 minutes : méthode Pomodoro gratuite",
    description:
      "Minuteur de 25 minutes gratuit pour la méthode Pomodoro, avec pause de 5 minutes. Fiche du jour, gestion des interruptions, télétravail avec enfants.",
    h1: "Minuteur 25 minutes",
    intro:
      "Vingt-cinq minutes, c'est un pomodoro. Lancez ce minuteur sur une seule tâche ; à l'alarme, il passe de lui-même sur la pause de cinq minutes. Au-delà du chronomètre, la méthode de Francesco Cirillo tient dans quelques outils très simples, dont deux sont détaillés plus bas.",
    useCases: [
      "Un pomodoro de 25 minutes sur une seule tâche.",
      "Avancer en télétravail quand les enfants sont à la maison.",
      "Vider sa fiche « À faire aujourd'hui », une tâche à la fois.",
      "Traiter un dossier qu'on repousse depuis des semaines.",
      "Une séance de révision suivie de cinq minutes de pause.",
    ],
    sections: [
      {
        heading: "La fiche « À faire aujourd'hui »",
        body: "Dans sa méthode, Cirillo ne se contente pas d'un minuteur. Il propose une fiche « À faire aujourd'hui », où l'on note le matin les seules tâches de la journée, et un inventaire des activités pour tout le reste. La fiche du jour reste courte. À chaque pomodoro terminé, on coche une case à côté de la tâche : le soir, on voit noir sur blanc où est passé le temps.",
      },
      {
        heading: "Informer, négocier, rappeler",
        body: "Pour les interruptions venues des autres, Cirillo propose une séquence simple : informer la personne que vous êtes occupé, négocier un moment pour lui répondre, puis la rappeler comme promis à la fin du pomodoro. Souvent, la demande peut attendre vingt minutes, et la personne est rassurée de savoir quand vous reviendrez vers elle.",
      },
      {
        heading: "Un pomodoro pour chacun, même les enfants",
        body: "Pendant les vacances ou un jour de grève, travailler avec des enfants autour de soi semble impossible. Proposez-leur leur propre séance : un dessin, un puzzle, une page de lecture, avec leur minuteur à eux. Vous travaillez chacun de votre côté, et la pause devient un rendez-vous commun où l'on se montre ce qu'on a fait.",
      },
    ],
    faq: [
      {
        q: "La méthode convient-elle aux enfants ?",
        a: "Le principe, oui, mais 25 minutes peuvent être longues pour les plus jeunes. Commencez par des sessions plus courtes, avec le minuteur de 15 ou 20 minutes, et allongez avec l'âge.",
      },
      {
        q: "Que noter sur la fiche du jour ?",
        a: "Les quelques tâches que vous comptez vraiment faire aujourd'hui, une par ligne, avec une case par pomodoro passé dessus. Tout le reste va dans l'inventaire des activités.",
      },
      {
        q: "Faut-il créer un compte ?",
        a: "Non. Le minuteur fonctionne directement dans le navigateur, sans inscription ni publicité.",
      },
    ],
    relatedArticleSlugs: [
      "guide-complet-pomodoro-debutants",
      "vaincre-procrastination-pomodoro",
      "organiser-journee-teletravail",
    ],
    published: "2026-11-19",
  },
  {
    slug: "minuteur-45-minutes",
    lang: "fr",
    minutes: 45,
    role: "focus",
    breakMinutes: 15,
    label: "45 minutes",
    title: "Minuteur 45 minutes : compte à rebours gratuit",
    description:
      "Minuteur de 45 minutes gratuit avec pause de 15 minutes : pour une réunion qui laisse du temps libre, le plan d'une dissertation ou un cours de yoga.",
    h1: "Minuteur 45 minutes",
    intro:
      "Quarante-cinq minutes au compteur, et un quart d'heure de pause prêt à prendre le relais. C'est un format qui libère du temps sans en avoir l'air : une réunion de 45 minutes plutôt qu'une heure, un plan de dissertation construit sans se presser, une séance de yoga complète.",
    useCases: [
      "Une réunion de 45 minutes plutôt qu'une heure.",
      "Construire le plan d'une dissertation au brouillon.",
      "Un cours de yoga ou de renforcement en ligne.",
      "Un bloc de travail suivi de 15 minutes de vraie pause.",
      "Préparer un oral ou une présentation.",
    ],
    sections: [
      {
        heading: "La réunion de 45 minutes",
        body: "Une réunion programmée sur une heure en remplit souvent une. En la fixant à 45 minutes, vous rendez un quart d'heure à chacun pour souffler, noter les décisions ou arriver à l'heure au rendez-vous suivant. Le minuteur affiché à l'écran aide l'animateur : quand il reste dix minutes, on passe aux décisions et aux prochaines étapes.",
      },
      {
        heading: "Le plan d'une dissertation",
        body: "Beaucoup de professeurs de philosophie et de lettres conseillent de passer un long moment au brouillon avant de rédiger. Quarante-cinq minutes, c'est un temps raisonnable pour analyser le sujet, chercher les exemples et bâtir un plan solide en deux ou trois parties. En s'entraînant avec le minuteur, on apprend à ne pas rédiger trop tôt, ni trop tard.",
      },
      {
        heading: "Une séance de yoga ou de renforcement",
        body: "De nombreux cours de yoga ou de renforcement en ligne durent autour de 45 minutes. Lancer le minuteur en même temps que la vidéo, c'est s'engager à aller jusqu'au bout, y compris jusqu'au temps de relaxation final, souvent sacrifié. Le quart d'heure de pause qui suit sert à boire, se changer et reprendre doucement.",
      },
    ],
    faq: [
      {
        q: "Pourquoi 45 minutes plutôt que 50 ?",
        a: "Quarante-cinq minutes plus quinze de pause font exactement une heure : chaque bloc commence à l'heure pile, ce qui simplifie l'agenda et les rendez-vous avec les autres.",
      },
      {
        q: "Le lien vers l'application règle-t-il 45 minutes ?",
        a: "Oui : il règle votre durée de concentration enregistrée sur 45 minutes. La pause reste celle de vos réglages, que vous pouvez modifier à tout moment.",
      },
      {
        q: "Combien de temps pour le plan le jour de l'examen ?",
        a: "Cela dépend de la durée de l'épreuve et des conseils de vos professeurs. L'entraînement en 45 minutes sert surtout à savoir combien de temps il vous faut, à vous, pour un plan solide.",
      },
    ],
    relatedArticleSlugs: [
      "sessions-pomodoro-longues-guide",
      "meilleures-techniques-etude-science",
      "deep-work-concentration-profonde",
    ],
    published: "2026-11-19",
  },
  {
    slug: "minuteur-40-minutes",
    lang: "fr",
    minutes: 40,
    role: "focus",
    breakMinutes: 20,
    label: "40 minutes",
    title: "Minuteur 40 minutes : compte à rebours gratuit",
    description:
      "Minuteur de 40 minutes gratuit avec pause de 20 minutes : le créneau réel entre deux réunions, une cuisson au four ou les révisions avant le dîner.",
    h1: "Minuteur 40 minutes",
    intro:
      "Quarante minutes, puis une pause de vingt. C'est souvent le temps vraiment disponible entre deux réunions, celui d'une cuisson au four ou d'une séance de révisions avant de passer à table. Ce minuteur les décompte et sonne à la fin.",
    useCases: [
      "Le créneau réellement libre entre deux réunions.",
      "Surveiller une cuisson au four.",
      "Les révisions avant le dîner.",
      "Un bloc de travail suivi de 20 minutes de pause.",
      "Ranger un placard ou trier des papiers.",
    ],
    sections: [
      {
        heading: "Le vrai créneau entre deux réunions",
        body: "Sur l'agenda, une heure sépare deux réunions. En pratique, la première déborde, et il faut quelques minutes pour préparer la suivante. Reste environ quarante minutes. Plutôt que de les perdre à vérifier ses messages, lancez le minuteur sur une seule tâche dès que vous êtes assis : quarante minutes sans dispersion, c'est déjà beaucoup.",
      },
      {
        heading: "En cuisine",
        body: "Gâteau, quiche, gratin : de nombreuses cuissons au four tournent autour de quarante minutes, selon la recette et le four. Lancez le minuteur en enfournant et laissez cet onglet au premier plan : dans un onglet en arrière-plan, certains navigateurs peuvent retarder l'alarme jusqu'à une minute, et une minute compte pour une croûte.",
      },
      {
        heading: "Les révisions avant le dîner",
        body: "Après la journée de cours, une séance de quarante minutes avant le repas est un format réaliste : assez pour revoir une leçon et faire quelques exercices, assez court pour ne pas déborder sur la soirée. À l'alarme, on range les cahiers et on passe à table : la soirée commence, et les révisions ne débordent pas dessus.",
      },
    ],
    faq: [
      {
        q: "Que faire si la réunion précédente déborde ?",
        a: "Lancez le minuteur quand vous vous asseyez, pas à l'heure prévue. Mieux vaut trente minutes de vraie concentration que d'empiéter sur la réunion suivante.",
      },
      {
        q: "Peut-on enchaîner deux cuissons ?",
        a: "Oui. À l'alarme, le minuteur passe sur la pause de vingt minutes : cliquez sur « Minuteur 40 min », puis sur Démarrer, pour relancer quarante minutes.",
      },
      {
        q: "Le minuteur garde-t-il l'écran du téléphone allumé ?",
        a: "Oui, pendant le décompte, si votre navigateur le permet. Gardez simplement la page affichée au premier plan.",
      },
    ],
    relatedArticleSlugs: [
      "personnaliser-intervalles-pomodoro",
      "pomodoro-etudiants-reviser-efficacement",
      "organiser-journee-teletravail",
    ],
    published: "2026-11-19",
  },
];

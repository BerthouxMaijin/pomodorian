import type { UiLocale } from "@/lib/i18n/locales";

export const SERIOUS_EXERCISES = ["rebuild", "breakAnswer", "compress"] as const;
export const FUN_EXERCISES = ["humanCaptcha", "roomRaid", "bodyDebugger", "duckBoss"] as const;
export const RESET_EXERCISES = ["breathing", "meditation", "bodyScan", "walk", "music", "pingPong"] as const;

export type SeriousExercise = (typeof SERIOUS_EXERCISES)[number];
export type FunExercise = (typeof FUN_EXERCISES)[number];
export type ResetExercise = (typeof RESET_EXERCISES)[number];
export type ExerciseId = SeriousExercise | FunExercise | ResetExercise;
export type NeverDumbMode = "serious" | "fun" | "reset";

type ExerciseCopy = {
  title: string;
  kicker: string;
  instruction: string;
  detail: string;
  result: string;
};

export type NeverDumbCopy = {
  shared: {
    skip: string;
    back: string;
    start: string;
    done: string;
    finishEarly: string;
    breakRemaining: string;
    privacy: string;
    answer: string;
    confidence: string;
    reveal: string;
    compare: string;
    nextRandom: string;
    chooseAnother: string;
    source: string;
    invariant: string;
    openQuestion: string;
    recall: string;
    resultTitle: string;
    resultBody: string;
    safeNote: string;
    minuteShort: string;
    settingsAutoOpen: string;
    audioUnavailable: string;
  };
  intro: { eyebrow: string; title: string; body: string; run: string; articleLink: string };
  mode: {
    eyebrow: string;
    title: string;
    body: string;
    serious: string;
    seriousDetail: string;
    fun: string;
    funDetail: string;
    reset: string;
    resetDetail: string;
  };
  seriousMenu: { title: string; body: string };
  resetMenu: { title: string; body: string };
  exercises: Record<ExerciseId, ExerciseCopy>;
  humanMissions: readonly string[];
  roomItems: readonly string[];
  bodyCommands: readonly string[];
  duckQuestions: readonly string[];
  scanRegions: readonly string[];
  meditationCues: readonly string[];
  breatheIn: string;
  breatheOut: string;
  breatheReady: string;
  walking: string;
  musicPlaying: string;
  pingPongCue: string;
};

export const NEVER_DUMB_COPY = {
  en: {
    shared: {
      skip: "Skip — take the break",
      back: "Back",
      start: "Start",
      done: "Done",
      finishEarly: "Finish now",
      breakRemaining: "Break remaining",
      privacy: "Local only. Nothing you type is saved or sent.",
      answer: "Your answer",
      confidence: "Confidence",
      reveal: "Reveal",
      compare: "Compare my answer",
      nextRandom: "Another random game",
      chooseAnother: "Choose another",
      source: "Source",
      invariant: "The invariant",
      openQuestion: "The open question",
      recall: "What do you remember?",
      resultTitle: "Autopilot interrupted.",
      resultBody: "No brain score. You made one move the machine did not choose for you.",
      safeNote: "Stop if you feel uncomfortable. Walk only where it is safe.",
      minuteShort: "min",
      settingsAutoOpen: "Auto-open Never Dumb on long breaks",
      audioUnavailable: "Audio could not start. You can still take three quiet minutes.",
    },
    intro: {
      eyebrow: "Human runtime",
      title: "Never dump your brain.",
      body: "AI can finish the sentence. It does not get to finish the thought. Use a few minutes of this break to come back online.",
      run: "Run Never Dumb",
      articleLink: "The science behind Never Dumb",
    },
    mode: {
      eyebrow: "Anti-autopilot protocol",
      title: "What do you need?",
      body: "Think, play, or reset your state. The long-break timer keeps running.",
      serious: "Serious",
      seriousDetail: "Rebuild reasoning, catch a flaw, or compress the noise.",
      fun: "Fun",
      funDetail: "One of four surprise games. Less impact, more movement.",
      reset: "Reset",
      resetDetail: "Breathe, scan, walk, listen, or move without a feed.",
    },
    seriousMenu: { title: "Choose your resistance.", body: "Do the work before reading the reveal." },
    resetMenu: { title: "Choose the reset your context allows.", body: "No optimization. Pick one and leave the feed." },
    exercises: {
      rebuild: { title: "Rebuild", kicker: "Recover the decisions", instruction: "Without reopening the AI chat, reconstruct the three decisions you made in the last focus block.", detail: "Name the decision, the reason, and what would make you reverse it.", result: "If you can rebuild the reasoning, the answer is still yours." },
      breakAnswer: { title: "Break the Answer", kicker: "Find the hidden failure", instruction: "This helper claims to return active users. Find the logic error before reading the reveal.", detail: "Explain the failure mode in one precise sentence.", result: "The code maps every user to a boolean. It does not filter the inactive users out." },
      compress: { title: "Compress", kicker: "Keep the model, lose the prose", instruction: "Compress the source into one invariant and one unresolved question.", detail: "Use no more than 25 words in total.", result: "A useful summary preserves the constraint and the uncertainty, not the smooth wording." },
      humanCaptcha: { title: "Human CAPTCHA", kicker: "Prove you are not autocomplete", instruction: "Do the ridiculous physical mission below.", detail: "No camera, microphone, or score. Honor system: extremely human technology.", result: "A model could describe it. It could not enjoy how stupid it felt." },
      roomRaid: { title: "Room Raid", kicker: "Move + notice", instruction: "Leave the desk and find the three things below. No photos.", detail: "Come back and recall them without looking again.", result: "You changed distance, moved, noticed, and recalled without a device." },
      bodyDebugger: { title: "Body Debugger", kicker: "Move + inhibit", instruction: "Follow every command except anything prefixed with ‘AI SAYS’.", detail: "Stand up. Four commands, one trap, a little dignity loss.", result: "If you obeyed the AI command, congratulations: the metaphor works." },
      duckBoss: { title: "Rubber Duck Boss", kicker: "Explain out loud", instruction: "Answer each question out loud before hitting the boss.", detail: "Typing is optional. The duck wants clarity, not tokens.", result: "You explained before asking a machine to explain for you." },
      breathing: { title: "Breathing 5–5", kicker: "Downshift", instruction: "Breathe in for five seconds, then out for five seconds.", detail: "Three minutes. Keep it comfortable; never force the breath.", result: "You changed pace before asking your attention to work again." },
      meditation: { title: "Open Meditation", kicker: "Do less", instruction: "Sit comfortably. Notice sounds, sensations, and thoughts without fixing them.", detail: "Three minutes with sparse cues and no performance target.", result: "Nothing to solve. That was the point." },
      bodyScan: { title: "Body Scan", kicker: "Return to the body", instruction: "Move your attention through each body area without trying to change it.", detail: "Three minutes. Soften what can soften.", result: "Your attention visited somewhere that was not a screen." },
      walk: { title: "Five-minute Walk", kicker: "Change the scene", instruction: "Leave the screen and walk somewhere safe for five minutes.", detail: "No phone, no podcast, no productivity objective.", result: "A small change of place can mark a real change of state." },
      music: { title: "One-track Reset", kicker: "Listen without a feed", instruction: "Play three minutes of the local lofi track and do nothing else.", detail: "Other Pomodorian ambiences pause and resume when you leave.", result: "You listened instead of filling the pause with more input." },
      pingPong: { title: "Invisible Ping Pong", kicker: "Cross the midline", instruction: "Stand up and mime returning the ball from left to right.", detail: "Follow the cue for sixty seconds. No paddle required.", result: "Still capable of play. Still a mobile mammal." },
    },
    humanMissions: ["Touch three textures and rename the strangest one.", "Balance on one foot and name five impossible food pairings.", "Move one object somewhere your future self will not predict.", "Make a sound that would be embarrassing to describe in a prompt."],
    roomItems: ["Something blue", "Something circular", "Something older than you"],
    bodyCommands: ["LEFT HAND → RIGHT KNEE", "CLAP TWICE", "AI SAYS: SPIN", "STEP BACK", "FREEZE"],
    duckQuestions: ["WHAT DOES YOUR CODE ACTUALLY DO?", "WHAT BREAKS FIRST?", "WHY NOT DELETE HALF OF IT?"],
    scanRegions: ["Feet", "Legs", "Belly", "Chest", "Hands", "Shoulders", "Jaw", "Eyes", "Whole body"],
    meditationCues: ["Notice the nearest sound.", "Notice contact with the chair or floor.", "Let the next thought pass without following it.", "Widen attention to the whole room."],
    breatheIn: "Breathe in",
    breatheOut: "Breathe out",
    breatheReady: "Settle",
    walking: "Leave the screen. The break keeps running.",
    musicPlaying: "Lofi playing",
    pingPongCue: "Return the ball",
  },
  fr: {
    shared: { skip: "Passer — prends ta pause", back: "Retour", start: "Commencer", done: "Terminé", finishEarly: "Terminer maintenant", breakRemaining: "Pause restante", privacy: "Local uniquement. Rien de ce que tu écris n’est sauvegardé ni envoyé.", answer: "Ta réponse", confidence: "Confiance", reveal: "Révéler", compare: "Comparer ma réponse", nextRandom: "Un autre jeu aléatoire", chooseAnother: "Choisir autre chose", source: "Source", invariant: "L’invariant", openQuestion: "La question ouverte", recall: "De quoi te souviens-tu ?", resultTitle: "Pilote automatique interrompu.", resultBody: "Aucun score cérébral. Tu as fait un geste que la machine n’a pas choisi pour toi.", safeNote: "Arrête en cas d’inconfort. Marche uniquement dans un endroit sûr.", minuteShort: "min", settingsAutoOpen: "Ouvrir automatiquement Never Dumb pendant les pauses longues", audioUnavailable: "L’audio n’a pas pu démarrer. Tu peux quand même prendre trois minutes de calme." },
    intro: { eyebrow: "Runtime humain", title: "Ne vide jamais ton cerveau.", body: "L’IA peut finir la phrase. Elle ne doit pas finir la pensée. Profite de quelques minutes de cette pause pour revenir en ligne.", run: "Lancer Never Dumb", articleLink: "La science derrière Never Dumb" },
    mode: { eyebrow: "Protocole anti-pilote automatique", title: "De quoi as-tu besoin ?", body: "Réfléchis, joue ou change d’état. Le minuteur de la pause continue.", serious: "Sérieux", seriousDetail: "Reconstruis un raisonnement, trouve une faille ou compresse le bruit.", fun: "Fun", funDetail: "Un des quatre jeux surprise. Moins d’impact, plus de mouvement.", reset: "Reset", resetDetail: "Respire, scanne, marche, écoute ou bouge sans feed." },
    seriousMenu: { title: "Choisis ta résistance.", body: "Fais l’effort avant de lire la révélation." },
    resetMenu: { title: "Choisis le reset que ton contexte permet.", body: "Pas d’optimisation. Choisis-en un et quitte le feed." },
    exercises: {
      rebuild: { title: "Rebuild", kicker: "Récupère les décisions", instruction: "Sans rouvrir le chat IA, reconstruis les trois décisions prises pendant le dernier bloc de focus.", detail: "Nomme la décision, la raison et ce qui te ferait changer d’avis.", result: "Si tu peux reconstruire le raisonnement, la réponse t’appartient encore." },
      breakAnswer: { title: "Break the Answer", kicker: "Trouve l’échec caché", instruction: "Cette fonction prétend renvoyer les utilisateurs actifs. Trouve l’erreur logique avant la révélation.", detail: "Explique le mode d’échec en une phrase précise.", result: "Le code transforme chaque utilisateur en booléen. Il ne filtre pas les inactifs." },
      compress: { title: "Compress", kicker: "Garde le modèle, perds la prose", instruction: "Compresse la source en un invariant et une question non résolue.", detail: "25 mots maximum au total.", result: "Un bon résumé conserve la contrainte et l’incertitude, pas la formulation lisse." },
      humanCaptcha: { title: "CAPTCHA humain", kicker: "Prouve que tu n’es pas un autocomplete", instruction: "Réalise la mission physique ridicule ci-dessous.", detail: "Ni caméra, ni micro, ni score. Système d’honneur : technologie très humaine.", result: "Un modèle pourrait le décrire. Il ne pourrait pas apprécier le ridicule." },
      roomRaid: { title: "Room Raid", kicker: "Bouge + remarque", instruction: "Quitte le bureau et trouve les trois choses ci-dessous. Sans photo.", detail: "Reviens et rappelle-les sans regarder de nouveau.", result: "Tu as changé de distance, bougé, remarqué et rappelé sans appareil." },
      bodyDebugger: { title: "Body Debugger", kicker: "Bouge + inhibe", instruction: "Suis chaque commande sauf celles qui commencent par « AI SAYS ».", detail: "Lève-toi. Quatre commandes, un piège, un peu de dignité perdue.", result: "Si tu as obéi à la commande IA, félicitations : la métaphore fonctionne." },
      duckBoss: { title: "Boss Canard", kicker: "Explique à voix haute", instruction: "Réponds à chaque question à voix haute avant de frapper le boss.", detail: "Écrire est facultatif. Le canard veut de la clarté, pas des tokens.", result: "Tu as expliqué avant de demander à une machine de le faire." },
      breathing: { title: "Respiration 5–5", kicker: "Ralentis", instruction: "Inspire cinq secondes, puis expire cinq secondes.", detail: "Trois minutes. Reste confortable et ne force jamais.", result: "Tu as changé de rythme avant de redemander du travail à ton attention." },
      meditation: { title: "Méditation ouverte", kicker: "Fais moins", instruction: "Assieds-toi confortablement. Remarque sons, sensations et pensées sans les corriger.", detail: "Trois minutes, quelques indications, aucun objectif de performance.", result: "Rien à résoudre. C’était le but." },
      bodyScan: { title: "Scan corporel", kicker: "Reviens au corps", instruction: "Déplace ton attention dans chaque zone sans chercher à la modifier.", detail: "Trois minutes. Relâche ce qui peut l’être.", result: "Ton attention a visité un endroit qui n’était pas un écran." },
      walk: { title: "Marche de cinq minutes", kicker: "Change de décor", instruction: "Quitte l’écran et marche cinq minutes dans un endroit sûr.", detail: "Sans téléphone, podcast ni objectif de productivité.", result: "Un petit changement de lieu peut marquer un vrai changement d’état." },
      music: { title: "Reset musical", kicker: "Écoute sans feed", instruction: "Lance trois minutes de lofi local et ne fais rien d’autre.", detail: "Les autres ambiances Pomodorian se mettent en pause puis reprennent à la sortie.", result: "Tu as écouté au lieu de remplir la pause avec davantage d’entrées." },
      pingPong: { title: "Ping-pong invisible", kicker: "Traverse l’axe", instruction: "Lève-toi et mime le renvoi de la balle de gauche à droite.", detail: "Suis le signal pendant soixante secondes. Raquette non requise.", result: "Toujours capable de jouer. Toujours un mammifère mobile." },
    },
    humanMissions: ["Touche trois textures et renomme la plus étrange.", "Tiens sur un pied et cite cinq associations alimentaires impossibles.", "Déplace un objet là où ton futur toi ne le prédira pas.", "Fais un son embarrassant à décrire dans un prompt."],
    roomItems: ["Quelque chose de bleu", "Quelque chose de circulaire", "Quelque chose de plus vieux que toi"],
    bodyCommands: ["MAIN GAUCHE → GENOU DROIT", "FRAPPE DEUX FOIS DANS TES MAINS", "AI SAYS : TOURNE", "UN PAS EN ARRIÈRE", "IMMOBILE"],
    duckQuestions: ["QUE FAIT RÉELLEMENT TON CODE ?", "QU’EST-CE QUI CASSE EN PREMIER ?", "POURQUOI NE PAS EN SUPPRIMER LA MOITIÉ ?"],
    scanRegions: ["Pieds", "Jambes", "Ventre", "Poitrine", "Mains", "Épaules", "Mâchoire", "Yeux", "Corps entier"],
    meditationCues: ["Remarque le son le plus proche.", "Sens le contact avec la chaise ou le sol.", "Laisse passer la prochaine pensée sans la suivre.", "Élargis ton attention à toute la pièce."],
    breatheIn: "Inspire", breatheOut: "Expire", breatheReady: "Pose-toi", walking: "Quitte l’écran. La pause continue.", musicPlaying: "Lofi en cours", pingPongCue: "Renvoie la balle",
  },
  es: {
    shared: { skip: "Saltar — toma el descanso", back: "Volver", start: "Empezar", done: "Terminado", finishEarly: "Terminar ahora", breakRemaining: "Descanso restante", privacy: "Solo local. Nada de lo que escribas se guarda ni se envía.", answer: "Tu respuesta", confidence: "Confianza", reveal: "Mostrar", compare: "Comparar mi respuesta", nextRandom: "Otro juego aleatorio", chooseAnother: "Elegir otro", source: "Fuente", invariant: "La regla invariable", openQuestion: "La pregunta abierta", recall: "¿Qué recuerdas?", resultTitle: "Piloto automático interrumpido.", resultBody: "Sin puntuación cerebral. Hiciste algo que la máquina no eligió por ti.", safeNote: "Detente si sientes molestias. Camina solo en un lugar seguro.", minuteShort: "min", settingsAutoOpen: "Abrir Never Dumb automáticamente en descansos largos", audioUnavailable: "El audio no pudo iniciarse. Aún puedes tomar tres minutos de calma." },
    intro: { eyebrow: "Runtime humano", title: "Nunca vacíes tu cerebro.", body: "La IA puede terminar la frase. No debe terminar el pensamiento. Usa unos minutos de esta pausa para volver.", run: "Iniciar Never Dumb", articleLink: "La ciencia detrás de Never Dumb" },
    mode: { eyebrow: "Protocolo antipiloto automático", title: "¿Qué necesitas?", body: "Piensa, juega o cambia de estado. El temporizador sigue corriendo.", serious: "Serio", seriousDetail: "Reconstruye el razonamiento, detecta un fallo o comprime el ruido.", fun: "Diversión", funDetail: "Uno de cuatro juegos sorpresa. Menos impacto, más movimiento.", reset: "Reset", resetDetail: "Respira, escanea, camina, escucha o muévete sin feed." },
    seriousMenu: { title: "Elige tu resistencia.", body: "Haz el trabajo antes de ver la respuesta." },
    resetMenu: { title: "Elige el reset que permita tu contexto.", body: "Sin optimizar. Elige uno y sal del feed." },
    exercises: {
      rebuild: { title: "Reconstruir", kicker: "Recupera las decisiones", instruction: "Sin reabrir el chat de IA, reconstruye tres decisiones del último bloque de concentración.", detail: "Nombra la decisión, el motivo y qué te haría cambiarla.", result: "Si puedes reconstruir el razonamiento, la respuesta sigue siendo tuya." },
      breakAnswer: { title: "Romper la respuesta", kicker: "Encuentra el fallo oculto", instruction: "Esta función dice devolver usuarios activos. Encuentra el error lógico.", detail: "Explica el fallo en una frase precisa.", result: "El código convierte cada usuario en booleano; no elimina los inactivos." },
      compress: { title: "Comprimir", kicker: "Conserva el modelo, pierde la prosa", instruction: "Reduce la fuente a una regla invariable y una pregunta abierta.", detail: "Máximo 25 palabras.", result: "Un buen resumen conserva la restricción y la incertidumbre." },
      humanCaptcha: { title: "CAPTCHA humano", kicker: "Demuestra que no eres autocompletar", instruction: "Haz la misión física ridícula de abajo.", detail: "Sin cámara, micrófono ni puntuación.", result: "Un modelo podría describirlo, pero no disfrutar del ridículo." },
      roomRaid: { title: "Incursión en la habitación", kicker: "Muévete + observa", instruction: "Deja el escritorio y encuentra estas tres cosas. Sin fotos.", detail: "Vuelve y recuérdalas sin mirar otra vez.", result: "Cambiaste de distancia, te moviste y recordaste sin dispositivo." },
      bodyDebugger: { title: "Depurador corporal", kicker: "Muévete + inhibe", instruction: "Sigue todas las órdenes salvo las que empiecen por «AI SAYS».", detail: "Ponte de pie. Cuatro órdenes y una trampa.", result: "Si obedeciste a la IA, la metáfora funciona." },
      duckBoss: { title: "Jefe Pato", kicker: "Explícalo en voz alta", instruction: "Responde en voz alta antes de golpear al jefe.", detail: "Escribir es opcional. El pato quiere claridad.", result: "Explicaste antes de pedir a una máquina que lo hiciera." },
      breathing: { title: "Respiración 5–5", kicker: "Baja el ritmo", instruction: "Inhala cinco segundos y exhala cinco segundos.", detail: "Tres minutos, sin forzar.", result: "Cambiaste el ritmo antes de volver a exigir atención." },
      meditation: { title: "Meditación abierta", kicker: "Haz menos", instruction: "Observa sonidos, sensaciones y pensamientos sin corregirlos.", detail: "Tres minutos, sin objetivo de rendimiento.", result: "Nada que resolver. Ese era el propósito." },
      bodyScan: { title: "Escaneo corporal", kicker: "Vuelve al cuerpo", instruction: "Recorre cada zona con atención sin intentar cambiarla.", detail: "Tres minutos. Suelta lo que puedas.", result: "Tu atención visitó un lugar que no era una pantalla." },
      walk: { title: "Caminata de cinco minutos", kicker: "Cambia de escenario", instruction: "Aléjate de la pantalla y camina cinco minutos en un lugar seguro.", detail: "Sin móvil, podcast ni meta productiva.", result: "Cambiar de lugar puede marcar un cambio de estado." },
      music: { title: "Reset musical", kicker: "Escucha sin feed", instruction: "Escucha tres minutos del lofi local sin hacer nada más.", detail: "Los demás ambientes se pausan y luego continúan.", result: "Escuchaste sin llenar la pausa con más entradas." },
      pingPong: { title: "Ping-pong invisible", kicker: "Cruza la línea media", instruction: "Ponte de pie e imita golpes de izquierda a derecha.", detail: "Sigue la señal sesenta segundos.", result: "Aún puedes jugar. Aún eres un mamífero móvil." },
    },
    humanMissions: ["Toca tres texturas y pon nombre a la más extraña.", "Mantente sobre un pie y nombra cinco combinaciones imposibles de comida.", "Mueve un objeto a un lugar impredecible.", "Haz un sonido vergonzoso de describir en un prompt."],
    roomItems: ["Algo azul", "Algo circular", "Algo más viejo que tú"],
    bodyCommands: ["MANO IZQUIERDA → RODILLA DERECHA", "APLAUDE DOS VECES", "AI SAYS: GIRA", "PASO ATRÁS", "QUIETO"],
    duckQuestions: ["¿QUÉ HACE REALMENTE TU CÓDIGO?", "¿QUÉ SE ROMPE PRIMERO?", "¿POR QUÉ NO BORRAR LA MITAD?"],
    scanRegions: ["Pies", "Piernas", "Vientre", "Pecho", "Manos", "Hombros", "Mandíbula", "Ojos", "Todo el cuerpo"],
    meditationCues: ["Nota el sonido más cercano.", "Nota el contacto con la silla o el suelo.", "Deja pasar el siguiente pensamiento.", "Amplía la atención a toda la habitación."],
    breatheIn: "Inhala", breatheOut: "Exhala", breatheReady: "Prepárate", walking: "Deja la pantalla. El descanso continúa.", musicPlaying: "Lofi sonando", pingPongCue: "Devuelve la pelota",
  },
  de: {
    shared: { skip: "Überspringen — Pause machen", back: "Zurück", start: "Starten", done: "Fertig", finishEarly: "Jetzt beenden", breakRemaining: "Verbleibende Pause", privacy: "Nur lokal. Nichts wird gespeichert oder gesendet.", answer: "Deine Antwort", confidence: "Sicherheit", reveal: "Auflösung", compare: "Antwort vergleichen", nextRandom: "Noch ein Zufallsspiel", chooseAnother: "Etwas anderes wählen", source: "Quelle", invariant: "Die unveränderliche Regel", openQuestion: "Die offene Frage", recall: "Woran erinnerst du dich?", resultTitle: "Autopilot unterbrochen.", resultBody: "Kein Gehirn-Score. Du hast etwas getan, das die Maschine nicht gewählt hat.", safeNote: "Bei Unwohlsein aufhören. Nur an einem sicheren Ort gehen.", minuteShort: "Min.", settingsAutoOpen: "Never Dumb bei langen Pausen automatisch öffnen", audioUnavailable: "Audio konnte nicht starten. Drei ruhige Minuten sind trotzdem möglich." },
    intro: { eyebrow: "Menschliche Laufzeit", title: "Lagere dein Gehirn nie aus.", body: "KI kann den Satz beenden. Sie darf nicht den Gedanken beenden. Komm in dieser Pause wieder selbst online.", run: "Never Dumb starten", articleLink: "Die Wissenschaft hinter Never Dumb" },
    mode: { eyebrow: "Anti-Autopilot-Protokoll", title: "Was brauchst du?", body: "Denken, spielen oder den Zustand wechseln. Die Pause läuft weiter.", serious: "Ernst", seriousDetail: "Denken rekonstruieren, Fehler finden oder Rauschen komprimieren.", fun: "Spaß", funDetail: "Eines von vier Überraschungsspielen. Mehr Bewegung.", reset: "Reset", resetDetail: "Atmen, scannen, gehen, hören oder bewegen — ohne Feed." },
    seriousMenu: { title: "Wähle deinen Widerstand.", body: "Arbeite, bevor du die Auflösung liest." },
    resetMenu: { title: "Wähle den Reset, den dein Umfeld erlaubt.", body: "Nicht optimieren. Wählen und den Feed verlassen." },
    exercises: {
      rebuild: { title: "Rebuild", kicker: "Entscheidungen zurückholen", instruction: "Rekonstruiere ohne KI-Chat drei Entscheidungen aus dem letzten Fokusblock.", detail: "Entscheidung, Grund und Bedingung für eine Umkehr.", result: "Kannst du die Begründung rekonstruieren, gehört die Antwort noch dir." },
      breakAnswer: { title: "Antwort brechen", kicker: "Versteckten Fehler finden", instruction: "Diese Funktion soll aktive Nutzer liefern. Finde den Logikfehler.", detail: "Beschreibe den Fehler in einem präzisen Satz.", result: "Der Code bildet Nutzer auf Wahrheitswerte ab, statt inaktive zu filtern." },
      compress: { title: "Komprimieren", kicker: "Modell behalten, Prosa verlieren", instruction: "Verdichte die Quelle auf eine Regel und eine offene Frage.", detail: "Höchstens 25 Wörter.", result: "Eine gute Zusammenfassung bewahrt Grenze und Unsicherheit." },
      humanCaptcha: { title: "Mensch-CAPTCHA", kicker: "Beweise, dass du kein Autocomplete bist", instruction: "Erledige die alberne körperliche Mission.", detail: "Keine Kamera, kein Mikrofon, kein Score.", result: "Ein Modell könnte es beschreiben, aber nicht den Unsinn genießen." },
      roomRaid: { title: "Raum-Raid", kicker: "Bewegen + bemerken", instruction: "Verlasse den Tisch und finde drei Dinge. Keine Fotos.", detail: "Komm zurück und erinnere dich ohne Nachsehen.", result: "Du hast Distanz gewechselt, dich bewegt und ohne Gerät erinnert." },
      bodyDebugger: { title: "Körper-Debugger", kicker: "Bewegen + hemmen", instruction: "Befolge alles außer Befehle mit „AI SAYS“.", detail: "Aufstehen. Vier Befehle, eine Falle.", result: "Wenn du der KI gehorcht hast, funktioniert die Metapher." },
      duckBoss: { title: "Enten-Boss", kicker: "Laut erklären", instruction: "Beantworte jede Frage laut, bevor du angreifst.", detail: "Tippen ist optional. Die Ente will Klarheit.", result: "Du hast erklärt, bevor du die Maschine gefragt hast." },
      breathing: { title: "Atmung 5–5", kicker: "Herunterschalten", instruction: "Fünf Sekunden ein-, fünf Sekunden ausatmen.", detail: "Drei Minuten, bequem und ohne Zwang.", result: "Du hast das Tempo geändert, bevor du wieder Fokus verlangst." },
      meditation: { title: "Offene Meditation", kicker: "Weniger tun", instruction: "Geräusche, Empfindungen und Gedanken bemerken, ohne sie zu lösen.", detail: "Drei Minuten ohne Leistungsziel.", result: "Nichts zu lösen. Genau darum ging es." },
      bodyScan: { title: "Körperscan", kicker: "Zum Körper zurück", instruction: "Aufmerksamkeit durch jede Körperzone bewegen, ohne sie zu verändern.", detail: "Drei Minuten. Lockern, was sich lockern lässt.", result: "Deine Aufmerksamkeit war an einem Ort ohne Bildschirm." },
      walk: { title: "Fünf Minuten gehen", kicker: "Szene wechseln", instruction: "Bildschirm verlassen und fünf Minuten sicher gehen.", detail: "Ohne Handy, Podcast oder Produktivitätsziel.", result: "Ein Ortswechsel kann einen Zustandswechsel markieren." },
      music: { title: "Musik-Reset", kicker: "Ohne Feed hören", instruction: "Drei Minuten lokalen Lofi hören und sonst nichts tun.", detail: "Andere Klänge pausieren und werden danach fortgesetzt.", result: "Du hast gehört, ohne die Pause mit Input zu füllen." },
      pingPong: { title: "Unsichtbares Pingpong", kicker: "Körpermitte kreuzen", instruction: "Aufstehen und Schläge von links nach rechts nachahmen.", detail: "Der Anzeige sechzig Sekunden folgen.", result: "Noch spielfähig. Noch ein bewegliches Säugetier." },
    },
    humanMissions: ["Drei Oberflächen berühren und die seltsamste neu benennen.", "Auf einem Bein stehen und fünf unmögliche Essenskombinationen nennen.", "Einen Gegenstand unvorhersehbar umstellen.", "Ein Geräusch machen, das peinlich in einem Prompt wäre."],
    roomItems: ["Etwas Blaues", "Etwas Rundes", "Etwas, das älter ist als du"],
    bodyCommands: ["LINKE HAND → RECHTES KNIE", "ZWEIMAL KLATSCHEN", "AI SAYS: DREHEN", "SCHRITT ZURÜCK", "EINFRIEREN"],
    duckQuestions: ["WAS TUT DEIN CODE WIRKLICH?", "WAS BRICHT ZUERST?", "WARUM NICHT DIE HÄLFTE LÖSCHEN?"],
    scanRegions: ["Füße", "Beine", "Bauch", "Brust", "Hände", "Schultern", "Kiefer", "Augen", "Ganzer Körper"],
    meditationCues: ["Das nächste Geräusch bemerken.", "Kontakt zu Stuhl oder Boden spüren.", "Den nächsten Gedanken vorbeiziehen lassen.", "Aufmerksamkeit auf den ganzen Raum weiten."],
    breatheIn: "Einatmen", breatheOut: "Ausatmen", breatheReady: "Ankommen", walking: "Bildschirm verlassen. Die Pause läuft weiter.", musicPlaying: "Lofi läuft", pingPongCue: "Ball zurückspielen",
  },
  pt: {
    shared: { skip: "Pular — aproveite a pausa", back: "Voltar", start: "Começar", done: "Concluído", finishEarly: "Terminar agora", breakRemaining: "Pausa restante", privacy: "Somente local. Nada é salvo ou enviado.", answer: "Sua resposta", confidence: "Confiança", reveal: "Revelar", compare: "Comparar resposta", nextRandom: "Outro jogo aleatório", chooseAnother: "Escolher outro", source: "Fonte", invariant: "A regra invariável", openQuestion: "A pergunta em aberto", recall: "Do que você se lembra?", resultTitle: "Piloto automático interrompido.", resultBody: "Sem pontuação cerebral. Você fez algo que a máquina não escolheu.", safeNote: "Pare se sentir desconforto. Caminhe somente em local seguro.", minuteShort: "min", settingsAutoOpen: "Abrir Never Dumb automaticamente nas pausas longas", audioUnavailable: "O áudio não pôde iniciar. Você ainda pode fazer três minutos de silêncio." },
    intro: { eyebrow: "Runtime humano", title: "Nunca terceirize seu cérebro.", body: "A IA pode terminar a frase. Não pode terminar o pensamento. Use alguns minutos da pausa para voltar.", run: "Iniciar Never Dumb", articleLink: "A ciência por trás do Never Dumb" },
    mode: { eyebrow: "Protocolo antipiloto automático", title: "Do que você precisa?", body: "Pense, brinque ou mude de estado. O cronômetro continua.", serious: "Sério", seriousDetail: "Reconstrua o raciocínio, encontre uma falha ou comprima o ruído.", fun: "Diversão", funDetail: "Um de quatro jogos surpresa. Mais movimento.", reset: "Reset", resetDetail: "Respire, escaneie, caminhe, ouça ou se mova sem feed." },
    seriousMenu: { title: "Escolha sua resistência.", body: "Faça o esforço antes de ver a resposta." },
    resetMenu: { title: "Escolha o reset que seu contexto permite.", body: "Sem otimizar. Escolha e saia do feed." },
    exercises: {
      rebuild: { title: "Reconstruir", kicker: "Recupere as decisões", instruction: "Sem reabrir a IA, reconstrua três decisões do último bloco de foco.", detail: "Decisão, motivo e o que faria você mudá-la.", result: "Se você reconstrói o raciocínio, a resposta ainda é sua." },
      breakAnswer: { title: "Quebrar a resposta", kicker: "Encontre a falha", instruction: "A função diz retornar usuários ativos. Encontre o erro lógico.", detail: "Explique a falha em uma frase precisa.", result: "O código transforma usuários em booleanos; não filtra os inativos." },
      compress: { title: "Comprimir", kicker: "Mantenha o modelo, perca a prosa", instruction: "Reduza a fonte a uma regra e uma pergunta em aberto.", detail: "No máximo 25 palavras.", result: "Um bom resumo preserva limite e incerteza." },
      humanCaptcha: { title: "CAPTCHA humano", kicker: "Prove que não é autocompletar", instruction: "Faça a missão física ridícula abaixo.", detail: "Sem câmera, microfone ou pontuação.", result: "Um modelo poderia descrever, mas não curtir o absurdo." },
      roomRaid: { title: "Ataque ao ambiente", kicker: "Mova + observe", instruction: "Saia da mesa e encontre três coisas. Sem fotos.", detail: "Volte e lembre sem olhar novamente.", result: "Você mudou a distância, se moveu e lembrou sem dispositivo." },
      bodyDebugger: { title: "Depurador corporal", kicker: "Mova + iniba", instruction: "Siga tudo, menos comandos iniciados por “AI SAYS”.", detail: "Levante. Quatro comandos e uma armadilha.", result: "Se obedeceu à IA, a metáfora funciona." },
      duckBoss: { title: "Chefe Pato", kicker: "Explique em voz alta", instruction: "Responda em voz alta antes de atacar.", detail: "Digitar é opcional. O pato quer clareza.", result: "Você explicou antes de pedir à máquina." },
      breathing: { title: "Respiração 5–5", kicker: "Desacelere", instruction: "Inspire por cinco segundos e expire por cinco.", detail: "Três minutos, sem forçar.", result: "Você mudou o ritmo antes de exigir foco novamente." },
      meditation: { title: "Meditação aberta", kicker: "Faça menos", instruction: "Perceba sons, sensações e pensamentos sem corrigi-los.", detail: "Três minutos sem meta de desempenho.", result: "Nada para resolver. Esse era o ponto." },
      bodyScan: { title: "Escaneamento corporal", kicker: "Volte ao corpo", instruction: "Passe a atenção por cada área sem tentar mudá-la.", detail: "Três minutos. Relaxe o que puder.", result: "Sua atenção visitou um lugar sem tela." },
      walk: { title: "Caminhada de cinco minutos", kicker: "Mude o cenário", instruction: "Saia da tela e caminhe cinco minutos em segurança.", detail: "Sem celular, podcast ou meta produtiva.", result: "Mudar de lugar pode marcar uma mudança de estado." },
      music: { title: "Reset musical", kicker: "Ouça sem feed", instruction: "Ouça três minutos de lofi local e não faça mais nada.", detail: "Outros sons pausam e depois retornam.", result: "Você ouviu sem preencher a pausa com mais entradas." },
      pingPong: { title: "Pingue-pongue invisível", kicker: "Cruze a linha média", instruction: "Levante e imite rebatidas da esquerda para a direita.", detail: "Siga o sinal por sessenta segundos.", result: "Ainda brincando. Ainda um mamífero móvel." },
    },
    humanMissions: ["Toque três texturas e renomeie a mais estranha.", "Fique em um pé e cite cinco combinações impossíveis de comida.", "Mova um objeto para um lugar imprevisível.", "Faça um som constrangedor de descrever em um prompt."],
    roomItems: ["Algo azul", "Algo circular", "Algo mais velho que você"],
    bodyCommands: ["MÃO ESQUERDA → JOELHO DIREITO", "BATA PALMAS DUAS VEZES", "AI SAYS: GIRE", "PASSO PARA TRÁS", "CONGELE"],
    duckQuestions: ["O QUE SEU CÓDIGO REALMENTE FAZ?", "O QUE QUEBRA PRIMEIRO?", "POR QUE NÃO APAGAR METADE?"],
    scanRegions: ["Pés", "Pernas", "Barriga", "Peito", "Mãos", "Ombros", "Mandíbula", "Olhos", "Corpo inteiro"],
    meditationCues: ["Perceba o som mais próximo.", "Sinta o contato com a cadeira ou o chão.", "Deixe o próximo pensamento passar.", "Amplie a atenção para o ambiente."],
    breatheIn: "Inspire", breatheOut: "Expire", breatheReady: "Acomode-se", walking: "Saia da tela. A pausa continua.", musicPlaying: "Lofi tocando", pingPongCue: "Rebata a bola",
  },
  it: {
    shared: { skip: "Salta — fai la pausa", back: "Indietro", start: "Inizia", done: "Fatto", finishEarly: "Termina ora", breakRemaining: "Pausa rimanente", privacy: "Solo locale. Nulla viene salvato o inviato.", answer: "La tua risposta", confidence: "Sicurezza", reveal: "Mostra", compare: "Confronta risposta", nextRandom: "Altro gioco casuale", chooseAnother: "Scegli altro", source: "Fonte", invariant: "La regola invariabile", openQuestion: "La domanda aperta", recall: "Cosa ricordi?", resultTitle: "Pilota automatico interrotto.", resultBody: "Nessun punteggio cerebrale. Hai fatto qualcosa non scelto dalla macchina.", safeNote: "Fermati se provi disagio. Cammina solo in un luogo sicuro.", minuteShort: "min", settingsAutoOpen: "Apri automaticamente Never Dumb nelle pause lunghe", audioUnavailable: "L’audio non è partito. Puoi comunque prenderti tre minuti di quiete." },
    intro: { eyebrow: "Runtime umano", title: "Non svuotare mai il cervello.", body: "L’IA può finire la frase. Non deve finire il pensiero. Usa qualche minuto della pausa per tornare presente.", run: "Avvia Never Dumb", articleLink: "La scienza dietro Never Dumb" },
    mode: { eyebrow: "Protocollo anti-pilota automatico", title: "Di cosa hai bisogno?", body: "Pensa, gioca o cambia stato. Il timer continua.", serious: "Serio", seriousDetail: "Ricostruisci il ragionamento, trova un errore o comprimi il rumore.", fun: "Divertimento", funDetail: "Uno dei quattro giochi a sorpresa. Più movimento.", reset: "Reset", resetDetail: "Respira, scansiona, cammina, ascolta o muoviti senza feed." },
    seriousMenu: { title: "Scegli la tua resistenza.", body: "Fai il lavoro prima di leggere la soluzione." },
    resetMenu: { title: "Scegli il reset permesso dal contesto.", body: "Niente ottimizzazione. Scegli e lascia il feed." },
    exercises: {
      rebuild: { title: "Ricostruisci", kicker: "Recupera le decisioni", instruction: "Senza riaprire l’IA, ricostruisci tre decisioni dell’ultimo blocco.", detail: "Decisione, motivo e cosa ti farebbe cambiare.", result: "Se ricostruisci il ragionamento, la risposta è ancora tua." },
      breakAnswer: { title: "Rompi la risposta", kicker: "Trova l’errore nascosto", instruction: "La funzione dice di restituire utenti attivi. Trova l’errore logico.", detail: "Spiega il guasto in una frase precisa.", result: "Il codice trasforma gli utenti in booleani; non filtra gli inattivi." },
      compress: { title: "Comprimi", kicker: "Tieni il modello, perdi la prosa", instruction: "Riduci la fonte a una regola e una domanda aperta.", detail: "Massimo 25 parole.", result: "Un buon riassunto conserva limite e incertezza." },
      humanCaptcha: { title: "CAPTCHA umano", kicker: "Dimostra che non sei autocomplete", instruction: "Esegui la missione fisica assurda.", detail: "Niente camera, microfono o punteggio.", result: "Un modello potrebbe descriverla, non godersi l’assurdo." },
      roomRaid: { title: "Raid della stanza", kicker: "Muoviti + nota", instruction: "Lascia la scrivania e trova tre cose. Niente foto.", detail: "Torna e ricordale senza guardare.", result: "Hai cambiato distanza, ti sei mosso e ricordato senza dispositivo." },
      bodyDebugger: { title: "Debugger del corpo", kicker: "Muoviti + inibisci", instruction: "Segui tutto tranne i comandi con “AI SAYS”.", detail: "Alzati. Quattro comandi e una trappola.", result: "Se hai obbedito all’IA, la metafora funziona." },
      duckBoss: { title: "Boss Papera", kicker: "Spiega ad alta voce", instruction: "Rispondi ad alta voce prima di colpire.", detail: "Scrivere è facoltativo. La papera vuole chiarezza.", result: "Hai spiegato prima di chiedere alla macchina." },
      breathing: { title: "Respiro 5–5", kicker: "Rallenta", instruction: "Inspira cinque secondi, espira cinque.", detail: "Tre minuti senza forzare.", result: "Hai cambiato ritmo prima di chiedere altra attenzione." },
      meditation: { title: "Meditazione aperta", kicker: "Fai meno", instruction: "Nota suoni, sensazioni e pensieri senza correggerli.", detail: "Tre minuti senza obiettivi.", result: "Niente da risolvere. Era questo il punto." },
      bodyScan: { title: "Scansione corporea", kicker: "Torna al corpo", instruction: "Sposta l’attenzione in ogni zona senza cambiarla.", detail: "Tre minuti. Lascia andare ciò che puoi.", result: "La tua attenzione ha visitato un luogo senza schermo." },
      walk: { title: "Camminata di cinque minuti", kicker: "Cambia scena", instruction: "Lascia lo schermo e cammina in sicurezza per cinque minuti.", detail: "Senza telefono, podcast o obiettivo produttivo.", result: "Cambiare luogo può segnare un cambio di stato." },
      music: { title: "Reset musicale", kicker: "Ascolta senza feed", instruction: "Ascolta tre minuti di lofi locale e non fare altro.", detail: "Gli altri suoni vanno in pausa e poi riprendono.", result: "Hai ascoltato senza riempire la pausa di input." },
      pingPong: { title: "Ping-pong invisibile", kicker: "Attraversa la linea mediana", instruction: "Alzati e mima colpi da sinistra a destra.", detail: "Segui il segnale per sessanta secondi.", result: "Sai ancora giocare. Sei ancora un mammifero mobile." },
    },
    humanMissions: ["Tocca tre superfici e rinomina la più strana.", "Resta su un piede e nomina cinque abbinamenti impossibili.", "Sposta un oggetto in un posto imprevedibile.", "Fai un suono imbarazzante da descrivere in un prompt."],
    roomItems: ["Qualcosa di blu", "Qualcosa di circolare", "Qualcosa più vecchio di te"],
    bodyCommands: ["MANO SINISTRA → GINOCCHIO DESTRO", "BATTI DUE VOLTE LE MANI", "AI SAYS: GIRA", "PASSO INDIETRO", "FERMO"],
    duckQuestions: ["COSA FA DAVVERO IL TUO CODICE?", "COSA SI ROMPE PER PRIMO?", "PERCHÉ NON CANCELLARNE METÀ?"],
    scanRegions: ["Piedi", "Gambe", "Pancia", "Petto", "Mani", "Spalle", "Mascella", "Occhi", "Tutto il corpo"],
    meditationCues: ["Nota il suono più vicino.", "Nota il contatto con sedia o pavimento.", "Lascia passare il prossimo pensiero.", "Allarga l’attenzione a tutta la stanza."],
    breatheIn: "Inspira", breatheOut: "Espira", breatheReady: "Sistemati", walking: "Lascia lo schermo. La pausa continua.", musicPlaying: "Lofi in riproduzione", pingPongCue: "Rimanda la palla",
  },
  ja: {
    shared: { skip: "スキップして休憩する", back: "戻る", start: "開始", done: "完了", finishEarly: "今すぐ終了", breakRemaining: "残り休憩時間", privacy: "端末内のみ。入力内容は保存も送信もされません。", answer: "あなたの回答", confidence: "確信度", reveal: "答えを見る", compare: "回答を比較", nextRandom: "別のランダムゲーム", chooseAnother: "別のものを選ぶ", source: "原文", invariant: "変えてはいけない条件", openQuestion: "未解決の問い", recall: "何を覚えていますか？", resultTitle: "自動操縦を中断しました。", resultBody: "脳の点数はありません。機械が選ばなかった行動を一つ実行しました。", safeNote: "不快に感じたら中止してください。安全な場所でのみ歩いてください。", minuteShort: "分", settingsAutoOpen: "長い休憩で Never Dumb を自動的に開く", audioUnavailable: "音声を開始できませんでした。静かな3分間を過ごすことはできます。" },
    intro: { eyebrow: "ヒューマン・ランタイム", title: "脳を手放さない。", body: "AIは文を完成できます。しかし思考まで完成させる必要はありません。休憩の数分で自分に戻りましょう。", run: "Never Dumbを開始", articleLink: "Never Dumbの背景にある科学" },
    mode: { eyebrow: "脱・自動操縦プロトコル", title: "今、何が必要ですか？", body: "考える、遊ぶ、状態をリセットする。休憩タイマーは動き続けます。", serious: "シリアス", seriousDetail: "推論を再構築し、欠陥を見つけ、ノイズを圧縮します。", fun: "ファン", funDetail: "4つのサプライズゲームから1つ。もっと動こう。", reset: "リセット", resetDetail: "呼吸、スキャン、散歩、音楽、運動。フィードは不要です。" },
    seriousMenu: { title: "抵抗を選ぶ。", body: "答えを見る前に自分で取り組みましょう。" },
    resetMenu: { title: "今の環境でできるリセットを選ぶ。", body: "最適化せず、一つ選んでフィードを離れます。" },
    exercises: {
      rebuild: { title: "再構築", kicker: "判断を取り戻す", instruction: "AIチャットを開かず、直前の集中時間で決めた3つの判断を再構築します。", detail: "判断、理由、考えを変える条件を書きます。", result: "理由を再構築できるなら、その答えはまだあなたのものです。" },
      breakAnswer: { title: "答えを壊す", kicker: "隠れた失敗を探す", instruction: "この関数はアクティブユーザーを返すと言っています。論理エラーを見つけてください。", detail: "失敗を正確な一文で説明します。", result: "ユーザーを真偽値に変換しているだけで、非アクティブな人を除外していません。" },
      compress: { title: "圧縮", kicker: "構造を残し文章を削る", instruction: "原文を、守る条件と未解決の問い一つずつに圧縮します。", detail: "合計25語相当以内。", result: "良い要約は滑らかな表現ではなく、制約と不確実性を残します。" },
      humanCaptcha: { title: "人間CAPTCHA", kicker: "オートコンプリートではない証明", instruction: "下の少し変な身体ミッションを実行します。", detail: "カメラ、マイク、スコアはありません。", result: "モデルは説明できても、この可笑しさは楽しめません。" },
      roomRaid: { title: "ルーム・レイド", kicker: "動く＋気づく", instruction: "机を離れ、3つの物を探します。写真は禁止。", detail: "戻って、見直さずに思い出します。", result: "距離を変え、動き、端末なしで思い出しました。" },
      bodyDebugger: { title: "ボディ・デバッガー", kicker: "動く＋抑制する", instruction: "「AI SAYS」で始まるもの以外の指示に従います。", detail: "立ち上がって。4つの指示と1つの罠。", result: "AIの指示に従ったなら、この比喩は機能しています。" },
      duckBoss: { title: "ラバーダック・ボス", kicker: "声に出して説明", instruction: "攻撃する前に各質問へ声に出して答えます。", detail: "入力は任意。アヒルが欲しいのは明快さです。", result: "機械に頼む前に、自分で説明しました。" },
      breathing: { title: "5–5呼吸", kicker: "ペースを落とす", instruction: "5秒吸って、5秒吐きます。", detail: "3分間。無理せず快適に。", result: "再び集中を求める前に、ペースを変えました。" },
      meditation: { title: "オープン瞑想", kicker: "何もしない", instruction: "音、感覚、思考を直そうとせず気づきます。", detail: "成果目標なしの3分間。", result: "解くものはありません。それが目的です。" },
      bodyScan: { title: "ボディスキャン", kicker: "身体に戻る", instruction: "変えようとせず、身体の各部へ注意を移します。", detail: "3分間。緩められる所を緩めます。", result: "注意が画面以外の場所を訪れました。" },
      walk: { title: "5分間の散歩", kicker: "景色を変える", instruction: "画面を離れ、安全な場所を5分歩きます。", detail: "スマホ、ポッドキャスト、生産性目標はなし。", result: "場所の小さな変化が状態の変化を示します。" },
      music: { title: "音楽リセット", kicker: "フィードなしで聴く", instruction: "ローカルのLofiを3分聴き、他のことはしません。", detail: "他の環境音は一時停止し、終了後に再開します。", result: "休憩を入力で埋めず、ただ聴きました。" },
      pingPong: { title: "見えない卓球", kicker: "身体の中心を越える", instruction: "立って、左右にボールを返す動きをまねます。", detail: "60秒間合図に従います。", result: "まだ遊べます。まだ動ける人間です。" },
    },
    humanMissions: ["3つの質感に触れ、一番変なものに新しい名前をつける。", "片足で立ち、ありえない食べ合わせを5つ言う。", "未来の自分が予想できない場所へ物を一つ動かす。", "プロンプトで説明するのが恥ずかしい音を出す。"],
    roomItems: ["青いもの", "丸いもの", "自分より古いもの"],
    bodyCommands: ["左手 → 右ひざ", "2回拍手", "AI SAYS：回る", "一歩下がる", "止まる"],
    duckQuestions: ["コードは実際に何をしていますか？", "最初に壊れるのは何ですか？", "なぜ半分削除しないのですか？"],
    scanRegions: ["足", "脚", "お腹", "胸", "手", "肩", "あご", "目", "全身"],
    meditationCues: ["一番近い音に気づく。", "椅子や床との接触を感じる。", "次の思考を追わずに通す。", "部屋全体へ注意を広げる。"],
    breatheIn: "吸う", breatheOut: "吐く", breatheReady: "整える", walking: "画面を離れてください。休憩は続いています。", musicPlaying: "Lofi再生中", pingPongCue: "ボールを返す",
  },
  zh: {
    shared: { skip: "跳过——好好休息", back: "返回", start: "开始", done: "完成", finishEarly: "现在结束", breakRemaining: "剩余休息时间", privacy: "仅在本地运行。输入内容不会保存或发送。", answer: "你的回答", confidence: "确信程度", reveal: "查看答案", compare: "对比回答", nextRandom: "再来一个随机游戏", chooseAnother: "选择其他项目", source: "原文", invariant: "必须保持的规则", openQuestion: "尚未解决的问题", recall: "你还记得什么？", resultTitle: "自动驾驶已中断。", resultBody: "没有大脑评分。你完成了一个并非由机器替你选择的动作。", safeNote: "如感到不适请立即停止。只在安全的地方行走。", minuteShort: "分钟", settingsAutoOpen: "长休息时自动打开 Never Dumb", audioUnavailable: "音频无法启动。你仍然可以安静休息三分钟。" },
    intro: { eyebrow: "人类运行时", title: "别把大脑彻底外包。", body: "AI 可以补完句子，但不应该替你完成思考。用休息中的几分钟重新上线。", run: "启动 Never Dumb", articleLink: "Never Dumb 背后的科学" },
    mode: { eyebrow: "反自动驾驶协议", title: "你现在需要什么？", body: "思考、玩耍或重置状态。长休息计时会继续。", serious: "认真", seriousDetail: "重建推理、发现漏洞或压缩噪音。", fun: "趣味", funDetail: "四个惊喜游戏随机一个，多动一动。", reset: "重置", resetDetail: "呼吸、扫描、散步、聆听或运动，不刷信息流。" },
    seriousMenu: { title: "选择你的阻力。", body: "先自己完成，再查看答案。" },
    resetMenu: { title: "选择当前环境允许的重置。", body: "不用优化，选一个并离开信息流。" },
    exercises: {
      rebuild: { title: "重建", kicker: "找回你的决定", instruction: "不要重新打开 AI 对话，重建上一个专注时段做出的三个决定。", detail: "写下决定、理由，以及什么会让你改变它。", result: "如果能重建推理，这个答案仍然属于你。" },
      breakAnswer: { title: "拆穿答案", kicker: "找到隐藏故障", instruction: "这个函数声称返回活跃用户。请先找到逻辑错误。", detail: "用一个准确句子说明故障。", result: "代码把每个用户映射为布尔值，并没有过滤掉非活跃用户。" },
      compress: { title: "压缩", kicker: "保留结构，删掉废话", instruction: "把原文压缩为一条必须保持的规则和一个未决问题。", detail: "总计不超过25个词。", result: "好的摘要保留约束与不确定性，而不是流畅措辞。" },
      humanCaptcha: { title: "人类验证码", kicker: "证明你不是自动补全", instruction: "完成下面这个有点荒唐的身体任务。", detail: "没有摄像头、麦克风或评分。", result: "模型可以描述它，却无法享受这种荒唐。" },
      roomRaid: { title: "房间突袭", kicker: "移动＋观察", instruction: "离开桌面，找到下面三样东西。不要拍照。", detail: "回来后不要再看，凭记忆回答。", result: "你改变了距离、移动了身体，并且没有设备也完成了回忆。" },
      bodyDebugger: { title: "身体调试器", kicker: "移动＋抑制", instruction: "执行所有指令，但忽略以“AI SAYS”开头的指令。", detail: "站起来。四个指令，一个陷阱。", result: "如果你服从了 AI 指令，这个隐喻就成立了。" },
      duckBoss: { title: "橡皮鸭 Boss", kicker: "大声解释", instruction: "每次攻击前，先大声回答问题。", detail: "输入文字可选。鸭子要的是清晰。", result: "你先自己解释，而不是先让机器解释。" },
      breathing: { title: "5–5 呼吸", kicker: "降速", instruction: "吸气五秒，再呼气五秒。", detail: "持续三分钟，保持舒适，不要勉强。", result: "在重新要求专注之前，你先改变了节奏。" },
      meditation: { title: "开放式冥想", kicker: "少做一点", instruction: "留意声音、感受和想法，不试图修正它们。", detail: "三分钟，没有表现目标。", result: "没有问题需要解决。这就是目的。" },
      bodyScan: { title: "身体扫描", kicker: "回到身体", instruction: "让注意力经过身体各部位，不试图改变。", detail: "三分钟。能放松的地方就放松。", result: "你的注意力去了一个不是屏幕的地方。" },
      walk: { title: "五分钟散步", kicker: "换个场景", instruction: "离开屏幕，在安全的地方步行五分钟。", detail: "不带手机、不听播客、没有效率目标。", result: "小小的地点变化可以标记真正的状态变化。" },
      music: { title: "音乐重置", kicker: "不刷信息流，只聆听", instruction: "播放三分钟本地 Lofi，除此之外什么都不做。", detail: "其他环境音会暂停，离开后恢复。", result: "你只是聆听，没有用更多输入填满休息。" },
      pingPong: { title: "隐形乒乓球", kicker: "跨过身体中线", instruction: "站起来，模仿从左到右回球。", detail: "跟随提示六十秒。", result: "仍然会玩，仍然是会活动的人类。" },
    },
    humanMissions: ["触摸三种材质，给最奇怪的一种重新起名。", "单脚站立，说出五种不可能的食物组合。", "把一个物品移到未来的自己猜不到的位置。", "发出一个写进提示词会很尴尬的声音。"],
    roomItems: ["蓝色的东西", "圆形的东西", "比你年纪更大的东西"],
    bodyCommands: ["左手 → 右膝", "拍手两次", "AI SAYS：转圈", "后退一步", "定住"],
    duckQuestions: ["你的代码实际上做什么？", "最先坏掉的是什么？", "为什么不删掉一半？"],
    scanRegions: ["脚", "腿", "腹部", "胸部", "手", "肩膀", "下巴", "眼睛", "全身"],
    meditationCues: ["留意最近的声音。", "感受椅子或地面的接触。", "让下一个想法经过，不跟随。", "把注意力扩展到整个房间。"],
    breatheIn: "吸气", breatheOut: "呼气", breatheReady: "安定下来", walking: "离开屏幕。休息仍在继续。", musicPlaying: "Lofi 播放中", pingPongCue: "把球打回去",
  },
} satisfies Record<UiLocale, NeverDumbCopy>;

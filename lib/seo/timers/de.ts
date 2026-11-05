import type { TimerPage } from "./types";

// German timer pages, from week 2 (2026-11-05). Volumes are monthly searches
// in Germany from OpenSEO on 2026-10-29; see seo-agent/timer-pages/QUEUE.tsv.
// Written for German readers (du-form, local conventions), not translated
// from the English pages.
export const deTimerPages: TimerPage[] = [
  {
    slug: "timer-5-minuten",
    lang: "de",
    minutes: 5,
    role: "break",
    label: "5-Minuten",
    title: "Timer 5 Minuten: Kostenloser Countdown für die Pause",
    description:
      "Kostenloser 5-Minuten-Timer: ein Klick, und die kurze Pause der Pomodoro-Technik läuft. Mit Regen, Wald oder Lo-fi im Hintergrund, ohne Konto.",
    h1: "Timer 5 Minuten",
    intro:
      "Ein Klick auf Start, und der Timer zählt fünf Minuten herunter, am Ende ertönt ein Signal. Fünf Minuten sind die klassische kurze Pause der Pomodoro-Technik: genug, um aufzustehen, etwas zu trinken und die Augen zu entspannen, aber kurz genug, damit der Faden nicht reißt.",
    useCases: [
      "Die kurze Pause zwischen zwei Pomodoro-Einheiten von 25 Minuten.",
      "Einmal aufstehen und Schultern und Nacken lockern.",
      "Den Schreibtisch aufräumen, bevor die nächste Aufgabe beginnt.",
      "Eine unangenehme Aufgabe anfangen: nur fünf Minuten, dann sehen wir weiter.",
      "Kurz durchatmen vor einem Telefonat oder einem Meeting.",
    ],
    sections: [
      {
        heading: "Warum fünf Minuten Pause",
        body: "Bei der Pomodoro-Technik folgt auf jede Arbeitseinheit von 25 Minuten eine kurze Pause von drei bis fünf Minuten, nach vier Einheiten eine längere. Fünf Minuten reichen, um den Kopf von der Aufgabe zu lösen, sind aber zu kurz für alles, was einen länger festhält. Das funktioniert nur, wenn die Pause wirklich eine Pause ist: Postfach und Social Media bleiben zu.",
      },
      {
        heading: "Was in fünf Minuten guttut",
        body: "Bewegung schlägt Scrollen. Steh auf, streck dich, schau aus dem Fenster in die Ferne, damit die Augen nicht ständig auf Bildschirmabstand scharfstellen müssen, und füll dein Wasserglas auf. Entscheidend ist, dass du dir in der Pause keine neuen Informationen in den Kopf holst, die dich in die nächste Einheit begleiten.",
      },
      {
        heading: "Fünf Minuten gegen das Aufschieben",
        body: "Ein Countdown von fünf Minuten hilft auch beim Anfangen. Nimm dir vor, nur bis zum Signal an der Aufgabe zu arbeiten, die du seit Tagen vor dir herschiebst. Der Anfang ist meistens das Schwerste, und wenn der Timer einmal läuft, machen viele einfach weiter. Hörst du nach fünf Minuten auf, hast du trotzdem etwas geschafft.",
      },
    ],
    faq: [
      {
        q: "Reichen fünf Minuten Pause?",
        a: "Zwischen kurzen Arbeitseinheiten ja. Nach etwa vier Einheiten empfiehlt die Pomodoro-Technik eine längere Pause von 15 bis 30 Minuten.",
      },
      {
        q: "Kann ich während des Countdowns ein Geräusch abspielen?",
        a: "Ja. Unter dem Timer kannst du Regen, Wald, Kaminfeuer, Café oder Lo-fi auswählen, auch mehrere gleichzeitig. Der Klang pausiert mit dem Timer und stoppt am Ende.",
      },
      {
        q: "Was passiert, wenn die Zeit abgelaufen ist?",
        a: "Ein Signal ertönt, und der Timer springt zurück auf 05:00, bereit für die nächste Pause.",
      },
      {
        q: "Was mache ich nach vier kurzen Pausen?",
        a: "Dann ist die lange Pause dran: 15 bis 30 Minuten, idealerweise weg vom Bildschirm. Dafür gibt es den Timer für 15 Minuten.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-technik-leitfaden-anfaenger",
      "never-dumb-pausen",
      "meditation-pomodoro-pausen",
    ],
    published: "2026-11-05",
  },
  {
    slug: "timer-10-minuten",
    lang: "de",
    minutes: 10,
    role: "break",
    label: "10-Minuten",
    title: "Timer 10 Minuten: Kostenloser Countdown mit Sounds",
    description:
      "Kostenloser 10-Minuten-Timer, startet mit einem Klick: für Pausen nach langen Arbeitsblöcken, kurze Meditationen und kleine Aufgaben am Stück.",
    h1: "Timer 10 Minuten",
    intro:
      "Zehn Minuten, ein Klick: Der Countdown läuft, am Ende ertönt ein Signal. Zehn Minuten passen gut als Pause nach einem langen Arbeitsblock, für eine kurze Meditation oder für eine Handvoll kleiner Aufgaben, die du endlich vom Tisch haben willst.",
    useCases: [
      "Die Pause nach 50 Minuten konzentrierter Arbeit (50/10-Rhythmus).",
      "Eine kurze Meditation oder Atemübung.",
      "Notizen wiederholen, kurz bevor die Vorlesung beginnt.",
      "Kleinkram gesammelt erledigen: Mails, Termine, Ablage.",
      "Eine bildschirmfreie Pause am Nachmittag.",
    ],
    sections: [
      {
        heading: "Die passende Pause für längere Blöcke",
        body: "Wer länger als 25 Minuten am Stück arbeitet, empfindet fünf Minuten Pause schnell als zu knapp. Der 50/10-Rhythmus, also 50 Minuten Arbeit und 10 Minuten Pause, ist deshalb eine der beliebtesten Varianten der Pomodoro-Technik. Das Verhältnis von etwa fünf zu eins bleibt gleich, aber der Kopf bekommt mehr Raum zum Erholen.",
      },
      {
        heading: "Kleinkram in einem Rutsch",
        body: "Manche Aufgaben sind zu klein für eine eigene Arbeitseinheit, aber zu zahlreich, um sie zu ignorieren: drei Nachrichten beantworten, einen Arzttermin buchen, zwei Dokumente ablegen. Wenn du sie in einem Block von zehn Minuten bündelst, unterbrechen sie nicht den ganzen Tag deine eigentliche Arbeit. Was beim Signal übrig ist, kommt in den nächsten Block.",
      },
      {
        heading: "Eine kurze Meditation",
        body: "Zehn Minuten sind eine angenehme Länge für den Einstieg in die Meditation. Stell Regen oder Wald als Hintergrund ein, starte den Timer, schließ die Augen und lass dir vom Signal sagen, wann du fertig bist, statt auf die Uhr zu schauen. Im Artikel über Meditation in den Pomodoro-Pausen findest du eine einfache Anleitung.",
      },
    ],
    faq: [
      {
        q: "Ist der Timer kostenlos?",
        a: "Ja, vollständig. Kein Konto, keine Werbung, keine kostenpflichtige Version.",
      },
      {
        q: "Kann ich den Timer im Vollbild zeigen, etwa im Unterricht?",
        a: "Ja, sofern der Browser es erlaubt: Der Vollbild-Button vergrößert den Countdown, sodass er auch von hinten im Raum lesbar ist, und Escape bringt dich zurück. Auf dem iPhone bieten Browser kein Vollbild für Webseiten an, dort erscheint der Button nicht.",
      },
      {
        q: "Läuft der Timer weiter, wenn ich den Tab wechsle?",
        a: "Ja. Die Restzeit wird aus der echten Uhrzeit berechnet und stimmt immer, wenn du zurückkommst. In einem Hintergrund-Tab kann manch ein Browser das Signal um bis zu eine Minute verzögern, außer es läuft ein Hintergrundklang.",
      },
      {
        q: "Ist 50/10 besser als 25/5?",
        a: "Nicht grundsätzlich. 50/10 passt zu Aufgaben mit langer Anlaufzeit, 25/5 zu zerstückelten Tagen und zu Aufgaben, die du lieber aufschieben würdest. Viele wechseln je nach Arbeit.",
      },
    ],
    relatedArticleSlugs: [
      "meditation-pomodoro-pausen",
      "pomodoro-technik-leitfaden-anfaenger",
      "beste-ambient-sounds-konzentrieren",
    ],
    published: "2026-11-05",
  },
  {
    slug: "timer-15-minuten",
    lang: "de",
    minutes: 15,
    role: "break",
    label: "15-Minuten",
    title: "Timer 15 Minuten: Countdown für Pause und Powernap",
    description:
      "Kostenloser 15-Minuten-Timer: die lange Pause der Pomodoro-Technik, ein kurzer Powernap oder eine kleine Aufgabe von Anfang bis Ende.",
    h1: "Timer 15 Minuten",
    intro:
      "Dieser Timer zählt eine Viertelstunde herunter und gibt am Ende ein Signal. Fünfzehn Minuten sind die lange Pause der Pomodoro-Technik, die nach vier Arbeitseinheiten kommt, und eignen sich genauso für einen Powernap oder einen kurzen Spaziergang um den Block.",
    useCases: [
      "Die lange Pause nach vier Pomodoro-Einheiten.",
      "Ein Powernap, der endet, bevor der Tiefschlaf beginnt.",
      "Ein kurzer Spaziergang an der frischen Luft.",
      "Eine kleine, klar umrissene Aufgabe von Anfang bis Ende.",
      "Einen Vortrag oder eine Präsentation zeitlich proben.",
    ],
    sections: [
      {
        heading: "Die lange Pause im Pomodoro-Zyklus",
        body: "Ein typischer Pomodoro-Zyklus besteht aus vier Einheiten von 25 Minuten mit kurzen Pausen dazwischen und endet mit einer langen Pause von 15 bis 30 Minuten. In dieser Pause erholst du dich wirklich: etwas essen, Tageslicht tanken oder einfach nichts tun. Eine Viertelstunde ist das untere Ende dieser Spanne und passt in die meisten Arbeitstage.",
      },
      {
        heading: "Ein Powernap ohne Nachwirkungen",
        body: "Kurze Nickerchen von etwa 10 bis 20 Minuten werden oft empfohlen, weil sie enden, bevor du in den Tiefschlaf rutschst, der das Aufwachen so schwer macht. Starte den Timer, leg dich hin und lass dich vom Signal wecken. Auf dem Handy gilt: Bildschirm an und Seite geöffnet lassen, denn ein gesperrtes Telefon lässt eine Webseite oft nicht klingeln.",
      },
      {
        heading: "Fünfzehn Minuten als Arbeitsblock",
        body: "Eine Viertelstunde ist auch eine gute Länge für Aufgaben, vor denen du dich drückst. Sie ist kurz genug, dass der Anfang machbar wirkt, und lang genug für sichtbaren Fortschritt: der erste Absatz, die ersten zehn Punkte einer Liste, die Vorlage für ein Dokument. Wenn lange Einheiten gerade schwerfallen, ist das ein guter Einstieg.",
      },
    ],
    faq: [
      {
        q: "Wie lang sollte die lange Pomodoro-Pause sein?",
        a: "Zwischen 15 und 30 Minuten, nach vier Arbeitseinheiten. Eine Viertelstunde reicht an den meisten Tagen, nach einem anstrengenden Vormittag dürfen es 30 sein.",
      },
      {
        q: "Funktioniert der Timer auf dem Handy?",
        a: "Ja, in jedem aktuellen mobilen Browser, ohne App. Lass den Bildschirm an und die Seite geöffnet, sonst ertönt das Signal unter Umständen nicht.",
      },
      {
        q: "Kann ich pausieren und weitermachen?",
        a: "Ja. Pause hält die Restzeit fest, Weiter setzt dort fort. Zurücksetzen, oder das Ende des Countdowns, stellt wieder 15 Minuten ein.",
      },
      {
        q: "Wie lang sollte ein Powernap sein?",
        a: "Meist werden 10 bis 20 Minuten empfohlen. Plane ein paar Minuten zum Einschlafen ein, eine Viertelstunde auf dem Timer passt deshalb gut.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-technik-leitfaden-anfaenger",
      "never-dumb-pausen",
      "homeoffice-fokussiert-bleiben",
    ],
    published: "2026-11-05",
  },
  {
    slug: "timer-20-minuten",
    lang: "de",
    minutes: 20,
    role: "focus",
    breakMinutes: 5,
    label: "20-Minuten",
    title: "Timer 20 Minuten: Kostenloser Fokus-Countdown",
    description:
      "Kostenloser 20-Minuten-Timer für kurze Fokuseinheiten, mit 5 Minuten Pause per Klick. Leichter anzufangen als eine volle Pomodoro-Einheit.",
    h1: "Timer 20 Minuten",
    intro:
      "Starte den Countdown von 20 Minuten und wechsle beim Signal in die 5-Minuten-Pause. Zwanzig Minuten sind eine sanfte Fokuseinheit, etwas kürzer als ein klassischer Pomodoro, und deshalb leichter anzufangen, wenn die Konzentration zerstreut ist oder die Aufgabe schwer wirkt.",
    useCases: [
      "Kurze Fokuseinheiten, wenn 25 Minuten zu viel sind.",
      "Lerneinheiten für Schülerinnen und Schüler oder an müden Abenden.",
      "Eine Aufwärmrunde vor längeren Arbeitsblöcken.",
      "Ein Kapitel oder einen langen Artikel mit voller Aufmerksamkeit lesen.",
      "Ein Zirkeltraining oder eine Dehnroutine timen.",
    ],
    sections: [
      {
        heading: "Wann 20 statt 25 Minuten",
        body: "Die 25 Minuten der Pomodoro-Technik sind eine Konvention, kein Gesetz. Wenn du regelmäßig um die fünfzehnte Minute herum abschweifst, ist ein Block von 20 Minuten, den du wirklich zu Ende bringst, mehr wert als einer von 25, den du abbrichst. Viele Menschen mit Konzentrationsschwierigkeiten, etwa bei ADHS, kommen mit kürzeren Einheiten leichter in Gang.",
      },
      {
        heading: "Schrittweise verlängern",
        body: "Sieh 20 Minuten als Startpunkt. Wenn dir die Einheiten ein paar Tage lang leichtfallen, probier 25, dann 30. Es geht darum, die längste Einheit zu finden, die du ohne inneren Kampf schaffst, nicht darum, eine Zahl zu erzwingen. Der Pausenmodus liegt direkt neben dem Fokusmodus, ein ganzer Zyklus braucht also zwei Klicks.",
      },
      {
        heading: "Zwanzig Minuten zum Lesen",
        body: "Konzentriertes Lesen leidet als Erstes, wenn die Aufmerksamkeit zersplittert ist. Ein Timer von 20 Minuten und das Handy in einem anderen Raum sind ein einfacher Weg zurück: ein Kapitel, ein langer Artikel, ein Fachtext. Wenn dich Stille unruhig macht, leg Kaminfeuer oder Regen darunter, und hör beim Signal auf, damit du Lust auf die nächste Runde hast.",
      },
    ],
    faq: [
      {
        q: "Reichen 20 Minuten, um sich zu konzentrieren?",
        a: "Für viele Aufgaben ja. Es ist genug Zeit, um reinzukommen und voranzukommen, und kurz genug, um ohne Widerstand anzufangen.",
      },
      {
        q: "Wie lange sollte die Pause nach 20 Minuten sein?",
        a: "Etwa 5 Minuten, genau der Pausenmodus dieses Timers.",
      },
      {
        q: "Was macht der Link zur vollständigen App?",
        a: "Er öffnet Pomodorian und stellt deine gespeicherte Fokusdauer auf 20 Minuten, bis du sie in den Einstellungen änderst. Die App bietet zusätzlich eine Aufgabenliste, einen KI-Planer und Fokus-Statistiken.",
      },
      {
        q: "Brauche ich ein Konto oder eine App?",
        a: "Nein. Der Timer läuft direkt im Browser, ohne Anmeldung und ohne Installation. Einen gewählten Hintergrundklang merkt sich dein Browser für den nächsten Besuch.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-adhs",
      "pomodoro-technik-leitfaden-anfaenger",
      "body-doubling",
    ],
    published: "2026-11-05",
  },
];

import type { TimerPage } from "./types";

// German timer pages, from week 2 (2026-11-05). Volumes are monthly searches
// in Germany from OpenSEO on 2026-10-29; see seo-agent/timer-pages/QUEUE.tsv.
// Written for German readers (du-form, local habits such as Stoßlüften,
// Feierabend, the akademisches Viertel or the Arbeitszeitgesetz), not
// translated from the English pages.
export const deTimerPages: TimerPage[] = [
  {
    slug: "timer-5-minuten",
    lang: "de",
    minutes: 5,
    role: "break",
    label: "5-Minuten",
    title: "Timer 5 Minuten: Kostenloser Countdown für die Pause",
    description:
      "Kostenloser 5-Minuten-Timer für die kurze Pomodoro-Pause, zum Stoßlüften oder als Puffer zwischen zwei Videocalls. Startet mit einem Klick.",
    h1: "Timer 5 Minuten",
    intro:
      "Fünf Minuten Countdown, danach ein Signal. Mehr braucht die kurze Pause der Pomodoro-Technik nicht: aufstehen, Fenster auf, ein Glas Wasser, und zurück an den Schreibtisch, bevor der Gedanke von eben verloren geht.",
    useCases: [
      "Die kurze Pause nach einer Pomodoro-Einheit von 25 Minuten.",
      "Stoßlüften im Büro oder Arbeitszimmer.",
      "Ein Puffer zwischen zwei Videocalls.",
      "Einmal durchs Treppenhaus und zurück.",
      "Ein Glas Wasser holen und den Blick vom Bildschirm lösen.",
    ],
    sections: [
      {
        heading: "Die kurze Pause im Pomodoro-Zyklus",
        body: "Die Pomodoro-Technik wechselt 25 Minuten konzentrierte Arbeit mit einer kurzen Pause von drei bis fünf Minuten ab. Diese Pause ist kein Luxus, sondern Teil der Methode: Sie trennt eine Einheit von der nächsten und verhindert, dass ein langer Vormittag zu einem einzigen zähen Block verschwimmt. Nach der vierten Einheit wird die Pause dann länger.",
      },
      {
        heading: "Fenster auf: Stoßlüften statt Kippen",
        body: "Gerade im Herbst und Winter wird die Luft im Arbeitszimmer schnell stickig, und viele merken, dass dann auch die Konzentration nachlässt. Das Umweltbundesamt rät, mehrmals am Tag das Fenster weit zu öffnen, statt es dauerhaft zu kippen; wie lange, hängt von der Jahreszeit ab, im Winter reichen wenige Minuten. Die kurze Pause ist dafür der ideale Moment.",
      },
      {
        heading: "Fünf Minuten zwischen zwei Videocalls",
        body: "Wer Termine direkt hintereinanderlegt, sitzt oft stundenlang ohne Unterbrechung vor der Kamera. Plane zwischen zwei Calls fünf Minuten Luft ein und starte den Timer, sobald der erste endet: Notizen festhalten, aufstehen, kurz aus dem Fenster schauen. Beim Signal bist du bereit für den nächsten, statt abgehetzt hineinzustolpern.",
      },
    ],
    faq: [
      {
        q: "Was kommt nach der vierten Pomodoro-Einheit?",
        a: "Eine lange Pause statt der kurzen, je nach Tagesform eine Viertelstunde oder länger. Dafür gibt es den Timer für 15 Minuten.",
      },
      {
        q: "Was passiert, wenn die Zeit abgelaufen ist?",
        a: "Ein Signal ertönt, und der Timer springt zurück auf 05:00, bereit für die nächste Pause.",
      },
      {
        q: "Muss ich in der Pause aufstehen?",
        a: "Es lohnt sich. Wer sitzen bleibt, landet schnell wieder am Bildschirm. Schon ein paar Schritte und ein Blick aus dem Fenster unterbrechen die Arbeit deutlicher als ein Blick aufs Handy.",
      },
      {
        q: "Darf ich die Pause verlängern, wenn ich müde bin?",
        a: "Ja, aber bewusst: Starte den Timer einfach ein zweites Mal, statt die Pause offen auslaufen zu lassen. Wenn du ständig verlängern willst, ist vermutlich die lange Pause fällig oder dein Arbeitsblock zu lang.",
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
    slug: "timer-10-minuten",
    lang: "de",
    minutes: 10,
    role: "break",
    label: "10-Minuten",
    title: "Timer 10 Minuten: Countdown für Pause und Meditation",
    description:
      "Kostenloser 10-Minuten-Timer: für das Feierabend-Ritual, einen Gang gegen das Nachmittagstief oder den letzten Blick in die Notizen.",
    h1: "Timer 10 Minuten",
    intro:
      "Dieser Timer läuft zehn Minuten und meldet sich mit einem Signal. Zehn Minuten sind lang genug, um wirklich abzuschalten oder etwas Kleines komplett zu erledigen, und kurz genug, um sie in jeden Tag zu passen.",
    useCases: [
      "Das Feierabend-Ritual: aufräumen und den nächsten Tag vorbereiten.",
      "Ein kurzer Gang gegen das Nachmittagstief.",
      "Den Wochenplan am Montagmorgen aufstellen.",
      "Ein letzter Blick in die Notizen vor der Klausur.",
      "Die Pause nach 50 Minuten Arbeit.",
    ],
    sections: [
      {
        heading: "Zehn Minuten für einen sauberen Feierabend",
        body: "Wer im Homeoffice arbeitet, kennt das Problem: Der Arbeitstag hört nicht auf, er franst aus. Ein festes Ritual von zehn Minuten hilft, einen klaren Schlussstrich zu ziehen. Offene Tabs schließen, die erste Aufgabe für morgen aufschreiben, den Schreibtisch freiräumen. Wenn das Signal kommt, ist Feierabend, und der Kopf weiß das auch.",
      },
      {
        heading: "Raus aus dem Nachmittagstief",
        body: "Nach dem Mittagessen sackt bei vielen die Energie ab, und der Griff zum nächsten Kaffee liegt nahe. Probier stattdessen zehn Minuten draußen: einmal um den Block, Treppe statt Aufzug, ein paar Minuten Tageslicht. Dreh nach etwa fünf Minuten um, dann bist du beim Signal wieder am Schreibtisch und musst kein schlechtes Gewissen haben.",
      },
      {
        heading: "Vor der Klausur: durchgehen, nicht neu lernen",
        body: "Die letzten Minuten vor einer Prüfung eignen sich nicht mehr, um neuen Stoff aufzunehmen. Nutze sie, um deine Zusammenfassung einmal ruhig durchzugehen: Gliederung, Formeln, die zwei, drei Punkte, die du dir merken wolltest. Zehn Minuten setzen dafür einen klaren Rahmen. Beim Signal klappst du die Unterlagen zu und gehst in den Raum.",
      },
    ],
    faq: [
      {
        q: "Kann ich den Timer für eine Meditation nutzen?",
        a: "Ja. Wähle Regen oder Wald als Hintergrundklang, schließ die Augen und überlass es dem Signal, die Zeit im Blick zu behalten. Eine einfache Anleitung steht im Artikel über Meditation in den Pomodoro-Pausen.",
      },
      {
        q: "Lässt sich der Countdown groß für eine Klasse oder ein Team anzeigen?",
        a: "Wenn der Browser es erlaubt, ja: Der Vollbild-Button vergrößert die Anzeige, mit der Esc-Taste geht es zurück. Auf dem iPhone gibt es für Webseiten kein Vollbild, dort fehlt der Button.",
      },
      {
        q: "Läuft der Timer weiter, wenn ich den Tab wechsle?",
        a: "Ja. Die Restzeit wird aus der echten Uhrzeit berechnet und stimmt immer, wenn du zurückkommst. In einem Hintergrund-Tab kann manch ein Browser das Signal um bis zu eine Minute verzögern, außer es läuft ein Hintergrundklang.",
      },
      {
        q: "Wann ist 50/10 sinnvoller als 25/5?",
        a: "Bei Aufgaben mit langer Anlaufzeit, etwa Programmieren oder Schreiben. An Tagen mit vielen Unterbrechungen sind die kürzeren 25-Minuten-Einheiten oft leichter durchzuhalten.",
      },
    ],
    relatedArticleSlugs: [
      "meditation-pomodoro-pausen",
      "homeoffice-fokussiert-bleiben",
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
      "Kostenloser 15-Minuten-Timer: die lange Pomodoro-Pause, das akademische Viertel zwischen zwei Vorlesungen oder ein Powernap am Nachmittag.",
    h1: "Timer 15 Minuten",
    intro:
      "Eine Viertelstunde, heruntergezählt, mit Signal am Ende. Fünfzehn Minuten sind das untere Ende der langen Pause, die bei der Pomodoro-Technik nach vier Arbeitseinheiten kommt, und in Deutschland eine Zeitspanne mit Tradition, vom Hörsaal bis zum Arbeitsrecht.",
    useCases: [
      "Die lange Pause nach vier Pomodoro-Einheiten.",
      "Das akademische Viertel zwischen zwei Vorlesungen.",
      "Ein Powernap am frühen Nachmittag.",
      "Ein Kaffee mit Kolleginnen und Kollegen.",
      "Im Homeoffice kurz die Wäsche aufhängen.",
    ],
    sections: [
      {
        heading: "Die Viertelstunde im Arbeitszeitgesetz",
        body: "Das Arbeitszeitgesetz schreibt Beschäftigten bei mehr als sechs Stunden Arbeit im Voraus feststehende Ruhepausen von insgesamt mindestens 30 Minuten vor. Diese dürfen in Abschnitte von jeweils mindestens 15 Minuten aufgeteilt werden. Teilt dein Betrieb die Pause auf, passen zweimal 15 Minuten genau auf diesen Timer.",
      },
      {
        heading: "Das akademische Viertel",
        body: "Steht an einer deutschen Hochschule c.t. (cum tempore) hinter der Uhrzeit, beginnt die Vorlesung eine Viertelstunde später. Diese fünfzehn Minuten sind eine kleine Institution: Raumwechsel, Kaffee, ein kurzer Blick in die Unterlagen. Mit dem Timer verpasst du den Beginn nicht, auch wenn das Gespräch in der Cafeteria gerade gut ist.",
      },
      {
        heading: "Die lange Pause richtig nutzen",
        body: "Nach vier Einheiten ist die lange Pause fällig, und sie sollte sich auch so anfühlen. Iss etwas, geh ans Tageslicht, sprich mit jemandem, der nicht über die Arbeit reden will. Was sich nicht eignet: die Zeit mit Nachrichten-Apps zu füllen. Die Viertelstunde ist dann zwar vorbei, aber erholt hat sich der Kopf nicht.",
      },
    ],
    faq: [
      {
        q: "Eignet sich der Timer für einen Powernap mit dem Handy?",
        a: "Ja. Meist werden 10 bis 20 Minuten empfohlen, eine Viertelstunde passt also gut. Lass die Seite offen und sperr das Handy nicht selbst: Solange der Timer läuft, hält sie den Bildschirm wach, sofern dein Browser das unterstützt.",
      },
      {
        q: "Zählt die lange Pomodoro-Pause als Ruhepause?",
        a: "Wenn sie mindestens 15 Minuten dauert, im Voraus feststeht und du in dieser Zeit wirklich nicht arbeitest, kann sie als Ruhepause im Sinne des Arbeitszeitgesetzes gelten. Kurzpausen von fünf Minuten zählen nicht. Im Zweifel hilft ein Blick in Arbeits- oder Tarifvertrag, oder du fragst den Betriebsrat.",
      },
      {
        q: "Kann ich zwei Viertelstunden hintereinander nehmen?",
        a: "Ja. Nach dem Signal steht der Timer wieder auf 15:00, ein Klick auf Start genügt für die zweite Runde. So kommst du auf eine halbe Stunde, etwa für die Mittagspause.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-technik-leitfaden-anfaenger",
      "never-dumb-pausen",
      "ultradiane-rhythmen-fokus-zyklen",
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
      "Kostenloser 20-Minuten-Timer für Lernrunden mit der Leitner-Kartei, Hausaufgaben in Etappen und Lernen zu zweit. Mit 5-Minuten-Pause.",
    h1: "Timer 20 Minuten",
    intro:
      "Zwanzig Minuten Fokus, dann fünf Minuten Pause: Beim Signal springt der Timer auf die 5-Minuten-Pause, ein Klick auf Start genügt. Eine Runde ist etwas kürzer als eine klassische Pomodoro-Einheit, was den Einstieg leichter macht, wenn du unkonzentriert bist oder dir eine Aufgabe schwer im Magen liegt.",
    useCases: [
      "Eine Runde mit der Leitner-Kartei.",
      "Lernen zu zweit, beide im selben Takt.",
      "Hausaufgaben in überschaubaren Etappen.",
      "Ein sanfter Einstieg am Montagmorgen.",
      "Ein Zirkeltraining oder eine Dehnroutine.",
    ],
    sections: [
      {
        heading: "Zwanzig Minuten mit der Leitner-Kartei",
        body: "Die Lernkartei nach Sebastian Leitner sortiert Karteikarten in Fächer: Was du weißt, rückt ein Fach nach hinten und kommt seltener dran, was du nicht weißt, wandert zurück ins erste Fach. Das funktioniert am besten in kurzen, regelmäßigen Runden. Zwanzig Minuten reichen für das vorderste Fach und ein paar Wiederholungen, danach fünf Minuten Pause, dann das nächste Fach oder ein anderes Thema.",
      },
      {
        heading: "Hausaufgaben in Etappen",
        body: "Ein ganzer Nachmittag voller Hausaufgaben wirkt auf Kinder wie ein Berg. In Etappen von 20 Minuten mit einer echten Pause dazwischen wird daraus eine Reihe kleiner Hügel, und der Streit darüber, wie lange es noch dauert, erledigt sich oft von selbst, weil der Timer es zeigt. In der Pause wird gespielt oder gegessen, nicht weitergerechnet.",
      },
      {
        heading: "Im gleichen Takt mit anderen",
        body: "Arbeitet jemand mit, auch per Videocall, fällt vielen das Dranbleiben leichter; das nennt sich Body Doubling. Ein gemeinsamer Takt macht es noch einfacher: Ihr startet den Timer zur selben Zeit, arbeitet 20 Minuten still für euch und redet erst in der Pause. Wer im Lernduo arbeitet, kann so auch schwierige Themen besser durchziehen.",
      },
    ],
    faq: [
      {
        q: "Warum 20 und nicht 25 Minuten?",
        a: "Die 25 Minuten sind eine Konvention. Bei Konzentrationsschwierigkeiten, etwa mit ADHS, kann eine kürzere Einheit den Einstieg erleichtern. Läuft es gut, verlängerst du später auf 25 oder 30 Minuten.",
      },
      {
        q: "Was macht der Link zur vollständigen App?",
        a: "Er öffnet Pomodorian und stellt deine gespeicherte Fokusdauer auf 20 Minuten, bis du sie in den Einstellungen änderst. Die Pausenlänge bleibt die aus deinen Einstellungen. Die App bietet zusätzlich eine Aufgabenliste, einen KI-Planer und Fokus-Statistiken.",
      },
      {
        q: "Brauche ich ein Konto oder eine App?",
        a: "Nein. Der Timer läuft direkt im Browser, ohne Anmeldung und ohne Installation. Einen gewählten Hintergrundklang merkt sich dein Browser für den nächsten Besuch.",
      },
      {
        q: "Was, wenn ich beim Signal gerade richtig drin bin?",
        a: "Bring den Gedanken zu Ende und schreib dir den nächsten Schritt auf, aber nimm die Pause trotzdem. Passiert dir das oft, ist es Zeit für längere Einheiten. Der Pausenmodus lässt sich jederzeit mit einem Klick wieder auf Fokus stellen.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-adhs",
      "body-doubling",
      "pomodoro-technik-leitfaden-anfaenger",
    ],
    published: "2026-11-05",
  },
];

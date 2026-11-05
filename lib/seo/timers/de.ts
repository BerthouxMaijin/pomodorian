import type { TimerPage } from "./types";

// German timer pages, from week 2 (2026-11-05). Volumes are monthly searches
// in Germany from OpenSEO on 2026-10-29; see seo-agent/timer-pages/QUEUE.tsv.
// Written for German readers (du-form, local habits such as Stoßlüften,
// Feierabend or the Arbeitszeitgesetz), not translated from the English pages.
export const deTimerPages: TimerPage[] = [
  {
    slug: "timer-5-minuten",
    lang: "de",
    minutes: 5,
    role: "break",
    label: "5-Minuten",
    title: "Timer 5 Minuten: Kostenloser Countdown für die Pause",
    description:
      "Kostenloser 5-Minuten-Timer für die kurze Pomodoro-Pause, zum Stoßlüften oder für einen schnellen Neustart zwischen zwei Aufgaben.",
    h1: "Timer 5 Minuten",
    intro:
      "Fünf Minuten Countdown, danach ein Signal. Mehr braucht die kurze Pause der Pomodoro-Technik nicht: aufstehen, Fenster auf, ein Glas Wasser, und zurück an den Schreibtisch, bevor der Gedanke von eben verloren geht.",
    useCases: [
      "Die kurze Pause nach einer Pomodoro-Einheit von 25 Minuten.",
      "Stoßlüften, damit im Büro oder Arbeitszimmer wieder frische Luft ist.",
      "Kurz an die frische Luft oder einmal durchs Treppenhaus.",
      "Eine Aufgabe anfangen, vor der du dich drückst: nur bis zum Signal.",
      "Vor einem Telefonat oder Meeting kurz zur Ruhe kommen.",
    ],
    sections: [
      {
        heading: "Die kurze Pause im Pomodoro-Zyklus",
        body: "Die Pomodoro-Technik wechselt 25 Minuten konzentrierte Arbeit mit einer kurzen Pause von drei bis fünf Minuten ab. Diese Pause ist kein Luxus, sondern Teil der Methode: Sie trennt eine Einheit von der nächsten und verhindert, dass ein langer Vormittag zu einem einzigen zähen Block verschwimmt. Wichtig ist nur, dass du die Pause nicht mit Mails oder Nachrichten füllst.",
      },
      {
        heading: "Fenster auf: fünf Minuten Stoßlüften",
        body: "Gerade im Herbst und Winter wird die Luft im Arbeitszimmer schnell stickig, und viele merken, dass dann auch die Konzentration nachlässt. Viele Ratgeber empfehlen deshalb, mehrmals am Tag ein paar Minuten lang das Fenster weit zu öffnen, statt es dauerhaft zu kippen. Die kurze Pause ist dafür der ideale Moment: Fenster auf, Timer starten, beim Signal wieder schließen.",
      },
      {
        heading: "Nur fünf Minuten, dann schaust du weiter",
        body: "Wenn eine Aufgabe seit Tagen liegen bleibt, hilft ein bewusst kleiner Anfang. Starte den Timer und arbeite nur bis zum Signal daran. Das senkt die Hürde, und oft läuft es danach von selbst weiter. Wenn nicht, hast du immerhin angefangen, und der nächste Versuch fällt leichter.",
      },
    ],
    faq: [
      {
        q: "Was kommt nach der vierten Pomodoro-Einheit?",
        a: "Eine lange Pause statt der kurzen, je nach Tagesform eine Viertelstunde oder länger. Dafür gibt es den Timer für 15 Minuten.",
      },
      {
        q: "Kann ich einen Hintergrundklang abspielen?",
        a: "Ja. Unter dem Timer stehen Regen, Wald, Kaminfeuer, Café und Lo-fi zur Wahl, auch mehrere gleichzeitig. Der Klang pausiert mit dem Timer und stoppt am Ende.",
      },
      {
        q: "Was passiert, wenn die Zeit abgelaufen ist?",
        a: "Ein Signal ertönt, und der Timer springt zurück auf 05:00, bereit für die nächste Pause.",
      },
      {
        q: "Muss ich in der Pause aufstehen?",
        a: "Es lohnt sich. Wer sitzen bleibt, landet schnell wieder am Bildschirm. Schon ein paar Schritte und ein Blick aus dem Fenster unterbrechen die Arbeit spürbarer.",
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
      "Kostenloser 10-Minuten-Timer: für das Feierabend-Ritual, eine kurze Meditation oder die Pause nach 50 Minuten Arbeit. Startet mit einem Klick.",
    h1: "Timer 10 Minuten",
    intro:
      "Dieser Timer läuft zehn Minuten und meldet sich mit einem Signal. Zehn Minuten sind lang genug, um wirklich abzuschalten oder etwas Kleines komplett zu erledigen, und kurz genug, um sie in jeden Tag zu passen.",
    useCases: [
      "Das Feierabend-Ritual: aufräumen und den nächsten Tag vorbereiten.",
      "Eine kurze Meditation oder Atemübung.",
      "Notizen noch einmal durchgehen, bevor die Vorlesung beginnt.",
      "Die Pause nach 50 Minuten Arbeit.",
      "Eine Runde um den Block in der Mittagspause.",
    ],
    sections: [
      {
        heading: "Zehn Minuten für einen sauberen Feierabend",
        body: "Wer im Homeoffice arbeitet, kennt das Problem: Der Arbeitstag hört nicht auf, er franst aus. Ein festes Ritual von zehn Minuten hilft, einen klaren Schlussstrich zu ziehen. Offene Tabs schließen, die erste Aufgabe für morgen aufschreiben, den Schreibtisch freiräumen. Wenn das Signal kommt, ist Feierabend, und der Kopf weiß das auch.",
      },
      {
        heading: "Zehn Minuten für den Kopf",
        body: "Für den Einstieg in die Meditation sind zehn Minuten eine angenehme Länge. Wähle Regen oder Wald als Hintergrundklang, starte den Timer, schließ die Augen und überlass dem Signal das Zeitgefühl, statt zwischendurch auf die Uhr zu schauen. Eine einfache Anleitung findest du im Artikel über Meditation in den Pomodoro-Pausen.",
      },
      {
        heading: "Die Pause im 50/10-Rhythmus",
        body: "Wer in längeren Blöcken arbeitet, etwa 50 Minuten am Stück, braucht danach mehr als fünf Minuten Pause. Der 50/10-Rhythmus ist eine verbreitete Variante der Pomodoro-Technik: Das Verhältnis von Arbeit zu Pause bleibt ungefähr gleich, die Pause reicht aber für einen Kaffee in der Küche oder einen kurzen Gang nach draußen.",
      },
    ],
    faq: [
      {
        q: "Ist der Timer kostenlos?",
        a: "Ja. Kein Konto, keine Werbung, nichts zu installieren.",
      },
      {
        q: "Kann ich den Timer im Vollbild zeigen, etwa im Unterricht?",
        a: "Ja, sofern der Browser es erlaubt: Der Vollbild-Button vergrößert den Countdown, mit der Esc-Taste kommst du zurück. Auf dem iPhone bieten Browser kein Vollbild für Webseiten an, dort erscheint der Button nicht.",
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
      "Kostenloser 15-Minuten-Timer: die lange Pomodoro-Pause, ein Powernap oder eine Ruhepause nach Arbeitszeitgesetz, mit Signal am Ende.",
    h1: "Timer 15 Minuten",
    intro:
      "Eine Viertelstunde, heruntergezählt, mit Signal am Ende. Fünfzehn Minuten sind das untere Ende der langen Pause, die bei der Pomodoro-Technik nach vier Arbeitseinheiten kommt, und genau richtig für einen Powernap, der dich nicht benommen zurücklässt.",
    useCases: [
      "Die lange Pause nach vier Pomodoro-Einheiten.",
      "Ein Powernap am frühen Nachmittag.",
      "Eine Ruhepause, die auch nach Arbeitszeitgesetz zählt.",
      "Einen Vortrag oder eine Präsentation zeitlich proben.",
      "Eine kleine, klar umrissene Aufgabe von Anfang bis Ende.",
    ],
    sections: [
      {
        heading: "Die Viertelstunde im Arbeitszeitgesetz",
        body: "Das deutsche Arbeitszeitgesetz schreibt Angestellten bei mehr als sechs Stunden Arbeit mindestens 30 Minuten Ruhepause vor, die in Abschnitte von jeweils mindestens 15 Minuten aufgeteilt werden dürfen. Eine Viertelstunde ist also die kürzeste Pause, die rechtlich als Ruhepause zählt. Wer seine Pausen gern aufteilt, kann zwei Mal den 15-Minuten-Timer nehmen.",
      },
      {
        heading: "Ein Powernap ohne Nachwirkungen",
        body: "Kurze Nickerchen von etwa 10 bis 20 Minuten werden oft empfohlen, weil sie enden, bevor du in den Tiefschlaf rutschst, aus dem das Aufwachen schwerfällt. Leg dich hin, starte den Timer und lass dich vom Signal wecken. Auf dem Handy lass die Seite geöffnet: Solange der Timer läuft, hält sie den Bildschirm wach, sofern dein Browser das unterstützt.",
      },
      {
        heading: "Die lange Pause richtig nutzen",
        body: "Nach vier Einheiten ist die lange Pause fällig, und sie sollte sich auch so anfühlen. Iss etwas, geh ans Tageslicht, sprich mit jemandem, der nicht über die Arbeit reden will. Was sich nicht eignet: die Zeit mit Nachrichten-Apps zu füllen. Die Viertelstunde ist dann zwar vorbei, aber erholt hat sich der Kopf nicht.",
      },
    ],
    faq: [
      {
        q: "Wie lang sollte ein Powernap sein?",
        a: "Meist werden 10 bis 20 Minuten empfohlen. Plane ein paar Minuten zum Einschlafen ein, eine Viertelstunde auf dem Timer passt deshalb gut.",
      },
      {
        q: "Funktioniert der Timer auf dem Handy?",
        a: "Ja, im mobilen Browser, ohne App. Lass die Seite geöffnet; während der Timer läuft, hält sie den Bildschirm wach, wo der Browser das erlaubt.",
      },
      {
        q: "Kann ich pausieren und weitermachen?",
        a: "Ja. Pause hält die Restzeit fest, Weiter setzt dort fort. Zurücksetzen oder das Ende des Countdowns stellt wieder 15 Minuten ein.",
      },
      {
        q: "Zählt die lange Pomodoro-Pause als Ruhepause?",
        a: "Wenn sie mindestens 15 Minuten dauert, im Voraus feststeht und du in dieser Zeit wirklich nicht arbeitest, kann sie als Ruhepause im Sinne des Arbeitszeitgesetzes gelten. Kurzpausen von fünf Minuten zählen dafür nicht. Im Zweifel klären das Arbeitsvertrag oder Betriebsrat.",
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
      "Kostenloser 20-Minuten-Timer für kurze Lerneinheiten, Karteikarten und Lernen zu zweit. Mit 5-Minuten-Pause, ohne Anmeldung.",
    h1: "Timer 20 Minuten",
    intro:
      "Zwanzig Minuten Fokus, dann fünf Minuten Pause: Beim Signal springt der Timer auf die 5-Minuten-Pause, ein Klick auf Start genügt. Eine etwas kürzere Einheit als der klassische Pomodoro, gut geeignet, wenn du unkonzentriert bist oder eine Aufgabe dir schwer im Magen liegt.",
    useCases: [
      "Karteikarten oder Vokabeln in einer festen Runde.",
      "Lernen zu zweit, beide mit demselben Takt.",
      "Ein sanfter Einstieg am Montagmorgen.",
      "Hausaufgaben in überschaubaren Etappen.",
      "Ein Zirkeltraining oder eine Dehnroutine.",
    ],
    sections: [
      {
        heading: "Kürzer anfangen, länger durchhalten",
        body: "Die 25 Minuten der Pomodoro-Technik sind eine Konvention. Wer nach einer Viertelstunde regelmäßig gedanklich abdriftet, fährt mit 20 Minuten oft besser: Eine Einheit, die du zu Ende bringst, zählt mehr als eine längere, die du abbrichst. Bei Konzentrationsschwierigkeiten, etwa mit ADHS, kann eine kürzere Einheit den Einstieg erleichtern. Wenn es gut läuft, verlängerst du später.",
      },
      {
        heading: "Zwanzig Minuten Karteikarten",
        body: "Mit Karteikarten zu lernen, funktioniert am besten in kurzen, regelmäßigen Runden statt in einer langen Sitzung. Zwanzig Minuten reichen für einen Stapel, inklusive der Karten, die du zurücklegen musst. Danach fünf Minuten Pause, dann der nächste Stapel oder ein anderes Fach. So bleibt die Abfrage aktiv, statt in ein müdes Durchblättern überzugehen.",
      },
      {
        heading: "Im gleichen Takt mit anderen",
        body: "Gemeinsam lernen oder arbeiten klappt besser, wenn alle denselben Rhythmus haben. Verabredet euch auf 20 Minuten Fokus und 5 Minuten Pause, jede Person startet den Timer zur gleichen Zeit, und in der Pause wird geredet, vorher nicht. Dieses Prinzip heißt Body Doubling und hilft vielen, dranzubleiben.",
      },
    ],
    faq: [
      {
        q: "Reichen 20 Minuten, um sich zu konzentrieren?",
        a: "Für viele Aufgaben ja: genug Zeit, um reinzukommen und voranzukommen, und kurz genug, um ohne großen Widerstand anzufangen.",
      },
      {
        q: "Was macht der Link zur vollständigen App?",
        a: "Er öffnet Pomodorian und stellt deine gespeicherte Fokusdauer auf 20 Minuten, bis du sie in den Einstellungen änderst. Die App bietet zusätzlich eine Aufgabenliste, einen KI-Planer und Fokus-Statistiken.",
      },
      {
        q: "Brauche ich ein Konto oder eine App?",
        a: "Nein. Der Timer läuft direkt im Browser, ohne Anmeldung und ohne Installation. Einen gewählten Hintergrundklang merkt sich dein Browser für den nächsten Besuch.",
      },
      {
        q: "Was, wenn ich beim Signal gerade richtig drin bin?",
        a: "Bring den Gedanken zu Ende und schreib dir den nächsten Schritt auf, aber nimm die Pause trotzdem. Passiert dir das oft, ist es Zeit, auf 25 oder 30 Minuten zu verlängern. Der Pausenmodus lässt sich jederzeit mit einem Klick wieder auf Fokus stellen.",
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

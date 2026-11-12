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
  // Week 3 (2026-11-12).
  {
    slug: "timer-25-minuten",
    lang: "de",
    minutes: 25,
    role: "focus",
    breakMinutes: 5,
    label: "25-Minuten",
    title: "Timer 25 Minuten: Kostenloser Pomodoro-Countdown",
    description:
      "Der klassische 25-Minuten-Timer der Pomodoro-Technik, mit 5 Minuten Pause. Für Abschlussarbeit, Großraumbüro und das Schätzen von Aufgaben.",
    h1: "Timer 25 Minuten",
    intro:
      "Ein Pomodoro dauert 25 Minuten, so hat es Francesco Cirillo Ende der 1980er-Jahre mit einer Küchenuhr in Tomatenform festgelegt. Dieser Timer zählt genau eine solche Einheit herunter und bietet danach die kurze Pause von fünf Minuten an.",
    useCases: [
      "Ein klassischer Pomodoro: 25 Minuten an genau einer Aufgabe.",
      "Die Bachelor- oder Masterarbeit Absatz für Absatz.",
      "Konzentriert arbeiten im Großraumbüro.",
      "Aufgaben in Pomodoros schätzen und nachmessen.",
      "Eine Lernrunde vor der Klausur.",
    ],
    sections: [
      {
        heading: "Die Abschlussarbeit in Pomodoros",
        body: "Eine Bachelor- oder Masterarbeit lähmt oft gerade durch ihre Größe. In Pomodoros wird sie zählbar: Statt „heute an der Arbeit sitzen“ heißt das Ziel „sechs Pomodoros für Kapitel 3“. Notiere vor jeder Einheit den nächsten konkreten Schritt, etwa eine Quelle auswerten oder einen Absatz überarbeiten, und streiche ihn danach ab. So siehst du am Abend, was du geschafft hast.",
      },
      {
        heading: "Pomodoro im Großraumbüro",
        body: "Im Großraumbüro ist die größte Gefahr nicht der eigene Kopf, sondern die Frage vom Nebentisch. Vereinbare mit dem Team ein einfaches Zeichen, zum Beispiel: Kopfhörer auf heißt gerade Fokus. Rückfragen sammelst du für die Pause. Die meisten Anliegen können fünfundzwanzig Minuten warten, und du beantwortest sie dann gebündelt statt verstreut über den Vormittag.",
      },
      {
        heading: "Aufgaben in Pomodoros schätzen",
        body: "Zur ursprünglichen Methode gehört, vorher zu schätzen, wie viele Pomodoros eine Aufgabe braucht, und es danach mit der echten Zahl zu vergleichen. Das wirkt pedantisch, schult aber den Blick: Nach ein paar Wochen weißt du, dass ein Bericht eben nicht zwei, sondern fünf Einheiten frisst, und planst deine Tage entsprechend realistischer.",
      },
    ],
    faq: [
      {
        q: "Was gilt als Unterbrechung?",
        a: "Nach Cirillos Methode ist ein Pomodoro unteilbar: Wenn du die Aufgabe wechselst oder dich ablenken lässt, zählt die Einheit nicht und du beginnst neu. Kurze Notizen zu Störgedanken sind erlaubt.",
      },
      {
        q: "Was mache ich mit Gedanken, die während der Einheit auftauchen?",
        a: "Schreib sie kurz auf einen Zettel neben dir und arbeite weiter. In der Pause entscheidest du, was davon wirklich wichtig ist.",
      },
      {
        q: "Muss es eine Küchenuhr sein?",
        a: "Nein. Für Cirillo war das Aufziehen der Tomatenuhr ein kleines Startritual. Heute erfüllt der Klick auf Start dieselbe Aufgabe.",
      },
      {
        q: "Läuft der Countdown weiter, wenn ich den Tab verlasse?",
        a: "Ja, die Restzeit stimmt beim Zurückkehren immer. Im Hintergrund kann manch ein Browser das Signal um bis zu eine Minute verzögern, außer es läuft ein Hintergrundklang.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-technik-leitfaden-anfaenger",
      "kontextwechsel-kosten-entwickler",
      "homeoffice-fokussiert-bleiben",
    ],
    published: "2026-11-12",
  },
  {
    slug: "timer-30-minuten",
    lang: "de",
    minutes: 30,
    role: "focus",
    breakMinutes: 5,
    label: "30-Minuten",
    title: "Timer 30 Minuten: Kostenloser Countdown mit Pause",
    description:
      "Kostenloser 30-Minuten-Timer mit 5 Minuten Pause: für die halbe Stunde Bewegung nach WHO, den Papierkram am Stück oder feste E-Mail-Zeiten.",
    h1: "Timer 30 Minuten",
    intro:
      "Start drücken, dreißig Minuten laufen lassen, beim Signal aufhören. Eine halbe Stunde reicht für eine Trainingseinheit, für einen Stapel Formulare oder für den Posteingang, wenn du ihn nicht den ganzen Tag offen haben willst.",
    useCases: [
      "Eine halbe Stunde Bewegung am Tag.",
      "Papierkram und Steuerunterlagen am Stück erledigen.",
      "Feste Zeiten für den Posteingang.",
      "Eine Fokuseinheit mit 5 Minuten Pause.",
      "Eine Lernrunde am Abend, nicht länger.",
    ],
    sections: [
      {
        heading: "Eine halbe Stunde Bewegung",
        body: "Die Weltgesundheitsorganisation empfiehlt Erwachsenen mindestens 150 Minuten moderate Bewegung pro Woche. Auf fünf Tage verteilt sind das etwa dreißig Minuten am Tag: zügig spazieren, Rad fahren, eine kurze Einheit zu Hause. Mit dem Timer hat die halbe Stunde einen klaren Anfang und ein klares Ende, und genau das macht es leichter, sie wirklich durchzuziehen.",
      },
      {
        heading: "Papierkram in einem Block",
        body: "Steuerunterlagen, Formulare, Rechnungen für die Ablage: Papierkram hat die Eigenschaft, sich über ein ganzes Wochenende zu verteilen. Gib ihm eine halbe Stunde, starte den Timer und arbeite bis zum Signal. Was dann noch offen ist, kommt in den nächsten Block, aber der Rest des Tages gehört wieder dir.",
      },
      {
        heading: "Feste Zeiten für den Posteingang",
        body: "Ein ständig offenes Mailprogramm zerlegt den Tag in kleine Stücke. Lege dir stattdessen feste Mail-Zeiten fest, etwa vormittags und am späten Nachmittag, und gib jeder davon dreißig Minuten. Dazwischen bleibt das Programm zu. Beim Signal ist Schluss, auch wenn noch Mails ungelesen sind: Wirklich Dringendes erreicht dich ohnehin auf anderem Weg.",
      },
    ],
    faq: [
      {
        q: "Zählen auch kürzere Bewegungseinheiten?",
        a: "Ja. Nach den aktuellen Empfehlungen der WHO zählt jede Bewegung. Wenn eine halbe Stunde am Stück nicht passt, helfen auch mehrere kürzere Einheiten über den Tag.",
      },
      {
        q: "Funktioniert der Timer auch auf dem Handy, zum Beispiel beim Sport?",
        a: "Ja, im mobilen Browser. Lass die Seite offen: Während der Timer läuft, hält sie den Bildschirm wach, sofern dein Browser das unterstützt.",
      },
      {
        q: "Kann ich zwei Einheiten ohne Pause hintereinander machen?",
        a: "Besser nicht, denn die Pause ist Teil der Methode. Wenn sie dich regelmäßig aus der Arbeit reißt, probier lieber längere Blöcke von 45 oder 50 Minuten mit entsprechend längerer Pause.",
      },
      {
        q: "Wie oft am Tag sollte ich Mails abrufen?",
        a: "So oft, wie deine Arbeit es wirklich verlangt. Für viele Tätigkeiten reichen zwei oder drei feste Zeiten, für Support oder Vertrieb sind es mehr. Wichtig ist, dass du es entscheidest und nicht das Postfach.",
      },
    ],
    relatedArticleSlugs: [
      "homeoffice-fokussiert-bleiben",
      "kontextwechsel-kosten-entwickler",
      "beste-ambient-sounds-konzentrieren",
    ],
    published: "2026-11-12",
  },
  {
    slug: "timer-45-minuten",
    lang: "de",
    minutes: 45,
    role: "focus",
    breakMinutes: 15,
    label: "45-Minuten",
    title: "Timer 45 Minuten: Countdown wie eine Schulstunde",
    description:
      "Kostenloser 45-Minuten-Timer mit 15 Minuten Pause, so lang wie eine Schulstunde. Für Lernen nach Stundenplan, Doppelstunden und Nachhilfe.",
    h1: "Timer 45 Minuten",
    intro:
      "Fünfundvierzig Minuten kennt in Deutschland jede und jeder aus der Schule: So lang dauert eine Schulstunde, zwei davon ergeben eine Doppelstunde. Dieser Timer zählt eine solche Stunde herunter und bietet danach eine Pause von fünfzehn Minuten an.",
    useCases: [
      "Zu Hause lernen nach eigenem Stundenplan.",
      "Eine Doppelstunde in zwei Hälften mit Pause dazwischen.",
      "Eine Nachhilfestunde mit klarem Ende.",
      "Eine Übungsklausur von einer Schulstunde.",
      "Den Unterricht im Klassenzimmer sichtbar takten.",
    ],
    sections: [
      {
        heading: "Lernen nach eigenem Stundenplan",
        body: "Die Schulstunde von 45 Minuten ist eine Konvention, an die sich viele seit der Grundschule gewöhnt haben. Genau das macht sie nützlich: Ein 45-Minuten-Block fühlt sich vertraut an und nicht wie eine Prüfung der eigenen Disziplin. Wer zu Hause lernt, kann den Tag wie einen Stundenplan aufbauen, mit einem festen Fach pro Block.",
      },
      {
        heading: "Die Doppelstunde zu Hause",
        body: "In der Schule werden 90 Minuten oft am Stück durchgezogen. Zu Hause musst du das nicht: Zwei Blöcke von 45 Minuten mit einer Pause dazwischen fallen vielen leichter. Nimm nach dem ersten Block die Pause; wenn sie abgelaufen ist, stell auf „Timer 45 min“ zurück und starte die zweite Hälfte.",
      },
      {
        heading: "Nachhilfe mit klarem Ende",
        body: "Eine Nachhilfestunde verliert schnell ihren Rahmen, wenn niemand auf die Uhr schaut. Mit dem Timer gut sichtbar auf dem Tisch weiß das Kind, wie lange es noch dauert, und die Lehrkraft kann planen: der Hauptteil für das schwierige Thema, die letzten Minuten dafür, gemeinsam festzuhalten, was bis zum nächsten Mal geübt wird.",
      },
    ],
    faq: [
      {
        q: "Sind 45 Minuten zu lang zum Konzentrieren?",
        a: "Nicht unbedingt, wenn du die Aufgabe verstehst. Fällt es dir schwer, starte mit 25 oder 30 Minuten und verlängere schrittweise.",
      },
      {
        q: "Kann ich die Pause auf fünf Minuten verkürzen?",
        a: "Der Pausenmodus dauert hier 15 Minuten. Für eine kürzere Pause öffne den 5-Minuten-Timer in einem zweiten Tab.",
      },
      {
        q: "Kann ich den Timer im Klassenzimmer groß anzeigen?",
        a: "Ja, wo der Browser es erlaubt: Der Vollbild-Button vergrößert den Countdown, mit der Esc-Taste geht es zurück. Auf dem iPhone fehlt der Button, weil Browser dort kein Vollbild für Webseiten anbieten.",
      },
      {
        q: "Gibt es Schulen mit anderen Stundenlängen?",
        a: "Ja, manche Schulen arbeiten mit längeren Blöcken, etwa 60 oder 90 Minuten. Für eine volle Stunde gibt es den Timer für 1 Stunde.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-technik-leitfaden-anfaenger",
      "ultradiane-rhythmen-fokus-zyklen",
      "pomodoro-adhs",
    ],
    published: "2026-11-12",
  },
  {
    slug: "timer-1-stunde",
    lang: "de",
    minutes: 60,
    role: "focus",
    breakMinutes: 10,
    label: "Ein-Stunden",
    title: "Timer 1 Stunde: Kostenloser 60-Minuten-Countdown",
    description:
      "Kostenloser Timer für eine Stunde mit 10 Minuten Pause: für eine geblockte Fokusstunde, eine Sprechstunde fürs Team oder die tägliche Übungsstunde.",
    h1: "Timer 1 Stunde",
    intro:
      "Sechzig Minuten, angezeigt als 1:00:00, mit einer Pause von zehn Minuten daneben. Eine Stunde ist die Einheit für alles, was einen festen Platz im Tag braucht: konzentrierte Arbeit ohne Störung, eine Sprechstunde für andere oder das Üben am Instrument.",
    useCases: [
      "Eine im Kalender geblockte Fokusstunde.",
      "Eine Sprechstunde, in der das Team Fragen bündelt.",
      "Die tägliche Übungsstunde am Instrument.",
      "Eine Lernstunde mit anschließender Pause.",
      "Eine Probeklausur von einer Stunde.",
    ],
    sections: [
      {
        heading: "Die Fokusstunde im Kalender",
        body: "Wer seinen Kalender anderen überlässt, findet darin selten eine ungestörte Stunde. Blocke sie dir selbst, am besten vor dem ersten Termin, und behandle sie wie ein Meeting mit dir selbst. Der Timer sorgt dafür, dass die Stunde auch endet: Beim Signal ist Schluss, statt dass der Fokusblock unbemerkt in die Mittagspause wächst.",
      },
      {
        heading: "Eine Sprechstunde fürs Team",
        body: "Ärztinnen und Professoren haben Sprechstunden, warum nicht auch du? Wenn Kolleginnen und Kollegen ständig mit kleinen Fragen kommen, biete eine feste Stunde am Tag an, in der du für sie da bist, und bitte darum, alles andere bis dahin zu sammeln. Der Timer markiert Anfang und Ende, und die übrigen Stunden gehören wieder deiner eigenen Arbeit.",
      },
      {
        heading: "Die Übungsstunde am Instrument",
        body: "Eine Stunde Üben wird ergiebiger, wenn sie eine Struktur hat: einige Minuten Einspielen, dann der Hauptteil mit der schwierigen Stelle, am Ende ein Durchlauf des ganzen Stücks. Mit dem Countdown im Blick verteilst du die Zeit bewusster, statt die schönen Passagen immer wieder zu spielen und die schwierigen aufzuschieben.",
      },
    ],
    faq: [
      {
        q: "Was tun, wenn ich nach 40 Minuten abschweife?",
        a: "Steh kurz auf, trink etwas und mach weiter. Passiert dir das regelmäßig, ist die Stunde für diese Aufgabe zu lang: Versuch es mit 45 oder 50 Minuten. Ein Block, den du schaffst, bringt mehr als einer, gegen den du ankämpfst.",
      },
      {
        q: "Kann ich die Stunde unterbrechen, wenn jemand anruft?",
        a: "Ja. Pause hält die Restzeit fest, mit Weiter geht es dort weiter. Besser ist es natürlich, das Telefon für die Stunde stummzuschalten und Rückrufe in die Pause zu legen.",
      },
      {
        q: "Was macht der Link zur App?",
        a: "Er öffnet Pomodorian und stellt deine gespeicherte Fokusdauer auf 60 Minuten. Die Pause bleibt die aus deinen Einstellungen, und du kannst beides jederzeit ändern.",
      },
    ],
    relatedArticleSlugs: [
      "ultradiane-rhythmen-fokus-zyklen",
      "kontextwechsel-kosten-entwickler",
      "homeoffice-fokussiert-bleiben",
    ],
    published: "2026-11-12",
  },
];

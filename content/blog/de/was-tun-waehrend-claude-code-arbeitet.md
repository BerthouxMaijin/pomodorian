---
title: "Was tun, während Claude Code arbeitet? Ein Workflow"
description: "Die ehrlichsten Antworten von Reddit, was die Aufmerksamkeitsforschung zur Agenten-Wartezeit sagt, und ein Claude-Code-Workflow für deinen Fokus."
date: "2026-08-10"
updated: "2026-08-10"
readTime: "10 min"
author: "Jean-Baptiste Berthoux"
keywords:
  - claude code workflow
  - was tun während claude code arbeitet
  - ki agent wartezeit
  - kontextwechsel entwickler
status: published
translationKey: what-to-do-while-claude-code-is-working
sources:
  - "https://ics.uci.edu/~gmark/chi08-mark.pdf"
  - "https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399"
  - "https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/"
  - "https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/"
  - "https://xkcd.com/303/"
---

Die kurze Antwort: Bleib in der Aufgabe. Die beste Nutzung der Minuten, in denen Claude Code arbeitet, ist das Prüfen dessen, was der Agent gerade produziert hat, das Lesen seiner Begründungen und das Schreiben des nächsten Prompts. Die schlechteste Nutzung, da sind sich die Entwickler, die es probiert haben, und vier Jahrzehnte Aufmerksamkeitsforschung einig, ist der Sprung in ein anderes Projekt, „nur für eine Minute".

Diese Antwort verdient eine Erklärung, denn die Wartezeit selbst ist neu. Agentische Coding-Tools laufen inzwischen zwischen dreißig Sekunden und zwei Stunden autonom, und eine ganze Generation von Entwicklern entdeckt ein Problem wieder, das mit den langsamen Compilern ausgestorben schien. 2026 ist „Was macht ihr, während Claude Code arbeitet?" zu einer der am häufigsten wiederkehrenden Fragen in den Coding-Subreddits geworden, und Google Trends zeigt die Suchanfrage in weniger als einem Jahr von null auf einen senkrechten Ausschlag. Ich entwickle [Pomodorian](https://pomodorian.app), einen Fokus-Timer, habe an dieser Frage also ein offensichtliches Interesse; ich markiere die Stelle, an der das Produkt ins Spiel kommt, und alles davor steht für sich.

## Die neue Kompilier-Pause

Jeder Entwickler kennt [xkcd Nr. 303](https://xkcd.com/303/): zwei Programmierer fechten auf Bürostühlen, weil „es kompiliert!" die einzige legitime Ausrede war, nicht zu arbeiten. Die Agenten-Wartezeit ist dieselbe tote Zeit, mit drei Unterschieden, die sie schwerer statt leichter handhabbar machen.

Erstens die Frequenz. Ein langsamer Build unterbrach dich ein paar Mal am Tag; eine agentische Session kann dir alle paar Minuten eine Wartezeit bescheren, immer wenn sie einen Schritt abschließt oder eine Freigabe braucht. Zweitens die Unvorhersehbarkeit: Ein Lauf kann nach vierzig Sekunden oder nach vierzig Minuten enden, und du weißt selten vorher, was von beidem. Drittens, und am wichtigsten: Du bist nicht wirklich frei. Der Agent braucht vielleicht eine Freigabe, driftet vielleicht von der Spezifikation ab oder ist fertig und steht still, während dein Schwung verpufft. Ein Thread auf r/ClaudeAI hat das im Februar 2026 präzise benannt: das Paradox „kann nicht weg, kann mich nicht konzentrieren".

Diese Kombination, häufige, unvorhersehbare, halb beaufsichtigte Lücken, ist eine wirklich neue Form von Arbeitszeit. Sie als Freizeit zu behandeln verschwendet sie; sie als Arbeitszeit zu behandeln brennt dich aus. Sie braucht einen eigenen Workflow.

## Was Entwickler wirklich tun: Feldnotizen aus Reddit

Die Frage wird immer wieder gestellt, weil niemand mit der eigenen Antwort zufrieden ist. Über die wiederkehrenden Threads auf [r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/) hinweg (die Ausgabe vom Februar 2026 kam auf über hundert Upvotes) verteilen sich die Antworten auf drei Lager.

**Das ehrliche Lager.** Kaffee, E-Mails und, wie u/Formal_Bat_3109 es formuliert, „most importantly, go to Reddit". Ein Nutzer antwortet schlicht „Pushups". Ein anderer lässt auf dem zweiten Monitor Football Manager laufen. Der Beitrag von u/dbbk: „Stare into middle distance". u/Luke_thePuke berichtet, seine Frau habe die Leerlaufminuten bemerkt und angefangen, ihm Hausarbeiten zuzuteilen. Der Autor des Threads gibt zu, dass Reddit bereits seine Standardantwort ist und er etwas Besseres braucht.

**Das systematische Lager.** Diese Antworten konvergieren auffallend konsequent:

- **Den Output prüfen.** u/Sponge8389 verbringt die Wartezeit damit, generierten Code zu reviewen oder den Prompt für die nächste Session zu schreiben.
- **Die Begründungen des Agenten lesen.** u/DifferenceTimely8292 nennt das Reasoning-Log eine großartige Lektüre und eine Lektion in Problemzerlegung, und andere bestätigen, dass es die am meisten unterschätzte Nutzung der Lücke ist.
- **Parallele Sessions am selben Projekt.** u/taldbek hält mehrere Editor-Arbeitsbereiche offen: Während ein Agent arbeitet, füttert er den nächsten. Der Autor des [Januar-Threads](https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/) fährt 2 bis 3 Sessions auf demselben Repo und warnt ausdrücklich vor dem anderen Repo: Er hat versucht, Wartezeiten mit Aufgaben aus anderen Projekten zu füllen, und kam zu dem Schluss, dass es ein Fehler war, der seinen Flow ruiniert und seine Energie aufgezehrt hat.
- **In Batches planen.** u/catalan-93 gruppiert seine To-do-Liste nach Themen, damit verwandte Aufgaben zusammen laufen, was die Wechsel nach seiner Erfahrung weniger schmerzhaft macht.
- **Benachrichtigen lassen statt babysitten.** Manche leiten Claude-Code-Updates über Sprachausgabe oder Telegram, um sich ohne Nervosität entfernen zu können.

**Das Bastler-Lager.** Mein Favorit: u/hotcoolhot hat sich einen kleinen Hardware-Session-Monitor gebaut (ein Mikrocontroller mit rundem Display), den er mit in die Küche nimmt, um den Status seines Agenten im Blick zu behalten, während er sich einen Snack macht. Eine extreme Antwort, aber auch das ganze Problem in einem Bild: Die Agenten-Wartezeit erzeugt das Bedürfnis, *den Zustand der eigenen Zeit* auf einen Blick zu sehen.

## Warum „ich mach solange was anderes" nach hinten losgeht

Die verlockendste Antwort, Agenten-Wartezeiten mit einem zweiten Projekt zu füllen, ist genau die, vor der die erfahrenen Nutzer warnen. Die Forschung erklärt, warum sie recht haben.

In einer 2009 veröffentlichten Versuchsreihe zeigte Sophie Leroy, damals an der University of Minnesota, dass beim Aufgabenwechsel mit unerledigter erster Aufgabe ein Teil der Aufmerksamkeit an ihr hängen bleibt. Sie nannte den Effekt [Attention Residue](https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399): Die Leistung in der zweiten Aufgabe sinkt, und je stärker der Rückstand, desto schlechter das Ergebnis. Ein Agentenlauf ist der Lehrbuch-Auslöser, denn deine erste Aufgabe ist per Definition unerledigt, während Claude arbeitet, und du erwartest, zu einem unvorhersehbaren Zeitpunkt zurückgerufen zu werden.

Die Feldforschung zeigt in dieselbe Richtung. Bei der minutengenauen Beobachtung von Büroangestellten stellten [Gloria Mark und ihre Kollegen an der UC Irvine fest](https://ics.uci.edu/~gmark/chi08-mark.pdf), dass unterbrochene Arbeit real kostet: Nach einer nennenswerten Unterbrechung brauchten Menschen im Schnitt rund 23 Minuten, um zur ursprünglichen Aufgabe zurückzukehren, meist mit einem Umweg über zwei andere Aufgaben, und kompensierten mit schnellerem Arbeiten zum Preis von mehr Stress und Frust. Ihre neueren Daten ergänzen, dass die durchschnittliche Zeit auf einem Bildschirm vor dem nächsten Wechsel auf unter eine Minute gefallen ist. Was ständige Wechsel Entwickler konkret kosten, haben wir in einem [eigenen Artikel über Kontextwechsel](/blog/de/kontextwechsel-kosten-entwickler) aufgeschlüsselt.

Reddit-Konsens und Literatur sind sich beim Mechanismus einig: Das Problem der Agenten-Wartezeit ist nicht der Leerlauf, sondern der Wechsel. Das Ziel eines Workflows ist also nicht, die Lücke zu füllen, sondern dein Arbeitsgedächtnis auf einem einzigen Projekt geladen zu halten, während der Agent seinen Teil erledigt.

## Ein Protokoll je nach Länge der Wartezeit

Hier ist das Protokoll, das aus den Erfahrungsberichten und der Forschung folgt. Die Grundregel: Schätze die Wartezeit ein und passe deine Reaktion an.

1. **Unter etwa 2 Minuten: nicht bewegen.** Bleib auf der Session. Sieh dem Diff zu, überfliege die Begründungen. Irgendwohin zu wechseln, selbst in einen Browser-Tab, bringt nichts und kostet Rückstand.
2. **2 bis 10 Minuten: im Projekt bleiben, Flughöhe wechseln.** Das ist das goldene Zeitfenster für Arbeit im selben Kontext: den letzten Output gründlich reviewen, die Spezifikation schärfen, den nächsten Prompt schreiben, die Aufgabenliste aktualisieren, die Tests prüfen. Gleiches Projekt, andere Flughöhe. Hier passt auch eine zweite Session auf dem *selben Repo* hinein, wenn du Agenten parallel fährst, wie es die erfahrenen Nutzer tun; der geteilte Kontext hält die Reviews günstig.
3. **Über 10 Minuten oder ein autonomer Lauf: mach eine echte Pause, und schütze sie.** Richte eine Benachrichtigung ein (ein Ton, ein TTS-Hook, eine Telegram-Brücke), damit der Agent dich erreichen kann, und verlasse den Bildschirm. Bewegung schlägt Scrollen: Die Antwort „Pushups" ist bessere Kognitionswissenschaft, als sie aussieht, und in unseren [Never-Dumb-Pausen](/blog/de/never-dumb-pausen) steckt dieselbe Idee. Wenn du mit Kollegen arbeitest, mach es wie das Büro eines Kommentators: Synchronisiert eure Agentenläufe, damit die Wartezeiten zusammenfallen; das ist [Body Doubling](/blog/body-doubling) für agentisches Coding.
4. **Freigaben bündeln.** Wenn deine Session vor allem schnelle Bestätigungen braucht, schwebe nicht daneben. Lass sie sich ein paar Minuten ansammeln und arbeite sie in einem Durchgang ab.
5. **Schließe die Schleife, bevor du eine neue öffnest.** Wenn ein Lauf endet: erst reviewen und übernehmen (oder verwerfen), dann den nächsten Prompt starten. Eine offene Schleife ist genau das, was Attention Residue erzeugt; sie zu schließen macht die nächste Wartezeit günstig.

Zwei Anti-Muster, die man beim Namen nennen sollte, weil sie die beiden Standardreflexe sind: **das zweite Projekt** (maximaler Rückstand, der Schritt, den die erfahrenen Nutzer bereuen) und **das endlose Scrollen** (eine „Pause", die dich leerer zurücklässt als die Arbeit). Wenn du eine Sache aus der Forschung mitnimmst: Dein Gegner ist nicht die Wartezeit, sondern der unkontrollierte Wechsel.

## Wo ein Timer ins Spiel kommt

Hier muss ich transparent sein: Pomodorian ist mein Produkt, und dieses Thema hat meine Aufmerksamkeit geweckt, weil die Agenten-Wartezeit strukturell ein Timer-Problem ist. Die Wartezeit ist unsichtbar, unvorhersehbar und fragmentierend; eine sichtbare Uhr ist das günstigste Werkzeug, das wir haben, um Zeit konkret zu machen, aus demselben Grund, aus dem sich ein Entwickler einen physischen Session-Monitor gebaut hat.

In der Praxis funktioniert die Kombination, Agenten-Sessions *innerhalb* von Pomodoro-Intervallen laufen zu lassen statt um sie herum. Ein 25-Minuten-Intervall fasst bequem einen Zyklus aus Prompt, Warten, Review und nächstem Prompt auf einem einzigen Projekt; die Ein-Aufgaben-Regel des Intervalls ist exakt die Regel „gleiches Projekt, andere Flughöhe" von oben, durchgesetzt von einem sichtbaren Countdown. Wenn der Wecker klingelt, nimmst du die Pause, die du dir ohnehin versprochen hattest, weg vom Bildschirm, während der Agent weiterarbeitet. Das leistet jeder Timer; [Pomodorian](https://pomodorian.app) ergänzt einen KI-Planer, der dein Ziel in pomodoro-große Aufgaben zerlegt, was sehr direkt darauf abbildet, eine Warteschlange sauber zugeschnittener Prompts zu füttern. Kostenlos, im Browser, ohne Konto. Falls du mit der Technik neu bist: [unser Pomodoro-Leitfaden für Anfänger](/blog/de/pomodoro-technik-leitfaden-anfaenger) erklärt die Grundlagen.

Der eigentliche Punkt gilt mit jedem Werkzeug: Agentisches Coding beseitigt den Bedarf an konzentrierter Arbeit nicht, es verdichtet ihn. Der Agent schreibt einen wachsenden Teil des Codes; dein Hebel wandert zu Spezifikation, Review und Urteilsvermögen, alles Tätigkeiten, die einen unfragmentierten Kopf belohnen. Die Entwickler, die gut mit der Wartezeit umgehen, sind nicht die, die die beste Ablenkung gefunden haben. Es sind die, die aufgehört haben, sie überhaupt als Ablenkungsfenster zu behandeln.

## Häufige Fragen

### Was soll ich tun, während Claude Code läuft?

Passe die Handlung an die Länge der Wartezeit an. Unter zwei Minuten: auf der Session bleiben und den Output lesen. Zwei bis zehn Minuten: reviewen, die Spezifikation schärfen oder den nächsten Prompt für dasselbe Projekt schreiben. Längere autonome Läufe: eine Fertig-Benachrichtigung einrichten und eine echte Pause ohne Bildschirm machen.

### Kann ich an einem anderen Projekt arbeiten, während der Agent läuft?

Der Konsens der erfahrenen Nutzer und die Forschung sagen nein. Ein Aufgabenwechsel mit einer unerledigten Aufgabe im Flug erzeugt Attention Residue, messbar als schlechtere Leistung in der zweiten Aufgabe und ein teurer Wiedereinstieg in die erste. Wenn du Parallelität willst, starte stattdessen eine zweite Agenten-Session auf demselben Repository; der geteilte Kontext hält die Wechsel günstig.

### Ist es schlimm, während der Agenten-Wartezeit auf Reddit zu scrollen?

Es ist die häufigste Antwort und die unbefriedigendste, nach Aussage derer, die sie geben. Feed-Pausen dehnen sich gern über das Ende des Laufs hinaus und hinterlassen eine stärker fragmentierte Aufmerksamkeit. Eine körperliche Mikropause (bewegen, dehnen, Kaffee machen) stellt mehr wieder her und läuft seltener aus dem Ruder.

### Woher weiß ich, wann Claude Code mich braucht, ohne zuzusehen?

Nutze Benachrichtigungen statt Überwachung: Terminal-Signale oder Hooks, Sprachausgabe-Updates oder eine Telegram/Slack-Brücke, die dich bei Abschluss oder Freigabe-Anfragen anpingt. Community-Projekte und die nativen Hooks von Claude Code decken alle drei Muster ab.

### Funktioniert die Pomodoro-Technik mit KI-Coding-Agenten?

Die beiden passen gut zusammen. Ein Agenten-Zyklus (Prompt, Warten, Review, nächster Prompt) sitzt natürlich in einem 25-Minuten-Fokusintervall auf einem einzigen Projekt, und der sichtbare Countdown des Timers wirkt der formlosen, fragmentierenden Natur der Wartezeiten entgegen. Die Pause kommt danach, weg vom Bildschirm, während der Agent weiterarbeitet.

## Das Wichtigste in Kürze

- Die Agenten-Wartezeit ist die neue Kompilier-Pause, aber häufiger, unberechenbarer und nur halb frei; sie braucht einen bewussten Workflow, keine Standard-Ablenkung.
- Die Antworten aus der Claude-Code-Community konvergieren: Output reviewen, Begründungen lesen, den nächsten Prompt vorbereiten, parallele Sessions auf demselben Repo, Benachrichtigungen statt Babysitten.
- Der eine zu vermeidende Schritt ist der Wechsel in ein anderes Projekt: Attention Residue (Leroy, 2009) und Unterbrechungsforschung (Mark, UC Irvine) zeigen, dass der Wechsel, nicht der Leerlauf, die Konzentration zerstört.
- Schätze die Wartezeit ein: unter 2 Minuten bleiben, wo du bist; 2 bis 10 Minuten gleiches Projekt auf anderer Flughöhe; darüber eine geschützte Pause ohne Bildschirm mit eingerichteter Benachrichtigung.
- Ein sichtbarer Timer macht aus der formlosen Wartezeit strukturierte Zeit; Agenten-Zyklen in Pomodoro-Intervallen laufen zu lassen ist eine natürliche Passung.

# Pages timer : bilan des 4 semaines (29/10 au 19/11/2026)

Décision de JB du 29/10 : 10 pages par semaine pendant 4 semaines, publication automatique, puis « on voit ». Ce rapport est le « on voit ». Stratégie d'origine : `STRATEGIE-MODELE-ALLO-2026-10-29.md`.

## En une phrase

Les pages que Google explore se classent en première page dès la première semaine, mais Google n'en a exploré que 8 sur 30 : le goulot n'est pas le contenu, c'est la découverte. Recommandation : **arrêter de produire de nouvelles pages et débloquer l'indexation** avant toute extension.

## Ce qui a été produit

| Semaine | Pages | Langues |
|---|---|---|
| 1 (29/10) | 10 | EN (5 à 60 min) |
| 2 (05/11) | 10 | 6 EN (1, 2, 3, 35, 90 min, 2 h) + 4 DE |
| 3 (12/11) | 10 | 5 FR + 4 DE + 1 EN (3 h) |
| 4 (19/11) | 10 | 7 ES + 3 FR |

Total : 40 pages outil en 4 langues, 4 pages hub (`/timers`, `/timers/de`, `/timers/fr`, `/timers/es`), hreflang croisé (jusqu'à 4 langues sur la même durée).

Produit, ajouté en route : écran maintenu allumé pendant le décompte, libellés des sons traduits, correction de deux bugs (l'alarme ne sonnait jamais ; le minuteur restait bloqué à 00:00 sur les pages sans pause), rôle « cadre » pour 2 h et plus.

Qualité : chaque salve est passée par le garde-fou automatique, le build, un test navigateur en local puis en production, et 2 ou 3 relectures adversariales. Ces relectures ont attrapé de vrais problèmes à chaque fois : faits faux (Grand oral, code de la route), consignes d'usage fausses, et pages qui reprenaient trop la page d'une autre langue. Toutes les pages publiées ont été corrigées avant leur mise en ligne.

## Indexation Google (inspection d'URL, 19/11)

| État | Pages des semaines 1 à 3 |
|---|---|
| Indexée | `/25-minute-timer`, `/1-hour-timer`, `/1-minute-timer`, `/3-minute-timer`, `/35-minute-timer`, `/2-hour-timer`, `/timer-5-minuten`, `/timer-20-minuten` (8) |
| Découverte, non indexée | `/10-minute-timer`, `/15-minute-timer`, `/40-minute-timer`, `/45-minute-timer`, `/2-minute-timer`, `/90-minute-timer`, `/timer-15-minuten` (7) |
| Inconnue de Google | les 15 autres, dont toutes les pages FR |

Hubs : `/timers` et `/timers/de` indexés, `/timers/fr` inconnu.

Évolution : 2 pages indexées au 12/11, 8 au 19/11. Les 3 premières l'ont été sur demande manuelle de JB, les 5 suivantes via le sitemap, sans demande. L'indexation avance donc seule, mais lentement, environ 3 pages par semaine.

## Performances Google (Search Console, 29/10 au 19/11)

| Page | Impressions | Position | Clics |
|---|---|---|---|
| `/25-minute-timer` | 140 | 10,3 | 2 |
| `/timers` | 110 | 24,8 | 0 |
| `/1-hour-timer` | 74 | 7,4 | 2 |
| `/35-minute-timer` | 16 | 5,9 | 0 |
| `/timers/de` | 12 | 32,5 | 0 |
| `/timer-20-minuten` | 5 | 6,2 | 0 |
| `/2-hour-timer` | 4 | 4,8 | 1 |
| autres | 0 | | 0 |

Total : 5 clics. Lecture par requête :
- `/25-minute-timer` se classe sur les variantes Pomodoro (« 25 minute timer pomodoro » position 8,4, « pomodoro 25 » 8,2), pas encore sur la requête principale « 25 minute timer » (position 20, 2 impressions). Sur les têtes de requête purement « outil », les sites installés (online-stopwatch, vclock) gardent l'avantage pour l'instant.
- `/timers` reçoit surtout la marque (« pomodorian ») et « work timer online » vers la position 53.

## Usage (GA4, visiteurs ayant accepté les cookies, 29/10 au 18/11)

- `tool_timer_started` : 3 personnes (sur `/1-hour-timer`, `/2-hour-timer` et `/25-minute-timer`).
- `tool_to_app_click` : 1 personne, et `focus_preset_applied` : 1 personne (passage réussi vers l'app avec la durée réglée).

Le parcours marche, mais l'échantillon est trop petit pour en tirer un taux.

## Le site dans son ensemble

Clics Google par jour : 12,8 du 1er au 28 octobre, 23 du 1er au 15 novembre (+80 %). Les moteurs sont l'article `best-physical-pomodoro-timer` (142 clics en 3 semaines) et la page d'accueil (47 clics, position 4,7), pas les pages timer.

## Diagnostic

1. **Le contenu n'est pas le problème.** Les 8 pages indexées se placent entre la 5e et la 10e position dès leurs premières impressions.
2. **La découverte est le problème.** Rien ne mène aux minuteurs depuis les pages que Google visite le plus : aucun article de blog ne les lie, et l'accueil seulement via le lien « Timers » du footer. Google en a découvert une partie via le sitemap, mais ne se presse pas pour un site encore peu établi.
3. **Les requêtes principales demandent de l'autorité.** Même indexée, la page 25 minutes est en 20e position sur « 25 minute timer ». Les liens internes aident, mais à terme ce sont des liens externes (brand authority, Phase 4 du plan de juillet) qui feront la différence sur ces requêtes à très gros volume.

## Recommandation chiffrée

**Arrêter la production de nouvelles pages** (pas de semaine 5), et **ne pas élargir aux variantes** (« with music », autres durées, autres langues) : ce serait ajouter des URL que Google ne voit pas encore.

À la place, sur les 4 prochaines semaines :

1. **Maillage interne (à valider par JB, hors périmètre de la publication automatique)** : un bloc « Minuteurs gratuits » sous les articles du blog, des liens contextuels depuis les guides qui parlent de durées (intervalles, Animedoro, études, pauses), et 4 ou 5 durées clés mises en avant sur l'accueil.
2. **Demandes d'indexation manuelles** : environ 10 par jour pendant 4 jours couvrent les 40 pages, en commençant par les gros volumes (10, 15, 5, 20, 30 min en anglais, puis 10 min dans chaque langue).
3. **Remesure mi-décembre** (environ 4 semaines après le maillage), avec trois issues :
   - **au moins 70 % des pages indexées et au moins 100 clics par mois sur les pages timer d'ici mi-janvier** : on reprend la production, d'abord sur les variantes et les durées qui ressortent dans les requêtes ;
   - **pages indexées mais bloquées au-delà de la 15e position** sur les requêtes principales : le frein est l'autorité, et l'effort passe aux liens externes (listes tierces, annuaires, Product Hunt) ;
   - **pages toujours non indexées malgré le maillage** : Google les juge peu utiles, et on arrête la stratégie de pages outil.

## Coût

OpenSEO : environ 280 crédits sur la période (validation des volumes et 4 SERP). Aucun coût d'infrastructure supplémentaire.

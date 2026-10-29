# Stratégie SEO Pomodorian : transposer le modèle Allo (2026-10-29)

Point de départ : le post d'Allo (Webflow remplacé par Claude Code, 2 marketeurs non tech, 1 600 pages, l'IA qui lance ses propres A/B tests, +7 % de conversion, 100 % inbound). Question de JB : faire la même chose avec Pomodorian.

Sources de ce document : le post lui-même, `GROWTH-PLAN-2026-07.md`, `seo-agent/JOURNAL.md` (runs 1 à 3), le rapport du 28/10 (GSC, Vercel, GEO), le code, et une validation OpenSEO US/en faite pour ce document (28 mots-clés, 3 SERP, estimé 65 à 95 crédits).

Limite : aucune source publique ne détaille la technique d'Allo (recherche web du 29/10 sans résultat, et l'analyse faite sur le projet Maijin n'a pas été versionnée). On raisonne donc sur le mécanisme décrit dans le post, pas sur leurs chiffres.

## 1. Ce que fait vraiment Allo

Le post décrit quatre choses, mais elles forment une seule machine :

1. **Le site est du code dans un repo** (le « CMS maison »). Conséquence : une page n'est plus un objet qu'un humain édite dans une interface, c'est un fichier qu'un agent peut créer, modifier et annuler.
2. **Le volume vient des templates** (1 600 pages). On n'écrit pas 1 600 pages : on écrit un gabarit et une table de données.
3. **La boucle est fermée** (l'IA lance ses A/B tests). Mesure, changement, verdict, garder ou annuler, sans attendre qu'un humain y pense.
4. **La relecture passe par des pull requests**. Les marketeurs ne codent pas : ils relisent une PR et un aperçu, puis mergent.

Le point 2 est ce qui rend le point 3 possible : on ne teste pas grand-chose sur 20 pages, on teste beaucoup sur 1 600 pages qui partagent un gabarit.

## 2. Où en est Pomodorian

| Pilier Allo | Pomodorian aujourd'hui | Écart |
|---|---|---|
| Site en code, CMS maison | Déjà là : Markdown + gray-matter, `lib/seo/pages.ts`, SSG Next.js, sitemap, hreflang, llms.txt et schema générés | Aucun sur l'outillage |
| Volume par templates | ~125 articles (4 langues) + 21 pages SEO | Aucun gabarit adossé à une demande massive |
| IA qui modifie le site | `/seo-coo` : 3 runs, paris suivis dans le JOURNAL, 4 paris gagnés sur 5 jugés | Déclenché à la main, pas de registre d'expériences, verdicts lus à la main, aucun test par groupe de pages |
| Conversion mesurée | Events Vercel + GA4 (`timer_started`, `amazon_click`, `blog_cta_click`...) | Aucun test, liens Amazon sans tag affilié |
| Relecture par PR | Commit local non poussé, JB pousse après relecture | Pas d'aperçu Vercel, pas d'historique d'expériences lisible |

Trajectoire : 26 clics Google en juin, ~375 projetés en octobre, position moyenne ~15 vers ~6. La machine éditoriale marche. Ce qui manque, c'est le levier de volume.

## 3. Le pari central : des pages outil, pas des articles

### La demande

Les requêtes « X minute timer » sont une demande d'outil (intention transactionnelle), énorme et presque sans concurrence de backlinks. OpenSEO, US/en, 29/10 :

| Requête | Volume US/mois | KD |
|---|---|---|
| 10 minute timer | 673 000 | 6 |
| 15 minute timer | 673 000 | 0 |
| 5 minute timer | 550 000 | 7 |
| 20 minute timer | 450 000 | 0 |
| 30 minute timer | 368 000 | 3 |
| 1 hour timer | 135 000 | 0 |
| 25 minute timer | 110 000 | 0 |
| 40 minute timer | 60 500 | 0 |
| 45 minute timer | 60 500 | 0 |
| 50 minute timer | 40 500 | 0 |
| 2 hour timer | 33 100 | 0 |
| 60 minute timer | 27 100 | 0 |
| 90 minute timer | 8 100 | 0 |

Environ **3,2 millions de recherches par mois** aux US sur 13 durées. Pour comparaison, « pomodoro timer » fait 90 500 avec un KD de 48, et tout le site fait aujourd'hui ~375 clics par mois.

### La SERP est perméable (vérifiée, pas supposée)

« 25 minute timer », desktop US, top 10 : un carrousel vidéo, un AI Overview, puis online-stopwatch.com, **pomodorotimer.online** (2e organique, petit site), **tiimoapp.com/timers/25-minute-timer**, vclock.com, YouTube, **stagetimer.io/go/25-minutes**. Sur « 45 minute timer » : **visualtimer.com/timers/45-minute-timer-with-music**.

Lecture : des SaaS de focus (Tiimo, Stagetimer, Visual Timer) font exactement ce jeu, avec des pages outil par durée comme canal d'acquisition. C'est le modèle Allo appliqué à notre marché, et des sites plus petits que nous y sont classés.

Contre-exemple vérifié : « brown noise » (90 500) est une SERP 100 % médias (YouTube, Spotify, Amazon Music). Pas une page, une feature (Focus Scenes, bruits colorés).

### Pourquoi ce ne serait pas du contenu mince

La leçon de juillet : 20 pages SEO sur 21 étaient quasi dupliquées (~270 mots dont 130 de gabarit). Une page outil échappe à ce piège parce que sa valeur est le timer lui-même, pas le texte. Chaque page doit avoir :

- **Le timer préréglé, fonctionnel au chargement** (wall-clock, plein écran, sons ambiants, alarme), sans compte.
- **Un contenu propre à la durée**, court et vrai : à quoi sert cette durée et quelle méthode s'y rattache. 25 min = Pomodoro classique, 50 = 50/10, 52 = 52/17, 90 = cycle ultradien, 5 = pause courte, 15 = pause longue, 45 = période de cours. Chaque page pointe vers l'article du blog qui creuse la méthode (`long-pomodoro-sessions-guide`, `animedoro-method`, etc.).
- **La pause recommandée** et un bouton « enchaîner un cycle Pomodoro complet » vers l'app avec la durée en paramètre.

Les durées 5 et 15 minutes ne sont pas hors sujet : ce sont nos durées de pause courte et longue par défaut.

### Matrice et échelle réaliste

Durées × langues × variantes, en vagues conditionnées par les gates :

- **Vague 1** : 10 durées de focus en EN (20, 25, 30, 40, 45, 50, 60, 90 minutes, 1 hour, 2 hours).
- **Vague 2** : 5, 10, 15 minutes en EN, puis FR/ES/DE après validation des volumes locaux (« minuteur 25 minutes », « temporizador 25 minutos », « Timer 25 Minuten », OpenSEO par pays, ~100 crédits). Soit ~50 pages.
- **Vague 3** : variantes « with music », « with rain sounds », « visual », seulement si la vague 1 passe ses gates et après mesure des volumes (seul « pomodoro timer with music » est connu : 140). Soit 150 à 300 pages au total.

On ne vise pas 1 600 pages par principe. On vise autant de pages qu'il y a de demande réelle et de valeur réelle.

### Spécification technique (à valider avant code)

- Données dans `lib/seo/timers.ts` (durée, slug, title, méthode associée, pause conseillée, FAQ, articles liés), même philosophie que `pages.ts`.
- URL plate qui reprend la requête : `/25-minute-timer`. Le groupe `(seo)/[slug]` existe déjà ; soit on l'étend, soit une route sœur dédiée pour garder un gabarit distinct. À trancher en lisant `node_modules/next/dist/docs/` pour le routage.
- Composant client `EmbeddedTimer` réutilisant le reducer wall-clock de `useTimer` (jamais de setInterval pour le décompte), durée passée en prop, aucune écriture localStorage tant que l'utilisateur ne passe pas dans l'app.
- La home accepte un paramètre de préréglage (`/?focus=25`) pour l'enchaînement. Petit changement dans `app/page.tsx`.
- Schema : SoftwareApplication + FAQPage via `lib/schema.ts`. Sitemap, hreflang et llms.txt suivent automatiquement les routes.
- Event `tool_timer_started { duration, lang }` puis `tool_to_app_click`, dans Vercel et GA4.

### Ordre de grandeur, pas promesse

Si 10 pages atteignent la position 5 à 8 sur des requêtes cumulant ~1 million de recherches, avec carrousel vidéo et AI Overview au-dessus, un CTR de 1 à 2 % donnerait 10 000 à 20 000 clics par mois, soit 25 à 50 fois le trafic Google actuel. Ce calcul ne vaut que si l'indexation et le classement suivent : c'est précisément ce que les gates de la vague 1 vérifient.

Risque principal : la politique de Google contre le contenu produit à grande échelle. Parade : une page n'existe que si elle sert un vrai outil et un texte propre, on surveille la couverture d'indexation dans GSC, et on arrête l'extension si l'indexation stagne sous 80 %.

## 4. L'IA qui lance ses propres tests, version Pomodorian

Honnêteté sur le volume : ~800 visiteurs par mois sur `/`. Aucun A/B test produit n'y est significatif, sauf effet énorme (le plan de juillet le disait déjà). Mais trois types de tests sont jouables.

1. **Tests avant/après sur les titles et metas** : c'est ce que les runs 1 à 3 font déjà, avec des résultats (`long-pomodoro-sessions-guide` de pos 23,5 à 5,4 ; breaks de pos 15 à 5). Il faut le formaliser.
2. **Tests par groupe de pages** (méthode SearchPilot), possibles dès que les pages outil existent : on change le gabarit sur la moitié des pages (par exemple « with Sounds » dans le title), l'autre moitié sert de témoin, on compare les clics sur la même fenêtre. C'est ce que permettent les 1 600 pages d'Allo, et ce qui nous est impossible avec 21 pages hétérogènes. Jouable à partir de la vague 2 (~50 pages), fenêtre de 4 semaines.
3. **Tests de conversion là où le trafic suffit** : bannière CTA du blog contre mini-timer intégré (gate déjà défini dans le plan : garder si plus de 5 % des visiteurs blog lancent un timer), puis le parcours page outil vers app.

### Le registre d'expériences

Nouveau fichier `seo-agent/EXPERIENCES.tsv`, la mémoire des tests :

`id | date | page(s) | hypothèse | changement | métrique primaire | fenêtre | seuil de succès | verdict | rollback`

Le COO SEO le lit au début de chaque run, juge les expériences arrivées à échéance, et annule de lui-même celles qui ont perdu. C'est la différence entre « l'IA propose des changements » et « l'IA pilote des tests ».

### Le niveau d'autonomie à accorder

Proposition graduée, à valider par JB une fois pour toutes plutôt qu'à chaque changement :

| Type de changement | Aujourd'hui | Proposé |
|---|---|---|
| Nouvel article | Draft, JB publie | Inchangé |
| Title/meta d'une page non STAR, inscrit au registre | Commit local, JB pousse | PR ouverte par l'agent, JB merge |
| Rollback d'une expérience perdante | n/a | PR ouverte par l'agent, JB merge |
| Variante de gabarit sur un groupe de pages outil | n/a | PR ouverte par l'agent, JB merge |
| Suppression, fusion, nouvelle section | Proposition | Inchangé |

## 5. La conversion (le « +7 % » d'Allo)

Chez Pomodorian, le client est l'utilisateur activé (North Star : actifs hebdo ayant complété au moins un pomodoro). Leviers dans l'ordre du rapport effort sur gain :

1. **Le tag Amazon Associates** : 236 clics par mois sur les liens Amazon, 0 revenu. Ce n'est pas un test, c'est un oubli à corriger (action JB en attente).
2. **Les pages outil activent à l'atterrissage** : le visiteur arrive dans l'outil, alors que le blog ne renvoie que 3 à 4 % de ses visiteurs vers l'app.
3. **La baisse de `timer_started` sur `/`** (77 % en juillet, 60 % sur 30 jours) : à expliquer avant tout test (part de bots, mobile, nouveau bandeau de consentement).
4. **Les 5 événements clés GA4** à marquer (action JB en attente), sinon aucun test de conversion ne sera lisible.

## 6. Le passage par pull request

JB est déjà au terminal ; ce qui manque est le format de relecture. Proposition : l'agent pousse une branche et ouvre une PR par run, Vercel construit un aperçu, JB relit l'aperçu (téléphone compris) et merge, le merge vaut publication.

Gains : plus de risque de pousser de l'infra par-dessus un commit de contenu en attente (le garde-fou actuel du `/seo-coo`), chaque expérience a sa PR donc son historique et son annulation en un clic, et le run hebdomadaire peut tourner seul (tâche planifiée) puisque son livrable est une PR, pas un push.

Changement à faire dans `.claude/commands/seo-coo.md` (règle de push de la phase 4) si JB valide.

## 7. Le GEO, que le post d'Allo ne traite pas

Mesure du 29/10 : 0 recommandation par nom sur 38 réponses IA, mais Pomodorian cité 6 fois comme source. Les IA recommandent les marques présentes dans les listicles tiers (Zapier, PCMag). Les pages outil n'y changent rien directement. Les pistes du rapport du 28/10 restent valables : brand authority via ces listicles, rendre `best-pomodoro-apps-2026` citable, remesure dans 4 à 6 semaines.

## 8. Ce que je ne recommande pas

- **Multiplier les pages à modificateurs** (« alternative to X », « for profession Y ») pour faire du volume : le run 2 a mesuré que cette longue traîne est sèche sur notre marché.
- **Des A/B tests produit sur la home** à ~800 visiteurs par mois.
- **Une page « brown noise »** : SERP de médias, c'est une feature à livrer, pas une page à écrire.
- **Générer des centaines d'articles** : la règle anti-dump tient, la cadence régulière bat le volume. Le volume vient des pages outil, pas du blog.

## 9. Plan et gates

| Vague | Contenu | Gate de passage |
|---|---|---|
| 0 (JB, cette semaine) | Tag Amazon, 5 événements clés GA4, indexation des 4 articles du run 3 | Fait ou non |
| 1 (S1 et S2) | Gabarit + `EmbeddedTimer` + 10 pages EN de durées de focus, registre d'expériences, workflow PR | À J+28 : au moins 80 % indexées, au moins 3 pages en top 20, `tool_timer_started` au-dessus de 40 % des visiteurs des pages |
| 2 (S3 à S8) | 5/10/15 min EN, puis FR/ES/DE validées, premier test par groupe | À J+28 : clics des pages outil supérieurs aux clics du blog |
| 3 | Variantes (musique, pluie, visuel), bruits colorés avec Focus Scenes | Volumes mesurés, vague 2 gagnante |
| 4 | Run `/seo-coo` hebdomadaire planifié, qui livre une PR | Registre d'expériences rempli sur au moins 4 semaines |

## 10. Décisions pour JB

1. Valider le pari des pages outil et le format d'URL (`/25-minute-timer`).
2. Valider le tableau d'autonomie de la section 4.
3. Valider le passage au workflow PR (et donc la modification de `/seo-coo`).
4. Dire si le run hebdomadaire doit tourner seul en tâche planifiée une fois la vague 1 en place.

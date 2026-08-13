# Journal du COO SEO Pomodorian

Une entrée par run. Lire les 3 dernières avant toute décision.

## Run 2 — 2026-08-13 (déclenché par JB, hors cadence lundi)

**Contexte** : JB arrive avec le framework « les 9 types de pages SEO d'un SaaS » et la question « il me manque quoi ». Trous identifiés à l'inventaire : 0 page alternative, 0 page intégration, 0 page pricing, 1 seule page contrainte.

**Décision : REFRESH-repositionnement de `/pomodorian-vs-pomofocus` en page « Pomofocus Review »** (title + h1 + 6 sections, URL conservée). Justification : `pomofocus` = 6 600/mois KD 7, seule anomalie volume/difficulté du jeu de données ; SERP de marque perméable (AlternativeTo, Medium, blogs tiers, YouTube y sont) ; la page existante ne se classait sur rien (91 % de ses 80 impressions = la requête « pomodorian », notre propre marque). Angle de fond : **Pomofocus ne publie son prix Premium nulle part** (404 sur /pricing, aucun montant en home, revérifié le 13/08), personne sur le web ne répond à cette question.

**Candidats écartés, avec les chiffres** :
- **5 pages « alternative to X »** (la demande de JB) : pomofocus alternative 10/mois, forest app alternative 30, focus to do alternative 10, toggl alternative 140 mais intention time-tracker. Variantes contrainte (without login / no signup / no ads / without subscription / no download) = **aucune ligne retournée**, volume non mesurable. Leçon transférable : le framework des 9 types vient du SaaS B2B où l'incumbent porte une grosse marque ; sur le marché des timers pomodoro la longue traîne à modificateurs est sèche. L'intention alternative est traitée en **section** de la page Pomofocus.
- **Refresh ultradian** (reporté du run 1) : ABANDONNÉ. Le « 7,5 → 21,4 » du run 1 était un artefact de mélange de requêtes ; sur la tête « ultradian rhythm » (2 400/mois) nous sommes à **position 59,8**, et la SERP est définitionnelle (ScienceDirect, PMC, Wikipedia, PubMed). Article déjà au standard, rien à réparer. **Règle à retenir : une position moyenne qui se dégrade avec des impressions qui montent est d'abord un élargissement du pool de requêtes, pas une rétrogradation. Vérifier la position sur la tête avant de conclure.**
- **Listicle body doubling app** (880/mois KD 11) : encore NEW, réévaluation au 07/09.

**FIX du backlog run 1, tous deux ANNULÉS par les données** : `best-pomodoro-apps-2026` (pos 4,3, 0 clic) et `pomodorian-vs-pomofocus` (pos 3,9, 0 clic) n'avaient pas de problème de CTR. Dans les deux cas 91+ % des impressions sont la requête de marque « pomodorian » en position 1,5, où le clic part légitimement vers la home. **Règle à retenir : avant tout FIX de CTR, ventiler les impressions de la page par requête. Une bonne position moyenne peut n'être que notre propre marque.** `best-pomodoro-apps-2026` passe DORMANT : le vrai problème est son absence sur « best pomodoro app » (480/mois KD 23).

**MERGE proposé (non exécuté)** : `micro-breaks-boost-focus` (31 impr, -356) vers `use-pomodoro-breaks-effectively` (1 256 impr). Effondrement confirmé sur 2 fenêtres. Décision à J+28.

**À surveiller** :
- **Home en baisse : 19 → 13 clics, pos 7,7 → 11,4**, soit un cinquième du trafic du site. Cause isolée : le cluster « AI pomodoro », seul moteur de clics hors marque de la home (« pomodoro ai » 5 → 1 clic, pos 3,8 → 5,7 ; « ai pomodoro » 3 → 0). Cluster trop petit (20-50/mois US) pour mériter le slot, mais à re-regarder au run 3.
- Paris run 1 en vol (poussés le 11/08), ne pas toucher avant le 01/09.
- `group-pomodoro-team-sessions` : top mover, +7 clics, CTR 6,5 %, seule page qui convertit hors marque. Pointe vers un manque produit (pas de timer partagé).

**Dette technique corrigée** : `ComparisonTable` et son JSON-LD dérivaient le nom du concurrent de `page.h1.replace("Pomodorian vs ", "")`. Champ explicite `competitor` ajouté sur les 4 pages comparatives, sinon le repositionnement du h1 supprimait silencieusement le tableau.

**Coût OpenSEO** : 43 mots-clés (3 appels `get_keyword_metrics`) + 1 `get_serp_results`, estimé 105-145 crédits. SERP « pomofocus » vérifiée gratuitement via WebSearch.

**Livrable** : `rapports/2026-08-13.md`.

**Clôture du run (même jour)** : JB a donné « ok, fais tes implémentations » → poussé en prod.
- Claim concurrent revérifié à la source avant le push : Pomofocus sert bien un service worker (`pomofocus-cache-v3.6.1`, stratégie cache-first) et un manifest PWA `standalone`. Le « offline: Yes (PWA) » du tableau est confirmé, notre concession « web-only, pas de service worker » est exacte.
- Date de vérification rendue propre à chaque page (champ `verifiedOn`) au lieu d'un « July 27, 2026 » codé en dur pour les 4 comparatifs. La page Pomofocus affiche le 13/08, les 3 autres gardent le 27/07 puisqu'elles n'ont pas été revérifiées.
- **Carryover run 1 « traductions de l'article breaks » : ABANDONNÉ sur données.** La page FR `/blog/fr/pauses-productives-que-faire` ne fait remonter aucune requête nommée sur 56 jours, et toute la famille « pause » du site pèse 1 impression en position 63. Il n'y a pas de demande FR à servir. Pas de version ES ni DE créée. **Règle à retenir : un carryover planifié au run précédent se revalide sur les données avant exécution, sinon on produit du contenu pour honorer un plan, pas pour répondre à une demande.**
- Reste JB (hors de ma portée, l'API GSC ne permet pas la demande d'indexation) : indexation de `/pomodorian-vs-pomofocus` + les 4 URLs du run 1.

## Run 1 — 2026-08-11 (premier run, audit initial complet)

**Références du run** : projet OpenSEO « Pomodorian » id `048ac49e-b9a3-4ee5-b3c8-494d3a52d09e` (US/en, domaine pomodorian.app), créé ce run. Propriété GSC `sc-domain:pomodorian.app`. Coût OpenSEO du run : ~16-32 crédits (get_keyword_metrics ×16 ; research_keywords évité, GSC gratuit a fait le tri).

**État initial** : 120 articles + 21 pages SEO inventoriés. Verdicts : 6 REFRESH, 6 STAR, 2 FIX, 36 NEW (vague de publications fin juillet/août, à réévaluer à J+28), 91 DORMANT. Snapshot GSC : `gsc-snapshots/2026-08-11-pages.tsv`.

**Signal dominant (GSC 28 j vs 28 j précédents)** : deux clusters montent fortement.
1. « what to do during pomodoro break » (~20 variantes) : servi par `/blog/use-pomodoro-breaks-effectively` — 1 168 impressions (+790), position 15, 0 clic. L'article est déjà au standard (refresh Phase 2 du 27/07 : 2 480 mots, FAQ, sources primaires) : la montée est l'effet de ce refresh. Manque : le title ne reflète pas la formulation questionnée.
2. « pomodoro intervals / how long / best time » (~25 variantes, positions 20-90) : volumes OpenSEO US — best pomodoro time 720/mois KD 22, pomodoro 50 10 210 KD 0, best pomodoro intervals 90 KD 21 (en hausse), how long is a pomodoro 70 KD 20, how many pomodoros before long break 70 KD 19 ; cluster ≈ 1 300/mois, tout en compétition LOW. Reddit confirme le débat récurrent (25/5 vs 50/10 vs 90/20, « 25 min coupe juste quand ça devient bon »).

**Décision : REFRESH-repositionnement de `/blog/long-pomodoro-sessions-guide`** (917 impr., +711, pos 23) en page canonique du cluster « best pomodoro time / how long ». Justification : Google associe DÉJÀ cette page au cluster mais la classe pos 23 parce qu'elle présuppose la réponse (« allonge ») au lieu de répondre à la question neutre. La règle anti-cannibalisation a requalifié ce qui partait comme une création : créer `best-pomodoro-time` aurait mis 2 pages en concurrence. On garde l'URL et son historique ; on change title/intro answer-first, on ajoute le tableau de décision par type de tâche, une section « How many pomodoros before a long break? » (requête 70/mois absente de la page, tie-in réglage long break interval de Pomodorian) et 2 questions FAQ alignées sur les formulations GSC.

**Candidats écartés** :
- Création « best pomodoro time » : cannibaliserait long-pomodoro-sessions-guide (ci-dessus).
- Refresh `ultradian-rhythms-natural-focus-cycles` (214 impr., pos 7,5 → 21,4, monte dans 4 langues) : reporté — 1 production/run ; la page canonique refreshée lui envoie un lien. À réévaluer au run 2.
- Listicle « body doubling app » (880/mois KD 11 transactional) : cluster nourri le 10/08, articles NEW — laisser Google digérer, réévaluer à J+28.

**FIX appliqué ce run** : title/meta de `use-pomodoro-breaks-effectively` alignés sur « What to Do During Pomodoro Breaks » (170/mois KD 0 + ~20 variantes GSC pos 12-26).
**FIX proposés (non appliqués, backlog run 2)** : `best-pomodoro-apps-2026` (pos 4,3, 87 impr., 0 clic) et `pomodorian-vs-pomofocus` (pos 3,9, 75 impr., 0 clic) — CTR title/meta ; regarder la SERP avant de toucher.

**À surveiller (paris en cours)** :
- Position « body doubling » (33 100/mois) et « claude code workflow » — lecture fin août.
- Cluster ultradian : monte en en/es/de/fr, position EN dégradée — refresh candidat run 2.
- `micro-breaks-boost-focus` : effondrement -405 impr., chevauche use-pomodoro-breaks → candidat MERGE à J+28.
- `customize-pomodoro-intervals` : 0 impr., satellite de la page canonique → candidat MERGE à J+28.
- `pair-programming-vs-solo-deep-work` (-146 impr.) et `context-switching-cost-development` (-62) : chutes à comprendre au run 2.
- Home : position 7,5 → 11,4, clics -5 — surveiller, pas d'action.

**Livrable** : rapport `rapports/2026-08-11.md`. Refresh + FIX en commit local `dc9088b`, infra poussée séparément (`cf0185b`).
**Clôture du run (même jour)** : JB a relu et donné « push, go traduction » → contenu poussé en prod, puis déclinaison fr/es du repositionnement (commit `5b583bb` ; pas de version DE de cet article ; traductions de l'article breaks laissées au run 2). RESTE JB : demandes d'indexation GSC sur les 4 URLs (en/fr/es du guide + breaks EN).

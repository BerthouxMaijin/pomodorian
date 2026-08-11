# Journal du COO SEO Pomodorian

Une entrée par run. Lire les 3 dernières avant toute décision.

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

**Livrable** : rapport `rapports/2026-08-11.md`. Refresh + FIX en COMMIT LOCAL NON POUSSÉ (pages published : le push = mise en prod, attend la relecture JB). Infra seo-agent commitée et poussée séparément (sans effet prod).

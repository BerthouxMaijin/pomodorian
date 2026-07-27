# QA : Phase 2 pages money (2026-07-27)

Périmètre : réécritures et enrichissements de contenu (Phase 2 du `GROWTH-PLAN-2026-07.md`), 6 lanes parallèles + fact-check adversarial. QA sur build de prod local (port 4123) avant push.

## Parcours validés ✅

| Vérification | Résultat |
|---|---|
| Build prod + tsc | 124 pages, 0 erreur |
| best-apps EN | Titre 51 car. (« Best Pomodoro App in 2026: 7 Options Compared »), 2 screenshots rendus pleine largeur, tableau avec prix, FAQ |
| Schema FAQPage | Présent dans le @graph de best-apps (5 questions) ; 12 articles EN éligibles via `lib/extract-faq.ts` |
| 4 langues | Titres localisés ≤ 60 car., structure miroir, divulgation éditeur partout, YAML valide |
| Pages vs-* | Sections rendues (Core Difference / Choose X If / Pricing Compared), « verified on July 27, 2026 » affiché |
| use-pomodoro-breaks | Key Takeaways + FAQ + tableau de décision rendus |
| Claims offline | 0 claim faux restant (les 3 « Yes (PWA) » résiduels concernent Pomofocus, fait vérifié) |
| Em dashes | 0 dans le contenu produit (54 corrections du fact-check incluses) |
| Screenshots produit | `public/screenshots/{timer,ai-planner,analytics}.png` capturés sur la prod (données de démo injectées pour l'UI, bannières fermées) |

## Fact-check adversarial (lane V) : verdict GO

- 20+ claims concurrents vérifiés contre la fiche `competitor-facts.md` + 5 spot-checks live (Toggl pricing, App Store Focus To-Do, forestapp.cc, pomofocus.io).
- **2 erreurs factuelles réelles corrigées** : le partenaire de plantation de Forest est « Trees for the Future » (pas « Trees.org ») ; la période de facturation Focus To-Do ($1.99) n'est pas documentée (le « /mo » a été retiré).
- Règle prix appliquée : chiffre non confirmé par source primaire → attribution explicite en prose, pas de chiffre dans les tableaux courts (Pomofocus ~$3/mo attribué « third-party trackers », Forest ramené à « Free tier + paid Plus »).
- Découverte fraîche non exploitée : forestapp.cc confirme désormais des pubs sur son tier gratuit (était « non vérifié » dans la fiche) : utilisable dans une future mise à jour.

## Corrections en cours de QA

1. « nature » → « forest/forêt » dans la liste des sons (EN + FR) : le son a été renommé en juillet.
2. Faux positif dans mon eval Playwright (scrollIntoView renvoie undefined) : les images étaient bien rendues (2 `<img>` dans `.prose-custom`, 720 px).

## Restes connus

- La fiche de faits est dans le scratchpad de session (éphémère) ; les URLs sources sont préservées dans le frontmatter `sources:` des 4 articles.
- Pages piliers des clusters (intervalles / pauses / science du focus) : reportées avec la Phase 3.
- Le lien Tipeee sur /about reste (décision JB, convention = Ko-fi).

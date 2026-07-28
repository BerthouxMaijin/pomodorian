# QA : Phase 3 lancement du pilier « souveraineté cognitive » (2026-07-28)

Périmètre : 5 articles EN écrits par lanes parallèles + fact-check adversarial + traductions FR/ES/DE + contrôle mécanique + pont produit. 20 fichiers de contenu, 12 publiés / 8 drafts.

## Chaîne de qualité

1. **Fiche de sources primaires** (R3) : chaque étude vérifiée en primaire avant écriture. Corrections notables vs la newsletter d'origine : chiffre Stanford 22-25 ans = -13 à -16 % (pas -6 %) ; MIT = préprint non peer-reviewé (83 % vs ~11 % confirmés, EEG qualitatif seulement) ; pas de preuve directe d'efficacité d'une méditation de 3 min ; Pomodoro jamais testé cliniquement sur le TDAH.
2. **Fact-check adversarial V3** (5 articles EN) : GO ×5. Prises réelles : une double-citation Illinois (même paper cité comme deux études) fusionnée ; les 3 profils de Brooks confirmés indépendamment ; un détail vécu non autorisé (« standing in a line ») remplacé ; sources frontmatter réconciliées avec les citations du corps dans 3 fichiers.
3. **Traductions** après corrections EN : FR (vouvoiement, aligné sur l'existant), ES (tuteo, orthographe RAE), DE (registre « du », vraies trémas).
4. **Contrôle mécanique V4** : 15/15 PASS, 0 correction. Chiffres croisés en séquences ordonnées vs l'EN (seules déviations : formats localisés 5:23pm→17h23). 49 liens internes, 0 cassé.

## Vérifications build/serveur (prod locale, port 4123)

| Check | Résultat |
|---|---|
| Build + tsc | 136 pages (124 + 12 publiées), 0 erreur |
| 12 URLs publiées (3 articles × 4 langues) | 200 ×12 |
| 8 URLs drafts | 404 ×8 (le reader filtre status nativement) |
| FAQPage schema | Présent sur le flagship (extraction markdown automatique) |
| hreflang | Clusters complets en/fr/es/de/x-default (rendu `hrefLang`) |
| Sitemap | 15 entrées publiées, 0 draft |
| llms.txt | 3 articles EN présents, 0 draft |
| Rendu visuel | Flagship sovereignty vérifié en dark (hook METR, stats, liens) |

## Pont produit

- Modale Never Dumb : lien « The science behind Never Dumb » localisé dans les 8 locales, event `never_dumb_article_click`, href locale-aware (fr/es/de → articles traduits, autres → EN).
- Maillage entrant : 2-3 liens vers chaque article publié depuis 6 articles EN existants (le pilier IA était un silo, maintenant relié).

## Bonus attrapé en route

- `es/mejores-apps-pomodoro-2026.md` (page money Phase 2) : 203 mots sans accent + 6 « ¿ » manquants, réparés par le traducteur ES avec distinctions RAE cas par cas.

## Pour JB

- **Publier méditation puis TDAH** (recommandé : à ~1 semaine d'intervalle) : passer `status: draft` → `status: published` dans les 4 langues de chaque cluster (8 lignes au total), commit, push. Fichiers : en/meditation-pomodoro-breaks + fr/meditation-pauses-pomodoro + es/meditacion-pausas-pomodoro + de/meditation-pomodoro-pausen, puis en/pomodoro-adhd + fr/pomodoro-tdah + es/pomodoro-tdah + de/pomodoro-adhs.
- **Erratum possible NL#199** : le chiffre Stanford cité (-6 % pour les 22-25 ans) est en réalité -13 à -16 % selon les versions du rapport ; le -20 % des jeunes développeurs est correct.

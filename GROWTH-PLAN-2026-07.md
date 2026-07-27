# Pomodorian : plan SEO + GEO + Growth (2026-07-27)

Synthèse de 5 audits menés le 2026-07-27 : SEO (GSC + GA4), GEO visibilité IA, contenu E-E-A-T, schema markup, SEO technique, et diagnostic growth (Vercel Web Analytics 10-27 juillet).

## Scores

| Audit | Score | Verdict en une ligne |
|---|---|---|
| SEO technique | 82/100 | Socle excellent (SSR, sitemap, canonicals), 4 défauts qui coûtent du trafic |
| GEO global | 55/100 | Crawlers IA 100/100, mais brand authority 9/100 et llms.txt cassé |
| Schema markup | 67/100 | Valide mais nœuds déconnectés, entité auteur contradictoire |
| Contenu E-E-A-T | 42/100 | Structurellement bon, expérientiellement vide, zéro image |
| Stade PMF | Pré-PMF | Activation excellente, rétention non mesurée, ~8 humains/jour |

## Les 5 vérités qui cadrent tout

1. **Le vrai trafic est ~8 humains/jour, pas 30.** ~40 % des « visiteurs » Vercel sont des bots (crawler SG 17,5 %, scraper US avec faux referrer Google : GSC voit 1 clic/jour là où Vercel voit 14 referrals google.com/jour). Seul le trafic qui déclenche un event est prouvable humain.
2. **L'activation est exceptionnelle** : 77 % des visiteurs du timer lancent une session, 76 % des starters complètent un pomodoro (benchmark marché : 34 %). Le produit marche. Le problème est en amont (personne n'arrive) et en aval (on ignore qui revient).
3. **Le blog ne livre personne au timer** : 1,00 pageview/visiteur sur les articles, zéro seconde page mesurée. 84 articles en 4 langues produisent un filet de trafic qui rebondit. Les CTA du 13/07 sont immesurables (dimensions UTM = payantes chez Vercel, 402).
4. **La rétention est totalement aveugle** et c'est le trou le plus grave : sans elle, impossible de savoir si on remplit un seau percé. La donnée existe déjà en localStorage (`useAnalytics`), il manque un seul `track()`.
5. **La brand authority est à 9/100** : absent de Product Hunt, AlternativeTo, Wikipedia, HN ; GitHub 0 étoile ; le plan Reddit écrit en avril n'a jamais été exécuté. C'est le plafond du score GEO (30 points du composite).

## Question posée : améliorer les articles ou en écrire de nouveaux ?

**Réponse : d'abord réparer l'infrastructure qui pénalise les 84 articles d'un coup, ensuite améliorer les 6 pages money, et seulement après écrire, sur le pilier différenciant NeverDumb / souveraineté cognitive.**

Arguments :
- Écrire de nouveaux articles génériques Pomodoro dans l'état actuel = verser dans un pipeline dont les tableaux s'affichent en pipes bruts (`| App | AI Planning |...`) sur 18 articles dont les comparatifs money, dont les titres sont tronqués en SERP (41/42 dépassent 60 caractères à cause du suffixe « — Pomodorian Blog »), sans aucune og:image sur tout le site, et dont le trafic ne convertit pas. Ce serait de l'eau dans le seau percé.
- Les pages à gros potentiel existent déjà et sous-performent pour des raisons identifiées : `best-pomodoro-apps-2026` est en position 5,8 avec 0,21 % de CTR (attendu 5-7 %, déficit 25×) parce que le titre annonce « Tested & Compared » sans preuve, sans prix, sans screenshots, et que le suffixe de marque annonce le conflit d'intérêt dans la SERP.
- Les nouveaux sujets (never dumb, souveraineté cognitive, méditation) sont le bon pari éditorial : la feature NeverDumb existe déjà dans l'app (13 exercices, 8 langues, instrumentée), personne dans la niche Pomodoro ne couvre cet angle, le vault a la matière première (dette cognitive, usage actif de l'IA, besoin de cognition, étude MIT « Your Brain on ChatGPT »), et ça transforme le positionnement de « clone de Pomofocus » en « le timer qui te garde intelligent à l'ère de l'IA ». Mais publier ce pilier AVANT d'avoir réparé le rendu et les CTA reviendrait à gâcher le meilleur contenu.

## Obstacles majeurs (classés)

1. Rendu Markdown maison cassé : tableaux en texte brut (18 articles), zéro `<ul>/<ol>/<li>` sémantique (84 articles) — `app/blog/[[...path]]/page.tsx:183-222`
2. Zéro og:image sur tout le site + `metadataBase` absent (`app/layout.tsx`) alors que `twitter:card=summary_large_image` promet une grande carte
3. Titres tronqués : suffixe « — Pomodorian Blog » (+18 car.) fait dépasser 41/42 titres EN
4. GA4 bloqué par le CSP (`next.config.ts` : googletagmanager.com absent de script-src) : la bannière consent tourne pour rien
5. Rétention non instrumentée + mesure UTM morte-née (402) + chiffres pollués par les bots
6. Brand authority 9/100 (aucune présence plateforme)
7. llms.txt : 6 liens profonds sur 8 en 404 (`/pomodoro-timer-for-*` au lieu de `/pomodoro-for-*`)
8. 20/21 pages SEO quasi dupliquées (~270 mots dont 130 de boilerplate partagé)
9. hreflang sur 1 cluster/26 ; 45 pages non-EN déclarées `lang="en"` en SSR
10. Entité auteur fragmentée : 3 définitions Person divergentes, 2 slugs LinkedIn différents (`jbberthoux` vs `jean-baptiste-berthoux`)
11. `dateModified` gelé = `datePublished` sur les 84 articles ; frontmatter `sources:` jamais rendu (fact-checking invisible)
12. AI Planner (le différenciateur) ouvert par 8,2 % des visiteurs du timer, 3 imports en 17 jours : problème de placement, pas de désir
13. Mobile : 22 % d'activation vs 90 % desktop (échantillon faible, à confirmer)
14. Contenu figé depuis le 2026-04-02 : la courbe GSC décline depuis le pic de mi-avril (18 clics/sem → 4)

---

# PLAN D'IMPLÉMENTATION

## Phase 0 : mesurer avant de bouger (1 session, tout Effort S)

Objectif : que chaque décision suivante repose sur des chiffres propres.

- [x] **Fix CSP GA4** ✅ 2026-07-27 (commit `3d03d5c`)
- [x] **Instrumenter la rétention** ✅ 2026-07-27 : event `session_return` { daysSinceFirst, streakBucket, totalSessions } émis une fois par chargement après hydratation (commit `2b70d7c`)
- [x] **Remplacer la mesure UTM par un event** ✅ 2026-07-27 : `blog_cta_click` { position, lang, slug } via `TrackedCtaLink` (commit `78cf7bf`)
- [x] **Convention anti-bots dans tout reporting** ✅ consignée (mémoire + rapport grower) : filtre OData `country ne 'SG' and country ne 'FR'`, dénominateur = visiteur avec event
- [ ] **JB : lire le dashboard Ko-fi** (ko-fi.com/jbbthx) : premier signal willingness-to-pay, gratuit, déjà en place

**Gate G0** : à J+21, si le taux de retour J7 < 10 % et la courbe décline, le travail produit (rétention) passe devant tout le marketing. Si la courbe s'aplatit ≥ 10-20 %, dérouler les phases suivantes à fond.

## Phase 1 : réparer l'infrastructure qui pénalise les 84 articles ✅ FAIT 2026-07-27

Implémentation parallélisée en 5 lanes (commits `0ac483a`..`1d13084`), QA complète : `qa/RAPPORT-2026-07-27.md`.

- [x] **Renderer Markdown** ✅ remark-gfm + rehype-slug (`lib/markdown.ts`), styles `.prose-custom` dans globals.css, vérifié dark+light
- [x] **OG images** ✅ metadataBase + `opengraph-image.tsx` racine et pages SEO + route `/og/blog` pour les articles (la convention fichier est interdite sous un catch-all optionnel)
- [x] **Titres** ✅ suffixe supprimé (`titre | Pomodorian` si ≤ 48 car., sinon titre seul)
- [x] **llms.txt** ✅ route dynamique `app/llms.txt/route.ts` générée depuis les vraies routes, 116 liens, 0 mort, Ko-fi
- [x] **Schema graph** ✅ `lib/schema.ts` + JsonLd, @graph partout, 1 seule entité Person, SoftwareApplication sur les 21 pages SEO, Blog sur les index, citation, VideoObject avec poster
- [x] **Fraîcheur** ✅ champ `updated:` supporté (reader + dateModified) : à renseigner à chaque édition de fond
- [x] **Sources visibles** ✅ section Sources localisée en bas d'article
- [x] **Langues** ✅ `lang` en SSR + translationKey sur 61 fichiers / 25 clusters (le cluster « active recall » a été volontairement exclu : les articles FR/ES ne sont pas des traductions strictes)
- [x] **Lot sitemap/robots/RSS** ✅ /about, lastModified stables, hreflang sitemap (187 liens), Disallow /api/ bots IA, link RSS dans le layout
- [x] **FAQ honnête** ✅ 5 Q/R visibles sur la home, texte = schema via `lib/faq.ts`. ⚠️ La Q « offline » (fausse : pas de service worker) remplacée par une Q privacy véridique. Restent 5 mentions « Works offline » fausses dans le contenu visible (hero, Core Features, tableau InfoSection, best-apps, features SEO) : à corriger en Phase 2 ou shipper un service worker en Phase 5

## Phase 2 : améliorer les pages money AVANT d'écrire (2-3 sessions)

Priorisation par (impressions × déficit CTR) :

- [ ] **RÉÉCRIRE `best-pomodoro-apps-2026`** (pos 5,8, 471 imp, CTR 0,21 %) : méthodologie datée, vrais tarifs 2026, screenshots par app, divulgation « édité par Pomodorian », au moins une catégorie où un concurrent gagne franchement. Répliquer sur ES (meilleur CTR du site : 2,4 %), FR, DE
- [ ] **RÉÉCRIRE le template des 4 pages `pomodorian-vs-*`** (pos 4,0 sur pomofocus !) : prose spécifique par comparaison, prix, date de vérification, section honnête « choisis X si... ». Retirer les claims concurrents hardcodés invérifiables (risque confiance/juridique)
- [ ] **AMÉLIORER `use-pomodoro-breaks-effectively`** (1 099 imp, pos 15,4 : problème de ranking, pas de titre) : tableau de décision type de travail → type de pause, FAQ + schema FAQPage, key takeaways, maillage depuis le cluster pauses. NE PAS réécrire
- [ ] **AMÉLIORER `long-pomodoro-sessions-guide`** (634 imp, pos 20,8) et `context-switching-cost-development` (335 imp, pos 16,7 ; en faire le foyer du template téléchargeable « Ready-to-Resume »)
- [ ] **Étoffer les 20 pages SEO maigres** via le champ `sections` existant (modèle : `deep-work-timer`), en priorité `/ai-task-planner` (39/100 de citabilité alors qu'elle porte LE différenciateur)
- [ ] **Désorpheliner les 11 articles à 0 lien entrant** (dont `ai-era-productivity-guide`, le meilleur actif du site, et `best-pomodoro-apps-2026`) ; pages piliers pour les clusters intervalles / pauses / science du focus
- [ ] **Blocs réponse-first + TL;DR** sur le top 10 trafic (9/42 seulement en ont) ; schema FAQPage sur les 8 articles qui ont déjà une FAQ

## Phase 3 : le nouveau pilier éditorial « Souveraineté cognitive » (cadence 1-2/semaine, PAS de dump)

Le pont produit-contenu : la feature NeverDumb (« L'IA peut finir la phrase. Elle ne doit pas finir la pensée. ») + les concepts du vault (dette cognitive, usage actif, besoin de cognition). Personne dans la niche ne tient cet angle. Chaque article renvoie vers la feature dans l'app, et inversement la modal NeverDumb peut pointer vers les articles.

Articles candidats (EN d'abord, FR ensuite, ES si traction) :
- [ ] « Cognitive debt: what the MIT "Your Brain on ChatGPT" study means for how you work » (ancrage : concept vault usage-actif-de-lia)
- [ ] « Never dumb: use your Pomodoro breaks to stay sharp, not to doomscroll » (présente les 13 exercices NeverDumb : rebuild, break-the-answer, compress, resets)
- [ ] « Meditation during Pomodoro breaks: the 3-minute open meditation protocol » + « Breathing 5-5 » (le blog n'a AUCUN article méditation/mindfulness sur 84)
- [ ] « The need for cognition: why your relationship to mental effort matters more than IQ in the AI era » (polarisation cognitive, David Brooks, positions du vault)
- [ ] « Pomodoro and ADHD » : trou thématique n°1 (gros volume, forte intention, absent des 48 topics)
- [ ] « When the Pomodoro Technique doesn't work » (Flowtime, timeboxing ; l'angle contre-point qui différencie un blog de vendeur)
- [ ] 1-2 artefacts téléchargeables (template Ready-to-Resume, tracker imprimable) : fix le moins cher du score Experience 5/25
- [ ] Renforcer le cluster ES (10 articles, meilleur CTR du site) avant le DE

Règles d'écriture (corrige les défauts mesurés du pipeline) : voix first-person réelle de JB, screenshots de l'app, FAQ + takeaways systématiques, `author:` + `updated:` en frontmatter, titre ≤ 60 car. sans em dash, 3+ liens internes entrants posés le jour de la publication.

- [ ] **Chantier données originales** (décision produit à trancher AVANT) : un rapport « State of Focus » nécessiterait des stats agrégées, or tout est en localStorage sans backend. Options : (a) télémétrie anonyme opt-in, (b) sondage utilisateurs, (c) attendre. C'est le seul levier qui monte l'unicité de ~40 à ~90 ET répare la brand authority en même temps. À décider en connaissance de cause, pas par défaut.

## Phase 4 : distribution et brand authority (le plafond GEO : 30 points)

Séquencée APRÈS les OG images (sinon toute carte de partage est vide) et calée sur le gate G0 :

- [ ] **AlternativeTo** (Effort S, dès Phase 1 finie) : fiche statique, alternative à Pomofocus/Forest/Focus To-Do : la source la plus dense pour les prompts « best/alternative to X »
- [ ] **Wikidata** : créer l'entité Pomodorian + la référencer en sameAs (levier de résolution d'entité IA le plus fort restant)
- [ ] **Product Hunt** (après QA mobile + OG images) : assets, description, jour de lancement préparé
- [ ] **Reddit** : le plan de 8 posts/7 subreddits existe déjà (`scripts/reddit-launch-plan.md`) : l'exécuter seulement quand G0 montre une courbe qui s'aplatit (règle RARRA : pas d'eau dans un seau percé)
- [ ] Discipline : 2 canaux maximum en simultané (AlternativeTo + PH), pas les 7 de la roadmap

## Phase 5 : produit et activation (backlog grower, gates chiffrés)

- [ ] **Sortir l'AI Planner de sa cachette** : l'état vide de la liste de tâches devient l'invite du planner (« Dis-moi sur quoi tu bosses, je découpe la session »). Gate : garder si ai_planner_opened > 20 % des visiteurs de `/`, jeter si < 12 % après 3 semaines (aujourd'hui : 8,2 %)
- [ ] **QA mobile du parcours d'activation** (Playwright CLI + vrai iPhone) : 22 % mobile vs 90 % desktop. Cible : 50 % (~+15 activations/mois)
- [ ] **5 tests utilisateurs qualitatifs** (protocole Mom Test, moitié mobile) : à ce volume, aucun A/B n'est significatif. Question clé : trouvent-ils le planner sans aide ? (< 3/5 → l'expérience planner devient prioritaire)
- [ ] **Mini-timer jouable dans les articles** (remplace la bannière CTA si blog_cta_click < 2 % après 2 semaines). Gate : garder si > 5 % des visiteurs blog lancent un timer
- [ ] **PWA + service worker + invite d'installation** après le 2e pomodoro complété (seul canal de rappel sans compte). BLOQUÉ par les données de rétention de Phase 0
- [ ] **Fake door `/pricing`** (1 jour) : mesurer l'intention de payer par email « on te prévient au lancement », avant d'écrire une ligne de Stripe
- [ ] **NeverDumb découvrabilité** : 2 visiteurs non-JB en 17 jours pour la feature la plus originale de l'app : à raccorder au contenu Phase 3 et à tester dans les 5 tests utilisateurs

## Freemium Phase 3 (roadmap historique) : NON, pas maintenant

Verdict tranché du diagnostic : prématuré. Le paywall visé (AI planner limité à 3/jour) porte sur la feature la moins utilisée (3 imports en 17 jours, personne n'atteint le rate limit actuel), l'arithmétique ne tient pas (~8 humains/jour × 3 % de conversion = des mois pour 50 abonnés, contre plusieurs semaines de dev auth+Neon+Stripe et une dette de complexité permanente), et on ne sait pas si les gens reviennent.

**Seuils de déclenchement (les trois, cumulés) :**
1. 300 utilisateurs actifs hebdo complétant ≥ 1 pomodoro (aujourd'hui ~55 visiteur-jours actifs/sem, soit ~6×)
2. Courbe de rétention aplatie ≥ 20 % à J7 sur 3 cohortes hebdo consécutives
3. AI planner ouvert par ≥ 25 % des utilisateurs activés

## North Star et suivi

- **NSM : utilisateurs actifs hebdo ayant complété ≥ 1 pomodoro** (jamais les visiteurs ni les pageviews)
- Inputs : taux d'atteinte de `/`, start → complete, pomodoros/jour actif, retour J7
- Revue hebdo : GSC (clics non-marque, CTR des pages money) + Vercel filtré anti-bots + events rétention
- Prochain audit GEO comparatif : à J+60 (`/geo-compare`), objectif composite 55 → 70+

## Ce que JB doit faire lui-même (non délégable)

1. Lire le dashboard Ko-fi (2 min)
2. Comptes plateformes : AlternativeTo, Product Hunt, Wikidata (l'agent prépare les fiches, JB soumet)
3. Choisir le slug LinkedIn canonique (recommandé : `jean-baptiste-berthoux`, utilisé partout sauf blog)
4. Recruter les 5 testeurs utilisateurs
5. Trancher la décision « données originales » (télémétrie opt-in vs sondage vs rien)
6. Valider le repositionnement éditorial « souveraineté cognitive » avant d'écrire le premier article du pilier

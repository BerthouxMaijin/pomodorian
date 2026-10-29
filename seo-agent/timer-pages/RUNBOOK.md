# Runbook : salve hebdomadaire de pages timer (4 semaines, 29/10 au 19/11/2026)

Décision de JB du 29/10 : « publie 10 articles par semaine sur cette strat pendant 4 semaines en automatique mais proprement et ensuite on voit ». Stratégie : `seo-agent/STRATEGIE-MODELE-ALLO-2026-10-29.md`. Cette autorisation de publication automatique vaut pour ces 4 salves de pages timer et rien d'autre : les règles du `/seo-coo` (drafts, relecture JB) restent valables pour les articles de blog.

Écart assumé avec la stratégie : les gates J+28 de la vague 1 ne conditionnent pas les vagues suivantes, JB a choisi de dérouler 4 semaines puis de juger. Le bilan de la semaine 4 sert de gate.

## Ce qu'est une « page » ici

Une page outil : un vrai minuteur préréglé (`EmbeddedTimer`, moteur wall-clock de l'app) plus un texte propre à la durée. Données dans `lib/seo/timers/{en,fr,es,de}.ts`, servies par `app/(seo)/[slug]/page.tsx` via `components/seo/TimerToolPage.tsx`. Le sitemap, le hreflang, le llms.txt, le hub `/timers` (et `/timers/{fr,es,de}` dès qu'une langue a des pages) et l'image OG suivent seuls.

## Déroulé d'une salve

### 1. Synchroniser
- `git fetch origin main` puis travailler sur la branche de la session, `git merge origin/main`.
- Lire `QUEUE.tsv` : prendre les 10 lignes `todo` de la semaine en cours (si une semaine précédente a laissé des `todo`, les traiter d'abord, toujours 10 pages maximum par salve).
- Lire la dernière entrée « Pages timer » de `seo-agent/JOURNAL.md`.

### 2. Mesurer les salves précédentes (gratuit)
OpenSEO `get_search_console_performance` (projet `048ac49e-b9a3-4ee5-b3c8-494d3a52d09e`, propriété `sc-domain:pomodorian.app`), filtré sur les URLs timer : clics, impressions, position par page depuis leur publication. Noter les pages sans aucune impression après 14 jours (signal d'indexation).

### 3. Vérifier la SERP d'une langue nouvelle (≤ 50 crédits)
Uniquement la première fois qu'une langue entre dans la file (DE en semaine 2, FR en semaine 3, ES en semaine 4) : `get_serp_results` sur la requête principale de la langue (marché de la colonne `market`), profondeur 10. Si la SERP est fermée (aucun site outil indépendant dans le top 10), le noter dans le rapport et publier quand même (décision JB), mais le signaler comme risque.

### 4. Écrire les pages
- Langue cible écrite nativement, jamais une traduction mot à mot de la page EN : formulations du marché (« minuteur », « temporizador », « Timer ... Minuten »), conventions locales (heures de cours, pauses, références culturelles exactes).
- Nouveau fichier de langue : `export const {lang}TimerPages: TimerPage[]`, enregistré dans `lib/seo/timers/index.ts` (import plus ajout au tableau `timerPages`).
- Champs : `slug` et `role`, `breakMinutes` exactement comme dans la file ; `label` dans la forme attendue par `TIMER_UI[lang].usesHeading` (en : « 25 minute », fr : « 25 minutes », es : « 25 minutos », de : « 25-Minuten ») ; `published` = date du jour.
- Titre ≤ 60 caractères avec le mot-clé de la file en tête ; description de 110 à 165 caractères ; intro qui répond en premier (« appuie sur Démarrer... ») ; 4 à 5 usages ; 3 sections ; 3 à 4 questions de FAQ.
- Contenu propre à la durée : méthode associée, pause conseillée, usages réels. Pas deux pages qui se ressemblent.
- `relatedArticleSlugs` : 2 à 3 articles publiés dans la même langue (vérifier dans `content/blog/{lang}/`, le statut doit être `published`).
- Faits produit autorisés (vérifiés dans le code le 29/10) : décompte calculé sur l'horloge réelle donc juste en arrière-plan ; 5 sons (pluie, forêt, cheminée, café, lo-fi) qui se mettent en pause avec le minuteur et s'arrêtent à la fin ; alarme douce (celle choisie dans l'app si la personne l'a déjà utilisée) ; plein écran (Échap pour sortir) ; barre d'espace pour démarrer ou mettre en pause ; mode pause à côté du mode focus ; gratuit, sans compte, sans publicité ; lien vers l'app qui règle la durée de focus. Tout le reste est interdit, en particulier : hors ligne, open source, « aucune donnée envoyée », alarme garantie dans un onglet en arrière-plan, application mobile.
- Faits externes : uniquement des faits établis et attribués (Cirillo fin des années 1980, DeskTime 2014 pour 52/17, Kleitman pour le cycle ultradien présenté comme hypothèse). Pas de chiffre de santé ou d'étude non sourcé.
- Jamais de tiret cadratin ni de « & » dans les textes.

### 5. Garde-fous automatiques (tous bloquants)
1. `node --experimental-strip-types scripts/seo/check-timer-pages.ts` : doit finir sur `OK`.
2. `npx eslint lib/seo/timers components/seo components/timer app` : aucune nouvelle erreur (l'erreur `hooks/useTasks.ts` est préexistante).
3. `npm run build` vert.
4. `PORT=3123 npm start`, puis Playwright (Chromium préinstallé) sur chaque nouvelle URL : statut 200, `<title>` attendu, `hreflang` présent, clic sur le bouton de démarrage localisé puis décompte qui baisse après 2 s, aucun débordement horizontal à 375 px. Capture de 2 pages (dont une en langue nouvelle) relue visuellement.
5. Relecture adversariale du diff par un sous-agent qui n'a pas écrit les pages : faits produit contre la liste ci-dessus, faits externes, qualité de la langue, ressemblance excessive entre pages. Corriger avant de publier.

Si un garde-fou échoue et ne peut pas être corrigé proprement dans la session : ne rien publier, passer les lignes en `blocked` dans la file avec la raison, et le dire à JB.

### 6. Publier
- Commit conventionnel (`feat(seo): timer pages week N (...)`), push de la branche, puis `git push origin HEAD:main` (avance rapide uniquement ; si refusé, `git merge origin/main`, revérifier le build, repousser ; jamais de force push).
- Attendre le déploiement Vercel puis vérifier 2 URLs en ligne (`curl -sI https://pomodorian.app/<slug>` doit renvoyer 200).
- OpenSEO `submit_indexnow_urls` avec les nouvelles URLs et le hub de la langue (Bing pèse un tiers de Google chez nous).
- Passer les lignes en `published` avec la date dans `QUEUE.tsv`.

### 7. Rendre compte
- `seo-agent/rapports/YYYY-MM-DD-timers-sN.md` : pages publiées, résultat des garde-fous, mesure des salves précédentes, risques.
- Entrée « Pages timer, semaine N » dans `seo-agent/JOURNAL.md`.
- Message à JB en 5 à 10 lignes, avec l'action qu'il doit faire (demande d'indexation GSC des nouvelles URLs, hors de portée de l'API).

### Semaine 4 : bilan
En plus de la salve : bilan des 4 semaines (pages indexées, impressions et clics par page et par langue, `tool_timer_started` et `tool_to_app_click` si JB a fourni les chiffres Vercel ou GA4), et recommandation chiffrée pour la suite (continuer, élargir aux variantes, ou arrêter). Pas de nouvelle salve après la semaine 4 sans décision de JB.

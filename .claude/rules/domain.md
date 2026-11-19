# Pomodorian — Règles Domaine

## Timer State Machine
- États : `idle` → `running` → `paused` → `completed`
- Modes : pomodoro (25min default), short break (5min), long break (15min)
- Cycle : pomodoro → short break (repeat N fois) → long break
- Timer wall-clock : `endTime = Date.now() + remaining * 1000`, tick chaque 200ms
- Ne JAMAIS utiliser setInterval pour le décompte — toujours calculer depuis endTime
- Le battement (200-250ms) vient de `public/timer-worker.js` : un onglet en arrière-plan bride les timers du thread principal (1/min dans Chrome après 5 min) et l'alarme sonnait en retard. Le worker dit seulement « relis l'horloge » ; repli sur un interval si le worker ne démarre pas
- État persisté dans `STORAGE_KEYS.CURRENT_STATE` (app principale seulement, via `useTimer(settings, { persistKey })`) : un rechargement en plein pomodoro reprend le décompte. Écrit à chaque transition, jamais à chaque tick
- Timer arrivé à zéro page fermée : crédité au retour s'il s'est terminé il y a moins d'1h, abandonné sinon. Pause et compteur de pomodoros : conservés 12h
- La tâche active est persistée aussi (`STORAGE_KEYS.ACTIVE_TASK`), sinon la session restaurée ne serait rattachée à rien
- Skip = passer à la suite (pomodoro → pause courte, pause → pomodoro), sans rien enregistrer
- `useWakeLock` garde l'écran allumé tant que le timer tourne (app + pages timer)
- Interruption manuelle d'un pomodoro (onglet de mode, touches 1/2/3, Skip, Reset) avec au moins 60s écoulées : bandeau `UndoBanner` pendant 8s, Undo ou touche Z restaure l'état exact (`capture()` / `revert()` dans `useTimer`). Jamais de bandeau en quittant une pause ni sur une fin naturelle

## Tâches
- Édition par le bouton crayon (`TaskEditor` en place dans la ligne) : titre + estimation en pomodoros (`EstimateStepper`, 1 à 20), Delete / Cancel / Save. Le double clic sur le titre ouvre le même éditeur
- Sur écran tactile, la croix de suppression n'est pas sur la ligne : la suppression passe par l'éditeur
- L'estimation se choisit aussi à l'ajout d'une tâche

## Stockage localStorage
- Toutes les données utilisateur (tasks, settings, sessions, analytics) vivent dans localStorage
- Pas de base de données, pas de backend pour les données utilisateur
- Clés définies dans `lib/types.ts` (STORAGE_KEYS)
- Hook générique `useLocalStorage.ts` pour la persistance

## Langues de l'app
- 8 langues (`UiLocale` : en, fr, es, de, pt, it, ja, zh). Textes du coeur de l'app dans `lib/i18n/app/` : `types.ts` (`AppCopy`) + un fichier par langue, donc une clé manquante est une erreur de type
- Tout texte visible (y compris `aria-label` et `title`) passe par `useAppCopy()` : jamais de chaîne en dur dans un composant de l'app
- Un seul réglage `language` (`auto` ou une langue). Résolution : `language` explicite, sinon ancien `aiLanguage` différent de `en`, sinon langue du navigateur. Hook : `useUiLocale()`. Il pilote l'interface, les dates (`lib/i18n/format.ts`) et le planificateur IA
- L'anglais est livré avec la page ; les 7 autres langues sont chargées à la demande (un petit fichier chacune)
- La page d'accueil reste prérendue en anglais (SEO). Pas de flash d'anglais : le script inline `locale-init` de `app/layout.tsx` masque les textes marqués `data-i18n` jusqu'à ce que la langue soit chargée (secours CSS à 2s). Tout nouveau texte présent dans le HTML prérendu de `/` doit porter `data-i18n`
- Restent en anglais : `InfoSection`, `Footer`, pages SEO / blog / timers (langue propre à chaque page), export CSV/Markdown, page hors ligne du service worker
- Sous 360px de large, les onglets de mode et la grille des sons sont resserrés : vérifier toute nouvelle étiquette à 320px dans les 8 langues

## AI Planner
- Route POST `/api/ai-planner`
- Utilise Claude Haiku 4.5 (Anthropic SDK)
- Rate-limité : 10 requêtes/heure/IP
- Input : objectif texte libre → Output : JSON liste de tâches
- Prompt template dans `lib/ai-prompt.ts` (multilingue) ; la langue envoyée est celle de `useUiLocale()`

## Feedback / bug reports
- Route POST `/api/feedback` : formulaire in-app (modale `FeedbackPrompt`, 8 langues) → email via Resend
- Validation Zod, échappement HTML, honeypot silencieux (`website` rempli → 200 sans envoi)
- Rate-limité : 3 envois réussis/heure/IP (les requêtes invalides ne comptent pas)
- Aucune donnée stockée — le message part par email et c'est tout
- Routage par env vars : `FEEDBACK_TO_EMAIL` (défaut `jean-baptiste@maijin.ch`), `FEEDBACK_BCC_EMAIL`, `FEEDBACK_FROM_EMAIL` (défaut `feedback@pomodorian.app`) ; Reply-To = email du rapporteur
- ⚠️ `hello@pomodorian.app` n'a PAS de MX (DNS chez Vercel) : ne pas y router tant que JB n'a pas posé un forwarding — ensuite basculer TO=hello@ + BCC=maijin.ch dans Vercel, sans toucher au code

## Ambient Sounds
- 5 sons ambiants layerables (rain, fire, forest, etc.)
- MP3 dans `public/sounds/`
- Gérés par `useSound.ts` — volumes indépendants par son
- Son d'alarme séparé en fin de timer
- Alarmes : les 3 fichiers sont normalisés à environ -1 dBTP (bien plus forts que les ambiances, voir `CREDITS.md`). Modifier un fichier d'alarme = incrémenter `VERSION` dans `public/sw.js` (ils sont mis en cache)
- Pendant la sonnerie, les ambiances sont baissées à 20 % puis remontées (facteur appliqué par-dessus le volume demandé, les volumes stockés ne bougent pas)
- L'alarme se répète (5 sonneries max, 8s d'écart) tant que personne ne réagit ; une entrée clavier ou souris arrête les répétitions, un nouveau départ coupe le son. Une seule sonnerie si la personne est visiblement là, ou si la page n'a jamais reçu de geste
- Safari / iOS : les éléments audio d'alarme sont créés une fois et amorcés (lecture muette) dans le geste du START via `primeAlarm()`, puis réutilisés. Ne jamais faire `new Audio()` au moment de la fin
- Réglages : choisir un son ou relâcher le curseur de volume joue un aperçu (`previewAlarm`)

## Themes
- Dark/Light via attribut `data-theme` sur `<html>`
- Réglage `theme` : `system` (défaut, suit `prefers-color-scheme` en direct), `dark`, `light`. Un `dark`/`light` déjà stocké est conservé
- Accents codés en dur trop pâles en clair (liens `red-400`, texte `emerald-400`) : ajouter la variante `light:` (définie dans `globals.css`), ne pas toucher la classe de base pour ne pas changer le rendu sombre
- Variables CSS dans `globals.css`
- Toujours tester les deux thèmes
- Le thème sauvegardé est appliqué avant le premier paint par le script inline `theme-init` de `app/layout.tsx` (toutes les pages, pas seulement l'app)
- Pas de `bg-white/N` pour un état actif ou survolé : invisible en thème clair. Utiliser `bg-surface`, `bg-surface-hover`, `bg-surface-active`
- Panneaux de modale : classe `.glass-modal` (opaque), pas `.glass` (le timer se lisait à travers en thème clair)

## PWA
- `manifest.ts` génère le manifest.json
- Icons dans `public/`
- Service worker : `public/sw.js`, fichier statique sans plugin, enregistré en production seulement par `components/pwa/ServiceWorkerRegister.tsx`
- Règles de cache : pages en réseau d'abord (copie en cache hors ligne) ; `/_next/static/*` en cache d'abord ; `/timer-worker.js`, icônes, les 3 alarmes et `tick-start.mp3` en cache. Jamais intercepté : `/api/*`, `/_vercel/*`, requêtes RSC, cross-origin, les MP3 d'ambiance
- Changer une règle de cache = incrémenter `VERSION` dans `sw.js` (les anciens caches sont supprimés à l'activation)
- Procédure d'arrêt d'urgence : décrite en tête de `sw.js` (version qui se désenregistre et vide les caches, retirer `<ServiceWorkerRegister />` dans le même déploiement)
- Notifications de fin : toujours via `lib/notify.ts` (`showNotification` du service worker, obligatoire sur Android ; repli sur `new Notification`). Pas de Web Push : aucun serveur

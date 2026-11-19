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

## Stockage localStorage
- Toutes les données utilisateur (tasks, settings, sessions, analytics) vivent dans localStorage
- Pas de base de données, pas de backend pour les données utilisateur
- Clés définies dans `lib/types.ts` (STORAGE_KEYS)
- Hook générique `useLocalStorage.ts` pour la persistance

## AI Planner
- Route POST `/api/ai-planner`
- Utilise Claude Haiku 4.5 (Anthropic SDK)
- Rate-limité : 10 requêtes/heure/IP
- Input : objectif texte libre → Output : JSON liste de tâches
- Prompt template dans `lib/ai-prompt.ts` (multilingue)

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

## Themes
- Dark/Light via attribut `data-theme` sur `<html>`
- Variables CSS dans `globals.css`
- Toujours tester les deux thèmes
- Le thème sauvegardé est appliqué avant le premier paint par le script inline `theme-init` de `app/layout.tsx` (toutes les pages, pas seulement l'app)
- Pas de `bg-white/N` pour un état actif ou survolé : invisible en thème clair. Utiliser `bg-surface`, `bg-surface-hover`, `bg-surface-active`
- Panneaux de modale : classe `.glass-modal` (opaque), pas `.glass` (le timer se lisait à travers en thème clair)

## PWA
- `manifest.ts` génère le manifest.json
- Icons dans `public/`
- Service worker : aucun (pas de offline mode actuellement)

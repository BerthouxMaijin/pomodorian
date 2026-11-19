# Pomodorian : journal d'implémentation

Dernière mise à jour : 2026-11-19.

Ce fichier dit ce qui a été construit, où ça vit dans le code, comment c'est vérifié et ce qui reste à faire. Les règles à respecter en codant sont dans `CLAUDE.md` et `.claude/rules/`. Les décisions et les pièges sont dans `memory.md`.

## État

Tout ce qui suit est en production sur pomodorian.app (branche `main`, déployée par Vercel).

| Lot | Contenu | Pull request | Date |
|---|---|---|---|
| 1 | Audit, fiabilité du timer, bandeau Annuler, édition des tâches, thème système, service worker, alarme audible | BerthouxMaijin/pomodorian#3 | 2026-11-19 |
| 2 | Traduction du coeur de l'app en 8 langues | BerthouxMaijin/pomodorian#4 | 2026-11-19 |
| 3 | Mode focus, objectif du jour, sauvegarde, +5 min, sons coupés en pause, mini timer flottant | BerthouxMaijin/pomodorian#5 | 2026-11-19 |

## Ce qui a été construit

### Fiabilité du timer
- **Survie au rechargement** : état du timer et tâche active persistés (`STORAGE_KEYS.CURRENT_STATE`, `ACTIVE_TASK`). Fichiers : `hooks/useTimer.ts`, `hooks/useTasks.ts`.
- **Battement par worker** : `public/timer-worker.js`, pour que l'alarme ne sonne plus en retard en arrière-plan.
- **Écran allumé** pendant que le timer tourne : `hooks/useWakeLock.ts`.
- **Skip** passe à la suite au lieu de remettre à zéro. **Raccourcis** ignorés avec Cmd, Ctrl ou Alt.
- **Notifications** demandées au premier START et envoyées par `lib/notify.ts`.
- **Moins de rendus** : le tick ne change l'état qu'une fois par seconde, les blocs statiques sont mémoïsés.

### Bandeau Annuler
Interrompre un pomodoro de plus de 60 s affiche un bandeau 8 s ; Undo ou la touche Z restaure l'état exact. Fichiers : `components/timer/UndoBanner.tsx`, `capture()` et `revert()` dans `hooks/useTimer.ts`.

### Alarme audible
- Les 3 fichiers d'alarme remontés à environ -1 dBTP (détail dans `public/sounds/CREDITS.md`).
- Ambiances baissées à 20 % pendant la sonnerie.
- Jusqu'à 5 sonneries espacées de 8 s tant que personne ne réagit.
- Éléments audio amorcés dans le clic sur START, pour Safari et iOS.
- Aperçu du son dans les réglages.
- Fichier : `hooks/useSound.ts`.

### Tâches
Bouton crayon, éditeur en place (titre et estimation), estimation à l'ajout. Sur écran tactile la suppression passe par l'éditeur. Fichiers : `components/tasks/TaskEditor.tsx`, `EstimateStepper.tsx`, `TaskItem.tsx`.

### Thème
Réglage `system` par défaut, appliqué avant le premier affichage sur toutes les pages (script `theme-init` dans `app/layout.tsx`). Contrastes du thème clair corrigés sur le blog, les pages SEO, timers et légales (variante `light:` dans `app/globals.css`).

### Hors ligne et notifications
Service worker statique `public/sw.js`, enregistré en production par `components/pwa/ServiceWorkerRegister.tsx`. Pages en réseau d'abord, fichiers de build et alarmes en cache. Procédure d'arrêt d'urgence écrite en tête de `sw.js`.

### Traduction
8 langues (en, fr, es, de, pt, it, ja, zh) dans `lib/i18n/app/`. Un seul réglage Langue. Anglais livré avec la page, autres langues chargées à la demande. Pas de flash d'anglais (script `locale-init`). HTML prérendu inchangé pour le SEO. Hooks : `useUiLocale`, `useAppCopy`.

### Mode focus
Pendant un pomodoro, après 4 s sans activité, tout sauf le timer passe à 25 % d'opacité. Fichiers : `hooks/useFocusMode.ts`, règles dans `app/globals.css`, attribut `data-focus-fade` sur les blocs concernés.

### Objectif du jour
L'en-tête affiche les pomodoros du jour sur l'objectif (`3/8`). Réglage `dailyGoal`. Fichier : `components/layout/Header.tsx`.

### Sauvegarde
Section Données des réglages : export JSON et import validé, tout ou rien. Fichiers : `lib/backup.ts`, `components/settings/BackupSection.tsx`.

### Prolonger de 5 minutes
Bouton `+5 min` proposé 60 s à la fin d'un pomodoro. Les minutes s'ajoutent à la session déjà enregistrée. Fichiers : `extend()` dans `hooks/useTimer.ts`, `extendSession()` dans `hooks/useAnalytics.ts`.

### Sons coupés pendant les pauses
Réglage `pauseAmbientsOnBreak`, désactivé par défaut. Fichier : `setAmbientsQuiet()` dans `hooks/useSound.ts`.

### Mini timer flottant
Fenêtre toujours au premier plan (API Document Picture-in-Picture). Bouton dans l'en-tête, visible seulement si le navigateur le permet et à partir de 400 px de large. Fichiers : `hooks/useMiniTimerWindow.ts`, `components/timer/MiniTimer.tsx`, `MiniTimerButton.tsx`.

### Mobile et interface
Bandeau de consentement qui ne recouvre plus START, champs à 16 px au doigt, cibles tactiles agrandies, modales opaques (`.glass-modal`), états visibles en thème clair (`bg-surface*`), champs numériques des réglages vidables.

## Vérification

Les tests navigateur sont dans `qa/e2e/`. Ils demandent Playwright avec Chromium, qui n'est pas une dépendance du projet.

```bash
npm run build
```

```bash
PORT=3100 node node_modules/next/dist/bin/next start
```

```bash
bash qa/e2e/run-all.sh
```

| Batterie | Fichier | Contrôles |
|---|---|---|
| Audit (timer, rechargement, mobile, thème) | `audit.js` | 38 |
| Bandeau Annuler | `undo.js` | 39 |
| Tâches | `tasks.js` | 66 |
| Thème | `theme.js` | 47 |
| Service worker | `service-worker.js` | 22 |
| Alarme | `alarm.js` | 48 |
| Traduction | `i18n.js` | 144 |
| Mode focus et objectif | `focus-and-goal.js` | 87 |
| Sauvegarde | `backup.js` | 116 |
| Mini timer | `mini-timer.js` | 62 |
| Prolongation et sons en pause | `extend-and-quiet-breaks.js` | 117 |
| Assemblage | `integration.js` | 10 |

Total attendu : 796. La batterie des tâches affiche en plus une ligne INFO (voir Défauts connus).

À chaque changement : `npx tsc --noEmit`, `npm run lint`, `npm run build`, puis les batteries.

## À vérifier sur de vrais appareils

Rien de ce qui suit n'a pu être testé : seul Chromium était disponible.

- [ ] **Firefox sur Mac** : l'alarme s'entend à la fin d'un pomodoro (problème signalé par JB, à l'origine du chantier alarme). Test : `/?focus=1`, START, changer d'onglet, attendre une minute.
- [ ] **Firefox** : le bouton du mini timer apparaît (version 151 ou plus) et la fenêtre reste au premier plan.
- [ ] **Safari Mac et iPhone** : l'alarme sonne ; l'app ajoutée à l'écran d'accueil s'ouvre hors ligne.
- [ ] **Android Chrome** : la notification de fin apparaît, onglet au premier plan, en arrière-plan, écran éteint.
- [ ] **Téléphone en mode avion** après une visite : l'app s'ouvre, le timer tourne, l'alarme sonne.
- [ ] **À l'oreille** : le volume de l'alarme convient.
- [ ] **Japonais et chinois** : relecture par quelqu'un qui lit ces langues.

## Défauts connus

- **Double clic sur un titre de tâche** (ordinateur) : ouvre l'éditeur mais bascule aussi deux fois la tâche active. Existait avant. Le crayon n'a pas ce défaut.
- **Safari après rechargement en plein pomodoro** : l'alarme reste probablement muette tant qu'on n'a pas recliqué sur START ou Resume.
- **Téléphone verrouillé longtemps** : la notification part en retard. Une alerte à l'heure demanderait un serveur.
- **Prolongation avec identifiant corrompu au rechargement** : elle redevient un pomodoro de 5 minutes ordinaire, compté comme un pomodoro.
- **Texte de la section d'information** : dit encore « beautiful dark mode interface » alors que le thème suit l'appareil.
- **Clé de traduction inutilisée** : `header.pomodorosCompleted`.
- **Contrôle `theme.js` instable sous charge** : il lit parfois la couleur de fond en pleine transition et échoue une fois, puis passe à la relance. L'attribut de thème est correct.

## Idées non faites

- Favicon qui montre la progression.
- Raccourci clavier pour ajouter une tâche.
- Réduire le poids de Framer Motion (environ 40 Ko compressés sur 300).
- Vraies notifications à l'heure sur téléphone verrouillé (demande un serveur de push).

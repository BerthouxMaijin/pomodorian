# Pomodorian : mémoire du projet

Dernière mise à jour : 2026-11-19.

Ce fichier garde ce qu'une prochaine session doit savoir pour ne pas refaire les mêmes erreurs ni rouvrir des décisions déjà prises. Ce qui a été construit est dans `implement.md`. Les règles de code sont dans `CLAUDE.md` et `.claude/rules/`.

## Ce que veut JB

- **Objectif** : que Pomodorian soit le meilleur outil de focus du marché.
- **Design simple et efficace** : toute amélioration doit ajouter le moins possible à l'écran. Les idées acceptées ajoutaient au plus un bouton ou une ligne.
- **Explications simples**, avec des illustrations quand ça aide (avant et après côte à côte).
- **Chantiers confiés à des sous-agents Opus**, relus et fusionnés par l'agent principal.
- **Production** : pousser seulement quand il le demande. Il teste lui-même ensuite.
- **Sa machine** : Mac, navigateur Firefox. C'est là qu'il constate les problèmes.
- **Textes** : pas de tiret cadratin ni d'esperluette dans ce qui est rédigé pour lui ou affiché dans l'app.

## Comment on livre

- Travail sur une branche, pull request vers `main`, fusion par commit de merge (convention du dépôt). Vercel déploie `main` en 30 à 40 secondes.
- Après la fusion, vérifier le site en ligne : un script Playwright sur pomodorian.app suffit (timer, service worker, langue).
- Les changements qui touchent un fichier mis en cache par le service worker demandent d'incrémenter `VERSION` dans `public/sw.js`.

## Décisions prises, et pourquoi

| Décision | Raison |
|---|---|
| Bandeau Annuler plutôt qu'une confirmation | Aucune friction quand le geste est voulu, un filet quand c'est une erreur |
| Pomodoro fini page fermée : crédité s'il a fini il y a moins d'1 h | Même logique qu'un portable qui se réveille ; au-delà, plus personne ne s'en souvient |
| Skip n'enregistre rien | Le bloc n'a pas été terminé |
| Une seule langue pour toute l'app | Deux réglages de langue (interface et IA) compliquaient pour rien |
| Les 8 langues d'un coup | Le mécanisme et plusieurs écrans traduits existaient déjà en 8 langues |
| Page d'accueil prérendue en anglais | Ne pas toucher au HTML vu par Google |
| Section d'information et pied de page en anglais | Contenu SEO de la page anglaise |
| Mode focus activé par défaut | C'est le coeur de la promesse ; un interrupteur permet de le couper |
| Sons coupés en pause désactivés par défaut | Ne pas changer le comportement de ceux qui utilisent déjà l'app |
| Sur tactile, suppression dans l'éditeur | Lignes moins chargées, moins de suppressions accidentelles |
| Mini timer masqué sous 400 px | L'en-tête n'a pas la place ; les téléphones n'ont pas l'API de toute façon |
| Import de sauvegarde : remplace tout | L'appareil contient exactement ce que contient le fichier, pas de mélange |
| Pas de Web Push | Pas de serveur pour les données utilisateur |
| Pas de chargement différé des modales | Mesuré : la page devenait plus lourde (305 Ko contre 293) |
| Logique de sauvegarde chargée à la demande | Elle embarque Zod, soit 64 Ko de plus pour chaque visiteur si elle part avec la page |

## Pièges rencontrés

**Avec les sous-agents**
- Les copies de travail des sous-agents (`.claude/worktrees/`) sont créées en retard sur la branche courante. Première consigne de chaque brief : `git reset --hard <sha>` puis vérifier avec `git merge-base --is-ancestor`.
- Plusieurs agents en parallèle sur les mêmes fichiers : donner à chacun un point d'insertion distinct (une section de traduction à lui, un endroit précis dans les réglages). Avec ça, quatre branches se sont fusionnées sans conflit.
- Ne jamais utiliser `pkill` quand des agents tournent : ça tue leurs serveurs. Arrêter par PID.
- `npx next start` laisse un processus orphelin à l'arrêt. Lancer `node node_modules/next/dist/bin/next start`.
- Un serveur lancé avant un nouveau build sert un état incohérent : toujours le relancer.
- Relancer toutes les batteries après chaque fusion. Deux défauts n'existaient qu'à l'assemblage : l'en-tête qui débordait à 320 px et la sauvegarde qui perdait les nouveaux réglages.
- ESLint analyse les copies de travail et `qa/e2e/` si on ne les exclut pas (`eslint.config.mjs`).

**Avec les tests**
- Deux touches envoyées à la suite sans délai : la seconde arrive avant que React ait fermé la modale. Laisser 60 à 100 ms. Ce n'est pas un bug de l'app.
- Le Chromium sans écran possède l'API du mini timer même en émulation mobile. Un vrai téléphone ne l'a pas.
- Bloquer `**/_next/static/chunks/**` bloque aussi le CSS. Cibler `*.js`.
- La permission de notification est refusée en mode sans écran par défaut : lancer avec `channel: 'chromium'`.
- La modale de feedback s'ouvre seule après quelques sessions : poser `pomodorian-feedback-prompt-v1-dismissed` dans le navigateur de test.
- Seul Chromium est disponible dans le cloud. Firefox, Safari et les vrais appareils ne sont jamais vérifiés ici : le dire à chaque fois.
- Un script qui plante n'affiche aucune ligne FAIL. Compter les PASS ne suffit pas : vérifier le code de sortie. La batterie de traduction a planté ainsi sans bruit, faute de son fichier de référence.
- Des scripts gardés dans un dossier temporaire disparaissent avec la session. Les ranger dans `qa/e2e/` avec tout ce qu'ils lisent.

**Avec le code**
- Tailwind lit les fichiers comme du texte : un nom de classe écrit dans un commentaire génère la classe.
- `bg-white/N` est invisible en thème clair. Utiliser `bg-surface`, `bg-surface-hover`, `bg-surface-active`.
- iOS zoome sur un champ dont le texte fait moins de 16 px.
- Safari refuse de jouer un son sans geste, sauf si le même élément audio a déjà été lancé depuis un geste.
- Chrome sur Android refuse `new Notification()` : il faut passer par le service worker.
- `cache.put` refuse les réponses partielles (206). Pour l'audio, mettre le fichier entier en cache et découper les plages soi-même.
- `z.object` ignore les clés inconnues : tout nouveau réglage doit être ajouté au schéma de `lib/backup.ts`.
- Zod pèse environ 64 Ko compressés côté navigateur. Ne jamais l'importer dans un fichier chargé avec la page : passer par `import()` au moment du besoin, comme dans `components/settings/BackupSection.tsx`. Côté serveur (routes `/api`), aucun souci.
- Remesurer le poids de la page après chaque lot (`qa/e2e` ne le fait pas) : cette régression est passée à travers 796 contrôles au vert et n'a été vue qu'en remesurant.

## Mesures de référence

| Mesure | Valeur |
|---|---|
| JavaScript transféré au premier chargement, en anglais | 306 Ko (294 avant l'audit, 300 après la traduction, 370 avant le correctif Zod) |
| Temps de script, timer en marche | environ 43 ms par 10 s (106 ms avant l'audit) |
| Alarmes après correction | -8,6 / -10,0 / -8,4 LUFS (Gentle, Digital Alert, Bell) |
| Ambiances | -13 à -18 LUFS |
| Délai de mise en production | 30 à 40 s après la fusion |

## Points ouverts

- **L'alarme sur Firefox Mac** : JB ne l'entendait presque jamais. Corrigé par les mesures (volume, répétition, ambiances baissées, retard en arrière-plan), mais jamais testé sur Firefox. Attendre son retour avant de considérer le sujet clos. S'il ne l'entend toujours pas, chercher une cause propre à Firefox (blocage de la lecture automatique tant que la page n'a pas été cliquée).
- **Tests sur vrais appareils** : liste dans `implement.md`.
- **Japonais et chinois** : personne ne les a relus.
- **Rendus React** : un sous-agent a compté environ 4 validations par seconde pendant que le timer tourne, là où une seule était attendue. Le temps de script reste faible. À regarder si la fluidité pose problème.
- **Défauts connus** : liste dans `implement.md`.

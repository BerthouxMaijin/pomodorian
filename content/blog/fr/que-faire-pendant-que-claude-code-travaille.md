---
title: "Que faire pendant que Claude Code travaille ?"
description: "Les vraies réponses de Reddit, ce que dit la recherche sur l'attention, et un workflow Claude Code qui protège votre concentration entre deux prompts."
date: "2026-08-10"
updated: "2026-08-10"
readTime: "10 min"
author: "Jean-Baptiste Berthoux"
keywords:
  - claude code workflow
  - que faire pendant que claude code travaille
  - attente agent ia
  - context switching développeurs
status: published
translationKey: what-to-do-while-claude-code-is-working
sources:
  - "https://ics.uci.edu/~gmark/chi08-mark.pdf"
  - "https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399"
  - "https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/"
  - "https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/"
  - "https://xkcd.com/303/"
---

La réponse courte : restez dans la tâche. Les meilleurs usages des minutes pendant lesquelles Claude Code travaille sont la relecture de ce que l'agent vient de produire, la lecture de son raisonnement et la rédaction du prompt suivant. Le pire usage, d'après les développeurs qui l'ont essayé comme d'après quarante ans de recherche sur l'attention, c'est de basculer sur un autre projet « juste une minute ».

Cette réponse mérite d'être déballée, parce que l'attente elle-même est nouvelle. Les outils de codage agentique tournent désormais en autonomie de trente secondes à deux heures, et toute une génération de développeurs redécouvre un problème que leurs prédécesseurs croyaient mort avec les compilateurs lents. En 2026, « que faites-vous pendant que Claude Code travaille ? » est devenue une des questions les plus récurrentes des subreddits de développeurs, et Google Trends montre une requête passée de zéro à un pic vertical en moins d'un an. Je développe [Pomodorian](https://pomodorian.app), un timer de concentration, j'ai donc un intérêt évident dans cette question ; je signalerai le moment où le produit entre en scène, et tout ce qui précède tient debout sans lui.

## La nouvelle pause compilation

Tout développeur connaît [xkcd n°303](https://xkcd.com/303/) : deux programmeurs qui font un duel d'épées sur des chaises de bureau parce que « ça compile ! » était la seule excuse légitime pour s'arrêter de travailler. L'attente d'agent, c'est le même temps mort, avec trois différences qui le rendent plus difficile, et non plus facile, à gérer.

D'abord la fréquence. Un build lent vous interrompait quelques fois par jour ; une session agentique peut vous tendre une attente toutes les quelques minutes, chaque fois qu'elle termine une étape ou demande une validation. Ensuite l'imprévisibilité : un run peut se terminer en quarante secondes ou en quarante minutes, et vous savez rarement lequel des deux à l'avance. Enfin, et c'est le plus important, vous n'êtes pas vraiment libre. L'agent peut avoir besoin d'une validation, peut dériver hors du cadre, ou peut finir et rester inactif en brûlant votre élan. Un fil sur r/ClaudeAI en février 2026 a nommé cela avec précision : le paradoxe « je ne peux pas partir, je ne peux pas me concentrer ».

Cette combinaison, des creux fréquents, imprévisibles et semi-surveillés, est une forme de temps de travail véritablement nouvelle. La traiter comme du temps libre la gaspille ; la traiter comme du temps de travail vous épuise. Il lui faut son propre workflow.

## Ce que font vraiment les développeurs sur Reddit

Si la question revient sans cesse, c'est que personne n'est satisfait de sa propre réponse. À travers les fils récurrents de [r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/) (l'édition de février 2026 a dépassé la centaine de votes), les réponses se rangent en trois camps.

**Le camp des honnêtes.** Le café, les mails et, comme le dit u/Formal_Bat_3109, « most importantly, go to Reddit ». Un utilisateur répond simplement « Pushups ». Un autre fait tourner Football Manager sur le deuxième écran. u/dbbk livre sa méthode : « Stare into middle distance ». u/Luke_thePuke raconte que sa femme a repéré les minutes creuses et s'est mise à lui confier des corvées. L'auteur du fil admet que Reddit est déjà sa réponse par défaut, et qu'il lui faut mieux.

**Le camp des systématiques.** Leurs réponses convergent avec une régularité frappante :

- **Relire la sortie.** u/Sponge8389 passe l'attente à relire le code généré ou à rédiger le prompt de la session suivante.
- **Lire le raisonnement de l'agent.** u/DifferenceTimely8292 décrit le journal de raisonnement comme une lecture passionnante et une leçon de décomposition de problème, et d'autres confirment que c'est l'usage le plus sous-coté du creux.
- **Faire tourner des sessions parallèles sur le même projet.** u/taldbek garde plusieurs espaces de travail ouverts : pendant qu'un agent travaille, il nourrit le suivant. L'auteur du [fil de janvier](https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/) fait tourner 2 à 3 sessions sur le même repo et met explicitement en garde contre le repo différent : il a essayé de remplir les attentes avec des tâches d'autres projets et en a conclu que c'était une erreur qui a ruiné son flow et vidé son énergie.
- **Planifier par lots.** u/catalan-93 regroupe sa liste de tâches par thème pour que les tâches liées tournent ensemble, ce qui rend selon lui les bascules moins douloureuses.
- **Être notifié plutôt que surveiller.** Certains font passer les mises à jour de Claude Code par de la synthèse vocale ou par Telegram pour pouvoir s'éloigner sans anxiété.

**Le camp des bricoleurs.** Mon préféré : u/hotcoolhot s'est construit un petit moniteur de session matériel (un microcontrôleur avec un écran rond) qu'il emporte dans la cuisine pour surveiller l'état de son agent en préparant un en-cas. C'est une réponse extrême, mais c'est aussi tout le problème résumé en une image : l'attente d'agent crée le besoin de *voir l'état de son temps* d'un coup d'œil.

## Pourquoi « je fais autre chose en attendant » se retourne contre vous

La réponse la plus tentante, remplir les attentes d'agent avec un second projet, est celle contre laquelle les utilisateurs expérimentés mettent en garde. La recherche explique pourquoi ils ont raison.

Dans une série d'expériences publiées en 2009, Sophie Leroy, alors à l'université du Minnesota, a montré que lorsqu'on change de tâche alors que la première est inachevée, une partie de l'attention lui reste attachée. Elle a nommé cet effet [le résidu attentionnel](https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399) : la performance sur la seconde tâche chute, et plus le résidu est fort, pire est le résultat. Un run d'agent est le déclencheur type, puisque votre première tâche est par définition inachevée pendant que Claude travaille, et que vous anticipez d'y être rappelé à un moment imprévisible.

La recherche de terrain pointe dans la même direction. En observant des employés de bureau minute par minute, [Gloria Mark et ses collègues de UC Irvine ont constaté](https://ics.uci.edu/~gmark/chi08-mark.pdf) que le travail interrompu a un coût réel : après une interruption significative, il fallait en moyenne environ 23 minutes pour revenir à la tâche d'origine, généralement après un détour par deux autres tâches, avec une compensation par un travail plus rapide au prix de davantage de stress et de frustration. Ses données plus récentes ajoutent que le temps moyen passé sur un écran avant de basculer est tombé sous la minute. Un agent qui vous interrompt toutes les quelques minutes, si vous laissez chaque interruption lancer un détour, transforme votre journée exactement dans le motif fragmenté que son laboratoire a mesuré. Nous avons consacré un article entier à [ce que le deep work exige des développeurs](/blog/fr/deep-work-concentration-profonde).

Le consensus Reddit et la littérature s'accordent sur le mécanisme : le problème de l'attente d'agent, ce n'est pas l'inactivité, c'est la bascule. L'objectif d'un workflow n'est donc pas de remplir le creux, mais de garder votre mémoire de travail chargée sur un seul projet pendant que l'agent fait sa part.

## Un protocole selon la durée de l'attente

Voici le protocole qui découle des témoignages et de la recherche. La règle de fond : évaluez la durée de l'attente, et adaptez la réponse.

1. **Moins de 2 minutes environ : ne bougez pas.** Restez sur la session. Regardez défiler le diff, survolez le raisonnement. Basculer où que ce soit, même vers un onglet, ne rapporte rien et coûte du résidu.
2. **De 2 à 10 minutes : restez dans le projet, changez d'altitude.** C'est le créneau en or du travail à contexte constant : relire la dernière sortie sérieusement, resserrer la spec, rédiger le prompt suivant, mettre à jour la liste de tâches, vérifier les tests. Même projet, altitude différente. C'est aussi là que se loge une seconde session sur le *même repo* si vous faites tourner des agents en parallèle, comme le font les utilisateurs expérimentés ; le contexte partagé garde les relectures bon marché.
3. **Plus de 10 minutes, ou un run autonome : prenez une vraie pause, et protégez-la.** Posez une notification (un son, un hook TTS, un pont Telegram) pour que l'agent puisse vous joindre, puis quittez l'écran. Le mouvement bat le scroll : la réponse « pompes » est de meilleure science cognitive qu'elle n'en a l'air. Et si vous travaillez avec des collègues, faites comme le bureau d'un des commentateurs : synchronisez vos runs d'agents pour que les attentes tombent en même temps ; c'est du [body doubling](/blog/body-doubling) appliqué au codage agentique.
4. **Groupez les validations.** Si votre session demande surtout des confirmations rapides, ne restez pas en vol stationnaire. Laissez-les s'accumuler quelques minutes et videz-les en une passe, la même logique de regroupement que [la lutte contre la procrastination par blocs de temps](/blog/fr/vaincre-procrastination-pomodoro) applique au travail superficiel.
5. **Fermez la boucle avant d'en ouvrir une autre.** Quand un run se termine, relisez et validez (ou rejetez) avant de lancer le prompt suivant. Une boucle ouverte est précisément ce qui génère du résidu attentionnel ; la fermer est ce qui rend l'attente suivante bon marché.

Deux anti-modèles à nommer explicitement, parce que ce sont les deux réflexes par défaut : **le second projet** (résidu maximal, le geste que les utilisateurs expérimentés regrettent) et **le scroll infini** (une « pause » qui vous laisse plus vidé que le travail). S'il ne faut retenir qu'une chose de la recherche : votre ennemi n'est pas l'attente, c'est la bascule non maîtrisée.

## Où le timer entre en scène

C'est ici que je dois être transparent : Pomodorian est mon produit, et si ce sujet a retenu mon attention, c'est que l'attente d'agent est structurellement un problème de timer. L'attente est invisible, imprévisible et fragmentante ; une horloge visible est l'outil le moins cher que nous ayons pour rendre le temps concret, la raison même pour laquelle un développeur s'est construit un moniteur de session physique.

En pratique, la combinaison qui fonctionne consiste à faire tourner vos sessions d'agent *à l'intérieur* [d'intervalles Pomodoro](/blog/fr/pomodoro-2-workflows-automatises) plutôt qu'autour. Un intervalle de 25 minutes contient confortablement un cycle prompt, attente, relecture, prompt suivant sur un seul projet ; la règle de la tâche unique de l'intervalle est exactement la règle « même projet, autre altitude » ci-dessus, avec un compte à rebours visible pour la faire respecter. Quand l'alarme sonne, vous prenez la pause que vous vous promettiez de toute façon, loin de l'écran, pendant que l'agent continue de travailler. N'importe quel timer fait cela ; [Pomodorian](https://pomodorian.app) ajoute un planificateur IA qui découpe votre objectif en tâches à la taille d'un pomodoro, ce qui correspond très directement à alimenter une file de prompts bien cadrés. Gratuit, dans le navigateur, sans compte.

Le fond de l'affaire reste vrai quel que soit l'outil : le codage agentique ne supprime pas le besoin de concentration profonde, il le concentre. L'agent écrit une part croissante du code ; votre levier se déplace vers la spécification, la relecture et le jugement, autant d'activités qui récompensent un esprit non fragmenté. Les développeurs qui gèrent bien l'attente ne sont pas ceux qui ont trouvé la meilleure distraction. Ce sont ceux qui ont cessé de la traiter comme un créneau à distraction.

## Questions fréquentes

### Que faire pendant que Claude Code tourne ?

Adaptez l'action à la durée de l'attente. Moins de deux minutes : restez sur la session et lisez la sortie. De deux à dix minutes : relisez, affinez votre spec ou rédigez le prompt suivant du même projet. Runs autonomes plus longs : configurez une notification de fin et prenez une vraie pause loin de l'écran.

### Puis-je travailler sur un autre projet pendant que l'agent tourne ?

Le consensus des utilisateurs expérimentés et la recherche disent non. Changer de tâche avec une tâche inachevée en vol crée du résidu attentionnel, mesuré par une performance dégradée sur la seconde tâche et un retour coûteux à la première. Si vous voulez du parallélisme, lancez plutôt une seconde session d'agent sur le même dépôt ; le contexte partagé garde les bascules bon marché.

### Est-ce grave de scroller Reddit pendant les attentes d'agent ?

C'est la réponse la plus fréquente et la moins satisfaisante, de l'aveu même de ceux qui la donnent. Les pauses de flux ont tendance à déborder la fin du run et à laisser l'attention plus fragmentée. Une micro-pause physique (bouger, s'étirer, faire un café) restaure davantage et déborde moins.

### Comment savoir quand Claude Code a besoin de moi sans le surveiller ?

Préférez les notifications à la surveillance : cloches de terminal ou hooks, synthèse vocale, ou un pont Telegram/Slack qui vous alerte à la fin d'un run ou sur une demande de validation. Les projets communautaires et les hooks natifs de Claude Code couvrent ces trois motifs.

### La technique Pomodoro fonctionne-t-elle avec les agents de codage IA ?

Les deux s'emboîtent bien. Un cycle d'agent (prompt, attente, relecture, prompt suivant) tient naturellement dans un intervalle de concentration de 25 minutes sur un seul projet, et le compte à rebours visible du timer contrecarre la nature informe et fragmentante des attentes d'agent. La pause se prend ensuite loin de l'écran pendant que l'agent continue.

## Points clés

- L'attente d'agent est la nouvelle pause compilation, mais plus fréquente, moins prévisible et seulement semi-libre ; il lui faut un workflow délibéré, pas une distraction par défaut.
- Les réponses de terrain de la communauté Claude Code convergent : relire la sortie, lire le raisonnement, préparer le prompt suivant, sessions parallèles sur le même repo, notifications plutôt que surveillance.
- Le geste à éviter est la bascule vers un autre projet : le résidu attentionnel (Leroy, 2009) et la recherche sur les interruptions (Mark, UC Irvine) montrent que c'est la bascule, pas l'inactivité, qui détruit la concentration.
- Évaluez l'attente : moins de 2 minutes, on ne bouge pas ; 2 à 10 minutes, même projet à une autre altitude ; davantage, une pause protégée loin de l'écran avec une notification posée.
- Un timer visible transforme l'attente informe en temps structuré ; faire tourner les cycles d'agent dans des intervalles Pomodoro est un emboîtement naturel.

# Pomodorian — SEO Guide Pratique

Génère un guide pratique complet pour le blog de **Pomodorian** (https://pomodorian.app), optimisé SEO/GEO/E-E-A-T.

**Input utilisateur** : $ARGUMENTS
Extrais : SUJET, KEYWORDS (optionnel), NIVEAU (débutant/intermédiaire/avancé, défaut: intermédiaire), LANGUE (en/fr/es/de, défaut: en).

---

## Contexte Pomodorian

Pomodorian est un timer Pomodoro gratuit en ligne avec :
- AI Session Planner (Claude AI, 8 langues) — décris un objectif, l'IA génère des tâches
- 5 sons ambiants superposables (pluie, café, lo-fi, nature, cheminée)
- Analytics avec heatmap GitHub-style
- Raccourcis clavier (Space, 1/2/3, S, R)
- PWA installable, dark/light mode
- 100% gratuit, sans compte

**Thématiques du blog** : productivité, focus, technique Pomodoro, deep work, étude, développement logiciel, télétravail, bien-être, outils IA.

**Ton de la marque** : expert mais accessible, pratique avant tout, conversationnel. Pas corporate, pas de fluff.

## Phase 1 — Recherche (OBLIGATOIRE)

1. **WebSearch** le sujet : trouve 5-8 sources autoritaires (.edu, peer-reviewed, HBR, Nature, experts reconnus). Note URLs, stats clés, citations d'experts.
2. **Fetch le sitemap** : `https://pomodorian.app/sitemap.xml` — cartographie toutes les pages existantes pour le maillage interne.
3. Liste les **5-10 difficultés/questions courantes** sur ce sujet (recherche + "People Also Ask").

## Phase 2 — Plan

Crée un plan en **5-7 sections** étape par étape. Adapte la complexité au NIVEAU :
- **Débutant** : vocabulaire simple, chaque concept expliqué, pas de prérequis
- **Intermédiaire** : assume les bases, focus sur les bonnes pratiques et l'optimisation
- **Avancé** : techniques pointues, cas limites, intégrations, workflows complexes

Structure obligatoire :
1. Introduction engageante (pourquoi c'est important + ce que le lecteur saura faire)
2. 5-7 sections principales (processus étape par étape)
3. Dépannage (erreurs courantes + solutions)
4. FAQ (5 questions/réponses en H3)
5. Pour aller plus loin / Techniques avancées
6. Glossaire (si termes techniques)
7. Points clés (3-5 bullets)

## Phase 3 — Rédaction

### Règles de contenu
- **Minimum 1500 mots**, viser 2000-2500 pour un guide complet
- **Écrire nativement** dans la LANGUE cible. Ne PAS traduire depuis l'anglais.
- **Ne PAS commencer par une question** (low-quality pattern).
- **Pas de filler** : pas de "In today's fast-paced world...", pas de "Dans le monde d'aujourd'hui..."

### Mentions Pomodorian
- Mentionner Pomodorian **2-3 fois** naturellement dans l'article.
- Lier vers https://pomodorian.app au moins une fois.
- Ne pas être promotionnel — être utile d'abord. Le lecteur doit tirer de la valeur même sans utiliser Pomodorian.
- Être transparent : on est l'éditeur.

### Pour chaque section principale
- Explique ce qui doit être fait
- Mentionne les prérequis ou mises en garde
- 2-3 bonnes pratiques ou astuces
- Recommande des outils ou ressources si pertinent
- Placeholder visuel : `<!-- TODO: [description du visuel] -->`

### Liens (OBLIGATOIRE)

**Min 3 liens internes** vers des pages Pomodorian existantes. Choisis parmi :
- Pages SEO : `/pomodoro-for-developers`, `/pomodoro-for-students`, `/deep-work-timer`, `/52-17-technique-timer`, `/ai-task-planner`, `/focus-music-timer`, etc.
- Articles blog : `/blog/science-of-flow-state`, `/blog/deep-work-programmers-framework`, `/blog/best-study-techniques-science`, `/blog/ambient-sounds-productivity-science`, `/blog/customize-pomodoro-intervals`, etc.
- Articles localisés : `/blog/fr/...`, `/blog/es/...`, `/blog/de/...`
- Vérifie dans le sitemap que les URLs existent.

**Min 3 liens externes** vers des sources autoritaires :
- Études peer-reviewed, .edu, journaux scientifiques
- Experts reconnus (Cal Newport, Francesco Cirillo, etc.)
- Publications (HBR, Nature, PLOS ONE, etc.)

**Aucune statistique sans source.** Pas de source → reformuler en observation.

### E-E-A-T

**Experience** :
- "En pratique...", "Après avoir testé...", "Ce qui marche le mieux..."
- Exemples concrets de workflows réels avec Pomodorian ou des techniques de productivité.

**Expertise** :
- Cite des experts par nom et credentials : "Francesco Cirillo, créateur de la technique Pomodoro", "Cal Newport, professeur d'informatique et auteur de Deep Work"
- Recherches peer-reviewed. Sources primaires > résumés de blog.
- Vocabulaire précis du domaine, expliqué au premier usage.

**Authoritativeness** :
- Croise les sources quand possible.
- "Les données suggèrent..." > "La science prouve..."
- Concurrents (Pomofocus, Forest, Focus To-Do, Toggl) mentionnés factuellement.

**Trustworthiness** :
- Auteur : Jean-Baptiste Berthoux
- Horodatage : "En 2026..." pas "récemment..."
- Pas de claims absolus. Pas de clickbait.

### GEO (Generative Engine Optimization)

1. **Réponse directe dans les 2-3 premières phrases.** Les moteurs IA extraient du début.
2. **Définitions** : "[Terme] est [définition claire en une phrase]."
3. **Contenu structuré** : bullets, listes numérotées, tableaux > pavés de texte.
4. **FAQ en H3** : extractible directement par les IA.
5. **Étapes numérotées** pour les "Comment faire".
6. **Langage clair.** Pas d'idiomes, sarcasme ou références culturelles obscures.
7. **Stats avec contexte** : "X% [de quel groupe] [a fait quoi] [selon qui] [quand]".

## Phase 4 — Format de sortie

### Frontmatter YAML (format Pomodorian)
```yaml
---
title: "Titre SEO-optimisé (50-60 caractères)"
description: "Meta description avec keyword cible (150-160 caractères)"
date: "{DATE_DU_JOUR}"
author: "Jean-Baptiste Berthoux"
readTime: "X min"
keywords:
  - keyword 1
  - keyword 2
  - keyword 3
  - keyword 4
status: draft
score: 0
sources:
  - "https://source1.com"
  - "https://source2.com"
  - "https://source3.com"
---
```

### Fichier de sortie
- **EN** : `content/blog/en/{slug}.md`
- **FR** : `content/blog/fr/{slug}.md`
- **ES** : `content/blog/es/{slug}.md`
- **DE** : `content/blog/de/{slug}.md`

Le slug est dérivé du sujet (lowercase, tirets, pas d'accents).

### Structure du document
1. Sommaire (si > 1000 mots)
2. Introduction (pas de H2, réponse directe)
3. Sections principales (H2 + H3)
4. Dépannage (## Troubleshooting / Dépannage)
5. FAQ (## Frequently Asked Questions / Questions fréquentes) — 5 Q/R en H3
6. Pour aller plus loin (## Next Steps / Pour aller plus loin)
7. Glossaire (## Glossary / Glossaire) — si termes techniques
8. Points clés (## Key Takeaways / Points clés) — 3-5 bullets

### Ce qu'il ne faut PAS faire
- Ne PAS inventer de statistiques ou d'études
- Ne PAS utiliser de filler générique
- Ne PAS écrire des murs de texte
- Ne PAS mentionner les concurrents négativement
- Ne PAS mettre d'emojis
- Ne PAS faire de claims absolus ("the best", "proven to", "guaranteed to")
- Ne PAS lier vers des pages Pomodorian qui n'existent pas dans le sitemap

## Output

Écris le fichier .md avec la commande Write dans le bon répertoire `content/blog/{lang}/`.
Affiche ensuite :
```
GUIDE GÉNÉRÉ :
  Fichier : content/blog/{lang}/{slug}.md
  Sujet : ...
  Niveau : ...
  Langue : ...
  Mots : ~N
  Liens internes : N (liste)
  Liens externes : N (liste)
  Sources : N
  FAQ : N questions
  Status : draft (à fact-checker avec scripts/seo/factcheck-drafts.sh)
```

# Next.js 16 + Tailwind v4 — Stack Rules

<important if="writing imports">
- Zod : `zod@^4` en dépendance + `import { z } from "zod"` (le sous-chemin `zod/v4` date de la migration 3.25.x, plus nécessaire)
- Tailwind v4 : `@import "tailwindcss"` dans globals.css (PAS `@tailwind base/components/utilities`)
</important>

<important if="writing server-side data fetching">
- Les server components appellent `lib/` directement. JAMAIS fetch ses propres API routes.
- Deux API routes seulement, réservées aux appels client-side : `/api/ai-planner` et `/api/feedback`.
</important>

<important if="creating new routes or pages">
Ce projet utilise Next.js 16 App Router. Les APIs peuvent avoir changé.
Lire `node_modules/next/dist/docs/` en cas de doute.
</important>

## Server vs Client Components
- L'app principale (`page.tsx`) est un client component (timer interactif)
- Les pages blog et SEO sont des server components (SSG)
- Ne jamais importer `fs` ou modules Node dans les client components

## Blog SSG
- Articles Markdown dans `content/blog/{en,fr,es,de}/`
- Parsés par `lib/blog/reader.ts` avec `gray-matter` au build time
- `generateStaticParams` pour le pre-rendering

## SEO Pages
- Définies dans `lib/seo/pages.ts`
- Générées statiquement via `generateStaticParams`
- JSON-LD via `components/seo/HomeSchemas`

## Conventions
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` (App Router)
- Un composant par fichier, PascalCase
- Hooks custom dans `hooks/` (camelCase)

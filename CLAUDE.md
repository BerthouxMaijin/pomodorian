# Pomodorian

AI-powered Pomodoro focus timer with ambient sounds, task planning, and analytics.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"`, `@theme inline`)
- **AI**: Anthropic SDK (Claude Haiku 4.5) via `/api/ai-planner`
- **Animations**: Framer Motion
- **Validation**: Zod v4
- **Content**: Markdown blog articles parsed with gray-matter
- **Deploy**: Vercel (PWA-capable)
- **State**: All client state in localStorage (no database)

## Architecture

```
app/
  page.tsx              # Main SPA (client component, timer + tasks + sounds)
  layout.tsx            # Root layout, fonts, metadata
  api/ai-planner/       # POST route: Claude Haiku breaks goals into tasks
  api/feedback/         # POST route: feedback/bug reports emailed via Resend
  blog/[[...path]]/     # Multilingual blog (en/fr/es/de), SSG with gray-matter
  (seo)/[slug]/         # ~20 programmatic SEO landing pages
  privacy/ terms/ contact/  # Legal pages
  sitemap.ts robots.ts feed.xml/ manifest.ts
components/
  timer/                # Timer, ModeSelector, TimerControls
  tasks/                # TaskList, TaskItem
  sounds/               # SoundMixer (5 ambient sounds, layerable)
  ai-planner/           # AIPlannerModal (calls /api/ai-planner)
  feedback/             # FeedbackPrompt modal (form posting to /api/feedback)
  neverdump/            # NeverDump modal
  analytics/            # AnalyticsPanel, ContributionHeatmap, StatsCards
  settings/             # SettingsModal, ShortcutsModal
  layout/               # Header, Footer, Background, InfoSection
  seo/                  # HomeSchemas (JSON-LD)
hooks/
  useTimer.ts           # Timer state machine (useReducer, wall-clock based)
  useTasks.ts           # Task CRUD + AI import (useReducer + localStorage)
  useSettings.ts        # AppSettings persisted in localStorage
  useAnalytics.ts       # Focus session recording, streak, heatmap
  useSound.ts           # Ambient + alarm audio management
  useLocalStorage.ts    # Generic localStorage hook
lib/
  types.ts              # Domain types + STORAGE_KEYS
  constants.ts          # Defaults, modes, sounds, keyboard shortcuts
  utils.ts              # formatTime, cn, generateId, getDurationForMode
  ai-prompt.ts          # buildAIPlannerPrompt (multilingual)
  seo/pages.ts          # SEO landing page definitions
  blog/reader.ts        # Markdown article reader (fs-based, SSG only)
content/blog/{en,fr,es,de}/  # Markdown articles (gray-matter frontmatter)
scripts/seo/            # Article generation & audit scripts (excluded from TS)
public/sounds/          # MP3 audio files (ambient + alarms)
```

## Key Domain Rules

- **No database**: all user data (tasks, settings, sessions) lives in localStorage
- **Timer uses wall-clock**: `endTime = Date.now() + remaining * 1000`, ticks every 200ms
- **Pomodoro cycle**: pomodoro -> short break (repeat), every Nth pomodoro -> long break
- **AI planner**: `/api/ai-planner`, rate-limited (10 req/hr/IP), returns JSON task list
- **Feedback**: `/api/feedback` emails reports via Resend (3 sends/hr/IP, honeypot, no storage)
- **Blog is SSG**: articles read from filesystem at build time, not runtime
- **SEO pages**: defined in `lib/seo/pages.ts`, statically generated via `generateStaticParams`
- **Themes**: dark/light via `data-theme` attribute on `<html>`, CSS variables in globals.css

## Dev Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (runs SSG for blog + SEO pages)
npm run lint     # ESLint
npm start        # Serve production build
```

## Env Variables

- `ANTHROPIC_API_KEY` — required for AI planner route (see `.env.local.example`)
- `RESEND_API_KEY` — required for `/api/feedback` (key `pomodorian-feedback`, sending only, scoped to pomodorian.app)
- `FEEDBACK_TO_EMAIL` / `FEEDBACK_BCC_EMAIL` / `FEEDBACK_FROM_EMAIL` — optional overrides; defaults route to jean-baptiste@maijin.ch until hello@pomodorian.app has MX records

@.claude/rules/stack.md
@.claude/rules/domain.md

@AGENTS.md

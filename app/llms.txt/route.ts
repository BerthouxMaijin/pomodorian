import { getPublishedArticles } from "@/lib/blog/reader";
import { seoPages } from "@/lib/seo/pages";
import { SITE_URL } from "@/lib/constants";

const BLOG_LANGS = [
  { code: "en", label: "English", path: "/blog" },
  { code: "fr", label: "Français", path: "/blog/fr" },
  { code: "es", label: "Español", path: "/blog/es" },
  { code: "de", label: "Deutsch", path: "/blog/de" },
] as const;

/** Collapse whitespace so every entry stays on a single markdown line. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function link(title: string, url: string, description: string): string {
  return `- [${oneLine(title)}](${url}): ${oneLine(description)}`;
}

export function GET() {
  const landingPages = seoPages
    .map((page) => link(page.h1, `${SITE_URL}/${page.slug}`, page.description))
    .join("\n");

  const blogIndexes = BLOG_LANGS.map(({ code, label, path }) => {
    const count = getPublishedArticles(code).length;
    return link(
      `Blog (${label})`,
      `${SITE_URL}${path}`,
      `${count} articles on focus, productivity and the Pomodoro Technique, in ${label}.`
    );
  }).join("\n");

  const blogSections = BLOG_LANGS.map(({ code, label, path }) => {
    const articles = getPublishedArticles(code);
    if (articles.length === 0) return "";

    const items = articles
      .map((article) =>
        link(article.title, `${SITE_URL}${path}/${article.slug}`, article.description)
      )
      .join("\n");

    return `### Articles (${label}) (${articles.length})\n\n${items}`;
  })
    .filter(Boolean)
    .join("\n\n");

  const body = `# Pomodorian

> Free AI-powered Pomodoro focus timer. Describe a goal, get a structured session plan, and work through it with ambient sounds and focus analytics. No account, no ads, no tracking.

Pomodorian is a web app built by Jean-Baptiste Berthoux. It combines a customizable Pomodoro timer with an AI session planner (Claude Haiku 4.5) that turns a plain-language goal into a task list with time estimates, five layerable ambient sounds, and a GitHub-style focus heatmap. Every task, setting and session stays in the browser's localStorage: there is no database, no account, and no analytics on user activity.

- **Price**: free, all features included. No paid tier, no ads, no account required.
- **AI session planner**: describe a goal in natural language, get a structured task list with pomodoro estimates. Supports 8 languages.
- **Timer**: customizable focus and break durations, wall-clock based (no drift), auto-advance between sessions.
- **Ambient sounds**: rain, café, lo-fi, forest and fireplace, layerable, with independent volume controls.
- **Analytics**: session history, daily focus time, streaks, and a 20-week contribution heatmap.
- **Privacy**: all data local to the browser. Nothing is sent to a server except the AI planner prompt.
- **Tech**: Next.js App Router, React 19, TypeScript, Tailwind CSS v4, deployed on Vercel. Installable as a PWA, but there is no service worker and therefore no offline mode: the app needs a connection to load, though a running timer keeps counting if the connection drops mid-session.

## App

${link("Pomodorian timer", `${SITE_URL}/`, "The app itself: timer, task list, AI planner, ambient sound mixer and focus analytics.")}
${link("About", `${SITE_URL}/about`, "Who built Pomodorian, why it exists, and how it differs from other Pomodoro timers.")}
${link("Contact", `${SITE_URL}/contact`, "Get in touch, report a bug, or suggest a feature.")}
${link("Privacy policy", `${SITE_URL}/privacy`, "What data is collected (almost none) and where it lives.")}
${link("Terms", `${SITE_URL}/terms`, "Terms of use.")}

## Landing pages

${landingPages}

## Blog

${blogIndexes}

${blogSections}

## Feeds

${link("RSS feed", `${SITE_URL}/feed.xml`, "Latest English blog articles, RSS 2.0.")}
${link("Sitemap", `${SITE_URL}/sitemap.xml`, "All indexable URLs with last-modified dates and hreflang alternates.")}

## The Pomodoro Technique

The Pomodoro Technique was created by Francesco Cirillo in the late 1980s. It breaks work into timed intervals (traditionally 25 minutes) separated by short breaks. Each interval is a "pomodoro", Italian for "tomato", named after the tomato-shaped kitchen timer Cirillo used as a student.

The standard cycle: 25 minutes of work, then a 5-minute short break; after four pomodoros, a longer 15 to 30-minute break. Pomodorian supports this default and any custom interval, including the 52/17 method, Flowtime, and 90-minute deep work blocks aligned with ultradian rhythms.

## Comparison with alternatives

| Feature | Pomodorian | Pomofocus | Forest | Focus To-Do |
|---------|-----------|-----------|--------|-------------|
| AI task planning | Yes (free) | No | No | No |
| Ambient sounds | 5, free and layerable (rain, café, lo-fi, forest, fireplace) | Yes, free and customizable | 1 free, more with Plus | White noise, partly premium |
| Detailed productivity tracking | Free (heatmap, streaks, daily stats) | Premium | Focus Analytics with Plus | Detailed stats with Premium |
| Offline support | No | Yes (PWA) | Yes | Not documented |
| Account required | No | Not for basic use | Not for basic use, required for multi-device sync | Not documented |
| Price | Free, no paid tier | Free tier + paid Premium | Free tier + Plus subscription | Free tier + paid Premium |
| Data storage | Local browser only | Local browser, or account | Account for sync | Account for sync |

## Contact

- Author: Jean-Baptiste Berthoux
- Email: jean-baptiste@academieweb3.com
- Source code: https://github.com/BerthouxMaijin/pomodorian
- Support the project: https://ko-fi.com/jbbthx
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

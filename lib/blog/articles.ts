export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  keywords: string[];
}

export const articles: Article[] = [
  {
    slug: "pomodoro-technique-complete-guide",
    title: "The Pomodoro Technique: A Complete Guide to Focused Productivity",
    description:
      "Learn how the Pomodoro Technique works, why it boosts focus, and how to get started with timed work sessions. Includes tips, science, and the best tools.",
    date: "2026-03-23",
    readTime: "8 min",
    keywords: [
      "pomodoro technique",
      "focus timer",
      "productivity method",
      "time management",
    ],
  },
  {
    slug: "best-pomodoro-apps-2026",
    title: "7 Best Pomodoro Timer Apps in 2026 (Free & Paid)",
    description:
      "A detailed comparison of the best Pomodoro timer apps including Pomodorian, Pomofocus, Forest, Focus To-Do, and more. Find the right tool for your workflow.",
    date: "2026-03-23",
    readTime: "10 min",
    keywords: [
      "best pomodoro app",
      "pomodoro timer app",
      "pomofocus alternative",
      "focus app",
    ],
  },
  {
    slug: "ai-productivity-tools-focus",
    title: "How AI is Changing the Way We Focus and Plan Our Work",
    description:
      "Discover how AI-powered productivity tools like AI session planners are helping people plan better, focus deeper, and get more done with less effort.",
    date: "2026-03-23",
    readTime: "6 min",
    keywords: [
      "AI productivity",
      "AI focus tools",
      "AI task planner",
      "AI pomodoro",
    ],
  },
  {
    slug: "pomodoro-technique-for-developers",
    title: "The Pomodoro Technique for Software Developers: A Practical Guide",
    description:
      "How developers can use the Pomodoro Technique to ship code faster, reduce context switching, and avoid burnout. Real strategies for deep work in engineering.",
    date: "2026-03-23",
    readTime: "7 min",
    keywords: [
      "pomodoro for developers",
      "developer productivity",
      "deep work programming",
      "focus coding",
    ],
  },
  {
    slug: "ambient-sounds-productivity-science",
    title: "Why Ambient Sounds Help You Focus: The Science Behind Lo-fi, Rain, and Café Noise",
    description:
      "The neuroscience of ambient sounds and productivity. Learn why rain sounds, café noise, and lo-fi beats improve concentration and how to use them effectively.",
    date: "2026-03-23",
    readTime: "6 min",
    keywords: [
      "ambient sounds focus",
      "lofi productivity",
      "rain sounds concentration",
      "café noise study",
    ],
  },
];

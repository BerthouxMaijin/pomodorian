/**
 * Single source of truth for the homepage FAQ.
 *
 * Google requires FAQPage structured data to match content visible on the page,
 * so `InfoSection` renders these strings verbatim and `HomeSchemas` emits the
 * same strings as Question/Answer nodes. Edit here, never in one place only.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What is the Pomodoro Technique?",
    a: "The Pomodoro Technique is a time management method that uses 25-minute focused work sessions (called pomodoros) separated by 5-minute breaks. After 4 pomodoros, you take a longer 15-30 minute break. It was developed by Francesco Cirillo in the late 1980s.",
  },
  {
    q: "Is Pomodorian free?",
    a: "Yes, Pomodorian is completely free. No account required, no ads, and no hidden fees. All features including AI session planning, ambient sounds, and focus analytics are available at no cost.",
  },
  {
    q: "How does the AI Session Planner work?",
    a: "Describe your goal in natural language (e.g., 'Prepare a presentation and write follow-up emails'), and the AI breaks it down into concrete, pomodoro-sized tasks with time estimates. It supports 8 languages and uses Claude AI.",
  },
  {
    q: "Does Pomodorian keep my data private?",
    a: "Yes. All your data (tasks, sessions, settings, analytics) is stored locally in your browser. There is no account, no cloud sync, and nothing is sent to a server except the goal you type into the optional AI planner. A running timer keeps going even if your connection drops.",
  },
  {
    q: "What ambient sounds are available?",
    a: "Pomodorian includes 5 free ambient sounds: rain, café, lo-fi beats, forest, and fireplace. You can layer multiple sounds together and adjust individual volume levels to create your perfect focus environment.",
  },
];

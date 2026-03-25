export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  category: "profession" | "technique" | "comparison" | "use-case";
}

const professions: SeoPage[] = [
  {
    slug: "pomodoro-for-developers",
    title: "Pomodoro Timer for Developers — Ship Code Faster | Pomodorian",
    description:
      "A free Pomodoro timer designed for software developers. AI breaks down coding tasks, ambient sounds for deep work, and focus analytics to track your output.",
    h1: "Pomodoro Timer for Developers",
    intro:
      "Software development demands sustained focus. Between Slack notifications, PR reviews, and standups, finding deep work time is a constant battle. Pomodorian helps developers protect their focus with timed sessions, AI task breakdown, and ambient sounds like lo-fi and rain — the classic developer soundtrack.",
    keywords: ["pomodoro for developers", "developer productivity timer", "coding focus timer", "deep work programming"],
    category: "profession",
  },
  {
    slug: "pomodoro-for-students",
    title: "Pomodoro Timer for Students — Study Smarter | Pomodorian",
    description:
      "Free Pomodoro study timer with AI planning. Break down study sessions, track focus hours, and use ambient sounds to concentrate better during exams.",
    h1: "Pomodoro Timer for Students",
    intro:
      "Studying for hours without a plan leads to burnout and poor retention. The Pomodoro Technique helps students study in focused 25-minute blocks with regular breaks — proven to improve memory consolidation. Pomodorian adds AI planning to break down study goals into manageable sessions.",
    keywords: ["pomodoro for students", "study timer", "exam focus timer", "study planner AI"],
    category: "profession",
  },
  {
    slug: "pomodoro-for-writers",
    title: "Pomodoro Timer for Writers — Beat Writer's Block | Pomodorian",
    description:
      "A free Pomodoro timer for writers. Use AI to plan your writing sessions, café and rain ambient sounds for creative flow, and track your daily word count progress.",
    h1: "Pomodoro Timer for Writers",
    intro:
      "Writer's block often isn't about inspiration — it's about starting. The Pomodoro Technique removes the pressure by asking you to write for just 25 minutes. Pomodorian enhances this with AI session planning (tell it your writing goal, get a structured plan) and café ambience that boosts creative thinking.",
    keywords: ["pomodoro for writers", "writing timer", "writer productivity", "creative focus timer"],
    category: "profession",
  },
  {
    slug: "pomodoro-for-designers",
    title: "Pomodoro Timer for Designers — Creative Focus Sessions | Pomodorian",
    description:
      "Free focus timer for UI/UX designers. AI breaks down design projects into focused sessions. Ambient sounds and analytics to boost creative output.",
    h1: "Pomodoro Timer for Designers",
    intro:
      "Design work requires switching between creative exploration and precise execution. The Pomodoro Technique helps designers structure their time — brainstorming in one session, pixel-perfect refinement in the next. Pomodorian's AI planner breaks down design projects into focused, achievable tasks.",
    keywords: ["pomodoro for designers", "design focus timer", "UX designer productivity", "creative timer"],
    category: "profession",
  },
  {
    slug: "pomodoro-for-freelancers",
    title: "Pomodoro Timer for Freelancers — Track Productive Hours | Pomodorian",
    description:
      "Free Pomodoro timer for freelancers. Track focused work hours, plan projects with AI, and measure daily productivity with a contribution heatmap.",
    h1: "Pomodoro Timer for Freelancers",
    intro:
      "As a freelancer, your time is your product. But without structure, hours slip away between admin tasks, client emails, and context-switching between projects. Pomodorian gives you a framework: AI breaks down your projects into focused sessions, and the analytics heatmap shows exactly how productive each day was.",
    keywords: ["pomodoro for freelancers", "freelancer time tracker", "freelance productivity", "focus timer remote work"],
    category: "profession",
  },
  {
    slug: "pomodoro-for-remote-workers",
    title: "Pomodoro Timer for Remote Workers — Stay Focused at Home | Pomodorian",
    description:
      "Free Pomodoro timer for remote workers. Structure your work-from-home day with AI planning, ambient sounds, and focus analytics.",
    h1: "Pomodoro Timer for Remote Workers",
    intro:
      "Working from home means endless distractions — household chores, social media, the fridge. The Pomodoro Technique creates structure in an unstructured environment. Pomodorian adds AI planning to organize your day and ambient sounds to recreate the focus of a café or office.",
    keywords: ["pomodoro remote work", "work from home timer", "remote worker productivity", "home office focus"],
    category: "profession",
  },
  {
    slug: "pomodoro-for-adhd",
    title: "Pomodoro Timer for ADHD — Structured Focus Sessions | Pomodorian",
    description:
      "A free Pomodoro timer that helps people with ADHD focus. AI breaks tasks into small steps, regular breaks prevent burnout, and ambient sounds reduce distractions.",
    h1: "Pomodoro Timer for ADHD",
    intro:
      "For people with ADHD, the hardest part of productivity is often getting started and maintaining focus. The Pomodoro Technique helps by making tasks small (25 minutes) and rewarding (regular breaks). Pomodorian's AI planner removes the executive function burden of task breakdown, and ambient sounds help mask distracting stimuli.",
    keywords: ["pomodoro ADHD", "ADHD focus timer", "ADHD productivity tool", "focus timer attention deficit"],
    category: "profession",
  },
  {
    slug: "pomodoro-for-entrepreneurs",
    title: "Pomodoro Timer for Entrepreneurs — Maximize Your Day | Pomodorian",
    description:
      "Free AI-powered Pomodoro timer for entrepreneurs. Plan your day with AI, track deep work hours, and stay focused across multiple projects.",
    h1: "Pomodoro Timer for Entrepreneurs",
    intro:
      "Entrepreneurs juggle a dozen priorities daily. Without structure, you spend the whole day firefighting and make no progress on what matters. Pomodorian's AI planner helps you break down your biggest priorities into focused sessions, so you make real progress every day.",
    keywords: ["pomodoro for entrepreneurs", "startup productivity", "entrepreneur focus timer", "business owner time management"],
    category: "profession",
  },
];

const techniques: SeoPage[] = [
  {
    slug: "52-17-technique-timer",
    title: "52/17 Technique Timer — 52 Min Focus + 17 Min Break | Pomodorian",
    description:
      "Free online 52/17 technique timer. Work for 52 minutes, break for 17. Customize session lengths, add ambient sounds, and plan with AI.",
    h1: "52/17 Technique Timer",
    intro:
      "The 52/17 technique is based on a DeskTime study that found the most productive workers focus for 52 minutes then take a 17-minute break. Pomodorian lets you customize your timer to any interval — set it to 52/17 in settings and combine it with AI planning and ambient sounds.",
    keywords: ["52 17 technique", "52 17 timer", "DeskTime productivity method", "alternative pomodoro technique"],
    category: "technique",
  },
  {
    slug: "flowtime-technique-timer",
    title: "Flowtime Technique Timer — Flexible Focus Sessions | Pomodorian",
    description:
      "Free Flowtime technique timer. Work until your focus naturally fades, then take a proportional break. Customizable durations with AI planning.",
    h1: "Flowtime Technique Timer",
    intro:
      "The Flowtime Technique is a flexible alternative to Pomodoro. Instead of fixed 25-minute blocks, you work until your focus naturally drops, then take a break proportional to your work time. Pomodorian's customizable timer supports any session length, making it perfect for Flowtime practitioners.",
    keywords: ["flowtime technique", "flowtime timer", "flexible pomodoro", "adaptive focus timer"],
    category: "technique",
  },
  {
    slug: "time-blocking-timer",
    title: "Time Blocking Timer — Schedule Focus Blocks | Pomodorian",
    description:
      "Free time blocking timer with AI planning. Structure your day into focused blocks, track your progress, and use ambient sounds to stay in the zone.",
    h1: "Time Blocking Timer",
    intro:
      "Time blocking assigns specific tasks to specific time slots in your day. Combined with a timer, it becomes a powerful productivity system. Pomodorian's AI planner can help you break your day into time blocks, and the timer keeps you focused within each block.",
    keywords: ["time blocking timer", "time blocking app", "schedule focus blocks", "Cal Newport deep work timer"],
    category: "technique",
  },
  {
    slug: "deep-work-timer",
    title: "Deep Work Timer — Distraction-Free Focus Sessions | Pomodorian",
    description:
      "Free deep work timer inspired by Cal Newport. Long focus sessions with AI task planning, ambient sounds, and analytics to track deep work hours.",
    h1: "Deep Work Timer",
    intro:
      "Deep work — coined by Cal Newport — is the ability to focus without distraction on a cognitively demanding task. Pomodorian supports deep work with customizable session lengths (set 45-90 minute sessions), ambient sounds that mask distractions, and AI planning that eliminates the overhead of deciding what to work on.",
    keywords: ["deep work timer", "Cal Newport focus timer", "distraction free timer", "focused work session"],
    category: "technique",
  },
];

const comparisons: SeoPage[] = [
  {
    slug: "pomodorian-vs-pomofocus",
    title: "Pomodorian vs Pomofocus — Which Pomodoro Timer is Better? (2026)",
    description:
      "Detailed comparison of Pomodorian and Pomofocus. Compare features, AI planning, ambient sounds, analytics, and pricing side by side.",
    h1: "Pomodorian vs Pomofocus",
    intro:
      "Pomofocus is one of the most popular Pomodoro timers on the web. But how does it compare to Pomodorian? Here's a detailed, honest comparison of both tools so you can pick the right one for your workflow.",
    keywords: ["pomodorian vs pomofocus", "pomofocus alternative", "best pomodoro timer comparison", "pomofocus review"],
    category: "comparison",
  },
  {
    slug: "pomodorian-vs-forest",
    title: "Pomodorian vs Forest App — Free Timer vs Gamified Focus (2026)",
    description:
      "Compare Pomodorian and Forest app. AI planning vs gamification, web vs mobile, free vs paid. Find the best focus tool for you.",
    h1: "Pomodorian vs Forest",
    intro:
      "Forest gamifies focus by growing virtual trees. Pomodorian takes a different approach with AI planning and ambient sounds. Both are great tools, but they serve different needs. Here's how they compare.",
    keywords: ["pomodorian vs forest", "forest app alternative", "pomodoro vs forest", "focus app comparison"],
    category: "comparison",
  },
  {
    slug: "pomodorian-vs-focus-to-do",
    title: "Pomodorian vs Focus To-Do — AI Planner vs Task Manager (2026)",
    description:
      "Compare Pomodorian and Focus To-Do. AI-powered planning vs full task management. Which Pomodoro app fits your workflow better?",
    h1: "Pomodorian vs Focus To-Do",
    intro:
      "Focus To-Do is a full-featured task manager with a built-in Pomodoro timer. Pomodorian is a focused timer with AI planning. If you need robust project management, Focus To-Do might be your pick. If you want a fast, AI-powered focus tool, Pomodorian is worth trying.",
    keywords: ["pomodorian vs focus to do", "focus to do alternative", "pomodoro task manager", "AI pomodoro app"],
    category: "comparison",
  },
  {
    slug: "pomodorian-vs-toggl",
    title: "Pomodorian vs Toggl Track — Focus Timer vs Time Tracker (2026)",
    description:
      "Compare Pomodorian and Toggl Track. Pomodoro focus vs billable time tracking. Features, pricing, and use cases side by side.",
    h1: "Pomodorian vs Toggl Track",
    intro:
      "Toggl Track is primarily a time-tracking tool for freelancers and teams. Pomodorian is a focus timer with AI planning. They solve different problems — Toggl tracks where your time went, Pomodorian helps you focus it better. Here's when to use each.",
    keywords: ["pomodorian vs toggl", "toggl alternative pomodoro", "focus timer vs time tracker", "toggl pomodoro mode"],
    category: "comparison",
  },
];

const useCases: SeoPage[] = [
  {
    slug: "study-timer-for-exams",
    title: "Study Timer for Exams — AI-Powered Study Sessions | Pomodorian",
    description:
      "Free study timer for exam preparation. AI breaks down your study plan, ambient sounds help concentration, and analytics track your study hours.",
    h1: "Study Timer for Exams",
    intro:
      "Exam prep requires sustained, structured study — not marathon cramming sessions. The Pomodoro Technique breaks studying into focused 25-minute blocks with regular breaks, improving retention and reducing burnout. Pomodorian's AI planner helps you organize your subjects and topics into a realistic study schedule.",
    keywords: ["study timer exams", "exam preparation timer", "pomodoro studying", "focus timer for studying"],
    category: "use-case",
  },
  {
    slug: "online-pomodoro-timer",
    title: "Free Online Pomodoro Timer — No Download, No Account | Pomodorian",
    description:
      "Free online Pomodoro timer that works in your browser. AI task planning, ambient sounds, focus analytics. No account required, works offline.",
    h1: "Free Online Pomodoro Timer",
    intro:
      "Looking for a simple, free Pomodoro timer you can use right now? Pomodorian works in any browser — no download, no account, no ads. Just open the page and start focusing. It includes AI session planning, 5 ambient sounds, and a focus analytics dashboard, all completely free.",
    keywords: ["online pomodoro timer", "free pomodoro timer", "web pomodoro timer", "browser focus timer"],
    category: "use-case",
  },
  {
    slug: "focus-music-timer",
    title: "Focus Music Timer — Lo-fi, Rain & Cafe Sounds | Pomodorian",
    description:
      "Free focus timer with built-in ambient sounds. Layer lo-fi beats, rain, cafe noise, nature, and fireplace sounds while you work. No ads.",
    h1: "Focus Music Timer",
    intro:
      "The right background sounds can transform your productivity. Pomodorian combines a Pomodoro timer with 5 layerable ambient sounds — lo-fi beats, rain, café noise, nature, and fireplace. Mix them together, adjust individual volumes, and create your perfect focus environment. No ads, no account, completely free.",
    keywords: ["focus music timer", "lofi timer", "ambient sound timer", "study music timer"],
    category: "use-case",
  },
  {
    slug: "ai-task-planner",
    title: "AI Task Planner — Break Down Goals Into Focused Sessions | Pomodorian",
    description:
      "Free AI task planner that converts goals into actionable tasks with time estimates. Integrated with a Pomodoro timer for immediate execution.",
    h1: "AI Task Planner",
    intro:
      "Describe what you want to accomplish, and AI creates a structured plan with concrete tasks and time estimates. Then work through them with timed Pomodoro sessions. Pomodorian combines AI planning with a focus timer — the fastest way to go from 'I need to do this' to actually doing it.",
    keywords: ["AI task planner", "AI productivity planner", "AI pomodoro planner", "task breakdown AI"],
    category: "use-case",
  },
  {
    slug: "productivity-tracker",
    title: "Productivity Tracker — Focus Analytics & Heatmap | Pomodorian",
    description:
      "Free productivity tracker with GitHub-style contribution heatmap. Track daily focus hours, streaks, and session history. No account required.",
    h1: "Productivity Tracker",
    intro:
      "What gets measured gets improved. Pomodorian tracks every focus session and displays your productivity as a GitHub-style contribution heatmap. See your daily focus time, current streak, and total hours at a glance. All data stays in your browser — private and instant.",
    keywords: ["productivity tracker", "focus tracker", "pomodoro analytics", "productivity heatmap"],
    category: "use-case",
  },
];

export const seoPages: SeoPage[] = [
  ...professions,
  ...techniques,
  ...comparisons,
  ...useCases,
];

export function getSeoPageBySlug(slug: string): SeoPage | undefined {
  return seoPages.find((p) => p.slug === slug);
}

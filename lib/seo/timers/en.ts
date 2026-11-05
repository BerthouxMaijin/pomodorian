import type { TimerPage } from "./types";

// Timer tool pages: week 1 (2026-10-29), week 2 (2026-11-05). Volumes are US monthly searches
// from OpenSEO on 2026-10-29; see seo-agent/timer-pages/QUEUE.tsv.
// Each FAQ topic lives on one or two pages only, so the set does not read as
// one template with the number swapped.
export const enTimerPages: TimerPage[] = [
  {
    slug: "5-minute-timer",
    lang: "en",
    minutes: 5,
    role: "break",
    label: "5 minute",
    title: "5 Minute Timer: Free Countdown for a Real Break",
    description:
      "A free 5 minute timer that starts in one click. The standard Pomodoro short break, with an optional rain, forest or lo-fi background.",
    h1: "5 Minute Timer",
    intro:
      "This timer counts down 5 minutes and rings when the time is up. Five minutes is the classic Pomodoro short break: long enough to stand up, drink water and rest your eyes, short enough that you come back before your focus has gone cold.",
    useCases: [
      "The short break between two 25-minute Pomodoro sessions.",
      "A walk away from the screen to reset your eyes and posture.",
      "A quick tidy of your desk before the next task.",
      "Getting started on a task you keep postponing: just do 5 minutes of it.",
      "A breathing pause before a meeting or a hard conversation.",
    ],
    sections: [
      {
        heading: "Why five minutes is the default break",
        body: "In the Pomodoro Technique, every 25-minute work block is followed by a 3 to 5 minute break, and a longer one after four blocks. Five minutes is a deliberate trade-off: enough to interrupt the mental load of the task, not enough to open something that swallows twenty minutes. The break only works if it is a real break, so leave the inbox and the phone feed for later.",
      },
      {
        heading: "What to do with five minutes",
        body: "Movement beats scrolling. Stand, stretch your shoulders, look at something far away to relax your eyes, refill your glass. What matters is that the break does not pour new information into your head right before you dive back in. In the full app, Pomodorian's Never Dumb exercises offer a short mental reset during long breaks if you want something more structured.",
      },
      {
        heading: "Five minutes against procrastination",
        body: "A five-minute countdown is also a good way to start something you are avoiding. Tell yourself you will only work on it until the alarm. Starting is usually the hardest part, and once the timer is running many people keep going. If you do stop at five minutes, you still made progress, and the next start is easier.",
      },
    ],
    faq: [
      {
        q: "Is a 5 minute break enough?",
        a: "Between short work blocks, yes. After about four blocks, take a longer break of 15 to 30 minutes, which is what the Pomodoro Technique recommends.",
      },
      {
        q: "What should I avoid during a short break?",
        a: "Anything with its own pull: messages, news, social feeds. They follow you back into the next session. Stand up, move, look away from screens.",
      },
      {
        q: "Can I play a sound during the countdown?",
        a: "Yes. Pick rain, forest, fireplace, café or lo-fi under the timer. The sound pauses when you pause and stops when the time is up.",
      },
    ],
    relatedArticleSlugs: [
      "use-pomodoro-breaks-effectively",
      "never-dumb-breaks",
      "why-breaks-make-you-more-productive",
    ],
    published: "2026-10-29",
  },
  {
    slug: "10-minute-timer",
    lang: "en",
    minutes: 10,
    role: "break",
    label: "10 minute",
    title: "10 Minute Timer: Free Online Countdown with Sounds",
    description:
      "Start a 10 minute countdown in one click: no sign-up, nothing to install. For breaks, short meditations and quick batches of small tasks.",
    h1: "10 Minute Timer",
    intro:
      "Ten minutes, one click: the countdown starts and an alarm rings at the end. It is long enough for a proper break after a long focus block, a quick review before an exam, or one small task you keep putting off.",
    useCases: [
      "The break after a 50-minute focus session (the 50/10 rhythm).",
      "A short meditation or breathing session.",
      "A quick revision of your notes before a class or a meeting.",
      "Clearing small admin tasks in one bounded burst.",
      "A screen-free pause in the middle of the afternoon.",
    ],
    sections: [
      {
        heading: "The natural break for longer sessions",
        body: "If you work in blocks longer than 25 minutes, five minutes of rest starts to feel short. The 50/10 rhythm, fifty minutes of work and ten of rest, is one of the most common Pomodoro variations for that reason: it keeps the same ratio of about five to one while giving your mind more room to recover.",
      },
      {
        heading: "Ten minutes for a batch of small tasks",
        body: "Some tasks are too small to deserve a full session but too many to ignore: replying to three messages, booking an appointment, filing two documents. Grouping them into one ten-minute batch keeps them from interrupting your real work all day. When the alarm rings, stop, even if one is left: it goes into the next batch.",
      },
      {
        heading: "A short meditation that fits anywhere",
        body: "Ten minutes is a comfortable length for a beginner meditation or a body scan. Put on the rain or forest sound, start the timer, close your eyes, and let the alarm tell you when you are done, so you never have to check the clock. Pomodorian's article on meditation during breaks has a simple protocol if you want guidance.",
      },
    ],
    faq: [
      {
        q: "Is this 10 minute timer free?",
        a: "Yes, completely. There is no account, no ad and no paid version.",
      },
      {
        q: "Can I use it in full screen for a classroom or a meeting?",
        a: "Yes, where the browser allows it: the full screen button enlarges the countdown so it reads from across a room, and Escape brings you back. iPhone browsers do not offer full screen for web pages, so the button does not appear there.",
      },
      {
        q: "What happens when the time is up?",
        a: "An alarm plays, the one you chose in Pomodorian if you have used the app before, any background sound stops, and the timer rewinds to 10:00, ready for the next round.",
      },
    ],
    relatedArticleSlugs: [
      "meditation-pomodoro-breaks",
      "micro-breaks-boost-focus",
      "use-pomodoro-breaks-effectively",
    ],
    published: "2026-10-29",
  },
  {
    slug: "15-minute-timer",
    lang: "en",
    minutes: 15,
    role: "break",
    label: "15 minute",
    title: "15 Minute Timer: Free Countdown for a Long Break",
    description:
      "A free 15 minute timer, the classic Pomodoro long break. Also handy for a power nap, a short walk or one small task done start to finish.",
    h1: "15 Minute Timer",
    intro:
      "A 15-minute countdown is the long break of the Pomodoro Technique, the one you take after four focus sessions. It also works on its own for a short task, a power nap or a walk around the block.",
    useCases: [
      "The long break after four Pomodoro sessions.",
      "A power nap that ends before deep sleep sets in.",
      "A short walk outside between two work blocks.",
      "A focused sprint on one small, well-defined task.",
      "Timing a presentation rehearsal or a speaking slot.",
    ],
    sections: [
      {
        heading: "The long break of the Pomodoro cycle",
        body: "The usual Pomodoro cycle is four sessions of 25 minutes, each followed by a short break, then one longer break of 15 to 30 minutes. That longer pause is where real recovery happens: time to eat something, get some daylight or simply do nothing. Fifteen minutes is the short end of that range and fits most working days.",
      },
      {
        heading: "Fifteen minutes as a work block",
        body: "Fifteen minutes is also a good length for work you dread. It is short enough that starting feels possible, and long enough to make visible progress on one thing: a first paragraph, the first ten items of a list, the setup of a file. If long sessions are hard for you right now, starting with 15-minute blocks and lengthening them later is a reasonable path.",
      },
      {
        heading: "A nap that does not leave you groggy",
        body: "Short naps of roughly 10 to 20 minutes are often recommended because they end before you sink into deep sleep, which is what makes waking up feel heavy. Start the timer, lie down, and let the alarm wake you. If you use a phone for this, keep the screen on and this page open: a locked phone may not let a web page ring.",
      },
    ],
    faq: [
      {
        q: "How long should a Pomodoro long break be?",
        a: "Between 15 and 30 minutes, taken after four focus sessions. Fifteen minutes works well on most days; take 30 if you are tired or after a demanding morning.",
      },
      {
        q: "Does it work on a phone?",
        a: "Yes, in any modern mobile browser, with no app to install. Keep the screen on and the page open, otherwise the alarm may not sound.",
      },
      {
        q: "Can I pause and resume?",
        a: "Yes. Pause keeps the remaining time and Resume continues from there. Reset, or the end of the countdown, puts it back to 15 minutes.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-technique-complete-guide",
      "why-breaks-make-you-more-productive",
      "use-pomodoro-breaks-effectively",
    ],
    published: "2026-10-29",
  },
  {
    slug: "20-minute-timer",
    lang: "en",
    minutes: 20,
    role: "focus",
    breakMinutes: 5,
    label: "20 minute",
    title: "20 Minute Timer: Free Focus Countdown with Breaks",
    description:
      "A free 20 minute timer for short focus sessions, with a 5 minute break one click away. Easier to start than a full Pomodoro on heavy days.",
    h1: "20 Minute Timer",
    intro:
      "Start the 20-minute countdown, then switch to the 5-minute break when the alarm rings. Twenty minutes is a gentle focus block: a little shorter than a classic Pomodoro, which makes it easier to begin when your attention is scattered or the task feels heavy.",
    useCases: [
      "Short focus sessions when 25 minutes feels like too much.",
      "Study blocks for younger students or on a tired evening.",
      "A first session to warm up before longer blocks.",
      "Reading one chapter or one article with full attention.",
      "Timing a workout circuit or a stretching routine.",
    ],
    sections: [
      {
        heading: "When to choose 20 minutes over 25",
        body: "The 25-minute Pomodoro is a convention, not a law. If you regularly drift off around the fifteenth minute, a 20-minute block that you actually finish is worth more than a 25-minute block you abandon. Many people who struggle with attention find shorter sessions easier to start, and the habit of finishing sessions matters more than their exact length.",
      },
      {
        heading: "How to build up from 20 minutes",
        body: "Treat 20 minutes as a starting point. Once finishing a 20-minute block feels easy for a few days, try 25, then 30. The goal is to find the longest block you can complete without fighting yourself, not to impose a number. The break mode sits right next to the focus mode, so a full cycle is two clicks.",
      },
      {
        heading: "Twenty minutes for reading",
        body: "Reading is one of the first things to suffer when attention is fragmented. A 20-minute timer with your phone in another room is a simple way back into it: one chapter, one long article, one paper. Put on the fireplace or rain sound if silence makes you restless, and stop when the alarm rings so the next session starts with appetite.",
      },
    ],
    faq: [
      {
        q: "Is 20 minutes long enough to focus?",
        a: "For many tasks, yes. It is enough to get into a task and make real progress, and short enough to start without resistance. You can lengthen your sessions later.",
      },
      {
        q: "How long should the break be after 20 minutes?",
        a: "About 5 minutes, which is the break mode built into this timer.",
      },
      {
        q: "What does the link to the full app do?",
        a: "It opens Pomodorian and sets your saved focus length to 20 minutes, so every session there runs 20 minutes until you change it in the settings. The app adds a task list, an AI planner and focus statistics.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-adhd",
      "customize-pomodoro-intervals",
      "build-daily-focus-habit-30-days",
    ],
    published: "2026-10-29",
  },
  {
    slug: "25-minute-timer",
    lang: "en",
    minutes: 25,
    role: "focus",
    breakMinutes: 5,
    label: "25 minute",
    title: "25 Minute Timer: Free Pomodoro Countdown with Sounds",
    description:
      "The classic 25 minute Pomodoro timer with its 5 minute break. Work one task until the alarm, rest, repeat four times, then take a long break.",
    h1: "25 Minute Timer",
    intro:
      "Twenty-five minutes is the length of one classic Pomodoro. Start the countdown, work on a single task until the alarm, switch to the 5-minute break, then go again. Four rounds make a full cycle, followed by a longer break of 15 to 30 minutes.",
    useCases: [
      "One Pomodoro: 25 minutes on a single task, no switching.",
      "Study sessions with a 5-minute break between each.",
      "Writing a first draft without stopping to edit.",
      "Clearing a coding task or a code review in one block.",
      "Any work you want to measure in sessions rather than hours.",
    ],
    sections: [
      {
        heading: "Why 25 minutes",
        body: "The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s, using a tomato-shaped kitchen timer, which is where the name comes from. Twenty-five minutes is short enough to commit to without negotiation, and long enough to get real work done. The technique is less about the exact number than about the rules around it: one task per session, no interruptions, and a real break afterwards.",
      },
      {
        heading: "How to run a Pomodoro with this timer",
        body: "Pick one task and write it down. Start the countdown and work only on that task. If something else comes to mind, note it and keep going. When the alarm rings, stop, click the 5-minute break and step away from the screen. After four sessions, take a longer break. The space bar starts and pauses the timer, so you never have to reach for the mouse.",
      },
      {
        heading: "When 25 minutes is not the right length",
        body: "If you are deep in a task when the alarm rings, it can feel like the timer is cutting you off. That is a sign to try longer blocks, such as 50 minutes with a 10-minute break. If you struggle to reach the end, try 20. The best interval is the one you can repeat all day; Pomodorian's guide to Pomodoro intervals compares the common options.",
      },
    ],
    faq: [
      {
        q: "What is a Pomodoro?",
        a: "One 25-minute block of focused work on a single task, followed by a short break. Four Pomodoros are followed by a longer break.",
      },
      {
        q: "Is 25 minutes the best Pomodoro time?",
        a: "It is the original and a good default. Many people do better with 50/10 or 90/20 for deep work; the right length is the one you can finish consistently.",
      },
      {
        q: "Can I leave the timer in a background tab?",
        a: "Yes. The remaining time is always correct when you come back, because it is computed from the real clock. In a background tab, some browsers can delay the alarm by up to a minute unless a background sound is playing.",
      },
      {
        q: "Can I track my sessions?",
        a: "This page is a single timer. The full Pomodorian app records completed sessions, streaks and a focus heatmap, stored in your browser.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-technique-complete-guide",
      "long-pomodoro-sessions-guide",
      "pomodoro-technique-for-studying",
    ],
    published: "2026-10-29",
  },
  {
    slug: "30-minute-timer",
    lang: "en",
    minutes: 30,
    role: "focus",
    breakMinutes: 5,
    label: "30 minute",
    title: "30 Minute Timer: Free Online Countdown for Focus",
    description:
      "A free 30 minute timer with a 5 minute break mode. Half-hour blocks that match your calendar, for homework, timeboxing, workouts and calls.",
    h1: "30 Minute Timer",
    intro:
      "Half an hour is the block most people already think in: one meeting slot, one study unit, one workout. This timer counts it down and rings at the end, and with the 5-minute break beside it, it also makes a slightly longer Pomodoro.",
    useCases: [
      "A half-hour focus block with a 5-minute break.",
      "Homework or revision in clear, countable units.",
      "Timeboxing a task so it does not take the whole afternoon.",
      "A workout, a run or a yoga session.",
      "Keeping a meeting or a call to its planned length.",
    ],
    sections: [
      {
        heading: "Thirty minutes as a Pomodoro variant",
        body: "A 30/5 rhythm keeps the spirit of the Pomodoro Technique while matching the way calendars are cut. Two sessions plus breaks fit in about 70 minutes, and you can plan a morning as a number of half-hour blocks. It is a good step up for people who find 25 minutes slightly short but are not ready for 50.",
      },
      {
        heading: "Timeboxing with a 30-minute limit",
        body: "Timeboxing means deciding in advance how long a task deserves, then stopping when the time is up. It protects you from perfectionism on tasks that do not need it: a status update, an email draft, the first version of a slide. Start the timer, do the best version you can in that time, and move on. Pomodorian's timeboxing guide covers the method in more detail.",
      },
      {
        heading: "Keeping calls and meetings to their slot",
        body: "A meeting booked for thirty minutes tends to use all of them and then some. Starting a visible countdown when the call begins changes the dynamic: the agenda gets handled first, side topics get parked, and the last five minutes go to decisions and next steps instead of a rushed goodbye.",
      },
    ],
    faq: [
      {
        q: "How many 30 minute sessions should I do in a day?",
        a: "There is no fixed number. Plan the sessions your work needs, and stop adding more when you notice your attention clearly dropping.",
      },
      {
        q: "What break goes with a 30 minute session?",
        a: "Five minutes works well. After three or four sessions, take a longer break of 15 to 30 minutes.",
      },
      {
        q: "Do I need an account or an app?",
        a: "No. The timer runs in your browser, with no account and nothing to install. A background sound you pick is remembered in your browser's storage.",
      },
    ],
    relatedArticleSlugs: [
      "stop-procrastinating-timeboxing",
      "customize-pomodoro-intervals",
      "study-active-recall-spaced-repetition",
    ],
    published: "2026-10-29",
  },
  {
    slug: "40-minute-timer",
    lang: "en",
    minutes: 40,
    role: "focus",
    breakMinutes: 20,
    label: "40 minute",
    title: "40 Minute Timer: Free Countdown, Animedoro Ready",
    description:
      "A free 40 minute timer with a 20 minute break mode for the Animedoro method: work for 40 minutes, then watch one episode, then start again.",
    h1: "40 Minute Timer",
    intro:
      "Forty minutes is a solid focus block, longer than a Pomodoro and easier to sustain than a full hour. Paired with the 20-minute break built into this timer, it is the rhythm of the Animedoro method: 40 minutes of work, then one episode of something you enjoy.",
    useCases: [
      "The Animedoro rhythm: 40 minutes of work, 20 minutes of reward.",
      "A focus block for problem sets or coding.",
      "Essay writing with fewer interruptions than short Pomodoros.",
      "One lecture review or one lab report section.",
      "A medium-length workout or practice session.",
    ],
    sections: [
      {
        heading: "The Animedoro method",
        body: "Animedoro replaces the short Pomodoro break with a longer, more enjoyable one: work for about 40 minutes, then watch one episode of a show, roughly 20 minutes, before starting again. It suits people who find five-minute breaks frustrating because nothing fits in them. The catch is honesty: one episode means one episode. Pomodorian's guide explains when the method works and when it backfires.",
      },
      {
        heading: "Why 40 minutes works for deeper tasks",
        body: "Some work needs a warm-up: loading the problem into your head, rereading where you left off, setting up your tools. In a 25-minute session that warm-up eats a large share of the time. A 40-minute block leaves more room for the productive part after it, while still ending before fatigue makes you sloppy.",
      },
      {
        heading: "Choosing the break that goes with it",
        body: "The timer offers a 20-minute break, the Animedoro choice. If you prefer something more classic, take 10 minutes instead and switch back to the 40-minute timer when you are ready. A longer work block generally calls for a longer break; what matters most is that the break stays bounded.",
      },
    ],
    faq: [
      {
        q: "What is Animedoro?",
        a: "A Pomodoro variation with about 40 minutes of work followed by about 20 minutes of break, usually spent watching one episode of a show.",
      },
      {
        q: "Is a 20 minute break too long?",
        a: "Not after 40 minutes of real focus, as long as the break stays bounded. If you tend to overrun, take 10 minutes instead.",
      },
      {
        q: "Does the break have to be a TV episode?",
        a: "No. Anything you enjoy that has a natural end works: a short game, a walk, a chapter of a novel. Avoid open-ended feeds, which have no last episode.",
      },
    ],
    relatedArticleSlugs: [
      "animedoro-method",
      "long-pomodoro-sessions-guide",
      "customize-pomodoro-intervals",
    ],
    published: "2026-10-29",
  },
  {
    slug: "45-minute-timer",
    lang: "en",
    minutes: 45,
    role: "focus",
    breakMinutes: 15,
    label: "45 minute",
    title: "45 Minute Timer: Free Focus Countdown with Sounds",
    description:
      "A free 45 minute timer with a 15 minute break for 45/15 focus blocks. One block per hour: three rounds fill a morning with real breaks.",
    h1: "45 Minute Timer",
    intro:
      "A 45-minute countdown with a 15-minute break ready right after it. Forty-five minutes is the length of a class period in many schools and a comfortable deep work block: three 45/15 rounds fill a morning with real breaks built in.",
    useCases: [
      "45/15 focus blocks: three rounds make a three-hour morning.",
      "A class period or a tutoring session.",
      "Exam practice under timed conditions.",
      "A focused writing or design session.",
      "Board games, practice rounds or workouts with a set length.",
    ],
    sections: [
      {
        heading: "The 45/15 rhythm",
        body: "Working 45 minutes and resting 15 keeps each hour cleanly divided, which makes planning simple: one block per hour, starting on the hour. The 15-minute break is long enough to leave your desk properly. It suits people who find the 25-minute Pomodoro interrupts them just as they get going, but who still want a firm structure.",
      },
      {
        heading: "Timed practice for exams",
        body: "Some exams and practice papers use slots of about 45 minutes. Practicing under the same constraint trains you to pace yourself, and it shows you where you lose time. Start the timer, put your notes away, and treat it as the real thing. Review your answers during the break, not during the countdown.",
      },
      {
        heading: "Keeping long blocks sustainable",
        body: "A longer block only helps if your attention holds. If you notice yourself rereading the same sentence, it is better to stop a little early than to push through. Use the break for movement and daylight rather than another screen, and keep the background sound low enough that it masks noise without becoming something to listen to.",
      },
    ],
    faq: [
      {
        q: "Is 45 minutes too long to focus?",
        a: "Not for most adults on a task they understand. If you struggle to stay on task that long, start with 25 or 30 minutes and lengthen gradually.",
      },
      {
        q: "Should I take the full 15 minute break?",
        a: "Yes, especially from the second block on. Cutting breaks short is the most common way a good morning turns into a tired afternoon.",
      },
      {
        q: "Can I keep a background sound on for the whole block?",
        a: "Yes. Rain, forest, fireplace, café and lo-fi can be layered, and they pause with the timer.",
      },
    ],
    relatedArticleSlugs: [
      "long-pomodoro-sessions-guide",
      "prepare-exams-without-burnout",
      "deep-work-programmers-framework",
    ],
    published: "2026-10-29",
  },
  {
    slug: "50-minute-timer",
    lang: "en",
    minutes: 50,
    role: "focus",
    breakMinutes: 10,
    label: "50 minute",
    title: "50 Minute Timer: Free 50/10 Pomodoro Countdown",
    description:
      "A free 50 minute timer with a 10 minute break for the 50/10 method: one focus block per hour, started on the hour, with the break at :50.",
    h1: "50 Minute Timer",
    intro:
      "Fifty minutes of work and ten of rest: the 50/10 method is a popular longer alternative to the classic Pomodoro, and it lines up neatly with the hour. Start the 50-minute countdown here, then take the 10-minute break built into the timer.",
    useCases: [
      "The 50/10 method: one focus block per hour.",
      "Deep work on code, writing or analysis.",
      "Long study sessions with a real break each hour.",
      "Working sessions with a body-doubling partner.",
      "Any task where 25 minutes cuts you off too early.",
    ],
    sections: [
      {
        heading: "Why 50/10 is easy to plan",
        body: "The 50/10 rhythm keeps the Pomodoro ratio of about five minutes of work per minute of rest while doubling the block. Its main practical advantage is the clock: start each block on the hour and break at ten minutes to the hour, and your whole day becomes a column of hours. That makes it easy to share with colleagues or a study partner.",
      },
      {
        heading: "Using the 10-minute break well",
        body: "Ten minutes is enough to leave the room. Walk, stretch, drink water, look out of a window. Avoid starting anything with its own pull, such as messages or a news feed, because it will still be in your head when the next block starts. When the alarm rings, switch back to the 50-minute mode and pick up exactly where your notes say you stopped.",
      },
      {
        heading: "50 minutes or 52?",
        body: "You may have seen the 52/17 rule, from a 2014 analysis by the time-tracking app DeskTime, which found that its top 10 percent of users worked about 52 minutes and then took about 17 off. Fifty minutes with a ten-minute break is the same idea rounded to fit an hour. The difference between them matters far less than taking the break at all.",
      },
    ],
    faq: [
      {
        q: "Is 50/10 better than 25/5?",
        a: "Neither is better in general. 50/10 suits tasks that need a long warm-up; 25/5 suits fragmented days and tasks you resist. Many people use both depending on the work.",
      },
      {
        q: "How do I know if 50 minutes is too long for me?",
        a: "If you regularly lose the thread after 30 or 35 minutes, or come out of each block drained, step down to 45 or 30 and build back up.",
      },
      {
        q: "Can I study with someone else on the same rhythm?",
        a: "Yes. Agree to start on the hour; each of you runs the timer, and you break together at ten minutes to. It is a simple form of body doubling.",
      },
    ],
    relatedArticleSlugs: [
      "long-pomodoro-sessions-guide",
      "customize-pomodoro-intervals",
      "body-doubling",
    ],
    published: "2026-10-29",
  },
  {
    slug: "1-hour-timer",
    lang: "en",
    minutes: 60,
    role: "focus",
    breakMinutes: 10,
    label: "1 hour",
    title: "1 Hour Timer: Free 60 Minute Countdown with Sounds",
    description:
      "A free 1 hour timer with a 10 minute break mode. For a full hour of deep work, a study session, an exam simulation, or putting a hard limit on email.",
    h1: "1 Hour Timer",
    intro:
      "This is a 60-minute countdown with an alarm when the hour is up and a 10-minute break mode beside it. One hour suits demanding tasks once you are warmed up, and it is a natural unit for a study session, a writing sprint or a focused project hour.",
    useCases: [
      "A full hour of deep work on one project.",
      "A study session followed by a 10-minute break.",
      "An exam simulation or a timed assignment.",
      "A focused hour of practice: music, language, drawing.",
      "Limiting a task that tends to expand, like email or admin.",
    ],
    sections: [
      {
        heading: "When an hour-long block makes sense",
        body: "An hour suits work where you need the whole problem in your head at once: complex code, a long piece of writing, data analysis. Breaking that every 25 minutes means rebuilding the picture each time. For lighter or more fragmented work, shorter blocks are usually easier to sustain across a day, so keep the hour for the tasks that earn it.",
      },
      {
        heading: "Protecting the hour",
        body: "A long block is only valuable if nothing interrupts it. Before starting, close the chat app, silence notifications, and write down the single outcome you want from the hour. During the countdown, park every stray thought on paper instead of acting on it. When the alarm rings, take the 10-minute break even if you feel fine: the next hour depends on it.",
      },
      {
        heading: "An hour as a limit, not a target",
        body: "The same timer works the other way around for tasks that expand to fill the day. Give your inbox, your admin or your research one hour, start the countdown, and stop when it rings. Knowing the time is bounded makes it easier to prioritize inside it, and keeps the rest of the day for the work that matters.",
      },
    ],
    faq: [
      {
        q: "Can I focus for a whole hour?",
        a: "Many people can on a task they understand and care about, especially after warming up with shorter sessions. If an hour feels long, try 45 or 50 minutes first.",
      },
      {
        q: "What break should follow an hour of work?",
        a: "About 10 minutes, and a longer one after two or three hours.",
      },
      {
        q: "Why does the timer show hours?",
        a: "Durations of an hour or more are shown as H:MM:SS, so 1:00:00 at the start, to avoid misreading 60:00 as a clock time.",
      },
    ],
    relatedArticleSlugs: [
      "long-pomodoro-sessions-guide",
      "ultradian-rhythms-natural-focus-cycles",
      "science-of-flow-state",
    ],
    published: "2026-10-29",
  },
  // Week 2 (2026-11-05).
  {
    slug: "1-minute-timer",
    lang: "en",
    minutes: 1,
    role: "micro",
    label: "1 minute",
    title: "1 Minute Timer: Free 60 Second Countdown",
    description:
      "A free 1 minute timer for planks, quick resets and the one-minute rule. One click, a 60 second countdown, an alarm at the end, no sign-up.",
    h1: "1 Minute Timer",
    intro:
      "Sixty seconds, counted down, with an alarm at zero. One minute sounds like nothing, which is exactly why it works: it is short enough to start anything, and long enough to hold a plank, take a few slow breaths or clear one small task off your list.",
    useCases: [
      "Holding a plank or a stretch for a full minute.",
      "Slow breathing to come down before a call.",
      "Applying the one-minute rule to small chores.",
      "Practicing a one-minute pitch or introduction out loud.",
      "A screen break: look out of the window until the alarm.",
    ],
    sections: [
      {
        heading: "The one-minute rule",
        body: "The writer Gretchen Rubin popularized a simple habit: if a task takes less than a minute, do it now instead of noting it for later. Hang up the coat, reply yes to the message, put the cup in the dishwasher. A one-minute countdown makes the rule concrete, and it shows how many of the things you postpone actually take less time than thinking about them.",
      },
      {
        heading: "Timing plank sets",
        body: "A one-minute plank is a common target, and counting seconds in your head tends to speed up as it gets hard. Get into position, start the timer with the space bar, and hold until the alarm. Because the countdown rewinds by itself, the next set is one press away: rest for as long as you need, then go again. If a full minute is out of reach, hold what you can and build up.",
      },
      {
        heading: "Sixty seconds for speaking practice",
        body: "Many introductions, pitches and interview answers have to fit in about a minute. Start the timer, say your version out loud, and notice where you are when the alarm rings. It is easy to run over on the first try. Cut a sentence, try again, and repeat until the important part lands before the minute is up.",
      },
    ],
    faq: [
      {
        q: "Can I use it for a one-minute breathing reset?",
        a: "Yes. Close your eyes, breathe out a little longer than you breathe in, and let the alarm end it. It will not replace a real break, but it slows you down between two tasks.",
      },
      {
        q: "Can I time several sets in a row?",
        a: "Yes. When the alarm rings the countdown rewinds to 01:00 on its own, so pressing Start again runs another minute.",
      },
      {
        q: "How much can I say in one minute?",
        a: "Roughly 120 to 150 words at a calm speaking pace. Write your pitch shorter than you think, then test it out loud against the timer.",
      },
    ],
    relatedArticleSlugs: [
      "micro-breaks-boost-focus",
      "2-minute-rule-with-pomodoro",
      "recover-focus-after-interruption",
    ],
    published: "2026-11-05",
  },
  {
    slug: "2-minute-timer",
    lang: "en",
    minutes: 2,
    role: "micro",
    label: "2 minute",
    title: "2 Minute Timer: Free Countdown for the 2-Minute Rule",
    description:
      "A free 2 minute timer for the two-minute rule, tooth brushing and tiny habits. Starts in one click and rings at the end, no account needed.",
    h1: "2 Minute Timer",
    intro:
      "Press Start and this timer counts down two minutes. Two minutes is the threshold of David Allen's two-minute rule, the starting size James Clear recommends for a new habit, and the brushing time dentists suggest: small enough to say yes to, long enough to matter.",
    useCases: [
      "The two-minute rule: tasks this short get done now.",
      "Starting a new habit in its smallest possible version.",
      "Brushing your teeth for the full two minutes.",
      "Writing down the first step of your next task.",
      "A short stretch for your neck and shoulders.",
    ],
    sections: [
      {
        heading: "David Allen's two-minute rule",
        body: "In Getting Things Done, David Allen suggests that any action taking less than two minutes should be done immediately, because tracking it would cost more than doing it. Set the timer when you sort your inbox or your to-do list: if the alarm rings before you finish, the task was not a two-minute task, and it goes into a proper work session instead.",
      },
      {
        heading: "The two-minute version of a habit",
        body: "In Atomic Habits, James Clear describes the other two-minute rule: shrink a new habit until it takes two minutes to do. Read one page, do one push-up, write one sentence. The point is to make starting automatic before worrying about doing more. A visible countdown helps on days when even two minutes feels like a lot.",
      },
      {
        heading: "Two minutes before a Pomodoro",
        body: "A focus session goes better when the next step is already written down. Spending two minutes on that before starting a 25-minute session is a small investment: close the tabs you will not need, put the phone away, write the first action in one line. Pomodorian's guide on the two-minute rule shows how the two ideas fit together.",
      },
    ],
    faq: [
      {
        q: "What is the two-minute rule?",
        a: "Two ideas share the name: David Allen's rule (do anything that takes under two minutes immediately) and James Clear's rule (start a new habit with a two-minute version of it).",
      },
      {
        q: "Is two minutes really how long to brush teeth?",
        a: "Two minutes, twice a day, is the common recommendation from dental associations such as the American Dental Association.",
      },
      {
        q: "Can I use it on my phone while brushing my teeth?",
        a: "Yes, in the mobile browser. While the countdown runs, the page keeps the screen awake where the browser supports it, so it does not lock halfway through.",
      },
    ],
    relatedArticleSlugs: [
      "2-minute-rule-with-pomodoro",
      "stop-procrastinating-timeboxing",
      "build-daily-focus-habit-30-days",
    ],
    published: "2026-11-05",
  },
  {
    slug: "3-minute-timer",
    lang: "en",
    minutes: 3,
    role: "micro",
    label: "3 minute",
    title: "3 Minute Timer: Free Countdown for a Breathing Reset",
    description:
      "A free 3 minute timer for a breathing space, steeping tea or a quick reset between tasks. One click to start, an alarm when the time is up.",
    h1: "3 Minute Timer",
    intro:
      "This timer runs for three minutes and rings at zero. Three minutes is the length of a well-known mindfulness exercise, the three-minute breathing space, and a handy unit for everyday things: steeping a cup of tea, a round of stretches, or a pause before you answer a difficult message.",
    useCases: [
      "A three-minute breathing space between two tasks.",
      "Steeping black tea without forgetting it.",
      "A short round of stretches at your desk.",
      "Cooling down before replying to a tense email.",
      "Rehearsing a short talk or a toast.",
    ],
    sections: [
      {
        heading: "The three-minute breathing space",
        body: "Mindfulness-Based Cognitive Therapy includes a short practice called the three-minute breathing space. Roughly, it moves in three steps: notice what is going on in your mind and body, narrow your attention to the breath, then widen it again to the whole body. It is designed to fit into an ordinary day, which makes it a good use of a short break.",
      },
      {
        heading: "A pause before you reply",
        body: "Messages that annoy us tend to get answered fast and regretted later. Starting a three-minute countdown before replying gives the first reaction time to settle. Read the message once, start the timer, do something else with your hands, and write your answer after the alarm. It is usually shorter and calmer than the first draft would have been.",
      },
      {
        heading: "Small timers for small things",
        body: "Plenty of daily tasks run on a few minutes: tea, a face mask, a rest between sets at the gym. Keep this tab in front while you wait: the remaining time is always right when you come back to it, but in a background tab some browsers can delay the alarm by up to a minute unless a background sound is playing, and a minute late is a lot on a three-minute tea.",
      },
    ],
    faq: [
      {
        q: "How long should I steep tea?",
        a: "It depends on the tea and the packaging advice, but black tea is often steeped for about 3 to 5 minutes. Three minutes gives a lighter cup.",
      },
      {
        q: "Can a three-minute exercise really help?",
        a: "It is not a cure for anything, but a short, structured pause is an easy way to step out of autopilot between two demanding tasks.",
      },
      {
        q: "Is there a longer meditation option?",
        a: "Yes. The 10 minute timer suits a beginner meditation, and Pomodorian's article on meditation during breaks describes a simple protocol.",
      },
    ],
    relatedArticleSlugs: [
      "meditation-pomodoro-breaks",
      "micro-breaks-boost-focus",
      "why-breaks-make-you-more-productive",
    ],
    published: "2026-11-05",
  },
  {
    slug: "35-minute-timer",
    lang: "en",
    minutes: 35,
    role: "focus",
    breakMinutes: 5,
    label: "35 minute",
    title: "35 Minute Timer: Free Focus Countdown with a Break",
    description:
      "A free 35 minute timer with a 5 minute break, for when 25 minutes cuts you off just as you get going. Starts in one click, no sign-up.",
    h1: "35 Minute Timer",
    intro:
      "A 35-minute countdown, with a 5-minute break ready beside it. Thirty-five minutes is for when the classic 25-minute Pomodoro cuts you off just as you get going, but a 50-minute block still feels like a stretch.",
    useCases: [
      "Three 35/5 rounds to fill a two-hour morning block.",
      "A slightly longer Pomodoro when 25 minutes cuts you off.",
      "Drafting one section of a report or an essay.",
      "Practice sessions for an instrument or a language.",
      "A lunchtime workout that leaves time to eat.",
    ],
    sections: [
      {
        heading: "Three rounds, two hours",
        body: "Planning in Pomodoros gets easier when the rounds add up to round numbers. With 35 minutes of work and a 5-minute break, each round takes 40 minutes, so three of them make two hours. Start at nine, and by eleven you have done three real focus blocks with breaks built in, and the long break lands right before lunch.",
      },
      {
        heading: "Treat your interval as an experiment",
        body: "Nobody can tell you in advance which length suits your work. Pick one, run it for a week, and look at what you actually finished. The full Pomodorian app keeps a record of completed sessions, so you can compare a week at 35 minutes with a week at 25 instead of relying on how it felt. Then adjust by five or ten minutes and try again.",
      },
      {
        heading: "Keeping the break short",
        body: "At this length a 5-minute break is still enough. Stand up, drink something, look away from the screen, and come back. After three rounds, take a long break of 15 to 30 minutes: with 35-minute blocks, that is the point where the two hours are up.",
      },
    ],
    faq: [
      {
        q: "Is 35 minutes a recognized Pomodoro length?",
        a: "It is not the classic length, but the Pomodoro Technique is about single-tasking and regular breaks more than an exact number. Many people adjust the block to their work.",
      },
      {
        q: "When should I move up from 35 minutes?",
        a: "When you regularly reach the alarm still focused and a little frustrated to stop. Try 45 minutes with a 15-minute break next.",
      },
      {
        q: "Does the timer remember where I was if I reload the page?",
        a: "No. A reload resets it to 35:00, stopped. For sessions you want to keep a record of, use the full app.",
      },
    ],
    relatedArticleSlugs: [
      "customize-pomodoro-intervals",
      "long-pomodoro-sessions-guide",
      "pomodoro-technique-beginners-guide",
    ],
    published: "2026-11-05",
  },
  {
    slug: "90-minute-timer",
    lang: "en",
    minutes: 90,
    role: "focus",
    breakMinutes: 20,
    label: "90 minute",
    title: "90 Minute Timer: Free Countdown for Deep Work",
    description:
      "A free 90 minute timer with a 20 minute break for 90/20 deep work blocks. Shows 1:30:00, runs in your browser, rings when the block ends.",
    h1: "90 Minute Timer",
    intro:
      "This timer counts down an hour and a half, shown as 1:30:00, with a 20-minute break mode beside it. Ninety minutes is a common length for a deep work block: long enough for a demanding task to really move, and a natural unit to plan one or two serious sessions in a day around.",
    useCases: [
      "A 90/20 deep work block on one hard problem.",
      "A long writing or design session without switching.",
      "An exam simulation for a 90-minute paper.",
      "A study block that alternates reading and practice.",
      "A long practice session for music or sport.",
    ],
    sections: [
      {
        heading: "Where the 90-minute idea comes from",
        body: "The sleep researcher Nathaniel Kleitman proposed that the roughly 90-minute cycle seen in sleep might continue during the day as a basic rest and activity cycle. The evidence for a precise daytime rhythm is mixed, so treat 90 minutes as a practical length rather than a law of biology. What is better supported is that attention fades over long stretches and that real breaks help it recover.",
      },
      {
        heading: "How to run a 90/20 block",
        body: "Decide the outcome before you start: a finished section, a fixed bug, a draft. Clear everything else from the screen, keep a sheet of paper next to you for stray thoughts, and start the countdown. When the alarm rings, take the full 20-minute break away from screens before deciding on a second block.",
      },
      {
        heading: "Placing the block in your day",
        body: "A 90-minute block works best when nothing is scheduled to break into it, which usually means before the first meeting or the first look at email. Protect that slot in your calendar the way you would protect a meeting. Pomodorian's guide to customizing Pomodoro intervals compares 90/20 with the shorter options if you want to mix them.",
      },
    ],
    faq: [
      {
        q: "What should I do in the 20 minute break?",
        a: "Something physical and away from screens: a walk, food, daylight. After a long block, the break is where your attention recovers, so do not spend it on messages.",
      },
      {
        q: "What if my focus fades before the alarm?",
        a: "Pause, stand up for a minute, and resume. If it happens every time, try 50 or 60 minutes instead; a block you finish is worth more than a long one you fight.",
      },
      {
        q: "Does the app link set 90 minute sessions?",
        a: "Yes. It opens Pomodorian with your saved focus length set to 90 minutes; set the break you want in the settings.",
      },
    ],
    relatedArticleSlugs: [
      "ultradian-rhythms-natural-focus-cycles",
      "deep-work-programmers-framework",
      "customize-pomodoro-intervals",
    ],
    published: "2026-11-05",
  },
  {
    slug: "2-hour-timer",
    lang: "en",
    minutes: 120,
    role: "frame",
    breakMinutes: 20,
    label: "2 hour",
    title: "2 Hour Timer: Free 120 Minute Countdown",
    description:
      "A free 2 hour timer to frame a long session with breaks inside it: an exam rehearsal, a workshop or a study sprint. Shows 2:00:00.",
    h1: "2 Hour Timer",
    intro:
      "A two-hour countdown, displayed as 2:00:00, with a 20-minute break mode next to it. Deep focus rarely holds for two hours straight, so this timer works best as an outer frame: the limit of a session that has shorter work blocks and breaks inside it.",
    useCases: [
      "Rehearsing a two-hour exam from start to finish.",
      "Framing a study sprint that contains short breaks.",
      "Keeping a workshop or a long meeting to its slot.",
      "A long rehearsal or a practice match.",
      "Putting a limit on gaming or streaming time.",
    ],
    sections: [
      {
        heading: "Two hours as a frame, not one block",
        body: "Start the two-hour countdown here as the outer limit of your session. For the work inside it, run shorter blocks with the 50 minute timer in another tab, or with the cycles of the full app. When the big countdown rings, the session is over, whatever the inner timers say, so you stop on time instead of drifting into the evening.",
      },
      {
        heading: "What fits inside two hours",
        body: "A workable shape: 10 minutes to plan and write down what done looks like, 50 minutes of work, a 10-minute break, 40 more minutes of work, and 10 minutes at the end to review and note the next step. That leaves room for a real break in the middle and ends with something you can pick up tomorrow without warming up from zero.",
      },
      {
        heading: "Running a workshop on time",
        body: "Long workshops and meetings tend to overrun their final part, which is usually where decisions are made. Put the countdown in full screen where everyone can see it, agree on checkpoints at the start, and when the last 20 minutes begin, switch the discussion to decisions and owners. People keep to time much better when they can see it.",
      },
    ],
    faq: [
      {
        q: "Can I use it to limit screen time?",
        a: "Yes. Decide the limit before you start, start the countdown, and stop at the alarm. Finishing the current round or episode is fine; starting a new one is not.",
      },
      {
        q: "Why is the break mode 20 minutes?",
        a: "It is there for the break after the whole session. Inside the two hours, use shorter breaks between blocks.",
      },
      {
        q: "Will the timer still be right after two hours in a background tab?",
        a: "The remaining time will be correct when you return, since it is based on the real clock. In a background tab the alarm itself can ring up to about a minute late in some browsers unless a background sound is playing.",
      },
    ],
    relatedArticleSlugs: [
      "prepare-exams-without-burnout",
      "long-pomodoro-sessions-guide",
      "group-pomodoro-team-sessions",
    ],
    published: "2026-11-05",
  },
];

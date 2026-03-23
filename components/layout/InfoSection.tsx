"use client";

import Link from "next/link";

export function InfoSection() {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 mt-12 space-y-16 text-sm leading-relaxed">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          An AI-powered Pomodoro Timer to boost your productivity
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          Free. No account required. Works offline.
        </p>
      </div>

      {/* What is Pomodorian */}
      <div className="glass rounded-2xl p-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          What is Pomodorian?
        </h3>
        <p className="text-muted leading-relaxed">
          Pomodorian is a modern, free Pomodoro timer that works on desktop and
          mobile browsers. Unlike traditional timers, Pomodorian features an{" "}
          <strong className="text-foreground">AI Session Planner</strong> that
          breaks down your goals into focused tasks — so you spend less time
          planning and more time doing. It also includes built-in ambient
          sounds, focus analytics, and a beautiful dark mode interface.
        </p>
      </div>

      {/* What is Pomodoro Technique */}
      <div className="glass rounded-2xl p-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          What is the Pomodoro Technique?
        </h3>
        <p className="text-muted leading-relaxed">
          The Pomodoro Technique is created by Francesco Cirillo for a more
          productive way to work and study. The technique uses a timer to break
          down work into intervals, traditionally 25 minutes in length,
          separated by short breaks. Each interval is known as a pomodoro, from
          the Italian word for &quot;tomato&quot;, after the tomato-shaped
          kitchen timer that Cirillo used as a university student.
        </p>
      </div>

      {/* How to use */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          How to use Pomodorian?
        </h3>
        <ol className="space-y-2 text-muted">
          {[
            "Add tasks to work on today, or use the AI Planner to generate them from your goals",
            "Set estimated pomodoros for each task (1 pomodoro = 25 min of work)",
            "Select a task to work on",
            "Start the timer and focus on the task for 25 minutes",
            "Take a 5-minute break when the alarm rings",
            "After 4 pomodoros, take a longer 15-minute break",
            "Repeat until you finish your tasks",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-foreground font-mono text-xs mt-0.5 flex-shrink-0">
                {i + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Core Features
          </h3>
          <ul className="space-y-2.5 text-muted">
            {[
              {
                title: "AI Session Planner",
                desc: "Describe your goals and AI breaks them into pomodoro-sized tasks with time estimates. Supports 8 languages.",
              },
              {
                title: "Ambient Sounds",
                desc: "Built-in rain, caf\u00e9, lo-fi, nature, and fireplace sounds. Layer and mix them freely.",
              },
              {
                title: "Focus Analytics",
                desc: "GitHub-style contribution heatmap, daily stats, and streak tracking.",
              },
              {
                title: "Custom Settings",
                desc: "Personalize timer durations, alarm sounds, auto-start, theme, and more.",
              },
              {
                title: "Keyboard Shortcuts",
                desc: "Power user shortcuts for every action. Press ? to see them all.",
              },
              {
                title: "Works Offline",
                desc: "Installable as a PWA. Use it without internet (except AI planner).",
              },
            ].map((f) => (
              <li key={f.title} className="flex gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">
                  &#10003;
                </span>
                <div>
                  <strong className="text-foreground">{f.title}:</strong>{" "}
                  {f.desc}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Why Pomodorian?
          </h3>
          <ul className="space-y-2.5 text-muted">
            {[
              {
                title: "AI-Powered",
                desc: "The only free Pomodoro timer with AI task planning built in.",
              },
              {
                title: "Beautiful Design",
                desc: "Glassmorphism dark mode with smooth animations. Light mode available.",
              },
              {
                title: "100% Free",
                desc: "No premium tier, no ads, no account required. All features are free.",
              },
              {
                title: "Privacy-First",
                desc: "All data stored locally in your browser. Nothing sent to servers (except AI planner requests).",
              },
              {
                title: "Open Source",
                desc: "Built with Next.js and deployed on Vercel. Contribute on GitHub.",
              },
              {
                title: "No Downloads",
                desc: "Works directly in your browser. Install as a PWA for an app-like experience.",
              },
            ].map((f) => (
              <li key={f.title} className="flex gap-2">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">
                  &#10003;
                </span>
                <div>
                  <strong className="text-foreground">{f.title}:</strong>{" "}
                  {f.desc}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comparison */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Pomodorian vs Pomofocus
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 text-muted font-medium">Feature</th>
                <th className="py-2 px-4 text-foreground font-medium">
                  Pomodorian
                </th>
                <th className="py-2 px-4 text-muted font-medium">Pomofocus</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {[
                ["AI Task Planner", "Yes (free)", "No"],
                ["Ambient Sounds", "5 sounds (free)", "Paid only"],
                ["Analytics Heatmap", "Yes (free)", "Basic (paid for yearly)"],
                ["Offline Support", "Yes (PWA)", "No"],
                ["Dark Mode", "Yes", "No"],
                ["Price", "Free", "Free + $3/mo premium"],
                ["Account Required", "No", "Yes (for reports)"],
                ["Open Source", "Yes", "No"],
              ].map(([feature, pomo, focus]) => (
                <tr key={feature} className="border-b border-border/50">
                  <td className="py-2 pr-4">{feature}</td>
                  <td className="py-2 px-4 text-emerald-400">{pomo}</td>
                  <td className="py-2 px-4">{focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog CTA */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Learn more about productivity
        </h3>
        <p className="text-muted">
          Read our guides on the Pomodoro Technique, AI productivity tools, and
          the science of ambient sounds.
        </p>
        <Link
          href="/blog"
          className="inline-block px-6 py-2.5 rounded-xl glass text-foreground text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          Read the Blog &rarr;
        </Link>
      </div>
    </section>
  );
}

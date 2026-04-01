import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — Pomodorian",
  description:
    "Meet the builder behind Pomodorian. Built by Jean-Baptiste Berthoux, a French builder who needed a better focus tool.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jean-Baptiste Berthoux",
  url: `${SITE_URL}/about`,
  jobTitle: "Builder",
  description:
    "French builder and creator of Pomodorian, an AI-powered Pomodoro timer.",
  sameAs: [
    "https://github.com/BerthouxMaijin",
    "https://www.linkedin.com/in/jean-baptiste-berthoux/",
  ],
  image: `${SITE_URL}/jb.jpg`,
  worksFor: {
    "@type": "Organization",
    name: "Pomodorian",
    url: SITE_URL,
  },
  knowsAbout: [
    "Web Development",
    "Artificial Intelligence",
    "Productivity",
    "Pomodoro Technique",
  ],
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            &larr; Back to Pomodorian
          </Link>

          {/* Hero */}
          <div className="flex items-center gap-5 mt-10 mb-10">
            <Image
              src="/jb.jpg"
              alt="Jean-Baptiste Berthoux"
              width={80}
              height={80}
              className="rounded-full ring-2 ring-border"
            />
            <div>
              <h1 className="text-2xl font-bold">Jean-Baptiste Berthoux</h1>
              <p className="text-muted text-sm mt-1">
                Builder &amp; creator of Pomodorian
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-muted leading-relaxed">
            {/* Story */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Why I built Pomodorian
              </h2>
              <p>
                I&apos;m a French builder who spends most of his day shipping
                products. Like many makers, I struggled with context switching,
                endless distractions, and that feeling of being busy all day
                without actually shipping anything meaningful.
              </p>
              <p>
                I tried every Pomodoro app out there. They all did the basics
                fine, but none of them solved the problem I actually had:{" "}
                <strong className="text-foreground">
                  figuring out what to work on and for how long.
                </strong>{" "}
                So I built Pomodorian — a timer that doesn&apos;t just count
                down, but helps you plan your focus sessions with AI.
              </p>
              <p>
                Describe your goal, and the AI breaks it into concrete tasks
                with time estimates. No more staring at a blank task list
                wondering where to start.
              </p>
            </section>

            {/* Philosophy */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                How Pomodorian is built
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Open Source
                  </h3>
                  <p className="text-xs">
                    The entire codebase is public on GitHub. You can inspect
                    every line, suggest improvements, or fork it.
                  </p>
                </div>
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Privacy First
                  </h3>
                  <p className="text-xs">
                    All your data stays in your browser. No account, no
                    tracking, no analytics. Your focus sessions are yours alone.
                  </p>
                </div>
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Free Forever
                  </h3>
                  <p className="text-xs">
                    Every feature — AI planner, ambient sounds, analytics — is
                    free. No paywalls, no trial periods, no feature gates.
                  </p>
                </div>
              </div>
            </section>

            {/* Links */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Find me online
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/BerthouxMaijin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-full px-4 py-2 text-xs hover:bg-surface-hover transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/jean-baptiste-berthoux/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-full px-4 py-2 text-xs hover:bg-surface-hover transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://en.tipeee.com/jbberthoux/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-full px-4 py-2 text-xs hover:bg-surface-hover transition-colors"
                >
                  Support on Tipeee
                </a>
                <a
                  href="mailto:jean-baptiste@academieweb3.com"
                  className="glass rounded-full px-4 py-2 text-xs hover:bg-surface-hover transition-colors"
                >
                  Email
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

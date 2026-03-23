import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Pomodorian",
  description: "Pomodorian terms of service.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to Pomodorian
        </Link>
        <h1 className="text-3xl font-bold mt-8 mb-8">Terms of Service</h1>

        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <p>
            <strong className="text-foreground">Last updated:</strong> March 23,
            2026
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Acceptance of Terms
            </h2>
            <p>
              By using Pomodorian, you agree to these terms. Pomodorian is
              provided as-is, free of charge, for personal and commercial use.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Use of Service
            </h2>
            <p>
              Pomodorian is a web-based productivity tool. You may use it for
              any lawful purpose. You are responsible for your own data — since
              all data is stored locally in your browser, we cannot recover
              lost data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              AI Session Planner
            </h2>
            <p>
              The AI Session Planner uses third-party AI services (Anthropic)
              to generate task suggestions. These suggestions are provided for
              convenience and should not be considered professional advice. The
              AI may occasionally produce inaccurate or unhelpful suggestions.
              Use your judgment when following AI-generated plans.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Ambient Sounds
            </h2>
            <p>
              Ambient sounds included in Pomodorian are sourced from
              royalty-free and Creative Commons licensed content. Rain, nature,
              and fireplace sounds are from Orange Free Sounds (CC BY-NC 4.0).
              Lo-fi music is from HoliznaCC0 (CC0 Public Domain). Caf&eacute;
              ambience is from QuickSounds (free SFX license).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Limitation of Liability
            </h2>
            <p>
              Pomodorian is provided &quot;as is&quot; without warranty of any
              kind. We are not liable for any damages arising from your use of
              the service, including but not limited to loss of data or
              productivity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of
              Pomodorian after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p>
              Questions? Please{" "}
              <Link
                href="/contact"
                className="text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

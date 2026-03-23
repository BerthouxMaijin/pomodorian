import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Pomodorian",
  description: "Pomodorian privacy policy. Your data stays in your browser.",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to Pomodorian
        </Link>
        <h1 className="text-3xl font-bold mt-8 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <p>
            <strong className="text-foreground">Last updated:</strong> March 23,
            2026
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>
            <p>
              Pomodorian is designed with privacy in mind. We store as little
              data as possible, and your focus data never leaves your device.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Data Stored Locally
            </h2>
            <p>
              All your tasks, settings, timer state, and focus session history
              are stored in your browser&apos;s localStorage. This data never
              leaves your device and is not sent to any server. You can clear
              this data at any time by clearing your browser storage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              AI Session Planner
            </h2>
            <p>
              When you use the AI Session Planner, the text you enter (your
              session goal) is sent to the Anthropic API to generate task
              suggestions. This data is processed by Anthropic according to
              their privacy policy. We do not store your goals or the AI
              responses on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Analytics & Tracking
            </h2>
            <p>
              Pomodorian does not use any analytics tools, cookies, or tracking
              scripts. We do not collect any personal information, usage data,
              or behavioral data. Vercel (our hosting provider) may collect
              basic server logs (IP addresses, request timestamps) as part of
              their standard hosting infrastructure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Third-Party Services
            </h2>
            <ul className="space-y-1 ml-4">
              <li>
                &bull; <strong className="text-foreground">Vercel</strong>:
                Hosting and deployment
              </li>
              <li>
                &bull; <strong className="text-foreground">Anthropic</strong>:
                AI task generation (only when you use the AI planner)
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Your Rights
            </h2>
            <p>
              Since all data is stored locally in your browser, you have full
              control. You can view, export, or delete your data at any time by
              accessing your browser&apos;s developer tools (Application &gt;
              Local Storage).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p>
              If you have questions about this privacy policy, please{" "}
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

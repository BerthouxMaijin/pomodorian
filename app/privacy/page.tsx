import Link from "next/link";
import type { Metadata } from "next";
import ConsentResetButton from "@/components/ConsentResetButton";

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
            <strong className="text-foreground">Last updated:</strong> October
            28, 2026
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
              Feedback & Bug Reports
            </h2>
            <p>
              When you send feedback or report a bug from the in-app form, we
              receive the message you wrote, the page you were on, your screen
              size, your time zone, your interface theme and your browser user
              agent. Your email address is optional and is only used to reply to
              you. The message is delivered to us by email through Resend and is
              not stored in any database. Nothing is sent unless you submit the
              form yourself.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Analytics & Tracking
            </h2>
            <p>
              We measure how Pomodorian is used so we can improve it. We never
              use advertising cookies, never sell data, and never see the
              content of your tasks.
            </p>
            <p>
              <strong className="text-foreground">Vercel Web Analytics</strong>{" "}
              counts page views and a few anonymous product events (for example
              &ldquo;timer started&rdquo; or &ldquo;pomodoro completed&rdquo;).
              It uses no cookies and does not identify you across sites.
            </p>
            <p>
              <strong className="text-foreground">Google Analytics 4</strong>{" "}
              measures the same pages and events in more detail, and only sets
              its cookies (<code>_ga</code>, <code>_ga_*</code>) if you click
              &ldquo;Accept&rdquo; on the banner. Without your consent, no
              analytics cookie is stored. Cookies expire after 13 months. You can
              change your choice at any time:
            </p>
            <ConsentResetButton />
            <p>
              Vercel (our hosting provider) also keeps basic server logs (IP
              addresses, request timestamps) as part of its standard hosting
              infrastructure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Third-Party Services
            </h2>
            <ul className="space-y-1 ml-4">
              <li>
                &bull; <strong className="text-foreground">Vercel</strong>:
                Hosting, deployment and cookieless web analytics
              </li>
              <li>
                &bull; <strong className="text-foreground">Google</strong>:
                Audience measurement (Google Analytics, only with your consent)
              </li>
              <li>
                &bull; <strong className="text-foreground">Anthropic</strong>:
                AI task generation (only when you use the AI planner)
              </li>
              <li>
                &bull; <strong className="text-foreground">Resend</strong>: Email
                delivery (only when you submit the feedback form)
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

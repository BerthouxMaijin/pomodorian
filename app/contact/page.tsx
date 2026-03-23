import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Pomodorian",
  description: "Get in touch with the Pomodorian team.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to Pomodorian
        </Link>
        <h1 className="text-3xl font-bold mt-8 mb-8">Contact</h1>

        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <p>
            Pomodorian is an open-source project. Here&apos;s how to reach us:
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://github.com/BerthouxMaijin/pomodorian/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-5 hover:bg-surface-hover transition-colors block"
            >
              <h3 className="text-base font-semibold text-foreground mb-1">
                Bug Reports & Features
              </h3>
              <p className="text-muted text-xs">
                Open an issue on GitHub for bugs, feature requests, or
                suggestions.
              </p>
            </a>

            <a
              href="https://github.com/BerthouxMaijin/pomodorian"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-5 hover:bg-surface-hover transition-colors block"
            >
              <h3 className="text-base font-semibold text-foreground mb-1">
                Contribute
              </h3>
              <p className="text-muted text-xs">
                Pomodorian is open source. Pull requests are welcome on GitHub.
              </p>
            </a>

            <a
              href="mailto:jean-baptiste@academieweb3.com"
              className="glass rounded-2xl p-5 hover:bg-surface-hover transition-colors block"
            >
              <h3 className="text-base font-semibold text-foreground mb-1">
                Email
              </h3>
              <p className="text-muted text-xs">
                For business inquiries, partnerships, or press.
              </p>
            </a>

            <a
              href="https://github.com/BerthouxMaijin/pomodorian/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-5 hover:bg-surface-hover transition-colors block"
            >
              <h3 className="text-base font-semibold text-foreground mb-1">
                Community
              </h3>
              <p className="text-muted text-xs">
                Join the discussion on GitHub Discussions.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

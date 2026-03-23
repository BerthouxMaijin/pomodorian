"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-16">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>
        <p className="text-center text-xs text-muted mt-4">
          Made with focus by Pomodorian &middot; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

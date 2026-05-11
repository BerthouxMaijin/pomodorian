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
            href="/about"
            className="hover:text-foreground transition-colors"
          >
            About
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
        <div className="flex justify-center mt-5">
          <a
            href="https://ko-fi.com/jbbthx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support Pomodorian on Ko-fi"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF5E5B] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#ff7370] hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 4H6a2 2 0 0 0-2 2v8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4h.5a3.5 3.5 0 0 0 0-7H20V4Zm-1.5 7H18V8h.5a1.5 1.5 0 0 1 0 3ZM4 20h16v2H4z" />
            </svg>
            Buy me a coffee
          </a>
        </div>
        <p className="text-center text-xs text-muted mt-4">
          Made with focus by Pomodorian &middot; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

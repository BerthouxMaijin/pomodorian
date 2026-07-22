"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@vercel/analytics";
import {
  buildFeedbackEmail,
  FEEDBACK_COPY,
  resolveFeedbackLocale,
  type FeedbackLocale,
} from "./feedbackCopy";

const DISMISSED_KEY = "pomodorian-feedback-prompt-v1-dismissed";

const bugReportUrl =
  "https://github.com/BerthouxMaijin/pomodorian/issues/new?labels=bug&title=%5BBug%5D%20";

export function FeedbackPrompt() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<FeedbackLocale>("en");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const copy = FEEDBACK_COPY[locale];
  const feedbackEmail = buildFeedbackEmail(copy);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLocale(resolveFeedbackLocale(navigator.languages));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const rememberDismissal = useCallback(() => {
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Storage is optional; closing the prompt should always work.
    }
  }, []);

  const dismiss = useCallback(() => {
    rememberDismissal();
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, [rememberDismissal]);

  useEffect(() => {
    let dismissed = false;

    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === "true";
    } catch {
      // The prompt can still be opened manually when storage is unavailable.
    }

    if (dismissed) return;

    const timeout = window.setTimeout(() => setOpen(true), 7000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dismiss, open]);

  const openManually = () => {
    setOpen(true);
    track("feedback_prompt_opened", { source: "floating_button" });
  };

  const handleFeedbackClick = () => {
    rememberDismissal();
    setOpen(false);
    track("feedback_started", { type: "general" });
  };

  const handleBugClick = () => {
    rememberDismissal();
    setOpen(false);
    track("feedback_started", { type: "bug" });
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openManually}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-border bg-neutral-950/85 px-3.5 py-2 text-xs font-medium text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-red-400/40 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 sm:bottom-5 sm:left-5"
        aria-label={copy.triggerAriaLabel}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
        {copy.triggerLabel}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            aria-describedby="feedback-description"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
              onClick={dismiss}
              aria-label={copy.backdropAriaLabel}
            />

            <motion.div
              className="glass relative w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-8"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
                  <span className="size-1.5 rounded-full bg-red-400" aria-hidden="true" />
                  {copy.badge}
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={dismiss}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                  aria-label={copy.closeAriaLabel}
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <h2 id="feedback-title" className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {copy.title}
              </h2>
              <p id="feedback-description" className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {copy.description}
              </p>

              <div className="mt-7 grid gap-3">
                <a
                  href={feedbackEmail}
                  onClick={handleFeedbackClick}
                  className="flex items-center justify-between rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  {copy.feedbackCta}
                  <span className="font-mono text-xs font-normal text-white/75">{copy.feedbackEstimate}</span>
                </a>
                <a
                  href={bugReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBugClick}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  {copy.bugCta}
                  <span className="text-muted" aria-hidden="true">↗</span>
                </a>
                <button
                  type="button"
                  onClick={dismiss}
                  className="py-2 text-xs text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:underline"
                >
                  {copy.dismissCta}
                </button>
              </div>

              <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
                {copy.footer}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

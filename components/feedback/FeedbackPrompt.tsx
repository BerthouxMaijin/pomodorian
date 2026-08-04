"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@/lib/track";
import {
  buildMessagePlaceholder,
  FEEDBACK_COPY,
  type FeedbackType,
} from "./feedbackCopy";
import {
  resolveBrowserLocale,
  type UiLocale,
} from "@/lib/i18n/locales";

const DISMISSED_KEY = "pomodorian-feedback-prompt-v1-dismissed";
const MIN_MESSAGE_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type View = "choose" | "form" | "success";

function collectContext() {
  return {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    path: window.location.pathname,
    theme: document.documentElement.getAttribute("data-theme") ?? "",
  };
}

export function FeedbackPrompt() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<UiLocale>("en");
  const [view, setView] = useState<View>("choose");
  const [type, setType] = useState<FeedbackType>("feedback");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const copy = FEEDBACK_COPY[locale];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLocale(resolveBrowserLocale(navigator.languages));
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

  useEffect(() => {
    if (open && view === "form") messageRef.current?.focus();
  }, [open, view]);

  const openManually = () => {
    // Un brouillon de formulaire est conservé, mais un écran de succès
    // résiduel (fermé via la croix) doit revenir au menu.
    setView((current) => (current === "success" ? "choose" : current));
    setOpen(true);
    track("feedback_prompt_opened", { source: "floating_button" });
  };

  const startForm = (nextType: FeedbackType) => {
    setType(nextType);
    setError(null);
    setView("form");
    track("feedback_started", { type: nextType });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;

    const trimmedMessage = message.trim();
    const trimmedEmail = email.trim();

    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      setError(copy.errorTooShort);
      messageRef.current?.focus();
      return;
    }

    if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) {
      setError(copy.errorInvalidEmail);
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: trimmedMessage,
          email: trimmedEmail,
          locale,
          context: collectContext(),
          website: honeypot,
        }),
      });

      if (!response.ok) {
        setError(
          response.status === 429 ? copy.errorRateLimited : copy.errorGeneric
        );
        return;
      }

      rememberDismissal();
      setMessage("");
      setEmail("");
      setView("success");
      track("feedback_sent", { type });
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setSending(false);
    }
  };

  const closeAfterSuccess = () => {
    setView("choose");
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const formTitle = type === "bug" ? copy.bugFormTitle : copy.feedbackFormTitle;

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
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
              onClick={dismiss}
              aria-label={copy.backdropAriaLabel}
            />

            <motion.div
              className="glass relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-8"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

              <div className="mb-5 flex items-start justify-between gap-4">
                {view === "form" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setView("choose");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    {copy.backLabel}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
                    <span className="size-1.5 rounded-full bg-red-400" aria-hidden="true" />
                    {copy.badge}
                  </div>
                )}
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

              {view === "choose" && (
                <>
                  <h2 id="feedback-title" className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {copy.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {copy.description}
                  </p>

                  <div className="mt-7 grid gap-3">
                    <button
                      type="button"
                      onClick={() => startForm("feedback")}
                      className="flex items-center justify-between rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      {copy.feedbackCta}
                      <span aria-hidden="true" className="text-white/75">→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startForm("bug")}
                      className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      {copy.bugCta}
                      <span className="text-muted" aria-hidden="true">→</span>
                    </button>
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
                </>
              )}

              {view === "form" && (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 id="feedback-title" className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {formTitle}
                  </h2>

                  <label htmlFor="feedback-message" className="mt-5 block text-xs font-medium text-muted">
                    {copy.messageLabel}
                  </label>
                  <textarea
                    id="feedback-message"
                    ref={messageRef}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={6}
                    maxLength={4000}
                    required
                    placeholder={buildMessagePlaceholder(copy, type)}
                    className="mt-1.5 w-full resize-y rounded-xl border border-border bg-surface px-3 py-2.5 text-base leading-relaxed text-foreground placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 md:text-sm"
                  />

                  <label htmlFor="feedback-email" className="mt-4 block text-xs font-medium text-muted">
                    {copy.emailLabel}{" "}
                    <span className="font-normal text-muted/70">({copy.emailOptional})</span>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={200}
                    autoComplete="email"
                    placeholder={copy.emailPlaceholder}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 md:text-sm"
                  />

                  {/* Honeypot : masqué aux humains, rempli par les bots. */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-9999px] size-px opacity-0"
                  />

                  {error && (
                    <p role="alert" className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-5 flex w-full items-center justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? copy.submittingCta : copy.submitCta}
                  </button>

                  <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
                    {copy.privacyNote}
                  </p>
                </form>
              )}

              {view === "success" && (
                <div className="py-2 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-full border border-red-400/25 bg-red-500/10">
                    <svg viewBox="0 0 24 24" className="size-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 id="feedback-title" className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {copy.successTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {copy.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={closeAfterSuccess}
                    className="mt-6 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    {copy.successCta}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

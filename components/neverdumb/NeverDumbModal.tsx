"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { track } from "@/lib/track";
import { formatTime } from "@/lib/utils";
import type { UiLocale } from "@/lib/i18n/locales";
import { useBrowserLocale } from "@/hooks/useBrowserLocale";
import { useNeverDumbStats } from "@/hooks/useNeverDumbStats";
import { EXERCISES_BY_MODE, FOCUS_RING, modeOf, poolSize } from "./catalog";
import { NEVER_DUMB_COPY, type ExerciseId } from "./neverDumbCopy";
import { ExerciseFrame } from "./ExerciseFrame";
import { ExerciseResult } from "./ExerciseResult";
import { NeverDumbHub } from "./NeverDumbHub";
import { ExerciseView } from "./ExerciseView";
import { NdIcon } from "./NdIcon";

type CloseReason = "skip" | "complete" | "timer-ended";

type View =
  | { screen: "hub" }
  | { screen: "exercise"; id: ExerciseId; run: number; variant: number; seed: number }
  | { screen: "result"; id: ExerciseId; feedback?: string };

interface NeverDumbModalProps {
  timeRemaining: number;
  totalTime: number;
  /** Titles of the tasks behind the latest focus blocks, newest first. */
  recentTasks: string[];
  onAddTask: (title: string) => void;
  onClose: (reason: CloseReason) => void;
  onPauseAmbients: () => void;
  onResumeAmbients: () => void;
}

// Localized companion-article URLs for the locales the blog covers;
// every other locale falls back to the English article.
const ARTICLE_URLS: Partial<Record<UiLocale, string>> = {
  fr: "/blog/fr/pauses-never-dumb",
  es: "/blog/es/pausas-never-dumb",
  de: "/blog/de/never-dumb-pausen",
};

const BACKDROP =
  "radial-gradient(55% 45% at 8% 0%, color-mix(in srgb, var(--nd-serious) 16%, transparent), transparent 70%)," +
  "radial-gradient(45% 40% at 95% 10%, color-mix(in srgb, var(--nd-fun) 12%, transparent), transparent 70%)," +
  "radial-gradient(50% 45% at 50% 105%, color-mix(in srgb, var(--nd-reset) 12%, transparent), transparent 70%)," +
  "var(--background)";

function BreakRing({ progress }: { progress: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="-rotate-90">
      <circle cx="12" cy="12" r={r} fill="none" strokeWidth="2.5" className="stroke-border" />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * progress}
        className="stroke-nd-reset transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
}

export function NeverDumbModal({
  timeRemaining,
  totalTime,
  recentTasks,
  onAddTask,
  onClose,
  onPauseAmbients,
  onResumeAmbients,
}: NeverDumbModalProps) {
  const locale = useBrowserLocale();
  const copy = NEVER_DUMB_COPY[locale];
  const stats = useNeverDumbStats();
  const { takeFromPool, recordCompletion } = stats;
  const [view, setView] = useState<View>({ screen: "hub" });
  const runRef = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const articleUrl = ARTICLE_URLS[locale] ?? "/blog/never-dumb-breaks";

  const close = useCallback(
    (reason: CloseReason) => {
      if (reason === "skip") track("neverdumb_skipped");
      onClose(reason);
    },
    [onClose]
  );

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close("skip");
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [close]);

  const show = useCallback((next: View) => {
    setView(next);
    // Each screen starts at the top of the scrollable overlay.
    dialogRef.current?.parentElement?.scrollTo({ top: 0 });
  }, []);

  const startExercise = useCallback(
    (id: ExerciseId) => {
      const size = poolSize(id, copy);
      runRef.current += 1;
      show({
        screen: "exercise",
        id,
        run: runRef.current,
        variant: size > 0 ? takeFromPool(id, size) : 0,
        seed: Math.floor(Math.random() * 2 ** 31),
      });
      track("neverdumb_path_selected", { path: modeOf(id) });
      track("neverdumb_exercise_started", { exercise: id });
    },
    [copy, show, takeFromPool]
  );

  const currentId = view.screen === "exercise" ? view.id : null;
  const completeExercise = useCallback(
    (feedback?: string) => {
      if (!currentId) return;
      recordCompletion(modeOf(currentId));
      track("neverdumb_exercise_completed", { exercise: currentId });
      show({ screen: "result", id: currentId, feedback });
    },
    [currentId, recordCompletion, show]
  );

  const nextSurprise = useCallback(() => {
    if (view.screen !== "result") return;
    const pool = EXERCISES_BY_MODE.fun.filter((id) => id !== view.id);
    startExercise(pool[Math.floor(Math.random() * pool.length)]);
  }, [startExercise, view]);

  const breakProgress = totalTime > 0 ? Math.max(0, Math.min(1, 1 - timeRemaining / totalTime)) : 0;
  const viewKey = view.screen === "exercise" ? `exercise-${view.run}` : view.screen === "result" ? `result-${view.id}` : "hub";

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto text-foreground"
      style={{ background: BACKDROP }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="neverdumb-brand"
        lang={locale === "zh" ? "zh-Hans" : locale}
        className="flex min-h-full flex-col outline-none"
      >
        <header className="sticky top-0 z-20 border-b border-border bg-background/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-7">
            <div id="neverdumb-brand" className="flex items-center gap-2.5 text-sm sm:text-base font-semibold tracking-tight">
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-nd-serious" />
                <span className="h-2.5 w-2.5 rounded-full bg-nd-fun" />
                <span className="h-2.5 w-2.5 rounded-full bg-nd-reset" />
              </span>
              Never Dumb
            </div>
            <div className="ml-auto flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2" title={copy.shared.breakRemaining}>
                <BreakRing progress={breakProgress} />
                <div className="text-right leading-tight">
                  <div className="hidden sm:block text-[10px] uppercase tracking-[0.16em] text-muted">{copy.shared.breakRemaining}</div>
                  <div data-testid="neverdumb-break-timer" className="font-mono text-sm font-semibold tabular-nums text-foreground">
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                data-testid="neverdumb-skip"
                onClick={() => close("skip")}
                aria-label={copy.shared.skip}
                className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 sm:px-4 py-2 text-xs font-medium text-muted hover:bg-surface-hover hover:text-foreground ${FOCUS_RING} focus-visible:ring-foreground/40`}
              >
                <span className="hidden sm:inline">{copy.shared.skip}</span>
                <NdIcon name="close" size={16} className="sm:hidden" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 sm:px-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewKey}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {view.screen === "hub" && (
                <NeverDumbHub
                  copy={copy}
                  articleUrl={articleUrl}
                  timeRemaining={timeRemaining}
                  stats={stats}
                  hasRecentWork={recentTasks.length > 0}
                  onStart={startExercise}
                />
              )}
              {view.screen === "exercise" && (
                <ExerciseFrame id={view.id} copy={copy} onBack={() => show({ screen: "hub" })}>
                  <ExerciseView
                    id={view.id}
                    copy={copy}
                    locale={locale}
                    variant={view.variant}
                    seed={view.seed}
                    onComplete={completeExercise}
                    recentTasks={recentTasks}
                    onAddTask={onAddTask}
                    onPauseAmbients={onPauseAmbients}
                    onResumeAmbients={onResumeAmbients}
                  />
                </ExerciseFrame>
              )}
              {view.screen === "result" && (
                <ExerciseResult
                  id={view.id}
                  copy={copy}
                  feedback={view.feedback}
                  streak={stats.streak}
                  total={stats.total}
                  onClose={() => close("complete")}
                  onAnother={() => show({ screen: "hub" })}
                  onSurprise={nextSurprise}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-4 pb-5">
          <p className="mx-auto max-w-6xl text-center text-[10px] sm:text-[11px] text-muted">{copy.shared.privacy}</p>
        </footer>
      </div>
    </motion.div>
  );
}

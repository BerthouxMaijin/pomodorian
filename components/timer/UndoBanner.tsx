"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatTime } from "@/lib/utils";

const UNDO_COPY = {
  stoppedAt: "Pomodoro stopped at",
  undo: "Undo",
  undoHint: "Undo (Z)",
} as const;

export const UNDO_BANNER_MS = 8000;

interface UndoBannerProps {
  /** Time left on the pomodoro when it was interrupted, in seconds. */
  stoppedAt: number;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoBanner({ stoppedAt, onUndo, onDismiss }: UndoBannerProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, UNDO_BANNER_MS);
    return () => window.clearTimeout(timeout);
  }, [onDismiss]);

  // Phones: on the bottom row, right of the feedback pill (16px + 44px + 8px
  // gap), so START above it is never covered. Wider screens: centered, the
  // pill is far to the left. Below the consent banner (z-index 9999).
  return (
    <motion.div
      role="status"
      data-testid="undo-banner"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed left-[4.25rem] right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 overflow-hidden rounded-xl glass-modal text-foreground shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:inset-x-4 sm:mx-auto sm:max-w-sm sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-between gap-3 py-1.5 pl-4 pr-1.5">
        <p className="min-w-0 text-sm">
          {UNDO_COPY.stoppedAt}{" "}
          <span className="font-semibold tabular-nums">{formatTime(stoppedAt)}</span>
        </p>
        <button
          type="button"
          data-testid="undo-button"
          onClick={onUndo}
          title={UNDO_COPY.undoHint}
          aria-keyshortcuts="Z"
          className="min-h-10 flex-shrink-0 rounded-lg bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover active:bg-surface-active focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
        >
          {UNDO_COPY.undo}
        </button>
      </div>
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-muted"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: UNDO_BANNER_MS / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

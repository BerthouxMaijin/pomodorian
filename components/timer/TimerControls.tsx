"use client";

import { cn } from "@/lib/utils";
import { MODE_COLORS } from "@/lib/constants";
import type { TimerMode, TimerStatus } from "@/lib/types";

interface TimerControlsProps {
  status: TimerStatus;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export function TimerControls({
  status,
  mode,
  onStart,
  onPause,
  onResume,
  onSkip,
  onReset,
}: TimerControlsProps) {
  const colors = MODE_COLORS[mode];

  return (
    <div className="flex items-center gap-4">
      {status === "idle" && (
        <button
          onClick={onStart}
          className="px-12 py-3 rounded-xl text-lg font-semibold text-background transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ backgroundColor: colors.accent }}
        >
          START
        </button>
      )}

      {status === "running" && (
        <>
          <button
            onClick={onPause}
            className="px-12 py-3 rounded-xl text-lg font-semibold glass text-foreground transition-all duration-200 hover:bg-surface-hover active:scale-95"
          >
            PAUSE
          </button>
          <button
            onClick={onSkip}
            className="p-3 rounded-xl glass text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-200"
            aria-label="Skip to next"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 18V6l8.5 6L6 18zm8.5 0V6h2v12h-2z" />
            </svg>
          </button>
        </>
      )}

      {status === "paused" && (
        <>
          <button
            onClick={onResume}
            className="px-12 py-3 rounded-xl text-lg font-semibold text-background transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: colors.accent }}
          >
            RESUME
          </button>
          <button
            onClick={onReset}
            className={cn(
              "p-3 rounded-xl glass text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-200"
            )}
            aria-label="Reset timer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

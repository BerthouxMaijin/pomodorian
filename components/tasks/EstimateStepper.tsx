"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const COPY = {
  label: "Pomodoros",
  decrease: "One pomodoro less",
  increase: "One pomodoro more",
};

export const MIN_ESTIMATE = 1;
export const MAX_ESTIMATE = 20;

export function clampEstimate(value: number): number {
  if (!Number.isFinite(value)) return MIN_ESTIMATE;
  return Math.min(MAX_ESTIMATE, Math.max(MIN_ESTIMATE, Math.round(value)));
}

interface EstimateStepperProps {
  value: number;
  onChange: (value: number) => void;
}

/** Minus / value / plus control for a task's estimated pomodoros (1 to 20). */
export function EstimateStepper({ value, onChange }: EstimateStepperProps) {
  const labelId = useId();
  const atMin = value <= MIN_ESTIMATE;
  const atMax = value >= MAX_ESTIMATE;

  // aria-disabled rather than disabled: a disabled button drops keyboard
  // focus to <body> the moment the limit is reached.
  const buttonClass = cn(
    "size-8 grid place-items-center rounded-lg text-muted transition-colors",
    "hover:text-foreground hover:bg-surface-hover",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text/60",
    "aria-disabled:opacity-30 aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent aria-disabled:hover:text-muted",
    // Invisible padding: 32px visible, 40px to the finger.
    "relative before:absolute before:-inset-1 before:content-['']"
  );

  return (
    <div className="flex items-center justify-between gap-3">
      <span id={labelId} className="text-xs text-muted">
        {COPY.label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex items-center gap-1 rounded-lg border border-border bg-surface"
      >
        <button
          type="button"
          aria-label={COPY.decrease}
          aria-disabled={atMin}
          onClick={() => {
            if (!atMin) onChange(clampEstimate(value - 1));
          }}
          className={buttonClass}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <output
          aria-live="polite"
          className="min-w-6 text-center text-sm font-medium text-foreground tabular-nums"
        >
          {value}
        </output>
        <button
          type="button"
          aria-label={COPY.increase}
          aria-disabled={atMax}
          onClick={() => {
            if (!atMax) onChange(clampEstimate(value + 1));
          }}
          className={buttonClass}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

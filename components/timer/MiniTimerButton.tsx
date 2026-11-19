"use client";

import { useAppCopy } from "@/hooks/useAppCopy";
import {
  toggleMiniTimer,
  useMiniTimerSupported,
  useMiniTimerWindow,
} from "@/hooks/useMiniTimerWindow";

/** Header button of the floating mini timer. Nothing without the API. */
export function MiniTimerButton() {
  const copy = useAppCopy().miniTimer;
  const supported = useMiniTimerSupported();
  const open = useMiniTimerWindow() !== null;
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleMiniTimer}
      data-testid="mini-timer-button"
      aria-pressed={open}
      // Hidden under 400px: the header has no room left for a fourth control
      // there (logo, name, daily goal, report, settings), and a window that
      // narrow has no use for a floating copy of itself. Phones never get here,
      // the API does not exist on them.
      className={`size-11 hidden min-[400px]:grid place-items-center rounded-lg hover:text-foreground hover:bg-surface-hover transition-colors ${
        open ? "text-foreground bg-surface-active" : "text-muted"
      }`}
      aria-label={open ? copy.close : copy.open}
      title={open ? copy.close : copy.hint}
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <rect x="12" y="12" width="7" height="5" rx="1" fill={open ? "currentColor" : "none"} />
      </svg>
    </button>
  );
}

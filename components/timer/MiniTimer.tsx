"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { formatTime } from "@/lib/utils";
import { MODE_COLORS } from "@/lib/constants";
import type { TimerMode, TimerStatus } from "@/lib/types";
import { useAppCopy } from "@/hooks/useAppCopy";
import { useUiLocale } from "@/hooks/useUiLocale";
import { HTML_LANG } from "@/lib/i18n/locales";
import { closeMiniTimer, labelMiniTimer, useMiniTimerWindow } from "@/hooks/useMiniTimerWindow";

interface MiniTimerProps {
  timeRemaining: number;
  progress: number;
  mode: TimerMode;
  status: TimerStatus;
  taskTitle: string | null;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
}

/**
 * The floating mini timer: rendered from the page's tree through a portal into
 * the always-on-top window, so it shows the page's own timer and calls the
 * page's own handlers. Time, mode colour, task, one control. Nothing else.
 */
export function MiniTimer(props: MiniTimerProps) {
  const pipWindow = useMiniTimerWindow();
  // Leaving the app (client navigation to the blog) takes the window along.
  // Closing or reloading the tab closes it too: the browser sees to that.
  useEffect(() => closeMiniTimer, []);
  if (!pipWindow) return null;
  return <MiniTimerWindow pipWindow={pipWindow} {...props} />;
}

function MiniTimerWindow({
  pipWindow,
  timeRemaining,
  progress,
  mode,
  status,
  taskTitle,
  onStart,
  onPause,
  onResume,
}: MiniTimerProps & { pipWindow: Window }) {
  const copy = useAppCopy();
  const locale = useUiLocale();
  const accent = MODE_COLORS[mode].accent;
  const display = formatTime(timeRemaining);

  const toggle = status === "idle" ? onStart : status === "running" ? onPause : onResume;
  const toggleRef = useRef(toggle);
  useEffect(() => {
    toggleRef.current = toggle;
  }, [toggle]);

  useEffect(() => {
    labelMiniTimer(pipWindow, copy.miniTimer.windowTitle, HTML_LANG[locale]);
  }, [pipWindow, copy, locale]);

  // Keys typed in the mini window stay in it: the page never sees them. Space
  // toggles the timer like on the page. Its keyup is swallowed too, or a
  // focused button would be clicked a second time.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== " " || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (!e.repeat) toggleRef.current();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") e.preventDefault();
    };
    pipWindow.addEventListener("keydown", onKeyDown);
    pipWindow.addEventListener("keyup", onKeyUp);
    return () => {
      pipWindow.removeEventListener("keydown", onKeyDown);
      pipWindow.removeEventListener("keyup", onKeyUp);
    };
  }, [pipWindow]);

  const label =
    status === "idle"
      ? copy.timer.start
      : status === "running"
        ? copy.timer.pause
        : copy.timer.resume;
  const filled = status !== "running";

  return createPortal(
    <div
      data-testid="mini-timer"
      data-mode={mode}
      className="fixed inset-0 flex flex-col overflow-hidden select-none bg-background text-foreground"
      style={{
        backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${accent}26, transparent 70%)`,
      }}
    >
      <div className="h-1 w-full shrink-0 bg-surface-active">
        <div
          data-testid="mini-timer-progress"
          className="h-full"
          style={{
            width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
            backgroundColor: accent,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[max(0.5rem,4vh)] px-4">
        <div
          role="timer"
          aria-label={`${copy.modes[mode]}, ${copy.timer.remaining(display)}`}
          data-testid="mini-timer-time"
          className={`${display.length > 5 ? "text-[min(18vw,34vh)]" : "text-[min(24vw,40vh)]"} font-light leading-none tabular-nums tracking-tight`}
        >
          {display}
        </div>
        {taskTitle && (
          <p
            data-testid="mini-timer-task"
            className="w-full truncate text-center text-sm font-medium text-muted"
            title={taskTitle}
          >
            {taskTitle}
          </p>
        )}
        <button
          type="button"
          data-testid="mini-timer-toggle"
          onClick={toggle}
          className={`rounded-xl px-8 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 ${
            filled ? "text-background hover:opacity-90" : "glass text-foreground hover:bg-surface-hover"
          }`}
          style={filled ? { backgroundColor: accent } : undefined}
        >
          {label}
        </button>
      </div>
    </div>,
    pipWindow.document.body
  );
}

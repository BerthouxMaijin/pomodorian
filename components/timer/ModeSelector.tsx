"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { useAppCopy } from "@/hooks/useAppCopy";
import type { TimerMode } from "@/lib/types";

interface ModeSelectorProps {
  mode: TimerMode;
  onChange: (mode: TimerMode) => void;
}

const MODES: TimerMode[] = ["pomodoro", "shortBreak", "longBreak"];

export const ModeSelector = memo(function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  const copy = useAppCopy();
  return (
    <div
      role="group"
      aria-label={copy.timer.modeGroupLabel}
      // Below 360px (a 320px phone) the tabs tighten a little: at full size the
      // three labels overflowed the screen, in English as in French.
      className="flex gap-0.5 min-[360px]:gap-1 p-1 rounded-xl glass max-w-full"
    >
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          aria-pressed={m === mode}
          className={cn(
            "min-h-11 px-2 min-[360px]:px-3 sm:px-4 rounded-lg text-[13px] min-[360px]:text-sm font-medium whitespace-nowrap transition-all duration-200",
            m === mode
              ? "bg-white/15 text-foreground shadow-sm"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          )}
        >
          <span data-i18n>{copy.modes[m]}</span>
        </button>
      ))}
    </div>
  );
});

"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { MODE_LABELS } from "@/lib/constants";
import type { TimerMode } from "@/lib/types";

interface ModeSelectorProps {
  mode: TimerMode;
  onChange: (mode: TimerMode) => void;
}

const MODES: TimerMode[] = ["pomodoro", "shortBreak", "longBreak"];

export const ModeSelector = memo(function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Timer mode"
      className="flex gap-1 p-1 rounded-xl glass max-w-full"
    >
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          aria-pressed={m === mode}
          className={cn(
            "min-h-11 px-3 sm:px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
            m === mode
              ? "bg-white/15 text-foreground shadow-sm"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          )}
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  );
});

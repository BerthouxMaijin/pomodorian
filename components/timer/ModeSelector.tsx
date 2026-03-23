"use client";

import { cn } from "@/lib/utils";
import { MODE_LABELS } from "@/lib/constants";
import type { TimerMode } from "@/lib/types";

interface ModeSelectorProps {
  mode: TimerMode;
  onChange: (mode: TimerMode) => void;
}

const MODES: TimerMode[] = ["pomodoro", "shortBreak", "longBreak"];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl glass">
      {MODES.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            m === mode
              ? "bg-white/15 text-foreground shadow-sm"
              : "text-muted hover:text-foreground hover:bg-white/5"
          )}
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  );
}

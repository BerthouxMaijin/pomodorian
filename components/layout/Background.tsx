"use client";

import { MODE_COLORS } from "@/lib/constants";
import type { TimerMode } from "@/lib/types";

interface BackgroundProps {
  mode: TimerMode;
}

export function Background({ mode }: BackgroundProps) {
  const colors = MODE_COLORS[mode];

  return (
    <div
      className={`fixed inset-0 -z-10 bg-gradient-radial ${colors.bg} transition-all duration-700 ease-in-out`}
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${colors.accent}15 0%, transparent 60%), linear-gradient(to bottom, #0a0a0a, #0a0a0a)`,
        transition: "background 0.7s ease-in-out",
      }}
    />
  );
}

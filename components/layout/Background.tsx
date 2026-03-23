"use client";

import { MODE_COLORS } from "@/lib/constants";
import type { TimerMode } from "@/lib/types";

interface BackgroundProps {
  mode: TimerMode;
  theme?: string;
}

export function Background({ mode, theme = "dark" }: BackgroundProps) {
  const colors = MODE_COLORS[mode];
  const isLight = theme === "light";

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-700 ease-in-out"
      style={{
        background: isLight
          ? `radial-gradient(ellipse at 50% 30%, ${colors.accent}12 0%, transparent 50%), linear-gradient(to bottom, #f8f9fa, #f0f0f0)`
          : `radial-gradient(ellipse at 50% 30%, ${colors.accent}15 0%, transparent 60%), linear-gradient(to bottom, #0a0a0a, #0a0a0a)`,
        transition: "background 0.7s ease-in-out",
      }}
    />
  );
}

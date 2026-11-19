"use client";

import { memo } from "react";
import { MODE_COLORS } from "@/lib/constants";
import type { TimerMode } from "@/lib/types";

interface BackgroundProps {
  mode: TimerMode;
}

// Theme comes from CSS variables, not from a prop: the theme attribute is set
// before first paint (see the inline script in app/layout.tsx), so a light
// theme user no longer gets a dark page until React has hydrated.
export const Background = memo(function Background({ mode }: BackgroundProps) {
  const colors = MODE_COLORS[mode];

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${colors.accent}14 0%, transparent var(--glow-reach)), linear-gradient(to bottom, var(--background), var(--background-end))`,
        transition: "background 0.7s ease-in-out",
      }}
    />
  );
});

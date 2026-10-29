"use client";

import { formatTime } from "@/lib/utils";
import { MODE_COLORS } from "@/lib/constants";
import type { TimerMode } from "@/lib/types";

const RADIUS = 120;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = (RADIUS + STROKE_WIDTH) * 2;

interface TimerProps {
  timeRemaining: number;
  progress: number;
  mode: TimerMode;
  /** H:MM:SS for countdowns of an hour or more (timer tool pages). The app
   * keeps MM:SS, so a 60-minute pomodoro still reads 60:00. */
  showHours?: boolean;
}

function formatWithHours(seconds: number): string {
  if (seconds < 3600) return formatTime(seconds);
  const h = Math.floor(seconds / 3600);
  const rest = formatTime(seconds % 3600);
  return `${h}:${rest}`;
}

export function Timer({ timeRemaining, progress, mode, showHours }: TimerProps) {
  const offset = CIRCUMFERENCE * (1 - progress);
  const colors = MODE_COLORS[mode];
  const display = showHours ? formatWithHours(timeRemaining) : formatTime(timeRemaining);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        className="transform -rotate-90"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        {/* Background ring — themed: a hardcoded white was invisible on light */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Progress ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          className={colors.ring}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${display.length > 5 ? "text-6xl" : "text-7xl"} font-light tabular-nums tracking-tight text-foreground`}
        >
          {display}
        </span>
      </div>
    </div>
  );
}

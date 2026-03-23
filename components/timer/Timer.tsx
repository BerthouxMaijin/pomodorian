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
}

export function Timer({ timeRemaining, progress, mode }: TimerProps) {
  const offset = CIRCUMFERENCE * (1 - progress);
  const colors = MODE_COLORS[mode];

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        className="transform -rotate-90"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        {/* Background ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
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
        <span className="text-7xl font-light tabular-nums tracking-tight text-foreground">
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
}

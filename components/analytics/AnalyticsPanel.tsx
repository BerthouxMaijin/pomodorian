"use client";

import { useEffect } from "react";
import { StatsCards } from "./StatsCards";
import { ContributionHeatmap } from "./ContributionHeatmap";

interface AnalyticsPanelProps {
  todayMinutes: number;
  todayPomodoros: number;
  totalHours: number;
  streak: number;
  heatmap: Record<string, number>;
  onClose: () => void;
}

export function AnalyticsPanel({
  todayMinutes,
  todayPomodoros,
  totalHours,
  streak,
  heatmap,
  onClose,
}: AnalyticsPanelProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <StatsCards
          todayMinutes={todayMinutes}
          todayPomodoros={todayPomodoros}
          totalHours={totalHours}
          streak={streak}
        />

        <ContributionHeatmap heatmap={heatmap} />
      </div>
    </div>
  );
}

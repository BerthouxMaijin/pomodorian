"use client";

import { useMemo } from "react";
import { useAppCopy } from "@/hooks/useAppCopy";
import { useUiLocale } from "@/hooks/useUiLocale";
import { formatDateKey, formatNumber, weekdayNames } from "@/lib/i18n/format";

interface ContributionHeatmapProps {
  heatmap: Record<string, number>;
}

function getIntensity(minutes: number): string {
  if (minutes === 0) return "bg-surface-active";
  if (minutes < 30) return "bg-emerald-900/60";
  if (minutes < 60) return "bg-emerald-700/60";
  if (minutes < 120) return "bg-emerald-500/60";
  return "bg-emerald-400/80";
}

// Rows run Sunday to Saturday; only Monday, Wednesday and Friday are labelled.
const LABELLED_DAYS = new Set([1, 3, 5]);
const WEEKS_TO_SHOW = 20;

export function ContributionHeatmap({ heatmap }: ContributionHeatmapProps) {
  const locale = useUiLocale();
  const copy = useAppCopy();
  const dayLabels = useMemo(
    () => weekdayNames(locale).map((name, i) => (LABELLED_DAYS.has(i) ? name : "")),
    [locale]
  );
  const grid = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getUTCDay(); // 0=Sun, UTC to match session date keys
    const cells: { date: string; minutes: number }[][] = [];

    // Build grid: columns = weeks, rows = days (Sun=0 to Sat=6)
    const totalDays = WEEKS_TO_SHOW * 7 + dayOfWeek;

    for (let w = 0; w < WEEKS_TO_SHOW + 1; w++) {
      cells[w] = [];
    }

    for (let i = totalDays; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayIndex = d.getUTCDay();
      const weekIndex = Math.floor((totalDays - i) / 7);

      if (weekIndex < cells.length) {
        cells[weekIndex][dayIndex] = {
          date: dateStr,
          minutes: heatmap[dateStr] || 0,
        };
      }
    }

    return cells;
  }, [heatmap]);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted uppercase tracking-wider">
        {copy.report.heatmapTitle}
      </h3>
      <div className="flex gap-0.5 overflow-x-auto pb-1">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1 flex-shrink-0">
          {dayLabels.map((label, i) => (
            <div
              key={i}
              className="w-6 h-3 text-[9px] text-muted flex items-center"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {Array.from({ length: 7 }).map((_, di) => {
              const cell = week[di];
              if (!cell) {
                return (
                  <div key={di} className="w-3 h-3 rounded-sm bg-transparent" />
                );
              }
              return (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm ${getIntensity(cell.minutes)} transition-colors`}
                  title={copy.report.cellTitle(
                    formatDateKey(cell.date, locale),
                    copy.units.minutes(formatNumber(cell.minutes, locale))
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 text-[9px] text-muted justify-end">
        <span>{copy.report.less}</span>
        <div className="w-3 h-3 rounded-sm bg-surface-active" />
        <div className="w-3 h-3 rounded-sm bg-emerald-900/60" />
        <div className="w-3 h-3 rounded-sm bg-emerald-700/60" />
        <div className="w-3 h-3 rounded-sm bg-emerald-500/60" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400/80" />
        <span>{copy.report.more}</span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { MiniBarChart } from "./MiniBarChart";
import { PeriodTabs } from "./PeriodTabs";
import { TaskBreakdown } from "./TaskBreakdown";
import { computeRangeStats } from "@/hooks/useAnalytics";
import {
  enumerateDays,
  formatPeriodLabel,
  getRange,
  isPeriodCurrent,
  shiftPeriod,
  type PeriodKind,
} from "@/lib/date-range";
import {
  downloadBlob,
  sessionsToCSV,
  sessionsToMarkdown,
} from "@/lib/export";
import type { FocusSession } from "@/lib/types";

interface AnalyticsPanelProps {
  sessions: FocusSession[];
  streak: number;
  totalHours: number;
  locale: string;
  onClose: () => void;
}

export function AnalyticsPanel({
  sessions,
  streak,
  totalHours,
  locale,
  onClose,
}: AnalyticsPanelProps) {
  const [periodKind, setPeriodKind] = useState<PeriodKind>("day");
  const [anchorDate, setAnchorDate] = useState<Date>(() => new Date());
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const period = useMemo(
    () => getRange(periodKind, anchorDate),
    [periodKind, anchorDate]
  );
  const isCurrent = isPeriodCurrent(period);
  const periodLabel = formatPeriodLabel(period, locale);
  const days = useMemo(() => enumerateDays(period), [period]);
  const stats = useMemo(
    () => computeRangeStats(sessions, period.fromKey, period.toKey, days),
    [sessions, period.fromKey, period.toKey, days]
  );

  const heatmap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of sessions) {
      if (s.mode === "pomodoro" && s.completed) {
        map[s.date] = (map[s.date] ?? 0) + s.durationMinutes;
      }
    }
    return map;
  }, [sessions]);

  function shift(direction: -1 | 1) {
    const next = shiftPeriod(period, direction);
    setAnchorDate(next.from);
  }

  function jumpToCurrent() {
    setAnchorDate(new Date());
  }

  function handleExport(format: "csv" | "markdown") {
    const inRange = sessions.filter(
      (s) =>
        s.mode === "pomodoro" &&
        s.completed &&
        s.date >= period.fromKey &&
        s.date <= period.toKey
    );
    const slug = `${period.fromKey}_${period.toKey}`;
    if (format === "csv") {
      downloadBlob(
        sessionsToCSV({ sessions: inRange, periodLabel }),
        `pomodorian_${slug}.csv`,
        "text/csv;charset=utf-8"
      );
    } else {
      downloadBlob(
        sessionsToMarkdown({ sessions: inRange, periodLabel }),
        `pomodorian_${slug}.md`,
        "text/markdown;charset=utf-8"
      );
    }
    setExportOpen(false);
  }

  const totalH = Math.round((stats.totalMinutes / 60) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <PeriodTabs value={periodKind} onChange={setPeriodKind} />

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => shift(-1)}
            className="p-1 rounded text-muted hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Previous period"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-sm font-medium text-foreground text-center">
              {periodLabel}
            </span>
            {!isCurrent && (
              <button
                onClick={jumpToCurrent}
                className="text-xs px-2 py-0.5 rounded bg-white/10 text-foreground hover:bg-white/15 transition-colors"
              >
                Now
              </button>
            )}
          </div>
          <button
            onClick={() => shift(1)}
            disabled={isCurrent}
            className="p-1 rounded text-muted hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next period"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Focus" value={`${totalH}h`} color="text-red-400" />
          <StatCard
            label="Pomos"
            value={`${stats.totalPomodoros}`}
            color="text-amber-400"
          />
          <StatCard
            label="Tasks"
            value={`${stats.distinctTasks}`}
            color="text-blue-400"
          />
          {periodKind === "day" ? (
            <StatCard
              label="Streak"
              value={`${streak}d`}
              color="text-orange-400"
            />
          ) : (
            <StatCard
              label="All time"
              value={`${totalHours}h`}
              color="text-purple-400"
            />
          )}
        </div>

        {periodKind !== "day" && (
          <MiniBarChart
            data={stats.dailyBreakdown.map((d) => ({
              date: d.date,
              minutes: d.minutes,
            }))}
            labelFor={(date, i) => {
              if (periodKind === "week") {
                return new Intl.DateTimeFormat(locale, {
                  weekday: "narrow",
                  timeZone: "UTC",
                }).format(new Date(date + "T00:00:00Z"));
              }
              // month: show every ~5 days
              if (i % 5 !== 0) return null;
              return date.slice(8, 10);
            }}
          />
        )}

        <TaskBreakdown tasks={stats.tasksWorkedOn} />

        {periodKind === "month" && (
          <div className="pt-2">
            <p className="text-xs text-muted mb-2">Last 20 weeks</p>
            <ContributionHeatmap heatmap={heatmap} />
          </div>
        )}

        <div className="relative pt-1">
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="w-full py-2 rounded-lg glass text-sm text-foreground hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          {exportOpen && (
            <div className="absolute left-0 right-0 bottom-full mb-1 glass rounded-lg p-1 space-y-0.5 z-10">
              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-white/10 rounded transition-colors"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport("markdown")}
                className="w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-white/10 rounded transition-colors"
              >
                Markdown
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-2 text-center">
      <p className={`text-xl font-semibold tabular-nums ${color}`}>{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}

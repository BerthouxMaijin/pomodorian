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
import { useAppCopy } from "@/hooks/useAppCopy";
import { useUiLocale } from "@/hooks/useUiLocale";
import { HTML_LANG } from "@/lib/i18n/locales";
import { formatDateKey, formatNumber } from "@/lib/i18n/format";

interface AnalyticsPanelProps {
  sessions: FocusSession[];
  streak: number;
  totalHours: number;
  onClose: () => void;
}

export function AnalyticsPanel({
  sessions,
  streak,
  totalHours,
  onClose,
}: AnalyticsPanelProps) {
  const locale = useUiLocale();
  const intlLocale = HTML_LANG[locale];
  const appCopy = useAppCopy();
  const copy = appCopy.report;
  const units = appCopy.units;
  // Opens on "week" so a chart is visible right away: the panel's own header
  // icon is a line chart, but the "day" view renders no chart at all.
  const [periodKind, setPeriodKind] = useState<PeriodKind>("week");
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
  const periodLabel = formatPeriodLabel(period, intlLocale);
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
  const num = (n: number) => formatNumber(n, locale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.dialogLabel}
        className="relative glass-modal rounded-2xl w-full max-w-md max-h-[85dvh] overflow-y-auto overscroll-contain p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
          <button
            onClick={onClose}
            className="size-11 -m-3 grid place-items-center rounded-lg text-muted hover:text-foreground transition-colors"
            aria-label={copy.close}
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
            className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label={copy.previousPeriod}
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
                className="text-xs px-2 py-0.5 rounded bg-surface-hover text-foreground hover:bg-surface-active transition-colors"
              >
                {copy.now}
              </button>
            )}
          </div>
          <button
            onClick={() => shift(1)}
            disabled={isCurrent}
            className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={copy.nextPeriod}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <StatCard label={copy.statFocus} value={units.hours(num(totalH))} color="text-red-400" />
          <StatCard
            label={copy.statPomodoros}
            value={num(stats.totalPomodoros)}
            color="text-amber-400"
          />
          <StatCard
            label={copy.statTasks}
            value={num(stats.distinctTasks)}
            color="text-blue-400"
          />
          {periodKind === "day" ? (
            <StatCard
              label={copy.statStreak}
              value={units.days(num(streak))}
              color="text-orange-400"
            />
          ) : (
            <StatCard
              label={copy.statAllTime}
              value={units.hours(num(totalHours))}
              color="text-purple-400"
            />
          )}
        </div>

        {periodKind !== "day" && stats.totalPomodoros === 0 && (
          <div className="glass rounded-xl px-3 py-6 text-center text-sm text-muted">
            {copy.noSessions}
          </div>
        )}

        {periodKind !== "day" && stats.totalPomodoros > 0 && (
          <MiniBarChart
            data={stats.dailyBreakdown.map((d) => ({
              date: d.date,
              minutes: d.minutes,
            }))}
            labelFor={(date, i) => {
              if (periodKind === "week") {
                return new Intl.DateTimeFormat(intlLocale, {
                  weekday: "narrow",
                  timeZone: "UTC",
                }).format(new Date(date + "T00:00:00Z"));
              }
              // month: show every ~5 days
              if (i % 5 !== 0) return null;
              return date.slice(8, 10);
            }}
            titleFor={(date, minutes) =>
              copy.barTitle(formatDateKey(date, locale), units.minutes(num(minutes)))
            }
          />
        )}

        <TaskBreakdown tasks={stats.tasksWorkedOn} />

        {periodKind === "month" && (
          <div className="pt-2">
            <p className="text-xs text-muted mb-2">{copy.last20Weeks}</p>
            <ContributionHeatmap heatmap={heatmap} />
          </div>
        )}

        <div className="relative pt-1">
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="w-full py-2 rounded-lg glass text-sm text-foreground hover:bg-surface-active transition-colors flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {copy.export}
          </button>
          {exportOpen && (
            <div className="absolute left-0 right-0 bottom-full mb-1 glass rounded-lg p-1 space-y-0.5 z-10">
              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-surface-active rounded transition-colors"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport("markdown")}
                className="w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-surface-active rounded transition-colors"
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
    // px-1: on a 320px phone a card is 44px wide, and "Aufgaben", "Pomodori"
    // or even "1.3h" did not fit inside the former 8px side padding.
    <div className="glass rounded-xl px-1 py-2 text-center">
      <p className={`text-xl font-semibold tabular-nums ${color}`}>{value}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}

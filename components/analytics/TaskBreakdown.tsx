"use client";

import { useAppCopy } from "@/hooks/useAppCopy";
import { useUiLocale } from "@/hooks/useUiLocale";
import { UNTRACKED_TITLE } from "@/hooks/useAnalytics";
import { formatNumber } from "@/lib/i18n/format";

interface TaskBreakdownProps {
  tasks: {
    taskId: string | null;
    title: string;
    minutes: number;
    pomodoros: number;
  }[];
}

export function TaskBreakdown({ tasks }: TaskBreakdownProps) {
  const locale = useUiLocale();
  const copy = useAppCopy();
  if (tasks.length === 0) {
    return (
      <div className="glass rounded-xl px-3 py-6 text-center text-sm text-muted">
        {copy.report.noTasks}
      </div>
    );
  }

  const max = Math.max(1, ...tasks.map((t) => t.minutes));

  return (
    <div className="space-y-1.5">
      {tasks.map((t, i) => {
        const widthPct = (t.minutes / max) * 100;
        return (
          <div
            key={t.taskId ?? `untracked-${i}`}
            className="relative glass rounded-xl overflow-hidden"
          >
            <div
              className="absolute inset-y-0 left-0 bg-red-400/15"
              style={{ width: `${widthPct}%` }}
            />
            <div className="relative px-3 py-2 flex items-center gap-3">
              <span className="flex-1 text-sm text-foreground break-words">
                {/* No task, or a deleted task without a stored title */}
                {t.title === UNTRACKED_TITLE
                  ? copy.tasks.untracked
                  : t.title}
              </span>
              <span className="text-xs text-muted tabular-nums flex-shrink-0">
                {formatNumber(t.pomodoros, locale)} · {copy.units.minutes(formatNumber(t.minutes, locale))}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

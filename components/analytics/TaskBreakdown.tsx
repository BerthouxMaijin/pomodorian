"use client";

interface TaskBreakdownProps {
  tasks: {
    taskId: string | null;
    title: string;
    minutes: number;
    pomodoros: number;
  }[];
}

export function TaskBreakdown({ tasks }: TaskBreakdownProps) {
  if (tasks.length === 0) {
    return (
      <div className="glass rounded-xl px-3 py-6 text-center text-sm text-muted">
        No tasks tracked in this period.
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
                {t.title}
              </span>
              <span className="text-xs text-muted tabular-nums flex-shrink-0">
                {t.pomodoros} · {t.minutes}m
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

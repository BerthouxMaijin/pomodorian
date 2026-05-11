import type { FocusSession } from "./types";

interface ExportInput {
  sessions: FocusSession[]; // already filtered to the desired period
  periodLabel: string;
}

export function sessionsToCSV({ sessions }: ExportInput): string {
  const rows = [["date", "task_id", "task_title", "pomodoros", "minutes"]];

  // Group by date + taskId
  const map = new Map<string, { pomodoros: number; minutes: number; title: string }>();
  for (const s of sessions) {
    if (s.mode !== "pomodoro" || !s.completed) continue;
    const key = `${s.date}__${s.taskId ?? ""}`;
    const prev = map.get(key);
    map.set(key, {
      pomodoros: (prev?.pomodoros ?? 0) + 1,
      minutes: (prev?.minutes ?? 0) + s.durationMinutes,
      title: prev?.title ?? s.taskTitle ?? "",
    });
  }

  const sortedKeys = Array.from(map.keys()).sort();
  for (const key of sortedKeys) {
    const [date, taskId] = key.split("__");
    const v = map.get(key)!;
    rows.push([
      date,
      taskId,
      csvEscape(v.title),
      String(v.pomodoros),
      String(v.minutes),
    ]);
  }

  return rows.map((r) => r.join(",")).join("\n");
}

export function sessionsToMarkdown({
  sessions,
  periodLabel,
}: ExportInput): string {
  const pomodoros = sessions.filter((s) => s.mode === "pomodoro" && s.completed);
  const totalMin = pomodoros.reduce((sum, s) => sum + s.durationMinutes, 0);

  const lines: string[] = [];
  lines.push(`# Pomodorian — ${periodLabel}`);
  lines.push("");
  lines.push(
    `**${pomodoros.length} pomodoros · ${Math.round((totalMin / 60) * 10) / 10}h focused**`
  );
  lines.push("");

  // Group by date.
  const byDate = new Map<string, FocusSession[]>();
  for (const s of pomodoros) {
    const arr = byDate.get(s.date) ?? [];
    arr.push(s);
    byDate.set(s.date, arr);
  }

  const sortedDates = Array.from(byDate.keys()).sort();
  for (const date of sortedDates) {
    const daySessions = byDate.get(date)!;
    const dayMin = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    lines.push(`## ${date} (${daySessions.length} pomodoros · ${dayMin}m)`);

    // Group by taskId within the day.
    const byTask = new Map<string, { pomodoros: number; minutes: number; title: string }>();
    for (const s of daySessions) {
      const key = s.taskId ?? "__no_task__";
      const prev = byTask.get(key);
      byTask.set(key, {
        pomodoros: (prev?.pomodoros ?? 0) + 1,
        minutes: (prev?.minutes ?? 0) + s.durationMinutes,
        title: prev?.title ?? s.taskTitle ?? "Untracked focus time",
      });
    }
    for (const [, v] of byTask) {
      lines.push(`- ${v.title} — ${v.pomodoros} pomodoros · ${v.minutes}m`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

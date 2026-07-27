"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { TaskItem } from "./TaskItem";
import { SortableTaskItem } from "./SortableTaskItem";
import { useTaskHistory } from "@/hooks/useTaskHistory";
import type { FocusSession, Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  sessions: FocusSession[];
  activeTaskId: string | null;
  locale: string;
  onAdd: (title: string, estimatedPomodoros?: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onSetActive: (id: string | null) => void;
  onIncrementPomodoro: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onOpenAIPlanner: () => void;
}

export function TaskList({
  tasks,
  sessions,
  activeTaskId,
  locale,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onSetActive,
  onReorder,
  onOpenAIPlanner,
}: TaskListProps) {
  const history = useTaskHistory({ tasks, sessions });
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Only today's rows are editable, and only rows backed by a live task can
  // move: ghost rows (deleted task, untracked focus time) have no id to
  // reorder and stay pinned below the list.
  const sortableRows = history.isToday
    ? history.tasksForDate.filter((t) => t.taskId && !t.isGhost)
    : [];
  const staticRows = history.isToday
    ? history.tasksForDate.filter((t) => !t.taskId || t.isGhost)
    : history.tasksForDate;
  const sortableIds = sortableRows.map((t) => t.taskId!);
  const canReorder = sortableIds.length > 1;

  const moveTask = (id: string, delta: number) => {
    const from = sortableIds.indexOf(id);
    const to = from + delta;
    if (from === -1 || to < 0 || to >= sortableIds.length) return;
    const next = [...sortableIds];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onReorder(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    onAdd(title);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  const dateLabel = formatDateLabel(history.viewDate, history.isToday, locale);
  const completedCount = history.tasksForDate.filter((t) => t.completed).length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={history.goPrev}
            className="p-1 rounded text-muted hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Previous day"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-base font-semibold text-foreground tabular-nums">
            {dateLabel}
          </h2>
          <button
            onClick={history.goNext}
            disabled={history.isToday}
            className="p-1 rounded text-muted hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next day"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          {!history.isToday && (
            <button
              onClick={history.goToday}
              className="ml-1 text-xs px-2 py-0.5 rounded bg-white/10 text-foreground hover:bg-white/15 transition-colors"
            >
              Today
            </button>
          )}
        </div>
        <span className="text-xs text-muted tabular-nums">
          {completedCount}/{history.tasksForDate.length}
          {history.totalMinutesForDate > 0 && ` · ${history.totalMinutesForDate}m`}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {history.tasksForDate.length === 0 ? (
          <div className="glass rounded-xl px-3 py-6 text-center text-sm text-muted">
            {history.isToday ? "No tasks yet." : "No tasks tracked on this day."}
          </div>
        ) : (
          <>
            {sortableRows.length > 0 && (
              <Reorder.Group
                axis="y"
                values={sortableIds}
                onReorder={onReorder}
                className="flex flex-col gap-1.5"
              >
                {sortableRows.map((task) => (
                  <SortableTaskItem
                    key={task.key}
                    task={task}
                    taskId={task.taskId!}
                    isActive={task.taskId === activeTaskId}
                    canReorder={canReorder}
                    onMove={(delta) => moveTask(task.taskId!, delta)}
                    onToggle={() => onToggle(task.taskId!)}
                    onDelete={() => onDelete(task.taskId!)}
                    onEdit={(title) => onEdit(task.taskId!, title)}
                    onSetActive={() =>
                      onSetActive(
                        task.taskId === activeTaskId ? null : task.taskId
                      )
                    }
                  />
                ))}
              </Reorder.Group>
            )}

            {staticRows.map((task) => (
              <TaskItem
                key={task.key}
                task={task}
                isActive={history.isToday && task.taskId === activeTaskId}
                readOnly={!history.isToday}
                showDailyStats={!history.isToday}
                onToggle={
                  task.taskId ? () => onToggle(task.taskId!) : undefined
                }
                onDelete={
                  task.taskId ? () => onDelete(task.taskId!) : undefined
                }
                onEdit={
                  task.taskId
                    ? (title) => onEdit(task.taskId!, title)
                    : undefined
                }
                onSetActive={
                  task.taskId
                    ? () =>
                        onSetActive(
                          task.taskId === activeTaskId ? null : task.taskId
                        )
                    : undefined
                }
              />
            ))}
          </>
        )}
      </div>

      {history.isToday && (
        <>
          {isAdding ? (
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="glass rounded-xl p-3 space-y-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What are you working on?"
                  className="w-full bg-transparent text-foreground placeholder:text-muted outline-none text-sm"
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setNewTaskTitle("");
                    }}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    className="px-4 py-1.5 rounded-lg bg-white/10 text-sm font-medium text-foreground hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-3 space-y-2">
              <button
                onClick={() => setIsAdding(true)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                + Add Task
              </button>
              <button
                onClick={onOpenAIPlanner}
                className="w-full py-3 rounded-xl glass text-sm text-muted hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                  <circle cx="12" cy="15" r="2" />
                </svg>
                Plan with AI
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatDateLabel(viewDate: string, isToday: boolean, locale: string): string {
  if (isToday) return "Today";
  const [y, m, d] = viewDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return viewDate;
  }
}

"use client";

import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  isActive: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onSetActive: () => void;
}

export function TaskItem({
  task,
  isActive,
  onToggle,
  onDelete,
  onSetActive,
}: TaskItemProps) {
  return (
    <div
      className={cn(
        "group glass rounded-xl px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-all duration-200",
        isActive && "ring-1 ring-white/20 bg-white/8",
        task.completed && "opacity-50"
      )}
      onClick={onSetActive}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={cn(
          "w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors",
          task.completed
            ? "border-emerald-500 bg-emerald-500"
            : "border-muted hover:border-foreground"
        )}
      >
        {task.completed && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-sm text-foreground truncate",
          task.completed && "line-through"
        )}
      >
        {task.title}
      </span>

      {/* Pomodoro count */}
      <span className="text-xs text-muted tabular-nums flex-shrink-0">
        {task.completedPomodoros}/{task.estimatedPomodoros}
      </span>

      {/* AI badge */}
      {task.aiGenerated && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 flex-shrink-0">
          AI
        </span>
      )}

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all flex-shrink-0"
        aria-label="Delete task"
      >
        <svg
          width="14"
          height="14"
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
  );
}

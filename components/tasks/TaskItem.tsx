"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { DisplayTask } from "@/hooks/useTaskHistory";

interface TaskItemProps {
  task: DisplayTask;
  isActive: boolean;
  readOnly?: boolean;
  showDailyStats?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onSetActive?: () => void;
  onEdit?: (title: string) => void;
  /** Rendered before the checkbox. Supplied by TaskList when reordering is on. */
  dragHandle?: React.ReactNode;
  isDragging?: boolean;
}

export function TaskItem({
  task,
  isActive,
  readOnly = false,
  showDailyStats = false,
  onToggle,
  onDelete,
  onSetActive,
  onEdit,
  dragHandle,
  isDragging = false,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const canEdit = !readOnly && !task.isGhost && onEdit;
  const canToggle = !readOnly && !task.isGhost && onToggle;
  const canDelete = !readOnly && !task.isGhost && onDelete;
  const canActivate = !readOnly && !task.isGhost && onSetActive;

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title && onEdit) {
      onEdit(trimmed);
    }
    setEditValue(trimmed || task.title);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={cn(
        "group glass rounded-xl px-3 py-2.5 flex items-start gap-3 transition-all duration-200",
        canActivate && "cursor-pointer",
        isActive && "ring-1 ring-white/20 bg-white/8",
        task.completed && "opacity-50",
        task.isGhost && "opacity-60",
        isDragging && "ring-1 ring-white/25 bg-white/10 shadow-lg cursor-grabbing"
      )}
      onClick={canActivate ? onSetActive : undefined}
    >
      {/* Drag handle */}
      {dragHandle}

      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (canToggle) onToggle();
        }}
        disabled={!canToggle}
        className={cn(
          "w-5 h-5 mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors",
          task.completed
            ? "border-emerald-500 bg-emerald-500"
            : "border-muted",
          canToggle && !task.completed && "hover:border-foreground",
          !canToggle && "cursor-default"
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
      {isEditing && canEdit ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-sm text-foreground bg-transparent outline-none border-b border-white/20 py-0"
        />
      ) : (
        <span
          className={cn(
            "flex-1 text-sm text-foreground break-words",
            task.completed && "line-through",
            task.isGhost && "italic"
          )}
          onDoubleClick={(e) => {
            if (!canEdit) return;
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {task.title}
        </span>
      )}

      {/* Pomodoro count */}
      {showDailyStats || task.isGhost ? (
        <span className="text-xs text-muted tabular-nums flex-shrink-0 mt-0.5">
          {task.pomodorosForDay} · {task.minutesForDay}m
        </span>
      ) : (
        task.estimatedPomodoros !== null &&
        task.totalCompletedPomodoros !== null && (
          <span className="text-xs text-muted tabular-nums flex-shrink-0 mt-0.5">
            {task.totalCompletedPomodoros}/{task.estimatedPomodoros}
          </span>
        )
      )}

      {/* AI badge */}
      {task.aiGenerated && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 flex-shrink-0">
          AI
        </span>
      )}

      {/* Delete */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
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
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { DisplayTask } from "@/hooks/useTaskHistory";
import { TaskEditor, type TaskChanges } from "./TaskEditor";

const COPY = {
  edit: "Edit task",
};

interface TaskItemProps {
  task: DisplayTask;
  isActive: boolean;
  readOnly?: boolean;
  showDailyStats?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onSetActive?: () => void;
  onEdit?: (changes: TaskChanges) => void;
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
  const editButtonRef = useRef<HTMLButtonElement>(null);
  // Set when the editor closes, so focus goes back to the pencil once the row
  // is rendered again.
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (!isEditing && restoreFocus.current) {
      restoreFocus.current = false;
      editButtonRef.current?.focus();
    }
  }, [isEditing]);

  const canEdit = !readOnly && !task.isGhost && onEdit;
  const canToggle = !readOnly && !task.isGhost && onToggle;
  const canDelete = !readOnly && !task.isGhost && onDelete;
  const canActivate = !readOnly && !task.isGhost && onSetActive;

  const closeEditor = () => {
    restoreFocus.current = true;
    setIsEditing(false);
  };

  if (isEditing && canEdit) {
    return (
      <TaskEditor
        initialTitle={task.title}
        initialEstimate={task.estimatedPomodoros ?? 1}
        isActive={isActive}
        onSave={(changes) => {
          if (
            changes.title !== task.title ||
            changes.estimatedPomodoros !== task.estimatedPomodoros
          ) {
            onEdit(changes);
          }
          closeEditor();
        }}
        onCancel={closeEditor}
        onDelete={canDelete ? onDelete : undefined}
      />
    );
  }

  return (
    <div
      className={cn(
        "group glass relative overflow-hidden rounded-xl px-3 py-2.5 flex items-start gap-3 transition-all duration-200",
        canActivate &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text/60",
        isActive && "ring-1 ring-accent-text/40 bg-surface-hover",
        task.completed && "opacity-50",
        task.isGhost && "opacity-60",
        isDragging && "ring-1 ring-white/25 bg-surface-active shadow-lg cursor-grabbing"
      )}
      onClick={canActivate ? onSetActive : undefined}
      onKeyDown={
        canActivate
          ? (e) => {
              // Enter only: Space stays the app-wide start/pause shortcut, and
              // a focused row must not swallow it right after a click.
              if (e.key !== "Enter" || e.target !== e.currentTarget) return;
              e.preventDefault();
              onSetActive();
            }
          : undefined
      }
      role={canActivate ? "button" : undefined}
      tabIndex={canActivate ? 0 : undefined}
      aria-pressed={canActivate ? isActive : undefined}
      aria-label={
        canActivate
          ? isActive
            ? `${task.title} — linked to the timer, click to unlink`
            : `${task.title} — link the timer to this task`
          : undefined
      }
    >
      {/* Active marker: the timer records its session against this task */}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[3px] bg-accent-text"
        />
      )}

      {/* Drag handle */}
      {dragHandle}

      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (canToggle) onToggle();
        }}
        disabled={!canToggle}
        aria-label={task.completed ? "Mark as not done" : "Mark as done"}
        aria-pressed={task.completed}
        className={cn(
          "w-5 h-5 mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors",
          // Invisible padding: the box stays 20px, the finger gets about 40px.
          "relative before:absolute before:-inset-y-3.5 before:-left-2.5 before:-right-3.5 before:content-['']",
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
      <span
        className={cn(
          "flex-1 min-w-0 text-sm text-foreground break-words",
          isActive && "font-medium",
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

      {/* Edit */}
      {canEdit && (
        <button
          ref={editButtonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className={cn(
            "text-muted hover:text-foreground transition-all flex-shrink-0 mt-0.5",
            // Same reveal rule as the delete button below.
            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(pointer:coarse)]:opacity-60",
            // Invisible padding: 14px icon, 40px to the finger.
            "relative before:absolute before:-inset-[13px] before:content-['']"
          )}
          aria-label={COPY.edit}
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
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
      )}

      {/* Delete */}
      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            "text-muted hover:text-red-400 transition-all flex-shrink-0 mt-0.5",
            // Hover reveal on desktop. A touch screen has no hover, so the
            // button was unreachable there: always shown on coarse pointers,
            // and whenever it holds keyboard focus. With a pencil on the row,
            // touch screens delete from the editor instead: one action icon
            // keeps the row uncluttered.
            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(pointer:coarse)]:opacity-60",
            canEdit && "[@media(pointer:coarse)]:hidden",
            "relative before:absolute before:-inset-3 before:content-['']"
          )}
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

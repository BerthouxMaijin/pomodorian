"use client";

import { useEffect, useRef } from "react";
import type { EditableTask } from "@/lib/plan";
import type { PlannerCopy } from "./plannerCopy";

interface PlanTaskRowProps {
  task: EditableTask;
  isFirst: boolean;
  isLast: boolean;
  autoFocus: boolean;
  copy: PlannerCopy;
  onRename: (title: string) => void;
  onStep: (delta: 1 | -1) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}

export function PlanTaskRow({
  task,
  isFirst,
  isLast,
  autoFocus,
  copy,
  onRename,
  onStep,
  onDelete,
  onMove,
}: PlanTaskRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const isEmpty = task.title.trim().length === 0;

  return (
    <div
      className={`glass rounded-xl p-3 ${
        isEmpty ? "ring-1 ring-red-400/50" : ""
      }`}
    >
      <div className="flex items-start gap-2">
      {/* Reorder controls */}
      <div className="flex flex-col gap-0.5 flex-shrink-0 pt-0.5">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={isFirst}
          aria-label={copy.moveUpAriaLabel}
          className="text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={isLast}
          aria-label={copy.moveDownAriaLabel}
          className="text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={task.title}
          onChange={(e) => onRename(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.currentTarget.blur();
            }
          }}
          maxLength={200}
          placeholder={copy.taskTitlePlaceholder}
          aria-label={copy.taskTitlePlaceholder}
          className="w-full bg-transparent text-base md:text-sm text-foreground placeholder:text-muted outline-none"
        />
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
        <button
          type="button"
          onClick={() => onStep(-1)}
          disabled={task.estimatedPomodoros <= 1}
          aria-label={copy.decreaseAriaLabel}
          className="w-6 h-6 rounded-md glass flex items-center justify-center text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span
          className="text-xs text-muted tabular-nums whitespace-nowrap"
          title={copy.pomodoroUnit(task.estimatedPomodoros)}
        >
          <span className="sm:hidden min-w-4 inline-block text-center">
            {task.estimatedPomodoros}
          </span>
          <span className="hidden sm:inline">
            {copy.pomodoroUnit(task.estimatedPomodoros)}
          </span>
        </span>
        <button
          type="button"
          onClick={() => onStep(1)}
          disabled={task.estimatedPomodoros >= 8}
          aria-label={copy.increaseAriaLabel}
          className="w-6 h-6 rounded-md glass flex items-center justify-center text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        aria-label={copy.deleteAriaLabel}
        className="text-muted hover:text-red-400 transition-colors flex-shrink-0 pt-0.5"
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      </div>

      {task.rationale && (
        <p className="text-xs text-muted mt-1.5 pl-6 break-words">
          {task.rationale}
        </p>
      )}
    </div>
  );
}

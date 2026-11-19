"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EstimateStepper, clampEstimate } from "./EstimateStepper";
import { useAppCopy } from "@/hooks/useAppCopy";

export interface TaskChanges {
  title: string;
  estimatedPomodoros: number;
}

interface TaskEditorProps {
  initialTitle: string;
  initialEstimate: number;
  isActive?: boolean;
  onSave: (changes: TaskChanges) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

/** Inline editor shown in place of a task row: title, estimate, actions. */
export function TaskEditor({
  initialTitle,
  initialEstimate,
  isActive = false,
  onSave,
  onCancel,
  onDelete,
}: TaskEditorProps) {
  const tasksCopy = useAppCopy().tasks;
  const COPY = {
    titleLabel: tasksCopy.titleLabel,
    delete: tasksCopy.delete,
    deleteLabel: tasksCopy.deleteTask,
    cancel: tasksCopy.cancel,
    save: tasksCopy.save,
  };
  const [title, setTitle] = useState(initialTitle);
  const [estimate, setEstimate] = useState(() => clampEstimate(initialEstimate));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const trimmed = title.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onSave({ title: trimmed, estimatedPomodoros: estimate });
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
        // Keys typed in the editor belong to it: Space on a stepper button
        // must not reach the app-wide start/pause shortcut.
        e.stopPropagation();
      }}
      // The editor sits inside the row: a click here must not change the
      // active task.
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "glass relative overflow-hidden rounded-xl p-3 space-y-3",
        isActive && "ring-1 ring-accent-text/40"
      )}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[3px] bg-accent-text"
        />
      )}
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label={COPY.titleLabel}
        enterKeyHint="done"
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted outline-none border-b border-border pb-1"
      />
      <EstimateStepper value={estimate} onChange={setEstimate} />
      <div className="flex items-center justify-between gap-2">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            aria-label={COPY.deleteLabel}
            className="text-xs text-muted hover:text-red-400 transition-colors py-3 pr-3"
          >
            {COPY.delete}
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted hover:text-foreground transition-colors py-3 px-3"
          >
            {COPY.cancel}
          </button>
          <button
            type="submit"
            disabled={!trimmed}
            className="px-5 py-2.5 rounded-lg bg-surface-hover text-sm font-medium text-foreground hover:bg-surface-active transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {COPY.save}
          </button>
        </div>
      </div>
    </form>
  );
}

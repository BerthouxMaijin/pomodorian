"use client";

import { useState } from "react";
import { TaskItem } from "./TaskItem";
import type { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAdd: (title: string, estimatedPomodoros?: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string | null) => void;
  onIncrementPomodoro: (id: string) => void;
  onOpenAIPlanner: () => void;
}

export function TaskList({
  tasks,
  activeTaskId,
  onAdd,
  onToggle,
  onDelete,
  onSetActive,
  onOpenAIPlanner,
}: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    onAdd(title);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Tasks</h2>
        <span className="text-xs text-muted tabular-nums">
          {tasks.filter((t) => t.completed).length}/{tasks.length}
        </span>
      </div>

      <div className="space-y-1.5">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isActive={task.id === activeTaskId}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
            onSetActive={() =>
              onSetActive(task.id === activeTaskId ? null : task.id)
            }
          />
        ))}
      </div>

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
    </div>
  );
}

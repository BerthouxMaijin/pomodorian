"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { TaskItem } from "./TaskItem";
import { cn } from "@/lib/utils";
import type { DisplayTask } from "@/hooks/useTaskHistory";

interface SortableTaskItemProps {
  task: DisplayTask;
  /** Real task id — ghost rows are never rendered through this component. */
  taskId: string;
  isActive: boolean;
  /** False when the list holds a single task: nothing to reorder. */
  canReorder: boolean;
  onMove: (delta: number) => void;
  onToggle?: () => void;
  onDelete?: () => void;
  onEdit?: (title: string) => void;
  onSetActive?: () => void;
}

export function SortableTaskItem({
  task,
  taskId,
  isActive,
  canReorder,
  onMove,
  onToggle,
  onDelete,
  onEdit,
  onSetActive,
}: SortableTaskItemProps) {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Item
      value={taskId}
      // The row itself stays clickable (activate) and double-clickable (edit):
      // only the handle below starts a drag.
      dragListener={false}
      dragControls={dragControls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className="list-none"
    >
      <TaskItem
        task={task}
        isActive={isActive}
        isDragging={isDragging}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onSetActive={onSetActive}
        dragHandle={
          canReorder ? (
            <button
              type="button"
              aria-label={`Reorder ${task.title}. Use arrow up and arrow down to move it.`}
              onPointerDown={(e) => {
                e.stopPropagation();
                dragControls.start(e);
              }}
              // Without this the pointerup after a drag would bubble to the row
              // and toggle the active task.
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  onMove(-1);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  onMove(1);
                }
              }}
              // Required for touch dragging: without it the browser claims the
              // gesture for scrolling before Framer sees it.
              style={{ touchAction: "none" }}
              className={cn(
                "flex-shrink-0 mt-0.5 -ml-1 p-0.5 rounded text-muted transition-all",
                "cursor-grab active:cursor-grabbing hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
                // Hover reveal on desktop, always visible where there is no
                // hover (touch), and whenever the handle has keyboard focus.
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                "[@media(pointer:coarse)]:opacity-60",
                isDragging && "opacity-100"
              )}
            >
              <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
                <circle cx="4" cy="4" r="1.35" />
                <circle cx="8" cy="4" r="1.35" />
                <circle cx="4" cy="8" r="1.35" />
                <circle cx="8" cy="8" r="1.35" />
                <circle cx="4" cy="12" r="1.35" />
                <circle cx="8" cy="12" r="1.35" />
              </svg>
            </button>
          ) : undefined
        }
      />
    </Reorder.Item>
  );
}

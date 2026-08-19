"use client";

import { useReducer, useEffect, useCallback, useState } from "react";
import { generateId } from "@/lib/utils";
import { STORAGE_KEYS, type Task, type AITaskSuggestion } from "@/lib/types";

function readTasksFromStorage(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type TaskAction =
  | { type: "SET"; tasks: Task[] }
  | { type: "ADD"; title: string; estimatedPomodoros?: number; aiGenerated?: boolean }
  | { type: "DELETE"; id: string }
  | { type: "TOGGLE"; id: string }
  | { type: "EDIT"; id: string; title: string }
  | { type: "INCREMENT_POMODORO"; id: string }
  | { type: "REORDER"; orderedIds: string[] }
  | { type: "IMPORT_AI"; entries: { id: string; suggestion: AITaskSuggestion }[] };

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "SET":
      return action.tasks;
    case "ADD":
      return [
        ...state,
        {
          id: generateId(),
          title: action.title,
          estimatedPomodoros: action.estimatedPomodoros ?? 1,
          completedPomodoros: 0,
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          aiGenerated: action.aiGenerated ?? false,
          order: state.length,
        },
      ];
    case "DELETE":
      return state.filter((t) => t.id !== action.id);
    case "TOGGLE":
      return state.map((t) => {
        if (t.id !== action.id) return t;
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
        };
      });
    case "EDIT":
      return state.map((t) =>
        t.id === action.id ? { ...t, title: action.title } : t
      );
    case "INCREMENT_POMODORO":
      return state.map((t) =>
        t.id === action.id
          ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
          : t
      );
    case "REORDER": {
      // `orderedIds` is only the subset of tasks visible in the list (today's
      // view hides tasks completed on earlier days). Rewriting `order` from
      // that subset alone would scramble the hidden ones, so instead we keep
      // every slot the visible tasks already occupy and refill those slots in
      // the new sequence. Hidden tasks never move relative to their neighbours.
      const byId = new Map(state.map((t) => [t.id, t]));
      const visibleIds: string[] = [];
      const visibleSet = new Set<string>();
      for (const id of action.orderedIds) {
        if (!byId.has(id) || visibleSet.has(id)) continue;
        visibleIds.push(id);
        visibleSet.add(id);
      }
      if (visibleIds.length < 2) return state;

      const sorted = [...state].sort((a, b) => a.order - b.order);
      let next = 0;
      const reordered = sorted.map((t) =>
        visibleSet.has(t.id) ? byId.get(visibleIds[next++])! : t
      );
      // Renumber everything, which also closes the gaps left by deletions.
      return reordered.map((t, i) => (t.order === i ? t : { ...t, order: i }));
    }
    case "IMPORT_AI": {
      const newTasks: Task[] = action.entries.map((entry, i) => ({
        id: entry.id,
        title: entry.suggestion.title,
        estimatedPomodoros: entry.suggestion.estimatedPomodoros,
        completedPomodoros: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        aiGenerated: true,
        order: state.length + i,
      }));
      return [...state, ...newTasks];
    }
    default:
      return state;
  }
}

export function useTasks() {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount. Deferred to a useEffect so the
  // SSR-rendered HTML (empty task list) matches the first client render.
  useEffect(() => {
    const stored = readTasksFromStorage();
    if (stored.length > 0) {
      dispatch({ type: "SET", tasks: stored });
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on changes. The hydrated guard prevents the
  // initial empty state from overwriting persisted tasks before hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore quota errors
    }
  }, [tasks, hydrated]);

  const addTask = useCallback(
    (title: string, estimatedPomodoros?: number) => {
      dispatch({ type: "ADD", title, estimatedPomodoros });
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE", id });
  }, []);

  const toggleComplete = useCallback((id: string) => {
    dispatch({ type: "TOGGLE", id });
  }, []);

  const editTask = useCallback((id: string, title: string) => {
    dispatch({ type: "EDIT", id, title });
  }, []);

  const incrementPomodoro = useCallback((id: string) => {
    dispatch({ type: "INCREMENT_POMODORO", id });
  }, []);

  // `orderedIds` = the visible rows in their new order (real task ids only,
  // ghost rows excluded).
  const reorderTasks = useCallback((orderedIds: string[]) => {
    dispatch({ type: "REORDER", orderedIds });
  }, []);

  const importAITasks = useCallback((suggestions: AITaskSuggestion[]): string[] => {
    const entries = suggestions.map((suggestion) => ({ id: generateId(), suggestion }));
    dispatch({ type: "IMPORT_AI", entries });
    return entries.map((e) => e.id);
  }, []);

  const setActiveTask = useCallback((id: string | null) => {
    setActiveTaskId(id);
  }, []);

  // Called when a pomodoro starts: guarantees the timer is linked to a task.
  // Users kept running unattributed pomodoros because nothing told them a task
  // had to be picked first, so we fall back to the first open task (the top row
  // of today's list). Returns the id the session will be attributed to.
  const ensureActiveTask = useCallback((): string | null => {
    const current = activeTaskId
      ? tasks.find((t) => t.id === activeTaskId)
      : undefined;
    if (current && !current.completed) return current.id;

    const next = [...tasks]
      .sort((a, b) => a.order - b.order)
      .find((t) => !t.completed);
    const nextId = next?.id ?? null;
    setActiveTaskId(nextId);
    return nextId;
  }, [tasks, activeTaskId]);

  return {
    tasks,
    activeTaskId,
    addTask,
    deleteTask,
    toggleComplete,
    editTask,
    incrementPomodoro,
    reorderTasks,
    importAITasks,
    setActiveTask,
    ensureActiveTask,
  };
}

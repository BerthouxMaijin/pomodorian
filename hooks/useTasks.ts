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
  | { type: "IMPORT_AI"; suggestions: AITaskSuggestion[] };

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
    case "IMPORT_AI": {
      const newTasks: Task[] = action.suggestions.map((s, i) => ({
        id: generateId(),
        title: s.title,
        estimatedPomodoros: s.estimatedPomodoros,
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

  const importAITasks = useCallback((suggestions: AITaskSuggestion[]) => {
    dispatch({ type: "IMPORT_AI", suggestions });
  }, []);

  const setActiveTask = useCallback((id: string | null) => {
    setActiveTaskId(id);
  }, []);

  return {
    tasks,
    activeTaskId,
    addTask,
    deleteTask,
    toggleComplete,
    editTask,
    incrementPomodoro,
    importAITasks,
    setActiveTask,
  };
}

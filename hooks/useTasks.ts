"use client";

import { useReducer, useEffect, useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import { STORAGE_KEYS, type Task, type AITaskSuggestion } from "@/lib/types";

type TaskAction =
  | { type: "SET"; tasks: Task[] }
  | { type: "ADD"; title: string; estimatedPomodoros?: number; aiGenerated?: boolean }
  | { type: "DELETE"; id: string }
  | { type: "TOGGLE"; id: string }
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
          aiGenerated: action.aiGenerated ?? false,
          order: state.length,
        },
      ];
    case "DELETE":
      return state.filter((t) => t.id !== action.id);
    case "TOGGLE":
      return state.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed } : t
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
  const [stored, setStored] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  const [tasks, dispatch] = useReducer(taskReducer, stored);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    if (stored.length > 0 && !initialized) {
      dispatch({ type: "SET", tasks: stored });
      setInitialized(true);
    } else if (!initialized) {
      setInitialized(true);
    }
  }, [stored, initialized]);

  // Persist to localStorage
  useEffect(() => {
    if (initialized) {
      setStored(tasks);
    }
  }, [tasks, initialized, setStored]);

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
    incrementPomodoro,
    importAITasks,
    setActiveTask,
  };
}

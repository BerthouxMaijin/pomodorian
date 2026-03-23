"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import type { TimerMode, TimerStatus, AppSettings } from "@/lib/types";
import { getDurationForMode } from "@/lib/utils";

interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number;
  totalTime: number;
  pomodorosCompleted: number;
  endTime: number | null;
}

type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "TICK" }
  | { type: "SKIP" }
  | { type: "RESET" }
  | { type: "SET_MODE"; mode: TimerMode; duration: number }
  | { type: "COMPLETE" }
  | { type: "SYNC_SETTINGS"; duration: number };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START": {
      const endTime = Date.now() + state.timeRemaining * 1000;
      return { ...state, status: "running", endTime };
    }
    case "PAUSE":
      return { ...state, status: "paused", endTime: null };
    case "RESUME": {
      const endTime = Date.now() + state.timeRemaining * 1000;
      return { ...state, status: "running", endTime };
    }
    case "TICK": {
      if (state.status !== "running" || !state.endTime) return state;
      const remaining = Math.max(
        0,
        Math.round((state.endTime - Date.now()) / 1000)
      );
      if (remaining <= 0) {
        return { ...state, timeRemaining: 0, status: "idle", endTime: null };
      }
      return { ...state, timeRemaining: remaining };
    }
    case "COMPLETE": {
      const pomodorosCompleted =
        state.mode === "pomodoro"
          ? state.pomodorosCompleted + 1
          : state.pomodorosCompleted;
      return { ...state, pomodorosCompleted };
    }
    case "SKIP":
    case "RESET":
      return {
        ...state,
        status: "idle",
        timeRemaining: state.totalTime,
        endTime: null,
      };
    case "SET_MODE":
      return {
        ...state,
        mode: action.mode,
        status: "idle",
        timeRemaining: action.duration,
        totalTime: action.duration,
        endTime: null,
      };
    case "SYNC_SETTINGS":
      if (state.status !== "idle") return state;
      return {
        ...state,
        timeRemaining: action.duration,
        totalTime: action.duration,
      };
    default:
      return state;
  }
}

export function useTimer(settings: AppSettings) {
  const initialDuration = settings.pomodoroDuration;

  const [state, dispatch] = useReducer(timerReducer, {
    mode: "pomodoro" as TimerMode,
    status: "idle" as TimerStatus,
    timeRemaining: initialDuration,
    totalTime: initialDuration,
    pomodorosCompleted: 0,
    endTime: null,
  });

  const onCompleteRef = useRef<(() => void) | null>(null);

  // Tick interval
  useEffect(() => {
    if (state.status !== "running") return;

    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 200); // tick frequently for accuracy

    return () => clearInterval(interval);
  }, [state.status]);

  // Detect completion (timeRemaining hits 0 after running)
  const prevTimeRef = useRef(state.timeRemaining);
  useEffect(() => {
    if (
      prevTimeRef.current > 0 &&
      state.timeRemaining === 0 &&
      state.status === "idle"
    ) {
      dispatch({ type: "COMPLETE" });
      onCompleteRef.current?.();
    }
    prevTimeRef.current = state.timeRemaining;
  }, [state.timeRemaining, state.status]);

  // Sync duration when settings change and timer is idle
  useEffect(() => {
    const duration = getDurationForMode(state.mode, settings);
    dispatch({ type: "SYNC_SETTINGS", duration });
  }, [
    settings.pomodoroDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
    state.mode,
    settings,
  ]);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const resume = useCallback(() => dispatch({ type: "RESUME" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);

  const setMode = useCallback(
    (mode: TimerMode) => {
      const duration = getDurationForMode(mode, settings);
      dispatch({ type: "SET_MODE", mode, duration });
    },
    [settings]
  );

  const progress =
    state.totalTime > 0
      ? (state.totalTime - state.timeRemaining) / state.totalTime
      : 0;

  return {
    mode: state.mode,
    status: state.status,
    timeRemaining: state.timeRemaining,
    totalTime: state.totalTime,
    pomodorosCompleted: state.pomodorosCompleted,
    progress,
    start,
    pause,
    resume,
    reset,
    skip,
    setMode,
    onCompleteRef,
  };
}

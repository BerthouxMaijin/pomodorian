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
  /**
   * Id of the focus session this run extends ("+5 min" after a pomodoro), or
   * null for an ordinary run. An extension adds its minutes to that session
   * instead of counting a new pomodoro.
   */
  extensionOf: string | null;
  /** False until the saved snapshot has been read: nothing is written before. */
  restored: boolean;
}

/** What survives a reload, a crashed tab or a closed browser. */
interface TimerSnapshot {
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number;
  totalTime: number;
  pomodorosCompleted: number;
  endTime: number | null;
  savedAt: number;
  /** Absent in snapshots written before extensions existed. */
  extensionOf?: string | null;
}

/**
 * A timer state captured just before a manual interruption (mode switch, skip,
 * reset), so the interruption can be undone with `revert`.
 */
export interface TimerCapture {
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number;
  totalTime: number;
  pomodorosCompleted: number;
  endTime: number | null;
  extensionOf?: string | null;
}

interface UseTimerOptions {
  /** localStorage key for the snapshot. Omit for a timer that should not persist. */
  persistKey?: string;
}

// A paused timer and the pomodoro count belong to one stretch of work: past
// this age they are dropped and the day starts clean.
const SNAPSHOT_MAX_AGE_MS = 12 * 60 * 60 * 1000;
// A countdown that reached zero while the page was closed is still credited,
// the same way it is when a laptop wakes up on an open tab, but only if it
// ended recently. Older than this, nobody remembers that session.
const ENDED_WHILE_AWAY_MAX_MS = 60 * 60 * 1000;

const MODES: TimerMode[] = ["pomodoro", "shortBreak", "longBreak"];

function readSnapshot(key: string): TimerSnapshot | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<TimerSnapshot> | null;
    if (
      !v ||
      !MODES.includes(v.mode as TimerMode) ||
      !["idle", "running", "paused"].includes(v.status as string) ||
      !Number.isFinite(v.timeRemaining) ||
      !Number.isFinite(v.totalTime) ||
      !Number.isFinite(v.pomodorosCompleted) ||
      !Number.isFinite(v.savedAt) ||
      (v.endTime !== null && !Number.isFinite(v.endTime))
    ) {
      return null;
    }
    // A malformed extension id only loses the extension: the run restores as
    // a plain pomodoro instead of dropping the whole snapshot.
    const extensionOf =
      typeof v.extensionOf === "string" && v.extensionOf ? v.extensionOf : null;
    return { ...(v as TimerSnapshot), extensionOf };
  } catch {
    return null;
  }
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
  | { type: "SYNC_SETTINGS"; duration: number }
  | { type: "RESTORE"; snapshot: TimerSnapshot | null; now: number }
  | { type: "REVERT"; captured: TimerCapture; now: number }
  | { type: "EXTEND"; seconds: number; sessionId: string; now: number };

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
      // Several beats land within the same second: keeping the same object
      // lets React skip the render instead of repainting the page each time.
      if (remaining === state.timeRemaining) return state;
      return { ...state, timeRemaining: remaining };
    }
    case "COMPLETE": {
      // An extension continues a pomodoro that was already counted.
      const pomodorosCompleted =
        state.mode === "pomodoro" && !state.extensionOf
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
        extensionOf: null,
      };
    case "SET_MODE":
      return {
        ...state,
        mode: action.mode,
        status: "idle",
        timeRemaining: action.duration,
        totalTime: action.duration,
        endTime: null,
        extensionOf: null,
      };
    case "SYNC_SETTINGS":
      if (state.status !== "idle") return state;
      return {
        ...state,
        timeRemaining: action.duration,
        totalTime: action.duration,
      };
    case "RESTORE": {
      const { snapshot, now } = action;
      if (!snapshot) return { ...state, restored: true };

      const fresh = now - snapshot.savedAt < SNAPSHOT_MAX_AGE_MS;
      const pomodorosCompleted = fresh ? snapshot.pomodorosCompleted : 0;
      const base = {
        ...state,
        restored: true,
        pomodorosCompleted,
        extensionOf: null,
      };
      const extensionOf =
        snapshot.mode === "pomodoro" ? snapshot.extensionOf ?? null : null;

      if (snapshot.status === "running" && snapshot.endTime) {
        const msLeft = snapshot.endTime - now;
        if (msLeft > 0) {
          return {
            ...base,
            mode: snapshot.mode,
            status: "running",
            endTime: snapshot.endTime,
            totalTime: snapshot.totalTime,
            timeRemaining: Math.max(1, Math.round(msLeft / 1000)),
            extensionOf,
          };
        }
        if (-msLeft < ENDED_WHILE_AWAY_MAX_MS) {
          // Ended while the page was closed: resume one second from the end so
          // the next beat runs the normal completion path (session recorded,
          // next mode selected).
          return {
            ...base,
            mode: snapshot.mode,
            status: "running",
            endTime: snapshot.endTime,
            totalTime: snapshot.totalTime,
            timeRemaining: 1,
            extensionOf,
          };
        }
        return base;
      }

      if (snapshot.status === "paused" && fresh && snapshot.timeRemaining > 0) {
        return {
          ...base,
          mode: snapshot.mode,
          status: "paused",
          endTime: null,
          totalTime: snapshot.totalTime,
          timeRemaining: snapshot.timeRemaining,
          extensionOf,
        };
      }

      return base;
    }
    case "REVERT": {
      const { captured, now } = action;
      const base = {
        ...state,
        mode: captured.mode,
        totalTime: captured.totalTime,
        pomodorosCompleted: captured.pomodorosCompleted,
        extensionOf: captured.extensionOf ?? null,
      };
      if (captured.status === "running" && captured.endTime) {
        // Same endTime: the clock kept flowing while the undo was on offer. If
        // it already ran out, one second left lets the next beat run the
        // normal completion path.
        const msLeft = captured.endTime - now;
        return {
          ...base,
          status: "running",
          endTime: captured.endTime,
          timeRemaining: Math.max(1, Math.round(msLeft / 1000)),
        };
      }
      return {
        ...base,
        status: captured.status,
        endTime: null,
        timeRemaining: captured.timeRemaining,
      };
    }
    case "EXTEND":
      // Straight from wherever the timer is (usually the break that just
      // began) to a running pomodoro of `seconds`, in one transition: going
      // through SET_MODE would let SYNC_SETTINGS reset it to the full length.
      return {
        ...state,
        mode: "pomodoro",
        status: "running",
        timeRemaining: action.seconds,
        totalTime: action.seconds,
        endTime: action.now + action.seconds * 1000,
        extensionOf: action.sessionId,
      };
    default:
      return state;
  }
}

export function useTimer(settings: AppSettings, options: UseTimerOptions = {}) {
  const { persistKey } = options;
  const initialDuration = settings.pomodoroDuration;

  const [state, dispatch] = useReducer(timerReducer, {
    mode: "pomodoro" as TimerMode,
    status: "idle" as TimerStatus,
    timeRemaining: initialDuration,
    totalTime: initialDuration,
    pomodorosCompleted: 0,
    endTime: null,
    extensionOf: null,
    restored: false,
  });

  const onCompleteRef = useRef<(() => void) | null>(null);

  // Latest state, read by capture() without making it change on every tick.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const registerOnComplete = useCallback((fn: (() => void) | null) => {
    onCompleteRef.current = fn;
  }, []);

  // Pick up where the last page left off. Runs after mount (localStorage does
  // not exist during SSR); a timer without a key is marked restored right away.
  useEffect(() => {
    dispatch({
      type: "RESTORE",
      snapshot: persistKey ? readSnapshot(persistKey) : null,
      now: Date.now(),
    });
  }, [persistKey]);

  // Save on every transition, never on a plain tick: a running countdown is
  // fully described by its endTime, so there is nothing to write each second.
  const persistedRemaining =
    state.status === "running" ? null : state.timeRemaining;
  useEffect(() => {
    if (!persistKey || !state.restored) return;
    const snapshot: TimerSnapshot = {
      mode: state.mode,
      status: state.status,
      timeRemaining: persistedRemaining ?? state.totalTime,
      totalTime: state.totalTime,
      pomodorosCompleted: state.pomodorosCompleted,
      endTime: state.endTime,
      savedAt: Date.now(),
      extensionOf: state.extensionOf,
    };
    try {
      localStorage.setItem(persistKey, JSON.stringify(snapshot));
    } catch {
      // ignore quota errors
    }
  }, [
    persistKey,
    state.restored,
    state.mode,
    state.status,
    state.totalTime,
    state.pomodorosCompleted,
    state.endTime,
    state.extensionOf,
    persistedRemaining,
  ]);

  // Heartbeat. Each beat only asks the reducer to read the clock: the time
  // left always comes from endTime. The beat itself comes from a worker,
  // because a background tab throttles main-thread timers (one per minute in
  // Chrome after five hidden minutes) and the alarm rang late. Main-thread
  // interval as a fallback if the worker cannot start.
  useEffect(() => {
    if (state.status !== "running") return;

    const tick = () => dispatch({ type: "TICK" });
    let interval: ReturnType<typeof setInterval> | null = null;
    const startFallback = () => {
      if (interval === null) interval = setInterval(tick, 200);
    };

    let worker: Worker | null = null;
    try {
      worker = new Worker("/timer-worker.js");
      worker.onmessage = tick;
      worker.onerror = startFallback;
      worker.postMessage("start");
    } catch {
      startFallback();
    }

    // Coming back to the tab: correct the display at once instead of waiting
    // for the next beat.
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      worker?.terminate();
      if (interval !== null) clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
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
  // Resetting a "+5 min" goes back to a full pomodoro, not to a 5-minute one.
  const reset = useCallback(() => {
    if (stateRef.current.extensionOf) {
      const duration = getDurationForMode("pomodoro", settings);
      dispatch({ type: "SET_MODE", mode: "pomodoro", duration });
      return;
    }
    dispatch({ type: "RESET" });
  }, [settings]);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);

  const capture = useCallback((): TimerCapture => {
    const s = stateRef.current;
    return {
      mode: s.mode,
      status: s.status,
      timeRemaining: s.timeRemaining,
      totalTime: s.totalTime,
      pomodorosCompleted: s.pomodorosCompleted,
      endTime: s.endTime,
      extensionOf: s.extensionOf,
    };
  }, []);
  const revert = useCallback(
    (captured: TimerCapture) =>
      dispatch({ type: "REVERT", captured, now: Date.now() }),
    []
  );

  const extend = useCallback(
    (seconds: number, sessionId: string) =>
      dispatch({ type: "EXTEND", seconds, sessionId, now: Date.now() }),
    []
  );

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
    extensionOf: state.extensionOf,
    progress,
    start,
    pause,
    resume,
    reset,
    skip,
    setMode,
    capture,
    revert,
    extend,
    registerOnComplete,
  };
}

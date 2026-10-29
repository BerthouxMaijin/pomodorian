"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTimer } from "@/hooks/useTimer";
import { useSettings } from "@/hooks/useSettings";
import { useSound } from "@/hooks/useSound";
import { Timer } from "@/components/timer/Timer";
import { AMBIENT_SOUNDS, DEFAULT_SETTINGS, MODE_COLORS } from "@/lib/constants";
import { cn, formatTime } from "@/lib/utils";
import { track } from "@/lib/track";
import { TIMER_UI } from "@/lib/seo/timers/copy";
import type { TimerLang, TimerRole } from "@/lib/seo/timers/types";

interface EmbeddedTimerProps {
  minutes: number;
  breakMinutes?: number;
  lang: TimerLang;
  slug: string;
  role: TimerRole;
}

/**
 * The countdown of a timer tool page. Runs on the same wall-clock reducer as
 * the app (useTimer): the duration comes from props, never from the user's
 * saved settings, so landing here does not touch their Pomodoro setup. The
 * alarm and the ambient mix do follow their saved preferences.
 */
export function EmbeddedTimer({
  minutes,
  breakMinutes,
  lang,
  slug,
  role,
}: EmbeddedTimerProps) {
  const t = TIMER_UI[lang];
  const { settings: userSettings } = useSettings();
  const sound = useSound();

  const timerSettings = useMemo(
    () => ({
      ...DEFAULT_SETTINGS,
      pomodoroDuration: minutes * 60,
      shortBreakDuration: (breakMinutes ?? 5) * 60,
    }),
    [minutes, breakMinutes]
  );
  const timer = useTimer(timerSettings);
  const [finished, setFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startedTrackedRef = useRef(false);

  const modeMinutes =
    timer.mode === "pomodoro" ? minutes : (breakMinutes ?? 5);

  const handleComplete = useCallback(() => {
    sound.playAlarm(userSettings.alarmSound, userSettings.alarmVolume);
    sound.pauseAllAmbients();
    setFinished(true);
    track("tool_timer_completed", { slug, lang, minutes: modeMinutes, mode: timer.mode });
    // Offer the break next, without starting it: the person decides. A page
    // with no break mode rewinds instead, or it would sit at 00:00 with no
    // way to run again short of a reload.
    if (timer.mode === "pomodoro" && breakMinutes) timer.setMode("shortBreak");
    else if (timer.mode !== "pomodoro") timer.setMode("pomodoro");
    else timer.reset();
  }, [sound, userSettings.alarmSound, userSettings.alarmVolume, slug, lang, modeMinutes, timer, breakMinutes]);

  // No cleanup that unregisters: React runs every cleanup of a render before
  // any setup, so a null here would be in place exactly when useTimer's
  // completion effect fires, and the alarm would never ring.
  const { registerOnComplete } = timer;
  useEffect(() => {
    registerOnComplete(handleComplete);
  }, [handleComplete, registerOnComplete]);

  const start = useCallback(() => {
    sound.stopAlarm();
    setFinished(false);
    sound.resumeAllAmbients();
    if (timer.status === "paused") timer.resume();
    else timer.start();
    if (!startedTrackedRef.current) {
      startedTrackedRef.current = true;
      track("tool_timer_started", { slug, lang, minutes: modeMinutes, mode: timer.mode });
    }
  }, [sound, timer, slug, lang, modeMinutes]);

  const pause = useCallback(() => {
    timer.pause();
    sound.pauseAllAmbients();
  }, [timer, sound]);

  const reset = useCallback(() => {
    timer.reset();
    sound.pauseAllAmbients();
    setFinished(false);
  }, [timer, sound]);

  // Space toggles, as in the app. Ignored while typing or on a focused button
  // (the button's own activation already handles Space there).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a, [contenteditable]")) return;
      e.preventDefault();
      if (timer.status === "running") pause();
      else start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [timer.status, pause, start]);

  // Time in the tab title while counting, restored afterwards.
  useEffect(() => {
    if (timer.status === "idle") return;
    const original = document.title;
    document.title = `${formatTime(timer.timeRemaining)} · ${t.focus}`;
    return () => {
      document.title = original;
    };
  }, [timer.status, timer.timeRemaining, t.focus]);

  // iPhone Safari has no element full screen: hide the button there rather
  // than show one that silently does nothing.
  const [canFullscreen, setCanFullscreen] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection needs the browser, so it runs after mount
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    const onChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else containerRef.current?.requestFullscreen?.().catch(() => {});
  };

  const colors = MODE_COLORS[timer.mode];
  const appHref = role === "focus" ? `/?focus=${minutes}` : "/";

  return (
    <div
      ref={containerRef}
      className={cn(
        "glass rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6",
        isFullscreen && "justify-center bg-background rounded-none"
      )}
    >
      {breakMinutes && (
        <div className="flex gap-2 text-sm" role="group">
          <button
            type="button"
            onClick={() => { timer.setMode("pomodoro"); setFinished(false); }}
            aria-pressed={timer.mode === "pomodoro"}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-colors",
              timer.mode === "pomodoro" ? "bg-surface-hover text-foreground" : "text-muted hover:text-foreground"
            )}
          >
            {t.focus} {minutes} min
          </button>
          <button
            type="button"
            onClick={() => { timer.setMode("shortBreak"); setFinished(false); }}
            aria-pressed={timer.mode === "shortBreak"}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-colors",
              timer.mode === "shortBreak" ? "bg-surface-hover text-foreground" : "text-muted hover:text-foreground"
            )}
          >
            {t.breakLabel(breakMinutes)}
          </button>
        </div>
      )}

      <div
        className={cn("max-w-full", isFullscreen && "scale-125 sm:scale-[1.8] my-6 sm:my-20")}
        aria-live="off"
      >
        <Timer
          timeRemaining={timer.timeRemaining}
          progress={timer.progress}
          mode={timer.mode}
          showHours
        />
      </div>

      <p className="h-5 text-sm font-medium" role="status" aria-live="polite">
        {finished ? t.timeUp : ""}
      </p>

      <div className="flex items-center gap-3">
        {timer.status === "running" ? (
          <button
            type="button"
            onClick={pause}
            className="px-10 py-3 rounded-xl text-lg font-semibold glass text-foreground hover:bg-surface-hover transition-colors"
          >
            {t.pause}
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="px-10 py-3 rounded-xl text-lg font-semibold text-background transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: colors.accent }}
          >
            {timer.status === "paused" ? t.resume : t.start}
          </button>
        )}
        {timer.status !== "idle" && (
          <button
            type="button"
            onClick={reset}
            className="px-4 py-3 rounded-xl glass text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            {t.reset}
          </button>
        )}
        {canFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="px-4 py-3 rounded-xl glass text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
          title={isFullscreen ? t.exitFullscreen : t.fullscreen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {isFullscreen ? (
              <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
            ) : (
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            )}
          </svg>
        </button>
        )}
      </div>

      <div className="w-full">
        <p className="text-xs text-muted text-center mb-2">{t.sounds}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {AMBIENT_SOUNDS.map((s) => {
            const active = sound.ambients[s.key]?.active ?? false;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => sound.toggleAmbient(s.key, s.src)}
                aria-pressed={active}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                  active
                    ? "border-red-400/60 text-foreground bg-surface-hover"
                    : "border-border text-muted hover:text-foreground"
                )}
              >
                <span aria-hidden="true">{s.icon}</span> {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {!isFullscreen && (
        <Link
          href={appHref}
          onClick={() => track("tool_to_app_click", { slug, lang, minutes })}
          className="text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
        >
          {role === "focus" ? t.openAppFocus(minutes) : t.openApp} &rarr;
        </Link>
      )}
    </div>
  );
}

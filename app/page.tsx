"use client";

import { useState, useCallback, useEffect } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useSettings } from "@/hooks/useSettings";
import { useSound } from "@/hooks/useSound";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Timer } from "@/components/timer/Timer";
import { ModeSelector } from "@/components/timer/ModeSelector";
import { TimerControls } from "@/components/timer/TimerControls";
import { Background } from "@/components/layout/Background";
import { Header } from "@/components/layout/Header";
import { TaskList } from "@/components/tasks/TaskList";
import { SoundMixer } from "@/components/sounds/SoundMixer";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { AIPlannerModal } from "@/components/ai-planner/AIPlannerModal";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { formatTime } from "@/lib/utils";
import { MODE_LABELS } from "@/lib/constants";
import type { TimerMode } from "@/lib/types";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const timer = useTimer(settings);
  const tasks = useTasks();
  const sound = useSound();
  const analytics = useAnalytics();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiPlannerOpen, setAIPlannerOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Auto-advance to break/pomodoro on complete
  const handleComplete = useCallback(() => {
    // Play alarm
    sound.playAlarm(settings.alarmSound, settings.alarmVolume);

    // Record analytics session
    const durationMinutes = Math.round(
      (timer.mode === "pomodoro"
        ? settings.pomodoroDuration
        : timer.mode === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration) / 60
    );
    analytics.recordSession(timer.mode, durationMinutes, tasks.activeTaskId);

    // Increment pomodoro count on active task
    if (timer.mode === "pomodoro" && tasks.activeTaskId) {
      tasks.incrementPomodoro(tasks.activeTaskId);
    }

    // Determine next mode
    const nextMode: TimerMode =
      timer.mode === "pomodoro"
        ? timer.pomodorosCompleted % settings.longBreakInterval === 0
          ? "longBreak"
          : "shortBreak"
        : "pomodoro";

    timer.setMode(nextMode);

    // Auto-start if enabled
    if (
      (nextMode !== "pomodoro" && settings.autoStartBreaks) ||
      (nextMode === "pomodoro" && settings.autoStartPomodoros)
    ) {
      setTimeout(() => timer.start(), 100);
    }

    // Browser notification
    if (settings.notificationsEnabled && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Pomodorian", {
          body:
            timer.mode === "pomodoro"
              ? "Great work! Time for a break."
              : "Break is over. Let's focus!",
          icon: "/favicon.ico",
        });
      }
    }
  }, [timer, tasks, settings, sound, analytics]);

  // Register completion handler
  useEffect(() => {
    timer.onCompleteRef.current = handleComplete;
  }, [handleComplete, timer.onCompleteRef]);

  // Dynamic document title
  useEffect(() => {
    if (settings.showTimeInTitle && timer.status !== "idle") {
      document.title = `${formatTime(timer.timeRemaining)} - ${MODE_LABELS[timer.mode]}`;
    } else {
      document.title = "Pomodorian";
    }
  }, [timer.timeRemaining, timer.mode, timer.status, settings.showTimeInTitle]);

  // Request notification permission on first interaction
  useEffect(() => {
    if (
      settings.notificationsEnabled &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      const handler = () => {
        Notification.requestPermission();
        document.removeEventListener("click", handler);
      };
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [settings.notificationsEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (timer.status === "idle") timer.start();
          else if (timer.status === "running") timer.pause();
          else if (timer.status === "paused") timer.resume();
          break;
        case "1":
          timer.setMode("pomodoro");
          break;
        case "2":
          timer.setMode("shortBreak");
          break;
        case "3":
          timer.setMode("longBreak");
          break;
        case "s":
        case "S":
          setSettingsOpen((v) => !v);
          break;
        case "r":
        case "R":
          setAnalyticsOpen((v) => !v);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timer]);

  return (
    <>
      <Background mode={timer.mode} />
      <Header
        pomodorosCompleted={timer.pomodorosCompleted}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAnalytics={() => setAnalyticsOpen(true)}
      />

      <main className="flex-1 flex flex-col items-center gap-8 px-4 pt-8 pb-16 max-w-lg mx-auto w-full">
        <ModeSelector mode={timer.mode} onChange={timer.setMode} />

        <Timer
          timeRemaining={timer.timeRemaining}
          progress={timer.progress}
          mode={timer.mode}
        />

        <TimerControls
          status={timer.status}
          mode={timer.mode}
          onStart={timer.start}
          onPause={timer.pause}
          onResume={timer.resume}
          onSkip={timer.skip}
          onReset={timer.reset}
        />

        {timer.mode === "pomodoro" && (
          <div className="text-sm text-muted">
            #{timer.pomodorosCompleted + 1} &middot; Time to focus!
          </div>
        )}

        <SoundMixer
          ambients={sound.ambients}
          onToggle={sound.toggleAmbient}
          onVolumeChange={sound.setAmbientVolume}
        />

        <div className="w-full mt-4">
          <TaskList
            tasks={tasks.tasks}
            activeTaskId={tasks.activeTaskId}
            onAdd={tasks.addTask}
            onToggle={tasks.toggleComplete}
            onDelete={tasks.deleteTask}
            onSetActive={tasks.setActiveTask}
            onIncrementPomodoro={tasks.incrementPomodoro}
            onOpenAIPlanner={() => setAIPlannerOpen(true)}
          />
        </div>
      </main>

      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {aiPlannerOpen && (
        <AIPlannerModal
          settings={settings}
          onImportTasks={tasks.importAITasks}
          onClose={() => setAIPlannerOpen(false)}
        />
      )}

      {analyticsOpen && (
        <AnalyticsPanel
          todayMinutes={analytics.todayMinutes}
          todayPomodoros={analytics.todayPomodoros}
          totalHours={analytics.totalHours}
          streak={analytics.streak}
          heatmap={analytics.heatmap}
          onClose={() => setAnalyticsOpen(false)}
        />
      )}
    </>
  );
}

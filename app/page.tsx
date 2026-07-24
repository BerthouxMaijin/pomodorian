"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
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
import { ShortcutsModal } from "@/components/settings/ShortcutsModal";
import { AIPlannerModal } from "@/components/ai-planner/AIPlannerModal";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { InfoSection } from "@/components/layout/InfoSection";
import { Footer } from "@/components/layout/Footer";
import { FeedbackPrompt } from "@/components/feedback/FeedbackPrompt";
import { NeverDumpModal } from "@/components/neverdump/NeverDumpModal";
import { formatTime } from "@/lib/utils";
import { MODE_LABELS } from "@/lib/constants";
import type { TimerMode, AITaskSuggestion } from "@/lib/types";
import { useTasks } from "@/hooks/useTasks";
import { HomeSchemas } from "@/components/seo/HomeSchemas";
import { useBrowserLocale } from "@/hooks/useBrowserLocale";
import { NEVER_DUMP_COPY } from "@/components/neverdump/neverDumpCopy";

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const timer = useTimer(settings);
  const tasks = useTasks();
  const sound = useSound();
  const analytics = useAnalytics();
  const browserLocale = useBrowserLocale();
  const neverDumpCopy = NEVER_DUMP_COPY[browserLocale];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiPlannerOpen, setAIPlannerOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [neverDumpOpen, setNeverDumpOpen] = useState(false);
  const [neverDumpEligible, setNeverDumpEligible] = useState(false);
  const neverDumpOpenedRef = useRef(false);

  // Apply theme to HTML element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  // Auto-advance to break/pomodoro on complete
  const handleComplete = useCallback(() => {
    setNeverDumpOpen(false);
    sound.playAlarm(settings.alarmSound, settings.alarmVolume);

    const durationMinutes = Math.round(
      (timer.mode === "pomodoro"
        ? settings.pomodoroDuration
        : timer.mode === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration) / 60
    );
    const activeTask = tasks.activeTaskId
      ? tasks.tasks.find((t) => t.id === tasks.activeTaskId)
      : null;
    analytics.recordSession(
      timer.mode,
      durationMinutes,
      tasks.activeTaskId,
      activeTask?.title ?? null
    );

    if (timer.mode === "pomodoro") {
      track("pomodoro_completed");
      if (tasks.activeTaskId) {
        tasks.incrementPomodoro(tasks.activeTaskId);
      }
    }

    const completedPomodoros =
      timer.mode === "pomodoro"
        ? timer.pomodorosCompleted + 1
        : timer.pomodorosCompleted;
    const nextMode: TimerMode =
      timer.mode === "pomodoro"
        ? completedPomodoros % settings.longBreakInterval === 0
          ? "longBreak"
          : "shortBreak"
        : "pomodoro";

    const eligibleLongBreak =
      timer.mode === "pomodoro" && nextMode === "longBreak";
    setNeverDumpEligible(eligibleLongBreak);
    neverDumpOpenedRef.current = false;

    timer.setMode(nextMode);

    if (
      (nextMode !== "pomodoro" && settings.autoStartBreaks) ||
      (nextMode === "pomodoro" && settings.autoStartPomodoros)
    ) {
      setTimeout(() => timer.start(), 100);
    }

    if (settings.notificationsEnabled && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Pomodorian", {
          body:
            timer.mode === "pomodoro"
              ? "Great work! Time for a break."
              : "Break is over. Let's focus!",
          icon: "/icon.svg",
        });
      }
    }
  }, [timer, tasks, settings, sound, analytics]);

  const setModeManually = useCallback(
    (mode: TimerMode) => {
      setNeverDumpOpen(false);
      setNeverDumpEligible(false);
      neverDumpOpenedRef.current = false;
      timer.setMode(mode);
    },
    [timer]
  );

  const handleImportAndStart = useCallback(
    (suggestions: AITaskSuggestion[]) => {
      const ids = tasks.importAITasks(suggestions);
      if (ids.length === 0) return;
      tasks.setActiveTask(ids[0]);
      // A pomodoro is already running: import and activate without touching the timer.
      if (timer.status === "running" && timer.mode === "pomodoro") return;
      setModeManually("pomodoro");
      sound.playClick();
      setTimeout(() => timer.start(), 100);
      track("timer_started", { mode: "pomodoro" });
    },
    [tasks, timer, sound, setModeManually]
  );

  const openNeverDump = useCallback((source: "auto" | "manual") => {
    setSettingsOpen(false);
    setAIPlannerOpen(false);
    setAnalyticsOpen(false);
    setShortcutsOpen(false);
    neverDumpOpenedRef.current = true;
    setNeverDumpOpen(true);
    track("neverdump_opened", { source });
  }, []);

  useEffect(() => {
    if (
      neverDumpEligible &&
      settings.neverDumpAutoOpen &&
      timer.mode === "longBreak" &&
      timer.status === "running" &&
      !neverDumpOpenedRef.current
    ) {
      const timeout = window.setTimeout(() => openNeverDump("auto"), 0);
      return () => window.clearTimeout(timeout);
    }
  }, [
    neverDumpEligible,
    openNeverDump,
    settings.neverDumpAutoOpen,
    timer.mode,
    timer.status,
  ]);

  const { registerOnComplete } = timer;
  useEffect(() => {
    registerOnComplete(handleComplete);
  }, [handleComplete, registerOnComplete]);

  useEffect(() => {
    if (settings.showTimeInTitle && timer.status !== "idle") {
      document.title = `${formatTime(timer.timeRemaining)} - ${MODE_LABELS[timer.mode]}`;
    } else {
      document.title = "Pomodorian";
    }
  }, [timer.timeRemaining, timer.mode, timer.status, settings.showTimeInTitle]);

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (neverDumpOpen || aiPlannerOpen) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (timer.status === "idle") { timer.start(); track("timer_started", { mode: timer.mode }); }
          else if (timer.status === "running") { timer.pause(); sound.pauseAllAmbients(); }
          else if (timer.status === "paused") { timer.resume(); sound.resumeAllAmbients(); track("timer_started", { mode: timer.mode }); }
          break;
        case "1":
          setModeManually("pomodoro");
          break;
        case "2":
          setModeManually("shortBreak");
          break;
        case "3":
          setModeManually("longBreak");
          break;
        case "s":
        case "S":
          setSettingsOpen((v) => !v);
          break;
        case "r":
        case "R":
          setAnalyticsOpen((v) => !v);
          break;
        case "?":
          setShortcutsOpen((v) => !v);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timer, sound, neverDumpOpen, aiPlannerOpen, setModeManually]);

  return (
    <>
      <HomeSchemas />
      <Background mode={timer.mode} theme={settings.theme} />
      <Header
        pomodorosCompleted={timer.pomodorosCompleted}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAnalytics={() => setAnalyticsOpen(true)}
      />

      <main className="flex-1 flex flex-col items-center gap-8 px-4 pt-8 pb-16 max-w-lg mx-auto w-full">
        <ModeSelector mode={timer.mode} onChange={setModeManually} />

        <motion.div
          key={timer.mode}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Timer
            timeRemaining={timer.timeRemaining}
            progress={timer.progress}
            mode={timer.mode}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TimerControls
            status={timer.status}
            mode={timer.mode}
            onStart={() => { sound.playClick(); timer.start(); track("timer_started", { mode: timer.mode }); }}
            onPause={() => { timer.pause(); sound.pauseAllAmbients(); }}
            onResume={() => { sound.playClick(); timer.resume(); sound.resumeAllAmbients(); track("timer_started", { mode: timer.mode }); }}
            onSkip={() => {
              setNeverDumpOpen(false);
              setNeverDumpEligible(false);
              timer.skip();
            }}
            onReset={() => {
              setNeverDumpOpen(false);
              setNeverDumpEligible(false);
              timer.reset();
            }}
          />
        </motion.div>

        {timer.mode === "longBreak" && timer.status === "running" && !neverDumpOpen && (
          <button
            type="button"
            data-testid="run-neverdump"
            onClick={() => openNeverDump("manual")}
            className="-mt-4 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {neverDumpCopy.intro.run}
          </button>
        )}

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

        <motion.div
          className="w-full mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TaskList
            tasks={tasks.tasks}
            sessions={analytics.sessions}
            activeTaskId={tasks.activeTaskId}
            locale={settings.aiLanguage}
            onAdd={tasks.addTask}
            onToggle={tasks.toggleComplete}
            onDelete={tasks.deleteTask}
            onEdit={tasks.editTask}
            onSetActive={tasks.setActiveTask}
            onIncrementPomodoro={tasks.incrementPomodoro}
            onOpenAIPlanner={() => { track("ai_planner_opened"); setAIPlannerOpen(true); }}
          />
        </motion.div>
      </main>

      <InfoSection />
      <Footer />

      {!neverDumpOpen && <FeedbackPrompt />}

      <AnimatePresence>
        {neverDumpOpen && (
          <NeverDumpModal
            timeRemaining={timer.timeRemaining}
            totalTime={timer.totalTime}
            onClose={() => setNeverDumpOpen(false)}
            onPauseAmbients={sound.pauseAllAmbients}
            onResumeAmbients={sound.resumeAllAmbients}
          />
        )}

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
            onImportAndStart={handleImportAndStart}
            onClose={() => setAIPlannerOpen(false)}
          />
        )}

        {analyticsOpen && (
          <AnalyticsPanel
            sessions={analytics.sessions}
            streak={analytics.streak}
            totalHours={analytics.totalHours}
            locale={settings.aiLanguage}
            onClose={() => setAnalyticsOpen(false)}
          />
        )}

        {shortcutsOpen && (
          <ShortcutsModal onClose={() => setShortcutsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

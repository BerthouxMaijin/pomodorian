"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { track } from "@/lib/track";
import { notify } from "@/lib/notify";
import { useTimer, type TimerCapture } from "@/hooks/useTimer";
import { useSettings } from "@/hooks/useSettings";
import { useSound } from "@/hooks/useSound";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useFocusMode } from "@/hooks/useFocusMode";
import { Timer } from "@/components/timer/Timer";
import { ModeSelector } from "@/components/timer/ModeSelector";
import { TimerControls } from "@/components/timer/TimerControls";
import { UndoBanner } from "@/components/timer/UndoBanner";
import { MiniTimer } from "@/components/timer/MiniTimer";
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
import { NeverDumbModal } from "@/components/neverdumb/NeverDumbModal";
import { formatTime } from "@/lib/utils";
import { STORAGE_KEYS, type TimerMode, type AITaskSuggestion } from "@/lib/types";
import { useTasks } from "@/hooks/useTasks";
import { HomeSchemas } from "@/components/seo/HomeSchemas";
import { useAppCopy, useAppCopyReady } from "@/hooks/useAppCopy";
import { loadAppCopy } from "@/lib/i18n/app";
import { useUiLocale } from "@/hooks/useUiLocale";
import { HTML_LANG } from "@/lib/i18n/locales";
import { NEVER_DUMB_COPY } from "@/components/neverdumb/neverDumbCopy";

export default function Home() {
  const { settings, updateSettings, hydrated: settingsHydrated } = useSettings();
  const timer = useTimer(settings, { persistKey: STORAGE_KEYS.CURRENT_STATE });
  const tasks = useTasks();
  const sound = useSound();
  const analytics = useAnalytics();
  const locale = useUiLocale();
  const copy = useAppCopy();
  const neverDumbCopy = NEVER_DUMB_COPY[locale];
  // False while hydrating the English prerender, true once the visitor's copy
  // is loaded (at once for English, which ships with the page).
  const copyReady = useAppCopyReady();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiPlannerOpen, setAIPlannerOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [neverDumbOpen, setNeverDumbOpen] = useState(false);
  const [neverDumbEligible, setNeverDumbEligible] = useState(false);
  const neverDumbOpenedRef = useRef(false);
  const sessionReturnTrackedRef = useRef(false);
  // A pomodoro wiped by a stray key or click, offered back for a few seconds.
  const [undoOffer, setUndoOffer] = useState<{
    id: number;
    captured: TimerCapture;
    stoppedAt: number;
  } | null>(null);

  // A phone that locks its screen mid-pomodoro suspends the page: the alarm
  // would only ring once it is unlocked again.
  useWakeLock(timer.status === "running");

  // Focus mode: during a running pomodoro, everything but the timer fades back
  // after a few idle seconds. An attribute on <html>, no React state.
  useFocusMode(
    settings.focusMode && timer.mode === "pomodoro" && timer.status === "running",
    "[data-focus-anchor]"
  );

  // Hand-off from a timer tool page (/?focus=50): the person clicked "run full
  // Pomodoro cycles at 50 minutes", so that becomes their pomodoro length. The
  // functional update is queued after useLocalStorage's hydration read, so it
  // lands on top of the stored settings instead of being overwritten by them.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focus = Number(params.get("focus"));
    if (!Number.isInteger(focus) || focus < 1 || focus > 180) return;
    updateSettings({ pomodoroDuration: focus * 60 });
    track("focus_preset_applied", { minutes: focus });
    params.delete("focus");
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [updateSettings]);

  // <html lang> follows the app's language while it is mounted. The rest of
  // the site (blog, SEO and timer pages) declares its own language.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);
  useEffect(() => () => {
    document.documentElement.lang = "en";
  }, []);

  // No flash of English: the inline locale-init script in the root layout
  // hides the translatable text (data-i18n) of a non-English visit. It is
  // shown again once the visitor's copy is loaded and committed, or in English
  // if that copy cannot be fetched.
  useEffect(() => {
    const root = document.documentElement;
    if (copyReady) {
      root.removeAttribute("data-i18n-pending");
      return;
    }
    let cancelled = false;
    loadAppCopy(locale).catch(() => {
      if (!cancelled) root.removeAttribute("data-i18n-pending");
    });
    return () => {
      cancelled = true;
    };
  }, [copyReady, locale]);

  // Apply theme to HTML element. The inline script in the root layout already
  // set it before first paint: wait for the stored settings, or this effect
  // would force the dark default back for a frame. "system" follows the
  // device's color scheme, live.
  useEffect(() => {
    if (!settingsHydrated) return;
    const root = document.documentElement;
    if (settings.theme === "dark" || settings.theme === "light") {
      root.setAttribute("data-theme", settings.theme);
      return;
    }
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => root.setAttribute("data-theme", query.matches ? "light" : "dark");
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [settings.theme, settingsHydrated]);

  // Auto-advance to break/pomodoro on complete
  const handleComplete = useCallback(() => {
    setNeverDumbOpen(false);
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
    setNeverDumbEligible(eligibleLongBreak);
    neverDumbOpenedRef.current = false;

    timer.setMode(nextMode);

    if (
      (nextMode !== "pomodoro" && settings.autoStartBreaks) ||
      (nextMode === "pomodoro" && settings.autoStartPomodoros)
    ) {
      // Auto-started pomodoros need the same task link as a manual start —
      // the task just completed above may have been checked off in between.
      if (nextMode === "pomodoro") tasks.ensureActiveTask();
      setTimeout(() => timer.start(), 100);
    }

    if (settings.notificationsEnabled) {
      void notify(
        "Pomodorian",
        timer.mode === "pomodoro"
          ? copy.notifications.breakTime
          : copy.notifications.focusTime
      );
    }
  }, [timer, tasks, settings, sound, analytics, copy]);

  // Single entry point for starting the timer: a pomodoro always gets linked to
  // a task, so the session and its pomodoro count land somewhere.
  const { ensureActiveTask } = tasks;
  const {
    mode: timerMode,
    start: timerStart,
    pause: timerPause,
    resume: timerResume,
    reset: timerReset,
    setMode: timerSetMode,
    capture: timerCapture,
    revert: timerRevert,
    status: timerStatus,
  } = timer;
  const { playClick, pauseAllAmbients, resumeAllAmbients } = sound;
  const { notificationsEnabled } = settings;

  const startTimer = useCallback(() => {
    if (timerMode === "pomodoro") ensureActiveTask();
    playClick();
    timerStart();
    track("timer_started", { mode: timerMode });

    // Ask for notifications here, when the reason is obvious ("tell me when
    // this ends"), instead of on the first click anywhere on the page.
    if (
      notificationsEnabled &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      try {
        void Notification.requestPermission();
      } catch {
        // Older Safari only has the callback form: skipping the prompt is fine.
      }
    }
  }, [timerMode, timerStart, playClick, ensureActiveTask, notificationsEnabled]);

  const pauseTimer = useCallback(() => {
    timerPause();
    pauseAllAmbients();
  }, [timerPause, pauseAllAmbients]);

  const resumeTimer = useCallback(() => {
    playClick();
    timerResume();
    resumeAllAmbients();
    track("timer_started", { mode: timerMode });
  }, [playClick, timerResume, resumeAllAmbients, timerMode]);

  // Called just before a manual action ends the current block: a pomodoro with
  // at least a minute of focus behind it can be brought back with Undo.
  const offerUndo = useCallback(() => {
    const captured = timerCapture();
    if (captured.mode !== "pomodoro") return;
    if (captured.status !== "running" && captured.status !== "paused") return;
    const remaining =
      captured.status === "running" && captured.endTime
        ? Math.max(0, Math.round((captured.endTime - Date.now()) / 1000))
        : captured.timeRemaining;
    if (captured.totalTime - remaining < 60) return;
    setUndoOffer({ id: Date.now(), captured, stoppedAt: remaining });
  }, [timerCapture]);

  const undoInterrupt = useCallback(() => {
    if (!undoOffer) return;
    timerRevert(undoOffer.captured);
    setUndoOffer(null);
    track("timer_interrupt_undone", { status: undoOffer.captured.status });
  }, [undoOffer, timerRevert]);

  const dismissUndo = useCallback(() => setUndoOffer(null), []);

  // Starting a new timer (by hand, auto-start or the AI planner) closes the
  // offer. Every interruption leaves the timer idle, so any run is a new one.
  useEffect(() => {
    if (timerStatus === "running") setUndoOffer(null);
  }, [timerStatus]);

  const setModeManually = useCallback(
    (mode: TimerMode) => {
      offerUndo();
      setNeverDumbOpen(false);
      setNeverDumbEligible(false);
      neverDumbOpenedRef.current = false;
      timerSetMode(mode);
    },
    [timerSetMode, offerUndo]
  );

  // Skip moves on: out of a pomodoro into a short break, out of a break back
  // to focus. Nothing is recorded, since the block was not finished.
  const skipTimer = useCallback(() => {
    track("timer_skipped", { mode: timerMode });
    setModeManually(timerMode === "pomodoro" ? "shortBreak" : "pomodoro");
  }, [timerMode, setModeManually]);

  const resetTimer = useCallback(() => {
    offerUndo();
    setNeverDumbOpen(false);
    setNeverDumbEligible(false);
    timerReset();
  }, [timerReset, offerUndo]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const openAnalytics = useCallback(() => setAnalyticsOpen(true), []);
  const openAIPlanner = useCallback(() => {
    track("ai_planner_opened");
    setAIPlannerOpen(true);
  }, []);

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

  const activeTask =
    tasks.tasks.find((t) => t.id === tasks.activeTaskId) ?? null;

  // Tasks behind the latest focus blocks, so the Never Dumb debrief can start
  // from what was actually worked on.
  const recentFocusTasks = useMemo(() => {
    const titles: string[] = [];
    let newest: number | null = null;
    for (let i = analytics.sessions.length - 1; i >= 0 && titles.length < 4; i -= 1) {
      const s = analytics.sessions[i];
      if (s.mode !== "pomodoro" || !s.completed || !s.taskTitle) continue;
      const ended = new Date(s.endedAt).getTime();
      newest ??= ended;
      if (newest - ended > 6 * 60 * 60 * 1000) break;
      if (!titles.includes(s.taskTitle)) titles.push(s.taskTitle);
    }
    return titles;
  }, [analytics.sessions]);

  const openNeverDumb = useCallback((source: "auto" | "manual") => {
    setSettingsOpen(false);
    setAIPlannerOpen(false);
    setAnalyticsOpen(false);
    setShortcutsOpen(false);
    neverDumbOpenedRef.current = true;
    setNeverDumbOpen(true);
    track("neverdumb_opened", { source });
  }, []);

  useEffect(() => {
    if (
      neverDumbEligible &&
      settings.neverDumbAutoOpen &&
      timer.mode === "longBreak" &&
      timer.status === "running" &&
      !neverDumbOpenedRef.current
    ) {
      const timeout = window.setTimeout(() => openNeverDumb("auto"), 0);
      return () => window.clearTimeout(timeout);
    }
  }, [
    neverDumbEligible,
    openNeverDumb,
    settings.neverDumbAutoOpen,
    timer.mode,
    timer.status,
  ]);

  const { registerOnComplete } = timer;
  useEffect(() => {
    registerOnComplete(handleComplete);
  }, [handleComplete, registerOnComplete]);

  // Retention signal: fires once per page load, only once sessions are read from
  // localStorage (before hydration the list is always empty and the data is wrong)
  useEffect(() => {
    if (!analytics.hydrated || sessionReturnTrackedRef.current) return;
    sessionReturnTrackedRef.current = true;

    const totalSessions = analytics.sessions.length;
    const daysSinceFirst =
      totalSessions === 0
        ? 0
        : Math.max(
            0,
            Math.floor(
              (Date.now() -
                new Date(
                  analytics.sessions.reduce(
                    (min, s) => (s.date < min ? s.date : min),
                    analytics.sessions[0].date
                  )
                ).getTime()) /
                86400000
            )
          );
    const streak = analytics.streak;
    const streakBucket =
      streak === 0 ? "0" : streak <= 2 ? "1-2" : streak <= 6 ? "3-6" : "7+";

    track("session_return", { daysSinceFirst, streakBucket, totalSessions });
  }, [analytics.hydrated, analytics.sessions, analytics.streak]);

  useEffect(() => {
    if (settings.showTimeInTitle && timer.status !== "idle") {
      document.title = copy.documentTitle(
        formatTime(timer.timeRemaining),
        copy.modes[timer.mode]
      );
    } else {
      document.title = "Pomodorian";
    }
  }, [timer.timeRemaining, timer.mode, timer.status, settings.showTimeInTitle, copy]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (neverDumbOpen || aiPlannerOpen) return;
      // Cmd+R, Ctrl+S, Ctrl+1 and friends belong to the browser: without this
      // a page reload also toggled the report, and a tab switch reset the timer.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (timer.status === "idle") startTimer();
          else if (timer.status === "running") pauseTimer();
          else if (timer.status === "paused") resumeTimer();
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
        case "z":
        case "Z":
          if (undoOffer) {
            e.preventDefault();
            undoInterrupt();
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    timer.status,
    neverDumbOpen,
    aiPlannerOpen,
    setModeManually,
    startTimer,
    pauseTimer,
    resumeTimer,
    undoOffer,
    undoInterrupt,
  ]);

  return (
    <MotionConfig reducedMotion="user">
      <HomeSchemas />
      <Background mode={timer.mode} />
      <Header
        pomodorosCompleted={analytics.todayPomodoros}
        dailyGoal={
          analytics.hydrated && settingsHydrated
            ? Math.min(24, Math.max(1, Math.round(settings.dailyGoal) || 8))
            : null
        }
        onOpenSettings={openSettings}
        onOpenAnalytics={openAnalytics}
      />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 px-4 pt-4 sm:pt-8 pb-16 max-w-lg mx-auto w-full">
        <ModeSelector mode={timer.mode} onChange={setModeManually} />

        <motion.div
          key={timer.mode}
          data-focus-anchor
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Timer
            timeRemaining={timer.timeRemaining}
            progress={timer.progress}
            mode={timer.mode}
            remainingLabel={copy.timer.remaining}
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
            onStart={startTimer}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onSkip={skipTimer}
            onReset={resetTimer}
          />
        </motion.div>

        {timer.mode === "longBreak" && timer.status === "running" && !neverDumbOpen && (
          <button
            type="button"
            data-testid="run-neverdumb"
            onClick={() => openNeverDumb("manual")}
            className="-mt-4 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {neverDumbCopy.home.run}
          </button>
        )}

        {timer.mode === "pomodoro" && (
          <div className="flex items-center gap-1.5 max-w-full px-4 text-sm text-muted">
            <span className="tabular-nums flex-shrink-0">
              #{timer.pomodorosCompleted + 1}
            </span>
            <span aria-hidden="true" className="flex-shrink-0">
              &middot;
            </span>
            {activeTask ? (
              <span
                className="truncate font-medium text-foreground"
                title={activeTask.title}
              >
                {activeTask.title}
              </span>
            ) : (
              <span data-i18n>{copy.timer.timeToFocus}</span>
            )}
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
          <div data-focus-fade>
          <TaskList
            tasks={tasks.tasks}
            sessions={analytics.sessions}
            activeTaskId={tasks.activeTaskId}
            onAdd={tasks.addTask}
            onToggle={tasks.toggleComplete}
            onDelete={tasks.deleteTask}
            onEdit={tasks.editTask}
            onSetActive={tasks.setActiveTask}
            onIncrementPomodoro={tasks.incrementPomodoro}
            onReorder={tasks.reorderTasks}
            onOpenAIPlanner={openAIPlanner}
          />
          </div>
        </motion.div>
      </main>

      <MiniTimer
        timeRemaining={timer.timeRemaining}
        progress={timer.progress}
        mode={timer.mode}
        status={timer.status}
        taskTitle={timer.mode === "pomodoro" ? activeTask?.title ?? null : null}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
      />

      <InfoSection />
      <Footer />

      {!neverDumbOpen && <FeedbackPrompt />}

      <AnimatePresence>
        {undoOffer && (
          <UndoBanner
            key={undoOffer.id}
            stoppedAt={undoOffer.stoppedAt}
            onUndo={undoInterrupt}
            onDismiss={dismissUndo}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {neverDumbOpen && (
          <NeverDumbModal
            timeRemaining={timer.timeRemaining}
            totalTime={timer.totalTime}
            recentTasks={recentFocusTasks}
            onAddTask={tasks.addTask}
            onClose={() => setNeverDumbOpen(false)}
            onPauseAmbients={sound.pauseAllAmbients}
            onResumeAmbients={sound.resumeAllAmbients}
          />
        )}

        {settingsOpen && (
          <SettingsModal
            settings={settings}
            onUpdate={updateSettings}
            onPreviewAlarm={sound.previewAlarm}
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
            onClose={() => setAnalyticsOpen(false)}
          />
        )}

        {shortcutsOpen && (
          <ShortcutsModal onClose={() => setShortcutsOpen(false)} />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

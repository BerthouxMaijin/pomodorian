"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { track } from "@vercel/analytics";
import type { AppSettings, AITaskSuggestion, AIPlannerResponse } from "@/lib/types";
import { generateId } from "@/lib/utils";
import {
  estimatePlanDuration,
  formatApproxDuration,
  type EditableTask,
} from "@/lib/plan";
import { PLANNER_COPY, resolvePlannerLocale } from "./plannerCopy";
import { PlanTaskRow } from "./PlanTaskRow";

interface AIPlannerModalProps {
  settings: AppSettings;
  onImportTasks: (tasks: AITaskSuggestion[]) => void;
  onImportAndStart: (tasks: AITaskSuggestion[]) => void;
  onClose: () => void;
}

export function AIPlannerModal({
  settings,
  onImportTasks,
  onImportAndStart,
  onClose,
}: AIPlannerModalProps) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIPlannerResponse | null>(null);
  const [plan, setPlan] = useState<EditableTask[]>([]);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);
  const importedRef = useRef(false);

  const copy = PLANNER_COPY[resolvePlannerLocale(settings.aiLanguage)];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const validTasks = useMemo(
    () => plan.filter((t) => t.title.trim().length > 0),
    [plan]
  );
  const estimate = useMemo(
    () => estimatePlanDuration(validTasks, settings),
    [validTasks, settings]
  );

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal.trim(),
          pomodoroDuration: settings.pomodoroDuration / 60,
          language: settings.aiLanguage,
        }),
      });

      if (!res.ok) {
        setError(res.status === 429 ? copy.errorRateLimited : copy.errorGeneric);
        return;
      }

      const data: AIPlannerResponse = await res.json();
      track("ai_planner_generated", { taskCount: data.tasks.length });
      setResult(data);
      setPlan(
        data.tasks.map((t) => ({
          key: generateId(),
          title: t.title,
          estimatedPomodoros: t.estimatedPomodoros,
          rationale: t.rationale || null,
        }))
      );
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const renameTask = (key: string, title: string) => {
    setPlan((prev) => prev.map((t) => (t.key === key ? { ...t, title } : t)));
  };

  const stepEstimate = (key: string, delta: number) => {
    setPlan((prev) =>
      prev.map((t) =>
        t.key === key
          ? {
              ...t,
              estimatedPomodoros: Math.min(
                8,
                Math.max(1, t.estimatedPomodoros + delta)
              ),
            }
          : t
      )
    );
  };

  const removeTask = (key: string) => {
    setPlan((prev) => prev.filter((t) => t.key !== key));
  };

  const addTask = () => {
    const key = generateId();
    setPlan((prev) => [
      ...prev,
      { key, title: "", estimatedPomodoros: 1, rationale: null },
    ]);
    setLastAddedKey(key);
  };

  const moveTask = (key: string, dir: -1 | 1) => {
    setPlan((prev) => {
      const index = prev.findIndex((t) => t.key === key);
      if (index === -1) return prev;
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const startOver = () => {
    setResult(null);
    setPlan([]);
    setError(null);
    importedRef.current = false;
    // `goal` is deliberately kept so the user can refine the same intent.
  };

  const handleImport = (start: boolean) => {
    if (importedRef.current || validTasks.length === 0) return;
    importedRef.current = true;
    const suggestions = validTasks.map((t) => ({
      title: t.title.trim(),
      estimatedPomodoros: t.estimatedPomodoros,
      rationale: t.rationale ?? "",
    }));
    track("ai_tasks_imported", { count: suggestions.length, started: start });
    (start ? onImportAndStart : onImportTasks)(suggestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative glass rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                <circle cx="12" cy="15" r="2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeAriaLabel}
            className="text-muted hover:text-foreground transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {!result ? (
          <div className="space-y-4">
            <label
              htmlFor="ai-planner-goal"
              className="block text-base font-medium text-foreground"
            >
              {copy.question}
            </label>
            <textarea
              id="ai-planner-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={copy.placeholder}
              rows={4}
              className="w-full bg-surface rounded-xl p-3 text-base md:text-sm text-foreground placeholder:text-muted outline-none border border-border focus:ring-1 focus:ring-purple-500/50 resize-none"
              autoFocus
              disabled={loading}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !goal.trim()}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {copy.generatingCta}
                </>
              ) : (
                copy.generateCta
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Session goal */}
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted mb-1">{copy.sessionGoalLabel}</p>
              <p className="text-sm text-foreground">{result.sessionGoal}</p>
            </div>

            {/* Tips */}
            {result.tips && (
              <div className="glass rounded-xl p-3 border-purple-500/20">
                <p className="text-xs text-accent-text">{result.tips}</p>
              </div>
            )}

            {/* Tasks */}
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {copy.tasksHeading}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {estimate.pomodoros === 0
                    ? copy.emptyPlanHint
                    : copy.totalSummary(
                        estimate.pomodoros,
                        formatApproxDuration(estimate.totalMinutes)
                      )}
                </p>
              </div>

              {plan.map((task, i) => (
                <PlanTaskRow
                  key={task.key}
                  task={task}
                  isFirst={i === 0}
                  isLast={i === plan.length - 1}
                  autoFocus={task.key === lastAddedKey}
                  copy={copy}
                  onRename={(title) => renameTask(task.key, title)}
                  onStep={(delta) => stepEstimate(task.key, delta)}
                  onDelete={() => removeTask(task.key)}
                  onMove={(dir) => moveTask(task.key, dir)}
                />
              ))}

              <button
                type="button"
                onClick={addTask}
                className="w-full py-2.5 rounded-xl glass text-sm text-muted hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {copy.addTaskCta}
              </button>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={startOver}
                className="order-3 sm:order-none py-3 px-4 rounded-xl glass text-sm text-muted hover:text-foreground transition-colors sm:flex-shrink-0"
              >
                {copy.startOverCta}
              </button>
              <button
                type="button"
                onClick={() => handleImport(false)}
                disabled={validTasks.length === 0}
                className="order-2 sm:order-none sm:flex-1 py-3 rounded-xl glass text-sm text-foreground hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copy.addOnlyCta(validTasks.length)}
              </button>
              <button
                type="button"
                onClick={() => handleImport(true)}
                disabled={validTasks.length === 0}
                className="order-1 sm:order-none sm:flex-1 py-3 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copy.addAndStartCta}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

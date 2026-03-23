"use client";

import { useState, useEffect } from "react";
import type { AppSettings, AITaskSuggestion, AIPlannerResponse } from "@/lib/types";

interface AIPlannerModalProps {
  settings: AppSettings;
  onImportTasks: (tasks: AITaskSuggestion[]) => void;
  onClose: () => void;
}

export function AIPlannerModal({
  settings,
  onImportTasks,
  onClose,
}: AIPlannerModalProps) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIPlannerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

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
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Error ${res.status}`);
      }

      const data: AIPlannerResponse = await res.json();
      setResult(data);
      setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!result) return;
    const tasksToImport = result.tasks.filter((_, i) => selectedTasks.has(i));
    onImportTasks(tasksToImport);
    onClose();
  };

  const toggleTask = (index: number) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
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
              AI Session Planner
            </h2>
          </div>
          <button
            onClick={onClose}
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
          <>
            <p className="text-sm text-muted">
              Describe what you want to accomplish and AI will break it down into
              Pomodoro-sized tasks.
            </p>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Write the introduction for my thesis, review 3 PRs, and prepare slides for tomorrow's meeting"
              rows={4}
              className="w-full bg-surface rounded-xl p-3 text-sm text-foreground placeholder:text-muted outline-none border border-border focus:ring-1 focus:ring-purple-500/50 resize-none"
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading || !goal.trim()}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating plan...
                </>
              ) : (
                "Generate Plan"
              )}
            </button>
          </>
        ) : (
          <>
            {/* Session goal */}
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted mb-1">Session goal</p>
              <p className="text-sm text-foreground">{result.sessionGoal}</p>
            </div>

            {/* Tips */}
            {result.tips && (
              <div className="glass rounded-xl p-3 border-purple-500/20">
                <p className="text-xs text-purple-300">{result.tips}</p>
              </div>
            )}

            {/* Tasks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">
                  Tasks ({result.totalEstimatedPomodoros} pomodoros)
                </h3>
                <button
                  onClick={() => {
                    if (selectedTasks.size === result.tasks.length) {
                      setSelectedTasks(new Set());
                    } else {
                      setSelectedTasks(new Set(result.tasks.map((_, i) => i)));
                    }
                  }}
                  className="text-xs text-muted hover:text-foreground transition-colors"
                >
                  {selectedTasks.size === result.tasks.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>

              {result.tasks.map((task, i) => (
                <div
                  key={i}
                  onClick={() => toggleTask(i)}
                  className={`glass rounded-xl p-3 cursor-pointer transition-all ${
                    selectedTasks.has(i)
                      ? "ring-1 ring-purple-500/40"
                      : "opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        selectedTasks.has(i)
                          ? "border-purple-500 bg-purple-500"
                          : "border-muted"
                      }`}
                    >
                      {selectedTasks.has(i) && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{task.title}</p>
                      <p className="text-xs text-muted mt-1">
                        {task.estimatedPomodoros} pomodoro
                        {task.estimatedPomodoros > 1 ? "s" : ""} &middot;{" "}
                        {task.rationale}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setGoal("");
                }}
                className="flex-1 py-3 rounded-xl glass text-sm text-muted hover:text-foreground transition-colors"
              >
                Start over
              </button>
              <button
                onClick={handleImport}
                disabled={selectedTasks.size === 0}
                className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-500 transition-colors disabled:opacity-40"
              >
                Add {selectedTasks.size} task
                {selectedTasks.size !== 1 ? "s" : ""}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

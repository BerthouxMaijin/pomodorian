"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@/lib/track";
import { BTN_BASE, BTN_GHOST, FIELD, MODE_STYLES, PANEL, type ExerciseProps } from "../catalog";
import { NdIcon } from "../NdIcon";

interface DebriefExerciseProps extends ExerciseProps {
  recentTasks: string[];
  onAddTask: (title: string) => void;
}

const style = MODE_STYLES.serious;

export function DebriefExercise({ copy, recentTasks, onAddTask, onComplete }: DebriefExerciseProps) {
  const steps = copy.debrief.steps;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => steps.map(() => ""));
  const [taskAdded, setTaskAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const done = step >= steps.length;
  const current = answers[step] ?? "";

  const setAnswer = (value: string) =>
    setAnswers((prev) => prev.map((answer, index) => (index === step ? value : answer)));

  const next = () => {
    if (!current.trim()) return;
    setStep((s) => s + 1);
  };

  const summary = steps.map((s, index) => `${s.question}\n${answers[index].trim()}`).join("\n\n");

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (permissions, insecure context): nothing to do.
    }
  };

  const addNextStep = () => {
    const title = answers[steps.length - 1].trim().slice(0, 200);
    if (!title || taskAdded) return;
    onAddTask(title);
    setTaskAdded(true);
    track("neverdumb_debrief_task_added");
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${PANEL} p-6 sm:p-8`}>
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${style.text}`}>{copy.debrief.summaryTitle}</p>
        <ol className="mt-5 space-y-5">
          {steps.map((s, index) => (
            <li key={s.question} className="flex gap-4">
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${style.soft} ${style.text}`}>
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-muted">{s.question}</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-base text-foreground">{answers[index].trim()}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            data-testid="neverdumb-debrief-add-task"
            onClick={addNextStep}
            disabled={taskAdded}
            className={`${BTN_BASE} ${style.solid} ${style.ring}`}
          >
            <NdIcon name={taskAdded ? "check" : "plus"} size={16} />
            {taskAdded ? copy.debrief.taskAdded : copy.debrief.addTask}
          </button>
          <button type="button" onClick={copySummary} className={BTN_GHOST}>
            <NdIcon name={copied ? "check" : "copy"} size={16} />
            {copied ? copy.shared.copied : copy.shared.copy}
          </button>
          <button type="button" data-testid="neverdumb-debrief-done" onClick={() => onComplete()} className={`${BTN_GHOST} sm:ml-auto`}>
            {copy.shared.done}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`${PANEL} p-6 sm:p-8`}>
      <div className="flex items-center gap-2" aria-hidden="true">
        {steps.map((s, index) => (
          <span
            key={s.question}
            className={`h-1.5 flex-1 rounded-full transition-colors ${index <= step ? style.fill : "bg-border"}`}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <label className="mt-6 block">
            <span className="text-xs font-medium text-muted">
              {step + 1} / {steps.length}
            </span>
            <span className="mt-1 block text-xl sm:text-2xl font-semibold text-foreground">{steps[step].question}</span>
            <textarea
              autoFocus
              value={current}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) next();
              }}
              rows={4}
              maxLength={600}
              placeholder={steps[step].placeholder}
              className={`${FIELD} mt-4`}
            />
          </label>
          {step === 0 && recentTasks.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted">{copy.debrief.recentLabel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recentTasks.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setAnswer(current.trim() ? `${current.trim()} ${title}` : title)}
                    className="max-w-full truncate rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm text-foreground hover:bg-surface-hover"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`${BTN_GHOST} ${step === 0 ? "invisible" : ""}`}
        >
          <NdIcon name="back" size={16} />
        </button>
        <button
          type="button"
          data-testid="neverdumb-debrief-next"
          onClick={next}
          disabled={!current.trim()}
          className={`${BTN_BASE} ${style.solid} ${style.ring}`}
        >
          {copy.shared.next}
          <NdIcon name="arrow" size={16} />
        </button>
      </div>
    </div>
  );
}

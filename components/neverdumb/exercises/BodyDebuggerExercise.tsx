"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { BTN_BASE, BTN_GHOST, MODE_STYLES, seededShuffle, type ExerciseProps } from "../catalog";

const style = MODE_STYLES.fun;
const STEP_MS = 2200;
const COMMAND_COUNT = 5;

export function BodyDebuggerExercise({ copy, seed, onComplete }: ExerciseProps) {
  const t = copy.bodyDebugger;
  const reduceMotion = useReducedMotion();
  const [sequence] = useState(() => {
    const commands = seededShuffle(t.commands, seed).slice(0, COMMAND_COUNT);
    const trap = seededShuffle(t.traps, seed + 1)[0];
    const at = 1 + (seed % COMMAND_COUNT);
    return [...commands.slice(0, at), trap, ...commands.slice(at)];
  });
  const trapIndex = sequence.findIndex((command) => t.traps.includes(command));
  const [stage, setStage] = useState<"ready" | "active" | "question">("ready");
  const [endTime, setEndTime] = useState<number | null>(null);
  const toQuestion = useCallback(() => {
    setEndTime(null);
    setStage("question");
  }, []);
  const { remainingMs } = useCountdown(endTime, toQuestion);

  const total = sequence.length * STEP_MS;
  const elapsed = endTime === null ? 0 : total - remainingMs;
  const index = Math.min(sequence.length - 1, Math.floor(elapsed / STEP_MS));
  const stepProgress = (elapsed % STEP_MS) / STEP_MS;
  const command = sequence[index];
  const isTrap = index === trapIndex;

  if (stage === "question") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="text-2xl font-semibold text-foreground">{t.trapQuestion}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" data-testid="neverdumb-debugger-yes" onClick={() => onComplete(t.hacked)} className={BTN_GHOST}>
            {t.yes}
          </button>
          <button
            type="button"
            data-testid="neverdumb-debugger-no"
            onClick={() => onComplete(t.firewall)}
            className={`${BTN_BASE} ${style.solid} ${style.ring}`}
          >
            {t.no}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div
        className={`relative flex min-h-56 sm:min-h-64 items-center justify-center overflow-hidden rounded-3xl border p-8 transition-colors ${
          stage === "active" && isTrap ? "border-red-500/50 bg-red-500/10" : `${style.border} ${style.soft}`
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={stage === "active" ? index : "ready"}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.18 }}
            className={`text-3xl sm:text-5xl font-black tracking-tight ${stage === "active" && isTrap ? "text-red-500" : style.text}`}
          >
            {stage === "active" ? command : t.ready}
          </motion.p>
        </AnimatePresence>
        {stage === "active" && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-border">
            <div className={`h-full ${isTrap ? "bg-red-500" : style.fill}`} style={{ width: `${(1 - stepProgress) * 100}%` }} />
          </div>
        )}
      </div>
      {stage === "active" && (
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
          {sequence.map((_, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${i <= index ? style.fill : "bg-border"}`} />
          ))}
        </div>
      )}
      {stage === "ready" && (
        <button
          type="button"
          data-testid="neverdumb-debugger-start"
          onClick={() => {
            setEndTime(Date.now() + total);
            setStage("active");
          }}
          className={`${BTN_BASE} ${style.solid} ${style.ring} mt-6`}
        >
          {copy.shared.start}
        </button>
      )}
    </div>
  );
}

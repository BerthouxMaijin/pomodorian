"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BTN_BASE, BTN_GHOST, MODE_STYLES, modeOf } from "./catalog";
import type { ExerciseId, NeverDumbCopy } from "./copy/types";
import { NdIcon } from "./NdIcon";

interface ExerciseResultProps {
  id: ExerciseId;
  copy: NeverDumbCopy;
  feedback?: string;
  streak: number;
  total: number;
  onClose: () => void;
  onAnother: () => void;
  onSurprise: () => void;
}

export function ExerciseResult({ id, copy, feedback, streak, total, onClose, onAnother, onSurprise }: ExerciseResultProps) {
  const reduceMotion = useReducedMotion();
  const mode = modeOf(id);
  const style = MODE_STYLES[mode];

  return (
    <div className="mx-auto max-w-2xl py-12 sm:py-20 text-center">
      <motion.div
        initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${style.fill} text-nd-on-accent shadow-lg`}
      >
        <NdIcon name="check" size={36} />
      </motion.div>
      <p className={`mt-8 text-xs font-semibold uppercase tracking-[0.2em] ${style.text}`}>{copy.result.eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{copy.exercises[id].result}</h2>
      {feedback && (
        <p className={`mx-auto mt-6 max-w-lg rounded-2xl border px-5 py-3 text-base text-foreground ${style.border} ${style.soft}`}>
          {feedback}
        </p>
      )}
      <p className="mt-6 text-sm text-muted">{copy.result.body}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <span>
          <span className="font-mono text-lg font-semibold tabular-nums text-foreground">{total}</span> {copy.home.statTotal}
        </span>
        <span className="flex items-center gap-1">
          <NdIcon name="flame" size={16} className="text-nd-fun" />
          <span className="font-mono text-lg font-semibold tabular-nums text-foreground">{streak}</span> {copy.home.statStreak}
        </span>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          data-testid="neverdumb-close-complete"
          onClick={onClose}
          className={`${BTN_BASE} bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground/40`}
        >
          {copy.result.backToBreak}
        </button>
        <button type="button" data-testid="neverdumb-another" onClick={mode === "fun" ? onSurprise : onAnother} className={BTN_GHOST}>
          <NdIcon name={mode === "fun" ? "shuffle" : "arrow"} size={16} />
          {mode === "fun" ? copy.result.nextSurprise : copy.result.another}
        </button>
      </div>
    </div>
  );
}

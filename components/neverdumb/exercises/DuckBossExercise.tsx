"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BTN_BASE, MODE_STYLES, seededShuffle, type ExerciseProps } from "../catalog";

const style = MODE_STYLES.fun;
const ROUNDS = 3;

export function DuckBossExercise({ copy, seed, onComplete }: ExerciseProps) {
  const t = copy.duckBoss;
  const reduceMotion = useReducedMotion();
  const [questions] = useState(() => seededShuffle(t.questions, seed).slice(0, ROUNDS));
  const [hits, setHits] = useState(0);
  const defeated = hits >= ROUNDS;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto max-w-xs">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          <span>Boss</span>
          <span className="tabular-nums">
            {t.hp} {ROUNDS - hits}/{ROUNDS}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <span
              key={i}
              className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${i < ROUNDS - hits ? "bg-red-500" : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      <motion.div
        key={hits}
        animate={reduceMotion || hits === 0 ? undefined : { x: [0, -14, 12, -8, 6, 0], rotate: [0, -6, 5, -3, 0] }}
        transition={{ duration: 0.45 }}
        className="mt-8 text-7xl sm:text-8xl select-none"
        aria-hidden="true"
      >
        {defeated ? "😵" : "🦆"}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={defeated ? "won" : hits}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mt-8 rounded-3xl border p-6 sm:p-8 ${style.border} ${style.soft}`}
        >
          <p className={`text-2xl sm:text-3xl font-black tracking-tight ${style.text}`}>
            {defeated ? t.defeated : questions[hits]}
          </p>
        </motion.div>
      </AnimatePresence>

      {defeated ? (
        <button
          type="button"
          data-testid="neverdumb-fun-done"
          onClick={() => onComplete()}
          className={`${BTN_BASE} ${style.solid} ${style.ring} mt-6`}
        >
          {copy.shared.done}
        </button>
      ) : (
        <button
          type="button"
          data-testid="neverdumb-duck-hit"
          onClick={() => setHits((h) => h + 1)}
          className={`${BTN_BASE} ${style.solid} ${style.ring} mt-6`}
        >
          {t.hit}
        </button>
      )}
    </div>
  );
}

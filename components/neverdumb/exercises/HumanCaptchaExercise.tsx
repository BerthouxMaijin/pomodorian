"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BTN_GHOST, MODE_STYLES, PANEL, seededShuffle, type ExerciseProps } from "../catalog";
import { NdIcon } from "../NdIcon";

const style = MODE_STYLES.fun;

export function HumanCaptchaExercise({ copy, seed, onComplete }: ExerciseProps) {
  const t = copy.humanCaptcha;
  const [missions] = useState(() => seededShuffle(t.missions, seed));
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<"idle" | "verifying" | "verified">("idle");

  useEffect(() => {
    if (state === "verifying") {
      const id = window.setTimeout(() => setState("verified"), 900);
      return () => window.clearTimeout(id);
    }
    if (state === "verified") {
      const id = window.setTimeout(() => onComplete(), 1100);
      return () => window.clearTimeout(id);
    }
  }, [state, onComplete]);

  return (
    <div className="mx-auto max-w-xl">
      <div className={`${PANEL} overflow-hidden`}>
        <div className={`${style.fill} px-6 py-5 text-nd-on-accent`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{copy.exercises.humanCaptcha.kicker}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2 text-xl sm:text-2xl font-semibold leading-snug"
            >
              {missions[index % missions.length]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4 px-6 py-5">
          <button
            type="button"
            role="checkbox"
            aria-checked={state === "verified"}
            data-testid="neverdumb-captcha-check"
            disabled={state !== "idle"}
            onClick={() => setState("verifying")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-background transition-colors hover:border-foreground/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-nd-fun"
          >
            {state === "verifying" && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-nd-fun border-t-transparent" />
            )}
            {state === "verified" && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-nd-reset">
                <NdIcon name="check" size={24} />
              </motion.span>
            )}
          </button>
          <span className="flex-1 text-base text-foreground">
            {state === "idle" ? t.checkbox : state === "verifying" ? t.verifying : t.verified}
          </span>
          <NdIcon name="humanCaptcha" size={28} className="text-muted" />
        </div>
      </div>
      {state === "idle" && (
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={() => setIndex((i) => i + 1)} className={BTN_GHOST}>
            <NdIcon name="refresh" size={16} />
            {t.reroll}
          </button>
        </div>
      )}
    </div>
  );
}

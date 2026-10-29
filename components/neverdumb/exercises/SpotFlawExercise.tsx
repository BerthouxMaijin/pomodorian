"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BTN_BASE, MODE_STYLES, PANEL, type ExerciseProps } from "../catalog";
import { NdIcon } from "../NdIcon";

const style = MODE_STYLES.serious;

export function SpotFlawExercise({ copy, variant, onComplete }: ExerciseProps) {
  const t = copy.spotFlaw;
  const puzzle = t.puzzles[variant % t.puzzles.length];
  const [picked, setPicked] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const right = picked === puzzle.flaw;
  const calibration =
    confidence === null
      ? ""
      : right
        ? confidence >= 1
          ? t.calibration.rightSure
          : t.calibration.rightUnsure
        : confidence >= 1
          ? t.calibration.wrongSure
          : t.calibration.wrongUnsure;

  return (
    <div className="space-y-5">
      {puzzle.code && (
        <pre className="overflow-x-auto rounded-2xl border border-border bg-foreground/[0.04] p-4 font-mono text-sm text-foreground">
          <code>{puzzle.code}</code>
        </pre>
      )}

      <div>
        <p className="mb-3 text-sm text-muted">{t.pick}</p>
        <ol className="space-y-2.5">
          {puzzle.sentences.map((sentence, index) => {
            const isPicked = picked === index;
            const isFlaw = index === puzzle.flaw;
            let state = "border-border bg-surface hover:bg-surface-hover";
            if (!revealed && isPicked) state = `${style.border} ${style.soft} ring-1 ring-nd-serious/40`;
            if (revealed && isFlaw) state = "border-nd-reset/50 bg-nd-reset/10";
            if (revealed && isPicked && !isFlaw) state = "border-red-500/50 bg-red-500/10";
            return (
              <li key={sentence}>
                <button
                  type="button"
                  data-testid={`neverdumb-flaw-${index}`}
                  disabled={revealed}
                  onClick={() => setPicked(index)}
                  aria-pressed={isPicked}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-base leading-relaxed text-foreground transition-colors disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-nd-serious ${state}`}
                >
                  <span className="mt-0.5 w-5 shrink-0 font-mono text-xs text-muted">{index + 1}</span>
                  <span className="flex-1">{sentence}</span>
                  {revealed && isFlaw && <NdIcon name="spotFlaw" size={18} className="mt-0.5 shrink-0 text-nd-reset" />}
                  {revealed && isPicked && !isFlaw && <NdIcon name="close" size={18} className="mt-0.5 shrink-0 text-red-500" />}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {!revealed ? (
        <div className={`${PANEL} p-5`}>
          <p className="text-sm text-muted">{t.confidenceLabel}</p>
          <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label={t.confidenceLabel}>
            {t.confidence.map((label, index) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={confidence === index}
                onClick={() => setConfidence(index)}
                className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nd-serious ${
                  confidence === index ? `${style.border} ${style.soft} ${style.text}` : "border-border text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-testid="neverdumb-reveal"
            disabled={picked === null || confidence === null}
            onClick={() => setRevealed(true)}
            className={`${BTN_BASE} ${style.solid} ${style.ring} mt-4 w-full`}
          >
            {copy.shared.validate}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${PANEL} p-5 sm:p-6`}>
          <p className={`text-lg font-semibold ${right ? "text-nd-reset" : "text-red-500"}`}>{right ? t.correct : t.wrong}</p>
          <p className="mt-2 text-base leading-relaxed text-foreground">{puzzle.explanation}</p>
          <p className="mt-3 text-sm text-muted">{calibration}</p>
          <button
            type="button"
            data-testid="neverdumb-flaw-done"
            onClick={() => onComplete(calibration)}
            className={`${BTN_BASE} ${style.solid} ${style.ring} mt-5 w-full`}
          >
            {copy.shared.done}
          </button>
        </motion.div>
      )}
    </div>
  );
}

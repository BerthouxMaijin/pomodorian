"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BTN_BASE, FIELD, MODE_STYLES, PANEL, type ExerciseProps } from "../catalog";

const style = MODE_STYLES.serious;

/** Parses what a person types in their own number format ("604 800", "7,6"). */
function makeParser(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  return (raw: string): number | null => {
    let text = raw.trim().replace(/[\s  ']/g, "");
    if (!text) return null;
    if (group !== decimal) text = text.split(group).join("");
    text = text.replace(decimal, ".");
    const value = Number(text);
    return Number.isFinite(value) ? value : null;
  };
}

export function EstimateExercise({ copy, locale, variant, onComplete }: ExerciseProps) {
  const t = copy.estimate;
  const item = t.questions[variant % t.questions.length];
  const parse = useMemo(() => makeParser(locale), [locale]);
  const format = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }), [locale]);
  const [lowText, setLowText] = useState("");
  const [highText, setHighText] = useState("");
  const [revealed, setRevealed] = useState(false);

  const a = parse(lowText);
  const b = parse(highText);
  const valid = a !== null && b !== null;
  const low = valid ? Math.min(a, b) : 0;
  const high = valid ? Math.max(a, b) : 0;
  const inside = valid && item.answer >= low && item.answer <= high;
  const feedback = inside ? t.inRange : `${t.outOfRange} ${t.calibrationNote}`;

  // Number line framing the range and the answer, with some breathing room.
  // Far-off guesses switch to a log scale so the range never collapses to a dot.
  const min = Math.min(low, item.answer);
  const max = Math.max(high, item.answer);
  const useLog = min > 0 && max / min > 20;
  const scale = (value: number) => (useLog ? Math.log10(value) : value);
  const lo = scale(min);
  const hi = scale(max);
  const pad = (hi - lo || Math.abs(hi) || 1) * 0.18;
  const position = (value: number) => ((scale(value) - (lo - pad)) / (hi + pad - (lo - pad))) * 100;

  return (
    <div className="space-y-5">
      <div className={`${PANEL} p-6 sm:p-8`}>
        <p className="text-xl sm:text-2xl font-semibold leading-snug text-foreground">{item.question}</p>
        <p className="mt-2 text-sm text-muted">{t.hint}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-foreground">
            {t.low}
            <input
              autoFocus
              inputMode="decimal"
              value={lowText}
              readOnly={revealed}
              onChange={(event) => setLowText(event.target.value)}
              className={`${FIELD} mt-2 font-mono tabular-nums`}
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            {t.high}
            <input
              inputMode="decimal"
              value={highText}
              readOnly={revealed}
              onChange={(event) => setHighText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && valid) setRevealed(true);
              }}
              className={`${FIELD} mt-2 font-mono tabular-nums`}
            />
          </label>
        </div>
        {!revealed && (
          <button
            type="button"
            data-testid="neverdumb-reveal"
            disabled={!valid}
            onClick={() => setRevealed(true)}
            className={`${BTN_BASE} ${style.solid} ${style.ring} mt-5 w-full`}
          >
            {copy.shared.reveal}
          </button>
        )}
      </div>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${PANEL} p-6 sm:p-8`}>
          <p className="text-sm text-muted">{t.answer}</p>
          <p className="mt-1 font-mono text-4xl font-semibold tabular-nums text-foreground">{format.format(item.answer)}</p>

          <div className="relative mt-8 h-10" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className={`absolute top-1/2 h-2.5 -translate-y-1/2 origin-left rounded-full ${inside ? "bg-nd-reset/60" : "bg-red-500/50"}`}
              style={{ left: `${position(low)}%`, width: `${Math.max(1, position(high) - position(low))}%` }}
            />
            <div
              className="absolute top-0 h-10 w-0.5 -translate-x-1/2 rounded-full bg-foreground"
              style={{ left: `${position(item.answer)}%` }}
            />
          </div>
          <div className="relative mt-1 h-4 font-mono text-xs tabular-nums text-muted">
            <span className="absolute -translate-x-full pr-1" style={{ left: `${position(low)}%` }}>
              {format.format(low)}
            </span>
            <span className="absolute pl-1" style={{ left: `${position(high)}%` }}>
              {format.format(high)}
            </span>
          </div>

          <p className={`mt-5 text-lg font-semibold ${inside ? "text-nd-reset" : "text-red-500"}`}>
            {inside ? t.inRange : t.outOfRange}
          </p>
          <p className="mt-1 font-mono text-sm text-foreground">{item.how}</p>
          {!inside && <p className="mt-3 text-sm text-muted">{t.calibrationNote}</p>}
          <button
            type="button"
            data-testid="neverdumb-estimate-done"
            onClick={() => onComplete(feedback)}
            className={`${BTN_BASE} ${style.solid} ${style.ring} mt-6 w-full`}
          >
            {copy.shared.done}
          </button>
        </motion.div>
      )}
    </div>
  );
}

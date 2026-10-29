"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BTN_BASE, FIELD, MODE_STYLES, PANEL, countWords, type ExerciseProps } from "../catalog";

const style = MODE_STYLES.serious;
const MAX_WORDS = 25;

export function CompressExercise({ copy, locale, variant, onComplete }: ExerciseProps) {
  const t = copy.compress;
  const source = t.sources[variant % t.sources.length];
  const [rule, setRule] = useState("");
  const [question, setQuestion] = useState("");
  const [revealed, setRevealed] = useState(false);

  const used = countWords(rule, locale) + countWords(question, locale);
  const over = used > MAX_WORDS;
  const ratio = Math.min(1, used / MAX_WORDS);

  return (
    <div className="space-y-5">
      <figure className={`${PANEL} p-5 sm:p-6`}>
        <figcaption className={`text-xs font-semibold uppercase tracking-[0.18em] ${style.text}`}>{t.source}</figcaption>
        <blockquote className="mt-3 text-base sm:text-lg leading-relaxed text-foreground">{source.text}</blockquote>
      </figure>

      <div className={`${PANEL} p-5 sm:p-6`}>
        <label className="block text-sm font-medium text-foreground">
          {t.rule}
          <textarea
            value={rule}
            readOnly={revealed}
            onChange={(event) => setRule(event.target.value)}
            rows={2}
            maxLength={300}
            className={`${FIELD} mt-2`}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-foreground">
          {t.question}
          <textarea
            value={question}
            readOnly={revealed}
            onChange={(event) => setQuestion(event.target.value)}
            rows={2}
            maxLength={300}
            className={`${FIELD} mt-2`}
          />
        </label>

        <div className="mt-4" aria-live="polite">
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all ${over ? "bg-red-500" : style.fill}`}
              style={{ width: `${ratio * 100}%` }}
            />
          </div>
          <p className={`mt-2 text-xs tabular-nums ${over ? "text-red-500" : "text-muted"}`}>
            {over ? t.tooLong : `${MAX_WORDS - used} ${t.wordsLeft}`}
          </p>
        </div>

        {!revealed && (
          <button
            type="button"
            data-testid="neverdumb-reveal"
            disabled={!rule.trim() || !question.trim() || over}
            onClick={() => setRevealed(true)}
            className={`${BTN_BASE} ${style.solid} ${style.ring} mt-4 w-full`}
          >
            {copy.shared.reveal}
          </button>
        )}
      </div>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border p-5 sm:p-6 ${style.border} ${style.soft}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${style.text}`}>{t.modelAnswer}</p>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="text-sm text-muted">{t.rule}</dt>
              <dd className="mt-0.5 text-base font-medium text-foreground">{source.rule}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t.question}</dt>
              <dd className="mt-0.5 text-base font-medium text-foreground">{source.question}</dd>
            </div>
          </dl>
          <button
            type="button"
            data-testid="neverdumb-compress-done"
            onClick={() => onComplete()}
            className={`${BTN_BASE} ${style.solid} ${style.ring} mt-5 w-full`}
          >
            {copy.shared.done}
          </button>
        </motion.div>
      )}
    </div>
  );
}

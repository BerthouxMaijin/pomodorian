"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BTN_BASE, FIELD, MODE_STYLES, PANEL, seededShuffle, type ExerciseProps } from "../catalog";
import { NdIcon } from "../NdIcon";

const style = MODE_STYLES.fun;

export function RoomRaidExercise({ copy, seed, onComplete }: ExerciseProps) {
  const t = copy.roomRaid;
  const [items] = useState(() => seededShuffle(t.items, seed).slice(0, 3));
  const [stage, setStage] = useState<"hunt" | "recall" | "check">("hunt");
  const [recall, setRecall] = useState("");
  const [remembered, setRemembered] = useState<boolean[]>(() => items.map(() => false));
  const score = remembered.filter(Boolean).length;

  if (stage === "hunt") {
    return (
      <div>
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 14, rotate: index === 1 ? 0 : index === 0 ? -2 : 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className={`rounded-3xl border p-6 ${style.border} ${style.soft}`}
            >
              <span className={`font-mono text-xs ${style.text}`}>0{index + 1}</span>
              <p className="mt-6 text-lg font-semibold leading-snug text-foreground">{item}</p>
            </motion.div>
          ))}
        </div>
        <button
          type="button"
          data-testid="neverdumb-raid-found"
          onClick={() => setStage("recall")}
          className={`${BTN_BASE} ${style.solid} ${style.ring} mt-6 w-full sm:w-auto`}
        >
          <NdIcon name="check" size={16} />
          {t.found}
        </button>
      </div>
    );
  }

  return (
    <div className={`${PANEL} p-6 sm:p-8`}>
      <label className="block">
        <span className="text-lg font-semibold text-foreground">{t.recall}</span>
        <textarea
          autoFocus
          value={recall}
          readOnly={stage === "check"}
          onChange={(event) => setRecall(event.target.value)}
          rows={4}
          maxLength={400}
          className={`${FIELD} mt-3`}
        />
      </label>
      {stage === "recall" ? (
        <button
          type="button"
          data-testid="neverdumb-raid-check"
          onClick={() => setStage("check")}
          className={`${BTN_BASE} ${style.solid} ${style.ring} mt-4 w-full`}
        >
          {t.check}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <p className="text-sm text-muted">{t.selfCheck}</p>
          <ul className="mt-3 space-y-2">
            {items.map((item, index) => (
              <li key={item}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={remembered[index]}
                  onClick={() => setRemembered((prev) => prev.map((v, i) => (i === index ? !v : v)))}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nd-fun ${
                    remembered[index] ? `${style.border} ${style.soft}` : "border-border hover:bg-surface-hover"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${remembered[index] ? `${style.fill} border-transparent text-nd-on-accent` : "border-border"}`}>
                    {remembered[index] && <NdIcon name="check" size={14} />}
                  </span>
                  <span className="text-base text-foreground">{item}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className={`font-mono text-3xl font-semibold tabular-nums ${style.text}`}>
              {score}/{items.length}
            </span>
            <button
              type="button"
              data-testid="neverdumb-fun-done"
              onClick={() => onComplete(`${score}/${items.length}`)}
              className={`${BTN_BASE} ${style.solid} ${style.ring}`}
            >
              {copy.shared.done}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

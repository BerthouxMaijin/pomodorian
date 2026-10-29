"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { track } from "@/lib/track";
import { BTN_GHOST, EXERCISES_BY_MODE, EXERCISE_MINUTES, FOCUS_RING, MODES, MODE_STYLES, PANEL, modeOf } from "./catalog";
import type { ExerciseId, NeverDumbCopy, NeverDumbMode } from "./copy/types";
import { NdIcon } from "./NdIcon";

interface NeverDumbHubProps {
  copy: NeverDumbCopy;
  articleUrl: string;
  timeRemaining: number;
  stats: { total: number; streak: number; today: number; lastPath: NeverDumbMode | null };
  hasRecentWork: boolean;
  onStart: (id: ExerciseId) => void;
}

function fits(id: ExerciseId, seconds: number) {
  return EXERCISE_MINUTES[id] * 60 <= seconds;
}

/**
 * One suggestion, picked once when the hub opens: rotate the path after the
 * last one used, prefer the debrief when there is fresh work to close, and
 * only suggest what fits in the break that is left.
 */
function pickSuggestion(
  lastPath: NeverDumbMode | null,
  total: number,
  timeRemaining: number,
  hasRecentWork: boolean
): ExerciseId {
  const path = lastPath ? MODES[(MODES.indexOf(lastPath) + 1) % MODES.length] : "serious";
  if (path === "serious" && hasRecentWork && fits("debrief", timeRemaining)) return "debrief";
  const pool = EXERCISES_BY_MODE[path].filter((id) => fits(id, timeRemaining));
  const candidates = pool.length > 0 ? pool : EXERCISES_BY_MODE[path];
  return candidates[total % candidates.length];
}

export function NeverDumbHub({ copy, articleUrl, timeRemaining, stats, hasRecentWork, onStart }: NeverDumbHubProps) {
  const reduceMotion = useReducedMotion();
  const [suggestion] = useState(() => pickSuggestion(stats.lastPath, stats.total, timeRemaining, hasRecentWork));
  const suggestionMode = modeOf(suggestion);
  const suggestionStyle = MODE_STYLES[suggestionMode];

  const surprise = () => {
    const all = [...EXERCISES_BY_MODE.serious, ...EXERCISES_BY_MODE.fun, ...EXERCISES_BY_MODE.reset];
    const fitting = all.filter((id) => fits(id, timeRemaining) && id !== suggestion);
    const pool = fitting.length > 0 ? fitting : all;
    track("neverdumb_surprise");
    onStart(pool[Math.floor(Math.random() * pool.length)]);
  };

  const statTiles = [
    { label: copy.home.statTotal, value: stats.total },
    { label: copy.home.statStreak, value: stats.streak, icon: true },
    { label: copy.home.statToday, value: stats.today },
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="grid items-end gap-8 lg:grid-cols-[1.25fr_1fr]">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{copy.home.eyebrow}</p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-semibold tracking-[-0.035em] leading-[1.02] text-foreground">
            {copy.home.title}
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted">{copy.home.body}</p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-3"
        >
          <button
            type="button"
            data-testid="neverdumb-suggested"
            onClick={() => onStart(suggestion)}
            className={`group relative w-full overflow-hidden rounded-3xl border p-5 text-left transition-colors ${suggestionStyle.border} ${suggestionStyle.soft} ${suggestionStyle.hover} ${FOCUS_RING} ${suggestionStyle.ring}`}
          >
            <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${suggestionStyle.text}`}>{copy.home.suggested}</span>
            <span className="mt-3 flex items-center gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${suggestionStyle.fill} text-nd-on-accent`}>
                <NdIcon name={suggestion} size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-semibold text-foreground">{copy.exercises[suggestion].title}</span>
                <span className="block truncate text-sm text-muted">
                  {copy.exercises[suggestion].kicker} · {EXERCISE_MINUTES[suggestion]} {copy.shared.minuteShort}
                </span>
              </span>
              <NdIcon name="arrow" size={20} className={`shrink-0 transition-transform group-hover:translate-x-1 ${suggestionStyle.text}`} />
            </span>
          </button>
          <div className="grid grid-cols-3 gap-3">
            {statTiles.map((tile) => (
              <div key={tile.label} className={`${PANEL} px-4 py-3`}>
                <p className="flex items-center gap-1 font-mono text-2xl font-semibold tabular-nums text-foreground">
                  {tile.value}
                  {tile.icon && tile.value > 0 && <NdIcon name="flame" size={18} className="text-nd-fun" />}
                </p>
                <p className="mt-0.5 text-xs leading-tight text-muted">{tile.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {MODES.map((mode, column) => {
          const style = MODE_STYLES[mode];
          return (
            <motion.section
              key={mode}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + column * 0.06 }}
              aria-labelledby={`neverdumb-col-${mode}`}
              className={`${PANEL} p-3`}
            >
              <header className="flex items-center gap-3 px-3 pb-3 pt-2">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.soft} ${style.text}`}>
                  <NdIcon name={mode} size={18} />
                </span>
                <div>
                  <h2 id={`neverdumb-col-${mode}`} data-testid={`neverdumb-mode-${mode}`} className="text-base font-semibold text-foreground">
                    {copy.categories[mode].title}
                  </h2>
                  <p className="text-xs text-muted">{copy.categories[mode].tagline}</p>
                </div>
              </header>
              <ul className="space-y-1">
                {EXERCISES_BY_MODE[mode].map((id) => {
                  const tooLong = !fits(id, timeRemaining);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        data-testid={`neverdumb-exercise-${id}`}
                        onClick={() => onStart(id)}
                        title={tooLong ? copy.shared.longerThanBreak : undefined}
                        className={`group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-left transition-colors ${style.hover} ${FOCUS_RING} ${style.ring} ${tooLong ? "opacity-50" : ""}`}
                      >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/70 ${style.text}`}>
                          <NdIcon name={id} size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">{copy.exercises[id].title}</span>
                          <span className="block truncate text-xs text-muted">{copy.exercises[id].kicker}</span>
                        </span>
                        <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
                          {EXERCISE_MINUTES[id]}′
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener"
          data-testid="neverdumb-article-link"
          onClick={() => track("never_dumb_article_click")}
          className={`rounded-sm text-sm text-muted underline-offset-4 hover:text-foreground hover:underline ${FOCUS_RING} focus-visible:ring-foreground/40`}
        >
          {copy.home.articleLink} →
        </a>
        <button type="button" data-testid="neverdumb-surprise" onClick={surprise} className={BTN_GHOST}>
          <NdIcon name="shuffle" size={16} />
          {copy.home.surprise}
        </button>
      </div>
    </div>
  );
}

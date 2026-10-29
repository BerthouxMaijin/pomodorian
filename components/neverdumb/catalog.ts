import {
  FUN_EXERCISES,
  RESET_EXERCISES,
  SERIOUS_EXERCISES,
  type ExerciseId,
  type NeverDumbCopy,
  type NeverDumbMode,
} from "./copy/types";

export const MODES: readonly NeverDumbMode[] = ["serious", "fun", "reset"];

export const EXERCISES_BY_MODE: Record<NeverDumbMode, readonly ExerciseId[]> = {
  serious: SERIOUS_EXERCISES,
  fun: FUN_EXERCISES,
  reset: RESET_EXERCISES,
};

export function modeOf(id: ExerciseId): NeverDumbMode {
  if ((SERIOUS_EXERCISES as readonly ExerciseId[]).includes(id)) return "serious";
  if ((FUN_EXERCISES as readonly ExerciseId[]).includes(id)) return "fun";
  return "reset";
}

/** Rough duration shown on cards, in minutes. */
export const EXERCISE_MINUTES: Record<ExerciseId, number> = {
  debrief: 3,
  spotFlaw: 2,
  compress: 3,
  estimate: 2,
  humanCaptcha: 1,
  roomRaid: 2,
  bodyDebugger: 1,
  duckBoss: 2,
  breathing: 3,
  meditation: 3,
  bodyScan: 3,
  walk: 5,
  music: 3,
  pingPong: 1,
};

/** Timed resets run on a wall-clock deadline of this many seconds. */
export const RESET_SECONDS = {
  breathing: 180,
  meditation: 180,
  bodyScan: 180,
  walk: 300,
  music: 180,
  pingPong: 60,
} as const;

/**
 * Exercises whose content comes from a fixed pool rotate through it across
 * breaks (stored in localStorage) so a regular never sees the same one twice
 * in a row.
 */
export function poolSize(id: ExerciseId, copy: NeverDumbCopy): number {
  if (id === "spotFlaw") return copy.spotFlaw.puzzles.length;
  if (id === "compress") return copy.compress.sources.length;
  if (id === "estimate") return copy.estimate.questions.length;
  return 0;
}

// Static class strings per category, spelled out so Tailwind can see them.
export const MODE_STYLES: Record<
  NeverDumbMode,
  { text: string; soft: string; border: string; hover: string; solid: string; ring: string; fill: string; stroke: string }
> = {
  serious: {
    text: "text-nd-serious",
    soft: "bg-nd-serious/10",
    border: "border-nd-serious/30",
    hover: "hover:border-nd-serious/60 hover:bg-nd-serious/[0.07]",
    solid: "bg-nd-serious text-nd-on-accent hover:bg-nd-serious/90",
    ring: "focus-visible:ring-nd-serious",
    fill: "bg-nd-serious",
    stroke: "stroke-nd-serious",
  },
  fun: {
    text: "text-nd-fun",
    soft: "bg-nd-fun/10",
    border: "border-nd-fun/30",
    hover: "hover:border-nd-fun/60 hover:bg-nd-fun/[0.07]",
    solid: "bg-nd-fun text-nd-on-accent hover:bg-nd-fun/90",
    ring: "focus-visible:ring-nd-fun",
    fill: "bg-nd-fun",
    stroke: "stroke-nd-fun",
  },
  reset: {
    text: "text-nd-reset",
    soft: "bg-nd-reset/10",
    border: "border-nd-reset/30",
    hover: "hover:border-nd-reset/60 hover:bg-nd-reset/[0.07]",
    solid: "bg-nd-reset text-nd-on-accent hover:bg-nd-reset/90",
    ring: "focus-visible:ring-nd-reset",
    fill: "bg-nd-reset",
    stroke: "stroke-nd-reset",
  },
};

export const FOCUS_RING = "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
export const BTN_BASE = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none ${FOCUS_RING}`;
export const BTN_GHOST = `${BTN_BASE} border border-border text-foreground hover:bg-surface-hover focus-visible:ring-foreground/40`;
export const PANEL = "rounded-3xl border border-border bg-surface";
export const FIELD =
  "w-full resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-foreground/40";

/** Deterministic Fisher-Yates driven by a seed, so renders stay pure. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  let state = seed >>> 0 || 1;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Word count that also works for Japanese and Chinese. */
export function countWords(text: string, locale: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
    let count = 0;
    for (const part of segmenter.segment(trimmed)) if (part.isWordLike) count += 1;
    return count;
  }
  return trimmed.split(/\s+/).length;
}

export interface ExerciseProps {
  copy: NeverDumbCopy;
  /** BCP 47 tag for Intl formatting and word segmentation. */
  locale: string;
  /** Rotated pool index, for exercises with a content pool. */
  variant: number;
  /** Random seed drawn when the exercise started. */
  seed: number;
  /** `feedback` is an optional personal line shown on the result screen. */
  onComplete: (feedback?: string) => void;
}

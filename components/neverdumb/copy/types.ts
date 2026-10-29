export const SERIOUS_EXERCISES = ["debrief", "spotFlaw", "compress", "estimate"] as const;
export const FUN_EXERCISES = ["humanCaptcha", "roomRaid", "bodyDebugger", "duckBoss"] as const;
export const RESET_EXERCISES = ["breathing", "meditation", "bodyScan", "walk", "music", "pingPong"] as const;

export type SeriousExercise = (typeof SERIOUS_EXERCISES)[number];
export type FunExercise = (typeof FUN_EXERCISES)[number];
export type ResetExercise = (typeof RESET_EXERCISES)[number];
export type ExerciseId = SeriousExercise | FunExercise | ResetExercise;
export type NeverDumbMode = "serious" | "fun" | "reset";

export type ExerciseCopy = {
  /** Card and screen title. */
  title: string;
  /** One-line purpose shown under the title on the hub card. */
  kicker: string;
  /** What to do, shown at the top of the exercise screen. */
  instruction: string;
  /** Headline of the result screen. */
  result: string;
};

/** A confident-sounding answer where exactly one sentence is wrong. */
export type FlawPuzzle = {
  sentences: readonly string[];
  /** Index of the wrong sentence in `sentences`. */
  flaw: number;
  code?: string;
  explanation: string;
};

export type CompressSource = {
  text: string;
  /** Model answer for the rule that must not move. */
  rule: string;
  /** Model answer for the open question. */
  question: string;
};

export type EstimateQuestion = {
  question: string;
  answer: number;
  /** How to get there without a calculator. */
  how: string;
};

export type NeverDumbCopy = {
  shared: {
    skip: string;
    back: string;
    start: string;
    next: string;
    done: string;
    validate: string;
    reveal: string;
    copy: string;
    copied: string;
    finishEarly: string;
    breakRemaining: string;
    privacy: string;
    minuteShort: string;
    longerThanBreak: string;
    settingsAutoOpen: string;
    audioUnavailable: string;
    safeNote: string;
  };
  home: {
    run: string;
    eyebrow: string;
    title: string;
    body: string;
    suggested: string;
    surprise: string;
    statTotal: string;
    statStreak: string;
    statToday: string;
    articleLink: string;
  };
  categories: Record<NeverDumbMode, { title: string; tagline: string }>;
  exercises: Record<ExerciseId, ExerciseCopy>;
  result: {
    eyebrow: string;
    body: string;
    backToBreak: string;
    another: string;
    nextSurprise: string;
  };
  debrief: {
    recentLabel: string;
    steps: readonly { question: string; placeholder: string }[];
    summaryTitle: string;
    addTask: string;
    taskAdded: string;
  };
  spotFlaw: {
    pick: string;
    confidenceLabel: string;
    confidence: readonly [string, string, string];
    correct: string;
    wrong: string;
    calibration: { rightSure: string; rightUnsure: string; wrongSure: string; wrongUnsure: string };
    puzzles: readonly FlawPuzzle[];
  };
  compress: {
    source: string;
    rule: string;
    question: string;
    wordsLeft: string;
    tooLong: string;
    modelAnswer: string;
    sources: readonly CompressSource[];
  };
  estimate: {
    hint: string;
    low: string;
    high: string;
    answer: string;
    inRange: string;
    outOfRange: string;
    calibrationNote: string;
    questions: readonly EstimateQuestion[];
  };
  humanCaptcha: {
    checkbox: string;
    verifying: string;
    verified: string;
    reroll: string;
    missions: readonly string[];
  };
  roomRaid: {
    found: string;
    recall: string;
    check: string;
    selfCheck: string;
    items: readonly string[];
  };
  bodyDebugger: {
    ready: string;
    trapQuestion: string;
    yes: string;
    no: string;
    hacked: string;
    firewall: string;
    commands: readonly string[];
    traps: readonly string[];
  };
  duckBoss: {
    hit: string;
    hp: string;
    defeated: string;
    questions: readonly string[];
  };
  reset: {
    breatheIn: string;
    breatheOut: string;
    walking: string;
    musicPlaying: string;
    pingPongCue: string;
    left: string;
    right: string;
    scanRegions: readonly string[];
    meditationCues: readonly string[];
  };
};

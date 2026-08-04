"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { track } from "@/lib/track";
import { formatTime } from "@/lib/utils";
import type { UiLocale } from "@/lib/i18n/locales";
import { useBrowserLocale } from "@/hooks/useBrowserLocale";
import {
  FUN_EXERCISES,
  NEVER_DUMB_COPY,
  RESET_EXERCISES,
  SERIOUS_EXERCISES,
  type ExerciseId,
  type FunExercise,
  type NeverDumbMode,
  type ResetExercise,
  type SeriousExercise,
} from "./neverDumbCopy";

type Screen = "intro" | "mode" | "serious-menu" | "reset-menu" | "exercise" | "result";
type CloseReason = "skip" | "complete" | "timer-ended";

interface NeverDumbModalProps {
  timeRemaining: number;
  totalTime: number;
  onClose: (reason: CloseReason) => void;
  onPauseAmbients: () => void;
  onResumeAmbients: () => void;
}

const RESET_DURATIONS: Record<ResetExercise, number> = {
  breathing: 180,
  meditation: 180,
  bodyScan: 180,
  walk: 300,
  music: 180,
  pingPong: 60,
};

const COMPRESS_SOURCES: Record<UiLocale, string> = {
  en: "The release must preserve every user's data. We still do not know whether the migration stays below 200 ms at production volume. Ship only with a reversible rollout.",
  fr: "La mise en production doit préserver toutes les données utilisateur. Nous ignorons encore si la migration reste sous 200 ms au volume réel. Ne publier qu’avec un déploiement réversible.",
  es: "La publicación debe conservar todos los datos. Aún no sabemos si la migración tarda menos de 200 ms con volumen real. Publicar solo con un despliegue reversible.",
  de: "Das Release muss alle Nutzerdaten bewahren. Ob die Migration bei Produktionslast unter 200 ms bleibt, ist noch offen. Nur reversibel ausrollen.",
  pt: "A publicação deve preservar todos os dados. Ainda não sabemos se a migração fica abaixo de 200 ms em produção. Publicar apenas com implantação reversível.",
  it: "Il rilascio deve preservare tutti i dati. Non sappiamo ancora se la migrazione resta sotto 200 ms col carico reale. Pubblicare solo con un rilascio reversibile.",
  ja: "リリースでは全ユーザーデータを保持する必要がある。本番規模で移行が200ms以内に収まるかは未確認。ロールバック可能な形でのみ公開する。",
  zh: "发布必须保留所有用户数据。迁移在生产规模下能否保持在 200 毫秒以内仍未知。只能采用可回滚的方式发布。",
};

let sharedFunQueue: FunExercise[] = [];
let lastFunExercise: FunExercise | null = null;

function shuffledFunQueue(): FunExercise[] {
  const queue = [...FUN_EXERCISES];
  for (let i = queue.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  if (lastFunExercise && queue[0] === lastFunExercise && queue.length > 1) {
    [queue[0], queue[1]] = [queue[1], queue[0]];
  }
  return queue;
}

function drawFunExercise(): FunExercise {
  if (sharedFunQueue.length === 0) sharedFunQueue = shuffledFunQueue();
  const next = sharedFunQueue.shift() ?? FUN_EXERCISES[0];
  lastFunExercise = next;
  return next;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-white/10 bg-white/[0.035] rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function NeverDumbModal({
  timeRemaining,
  totalTime,
  onClose,
  onPauseAmbients,
  onResumeAmbients,
}: NeverDumbModalProps) {
  const locale = useBrowserLocale();
  const [screen, setScreen] = useState<Screen>("intro");
  const [mode, setMode] = useState<NeverDumbMode | null>(null);
  const [exercise, setExercise] = useState<ExerciseId | null>(null);
  const [stage, setStage] = useState<"ready" | "active" | "recall">("ready");
  const [answer, setAnswer] = useState("");
  const [secondAnswer, setSecondAnswer] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [duckRound, setDuckRound] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [audioError, setAudioError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientsPausedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const copy = NEVER_DUMB_COPY[locale];

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (ambientsPausedRef.current) {
      ambientsPausedRef.current = false;
      onResumeAmbients();
    }
  }, [onResumeAmbients]);

  const close = useCallback(
    (reason: CloseReason) => {
      stopMusic();
      if (reason === "skip") track("neverdumb_skipped");
      onClose(reason);
    },
    [onClose, stopMusic]
  );

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close("skip");
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      stopMusic();
      previousFocusRef.current?.focus();
    };
  }, [close, stopMusic]);

  const finishExercise = useCallback(() => {
    if (!exercise) return;
    setDeadline(null);
    stopMusic();
    setScreen("result");
    track("neverdumb_exercise_completed", { exercise });
  }, [exercise, stopMusic]);

  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= deadline) finishExercise();
    };
    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [deadline, finishExercise]);

  const resetExerciseState = useCallback(() => {
    setAnswer("");
    setSecondAnswer("");
    setConfidence(50);
    setDuckRound(0);
    setDeadline(null);
    setStartedAt(null);
    setStage("ready");
    setAudioError(false);
    stopMusic();
  }, [stopMusic]);

  const startExercise = useCallback(
    (id: ExerciseId) => {
      resetExerciseState();
      setExercise(id);
      setMissionIndex(Math.floor(Math.random() * copy.humanMissions.length));
      setScreen("exercise");
      track("neverdumb_exercise_started", { exercise: id });
    },
    [copy.humanMissions.length, resetExerciseState]
  );

  const chooseMode = (nextMode: NeverDumbMode) => {
    setMode(nextMode);
    track("neverdumb_path_selected", { path: nextMode });
    if (nextMode === "fun") startExercise(drawFunExercise());
    else setScreen(nextMode === "serious" ? "serious-menu" : "reset-menu");
  };

  const startTimedExercise = useCallback(() => {
    if (!exercise || !RESET_EXERCISES.includes(exercise as ResetExercise)) return;
    const reset = exercise as ResetExercise;
    const start = Date.now();
    setNow(start);
    setStartedAt(start);
    setDeadline(start + RESET_DURATIONS[reset] * 1000);
    setStage("active");

    if (reset === "music") {
      onPauseAmbients();
      ambientsPausedRef.current = true;
      const audio = new Audio("/sounds/lofi.mp3");
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
      audio.play().catch(() => {
        setAudioError(true);
        stopMusic();
      });
    }
  }, [exercise, onPauseAmbients, stopMusic]);

  const elapsedSeconds = startedAt ? Math.max(0, (now - startedAt) / 1000) : 0;
  const exerciseSecondsLeft = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;
  const exerciseCopy = exercise ? copy.exercises[exercise] : null;
  const timerProgress = totalTime > 0 ? 1 - timeRemaining / totalTime : 0;

  const goBack = () => {
    resetExerciseState();
    setExercise(null);
    setScreen(mode === "serious" ? "serious-menu" : mode === "reset" ? "reset-menu" : "mode");
  };

  // Localized companion-article URLs for the locales the blog covers;
  // every other locale falls back to the English article.
  const ARTICLE_URLS: Partial<Record<UiLocale, string>> = {
    fr: "/blog/fr/pauses-never-dumb",
    es: "/blog/es/pausas-never-dumb",
    de: "/blog/de/never-dumb-pausen",
  };
  const articleUrl = ARTICLE_URLS[locale] ?? "/blog/never-dumb-breaks";

  const renderIntro = () => (
    <div className="max-w-3xl mx-auto text-center py-14 sm:py-24">
      <p className="text-[11px] sm:text-xs tracking-[0.32em] uppercase text-[#8bf0a5] mb-5">{copy.intro.eyebrow}</p>
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.06em] uppercase text-[#fff9ed] leading-[0.92]">
        {copy.intro.title}
      </h1>
      <p className="mt-7 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-[#aaa69d]">{copy.intro.body}</p>
      <div className="mt-5">
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener"
          data-testid="neverdumb-article-link"
          onClick={() => track("never_dumb_article_click")}
          className="inline-block rounded-sm text-xs sm:text-sm text-[#858178] underline-offset-4 hover:text-[#d0cbc0] hover:underline focus:outline-none focus:ring-2 focus:ring-[#8bf0a5]"
        >
          {copy.intro.articleLink} →
        </a>
      </div>
      <button
        type="button"
        data-testid="neverdumb-enter"
        onClick={() => setScreen("mode")}
        className="mt-9 rounded-full bg-[#ff5b45] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#170d0a] hover:bg-[#ff745f] focus:outline-none focus:ring-2 focus:ring-[#8bf0a5]"
      >
        &gt; {copy.intro.run}
      </button>
    </div>
  );

  const renderMode = () => (
    <div className="max-w-5xl mx-auto py-8 sm:py-14">
      <p className="text-xs tracking-[0.25em] uppercase text-[#8bf0a5]">{copy.mode.eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-[-0.045em] text-[#fff9ed]">{copy.mode.title}</h2>
      <p className="mt-3 text-[#aaa69d]">{copy.mode.body}</p>
      <div className="grid md:grid-cols-3 gap-3 mt-8">
        {(["serious", "fun", "reset"] as const).map((item, index) => (
          <button
            key={item}
            type="button"
            data-testid={`neverdumb-mode-${item}`}
            onClick={() => chooseMode(item)}
            className="group min-h-48 text-left border border-white/10 bg-white/[0.035] rounded-2xl p-6 hover:border-[#ff5b45]/70 hover:bg-[#ff5b45]/[0.06] focus:outline-none focus:ring-2 focus:ring-[#8bf0a5] transition-colors"
          >
            <span className="text-xs text-[#625f58]">0{index + 1}</span>
            <span className="block mt-9 text-2xl font-black tracking-tight uppercase text-[#fff9ed] group-hover:text-[#ff725d]">
              {copy.mode[item]}
            </span>
            <span className="block mt-3 text-sm leading-relaxed text-[#aaa69d]">{copy.mode[`${item}Detail`]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderMenu = (ids: readonly (SeriousExercise | ResetExercise)[], title: string, body: string) => (
    <div className="max-w-5xl mx-auto py-6 sm:py-10">
      <button type="button" onClick={() => setScreen("mode")} className="text-sm text-[#aaa69d] hover:text-white">← {copy.shared.back}</button>
      <h2 className="mt-7 text-3xl sm:text-5xl font-black tracking-[-0.045em] text-[#fff9ed]">{title}</h2>
      <p className="mt-3 text-[#aaa69d]">{body}</p>
      <div className={`grid gap-3 mt-8 ${ids.length > 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3"}`}>
        {ids.map((id) => {
          const item = copy.exercises[id];
          const duration = RESET_EXERCISES.includes(id as ResetExercise) ? RESET_DURATIONS[id as ResetExercise] / 60 : null;
          return (
            <button
              key={id}
              type="button"
              data-testid={`neverdumb-exercise-${id}`}
              onClick={() => startExercise(id)}
              className="text-left border border-white/10 bg-white/[0.035] rounded-2xl p-5 hover:border-[#8bf0a5]/60 hover:bg-[#8bf0a5]/[0.04] focus:outline-none focus:ring-2 focus:ring-[#8bf0a5] transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8bf0a5]">{item.kicker}</span>
              <span className="block mt-3 text-xl font-bold text-[#fff9ed]">{item.title}</span>
              <span className="block mt-2 text-sm leading-relaxed text-[#858178]">{item.detail}</span>
              {duration && <span className="block mt-4 text-xs text-[#ff725d]">{duration} {copy.shared.minuteShort}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const Confidence = () => (
    <label className="block mt-5 text-sm text-[#aaa69d]">
      <span className="flex justify-between"><span>{copy.shared.confidence}</span><span>{confidence}%</span></span>
      <input
        type="range"
        min="0"
        max="100"
        value={confidence}
        onChange={(event) => setConfidence(Number(event.target.value))}
        className="w-full mt-2 accent-[#ff5b45]"
      />
    </label>
  );

  const resultButton = (
    <button type="button" data-testid="neverdumb-reveal" onClick={finishExercise} className="mt-5 w-full rounded-xl bg-[#ff5b45] px-5 py-3.5 font-bold text-[#170d0a] hover:bg-[#ff745f] focus:outline-none focus:ring-2 focus:ring-[#8bf0a5]">
      {copy.shared.reveal}
    </button>
  );

  const renderSerious = () => {
    if (!exercise || !exerciseCopy) return null;
    return (
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8bf0a5]">{exerciseCopy.kicker}</p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#fff9ed]">{exerciseCopy.title}</h2>
          <p className="mt-5 leading-relaxed text-[#d0cbc0]">{exerciseCopy.instruction}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#858178]">{exerciseCopy.detail}</p>
          {exercise === "breakAnswer" && (
            <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-[#8bf0a5]"><code>{"const activeUsers = users.map(\n  user => user.active\n);"}</code></pre>
          )}
          {exercise === "compress" && (
            <Panel className="mt-6 p-4 text-sm leading-relaxed text-[#b7b1a6]">
              <span className="block mb-2 text-[10px] uppercase tracking-[0.2em] text-[#ff725d]">{copy.shared.source}</span>
              {COMPRESS_SOURCES[locale]}
            </Panel>
          )}
        </div>
        <Panel className="p-5 sm:p-6 self-start">
          {exercise === "compress" ? (
            <>
              <label className="text-sm text-[#aaa69d]">{copy.shared.invariant}
                <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-[#fff9ed] outline-none focus:border-[#8bf0a5]" />
              </label>
              <label className="mt-4 block text-sm text-[#aaa69d]">{copy.shared.openQuestion}
                <textarea value={secondAnswer} onChange={(event) => setSecondAnswer(event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-[#fff9ed] outline-none focus:border-[#8bf0a5]" />
              </label>
            </>
          ) : (
            <label className="text-sm text-[#aaa69d]">{copy.shared.answer}
              <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={8} autoFocus className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-[#fff9ed] outline-none focus:border-[#8bf0a5]" />
            </label>
          )}
          <Confidence />
          {resultButton}
        </Panel>
      </div>
    );
  };

  const renderFun = () => {
    if (!exercise || !exerciseCopy) return null;
    if (exercise === "humanCaptcha") {
      return (
        <div className="max-w-2xl mx-auto text-center py-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8bf0a5]">{exerciseCopy.kicker}</p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black text-[#fff9ed]">{exerciseCopy.title}</h2>
          <Panel className="mt-8 p-7 sm:p-10 text-xl sm:text-2xl font-bold leading-relaxed text-[#ff725d]">{copy.humanMissions[missionIndex]}</Panel>
          <p className="mt-5 text-sm text-[#858178]">{exerciseCopy.detail}</p>
          <button type="button" data-testid="neverdumb-fun-done" onClick={finishExercise} className="mt-7 rounded-full bg-[#8bf0a5] px-7 py-3.5 font-bold text-[#0c1a10]">{copy.shared.done}</button>
        </div>
      );
    }

    if (exercise === "roomRaid") {
      return (
        <div className="max-w-3xl mx-auto py-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8bf0a5]">{exerciseCopy.kicker}</p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black text-[#fff9ed]">{exerciseCopy.title}</h2>
          {stage === "ready" ? (
            <>
              <div className="grid sm:grid-cols-3 gap-3 mt-8">{copy.roomItems.map((item) => <Panel key={item} className="p-5 text-[#ff725d] font-bold">{item}</Panel>)}</div>
              <button type="button" onClick={() => setStage("recall")} className="mt-7 rounded-full bg-[#8bf0a5] px-7 py-3.5 font-bold text-[#0c1a10]">{copy.shared.start}</button>
            </>
          ) : (
            <Panel className="mt-8 p-6 text-left">
              <label className="text-sm text-[#aaa69d]">{copy.shared.recall}
                <textarea autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} rows={6} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-[#fff9ed] outline-none focus:border-[#8bf0a5]" />
              </label>
              <button type="button" data-testid="neverdumb-fun-done" onClick={finishExercise} className="mt-4 w-full rounded-xl bg-[#ff5b45] px-5 py-3.5 font-bold text-[#170d0a]">{copy.shared.done}</button>
            </Panel>
          )}
        </div>
      );
    }

    if (exercise === "bodyDebugger") {
      const commandIndex = Math.min(copy.bodyCommands.length - 1, Math.floor(elapsedSeconds / 1.5));
      const startBody = () => {
        const start = Date.now();
        setNow(start);
        setStartedAt(start);
        setDeadline(start + copy.bodyCommands.length * 1500);
        setStage("active");
      };
      return (
        <div className="max-w-3xl mx-auto py-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8bf0a5]">{exerciseCopy.kicker}</p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black text-[#fff9ed]">{exerciseCopy.title}</h2>
          <p className="mt-5 text-[#aaa69d]">{exerciseCopy.instruction}</p>
          <Panel className={`mt-8 p-8 sm:p-12 text-2xl sm:text-4xl font-black ${stage === "active" && copy.bodyCommands[commandIndex]?.includes("AI SAYS") ? "text-[#ff5b45]" : "text-[#8bf0a5]"}`}>
            {stage === "active" ? copy.bodyCommands[commandIndex] : "READY?"}
          </Panel>
          {stage === "ready" && <button type="button" onClick={startBody} className="mt-7 rounded-full bg-[#8bf0a5] px-7 py-3.5 font-bold text-[#0c1a10]">{copy.shared.start}</button>}
          {stage === "active" && <button type="button" onClick={finishExercise} className="mt-6 text-sm text-[#858178] hover:text-white">{copy.shared.finishEarly}</button>}
        </div>
      );
    }

    const question = copy.duckQuestions[Math.min(duckRound, copy.duckQuestions.length - 1)];
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <div className="text-6xl" aria-hidden="true">🦆</div>
        <p className="mt-5 text-xs uppercase tracking-[0.25em] text-[#8bf0a5]">{exerciseCopy.kicker}</p>
        <h2 className="mt-3 text-4xl sm:text-6xl font-black text-[#fff9ed]">{exerciseCopy.title}</h2>
        <Panel className="mt-8 p-8 text-xl sm:text-3xl font-black text-[#ff725d]">{question}</Panel>
        <p className="mt-4 text-sm text-[#858178]">{duckRound + 1} / {copy.duckQuestions.length}</p>
        <button
          type="button"
          data-testid="neverdumb-duck-hit"
          onClick={() => duckRound + 1 >= copy.duckQuestions.length ? finishExercise() : setDuckRound((round) => round + 1)}
          className="mt-6 rounded-full bg-[#8bf0a5] px-7 py-3.5 font-bold text-[#0c1a10]"
        >
          HIT BOSS
        </button>
      </div>
    );
  };

  const renderReset = () => {
    if (!exercise || !exerciseCopy) return null;
    const reset = exercise as ResetExercise;
    const phase = Math.floor(elapsedSeconds / 5) % 2;
    const meditationIndex = Math.min(copy.meditationCues.length - 1, Math.floor(elapsedSeconds / 40));
    const scanIndex = Math.min(copy.scanRegions.length - 1, Math.floor(elapsedSeconds / (180 / copy.scanRegions.length)));
    const pingSide = Math.floor(elapsedSeconds / 1.2) % 2 === 0 ? "LEFT" : "RIGHT";

    return (
      <div className="max-w-3xl mx-auto py-5 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8bf0a5]">{exerciseCopy.kicker}</p>
        <h2 className="mt-3 text-3xl sm:text-5xl font-black text-[#fff9ed]">{exerciseCopy.title}</h2>
        <p className="mt-4 text-[#aaa69d]">{exerciseCopy.instruction}</p>
        {stage === "ready" ? (
          <>
            <p className="mt-3 text-sm text-[#858178]">{exerciseCopy.detail}</p>
            <button type="button" data-testid="neverdumb-reset-start" onClick={startTimedExercise} className="mt-8 rounded-full bg-[#8bf0a5] px-8 py-4 font-bold text-[#0c1a10]">{copy.shared.start}</button>
          </>
        ) : (
          <>
            <div className="mt-8 min-h-56 flex items-center justify-center">
              {reset === "breathing" && (
                <motion.div
                  animate={shouldReduceMotion ? undefined : { scale: phase === 0 ? 1.32 : 0.82 }}
                  transition={{ duration: 5, ease: "easeInOut" }}
                  className="h-40 w-40 rounded-full border border-[#8bf0a5]/60 bg-[#8bf0a5]/10 flex items-center justify-center text-xl font-bold text-[#8bf0a5]"
                >
                  {phase === 0 ? copy.breatheIn : copy.breatheOut}
                </motion.div>
              )}
              {reset === "meditation" && <Panel className="p-8 text-xl sm:text-3xl leading-relaxed text-[#fff9ed]">{copy.meditationCues[meditationIndex]}</Panel>}
              {reset === "bodyScan" && <div><div className="text-xs uppercase tracking-[0.25em] text-[#858178]">{scanIndex + 1} / {copy.scanRegions.length}</div><div className="mt-4 text-4xl sm:text-6xl font-black text-[#8bf0a5]">{copy.scanRegions[scanIndex]}</div></div>}
              {reset === "walk" && <div><div className="text-5xl" aria-hidden="true">↗</div><div className="mt-5 text-xl font-bold text-[#fff9ed]">{copy.walking}</div></div>}
              {reset === "music" && <div><div className="text-5xl" aria-hidden="true">♫</div><div className="mt-5 text-xl font-bold text-[#fff9ed]">{audioError ? copy.shared.audioUnavailable : copy.musicPlaying}</div></div>}
              {reset === "pingPong" && (
                <div className="w-full">
                  <div className="relative mx-auto h-28 max-w-lg border-x border-white/10">
                    <motion.div
                      animate={shouldReduceMotion ? undefined : { x: pingSide === "LEFT" ? "-42%" : "42%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute left-1/2 top-8 -ml-4 h-8 w-8 rounded-full bg-[#ff5b45]"
                    />
                  </div>
                  <div className="mt-4 text-2xl font-black text-[#8bf0a5]">{copy.pingPongCue}: {pingSide}</div>
                </div>
              )}
            </div>
            <div className="font-mono text-2xl text-[#ff725d]">{formatTime(exerciseSecondsLeft)}</div>
            <button type="button" data-testid="neverdumb-finish-early" onClick={finishExercise} className="mt-5 rounded-full border border-white/15 px-6 py-3 text-sm text-[#d0cbc0] hover:border-[#8bf0a5]">{copy.shared.finishEarly}</button>
          </>
        )}
        <p className="mt-7 text-xs text-[#69665f]">{copy.shared.safeNote}</p>
      </div>
    );
  };

  const renderResult = () => {
    if (!exercise || !exerciseCopy) return null;
    return (
      <div className="max-w-2xl mx-auto py-10 sm:py-20 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border border-[#8bf0a5]/50 bg-[#8bf0a5]/10 flex items-center justify-center text-2xl text-[#8bf0a5]">✓</div>
        <p className="mt-7 text-xs uppercase tracking-[0.25em] text-[#8bf0a5]">{copy.shared.resultTitle}</p>
        <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#fff9ed]">{exerciseCopy.result}</h2>
        <p className="mt-5 text-[#858178]">{copy.shared.resultBody}</p>
        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
          <button type="button" data-testid="neverdumb-close-complete" onClick={() => close("complete")} className="rounded-full bg-[#ff5b45] px-7 py-3.5 font-bold text-[#170d0a]">{copy.shared.done}</button>
          <button
            type="button"
            onClick={() => mode === "fun" ? startExercise(drawFunExercise()) : goBack()}
            className="rounded-full border border-white/15 px-7 py-3.5 text-[#d0cbc0] hover:border-[#8bf0a5]"
          >
            {mode === "fun" ? copy.shared.nextRandom : copy.shared.chooseAnother}
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#100f0d] text-[#fff9ed] font-mono"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="neverdumb-brand"
        lang={locale === "zh" ? "zh-Hans" : locale}
        className="min-h-full outline-none"
      >
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#100f0d]/95 backdrop-blur px-4 sm:px-7 py-3">
          <div className="mx-auto max-w-6xl flex items-center gap-3">
            <div id="neverdumb-brand" className="font-black tracking-[-0.04em] text-sm sm:text-base">NEVER <span className="text-[#ff5b45]">DUMB</span></div>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <div className="ml-auto flex items-center gap-3 sm:gap-5">
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-[0.18em] text-[#625f58]">{copy.shared.breakRemaining}</div>
                <div data-testid="neverdumb-break-timer" className="text-sm font-bold tabular-nums text-[#8bf0a5]">{formatTime(timeRemaining)}</div>
              </div>
              <button
                type="button"
                data-testid="neverdumb-skip"
                onClick={() => close("skip")}
                className="rounded-full border border-white/15 px-3 sm:px-4 py-2 text-[10px] sm:text-xs uppercase tracking-wide text-[#d0cbc0] hover:border-[#ff5b45] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8bf0a5]"
              >
                {copy.shared.skip}
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-px bg-[#ff5b45]" style={{ width: `${Math.max(0, Math.min(100, timerProgress * 100))}%` }} />
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-7 pb-16">
          {screen === "intro" && renderIntro()}
          {screen === "mode" && renderMode()}
          {screen === "serious-menu" && renderMenu(SERIOUS_EXERCISES, copy.seriousMenu.title, copy.seriousMenu.body)}
          {screen === "reset-menu" && renderMenu(RESET_EXERCISES, copy.resetMenu.title, copy.resetMenu.body)}
          {screen === "exercise" && (
            <div className="py-5 sm:py-8">
              <button type="button" onClick={goBack} className="mb-6 text-sm text-[#858178] hover:text-white">← {copy.shared.back}</button>
              {mode === "serious" && renderSerious()}
              {mode === "fun" && renderFun()}
              {mode === "reset" && renderReset()}
            </div>
          )}
          {screen === "result" && renderResult()}
        </main>

        <footer className="fixed bottom-3 left-4 right-4 pointer-events-none">
          <p className="mx-auto max-w-6xl text-center text-[9px] sm:text-[10px] text-[#4f4c46]">{copy.shared.privacy}</p>
        </footer>
      </div>
    </motion.div>
  );
}

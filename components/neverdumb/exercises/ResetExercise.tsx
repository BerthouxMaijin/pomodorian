"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { LOFI_TRACKS } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import { BTN_BASE, BTN_GHOST, MODE_STYLES, RESET_SECONDS, type ExerciseProps } from "../catalog";
import type { ResetExercise as ResetId } from "../copy/types";
import { NdIcon } from "../NdIcon";

interface ResetExerciseProps extends ExerciseProps {
  id: ResetId;
  onPauseAmbients: () => void;
  onResumeAmbients: () => void;
}

const style = MODE_STYLES.reset;

export function ResetExercise({ id, copy, seed, onComplete, onPauseAmbients, onResumeAmbients }: ResetExerciseProps) {
  const t = copy.reset;
  const reduceMotion = useReducedMotion();
  const duration = RESET_SECONDS[id];
  const [endTime, setEndTime] = useState<number | null>(null);
  const [audioError, setAudioError] = useState(false);
  const finish = useCallback(() => onComplete(), [onComplete]);
  const { remainingMs, remainingSeconds } = useCountdown(endTime, finish);
  const active = endTime !== null;
  const elapsed = active ? duration - remainingMs / 1000 : 0;

  // The lofi reset owns the audio while it runs: other ambiences pause and
  // come back however the exercise ends (finished, back, skip, timer end).
  // Latest callbacks in a ref: resumeAllAmbients changes identity with the
  // mixer state, and that must not restart the track.
  const ambientsRef = useRef({ pause: onPauseAmbients, resume: onResumeAmbients });
  useEffect(() => {
    ambientsRef.current = { pause: onPauseAmbients, resume: onResumeAmbients };
  }, [onPauseAmbients, onResumeAmbients]);
  useEffect(() => {
    if (!active || id !== "music") return;
    const ambients = ambientsRef.current;
    ambients.pause();
    const audio = new Audio(LOFI_TRACKS[seed % LOFI_TRACKS.length]);
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(() => setAudioError(true));
    return () => {
      audio.pause();
      ambientsRef.current.resume();
    };
  }, [active, id, seed]);

  if (!active) {
    return (
      <div className="text-center">
        <div className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full ${style.soft} ${style.text}`}>
          <NdIcon name={id} size={44} />
        </div>
        <p className="mt-6 font-mono text-sm text-muted">
          {duration / 60} {copy.shared.minuteShort}
        </p>
        <button
          type="button"
          data-testid="neverdumb-reset-start"
          onClick={() => setEndTime(Date.now() + duration * 1000)}
          className={`${BTN_BASE} ${style.solid} ${style.ring} mt-4 px-10`}
        >
          {copy.shared.start}
        </button>
        <p className="mt-8 text-xs text-muted">{copy.shared.safeNote}</p>
      </div>
    );
  }

  const breathIn = Math.floor(elapsed / 5) % 2 === 0;
  const breathCount = 5 - (Math.floor(elapsed) % 5);
  const cueIndex = Math.min(t.meditationCues.length - 1, Math.floor(elapsed / (duration / t.meditationCues.length)));
  const scanIndex = Math.min(t.scanRegions.length - 1, Math.floor(elapsed / (duration / t.scanRegions.length)));
  const pingLeft = Math.floor(elapsed / 1.2) % 2 === 0;

  return (
    <div className="text-center">
      <div className="flex min-h-72 items-center justify-center">
        {id === "breathing" && (
          <div className="relative flex h-64 w-64 items-center justify-center">
            <motion.div
              animate={reduceMotion ? undefined : { scale: breathIn ? 1 : 0.55 }}
              transition={{ duration: 5, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-full ${style.soft} border ${style.border}`}
            />
            <motion.div
              animate={reduceMotion ? undefined : { scale: breathIn ? 0.8 : 0.4 }}
              transition={{ duration: 5, ease: "easeInOut" }}
              className={`absolute inset-6 rounded-full ${style.fill} opacity-20`}
            />
            <div className="relative">
              <p className={`text-2xl font-semibold ${style.text}`}>{breathIn ? t.breatheIn : t.breatheOut}</p>
              <p className="mt-1 font-mono text-4xl font-semibold tabular-nums text-foreground">{breathCount}</p>
            </div>
          </div>
        )}

        {id === "meditation" && (
          <AnimatePresence mode="wait">
            <motion.p
              key={cueIndex}
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 1.2 }}
              className="max-w-xl text-2xl sm:text-3xl font-medium leading-relaxed text-foreground"
            >
              {t.meditationCues[cueIndex]}
            </motion.p>
          </AnimatePresence>
        )}

        {id === "bodyScan" && (
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.p
                key={scanIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`text-5xl sm:text-6xl font-semibold tracking-tight ${style.text}`}
              >
                {t.scanRegions[scanIndex]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {t.scanRegions.map((region, index) => (
                <span
                  key={region}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    index === scanIndex ? `${style.fill} text-nd-on-accent` : index < scanIndex ? `${style.soft} ${style.text}` : "bg-surface text-muted"
                  }`}
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        {id === "walk" && (
          <div>
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full ${style.soft} ${style.text}`}
            >
              <NdIcon name="walk" size={44} />
            </motion.div>
            <p className="mt-6 text-xl font-medium text-foreground">{t.walking}</p>
          </div>
        )}

        {id === "music" && (
          <div>
            <div className="flex h-28 items-end justify-center gap-2" aria-hidden="true">
              {[0.6, 1, 0.75, 0.9, 0.5, 0.8, 0.65].map((height, index) => (
                <motion.span
                  key={index}
                  className={`w-3 rounded-full ${style.fill}`}
                  style={{ height: `${height * 100}%`, originY: 1 }}
                  animate={reduceMotion || audioError ? undefined : { scaleY: [0.3, 1, 0.5, 0.9, 0.3] }}
                  transition={{ duration: 1.6 + index * 0.17, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
            <p className="mt-6 text-xl font-medium text-foreground">{audioError ? copy.shared.audioUnavailable : t.musicPlaying}</p>
          </div>
        )}

        {id === "pingPong" && (
          <div className="w-full max-w-lg">
            <div className="relative h-32 rounded-3xl border border-border bg-surface">
              <div className="absolute inset-y-4 left-1/2 w-px border-l border-dashed border-border" />
              <motion.div
                animate={reduceMotion ? undefined : { left: pingLeft ? "12%" : "88%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nd-fun shadow-lg"
                style={{ left: "12%" }}
              />
            </div>
            <p className={`mt-6 text-2xl font-semibold ${style.text}`}>
              {t.pingPongCue}: {pingLeft ? t.left : t.right}
            </p>
          </div>
        )}
      </div>

      <div className="mx-auto mt-6 max-w-xs">
        <p className="font-mono text-3xl tabular-nums text-foreground">{formatTime(remainingSeconds)}</p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-border">
          <div className={`h-full ${style.fill}`} style={{ width: `${(elapsed / duration) * 100}%` }} />
        </div>
      </div>
      <button type="button" data-testid="neverdumb-finish-early" onClick={finish} className={`${BTN_GHOST} mt-6`}>
        {copy.shared.finishEarly}
      </button>
    </div>
  );
}

"use client";

import { useRef, useCallback, useState } from "react";
import { ALARM_SOUNDS, LOFI_KEY, LOFI_TRACKS } from "@/lib/constants";

interface AmbientState {
  [key: string]: { active: boolean; volume: number };
}

export function useSound() {
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [ambients, setAmbients] = useState<AmbientState>({});

  const crossfadeRefs = useRef<Record<string, HTMLAudioElement>>({});
  const pendingRefs = useRef<Record<string, HTMLAudioElement>>({});
  const fadeIntervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const CROSSFADE_DURATION = 0.5; // seconds
  // Buffer the upcoming track this many seconds before the swap. Looping one
  // file was always cache-warm; chaining a playlist means the next file is a
  // cold multi-megabyte fetch, and starting it at crossfade time would stall.
  const PRELOAD_LEAD = 20; // seconds

  // "lofi" walks through LOFI_TRACKS; every other ambient keeps replaying its
  // own single file, exactly as before.
  const lofiIndex = useRef(0);
  const makeNextSrcResolver = (key: string, src: string): (() => string) => {
    if (key !== LOFI_KEY) return () => src;
    return () => {
      lofiIndex.current = (lofiIndex.current + 1) % LOFI_TRACKS.length;
      return LOFI_TRACKS[lofiIndex.current];
    };
  };

  const createBufferedAudio = (src: string): HTMLAudioElement => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0;
    return audio;
  };

  const setupCrossfadeLoop = (
    key: string,
    audio: HTMLAudioElement,
    nextSrc: () => string
  ) => {
    const onTimeUpdate = () => {
      if (!audio.duration || audio.paused) return;
      const timeLeft = audio.duration - audio.currentTime;

      // Resolve and buffer the upcoming track ahead of the crossfade window.
      if (
        timeLeft <= PRELOAD_LEAD &&
        !pendingRefs.current[key] &&
        !crossfadeRefs.current[key]
      ) {
        pendingRefs.current[key] = createBufferedAudio(nextSrc());
      }

      if (timeLeft <= CROSSFADE_DURATION && !crossfadeRefs.current[key]) {
        // Use the buffered copy when there is one, otherwise fall back to a
        // fresh element (the preload window can be missed in background tabs).
        const next =
          pendingRefs.current[key] ?? createBufferedAudio(nextSrc());
        delete pendingRefs.current[key];
        crossfadeRefs.current[key] = next;
        next.play().catch(() => {});

        // Fade out current, fade in next
        const fadeSteps = 20;
        const stepTime = (CROSSFADE_DURATION * 1000) / fadeSteps;
        const targetVolume = audio.volume;
        let step = 0;
        const fade = setInterval(() => {
          step++;
          const progress = step / fadeSteps;
          next.volume = Math.min(targetVolume, targetVolume * progress);
          audio.volume = Math.max(0, targetVolume * (1 - progress));
          if (step >= fadeSteps) {
            clearInterval(fade);
            delete fadeIntervals.current[key];
            audio.pause();
            audio.currentTime = 0;
            audio.volume = targetVolume;
            // Swap: next becomes the main audio
            audioRefs.current[key] = next;
            delete crossfadeRefs.current[key];
            setupCrossfadeLoop(key, next, nextSrc);
          }
        }, stepTime);
        fadeIntervals.current[key] = fade;
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
  };

  // Abort an in-flight crossfade: kill the fade timer and the second copy.
  const abortCrossfade = (key: string) => {
    const fade = fadeIntervals.current[key];
    if (fade) {
      clearInterval(fade);
      delete fadeIntervals.current[key];
    }
    const cross = crossfadeRefs.current[key];
    if (cross) {
      cross.pause();
      delete crossfadeRefs.current[key];
    }
    const pending = pendingRefs.current[key];
    if (pending) {
      pending.pause();
      delete pendingRefs.current[key];
    }
  };

  const getOrCreateAudio = (key: string, src: string): HTMLAudioElement => {
    if (!audioRefs.current[key]) {
      const audio = new Audio(src);
      audio.preload = "auto";
      // Native loop as safety net: in background tabs, timeupdate events are
      // throttled and can miss the crossfade window entirely.
      audio.loop = true;
      audioRefs.current[key] = audio;
      setupCrossfadeLoop(key, audio, makeNextSrcResolver(key, src));
    }
    return audioRefs.current[key];
  };

  const playAlarm = useCallback((soundKey: string, volume: number) => {
    const sound = ALARM_SOUNDS[soundKey];
    if (!sound) return;

    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }

    const audio = new Audio(sound.src);
    audio.volume = Math.max(0, Math.min(1, volume));
    alarmRef.current = audio;
    audio.play().catch(() => {});
  }, []);

  const playClick = useCallback(() => {
    const audio = new Audio("/sounds/tick-start.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }, []);

  const stopAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  }, []);

  const toggleAmbient = useCallback((key: string, src: string) => {
    setAmbients((prev) => {
      const current = prev[key];
      const audio = getOrCreateAudio(key, src);

      if (current?.active) {
        abortCrossfade(key);
        audio.pause();
        audio.currentTime = 0;
        return { ...prev, [key]: { ...current, active: false } };
      } else {
        const volume = current?.volume ?? 0.5;
        audio.volume = volume;
        audio.play().catch((err) => console.warn("Audio play failed:", err));
        return { ...prev, [key]: { active: true, volume } };
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getOrCreateAudio is stable (only uses refs)
  }, []);

  const setAmbientVolume = useCallback((key: string, volume: number) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
    setAmbients((prev) => ({
      ...prev,
      [key]: { ...prev[key], volume },
    }));
  }, []);

  const pauseAllAmbients = useCallback(() => {
    for (const key of Object.keys(audioRefs.current)) {
      abortCrossfade(key);
      const audio = audioRefs.current[key];
      if (!audio.paused) audio.pause();
    }
  }, []);

  const resumeAllAmbients = useCallback(() => {
    for (const [key, state] of Object.entries(ambients)) {
      const audio = audioRefs.current[key];
      if (state.active && audio) {
        // Restore volume: an aborted crossfade may have left it mid-fade
        audio.volume = state.volume;
        audio.play().catch(() => {});
      }
    }
  }, [ambients]);

  return {
    playAlarm,
    playClick,
    stopAlarm,
    toggleAmbient,
    setAmbientVolume,
    pauseAllAmbients,
    resumeAllAmbients,
    ambients,
  };
}

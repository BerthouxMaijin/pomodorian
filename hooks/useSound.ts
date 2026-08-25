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
  const handoffKeys = useRef<Record<string, true>>({});

  // An ambient loops one seamless file, so briefly overlapping two copies of it
  // is what hides the loop seam.
  const CROSSFADE_DURATION = 0.5; // seconds
  // Music is the opposite case: two unrelated tracks laid over each other just
  // sound muddy. The lofi lane fades the outgoing track down to silence, stops
  // it, then fades the next one up. No overlap.
  const MUSIC_FADE_DURATION = 2.5; // seconds, on the way out and on the way in
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

  const isMusicLane = (key: string) => key === LOFI_KEY;

  const createBufferedAudio = (src: string, loop: boolean): HTMLAudioElement => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = loop;
    audio.volume = 0;
    return audio;
  };

  // Ramp one element's volume, replacing whatever fade was running for that key.
  const fadeVolume = (
    key: string,
    audio: HTMLAudioElement,
    from: number,
    to: number,
    seconds: number,
    onDone?: () => void
  ) => {
    const running = fadeIntervals.current[key];
    if (running) clearInterval(running);

    const steps = Math.max(10, Math.round(seconds * 30)); // ~30 steps per second
    const stepTime = (seconds * 1000) / steps;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    let step = 0;

    audio.volume = clamp(from);
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(1, step / steps);
      audio.volume = clamp(from + (to - from) * progress);
      if (step >= steps) {
        clearInterval(timer);
        delete fadeIntervals.current[key];
        onDone?.();
      }
    }, stepTime);
    fadeIntervals.current[key] = timer;
  };

  // Fade the current track out, stop it, then fade the next one in.
  const startMusicHandoff = (
    key: string,
    audio: HTMLAudioElement,
    nextSrc: () => string,
    skipFadeOut = false
  ) => {
    if (handoffKeys.current[key]) return;
    handoffKeys.current[key] = true;
    const targetVolume = audio.volume;

    const beginNext = () => {
      const next =
        pendingRefs.current[key] ?? createBufferedAudio(nextSrc(), false);
      delete pendingRefs.current[key];
      next.loop = false;
      next.volume = 0;
      audioRefs.current[key] = next;
      delete handoffKeys.current[key];
      next.play().catch(() => {});
      fadeVolume(key, next, 0, targetVolume, MUSIC_FADE_DURATION);
      setupTrackLoop(key, next, nextSrc);
    };

    if (skipFadeOut) {
      audio.pause();
      audio.currentTime = 0;
      beginNext();
      return;
    }

    fadeVolume(key, audio, targetVolume, 0, MUSIC_FADE_DURATION, () => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = targetVolume;
      beginNext();
    });
  };

  const setupTrackLoop = (
    key: string,
    audio: HTMLAudioElement,
    nextSrc: () => string
  ) => {
    const music = isMusicLane(key);

    const onTimeUpdate = () => {
      if (!audio.duration || audio.paused) return;
      const timeLeft = audio.duration - audio.currentTime;

      // Resolve and buffer the upcoming track ahead of the handover window.
      if (
        timeLeft <= PRELOAD_LEAD &&
        !pendingRefs.current[key] &&
        !crossfadeRefs.current[key] &&
        !handoffKeys.current[key]
      ) {
        pendingRefs.current[key] = createBufferedAudio(nextSrc(), !music);
      }

      if (music) {
        if (timeLeft <= MUSIC_FADE_DURATION) {
          startMusicHandoff(key, audio, nextSrc);
        }
        return;
      }

      if (timeLeft <= CROSSFADE_DURATION && !crossfadeRefs.current[key]) {
        // Use the buffered copy when there is one, otherwise fall back to a
        // fresh element (the preload window can be missed in background tabs).
        const next =
          pendingRefs.current[key] ?? createBufferedAudio(nextSrc(), true);
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
            setupTrackLoop(key, next, nextSrc);
          }
        }, stepTime);
        fadeIntervals.current[key] = fade;
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);

    if (music) {
      // Music tracks do not loop, so a track that runs to its end is the
      // backstop for a background tab that throttled timeupdate past the fade
      // window. Nothing to fade out at that point, so hand over straight away.
      audio.addEventListener("ended", () =>
        startMusicHandoff(key, audio, nextSrc, true)
      );
    }
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
    delete handoffKeys.current[key];
  };

  const getOrCreateAudio = (key: string, src: string): HTMLAudioElement => {
    if (!audioRefs.current[key]) {
      const audio = new Audio(src);
      audio.preload = "auto";
      // Native loop as safety net for ambients: in background tabs, timeupdate
      // events are throttled and can miss the crossfade window entirely. Music
      // must not loop — its "ended" event is what drives the playlist forward.
      audio.loop = !isMusicLane(key);
      audioRefs.current[key] = audio;
      setupTrackLoop(key, audio, makeNextSrcResolver(key, src));
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

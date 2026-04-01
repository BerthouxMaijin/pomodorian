"use client";

import { useRef, useCallback, useState } from "react";
import { ALARM_SOUNDS } from "@/lib/constants";

interface AmbientState {
  [key: string]: { active: boolean; volume: number };
}

export function useSound() {
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [ambients, setAmbients] = useState<AmbientState>({});

  const crossfadeRefs = useRef<Record<string, HTMLAudioElement>>({});
  const CROSSFADE_DURATION = 0.5; // seconds

  const setupCrossfadeLoop = (key: string, audio: HTMLAudioElement, src: string) => {
    const onTimeUpdate = () => {
      if (!audio.duration || audio.paused) return;
      const timeLeft = audio.duration - audio.currentTime;
      if (timeLeft <= CROSSFADE_DURATION && !crossfadeRefs.current[key]) {
        // Start a second copy for crossfade
        const next = new Audio(src);
        next.preload = "auto";
        next.volume = 0;
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
            audio.pause();
            audio.currentTime = 0;
            audio.volume = targetVolume;
            // Swap: next becomes the main audio
            audioRefs.current[key] = next;
            crossfadeRefs.current[key] = undefined!;
            delete crossfadeRefs.current[key];
            setupCrossfadeLoop(key, next, src);
          }
        }, stepTime);
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
  };

  const getOrCreateAudio = (key: string, src: string): HTMLAudioElement => {
    if (!audioRefs.current[key]) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioRefs.current[key] = audio;
      setupCrossfadeLoop(key, audio, src);
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
    for (const audio of Object.values(audioRefs.current)) {
      if (!audio.paused) audio.pause();
    }
  }, []);

  const resumeAllAmbients = useCallback(() => {
    for (const [key, state] of Object.entries(ambients)) {
      if (state.active && audioRefs.current[key]) {
        audioRefs.current[key].play().catch(() => {});
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

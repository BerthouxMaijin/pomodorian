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

  const getOrCreateAudio = (key: string, src: string): HTMLAudioElement => {
    if (!audioRefs.current[key]) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audioRefs.current[key] = audio;
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

  return {
    playAlarm,
    playClick,
    stopAlarm,
    toggleAmbient,
    setAmbientVolume,
    ambients,
  };
}

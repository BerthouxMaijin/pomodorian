"use client";

import { useRef, useCallback, useState } from "react";
import { ALARM_SOUNDS } from "@/lib/constants";

interface AmbientState {
  [key: string]: { active: boolean; volume: number };
}

export function useSound() {
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const ambientRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [ambients, setAmbients] = useState<AmbientState>({});

  const getOrCreateAudio = useCallback(
    (key: string, src: string, loop: boolean): HTMLAudioElement => {
      if (!ambientRefs.current[key]) {
        const audio = new Audio(src);
        audio.loop = loop;
        audio.preload = "auto";
        ambientRefs.current[key] = audio;
      }
      return ambientRefs.current[key];
    },
    []
  );

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

  const stopAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  }, []);

  const toggleAmbient = useCallback(
    (key: string, src: string) => {
      const audio = getOrCreateAudio(key, src, true);
      const current = ambients[key];

      if (current?.active) {
        audio.pause();
        setAmbients((prev) => ({
          ...prev,
          [key]: { ...prev[key], active: false },
        }));
      } else {
        audio.volume = current?.volume ?? 0.5;
        audio.play().catch(() => {});
        setAmbients((prev) => ({
          ...prev,
          [key]: { active: true, volume: prev[key]?.volume ?? 0.5 },
        }));
      }
    },
    [ambients, getOrCreateAudio]
  );

  const setAmbientVolume = useCallback(
    (key: string, volume: number) => {
      const audio = ambientRefs.current[key];
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
      }
      setAmbients((prev) => ({
        ...prev,
        [key]: { ...prev[key], volume },
      }));
    },
    []
  );

  return {
    playAlarm,
    stopAlarm,
    toggleAmbient,
    setAmbientVolume,
    ambients,
  };
}

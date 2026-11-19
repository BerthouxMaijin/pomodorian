"use client";

import { useRef, useCallback, useEffect } from "react";
import {
  ALARM_SOUNDS,
  AMBIENT_SOUNDS,
  LOFI_KEY,
  LOFI_TRACKS,
} from "@/lib/constants";
import { STORAGE_KEYS } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";

interface AmbientState {
  [key: string]: { active: boolean; volume: number };
}

// One alarm sequence: the same element rung up to maxRings times.
interface AlarmRun {
  audio: HTMLAudioElement;
  volume: number;
  rings: number;
  maxRings: number;
  timers: ReturnType<typeof setTimeout>[];
  onEnded: (() => void) | null;
}

// A single ring lasts 2.5 to 4 s and was easy to miss, so an unattended alarm
// repeats: 5 rings in total, 8 s apart (start to start), about 36 s of alarm.
const ALARM_RINGS = 5;
const ALARM_REPEAT_INTERVAL_MS = 8000;
// Input this recent, on a visible tab, means the person is at the page.
const PRESENCE_WINDOW_MS = 5000;
// While the alarm rings, ambients drop to this fraction of their level (about
// -14 dB), over DUCK_FADE_MS, and come back the same way afterwards.
const DUCK_LEVEL = 0.2;
const DUCK_FADE_MS = 300;
// Used when a ring's duration is unknown (metadata not loaded yet).
const RING_BACKSTOP_MS = 5000;
// Quiet breaks: ambients fade out over this once a break has begun and the
// alarm is done, and fade back in over QUIET_RETURN_MS with the next pomodoro.
const QUIET_FADE_MS = 1500;
const QUIET_RETURN_MS = 800;
const clampVolume = (v: number) => Math.max(0, Math.min(1, v));
const INPUT_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "wheel",
  "touchstart",
] as const;

// Alarm keys come from stored settings, so they are looked up as plain strings:
// an unknown key simply plays nothing.
const ALARM_SOURCES: Record<string, { src: string } | undefined> = ALARM_SOUNDS;

export function useSound() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  // Persisted: someone who built a mix should find it again on their next
  // visit instead of rebuilding it every time.
  const [ambients, setAmbients, hydrated] = useLocalStorage<AmbientState>(
    STORAGE_KEYS.AMBIENTS,
    {}
  );

  const crossfadeRefs = useRef<Record<string, HTMLAudioElement>>({});
  const pendingRefs = useRef<Record<string, HTMLAudioElement>>({});
  const fadeIntervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const handoffKeys = useRef<Record<string, true>>({});

  // Quiet breaks (setting pauseAmbientsOnBreak), driven by setAmbientsQuiet.
  // The stored mix is never touched: the mixer keeps showing the sounds as
  // active, only their playback stops. `quietKeys` are the ambients this
  // silenced; crossfades and hand-offs leave them alone until they come back.
  const quiet = useRef(false);
  const quietPending = useRef(false); // asked while the alarm rings
  const quietKeys = useRef<Record<string, true>>({});
  const returningKeys = useRef<Record<string, true>>({}); // fading back in
  const quietDuckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // pauseAllAmbients in force (timer paused, Never Dumb exercise): leaving the
  // quiet break must not override it.
  const held = useRef(false);
  const ambientsRef = useRef(ambients);
  useEffect(() => {
    ambientsRef.current = ambients;
  }, [ambients]);

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

  // Ambient volumes go through setVol / getVol. The level a fade or a slider
  // asks for (the "logical" volume) is kept per element, and what reaches the
  // speaker is that level times the duck factor. Fades, crossfades and the lofi
  // hand-off keep working in logical levels, so ducking for the alarm can never
  // be baked into a fade target, and the stored mix is never touched.
  const logicalVolumes = useRef(new WeakMap<HTMLAudioElement, number>());
  const duckLevel = useRef(1);
  const setVol = useCallback((audio: HTMLAudioElement, volume: number) => {
    const v = clampVolume(volume);
    logicalVolumes.current.set(audio, v);
    audio.volume = clampVolume(v * duckLevel.current);
  }, []);
  const getVol = (audio: HTMLAudioElement): number =>
    logicalVolumes.current.get(audio) ?? audio.volume;

  const createBufferedAudio = (src: string, loop: boolean): HTMLAudioElement => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = loop;
    setVol(audio, 0);
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
    let step = 0;

    setVol(audio, from);
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(1, step / steps);
      setVol(audio, from + (to - from) * progress);
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
    if (quietKeys.current[key] || returningKeys.current[key]) return;
    handoffKeys.current[key] = true;
    const targetVolume = getVol(audio);

    const beginNext = () => {
      const next =
        pendingRefs.current[key] ?? createBufferedAudio(nextSrc(), false);
      delete pendingRefs.current[key];
      next.loop = false;
      setVol(next, 0);
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
      setVol(audio, targetVolume);
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
      if (quietKeys.current[key] || returningKeys.current[key]) return;
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
        const targetVolume = getVol(audio);
        let step = 0;
        const fade = setInterval(() => {
          step++;
          const progress = step / fadeSteps;
          setVol(next, Math.min(targetVolume, targetVolume * progress));
          setVol(audio, Math.max(0, targetVolume * (1 - progress)));
          if (step >= fadeSteps) {
            clearInterval(fade);
            delete fadeIntervals.current[key];
            audio.pause();
            audio.currentTime = 0;
            setVol(audio, targetVolume);
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
    delete returningKeys.current[key];
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

  // Restore a persisted mix. Browsers refuse audio.play() until the page has
  // seen a user gesture, so a saved mix cannot simply start on load: the mixer
  // shows its buttons as active right away, and the sound joins on the first
  // click or keypress. Runs once, when localStorage has been read.
  useEffect(() => {
    if (!hydrated) return;
    const restore = Object.entries(ambients).filter(([, s]) => s.active);
    if (restore.length === 0) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      for (const [key, state] of restore) {
        const sound = AMBIENT_SOUNDS.find((s) => s.key === key);
        if (!sound) continue;
        const audio = getOrCreateAudio(key, sound.src);
        setVol(audio, state.volume);
        // In a quiet break the mix waits for the next pomodoro.
        if (quiet.current) {
          quietKeys.current[key] = true;
          continue;
        }
        audio.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on hydration; `ambients` is the stored mix at that moment and getOrCreateAudio only touches refs
  }, [hydrated]);

  // ---------- Alarm ----------
  // One element per alarm sound, created once and reused. Safari (macOS and
  // iOS) only lets an element play without a user gesture if that same element
  // was already started from one, so a fresh `new Audio()` at completion time
  // was refused there. primeAlarm() starts each element, muted, inside the
  // START gesture; the completion then replays those same elements.
  const alarmEls = useRef<Record<string, HTMLAudioElement>>({});
  const primedAlarms = useRef<Record<string, true>>({});
  const alarmRun = useRef<AlarmRun | null>(null);
  const lastInputAt = useRef(0);
  const duckTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAlarmElement = (soundKey: string): HTMLAudioElement | null => {
    const sound = ALARM_SOURCES[soundKey];
    if (!sound) return null;
    let audio = alarmEls.current[soundKey];
    if (!audio) {
      audio = new Audio(sound.src);
      audio.preload = "auto";
      alarmEls.current[soundKey] = audio;
    }
    return audio;
  };

  // Push the current duck factor to every live ambient element. Only elements
  // with a known logical level are touched, so nothing is multiplied twice.
  const applyDuck = () => {
    const live = [
      ...Object.values(audioRefs.current),
      ...Object.values(crossfadeRefs.current),
    ];
    for (const el of live) {
      const v = logicalVolumes.current.get(el);
      if (v !== undefined) el.volume = clampVolume(v * duckLevel.current);
    }
  };

  // Ramp the duck factor toward `target`. Its own timer, not fadeIntervals:
  // crossfades and hand-offs keep running underneath, in logical levels.
  // Progress follows the clock, so a throttled timer still lands on time.
  const duckAmbients = (target: number) => {
    if (duckTimer.current) clearInterval(duckTimer.current);
    duckTimer.current = null;
    const from = duckLevel.current;
    if (from === target) return;
    const startedAt = Date.now();
    duckTimer.current = setInterval(() => {
      const progress = Math.min(1, (Date.now() - startedAt) / DUCK_FADE_MS);
      duckLevel.current = from + (target - from) * progress;
      applyDuck();
      if (progress >= 1 && duckTimer.current) {
        clearInterval(duckTimer.current);
        duckTimer.current = null;
      }
    }, 30);
  };

  // End a run: no more rings, ambients come back up. `cut` also silences the
  // ring in progress (a new timer started); otherwise it has already ended.
  const finishRun = (run: AlarmRun, cut: boolean) => {
    for (const t of run.timers) clearTimeout(t);
    run.timers = [];
    if (run.onEnded) run.audio.removeEventListener("ended", run.onEnded);
    run.onEnded = null;
    if (cut) {
      run.audio.pause();
      run.audio.currentTime = 0;
    }
    if (alarmRun.current === run) {
      alarmRun.current = null;
      // A quiet break waiting for the alarm: fade out from the ducked level,
      // and lift the duck only once everything is silent (no swell between).
      if (quietPending.current) beginQuietFade();
      else duckAmbients(1);
    }
  };

  const beginQuietFade = () => {
    quietPending.current = false;
    for (const [key, audio] of Object.entries(audioRefs.current)) {
      if (!ambientsRef.current[key]?.active) continue;
      quietKeys.current[key] = true;
      if (audio.paused) continue;
      abortCrossfade(key);
      fadeVolume(key, audio, getVol(audio), 0, QUIET_FADE_MS / 1000, () => {
        if (quietKeys.current[key]) audio.pause();
      });
    }
    if (quietDuckTimeout.current) clearTimeout(quietDuckTimeout.current);
    quietDuckTimeout.current = null;
    if (duckLevel.current !== 1 || duckTimer.current) {
      quietDuckTimeout.current = setTimeout(() => {
        quietDuckTimeout.current = null;
        if (!quiet.current || alarmRun.current) return;
        if (duckTimer.current) clearInterval(duckTimer.current);
        duckTimer.current = null;
        duckLevel.current = 1;
        applyDuck();
      }, QUIET_FADE_MS + 100);
    }
  };

  // Back from a quiet break: the silenced ambients fade in at their stored
  // volume, unless something else holds them paused (it resumes them itself).
  const liftQuiet = () => {
    quietPending.current = false;
    if (quietDuckTimeout.current) clearTimeout(quietDuckTimeout.current);
    quietDuckTimeout.current = null;
    if (!alarmRun.current && duckLevel.current !== 1) duckAmbients(1);
    const keys = Object.keys(quietKeys.current);
    quietKeys.current = {};
    for (const key of keys) {
      const fade = fadeIntervals.current[key];
      if (fade) {
        clearInterval(fade);
        delete fadeIntervals.current[key];
      }
      const audio = audioRefs.current[key];
      if (!audio) continue;
      const state = ambientsRef.current[key];
      if (held.current || !state?.active) {
        if (!audio.paused) audio.pause();
        continue;
      }
      const from = audio.paused ? 0 : getVol(audio);
      setVol(audio, from);
      audio.play().catch(() => {});
      returningKeys.current[key] = true;
      fadeVolume(key, audio, from, state.volume, QUIET_RETURN_MS / 1000, () => {
        delete returningKeys.current[key];
      });
    }
  };

  // No ring after the current one: let it play out, then finish the run.
  const wrapUp = (run: AlarmRun) => {
    for (const t of run.timers) clearTimeout(t);
    run.timers = [];
    run.maxRings = run.rings;
    if (run.audio.paused || run.audio.ended) {
      finishRun(run, false);
      return;
    }
    if (run.onEnded) return;
    const onEnded = () => finishRun(run, false);
    run.onEnded = onEnded;
    run.audio.addEventListener("ended", onEnded);
    // Backstop in case "ended" never arrives (stalled or refused playback).
    const left = Number.isFinite(run.audio.duration)
      ? (run.audio.duration - run.audio.currentTime) * 1000
      : RING_BACKSTOP_MS;
    run.timers.push(setTimeout(onEnded, Math.max(0, left) + 1000));
  };

  const ring = (run: AlarmRun) => {
    if (alarmRun.current !== run) return;
    run.rings++;
    const audio = run.audio;
    audio.muted = false;
    audio.volume = clampVolume(run.volume);
    audio.currentTime = 0;
    audio.play().catch(() => {
      if (alarmRun.current === run && run.rings >= run.maxRings) {
        finishRun(run, false);
      }
    });
    if (run.rings < run.maxRings) {
      run.timers.push(setTimeout(() => ring(run), ALARM_REPEAT_INTERVAL_MS));
    } else {
      wrapUp(run);
    }
  };

  const startAlarm = (soundKey: string, volume: number, maxRings: number) => {
    const audio = getAlarmElement(soundKey);
    if (!audio) return;
    // Replace any run in progress without bringing the ambients up in between.
    const previous = alarmRun.current;
    alarmRun.current = null;
    if (previous) finishRun(previous, true);
    const run: AlarmRun = {
      audio,
      volume,
      rings: 0,
      maxRings,
      timers: [],
      onEnded: null,
    };
    alarmRun.current = run;
    duckAmbients(DUCK_LEVEL);
    ring(run);
  };

  const stopAlarm = useCallback(() => {
    const run = alarmRun.current;
    if (run) finishRun(run, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finishRun only touches refs
  }, []);

  // Call from inside a user gesture (START, resume). Stops a ringing alarm,
  // since starting the next timer means it was heard, then unlocks every alarm
  // element once: muted play, paused as soon as it starts. No audible blip.
  const primeAlarm = useCallback(() => {
    stopAlarm();
    for (const key of Object.keys(ALARM_SOUNDS)) {
      if (primedAlarms.current[key]) continue;
      const audio = getAlarmElement(key);
      if (!audio) continue;
      primedAlarms.current[key] = true;
      audio.muted = true;
      audio.play().then(
        () => {
          if (alarmRun.current?.audio === audio) return; // a real ring took over
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        },
        () => {
          // Refused: try again on the next gesture.
          delete primedAlarms.current[key];
          if (alarmRun.current?.audio !== audio) audio.muted = false;
        }
      );
    }
  }, [stopAlarm]);

  // Timer completion. Rings up to ALARM_RINGS times, ALARM_REPEAT_INTERVAL_MS
  // apart, until the person reacts (any pointer or key input, or a new timer
  // started by hand). Someone visibly at the page gets a single ring, and so
  // does a page nobody has touched yet (a timer that ended while it was closed).
  const playAlarm = useCallback((soundKey: string, volume: number) => {
    const sinceInput = Date.now() - lastInputAt.current;
    const present =
      document.visibilityState === "visible" &&
      lastInputAt.current > 0 &&
      sinceInput < PRESENCE_WINDOW_MS;
    const touched =
      lastInputAt.current > 0 || Object.keys(primedAlarms.current).length > 0;
    startAlarm(soundKey, volume, present || !touched ? 1 : ALARM_RINGS);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startAlarm only touches refs
  }, []);

  // Settings preview: one ring, from a gesture, so it also unlocks that sound.
  const previewAlarm = useCallback((soundKey: string, volume: number) => {
    if (!ALARM_SOURCES[soundKey]) return;
    primedAlarms.current[soundKey] = true;
    startAlarm(soundKey, volume, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startAlarm only touches refs
  }, []);

  // Track input (presence, and "the alarm was noticed"), and make sure nothing
  // keeps ringing or stays ducked once the component unmounts.
  useEffect(() => {
    const onInput = () => {
      lastInputAt.current = Date.now();
      const run = alarmRun.current;
      if (run && run.rings < run.maxRings) wrapUp(run);
    };
    for (const type of INPUT_EVENTS) {
      window.addEventListener(type, onInput, { capture: true, passive: true });
    }
    const els = alarmEls.current;
    return () => {
      for (const type of INPUT_EVENTS) {
        window.removeEventListener(type, onInput, { capture: true });
      }
      stopAlarm();
      if (quietDuckTimeout.current) clearTimeout(quietDuckTimeout.current);
      quietDuckTimeout.current = null;
      for (const el of Object.values(els)) el.pause();
      if (duckTimer.current) clearInterval(duckTimer.current);
      duckTimer.current = null;
      duckLevel.current = 1;
      applyDuck();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- wrapUp and applyDuck only touch refs
  }, [stopAlarm]);

  // The start sound is always played from a gesture (START, resume, start
  // from the AI planner): the moment to unlock the alarm.
  const playClick = useCallback(() => {
    primeAlarm();
    const audio = new Audio("/sounds/tick-start.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }, [primeAlarm]);

  const toggleAmbient = useCallback((key: string, src: string) => {
    setAmbients((prev) => {
      const current = prev[key];
      const audio = getOrCreateAudio(key, src);

      // A sound switched on or off by hand is out of the quiet break's hands.
      delete quietKeys.current[key];
      if (current?.active) {
        abortCrossfade(key);
        audio.pause();
        audio.currentTime = 0;
        return { ...prev, [key]: { ...current, active: false } };
      } else {
        const volume = current?.volume ?? 0.5;
        setVol(audio, volume);
        audio.play().catch((err) => console.warn("Audio play failed:", err));
        return { ...prev, [key]: { active: true, volume } };
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getOrCreateAudio is stable (only uses refs)
  }, []);

  const setAmbientVolume = useCallback((key: string, volume: number) => {
    const audio = audioRefs.current[key];
    if (audio) {
      setVol(audio, volume);
    }
    setAmbients((prev) => ({
      ...prev,
      [key]: { ...prev[key], volume },
    }));
  }, [setAmbients, setVol]);

  const pauseAllAmbients = useCallback(() => {
    held.current = true;
    for (const key of Object.keys(audioRefs.current)) {
      abortCrossfade(key);
      const audio = audioRefs.current[key];
      if (!audio.paused) audio.pause();
    }
  }, []);

  const resumeAllAmbients = useCallback(() => {
    held.current = false;
    for (const [key, state] of Object.entries(ambients)) {
      const audio = audioRefs.current[key];
      // Silenced by a quiet break: they come back with the next pomodoro.
      if (quiet.current && quietKeys.current[key]) continue;
      if (state.active && audio) {
        // Restore volume: an aborted crossfade may have left it mid-fade
        setVol(audio, state.volume);
        audio.play().catch(() => {});
      }
    }
  }, [ambients, setVol]);

  // Quiet breaks: true once a break has begun (the fade waits for the alarm
  // to finish), false when the next pomodoro starts or the setting goes off.
  const setAmbientsQuiet = useCallback((on: boolean) => {
    if (quiet.current === on) return;
    quiet.current = on;
    if (!on) {
      liftQuiet();
      return;
    }
    if (alarmRun.current) quietPending.current = true;
    else beginQuietFade();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- liftQuiet and beginQuietFade only touch refs
  }, []);

  return {
    setAmbientsQuiet,
    playAlarm,
    previewAlarm,
    primeAlarm,
    playClick,
    stopAlarm,
    toggleAmbient,
    setAmbientVolume,
    pauseAllAmbients,
    resumeAllAmbients,
    ambients,
  };
}

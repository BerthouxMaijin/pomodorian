"use client";

import { useEffect, useState } from "react";

/**
 * Wall-clock countdown toward `endTime` (ms epoch). Ticks every 200ms and
 * always recomputes from the clock, so a throttled tab never drifts.
 * Calls `onEnd` once when the deadline passes.
 */
export function useCountdown(endTime: number | null, onEnd?: () => void) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endTime === null) return;
    let ended = false;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (!ended && current >= endTime) {
        ended = true;
        onEnd?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [endTime, onEnd]);

  const remainingMs = endTime === null ? 0 : Math.max(0, endTime - now);
  return { now, remainingMs, remainingSeconds: Math.ceil(remainingMs / 1000) };
}

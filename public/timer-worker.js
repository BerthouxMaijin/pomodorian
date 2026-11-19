// Heartbeat for the countdown. Browsers throttle timers in a background tab
// (down to one per minute in Chrome after five hidden minutes), which made the
// alarm ring late for anyone working in another tab. A worker keeps a steady
// beat there. It only says "look at the clock": the remaining time is still
// computed from endTime on the main thread.
let beat = null;

self.onmessage = (event) => {
  if (event.data === "start") {
    if (beat === null) beat = setInterval(() => self.postMessage("tick"), 250);
  } else if (event.data === "stop") {
    if (beat !== null) clearInterval(beat);
    beat = null;
  }
};

"use client";

import { useEffect } from "react";

/** Idle time before everything but the timer fades back. */
export const FOCUS_IDLE_MS = 4000;

const ATTR = "data-focus-mode";

/**
 * Focus mode: while `active` (a pomodoro running, focus mode on), the areas
 * marked `data-focus-fade` fade back after a few seconds without pointer or
 * keyboard activity, and come back at the first sign of life.
 *
 * Driven by an attribute on <html> and CSS (globals.css), never by React
 * state: the page would otherwise re-render on every mouse move. "armed"
 * means the mode is on but nothing is faded, "dim" means faded. Opacity only:
 * everything stays clickable, focusable and read by screen readers.
 *
 * Nothing fades while the timer is scrolled out of view (the person is
 * reading the page), or while a text field has the focus (they are typing a
 * task and may pause to think).
 */
export function useFocusMode(active: boolean, anchorSelector: string) {
  useEffect(() => {
    const root = document.documentElement;
    if (!active) {
      root.removeAttribute(ATTR);
      return;
    }

    root.setAttribute(ATTR, "armed");
    let lastActivity = Date.now();
    let timeout: number | undefined;
    // Ratio of the timer ring on screen, kept by an observer instead of a
    // layout read on every check.
    let anchorVisible = true;

    const typing = () => {
      const el = document.activeElement;
      return (
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement ||
        (el instanceof HTMLInputElement &&
          !["button", "checkbox", "radio", "range", "submit", "reset"].includes(el.type)) ||
        (el instanceof HTMLElement && el.isContentEditable)
      );
    };

    const check = () => {
      timeout = undefined;
      const idle = Date.now() - lastActivity;
      if (idle < FOCUS_IDLE_MS) {
        timeout = window.setTimeout(check, FOCUS_IDLE_MS - idle);
        return;
      }
      if (anchorVisible && !typing()) root.setAttribute(ATTR, "dim");
    };

    // Cheap on purpose: pointermove fires many times a second. One timestamp,
    // one attribute write when it changes, at most one pending timeout.
    const wake = () => {
      lastActivity = Date.now();
      if (root.getAttribute(ATTR) !== "armed") root.setAttribute(ATTR, "armed");
      if (timeout === undefined) timeout = window.setTimeout(check, FOCUS_IDLE_MS);
    };

    let observer: IntersectionObserver | undefined;
    const anchor = document.querySelector(anchorSelector);
    if (anchor && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          anchorVisible = entry.intersectionRatio >= 0.5;
          if (!anchorVisible) wake();
        },
        { threshold: [0, 0.5, 1] }
      );
      observer.observe(anchor);
    }

    const events = ["pointermove", "pointerdown", "touchstart", "keydown", "wheel", "focusin"] as const;
    const opts = { passive: true, capture: true } as const;
    for (const type of events) window.addEventListener(type, wake, opts);
    window.addEventListener("scroll", wake, opts);
    timeout = window.setTimeout(check, FOCUS_IDLE_MS);

    return () => {
      for (const type of events) window.removeEventListener(type, wake, opts);
      window.removeEventListener("scroll", wake, opts);
      observer?.disconnect();
      if (timeout !== undefined) window.clearTimeout(timeout);
      root.removeAttribute(ATTR);
    };
  }, [active, anchorSelector]);
}

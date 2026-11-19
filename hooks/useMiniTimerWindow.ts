"use client";

import { useSyncExternalStore } from "react";

// Document Picture-in-Picture: an always-on-top window holding a document of
// our own. Chromium desktop browsers (116+) and Firefox 151+; absent from
// Safari and from phones. Not in the TypeScript DOM lib yet.
interface DocumentPictureInPictureOptions {
  width?: number;
  height?: number;
  disallowReturnToOpener?: boolean;
  preferInitialWindowPlacement?: boolean;
}
interface DocumentPictureInPicture extends EventTarget {
  readonly window: Window | null;
  requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>;
}
type WindowWithPip = Window & { documentPictureInPicture?: DocumentPictureInPicture };

// Asked size; the browser clamps it to what it allows and the person can
// resize. Both or neither must be given (RangeError otherwise).
const WIDTH = 260;
const HEIGHT = 180;

function getApi(): DocumentPictureInPicture | null {
  if (typeof window === "undefined") return null;
  return (window as WindowWithPip).documentPictureInPicture ?? null;
}

// A page has at most one Picture-in-Picture window, so the state is a module
// store: the header button and the page's portal read the same window
// without threading props through the page.
let current: Window | null = null;
let opening = false;
let stopFollowing: (() => void) | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function set(win: Window | null) {
  if (current === win) return;
  stopFollowing?.();
  stopFollowing = null;
  current = win;
  for (const listener of listeners) listener();
}

/**
 * The new window starts as an empty about:blank document: nothing of the page
 * comes with it. Copy the stylesheets (links by absolute URL, inline styles
 * by their rules) and the font variables that next/font puts on <html> as
 * classes.
 */
function copyStyles(target: Document) {
  for (const sheet of Array.from(document.styleSheets)) {
    if (sheet.href) {
      const link = target.createElement("link");
      link.rel = "stylesheet";
      link.href = sheet.href;
      if (sheet.media.mediaText) link.media = sheet.media.mediaText;
      target.head.appendChild(link);
      continue;
    }
    try {
      const style = target.createElement("style");
      style.textContent = Array.from(sheet.cssRules, (rule) => rule.cssText).join("\n");
      target.head.appendChild(style);
    } catch {
      // Rules the page may not read: skip them, the window stays usable.
    }
  }
  target.documentElement.className = document.documentElement.className;
}

/** Copies the page's data-theme now and on every change, until stopped. */
function followTheme(target: Document): () => void {
  const root = document.documentElement;
  const sync = () => {
    const theme = root.getAttribute("data-theme");
    if (theme) target.documentElement.setAttribute("data-theme", theme);
    else target.documentElement.removeAttribute("data-theme");
  };
  sync();
  const observer = new MutationObserver(sync);
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export async function openMiniTimer() {
  const api = getApi();
  if (!api || opening || current) return;
  opening = true;
  try {
    // Reached synchronously from the click: requestWindow needs transient
    // user activation (NotAllowedError without it).
    const win = await api.requestWindow({ width: WIDTH, height: HEIGHT });
    copyStyles(win.document);
    // Closed by its own close button, by "back to tab", by closeMiniTimer():
    // pagehide is the one event that covers every way out.
    win.addEventListener(
      "pagehide",
      () => {
        if (current === win) set(null);
      },
      { once: true }
    );
    set(win);
    stopFollowing = followTheme(win.document);
  } catch {
    // Refused (no activation, disabled in the browser): the page carries on.
  } finally {
    opening = false;
  }
}

export function closeMiniTimer() {
  const win = current;
  set(null);
  win?.close();
}

export function toggleMiniTimer() {
  if (current) closeMiniTimer();
  else void openMiniTimer();
}

/** Title and language of the mini window, which follow the app's language. */
export function labelMiniTimer(win: Window, title: string, lang: string) {
  win.document.title = title;
  win.document.documentElement.lang = lang;
}

const noSubscribe =() => () => {};

/**
 * Whether the browser can open the mini timer. False on the server and while
 * hydrating, so the prerendered HTML never has the button and nothing shifts
 * in a browser without the API.
 */
export function useMiniTimerSupported(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => getApi() !== null,
    () => false
  );
}

/** The open mini timer window, or null. */
export function useMiniTimerWindow(): Window | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null
  );
}

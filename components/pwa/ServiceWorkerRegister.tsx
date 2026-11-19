"use client";

import { useEffect } from "react";

// Registers public/sw.js (offline app shell + notifications on Android).
// Production only, once the page has loaded, so it never competes with the
// first paint. No reload on update: the next navigation picks up the new
// deploy, and a running pomodoro is never interrupted.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        const registration = await navigator.serviceWorker.ready;
        // Build files loaded before the worker was in control (first visit)
        // would otherwise be missing offline.
        const urls = performance
          .getEntriesByType("resource")
          .map((entry) => new URL(entry.name))
          .filter(
            (url) =>
              url.origin === window.location.origin &&
              url.pathname.startsWith("/_next/static/")
          )
          .map((url) => url.pathname + url.search);
        registration.active?.postMessage({ type: "cache-urls", urls });
      } catch {
        // No service worker: the app works as before, online only.
      }
    };

    if (document.readyState === "complete") {
      void register();
      return;
    }
    const onLoad = () => void register();
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}

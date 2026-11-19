// Pomodorian service worker.
//
// What it does: lets the app open without network (network first for pages,
// cached copy when offline), keeps the hashed build files and the few small
// files the timer needs, and shows the end-of-timer notification on Android,
// where Chrome only accepts ServiceWorkerRegistration.showNotification().
//
// HOW TO KILL IT (if a bad version ever ships): replace this whole file with
// the block below and deploy. Every browser that checks for an update (each
// page load, at least once a day) installs it at once, which drops every
// cache and unregisters the worker. It has no fetch handler, so open tabs go
// straight to the network until they are closed. In the same deploy, remove
// <ServiceWorkerRegister /> from app/layout.tsx, or each visit registers the
// kill switch again (harmless, but pointless). Leave the kill switch in place
// for a few weeks before deleting sw.js.
//
//   self.addEventListener("install", () => self.skipWaiting());
//   self.addEventListener("activate", (event) => {
//     event.waitUntil((async () => {
//       for (const key of await caches.keys()) await caches.delete(key);
//       await self.registration.unregister();
//     })());
//   });
//
// New deploys: pages are network first, so a new deploy is picked up on the
// next load. Bump VERSION whenever this file's caching rules change: the
// caches of the previous version are deleted on activate.

const VERSION = "v2";
const PAGES = `pomodorian-pages-${VERSION}`;
const STATIC = `pomodorian-static-${VERSION}`;
const AUDIO = `pomodorian-audio-${VERSION}`;
const CURRENT = [PAGES, STATIC, AUDIO];

const MAX_PAGES = 25;
const MAX_STATIC = 200;

// Small sounds cached in full and answered with byte ranges. The ambient
// tracks (several megabytes each) are never touched: they go to the network.
const SMALL_AUDIO = [
  "/sounds/alarm-gentle.mp3",
  "/sounds/alarm-classic.mp3",
  "/sounds/alarm-bell.mp3",
  "/sounds/tick-start.mp3",
];

// Unhashed files the app shell needs: served from cache, refreshed in the
// background.
const SHELL_FILES = [
  "/timer-worker.js",
  "/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline | Pomodorian</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#f5f5f5;font-family:system-ui,sans-serif;text-align:center;padding:24px}a{color:#ef4444}</style></head><body><div><h1>You are offline</h1><p>This page has not been saved on this device yet.</p><p><a href="/">Open the timer</a></p></div></body></html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const res = await fetch("/", { cache: "no-store" });
      if (res.ok) {
        const html = await res.clone().text();
        await pages.put("/", res);
        await precache(STATIC, [...SHELL_FILES, ...staticUrlsIn(html)]);
      }
      await precache(AUDIO, SMALL_AUDIO);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith("pomodorian-") && !CURRENT.includes(key)) {
          await caches.delete(key);
        }
      }
      await self.clients.claim();
    })()
  );
});

// The page sends the build files it loaded before this worker took control
// (first visit), so they are available offline too.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "cache-urls" || !Array.isArray(data.urls)) return;
  const urls = data.urls.filter(
    (u) => typeof u === "string" && u.startsWith("/_next/static/")
  );
  event.waitUntil(precache(STATIC, urls));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_vercel/")) return;
  // React Server Component payloads (client-side navigations, prefetches).
  if (request.headers.has("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(event));
    return;
  }
  if (url.search === "" && SMALL_AUDIO.includes(url.pathname)) {
    event.respondWith(smallAudio(request, url.pathname));
    return;
  }
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event, request));
    return;
  }
  if (url.search === "" && SHELL_FILES.includes(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event, request));
    return;
  }
  // Everything else (ambient sounds, images, feeds, manifest...) is left to
  // the browser and the network.
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const app =
        windows.find((c) => new URL(c.url).pathname === "/") || windows[0];
      if (app) {
        await app.focus();
        return;
      }
      await self.clients.openWindow("/");
    })()
  );
});

// ---------------------------------------------------------------- strategies

async function networkFirstPage(event) {
  const request = event.request;
  const url = new URL(request.url);
  // `/?focus=50` and `/` are the same page.
  const key = url.pathname;
  try {
    const res = await fetch(request);
    if (res.ok && res.type === "basic" && !res.redirected) {
      const copy = res.clone();
      event.waitUntil(
        (async () => {
          const cache = await caches.open(PAGES);
          await cache.put(key, copy);
          await trim(PAGES, MAX_PAGES);
        })()
      );
    }
    return res;
  } catch {
    const cache = await caches.open(PAGES);
    const cached = await cache.match(key);
    if (cached) return cached;
    return new Response(OFFLINE_HTML, {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

async function cacheFirst(event, request) {
  const cache = await caches.open(STATIC);
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;
  const res = await fetch(request);
  if (res.status === 200 && res.type === "basic") {
    const copy = res.clone();
    event.waitUntil(
      (async () => {
        await cache.put(request, copy);
        await trim(STATIC, MAX_STATIC);
      })()
    );
  }
  return res;
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(STATIC);
  const cached = await cache.match(request, { ignoreVary: true });
  const refresh = fetch(request)
    .then(async (res) => {
      if (res.status === 200 && res.type === "basic") {
        await cache.put(request, res.clone());
      }
      return res;
    })
    .catch(() => null);
  if (cached) {
    event.waitUntil(refresh);
    return cached;
  }
  const res = await refresh;
  return res || Response.error();
}

// Media elements ask for byte ranges, and cache.put() refuses the 206 answers,
// so the full file (200) is cached and ranges are cut from it here.
async function smallAudio(request, path) {
  try {
    const cache = await caches.open(AUDIO);
    let full = await cache.match(path);
    if (!full) {
      const res = await fetch(path);
      if (res.status !== 200) return res;
      await cache.put(path, res.clone());
      full = res;
    }
    const range = request.headers.get("Range");
    if (!range) return full;

    const body = await full.arrayBuffer();
    const size = body.byteLength;
    const type = full.headers.get("Content-Type") || "audio/mpeg";
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    let start;
    let end;
    if (m && m[1] !== "") {
      start = Number(m[1]);
      end = m[2] !== "" ? Math.min(Number(m[2]), size - 1) : size - 1;
    } else if (m && m[2] !== "") {
      // Suffix range: the last N bytes.
      start = Math.max(0, size - Number(m[2]));
      end = size - 1;
    }
    if (start === undefined || start > end || start >= size) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    return new Response(body.slice(start, end + 1), {
      status: 206,
      headers: {
        "Content-Type": type,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return fetch(request);
  }
}

// ------------------------------------------------------------------- helpers

async function precache(cacheName, urls) {
  const cache = await caches.open(cacheName);
  await Promise.all(
    [...new Set(urls)].map(async (u) => {
      try {
        if (await cache.match(u)) return;
        const res = await fetch(u);
        if (res.status === 200) await cache.put(u, res);
      } catch {
        // One missing file must not fail the install.
      }
    })
  );
  if (cacheName === STATIC) await trim(STATIC, MAX_STATIC);
}

function staticUrlsIn(html) {
  const found = html.match(/\/_next\/static\/[^"'\s)\\]+/g) || [];
  return found.filter((u) => /\.(js|css|woff2?)$/.test(u.split("?")[0]));
}

// Keys come back in insertion order: drop the oldest entries first, so files
// from old deploys do not pile up.
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

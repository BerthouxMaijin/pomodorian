"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// The article body is injected via dangerouslySetInnerHTML, so Amazon links
// can't carry onClick handlers — a capture-phase delegated listener is the
// only way to measure outbound purchase intent (affiliate fake-door metric).
export function OutboundClickTracker({
  slug,
  lang,
}: {
  slug: string;
  lang: string;
}) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      let hostname = "";
      try {
        hostname = new URL(href, window.location.origin).hostname;
      } catch {
        return;
      }
      if (!/(^|\.)amazon\.[a-z.]+$/.test(hostname)) return;
      const asin = /\/dp\/([A-Z0-9]{10})/.exec(href)?.[1] ?? null;
      track("amazon_click", { slug, lang, asin });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [slug, lang]);

  return null;
}

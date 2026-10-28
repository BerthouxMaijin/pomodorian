import { track as vercelTrack } from "@vercel/analytics";
import { resolveBrowserLocale } from "@/lib/i18n/locales";

type EventProps = Record<string, string | number | boolean | null>;

// Every event carries the visitor's resolved locale so activation/retention
// can be compared EN vs non-EN (i18n go/no-go decision).
export function track(event: string, props?: EventProps) {
  // vercelTrack silently DROPS events fired before <Analytics/> has injected
  // window.va (measured in prod: session_return reached 16 of 75 visitors).
  // Pre-install the same queue stub inject() would; it picks it up as-is.
  if (typeof window !== "undefined" && !window.va) {
    window.va = (...params) => {
      (window.vaq = window.vaq || []).push(params);
    };
  }
  const payload = {
    locale:
      typeof navigator === "undefined"
        ? "en"
        : resolveBrowserLocale(navigator.languages),
    ...props,
  };
  vercelTrack(event, payload);
  // Same event to GA4 (ConsentAnalytics defines window.gtag before hydration).
  // Consent mode decides what GA4 stores: cookies only after "Accept".
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

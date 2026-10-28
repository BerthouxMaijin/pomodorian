"use client";

import { STORAGE_KEY } from "@/components/ConsentAnalytics";

// Retire le consentement GA4 et efface ses cookies, puis recharge : le bandeau
// réapparaît et la personne peut refaire son choix.
function clearGaCookies() {
  const parts = window.location.hostname.split(".");
  const domains = parts.map((_, i) => parts.slice(i).join(".")).filter((d) => d.includes("."));
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expired;
    for (const domain of domains) document.cookie = `${expired}; domain=.${domain}`;
  }
}

export default function ConsentResetButton() {
  function reset() {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage indisponible : rien à effacer
    }
    clearGaCookies();
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={reset}
      className="mt-3 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-red-400/60 hover:text-red-400"
    >
      Change my analytics choice
    </button>
  );
}

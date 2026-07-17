"use client";

import { useEffect, useState } from "react";

// Seules lignes a adapter par site :
const GA_ID = "G-2BC8DCY0CX";
const TEXTS = {
  message: "This site uses Google Analytics to measure its audience.",
  accept: "Accept",
  decline: "Continue without accepting",
};

const STORAGE_KEY = "ga-consent";

type Consent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Snippet Google verbatim : consent default AVANT toute autre commande.
const GA_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
try {
  if (localStorage.getItem('${STORAGE_KEY}') === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GA_ID}');`;

function readStoredConsent(): Consent | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export default function ConsentAnalytics() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (readStoredConsent() === null) setShowBanner(true);
  }, []);

  function choose(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // localStorage indisponible (navigation privee) : le choix vaut pour la session
    }
    if (consent === "granted" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
    setShowBanner(false);
  }

  return (
    <>
      <script id="ga-consent-init" dangerouslySetInnerHTML={{ __html: GA_INIT }} />
      <script async src={"https://www.googletagmanager.com/gtag/js?id=" + GA_ID} />
      {showBanner && (
        <div
          role="region"
          aria-label={TEXTS.message}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "10px 16px",
            paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
            background: "rgba(17, 17, 17, 0.94)",
            color: "#f5f5f5",
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          <span>{TEXTS.message}</span>
          <button
            type="button"
            onClick={() => choose("granted")}
            style={{
              background: "#f5f5f5",
              color: "#111",
              border: 0,
              borderRadius: 999,
              padding: "6px 16px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {TEXTS.accept}
          </button>
          <button
            type="button"
            onClick={() => choose("denied")}
            style={{
              background: "transparent",
              color: "#cfcfcf",
              border: 0,
              textDecoration: "underline",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {TEXTS.decline}
          </button>
        </div>
      )}
    </>
  );
}

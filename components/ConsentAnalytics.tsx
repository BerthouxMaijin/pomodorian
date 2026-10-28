"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useBrowserLocale } from "@/hooks/useBrowserLocale";
import type { UiLocale } from "@/lib/i18n/locales";

// Seules lignes a adapter par site :
const GA_ID = "G-2BC8DCY0CX";
const TEXTS: Record<
  UiLocale,
  { title: string; message: string; privacy: string; accept: string; decline: string }
> = {
  en: {
    title: "Help us improve Pomodorian?",
    message:
      "With your consent, Google Analytics tells us which pages actually help you. No advertising cookies.",
    privacy: "Learn more",
    accept: "Accept",
    decline: "Decline",
  },
  fr: {
    title: "Un coup de main pour améliorer Pomodorian ?",
    message:
      "Avec ton accord, Google Analytics nous indique quelles pages te servent vraiment. Aucun cookie publicitaire.",
    privacy: "En savoir plus",
    accept: "Accepter",
    decline: "Refuser",
  },
  es: {
    title: "¿Nos ayudas a mejorar Pomodorian?",
    message:
      "Con tu permiso, Google Analytics nos muestra qué páginas te resultan útiles de verdad. Sin cookies publicitarias.",
    privacy: "Más información",
    accept: "Aceptar",
    decline: "Rechazar",
  },
  de: {
    title: "Hilfst du uns, Pomodorian zu verbessern?",
    message:
      "Mit deiner Zustimmung zeigt uns Google Analytics, welche Seiten dir wirklich helfen. Keine Werbe-Cookies.",
    privacy: "Mehr erfahren",
    accept: "Akzeptieren",
    decline: "Ablehnen",
  },
  pt: {
    title: "Nos ajuda a melhorar o Pomodorian?",
    message:
      "Com o seu consentimento, o Google Analytics nos mostra quais páginas realmente ajudam você. Nenhum cookie de publicidade.",
    privacy: "Saiba mais",
    accept: "Aceitar",
    decline: "Recusar",
  },
  it: {
    title: "Ci aiuti a migliorare Pomodorian?",
    message:
      "Con il tuo consenso, Google Analytics ci mostra quali pagine ti sono davvero utili. Nessun cookie pubblicitario.",
    privacy: "Scopri di più",
    accept: "Accetta",
    decline: "Rifiuta",
  },
  ja: {
    title: "Pomodorianの改善にご協力いただけますか？",
    message:
      "同意いただいた場合のみ、Google Analyticsで本当に役立っているページを把握します。広告用Cookieは使用しません。",
    privacy: "詳細",
    accept: "同意する",
    decline: "拒否する",
  },
  zh: {
    title: "帮助我们改进 Pomodorian？",
    message:
      "经你同意后，Google Analytics 会告诉我们哪些页面真正对你有帮助。不使用广告 Cookie。",
    privacy: "了解更多",
    accept: "接受",
    decline: "拒绝",
  },
};

// Les deux choix ont exactement le même poids visuel (exigence CNIL/RGPD).
const CHOICE_STYLE = {
  flex: "1 1 0",
  minHeight: 44,
  borderRadius: 999,
  border: "1px solid #f5f5f5",
  background: "#f5f5f5",
  color: "#111",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
} as const;

export const STORAGE_KEY = "ga-consent";
// 13 mois, plafond CNIL pour les cookies de mesure d'audience (défaut Google : 2 ans).
const COOKIE_EXPIRES_SECONDS = 395 * 24 * 60 * 60;

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
gtag('config', '${GA_ID}', { cookie_expires: ${COOKIE_EXPIRES_SECONDS} });`;

// Choix fait pendant cette session : sert de repli quand localStorage est
// indisponible (navigation privee), sinon le bandeau ne pourrait plus se fermer.
let sessionConsent: Consent | null = null;
const listeners = new Set<() => void>();

function readStoredConsent(): Consent | null {
  if (sessionConsent) return sessionConsent;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Cote serveur, on fait comme si le choix etait fait : pas de bandeau dans le HTML.
const serverSnapshot = (): Consent | null => "denied";

export default function ConsentAnalytics() {
  const showBanner =
    useSyncExternalStore(subscribe, readStoredConsent, serverSnapshot) === null;
  const locale = useBrowserLocale();

  function choose(consent: Consent) {
    sessionConsent = consent;
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // localStorage indisponible (navigation privee) : le choix vaut pour la session
    }
    if (consent === "granted" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
    listeners.forEach((listener) => listener());
  }

  const texts = TEXTS[locale];

  return (
    <>
      <script id="ga-consent-init" dangerouslySetInnerHTML={{ __html: GA_INIT }} />
      <script async src={"https://www.googletagmanager.com/gtag/js?id=" + GA_ID} />
      {showBanner && (
        <div
          role="region"
          aria-label={texts.title}
          lang={locale}
          style={{
            position: "fixed",
            left: 16,
            right: 16,
            bottom: "calc(16px + env(safe-area-inset-bottom))",
            zIndex: 9999,
            maxWidth: 440,
            margin: "0 auto",
            padding: 20,
            borderRadius: 16,
            background: "#111",
            color: "#f5f5f5",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{texts.title}</p>
          <p style={{ margin: "6px 0 16px", color: "#d4d4d4" }}>
            {texts.message}{" "}
            <Link href="/privacy" style={{ color: "#f5f5f5", textDecoration: "underline" }}>
              {texts.privacy}
            </Link>
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => choose("denied")} style={CHOICE_STYLE}>
              {texts.decline}
            </button>
            <button type="button" onClick={() => choose("granted")} style={CHOICE_STYLE}>
              {texts.accept}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

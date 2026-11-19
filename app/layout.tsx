import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/constants";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Runs before first paint: the saved theme is applied while the HTML is still
// being parsed, so a light theme user never sees the dark default flash by.
// A stored "dark" or "light" wins; anything else (no settings, no theme,
// "system") follows the device. The settings are re-read on every device
// change, so pages outside the app (blog, SEO, timers) follow it live too and
// an explicit choice made in the app is never overridden.
const THEME_INIT = `try{var m=matchMedia("(prefers-color-scheme: light)"),a=function(){var t;try{t=JSON.parse(localStorage.getItem("pomodorian_settings")||"null");t=t&&t.theme}catch(e){}document.documentElement.setAttribute("data-theme",t==="dark"||t==="light"?t:m.matches?"light":"dark")};a();m.addEventListener("change",a)}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pomodorian — Free AI Pomodoro Timer | Focus, Plan, Track",
  description:
    "Free Pomodoro timer with AI task planning. Describe your goal, get structured focus sessions. Built-in ambient sounds, analytics, and keyboard shortcuts.",
  keywords: [
    "pomodoro",
    "timer",
    "focus",
    "productivity",
    "AI",
    "task planner",
    "ambient sounds",
    "pomofocus alternative",
  ],
  authors: [{ name: "Pomodorian" }],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Pomodorian — Free AI Pomodoro Timer | Focus, Plan, Track",
    description:
      "Free Pomodoro timer with AI task planning. Describe your goal, get structured focus sessions. Built-in ambient sounds, analytics, and keyboard shortcuts.",
    type: "website",
    locale: "en_US",
    siteName: "Pomodorian",
    url: SITE_URL,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Pomodorian — Free AI Pomodoro Timer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodorian — Free AI Pomodoro Timer | Focus, Plan, Track",
    description:
      "Free Pomodoro timer with AI task planning. Ambient sounds, analytics, and keyboard shortcuts.",
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pomodorian",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Pomodorian Blog"
          href="/feed.xml"
        />
        {children}
        <Analytics />
        <ConsentAnalytics />
      </body>
    </html>
  );
}

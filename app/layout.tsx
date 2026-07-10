import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodorian — Free AI Pomodoro Timer | Focus, Plan, Track",
    description:
      "Free Pomodoro timer with AI task planning. Ambient sounds, analytics, and keyboard shortcuts.",
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
        <link rel="llms" type="text/plain" href="/llms.txt" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

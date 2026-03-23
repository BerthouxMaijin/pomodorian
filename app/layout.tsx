import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Pomodorian — AI-Powered Focus Timer",
  description:
    "Plan smarter, focus deeper. A modern Pomodoro timer with AI session planning, ambient sounds, and beautiful analytics.",
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Pomodorian — AI-Powered Focus Timer",
    description:
      "Plan smarter, focus deeper. AI breaks down your goals into Pomodoro-sized tasks. Free ambient sounds, beautiful analytics, works offline.",
    type: "website",
    locale: "en_US",
    siteName: "Pomodorian",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodorian — AI-Powered Focus Timer",
    description:
      "AI breaks down your goals into Pomodoro-sized tasks. Free ambient sounds & analytics.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Pomodorian",
              description:
                "AI-powered Pomodoro timer with session planning, ambient sounds, and focus analytics.",
              url: "https://pomodorian.vercel.app",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "AI Session Planner",
                "Pomodoro Timer",
                "Ambient Sounds (Rain, Café, Lo-fi, Nature, Fireplace)",
                "Focus Analytics with Contribution Heatmap",
                "Keyboard Shortcuts",
                "Works Offline (PWA)",
                "Dark and Light Mode",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}

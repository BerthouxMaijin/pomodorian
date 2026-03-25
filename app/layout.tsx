import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Pomodorian",
                description:
                  "AI-powered Pomodoro timer with session planning, ambient sounds, and focus analytics.",
                url: SITE_URL,
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
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is the Pomodoro Technique?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "The Pomodoro Technique is a time management method that uses 25-minute focused work sessions (called pomodoros) separated by 5-minute breaks. After 4 pomodoros, you take a longer 15-30 minute break. It was developed by Francesco Cirillo in the late 1980s.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is Pomodorian free?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Pomodorian is completely free. No account required, no ads, and no hidden fees. All features including AI session planning, ambient sounds, and focus analytics are available at no cost.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How does the AI Session Planner work?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Describe your goal in natural language (e.g., 'Prepare a presentation and write follow-up emails'), and the AI breaks it down into concrete, pomodoro-sized tasks with time estimates. It supports 8 languages and uses Claude AI.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does Pomodorian work offline?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Pomodorian is a Progressive Web App (PWA) that can be installed on your device and works offline. The timer, tasks, ambient sounds, and analytics all work without an internet connection. Only the AI planner requires connectivity.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What ambient sounds are available?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Pomodorian includes 5 free ambient sounds: rain, café, lo-fi beats, nature, and fireplace. You can layer multiple sounds together and adjust individual volume levels to create your perfect focus environment.",
                    },
                  },
                ],
              },
            ]),
          }}
        />
        {children}
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pomodorian — AI-Powered Focus Timer",
    short_name: "Pomodorian",
    description:
      "Plan smarter, focus deeper. A modern Pomodoro timer with AI session planning, ambient sounds, and beautiful analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#ef4444",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

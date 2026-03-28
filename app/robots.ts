import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicitly allow AI bots for GEO (Generative Engine Optimization)
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "Google-Extended",
          "ClaudeBot",
          "anthropic-ai",
          "CCBot",
          "PerplexityBot",
          "Bytespider",
          "cohere-ai",
          "Amazonbot",
          "Applebot-Extended",
          "FacebookBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

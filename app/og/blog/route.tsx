import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/blog/reader";

// Dynamic OG image for blog articles. The opengraph-image file convention is
// not allowed under an optional catch-all segment ([[...path]]), so article
// pages reference this handler explicitly from generateMetadata.

const SIZE = { width: 1200, height: 630 };

const SUPPORTED_LANGS = ["en", "fr", "es", "de"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

function titleFontSize(title: string): number {
  if (title.length <= 40) return 72;
  if (title.length <= 70) return 56;
  return 44;
}

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const langParam = searchParams.get("lang") ?? "en";
  const lang: Lang = SUPPORTED_LANGS.includes(langParam as Lang)
    ? (langParam as Lang)
    : "en";
  const article = slug ? getArticleBySlug(slug, lang) : undefined;

  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1f 100%)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "16px solid #ef4444",
              marginBottom: 48,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Pomodorian Blog
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 32,
              color: "#a1a1aa",
            }}
          >
            Focus, productivity, and the Pomodoro Technique
          </div>
        </div>
      ),
      { ...SIZE, headers: CACHE_HEADERS }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1f 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "6px solid #ef4444",
            }}
          />
          <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>
            Pomodorian
          </div>
          {lang !== "en" && (
            <div
              style={{
                display: "flex",
                marginLeft: 8,
                padding: "4px 14px",
                borderRadius: 999,
                border: "1px solid #ef4444",
                color: "#ef4444",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {lang.toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titleFontSize(article.title),
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          {article.title}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#71717a" }}>
          pomodorian.app/blog
        </div>
      </div>
    ),
    { ...SIZE, headers: CACHE_HEADERS }
  );
}

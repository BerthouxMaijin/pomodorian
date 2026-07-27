import { ImageResponse } from "next/og";
import { getSeoPageBySlug } from "@/lib/seo/pages";

export const alt = "Pomodorian";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function titleFontSize(title: string): number {
  if (title.length <= 40) return 80;
  if (title.length <= 70) return 60;
  return 46;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);

  if (!page) {
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
              fontSize: 96,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Pomodorian
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 32,
              color: "#a1a1aa",
            }}
          >
            Free AI Pomodoro Timer — plan, focus, track
          </div>
        </div>
      ),
      { ...size }
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
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titleFontSize(page.h1),
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          {page.h1}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#71717a" }}>
          pomodorian.app
        </div>
      </div>
    ),
    { ...size }
  );
}

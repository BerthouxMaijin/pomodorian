"use client";

interface MiniBarChartProps {
  data: { date: string; minutes: number }[];
  labelFor?: (date: string, index: number) => string | null;
}

// Inline rgba gradient instead of Tailwind's gradient utilities: v4 compiles
// them to an `in oklab` interpolation, which Chromium below 111 (Edge 109 is
// the last build shipped on Windows 8.1) fails to parse. The declaration is
// dropped, background-image falls back to none, and the bars render fully
// transparent. Naming those utilities here, even in a comment, is enough for
// Tailwind's text scanner to emit the broken CSS again.
const BAR_BACKGROUND =
  "linear-gradient(to top, rgba(255, 101, 104, 0.3), rgba(255, 101, 104, 0.7))";

export function MiniBarChart({ data, labelFor }: MiniBarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.minutes));

  return (
    <div className="glass rounded-xl p-3">
      {/* Two things this layout must not do, both of which hid the chart before:
          - `items-end` on this row left every column's height indefinite, so the
            bars' percentage heights could not resolve and all collapsed to 2px.
            Columns stretch to h-24 and `justify-end` anchors each bar instead.
          - Reveal the bars through a JS animation. A mount in a hidden or
            throttled tab left them at their initial value and nothing showed.
            The height is plain CSS, so the chart is correct on first paint. */}
      <div className="flex gap-1 h-24">
        {data.map((d) => {
          const heightPct = (d.minutes / max) * 100;
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col justify-end gap-1 min-w-0"
              title={`${d.date} — ${d.minutes}m`}
            >
              <div
                className="w-full rounded-t min-h-[2px]"
                style={{ height: `${heightPct}%`, background: BAR_BACKGROUND }}
              />
            </div>
          );
        })}
      </div>
      {labelFor && (
        <div className="flex items-center gap-1 mt-1.5">
          {data.map((d, i) => (
            <div
              key={d.date}
              className="flex-1 text-center text-[9px] text-muted tabular-nums truncate"
            >
              {labelFor(d.date, i) ?? ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

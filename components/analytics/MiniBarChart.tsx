"use client";

import { motion } from "framer-motion";

interface MiniBarChartProps {
  data: { date: string; minutes: number }[];
  labelFor?: (date: string, index: number) => string | null;
}

export function MiniBarChart({ data, labelFor }: MiniBarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.minutes));

  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-end gap-1 h-24">
        {data.map((d, i) => {
          const heightPct = (d.minutes / max) * 100;
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0"
              title={`${d.date} — ${d.minutes}m`}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.3, delay: i * 0.01 }}
                className="w-full rounded-t bg-gradient-to-t from-red-400/30 to-red-400/70 min-h-[2px]"
                style={{ height: `${heightPct}%` }}
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

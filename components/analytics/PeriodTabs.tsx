"use client";

import { cn } from "@/lib/utils";
import type { PeriodKind } from "@/lib/date-range";

interface PeriodTabsProps {
  value: PeriodKind;
  onChange: (kind: PeriodKind) => void;
}

const TABS: { kind: PeriodKind; label: string }[] = [
  { kind: "day", label: "Day" },
  { kind: "week", label: "Week" },
  { kind: "month", label: "Month" },
];

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 w-fit">
      {TABS.map((t) => (
        <button
          key={t.kind}
          onClick={() => onChange(t.kind)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-md transition-colors",
            value === t.kind
              ? "bg-white/15 text-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

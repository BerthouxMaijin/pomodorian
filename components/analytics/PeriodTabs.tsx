"use client";

import { cn } from "@/lib/utils";
import type { PeriodKind } from "@/lib/date-range";
import { useAppCopy } from "@/hooks/useAppCopy";

interface PeriodTabsProps {
  value: PeriodKind;
  onChange: (kind: PeriodKind) => void;
}

const TABS: PeriodKind[] = ["day", "week", "month"];

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  const labels = useAppCopy().report.periods;
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface w-fit">
      {TABS.map((kind) => (
        <button
          key={kind}
          onClick={() => onChange(kind)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-md transition-colors",
            value === kind
              ? "bg-surface-active text-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {labels[kind]}
        </button>
      ))}
    </div>
  );
}

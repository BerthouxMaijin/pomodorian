import { getDateKey } from "./types";

export type PeriodKind = "day" | "week" | "month";

export interface Period {
  kind: PeriodKind;
  from: Date;
  to: Date;
  fromKey: string;
  toKey: string;
}

// All ranges are inclusive [from, to] in UTC, aligned with the YYYY-MM-DD keys
// stored in FocusSession.date (which use UTC via getDateKey).

export function getDayRange(d: Date): Period {
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  return {
    kind: "day",
    from: day,
    to: day,
    fromKey: getDateKey(day),
    toKey: getDateKey(day),
  };
}

// ISO week: Monday → Sunday.
export function getWeekRange(d: Date): Period {
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = day.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  const daysSinceMonday = (dow + 6) % 7; // Monday → 0, Sunday → 6
  const from = new Date(day);
  from.setUTCDate(day.getUTCDate() - daysSinceMonday);
  const to = new Date(from);
  to.setUTCDate(from.getUTCDate() + 6);
  return {
    kind: "week",
    from,
    to,
    fromKey: getDateKey(from),
    toKey: getDateKey(to),
  };
}

export function getMonthRange(d: Date): Period {
  const from = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const to = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
  return {
    kind: "month",
    from,
    to,
    fromKey: getDateKey(from),
    toKey: getDateKey(to),
  };
}

export function getRange(kind: PeriodKind, d: Date): Period {
  if (kind === "day") return getDayRange(d);
  if (kind === "week") return getWeekRange(d);
  return getMonthRange(d);
}

export function shiftPeriod(period: Period, direction: -1 | 1): Period {
  const ref = new Date(period.from);
  if (period.kind === "day") {
    ref.setUTCDate(ref.getUTCDate() + direction);
    return getDayRange(ref);
  }
  if (period.kind === "week") {
    ref.setUTCDate(ref.getUTCDate() + direction * 7);
    return getWeekRange(ref);
  }
  ref.setUTCMonth(ref.getUTCMonth() + direction);
  return getMonthRange(ref);
}

export function isPeriodCurrent(period: Period): boolean {
  const today = getRange(period.kind, new Date());
  return period.fromKey === today.fromKey && period.toKey === today.toKey;
}

export function enumerateDays(period: Period): string[] {
  const days: string[] = [];
  const cur = new Date(period.from);
  while (cur <= period.to) {
    days.push(getDateKey(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

export function formatPeriodLabel(period: Period, locale: string): string {
  if (period.kind === "day") {
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year:
          period.from.getUTCFullYear() === new Date().getUTCFullYear()
            ? undefined
            : "numeric",
        timeZone: "UTC",
      }).format(period.from);
    } catch {
      return period.fromKey;
    }
  }
  if (period.kind === "month") {
    try {
      return new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(period.from);
    } catch {
      return period.fromKey.slice(0, 7);
    }
  }
  // week: "6 – 12 May" or "30 Dec – 5 Jan 2026"
  try {
    const fromFmt = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
    const toFmt = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year:
        period.from.getUTCFullYear() === period.to.getUTCFullYear() &&
        period.from.getUTCFullYear() === new Date().getUTCFullYear()
          ? undefined
          : "numeric",
      timeZone: "UTC",
    });
    return `${fromFmt.format(period.from)} – ${toFmt.format(period.to)}`;
  } catch {
    return `${period.fromKey} – ${period.toKey}`;
  }
}

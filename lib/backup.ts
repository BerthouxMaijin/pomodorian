import { z } from "zod";
import { runMigrations } from "./migrations";
import { DATA_VERSION, STORAGE_KEYS } from "./types";
import { UI_LOCALES } from "./i18n/locales";
import { AMBIENT_SOUNDS } from "./constants";

/**
 * Backup file: everything the person built up in this browser, in one JSON
 * file they keep. What belongs to the moment or to the device (running timer,
 * active task link, analytics consent, dismissed feedback prompt) stays out.
 */
export const BACKUP_FORMAT = "pomodorian-backup";
export const BACKUP_FORMAT_VERSION = 1;
const SUPPORTED_FORMAT_VERSIONS: readonly number[] = [1];

/** Checked before the file is read: a real backup is far smaller. */
export const BACKUP_MAX_BYTES = 5 * 1024 * 1024;

/** Backed-up parts and the localStorage key each one lives in. */
const PARTS = {
  tasks: STORAGE_KEYS.TASKS,
  settings: STORAGE_KEYS.SETTINGS,
  sessions: STORAGE_KEYS.SESSIONS,
  ambients: STORAGE_KEYS.AMBIENTS,
  neverDumb: STORAGE_KEYS.NEVER_DUMB,
} as const;

type PartName = keyof typeof PARTS;
const PART_NAMES = Object.keys(PARTS) as PartName[];

// ---------------------------------------------------------------------------
// Schemas. Bounds are wide enough for any data the app writes (including the
// shapes older versions wrote, which the migrations then fill in) and narrow
// enough to keep absurd values out. z.object drops unknown keys.

const id = z.string().min(1).max(100);
const title = z.string().max(1000);
const isoDate = z
  .string()
  .max(40)
  .refine((s) => !Number.isNaN(Date.parse(s)));
const dayKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const count = (max: number) => z.number().int().min(0).max(max);

const taskSchema = z.object({
  id,
  title,
  estimatedPomodoros: count(1000),
  completedPomodoros: count(100_000),
  completed: z.boolean(),
  createdAt: isoDate,
  // Optional: written by DATA_VERSION 2, backfilled by the migrations.
  completedAt: isoDate.nullable().optional(),
  aiGenerated: z.boolean(),
  order: count(1_000_000).optional(),
});

const tasksSchema = z
  .array(taskSchema)
  .max(10_000)
  .refine((tasks) => new Set(tasks.map((t) => t.id)).size === tasks.length);

// Every field of AppSettings must be listed here: z.object drops unknown keys,
// so a setting missing from this list is silently lost on restore.
const settingsSchema = z.object({
  pomodoroDuration: z.number().int().min(1).max(86_400).optional(),
  shortBreakDuration: z.number().int().min(1).max(86_400).optional(),
  longBreakDuration: z.number().int().min(1).max(86_400).optional(),
  longBreakInterval: z.number().int().min(1).max(100).optional(),
  dailyGoal: z.number().int().min(1).max(24).optional(),
  focusMode: z.boolean().optional(),
  autoStartBreaks: z.boolean().optional(),
  autoStartPomodoros: z.boolean().optional(),
  alarmSound: z.string().min(1).max(40).optional(),
  alarmVolume: z.number().min(0).max(1).optional(),
  pauseAmbientsOnBreak: z.boolean().optional(),
  theme: z.enum(["system", "dark", "light"]).optional(),
  notificationsEnabled: z.boolean().optional(),
  showTimeInTitle: z.boolean().optional(),
  neverDumbAutoOpen: z.boolean().optional(),
  language: z.enum(["auto", ...UI_LOCALES]).optional(),
  aiLanguage: z.string().max(10).optional(),
});

const sessionSchema = z.object({
  id,
  date: dayKey,
  startedAt: isoDate,
  endedAt: isoDate,
  durationMinutes: z.number().min(0).max(1440),
  mode: z.enum(["pomodoro", "shortBreak", "longBreak"]),
  taskId: id.nullable(),
  // Optional: written by DATA_VERSION 2, backfilled by the migrations.
  taskTitle: title.nullable().optional(),
  completed: z.boolean(),
});

const sessionsSchema = z.array(sessionSchema).max(200_000);

const AMBIENT_KEYS = new Set<string>(AMBIENT_SOUNDS.map((s) => s.key));
const ambientsSchema = z
  .record(
    z.string().max(40),
    z.object({ active: z.boolean(), volume: z.number().min(0).max(1) })
  )
  .refine((r) => Object.keys(r).length <= 50)
  // A sound that no longer exists is dropped, not an error.
  .transform((r) =>
    Object.fromEntries(Object.entries(r).filter(([k]) => AMBIENT_KEYS.has(k)))
  );

const neverDumbSchema = z.object({
  total: count(10_000_000),
  days: z
    .record(dayKey, count(100_000))
    .refine((r) => Object.keys(r).length <= 1000),
  rotation: z
    .record(z.string().max(60), count(1_000_000))
    .refine((r) => Object.keys(r).length <= 200),
  lastPath: z.enum(["serious", "fun", "reset"]).nullable(),
});

const dataSchema = z.object({
  tasks: tasksSchema.optional(),
  settings: settingsSchema.optional(),
  sessions: sessionsSchema.optional(),
  ambients: ambientsSchema.optional(),
  neverDumb: neverDumbSchema.optional(),
});

const backupSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  formatVersion: z.number().int(),
  exportedAt: isoDate,
  // null: data written before versioning existed (every migration applies).
  dataVersion: z.string().regex(/^\d{1,4}$/).nullable(),
  data: dataSchema,
});

export type BackupData = z.infer<typeof dataSchema>;
export type Backup = z.infer<typeof backupSchema>;

export type BackupError =
  | "tooLarge"
  | "notJson"
  | "notBackup"
  | "unsupported"
  | "invalid"
  | "readFailed"
  | "writeFailed";

export type ParseResult =
  | { ok: true; backup: Backup }
  | { ok: false; error: BackupError };

// ---------------------------------------------------------------------------
// Export

function readJson(key: string): unknown {
  const raw = localStorage.getItem(key);
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function createBackup(now: Date = new Date()) {
  const data: Record<string, unknown> = {};
  for (const name of PART_NAMES) {
    const value = readJson(PARTS[name]);
    if (value !== undefined && value !== null) data[name] = value;
  }
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    dataVersion: localStorage.getItem(STORAGE_KEYS.DATA_VERSION),
    data,
  };
}

/** pomodorian-backup-YYYY-MM-DD.json, on the person's calendar day. */
export function backupFilename(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `pomodorian-backup-${y}-${m}-${d}.json`;
}

// ---------------------------------------------------------------------------
// Import

/** Validates the whole file. Nothing is written here. */
export function parseBackup(text: string): ParseResult {
  if (text.length > BACKUP_MAX_BYTES) return { ok: false, error: "tooLarge" };

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: "notJson" };
  }

  if (
    typeof json !== "object" ||
    json === null ||
    Array.isArray(json) ||
    (json as { format?: unknown }).format !== BACKUP_FORMAT
  ) {
    return { ok: false, error: "notBackup" };
  }

  const { formatVersion, dataVersion } = json as {
    formatVersion?: unknown;
    dataVersion?: unknown;
  };
  if (
    typeof formatVersion !== "number" ||
    !SUPPORTED_FORMAT_VERSIONS.includes(formatVersion)
  ) {
    return { ok: false, error: "unsupported" };
  }
  // Data from a newer app could hold shapes this one does not know.
  if (
    typeof dataVersion === "string" &&
    /^\d{1,4}$/.test(dataVersion) &&
    Number(dataVersion) > Number(DATA_VERSION)
  ) {
    return { ok: false, error: "unsupported" };
  }

  const result = backupSchema.safeParse(json);
  if (!result.success) return { ok: false, error: "invalid" };
  return { ok: true, backup: result.data };
}

/** Completed pomodoros in the backup, for the confirmation line. */
export function backupSummary(backup: Backup) {
  const sessions = backup.data.sessions ?? [];
  return {
    tasks: backup.data.tasks?.length ?? 0,
    pomodoros: sessions.filter((s) => s.mode === "pomodoro" && s.completed)
      .length,
    exportedAt: backup.exportedAt,
  };
}

/**
 * Replaces the backed-up parts with the backup's. A part missing from the
 * file is cleared: the device ends up holding exactly what the file holds.
 * All or nothing: if the browser refuses a write, every key is put back.
 *
 * A running timer is left alone (its snapshot is not part of the backup), so
 * the pomodoro keeps counting through the reload. The active task link is
 * kept only if that task exists in the imported list.
 */
export function applyBackup(backup: Backup): { ok: true } | { ok: false; error: BackupError } {
  const keys = [
    ...PART_NAMES.map((n) => PARTS[n]),
    STORAGE_KEYS.DATA_VERSION,
    STORAGE_KEYS.ACTIVE_TASK,
  ];
  const previous = new Map<string, string | null>();
  for (const key of keys) previous.set(key, localStorage.getItem(key));

  try {
    for (const name of PART_NAMES) {
      const value = backup.data[name];
      if (value === undefined) localStorage.removeItem(PARTS[name]);
      else localStorage.setItem(PARTS[name], JSON.stringify(value));
    }

    const activeTask = readJson(STORAGE_KEYS.ACTIVE_TASK);
    const taskIds = new Set((backup.data.tasks ?? []).map((t) => t.id));
    if (typeof activeTask !== "string" || !taskIds.has(activeTask)) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK);
    }

    // An older backup goes through the same migrations as an old browser
    // profile. Run them now, before any hook reads the data after reload.
    if (backup.dataVersion === null) {
      localStorage.removeItem(STORAGE_KEYS.DATA_VERSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, backup.dataVersion);
    }
    runMigrations();
    return { ok: true };
  } catch {
    for (const [key, value] of previous) {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        // nothing more can be done
      }
    }
    return { ok: false, error: "writeFailed" };
  }
}

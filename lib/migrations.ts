import { DATA_VERSION, STORAGE_KEYS } from "./types";

type LegacySession = {
  id: string;
  date: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  mode: string;
  taskId: string | null;
  taskTitle?: string | null;
  completed: boolean;
};

type LegacyTask = {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
  aiGenerated: boolean;
  order?: number;
};

export function runMigrations(): void {
  if (typeof window === "undefined") return;

  const current = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
  if (current === DATA_VERSION) return;

  backfillTaskTitlesInSessions();
  backfillCompletedAtOnTasks();
  backfillTaskOrder();

  localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
}

function backfillTaskTitlesInSessions(): void {
  const rawSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  const rawTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!rawSessions) return;

  let sessions: LegacySession[];
  try {
    sessions = JSON.parse(rawSessions);
  } catch {
    return;
  }
  if (!Array.isArray(sessions) || sessions.length === 0) return;

  const titleById = new Map<string, string>();
  if (rawTasks) {
    try {
      const tasks: LegacyTask[] = JSON.parse(rawTasks);
      for (const t of tasks) titleById.set(t.id, t.title);
    } catch {
      // ignore
    }
  }

  let touched = false;
  const migrated = sessions.map((s) => {
    if (s.taskTitle !== undefined) return s;
    touched = true;
    const title = s.taskId ? titleById.get(s.taskId) ?? null : null;
    return { ...s, taskTitle: title };
  });

  if (touched) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(migrated));
  }
}

// Manual reordering makes `order` load-bearing: a task missing it (or holding
// a duplicate) would sort unpredictably and the first drag would freeze that
// arbitrary order in place. Normalize to a dense 0..n-1 sequence.
function backfillTaskOrder(): void {
  const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!raw) return;

  let tasks: LegacyTask[];
  try {
    tasks = JSON.parse(raw);
  } catch {
    return;
  }
  if (!Array.isArray(tasks) || tasks.length === 0) return;

  // Tasks without an order keep their array position, which is the order they
  // were added in.
  const sorted = tasks
    .map((t, i) => ({ t, i }))
    .sort((a, b) => {
      const ao = typeof a.t.order === "number" ? a.t.order : a.i;
      const bo = typeof b.t.order === "number" ? b.t.order : b.i;
      return ao === bo ? a.i - b.i : ao - bo;
    })
    .map(({ t }) => t);

  const needsFix = sorted.some((t, i) => t.order !== i);
  if (!needsFix) return;

  localStorage.setItem(
    STORAGE_KEYS.TASKS,
    JSON.stringify(sorted.map((t, i) => ({ ...t, order: i })))
  );
}

function backfillCompletedAtOnTasks(): void {
  const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!raw) return;

  let tasks: LegacyTask[];
  try {
    tasks = JSON.parse(raw);
  } catch {
    return;
  }
  if (!Array.isArray(tasks) || tasks.length === 0) return;

  let touched = false;
  const migrated = tasks.map((t) => {
    if (t.completedAt !== undefined) return t;
    touched = true;
    return { ...t, completedAt: t.completed ? t.createdAt : null };
  });

  if (touched) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(migrated));
  }
}

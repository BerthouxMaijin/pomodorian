"use client";

import { useRef, useState } from "react";
import { useAppCopy } from "@/hooks/useAppCopy";
import { useUiLocale } from "@/hooks/useUiLocale";
import { HTML_LANG } from "@/lib/i18n/locales";
import { downloadBlob } from "@/lib/export";
import type { Backup, BackupError } from "@/lib/backup";

// The backup logic pulls in the validation library (about 70 KB of JavaScript
// once compressed). It is fetched when someone clicks Export or picks a file,
// not with the page: almost nobody opens this section on a given visit.
const loadBackup = () => import("@/lib/backup");

type Summary = { tasks: number; pomodoros: number; exportedAt: string };

type View =
  | { kind: "idle" }
  | { kind: "confirm"; backup: Backup; summary: Summary }
  | { kind: "error"; error: BackupError };

const BUTTON =
  "min-h-10 px-4 py-2 rounded-lg border border-border bg-surface text-sm font-medium text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

/** Settings > Data: one JSON file to save the browser's data or bring it back. */
export function BackupSection() {
  const copy = useAppCopy().backup;
  const locale = useUiLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<View>({ kind: "idle" });
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    const { createBackup, backupFilename } = await loadBackup();
    const now = new Date();
    downloadBlob(
      JSON.stringify(createBackup(now), null, 2),
      backupFilename(now),
      "application/json"
    );
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    let text: string;
    let backupLib: Awaited<ReturnType<typeof loadBackup>>;
    try {
      backupLib = await loadBackup();
      // Size is checked before the file is read.
      if (file.size > backupLib.BACKUP_MAX_BYTES) {
        setView({ kind: "error", error: "tooLarge" });
        return;
      }
      text = await file.text();
    } catch {
      setView({ kind: "error", error: "readFailed" });
      return;
    }
    const result = backupLib.parseBackup(text);
    setView(
      result.ok
        ? {
            kind: "confirm",
            backup: result.backup,
            summary: backupLib.backupSummary(result.backup),
          }
        : { kind: "error", error: result.error }
    );
  };

  const handleReplace = async (backup: Backup) => {
    setBusy(true);
    let result: { ok: true } | { ok: false; error: BackupError };
    try {
      result = (await loadBackup()).applyBackup(backup);
    } catch {
      result = { ok: false, error: "writeFailed" };
    }
    if (!result.ok) {
      setBusy(false);
      setView({ kind: "error", error: result.error });
      return;
    }
    // Every hook reads its state at mount: a reload is the simplest way for
    // all of them to pick up the restored data at once.
    window.location.reload();
  };

  const formatDate = (iso: string): string | null => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    try {
      return new Intl.DateTimeFormat(HTML_LANG[locale], { dateStyle: "medium" }).format(d);
    } catch {
      return null;
    }
  };

  return (
    <section className="space-y-3" data-testid="backup-section">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
        {copy.title}
      </h3>

      {view.kind === "confirm" ? (
        <div
          // Focus lands on the warning, not on Replace: a stray Enter must not
          // wipe the device, and a screen reader reads the warning first.
          tabIndex={-1}
          autoFocus
          role="group"
          aria-label={copy.import}
          className="rounded-xl border border-border bg-surface p-3 space-y-3 outline-none"
        >
          <p className="text-sm font-medium text-foreground">{copy.replaceWarning}</p>
          <p className="text-xs text-muted break-words" data-testid="backup-summary">
            {copy.summary(
              view.summary.tasks,
              view.summary.pomodoros,
              formatDate(view.summary.exportedAt)
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleReplace(view.backup)}
              className={`${BUTTON} flex-1 basis-auto whitespace-nowrap`}
              data-testid="backup-replace"
            >
              {copy.replace}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setView({ kind: "idle" })}
              className={`${BUTTON} flex-1 basis-auto whitespace-nowrap`}
              data-testid="backup-cancel"
            >
              {copy.cancel}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className={`${BUTTON} flex-1 basis-auto`}
            data-testid="backup-export"
          >
            {copy.export}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`${BUTTON} flex-1 basis-auto`}
            data-testid="backup-import"
          >
            {copy.import}
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        aria-label={copy.fileLabel}
        tabIndex={-1}
        className="sr-only"
        data-testid="backup-file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Picking the same file again must fire onChange again.
          e.target.value = "";
          void handleFile(file);
        }}
      />

      <div aria-live="polite">
        {view.kind === "error" && (
          <p role="alert" className="text-sm text-red-400 light:text-red-600 break-words" data-testid="backup-error">
            {copy.errors[view.error]}
          </p>
        )}
      </div>

      <p className="text-xs text-muted">{copy.note}</p>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/track";
import type { AppSettings } from "@/lib/types";
import { ALARM_SOUND_KEYS } from "@/lib/constants";
import { useAppCopy } from "@/hooks/useAppCopy";
import { useUiLocale } from "@/hooks/useUiLocale";
import { NEVER_DUMB_COPY } from "@/components/neverdumb/neverDumbCopy";
import {
  LANGUAGE_NAMES,
  UI_LOCALES,
  type LanguageSetting,
} from "@/lib/i18n/locales";
import { BackupSection } from "./BackupSection";

interface SettingsModalProps {
  settings: AppSettings;
  onUpdate: (partial: Partial<AppSettings>) => void;
  // Plays an alarm sound once, so the choice and the volume can be heard.
  onPreviewAlarm?: (soundKey: string, volume: number) => void;
  onClose: () => void;
}

export function SettingsModal({
  settings,
  onUpdate,
  onPreviewAlarm,
  onClose,
}: SettingsModalProps) {
  const locale = useUiLocale();
  const neverDumbCopy = NEVER_DUMB_COPY[locale];
  const appCopy = useAppCopy();
  const copy = appCopy.settings;
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="relative glass-modal rounded-2xl w-full max-w-md max-h-[85dvh] overflow-y-auto overscroll-contain p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="size-11 -m-3 grid place-items-center rounded-lg text-muted hover:text-foreground transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Timer section */}
        <section className="space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            {copy.timerSection}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <DurationInput
              label={appCopy.modes.pomodoro}
              value={settings.pomodoroDuration / 60}
              onChange={(v) => onUpdate({ pomodoroDuration: v * 60 })}
            />
            <DurationInput
              label={appCopy.modes.shortBreak}
              value={settings.shortBreakDuration / 60}
              onChange={(v) => onUpdate({ shortBreakDuration: v * 60 })}
            />
            <DurationInput
              label={appCopy.modes.longBreak}
              value={settings.longBreakDuration / 60}
              onChange={(v) => onUpdate({ longBreakDuration: v * 60 })}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">{copy.longBreakInterval}</span>
            <NumberField
              ariaLabel={copy.longBreakInterval}
              value={settings.longBreakInterval}
              min={1}
              max={10}
              onChange={(v) => onUpdate({ longBreakInterval: v })}
              className="w-16 flex-shrink-0 px-2 py-1 rounded-lg bg-surface text-foreground text-center text-sm border border-border outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">{appCopy.focus.dailyGoal}</span>
            <NumberField
              ariaLabel={appCopy.focus.dailyGoal}
              value={settings.dailyGoal}
              min={1}
              max={24}
              onChange={(v) => onUpdate({ dailyGoal: v })}
              className="w-16 flex-shrink-0 px-2 py-1 rounded-lg bg-surface text-foreground text-center text-sm border border-border outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </div>
        </section>

        {/* Toggles */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            {copy.automation}
          </h3>
          <Toggle
            label={copy.autoStartBreaks}
            checked={settings.autoStartBreaks}
            onChange={(v) => onUpdate({ autoStartBreaks: v })}
          />
          <Toggle
            label={copy.autoStartPomodoros}
            checked={settings.autoStartPomodoros}
            onChange={(v) => onUpdate({ autoStartPomodoros: v })}
          />
          <Toggle
            label={neverDumbCopy.shared.settingsAutoOpen}
            checked={settings.neverDumbAutoOpen}
            onChange={(v) => {
              onUpdate({ neverDumbAutoOpen: v });
              track("neverdumb_auto_open_changed", { enabled: v });
            }}
          />
        </section>

        {/* Sound */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            {copy.sound}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">{copy.alarmSound}</span>
            <select
              value={settings.alarmSound}
              onChange={(e) => {
                onUpdate({ alarmSound: e.target.value });
                onPreviewAlarm?.(e.target.value, settings.alarmVolume);
              }}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-surface text-foreground text-sm border border-border outline-none"
            >
              {ALARM_SOUND_KEYS.map((key) => (
                <option key={key} value={key}>
                  {copy.alarmSounds[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">{copy.volume}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.alarmVolume * 100}
              onChange={(e) =>
                onUpdate({ alarmVolume: parseInt(e.target.value) / 100 })
              }
              onPointerUp={(e) =>
                onPreviewAlarm?.(settings.alarmSound, parseInt(e.currentTarget.value) / 100)
              }
              onKeyUp={(e) => {
                if (!/^(Arrow|Page|Home|End)/.test(e.key)) return;
                onPreviewAlarm?.(settings.alarmSound, parseInt(e.currentTarget.value) / 100);
              }}
              className="w-32 flex-shrink-0 accent-red-500"
            />
          </div>
        </section>

        {/* Display */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            {copy.display}
          </h3>
          {/* Language: one setting for the whole app and the AI planner.
              It replaces "AI Planner > Language". */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">{copy.language}</span>
            {/* Unset reads as "Auto": the person never chose, so the app
                follows a legacy AI language or the browser. */}
            <select
              data-testid="language-select"
              value={settings.language ?? "auto"}
              onChange={(e) =>
                onUpdate({ language: e.target.value as LanguageSetting })
              }
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-surface text-foreground text-sm border border-border outline-none"
            >
              <option value="auto">{copy.languageAuto}</option>
              {UI_LOCALES.map((code) => (
                <option key={code} value={code} lang={code}>
                  {LANGUAGE_NAMES[code]}
                </option>
              ))}
            </select>
          </div>
          <Toggle
            label={copy.showTimeInTitle}
            checked={settings.showTimeInTitle}
            onChange={(v) => onUpdate({ showTimeInTitle: v })}
          />
          <Toggle
            label={copy.notifications}
            checked={settings.notificationsEnabled}
            onChange={(v) => onUpdate({ notificationsEnabled: v })}
          />
          <Toggle
            label={appCopy.focus.focusMode}
            checked={settings.focusMode}
            onChange={(v) => onUpdate({ focusMode: v })}
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">{copy.theme}</span>
            <select
              value={settings.theme}
              onChange={(e) =>
                onUpdate({ theme: e.target.value as AppSettings["theme"] })
              }
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-surface text-foreground text-sm border border-border outline-none"
            >
              <option value="system">{copy.themeSystem}</option>
              <option value="light">{copy.themeLight}</option>
              <option value="dark">{copy.themeDark}</option>
            </select>
          </div>
        </section>

        {/* Data: backup export and import */}
        <BackupSection />
      </div>
    </div>
  );
}

function DurationInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="block text-xs text-muted">{label}</span>
      <NumberField
        value={value}
        min={1}
        max={180}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-lg bg-surface text-foreground text-center text-sm border border-border outline-none focus:ring-1 focus:ring-foreground/30"
      />
    </label>
  );
}

/**
 * Number input that can be emptied while typing. The previous version forced
 * a value on every keystroke: clearing "25" snapped to "1", and typing "50"
 * after that gave "150". The draft is free text; only a valid number in range
 * is committed, and leaving the field shows the committed value again.
 */
function NumberField({
  value,
  min,
  max,
  onChange,
  className,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  className: string;
  ariaLabel?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <input
      type="number"
      inputMode="numeric"
      aria-label={ariaLabel}
      min={min}
      max={max}
      value={draft ?? String(value)}
      onChange={(e) => {
        setDraft(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value !== "" && Number.isInteger(n) && n >= min && n <= max) {
          onChange(n);
        }
      }}
      onFocus={(e) => e.target.select()}
      onBlur={() => setDraft(null)}
      className={className}
    />
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        aria-label={label}
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 flex-shrink-0 rounded-full transition-colors relative before:absolute before:-inset-y-2.5 before:-inset-x-1 before:content-[''] ${
          checked ? "bg-emerald-500" : "bg-surface-active"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "left-5" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

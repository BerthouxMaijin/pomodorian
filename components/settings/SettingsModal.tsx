"use client";

import { useEffect } from "react";
import type { AppSettings } from "@/lib/types";
import { ALARM_SOUNDS, AI_LANGUAGES } from "@/lib/constants";

interface SettingsModalProps {
  settings: AppSettings;
  onUpdate: (partial: Partial<AppSettings>) => void;
  onClose: () => void;
}

export function SettingsModal({
  settings,
  onUpdate,
  onClose,
}: SettingsModalProps) {
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
      <div className="relative glass rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
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
            Timer (minutes)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <DurationInput
              label="Pomodoro"
              value={settings.pomodoroDuration / 60}
              onChange={(v) => onUpdate({ pomodoroDuration: v * 60 })}
            />
            <DurationInput
              label="Short Break"
              value={settings.shortBreakDuration / 60}
              onChange={(v) => onUpdate({ shortBreakDuration: v * 60 })}
            />
            <DurationInput
              label="Long Break"
              value={settings.longBreakDuration / 60}
              onChange={(v) => onUpdate({ longBreakDuration: v * 60 })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Long Break interval</span>
            <input
              type="number"
              min={1}
              max={10}
              value={settings.longBreakInterval}
              onChange={(e) =>
                onUpdate({
                  longBreakInterval: Math.max(1, parseInt(e.target.value) || 4),
                })
              }
              className="w-16 px-2 py-1 rounded-lg bg-surface text-foreground text-center text-sm border border-border outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
        </section>

        {/* Toggles */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            Automation
          </h3>
          <Toggle
            label="Auto Start Breaks"
            checked={settings.autoStartBreaks}
            onChange={(v) => onUpdate({ autoStartBreaks: v })}
          />
          <Toggle
            label="Auto Start Pomodoros"
            checked={settings.autoStartPomodoros}
            onChange={(v) => onUpdate({ autoStartPomodoros: v })}
          />
        </section>

        {/* Sound */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            Sound
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Alarm Sound</span>
            <select
              value={settings.alarmSound}
              onChange={(e) => onUpdate({ alarmSound: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-surface text-foreground text-sm border border-border outline-none"
            >
              {Object.entries(ALARM_SOUNDS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Volume</span>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.alarmVolume * 100}
              onChange={(e) =>
                onUpdate({ alarmVolume: parseInt(e.target.value) / 100 })
              }
              className="w-32 accent-red-500"
            />
          </div>
        </section>

        {/* AI */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            AI Planner
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Language</span>
            <select
              value={settings.aiLanguage}
              onChange={(e) => onUpdate({ aiLanguage: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-surface text-foreground text-sm border border-border outline-none"
            >
              {AI_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Display */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
            Display
          </h3>
          <Toggle
            label="Show time in title"
            checked={settings.showTimeInTitle}
            onChange={(v) => onUpdate({ showTimeInTitle: v })}
          />
          <Toggle
            label="Desktop notifications"
            checked={settings.notificationsEnabled}
            onChange={(v) => onUpdate({ notificationsEnabled: v })}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Theme</span>
            <select
              value={settings.theme}
              onChange={(e) =>
                onUpdate({ theme: e.target.value as "dark" | "light" })
              }
              className="px-3 py-1.5 rounded-lg bg-surface text-foreground text-sm border border-border outline-none"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </section>
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
    <div className="space-y-1">
      <label className="text-xs text-muted">{label}</label>
      <input
        type="number"
        min={1}
        max={120}
        value={value}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-full px-3 py-2 rounded-lg bg-surface text-foreground text-center text-sm border border-border outline-none focus:ring-1 focus:ring-white/20"
      />
    </div>
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
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative ${
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

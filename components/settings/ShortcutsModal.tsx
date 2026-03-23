"use client";

import { useEffect } from "react";
import { KEYBOARD_SHORTCUTS } from "@/lib/constants";

interface ShortcutsModalProps {
  onClose: () => void;
}

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "?") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass rounded-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Keyboard Shortcuts
          </h2>
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

        <div className="space-y-1">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-sm text-foreground">{shortcut.action}</span>
              <kbd className="px-2 py-1 rounded-md bg-white/10 text-xs font-mono text-muted border border-border">
                {shortcut.label}
              </kbd>
            </div>
          ))}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-foreground">Show shortcuts</span>
            <kbd className="px-2 py-1 rounded-md bg-white/10 text-xs font-mono text-muted border border-border">
              ?
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

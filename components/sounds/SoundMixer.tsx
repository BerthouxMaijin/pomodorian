"use client";

import { memo, useState } from "react";
import { AMBIENT_SOUNDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppCopy } from "@/hooks/useAppCopy";

interface SoundMixerProps {
  ambients: Record<string, { active: boolean; volume: number }>;
  onToggle: (key: string, src: string) => void;
  onVolumeChange: (key: string, volume: number) => void;
}

export const SoundMixer = memo(function SoundMixer({
  ambients,
  onToggle,
  onVolumeChange,
}: SoundMixerProps) {
  const copy = useAppCopy().sounds;
  const [expanded, setExpanded] = useState(false);
  const activeCount = Object.values(ambients).filter((a) => a.active).length;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mx-auto min-h-11 px-3 -my-3 rounded-lg"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span data-i18n>{copy.toggle}</span>
        {activeCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-active">
            {activeCount}
          </span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn(
            "transition-transform",
            expanded && "rotate-180"
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 glass rounded-xl p-4 space-y-3">
          {/* Tighter gap on a 320px phone: "Fireplace" was wider than its cell. */}
          <div className="grid grid-cols-5 gap-1 min-[360px]:gap-2">
            {AMBIENT_SOUNDS.map((sound) => {
              const state = ambients[sound.key];
              const isActive = state?.active ?? false;

              return (
                <button
                  key={sound.key}
                  type="button"
                  onClick={() => onToggle(sound.key, sound.src)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex flex-col items-center gap-1 px-1 py-2.5 rounded-lg transition-all",
                    isActive
                      ? "bg-surface-active text-foreground"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  <span className="text-lg" aria-hidden="true">{sound.icon}</span>
                  <span className="text-[11px]">{copy.names[sound.key]}</span>
                </button>
              );
            })}
          </div>

          {/* Volume sliders for active sounds */}
          {AMBIENT_SOUNDS.filter((s) => ambients[s.key]?.active).map(
            (sound) => (
              <div
                key={sound.key}
                className="flex items-center gap-3 text-xs text-muted"
              >
                <span className="w-20 truncate" aria-hidden="true">{sound.icon} {copy.names[sound.key]}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={(ambients[sound.key]?.volume ?? 0.5) * 100}
                  onChange={(e) =>
                    onVolumeChange(sound.key, parseInt(e.target.value) / 100)
                  }
                  aria-label={copy.volume(copy.names[sound.key])}
                  className="flex-1 accent-neutral-400 h-6"
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
});

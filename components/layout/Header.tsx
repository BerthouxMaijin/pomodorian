"use client";

interface HeaderProps {
  pomodorosCompleted: number;
  onOpenSettings: () => void;
  onOpenAnalytics: () => void;
}

export function Header({ pomodorosCompleted, onOpenSettings, onOpenAnalytics }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-foreground">
          Pomodorian
        </span>
      </div>

      <div className="flex items-center gap-3">
        {pomodorosCompleted > 0 && (
          <span className="text-sm text-muted tabular-nums">
            #{pomodorosCompleted}
          </span>
        )}
        <button
          onClick={onOpenAnalytics}
          className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          aria-label="Analytics"
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
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 4 4-8" />
          </svg>
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          aria-label="Settings"
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </header>
  );
}

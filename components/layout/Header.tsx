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
            width="20"
            height="20"
            viewBox="0 0 100 100"
            fill="none"
          >
            <line x1="46" y1="18" x2="40" y2="4" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"/>
            <line x1="54" y1="18" x2="60" y2="4" stroke="#4ade80" strokeWidth="5" strokeLinecap="round"/>
            <circle cx="50" cy="56" r="38" fill="#ef4444"/>
            <circle cx="50" cy="56" r="24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3"/>
            <circle cx="50" cy="56" r="24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="151" strokeDashoffset="38" transform="rotate(-90 50 56)"/>
            <line x1="50" y1="56" x2="50" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="50" y1="56" x2="62" y2="62" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="56" r="2.5" fill="white"/>
          </svg>
        </div>
        <span className="text-lg font-semibold text-foreground">
          Pomodorian
        </span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/blog"
          className="text-xs text-muted hover:text-foreground transition-colors hidden sm:block"
        >
          Blog
        </a>
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

"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-6 max-w-md w-full text-center space-y-4">
        <h1 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted">
          Your tasks, sessions and settings are stored in this browser and have
          not been lost.
        </p>
        <button
          onClick={reset}
          className="w-full py-2 rounded-lg glass text-sm text-foreground hover:bg-white/10 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

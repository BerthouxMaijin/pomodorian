"use client";

import { useEffect } from "react";
import { useUiLocale } from "@/hooks/useUiLocale";
import { ERROR_COPY } from "@/lib/i18n/errorCopy";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const copy = ERROR_COPY[useUiLocale()];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-6 max-w-md w-full text-center space-y-4">
        <h1 className="text-lg font-semibold text-foreground">
          {copy.title}
        </h1>
        <p className="text-sm text-muted">
          {copy.body}
        </p>
        <button
          onClick={reset}
          className="w-full py-2 rounded-lg glass text-sm text-foreground hover:bg-surface-active transition-colors"
        >
          {copy.retry}
        </button>
      </div>
    </div>
  );
}

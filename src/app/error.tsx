"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="size-14 mx-auto rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
          <AlertTriangle className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            An unexpected application error occurred while processing your request.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="default"
            size="sm"
            icon={<RefreshCw className="size-3.5" />}
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            variant="outline"
            size="sm"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}

"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12 space-y-4">
      <div className="size-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="font-heading font-bold text-lg text-slate-900">Dashboard View Error</h3>
      <p className="text-xs text-slate-500">
        Unable to render dashboard view. Please reload or contact your workplace administrator.
      </p>
      <Button onClick={() => reset()} size="sm" icon={<RefreshCw className="size-3.5" />}>
        Reload View
      </Button>
    </div>
  );
}

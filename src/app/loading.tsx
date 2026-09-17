import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 animate-pulse">
          <span className="font-heading font-black text-xl tracking-tight">W</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Loader2 className="size-4 animate-spin text-indigo-600" />
          <span>Loading BuzzSpire WorkHub...</span>
        </div>
      </div>
    </main>
  );
}

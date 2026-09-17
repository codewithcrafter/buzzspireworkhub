import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-heading font-black text-xl">
            404
          </div>
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page or resource you are looking for does not exist or has been moved in BuzzSpire WorkHub.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button size="sm" icon={<Home className="size-3.5" />}>
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="size-3.5" />}>
              Login Page
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Briefcase,
  ShieldAlert
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Please enter your Employee ID or corporate email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/employee/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || data.message || "Invalid employee credentials. Please verify and try again.");
        setLoading(false);
        return;
      }

      router.push(data.data?.redirectUrl || "/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred during authentication.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* LEFT COLUMN: Modern Enterprise SaaS Brand Showcase */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-12 lg:p-16 justify-between relative overflow-hidden text-white">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 size-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 size-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-11 rounded-xl bg-indigo-600 border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-heading font-black text-xl text-white">W</span>
          </div>
          <div>
            <span className="font-heading font-bold text-lg tracking-tight text-white block">
              BUZZSPIRE WORKHUB
            </span>
            <span className="text-[11px] text-indigo-300 font-medium tracking-wider uppercase block">
              Staff Portal
            </span>
          </div>
        </div>

        {/* Center Presentation */}
        <div className="relative z-10 space-y-6 max-w-lg my-auto py-12">
          <Badge variant="outline" className="bg-white/10 text-indigo-200 border-white/20 text-xs px-3 py-1 inline-flex items-center gap-1.5">
            <Briefcase className="size-3.5" />
            Employee Self-Service & Attendance
          </Badge>
          <h1 className="font-heading text-4xl xl:text-5xl font-extrabold text-white leading-tight">
            Welcome to your staff workspace.
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Clock in seamlessly, review your daily shifts, submit leave requests, and track your attendance history all in one place.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-indigo-200">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Instant punch-in and punch-out with break logging</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-200">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Personal attendance history and monthly working hours</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-200">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Direct leave applications and holiday schedule access</span>
            </div>
          </div>
        </div>

        {/* Bottom Switch Link */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-6">
          <span>Are you an Administrator or HR Manager?</span>
          <Link
            href="/login"
            className="text-indigo-300 hover:text-white font-semibold transition-colors inline-flex items-center gap-1"
          >
            Management Login
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: Employee Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
              <span className="font-heading font-black text-lg text-white">W</span>
            </div>
            <div>
              <span className="font-heading font-bold text-base text-slate-900 block">
                BUZZSPIRE WORKHUB
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
                Staff Portal
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700">
              <Briefcase className="size-3.5" />
              Staff Login
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Employee Sign In
            </h2>
            <p className="text-sm text-slate-500">
              Enter your employee credentials to record attendance and access your portal.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 text-red-700 animate-in fade-in-0 duration-200">
              <AlertCircle className="size-5 shrink-0 text-red-600 mt-0.5" />
              <div className="text-xs leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Employee ID or Email */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="block text-xs font-semibold text-slate-700">
                Employee ID or Work Email
              </label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  placeholder="e.g. EMP-101 or name@company.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={loading}
                  autoFocus
                  className="pl-10 h-11 text-sm bg-white"
                />
                <UserCheck className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setHelpModalOpen(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10 pr-10 h-11 text-sm bg-white"
                />
                <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="size-8 flex items-center justify-center text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer select-none">
                  Remember me on this device
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-600/20 text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Verifying credentials...
                </>
              ) : (
                <>
                  Sign In to Staff Portal
                  <ArrowRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Switch link */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-100/60 p-3.5 text-center text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Need Management Access?</span>{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Go to Admin / Manager Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password / Help Dialog */}
      <Dialog
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="Employee Account Support"
        description="Password resets for employee accounts are managed by your HR department or Workplace Administrator."
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
            <ShieldAlert className="size-5 shrink-0 text-amber-600 mt-0.5" />
            <p>
              To ensure system integrity, employee credentials cannot be reset directly online without administrative clearance.
            </p>
          </div>
          <p>
            Please contact your department manager or HR representative with your Employee ID to receive temporary login credentials.
          </p>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
            <div className="font-semibold text-slate-800">Internal Helpdesk:</div>
            <div className="text-slate-600 font-mono">hr@buzzspireworkhub.com</div>
          </div>
        </div>
      </Dialog>
    </main>
  );
}

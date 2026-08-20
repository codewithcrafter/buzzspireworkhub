"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/employee/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || data.message || "Invalid Employee ID or password.");
        return;
      }

      router.replace("/employee/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect to the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      {/* Background visual glows matching Buzzspire branding */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Link to Home */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Website
          </Link>
        </div>

        <Card className="border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-4 pt-8 pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg text-white">
              <Shield className="h-8 w-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold tracking-wider uppercase text-blue-300">
                Staff Portal
              </span>
              <CardTitle className="mt-2 text-2xl font-bold font-heading text-white">
                Employee Login
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-slate-300">
                Sign in with your Employee ID to access your CRM workspace.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Employee ID or Email */}
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Employee ID or Email
                </Label>
                <div className="relative">
                  <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="employeeId"
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. EMP-1001 or email"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="h-12 border-white/20 bg-white/10 pl-12 text-white placeholder:text-slate-400 focus-visible:ring-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-slate-200 uppercase tracking-wider">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-white/20 bg-white/10 pl-12 pr-12 text-white placeholder:text-slate-400 focus-visible:ring-primary rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 leading-relaxed"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white text-base font-semibold shadow-lg rounded-xl transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Portal"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Need assistance? Contact your system administrator.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

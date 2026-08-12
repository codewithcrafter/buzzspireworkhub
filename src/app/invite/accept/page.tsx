"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
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

function PasswordSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // State variables
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [clientInfo, setClientInfo] = useState<{ name: string; email: string; company?: string } | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Verify invitation token on mount
  useEffect(() => {
    if (!token) {
      setError("No invitation token found in link.");
      setVerifying(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/invite/accept?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "This invitation link is invalid or has expired.");
        } else {
          setClientInfo(data);
          setValidToken(true);
        }
      } catch (err) {
        setError("Unable to connect to security server.");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set up password.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Connection to database server timed out.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <Card className="border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl rounded-3xl w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
          <p className="text-slate-300 text-sm font-medium">Verifying invitation credentials...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !validToken) {
    return (
      <Card className="border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl rounded-3xl w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Verification Failed</CardTitle>
            <CardDescription className="mt-2 text-slate-300">{error}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-white/10 border border-white/20 hover:bg-white/25 text-white"
          >
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl rounded-3xl w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Account Activated!</CardTitle>
            <CardDescription className="mt-2 text-slate-300">
              Your password has been set up successfully. You can now login to your portal.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700"
          >
            Proceed to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl rounded-3xl w-full max-w-md">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-xl">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">BuzzSpire Media</h1>
          <CardTitle className="mt-2 text-xl text-white">Set Up Client Account</CardTitle>
          <CardDescription className="mt-1 text-slate-300">
            Activate your account and configure your secure password.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Render client greeting badge */}
        {clientInfo && (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 mb-6 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-violet-400" />
              <span className="font-semibold">{clientInfo.name}</span>
              <span className="text-slate-400">({clientInfo.email})</span>
            </div>
            {clientInfo.company && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-fuchsia-400" />
                <span className="font-semibold">{clientInfo.company}</span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-white/20 bg-white/10 pl-12 pr-12 text-white placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="confirmPassword"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 border-white/20 bg-white/10 pl-12 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-semibold hover:from-violet-700 hover:to-fuchsia-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Activating...
              </>
            ) : (
              "Activate Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function InviteAcceptPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 px-4">
      {/* Dynamic graphic backgrounds */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Suspense
          fallback={
            <Card className="border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl rounded-3xl w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
                <p className="text-slate-300 text-sm font-medium">Loading form...</p>
              </CardContent>
            </Card>
          }
        >
          <PasswordSetupForm />
        </Suspense>
      </motion.div>
    </main>
  );
}

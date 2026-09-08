"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  UserCheck,
  Loader2,
  ArrowLeft,
  Mail
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Secure mock delay to prevent email enumeration
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
    } catch {
      // Even on error, do not expose internal states unnecessarily for this flow
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* LEFT COLUMN: Graphic / Brand area */}
      <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-indigo-900 via-primary to-indigo-950 p-12 justify-between relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg mt-auto mb-auto">
          <Image src="/logo-full.png" alt="BuzzSpire Logo" width={200} height={60} className="brightness-0 invert object-contain" />
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
            Account <br/>Recovery.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Enter your email to receive a secure link to reset your BuzzSpire portal password.
          </p>
        </div>

        <div className="relative z-10 text-indigo-300/80 text-sm">
          &copy; {new Date().getFullYear()} BuzzSpire Media. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Reset Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none md:hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="md:hidden mb-10 flex flex-col items-center space-y-4">
             <Image src="/logo-full.png" alt="BuzzSpire Logo" width={180} height={50} className="object-contain" />
          </div>

          <div className="bg-white rounded-3xl sm:border sm:border-slate-100 sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10 space-y-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold tracking-wider uppercase text-primary">
                <Mail className="w-3.5 h-3.5" />
                PASSWORD RESET
              </span>
              <h2 className="text-3xl font-heading font-extrabold text-slate-900">
                Forgot Password
              </h2>
              <p className="text-sm text-slate-500">
                {success 
                  ? "Check your email inbox." 
                  : "We'll send you a link to securely reset your password."}
              </p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800">
                  <p>If <strong>{email}</strong> is registered in our system, you will receive a password reset link shortly.</p>
                </div>
                <Button
                  onClick={() => router.push("/login")}
                  className="h-12 w-full bg-slate-900 hover:bg-slate-800 text-white text-base font-semibold shadow-md rounded-xl transition-all"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </Label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      placeholder="hello@buzzspire.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="h-12 w-full bg-primary hover:bg-indigo-700 text-white text-base font-semibold shadow-md rounded-xl transition-all mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                
                <div className="text-center pt-2">
                  <Link href="/login" className="text-sm font-medium text-primary hover:text-indigo-700 transition-colors">
                    Wait, I remember my password
                  </Link>
                </div>
              </form>
            )}
          </div>
          
          <div className="md:hidden mt-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    Sparkles,
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
import { Checkbox } from "@/components/ui/checkbox";
export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid email or password.");
                return;
            }

            if (data.user.role === "ADMIN") {
                router.replace("/admin");
            } else {
                router.replace("/client");
            }
        } catch {
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 px-4">

            <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl animate-pulse" />

            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl animate-pulse" />

            <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >

                <Card className="border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl rounded-3xl">

                    <CardHeader className="text-center space-y-5">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-xl">
                            <Sparkles className="h-10 w-10 text-white" />
                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-white">
                                BuzzSpire Media
                            </h1>

                            <CardTitle className="mt-3 text-2xl text-white">
                                Welcome Back 👋
                            </CardTitle>

                            <CardDescription className="mt-2 text-slate-300">
                                Sign in to continue to your dashboard.
                            </CardDescription>

                        </div>

                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                    Email Address
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 border-white/20 bg-white/10 pl-12 text-white placeholder:text-slate-400"
                                    />
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-white">
                                            Password
                                        </Label>

                                        <div className="relative">

                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

                                            <Input
                                                id="password"
                                                required
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="h-12 border-white/20 bg-white/10 pl-12 pr-12 text-white placeholder:text-slate-400"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>

                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-2">

                                            <Checkbox
                                                id="remember"
                                                checked={rememberMe}
                                                onCheckedChange={(checked) => setRememberMe(checked === true)}
                                            />

                                            <Label
                                                htmlFor="remember"
                                                className="cursor-pointer text-sm text-slate-300"
                                            >
                                                Remember Me
                                            </Label>

                                        </div>

                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
                                        >
                                            Forgot Password?
                                        </Link>

                                    </div>
                                    {error && (
                                        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                                            {error}
                                        </p>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        aria-disabled={loading}
                                        className="h-12 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-semibold hover:from-violet-700 hover:to-fuchsia-700"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Signing In...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </Button>
                                </div>
                            </div>

                        </form>
                    </CardContent>

                </Card>

            </motion.div>

        </main>
    );
}
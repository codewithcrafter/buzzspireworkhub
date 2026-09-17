"use client";

import * as React from "react";
import {
  User,
  Shield,
  Bell,
  Lock,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Laptop,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ProfileTab = "profile" | "security" | "preferences";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<ProfileTab>("profile");

  // Profile Form States
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [employeeId, setEmployeeId] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [role, setRole] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [joiningDate, setJoiningDate] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          const user = json.user || json.data?.user;
          if (json.success && user) {
            const isAdmin = user.role === "ADMIN";
            
            setFullName(isAdmin ? "Buzzspire Media Pvt Ltd" : user.fullName);
            setPhone(user.phone || "");
            setEmail(user.email || "");
            setEmployeeId(user.employeeCode || "");
            setDepartment(user.department?.name || "General");
            setRole(user.role);
            setDesignation(user.designation || "");
            setJoiningDate(user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "");
          }
        }
      } catch (err) {} finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Password States
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [passSubmitting, setPassSubmitting] = React.useState(false);

  // Preferences States
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(false);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);
  const [breakReminders, setBreakReminders] = React.useState(true);

  // Toast
  const [toastMessage, setToastMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Password Strength Calculation
  const passwordStrength = React.useMemo(() => {
    if (!newPassword) return { score: 0, label: "None", color: "bg-slate-200" };
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;

    if (s <= 1) return { score: 25, label: "Weak", color: "bg-rose-500" };
    if (s === 2) return { score: 50, label: "Fair", color: "bg-amber-500" };
    if (s === 3) return { score: 75, label: "Good", color: "bg-blue-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500" };
  }, [newPassword]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("success", "Profile details updated successfully.");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("error", "Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      showToast("error", "New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "New password confirmation does not match.");
      return;
    }

    setPassSubmitting(true);
    setTimeout(() => {
      setPassSubmitting(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("success", "Password successfully updated (Phase 2 UI simulation).");
    }, 700);
  };

  return (
    <div className="space-y-6 font-sans pb-16 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-lg bg-slate-900/95 border-slate-700 text-white animate-in fade-in slide-in-from-top-4">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white border border-indigo-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 flex items-center gap-5">
          <div className="size-20 rounded-2xl bg-indigo-600 border-2 border-indigo-400/40 flex items-center justify-center font-heading font-black text-2xl text-white shadow-xl shadow-indigo-600/30 shrink-0">
            {role === "ADMIN" ? "BM" : fullName.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-heading font-extrabold text-white">{fullName}</h1>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 text-xs">
                {role}
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">
                ACTIVE
              </Badge>
            </div>
            {role !== "ADMIN" && (
              <>
                <p className="text-xs text-indigo-200 font-mono">
                  {employeeId} · {designation}
                </p>
                <p className="text-xs text-slate-300">
                  Department of {department} · Joined {joiningDate}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Badge variant="outline" className="border-white/20 text-indigo-200 text-xs px-3 py-1.5">
            Verified Enterprise Account
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { key: "profile", label: "Profile Information", icon: User },
          { key: "security", label: "Security & Sessions", icon: Shield },
          { key: "preferences", label: "Notification Preferences", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as ProfileTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 1. PROFILE SECTION */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 rounded-2xl border-slate-200/80 shadow-sm bg-white">
            <CardHeader className="p-6 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Personal Details</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Update your authorized personal contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Legal Name
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-xl h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Contact Phone
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Corporate Email (Read-only)
                    </label>
                    <Input
                      value={email}
                      disabled
                      className="rounded-xl h-10 text-xs bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Employee ID (Read-only)
                    </label>
                    <Input
                      value={employeeId}
                      disabled
                      className="rounded-xl h-10 text-xs bg-slate-50 text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1.5 font-semibold cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Job Metadata Card */}
          {role !== "ADMIN" && (
            <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">Job Assignment</CardTitle>
                <CardDescription className="text-xs text-slate-500">Corporate HR allocation</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Department</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{department}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Role / Access Level</span>
                  <p className="font-semibold text-indigo-700 mt-0.5">{role}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Work Shift</span>
                  <p className="font-mono text-slate-700 mt-0.5">09:00 AM - 18:00 PM (IST)</p>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Office Location</span>
                  <p className="font-medium text-slate-700 mt-0.5">Bengaluru HQ · Hybrid Roster</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Account Status</span>
                  <div className="mt-1">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Active & Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 2. SECURITY SECTION */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password Card */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
            <CardHeader className="p-6 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="size-5 text-indigo-600" />
                Change Password
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Update your authentication password to maintain system integrity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="rounded-xl h-10 text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="size-8 flex items-center justify-center text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    New Password
                  </label>
                  <Input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters with numbers & symbols"
                    className="rounded-xl h-10 text-xs"
                  />
                  {/* Strength Bar */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Strength:</span>
                        <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={passSubmitting || !newPassword}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                  >
                    {passSubmitting ? "Updating Password…" : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Active Sessions Placeholder */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
            <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Laptop className="size-5 text-indigo-600" />
                  Active Device Sessions
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Devices currently signed into your WorkHub profile
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast("success", "All other device sessions revoked.")}
                className="rounded-xl text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                Revoke Other Sessions
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Laptop className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">Windows PC · Chrome 128</p>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        Current Session
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Bengaluru, India · IP: 192.168.1.12 · Active Now
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Apple iPhone 16 Pro · Safari Mobile</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Bengaluru, India · IP: 203.0.113.88 · Yesterday at 19:40
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showToast("success", "Session revoked.")}
                  className="text-xs text-slate-500 hover:text-rose-600"
                >
                  Revoke
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 3. PREFERENCES SECTION */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "preferences" && (
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="size-5 text-indigo-600" />
              Personal Notification Preferences
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Customize how and when WorkHub reaches you
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Email Shift & Punch Reminders</p>
                <p className="text-[11px] text-slate-500">
                  Receive an email notification 15 minutes before your scheduled shift begins.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className="text-indigo-600 cursor-pointer"
              >
                {emailAlerts ? <ToggleRight className="size-8" /> : <ToggleLeft className="size-8 text-slate-300" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">SMS Leave Decision Alerts</p>
                <p className="text-[11px] text-slate-500">
                  Get immediate SMS confirmations when your leave applications are adjudicated.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className="text-indigo-600 cursor-pointer"
              >
                {smsAlerts ? <ToggleRight className="size-8" /> : <ToggleLeft className="size-8 text-slate-300" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Weekly Personal Attendance Digest</p>
                <p className="text-[11px] text-slate-500">
                  Weekly Friday email summarising your logged hours, break durations, and leave balances.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWeeklyDigest(!weeklyDigest)}
                className="text-indigo-600 cursor-pointer"
              >
                {weeklyDigest ? <ToggleRight className="size-8" /> : <ToggleLeft className="size-8 text-slate-300" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Break Limit Notifications</p>
                <p className="text-[11px] text-slate-500">
                  Receive an in-app prompt when your active pause session reaches 45 minutes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBreakReminders(!breakReminders)}
                className="text-indigo-600 cursor-pointer"
              >
                {breakReminders ? <ToggleRight className="size-8" /> : <ToggleLeft className="size-8 text-slate-300" />}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => showToast("success", "Preferences saved.")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Settings,
  Save,
  RotateCcw,
  Building,
  Clock,
  Coffee,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Undo2,
  HelpCircle,
  Lock,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Activity,
  MonitorPlay,
  Key
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";

// Default Initial Settings
const DEFAULT_SETTINGS = {
  // GENERAL
  companyName: "BuzzSpire WorkHub Enterprise",
  companyEmail: "support@buzzspireworkhub.com",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  currency: "INR",

  // ATTENDANCE & HR ENGINE
  officeStartTime: "10:00",
  officeEndTime: "19:00",
  expectedWorkMinutes: "510",
  lateGraceMinutes: "15",
  earlyLogoutGraceMinutes: "15",
  halfDayThresholdMinutes: "240",
  overtimeEnabled: true,
  lateRules: "Marked LATE after 09:15 AM",
  autoClockOutEnabled: true,
  autoClockOutTime: "22:00",

  // BREAKS
  fixedLunchStart: "14:00",
  fixedLunchEnd: "14:30",
  breakDurationMinutes: "60",
  maxBreaksPerDay: "3",
  breakRules: "Breaks exceeding total 60 mins will be deducted.",

  // NOTIFICATIONS
  attendanceReminders: true,
  reminderTime: "08:45",
  leaveNotifications: true,
  administrativeNotifications: true,
  weeklyDigest: true,

  // SECURITY
  sessionTimeoutHours: "24",
  minPasswordLength: "8",
  requireSpecialChar: true,
  maxFailedAttempts: "5",
  lockoutMinutes: "15",
  twoFactorAdmin: true,

  // IDLE MONITORING (Backed by DB)
  idleMonitoringEnabled: true,
  idleDetectionThresholdMinutes: "2",
};

type SettingKey = keyof typeof DEFAULT_SETTINGS;

export default function SettingsPage() {
  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = React.useState(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = React.useState<
    "general" | "attendance" | "breaks" | "notifications" | "security" | "monitoring"
  >("general");

  const [devices, setDevices] = React.useState<any[]>([]);
  const [employees, setEmployees] = React.useState<any[]>([]);
  const [pairingCodeOpen, setPairingCodeOpen] = React.useState(false);
  const [pairingData, setPairingData] = React.useState<{code: string, expiresAt: string, employee: any} | null>(null);
  const [tokenLoading, setTokenLoading] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<{
    type: "success" | "info";
    text: string;
  } | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);

  // Check dirty state
  const isDirty = React.useMemo(() => {
    return Object.keys(settings).some(
      (key) => settings[key as SettingKey] !== savedSettings[key as SettingKey]
    );
  }, [settings, savedSettings]);

  const showToast = (type: "success" | "info", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleChange = (key: SettingKey, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  React.useEffect(() => {
    async function loadIdleSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.settings) {
            const dbSettings = data.data.settings;
            
            setSettings((prev) => ({
              ...prev,
              idleMonitoringEnabled: dbSettings["idle_monitoring_enabled"]?.value === "true",
              idleDetectionThresholdMinutes: dbSettings["idle_detection_threshold_minutes"]?.value || "2",
              officeStartTime: dbSettings["office_start_time"]?.value || "10:00",
              officeEndTime: dbSettings["office_end_time"]?.value || "19:00",
              expectedWorkMinutes: dbSettings["expected_work_minutes"]?.value || "510",
              lateGraceMinutes: dbSettings["late_grace_minutes"]?.value || "15",
              earlyLogoutGraceMinutes: dbSettings["early_logout_grace_minutes"]?.value || "15",
              halfDayThresholdMinutes: dbSettings["half_day_threshold_minutes"]?.value || "240",
              overtimeEnabled: dbSettings["overtime_enabled"]?.value !== "false",
              fixedLunchStart: dbSettings["fixed_lunch_start_time"]?.value || "14:00",
              fixedLunchEnd: dbSettings["fixed_lunch_end_time"]?.value || "14:30"
            }));
            setSavedSettings((prev) => ({
              ...prev,
              idleMonitoringEnabled: dbSettings["idle_monitoring_enabled"]?.value === "true",
              idleDetectionThresholdMinutes: dbSettings["idle_detection_threshold_minutes"]?.value || "2",
              officeStartTime: dbSettings["office_start_time"]?.value || "10:00",
              officeEndTime: dbSettings["office_end_time"]?.value || "19:00",
              expectedWorkMinutes: dbSettings["expected_work_minutes"]?.value || "510",
              lateGraceMinutes: dbSettings["late_grace_minutes"]?.value || "15",
              earlyLogoutGraceMinutes: dbSettings["early_logout_grace_minutes"]?.value || "15",
              halfDayThresholdMinutes: dbSettings["half_day_threshold_minutes"]?.value || "240",
              overtimeEnabled: dbSettings["overtime_enabled"]?.value !== "false",
              fixedLunchStart: dbSettings["fixed_lunch_start_time"]?.value || "14:00",
              fixedLunchEnd: dbSettings["fixed_lunch_end_time"]?.value || "14:30"
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load settings from DB", e);
      }
    }
    loadIdleSettings();

    async function fetchMonitoringData() {
      try {
        const [devicesRes, employeesRes] = await Promise.all([
          fetch("/api/activity/agent/devices"),
          fetch("/api/employees?limit=1000")
        ]);
        
        if (devicesRes.ok) {
          const d = await devicesRes.json();
          setDevices(d.data || []);
        }
        if (employeesRes.ok) {
          const e = await employeesRes.json();
          setEmployees(e.data?.employees || e.employees || []);
        }
      } catch (e) {}
    }
    fetchMonitoringData();
  }, []);

  const handlePairDevice = async (employee: any) => {
    setTokenLoading(true);
    try {
      const res = await fetch("/api/activity/agent/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: employee.id })
      });
      const d = await res.json();
      if (d.success) {
        setPairingData({
          code: d.data.code,
          expiresAt: d.data.expiresAt,
          employee: d.data.employee
        });
        setPairingCodeOpen(true);
      } else {
        alert("Error: " + d.error);
      }
    } catch (e) {
      alert("Failed to generate pairing code");
    } finally {
      setTokenLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (!confirm("Are you sure you want to revoke this device? It will permanently stop syncing.")) return;
    try {
      await fetch("/api/activity/agent/devices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId })
      });
      setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, status: "REVOKED", revokedAt: new Date().toISOString() } : d));
      showToast("success", "Device revoked.");
    } catch (e) {
      showToast("info", "Failed to revoke device.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save ONLY the idle settings to the DB for now, since others are placeholders
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idle_monitoring_enabled: String(settings.idleMonitoringEnabled),
          idle_detection_threshold_minutes: String(settings.idleDetectionThresholdMinutes),
          office_start_time: String(settings.officeStartTime),
          office_end_time: String(settings.officeEndTime),
          expected_work_minutes: String(settings.expectedWorkMinutes),
          late_grace_minutes: String(settings.lateGraceMinutes),
          early_logout_grace_minutes: String(settings.earlyLogoutGraceMinutes),
          half_day_threshold_minutes: String(settings.halfDayThresholdMinutes),
          overtime_enabled: String(settings.overtimeEnabled),
          fixed_lunch_start_time: String(settings.fixedLunchStart),
          fixed_lunch_end_time: String(settings.fixedLunchEnd)
        })
      });
      
      setSavedSettings({ ...settings });
      showToast("success", "System settings successfully updated (UI state ready).");
    } catch (e) {
      showToast("info", "Failed to save to database.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSettings({ ...savedSettings });
    showToast("info", "Unsaved changes discarded.");
  };

  const handleResetToDefaults = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setSavedSettings({ ...DEFAULT_SETTINGS });
    setResetConfirmOpen(false);
    showToast("info", "All parameters restored to factory enterprise defaults.");
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-lg bg-slate-900/95 border-slate-700 text-white animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            System Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-white flex items-center gap-2">
            <Settings className="size-7 text-indigo-400" />
            WorkHub System Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Configure workplace operational policies, attendance rules, break allowances, notification hooks, and access security.
          </p>
        </div>

        {/* Global Save / Discard Controls */}
        <div className="relative z-10 flex items-center gap-2.5">
          {isDirty && (
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Discard
            </Button>
          )}
          <Button
            onClick={() => setResetConfirmOpen(true)}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Undo2 className="size-3.5" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={`rounded-xl gap-2 text-xs font-semibold shadow-lg transition-all ${
              isDirty
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 cursor-pointer"
                : "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
            }`}
          >
            <Save className="size-4" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Dirty State Banner */}
      {isDirty && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-3">
            <span className="size-3 bg-amber-500 rounded-full animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">You have unsaved changes</p>
              <p className="text-[11px] text-amber-700">
                Modifications have been made to your organization settings. Click &quot;Save Changes&quot; to apply.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDiscard}
              className="h-8 text-xs text-amber-800 hover:bg-amber-100/70 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
            >
              Save Now
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Sections Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { key: "general", label: "General", icon: Building },
          { key: "attendance", label: "Attendance", icon: Clock },
          { key: "breaks", label: "Breaks", icon: Coffee },
          { key: "notifications", label: "Notifications", icon: Bell },
          { key: "security", label: "Security", icon: ShieldCheck },
          { key: "monitoring", label: "Activity Monitoring", icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
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

      {/* SECTION 1: GENERAL */}
      {activeSection === "general" && (
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="size-5 text-indigo-600" />
              General Organization Settings
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Basic workplace profile, corporate localization, and operating timezone
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Company Name
                </label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Administrative Support Email
                </label>
                <Input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleChange("companyEmail", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Primary Corporate Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                  <option value="America/New_York">America/New_York (EST - UTC-05:00)</option>
                  <option value="Europe/London">Europe/London (GMT - UTC+00:00)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST - UTC+04:00)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT - UTC+08:00)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Date Format Display
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange("dateFormat", e.target.value)}
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 16/09/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/16/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-16)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 2: ATTENDANCE */}
      {activeSection === "attendance" && (
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="size-5 text-indigo-600" />
              Attendance Policies & Shift Schedules
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Shift hours, punctuality thresholds, and auto-clockout configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Work Shift Start Time
                </label>
                <Input
                  type="time"
                  value={settings.officeStartTime}
                  onChange={(e) => handleChange("officeStartTime", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Expected arrival time</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Work Shift End Time
                </label>
                <Input
                  type="time"
                  value={settings.officeEndTime}
                  onChange={(e) => handleChange("officeEndTime", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Shift completion mark</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Arrival Grace Period (Minutes)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={settings.lateGraceMinutes}
                  onChange={(e) => handleChange("lateGraceMinutes", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Punches within this window count as PRESENT</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Late Arrival Policy & Infractions Rule
              </label>
              <textarea
                value={settings.lateRules}
                onChange={(e) => handleChange("lateRules", e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Auto Clock Out Toggle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Enforce Automated Midnight Clock-Out</p>
                <p className="text-[11px] text-slate-500">
                  Automatically seals open punch-in sessions if an employee forgets to clock out.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("autoClockOutEnabled", !settings.autoClockOutEnabled)}
                  className="text-indigo-600 cursor-pointer"
                >
                  {settings.autoClockOutEnabled ? (
                    <ToggleRight className="size-8" />
                  ) : (
                    <ToggleLeft className="size-8 text-slate-300" />
                  )}
                </button>
                {settings.autoClockOutEnabled && (
                  <Input
                    type="time"
                    value={settings.autoClockOutTime}
                    onChange={(e) => handleChange("autoClockOutTime", e.target.value)}
                    className="w-28 h-9 text-xs rounded-xl"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 3: BREAKS */}
      {activeSection === "breaks" && (
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Coffee className="size-5 text-indigo-600" />
              Break Allowances & Workday Rest Limits
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Define daily break thresholds, lunch windows, and net deduction policies
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* IDLE TIME & BREAK MONITORING */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col space-y-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">IDLE TIME & BREAK MONITORING</h3>
                <p className="text-[11px] text-slate-500">
                  Configure when employee inactivity should be treated as idle time.
                </p>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enable Idle Monitoring</p>
                  <p className="text-[10px] text-slate-500">If OFF, mouse/keyboard inactivity is ignored and idle breaks are not automatically created.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("idleMonitoringEnabled", !settings.idleMonitoringEnabled)}
                  className="text-indigo-600 cursor-pointer"
                >
                  {settings.idleMonitoringEnabled ? (
                    <ToggleRight className="size-8" />
                  ) : (
                    <ToggleLeft className="size-8 text-slate-300" />
                  )}
                </button>
              </div>

              {settings.idleMonitoringEnabled && (
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1.5">
                    Idle Detection Threshold (minutes)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.idleDetectionThresholdMinutes}
                      onChange={(e) => handleChange("idleDetectionThresholdMinutes", e.target.value)}
                      className="rounded-xl h-10 text-xs w-24"
                    />
                    <span className="text-xs font-semibold text-slate-700">minutes</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    If no mouse or keyboard activity is detected for this duration, the employee will be asked whether they are still working. Allowed range: 1–60 minutes.
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Allowed Break Duration (Total Mins)
                </label>
                <Input
                  type="number"
                  value={settings.breakDurationMinutes}
                  onChange={(e) => handleChange("breakDurationMinutes", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Maximum permitted paid rest time</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Max Break Sessions / Day
                </label>
                <Input
                  type="number"
                  value={settings.maxBreaksPerDay}
                  onChange={(e) => handleChange("maxBreaksPerDay", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Limit on daily pause sessions</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Standard Lunch Window
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={settings.fixedLunchStart}
                    onChange={(e) => handleChange("fixedLunchStart", e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <Input
                    type="time"
                    value={settings.fixedLunchEnd}
                    onChange={(e) => handleChange("fixedLunchEnd", e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Break Policy Description & Working Hours Deduction Rules
              </label>
              <textarea
                value={settings.breakRules}
                onChange={(e) => handleChange("breakRules", e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 4: NOTIFICATIONS */}
      {activeSection === "notifications" && (
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="size-5 text-indigo-600" />
              Notification Triggers & Alerts
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Configure attendance reminders, leave submission alerts, and administrative digests
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Daily Punch-In Reminder</p>
                <p className="text-[11px] text-slate-500">
                  Sends automated notifications to active staff members who haven&apos;t clocked in by 08:45 AM.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("attendanceReminders", !settings.attendanceReminders)}
                className="text-indigo-600 cursor-pointer"
              >
                {settings.attendanceReminders ? (
                  <ToggleRight className="size-8" />
                ) : (
                  <ToggleLeft className="size-8 text-slate-300" />
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Instant Leave Notifications</p>
                <p className="text-[11px] text-slate-500">
                  Notifies department managers and HR administrators immediately when leave applications are submitted or approved.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("leaveNotifications", !settings.leaveNotifications)}
                className="text-indigo-600 cursor-pointer"
              >
                {settings.leaveNotifications ? (
                  <ToggleRight className="size-8" />
                ) : (
                  <ToggleLeft className="size-8 text-slate-300" />
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Administrative Anomaly Alerts</p>
                <p className="text-[11px] text-slate-500">
                  Highlights excessive late arrivals, unexcused absences, and overlapping leave conflicts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("administrativeNotifications", !settings.administrativeNotifications)}
                className="text-indigo-600 cursor-pointer"
              >
                {settings.administrativeNotifications ? (
                  <ToggleRight className="size-8" />
                ) : (
                  <ToggleLeft className="size-8 text-slate-300" />
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Weekly Executive Attendance Digest</p>
                <p className="text-[11px] text-slate-500">
                  Delivers Friday afternoon operational rollups with punctuality metrics and department comparisons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("weeklyDigest", !settings.weeklyDigest)}
                className="text-indigo-600 cursor-pointer"
              >
                {settings.weeklyDigest ? (
                  <ToggleRight className="size-8" />
                ) : (
                  <ToggleLeft className="size-8 text-slate-300" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 5: SECURITY */}
      {activeSection === "security" && (
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="size-5 text-indigo-600" />
              Session & Access Security Controls
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Session duration, password complexity policies, and brute-force protection
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Web Session Timeout (Hours)
                </label>
                <select
                  value={settings.sessionTimeoutHours}
                  onChange={(e) => handleChange("sessionTimeoutHours", e.target.value)}
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="8">8 Hours (Standard Shift)</option>
                  <option value="12">12 Hours (Extended Shift)</option>
                  <option value="24">24 Hours (Full Day)</option>
                  <option value="168">7 Days (Remembered Device)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Minimum Password Length
                </label>
                <Input
                  type="number"
                  min="6"
                  max="32"
                  value={settings.minPasswordLength}
                  onChange={(e) => handleChange("minPasswordLength", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Account Lockout Threshold
                </label>
                <Input
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxFailedAttempts}
                  onChange={(e) => handleChange("maxFailedAttempts", e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Consecutive failed login attempts</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Enforce Password Complexity</p>
                <p className="text-[11px] text-slate-500">
                  Requires at least one uppercase letter, one digit, and one special character for all corporate passwords.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("requireSpecialChar", !settings.requireSpecialChar)}
                className="text-indigo-600 cursor-pointer"
              >
                {settings.requireSpecialChar ? (
                  <ToggleRight className="size-8" />
                ) : (
                  <ToggleLeft className="size-8 text-slate-300" />
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Mandatory Two-Factor Auth for Administrators</p>
                <p className="text-[11px] text-slate-500">
                  Requires TOTP 2FA for all users with ADMIN or HR_MANAGER roles when signing in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("twoFactorAdmin", !settings.twoFactorAdmin)}
                className="text-indigo-600 cursor-pointer"
              >
                {settings.twoFactorAdmin ? (
                  <ToggleRight className="size-8" />
                ) : (
                  <ToggleLeft className="size-8 text-slate-300" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 6: ACTIVITY MONITORING */}
      {activeSection === "monitoring" && (
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="size-5 text-indigo-600" />
                Employee Devices & Pairing
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Manage enrolled devices and generate pairing codes for employees
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Device</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    employees.map(employee => {
                      const device = devices.find(d => d.employeeId === employee.id && d.status === "ACTIVE");
                      
                      return (
                        <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-900">{employee.fullName}</p>
                            <p className="text-xs text-slate-500">{employee.role?.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-700">{employee.department?.name || "—"}</p>
                          </td>
                          <td className="px-6 py-4">
                            {device ? (
                              <p className="text-sm font-semibold text-slate-800">{device.deviceName || "Active Device"}</p>
                            ) : (
                              <p className="text-sm text-slate-400 italic">Not Paired</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {device ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                ACTIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                UNPAIRED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {device ? (
                              <Button 
                                variant="outline" 
                                className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 rounded-xl text-xs h-8" 
                                onClick={() => handleRevokeDevice(device.deviceId)}
                              >
                                Revoke
                              </Button>
                            ) : (
                              <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs h-8 shadow-sm" 
                                onClick={() => handlePairDevice(employee)}
                                disabled={tokenLoading}
                              >
                                Pair Device
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pairing Code Modal */}
      <Dialog
        isOpen={pairingCodeOpen}
        onClose={() => setPairingCodeOpen(false)}
        title="Pair Employee Device"
        description={`Use this pairing code on the WorkHub Agent for ${pairingData?.employee?.fullName}.`}
      >
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 w-full text-center shadow-inner">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Pairing Code</p>
            <div className="text-5xl font-black text-indigo-700 tracking-[0.2em] font-mono select-all">
              {pairingData?.code}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 w-full justify-center">
            <Clock className="size-4" />
            <span>Expires in: 10 minutes</span>
          </div>
          
          <Button 
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
            onClick={() => setPairingCodeOpen(false)}
          >
            Close
          </Button>
        </div>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="Reset All Parameters to Default?"
        description="This action will restore all organization rules, schedules, and security thresholds to standard factory defaults."
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="size-4 text-amber-600 mt-0.5 shrink-0" />
            <span>
              All unsaved edits will be discarded and existing settings will be reset to default values.
            </span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setResetConfirmOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetToDefaults}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

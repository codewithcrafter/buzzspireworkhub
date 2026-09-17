"use client";

import * as React from "react";
import {
  LogIn,
  LogOut,
  Coffee,
  CheckCircle2,
  Clock,
  PauseCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { RealTimeClock } from "@/components/ui/real-time-clock";
import { Dialog } from "@/components/ui/dialog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function fmtHM(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${pad(h)}h ${pad(m)}m`;
}

function fmtHMS(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function fmtHuman(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m} min ${s} sec`;
  return `${s} sec`;
}

function fmtTime(dateStr: string | null | undefined) {
  if (!dateStr) return "--:--";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtTimeFull(dateStr: string | null | undefined) {
  if (!dateStr) return "--:--:--";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ─── Attendance State Type ─────────────────────────────────────────────────────

type AttendanceState = "NOT_PUNCHED_IN" | "WORKING" | "ON_BREAK" | "COMPLETED";

interface TodayData {
  id: string;
  status: string;
  currentState: AttendanceState;
  totalWorkingSeconds: number;
  totalBreakSeconds: number;
  netWorkingSeconds: number;
  shortfallMinutes: number;
  overtimeMinutes: number;
  earlyLogoutMinutes: number;
  lateMinutes: number;
  activeSession: { id: string; punchIn: string; workingSeconds: number } | null;
  activeBreak: {
    id: string;
    breakTypeId: string;
    breakTypeName: string;
    startTime: string;
    durationSeconds: number;
  } | null;
  sessions: any[];
}

// ─── Live Timers ───────────────────────────────────────────────────────────────

function WorkingTimer({
  punchIn,
  completedBreakSeconds,
  activeBreakStart,
}: {
  punchIn: string;
  completedBreakSeconds: number;
  activeBreakStart?: string | null;
}) {
  const [disp, setDisp] = React.useState("--:--");

  React.useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const gross = Math.floor((now - new Date(punchIn).getTime()) / 1000);
      let breakSecs = completedBreakSeconds;
      if (activeBreakStart) {
        breakSecs += Math.floor((now - new Date(activeBreakStart).getTime()) / 1000);
      }
      const net = Math.max(0, gross - breakSecs);
      setDisp(fmtHM(net));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [punchIn, completedBreakSeconds, activeBreakStart]);

  return <>{disp}</>;
}

function BreakTimer({ startTime }: { startTime: string }) {
  const [disp, setDisp] = React.useState("00:00");

  React.useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
      setDisp(fmtHMS(elapsed));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [startTime]);

  return <>{disp}</>;
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const BREAK_TYPE_ICONS: Record<string, string> = {
  Lunch: "🍱",
  "Tea Break": "🍵",
  Washroom: "🚽",
  Calls: "📞",
  Meeting: "💼",
  Shoot: "🎬",
  Other: "📝",
  "Idle Break": "⏸",
};

const formatBreakName = (name?: string) => name === "System Idle" || name === "Idle Break" ? "Idle Break" : (name || "Break");

export default function StaffDashboardPage() {
  const { toast } = useToast();

  // ── Profile ──
  const [profile, setProfile] = React.useState<any>(null);

  // ── Attendance ──
  const [today, setToday] = React.useState<TodayData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [idleConfig, setIdleConfig] = React.useState({ enabled: true, thresholdMinutes: 2 });

  // ── Break modal ──
  const [modalOpen, setModalOpen] = React.useState(false);
  const [breakTypes, setBreakTypes] = React.useState<any[]>([]);
  const [selectedType, setSelectedType] = React.useState("");
  const [otherDesc, setOtherDesc] = React.useState("");

  // ── Button loading ──
  const [punchingIn, setPunchingIn] = React.useState(false);
  const [punchingOut, setPunchingOut] = React.useState(false);
  const [startingBreak, setStartingBreak] = React.useState(false);
  const [endingBreak, setEndingBreak] = React.useState(false);

  const state: AttendanceState = today?.currentState ?? "NOT_PUNCHED_IN";

  // ── Idle Detection ──
  const [showIdleWarning, setShowIdleWarning] = React.useState(false);
  const [idleDetectedAt, setIdleDetectedAt] = React.useState<number | null>(null);
  const [idleStep, setIdleStep] = React.useState<"WARNING" | "PURPOSE">("WARNING");
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const triggerIdle = React.useCallback(() => {
    if (showIdleWarning || !idleConfig.enabled) return;
    setIdleDetectedAt(Date.now() - (idleConfig.thresholdMinutes * 60000));
    setIdleStep("WARNING");
    setShowIdleWarning(true);
  }, [showIdleWarning, idleConfig]);

  const resetIdleTimer = React.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (state === "WORKING" && !showIdleWarning && idleConfig.enabled) {
      idleTimerRef.current = setTimeout(triggerIdle, idleConfig.thresholdMinutes * 60000);
    }
  }, [state, showIdleWarning, triggerIdle, idleConfig]);

  React.useEffect(() => {
    if (state !== "WORKING" || showIdleWarning || !idleConfig.enabled) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }
    resetIdleTimer();
    const handleActivity = () => resetIdleTimer();
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, handleActivity));
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  }, [state, showIdleWarning, resetIdleTimer, idleConfig]);

  // ─── Fetch all data ─────────────────────────────────────────────────────────

  const loadAll = React.useCallback(async () => {
    try {
      const [meRes, todayRes, typesRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/attendance/today"),
        fetch("/api/breaks/types"),
      ]);

      if (meRes.ok) {
        const d = await meRes.json();
        // sanitizeEmployee returns department as a plain string
        const u = d.data?.user || d.user;
        if (u) setProfile(u);
      }

      if (todayRes.ok) {
        const d = await todayRes.json();
        // Route returns { success, data: { attendance, idleSettings } }
        const att = d.data?.attendance;
        setToday(att ?? null);
        if (d.data?.idleSettings) {
          setIdleConfig(d.data.idleSettings);
        }
      } else {
        setToday(null);
      }

      if (typesRes.ok) {
        const d = await typesRes.json();
        if (Array.isArray(d.breakTypes)) {
          const allowedNames = [
            "calls",
            "lunch",
            "meeting",
            "other",
            "personal break",
            "shoot",
            "tea / coffee",
            "washroom",
          ];
          const filtered = d.breakTypes.filter((t: any) =>
            t.name && allowedNames.includes(t.name.toLowerCase())
          );
          
          filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
          
          setBreakTypes(filtered);
        }
      }
    } catch (e) {
      console.error("loadAll error", e);
      toast({ title: "Load Error", description: "Unable to load dashboard data.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const handlePunchIn = async () => {
    setPunchingIn(true);
    try {
      const res = await fetch("/api/attendance/punch-in", { method: "POST" });
      const d = await res.json();
      if (res.ok) {
        // punch-in returns { data: { session, attendance } }
        const punchInTime = d.data?.session?.punchIn;
        toast({
          title: "✓ Punch In Successful",
          description: `You punched in at ${fmtTimeFull(punchInTime)}.`,
          type: "success",
        });
        await loadAll();
      } else {
        toast({
          title: "✕ Punch In Failed",
          description: d.error || d.message || "Unable to punch in. Please try again.",
          type: "error",
        });
      }
    } catch {
      toast({ title: "Network Error", description: "Could not reach the server.", type: "error" });
    } finally {
      setPunchingIn(false);
    }
  };

  const handlePunchOut = async () => {
    if (today?.activeBreak) {
      toast({
        title: "Active Break",
        description: "Please end your active break before ending your shift.",
        type: "warning",
      });
      return;
    }
    setPunchingOut(true);
    try {
      const res = await fetch("/api/attendance/punch-out", { method: "POST" });
      const d = await res.json();
      if (res.ok) {
        // punch-out returns { data: { result, attendance } }
        const punchOutTime = d.data?.result?.punchOut;
        toast({
          title: "✓ Shift Completed",
          description: `You punched out at ${fmtTimeFull(punchOutTime)}.`,
          type: "success",
        });
        await loadAll();
      } else {
        toast({
          title: "✕ Punch Out Failed",
          description: d.error || d.message || "Unable to punch out. Please try again.",
          type: "error",
        });
      }
    } catch {
      toast({ title: "Network Error", description: "Could not reach the server.", type: "error" });
    } finally {
      setPunchingOut(false);
    }
  };

  const handleStartBreak = async (overrideTime?: number, isIdleFallback?: boolean) => {
    let finalBreakName = "Idle Break";
    let finalPurpose = "Idle Break";

    if (!isIdleFallback) {
      if (!selectedType) {
        toast({ title: "Required", description: "Please select a break type.", type: "error" });
        return;
      }
      const t = breakTypes.find((b) => b.id === selectedType);
      const isOther = t?.name?.toLowerCase().includes("other");
      if (isOther && !otherDesc.trim()) {
        toast({ title: "Required", description: "Please enter a purpose for Other.", type: "error" });
        return;
      }
      finalBreakName = t?.name || "";
      finalPurpose = isOther ? otherDesc.trim() : finalBreakName;
    }

    setStartingBreak(true);
    try {
      const res = await fetch("/api/breaks/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breakTypeId: isIdleFallback ? undefined : selectedType,
          purpose: finalPurpose,
          overrideStartTime: overrideTime ? new Date(overrideTime).toISOString() : undefined,
          isIdleFallback,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        // break/start returns { data: { break: { id, breakTypeName, startTime }, attendance } }
        const breakName = formatBreakName(d.data?.break?.breakTypeName || finalBreakName);
        const startTime = d.data?.break?.startTime;
        toast({
          title: "✓ Break Started",
          description: `${breakName} break started at ${fmtTimeFull(startTime)}.`,
          type: "success",
        });
        setModalOpen(false);
        setShowIdleWarning(false);
        setIdleDetectedAt(null);
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        setSelectedType("");
        setOtherDesc("");
        await loadAll();
      } else {
        toast({
          title: "✕ Break Failed",
          description: d.error || d.message || "Unable to start break. Please try again.",
          type: "error",
        });
      }
    } catch {
      toast({ title: "Network Error", description: "Could not reach the server.", type: "error" });
    } finally {
      setStartingBreak(false);
    }
  };

  const handleEndBreak = async () => {
    setEndingBreak(true);
    try {
      const res = await fetch("/api/breaks/end", { method: "POST" });
      const d = await res.json();
      if (res.ok) {
        // break/end returns { data: { break: { durationSeconds, ... }, attendance } }
        const dur = d.data?.break?.durationSeconds ?? 0;
        const name = formatBreakName(today?.activeBreak?.breakTypeName);
        toast({
          title: "✓ Break Completed",
          description: `${name} completed. Duration: ${fmtHuman(dur)}.`,
          type: "success",
        });
        await loadAll();
      } else {
        toast({
          title: "✕ End Break Failed",
          description: d.error || d.message || "Unable to end break. Please try again.",
          type: "error",
        });
      }
    } catch {
      toast({ title: "Network Error", description: "Could not reach the server.", type: "error" });
    } finally {
      setEndingBreak(false);
      setEndingBreak(false);
    }
  };

  const handleIdleNo = () => {
    setIdleStep("PURPOSE");
    // Start 60s fallback timer
    fallbackTimerRef.current = setTimeout(() => {
      // Auto classify as idle if no purpose provided within 60s
      handleStartBreak(idleDetectedAt!, true);
    }, 60000);
  };

  const handleIdleYes = async () => {
    setShowIdleWarning(false);
    setIdleDetectedAt(null);
    resetIdleTimer();
    toast({
      title: "✓ Working Confirmed",
      description: `Working status confirmed at ${fmtTimeFull(new Date().toISOString())}`,
      type: "success"
    });
    fetch("/api/attendance/idle/confirm", { method: "POST" }).catch(() => {});
  };

  // ─── Derived values ──────────────────────────────────────────────────────────

  // All completed breaks across all sessions
  const completedBreaks = React.useMemo(() => {
    if (!today?.sessions) return [];
    return today.sessions
      .flatMap((s: any) => (s.breaks ?? []))
      .filter((b: any) => !!b.endTime);
  }, [today]);

  const completedBreakSeconds = React.useMemo(
    () => completedBreaks.reduce((acc: number, b: any) => acc + (b.durationSeconds || 0), 0),
    [completedBreaks]
  );

  const totalBreakCount = completedBreaks.length + (today?.activeBreak ? 1 : 0);

  // First session punchIn = first clock-in of the day
  const firstPunchIn: string | null =
    today?.sessions?.[0]?.punchIn ?? null;

  // Last session punchOut = last clock-out
  const lastPunchOut: string | null = (() => {
    if (!today?.sessions?.length) return null;
    const last = today.sessions[today.sessions.length - 1];
    return last.punchOut ?? null;
  })();

  // ─── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="size-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <div className="text-slate-500 font-medium">Loading your workspace…</div>
        </div>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 font-sans pb-16 max-w-4xl mx-auto">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-800/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full -mb-32 -ml-32 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest">Employee Portal</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Welcome, {profile?.fullName ?? "Employee"}!
            </h1>
            {/* department is a plain string from sanitizeEmployee */}
            {profile?.department && (
              <p className="text-indigo-200 font-medium">{profile.department}</p>
            )}
            {profile?.designation && (
              <p className="text-indigo-300/70 text-sm">{profile.designation}</p>
            )}
          </div>
          <RealTimeClock />
        </div>
      </div>

      {/* ── 2. TODAY'S ATTENDANCE ───────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-700 uppercase tracking-wider">
            Today's Attendance
          </CardTitle>
          <StatusBadge state={state} />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: punch info */}
            <div className="flex flex-wrap gap-8">
              <Stat
                label="Punch In"
                value={state === "NOT_PUNCHED_IN" ? "—" : fmtTime(firstPunchIn)}
              />
              {state === "WORKING" || state === "ON_BREAK" ? (
                <Stat
                  label="Working Time"
                  value={
                    firstPunchIn ? (
                      <WorkingTimer
                        punchIn={firstPunchIn}
                        completedBreakSeconds={completedBreakSeconds}
                        activeBreakStart={today?.activeBreak?.startTime}
                      />
                    ) : (
                      "—"
                    )
                  }
                  highlight
                />
              ) : null}
              {state === "COMPLETED" && (
                <>
                  <Stat label="Punch Out" value={fmtTime(lastPunchOut)} />
                  <Stat
                    label="Net Working"
                    value={fmtHM(today?.netWorkingSeconds ?? 0)}
                    highlight
                  />
                  {(today?.shortfallMinutes ?? 0) > 0 && (
                    <Stat
                      label="Shortfall"
                      value={`${today?.shortfallMinutes}m`}
                      color="text-rose-600"
                    />
                  )}
                  {(today?.overtimeMinutes ?? 0) > 0 && (
                    <Stat
                      label="Overtime"
                      value={`${today?.overtimeMinutes}m`}
                      color="text-emerald-600"
                    />
                  )}
                  {(today?.earlyLogoutMinutes ?? 0) > 0 && (
                    <Stat
                      label="Early Logout"
                      value={`${today?.earlyLogoutMinutes}m`}
                      color="text-amber-600"
                    />
                  )}
                </>
              )}
            </div>

            {/* Right: action */}
            <div className="w-full md:w-auto">
              {state === "NOT_PUNCHED_IN" && (
                <Button
                  onClick={handlePunchIn}
                  disabled={punchingIn}
                  className="w-full md:w-auto h-12 px-8 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md disabled:opacity-60"
                >
                  <LogIn className="size-5 mr-2" />
                  {punchingIn ? "Punching In…" : "Punch In / Start Shift"}
                </Button>
              )}
              {(state === "WORKING" || state === "ON_BREAK") && (
                <Button
                  onClick={handlePunchOut}
                  disabled={punchingOut || state === "ON_BREAK"}
                  title={state === "ON_BREAK" ? "End your break first" : ""}
                  className="w-full md:w-auto h-12 px-8 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md disabled:opacity-50"
                >
                  <LogOut className="size-5 mr-2" />
                  {punchingOut ? "Punching Out…" : "Punch Out / End Shift"}
                </Button>
              )}
              {state === "ON_BREAK" && (
                <p className="mt-2 text-xs text-amber-600 font-medium text-center md:text-right">
                  End your active break first to punch out.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. BREAKS (only after punch-in) ─────────────────────────────────── */}
      {state !== "NOT_PUNCHED_IN" && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between rounded-t-2xl">
            <CardTitle className="text-base font-bold text-slate-700 uppercase tracking-wider">
              Breaks
            </CardTitle>
            {state === "WORKING" && !today?.activeBreak && (
              <div className="relative">
                <Button
                  onClick={() => setModalOpen(!modalOpen)}
                  variant="outline"
                  size="sm"
                  className="h-8 px-4 text-sm font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  {modalOpen ? "Cancel Break" : "+ Start Break"}
                </Button>

                {/* ── INLINE BREAK OPTIONS DROPDOWN ── */}
                {modalOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] sm:w-[380px] z-50 p-4 bg-white border border-slate-200 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select break type</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {breakTypes.map((t) => {
                          const selected = selectedType === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setSelectedType(t.id)}
                              className={`flex items-center gap-2 p-2.5 text-left border rounded-xl transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                                selected
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm font-bold"
                                  : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-base">{BREAK_TYPE_ICONS[t.name] ?? "⏸"}</span>
                              {t.name}
                            </button>
                          );
                        })}
                      </div>

                      {breakTypes.find((t) => t.id === selectedType)?.name?.toLowerCase().includes("other") && (
                        <div className="space-y-2 pt-1">
                          <label className="text-xs font-bold text-slate-700">
                            Purpose / Description <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="E.g. Client discussion"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                            value={otherDesc}
                            onChange={(e) => setOtherDesc(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setModalOpen(false);
                            setSelectedType("");
                            setOtherDesc("");
                          }}
                          className="rounded-lg border-slate-300 text-slate-600 hover:bg-slate-100 h-8 text-xs font-bold"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            handleStartBreak().then(() => {
                              setModalOpen(false);
                            });
                          }}
                          disabled={startingBreak}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60 px-4 font-bold shadow-sm h-8 text-xs"
                        >
                          {startingBreak ? "Starting…" : "Start Break"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {/* ── Break Summary Bar ── */}
            <div className="px-6 py-4 flex flex-wrap gap-8 border-b border-slate-100 bg-white">
              <Stat label="Breaks Today" value={String(totalBreakCount)} />
              <Stat
                label="Total Break Time"
                value={fmtHM(completedBreakSeconds)}
              />
            </div>

            {/* ── BREAK IN PROGRESS ── */}
            {today?.activeBreak && (
              <div className="bg-amber-50 border-b border-amber-100 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                      Break in Progress
                    </div>
                    <div className="text-2xl font-bold text-amber-800 flex items-center gap-2">
                      <span>{BREAK_TYPE_ICONS[today.activeBreak.breakTypeName] ?? "⏸"}</span>
                      {formatBreakName(today.activeBreak.breakTypeName)}
                    </div>
                    <div className="text-sm text-amber-700 font-medium">
                      Started: {fmtTimeFull(today.activeBreak.startTime)}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="font-mono text-3xl font-bold tracking-widest text-amber-600 bg-amber-100 px-5 py-2 rounded-xl border border-amber-200">
                      <BreakTimer startTime={today.activeBreak.startTime} />
                    </div>
                    <Button
                      onClick={handleEndBreak}
                      disabled={endingBreak}
                      className="h-10 px-6 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm disabled:opacity-60"
                    >
                      {endingBreak ? "Ending…" : "End Break"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TODAY'S BREAK HISTORY ── */}
            <div className="p-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Today's Break History
              </div>
              {completedBreaks.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-400 italic">
                  No breaks taken today.
                </div>
              ) : (
                <div className="space-y-2">
                  {completedBreaks.map((b: any, i: number) => (
                    <div
                      key={b.id ?? i}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {BREAK_TYPE_ICONS[b.breakType?.name ?? ""] ?? "☕"}
                        </span>
                        <div>
                          <div className="font-bold text-slate-700 text-sm">
                            {formatBreakName(b.breakType?.name)}
                            {b.purpose && b.purpose !== "Auto-fallback due to inactivity" ? ` - ${b.purpose}` : ""}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {fmtTime(b.startTime)} → {fmtTime(b.endTime)}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                        {fmtHuman(b.durationSeconds ?? 0)}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-700">
                    <span>Total Breaks: {completedBreaks.length}</span>
                    <span>Total Break Time: {fmtHM(completedBreakSeconds)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 4. TODAY'S SUMMARY ───────────────────────────────────────────────── */}
      {state !== "NOT_PUNCHED_IN" && (
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold text-slate-700 uppercase tracking-wider">
              Today's Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Stat label="Punch In" value={fmtTime(firstPunchIn)} />
              <Stat
                label="Punch Out"
                value={state === "COMPLETED" ? fmtTime(lastPunchOut) : "In Progress"}
              />
              <Stat label="Breaks" value={String(totalBreakCount)} />
              <Stat label="Total Break Time" value={fmtHM(completedBreakSeconds)} />
              <Stat
                label="Net Working Time"
                value={
                  state === "COMPLETED"
                    ? fmtHM(today?.netWorkingSeconds ?? 0)
                    : firstPunchIn
                    ? (
                        <WorkingTimer
                          punchIn={firstPunchIn}
                          completedBreakSeconds={completedBreakSeconds}
                          activeBreakStart={today?.activeBreak?.startTime}
                        />
                      )
                    : "—"
                }
                highlight
              />
              <Stat
                label="Status"
                value={today?.status ?? "PRESENT"}
                color={
                  today?.status === "PRESENT"
                    ? "text-emerald-600"
                    : today?.status === "LATE"
                    ? "text-amber-600"
                    : "text-slate-700"
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── IDLE WARNING MODAL ── */}
      {showIdleWarning && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-amber-50 p-6 border-b border-amber-100 flex flex-col items-center text-center">
              <div className="size-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-extrabold text-amber-900 uppercase tracking-widest">Are You Still Working?</h2>
            </div>
            
            <div className="p-8">
              {idleStep === "WARNING" ? (
                <div className="space-y-8">
                  <p className="text-slate-600 text-center font-medium text-lg leading-relaxed">
                    We haven&apos;t detected any activity for the last 2 minutes.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleIdleYes} 
                      className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
                    >
                      YES, I&apos;M WORKING
                    </Button>
                    <Button 
                      onClick={handleIdleNo} 
                      variant="outline"
                      className="w-full h-14 text-base font-bold border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl"
                    >
                      NO, I&apos;M ON A BREAK
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-slate-600 font-semibold text-center uppercase tracking-widest text-sm">
                    Why are you away from work?
                  </p>
                  <p className="text-xs text-rose-500 font-bold text-center -mt-2">
                    Please select a reason (auto-saving in 60s...)
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {breakTypes.map((t) => {
                      const selected = selectedType === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedType(t.id)}
                          className={`flex items-center gap-2 p-3 text-left border rounded-xl transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                            selected
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm font-bold"
                              : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">{BREAK_TYPE_ICONS[t.name] ?? "⏸"}</span>
                          {t.name}
                        </button>
                      );
                    })}
                  </div>

                  {breakTypes.find((t) => t.id === selectedType)?.name?.toLowerCase().includes("other") && (
                    <div className="space-y-2 pt-1">
                      <label className="text-xs font-bold text-slate-700">
                        Purpose / Description <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. Client discussion"
                        className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                        value={otherDesc}
                        onChange={(e) => setOtherDesc(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      onClick={() => handleStartBreak(idleDetectedAt || undefined)}
                      disabled={startingBreak}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base shadow-md disabled:opacity-60"
                    >
                      {startingBreak ? "STARTING…" : "START BREAK"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  highlight = false,
  color,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="space-y-1 min-w-[80px]">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
      <div
        className={`text-lg font-bold font-mono ${
          color ?? (highlight ? "text-indigo-600" : "text-slate-800")
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ state }: { state: AttendanceState }) {
  const config: Record<AttendanceState, { label: string; cls: string }> = {
    NOT_PUNCHED_IN: { label: "OFF DUTY", cls: "bg-slate-100 text-slate-600" },
    WORKING: { label: "WORKING", cls: "bg-emerald-100 text-emerald-700" },
    ON_BREAK: { label: "ON BREAK", cls: "bg-amber-100 text-amber-700" },
    COMPLETED: { label: "SHIFT COMPLETED", cls: "bg-indigo-100 text-indigo-700" },
  };
  const { label, cls } = config[state];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cls}`}>
      <span className="size-1.5 rounded-full bg-current opacity-75" />
      {label}
    </span>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarOff,
  Percent,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
  FileSpreadsheet,
  CalendarPlus,
  Clock4,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import {
  MockAttendanceRecord,
} from "@/lib/mock-data";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("ALL");
  const [attendanceData, setAttendanceData] = React.useState<MockAttendanceRecord[]>([]);
  const [liveCounters, setLiveCounters] = React.useState<{
    totalEmployees: number;
    present: number;
    absent: number;
    working: number;
    onBreak: number;
    completed: number;
    late: number;
  } | null>(null);

  // Real-time Clock State
  const [currentTime, setCurrentTime] = React.useState<string>("");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }));
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [sumRes, liveRes] = await Promise.all([
          fetch("/api/admin/attendance"),
          fetch("/api/admin/live-attendance"),
        ]);
        
        let fetchedCounters = null;
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          if (sumData.success && sumData.data?.summary) {
            const s = sumData.data.summary;
            fetchedCounters = {
              totalEmployees: s.totalEmployees || 0,
              present: s.present || 0,
              absent: s.absent || 0,
              working: s.working || 0,
              onBreak: s.onBreak || 0,
              completed: s.completed || 0,
              late: s.late || 0,
            };
            setLiveCounters(fetchedCounters);
          }
        }
        
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.success && Array.isArray(liveData.liveStates)) {
            const mapped: MockAttendanceRecord[] = liveData.liveStates.map((s: any, idx: number) => {
              const hrs = Math.floor((s.netWorkingSeconds || 0) / 3600);
              const mins = Math.floor(((s.netWorkingSeconds || 0) % 3600) / 60);
              return {
                id: s.employeeId || `att-${idx}`,
                employeeId: s.employeeId,
                employeeName: s.fullName,
                employeeCode: s.employeeCode,
                department: s.department || "General",
                designation: s.designation || "Staff",
                checkIn: s.punchIn ? new Date(s.punchIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
                checkOut: s.currentState === "COMPLETED" ? new Date(s.punchOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
                workingHours: `${hrs}h ${mins}m`,
                breakTime: `${Math.floor((s.currentBreakDuration || 0) / 60)}m`,
                status: s.currentState === "ABSENT" ? "ABSENT" : "PRESENT",
                liveState: s.currentState as any,
                timeline: [],
              };
            });
            setAttendanceData(mapped);
          }
        }
        
        if (!fetchedCounters) {
           setLiveCounters({ totalEmployees: 0, present: 0, absent: 0, working: 0, onBreak: 0, completed: 0, late: 0 });
        }
      } catch {
        setLiveCounters({ totalEmployees: 0, present: 0, absent: 0, working: 0, onBreak: 0, completed: 0, late: 0 });
        setAttendanceData([]);
      }
    }
    fetchDashboardData();
  }, []);

  // Filtered Today's Attendance
  const filteredAttendance = React.useMemo(() => {
    return attendanceData.filter((item) => {
      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const matchesDept =
        departmentFilter === "ALL" || item.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [attendanceData, searchTerm, statusFilter, departmentFilter]);

  // Live Attendance Counters
  const liveStats = React.useMemo(() => {
    if (liveCounters) {
      return {
        working: liveCounters.working,
        onBreak: liveCounters.onBreak,
        completed: liveCounters.completed,
        late: liveCounters.late,
      };
    }
    const working = attendanceData.filter((a) => a.liveState === "WORKING").length;
    const onBreak = attendanceData.filter((a) => a.liveState === "ON_BREAK").length;
    const completed = attendanceData.filter((a) => a.liveState === "COMPLETED").length;
    const late = attendanceData.filter((a) => a.status === "LATE").length;
    return { working, onBreak, completed, late };
  }, [liveCounters, attendanceData]);



  const getStatusBadge = (status: MockAttendanceRecord["status"]) => {
    switch (status) {
      case "PRESENT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            PRESENT
          </span>
        );
      case "LATE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="size-1.5 rounded-full bg-orange-500" />
            LATE
          </span>
        );
      case "ON_LEAVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="size-1.5 rounded-full bg-amber-500" />
            ON LEAVE
          </span>
        );
      case "ABSENT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="size-1.5 rounded-full bg-rose-500" />
            ABSENT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* ── TOP BANNER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-slate-950/10 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="size-3 text-indigo-300" />
              Workforce Intelligence
            </span>
            <span className="text-xs text-slate-400">
              Wednesday, 16 September 2026
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Buzzspire Media Pvt Ltd
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Attendance and employee management portal
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-end shrink-0">
          <div className="flex flex-col items-end">
            <span className="font-mono text-3xl font-bold tracking-wider tabular-nums text-white drop-shadow-md">
              {currentTime}
            </span>
            <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold mt-1">
              Local Time
            </span>
          </div>
        </div>

      </div>

      {/* ── 1. 6 KPI CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Employees */}
        <Card className="rounded-2xl border-slate-200/80 bg-white hover:shadow-md transition-all group">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Total Employees</span>
            <div className="size-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-heading text-2xl font-bold text-slate-900">{liveCounters?.totalEmployees ?? 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Across all departments</p>
          </CardContent>
        </Card>

        {/* Present Today */}
        <Card className="rounded-2xl border-slate-200/80 bg-white hover:shadow-md transition-all group">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Present Today</span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-heading text-2xl font-bold text-slate-900">{liveCounters?.present ?? 0}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <TrendingUp className="size-3" />
              <span>{Math.round(((liveCounters?.present ?? 0) / (liveCounters?.totalEmployees || 1)) * 100)}% present</span>
            </div>
          </CardContent>
        </Card>

        {/* Absent Today */}
        <Card className="rounded-2xl border-slate-200/80 bg-white hover:shadow-md transition-all group">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Absent Today</span>
            <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserX className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-heading text-2xl font-bold text-slate-900">{liveCounters?.absent ?? 0}</div>
            <p className="text-[11px] text-rose-500 font-medium mt-1">Unexcused absence</p>
          </CardContent>
        </Card>

        {/* Late Today */}
        <Card className="rounded-2xl border-slate-200/80 bg-white hover:shadow-md transition-all group">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Late Today</span>
            <div className="size-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-heading text-2xl font-bold text-slate-900">{liveCounters?.late ?? 0}</div>
            <p className="text-[11px] text-orange-600 font-medium mt-1">In 15m grace window</p>
          </CardContent>
        </Card>

        {/* On Leave */}
        <Card className="rounded-2xl border-slate-200/80 bg-white hover:shadow-md transition-all group">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">On Leave</span>
            <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarOff className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-heading text-2xl font-bold text-slate-900">{liveCounters?.onBreak ?? 0}</div>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Approved requests</p>
          </CardContent>
        </Card>

        {/* Attendance Percentage */}
        <Card className="rounded-2xl border-slate-200/80 bg-white hover:shadow-md transition-all group">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
            <div className="size-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Percent className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-heading text-2xl font-bold text-slate-900">
              {Math.round(((liveCounters?.present ?? 0) / (liveCounters?.totalEmployees || 1)) * 100)}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Target: &gt;90.0%</p>
          </CardContent>
        </Card>
      </div>

      {/* ── 2. LIVE ATTENDANCE STATUS STRIP ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Presence Monitoring
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time snapshot of active employees on shift right now.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Shift Window: 09:00 AM – 06:00 PM</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {liveStats.working}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Currently Working</div>
              <div className="text-[11px] text-emerald-700">Punched in & active</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
              {liveStats.onBreak}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">On Break</div>
              <div className="text-[11px] text-amber-700">Active break session</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {liveStats.completed}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Checked Out</div>
              <div className="text-[11px] text-blue-700">Shift concluded</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
              {liveStats.late}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Late Arrivals</div>
              <div className="text-[11px] text-orange-700">After 09:15 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN GRID: ATTENDANCE SECTION + SIDE PANELS ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: TODAY'S ATTENDANCE TABLE (2 Cols) ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-heading font-bold text-slate-900">
                  Today's Attendance
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Live attendance logs for Wednesday, 16 September 2026
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/attendance")}
                className="text-xs font-semibold text-indigo-600 border-indigo-100 hover:bg-indigo-50"
              >
                View Full Log
                <ArrowUpRight className="size-3.5 ml-1" />
              </Button>
            </CardHeader>

            {/* Filter Toolbar */}
            <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  placeholder="Search by name, ID or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-xl"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="ABSENT">Absent</option>
                </select>

                {/* Department Filter */}
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="h-9 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Marketing & Growth">Marketing & Growth</option>
                  <option value="HR & Operations">HR & Operations</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Working Hours</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 bg-indigo-50 text-indigo-700 font-bold text-xs ring-1 ring-slate-100">
                              <AvatarFallback>
                                {row.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold text-slate-900">{row.employeeName}</div>
                              <div className="text-[10px] text-slate-400">{row.employeeCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{row.department}</td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          {row.checkIn || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          {row.checkOut || <span className="text-slate-400 font-sans">Active</span>}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">{row.workingHours}</td>
                        <td className="py-3 px-4 text-right">{getStatusBadge(row.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search className="size-6 text-slate-300" />
                          <p className="text-xs font-medium">No attendance records match your filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between px-4">
              <span>Showing {filteredAttendance.length} of {attendanceData.length} records</span>
              <span className="font-medium">Auto-refreshes daily at 00:00 IST</span>
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN: QUICK ACTIONS & RECENT ACTIVITY ─────────────────── */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="p-5 pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-heading font-bold text-slate-900">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Common administrative workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5">
              <Button
                variant="outline"
                onClick={() => router.push("/employees")}
                className="w-full justify-start h-11 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-xl"
              >
                <UserPlus className="size-4 text-indigo-600 mr-2.5" />
                Add New Employee
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/attendance")}
                className="w-full justify-start h-11 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-xl"
              >
                <Clock4 className="size-4 text-emerald-600 mr-2.5" />
                Mark Attendance / Shift
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/leaves")}
                className="w-full justify-start h-11 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-xl"
              >
                <CalendarPlus className="size-4 text-amber-600 mr-2.5" />
                Apply / Review Leave
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/reports")}
                className="w-full justify-start h-11 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-xl"
              >
                <FileSpreadsheet className="size-4 text-indigo-600 mr-2.5" />
                Generate Reports & Exports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity Timeline */}
          <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-heading font-bold text-slate-900">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Audit events and shift updates
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/audit")}
                className="text-[11px] text-indigo-600 p-0 h-auto hover:bg-transparent"
              >
                View Audit
              </Button>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
                  <Clock className="size-6 text-slate-300" />
                  <p className="text-xs font-medium">No recent activity to display.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

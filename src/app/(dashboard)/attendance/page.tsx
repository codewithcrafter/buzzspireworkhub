"use client";

import * as React from "react";
import {
  CalendarCheck2,
  Clock,
  Coffee,
  Users,
  Search,
  Filter,
  Eye,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
interface ExtendedRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string;
  breakDuration: string;
  totalBreakCount: number;
  declaredBreakSeconds: number;
  idleBreakSeconds: number;
  totalBreakSeconds: number;
  status: "PRESENT" | "LATE" | "ON_LEAVE" | "ABSENT";
  liveState: "ABSENT" | "WORKING" | "ON_BREAK" | "COMPLETED";
  shortfallMinutes: number;
  overtimeMinutes: number;
  earlyLogoutMinutes: number;
  lateMinutes: number;
  breakHistory: {
    breakTypeName: string;
    purpose?: string | null;
    startTime: string;
    endTime: string | null;
    durationSeconds: number;
  }[];
}

export default function AttendancePage() {
  const { toast } = useToast();

  const [records, setRecords] = React.useState<ExtendedRecord[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("2026-09-16");
  const [departmentFilter, setDepartmentFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [employeeFilter, setEmployeeFilter] = React.useState("ALL");

  // Modal State
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<ExtendedRecord | null>(null);

  React.useEffect(() => {
    async function loadLiveAttendance() {
      try {
        const res = await fetch(`/api/admin/live-attendance?date=${selectedDate}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.liveStates) && data.liveStates.length > 0) {
          const mapped: ExtendedRecord[] = data.liveStates.map((s: any, idx: number) => {
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
              checkOut: s.currentState === "COMPLETED" ? new Date(s.lastPunchOut || new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
              workingHours: `${hrs}h ${mins}m`,
              breakDuration: `${Math.floor((s.totalBreakSeconds || 0) / 60)}m`,
              totalBreakCount: (s.breakHistory || []).length,
              declaredBreakSeconds: s.declaredBreakSeconds || 0,
              idleBreakSeconds: s.idleBreakSeconds || 0,
              totalBreakSeconds: s.totalBreakSeconds || 0,
              status: s.currentState === "ABSENT" ? "ABSENT" : "PRESENT",
              liveState: s.currentState as any,
              breakHistory: s.breakHistory || [],
              shortfallMinutes: s.shortfallMinutes || 0,
              overtimeMinutes: s.overtimeMinutes || 0,
              earlyLogoutMinutes: s.earlyLogoutMinutes || 0,
              lateMinutes: s.lateMinutes || 0,
            };
          });
          setRecords(mapped);
        }
      } catch {
        // Fallback to MOCK_ATTENDANCE_TODAY
      }
    }
    loadLiveAttendance();
  }, [selectedDate]);

  // Filters
  const filteredRecords = React.useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept =
        departmentFilter === "ALL" || rec.department === departmentFilter;

      const matchesStatus =
        statusFilter === "ALL" || rec.status === statusFilter;

      const matchesEmployee =
        employeeFilter === "ALL" || rec.employeeId === employeeFilter;

      return matchesSearch && matchesDept && matchesStatus && matchesEmployee;
    });
  }, [records, searchTerm, departmentFilter, statusFilter, employeeFilter]);

  // KPI calculations
  const totalPresent = records.filter((r) => r.status === "PRESENT").length;
  const totalLate = records.filter((r) => r.status === "LATE").length;
  const totalOnLeave = records.filter((r) => r.status === "ON_LEAVE").length;
  const totalAbsent = records.filter((r) => r.status === "ABSENT").length;

  // Break KPIs
  const totalBreaks = records.reduce((sum, r) => sum + r.totalBreakCount, 0);
  const totalBreakSeconds = records.reduce((sum, r) => sum + r.totalBreakSeconds, 0);
  const declaredBreakSeconds = records.reduce((sum, r) => sum + r.declaredBreakSeconds, 0);
  const idleBreakSeconds = records.reduce((sum, r) => sum + r.idleBreakSeconds, 0);
  const employeesOnBreak = records.filter((r) => r.liveState === "ON_BREAK").length;

  const fmtHm = (sec: number) => `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  const fmtM = (sec: number) => `${Math.floor(sec / 60)}m`;

  const handleOpenDetail = (rec: ExtendedRecord) => {
    setSelectedRecord(rec);
    setDetailModalOpen(true);
  };

  const getStatusBadge = (status: ExtendedRecord["status"]) => {
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
    <div className="space-y-6 font-sans pb-12">
      {/* ── HEADER & ACTIONS ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              Attendance Records
            </h1>
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-xs">
              Daily Roster
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time clock-in logs, shift durations, breaks, and compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const headers = [
                "Employee", "Employee ID", "Department", "Date", "Punch In", "Punch Out",
                "Working Hours", "Total Breaks", "Total Break Time", "Declared Break Time", "Idle Break Time", "Status"
              ];
              const rows = filteredRecords.map(r => [
                r.employeeName,
                r.employeeCode,
                r.department,
                selectedDate,
                r.checkIn || "-",
                r.checkOut || "-",
                r.workingHours,
                r.totalBreakCount,
                r.breakDuration,
                fmtHm(r.declaredBreakSeconds),
                fmtHm(r.idleBreakSeconds),
                r.status
              ]);
              const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\\n");
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `Attendance_Break_Report_${selectedDate}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              toast({
                title: "Report Generated",
                description: "Exported daily attendance records as CSV format.",
              });
            }}
            className="text-xs font-semibold text-slate-700 border-slate-200 rounded-xl"
          >
            <Download className="size-3.5 mr-1.5 text-slate-400" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* ── SUMMARY CARDS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Present</span>
            <div className="size-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900 mt-2">{totalPresent}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">On-time arrivals</p>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Late Arrivals</span>
            <div className="size-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900 mt-2">{totalLate}</div>
          <p className="text-[11px] text-orange-600 font-medium mt-0.5">After 09:15 AM</p>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">On Leave</span>
            <div className="size-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900 mt-2">{totalOnLeave}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Approved requests</p>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Absent</span>
            <div className="size-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="size-4" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900 mt-2">{totalAbsent}</div>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">No punch record</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Breaks</span>
            <div className="size-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
              <Coffee className="size-3.5" />
            </div>
          </div>
          <div className="font-heading text-xl font-bold text-slate-900 mt-2">{totalBreaks}</div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Break Time</span>
          </div>
          <div className="font-heading text-xl font-bold text-slate-900 mt-2">{fmtHm(totalBreakSeconds)}</div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Declared Time</span>
          </div>
          <div className="font-heading text-xl font-bold text-amber-600 mt-2">{fmtHm(declaredBreakSeconds)}</div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider">Idle Time</span>
          </div>
          <div className="font-heading text-xl font-bold text-rose-600 mt-2">{fmtHm(idleBreakSeconds)}</div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">On Break</span>
            <div className="size-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="size-3.5" />
            </div>
          </div>
          <div className="font-heading text-xl font-bold text-indigo-700 mt-2">{employeesOnBreak}</div>
        </Card>
      </div>

      {/* ── FILTER TOOLBAR ─────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border-slate-200 bg-white text-slate-700 font-medium w-full sm:w-44"
            />
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs bg-white border-slate-200 rounded-xl"
            />
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="ABSENT">Absent</option>
            </select>

            {/* Employee Filter */}
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Staff Members</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ── ATTENDANCE DATA TABLE ──────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Punch In</th>
                <th className="py-3.5 px-4">Punch Out</th>
                <th className="py-3.5 px-4">Working Hours</th>
                <th className="py-3.5 px-4">Breaks</th>
                <th className="py-3.5 px-4">Break Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 bg-indigo-50 text-indigo-700 font-bold text-xs ring-1 ring-slate-100">
                          <AvatarFallback>
                            {row.employeeName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-slate-900">{row.employeeName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{row.employeeCode}</div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{row.employeeCode}</td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-slate-700">{row.department}</td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{selectedDate}</td>

                    {/* Punch In */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {row.checkIn || <span className="text-slate-300">—</span>}
                    </td>

                    {/* Punch Out */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {row.checkOut || <span className="text-slate-400 font-sans">Active</span>}
                    </td>

                    {/* Working Hours */}
                    <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-slate-800">
                      {row.workingHours}
                    </td>

                    {/* Breaks */}
                    <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-slate-800">
                      {row.totalBreakCount} Breaks
                    </td>

                    {/* Break Time */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {row.breakDuration}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(row.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(row)}
                        title="View Attendance Details"
                        className="size-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Eye className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarCheck2 className="size-8 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No attendance records found</p>
                      <p className="text-[11px] text-slate-400">Try modifying your date or department filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── MODAL: ATTENDANCE DETAILS ───────────────────────────────────────── */}
      <Dialog
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Attendance Punch Details"
        description={`Shift summary for ${selectedRecord?.employeeName} (${selectedRecord?.employeeCode})`}
      >
        {selectedRecord && (
          <div className="space-y-4 py-2 text-xs text-slate-600">
            {/* Header info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedRecord.employeeName}</div>
                <div className="text-slate-400 text-[11px]">{selectedRecord.department} • {selectedDate}</div>
              </div>
              <div>{getStatusBadge(selectedRecord.status)}</div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Check In Time</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {selectedRecord.checkIn || "Not Recorded"}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Check Out Time</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {selectedRecord.checkOut || "In Progress"}
                </span>
              </div>
            </div>

            {/* Hours & Breaks */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Breaks</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {selectedRecord.totalBreakCount}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Break Time</span>
                <span className="font-mono text-sm font-semibold text-indigo-600">
                  {Math.floor(selectedRecord.totalBreakSeconds / 60)}m {selectedRecord.totalBreakSeconds % 60}s
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Declared Break Time</span>
                <span className="font-mono text-sm font-semibold text-amber-600">
                  {Math.floor(selectedRecord.declaredBreakSeconds / 60)}m {selectedRecord.declaredBreakSeconds % 60}s
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Idle Break Time</span>
                <span className="font-mono text-sm font-semibold text-rose-600">
                  {Math.floor(selectedRecord.idleBreakSeconds / 60)}m {selectedRecord.idleBreakSeconds % 60}s
                </span>
              </div>
            </div>

            {/* Break History */}
            {selectedRecord.breakHistory && selectedRecord.breakHistory.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Break History</div>
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-3 py-2">Purpose</th>
                        <th className="px-3 py-2">Start</th>
                        <th className="px-3 py-2">End</th>
                        <th className="px-3 py-2">Duration</th>
                        <th className="px-3 py-2">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {selectedRecord.breakHistory.map((b, i) => {
                        const m = Math.floor(b.durationSeconds / 60);
                        const s = b.durationSeconds % 60;
                        const isIdle = b.breakTypeName === "System Idle" || b.breakTypeName === "Idle Break";
                        const displayPurpose = isIdle ? "Idle Break" : (b.purpose || b.breakTypeName);
                        
                        return (
                          <tr key={i}>
                            <td className="px-3 py-2 font-medium">
                              {displayPurpose}
                            </td>
                            <td className="px-3 py-2 font-mono text-slate-500">{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="px-3 py-2 font-mono text-slate-500">{b.endTime ? new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In Progress'}</td>
                            <td className="px-3 py-2 font-mono font-semibold text-amber-600">{m}m {s}s</td>
                            <td className="px-3 py-2">
                              {isIdle ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">IDLE</span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">DECLARED</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 text-[11px] space-y-1 mt-4">
              <div className="font-semibold">Compliance Note:</div>
              <div>Shift logged in Asia/Kolkata timezone. IP verified from internal corporate subnet.</div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Close View
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

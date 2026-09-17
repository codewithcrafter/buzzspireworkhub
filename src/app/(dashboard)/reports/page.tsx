"use client";

import * as React from "react";
import {
  BarChart3,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  Download,
  Users,
  Clock,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  Check,
  Building2,
  CalendarDays,
  Sparkles,
  RefreshCw,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
  MOCK_EMPLOYEES,
  MOCK_DEPARTMENTS,
  MOCK_ATTENDANCE,
  MOCK_LEAVES,
  MockAttendanceRecord,
  MockLeaveRequest,
} from "@/lib/mock-data";

type ReportTab = "attendance" | "leaves" | "headcount" | "departments" | "analytics";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState<ReportTab>("attendance");

  // Filter States
  const [startDate, setStartDate] = React.useState("2026-09-01");
  const [endDate, setEndDate] = React.useState("2026-09-16");
  const [selectedDept, setSelectedDept] = React.useState("ALL");
  const [selectedEmployee, setSelectedEmployee] = React.useState("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Export State Modal (Phase 2 UI-only demonstration)
  const [exportModal, setExportModal] = React.useState<{
    isOpen: boolean;
    format: "CSV" | "PDF";
    type: string;
    generating: boolean;
  }>({
    isOpen: false,
    format: "CSV",
    type: "Attendance",
    generating: false,
  });

  const getExportUrl = (format: "CSV" | "PDF") => {
    const fmt = format.toLowerCase();
    if (activeTab === "attendance") {
      return `/api/reports/attendance/export?format=${fmt}&startDate=${startDate}&endDate=${endDate}`;
    } else if (activeTab === "leaves") {
      return `/api/reports/leaves/export?format=${fmt}&startDate=${startDate}&endDate=${endDate}`;
    } else if (activeTab === "departments") {
      return `/api/reports/departments/export?format=${fmt}`;
    } else {
      return `/api/reports/working-hours/export?format=${fmt}&startDate=${startDate}&endDate=${endDate}`;
    }
  };

  const handleDownloadDirect = (format: "CSV" | "PDF") => {
    const url = getExportUrl(format);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExport = (format: "CSV" | "PDF") => {
    const typeName =
      activeTab === "attendance"
        ? "Attendance Summary"
        : activeTab === "leaves"
        ? "Leave Log & Quota"
        : activeTab === "headcount"
        ? "Workforce Headcount"
        : activeTab === "departments"
        ? "Department Efficiency"
        : "Operational Analytics";

    setExportModal({
      isOpen: true,
      format,
      type: typeName,
      generating: true,
    });

    setTimeout(() => {
      setExportModal((prev) => ({ ...prev, generating: false }));
    }, 400);
  };


  const handleResetFilters = () => {
    setStartDate("2026-09-01");
    setEndDate("2026-09-16");
    setSelectedDept("ALL");
    setSelectedEmployee("ALL");
    setSelectedStatus("ALL");
    setSearchQuery("");
  };

  // Filtered Attendance Records
  const filteredAttendance = React.useMemo(() => {
    return MOCK_ATTENDANCE.filter((rec: MockAttendanceRecord) => {
      if (selectedDept !== "ALL" && rec.department !== selectedDept) return false;
      if (selectedEmployee !== "ALL" && rec.employeeId !== selectedEmployee) return false;
      if (selectedStatus !== "ALL" && rec.status !== selectedStatus) return false;
      if (
        searchQuery &&
        !rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !rec.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedDept, selectedEmployee, selectedStatus, searchQuery]);

  // Filtered Leaves
  const filteredLeaves = React.useMemo(() => {
    return MOCK_LEAVES.filter((l: MockLeaveRequest) => {
      if (selectedDept !== "ALL" && l.department !== selectedDept) return false;
      if (selectedEmployee !== "ALL" && l.employeeId !== selectedEmployee) return false;
      if (selectedStatus !== "ALL" && l.status !== selectedStatus) return false;
      if (
        searchQuery &&
        !l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !l.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedDept, selectedEmployee, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Enterprise Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Executive Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="size-7 text-indigo-400" />
            Workforce Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Enterprise attendance intelligence, leave quota auditing, department headcount, and operational productivity reports.
          </p>
        </div>

        {/* Export Actions (Phase 2 UI-Ready) */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => handleOpenExport("CSV")}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl gap-2 text-xs font-semibold cursor-pointer transition-all"
          >
            <FileSpreadsheet className="size-4 text-emerald-400" />
            Export CSV
          </Button>
          <Button
            onClick={() => handleOpenExport("PDF")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 rounded-xl gap-2 text-xs font-semibold cursor-pointer transition-all"
          >
            <FileText className="size-4 text-white" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { key: "attendance", label: "Attendance", icon: Clock },
          { key: "leaves", label: "Leaves", icon: CalendarDays },
          { key: "headcount", label: "Headcount", icon: Users },
          { key: "departments", label: "Departments", icon: Building2 },
          { key: "analytics", label: "Analytics", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as ReportTab);
                setSelectedStatus("ALL");
              }}
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

      {/* Unified Report Filter Controls */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-end gap-3 justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
              {/* Date Range Start */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-xl h-10 text-xs bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Date Range End */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-xl h-10 text-xs bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">All Departments</option>
                  {MOCK_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status / Employee Filter */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {activeTab === "leaves" ? "Leave Status" : activeTab === "attendance" ? "Attendance Status" : "Employee"}
                </label>
                {activeTab === "leaves" ? (
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                ) : activeTab === "attendance" ? (
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PRESENT">PRESENT</option>
                    <option value="LATE">LATE</option>
                    <option value="ABSENT">ABSENT</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                  </select>
                ) : (
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Staff Members</option>
                    {MOCK_EMPLOYEES.map((emp) => (
                      <option key={emp.id} value={emp.employeeId}>
                        {emp.fullName} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Quick Actions & Reset */}
            <div className="flex items-center gap-2 self-end pt-1 lg:pt-0">
              <div className="relative w-full sm:w-48">
                <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search records…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-10 text-xs rounded-xl"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="h-10 rounded-xl text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Reset Filters"
              >
                <RefreshCw className="size-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 1. ATTENDANCE TAB */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Scheduled</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-slate-900">{filteredAttendance.length}</span>
                <span className="text-xs text-indigo-600 font-semibold">100% Target</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Daily roster headcount</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Present On Time</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-emerald-600">
                  {filteredAttendance.filter((r: MockAttendanceRecord) => r.status === "PRESENT").length}
                </span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">On Track</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Clocked in before 09:15 AM</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Late Arrivals</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-amber-600">
                  {filteredAttendance.filter((r: MockAttendanceRecord) => r.status === "LATE").length}
                </span>
                <span className="text-xs text-amber-600 font-medium">Grace Window</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Exceeded 15 min grace period</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Absent / On Leave</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-rose-600">
                  {filteredAttendance.filter((r: MockAttendanceRecord) => r.status === "ABSENT" || r.status === "ON_LEAVE").length}
                </span>
                <span className="text-xs text-rose-600 font-medium">Excused & Unexcused</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Approved leaves + no-shows</p>
            </Card>
          </div>

          {/* Attendance Distribution Chart Placeholder */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Attendance Distribution Ratio</h3>
                <p className="text-xs text-slate-400">Punctuality vs Absence for selected scope</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700">Scope: {selectedDept}</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: "75%" }} className="bg-emerald-500" title="Present (75%)" />
              <div style={{ width: "15%" }} className="bg-amber-400" title="Late (15%)" />
              <div style={{ width: "6%" }} className="bg-blue-400" title="On Leave (6%)" />
              <div style={{ width: "4%" }} className="bg-rose-500" title="Absent (4%)" />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span>Present: <strong>75%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span>Late Arrival: <strong>15%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-blue-400" />
                <span>On Leave: <strong>6%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500" />
                <span>Absent: <strong>4%</strong></span>
              </div>
            </div>
          </Card>

          {/* Attendance Data Table */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="text-left px-5 py-3">Employee</th>
                    <th className="text-left px-5 py-3">Department</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Check In</th>
                    <th className="text-left px-5 py-3">Check Out</th>
                    <th className="text-left px-5 py-3">Working Hours</th>
                    <th className="text-left px-5 py-3">Break</th>
                    <th className="text-left px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-400">
                        No attendance records match the selected report parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((rec: MockAttendanceRecord) => (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-slate-900">{rec.employeeName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{rec.employeeCode}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{rec.department}</td>
                        <td className="px-5 py-3 text-slate-700 font-mono">{rec.date}</td>
                        <td className="px-5 py-3 text-slate-700 font-mono">{rec.checkIn || "—"}</td>
                        <td className="px-5 py-3 text-slate-700 font-mono">{rec.checkOut || "—"}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{rec.workingHours}</td>
                        <td className="px-5 py-3 text-slate-500">{rec.breakDuration}</td>
                        <td className="px-5 py-3">
                          <Badge
                            className={
                              rec.status === "PRESENT"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : rec.status === "LATE"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : rec.status === "ON_LEAVE"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }
                          >
                            {rec.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredAttendance.length} records</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled className="rounded-lg h-7 px-2">
                  <ChevronLeft className="size-3" />
                </Button>
                <span className="px-2 font-medium">Page 1 of 1</span>
                <Button variant="outline" size="sm" disabled className="rounded-lg h-7 px-2">
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 2. LEAVES TAB */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "leaves" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leave Requests</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{filteredLeaves.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Logged in report timeframe</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved Requests</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {filteredLeaves.filter((l: MockLeaveRequest) => l.status === "APPROVED").length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Authorized by HR/Manager</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {filteredLeaves.filter((l: MockLeaveRequest) => l.status === "PENDING").length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Awaiting managerial sign-off</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejected Requests</p>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {filteredLeaves.filter((l: MockLeaveRequest) => l.status === "REJECTED").length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Conflicts or quota exhausted</p>
            </Card>
          </div>

          {/* Leave Type Breakdown */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Leave Categorization Volume</h3>
                <p className="text-xs text-slate-400">Proportional utilization across leave classes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">Casual Leaves</span>
                <p className="text-lg font-black text-indigo-900 mt-0.5">42%</p>
                <span className="text-[10px] text-slate-500">Short personal notice</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Annual Vacations</span>
                <p className="text-lg font-black text-emerald-900 mt-0.5">33%</p>
                <span className="text-[10px] text-slate-500">Scheduled downtime</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Sick & Medical</span>
                <p className="text-lg font-black text-amber-900 mt-0.5">18%</p>
                <span className="text-[10px] text-slate-500">Medical emergency</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-700 uppercase">Unpaid / Other</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">7%</p>
                <span className="text-[10px] text-slate-500">Special consideration</span>
              </div>
            </div>
          </Card>

          {/* Leaves Log Table */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="text-left px-5 py-3">Employee</th>
                    <th className="text-left px-5 py-3">Leave Type</th>
                    <th className="text-left px-5 py-3">Dates</th>
                    <th className="text-left px-5 py-3">Duration</th>
                    <th className="text-left px-5 py-3">Reason</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Approver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        No leave records match the specified filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeaves.map((l: MockLeaveRequest) => (
                      <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-slate-900">{l.employeeName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{l.employeeCode} · {l.department}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {l.leaveType}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-700 font-mono">
                          {l.startDate} → {l.endDate}
                        </td>
                        <td className="px-5 py-3 font-bold text-slate-800">{l.duration} day{l.duration > 1 ? "s" : ""}</td>
                        <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{l.reason}</td>
                        <td className="px-5 py-3">
                          <Badge
                            className={
                              l.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : l.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }
                          >
                            {l.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{l.reviewedBy || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 3. HEADCOUNT TAB */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "headcount" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Headcount</p>
              <p className="text-2xl font-black text-indigo-700 mt-1">52</p>
              <p className="text-[11px] text-slate-500 mt-1">100% active full-time staff</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Employees</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">50</p>
              <p className="text-[11px] text-slate-500 mt-1">Confirmed permanent payroll</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Probation / New</p>
              <p className="text-2xl font-black text-blue-600 mt-1">2</p>
              <p className="text-[11px] text-slate-500 mt-1">Joined in last 30 days</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Staff Retention</p>
              <p className="text-2xl font-black text-slate-900 mt-1">98.2%</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">0% attrition this quarter</p>
            </Card>
          </div>

          {/* Department Headcount Bar Graphic */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Headcount Distribution by Department</h3>
                <p className="text-xs text-slate-400">Total staff allocation across business units</p>
              </div>
              <Badge variant="outline" className="text-xs">5 Business Units</Badge>
            </div>

            <div className="space-y-3 pt-2">
              {MOCK_DEPARTMENTS.map((dept) => {
                const percentage = Math.round((dept.employeeCount / 52) * 100);
                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{dept.name} ({dept.code})</span>
                      <span className="text-slate-500 font-mono font-medium">
                        {dept.employeeCount} members ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 4. DEPARTMENTS TAB */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-5 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Department Performance & Attendance Roster</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Punctuality scores, active staffing, and management leadership
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="text-left px-5 py-3">Department</th>
                    <th className="text-left px-5 py-3">Code</th>
                    <th className="text-left px-5 py-3">Manager</th>
                    <th className="text-left px-5 py-3">Team Size</th>
                    <th className="text-left px-5 py-3">Avg Hours</th>
                    <th className="text-left px-5 py-3">Punctuality Score</th>
                    <th className="text-left px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_DEPARTMENTS.map((dept, idx) => (
                    <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-900">{dept.name}</td>
                      <td className="px-5 py-3 font-mono text-indigo-700 font-semibold">{dept.code}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{dept.managerName}</p>
                        <p className="text-[10px] text-slate-400">{dept.managerEmail}</p>
                      </td>
                      <td className="px-5 py-3 font-bold text-slate-800">{dept.employeeCount} staff</td>
                      <td className="px-5 py-3 font-mono text-slate-600">8h {idx * 5 + 10}m</td>
                      <td className="px-5 py-3">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          {96 - idx * 2}%
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {dept.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 5. ANALYTICS TAB */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Daily Working Hours</p>
              <p className="text-2xl font-black text-indigo-700 mt-1">8.2 hrs</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">+0.2 hrs vs last month</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Break Time</p>
              <p className="text-2xl font-black text-amber-700 mt-1">45 mins</p>
              <p className="text-[11px] text-slate-500 mt-1">Well within 60 min allowance</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Punctuality Index</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">94.8%</p>
              <p className="text-[11px] text-slate-500 mt-1">Clock-in before grace threshold</p>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-sm p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Core Hours Adherence</p>
              <p className="text-2xl font-black text-blue-700 mt-1">98.5%</p>
              <p className="text-[11px] text-slate-500 mt-1">Available 10:00 AM - 17:00 PM</p>
            </Card>
          </div>

          {/* Weekly Work Hours SVG Bar Chart Placeholder */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Weekly Average Hours per Work Day</h3>
                <p className="text-xs text-slate-400">Current pay cycle working hours trend</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700">Baseline: 8.0 hrs</span>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-4 text-center">
              {[
                { day: "Monday", hours: 8.4, pct: 84 },
                { day: "Tuesday", hours: 8.6, pct: 86 },
                { day: "Wednesday", hours: 8.5, pct: 85 },
                { day: "Thursday", hours: 8.3, pct: 83 },
                { day: "Friday", hours: 7.9, pct: 79 },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center space-y-2">
                  <div className="h-32 w-full bg-slate-100 rounded-xl flex items-end justify-center p-2">
                    <div
                      className="w-full bg-indigo-600 rounded-lg transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ height: `${item.pct}%` }}
                    >
                      {item.hours}h
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* EXPORT CONFIRMATION DIALOG (Phase 2 UI Interaction) */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <Dialog
        isOpen={exportModal.isOpen}
        onClose={() => setExportModal((prev) => ({ ...prev, isOpen: false }))}
        title={`Export ${exportModal.type} (${exportModal.format})`}
        description="Configure report parameters and generate your document."
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          {exportModal.generating ? (
            <div className="p-8 text-center space-y-3">
              <div className="size-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
              <p className="font-semibold text-slate-800">Preparing {exportModal.format} export bundle…</p>
              <p className="text-[11px] text-slate-400">Compiling records between {startDate} and {endDate}</p>
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1.5">
                <div className="flex items-center justify-between text-indigo-900 font-semibold">
                  <span>Report Scope:</span>
                  <span className="font-bold">{exportModal.type}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Date Range:</span>
                  <span className="font-mono">{startDate} to {endDate}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Target Department:</span>
                  <span className="font-medium">{selectedDept}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>File Output:</span>
                  <span className="font-mono text-indigo-700 font-bold">
                    workhub-{activeTab}-report.{exportModal.format.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>
                  Ready for export. The {exportModal.format} document will be generated server-side and downloaded directly.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setExportModal((prev) => ({ ...prev, isOpen: false }))}
                  className="rounded-xl"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleDownloadDirect(exportModal.format);
                    setExportModal((prev) => ({ ...prev, isOpen: false }));
                  }}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  <Download className="size-3.5" />
                  Download {exportModal.format}
                </Button>
              </div>

            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}

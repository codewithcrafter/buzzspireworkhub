"use client";

import * as React from "react";
import {
  Coffee,
  Search,
  Download,
  Eye,
  Clock,
  Activity,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface BreakRecord {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  breakTypeName: string;
  purpose: string | null;
  startTime: string;
  endTime: string | null;
  durationSeconds: number;
}

interface EmployeeSummary {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  checkIn: string | null;
  checkOut: string | null;
  netWorkingSeconds: number;
  totalBreakCount: number;
  totalBreakSeconds: number;
  declaredBreakSeconds: number;
  idleBreakSeconds: number;
  breakHistory: BreakRecord[];
}

export default function BreakActivityPage() {
  const { toast } = useToast();

  const [employees, setEmployees] = React.useState<EmployeeSummary[]>([]);
  const [flatBreaks, setFlatBreaks] = React.useState<BreakRecord[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  // Modal State
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeSummary | null>(null);

  React.useEffect(() => {
    async function loadBreakActivity() {
      try {
        const res = await fetch(`/api/admin/live-attendance?date=${selectedDate}`);
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.success && Array.isArray(data.liveStates)) {
          const empSummaries: EmployeeSummary[] = [];
          const allBreaks: BreakRecord[] = [];
          
          data.liveStates.forEach((s: any) => {
            const bh = s.breakHistory || [];
            
            const summary: EmployeeSummary = {
              employeeId: s.employeeId,
              employeeName: s.fullName,
              employeeCode: s.employeeCode,
              department: s.department || "General",
              checkIn: s.punchIn ? new Date(s.punchIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
              checkOut: s.currentState === "COMPLETED" ? new Date(s.lastPunchOut || new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
              netWorkingSeconds: s.netWorkingSeconds || 0,
              totalBreakCount: bh.length,
              totalBreakSeconds: s.totalBreakSeconds || 0,
              declaredBreakSeconds: s.declaredBreakSeconds || 0,
              idleBreakSeconds: s.idleBreakSeconds || 0,
              breakHistory: [],
            };

            bh.forEach((b: any) => {
              const record: BreakRecord = {
                employeeId: s.employeeId,
                employeeName: s.fullName,
                employeeCode: s.employeeCode,
                department: s.department || "General",
                breakTypeName: b.breakTypeName,
                purpose: b.purpose,
                startTime: b.startTime,
                endTime: b.endTime,
                durationSeconds: b.durationSeconds,
              };
              allBreaks.push(record);
              summary.breakHistory.push(record);
            });
            
            empSummaries.push(summary);
          });
          
          setEmployees(empSummaries);
          setFlatBreaks(allBreaks.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    loadBreakActivity();
    
    // Polling every 30 seconds for live updates
    const interval = setInterval(loadBreakActivity, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  // Filters for flat breaks
  const filteredBreaks = React.useMemo(() => {
    return flatBreaks.filter((rec) => {
      const matchesSearch =
        rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === "ALL" || rec.department === departmentFilter;
      
      const isIdle = rec.breakTypeName === "System Idle" || rec.breakTypeName === "Idle Break";
      const matchesType = typeFilter === "ALL" 
        ? true 
        : typeFilter === "IDLE" ? isIdle : !isIdle;
        
      const isActive = !rec.endTime;
      const matchesStatus = statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE" ? isActive : !isActive;

      return matchesSearch && matchesDept && matchesType && matchesStatus;
    });
  }, [flatBreaks, searchTerm, departmentFilter, typeFilter, statusFilter]);

  // KPIs
  const totalBreaks = flatBreaks.length;
  const totalBreakSeconds = flatBreaks.reduce((sum, b) => sum + b.durationSeconds, 0);
  const activeBreaksCount = flatBreaks.filter(b => !b.endTime).length;
  const idleBreakSeconds = flatBreaks.filter(b => b.breakTypeName === "System Idle" || b.breakTypeName === "Idle Break").reduce((sum, b) => sum + b.durationSeconds, 0);

  const activeBreaks = flatBreaks.filter(b => !b.endTime);

  const fmtHm = (sec: number) => `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  const fmtM = (sec: number) => `${Math.floor(sec / 60)}m`;

  const handleOpenDetail = (empId: string) => {
    const emp = employees.find(e => e.employeeId === empId);
    if (emp) {
      setSelectedEmployee(emp);
      setDetailModalOpen(true);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Employee", "Employee ID", "Department", "Date", "Purpose", "Type", "Start Time", "End Time", "Duration", "Status"
    ];
    const rows = filteredBreaks.map(r => {
      const isIdle = r.breakTypeName === "System Idle" || r.breakTypeName === "Idle Break";
      const type = isIdle ? "IDLE" : "DECLARED";
      const purpose = isIdle ? "Idle Break" : (r.purpose || r.breakTypeName);
      const start = new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const end = r.endTime ? new Date(r.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active";
      const duration = `${Math.floor(r.durationSeconds / 60)}m ${r.durationSeconds % 60}s`;
      const status = r.endTime ? "COMPLETED" : "ACTIVE";
      
      return [
        r.employeeName,
        r.employeeCode,
        r.department,
        selectedDate,
        purpose,
        type,
        start,
        end,
        duration,
        status
      ];
    });
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Break_Activity_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Break Activity Report exported to CSV.",
    });
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              Break Activity
            </h1>
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-xs">
              Live Monitor
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor employee breaks, break duration, purposes and idle time in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="text-xs font-semibold text-slate-700 border-slate-200 rounded-xl"
          >
            <Download className="size-3.5 mr-1.5 text-slate-400" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* ── TOP SUMMARY CARDS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Breaks Today</span>
            <div className="size-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
              <Coffee className="size-3.5" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-slate-900 mt-2">{totalBreaks}</div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">Total Break Time</span>
            <div className="size-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="size-3.5" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-indigo-700 mt-2">{fmtHm(totalBreakSeconds)}</div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Active Breaks</span>
            <div className="size-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="size-3.5" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-amber-700 mt-2">{activeBreaksCount}</div>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider">Idle Break Time</span>
            <div className="size-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center">
              <User className="size-3.5" />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-rose-700 mt-2">{fmtM(idleBreakSeconds)}</div>
        </Card>
      </div>

      {/* ── LIVE ACTIVE BREAK SECTION ──────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
          Live Break Activity
        </h2>
        {activeBreaks.length === 0 ? (
          <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm p-6 text-center">
            <p className="text-sm text-slate-400 font-medium">No employees are currently on break.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeBreaks.map((b, i) => {
              const isIdle = b.breakTypeName === "System Idle" || b.breakTypeName === "Idle Break";
              const displayPurpose = isIdle ? "Idle Break" : (b.purpose || b.breakTypeName);
              return (
                <Card key={i} className="rounded-2xl border-indigo-200 bg-indigo-50/30 overflow-hidden shadow-sm relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 animate-pulse"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 bg-white border border-slate-200">
                          <AvatarFallback className="text-xs font-bold text-slate-600">
                            {b.employeeName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{b.employeeName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{b.employeeCode} • {b.department}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-3 border border-indigo-100/50 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Purpose</span>
                        <span className="font-bold text-slate-700">{displayPurpose}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Started</span>
                        <span className="font-mono font-medium text-slate-600">{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-50">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Duration</span>
                        <span className="font-mono font-bold text-amber-600 text-sm">
                          {Math.floor(b.durationSeconds / 60)}m {b.durationSeconds % 60}s
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Type</span>
                        {isIdle ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">IDLE</span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">DECLARED</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FILTERS ────────────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border-slate-200 bg-white text-slate-700 font-medium w-full sm:w-44"
            />
          </div>

          <div className="relative flex-1 w-full">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs bg-white border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="DECLARED">Declared</option>
              <option value="IDLE">Idle</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ── BREAK ACTIVITY TABLE ──────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
          Today's Break Activity
        </h2>
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Break Purpose</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Start Time</th>
                  <th className="py-3.5 px-4">End Time</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBreaks.length > 0 ? (
                  filteredBreaks.map((row, idx) => {
                    const isIdle = row.breakTypeName === "System Idle" || row.breakTypeName === "Idle Break";
                    const displayPurpose = isIdle ? "Idle Break" : (row.purpose || row.breakTypeName);
                    const isActive = !row.endTime;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.employeeName}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{row.employeeCode}</td>
                        <td className="py-3.5 px-4 text-slate-700">{row.department}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{displayPurpose}</td>
                        <td className="py-3.5 px-4">
                          {isIdle ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">IDLE</span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">DECLARED</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">{new Date(row.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">{row.endTime ? new Date(row.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-slate-800">
                          {Math.floor(row.durationSeconds / 60)}m {row.durationSeconds % 60}s
                        </td>
                        <td className="py-3.5 px-4">
                          {isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">ACTIVE</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">COMPLETED</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenDetail(row.employeeId)}
                            title="View Employee Summary"
                            className="size-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Eye className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Coffee className="size-8 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">No break activity found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── MODAL: VIEW DETAILS ───────────────────────────────────────────── */}
      <Dialog
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Employee Break Summary"
        description={`Detailed timeline for ${selectedEmployee?.employeeName}`}
      >
        {selectedEmployee && (
          <div className="space-y-4 py-2 text-xs text-slate-600">
            {/* Header info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedEmployee.employeeName}</div>
                <div className="text-slate-400 text-[11px]">{selectedEmployee.employeeCode} • {selectedEmployee.department} • {selectedDate}</div>
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Punch In</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {selectedEmployee.checkIn || "Not Recorded"}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Punch Out</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {selectedEmployee.checkOut || "Active Shift"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Breaks</span>
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {selectedEmployee.totalBreakCount}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Break Time</span>
                <span className="font-mono text-sm font-semibold text-indigo-600">
                  {Math.floor(selectedEmployee.totalBreakSeconds / 60)}m {selectedEmployee.totalBreakSeconds % 60}s
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Declared Break Time</span>
                <span className="font-mono text-sm font-semibold text-amber-600">
                  {Math.floor(selectedEmployee.declaredBreakSeconds / 60)}m {selectedEmployee.declaredBreakSeconds % 60}s
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Idle Break Time</span>
                <span className="font-mono text-sm font-semibold text-rose-600">
                  {Math.floor(selectedEmployee.idleBreakSeconds / 60)}m {selectedEmployee.idleBreakSeconds % 60}s
                </span>
              </div>
            </div>

            {selectedEmployee.breakHistory && selectedEmployee.breakHistory.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Break Timeline</div>
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
                      {selectedEmployee.breakHistory.map((b, i) => {
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

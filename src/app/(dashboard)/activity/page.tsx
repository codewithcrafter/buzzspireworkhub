"use client";

import * as React from "react";
import { Users, Calendar as CalendarIcon, ActivitySquare } from "lucide-react";
import { UnifiedTimeline } from "@/components/activity/UnifiedTimeline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminActivityDashboard() {
  const [employees, setEmployees] = React.useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split("T")[0]);

  React.useEffect(() => {
    async function loadEmployees() {
      try {
        const res = await fetch("/api/admin/employees");
        if (res.ok) {
          const d = await res.json();
          setEmployees(d.data?.employees || []);
          if (d.data?.employees?.length > 0) {
            setSelectedEmployeeId(d.data.employees[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load employees");
      }
    }
    loadEmployees();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <ActivitySquare className="size-3.5" />
              Unified Monitoring
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Employee Activity Monitoring
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Complete chronological timeline of attendance, breaks, idle time, and work activity records.
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <Card className="p-4 rounded-2xl border border-slate-200 shadow-sm bg-white flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="size-3.5 text-indigo-500" />
            Select Employee
          </label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-medium bg-slate-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="" disabled>Select an employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.fullName} ({emp.employeeCode})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarIcon className="size-3.5 text-indigo-500" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-medium bg-slate-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </Card>

      {/* TIMELINE */}
      <Card className="rounded-3xl border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-widest">
            Activity Timeline
          </h2>
        </div>
        <div className="p-4 sm:p-6 bg-slate-50/30">
          {selectedEmployeeId ? (
            <UnifiedTimeline employeeId={selectedEmployeeId} date={selectedDate} />
          ) : (
            <div className="text-center text-slate-500 py-10">Select an employee to view their timeline.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

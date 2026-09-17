"use client";

import * as React from "react";
import { UnifiedTimeline } from "@/components/activity/UnifiedTimeline";
import { Card } from "@/components/ui/card";
import { CalendarIcon, UserCircle } from "lucide-react";

export default function StaffActivityPage() {
  const [profile, setProfile] = React.useState<any>(null);
  const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split("T")[0]);

  React.useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const d = await res.json();
          setProfile(d.data?.employee);
        }
      } catch (e) {
        console.error("Failed to load auth profile");
      }
    }
    loadMe();
  }, []);

  if (!profile) {
    return <div className="p-10 text-center text-slate-500 animate-pulse">Loading Activity...</div>;
  }

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <UserCircle className="size-3.5" />
            My Activity
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Activity Timeline
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Review your attendance events, breaks, and recorded daily activity chronologically.
          </p>
        </div>
      </div>

      <Card className="p-4 rounded-2xl border border-slate-200 shadow-sm bg-white flex flex-col sm:flex-row gap-4 items-end">
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

      <Card className="rounded-3xl border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-widest">
            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
        </div>
        <div className="p-4 sm:p-6 bg-slate-50/30">
          <UnifiedTimeline employeeId={profile.id} date={selectedDate} />
        </div>
      </Card>
    </div>
  );
}

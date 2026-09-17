"use client";

import * as React from "react";
import { 
  LogIn, 
  LogOut, 
  Coffee, 
  MonitorOff, 
  Globe, 
  AppWindow, 
  Clock, 
  RotateCcw,
  Activity
} from "lucide-react";
import { TimelineEvent } from "@/services/timeline.service";
import { Skeleton } from "@/components/ui/skeleton";

interface UnifiedTimelineProps {
  employeeId: string;
  date: string | Date;
}

const fmtTime = (d: string | Date) => 
  new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const fmtDur = (sec: number) => {
  if (!sec) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

export function UnifiedTimeline({ employeeId, date }: UnifiedTimelineProps) {
  const [events, setEvents] = React.useState<TimelineEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const fetchTimeline = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryDate = typeof date === "string" ? date : date.toISOString();
        const res = await fetch(`/api/activity/timeline?employeeId=${employeeId}&date=${encodeURIComponent(queryDate)}`);
        const d = await res.json();
        
        if (!active) return;

        if (res.ok && d.success) {
          setEvents(d.data.timeline || []);
        } else {
          setError(d.error || d.message || "Failed to load timeline");
        }
      } catch (err: any) {
        if (active) setError(err.message || "Network error");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTimeline();
    return () => { active = false; };
  }, [employeeId, date]);

  if (loading) {
    return (
      <div className="space-y-6 pt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200">
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
        <Activity className="size-8 mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">No activity recorded</p>
        <p className="text-xs mt-1">There are no timeline events for this date.</p>
      </div>
    );
  }

  return (
    <div className="relative pt-6 pb-10 px-2 sm:px-6">
      {/* Timeline track line */}
      <div className="absolute top-8 bottom-0 left-[3rem] sm:left-[5.5rem] w-0.5 bg-slate-100" />

      <div className="space-y-8 relative z-10">
        {events.map((ev, idx) => {
          let Icon = Activity;
          let colorClass = "bg-slate-100 text-slate-500 ring-slate-100";
          
          switch (ev.eventType) {
            case 'ATTENDANCE_PUNCH_IN':
              Icon = LogIn;
              colorClass = "bg-emerald-100 text-emerald-600 ring-emerald-50";
              break;
            case 'ATTENDANCE_PUNCH_OUT':
              Icon = LogOut;
              colorClass = "bg-rose-100 text-rose-600 ring-rose-50";
              break;
            case 'BREAK_STARTED':
              Icon = Coffee;
              colorClass = "bg-indigo-100 text-indigo-600 ring-indigo-50";
              break;
            case 'BREAK_ENDED':
              Icon = Clock;
              colorClass = "bg-indigo-50 text-indigo-400 ring-indigo-50";
              break;
            case 'IDLE_BREAK_STARTED':
              Icon = MonitorOff;
              colorClass = "bg-amber-100 text-amber-600 ring-amber-50";
              break;
            case 'IDLE_BREAK_ENDED':
              Icon = MonitorOff;
              colorClass = "bg-amber-50 text-amber-400 ring-amber-50";
              break;
            case 'WEBSITE_ACTIVITY':
              Icon = Globe;
              colorClass = "bg-sky-100 text-sky-600 ring-sky-50";
              break;
            case 'APPLICATION_ACTIVITY':
              Icon = AppWindow;
              colorClass = "bg-purple-100 text-purple-600 ring-purple-50";
              break;
            case 'SESSION_LOGIN':
              Icon = LogIn;
              colorClass = "bg-slate-100 text-slate-600 ring-slate-50";
              break;
            case 'SESSION_LOGOUT':
              Icon = LogOut;
              colorClass = "bg-slate-100 text-slate-600 ring-slate-50";
              break;
            case 'SESSION_RECOVERY':
              Icon = RotateCcw;
              colorClass = "bg-slate-100 text-slate-600 ring-slate-50";
              break;
          }

          const durationStr = fmtDur(ev.durationSeconds);

          return (
            <div key={ev.id || idx} className="flex gap-4 sm:gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}>
              
              {/* Time Stamp */}
              <div className="w-12 sm:w-16 pt-1 text-right shrink-0">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase">
                  {fmtTime(ev.startedAt)}
                </span>
              </div>

              {/* Node */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className={`size-8 sm:size-10 rounded-full flex items-center justify-center ring-4 ${colorClass}`}>
                  <Icon className="size-4 sm:size-5" />
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 pb-1">
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                    {durationStr && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 whitespace-nowrap">
                        Duration: {durationStr}
                      </span>
                    )}
                  </div>
                  
                  {ev.description && (
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl break-words">
                      {ev.description}
                    </p>
                  )}
                  
                  {ev.source && (
                    <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="size-1.5 rounded-full bg-slate-300" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {ev.source}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

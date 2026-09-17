"use client";

import * as React from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Calendar,
  Pencil,
  Trash2,
  Sparkles,
  Palmtree,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { MOCK_HOLIDAYS, MockHoliday } from "@/lib/mock-data";

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  type: "NATIONAL" | "PUBLIC" | "COMPANY" | "OPTIONAL";
  description: string;
  status: string;
}

export default function HolidaysPage() {
  const { toast } = useToast();

  const [holidays, setHolidays] = React.useState<HolidayItem[]>(MOCK_HOLIDAYS);
  const [loading, setLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [yearFilter, setYearFilter] = React.useState("2026");
  const [typeFilter, setTypeFilter] = React.useState("ALL");

  // Modals
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedHoliday, setSelectedHoliday] = React.useState<HolidayItem | null>(null);

  // Form states
  const [formName, setFormName] = React.useState("");
  const [formDate, setFormDate] = React.useState("");
  const [formType, setFormType] = React.useState<HolidayItem["type"]>("PUBLIC");
  const [formDesc, setFormDesc] = React.useState("");

  const fetchHolidays = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/holidays?year=${yearFilter}`);
      if (res.ok) {
        const json = await res.json();
        const records = json.holidays || json.data?.holidays;
        if (Array.isArray(records)) {
          const mapped = records.map((h: any) => {
            const d = new Date(h.date);
            return {
              id: h.id,
              name: h.name,
              date: typeof h.date === "string" ? h.date.split("T")[0] : d.toISOString().split("T")[0],
              dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
              type: h.type as any,
              description: h.description || "Official holiday observance.",
              status: h.status || "ACTIVE",
            };
          });
          setHolidays(mapped);
          setIsOffline(false);
          setLoading(false);
          return;
        }
      }
      setIsOffline(true);
    } catch {
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, [yearFilter]);

  React.useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const filteredHolidays = React.useMemo(() => {
    return holidays.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear = h.date.startsWith(yearFilter);

      const matchesType =
        typeFilter === "ALL" || h.type === typeFilter;

      return matchesSearch && matchesYear && matchesType;
    });
  }, [holidays, searchTerm, yearFilter, typeFilter]);

  const handleOpenEdit = (h: HolidayItem) => {
    setSelectedHoliday(h);
    setFormName(h.name);
    setFormDate(h.date);
    setFormType(h.type);
    setFormDesc(h.description);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (h: HolidayItem) => {
    setSelectedHoliday(h);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDate) return;

    try {
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          date: formDate,
          type: formType,
          description: formDesc.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Failed to Add Holiday",
          description: data.error || "Could not save holiday.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Holiday Scheduled",
        description: `${formName} added to the corporate calendar.`,
        type: "success",
      });

      setIsAddOpen(false);
      fetchHolidays();
    } catch {
      const dateObj = new Date(formDate);
      const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });

      const newH: HolidayItem = {
        id: `hol-${Date.now()}`,
        name: formName.trim(),
        date: formDate,
        dayOfWeek,
        type: formType,
        description: formDesc.trim() || "Official company scheduled holiday.",
        status: "ACTIVE",
      };

      setHolidays([...holidays, newH]);
      setIsAddOpen(false);
      toast({
        title: "Holiday Scheduled (Offline)",
        description: `${newH.name} added to calendar locally.`,
        type: "success",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHoliday || !formName.trim() || !formDate) return;

    try {
      const res = await fetch(`/api/holidays/${selectedHoliday.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          date: formDate,
          type: formType,
          description: formDesc.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Update Failed",
          description: data.error || "Could not update holiday details.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Holiday Updated",
        description: `Changes to ${formName} saved successfully.`,
        type: "success",
      });

      setIsEditOpen(false);
      fetchHolidays();
    } catch {
      const dateObj = new Date(formDate);
      const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });

      setHolidays((prev) =>
        prev.map((h) =>
          h.id === selectedHoliday.id
            ? {
                ...h,
                name: formName.trim(),
                date: formDate,
                dayOfWeek,
                type: formType,
                description: formDesc.trim(),
              }
            : h
        )
      );

      setIsEditOpen(false);
      toast({
        title: "Holiday Updated (Offline)",
        description: `Changes to ${formName} saved locally.`,
        type: "success",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedHoliday) return;

    try {
      const res = await fetch(`/api/holidays/${selectedHoliday.id}?permanent=true`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Delete Failed",
          description: data.error || "Could not remove holiday.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Holiday Removed",
        description: `${selectedHoliday.name} removed from calendar.`,
        type: "warning",
      });

      setIsDeleteOpen(false);
      fetchHolidays();
    } catch {
      setHolidays((prev) => prev.filter((h) => h.id !== selectedHoliday.id));
      setIsDeleteOpen(false);
      toast({
        title: "Holiday Removed (Offline)",
        description: `${selectedHoliday.name} removed locally.`,
        type: "warning",
      });
    }
  };

  const getTypeBadge = (type: HolidayItem["type"]) => {
    switch (type) {
      case "NATIONAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            NATIONAL
          </span>
        );
      case "PUBLIC":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            PUBLIC
          </span>
        );
      case "COMPANY":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            COMPANY
          </span>
        );
      case "OPTIONAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            OPTIONAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              Company Holiday Calendar
            </h1>
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-xs">
              {holidays.length} Total
            </Badge>
            {isOffline && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official paid non-working days and observed national festivals for {yearFilter}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHolidays}
            disabled={loading}
            className="h-10 px-3 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => {
              setFormName("");
              setFormDate(`${yearFilter}-10-15`);
              setFormType("PUBLIC");
              setFormDesc("");
              setIsAddOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm shadow-indigo-600/20"
          >
            <Plus className="size-4 mr-1.5" />
            Add Holiday
          </Button>
        </div>
      </div>

      {/* ── NEXT UPCOMING HOLIDAY BANNER ─────────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white border border-indigo-800/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Palmtree className="size-4 text-emerald-400" />
            Next Upcoming Holiday
          </div>
          <div className="font-heading text-xl font-bold text-white">
            Mahatma Gandhi Birthday (Gandhi Jayanti)
          </div>
          <p className="text-xs text-slate-300">
            Friday, 02 October 2026 • 3-Day Long Weekend
          </p>
        </div>

        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs px-3 py-1 self-start sm:self-center">
          National Holiday
        </Badge>
      </div>

      {/* ── FILTER TOOLBAR ─────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="2026">Year 2026</option>
              <option value="2025">Year 2025</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search holiday name or festival..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs bg-white border-slate-200 rounded-xl"
            />
          </div>

          {/* Type Filter */}
          <div className="w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="NATIONAL">National Holiday</option>
              <option value="PUBLIC">Public Festival</option>
              <option value="COMPANY">Company Wellness</option>
              <option value="OPTIONAL">Optional / Restricted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ── HOLIDAYS LIST / TABLE ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHolidays.map((h) => (
          <Card
            key={h.id}
            className="rounded-2xl border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 leading-none">
                      {new Date(h.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="font-heading font-extrabold text-base text-slate-900 leading-tight">
                      {new Date(h.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-sm">{h.name}</h3>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {h.dayOfWeek} • {h.date}
                    </div>
                  </div>
                </div>

                <div>{getTypeBadge(h.type)}</div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pl-15">
                {h.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-end gap-1">
              <button
                onClick={() => handleOpenEdit(h)}
                title="Edit Holiday"
                className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={() => handleOpenDelete(h)}
                title="Delete Holiday"
                className="size-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* ── MODAL 1: ADD HOLIDAY ────────────────────────────────────────────── */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule Corporate Holiday"
        description="Add a paid observance to the organizational holiday calendar."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Holiday / Festival Name *</label>
            <Input
              placeholder="e.g. Diwali (Deepavali)"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Date Observed *</label>
              <Input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800"
              >
                <option value="NATIONAL">National Holiday</option>
                <option value="PUBLIC">Public Festival</option>
                <option value="COMPANY">Company Wellness Day</option>
                <option value="OPTIONAL">Optional / Restricted</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Description / Cultural Significance</label>
            <textarea
              placeholder="Short context about the observance..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full h-20 p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl"
            >
              Save to Calendar
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 2: EDIT HOLIDAY ───────────────────────────────────────────── */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Holiday"
        description={`Update details for ${selectedHoliday?.name}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Holiday Name *</label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Date Observed *</label>
              <Input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800"
              >
                <option value="NATIONAL">National Holiday</option>
                <option value="PUBLIC">Public Festival</option>
                <option value="COMPANY">Company Wellness Day</option>
                <option value="OPTIONAL">Optional / Restricted</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full h-20 p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl"
            >
              Update Holiday
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 3: DELETE CONFIRMATION ────────────────────────────────────── */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Remove Holiday"
        description="Are you sure you want to remove this holiday from the schedule?"
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
            <AlertTriangle className="size-5 shrink-0 text-rose-600 mt-0.5" />
            <p>
              Removing <strong className="text-slate-900">{selectedHoliday?.name}</strong> on {selectedHoliday?.date} will treat this date as a standard working day for attendance tracking.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-xl"
            >
              Delete from Calendar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

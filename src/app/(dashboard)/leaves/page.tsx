"use client";

import * as React from "react";
import {
  CalendarOff,
  CalendarPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  AlertCircle,
  Calendar,
  FileText,
  Users,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { MockLeaveRequest } from "@/lib/mock-data";

export interface LeaveItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  rejectionReason?: string;
  reviewedBy?: string;
  appliedOn?: string;
}

export default function LeavesPage() {
  const { toast } = useToast();

  const [leaves, setLeaves] = React.useState<LeaveItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const userRole = data.user?.role || data.data?.user?.role;
          if (data.success && userRole) {
            setUserRole(userRole);
          }
        }
      } catch (err) {}
    }
    fetchRole();
  }, []);

  // Modals
  const [isApplyOpen, setIsApplyOpen] = React.useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isApproveOpen, setIsApproveOpen] = React.useState(false);
  const [isRejectOpen, setIsRejectOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [selectedLeave, setSelectedLeave] = React.useState<LeaveItem | null>(null);

  // Apply Form State
  const [applyType, setApplyType] = React.useState("CASUAL");
  const [applyStart, setApplyStart] = React.useState("");
  const [applyEnd, setApplyEnd] = React.useState("");
  const [applyReason, setApplyReason] = React.useState("");
  const [rejectReason, setRejectReason] = React.useState("");

  const fetchLeaves = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaves");
      if (res.ok) {
        const json = await res.json();
        const records = json.leaves || json.data?.leaves || json.data;
        if (Array.isArray(records)) {
          const mapped = records.map((l: any) => ({
            id: l.id,
            employeeId: l.employeeId || l.employee?.id,
            employeeName: l.employee?.fullName || l.employeeName || "Employee",
            employeeCode: l.employee?.employeeCode || l.employeeCode || "EMP",
            department: l.employee?.department?.name || l.department || "General",
            leaveType: l.leaveType,
            startDate: typeof l.startDate === "string" ? l.startDate.split("T")[0] : new Date(l.startDate).toISOString().split("T")[0],
            endDate: typeof l.endDate === "string" ? l.endDate.split("T")[0] : new Date(l.endDate).toISOString().split("T")[0],
            duration: l.totalDays || l.duration || 1,
            reason: l.reason,
            status: l.status,
            rejectionReason: l.rejectionReason,
            reviewedBy: l.reviewer?.fullName || l.reviewedBy,
            appliedOn: typeof l.createdAt === "string" ? l.createdAt.split("T")[0] : undefined,
          }));
          setLeaves(mapped);
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
  }, []);

  React.useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Visual Duration calculation
  const calculatedDays = React.useMemo(() => {
    if (!applyStart || !applyEnd) return 1;
    const start = new Date(applyStart);
    const end = new Date(applyEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 1;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [applyStart, applyEnd]);

  // Filtering
  const filteredLeaves = React.useMemo(() => {
    return leaves.filter((item) => {
      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" || item.leaveType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaves, searchTerm, statusFilter, typeFilter]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyStart || !applyEnd || !applyReason.trim()) return;

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveType: applyType,
          startDate: applyStart,
          endDate: applyEnd,
          reason: applyReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Leave Application Failed",
          description: data.error || "Could not submit leave request.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Leave Application Submitted",
        description: `Your ${applyType} leave request has been submitted.`,
        type: "success",
      });

      setIsApplyOpen(false);
      setApplyReason("");
      setApplyStart("");
      setApplyEnd("");
      fetchLeaves();
    } catch {
      const newLeave: LeaveItem = {
        id: `leave-${Date.now()}`,
        employeeId: "emp-101",
        employeeName: "Current User",
        employeeCode: "EMP-CURRENT",
        department: "Engineering",
        leaveType: applyType,
        startDate: applyStart,
        endDate: applyEnd,
        duration: calculatedDays,
        reason: applyReason.trim(),
        status: "PENDING",
        appliedOn: new Date().toISOString().split("T")[0],
      };

      setLeaves([newLeave, ...leaves]);
      setIsApplyOpen(false);
      setApplyReason("");
      setApplyStart("");
      setApplyEnd("");
      toast({
        title: "Leave Application Submitted (Offline)",
        description: `Your ${newLeave.leaveType} leave request for ${newLeave.duration} day(s) is pending.`,
        type: "success",
      });
    }
  };

  const handleApproveConfirm = async () => {
    if (!selectedLeave) return;

    try {
      const res = await fetch(`/api/leaves/${selectedLeave.id}/approve`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Approval Failed",
          description: data.error || "Could not approve leave.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Leave Approved",
        description: `Leave request for ${selectedLeave.employeeName} approved.`,
        type: "success",
      });

      setIsApproveOpen(false);
      fetchLeaves();
    } catch {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === selectedLeave.id
            ? { ...l, status: "APPROVED", reviewedBy: "Workplace Admin" }
            : l
        )
      );
      setIsApproveOpen(false);
      toast({
        title: "Leave Approved (Offline)",
        description: `Leave request for ${selectedLeave.employeeName} approved locally.`,
        type: "success",
      });
    }
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeave || !rejectReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please specify why the leave request is being rejected.",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch(`/api/leaves/${selectedLeave.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: rejectReason.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Rejection Failed",
          description: data.error || "Could not reject leave.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Leave Request Rejected",
        description: "Application marked rejected with feedback recorded.",
        type: "warning",
      });

      setIsRejectOpen(false);
      setRejectReason("");
      fetchLeaves();
    } catch {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === selectedLeave.id
            ? {
                ...l,
                status: "REJECTED",
                reviewedBy: "Workplace Admin",
                rejectionReason: rejectReason.trim(),
              }
            : l
        )
      );
      setIsRejectOpen(false);
      setRejectReason("");
      toast({
        title: "Leave Request Rejected (Offline)",
        description: `Application marked rejected locally.`,
        type: "warning",
      });
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedLeave) return;

    try {
      const res = await fetch(`/api/leaves/${selectedLeave.id}/cancel`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Cancellation Failed",
          description: data.error || "Could not cancel leave.",
          type: "error",
        });
        return;
      }

      toast({
        title: "Leave Request Cancelled",
        description: "Your pending leave request has been cancelled.",
        type: "success",
      });

      setIsCancelOpen(false);
      fetchLeaves();
    } catch {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === selectedLeave.id ? { ...l, status: "CANCELLED" } : l
        )
      );
      setIsCancelOpen(false);
      toast({
        title: "Leave Request Cancelled (Offline)",
        description: "Pending leave marked cancelled locally.",
        type: "warning",
      });
    }
  };

  const getStatusBadge = (status: LeaveItem["status"]) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            APPROVED
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="size-1.5 rounded-full bg-amber-500" />
            PENDING
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="size-1.5 rounded-full bg-rose-500" />
            REJECTED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="size-1.5 rounded-full bg-slate-400" />
            CANCELLED
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
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              Leave Management
            </h1>
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-xs">
              Time Off & Balances
            </Badge>
            {isOffline && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit leave requests, review departmental applications, and track annual quotas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeaves}
            disabled={loading}
            className="h-10 px-3 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {userRole !== "ADMIN" && (
            <Button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                setApplyStart(today);
                setApplyEnd(today);
                setIsApplyOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm shadow-indigo-600/20"
            >
              <CalendarPlus className="size-4 mr-1.5" />
              Apply for Leave
            </Button>
          )}
        </div>
      </div>

      {/* ── SUMMARY METRIC CARDS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500 block">Available Balance</span>
          <div className="font-heading text-2xl font-bold text-emerald-600 mt-2">18 Days</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Annual paid allowance</p>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500 block">Leaves Used YTD</span>
          <div className="font-heading text-2xl font-bold text-slate-800 mt-2">6 Days</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Casual & Sick balance</p>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500 block">Pending Review</span>
          <div className="font-heading text-2xl font-bold text-amber-600 mt-2">
            {leaves.filter((l) => l.status === "PENDING").length} Requests
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting manager review</p>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white p-4">
          <span className="text-xs font-semibold text-slate-500 block">Approved Total</span>
          <div className="font-heading text-2xl font-bold text-indigo-600 mt-2">
            {leaves.filter((l) => l.status === "APPROVED").length} Requests
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Confirmed leaves</p>
        </Card>
      </div>

      {/* ── FILTER TOOLBAR ─────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search employee, ID or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs bg-white border-slate-200 rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Leave Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 text-xs px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Leave Types</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="ANNUAL">Annual Leave</option>
              <option value="MATERNITY">Maternity</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ── LEAVES TABLE ───────────────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">End Date</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{row.employeeName}</div>
                      <div className="text-[10px] text-slate-400">{row.department} • {row.employeeCode}</div>
                    </td>

                    {/* Leave Type */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg text-[11px]">
                        {row.leaveType}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{row.startDate}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{row.endDate}</td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {row.duration} {row.duration === 1 ? "day" : "days"}
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={row.reason}>
                      {row.reason}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(row.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedLeave(row);
                            setIsDetailsOpen(true);
                          }}
                          title="View Request Details"
                          className="size-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Eye className="size-4" />
                        </button>

                        {row.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedLeave(row);
                                setIsApproveOpen(true);
                              }}
                              title="Approve Leave"
                              className="size-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Check className="size-4 text-emerald-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeave(row);
                                setRejectReason("");
                                setIsRejectOpen(true);
                              }}
                              title="Reject Leave"
                              className="size-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <X className="size-4 text-rose-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeave(row);
                                setIsCancelOpen(true);
                              }}
                              title="Cancel Leave"
                              className="size-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-4 text-amber-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarOff className="size-8 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No leave requests found</p>
                      <p className="text-[11px] text-slate-400">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── MODAL 1: APPLY FOR LEAVE ────────────────────────────────────────── */}
      <Dialog
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="Apply for Time Off"
        description="Submit a leave application for approval by your manager."
      >
        <form onSubmit={handleApplySubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Leave Category *</label>
            <select
              value={applyType}
              onChange={(e) => setApplyType(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800"
            >
              <option value="CASUAL">Casual Leave (Balance: 6 Days)</option>
              <option value="SICK">Sick Leave (Balance: 8 Days)</option>
              <option value="ANNUAL">Annual Leave (Balance: 4 Days)</option>
              <option value="MATERNITY">Maternity Leave</option>
              <option value="PATERNITY">Paternity Leave</option>
              <option value="UNPAID">Unpaid Sabbatical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Start Date *</label>
              <Input
                type="date"
                value={applyStart}
                onChange={(e) => setApplyStart(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">End Date *</label>
              <Input
                type="date"
                value={applyEnd}
                onChange={(e) => setApplyEnd(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Visual Duration indicator */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between text-indigo-900">
            <span className="font-medium">Total Requested Duration:</span>
            <span className="font-bold text-sm">{calculatedDays} {calculatedDays === 1 ? "Day" : "Days"}</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Reason / Notes for Reviewer *</label>
            <textarea
              placeholder="Briefly explain the reason for this time off..."
              value={applyReason}
              onChange={(e) => setApplyReason(e.target.value)}
              className="w-full h-20 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsApplyOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 2: LEAVE DETAILS ──────────────────────────────────────────── */}
      <Dialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Leave Application Details"
        description="Comprehensive request and reviewer history."
      >
        {selectedLeave && (
          <div className="space-y-4 py-2 text-xs text-slate-600">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedLeave.employeeName}</div>
                <div className="text-slate-400 text-[11px]">{selectedLeave.department} • {selectedLeave.employeeCode}</div>
              </div>
              <div>{getStatusBadge(selectedLeave.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Leave Category</span>
                <span className="font-semibold text-slate-800">{selectedLeave.leaveType}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Duration</span>
                <span className="font-semibold text-slate-800">{selectedLeave.duration} Days</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date Range</span>
              <span className="font-mono text-slate-800">{selectedLeave.startDate} to {selectedLeave.endDate}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee Statement</span>
              <p className="text-slate-700 leading-relaxed">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-600 block">Rejection Feedback</span>
                <p className="text-xs">{selectedLeave.rejectionReason}</p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(false)}
                className="text-xs rounded-xl"
              >
                Close View
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ── MODAL 3: APPROVE CONFIRMATION ──────────────────────────────────── */}
      <Dialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        title="Approve Leave Request"
        description="Confirm time off approval for this staff member."
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <p>
            Are you sure you want to approve <strong className="text-slate-900">{selectedLeave?.duration} day(s)</strong> of {selectedLeave?.leaveType} leave for <strong className="text-slate-900">{selectedLeave?.employeeName}</strong>?
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsApproveOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApproveConfirm}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl"
            >
              Confirm Approval
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ── MODAL 4: REJECT LEAVE MODAL ────────────────────────────────────── */}
      <Dialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Leave Request"
        description="Provide a formal reason for rejecting this application."
      >
        <form onSubmit={handleRejectConfirm} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Rejection Reason *</label>
            <textarea
              placeholder="Provide mandatory reason (e.g. Critical release scheduled, team understaffed)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-24 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-rose-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRejectOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-xl"
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ── MODAL 5: CANCEL LEAVE MODAL ────────────────────────────────────── */}
      <Dialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        title="Cancel Leave Request"
        description="Withdraw your pending leave application."
      >
        <div className="space-y-4 py-2 text-xs text-slate-600">
          <p>
            Are you sure you want to cancel your pending <strong className="text-slate-900">{selectedLeave?.leaveType}</strong> leave request ({selectedLeave?.startDate} to {selectedLeave?.endDate})?
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCancelOpen(false)}
              className="text-xs rounded-xl"
            >
              Back
            </Button>
            <Button
              size="sm"
              onClick={handleCancelConfirm}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-xl"
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

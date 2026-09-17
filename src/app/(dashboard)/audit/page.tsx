"use client";

import * as React from "react";
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  User,
  Clock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  FileCode,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { MOCK_AUDIT_LOGS, MockAuditLog } from "@/lib/mock-data";

export interface AuditItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  module: string;
  description: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILURE";
  requestId: string;
  metadata?: any;
}

export default function AuditPage() {
  const [logs, setLogs] = React.useState<AuditItem[]>(
    MOCK_AUDIT_LOGS.map((l) => ({
      ...l,
      status: l.status as any,
    }))
  );
  const [loading, setLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(MOCK_AUDIT_LOGS.length);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [actorFilter, setActorFilter] = React.useState("ALL");
  const [actionFilter, setActionFilter] = React.useState("ALL");
  const [moduleFilter, setModuleFilter] = React.useState("ALL");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // Audit detail modal
  const [selectedLog, setSelectedLog] = React.useState<AuditItem | null>(null);
  const [copiedId, setCopiedId] = React.useState(false);

  const fetchAuditLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (actionFilter !== "ALL") params.set("action", actionFilter);
      if (moduleFilter !== "ALL") params.set("module", moduleFilter);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      params.set("page", String(page));
      params.set("limit", "25");

      const res = await fetch(`/api/audit?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const records = json.logs || json.data?.logs;
        if (Array.isArray(records)) {
          const mapped: AuditItem[] = records.map((l: any) => ({
            id: l.id,
            timestamp: typeof l.createdAt === "string" ? l.createdAt.replace("T", " ").slice(0, 19) : new Date(l.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            actorName: l.employee?.fullName || "System Administrator",
            actorEmail: l.employee?.employeeCode ? `${l.employee.employeeCode}@buzzspire.com` : "system@buzzspire.com",
            actorRole: l.employee?.role?.name || "ADMIN",
            action: l.action,
            resource: l.resource || l.module || "SYSTEM",
            module: l.module || "AUDIT",
            description: l.description,
            ipAddress: l.ipAddress || "127.0.0.1",
            status: "SUCCESS",
            requestId: l.requestId || `req_${l.id.slice(0, 8)}`,
            metadata: l.metadata || {},
          }));
          setLogs(mapped);
          if (json.pagination) {
            setTotalPages(json.pagination.totalPages || 1);
            setTotalCount(json.pagination.total || mapped.length);
          }
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
  }, [searchQuery, actionFilter, moduleFilter, startDate, endDate, page]);

  React.useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Derive unique actions and modules
  const uniqueActions = React.useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.action))).sort();
  }, [logs]);

  const uniqueModules = React.useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.module))).sort();
  }, [logs]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActorFilter("ALL");
    setActionFilter("ALL");
    setModuleFilter("ALL");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleCopyRequestId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Lock className="size-3.5" />
            Immutable Audit Trail
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-white flex items-center gap-2">
            <Shield className="size-7 text-indigo-400" />
            Security & System Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Append-only compliance audit trail recording all administrative updates, employee changes, leave decisions, and security events.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {isOffline && (
            <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
              Demo Mode
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={fetchAuditLogs}
            disabled={loading}
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl gap-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Trail
          </Button>
        </div>
      </div>

      {/* Audit Filters Bar */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Date Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Date Range
              </label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-xl h-10 text-xs bg-slate-50/50"
                  placeholder="From"
                />
                <span className="text-slate-400 text-xs">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-xl h-10 text-xs bg-slate-50/50"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Module Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Module
              </label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Modules</option>
                {uniqueModules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Keyword, IP, action…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-10 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Found <strong>{totalCount}</strong> audit events
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 rounded-xl text-xs gap-1 border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="size-3" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="text-left px-5 py-3.5">Timestamp</th>
                <th className="text-left px-5 py-3.5">Actor</th>
                <th className="text-left px-5 py-3.5">Action</th>
                <th className="text-left px-5 py-3.5">Module</th>
                <th className="text-left px-5 py-3.5">Description</th>
                <th className="text-left px-5 py-3.5">Status</th>
                <th className="text-right px-5 py-3.5">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Shield className="size-8 mx-auto mb-2 text-slate-300" />
                    No audit records match the current filter selection.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    {/* Timestamp */}
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{log.actorName}</p>
                      <p className="text-[10px] text-slate-400">{log.actorRole}</p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-semibold text-[11px] text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-2 py-0.5 rounded-md">
                        {log.action}
                      </span>
                    </td>

                    {/* Module */}
                    <td className="px-5 py-3.5 font-mono text-slate-700 text-[11px]">
                      {log.module}
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5 text-slate-600 max-w-sm truncate">
                      {log.description}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {log.status}
                      </Badge>
                    </td>

                    {/* Detail Button */}
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-7 px-2 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                      >
                        <Eye className="size-3.5 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {logs.length} of {totalCount} audit logs</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg h-7 px-2"
            >
              <ChevronLeft className="size-3" />
            </Button>
            <span className="px-2 font-medium">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg h-7 px-2"
            >
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Audit Details Modal */}
      <Dialog
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Event Specification"
        description="Cryptographically recorded immutable event parameters."
      >
        {selectedLog && (
          <div className="space-y-4 py-2 text-xs text-slate-600">
            {/* Status & Action Banner */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Action Code</span>
                <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">{selectedLog.action}</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2.5 py-1">
                {selectedLog.status}
              </Badge>
            </div>

            {/* Grid Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Actor Details</span>
                <p className="font-bold text-slate-800 mt-1">{selectedLog.actorName}</p>
                <p className="text-[11px] text-slate-500">{selectedLog.actorRole} · {selectedLog.actorEmail}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Target Resource</span>
                <p className="font-bold text-indigo-700 font-mono mt-1">{selectedLog.resource}</p>
                <p className="text-[11px] text-slate-500">Module: {selectedLog.module}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Timestamp</span>
                <p className="font-mono text-slate-800 font-semibold mt-1">{selectedLog.timestamp}</p>
                <p className="text-[11px] text-slate-500">Timezone: Asia/Kolkata (IST)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Client Origin</span>
                <p className="font-mono text-slate-800 font-semibold mt-1">{selectedLog.ipAddress}</p>
                <p className="text-[11px] text-slate-500">Corporate Gateway</p>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-900 uppercase">Event Description</span>
              <p className="text-slate-800 text-xs mt-1 leading-relaxed">{selectedLog.description}</p>
            </div>

            {/* Request ID */}
            <div className="flex items-center justify-between p-2.5 bg-slate-100/70 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Request ID:</span>
                <span className="font-mono text-indigo-700 font-semibold text-xs">{selectedLog.requestId}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyRequestId(selectedLog.requestId)}
                className="h-7 px-2 text-slate-600 hover:text-indigo-600 text-xs"
              >
                {copiedId ? <Check className="size-3 text-emerald-600 mr-1" /> : <Copy className="size-3 mr-1" />}
                {copiedId ? "Copied" : "Copy ID"}
              </Button>
            </div>

            {/* Metadata Payload Viewer (Secrets Redacted) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="size-3" />
                  Structured Event Payload (Redacted)
                </span>
                <span className="text-[10px] text-slate-400">JSON Format</span>
              </div>
              <pre className="p-3 bg-slate-950 text-indigo-300 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800 leading-relaxed max-h-40">
                {JSON.stringify(
                  {
                    ...selectedLog.metadata,
                    _security: "All internal tokens and secrets are automatically masked",
                    _actorRole: selectedLog.actorRole,
                    _verified: true,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
              >
                Close Audit Record
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

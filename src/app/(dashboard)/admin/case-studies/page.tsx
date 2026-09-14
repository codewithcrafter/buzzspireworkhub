"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  Filter, 
  ExternalLink,
  Briefcase,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusChip } from "@/components/ui/status-chip";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Dialog } from "@/components/ui/dialog";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { CATEGORIES } from "@/data/caseStudiesData";

interface CaseStudyItem {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  shortDescription: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isDemo: boolean;
  featuredImage: string | null;
  createdAt: string;
  updatedAt: string;
}

function CaseStudiesAdminDashboardContent() {
  const { toast } = useToast();

  const [items, setItems] = React.useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = React.useState<CaseStudyItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Fetch list
  const fetchCaseStudies = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/case-studies?limit=100");
      if (res.ok) {
        const data = await res.json();
        setItems(data.caseStudies || []);
      } else {
        const err = await res.json();
        toast({
          title: "Error loading case studies",
          description: err.error || "Failed to fetch records",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Network error",
        description: "Failed to connect to server",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  // Toggle publish status
  const handleToggleStatus = async (item: CaseStudyItem) => {
    const newStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/case-studies/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast({
          title: "Status updated",
          description: `Case study marked as ${newStatus}`,
          type: "success",
        });
        fetchCaseStudies();
      } else {
        const err = await res.json();
        toast({
          title: "Permission / Update error",
          description: err.error || "Failed to update status",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        type: "error",
      });
    }
  };

  // Delete case study
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/case-studies/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Case Study deleted",
          description: `Successfully deleted '${deleteTarget.title}'`,
          type: "success",
        });
        setDeleteTarget(null);
        fetchCaseStudies();
      } else {
        const err = await res.json();
        toast({
          title: "Delete failed",
          description: err.error || "Failed to delete record",
          type: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete record",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const matchesCategory =
      categoryFilter === "ALL" || item.industry === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin" },
              { label: "Case Studies" },
            ]}
          />
          <PageHeader
            title="Case Studies CMS"
            description="Create, edit, publish, and manage BuzzSpire Media case study portfolio entries."
          />
        </div>
        <Link href="/admin/case-studies/create">
          <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md px-5 py-2.5 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Case Study
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, client, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Industry Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-medium text-slate-700"
            >
              <option value="ALL">All Industries</option>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-medium">Loading case studies dataset...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-slate-700">No Case Studies Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No records matched your search filters. Try adjusting your search query or create a new Case Study.
            </p>
            <div className="pt-2">
              <Link href="/admin/case-studies/create">
                <Button size="sm" className="rounded-xl font-bold bg-primary text-white">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create First Case Study
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 align-middle min-w-[260px]">Title & Client</th>
                  <th className="px-6 py-4 align-middle whitespace-nowrap">Industry</th>
                  <th className="px-6 py-4 align-middle whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 align-middle whitespace-nowrap">Type</th>
                  <th className="px-6 py-4 align-middle whitespace-nowrap">Created Date</th>
                  <th className="px-6 py-4 align-middle text-right whitespace-nowrap min-w-[180px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title & Client */}
                    <td className="px-6 py-4 align-middle min-w-[260px]">
                      <div className="flex flex-col justify-center space-y-1">
                        <p className="font-bold text-slate-900 text-sm font-heading leading-snug">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 leading-normal break-words">
                          Client: <strong className="text-slate-700">{item.clientName}</strong> | Slug: <span className="font-mono text-slate-600">/case-studies/{item.slug}</span>
                        </p>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 whitespace-nowrap">
                        {item.industry}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="inline-flex items-center">
                        {item.status === "PUBLISHED" ? (
                          <StatusChip status="active">Published</StatusChip>
                        ) : item.status === "DRAFT" ? (
                          <StatusChip status="pending">Draft</StatusChip>
                        ) : (
                          <StatusChip status="inactive">Archived</StatusChip>
                        )}
                      </div>
                    </td>

                    {/* Type (Demo / Custom) */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="inline-flex items-center">
                        {item.isDemo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 font-extrabold text-[10px] uppercase tracking-wider whitespace-nowrap">
                            <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />
                            Demo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-[10px] uppercase tracking-wider whitespace-nowrap">
                            Live Client
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap text-xs text-slate-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 align-middle text-right whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center justify-end gap-1.5 shrink-0 whitespace-nowrap">
                        {/* Toggle Publish */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title={item.status === "PUBLISHED" ? "Unpublish to Draft" : "Publish to Site"}
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                            item.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {item.status === "PUBLISHED" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>

                        {/* Public Preview Link */}
                        <Link
                          href={`/case-studies/${item.slug}`}
                          target="_blank"
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                          title="Preview Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/case-studies/${item.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-primary flex items-center justify-center transition-colors shrink-0"
                          title="Edit Case Study"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition-colors shrink-0"
                          title="Delete Case Study"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Case Study?">
        <div className="p-6 space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-heading font-bold text-xl text-slate-900">Delete Case Study?</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to delete <strong className="text-slate-800">"{deleteTarget?.title}"</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="w-full rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default function CaseStudiesAdminDashboard() {
  return (
    <ToastProvider>
      <CaseStudiesAdminDashboardContent />
    </ToastProvider>
  );
}

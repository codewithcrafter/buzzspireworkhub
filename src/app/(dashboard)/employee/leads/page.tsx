"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpDown,
  X,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  budget?: string | null;
  service?: string | null;
  message: string;
  source?: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";
  createdAt: string;
  assignedEmployeeId?: string | null;
}

export default function EmployeeLeadsPage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Edit / View Modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editStatus, setEditStatus] = useState<Lead["status"]>("NEW");
  const [editBudget, setEditBudget] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editService, setEditService] = useState("");

  // Add form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addCompany, setAddCompany] = useState("");
  const [addService, setAddService] = useState("");
  const [addBudget, setAddBudget] = useState("");
  const [addMessage, setAddMessage] = useState("");


  const fetchProfileAndLeads = useCallback(async () => {
    try {
      setLoading(true);
      const profRes = await fetch("/api/employee/auth/me");
      if (!profRes.ok) return;

      const profData = await profRes.json();
      setProfile(profData.user);

      if (profData.user?.role === "ADMIN" || profData.user?.permissions?.includes("LEADS_VIEW")) {
        const leadsRes = await fetch("/api/admin/leads");
        if (leadsRes.ok) {
          const lData = await leadsRes.json();
          if (lData.success && Array.isArray(lData.leads)) {
            setLeads(lData.leads);
          }
        }
      }
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndLeads();
  }, [fetchProfileAndLeads]);

  const hasLeadsView = profile?.role === "ADMIN" || profile?.permissions?.includes("LEADS_VIEW");
  const hasLeadsEdit = profile?.role === "ADMIN" || profile?.permissions?.includes("LEADS_EDIT");
  const hasLeadsDelete = profile?.role === "ADMIN" || profile?.permissions?.includes("LEADS_DELETE");
  const hasLeadsExport = profile?.role === "ADMIN" || profile?.permissions?.includes("LEADS_EXPORT");

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditBudget(lead.budget || "");
    setEditPhone(lead.phone || "");
    setEditCompany(lead.company || "");
    setEditService(lead.service || "");
    setIsEditModalOpen(true);
  };

  const handleSaveLead = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          budget: editBudget || null,
          phone: editPhone || null,
          company: editCompany || null,
          service: editService || null,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchProfileAndLeads();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update lead");
      }
    } catch {
      alert("Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLead = async () => {
    if (!addName || !addEmail || !addMessage) {
      alert("Name, email, and message are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          email: addEmail,
          phone: addPhone || null,
          company: addCompany || null,
          service: addService || null,
          budget: addBudget || null,
          message: addMessage,
          assignedEmployeeId: profile?.id, // Will be overridden or validated by backend, but we send it just in case
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setAddName("");
        setAddEmail("");
        setAddPhone("");
        setAddCompany("");
        setAddService("");
        setAddBudget("");
        setAddMessage("");
        fetchProfileAndLeads();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create lead");
      }
    } catch {
      alert("Error creating lead");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchProfileAndLeads();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete lead");
      }
    } catch {
      alert("Error deleting lead");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: "excel" | "csv") => {
    try {
      const res = await fetch(`/api/admin/export/leads?format=${format}`);
      if (!res.ok) {
        alert("Export failed or permission denied");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-leads-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(search.toLowerCase())) ||
      (lead.phone && lead.phone.includes(search));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-500/15 text-blue-600 border-blue-200">New</Badge>;
      case "CONTACTED":
        return <Badge className="bg-amber-500/15 text-amber-600 border-amber-200">Contacted</Badge>;
      case "QUALIFIED":
        return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200">Qualified</Badge>;
      case "CLOSED":
        return <Badge className="bg-slate-500/15 text-slate-600 border-slate-200">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasLeadsView) {
    return (
      <Card className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
        <h2 className="text-xl font-heading font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          You do not have permission to view leads (<code>LEADS_VIEW</code>). Please contact your administrator to request access.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
            My Assigned Leads
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your customer enquiries, update lead stages, and track conversions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl bg-primary text-white text-xs font-semibold cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Lead
          </Button>
          {hasLeadsExport && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
                className="rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("excel")}
                className="rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Excel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="rounded-2xl border border-border/80 shadow-sm p-4 bg-card">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-border/80"
            />
          </div>

          {/* Status Tab Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["ALL", "NEW", "CONTACTED", "QUALIFIED", "CLOSED"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                {s === "ALL" ? `All (${leads.length})` : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="rounded-2xl border border-border/80 shadow-sm overflow-hidden bg-card">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="font-semibold text-foreground">No leads found</p>
            <p className="text-xs text-muted-foreground">
              {search || statusFilter !== "ALL"
                ? "Try adjusting your search query or status filter."
                : "No leads are currently assigned to your account."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 border-b border-border/60 text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Lead Details</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Service & Budget</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                    {/* Name & Company */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-foreground">{lead.name}</div>
                      {lead.company && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          <span>{lead.company}</span>
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <div className="text-xs text-foreground flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Service & Budget */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-medium text-foreground">
                        {lead.service || "General Inquiry"}
                      </div>
                      {lead.budget && (
                        <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                          {lead.budget}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">{getStatusBadge(lead.status)}</td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(lead)}
                          className="rounded-lg h-8 px-2 text-xs font-semibold hover:bg-primary/10 hover:text-primary cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          {hasLeadsEdit ? "Manage" : "View"}
                        </Button>

                        {hasLeadsDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsDeleteModalOpen(true);
                            }}
                            className="rounded-lg h-8 px-2 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit / View Lead Modal */}
      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={hasLeadsEdit ? "Manage Lead Details" : "Lead Information"}
        size="lg"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            {hasLeadsEdit && (
              <Button
                onClick={handleSaveLead}
                disabled={saving}
                className="rounded-xl bg-primary text-white cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        }
      >
        {selectedLead && (
          <div className="space-y-4">
            {/* Customer Message Box */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Customer Message
              </span>
              <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedLead.message}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lead Stage / Status</label>
                <select
                  disabled={!hasLeadsEdit}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full h-10 rounded-xl bg-background border border-border px-3 text-xs focus:ring-primary"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Budget</label>
                <Input
                  disabled={!hasLeadsEdit}
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="e.g. ₹50,000 / month"
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <Input
                  disabled={!hasLeadsEdit}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Company</label>
                <Input
                  disabled={!hasLeadsEdit}
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  placeholder="Company name"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Lead Confirmation Modal */}
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Lead Entry"
        size="sm"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLead}
              disabled={saving}
              className="rounded-xl cursor-pointer"
            >
              {saving ? "Deleting..." : "Permanently Delete"}
            </Button>
          </div>
        }
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to permanently remove the lead for <strong>{selectedLead?.name}</strong>? This action cannot be undone.
        </p>
      </Dialog>

      {/* Add Lead Modal */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead"
        size="lg"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateLead}
              disabled={saving}
              className="rounded-xl bg-primary text-white cursor-pointer"
            >
              {saving ? "Creating..." : "Create Lead"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Name *</label>
              <Input
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Full name"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email *</label>
              <Input
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="email@example.com"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Phone Number</label>
              <Input
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Company</label>
              <Input
                value={addCompany}
                onChange={(e) => setAddCompany(e.target.value)}
                placeholder="Company name"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Service / Feature</label>
              <Input
                value={addService}
                onChange={(e) => setAddService(e.target.value)}
                placeholder="e.g. SEO, Web Design"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Budget</label>
              <Input
                value={addBudget}
                onChange={(e) => setAddBudget(e.target.value)}
                placeholder="e.g. ₹50,000"
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Message / Notes *</label>
            <textarea
              value={addMessage}
              onChange={(e) => setAddMessage(e.target.value)}
              placeholder="Initial inquiry or notes about the lead..."
              className="w-full min-h-[100px] rounded-xl bg-background border border-border px-3 py-2 text-xs focus:ring-primary focus:border-primary resize-y"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

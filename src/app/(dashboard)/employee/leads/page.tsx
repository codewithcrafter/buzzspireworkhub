"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { UploadCloud } from "lucide-react";

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
  message?: string | null;
  source?: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  isArchived?: boolean;
  createdAt: string;
  assignedEmployeeId?: string | null;
  internalNotes?: { id: string, content: string, createdAt: string, employee: { name: string } }[];
  activities?: { id: string, action: string, details?: string, createdAt: string, employee: { name: string } }[];
}

const isProfileUrl = (str?: string | null) => {
  if (!str) return false;
  const lower = str.toLowerCase();
  return (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.includes("linkedin.com/") ||
    lower.includes("facebook.com/") ||
    lower.includes("instagram.com/") ||
    lower.includes("twitter.com/") ||
    lower.includes("x.com/")
  );
};

export default function EmployeeLeadsPage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const router = useRouter();

  // Edit / View Modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editStatus, setEditStatus] = useState<Lead["status"]>("NEW");
  const [editPriority, setEditPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [editBudget, setEditBudget] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editService, setEditService] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const [activeTab, setActiveTab] = useState<"DETAILS" | "NOTES" | "HISTORY">("DETAILS");
  const [addNoteContent, setAddNoteContent] = useState("");

  // Add form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addCompany, setAddCompany] = useState("");
  const [addService, setAddService] = useState("");
  const [addBudget, setAddBudget] = useState("");
  const [addMessage, setAddMessage] = useState("");

  // Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Reminders state
  const [reminders, setReminders] = useState<any[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [addReminderTitle, setAddReminderTitle] = useState("");
  const [addReminderNote, setAddReminderNote] = useState("");
  const [addReminderDate, setAddReminderDate] = useState("");
  const [addReminderTime, setAddReminderTime] = useState("");


  const fetchProfileAndLeads = useCallback(async () => {
    try {
      setLoading(true);
      const profRes = await fetch("/api/employee/auth/me");
      if (!profRes.ok) return;

      const profData = await profRes.json();
      setProfile(profData.user);

      if (profData.user?.role === "ADMIN" || profData.user?.permissions?.includes("LEADS_VIEW")) {
        const leadsRes = await fetch("/api/admin/leads", { cache: "no-store" });
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

  const openEditModal = useCallback(async (lead: Lead) => {
    // 1. Optimistically load current local data
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditPriority(lead.priority || "MEDIUM");
    setEditBudget(lead.budget || "");
    setEditPhone(lead.phone || "");
    setEditCompany(lead.company || "");
    setEditService(lead.service || "");
    setEditMessage(lead.message || "");
    setActiveTab("DETAILS");
    setIsEditModalOpen(true);
    fetchReminders(lead.id);

    // 2. Fetch the absolute latest database values to prevent editing stale data
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.lead) {
          const fresh = data.lead;
          setSelectedLead(fresh);
          setEditStatus(fresh.status);
          setEditPriority(fresh.priority || "MEDIUM");
          setEditBudget(fresh.budget || "");
          setEditPhone(fresh.phone || "");
          setEditCompany(fresh.company || "");
          setEditService(fresh.service || "");
          setEditMessage(fresh.message || "");
          
          // Also update the local table silently so it matches
          setLeads((prev) => prev.map((l) => (l.id === fresh.id ? { ...l, ...fresh } : l)));
        }
      }
    } catch (e) {
      console.error("Failed to fetch fresh lead data:", e);
    }
  }, []);

  useEffect(() => {
    // Wrap in setTimeout to ensure it runs cleanly after mount and window is fully available
    const timeout = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const leadIdParam = urlParams.get("leadId");
      if (leadIdParam && leads.length > 0 && !loading) {
        const found = leads.find((l) => l.id === leadIdParam);
        if (found) {
          openEditModal(found);
        } else {
          alert("Lead no longer exists or you do not have permission.");
        }
        
        // Clean up the URL so it doesn't re-trigger
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("leadId");
        window.history.replaceState({}, "", newUrl.pathname + newUrl.search);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [leads, loading, openEditModal]);

  const fetchReminders = async (leadId: string) => {
    setLoadingReminders(true);
    try {
      const res = await fetch(`/api/admin/reminders?leadId=${leadId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReminders(data.reminders);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReminders(false);
    }
  };

  const handleAddReminder = async () => {
    if (!selectedLead || !addReminderTitle || !addReminderDate) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          title: addReminderTitle,
          note: addReminderNote,
          dueDate: addReminderDate,
          time: addReminderTime,
        }),
      });
      if (res.ok) {
        setAddReminderTitle("");
        setAddReminderNote("");
        setAddReminderDate("");
        setAddReminderTime("");
        fetchReminders(selectedLead.id);
      } else {
        let errMessage = "Failed to add reminder";
        try {
          const errData = await res.json();
          console.error("Reminder API Error:", errData);
          errMessage = errData.message || (errData.error && errData.error.message) || errMessage;
        } catch(e) {}
        alert("Error: " + errMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateReminderStatus = async (reminderId: string, newStatus: string) => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/admin/reminders/${reminderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchReminders(selectedLead.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!selectedLead || !confirm("Are you sure you want to delete this reminder?")) return;
    try {
      const res = await fetch(`/api/admin/reminders/${reminderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchReminders(selectedLead.id);
      }
    } catch (e) {
      console.error(e);
    }
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
          priority: editPriority,
          budget: editBudget || null,
          phone: editPhone || null,
          company: editCompany || null,
          service: editService || null,
          message: editMessage,
        }),
      });

      if (res.ok) {
        const updatedLead = await res.json();
        
        // Optimistically update the local state to reflect the changes immediately
        setLeads((prev) => 
          prev.map((l) => (l.id === selectedLead.id ? { ...l, ...updatedLead.lead } : l))
        );
        
        // Also update the selectedLead so if modal stays open or is reopened, it has new data
        if (updatedLead.lead) {
          setSelectedLead(updatedLead.lead);
        }

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

  const handleAddNote = async () => {
    if (!selectedLead || !addNoteContent.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: addNoteContent }),
      });
      if (res.ok) {
        setAddNoteContent("");
        // Optimistically reload the lead to get the new note
        const freshRes = await fetch(`/api/admin/leads/${selectedLead.id}`);
        if (freshRes.ok) {
          const data = await freshRes.json();
          if (data.success && data.lead) {
            setSelectedLead(data.lead);
          }
        }
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add note");
      }
    } catch {
      alert("Error adding note");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLead = async () => {
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

  const handleImportLeads = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const res = await fetch("/api/admin/leads/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImportResult(data.summary);
        fetchProfileAndLeads(); // Refresh leads
      } else {
        alert(data.message || "Failed to import leads");
      }
    } catch (err) {
      console.error("Import error:", err);
      alert("Error importing leads. Please try again.");
    } finally {
      setImporting(false);
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
          <Button
            variant="outline"
            onClick={() => {
              setImportFile(null);
              setImportResult(null);
              setIsImportModalOpen(true);
            }}
            className="rounded-xl text-xs font-semibold cursor-pointer shadow-sm border-border/80"
          >
            <UploadCloud className="w-4 h-4 mr-1.5 text-primary" />
            Import Leads
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
                    <td className="py-4 px-4 min-w-[200px]">
                      {!isProfileUrl(lead.email) && (
                        <div className="text-xs text-foreground flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[180px]" title={lead.email}>{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && !isProfileUrl(lead.phone) && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[180px]">{lead.phone}</span>
                        </div>
                      )}
                      {isProfileUrl(lead.email) && (!lead.phone || isProfileUrl(lead.phone)) && (
                        <div className="text-xs text-muted-foreground italic">— No valid contact info</div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground border-t border-border/40 pt-1.5">
                        <span className="font-semibold text-foreground/70 block mb-0.5">Message:</span>
                        {lead.message && lead.message.trim() !== "" ? (
                          <div className="line-clamp-2" title={lead.message}>
                            {lead.message}
                          </div>
                        ) : (
                          <span className="italic text-muted-foreground/60">— No message</span>
                        )}
                      </div>
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

                        {lead.phone && !isProfileUrl(lead.phone) && (
                          <>
                            <a
                              href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                              className="rounded-lg h-8 w-8 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Call Lead"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg h-8 w-8 flex items-center justify-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="WhatsApp Lead"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}

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
            {/* Tabs Header */}
            <div className="flex items-center gap-4 border-b border-border">
              <button
                className={`pb-2 text-sm font-semibold transition-colors ${activeTab === 'DETAILS' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('DETAILS')}
              >
                Details & Reminders
              </button>
              <button
                className={`pb-2 text-sm font-semibold transition-colors ${activeTab === 'NOTES' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('NOTES')}
              >
                Internal Notes
              </button>
              <button
                className={`pb-2 text-sm font-semibold transition-colors ${activeTab === 'HISTORY' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('HISTORY')}
              >
                History
              </button>
            </div>

            {/* DETAILS TAB */}
            {activeTab === "DETAILS" && (
              <div className="space-y-4">
            {/* Customer Message Box */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Customer Message
              </span>
              {hasLeadsEdit ? (
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full min-h-[100px] rounded-xl bg-background border border-border px-3 py-2 text-xs focus:ring-primary focus:border-primary resize-y mt-2"
                />
              ) : (
                <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed mt-2">
                  {selectedLead.message}
                </p>
              )}
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
                <label className="text-xs font-semibold text-foreground">Priority</label>
                <select
                  disabled={!hasLeadsEdit}
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as any)}
                  className="w-full h-10 rounded-xl bg-background border border-border px-3 text-xs focus:ring-primary"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
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

            {/* Reminders Section */}
            <div className="mt-6 border-t border-border/80 pt-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Reminders
              </h3>
              
              {hasLeadsEdit && (
                <div className="bg-muted/30 p-3 rounded-xl border border-border/60 space-y-3 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      placeholder="Reminder Title"
                      value={addReminderTitle}
                      onChange={(e) => setAddReminderTitle(e.target.value)}
                      className="h-9 text-xs sm:col-span-3"
                    />
                    <Input
                      placeholder="Note (optional)"
                      value={addReminderNote}
                      onChange={(e) => setAddReminderNote(e.target.value)}
                      className="h-9 text-xs sm:col-span-3"
                    />
                    <Input
                      type="date"
                      value={addReminderDate}
                      onChange={(e) => setAddReminderDate(e.target.value)}
                      className="h-9 text-xs sm:col-span-2"
                    />
                    <Input
                      type="time"
                      value={addReminderTime}
                      onChange={(e) => setAddReminderTime(e.target.value)}
                      className="h-9 text-xs sm:col-span-1"
                    />
                  </div>
                  <Button
                    onClick={handleAddReminder}
                    disabled={!addReminderTitle || !addReminderDate || saving}
                    size="sm"
                    className="w-full h-8 text-xs bg-primary text-white"
                  >
                    Set Reminder
                  </Button>
                </div>
              )}

              {loadingReminders ? (
                <div className="text-center py-4"><Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" /></div>
              ) : reminders.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">No reminders set for this lead.</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
                  {reminders.map((rem) => (
                    <div key={rem.id} className={`p-3 rounded-xl border flex flex-col gap-2 ${rem.status === 'COMPLETED' ? 'bg-muted/20 border-border/40 opacity-70' : 'bg-card border-border/80'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-xs font-bold ${rem.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{rem.title}</p>
                          {rem.note && <p className="text-[11px] text-muted-foreground mt-0.5">{rem.note}</p>}
                        </div>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${rem.status === 'COMPLETED' ? '' : rem.status === 'PENDING' ? 'text-amber-500 border-amber-200 bg-amber-500/10' : ''}`}>
                          {rem.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                          <Clock className="w-3 h-3" />
                          {new Date(rem.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                        {hasLeadsEdit && (
                          <div className="flex items-center gap-1">
                            {rem.status !== "COMPLETED" && (
                              <button onClick={() => handleUpdateReminderStatus(rem.id, "COMPLETED")} className="text-[10px] text-emerald-600 font-semibold px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20">
                                Complete
                              </button>
                            )}
                            <button onClick={() => handleDeleteReminder(rem.id)} className="text-[10px] text-destructive font-semibold px-2 py-1 rounded bg-destructive/10 hover:bg-destructive/20">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

            {/* NOTES TAB */}
            {activeTab === "NOTES" && (
              <div className="space-y-4">
                {hasLeadsEdit && (
                  <div className="space-y-2">
                    <textarea
                      value={addNoteContent}
                      onChange={(e) => setAddNoteContent(e.target.value)}
                      placeholder="Add an internal note about this lead..."
                      className="w-full min-h-[80px] rounded-xl bg-background border border-border px-3 py-2 text-xs focus:ring-primary focus:border-primary resize-y"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleAddNote}
                        disabled={saving || !addNoteContent.trim()}
                        className="rounded-xl bg-primary text-white text-xs h-8"
                      >
                        {saving ? "Adding..." : "Add Note"}
                      </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-3 mt-4">
                  {selectedLead.internalNotes && selectedLead.internalNotes.length > 0 ? (
                    selectedLead.internalNotes.map(note => (
                      <div key={note.id} className="p-3 bg-muted/30 border border-border/80 rounded-xl">
                        <p className="text-xs text-foreground whitespace-pre-wrap">{note.content}</p>
                        <div className="mt-2 text-[10px] text-muted-foreground flex items-center justify-between">
                          <span>By {note.employee.name}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-4">No internal notes yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "HISTORY" && (
              <div className="space-y-4">
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {selectedLead.activities && selectedLead.activities.length > 0 ? (
                    selectedLead.activities.map(activity => (
                      <div key={activity.id} className="flex gap-3 text-xs">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                          <div className="w-px h-full bg-border/50 mt-1" />
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-foreground">
                            {activity.action} <span className="font-normal text-muted-foreground">by {activity.employee?.name || 'System'}</span>
                          </p>
                          {activity.details && (
                            <p className="text-muted-foreground mt-0.5">{activity.details}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-4">No activity history yet.</p>
                  )}
                </div>
              </div>
            )}
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
              <label className="text-xs font-semibold text-foreground">Name</label>
              <Input
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Full name"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email</label>
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
            <label className="text-xs font-semibold text-foreground">Message / Notes</label>
            <textarea
              value={addMessage}
              onChange={(e) => setAddMessage(e.target.value)}
              placeholder="Initial inquiry or notes about the lead..."
              className="w-full min-h-[100px] rounded-xl bg-background border border-border px-3 py-2 text-xs focus:ring-primary focus:border-primary resize-y"
            />
          </div>
        </div>
      </Dialog>

      {/* Import Leads Modal */}
      <Dialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Leads"
        size="md"
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Close
            </Button>
            {!importResult && (
              <Button
                onClick={handleImportLeads}
                disabled={!importFile || importing}
                className="rounded-xl bg-primary text-white cursor-pointer"
              >
                {importing ? "Importing..." : "Start Import"}
              </Button>
            )}
          </div>
        }
      >
        {!importResult ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center space-y-3">
              <UploadCloud className="w-8 h-8 text-primary/60 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-foreground">Upload CSV or Excel file</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: .csv, .xlsx. Columns will be automatically mapped.
                </p>
              </div>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="text-xs max-w-xs mx-auto file:bg-primary/10 file:border-0 file:rounded-xl file:text-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Import Complete
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-background rounded-lg border border-border/40">
                  <p className="text-muted-foreground mb-1">Total Rows Processed</p>
                  <p className="font-bold text-base text-foreground">{importResult.totalRows}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-emerald-700 font-semibold mb-1">Successfully Imported</p>
                  <p className="font-bold text-base text-emerald-700">{importResult.validImported}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-amber-700 font-semibold mb-1">Skipped (Duplicates)</p>
                  <p className="font-bold text-base text-amber-700">{importResult.skippedDuplicates}</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-destructive font-semibold mb-1">Invalid Rows</p>
                  <p className="font-bold text-base text-destructive">{importResult.invalidRows}</p>
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-destructive mb-2">Error Details:</p>
                  <ul className="text-[11px] text-muted-foreground space-y-1 max-h-24 overflow-y-auto pr-2">
                    {importResult.errors.map((err: any, i: number) => (
                      <li key={i}>Row {err.row}: {err.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

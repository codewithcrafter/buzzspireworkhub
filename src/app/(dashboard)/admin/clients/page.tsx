"use client"

import * as React from "react"
import {
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  X,
  Mail,
  Phone,
  Briefcase,
  IndianRupee,
  Calendar,
  AlertTriangle,
  FolderOpen,
  CheckCircle,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Tabs } from "@/components/ui/tabs"
import { ClientManagementPanel } from "./ClientManagementPanel"
import { Pagination } from "@/components/ui/pagination"
import { Dialog } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"
import { FileUpload } from "@/components/ui/file-upload"

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: "active" | "inactive" | "pending"
  revenue: number
  joined: string
  projectsCount: number
}

function ClientsDashboard() {
  const { toast } = useToast()

  // Initial empty state, fetched via useEffect
  const [clients, setClients] = React.useState<Client[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/admin/clients")
        const data = await res.json()
        if (data.clients) {
          setClients(data.clients)
        }
      } catch (err) {
        console.error("Failed to fetch clients", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchClients()
  }, [])

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])
  
  // Sorting state
  const [sortField, setSortField] = React.useState<keyof Client>("name")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")

  // Row selection state (Checked rows)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Modal Dialogs & Drawers states
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [isImportOpen, setIsImportOpen] = React.useState(false)

  // Current working client states
  const [activeClient, setActiveClient] = React.useState<Client | null>(null)
  
  // Form fields
  const [formName, setFormName] = React.useState("")
  const [formCompany, setFormCompany] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formPhone, setFormPhone] = React.useState("")
  const [formStatus, setFormStatus] = React.useState<"active" | "inactive" | "pending">("active")
  const [formRevenue, setFormRevenue] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")
  const [formService, setFormService] = React.useState("")
  const [formTotalBudget, setFormTotalBudget] = React.useState("")
  const [formInitialPaid, setFormInitialPaid] = React.useState("")
  const [formProjectName, setFormProjectName] = React.useState("")
  const [formProjectStart, setFormProjectStart] = React.useState("")
  const [formExpectedCompletion, setFormExpectedCompletion] = React.useState("")
  const [formProjectStatus, setFormProjectStatus] = React.useState("PLANNING")
  const [formCompletionPercentage, setFormCompletionPercentage] = React.useState("0")

  // Search & Filters filtering logic
  const filteredClients = React.useMemo(() => {
    return clients
      .filter((client) => {
        const matchesSearch =
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesStatus =
          statusFilters.length === 0 || statusFilters.includes(client.status)

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        }
        return 0
      })
  }, [clients, searchQuery, statusFilters, sortField, sortDirection])

  // Sorting columns triggers
  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Row selection helpers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredClients.map((c) => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((rowId) => rowId !== id))
    }
  }

  // Create Client Submit handler (async call to invitation API)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName || !formCompany || !formEmail) {
      toast({
        title: "Required fields missing",
        description: "Please populate name, company, and email values.",
        type: "error",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/clients/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          company: formCompany,
          phone: formPhone || "+91 99999 99999",
          password: formPassword,
          service: formService,
          totalBudget: formTotalBudget || formRevenue,
          initialPaidAmount: formInitialPaid,
          projectName: formProjectName,
          projectStartDate: formProjectStart,
          expectedCompletionDate: formExpectedCompletion,
          projectStatus: formProjectStatus,
          completionPercentage: formCompletionPercentage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Invitation Failed",
          description: data.error || "Failed to invite client.",
          type: "error",
        });
        return;
      }

      const newClient: Client = {
        id: data.client.id,
        name: data.client.name,
        company: data.client.company,
        email: data.client.email,
        phone: data.client.phone,
        status: "pending",
        revenue: 0,
        joined: new Date().toISOString().split("T")[0],
        projectsCount: 0,
      };

      setClients([newClient, ...clients])
      setIsAddOpen(false)
      resetForm()

      if (data.emailSent) {
        toast({
          title: "Client Invited",
          description: `Invitation email sent to ${newClient.name} (${newClient.email}).`,
          type: "success",
        })
      } else {
        toast({
          title: "Client created",
          description: data.message || `Invitation mail not sent. ${newClient.name} (${newClient.email}).`,
          type: "warning",
        })
      }
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to invitation server.",
        type: "error",
      })
    }
  }

  // Edit Client load trigger
  const triggerEdit = (client: Client) => {
    setActiveClient(client)
    setFormName(client.name)
    setFormCompany(client.company)
    setFormEmail(client.email)
    setFormPhone(client.phone)
    setFormStatus(client.status)
    setFormRevenue(client.revenue.toString())
    setIsEditOpen(true)
  }

  // Edit Client Submit handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeClient) return

    const updated = clients.map((c) =>
      c.id === activeClient.id
        ? {
            ...c,
            name: formName,
            company: formCompany,
            email: formEmail,
            phone: formPhone,
            status: formStatus,
            revenue: formRevenue ? parseFloat(formRevenue) : 0,
          }
        : c
    )

    setClients(updated)
    setIsEditOpen(false)
    resetForm()

    toast({
      title: "Client profile updated",
      description: "Information has been synchronized successfully.",
      type: "success",
    })
  }

  // Delete trigger
  const triggerDelete = (client: Client) => {
    setActiveClient(client)
    setIsDeleteOpen(true)
  }

  // Delete Action submit handler
  const handleDeleteConfirm = async () => {
    if (!activeClient) return

    try {
      const response = await fetch(`/api/admin/clients/${activeClient.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Delete Failed",
          description: data.error || "Failed to delete client account.",
          type: "error",
        });
        return;
      }

      setClients(clients.filter((c) => c.id !== activeClient.id))
      setSelectedIds(selectedIds.filter((id) => id !== activeClient.id))
      setIsDeleteOpen(false)
      setActiveClient(null)

      toast({
        title: "Client Deleted",
        description: "Account file has been removed from database registries.",
        type: "success",
      })
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server to delete client.",
        type: "error",
      })
    }
  }

  // Bulk status updates
  const handleBulkStatusChange = (status: "active" | "inactive") => {
    const updated = clients.map((c) =>
      selectedIds.includes(c.id) ? { ...c, status } : c
    )
    setClients(updated)
    setSelectedIds([])
    toast({
      title: "Bulk update complete",
      description: `Updated status of ${selectedIds.length} records to ${status}.`,
      type: "success",
    })
  }

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      const response = await fetch("/api/admin/clients", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Bulk Delete Failed",
          description: data.error || "Failed to delete selected clients.",
          type: "error",
        });
        return;
      }

      setClients(clients.filter((c) => !selectedIds.includes(c.id)))
      setSelectedIds([])
      toast({
        title: "Bulk records deleted",
        description: "Successfully deleted selected client accounts.",
        type: "success",
      })
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server for bulk deletion.",
        type: "error",
      })
    }
  }

  // Drawer Details view trigger
  const triggerDetails = (client: Client) => {
    setActiveClient(client)
    setIsDrawerOpen(true)
  }

  const resetForm = () => {
    setFormName("")
    setFormCompany("")
    setFormEmail("")
    setFormPhone("")
    setFormStatus("active")
    setFormRevenue("")
    setFormPassword("")
    setFormService("")
    setFormTotalBudget("")
    setFormInitialPaid("")
    setFormProjectName("")
    setFormProjectStart("")
    setFormExpectedCompletion("")
    setFormProjectStatus("PLANNING")
    setFormCompletionPercentage("0")
    setActiveClient(null)
  }

  // CSV Export simulation
  const handleExport = () => {
    const dataCount = selectedIds.length > 0 ? selectedIds.length : clients.length
    toast({
      title: "Export Initiated",
      description: `Downloading clients.csv containing ${dataCount} rows...`,
      type: "info",
    })
  }

  // CSV Import mock handler
  const handleImportSuccess = () => {
    const mockClient: Client = {
      id: `cl-${Date.now()}`,
      name: "Arthur Dent",
      company: "Megadodo Publications",
      email: "arthur@hitchhiker.com",
      phone: "+91 42424 42424",
      status: "pending",
      revenue: 42000,
      joined: new Date().toISOString().split("T")[0],
      projectsCount: 1,
    }
    setClients([mockClient, ...clients])
    setIsImportOpen(false)
    toast({
      title: "Import Success",
      description: "Parsed 1 new client account from clients.csv spreadsheet.",
      type: "success",
    })
  }

  const filterOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
  ]

  const allSelected = filteredClients.length > 0 && selectedIds.length === filteredClients.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredClients.length

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Client Directories" },
        ]}
      />

      <PageHeader
        title="Client Workspace Directory"
        description="Comprehensive CRM record board. Search, filter status, sort revenues, manage account profile drawers, and run bulk operations."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsImportOpen(true)}
              icon={<Upload className="size-4" />}
              className="cursor-pointer"
            >
              Import CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              icon={<Download className="size-4" />}
              className="cursor-pointer"
            >
              Export {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </Button>
            <Button
              variant="premium"
              onClick={() => {
                resetForm()
                setIsAddOpen(true)
              }}
              icon={<Plus className="size-4" />}
              className="cursor-pointer font-bold shadow-md"
            >
              Add Client
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/60 bg-card/60 rounded-2xl shadow-sm">
        <SearchBar
          placeholder="Search by client name, company, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex items-center gap-3">
          <FilterControls
            label="Filter Status"
            options={filterOptions}
            selectedValues={statusFilters}
            onChange={setStatusFilters}
          />
          {(searchQuery || statusFilters.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setStatusFilters([])
              }}
              className="cursor-pointer text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Main client data table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="size-4 border border-input rounded cursor-pointer accent-primary"
              />
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/40 transition-colors select-none" onClick={() => handleSort("name")}>
              <div className="flex items-center gap-1">
                <span>Client Name</span>
                <ArrowUpDown className="size-3 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/40 transition-colors select-none" onClick={() => handleSort("revenue")}>
              <div className="flex items-center gap-1">
                <span>Revenue Metrics</span>
                <ArrowUpDown className="size-3 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/40 transition-colors select-none text-right" onClick={() => handleSort("joined")}>
              <div className="flex items-center justify-end gap-1">
                <span>Joined Date</span>
                <ArrowUpDown className="size-3 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No client records found matching search queries.
              </TableCell>
            </TableRow>
          ) : (
            filteredClients.map((client) => {
              const isChecked = selectedIds.includes(client.id)
              return (
                <TableRow key={client.id} selected={isChecked}>
                  <TableCell className="w-[50px]">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleSelectRow(client.id, e.target.checked)}
                      className="size-4 border border-input rounded cursor-pointer accent-primary"
                    />
                  </TableCell>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={client.name.split(" ").map(w => w[0]).join("")} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-foreground leading-none">{client.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{client.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-xs">
                    {client.company}
                  </TableCell>
                  <TableCell className="font-bold text-foreground text-sm">
                    ₹{client.revenue.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={client.status}>
                      {client.status.toUpperCase()}
                    </StatusChip>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground font-semibold">
                    {new Date(client.joined).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="w-[80px] text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerDetails(client)}
                        className="cursor-pointer text-muted-foreground hover:text-primary rounded-lg"
                        title="View Details"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerEdit(client)}
                        className="cursor-pointer text-muted-foreground hover:text-secondary rounded-lg"
                        title="Edit Profile"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerDelete(client)}
                        className="cursor-pointer text-muted-foreground hover:text-destructive rounded-lg"
                        title="Delete Client"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
      />

      {/* Floating BULK ACTIONS overlay drawer */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between bg-foreground text-background dark:bg-card dark:text-foreground px-5 py-3 border border-border/80 shadow-2xl rounded-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="glow">{selectedIds.length} checked</Badge>
              <span className="text-xs font-semibold">Bulk Actions</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkStatusChange("active")}
                className="text-xs text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
              >
                Mark Active
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkStatusChange("inactive")}
                className="text-xs text-muted-foreground/60 hover:bg-muted cursor-pointer"
              >
                Deactivate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkDelete}
                className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                Delete Selected
              </Button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1 hover:bg-muted text-muted-foreground rounded-full"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG PORTAL: ADD CLIENT MODAL */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Client File"
        description="Fill in company particulars to register accounts in system crms."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleAddSubmit} className="cursor-pointer shadow-sm">
              Save Client
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Aria Mercer"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Company Name *</label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. Vercel Labs"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Email Address *</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Initial Password *</label>
              <input
                type="password"
                required
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Service / Project Type *</label>
              <input
                type="text"
                required
                value={formService}
                onChange={(e) => setFormService(e.target.value)}
                placeholder="e.g. SEO, Social Media, Google Ads"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+1 555-0123"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Total Budget (INR)</label>
              <input
                type="number"
                value={formTotalBudget}
                onChange={(e) => setFormTotalBudget(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Initial Paid Amount (INR)</label>
              <input
                type="number"
                value={formInitialPaid}
                onChange={(e) => setFormInitialPaid(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Project Name</label>
              <input
                type="text"
                value={formProjectName}
                onChange={(e) => setFormProjectName(e.target.value)}
                placeholder="e.g. Website Redesign"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Project Start Date</label>
              <input
                type="date"
                value={formProjectStart}
                onChange={(e) => setFormProjectStart(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Expected Completion Date</label>
              <input
                type="date"
                value={formExpectedCompletion}
                onChange={(e) => setFormExpectedCompletion(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Initial Project Status</label>
              <select
                value={formProjectStatus}
                onChange={(e) => setFormProjectStatus(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Completion Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formCompletionPercentage}
                onChange={(e) => setFormCompletionPercentage(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>
        </form>
      </Dialog>

      {/* DIALOG PORTAL: EDIT CLIENT MODAL */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Client Particulars"
        description="Update contact emails, status, and retainer margins."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleEditSubmit} className="cursor-pointer shadow-sm">
              Apply Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Contact Phone</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Retainer Revenue (INR)</label>
              <input
                type="number"
                value={formRevenue}
                onChange={(e) => setFormRevenue(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>
        </form>
      </Dialog>

      {/* DIALOG PORTAL: DELETE SAFETY MODAL */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Client Removal"
        description="Are you sure you want to delete this client file? This action is permanent."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="cursor-pointer">
              Delete Forever
            </Button>
          </>
        }
      >
        {activeClient && (
          <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl mt-2 text-destructive">
            <AlertTriangle className="size-5 shrink-0" />
            <div className="text-xs font-medium leading-relaxed">
              Deleting <span className="font-bold">{activeClient.name}</span> will clear client credentials, projects tracking, and billing statistics in the workspace dashboard.
            </div>
          </div>
        )}
      </Dialog>

      {/* DIALOG PORTAL: MOCK CSV IMPORT MODAL */}
      <Dialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Client Database"
        description="Upload a CSV formatted file containing columns for Name, Company, Email, and Revenue."
        footer={
          <Button variant="ghost" onClick={() => setIsImportOpen(false)} className="cursor-pointer">
            Dismiss
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center p-2">
          <FileUpload
            allowedTypes={["text/csv"]}
            onFileSelect={handleImportSuccess}
          />
        </div>
      </Dialog>

      {/* SIDE DRAWER PORTAL: CLIENT PROFILE INFO PREVIEW */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Client Management Portal"
        description="Detailed financials, milestones, and operational updates."
      >
        {activeClient && (
          <ClientManagementPanel client={activeClient} />
        )}
      </Drawer>
    </div>
  )
}

export default function ClientsPage() {
  return (
    <ToastProvider>
      <ClientsDashboard />
    </ToastProvider>
  )
}

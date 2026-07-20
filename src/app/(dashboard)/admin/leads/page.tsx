"use client"

import * as React from "react"
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  IndianRupee,
  User,
  Tags,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  X,
  Send,
  MoreVertical,
  Layers,
  LayoutGrid,
  List,
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
import { Dialog } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"

type LeadStage = "new" | "contacted" | "proposal" | "qualified"
type LeadPriority = "high" | "medium" | "low"

interface LeadActivity {
  id: string
  text: string
  time: string
  user: string
}

interface LeadTimelineEvent {
  id: string
  title: string
  time: string
  stage?: LeadStage
}

interface Lead {
  id: string
  name: string
  company: string
  email: string
  value: number
  stage: LeadStage
  priority: LeadPriority
  assignedTo: {
    name: string
    avatar: string
  }
  tags: string[]
  created: string
  activities: LeadActivity[]
  timeline: LeadTimelineEvent[]
}

const STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: "new", label: "New Leads", color: "border-primary/30" },
  { id: "contacted", label: "Contacted", color: "border-amber-500/30" },
  { id: "proposal", label: "Proposal Sent", color: "border-secondary/30" },
  { id: "qualified", label: "Qualified", color: "border-emerald-500/30" },
]

function LeadsDashboard() {
  const { toast } = useToast()

  // Interactive View selection: "kanban" or "table"
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban")

  // Mock Database
  const [leads, setLeads] = React.useState<Lead[]>([
    {
      id: "ld-1",
      name: "Sarah Connor",
      company: "Cyberdyne Systems",
      email: "sarah@cyberdyne.com",
      value: 450000,
      stage: "new",
      priority: "high",
      assignedTo: { name: "John Smith", avatar: "JS" },
      tags: ["Enterprise", "SaaS"],
      created: "2026-07-01",
      activities: [
        { id: "act-1", text: "Inbound leads form submitted online.", time: "July 1, 10:00 AM", user: "Sarah Connor" },
        { id: "act-2", text: "Assigned lead to John Smith.", time: "July 1, 10:15 AM", user: "System" },
      ],
      timeline: [
        { id: "t-1", title: "Lead Captured", time: "July 1, 10:00 AM", stage: "new" },
      ],
    },
    {
      id: "ld-2",
      name: "Bruce Wayne",
      company: "Wayne Enterprises",
      email: "bruce@wayne.co",
      value: 1200000,
      stage: "contacted",
      priority: "high",
      assignedTo: { name: "Aria Mercer", avatar: "AM" },
      tags: ["Retainer", "Media Planning"],
      created: "2026-07-02",
      activities: [
        { id: "act-3", text: "Outbound intro email sent via template CRM.", time: "July 2, 11:00 AM", user: "Aria Mercer" },
        { id: "act-4", text: "Bruce Wayne replied requesting consultation calls.", time: "July 2, 2:30 PM", user: "Bruce Wayne" },
      ],
      timeline: [
        { id: "t-2", title: "Lead Captured", time: "July 2, 10:00 AM", stage: "new" },
        { id: "t-3", title: "Moved to Contacted stage", time: "July 2, 11:00 AM", stage: "contacted" },
      ],
    },
    {
      id: "ld-3",
      name: "Peter Parker",
      company: "Daily Bugle",
      email: "peter@bugle.com",
      value: 65000,
      stage: "proposal",
      priority: "low",
      assignedTo: { name: "Jane Doe", avatar: "JD" },
      tags: ["Small Business", "SEO Campaign"],
      created: "2026-07-02",
      activities: [
        { id: "act-5", text: "Proposal draft proposal-v1.pdf sent.", time: "July 2, 4:00 PM", user: "Jane Doe" },
      ],
      timeline: [
        { id: "t-4", title: "Lead Captured", time: "July 2, 12:00 PM", stage: "new" },
        { id: "t-5", title: "Moved to Proposal stage", time: "July 2, 4:00 PM", stage: "proposal" },
      ],
    },
    {
      id: "ld-4",
      name: "Tony Stark",
      company: "Stark Industries",
      email: "tony@stark.com",
      value: 850000,
      stage: "qualified",
      priority: "high",
      assignedTo: { name: "John Smith", avatar: "JS" },
      tags: ["Enterprise", "Ad Campaign"],
      created: "2026-07-03",
      activities: [
        { id: "act-6", text: "Met for consultation. Confirmed budget boundaries.", time: "July 3, 3:00 PM", user: "John Smith" },
      ],
      timeline: [
        { id: "t-6", title: "Lead Captured", time: "July 3, 9:00 AM", stage: "new" },
        { id: "t-7", title: "Moved to Contacted stage", time: "July 3, 10:00 AM", stage: "contacted" },
        { id: "t-8", title: "Moved to Qualified stage", time: "July 3, 3:00 PM", stage: "qualified" },
      ],
    },
  ])

  // Search & Filters state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [priorityFilters, setPriorityFilters] = React.useState<string[]>([])
  const [agentFilters, setAgentFilters] = React.useState<string[]>([])

  // Modal Dialogs & Drawer state
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  // Current working lead states
  const [activeLead, setActiveLead] = React.useState<Lead | null>(null)
  
  // Interactive Comment Input in details drawer
  const [commentText, setCommentText] = React.useState("")

  // Form Fields
  const [formName, setFormName] = React.useState("")
  const [formCompany, setFormCompany] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formValue, setFormValue] = React.useState("")
  const [formStage, setFormStage] = React.useState<LeadStage>("new")
  const [formPriority, setFormPriority] = React.useState<LeadPriority>("medium")
  const [formAssignee, setFormAssignee] = React.useState("Jane Doe")
  const [formTags, setFormTags] = React.useState("")

  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPriority =
        priorityFilters.length === 0 || priorityFilters.includes(lead.priority)

      const matchesAgent =
        agentFilters.length === 0 || agentFilters.includes(lead.assignedTo.name)

      return matchesSearch && matchesPriority && matchesAgent
    })
  }, [leads, searchQuery, priorityFilters, agentFilters])

  // Move lead stage helper (Quick button on Kanban Card)
  const moveLeadStage = (leadId: string, direction: "next" | "prev") => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return

    const currentIndex = STAGES.findIndex((s) => s.id === lead.stage)
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1

    if (nextIndex >= 0 && nextIndex < STAGES.length) {
      const targetStage = STAGES[nextIndex].id
      updateLeadStage(leadId, targetStage)
    }
  }

  // Update lead stage core function
  const updateLeadStage = (leadId: string, targetStage: LeadStage) => {
    const updated = leads.map((lead) => {
      if (lead.id === leadId) {
        const newTimelineEvent: LeadTimelineEvent = {
          id: `t-${Date.now()}`,
          title: `Moved to ${STAGES.find(s => s.id === targetStage)?.label} stage`,
          time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          stage: targetStage,
        }

        return {
          ...lead,
          stage: targetStage,
          timeline: [...lead.timeline, newTimelineEvent],
        }
      }
      return lead
    })

    setLeads(updated)
    toast({
      title: "Pipeline Updated",
      description: `Lead moved to ${STAGES.find((s) => s.id === targetStage)?.label} stage.`,
      type: "success",
    })
  }

  // Create Lead Submit handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName || !formCompany || !formEmail) {
      toast({
        title: "Required fields missing",
        description: "Please populate name, company, and email values.",
        type: "error",
      })
      return
    }

    const valueNum = formValue ? parseFloat(formValue) : 0
    const initials = formAssignee.split(" ").map(w => w[0]).join("").toUpperCase()
    const tagsArray = formTags ? formTags.split(",").map(t => t.trim()).filter(Boolean) : ["General"]

    const newLead: Lead = {
      id: `ld-${Date.now()}`,
      name: formName,
      company: formCompany,
      email: formEmail,
      value: valueNum,
      stage: formStage,
      priority: formPriority,
      assignedTo: { name: formAssignee, avatar: initials },
      tags: tagsArray,
      created: new Date().toISOString().split("T")[0],
      activities: [
        { id: `act-${Date.now()}`, text: `Lead added manually to pipeline by admin.`, time: "Just now", user: "Jane Doe" },
      ],
      timeline: [
        { id: `t-${Date.now()}`, title: "Lead Captured", time: "Just now", stage: "new" },
      ],
    }

    setLeads([newLead, ...leads])
    setIsAddOpen(false)
    resetForm()

    toast({
      title: "Lead Created",
      description: `${newLead.name} has been added to pipeline.`,
      type: "success",
    })
  }

  // Edit Lead load trigger
  const triggerEdit = (lead: Lead) => {
    setActiveLead(lead)
    setFormName(lead.name)
    setFormCompany(lead.company)
    setFormEmail(lead.email)
    setFormValue(lead.value.toString())
    setFormStage(lead.stage)
    setFormPriority(lead.priority)
    setFormAssignee(lead.assignedTo.name)
    setFormTags(lead.tags.join(", "))
    setIsEditOpen(true)
  }

  // Edit Lead Submit handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeLead) return

    const initials = formAssignee.split(" ").map(w => w[0]).join("").toUpperCase()
    const tagsArray = formTags ? formTags.split(",").map(t => t.trim()).filter(Boolean) : ["General"]

    const updated = leads.map((l) =>
      l.id === activeLead.id
        ? {
            ...l,
            name: formName,
            company: formCompany,
            email: formEmail,
            value: formValue ? parseFloat(formValue) : 0,
            stage: formStage,
            priority: formPriority,
            assignedTo: { name: formAssignee, avatar: initials },
            tags: tagsArray,
          }
        : l
    )

    setLeads(updated)
    setIsEditOpen(false)
    resetForm()

    toast({
      title: "Lead updated",
      description: "Pipeline parameters updated successfully.",
      type: "success",
    })
  }

  // Delete trigger
  const triggerDelete = (lead: Lead) => {
    setActiveLead(lead)
    setIsDeleteOpen(true)
  }

  // Delete Action handler
  const handleDeleteConfirm = () => {
    if (!activeLead) return

    setLeads(leads.filter((l) => l.id !== activeLead.id))
    setIsDeleteOpen(false)
    setActiveLead(null)

    toast({
      title: "Lead Removed",
      description: "Successfully deleted lead card from pipeline.",
      type: "success",
    })
  }

  // Drawer details view trigger
  const triggerDetails = (lead: Lead) => {
    setActiveLead(lead)
    setIsDrawerOpen(true)
  }

  // Add Comment/Activity Feed helper
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeLead || !commentText) return

    const newAct: LeadActivity = {
      id: `act-${Date.now()}`,
      text: commentText,
      time: "Just now",
      user: "Jane Doe",
    }

    const updatedLeads = leads.map((l) => {
      if (l.id === activeLead.id) {
        return {
          ...l,
          activities: [newAct, ...l.activities],
        }
      }
      return l
    })

    setLeads(updatedLeads)
    // Update active lead representation inside drawer
    setActiveLead({
      ...activeLead,
      activities: [newAct, ...activeLead.activities],
    })
    setCommentText("")
    toast({
      title: "Activity Logged",
      description: "Successfully added comment to lead board.",
      type: "success",
    })
  }

  const resetForm = () => {
    setFormName("")
    setFormCompany("")
    setFormEmail("")
    setFormValue("")
    setFormStage("new")
    setFormPriority("medium")
    setFormAssignee("Jane Doe")
    setFormTags("")
    setActiveLead(null)
  }

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ]

  const agentOptions = [
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Aria Mercer", label: "Aria Mercer" },
    { value: "John Smith", label: "John Smith" },
  ]

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Leads Pipeline" },
        ]}
      />

      <PageHeader
        title="Leads Pipeline Registry"
        description="Monitor inbound and outbound prospective deals. Track stages in Kanban boards or switch to custom data lists."
        actions={
          <div className="flex gap-2.5 items-center select-none">
            {/* Kanban vs Table Toggler */}
            <div className="bg-muted/65 p-1 rounded-xl flex items-center gap-1 border border-border/40 mr-1.5">
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setViewMode("kanban")}
                className="cursor-pointer size-7 rounded-lg"
                title="Kanban Board view"
              >
                <LayoutGrid className="size-3.5" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setViewMode("table")}
                className="cursor-pointer size-7 rounded-lg"
                title="Data Table list view"
              >
                <List className="size-3.5" />
              </Button>
            </div>

            <Button
              variant="premium"
              onClick={() => {
                resetForm()
                setIsAddOpen(true)
              }}
              icon={<Plus className="size-4" />}
              className="cursor-pointer font-bold shadow-md animate-pulse hover:animate-none"
            >
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Search and Filters tool row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/60 bg-card/60 rounded-2xl shadow-sm">
        <SearchBar
          placeholder="Search leads by name or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex items-center gap-3">
          <FilterControls
            label="Priority"
            options={priorityOptions}
            selectedValues={priorityFilters}
            onChange={setPriorityFilters}
          />
          <FilterControls
            label="Assigned Agent"
            options={agentOptions}
            selectedValues={agentFilters}
            onChange={setAgentFilters}
          />
          {(searchQuery || priorityFilters.length > 0 || agentFilters.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setPriorityFilters([])
                setAgentFilters([])
              }}
              className="cursor-pointer text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* VIEW MODES CONDITIONAL RENDER */}
      {viewMode === "kanban" ? (
        /* KANBAN BOARD VIEW */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 select-none">
          {STAGES.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.stage === col.id)

            return (
              <div key={col.id} className="flex flex-col gap-4 bg-muted/20 border border-border/40 rounded-2xl p-4 min-h-[500px]">
                {/* Column header title */}
                <div className="flex items-center justify-between pb-2 border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full bg-${col.id === "new" ? "primary" : col.id === "contacted" ? "amber-500" : col.id === "proposal" ? "secondary" : "emerald-500"}`} />
                    <span className="text-xs font-bold text-foreground font-heading">{col.label}</span>
                  </div>
                  <Badge variant="neutral">{colLeads.length}</Badge>
                </div>

                {/* Column Card list scroll */}
                <div className="flex-1 overflow-y-auto space-y-3 scrollbar-none">
                  {colLeads.length === 0 ? (
                    <div className="text-center py-12 text-[10px] text-muted-foreground/60 font-semibold border border-dashed border-border/30 rounded-xl">
                      No leads in stage
                    </div>
                  ) : (
                    colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => triggerDetails(lead)}
                        className="group/card relative flex flex-col justify-between p-4 bg-card border border-border/60 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
                      >
                        {/* Priority marker color banner */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-${lead.priority === "high" ? "destructive" : lead.priority === "medium" ? "amber-500" : "muted-foreground/40"}`} />

                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-extrabold text-foreground leading-tight group-hover/card:text-primary transition-colors duration-300">
                                {lead.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{lead.company}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                triggerEdit(lead)
                              }}
                              className="opacity-0 group-hover/card:opacity-100 rounded-md transition-opacity"
                            >
                              <Edit2 className="size-3" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {lead.tags.map((tag) => (
                              <span key={tag} className="text-[8px] font-extrabold bg-muted text-muted-foreground px-1 py-0.25 rounded border border-border/30">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
                          <span className="text-xs font-bold text-foreground">
                            ₹{lead.value.toLocaleString("en-IN")}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Move stage simulation icons */}
                            <div className="flex gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveLeadStage(lead.id, "prev")
                                }}
                                disabled={lead.stage === "new"}
                                className="p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 rounded cursor-pointer"
                                title="Move back stage"
                              >
                                <ArrowLeft className="size-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveLeadStage(lead.id, "next")
                                }}
                                disabled={lead.stage === "qualified"}
                                className="p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 rounded cursor-pointer"
                                title="Move forward stage"
                              >
                                <ArrowRight className="size-3" />
                              </button>
                            </div>

                            <Avatar fallback={lead.assignedTo.avatar} size="xs" title={`Assigned to ${lead.assignedTo.name}`} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* STANDARD TABLE VIEW */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Budget (INR)</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="w-[80px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No lead records found matching queries.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-semibold text-foreground">
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none">{lead.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{lead.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-semibold">{lead.company}</TableCell>
                  <TableCell className="font-bold text-foreground">₹{lead.value.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant={lead.stage === "new" ? "default" : lead.stage === "contacted" ? "warning" : lead.stage === "proposal" ? "secondary" : "success"}>
                      {STAGES.find((s) => s.id === lead.stage)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold border uppercase ${
                      lead.priority === "high"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : lead.priority === "medium"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {lead.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                      <Avatar fallback={lead.assignedTo.avatar} size="xs" />
                      <span>{lead.assignedTo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[80px] text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerDetails(lead)}
                        className="cursor-pointer text-muted-foreground hover:text-primary rounded-lg"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerEdit(lead)}
                        className="cursor-pointer text-muted-foreground hover:text-secondary rounded-lg"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => triggerDelete(lead)}
                        className="cursor-pointer text-muted-foreground hover:text-destructive rounded-lg"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* DIALOG PORTAL: ADD LEAD MODAL */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Pipeline Lead Card"
        description="Insert lead info to position them inside current column workflows."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleAddSubmit} className="cursor-pointer shadow-sm">
              Save Lead Card
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Sarah Connor"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Company *</label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="Cyberdyne Systems"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Email *</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="sarah@cyberdyne.com"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Est. Budget (INR)</label>
              <input
                type="number"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="450000"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Assigned Agent</label>
              <select
                value={formAssignee}
                onChange={(e) => setFormAssignee(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="Jane Doe">Jane Doe</option>
                <option value="Aria Mercer">Aria Mercer</option>
                <option value="John Smith">John Smith</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Initial Stage</label>
              <select
                value={formStage}
                onChange={(e) => setFormStage(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="new">New Leads</option>
                <option value="contacted">Contacted</option>
                <option value="proposal">Proposal Sent</option>
                <option value="qualified">Qualified</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Tags (comma-separated)</label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="Enterprise, SaaS, Q3 Deal"
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>
        </form>
      </Dialog>

      {/* DIALOG PORTAL: EDIT LEAD MODAL */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Pipeline Lead Card"
        description="Update contact emails, priority ranges, and estimated budgets."
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
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-semibold">
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
              <label className="text-xs font-semibold text-muted-foreground">Company</label>
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
              <label className="text-xs font-semibold text-muted-foreground">Est. Budget (INR)</label>
              <input
                type="number"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Assigned Agent</label>
              <select
                value={formAssignee}
                onChange={(e) => setFormAssignee(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="Jane Doe">Jane Doe</option>
                <option value="Aria Mercer">Aria Mercer</option>
                <option value="John Smith">John Smith</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Pipeline Stage</label>
              <select
                value={formStage}
                onChange={(e) => setFormStage(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="new">New Leads</option>
                <option value="contacted">Contacted</option>
                <option value="proposal">Proposal Sent</option>
                <option value="qualified">Qualified</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Tags (comma-separated)</label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>
        </form>
      </Dialog>

      {/* DIALOG PORTAL: DELETE CONFIRMATION SAFETY MODAL */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Lead Removal"
        description="Are you sure you want to delete this lead card from pipeline databases?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="cursor-pointer">
              Delete Lead
            </Button>
          </>
        }
      >
        {activeLead && (
          <div className="flex gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl mt-2 text-destructive">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div className="text-xs font-medium leading-relaxed">
              Deleting <span className="font-bold">{activeLead.name}</span> will clear estimated budget statistics, activity commentaries, and timeline audits from operations dashboards.
            </div>
          </div>
        )}
      </Dialog>

      {/* SIDE DRAWER PORTAL: LEAD DETAILS SIDE OVERLAY */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Lead Pipeline Profile"
        description="Review timeline trails and activity feeds."
      >
        {activeLead && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 bg-muted/40 border border-border/40 rounded-xl select-none">
              <Avatar fallback={activeLead.name.split(" ").map(w => w[0]).join("")} size="lg" />
              <div>
                <h4 className="text-base font-bold text-foreground font-heading">{activeLead.name}</h4>
                <p className="text-xs text-muted-foreground">{activeLead.company}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="default">{STAGES.find(s => s.id === activeLead.stage)?.label}</Badge>
                  <span className={`inline-flex items-center px-1 py-0.25 rounded text-[9px] font-extrabold border uppercase ${
                    activeLead.priority === "high"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : activeLead.priority === "medium"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {activeLead.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage / Priority Dropdowns */}
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Modify Stage</label>
                <select
                  value={activeLead.stage}
                  onChange={(e) => updateLeadStage(activeLead.id, e.target.value as LeadStage)}
                  className="w-full bg-muted border border-border rounded-lg p-2.5 text-xs text-foreground font-semibold outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Assignee</label>
                <div className="flex items-center gap-2 p-2 bg-muted border border-border rounded-lg text-xs text-foreground/80 select-none">
                  <Avatar fallback={activeLead.assignedTo.avatar} size="xs" />
                  <span className="truncate">{activeLead.assignedTo.name}</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/40 my-1" />

            {/* Estimated Value */}
            <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-primary font-heading tracking-wide">Estimated Budget</span>
              <p className="text-base font-bold text-primary flex items-center gap-1">
                <IndianRupee className="size-4" />
                {activeLead.value.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="h-px bg-border/40 my-1" />

            {/* Lead Pipeline Timeline Trail */}
            <div className="space-y-3.5">
              <h5 className="text-xs font-bold text-foreground font-heading uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="size-4 text-muted-foreground" />
                <span>Lead Timeline Trail</span>
              </h5>
              <div className="relative border-l border-border/60 pl-3.5 ml-2.5 space-y-4 text-xs">
                {activeLead.timeline.map((evt) => (
                  <div key={evt.id} className="relative">
                    <span className="absolute -left-[20.5px] top-0.5 size-2.5 rounded-full bg-primary border-2 border-background" />
                    <p className="font-semibold text-foreground">{evt.title}</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">{evt.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/40 my-1" />

            {/* Activity comments feed */}
            <div className="space-y-3.5">
              <h5 className="text-xs font-bold text-foreground font-heading uppercase tracking-wide flex items-center gap-1.5">
                <MessageSquare className="size-4 text-muted-foreground" />
                <span>Activity Commentary Feed</span>
              </h5>
              
              {/* Comment submission form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Log comment activity..."
                  className="flex-1 text-xs bg-muted/40 border border-border rounded-lg px-3 py-1.75 outline-none focus:border-primary/50 text-foreground"
                />
                <Button type="submit" size="sm" className="cursor-pointer font-bold shadow-sm">
                  <Send className="size-3.5" />
                </Button>
              </form>

              {/* Feed items list */}
              <div className="space-y-3 pt-2 max-h-48 overflow-y-auto scrollbar-thin">
                {activeLead.activities.map((act) => (
                  <div key={act.id} className="p-3 border border-border/40 bg-muted/20 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-foreground">{act.user}</span>
                      <span className="text-muted-foreground/60">{act.time}</span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">{act.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default function LeadsPage() {
  return (
    <ToastProvider>
      <LeadsDashboard />
    </ToastProvider>
  )
}

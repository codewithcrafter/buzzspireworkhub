"use client"

import * as React from "react"
import {
  Plus,
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  Users,
  CheckSquare,
  Milestone,
  CalendarRange,
  Activity,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  ChevronRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Circle,
  AlertCircle,
  LayoutGrid,
  List,
  Send,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"
import { SectionHeader } from "@/components/ui/section-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"
import { Tabs } from "@/components/ui/tabs"

interface ProjectTask {
  id: string
  title: string
  completed: boolean
}

interface ProjectMilestone {
  id: string
  title: string
  dueDate: string
  status: "completed" | "in_progress" | "pending"
}

interface ProjectMember {
  id: string
  name: string
  role: string
  avatar: string
}

interface ProjectTimeline {
  id: string
  text: string
  time: string
  type: "task" | "milestone" | "budget" | "system"
}

interface Project {
  id: string
  title: string
  client: string
  description: string
  status: "active" | "completed" | "pending" | "delayed"
  budget: number
  deadline: string
  tasks: ProjectTask[]
  milestones: ProjectMilestone[]
  members: ProjectMember[]
  timeline: ProjectTimeline[]
}

const mapStatus = (status: "active" | "completed" | "pending" | "delayed"): "active" | "pending" | "error" | "inactive" | "info" => {
  if (status === "completed") return "active"
  if (status === "delayed") return "error"
  if (status === "pending") return "pending"
  return "info"
}

function ProjectsDashboard() {
  const { toast } = useToast()

  // Interactive View: "cards" vs "table"
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards")

  // Selected active project for Detail Page view
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
  
  // Inner detail tabs selection
  const [detailTab, setDetailTab] = React.useState("tasks")

  // Mock Database
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: "pr-1",
      title: "BuzzSpire Rebranding Campaign",
      client: "BuzzSpire Media Internal",
      description: "Overhaul existing identity guidelines, create premium marketing collateral, and align social assets.",
      status: "active",
      budget: 150000,
      deadline: "2026-07-20",
      tasks: [
        { id: "task-1", title: "Finalize typography palettes", completed: true },
        { id: "task-2", title: "Deliver primary social template graphics", completed: false },
        { id: "task-3", title: "Approve guidelines brief PDF booklet", completed: false },
      ],
      milestones: [
        { id: "m-1", title: "Brand Identity Design Complete", dueDate: "2026-07-05", status: "in_progress" },
        { id: "m-2", title: "Collateral Print Approvals", dueDate: "2026-07-12", status: "pending" },
        { id: "m-3", title: "Final Launch Event Delivery", dueDate: "2026-07-20", status: "pending" },
      ],
      members: [
        { id: "mem-1", name: "Jane Doe", role: "Creative Lead", avatar: "JD" },
        { id: "mem-2", name: "Sarah Jenkins", role: "UI Designer", avatar: "SJ" },
      ],
      timeline: [
        { id: "t-1", text: "Project initialized in workspace board.", time: "July 1, 9:00 AM", type: "system" },
        { id: "t-2", text: "Jane Doe marked 'Finalize typography palettes' completed.", time: "July 2, 2:00 PM", type: "task" },
      ],
    },
    {
      id: "pr-2",
      title: "Aria Mercer Webapp Development",
      client: "Vercel Labs",
      description: "Build next-generation SaaS analytics dashboard utilizing server component optimization architectures.",
      status: "active",
      budget: 480000,
      deadline: "2026-08-15",
      tasks: [
        { id: "task-4", title: "Initialize Next.js App Router configurations", completed: true },
        { id: "task-5", title: "Integrate dashboard layout widgets", completed: true },
        { id: "task-6", title: "Run end-to-end user compile validation checks", completed: false },
      ],
      milestones: [
        { id: "m-4", title: "Prototype Signoff Phase", dueDate: "2026-07-10", status: "completed" },
        { id: "m-5", title: "Analytics Integrations Testing", dueDate: "2026-07-30", status: "in_progress" },
        { id: "m-6", title: "Live Workspace Deployment", dueDate: "2026-08-15", status: "pending" },
      ],
      members: [
        { id: "mem-3", name: "John Smith", role: "Developer", avatar: "JS" },
        { id: "mem-4", name: "David Miller", role: "Project Manager", avatar: "DM" },
      ],
      timeline: [
        { id: "t-3", text: "Project initialized.", time: "June 28, 10:00 AM", type: "system" },
        { id: "t-4", text: "Prototype Signoff phase achieved.", time: "July 3, 12:00 PM", type: "milestone" },
      ],
    },
    {
      id: "pr-3",
      title: "SEO Campaign Launch",
      client: "Nexus Labs",
      description: "Audit landing page structures, optimize technical metadata performance, and construct backlink listings.",
      status: "delayed",
      budget: 85000,
      deadline: "2026-07-18",
      tasks: [
        { id: "task-7", title: "Execute crawling index scripts", completed: false },
        { id: "task-8", title: "Deliver keyword density review files", completed: false },
      ],
      milestones: [
        { id: "m-7", title: "Initial SEO Crawling Audit", dueDate: "2026-07-02", status: "pending" },
      ],
      members: [
        { id: "mem-5", name: "Jane Doe", role: "SEO Specialist", avatar: "JD" },
      ],
      timeline: [
        { id: "t-5", text: "Project initialized.", time: "June 30, 4:00 PM", type: "system" },
      ],
    },
  ])

  // Dialog states
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  // Current active working entities
  const [activeProject, setActiveProject] = React.useState<Project | null>(null)

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("")
  const [formClient, setFormClient] = React.useState("")
  const [formDesc, setFormDesc] = React.useState("")
  const [formBudget, setFormBudget] = React.useState("")
  const [formDeadline, setFormDeadline] = React.useState("")
  const [formStatus, setFormStatus] = React.useState<"active" | "completed" | "pending" | "delayed">("active")

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null

  // Calculate project progress percentage dynamically
  const calculateProgress = (project: Project) => {
    if (project.tasks.length === 0) return 0
    const completed = project.tasks.filter((t) => t.completed).length
    return Math.round((completed / project.tasks.length) * 100)
  }

  // Checklist toggles inside Details view
  const toggleTask = (projectId: string, taskId: string) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.map((t) => {
          if (t.id === taskId) {
            const statusText = !t.completed ? "completed" : "reopened"
            
            // Append timeline note
            const timelineEvt: ProjectTimeline = {
              id: `t-${Date.now()}`,
              text: `Task "${t.title}" was ${statusText}.`,
              time: "Just now",
              type: "task",
            }

            toast({
              title: !t.completed ? "Task finished" : "Task reopened",
              description: `"${t.title}" status has been modified.`,
              type: !t.completed ? "success" : "info",
            })

            return { ...t, completed: !t.completed }
          }
          return t
        })

        return {
          ...p,
          tasks: updatedTasks,
        }
      }
      return p
    })

    setProjects(updated)
  }

  // Create Project submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle || !formClient || !formDeadline) {
      toast({
        title: "Required fields missing",
        description: "Please populate title, client, and deadline values.",
        type: "error",
      })
      return
    }

    const budgetNum = formBudget ? parseFloat(formBudget) : 0
    const newProj: Project = {
      id: `pr-${Date.now()}`,
      title: formTitle,
      client: formClient,
      description: formDesc || "No description provided.",
      status: formStatus,
      budget: budgetNum,
      deadline: formDeadline,
      tasks: [
        { id: `task-${Date.now()}-1`, title: "Define roadmap benchmarks", completed: false },
        { id: `task-${Date.now()}-2`, title: "Review requirements brief", completed: false },
      ],
      milestones: [
        { id: `m-${Date.now()}`, title: "Initial Roadmap Release", dueDate: formDeadline, status: "pending" },
      ],
      members: [
        { id: `mem-${Date.now()}`, name: "Jane Doe", role: "Manager", avatar: "JD" },
      ],
      timeline: [
        { id: `t-${Date.now()}`, text: "Project registry created manually.", time: "Just now", type: "system" },
      ],
    }

    setProjects([newProj, ...projects])
    setIsAddOpen(false)
    resetForm()

    toast({
      title: "Project Registered",
      description: `"${newProj.title}" board has been generated.`,
      type: "success",
    })
  }

  // Edit project trigger
  const triggerEdit = (project: Project) => {
    setActiveProject(project)
    setFormTitle(project.title)
    setFormClient(project.client)
    setFormDesc(project.description)
    setFormBudget(project.budget.toString())
    setFormDeadline(project.deadline)
    setFormStatus(project.status)
    setIsEditOpen(true)
  }

  // Edit project submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeProject) return

    const updated = projects.map((p) =>
      p.id === activeProject.id
        ? {
            ...p,
            title: formTitle,
            client: formClient,
            description: formDesc,
            budget: formBudget ? parseFloat(formBudget) : 0,
            deadline: formDeadline,
            status: formStatus,
          }
        : p
    )

    setProjects(updated)
    setIsEditOpen(false)
    resetForm()

    toast({
      title: "Project updated",
      description: "Project parameters updated successfully.",
      type: "success",
    })
  }

  // Delete trigger
  const triggerDelete = (project: Project) => {
    setActiveProject(project)
    setIsDeleteOpen(true)
  }

  // Delete Action handler
  const handleDeleteConfirm = () => {
    if (!activeProject) return

    setProjects(projects.filter((p) => p.id !== activeProject.id))
    if (selectedProjectId === activeProject.id) {
      setSelectedProjectId(null)
    }
    setIsDeleteOpen(false)
    setActiveProject(null)

    toast({
      title: "Project Cleared",
      description: "Campaign project cleared successfully from registries.",
      type: "success",
    })
  }

  const resetForm = () => {
    setFormTitle("")
    setFormClient("")
    setFormDesc("")
    setFormBudget("")
    setFormDeadline("")
    setFormStatus("active")
    setActiveProject(null)
  }

  // Calendar render helper (renders standard mockup monthly grid)
  const renderCalendar = (project: Project) => {
    // Generate simple 30 slots representing days
    const slots = []
    for (let d = 1; d <= 28; d++) {
      // Dummy check to map deadlines or milestones
      const isDeadline = d === 20
      const isMilestone = d === 5 || d === 12

      slots.push(
        <div key={`cal-${d}`} className="h-10 border border-border/20 rounded-lg flex flex-col justify-between p-1.5 bg-muted/20 relative">
          <span className="text-[9px] text-muted-foreground/80 font-bold">{d}</span>
          
          <div className="flex gap-0.5 mt-auto">
            {isDeadline && (
              <span className="size-1.5 rounded-full bg-destructive animate-pulse" title="Project Final Deadline" />
            )}
            {isMilestone && (
              <span className="size-1.5 rounded-full bg-primary" title="Milestone Target Date" />
            )}
          </div>
        </div>
      )
    }
    return slots
  }

  const detailTabs = [
    { id: "tasks", label: "Tasks Checklist", icon: <CheckSquare className="size-4" /> },
    { id: "milestones", label: "Milestones", icon: <Milestone className="size-4" /> },
    { id: "team", label: "Team Members", icon: <Users className="size-4" /> },
    { id: "calendar", label: "Calendar Board", icon: <CalendarRange className="size-4" /> },
    { id: "timeline", label: "Timeline Feed", icon: <Activity className="size-4" /> },
    { id: "clientPortal", label: "Client Portal Settings", icon: <UserPlus className="size-4" /> },
  ]

  return (
    <div className="space-y-6 pb-16">
      {/* Dynamic breadcrumbs path mapping */}
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Projects board", href: "/admin/projects" },
          ...(selectedProject ? [{ label: selectedProject.title }] : []),
        ]}
      />

      {/* DUAL VIEW CONTROLLER Conditional render */}
      {!selectedProject ? (
        /* SECTION 1: ALL PROJECTS GALLERY list */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <PageHeader
            title="Projects Operations Console"
            description="Manage active campaigns, monitor completion bars, assign team structures, and configure milestone deliveries."
            actions={
              <div className="flex gap-2.5 items-center select-none">
                {/* View togglers button pill */}
                <div className="bg-muted/65 p-1 rounded-xl flex items-center gap-1 border border-border/40 mr-1.5">
                  <Button
                    variant={viewMode === "cards" ? "secondary" : "ghost"}
                    size="icon-xs"
                    onClick={() => setViewMode("cards")}
                    className="cursor-pointer size-7 rounded-lg"
                    title="Grid of project cards"
                  >
                    <LayoutGrid className="size-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="icon-xs"
                    onClick={() => setViewMode("table")}
                    className="cursor-pointer size-7 rounded-lg"
                    title="Table list"
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
                  className="cursor-pointer font-bold shadow-md"
                >
                  Create Project
                </Button>
              </div>
            }
          />

          {viewMode === "cards" ? (
            /* PROJECT CARDS VIEW */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const progress = calculateProgress(project)
                const isOverdue = new Date(project.deadline) < new Date() && project.status !== "completed"

                return (
                  <Card key={project.id} className="flex flex-col h-full group/card hover:-translate-y-0.5 duration-300">
                    <CardHeader className="flex flex-row items-start justify-between border-b border-border/20 pb-4">
                      <div className="space-y-1">
                        <CardTitle
                          className="cursor-pointer hover:text-primary transition-colors text-base truncate max-w-[200px]"
                          onClick={() => setSelectedProjectId(project.id)}
                        >
                          {project.title}
                        </CardTitle>
                        <CardDescription className="truncate max-w-[200px]">{project.client}</CardDescription>
                      </div>
                      <StatusChip status={mapStatus(project.status)}>{project.status.toUpperCase()}</StatusChip>
                    </CardHeader>

                    <CardContent className="pt-5 flex-1 space-y-4">
                      <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Progress Bar widget */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 bg-${
                              project.status === "delayed" ? "destructive" : "primary"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between border-t border-border/20 bg-muted/20">
                      <div className="flex items-center gap-1.5">
                        <AvatarGroup size="xs" max={3}>
                          {project.members.map((m) => (
                            <Avatar key={m.id} fallback={m.avatar} title={m.name} />
                          ))}
                        </AvatarGroup>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setSelectedProjectId(project.id)}
                          className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Open Details Page"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => triggerEdit(project)}
                          className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => triggerDelete(project)}
                          className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            /* PROJECT TABLE VIEW */
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="w-[80px] text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const progress = calculateProgress(project)
                  return (
                    <TableRow key={project.id}>
                      <TableCell
                        className="font-bold text-foreground cursor-pointer hover:text-primary transition-colors text-sm"
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        {project.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs font-semibold">{project.client}</TableCell>
                      <TableCell className="font-bold text-foreground">₹{project.budget.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={mapStatus(project.status)}>{project.status.toUpperCase()}</StatusChip>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-semibold">
                        {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell className="w-[80px] text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setSelectedProjectId(project.id)}
                            className="cursor-pointer text-muted-foreground hover:text-primary rounded-lg"
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => triggerEdit(project)}
                            className="cursor-pointer text-muted-foreground hover:text-secondary rounded-lg"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => triggerDelete(project)}
                            className="cursor-pointer text-muted-foreground hover:text-destructive rounded-lg"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      ) : (
        /* SECTION 2: HIGH-FIDELITY PROJECT DETAIL PAGE VIEW */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header navigation bar back trigger */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => setSelectedProjectId(null)}
              className="rounded-lg cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
            </Button>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Project Workspace</span>
              <h2 className="text-xl font-bold font-heading text-foreground">{selectedProject.title}</h2>
            </div>
          </div>

          {/* Project Details Metrics Bar */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-card border border-border/60 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Earnings Budget</span>
              <p className="text-base font-extrabold text-foreground mt-1">₹{selectedProject.budget.toLocaleString("en-IN")}</p>
            </div>
            <div className="p-4 bg-card border border-border/60 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Project Stage</span>
              <div className="mt-1 flex">
                <StatusChip status={mapStatus(selectedProject.status)}>{selectedProject.status.toUpperCase()}</StatusChip>
              </div>
            </div>
            <div className="p-4 bg-card border border-border/60 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Overall Completion</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${calculateProgress(selectedProject)}%` }} />
                </div>
                <span className="text-xs font-bold text-foreground">{calculateProgress(selectedProject)}%</span>
              </div>
            </div>
            <div className="p-4 bg-card border border-border/60 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Release Deadline</span>
              <p className="text-xs font-extrabold text-foreground mt-1 flex items-center gap-1.5">
                <CalendarIcon className="size-3.5 text-muted-foreground" />
                {new Date(selectedProject.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Detailed Tab switches navigation */}
          <Tabs
            id="project-detail-tabs"
            tabs={detailTabs}
            activeTab={detailTab}
            onChange={setDetailTab}
            variant="capsule"
          />

          {/* TAB PANELS INTERACTIVE RENDER */}
          <div className="pt-2 animate-in fade-in duration-200">
            {/* TAB: TASKS CHECKLIST */}
            {detailTab === "tasks" && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Action Checklist</CardTitle>
                  <CardDescription>Click to complete operational tasks. Completion updates overall progress bar metrics.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5">
                  {selectedProject.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(selectedProject.id, task.id)}
                      className="flex items-start gap-3 w-full text-left group/task cursor-pointer pb-2.5 border-b border-border/20 last:border-0 last:pb-0"
                    >
                      <div className="shrink-0 mt-0.5 text-muted-foreground group-hover/task:text-primary transition-colors">
                        {task.completed ? (
                          <CheckCircle2 className="size-4 text-primary fill-primary/10" />
                        ) : (
                          <Circle className="size-4" />
                        )}
                      </div>
                      <p className={`text-xs font-semibold text-foreground truncate ${task.completed ? "line-through text-muted-foreground/60" : ""}`}>
                        {task.title}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* TAB: MILESTONES PROGRESS */}
            {detailTab === "milestones" && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Milestones</CardTitle>
                  <CardDescription>Chronological project delivery stage goals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProject.milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between pb-3 border-b border-border/20 last:border-0 last:pb-0 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Milestone className="size-4 text-muted-foreground" />
                        <span className="font-bold text-foreground">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">Due: {new Date(m.dueDate).toLocaleDateString()}</span>
                        <Badge variant={m.status === "completed" ? "success" : m.status === "in_progress" ? "warning" : "outline"}>
                          {m.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* TAB: TEAM MEMBERS */}
            {detailTab === "team" && (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 select-none">
                {selectedProject.members.map((m) => (
                  <Card key={m.id}>
                    <CardContent className="pt-6 flex items-center gap-3.5">
                      <Avatar fallback={m.avatar} size="md" />
                      <div>
                        <h5 className="text-xs font-bold text-foreground">{m.name}</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{m.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* TAB: CALENDAR BOARD */}
            {detailTab === "calendar" && (
              <Card>
                <CardHeader>
                  <CardTitle>Deadline Calendar grid</CardTitle>
                  <CardDescription>Target timeline grid visualizer showing key dates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Headers */}
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <span key={day} className="text-center text-[10px] uppercase font-bold text-muted-foreground/60 py-1">
                        {day}
                      </span>
                    ))}
                    {renderCalendar(selectedProject)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB: TIMELINE FEED */}
            {detailTab === "timeline" && (
              <Card>
                <CardHeader>
                  <CardTitle>Operational Audit Feed</CardTitle>
                  <CardDescription>Chronological project log updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProject.timeline.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs pb-3 border-b border-border/20 last:border-0 last:pb-0">
                      <div className="size-6 bg-muted border border-border/40 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Activity className="size-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground/80 leading-relaxed">{item.text}</p>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* TAB: CLIENT PORTAL SETTINGS */}
            {detailTab === "clientPortal" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Visibility Toggles */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Visibility Controls</CardTitle>
                      <CardDescription>Select which features and tabs are visible in the Client Portal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-1 text-xs font-semibold">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { key: "showTimeline", label: "Timeline Updates" },
                          { key: "showFiles", label: "Shared Files" },
                          { key: "showInvoices", label: "Invoices Ledger" },
                          { key: "showPayments", label: "Payments Tab" },
                          { key: "showProgress", label: "Progress Stages" },
                          { key: "showMessages", label: "Direct Messages" },
                          { key: "showTickets", label: "Support Tickets" },
                          { key: "showDownloads", label: "File Downloads" },
                          { key: "showDeliverables", label: "Final Deliverables" },
                        ].map((toggle) => (
                          <label key={toggle.key} className="flex items-center gap-2.5 text-foreground cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={(selectedProject as any)[toggle.key] !== false}
                              onChange={(e) => {
                                const updated = projects.map((p) => {
                                  if (p.id === selectedProject.id) {
                                    return { ...p, [toggle.key]: e.target.checked };
                                  }
                                  return p;
                                });
                                setProjects(updated);
                                toast({
                                  title: "Visibility Updated",
                                  description: `${toggle.label} visibility has been saved.`,
                                  type: "success",
                                });
                              }}
                              className="size-4 border border-input rounded cursor-pointer accent-primary"
                            />
                            <span>{toggle.label}</span>
                          </label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Stages Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Milestones & Stages</CardTitle>
                      <CardDescription>Update progress percentages and operational milestone stages.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-1 text-xs">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center font-bold">
                          <span>Overall Progress</span>
                          <span>{calculateProgress(selectedProject)}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Progress is computed automatically based on the checkbox tasks completed in the Tasks Checklist tab.</p>
                      </div>

                      <div className="h-px bg-border/40 my-3" />

                      <div className="space-y-3">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Milestone Phases</p>
                        {selectedProject.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center justify-between gap-3 p-2 bg-muted/30 border border-border/40 rounded-lg">
                            <span className="font-bold text-foreground">{milestone.title}</span>
                            <select
                              value={milestone.status}
                              onChange={(e) => {
                                const updated = projects.map((p) => {
                                  if (p.id === selectedProject.id) {
                                    const updatedMilestones = p.milestones.map((m) => {
                                      if (m.id === milestone.id) {
                                        return { ...m, status: e.target.value as any };
                                      }
                                      return m;
                                    });
                                    return { ...p, milestones: updatedMilestones };
                                  }
                                  return p;
                                });
                                setProjects(updated);
                                toast({
                                  title: "Milestone Stage Updated",
                                  description: `"${milestone.title}" set to ${e.target.value.toUpperCase()}.`,
                                  type: "success",
                                });
                              }}
                              className="text-xs bg-card border border-border rounded-lg p-1.5 outline-none focus:border-primary/50 text-foreground font-semibold"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* File Sharing Control */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Asset Delivery & Files Upload</CardTitle>
                      <CardDescription>Share assets, documentation, or deliverables directly with the client.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-1 text-xs">
                      {/* Shared Files list */}
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Shared Deliverables</p>
                        <div className="space-y-2">
                          {[
                            { name: "Brand Guidelines Draft brief.pdf", size: "1.4MB", type: "PDF" },
                            { name: "Collateral Source Graphics assets.zip", size: "4.8MB", type: "ZIP" },
                          ].map((file, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 bg-muted/30 border border-border/40 rounded-xl">
                              <div>
                                <p className="font-bold text-foreground">{file.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Size: {file.size} | Type: {file.type}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => {
                                  toast({
                                    title: "File Deleted",
                                    description: `Removed "${file.name}" from client portal visibility.`,
                                    type: "success",
                                  });
                                }}
                                className="text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-border/40 my-3" />

                      {/* Mock upload fields */}
                      <div className="space-y-3 font-semibold">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Share New Document</p>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="File Name (e.g. Design brief.pdf)"
                            className="text-xs bg-muted/40 border border-border rounded-lg p-2 outline-none focus:border-primary/50 text-foreground"
                            id="adminFileNameInput"
                          />
                          <select
                            className="text-xs bg-muted/40 border border-border rounded-lg p-2 outline-none focus:border-primary/50 text-foreground"
                            id="adminFileTypeInput"
                          >
                            <option value="PDF">PDF Document</option>
                            <option value="ZIP">ZIP Archive</option>
                            <option value="Image">Image Graphic</option>
                            <option value="Source">Source Code</option>
                          </select>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const nameVal = (document.getElementById("adminFileNameInput") as HTMLInputElement)?.value;
                            if (!nameVal) {
                              toast({ title: "Name required", description: "Please enter a file name.", type: "error" });
                              return;
                            }
                            toast({
                              title: "File Shared",
                              description: `"${nameVal}" uploaded and shared with client.`,
                              type: "success",
                            });
                            (document.getElementById("adminFileNameInput") as HTMLInputElement).value = "";
                          }}
                          className="cursor-pointer font-bold shadow-sm"
                        >
                          Upload & Share File
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* direct messaging chat panel */}
                  <Card className="flex flex-col h-[400px] overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>Direct Client Chat</CardTitle>
                      <CardDescription>Private messaging thread with client.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-3 p-4 bg-muted/10 border-t border-b border-border/20 scrollbar-thin">
                      {[
                        { text: "Hello Aria, guidelines proposal-v1 is ready in files. Let us know if you want to sync.", time: "July 3, 2:00 PM", isMe: true },
                        { text: "Excellent, reviewing typography choices now.", time: "July 3, 2:30 PM", isMe: false },
                      ].map((chat, idx) => (
                        <div
                          key={idx}
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                            chat.isMe
                              ? "bg-primary text-white ml-auto rounded-tr-none"
                              : "bg-muted border border-border/20 text-foreground mr-auto rounded-tl-none"
                          }`}
                        >
                          <div className="flex justify-between items-center text-[9px] font-bold opacity-80 mb-1 gap-6">
                            <span>{chat.isMe ? "Manager (Me)" : "Client"}</span>
                            <span>{chat.time}</span>
                          </div>
                          <p>{chat.text}</p>
                        </div>
                      ))}
                    </CardContent>
                    <div className="p-3 bg-card flex gap-2">
                      <input
                        type="text"
                        placeholder="Type direct message response..."
                        className="flex-1 text-xs bg-muted/40 border border-border rounded-xl px-4 py-2 outline-none focus:border-primary/50 text-foreground"
                        id="adminChatMessageInput"
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById("adminChatMessageInput") as HTMLInputElement;
                          if (!input.value.trim()) return;
                          toast({
                            title: "Message Transmitted",
                            description: "Message synced with client workspace portal.",
                            type: "success",
                          });
                          input.value = "";
                        }}
                        size="sm"
                        className="cursor-pointer font-bold shadow-md rounded-xl"
                      >
                        <Send className="size-3.5" />
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Operations Updates log timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Post Timeline Activity Log</CardTitle>
                    <CardDescription>Post an official timeline update for the client portal activity feed.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-1 text-xs">
                    <div className="grid grid-cols-2 gap-4 font-semibold font-sans">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Update Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Identity Design Approved"
                          className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
                          id="adminUpdateTitleInput"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Details *</label>
                        <input
                          type="text"
                          placeholder="Provide descriptive details of this project milestone..."
                          className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
                          id="adminUpdateDescInput"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const titleVal = (document.getElementById("adminUpdateTitleInput") as HTMLInputElement)?.value;
                        const descVal = (document.getElementById("adminUpdateDescInput") as HTMLInputElement)?.value;
                        if (!titleVal || !descVal) {
                          toast({ title: "Missing fields", description: "Title and Details are required.", type: "error" });
                          return;
                        }
                        
                        const newEvt: ProjectTimeline = {
                          id: `t-${Date.now()}`,
                          text: `${titleVal}: ${descVal}`,
                          time: "Just now",
                          type: "system",
                        };

                        const updated = projects.map((p) => {
                          if (p.id === selectedProject.id) {
                            return { ...p, timeline: [newEvt, ...p.timeline] };
                          }
                          return p;
                        });
                        setProjects(updated);

                        toast({
                          title: "Update Posted",
                          description: "Added to project timeline and activity feed.",
                          type: "success",
                        });

                        (document.getElementById("adminUpdateTitleInput") as HTMLInputElement).value = "";
                        (document.getElementById("adminUpdateDescInput") as HTMLInputElement).value = "";
                      }}
                      className="cursor-pointer font-bold shadow-md"
                    >
                      Post Timeline Update
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIALOG PORTAL: ADD PROJECT MODAL */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Project Board"
        description="Define budgets and initial deadlines for operational campaigns."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleAddSubmit} className="cursor-pointer shadow-sm">
              Save Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Project Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Rebranding Campaign"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Client Name *</label>
              <input
                type="text"
                required
                value={formClient}
                onChange={(e) => setFormClient(e.target.value)}
                placeholder="e.g. Vercel Labs"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Campaign Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Explain project guidelines and target deliverables..."
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground resize-none h-16"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Budget (INR)</label>
              <input
                type="number"
                value={formBudget}
                onChange={(e) => setFormBudget(e.target.value)}
                placeholder="150000"
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Deadline *</label>
              <input
                type="date"
                required
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
          </div>
        </form>
      </Dialog>

      {/* DIALOG PORTAL: EDIT PROJECT MODAL */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Project Parameters"
        description="Update description briefs, status, or budgets."
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
              <label className="text-xs font-semibold text-muted-foreground">Project Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Client Name</label>
              <input
                type="text"
                required
                value={formClient}
                onChange={(e) => setFormClient(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Campaign Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground resize-none h-16"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Budget (INR)</label>
              <input
                type="number"
                value={formBudget}
                onChange={(e) => setFormBudget(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Deadline</label>
              <input
                type="date"
                required
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
          </div>
        </form>
      </Dialog>

      {/* DIALOG PORTAL: DELETE SAFETY MODAL */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Project Removal"
        description="Are you sure you want to delete this campaign? This action is permanent."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="cursor-pointer">
              Delete Project
            </Button>
          </>
        }
      >
        {activeProject && (
          <div className="flex gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl mt-2 text-destructive">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div className="text-xs font-medium leading-relaxed">
              Deleting <span className="font-bold">{activeProject.title}</span> will clear active action tasks, delivery milestones target dates, and assignees lists from workspace databases.
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <ToastProvider>
      <ProjectsDashboard />
    </ToastProvider>
  )
}

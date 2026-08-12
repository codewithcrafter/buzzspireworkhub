"use client"

import * as React from "react"
import {
  Sparkles,
  TrendingUp,
  Users,
  UserPlus,
  Briefcase,
  IndianRupee,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sun,
  Moon,
  Star,
  Settings,
  ShieldCheck,
  Send,
  MoreVertical,
  Inbox,
  Filter,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"
import { SectionHeader } from "@/components/ui/section-header"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { ChartsPlaceholder } from "@/components/ui/charts-placeholder"
import { Tabs } from "@/components/ui/tabs"
import { Dialog } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { ToastProvider, useToast } from "@/components/ui/toast"

interface TaskItem {
  id: string
  title: string
  completed: boolean
  dueDate: string
  priority: "high" | "medium" | "low"
}

interface ActivityItem {
  id: string
  user: string
  avatar: string
  action: string
  target: string
  time: string
  type: "lead" | "project" | "payment" | "alert"
}

function DashboardContent() {
  const { toast } = useToast()

  // Theme state: default to light, toggle adds 'dark'
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  // Interactive dialog/drawer states
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false)
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = React.useState(false)

  // Tab State for Revenue Card Chart
  const [chartTab, setChartTab] = React.useState("revenue-area")

  const [tasks, setTasks] = React.useState<TaskItem[]>([])
  const [recentLeads, setRecentLeads] = React.useState<any[]>([])
  const [recentClients, setRecentClients] = React.useState<any[]>([])
  const [activities, setActivities] = React.useState<ActivityItem[]>([])
  const [dashboardStats, setDashboardStats] = React.useState({
    revenue: 0,
    clients: 0,
    leads: 0,
    projects: 0
  })
  const [isLoading, setIsLoading] = React.useState(true)

  // New Lead state fields
  const [newLeadName, setNewLeadName] = React.useState("")
  const [newLeadCompany, setNewLeadCompany] = React.useState("")
  const [newLeadValue, setNewLeadValue] = React.useState("")

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard")
        const data = await res.json()
        if (data.success) {
          setDashboardStats({
            revenue: data.stats.revenue,
            clients: data.stats.clients,
            leads: data.stats.leads,
            projects: data.stats.projects
          })
          setTasks(data.stats.tasks || [])
          setRecentLeads(data.stats.recentLeads || [])
          setRecentClients(data.stats.recentClients || [])
          setActivities(data.stats.activities || [])
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    const task = tasks.find(t => t.id === id)
    if (task) {
      toast({
        title: task.completed ? "Task reopened" : "Task completed!",
        description: `"${task.title}" has been updated.`,
        type: task.completed ? "info" : "success",
      })
    }
  }

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadName || !newLeadCompany) {
      toast({
        title: "Error creating lead",
        description: "Please fill in all required name and company fields.",
        type: "error",
      })
      return
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLeadName,
          company: newLeadCompany,
          budget: newLeadValue ? `₹${newLeadValue}` : undefined,
          email: "pending@example.com", // Admin added lead default or optional
          message: "Lead added via Admin Dashboard",
        })
      });

      if (!res.ok) throw new Error("Failed to create lead");
      const data = await res.json();
      
      const newLead = {
        id: data.id,
        name: data.name,
        company: data.company || "N/A",
        value: data.budget || "₹0",
        status: data.status.toLowerCase(),
        time: "Just now",
      }

      setRecentLeads([newLead, ...recentLeads])
      
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        user: newLeadName,
        avatar: newLeadName.split(" ").map(w => w[0]).join("").toUpperCase(),
        action: "was added as a new lead under",
        target: newLeadCompany,
        time: "Just now",
        type: "lead",
      }
      setActivities([newAct, ...activities])

      toast({
        title: "Lead added successfully",
        description: `${newLeadName} from ${newLeadCompany} is now in your pipeline.`,
        type: "success",
      })

      setNewLeadName("")
      setNewLeadCompany("")
      setNewLeadValue("")
      setIsLeadModalOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not save lead to database.",
        type: "error",
      })
    }
  }

  const activeTasksCount = tasks.filter(t => !t.completed).length

  return (
    <div className={isDarkMode ? "dark" : ""}>
      {/* Outer wrapper enabling local dark-mode support */}
      <div className="bg-background text-foreground transition-colors duration-500 rounded-3xl p-4 sm:p-6 md:p-8 border border-border/80 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.015] pointer-events-none" />

        {/* Dashboard Welcome Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/60 mb-8 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <StatusChip status="active" showPulse={true}>
                BuzzSpire Media Operations Live
              </StatusChip>
              <Badge variant="glow">v1.2 Premium</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-heading mt-2">
              Good afternoon, Jane.
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Here is an overview of BuzzSpire Media leads, project progress, and financial progression.
            </p>
          </div>

          {/* Quick theme toggles and actions */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            {/* Dark Mode toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsDarkMode(!isDarkMode)
                toast({
                  title: `Switched to ${!isDarkMode ? "Dark" : "Light"} mode`,
                  description: "Showing premium custom colorway preview.",
                  type: "info",
                })
              }}
              className="rounded-xl cursor-pointer"
              title="Toggle preview theme"
            >
              {isDarkMode ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-indigo-500" />}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsConfigDrawerOpen(true)}
              icon={<Settings className="size-4" />}
              className="cursor-pointer"
            >
              Configure Dashboard
            </Button>
            
            <Button
              variant="premium"
              onClick={() => setIsLeadModalOpen(true)}
              icon={<Plus className="size-4" />}
              className="cursor-pointer font-bold shadow-md"
            >
              Add New Lead
            </Button>
          </div>
        </div>

        {/* Statistics Cards Section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${dashboardStats.revenue.toLocaleString("en-IN")}`}
            icon={<IndianRupee className="size-4 text-emerald-500" />}
            trend={{ value: 18.2, direction: "up", label: "vs last month" }}
            sparklineData={[30, 42, 38, 55, 68, 65, 80]}
          />
          <StatCard
            title="Lead Conversion Rate"
            value={`${dashboardStats.leads}`}
            icon={<UserPlus className="size-4 text-primary" />}
            trend={{ value: 4.3, direction: "up", label: "vs last week" }}
            sparklineData={[48, 52, 50, 58, 60, 68, 70]}
          />
          <StatCard
            title="Active Projects"
            value={`${dashboardStats.projects}`}
            icon={<Briefcase className="size-4 text-secondary" />}
            trend={{ value: 8.5, direction: "down", label: "vs yesterday" }}
            sparklineData={[60, 58, 55, 45, 48, 42, 38]}
          />
          <StatCard
            title="Active Clients"
            value={`${dashboardStats.clients}`}
            icon={<Users className="size-4 text-indigo-500" />}
            trend={{ value: 12.4, direction: "up", label: "vs last month" }}
            sparklineData={[20, 24, 28, 30, 32, 35, 38]}
          />
        </div>

        {/* Responsive Grid Layout Main Sections */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          {/* Revenue Card (Left/Center) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
                <div className="space-y-1">
                  <CardTitle>Revenue Progression</CardTitle>
                  <CardDescription>Monthly insights showing combined income structures.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Tabs
                    id="revenue-chart-tabs"
                    tabs={[
                      { id: "revenue-area", label: "Area Visual" },
                      { id: "revenue-bar", label: "Monthly Bars" },
                    ]}
                    activeTab={chartTab}
                    onChange={setChartTab}
                    variant="capsule"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartsPlaceholder type={chartTab === "revenue-area" ? "area" : "bar"} height={250} />
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>Updated 10 minutes ago</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                  <TrendingUp className="size-3.5" />
                  <span>On track for Q3 targets</span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Quick Actions & Performance (Right Side) */}
          <div className="space-y-8">
            {/* Quick Actions Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Admin Controls</CardTitle>
                <CardDescription>Instant actions for business operations.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Notification System Online",
                      description: "Testing design system toast alert panels.",
                      type: "info",
                    })
                  }}
                  className="flex flex-col h-20 items-center justify-center gap-2 cursor-pointer rounded-xl hover:bg-muted"
                >
                  <Activity className="size-4 text-primary" />
                  <span className="text-xs">Test Alert</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsLeadModalOpen(true)}
                  className="flex flex-col h-20 items-center justify-center gap-2 cursor-pointer rounded-xl hover:bg-muted"
                >
                  <UserPlus className="size-4 text-emerald-500" />
                  <span className="text-xs">Add Lead</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsConfigDrawerOpen(true)}
                  className="flex flex-col h-20 items-center justify-center gap-2 cursor-pointer rounded-xl hover:bg-muted"
                >
                  <Settings className="size-4 text-secondary" />
                  <span className="text-xs">Settings</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Database Synced",
                      description: "All client files are updated locally.",
                      type: "success",
                    })
                  }}
                  className="flex flex-col h-20 items-center justify-center gap-2 cursor-pointer rounded-xl hover:bg-muted"
                >
                  <ShieldCheck className="size-4 text-indigo-500" />
                  <span className="text-xs">Sync DB</span>
                </Button>
              </CardContent>
            </Card>

            {/* Performance KPIs Card */}
            <Card variant="glow" glowColor="rgba(37, 99, 235, 0.15)">
              <CardHeader>
                <CardTitle>Team Performance KPIs</CardTitle>
                <CardDescription>Average response and contract scores.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/40">
                  <span className="text-muted-foreground font-semibold">Average Response Time</span>
                  <span className="font-extrabold text-foreground flex items-center gap-1 text-emerald-500">
                    12.4 mins <ArrowUpRight className="size-3" />
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/40">
                  <span className="text-muted-foreground font-semibold">Average Contract Value</span>
                  <span className="font-extrabold text-foreground flex items-center gap-1 text-emerald-500">
                    ₹3.4L <ArrowUpRight className="size-3" />
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Customer Satisfaction</span>
                  <span className="font-extrabold text-foreground flex items-center gap-1 text-emerald-500">
                    98.6% <Star className="size-3 fill-emerald-500 text-emerald-500" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 2: Recent Activity, Leads, and Projects */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Leads Summary (Left Card) */}
          <div className="space-y-4 lg:col-span-2">
            <SectionHeader
              title="Recent Lead Submissions"
              description="Pipeline of potential business accounts in contact stages."
              actions={
                <Button variant="outline" size="sm" onClick={() => setIsLeadModalOpen(true)} className="cursor-pointer">
                  Add Lead
                </Button>
              }
            />
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Est. Budget</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-semibold text-foreground">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                    <TableCell className="font-semibold text-foreground">{lead.value}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.status === "new"
                            ? "default"
                            : lead.status === "contacted"
                            ? "warning"
                            : lead.status === "proposal"
                            ? "secondary"
                            : "success"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-semibold">
                      {lead.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Interactive Upcoming Tasks Checklist (Right Card) */}
          <div className="space-y-4">
            <SectionHeader
              title="Upcoming Operational Tasks"
              description={`${activeTasksCount} tasks remaining today.`}
            />

            <Card>
              <CardContent className="pt-6 space-y-3.5">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-3 text-left w-full group/task cursor-pointer pb-2.5 border-b border-border/20 last:border-0 last:pb-0"
                  >
                    <div className="shrink-0 mt-0.5 text-muted-foreground group-hover/task:text-primary transition-colors">
                      {task.completed ? (
                        <CheckCircle2 className="size-4 text-primary fill-primary/10" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold text-foreground transition-all truncate ${task.completed ? "line-through text-muted-foreground/60" : ""}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-muted-foreground/80 font-bold">{task.dueDate}</span>
                        <span className="size-1 bg-muted-foreground/30 rounded-full" />
                        <span className={`text-[8px] font-extrabold uppercase px-1 rounded ${
                          task.priority === "high"
                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                            : task.priority === "medium"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 3: Clients, Projects Summary & Audit Activity Log */}
        <div className="grid gap-8 lg:grid-cols-3 mt-8 pt-8 border-t border-border/40">
          {/* Recent Clients Summary & Retainers */}
          <div className="space-y-4">
            <SectionHeader
              title="Recent Retained Clients"
              description="A view of active client subscriptions and income stats."
            />
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between pb-3.5 border-b border-border/20 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-bold text-xs text-primary">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{client.name}</p>
                        <p className="text-[10px] text-muted-foreground">{client.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{client.revenue}</p>
                      <p className="text-[9px] text-muted-foreground/75 font-semibold">Joined {client.joined}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Project Progress Cards Summary */}
          <div className="space-y-4">
            <SectionHeader
              title="Active Project Progression"
              description="Reviewing timelines and budget goals."
            />
            
            <Card>
              <CardContent className="pt-6 space-y-5">
                {[
                  { name: "BuzzSpire Rebranding", progress: 85, color: "bg-primary", status: "In Review" },
                  { name: "Aria Mercer Webapp Build", progress: 40, color: "bg-secondary", status: "Development" },
                ].map((proj, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground">{proj.name}</span>
                      <span className="text-[10px] text-muted-foreground/80 font-bold bg-muted px-1.5 py-0.5 rounded">{proj.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${proj.color} rounded-full`} style={{ width: `${proj.progress}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                      <span>{proj.progress}% completed</span>
                      <span>Target: July 15</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Operations Activity Timelines (Right Card) */}
          <div className="space-y-4">
            <SectionHeader
              title="Audit Logs & Activity"
              description="System tracking feed for BuzzSpire channels."
            />
            
            <Card>
              <CardContent className="pt-6 space-y-4 relative">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-3 text-xs pb-3.5 border-b border-border/20 last:border-0 last:pb-0">
                    <div className="size-6 bg-muted border border-border/40 rounded-full flex items-center justify-center font-bold font-sans text-[10px] text-muted-foreground shrink-0 mt-0.5">
                      {act.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        <span className="font-bold text-foreground">{act.user}</span> {act.action}{" "}
                        <span className="font-bold text-foreground">{act.target}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 font-semibold mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* DIALOG PORTAL: ADD LEAD MODAL */}
      <Dialog
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        title="Add New Business Lead"
        description="Add manual lead details to pipeline registry trackers."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLeadModalOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleCreateLead} className="cursor-pointer shadow-sm">
              Register Lead
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
            <input
              type="text"
              required
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              placeholder="e.g. John Miller"
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Company Name *</label>
            <input
              type="text"
              required
              value={newLeadCompany}
              onChange={(e) => setNewLeadCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Estimated Budget (INR)</label>
            <input
              type="number"
              value={newLeadValue}
              onChange={(e) => setNewLeadValue(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>
        </form>
      </Dialog>

      {/* DRAWER PORTAL: CONFIGURATION DRAWER */}
      <Drawer
        isOpen={isConfigDrawerOpen}
        onClose={() => setIsConfigDrawerOpen(false)}
        title="Operations Control Board"
        description="Configure admin interface panels and operational preferences."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsConfigDrawerOpen(false)} className="cursor-pointer">
              Reset Layout
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setIsConfigDrawerOpen(false)
                toast({
                  title: "Settings Saved",
                  description: "Admin config preferences updated successfully.",
                  type: "success",
                })
              }}
              className="cursor-pointer"
            >
              Apply Config
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold text-foreground font-heading uppercase tracking-wide">Widget Selection</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="size-4 border border-input rounded cursor-pointer accent-primary" />
                <span>Show Monthly Revenue progression charts</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="size-4 border border-input rounded cursor-pointer accent-primary" />
                <span>Show Recent Lead submissions table</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="size-4 border border-input rounded cursor-pointer accent-primary" />
                <span>Show Audit Logs operations feeds</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-foreground font-heading uppercase tracking-wide">Interface Mode</p>
            <div className="flex gap-2">
              <Button
                variant={!isDarkMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsDarkMode(false)}
                className="flex-1 cursor-pointer"
              >
                Light
              </Button>
              <Button
                variant={isDarkMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsDarkMode(true)}
                className="flex-1 cursor-pointer"
              >
                Dark
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  )
}
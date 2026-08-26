"use client"

import * as React from "react"
import {
  Sparkles,
  Briefcase,
  FileText,
  HelpCircle,
  MessageSquare,
  User,
  Settings as SettingsIcon,
  Clock,
  ArrowRight,
  Download,
  AlertCircle,
  Plus,
  Send,
  Calendar,
  ShieldAlert,
  Loader2,
  TrendingUp,
  DollarSign,
  CheckCircle,
  FileText as FileTextIcon,
  CreditCard
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { Avatar } from "@/components/ui/avatar"
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
import { ToastProvider, useToast } from "@/components/ui/toast"
import { Tabs } from "@/components/ui/tabs"

interface ProjectCampaign {
  id: string
  title: string
  description: string | null
  status: string
  progress: number
  progressStages: any
  createdAt: string
  showTimeline: boolean
  showFiles: boolean
  showInvoices: boolean
  showPayments: boolean
  showProgress: boolean
  showMessages: boolean
  showTickets: boolean
  showDownloads: boolean
  showDeliverables: boolean
}

interface ProjectDetails extends ProjectCampaign {
  updates: Array<{ id: string; title: string; description: string; createdAt: string }>
  files: Array<{ id: string; name: string; url: string; size: number; category: string; createdAt: string }>
  messages: Array<{ id: string; senderId: string; recipientId: string; text: string; createdAt: string }>
}

interface SupportTicket {
  id: string
  subject: string
  description: string
  status: string
  createdAt: string
  replies: Array<{ id: string; senderId: string; text: string; createdAt: string }>
}

function ClientDashboardContent() {
  const { toast } = useToast()

  // Selected Dashboard Tab state
  const [activeTab, setActiveTab] = React.useState("overview")

  // Client Session States
  const [clientUser, setClientUser] = React.useState<any>(null)
  const [projects, setProjects] = React.useState<ProjectCampaign[]>([])
  const [tickets, setTickets] = React.useState<SupportTicket[]>([])
  const [loading, setLoading] = React.useState(true)

  // Selected Project Workspace
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
  const [projectDetails, setProjectDetails] = React.useState<ProjectDetails | null>(null)
  const [loadingProject, setLoadingProject] = React.useState(false)

  // New Dashboard States
  const [dashboardData, setDashboardData] = React.useState<any>(null);

  // Direct chat input
  const [chatText, setChatText] = React.useState("")
  const [sendingMessage, setSendingMessage] = React.useState(false)

  // Selected Ticket Workspace
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null)
  const [ticketReplyText, setTicketReplyText] = React.useState("")
  const [sendingTicketReply, setSendingTicketReply] = React.useState(false)
  const [loadingTicketDetails, setLoadingTicketDetails] = React.useState(false)

  // Modals dialog triggers
  const [isTicketOpen, setIsTicketOpen] = React.useState(false)

  // Form Fields
  const [newTicketSubject, setNewTicketSubject] = React.useState("")
  const [newTicketDesc, setNewTicketDesc] = React.useState("")

  // Fetch initial profile & data on mount
  React.useEffect(() => {
    const initDashboard = async () => {
      try {
        // 1. Fetch current user session
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          throw new Error("Failed to fetch session");
        }
        const meData = await meRes.json();
        setClientUser(meData.user);

        // 2. Fetch projects
        const projRes = await fetch("/api/client/projects");
        const projData = await projRes.json();
        setProjects(projData.projects || []);

        if (projData.projects && projData.projects.length > 0) {
          setSelectedProjectId(projData.projects[0].id);
        }

        // 3. Fetch tickets
        const ticketRes = await fetch("/api/client/tickets");
        const ticketData = await ticketRes.json();
        setTickets(ticketData.tickets || []);

        // 4. Fetch unified dashboard data
        const dashRes = await fetch("/api/client/dashboard");
        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setDashboardData(dashData);
        }
      } catch (err) {
        console.error("Dashboard initialization failed:", err);
        toast({
          title: "Connection Error",
          description: "Could not load portal data details.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [toast]);

  // Fetch detailed project workspace when selected project changes
  React.useEffect(() => {
    if (!selectedProjectId) {
      setProjectDetails(null);
      return;
    }

    const loadProjectDetails = async () => {
      setLoadingProject(true);
      try {
        const res = await fetch(`/api/client/projects/${selectedProjectId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch project details");
        }
        const data = await res.json();
        setProjectDetails(data.project);
      } catch (err) {
        console.error(err);
        toast({
          title: "Access Denied",
          description: "Cannot retrieve project logs.",
          type: "error",
        });
      } finally {
        setLoadingProject(false);
      }
    };

    loadProjectDetails();
  }, [selectedProjectId, toast]);

  // Fetch ticket details when selected ticket changes
  React.useEffect(() => {
    if (!selectedTicketId) {
      setSelectedTicket(null);
      return;
    }

    const loadTicketDetails = async () => {
      setLoadingTicketDetails(true);
      try {
        const res = await fetch(`/api/client/tickets/${selectedTicketId}`);
        if (!res.ok) {
          throw new Error("Failed to load ticket details");
        }
        const data = await res.json();
        setSelectedTicket(data.ticket);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Unable to load support replies.",
          type: "error",
        });
      } finally {
        setLoadingTicketDetails(false);
      }
    };

    loadTicketDetails();
  }, [selectedTicketId, toast]);

  // Send Direct Chat Message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !chatText.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/client/projects/${selectedProjectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chatText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Prepend or append to local list of messages
      if (projectDetails) {
        setProjectDetails({
          ...projectDetails,
          messages: [...projectDetails.messages, data.message],
        });
      }
      setChatText("");
    } catch (err: any) {
      toast({
        title: "Failed to send message",
        description: err.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Submit Support Ticket Reply
  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !ticketReplyText.trim() || sendingTicketReply) return;

    setSendingTicketReply(true);
    try {
      const res = await fetch(`/api/client/tickets/${selectedTicketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ticketReplyText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit reply");
      }

      // Update active ticket log
      if (selectedTicket) {
        setSelectedTicket({
          ...selectedTicket,
          replies: [...selectedTicket.replies, data.reply],
        });
      }
      setTicketReplyText("");
      toast({
        title: "Reply Posted",
        description: "Your reply has been registered.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send reply.",
        type: "error",
      });
    } finally {
      setSendingTicketReply(false);
    }
  };

  // Create Support Ticket
  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketDesc) {
      toast({
        title: "Required fields missing",
        description: "Please specify subject and description.",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch("/api/client/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: newTicketSubject, description: newTicketDesc }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log ticket");
      }

      setTickets([data.ticket, ...tickets]);
      setIsTicketOpen(false);
      setNewTicketSubject("");
      setNewTicketDesc("");

      toast({
        title: "Ticket Logged",
        description: "Support ticket registered successfully.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Failed to open ticket",
        description: err.message || "Database connection error.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-semibold">Synchronizing client workspace...</p>
      </div>
    );
  }

  const dashboardTabs = [
    { id: "overview", label: "Overview Panel", icon: <Sparkles className="size-4" /> },
    { id: "projects", label: "Campaign Projects", icon: <Briefcase className="size-4" /> },
    { id: "support", label: "Support Tickets", icon: <HelpCircle className="size-4" /> },
    { id: "files", label: "Assets & Messages", icon: <MessageSquare className="size-4" /> },
    { id: "settings", label: "Profile Settings", icon: <SettingsIcon className="size-4" /> },
  ]

  // Filtered visibility options based on active project
  const showTimeline = projectDetails ? projectDetails.showTimeline : true
  const showFiles = projectDetails ? projectDetails.showFiles : true
  const showProgress = projectDetails ? projectDetails.showProgress : true
  const showMessages = projectDetails ? projectDetails.showMessages : true

  return (
    <div className="space-y-8 select-none">
      <Breadcrumb
        items={[
          { label: "Client Area", href: "/client" },
          { label: "Dashboard Hub" },
        ]}
      />

      <PageHeader
        title={`Welcome Back, ${clientUser?.name || "Client"} 👋`}
        description={`Securely manage projects at ${clientUser?.company || "BuzzSpire Affiliate Office"}.`}
        actions={
          <div className="flex gap-2">
            {/* Project selection selector if client has multiple projects */}
            {projects.length > 0 && (
              <select
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs bg-card border border-border rounded-xl px-3.5 py-2 outline-none focus:border-primary/50 text-foreground font-semibold"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    Project: {p.title}
                  </option>
                ))}
              </select>
            )}
            <Button
              variant="premium"
              onClick={() => setIsTicketOpen(true)}
              icon={<Plus className="size-4" />}
              className="cursor-pointer font-bold shadow-md"
            >
              Open Support Ticket
            </Button>
          </div>
        }
      />

      {/* Tabs navigation panel */}
      <Tabs
        id="client-dashboard-panel"
        tabs={dashboardTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="capsule"
      />

      {/* TAB CONTENT PANELS RENDER */}
      <div className="pt-2 animate-in fade-in duration-200">
        
        {/* PANEL: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* FINANCIAL OVERVIEW */}
            {dashboardData && dashboardData.financials && (
              <>
                <SectionHeader title="Financial Overview" description="Your contract and billing status." />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Budget</p>
                          <p className="text-2xl font-extrabold text-foreground">₹{(dashboardData.financials.totalBudget || 0).toLocaleString()}</p>
                        </div>
                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          <Briefcase className="size-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Paid</p>
                          <p className="text-2xl font-extrabold text-emerald-500">₹{(dashboardData.financials.totalPaid || 0).toLocaleString()}</p>
                        </div>
                        <div className="size-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                          <TrendingUp className="size-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Used</p>
                          <p className="text-2xl font-extrabold text-destructive">₹{(dashboardData.financials.totalUsed || 0).toLocaleString()}</p>
                        </div>
                        <div className="size-8 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive">
                          <DollarSign className="size-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Remaining Balance</p>
                          <p className="text-2xl font-extrabold text-foreground">₹{(dashboardData.financials.remainingBalance || 0).toLocaleString()}</p>
                        </div>
                        <div className="size-8 bg-muted rounded-lg flex items-center justify-center text-foreground">
                          <CreditCard className="size-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Bar for Paid vs Used */}
                <Card>
                  <CardContent className="py-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground tracking-wider">
                        <span>Utilization Progress</span>
                        <span>
                          {dashboardData.financials.totalPaid > 0
                            ? Math.round((dashboardData.financials.totalUsed / dashboardData.financials.totalPaid) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${dashboardData.financials.totalPaid > 0
                              ? Math.min(100, (dashboardData.financials.totalUsed / dashboardData.financials.totalPaid) * 100)
                              : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
              {/* WHERE YOUR MONEY IS BEING USED */}
              <div className="space-y-4">
                <SectionHeader title="Usage Breakdown" description="Where your money is being used." />
                <Card className="max-h-80 overflow-y-auto">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2">Description</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2">Category</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2">Date</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2 text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!(dashboardData?.usages?.length > 0) ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-xs text-muted-foreground">
                              No usage records available.
                            </TableCell>
                          </TableRow>
                        ) : (
                          dashboardData.usages.map((u: any) => (
                            <TableRow key={u.id}>
                              <TableCell className="text-xs font-medium">{u.description}</TableCell>
                              <TableCell className="text-[10px] text-muted-foreground">{u.category}</TableCell>
                              <TableCell className="text-[10px] text-muted-foreground">{new Date(u.date).toLocaleDateString()}</TableCell>
                              <TableCell className="text-xs font-bold text-destructive text-right">₹{u.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* PAYMENT HISTORY */}
              <div className="space-y-4">
                <SectionHeader title="Payment History" description="Your deposits and payments." />
                <Card className="max-h-80 overflow-y-auto">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2">Description</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2">Method</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2">Date</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider py-2 text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!(dashboardData?.payments?.length > 0) ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-xs text-muted-foreground">
                              No payment records available.
                            </TableCell>
                          </TableRow>
                        ) : (
                          dashboardData.payments.map((p: any) => (
                            <TableRow key={p.id}>
                              <TableCell className="text-xs font-medium">{p.description}</TableCell>
                              <TableCell className="text-[10px] text-muted-foreground">{p.method || "-"}</TableCell>
                              <TableCell className="text-[10px] text-muted-foreground">{new Date(p.date).toLocaleDateString()}</TableCell>
                              <TableCell className="text-xs font-bold text-emerald-500 text-right">₹{p.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* LATEST UPDATES */}
              <div className="space-y-4">
                <SectionHeader title="Admin Updates" description="Latest updates and news for you." />
                <div className="space-y-3">
                  {!(dashboardData?.updates?.length > 0) ? (
                    <Card>
                      <CardContent className="py-10 text-center text-muted-foreground text-xs font-semibold">
                        No recent updates available.
                      </CardContent>
                    </Card>
                  ) : (
                    dashboardData.updates.map((update: any) => (
                      <Card key={update.id}>
                        <CardContent className="p-4 flex gap-3">
                          <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Clock className="size-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{update.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{update.message}</p>
                            <div className="flex gap-2 mt-2 items-center">
                              <span className="text-[10px] text-muted-foreground/60">{new Date(update.createdAt).toLocaleDateString()}</span>
                              <span className="text-[10px] text-primary/80 font-semibold">• Posted by {update.author}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* PROJECT PROGRESS & MILESTONES */}
              <div className="space-y-4">
                <SectionHeader title="Project Milestones" description="Current progress on your active projects." />
                <div className="space-y-4">
                  {!(dashboardData?.projects?.length > 0) ? (
                    <Card>
                      <CardContent className="py-10 text-center text-muted-foreground text-xs font-semibold">
                        No active projects to track.
                      </CardContent>
                    </Card>
                  ) : (
                    dashboardData.projects.map((proj: any) => (
                      <Card key={proj.id} className="overflow-hidden border border-primary/20">
                        <div className="p-4 bg-muted/20 border-b border-border/50 flex justify-between items-center">
                          <p className="text-xs font-bold text-foreground">{proj.title}</p>
                          <StatusChip status="active">{proj.status}</StatusChip>
                        </div>
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-1.5 font-semibold">
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                              <span>Overall Completion</span>
                              <span>{proj.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${proj.progress}%` }} />
                            </div>
                          </div>
                          
                          {proj.milestones && proj.milestones.length > 0 && (
                            <div className="space-y-2 mt-4 pt-4 border-t border-border/30">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Milestones</p>
                              {proj.milestones.map((m: any) => (
                                <div key={m.id} className="flex justify-between items-center p-2 rounded-lg border bg-card">
                                  <div className="flex items-center gap-2">
                                    {m.status === "COMPLETED" ? (
                                      <CheckCircle className="size-3.5 text-emerald-500" />
                                    ) : m.status === "IN_PROGRESS" ? (
                                      <Loader2 className="size-3.5 text-primary animate-spin" />
                                    ) : (
                                      <Clock className="size-3.5 text-muted-foreground" />
                                    )}
                                    <div>
                                      <p className="text-xs font-bold">{m.title}</p>
                                      {m.description && <p className="text-[9px] text-muted-foreground">{m.description}</p>}
                                    </div>
                                  </div>
                                  <Badge variant={m.status === "COMPLETED" ? "default" : "secondary"} className="text-[9px]">
                                    {m.status.replace("_", " ")}
                                    {m.status === "IN_PROGRESS" && ` ${m.progress}%`}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-card border border-border/60 rounded-2xl">
                No active projects assigned to your account.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((proj) => {
                  const isCurrent = selectedProjectId === proj.id;
                  const stages = proj.progressStages ? (proj.progressStages as Record<string, string>) : null;

                  return (
                    <Card
                      key={proj.id}
                      className={`flex flex-col h-full hover:-translate-y-0.5 duration-300 cursor-pointer ${
                        isCurrent ? "border-primary/50 shadow-md" : ""
                      }`}
                      onClick={() => setSelectedProjectId(proj.id)}
                    >
                      <CardHeader className="flex flex-row justify-between items-start border-b border-border/20 pb-4">
                        <div className="space-y-1">
                          <CardTitle className="text-base font-extrabold text-foreground">{proj.title}</CardTitle>
                          <CardDescription className="text-xs">
                            Created: {new Date(proj.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <StatusChip status="active">{proj.status}</StatusChip>
                      </CardHeader>

                      <CardContent className="pt-5 flex-1 space-y-4 text-xs">
                        {/* Overall Progress */}
                        {proj.showProgress && (
                          <div className="space-y-1.5 font-semibold">
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                              <span>Overall Progress</span>
                              <span>{proj.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${proj.progress}%` }} />
                            </div>
                          </div>
                        )}

                        {/* Progress Stages list */}
                        {stages && Object.keys(stages).length > 0 && (
                          <div className="space-y-2 mt-4">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Milestone Milestones</p>
                            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                              {Object.entries(stages).map(([stage, status]) => (
                                <div key={stage} className="flex justify-between p-2 bg-muted/30 border border-border/40 rounded-lg">
                                  <span className="text-muted-foreground">{stage}</span>
                                  <span className="text-foreground">{status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PANEL: SUPPORT */}
        {activeTab === "support" && (
          <div className="grid gap-8 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Left side: tickets index */}
            <div className="md:col-span-1 space-y-4">
              <SectionHeader title="Support Tickets" description="Open support queries." />
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {tickets.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground bg-card border border-border/40 rounded-2xl">
                    No tickets open yet.
                  </div>
                ) : (
                  tickets.map((t) => {
                    const isActive = selectedTicketId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`flex flex-col gap-1.5 p-3.5 w-full text-left rounded-xl transition-all duration-300 border cursor-pointer ${
                          isActive ? "bg-primary/10 border-primary/20" : "bg-card border-border hover:bg-muted/70"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-primary">{t.id}</span>
                          <StatusChip status={t.status === "OPEN" ? "active" : "inactive"}>
                            {t.status}
                          </StatusChip>
                        </div>
                        <p className="text-xs font-bold text-foreground leading-tight line-clamp-1">{t.subject}</p>
                        <p className="text-[10px] text-muted-foreground leading-none">
                          Logged: {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right side: ticket conversation thread */}
            <div className="md:col-span-2 flex flex-col h-[550px] border border-border/60 bg-card rounded-2xl overflow-hidden shadow-sm">
              {selectedTicketId ? (
                loadingTicketDetails ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : selectedTicket ? (
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border/40 bg-muted/20">
                      <h4 className="text-xs font-bold text-foreground leading-none">{selectedTicket.subject}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1.5">Original message: {selectedTicket.description}</p>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin bg-muted/5">
                      {selectedTicket.replies.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground font-semibold">
                          No replies posted yet. Agent will respond shortly.
                        </div>
                      ) : (
                        selectedTicket.replies.map((reply) => {
                          const isMe = reply.senderId === clientUser?.id;
                          return (
                            <div
                              key={reply.id}
                              className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                                isMe
                                  ? "bg-primary text-white ml-auto rounded-tr-none"
                                  : "bg-muted border border-border/20 text-foreground mr-auto rounded-tl-none"
                              }`}
                            >
                              <div className="flex justify-between items-center text-[9px] font-bold opacity-80 mb-1 gap-6">
                                <span>{isMe ? "Me" : "Support Agent"}</span>
                                <span>{new Date(reply.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p>{reply.text}</p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form onSubmit={handleSendTicketReply} className="p-4 border-t border-border/40 bg-muted/10 flex gap-2">
                      <input
                        type="text"
                        required
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        placeholder="Type reply message..."
                        className="flex-1 text-xs bg-muted/40 border border-border rounded-xl px-4 py-2 outline-none focus:border-primary/50 text-foreground"
                      />
                      <Button
                        type="submit"
                        disabled={sendingTicketReply || !ticketReplyText.trim()}
                        size="sm"
                        className="cursor-pointer font-bold shadow-md rounded-xl"
                      >
                        {sendingTicketReply ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                      </Button>
                    </form>
                  </div>
                ) : null
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                  <HelpCircle className="size-10 mb-2.5 opacity-60" />
                  <p className="text-xs font-semibold">Select a support ticket from list index.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL: FILES & MESSAGES */}
        {activeTab === "files" && (
          <div className="grid gap-8 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Left side: Allowed deliverables */}
            <div className="space-y-4">
              <SectionHeader title="Deliverables & Shared Documents" description="Shared assets authorized by administration." />
              
              {!showFiles ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground text-xs font-semibold">
                    File sharing is disabled for this project.
                  </CardContent>
                </Card>
              ) : loadingProject ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              ) : !projectDetails || projectDetails.files.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground text-xs font-semibold">
                    No files shared yet.
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {projectDetails.files.map((file) => (
                      <div key={file.id} className="flex justify-between items-center text-xs pb-3 border-b border-border/20 last:border-0 last:pb-0 font-medium">
                        <div>
                          <p className="font-bold text-foreground">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Category: {file.category} | Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => {
                            toast({
                              title: "Download Initiated",
                              description: `Downloading ${file.name}...`,
                              type: "info",
                            });
                          }}
                          className="cursor-pointer rounded-lg"
                        >
                          <Download className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right side: Messaging Panel */}
            <div className="space-y-4 flex flex-col h-[550px] border border-border/60 bg-card rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/40 bg-muted/20">
                <h4 className="text-xs font-bold text-foreground leading-none">Admin Messaging Channel</h4>
                <p className="text-[10px] text-muted-foreground mt-1">BuzzSpire Project Coordinator Desk</p>
              </div>

              {!showMessages ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 border-dashed">
                  <MessageSquare className="size-10 mb-2.5 opacity-60" />
                  <p className="text-xs font-semibold text-center leading-relaxed">
                    Direct messaging is currently disabled for this project.<br />
                    Please submit support tickets for communications.
                  </p>
                </div>
              ) : loadingProject ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : !projectDetails ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs font-semibold">
                  No active project selected.
                </div>
              ) : (
                <div className="flex flex-col h-full flex-1">
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin bg-muted/5">
                    {projectDetails.messages.length === 0 ? (
                      <div className="text-center py-10 text-xs text-muted-foreground font-semibold">
                        No messages in chat log thread. Start conversation below!
                      </div>
                    ) : (
                      projectDetails.messages.map((m) => {
                        const isMe = m.senderId === clientUser?.id;
                        return (
                          <div
                            key={m.id}
                            className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                              isMe
                                ? "bg-primary text-white ml-auto rounded-tr-none"
                                : "bg-muted border border-border/20 text-foreground mr-auto rounded-tl-none"
                            }`}
                          >
                            <div className="flex justify-between items-center text-[9px] font-bold opacity-80 mb-1 gap-6">
                              <span>{isMe ? "Me" : "Manager Desk"}</span>
                              <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p>{m.text}</p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="p-4 border-t border-border/40 bg-muted/10 flex gap-2">
                    <input
                      type="text"
                      required
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      placeholder="Type direct message text..."
                      className="flex-1 text-xs bg-muted/40 border border-border rounded-xl px-4 py-2 outline-none focus:border-primary/50 text-foreground"
                    />
                    <Button
                      type="submit"
                      disabled={sendingMessage || !chatText.trim()}
                      size="sm"
                      className="cursor-pointer font-bold shadow-md rounded-xl"
                    >
                      {sendingMessage ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Profile Particulars</CardTitle>
                <CardDescription>Review your client account profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1 font-semibold text-xs text-foreground">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Full Name</label>
                    <div className="p-3 bg-muted/40 border border-border rounded-lg text-foreground/90 font-bold">
                      {clientUser?.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Email Address</label>
                    <div className="p-3 bg-muted/40 border border-border rounded-lg text-foreground/90 font-bold">
                      {clientUser?.email}
                    </div>
                  </div>
                </div>
                {clientUser?.company && (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Affiliated Company</label>
                    <div className="p-3 bg-muted/40 border border-border rounded-lg text-foreground/90 font-bold">
                      {clientUser?.company}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* DIALOG PORTAL: CREATE SUPPORT TICKET */}
      <Dialog
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        title="Open Support Ticket"
        description="Explain problems or requests to creative coordinators."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsTicketOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="default" onClick={handleCreateTicketSubmit} className="cursor-pointer shadow-sm">
              Submit Ticket
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Subject Title *</label>
            <input
              type="text"
              required
              value={newTicketSubject}
              onChange={(e) => setNewTicketSubject(e.target.value)}
              placeholder="e.g. Discrepancy in invoice design charges"
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Detailed Description *</label>
            <textarea
              required
              value={newTicketDesc}
              onChange={(e) => setNewTicketDesc(e.target.value)}
              placeholder="Please provide details of your issue..."
              rows={4}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2.5 outline-none focus:border-primary/50 text-foreground resize-none"
            />
          </div>
        </form>
      </Dialog>
    </div>
  )
}

export default function ClientDashboardPage() {
  return (
    <ToastProvider>
      <ClientDashboardContent />
    </ToastProvider>
  )
}

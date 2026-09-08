"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusChip } from "@/components/ui/status-chip";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  employeeId?: string;
  role: string;
  status: string;
  permissions: string[];
  department?: string;
  designation?: string;
}

interface LeadItem {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  budget?: string;
  service?: string;
  status: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  isArchived?: boolean;
  createdAt: string;
}

export default function EmployeeDashboardPage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load profile
        const profRes = await fetch("/api/employee/auth/me");
        if (profRes.ok) {
          const pData = await profRes.json();
          setProfile(pData.user);

          // If employee has LEADS_VIEW, fetch assigned leads
          if (pData.user?.role === "ADMIN" || pData.user?.permissions?.includes("LEADS_VIEW")) {
            const leadsRes = await fetch("/api/admin/leads");
            if (leadsRes.ok) {
              const lData = await leadsRes.json();
              if (lData.success && Array.isArray(lData.leads)) {
                setLeads(lData.leads);
              }
            }
          }
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const contactedLeads = leads.filter((l) => l.status === "CONTACTED").length;
  const qualifiedLeads = leads.filter((l) => l.status === "QUALIFIED").length;
  const closedLeads = leads.filter((l) => l.status === "CLOSED").length;
  const highPriorityLeads = leads.filter((l) => l.priority === "HIGH").length;

  const hasLeadsView = profile?.role === "ADMIN" || profile?.permissions?.includes("LEADS_VIEW");

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 rounded-3xl border border-primary/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {profile?.employeeId || "Staff Workspace"}
            </span>
            {profile?.designation && (
              <span className="text-xs font-medium text-muted-foreground">
                • {profile.designation}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
            Welcome back, {profile?.name || "Team Member"} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here is an overview of your assigned tasks, active leads, and workspace permissions.
          </p>
        </div>

        {hasLeadsView && (
          <div>
            <Link href="/employee/leads">
              <Button className="rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold shadow-md flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>View My Leads</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* KPI Cards (Visible if has LEADS_VIEW) */}
      {hasLeadsView && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="rounded-2xl border border-border/80 shadow-sm bg-card hover:border-primary/40 transition-all">
            <CardContent className="p-5 sm:p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Assigned Leads
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                {totalLeads}
              </p>
              <p className="text-xs text-muted-foreground">Active in your queue</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-sm bg-card hover:border-red-500/40 transition-all">
            <CardContent className="p-5 sm:p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  High Priority
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-red-600">
                {highPriorityLeads}
              </p>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-sm bg-card hover:border-blue-500/40 transition-all">
            <CardContent className="p-5 sm:p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  New Unread
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-blue-600">
                {newLeads}
              </p>
              <p className="text-xs text-muted-foreground">Requires immediate outreach</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-sm bg-card hover:border-amber-500/40 transition-all">
            <CardContent className="p-5 sm:p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contacted
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-600">
                {contactedLeads}
              </p>
              <p className="text-xs text-muted-foreground">In active conversation</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-sm bg-card hover:border-emerald-500/40 transition-all">
            <CardContent className="p-5 sm:p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Qualified / Won
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600">
                {qualifiedLeads + closedLeads}
              </p>
              <p className="text-xs text-muted-foreground">High potential / closed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permissions & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Leads or Workspace Status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-bold text-foreground">
              Recent Assigned Leads
            </h2>
            {hasLeadsView && (
              <Link
                href="/employee/leads"
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                View all ({leads.length})
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {!hasLeadsView ? (
            <Card className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
              <p className="font-semibold text-foreground">No Leads Access</p>
              <p className="text-xs text-muted-foreground">
                Your account does not currently have the &apos;View Leads&apos; permission assigned. Contact your manager for access.
              </p>
            </Card>
          ) : leads.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
              <p className="font-semibold text-foreground">No Leads Assigned Yet</p>
              <p className="text-xs text-muted-foreground">
                When new client enquiries are assigned to you by administrators, they will appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-primary/40 transition-all"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-foreground truncate">{lead.name}</p>
                      {lead.priority === "HIGH" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-red-500/10 text-red-600 font-bold uppercase">
                          HIGH
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-md bg-muted font-mono text-muted-foreground">
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {lead.email && <span className="truncate">{lead.email}</span>}
                      {lead.company && <span>• {lead.company}</span>}
                      {lead.budget && <span className="text-emerald-600 font-semibold">• {lead.budget}</span>}
                    </div>
                  </div>

                  <Link href="/employee/leads">
                    <Button variant="outline" size="sm" className="rounded-xl text-xs shrink-0 cursor-pointer">
                      Manage
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Granted Permissions Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-foreground">
            Assigned Permissions
          </h2>
          <Card className="rounded-2xl border border-border/80 shadow-sm p-6 space-y-4 bg-card">
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Role: {profile?.role}</p>
                <p className="text-xs text-muted-foreground">
                  {profile?.permissions?.length || 0} Permissions Active
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile?.role === "ADMIN" ? (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold py-1">
                  Full Administrator Access
                </Badge>
              ) : profile?.permissions && profile.permissions.length > 0 ? (
                profile.permissions.map((perm) => (
                  <Badge
                    key={perm}
                    variant="outline"
                    className="text-[11px] font-mono py-1 px-2.5 bg-muted/30 border-border"
                  >
                    {perm}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No specialized permissions assigned yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

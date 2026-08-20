"use client";

import { useEffect, useState } from "react";
import { Briefcase, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EmployeeProjectsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employee/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasAccess = profile?.role === "ADMIN" || profile?.permissions?.includes("PROJECTS_VIEW");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <Card className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
        <h2 className="text-xl font-heading font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          You do not have permission to view projects (<code>PROJECTS_VIEW</code>). Please contact your administrator.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
          Assigned Projects
        </h1>
        <p className="text-sm text-muted-foreground">
          Track project milestones, timelines, and deliverables for your assigned campaigns.
        </p>
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm p-12 text-center space-y-2 bg-card">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>
        <p className="font-bold text-foreground text-base">Projects Workspace</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          You are authorized with <code>PROJECTS_VIEW</code>. Projects assigned to your team will appear here for milestone updates and deliverable uploads.
        </p>
      </Card>
    </div>
  );
}

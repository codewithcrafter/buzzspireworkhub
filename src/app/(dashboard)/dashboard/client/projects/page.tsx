"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusChip } from "@/components/ui/status-chip";

export default function ClientProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/client/projects");
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to load projects");
        }
        
        setProjects(data.projects || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Your Projects" 
        description="View and track the progress of your active projects." 
      />

      {loading ? (
        <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
          <CardContent className="py-10 text-center text-muted-foreground text-sm font-medium">
            Loading projects...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-red-50/20">
          <CardContent className="py-10 text-center text-red-500 text-sm font-semibold">
            {error}
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
          <CardContent className="py-10 text-center text-muted-foreground text-sm font-semibold">
            No projects assigned yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} className="overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-lg transition-shadow">
              <div className="p-5 bg-muted/20 border-b border-border/50 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{proj.title}</h3>
                  {proj.description && (
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{proj.description}</p>
                  )}
                </div>
                <StatusChip status="active">{proj.status}</StatusChip>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <span>Overall Completion</span>
                    <span>{proj.progress || 0}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500 ease-in-out" 
                      style={{ width: `${proj.progress || 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground pt-2">
                  <div>
                    <span className="font-semibold text-foreground/80">Started: </span>
                    {new Date(proj.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/80">Last Updated: </span>
                    {new Date(proj.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Zap, Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AutomationsPage() {
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const res = await fetch("/api/admin/automations");
                const data = await res.json();
                if (data.success) setWorkflows(data.workflows || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkflows();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
                        <Zap className="w-8 h-8 text-primary" />
                        Marketing Automations
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Build and manage automated workflows and triggers.
                    </p>
                </div>
                <Button className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    New Workflow
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading workflows...</p>
                ) : workflows.length === 0 ? (
                    <div className="col-span-full bg-white border border-border border-dashed rounded-xl p-12 text-center text-muted-foreground">
                        No active workflows found. Create one to get started.
                    </div>
                ) : (
                    workflows.map((wf) => (
                        <div key={wf.id} className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-primary transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-foreground">{wf.name}</h3>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                                    Trigger: {wf.trigger}
                                </p>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
                                    <Settings2 className="w-3 h-3 mr-2" /> Configure
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

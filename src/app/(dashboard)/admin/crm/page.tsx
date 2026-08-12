"use client";

import React, { useEffect, useState } from "react";
import { Users, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CRMPage() {
    const [prospects, setProspects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProspects = async () => {
            try {
                const res = await fetch("/api/admin/crm");
                const data = await res.json();
                if (data.success) setProspects(data.prospects || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProspects();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
                    <Users className="w-8 h-8 text-primary" />
                    CRM Expansion (Prospects)
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage prospects, meetings, and call logs.
                </p>
            </div>

            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-muted-foreground">
                    <thead className="bg-muted/30 text-foreground font-heading text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Stage</th>
                            <th className="px-6 py-4 text-right">Score</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center">Loading prospects...</td>
                            </tr>
                        ) : prospects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">No prospects found in pipeline.</td>
                            </tr>
                        ) : (
                            prospects.map((p) => (
                                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-foreground">{p.name}<br/><span className="font-normal text-xs text-muted-foreground">{p.email}</span></td>
                                    <td className="px-6 py-4">{p.company || "-"}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">{p.stage}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold">{p.score}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:text-primary"><Phone className="w-4 h-4"/></Button>
                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:text-primary"><Calendar className="w-4 h-4"/></Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

"use client";

import * as React from "react";
import { Loader2, Plus, RefreshCw, Send, Save, Trash2, Edit2, TrendingUp, DollarSign, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";

interface ClientManagementPanelProps {
  client: any;
}

export function ClientManagementPanel({ client }: ClientManagementPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("financials");
  const [loading, setLoading] = React.useState(true);
  const [financials, setFinancials] = React.useState<any>(null);
  const [updates, setUpdates] = React.useState<any[]>([]);

  // Financial forms
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [paymentDesc, setPaymentDesc] = React.useState("");

  const [isUsageOpen, setIsUsageOpen] = React.useState(false);
  const [usageAmount, setUsageAmount] = React.useState("");
  const [usageDesc, setUsageDesc] = React.useState("");
  const [usageCat, setUsageCat] = React.useState("General");

  const [contractAmount, setContractAmount] = React.useState("");
  const [isUpdatingContract, setIsUpdatingContract] = React.useState(false);

  // Updates form
  const [newUpdateTitle, setNewUpdateTitle] = React.useState("");
  const [newUpdateMessage, setNewUpdateMessage] = React.useState("");
  const [postingUpdate, setPostingUpdate] = React.useState(false);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const [finRes, updRes] = await Promise.all([
        fetch(`/api/admin/clients/${client.id}/financials`),
        fetch(`/api/admin/clients/${client.id}/updates`),
      ]);
      const finData = await finRes.json();
      const updData = await updRes.json();
      setFinancials(finData);
      setContractAmount(finData.contractAmount?.toString() || "0");
      setUpdates(updData.updates || []);
    } catch (error) {
      toast({
        title: "Error fetching client details",
        description: "Failed to load financial and updates data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClientData();
  }, [client.id]);

  const handleUpdateContract = async () => {
    setIsUpdatingContract(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/financials`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAmount: parseFloat(contractAmount) }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast({ title: "Contract updated", type: "success" });
      fetchClientData();
    } catch {
      toast({ title: "Update failed", type: "error" });
    } finally {
      setIsUpdatingContract(false);
    }
  };

  const handleAddFinancial = async (type: "payment" | "usage", e: React.FormEvent) => {
    e.preventDefault();
    const amount = type === "payment" ? paymentAmount : usageAmount;
    const desc = type === "payment" ? paymentDesc : usageDesc;

    try {
      const res = await fetch(`/api/admin/clients/${client.id}/financials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount,
          description: desc,
          category: type === "usage" ? usageCat : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Record added successfully", type: "success" });
      setIsPaymentOpen(false);
      setIsUsageOpen(false);
      setPaymentAmount("");
      setPaymentDesc("");
      setUsageAmount("");
      setUsageDesc("");
      fetchClientData();
    } catch {
      toast({ title: "Failed to add record", type: "error" });
    }
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingUpdate(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newUpdateTitle, message: newUpdateMessage }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Update posted", type: "success" });
      setNewUpdateTitle("");
      setNewUpdateMessage("");
      fetchClientData();
    } catch {
      toast({ title: "Failed to post update", type: "error" });
    } finally {
      setPostingUpdate(false);
    }
  };

  if (loading || !financials) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "financials", label: "Financials", icon: <DollarSign className="size-4" /> },
    { id: "updates", label: "Client Updates", icon: <TrendingUp className="size-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header info card */}
      <div className="flex items-center gap-4 p-4 bg-muted/40 border border-border/40 rounded-xl select-none">
        <Avatar fallback={client.name.split(" ").map((w: any) => w[0]).join("")} size="lg" />
        <div>
          <h4 className="text-base font-bold text-foreground font-heading">{client.name}</h4>
          <p className="text-xs text-muted-foreground">{client.company}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <StatusChip status={client.status}>
              {client.status.toUpperCase()}
            </StatusChip>
            <span className="text-[10px] text-muted-foreground/80 font-bold">Client ID: {client.id}</span>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="capsule" />

      {activeTab === "financials" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border/50 bg-card rounded-xl">
              <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Total Contract</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">₹</span>
                <input
                  type="number"
                  value={contractAmount}
                  onChange={(e) => setContractAmount(e.target.value)}
                  className="w-full text-lg font-bold bg-transparent border-b border-border outline-none focus:border-primary px-1"
                />
                <Button size="icon-xs" variant="ghost" onClick={handleUpdateContract} disabled={isUpdatingContract}>
                  {isUpdatingContract ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                </Button>
              </div>
            </div>
            <div className="p-4 border border-border/50 bg-card rounded-xl">
              <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Remaining Balance</p>
              <p className="text-xl font-bold text-foreground">₹{financials.remainingBalance.toLocaleString()}</p>
            </div>
            <div className="p-4 border border-border/50 bg-card rounded-xl">
              <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Total Paid</p>
              <p className="text-xl font-bold text-emerald-500">₹{financials.totalPaid.toLocaleString()}</p>
            </div>
            <div className="p-4 border border-border/50 bg-card rounded-xl">
              <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Total Used</p>
              <p className="text-xl font-bold text-destructive">₹{financials.totalUsed.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="premium" onClick={() => setIsPaymentOpen(true)} className="text-xs">
              <Plus className="size-3.5 mr-2" /> Log Payment
            </Button>
            <Button variant="outline" onClick={() => setIsUsageOpen(true)} className="text-xs">
              <Plus className="size-3.5 mr-2" /> Log Usage
            </Button>
          </div>

          {/* Dialogs for adding financials */}
          <Dialog isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} title="Log Client Payment" footer={null}>
            <form onSubmit={(e) => handleAddFinancial("payment", e)} className="space-y-4 pt-2">
              <input type="number" required placeholder="Amount (INR)" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full text-xs p-2 border rounded" />
              <input type="text" required placeholder="Description (e.g., Initial Deposit)" value={paymentDesc} onChange={e => setPaymentDesc(e.target.value)} className="w-full text-xs p-2 border rounded" />
              <Button type="submit" variant="premium" className="w-full">Save Payment</Button>
            </form>
          </Dialog>

          <Dialog isOpen={isUsageOpen} onClose={() => setIsUsageOpen(false)} title="Log Usage / Expense" footer={null}>
            <form onSubmit={(e) => handleAddFinancial("usage", e)} className="space-y-4 pt-2">
              <input type="number" required placeholder="Amount (INR)" value={usageAmount} onChange={e => setUsageAmount(e.target.value)} className="w-full text-xs p-2 border rounded" />
              <input type="text" required placeholder="Description (e.g., Ad Spend)" value={usageDesc} onChange={e => setUsageDesc(e.target.value)} className="w-full text-xs p-2 border rounded" />
              <Button type="submit" variant="premium" className="w-full">Save Usage</Button>
            </form>
          </Dialog>
        </div>
      )}

      {activeTab === "updates" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={handlePostUpdate} className="space-y-3 bg-muted/20 p-4 border rounded-xl">
            <h4 className="text-xs font-bold">Post a New Update</h4>
            <input type="text" required placeholder="Update Title" value={newUpdateTitle} onChange={e => setNewUpdateTitle(e.target.value)} className="w-full text-xs p-2 border rounded bg-background" />
            <textarea required placeholder="Message details..." value={newUpdateMessage} onChange={e => setNewUpdateMessage(e.target.value)} className="w-full text-xs p-2 border rounded bg-background h-24" />
            <Button type="submit" variant="default" size="sm" disabled={postingUpdate}>
              {postingUpdate ? <Loader2 className="size-3.5 animate-spin mr-2" /> : <Send className="size-3.5 mr-2" />}
              Publish Update
            </Button>
          </form>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {updates.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No updates posted yet.</p>
            ) : (
              updates.map((upd) => (
                <div key={upd.id} className="p-3 border rounded-xl bg-card">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-foreground">{upd.title}</p>
                    <span className="text-[10px] text-muted-foreground">{new Date(upd.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{upd.message}</p>
                  <p className="text-[10px] font-semibold text-primary mt-2">Posted by {upd.author}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { Loader2, Plus, RefreshCw, Send, Save, Trash2, Edit2, TrendingUp, DollarSign, Briefcase, FileText, Download, CheckCircle, XCircle } from "lucide-react";
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

  // Invoices form
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);
  const [invoiceForm, setInvoiceForm] = React.useState({
    invoiceNumber: "",
    amount: "",
    subtotal: "",
    tax: "",
    discount: "",
    service: "",
    description: "",
    notes: "",
    dueDate: "",
    paymentMethod: "Bank Transfer",
    transactionId: "",
    paymentDate: new Date().toISOString().split('T')[0],
    status: "PAID"
  });

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const [finRes, updRes, invRes] = await Promise.all([
        fetch(`/api/admin/clients/${client.id}/financials`),
        fetch(`/api/admin/clients/${client.id}/updates`),
        fetch(`/api/admin/clients/${client.id}/invoices`),
      ]);
      const finData = await finRes.json();
      const updData = await updRes.json();
      const invData = await invRes.json();
      setFinancials(finData);
      setContractAmount(finData.contractAmount?.toString() || "0");
      setUpdates(updData.updates || []);
      setInvoices(invData.invoices || []);
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

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          invoiceNumber: invoiceForm.invoiceNumber || undefined,
          amount: parseFloat(invoiceForm.amount) || 0,
          subtotal: parseFloat(invoiceForm.subtotal) || undefined,
          tax: parseFloat(invoiceForm.tax) || undefined,
          discount: parseFloat(invoiceForm.discount) || undefined,
          service: invoiceForm.service,
          description: invoiceForm.description,
          notes: invoiceForm.notes,
          dueDate: invoiceForm.dueDate || undefined,
          paymentMethod: invoiceForm.paymentMethod,
          transactionId: invoiceForm.transactionId,
          paymentDate: invoiceForm.paymentDate || undefined,
          status: invoiceForm.status,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to create payment/invoice");
      }
      toast({ title: "Payment and Invoice created successfully", type: "success" });
      setIsInvoiceOpen(false);
      setInvoiceForm({ invoiceNumber: "", amount: "", subtotal: "", tax: "", discount: "", service: "", description: "", notes: "", dueDate: "", paymentMethod: "Bank Transfer", transactionId: "", paymentDate: new Date().toISOString().split('T')[0], status: "PAID" });
      fetchClientData();
    } catch (error: any) {
      toast({ title: error.message || "Failed to create payment/invoice", type: "error" });
    }
  };

  const handleDownloadPdf = (invoiceId: string) => {
    window.open(`/api/admin/invoices/${invoiceId}/pdf`, '_blank');
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Status updated", type: "success" });
      fetchClientData();
    } catch {
      toast({ title: "Failed to update status", type: "error" });
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
    { id: "invoices", label: "Payments & Invoices", icon: <FileText className="size-4" /> },
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

      {activeTab === "invoices" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-muted/20 p-4 border rounded-xl">
            <div>
              <h4 className="text-sm font-bold">Payments & Invoices</h4>
              <p className="text-xs text-muted-foreground">Manage and track billing and payments for this client.</p>
            </div>
            <Button variant="premium" onClick={() => setIsInvoiceOpen(true)} size="sm">
              <Plus className="size-4 mr-2" /> Add Payment
            </Button>
          </div>

          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold text-xs">Invoice No.</TableHead>
                  <TableHead className="font-bold text-xs">Payment Date</TableHead>
                  <TableHead className="font-bold text-xs">Service / Desc</TableHead>
                  <TableHead className="font-bold text-xs">Amount</TableHead>
                  <TableHead className="font-bold text-xs">Method</TableHead>
                  <TableHead className="font-bold text-xs">Trans. ID</TableHead>
                  <TableHead className="font-bold text-xs">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                      No invoices available for this client.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium text-xs">
                        {inv.invoiceNumber || inv.id.split('-')[0].toUpperCase()}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">
                        {new Date(inv.payments?.[0]?.createdAt || inv.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-bold">{inv.service || "General"}</p>
                        {inv.description && <p className="text-[10px] text-muted-foreground line-clamp-1">{inv.description}</p>}
                      </TableCell>
                      <TableCell className="text-xs font-bold">
                        ₹{inv.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">
                        {inv.payments?.[0]?.method || "-"}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">
                        {inv.payments?.[0]?.transactionId || "-"}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={inv.status.toLowerCase()}>
                          {inv.status}
                        </StatusChip>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {inv.status !== "PAID" && (
                            <Button size="icon-xs" variant="outline" title="Mark as Paid" onClick={() => handleUpdateInvoiceStatus(inv.id, "PAID")}>
                              <CheckCircle className="size-3.5 text-emerald-500" />
                            </Button>
                          )}
                          <Button size="icon-xs" variant="outline" title="Download PDF" onClick={() => handleDownloadPdf(inv.id)}>
                            <Download className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} title="Add Payment & Generate Invoice" footer={null}>
            <form onSubmit={handleCreateInvoice} className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Invoice Number (Auto if blank)</label>
                  <input type="text" placeholder="BSM-INV-XXXX" value={invoiceForm.invoiceNumber} onChange={e => setInvoiceForm({...invoiceForm, invoiceNumber: e.target.value})} className="w-full text-xs p-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Due Date</label>
                  <input type="date" value={invoiceForm.dueDate} onChange={e => setInvoiceForm({...invoiceForm, dueDate: e.target.value})} className="w-full text-xs p-2 border rounded mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Service (e.g., SEO)" value={invoiceForm.service} onChange={e => setInvoiceForm({...invoiceForm, service: e.target.value})} className="w-full text-xs p-2 border rounded" />
                <input type="text" placeholder="Description" value={invoiceForm.description} onChange={e => setInvoiceForm({...invoiceForm, description: e.target.value})} className="w-full text-xs p-2 border rounded" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Subtotal</label>
                  <input type="number" placeholder="0" value={invoiceForm.subtotal} onChange={e => setInvoiceForm({...invoiceForm, subtotal: e.target.value})} className="w-full text-xs p-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Tax</label>
                  <input type="number" placeholder="0" value={invoiceForm.tax} onChange={e => setInvoiceForm({...invoiceForm, tax: e.target.value})} className="w-full text-xs p-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Discount</label>
                  <input type="number" placeholder="0" value={invoiceForm.discount} onChange={e => setInvoiceForm({...invoiceForm, discount: e.target.value})} className="w-full text-xs p-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Total *</label>
                  <input type="number" required placeholder="0" value={invoiceForm.amount} onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})} className="w-full text-xs p-2 border rounded mt-1 border-primary/50" />
                </div>
              </div>

              <div className="p-3 bg-muted/30 border border-border/50 rounded-lg space-y-3">
                <p className="text-[10px] font-bold text-primary uppercase">Payment Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Method</label>
                    <select value={invoiceForm.paymentMethod} onChange={e => setInvoiceForm({...invoiceForm, paymentMethod: e.target.value})} className="w-full text-xs p-2 border rounded mt-1 bg-background">
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Transaction ID</label>
                    <input type="text" placeholder="TXN123456" value={invoiceForm.transactionId} onChange={e => setInvoiceForm({...invoiceForm, transactionId: e.target.value})} className="w-full text-xs p-2 border rounded mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Payment Date</label>
                    <input type="date" value={invoiceForm.paymentDate} onChange={e => setInvoiceForm({...invoiceForm, paymentDate: e.target.value})} className="w-full text-xs p-2 border rounded mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Invoice Status</label>
                    <select value={invoiceForm.status} onChange={e => setInvoiceForm({...invoiceForm, status: e.target.value})} className="w-full text-xs p-2 border rounded mt-1 bg-background">
                      <option value="PAID">Paid</option>
                      <option value="DRAFT">Draft</option>
                      <option value="SENT">Sent</option>
                      <option value="OVERDUE">Overdue</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <textarea placeholder="Notes (optional)" value={invoiceForm.notes} onChange={e => setInvoiceForm({...invoiceForm, notes: e.target.value})} className="w-full text-xs p-2 border rounded min-h-[60px]" />
              
              <Button type="submit" variant="premium" className="w-full">Save Payment & Generate Invoice</Button>
            </form>
          </Dialog>
        </div>
      )}
    </div>
  );
}

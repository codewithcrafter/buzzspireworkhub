"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusChip } from "@/components/ui/status-chip";

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/client/invoices");
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to load invoices");
        }
        
        setInvoices(data.invoices || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Invoices" 
        description="View your billing history and invoices." 
      />

      {loading ? (
        <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
          <CardContent className="py-10 text-center text-muted-foreground text-sm font-medium">
            Loading invoices...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-red-50/20">
          <CardContent className="py-10 text-center text-red-500 text-sm font-semibold">
            {error}
          </CardContent>
        </Card>
      ) : invoices.length === 0 ? (
        <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
          <CardContent className="py-10 text-center text-muted-foreground text-sm font-semibold">
            No invoices available yet.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-bold text-xs">Invoice No.</TableHead>
                  <TableHead className="font-bold text-xs">Date</TableHead>
                  <TableHead className="font-bold text-xs">Service</TableHead>
                  <TableHead className="font-bold text-xs">Amount</TableHead>
                  <TableHead className="font-bold text-xs">Method</TableHead>
                  <TableHead className="font-bold text-xs">Trans. ID</TableHead>
                  <TableHead className="font-bold text-xs">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-xs">
                      {invoice.invoiceNumber || invoice.id.split('-')[0].toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(invoice.payments?.[0]?.createdAt || invoice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {invoice.service || "-"}
                    </TableCell>
                    <TableCell className="text-sm font-bold">
                      ₹{invoice.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {invoice.payments?.[0]?.method || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {invoice.payments?.[0]?.transactionId || "-"}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={invoice.status.toLowerCase()}>
                        {invoice.status}
                      </StatusChip>
                    </TableCell>
                    <TableCell className="text-right">
                      <button 
                        onClick={() => window.open(`/api/client/invoices/${invoice.id}/pdf`, '_blank')}
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        title="Download PDF"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

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
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            Loading invoices...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive/50">
          <CardContent className="py-10 text-center text-destructive text-sm font-semibold">
            {error}
          </CardContent>
        </Card>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm font-semibold">
            No invoices available yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold">Invoice ID</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Due Date</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-xs">
                      {invoice.id.split('-')[0].toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm font-bold">
                      ₹{invoice.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={invoice.status.toLowerCase()}>
                        {invoice.status}
                      </StatusChip>
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

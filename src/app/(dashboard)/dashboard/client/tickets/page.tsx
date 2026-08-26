"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusChip } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClientTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/client/tickets");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to load tickets");
      }
      
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsCreating(true);
    
    try {
      const res = await fetch("/api/client/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, description }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create ticket");
      }
      
      setSubject("");
      setDescription("");
      await fetchTickets(); // Refresh list
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Support Tickets" 
        description="View and create support requests." 
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Your Tickets</h2>
          
          {loading ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground text-sm">
                Loading tickets...
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-destructive/50">
              <CardContent className="py-10 text-center text-destructive text-sm font-semibold">
                {error}
              </CardContent>
            </Card>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground text-sm font-semibold">
                No support tickets yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden border border-border">
                  <div className="p-4 bg-muted/20 border-b border-border/50 flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">{ticket.subject}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {ticket.id.split('-')[0].toUpperCase()} • Created: {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusChip status={ticket.status.toLowerCase()}>
                      {ticket.status}
                    </StatusChip>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                    
                    {ticket.replies && ticket.replies.length > 0 && (
                      <div className="mt-6 space-y-4 border-t border-border/50 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Replies</h4>
                        {ticket.replies.map((reply: any) => (
                          <div key={reply.id} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                            <p className="text-sm text-foreground">{reply.text}</p>
                            <p className="text-[10px] text-muted-foreground mt-2">
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Open Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                {submitError && (
                  <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                    {submitError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Subject</label>
                  <Input 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Details</label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide as much detail as possible..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isCreating || !subject || !description}
                >
                  {isCreating ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

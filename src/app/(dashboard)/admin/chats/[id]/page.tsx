
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminChatIdPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [session, setSession] = useState<any>(null);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchSession = async () => {
        if (!id) return;
        const res = await fetch(`/api/admin/chats/${id}`);
        const data = await res.json();
        if (data.success) {
            setSession(data.session);
        }
    };

    useEffect(() => {
        fetchSession();
        const interval = setInterval(fetchSession, 3000);
        return () => {
            clearInterval(interval);
        };
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [session?.messages]);

    const handleAcceptChat = async () => {
        await fetch(`/api/admin/chats/${id}/accept`, { method: "POST" });
        fetchSession();
    };

    const handleCloseChat = async () => {
        await fetch(`/api/admin/chats/${id}/close`, { method: "POST" });
        fetchSession();
        router.push("/admin/chats");
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Optimistic update
        setSession((prev: any) => ({
            ...prev,
            messages: [...prev.messages, { id: Date.now().toString(), senderType: "AGENT", message }]
        }));
        const val = message;
        setMessage("");

        await fetch(`/api/admin/chats/${id}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: val })
        });
        fetchSession();
    };

    if (!session) return <div className="p-8 text-center text-muted-foreground">Loading session...</div>;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">


            <div className="w-full md:w-1/3 flex flex-col gap-6 h-fit shrink-0">
                <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                    <Link href="/admin/chats" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Chats
                    </Link>
                    <h2 className="text-xl font-bold mb-4 tracking-tight">Visitor Details</h2>
                    <div className="space-y-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/50">
                        <div>
                            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Name</span>
                            <p className="font-medium text-foreground">{session.visitorName}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Email</span>
                            <p className="font-medium text-foreground">{session.visitorEmail}</p>
                        </div>
                        {session.visitorPhone && (
                            <div>
                                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Phone</span>
                                <p className="font-medium text-foreground">{session.visitorPhone}</p>
                            </div>
                        )}
                        <div>
                            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Service</span>
                            <p className="font-medium text-foreground">{session.service || "N/A"}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Status</span>
                            <p className="font-medium text-foreground flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${session.status === 'WAITING' ? 'bg-amber-500' : session.status === 'ACTIVE' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                                {session.status}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        {session.status === "WAITING" && (
                            <button onClick={handleAcceptChat} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 shadow-sm transition-opacity">
                                Accept Chat
                            </button>
                        )}
                        {session.status === "ACTIVE" && (
                            <button onClick={handleCloseChat} className="w-full py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-semibold hover:bg-destructive/20 transition-colors">
                                Close Chat
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-card border border-border shadow-sm rounded-2xl flex flex-col overflow-hidden min-h-0">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        Live Chat: {session.visitorName}
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/10">
                    {session.messages.map((msg: any) => (
                        <div key={msg.id} className={`flex ${msg.senderType === 'AGENT' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${msg.senderType === 'AGENT' ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' :
                                    msg.senderType === 'SYSTEM' ? 'bg-muted text-muted-foreground text-xs italic mx-auto text-center border border-border/50' :
                                        'bg-background border border-border shadow-sm rounded-tl-sm text-foreground'
                                }`}>
                                {msg.message}
                                {msg.senderType !== 'SYSTEM' && (
                                    <div className={`text-[10px] mt-1 opacity-70 ${msg.senderType === 'AGENT' ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {session.status === "ACTIVE" && (
                    <div className="p-4 border-t border-border bg-background">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full bg-muted/50 border border-border rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="absolute right-2 p-2.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}
                {session.status === "WAITING" && (
                    <div className="p-4 border-t border-border bg-muted/30 text-center text-sm text-muted-foreground">
                        Accept the chat to start messaging.
                    </div>
                )}
                {session.status === "CLOSED" && (
                    <div className="p-4 border-t border-border bg-muted/30 text-center text-sm text-muted-foreground">
                        This chat session is closed.
                    </div>
                )}
            </div>
        </div>
    );
}

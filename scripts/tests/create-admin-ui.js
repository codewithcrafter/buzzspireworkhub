const fs = require('fs');
const path = require('path');

const mkdirp = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const chatsPage = `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Clock, CheckCircle2 } from "lucide-react";

export default function AdminChatsPage() {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            const res = await fetch("/api/admin/chats");
            const data = await res.json();
            if (data.success) {
                setChats(data.chats);
            }
        };
        fetchChats();
        const interval = setInterval(fetchChats, 5000);
        return () => clearInterval(interval);
    }, []);

    const waiting = chats.filter((c: any) => c.status === "WAITING");
    const active = chats.filter((c: any) => c.status === "ACTIVE");
    const closed = chats.filter((c: any) => c.status === "CLOSED");

    const renderChatCard = (chat: any) => (
        <div key={chat.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div>
                <h4 className="font-semibold">{chat.visitorName} {chat.visitorCompany ? \`(\${chat.visitorCompany})\` : ''}</h4>
                <p className="text-sm text-muted-foreground">{chat.service || "General Inquiry"}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{new Date(chat.createdAt).toLocaleString()}</p>
            </div>
            <Link href={\`/admin/chats/\${chat.id}\`} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 font-medium">
                Open Chat
            </Link>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Live Chats</h1>
                <p className="text-muted-foreground mt-1">Manage and respond to visitor chats in real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-amber-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Waiting ({waiting.length})
                    </h3>
                    <div className="space-y-3">
                        {waiting.map(renderChatCard)}
                        {waiting.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-xl">No waiting chats</p>}
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-green-500 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Active ({active.length})
                    </h3>
                    <div className="space-y-3">
                        {active.map(renderChatCard)}
                        {active.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-xl">No active chats</p>}
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Closed ({closed.length})
                    </h3>
                    <div className="space-y-3">
                        {closed.map(renderChatCard)}
                        {closed.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-xl">No closed chats</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
`;

const chatIdPage = `"use client";
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
        const res = await fetch(\`/api/admin/chats/\${id}\`);
        const data = await res.json();
        if (data.success) {
            setSession(data.session);
        }
    };

    useEffect(() => {
        fetchSession();
        const interval = setInterval(fetchSession, 3000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [session?.messages]);

    const handleAccept = async () => {
        await fetch(\`/api/admin/chats/\${id}/accept\`, { method: "POST" });
        fetchSession();
    };

    const handleClose = async () => {
        await fetch(\`/api/admin/chats/\${id}/close\`, { method: "POST" });
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

        await fetch(\`/api/admin/chats/\${id}/messages\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: val })
        });
        fetchSession();
    };

    if (!session) return <div className="p-8 text-center text-muted-foreground">Loading session...</div>;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 bg-card border border-border shadow-sm rounded-2xl p-6 h-fit shrink-0">
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
                            <span className={\`w-2 h-2 rounded-full \${session.status === 'WAITING' ? 'bg-amber-500' : session.status === 'ACTIVE' ? 'bg-green-500' : 'bg-muted-foreground'}\`}></span>
                            {session.status}
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 space-y-3">
                    {session.status === "WAITING" && (
                        <button onClick={handleAccept} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 shadow-sm transition-opacity">
                            Accept Chat
                        </button>
                    )}
                    {session.status === "ACTIVE" && (
                        <button onClick={handleClose} className="w-full py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-semibold hover:bg-destructive/20 transition-colors">
                            Close Chat
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-card border border-border shadow-sm rounded-2xl flex flex-col overflow-hidden min-h-0">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Live Chat: {session.visitorName}</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/10">
                    {session.messages.map((msg: any) => (
                        <div key={msg.id} className={\`flex \${msg.senderType === 'AGENT' ? 'justify-end' : 'justify-start'}\`}>
                            <div className={\`max-w-[75%] rounded-2xl px-4 py-3 text-sm \${
                                msg.senderType === 'AGENT' ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' :
                                msg.senderType === 'SYSTEM' ? 'bg-muted text-muted-foreground text-xs italic mx-auto text-center border border-border/50' :
                                'bg-background border border-border shadow-sm rounded-tl-sm text-foreground'
                            }\`}>
                                {msg.message}
                                {msg.senderType !== 'SYSTEM' && (
                                    <div className={\`text-[10px] mt-1 opacity-70 \${msg.senderType === 'AGENT' ? 'text-right' : 'text-left'}\`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
`;

const chatsDir = path.join(__dirname, 'src/app/(dashboard)/admin/chats');
mkdirp(chatsDir);
fs.writeFileSync(path.join(chatsDir, 'page.tsx'), chatsPage);

const chatIdDir = path.join(chatsDir, '[id]');
mkdirp(chatIdDir);
fs.writeFileSync(path.join(chatIdDir, 'page.tsx'), chatIdPage);

console.log("Admin UI created");

"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Clock, CheckCircle2, Phone } from "lucide-react";

export default function AdminChatsPage() {
    const [chats, setChats] = useState([]);
    const [actionId, setActionId] = useState<string | null>(null);

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

    const handleAcceptCall = async (chatId: string) => {
        if (actionId) return;
        setActionId(chatId);
        if (typeof window !== "undefined") window.dispatchEvent(new Event("call_accepted"));
        try {
            const res = await fetch(`/api/admin/chats/${chatId}/voice/accept`, { method: "POST" });
            if (res.ok) {
                setChats(prev => prev.map((c: any) => {
                    if (c.id === chatId && c.voiceCalls) {
                        return { ...c, voiceCalls: [{ ...c.voiceCalls[0], status: "ACTIVE" }] };
                    }
                    return c;
                }) as any);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionId(null);
        }
    };

    const handleRejectCall = async (chatId: string) => {
        if (actionId) return;
        setActionId(chatId);
        if (typeof window !== "undefined") window.dispatchEvent(new Event("call_rejected"));
        try {
            const res = await fetch(`/api/admin/chats/${chatId}/voice/reject`, { method: "POST" });
            if (res.ok) {
                setChats(prev => prev.map((c: any) => {
                    if (c.id === chatId && c.voiceCalls) {
                        return { ...c, voiceCalls: [{ ...c.voiceCalls[0], status: "REJECTED" }] };
                    }
                    return c;
                }) as any);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionId(null);
        }
    };

    const renderChatCard = (chat: any) => {
        const activeOrRingingCall = chat.voiceCalls?.find((call: any) => call.status === "RINGING" || call.status === "ACTIVE");
        
        return (
        <div key={chat.id} className="bg-card border border-border p-4 rounded-xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold flex items-center gap-2">
                        {chat.visitorName} {chat.visitorCompany ? `(${chat.visitorCompany})` : ''}
                        {activeOrRingingCall && activeOrRingingCall.status === "RINGING" && (
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                                <Phone className="w-3 h-3" /> Incoming
                            </span>
                        )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{chat.service || "General Inquiry"}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{new Date(chat.createdAt).toLocaleString()}</p>
                </div>
                <Link href={`/admin/chats/${chat.id}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 font-medium whitespace-nowrap">
                    Open Chat
                </Link>
            </div>
            
            {activeOrRingingCall && activeOrRingingCall.status === "RINGING" && (
                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-red-500 text-sm font-semibold animate-pulse mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        🔔 Incoming Voice Call
                    </div>
                    <div className="flex gap-2">
                        <button aria-label="Accept Call" disabled={actionId === chat.id} onClick={() => handleAcceptCall(chat.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50">Accept</button>
                        <button aria-label="Reject Call" disabled={actionId === chat.id} onClick={() => handleRejectCall(chat.id)} className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50">Reject</button>
                    </div>
                </div>
            )}
            {activeOrRingingCall && activeOrRingingCall.status === "ACTIVE" && (
                <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <Phone className="w-4 h-4" /> Active Voice Call
                </div>
            )}
        </div>
        );
    };

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

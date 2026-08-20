
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, CheckCircle, Phone, Mic, MicOff, PhoneOff } from "lucide-react";
import Link from "next/link";

export default function AdminChatIdPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [session, setSession] = useState<any>(null);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [activeCallId, setActiveCallId] = useState<string | null>(null);
    const [rtcConnectionState, setRtcConnectionState] = useState<string>("new");
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const candidateQueue = useRef<RTCIceCandidateInit[]>([]);

    const fetchSession = async () => {
        if (!id) return;
        const res = await fetch(`/api/admin/chats/${id}`);
        const data = await res.json();
        if (data.success) {
            setSession(data.session);
            
            if (data.session.voiceCalls && data.session.voiceCalls.length > 0) {
                const call = data.session.voiceCalls[0];
                if (call.status === "ACTIVE") {
                    setActiveCallId(call.id);
                } else {
                    if (activeCallId) handleEndCallLocally();
                }
            }
        }
    };

    useEffect(() => {
        fetchSession();
        const interval = setInterval(fetchSession, 3000);
        return () => {
            clearInterval(interval);
            handleEndCallLocally();
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

    // --- Voice Call WebRTC Logic ---

    const handleAcceptCall = async (callId: string) => {
        if (typeof window !== "undefined") window.dispatchEvent(new Event("call_accepted"));
        try {
            await fetch(`/api/admin/chats/${id}/voice/accept`, { method: "POST" });
            fetchSession();
        } catch (error) {
            console.error("Accept call error", error);
        }
    };

    const handleRejectCall = async (callId: string) => {
        if (typeof window !== "undefined") window.dispatchEvent(new Event("call_rejected"));
        try {
            await fetch(`/api/admin/chats/${id}/voice/reject`, { method: "POST" });
            fetchSession();
        } catch (error) {
            console.error("Reject call error", error);
        }
    };

    const handleEndCallLocally = () => {
        if (typeof window !== "undefined") window.dispatchEvent(new Event("call_ended"));
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
            localStreamRef.current = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        candidateQueue.current = [];
        setActiveCallId(null);
        setRtcConnectionState("closed");
    };

    const endVoiceCall = async () => {
        if (activeCallId) {
            fetch(`/api/chat/voice/${activeCallId}/end`, { method: "POST" }).catch(console.error);
        }
        handleEndCallLocally();
        fetchSession();
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const setupWebRTCAdmin = async (callId: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });
            pcRef.current = pc;

            pc.oniceconnectionstatechange = () => {
                setRtcConnectionState(pc.iceConnectionState);
                if (pc.iceConnectionState === "connected") {
                    setCallDuration(0);
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => {
                        setCallDuration(prev => prev + 1);
                    }, 1000);
                } else if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed" || pc.iceConnectionState === "closed") {
                    handleEndCallLocally();
                }
            };

            pc.ontrack = (event) => {
                if (remoteAudioRef.current && event.streams && event.streams[0]) {
                    remoteAudioRef.current.srcObject = event.streams[0];
                    remoteAudioRef.current.play().catch(console.error);
                }
            };

            pc.onicecandidate = async (event) => {
                if (event.candidate) {
                    await fetch(`/api/chat/voice/${callId}/signal`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "candidate", payload: event.candidate })
                    }).catch(console.error);
                }
            };

            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            // Wait to receive the offer from the polling interval.
            
        } catch (error) {
            console.error("WebRTC Setup Error:", error);
            handleEndCallLocally();
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeCallId) {
            if (!pcRef.current) {
                setupWebRTCAdmin(activeCallId);
            }
            let lastSignalDate = new Date(Date.now() - 3000).toISOString();
            
            const fetchSignals = async () => {
                if (!pcRef.current) return;
                try {
                    const res = await fetch(`/api/chat/voice/${activeCallId}/signal?since=${lastSignalDate}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.signals && data.signals.length > 0) {
                            lastSignalDate = data.signals[data.signals.length - 1].createdAt;
                            
                            for (const signal of data.signals) {
                                if (signal.senderType === "VISITOR" && pcRef.current) {
                                    if (signal.type === "offer") {
                                        try {
                                            await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal.payload));
                                            const answer = await pcRef.current.createAnswer();
                                            await pcRef.current.setLocalDescription(answer);
                                            
                                            await fetch(`/api/chat/voice/${activeCallId}/signal`, {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ type: "answer", payload: answer })
                                            });
                                            
                                            while (candidateQueue.current.length > 0) {
                                                const candidate = candidateQueue.current.shift();
                                                if (candidate) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                                            }
                                        } catch (err) { console.error("Error setting remote description / answer", err); }
                                    } else if (signal.type === "candidate") {
                                        try {
                                            if (pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
                                                await pcRef.current.addIceCandidate(new RTCIceCandidate(signal.payload));
                                            } else {
                                                candidateQueue.current.push(signal.payload);
                                            }
                                        } catch (err) { console.error("Error adding candidate", err); }
                                    }
                                }
                            }
                        }
                        if (data.status && data.status !== "ACTIVE" && data.status !== "RINGING") {
                            handleEndCallLocally();
                        }
                    }
                } catch (e) {
                    console.error("Signal polling error:", e);
                }
            };
            interval = setInterval(fetchSignals, 1500);
        }
        return () => clearInterval(interval);
    }, [activeCallId]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!session) return <div className="p-8 text-center text-muted-foreground">Loading session...</div>;

    const ringingCall = session.voiceCalls?.find((c: any) => c.status === "RINGING");

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
            
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

                {/* Voice Call Integration */}
                {ringingCall && (
                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-500 font-semibold animate-pulse">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                🔴 Incoming Voice Call
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleAcceptCall(ringingCall.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">Accept Call</button>
                            <button onClick={() => handleRejectCall(ringingCall.id)} className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">Reject</button>
                        </div>
                    </div>
                )}

                {activeCallId && (
                    <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                        <Phone className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    {rtcConnectionState === "connected" && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                                        🟢 Voice Call Active
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {rtcConnectionState === "connected" ? `Connected • Duration: ${formatTime(callDuration)}` : 'Connecting...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={toggleMute}
                                className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm ${isMuted ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-background border border-border text-foreground hover:bg-muted'}`}
                            >
                                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>
                            <button 
                                onClick={endVoiceCall}
                                className="flex-1 py-2 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                <PhoneOff className="w-4 h-4" /> End Call
                            </button>
                        </div>
                    </div>
                )}
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
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                                msg.senderType === 'AGENT' ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' :
                                msg.senderType === 'SYSTEM' ? 'bg-muted text-muted-foreground text-xs italic mx-auto text-center border border-border/50' :
                                'bg-background border border-border shadow-sm rounded-tl-sm text-foreground'
                            }`}>
                                {msg.message}
                                {msg.senderType !== 'SYSTEM' && (
                                    <div className={`text-[10px] mt-1 opacity-70 ${msg.senderType === 'AGENT' ? 'text-right' : 'text-left'}`}>
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
